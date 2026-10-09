import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/organizations")(
    {
        staticData: { dashboardSection: "organizations" },
        component: RouteComponent,
    },
);

function RouteComponent() {
    return <div>Hello "/_authenticated/dashboard/organizations"!</div>;
}
