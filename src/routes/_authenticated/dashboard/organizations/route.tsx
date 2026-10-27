import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getOrganizations } from "#/lib/forgejo/orgs";
import { getQuotaGroupOptions } from "#/lib/forgejo/quotas";

export const Route = createFileRoute("/_authenticated/dashboard/organizations")(
    {
        staticData: { dashboardSection: "organizations" },
        loader: async ({ abortController }) => {
            const quotaGroups = getQuotaGroupOptions({
                signal: abortController.signal,
            });
            const organizations = await getOrganizations({
                signal: abortController.signal,
            });
            return { organizations, quotaGroups };
        },
        staleTime: 30_000,
        component: Outlet,
        notFoundComponent: () => (
            <p className="text-muted-foreground">
                This organization or class is unavailable.
            </p>
        ),
    },
);
