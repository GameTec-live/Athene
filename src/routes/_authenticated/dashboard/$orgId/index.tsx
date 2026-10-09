import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/$orgId/")({
    component: OrganizationContent,
});

function OrganizationContent() {
    const { orgId } = Route.useParams();
    return <div>{orgId}</div>;
}
