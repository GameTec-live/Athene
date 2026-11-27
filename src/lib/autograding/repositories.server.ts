import { getRequestHeaders } from "@tanstack/react-start/server";
import { env } from "#/env";
import { auth } from "#/lib/auth";
import { forgejoApi, type Repository } from "../forgejo/api";

export async function collectPages<T>(
    request: (page: number) => Promise<{ data: T[] }>,
) {
    const items: T[] = [];
    for (let page = 1; ; page++) {
        const { data } = await request(page);
        if (!data.length) return items;
        items.push(...data);
    }
}

export async function getVisibleRepositories() {
    const headers = getRequestHeaders();
    const accounts = await auth.api.listUserAccounts({ headers });
    const account = accounts.find((entry) => entry.providerId === "forgejo");
    if (!account)
        throw new Error("Connect your Forgejo account to load repositories.");
    const { accessToken } = await auth.api.getAccessToken({
        headers,
        body: { accountId: account.id },
    });
    // The instance token could expose private repositories the user cannot read.
    const api = forgejoApi(env.FORGEJO_BASE_URL.replace(/\/+$/, ""), {
        token: accessToken,
    });
    const params = () => ({ signal: AbortSignal.timeout(15_000) });
    const [owned, organizations] = await Promise.all([
        collectPages((page) =>
            api.user.userCurrentListRepos({ page, limit: 50 }, params()),
        ),
        collectPages((page) =>
            api.user.orgListCurrentUserOrgs({ page, limit: 50 }, params()),
        ),
    ]);
    const repositories = new Map<number, Repository>();
    for (const repository of owned) {
        if (repository.id !== undefined)
            repositories.set(repository.id, repository);
    }
    for (const organization of organizations) {
        const name = organization.name;
        if (!name) continue;
        const repos = await collectPages((page) =>
            api.orgs.orgListRepos(
                encodeURIComponent(name),
                { page, limit: 50 },
                params(),
            ),
        );
        for (const repo of repos) {
            if (repo.id !== undefined) repositories.set(repo.id, repo);
        }
    }
    return [...repositories.values()]
        .filter((repo) => repo.full_name && repo.html_url)
        .map((repo) => ({
            id: repo.id as number,
            fullName: repo.full_name as string,
            url: repo.html_url as string,
            defaultBranch: repo.default_branch || "main",
            private: !!repo.private,
        }))
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
}
