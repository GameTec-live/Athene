import { createFileRoute, useRouter } from "@tanstack/react-router";
import { RosterMembers } from "#/components/roster/roster-members";
import { Button } from "#/components/ui/button";
import { getRoster } from "#/lib/rosters.functions";

export const Route = createFileRoute(
    "/_authenticated/dashboard/rosters/$rosterId",
)({
    loader: ({ params }) => getRoster({ data: { rosterId: params.rosterId } }),
    pendingComponent: () => (
        <p role="status" className="text-muted-foreground">
            Loading members…
        </p>
    ),
    errorComponent: RosterError,
    notFoundComponent: () => <p>Roster not found.</p>,
    component: RosterContent,
});

function RosterError({ reset }: { reset: () => void }) {
    const router = useRouter();
    return (
        <div role="alert" className="space-y-3">
            <p>Could not load roster members.</p>
            <Button
                variant="outline"
                onClick={() => {
                    void router.invalidate();
                    reset();
                }}
            >
                Retry
            </Button>
        </div>
    );
}

function RosterContent() {
    const data = Route.useLoaderData();
    return <RosterMembers key={data.roster.id} {...data} />;
}
