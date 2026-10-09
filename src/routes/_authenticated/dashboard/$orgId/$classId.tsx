import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/dashboard/$orgId/$classId",
)({ component: ClassContent });

function ClassContent() {
    const { orgId, classId } = Route.useParams();
    return (
        <div>
            {orgId}, {classId}
        </div>
    );
}
