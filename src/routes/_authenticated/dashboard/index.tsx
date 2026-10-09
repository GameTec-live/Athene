import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/")({
    staticData: { dashboardSection: "organizations" },
    component: () => (
        <p className="text-muted-foreground">
            Select an organization to browse its classes.
        </p>
    ),
});
