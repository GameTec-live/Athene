import { createMiddleware } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { createRemoteJWKSet, errors, jwtVerify } from "jose";
import { db } from "#/db/index.ts";
import { assignmentMember } from "#/db/schema";
import { env } from "#/env";

let oidcConfigurationPromise:
    | Promise<{
          issuer: string;
          jwks: ReturnType<typeof createRemoteJWKSet>;
      }>
    | undefined;

async function getOidcConfiguration() {
    if (!oidcConfigurationPromise) {
        oidcConfigurationPromise = (async () => {
            const response = await fetch(env.FORGEJO_DISCOVERY_URL, {
                headers: { Accept: "application/json" },
            });
            if (!response.ok) {
                throw new Error(
                    `Forgejo OIDC discovery failed: HTTP ${response.status}`,
                );
            }

            const document: unknown = await response.json();
            if (
                typeof document !== "object" ||
                document === null ||
                !("issuer" in document) ||
                typeof document.issuer !== "string" ||
                !("jwks_uri" in document) ||
                typeof document.jwks_uri !== "string"
            ) {
                throw new Error("Forgejo returned invalid OIDC discovery data");
            }

            return {
                issuer: document.issuer,
                jwks: createRemoteJWKSet(new URL(document.jwks_uri)),
            };
        })();
    }

    const configurationPromise = oidcConfigurationPromise;
    try {
        return await configurationPromise;
    } catch (error) {
        if (oidcConfigurationPromise === configurationPromise) {
            oidcConfigurationPromise = undefined;
        }
        throw error;
    }
}

function unauthorized(invalidToken = false) {
    return Response.json(
        { error: "Unauthorized" },
        {
            status: 401,
            headers: {
                "WWW-Authenticate": invalidToken
                    ? 'Bearer error="invalid_token"'
                    : "Bearer",
            },
        },
    );
}

function forbidden() {
    return Response.json(
        { error: "Repository not authorized" },
        { status: 403 },
    );
}

export const forgejoActionsOidcMiddleware = createMiddleware().server(
    async ({ request, next }) => {
        const authorization = request.headers.get("authorization");
        const bearerToken = /^Bearer\s+(\S+)$/i.exec(authorization ?? "")?.[1];
        if (!bearerToken) {
            return unauthorized();
        }

        const { issuer, jwks } = await getOidcConfiguration();
        try {
            const { payload } = await jwtVerify(bearerToken, jwks, {
                issuer,
                audience: env.BETTER_AUTH_URL,
                requiredClaims: ["exp", "iat", "sub"],
            });

            const repositoryIdClaim = payload.repository_id;
            const repositoryId =
                typeof repositoryIdClaim === "number"
                    ? repositoryIdClaim
                    : typeof repositoryIdClaim === "string" &&
                        /^\d+$/.test(repositoryIdClaim)
                      ? Number(repositoryIdClaim)
                      : Number.NaN;

            if (!Number.isSafeInteger(repositoryId) || repositoryId <= 0) {
                return forbidden();
            }

            const [assignmentRepository] = await db
                .select({ repositoryId: assignmentMember.repositoryId })
                .from(assignmentMember)
                .where(eq(assignmentMember.repositoryId, repositoryId))
                .limit(1);

            if (!assignmentRepository) {
                return forbidden();
            }

            return next({
                context: {
                    forgejoOidc: payload,
                    forgejoRepositoryId: repositoryId,
                },
            });
        } catch (error) {
            if (
                error instanceof errors.JOSEError &&
                error.code !== "ERR_JWKS_TIMEOUT"
            ) {
                return unauthorized(true);
            }
            throw error;
        }
    },
);


