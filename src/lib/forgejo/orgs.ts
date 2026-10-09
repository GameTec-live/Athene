import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "../auth";
import { authMiddleware } from "../auth.functions";
import { api } from "./forgejo-api";
import { getForgejoOrganizationNames } from "./groups";

export type DashboardOrganization = {
    id: string;
    name: string;
    description: string;
};

export const getOrgs = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .handler(async () => {
        const headers = getRequestHeaders();
        const accounts = await auth.api.listUserAccounts({ headers });
        const forgejoAccount = accounts.find(
            (account) => account.providerId === "forgejo",
        );
        if (!forgejoAccount) return [];

        // accountInfo exposes raw provider claims in `data`, separate from
        // session.user, and lets Better Auth handle token verification/refresh.
        const { data } = await auth.api.accountInfo({
            headers,
            query: { accountId: forgejoAccount.id },
        });
        const groups = data && "groups" in data ? data.groups : undefined;
        const names = getForgejoOrganizationNames(groups);

        return Promise.all(
            names.map(async (name): Promise<DashboardOrganization> => {
                const { data: org } = await api.orgs.orgGet(
                    encodeURIComponent(name),
                );
                if (!org?.id) {
                    throw new Error("Invalid Forgejo organization response");
                }
                return {
                    id: String(org.id),
                    name: org.full_name || org.name || org.username || name,
                    description: org.description || "",
                };
            }),
        );
    });
