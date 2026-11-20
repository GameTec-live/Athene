import { createFileRoute } from "@tanstack/react-router";
import { NewAssignmentForm } from "#/components/assignment/new-assignment-form";
import { getNewAssignmentOptions } from "#/lib/assignments/assignments.functions";

export const Route = createFileRoute(
    "/_authenticated/dashboard/organizations/$orgSlug/$classId/assignment/new",
)({
    loader: ({ params }) => getNewAssignmentOptions({ data: params }),
    component: NewAssignmentContent,
});

function NewAssignmentContent() {
    const { orgSlug } = Route.useParams();
    const options = Route.useLoaderData();

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-semibold">
                New assignment in {options.classroom.name}
            </h1>
            <NewAssignmentForm
                key={options.classroom.id}
                orgSlug={orgSlug}
                options={options}
            />
        </div>
    );
}
