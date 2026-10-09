import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/settings")({
    staticData: { dashboardSection: "settings" },
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/_authenticated/dashboard/settings"!</div>;
}
