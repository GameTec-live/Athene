import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/dashboard/rosters/$rosterId",
)({ component: RosterContent });

function RosterContent() {
    const { rosterId } = Route.useParams();
    return <div>{rosterId}</div>;
}
