import { createFileRoute, Outlet } from "@tanstack/react-router";
import { getOrganizationClasses } from "#/lib/classes.functions";

export const Route = createFileRoute(
    "/_authenticated/dashboard/organizations/$orgSlug",
)({
    loader: ({ params }) =>
        getOrganizationClasses({ data: { orgSlug: params.orgSlug } }),
    staleTime: 30_000,
    component: Outlet,
});
