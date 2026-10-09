import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/autograding")({
    staticData: { dashboardSection: "autograding" },
    component: RouteComponent,
});

function RouteComponent() {
    return <div>Hello "/_authenticated/dashboard/autograding"!</div>;
}
