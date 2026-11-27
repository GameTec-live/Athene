import { createFileRoute } from "@tanstack/react-router";
import { ArchiveIcon, UserGroupIcon, UserIcon } from "lucide-react";
import { AssignmentActions } from "#/components/assignment/assignment-actions";
import { AssignmentSettingsForm } from "#/components/assignment/assignment-settings-form";
import { AssignmentStudents } from "#/components/assignment/assignment-students";
import { Alert, AlertDescription } from "#/components/ui/alert";
import { Badge } from "#/components/ui/badge";
import { getAssignmentDetails } from "#/lib/assignments/details.functions";

export const Route = createFileRoute(
    "/_authenticated/dashboard/organizations/$orgSlug/$classId/assignment/$assignmentId",
)({
    // Dates and the deadline input render in the viewer's time zone.
    ssr: "data-only",
    loader: ({ params }) => getAssignmentDetails({ data: params }),
    component: AssignmentContent,
});

function AssignmentContent() {
    const { orgSlug } = Route.useParams();
    const details = Route.useLoaderData();
    const a = details.assignment;

    return (
        <div className="@container space-y-6">
            <div className="flex flex-wrap items-start gap-4">
                <div className="mr-auto min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-xl font-semibold wrap-break-word">
                            {a.name}
                        </h1>
                        {a.archivedAt && (
                            <Badge variant="secondary">
                                <ArchiveIcon data-icon="inline-start" />
                                Archived
                            </Badge>
                        )}
                    </div>
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        {a.type === "group" ? (
                            <UserGroupIcon className="size-4" aria-hidden />
                        ) : (
                            <UserIcon className="size-4" aria-hidden />
                        )}
                        {a.type === "group" ? "Group" : "Individual"} assignment
                        in {details.classroom.name}, created{" "}
                        {a.createdAt.toLocaleDateString()}
                    </p>
                </div>
                <AssignmentActions orgSlug={orgSlug} details={details} />
            </div>
            {a.archivedAt && (
                <Alert>
                    <AlertDescription>
                        Archived on {a.archivedAt.toLocaleString()}.
                        Repositories are read-only and joining is closed.
                        Unarchive the assignment to change settings or students.
                    </AlertDescription>
                </Alert>
            )}
            {/* Remount after (un)archiving, which can change settings. */}
            <AssignmentSettingsForm
                key={`${a.id}-${a.archivedAt?.getTime() ?? "active"}`}
                orgSlug={orgSlug}
                details={details}
            >
                <AssignmentStudents orgSlug={orgSlug} details={details} />
            </AssignmentSettingsForm>
        </div>
    );
}
