import { api } from "./forgejo-api";

export async function getUserOrganizationSlugs(username: string) {
    const slugs = new Set<string>();
    // The site admin token can read this user's private memberships as well.
    for (let page = 1; ; page++) {
        const { data: memberships } = await api.users.orgListUserOrgs(
            encodeURIComponent(username),
            { page, limit: 50 },
            { signal: AbortSignal.timeout(10_000) },
        );
        if (memberships.length === 0) return [...slugs];
        for (const organization of memberships) {
            const name = organization.name || organization.username;
            if (name) slugs.add(name.toLowerCase());
        }
    }
}
