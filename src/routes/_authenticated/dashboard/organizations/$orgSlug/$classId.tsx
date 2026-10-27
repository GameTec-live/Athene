import {
    createFileRoute,
    notFound,
    useLoaderData,
} from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/dashboard/organizations/$orgSlug/$classId",
)({
    component: ClassContent,
});

function ClassContent() {
    const { classId } = Route.useParams();
    const { classes } = useLoaderData({
        from: "/_authenticated/dashboard/organizations/$orgSlug",
    });
    const classroom = classes.find((entry) => entry.id === classId);
    if (!classroom) throw notFound();
    return <h1 className="text-xl font-semibold">{classroom.name}</h1>;
}
