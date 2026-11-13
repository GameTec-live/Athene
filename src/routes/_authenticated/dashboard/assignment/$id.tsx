import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/dashboard/assignment/$id",
)({
    component: AssignmentContent,
});

function AssignmentContent() {
    return (
        <div>
            <h1 className="text-xl font-semibold">Assignment</h1>
        </div>
    );
}
