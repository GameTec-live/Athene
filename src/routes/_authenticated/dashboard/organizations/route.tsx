import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getOrganizations } from "#/lib/forgejo/orgs";

export const Route = createFileRoute("/_authenticated/dashboard/organizations")(
    {
        staticData: { dashboardSection: "organizations" },
        loader: () => getOrganizations(),
        staleTime: 30_000,
        component: Outlet,
        notFoundComponent: () => (
            <p className="text-muted-foreground">
                This organization or class is unavailable.
            </p>
        ),
    },
);
