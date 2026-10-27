import { createMiddleware, createServerFn } from "@tanstack/react-start";
import {
    getRequestHeaders,
    setResponseStatus,
} from "@tanstack/react-start/server";
import { auth } from "#/lib/auth";

export const getSession = createServerFn({ method: "GET" }).handler(
    async () => {
        return auth.api.getSession({ headers: getRequestHeaders() });
    },
);

export const authMiddleware = createMiddleware({ type: "function" }).server(
    async ({ next }) => {
        const session = await auth.api.getSession({
            headers: getRequestHeaders(),
        });
        if (!session) {
            setResponseStatus(401);
            throw new Error("Unauthorized");
        }
        return next({ context: { user: session.user } });
    },
);

/** Dashboard operations require this in addition to any resource access checks. */
export const dashboardMiddleware = createMiddleware({ type: "function" })
    .middleware([authMiddleware])
    .server(async ({ next }) => {
        const { success } = await auth.api.userHasPermission({
            headers: getRequestHeaders(),
            body: { permissions: { siteAccess: ["dashboard"] } },
        });
        if (!success) {
            setResponseStatus(403);
            throw new Error("Dashboard permission required");
        }
        return next();
    });

/** Requires administrator access for instance-wide settings and operations. */
export const adminMiddleware = createMiddleware({ type: "function" })
    .middleware([dashboardMiddleware])
    .server(async ({ next }) => {
        const { success } = await auth.api.userHasPermission({
            headers: getRequestHeaders(),
            body: { permissions: { siteAccess: ["admin"] } },
        });
        if (!success) {
            setResponseStatus(403);
            throw new Error("Administrator access required");
        }
        return next();
    });
