import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/rosters/")({
    component: () => (
        <p className="text-muted-foreground">
            Select a roster to view its content.
        </p>
    ),
});
