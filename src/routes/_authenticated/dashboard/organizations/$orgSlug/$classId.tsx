import { createFileRoute } from "@tanstack/react-router";
import { getClass } from "#/lib/classes.functions";

export const Route = createFileRoute(
    "/_authenticated/dashboard/organizations/$orgSlug/$classId",
)({
    loader: async ({ params }) => {
        return await getClass({ data: { classId: params.classId } });
    },
    component: ClassContent,
});

function ClassContent() {
    const classroom = Route.useLoaderData();
    return <h1 className="text-xl font-semibold">{classroom.name}</h1>;
}
