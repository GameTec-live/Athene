import {
    getRequestHeaders,
    setResponseStatus,
} from "@tanstack/react-start/server";
import { auth } from "#/lib/auth";
import type { Organization } from "./api";
import { api } from "./forgejo-api";
import { getUserOrganizationSlugs } from "./memberships.server";

const CACHE_TTL = 60_000;
const CACHE_LIMIT = 256;

// Only organization metadata is cached, membership is checked per request
const organizations = new Map<
    string,
    { expiresAt: number; value: Promise<Organization & { id: number }> }
>();

/** Fetches the signed-in user's Forgejo profile. */
async function getForgejoProfile() {
    const headers = getRequestHeaders();
    const accounts = await auth.api.listUserAccounts({ headers });
    const account = accounts.find(
        (account) => account.providerId === "forgejo",
    );
    if (!account) return null;

    const { data } = await auth.api.accountInfo({
        headers,
        query: { accountId: account.id },
    });
    return data;
}

export async function getForgejoUsername() {
    const data = await getForgejoProfile();
    return requireForgejoUsername(data);
}

function requireForgejoUsername(data: unknown) {
    const username =
        data && typeof data === "object" && "preferred_username" in data
            ? data.preferred_username
            : undefined;
    if (typeof username !== "string" || !username.trim()) {
        throw new Error("The signed-in user has no Forgejo username");
    }
    return username;
}

/** Reads current memberships so newly created organizations appear immediately. */
export async function getOrganizationSlugs() {
    const data = await getForgejoProfile();
    if (!data) return [];
    return getUserOrganizationSlugs(requireForgejoUsername(data));
}

/** Fetches the details of a specific organization by its slug, cached */
export function getOrganization(slug: string) {
    const now = Date.now();
    const cached = organizations.get(slug);
    if (cached && cached.expiresAt > now) return cached.value;

    for (const [key, entry] of organizations) {
        if (entry.expiresAt <= now) organizations.delete(key);
    }
    if (organizations.size >= CACHE_LIMIT) {
        const oldest = organizations.keys().next().value;
        if (oldest !== undefined) organizations.delete(oldest);
    }

    const value = api.orgs
        .orgGet(encodeURIComponent(slug), {
            signal: AbortSignal.timeout(10_000),
        })
        .then(({ data: org }) => {
            if (
                !org ||
                !Number.isSafeInteger(org.id) ||
                !org.id ||
                org.id < 0 ||
                (org.name || org.username)?.toLowerCase() !== slug
            ) {
                throw new Error("Invalid Forgejo organization response");
            }
            return { ...org, id: org.id };
        });

    organizations.set(slug, { expiresAt: now + CACHE_TTL, value });
    void value.catch(() => {
        if (organizations.get(slug)?.value === value)
            organizations.delete(slug);
    });
    return value;
}

/** Requires access to a specific organization, either by slug or ID */
export async function requireOrganizationAccess(organization: string | number) {
    const slugs = await getOrganizationSlugs();
    if (typeof organization === "string" && slugs.includes(organization)) {
        return getOrganization(organization);
    }
    if (typeof organization === "number") {
        const memberships = await Promise.allSettled(
            slugs.map(getOrganization),
        );
        for (const membership of memberships) {
            if (
                membership.status === "fulfilled" &&
                membership.value.id === organization
            ) {
                return membership.value;
            }
        }
        const failed = memberships.find(
            (membership) => membership.status === "rejected",
        );
        if (failed) throw failed.reason;
    }

    setResponseStatus(403);
    throw new Error("Forbidden");
}
