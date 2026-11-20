import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/dashboard/organizations/$orgSlug/$classId/assignment/$assignmentId",
)({
    component: AssignmentContent,
});

function AssignmentContent() {
    return (
        <div>
            <h1 className="text-xl font-semibold">Assignment</h1>
            <p className="text-muted-foreground">
                Assignment details are coming soon.
            </p>
        </div>
    );
}
