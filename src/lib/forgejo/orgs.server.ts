import {
    getRequestHeaders,
    setResponseStatus,
} from "@tanstack/react-start/server";
import { auth } from "#/lib/auth";
import { getUserOrganizations } from "./memberships.server";

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
export async function getCurrentOrganizations() {
    const data = await getForgejoProfile();
    if (!data) return [];
    return getUserOrganizations(requireForgejoUsername(data));
}

/** Requires access to a specific organization, either by slug or ID */
export async function requireOrganizationAccess(organization: string | number) {
    const organizations = await getCurrentOrganizations();
    const membership = organizations.find((entry) =>
        typeof organization === "string"
            ? entry.slug === organization.toLowerCase()
            : entry.id === organization,
    );
    if (membership) return membership;

    setResponseStatus(403);
    throw new Error("Forbidden");
}
