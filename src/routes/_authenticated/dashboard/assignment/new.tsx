import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/dashboard/assignment/new",
)({
    component: NewAssignmentContent,
});

function NewAssignmentContent() {
    return (
        <div>
            <h1 className="text-xl font-semibold">New assignment</h1>
        </div>
    );
}
