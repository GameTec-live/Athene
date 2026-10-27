import { api } from "./forgejo-api";

/** Returns current memberships and their metadata in the same Forgejo request. */
export async function getUserOrganizations(username: string) {
    // The site admin token can read this user's private memberships as well.
    const { data } = await api.users.orgListUserOrgs(
        encodeURIComponent(username),
        { page: -1 }, // Forgejo disables pagination for this endpoint.
        { signal: AbortSignal.timeout(10_000) },
    );
    return data.map((organization) => {
        if (
            organization.id === undefined ||
            !Number.isSafeInteger(organization.id) ||
            organization.id <= 0 ||
            !organization.name?.trim()
        ) {
            throw new Error("Invalid Forgejo organization response");
        }
        return {
            ...organization,
            id: organization.id,
            slug: organization.name.toLowerCase(),
        };
    });
}
