import { useRouter } from "@tanstack/react-router";
import {
    DownloadIcon,
    FileTextIcon,
    SearchIcon,
    UserMinusIcon,
} from "lucide-react";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "#/components/ui/dialog";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "#/components/ui/input-group";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "#/components/ui/table";
import { toast } from "#/components/ui/toast";
import {
    type AssignmentDetails,
    removeAssignmentStudent,
} from "#/lib/assignments/details.functions";
import { sanitizeRepoName } from "#/lib/assignments/naming";
import { AddStudentsDialog } from "./add-students-dialog";
import { FormSection } from "./form-fields";
import { RepositoryLink } from "./repository-link";

type Member = AssignmentDetails["members"][number];
type Autograding = AssignmentDetails["autograding"];

/** Whether a member matches the table search, across all text columns. */
function matches(member: Member, query: string) {
    return [
        member.name,
        member.username,
        member.email,
        member.groupName,
        member.repositoryName,
    ].some((value) => value?.toLowerCase().includes(query));
}

function percentOf(points: number, maxPoints: number | null) {
    return maxPoints ? Math.round((points / maxPoints) * 1000) / 10 : null;
}

/** E.g. "Jacky scored 5 of 10 points (50%)." */
function scoreSentence(member: Member, grading: Autograding) {
    if (member.points === null) return `${member.name} has no score yet.`;
    const max = grading?.maxPoints ?? null;
    const percent = percentOf(member.points, max);
    return max === null
        ? `${member.name} scored ${member.points} points.`
        : `${member.name} scored ${member.points} of ${max} points (${percent}%).`;
}

const STATUS_LABELS: Record<Member["status"], string> = {
    ready: "Ready",
    pending: "Not created yet",
    failed: "Failed",
};

/** Quotes a CSV cell and defuses spreadsheet formulas in student input. */
function csvCell(value: string | number | null) {
    if (value === null) return "";
    let text = String(value);
    if (typeof value === "string" && /^[=+\-@\t\r]/.test(text)) {
        text = `'${text}`;
    }
    return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function studentsCsv(details: AssignmentDetails) {
    const isGroup = details.assignment.type === "group";
    const grading = details.autograding;
    const header = [
        "Name",
        "Username",
        "Email",
        ...(isGroup ? ["Group"] : []),
        "Repository",
        "Repository URL",
        "Status",
        "Error",
        "Added",
        ...(grading
            ? ["Points", "Max points", "Percentage", "Autograding details"]
            : []),
    ];
    const rows = details.members.map((member) => [
        member.name,
        member.username,
        member.email,
        ...(isGroup ? [member.groupName] : []),
        member.repositoryName,
        member.repositoryUrl,
        STATUS_LABELS[member.status],
        member.error,
        member.addedAt.toISOString(),
        ...(grading
            ? [
                  member.points,
                  grading.maxPoints,
                  member.points === null
                      ? null
                      : percentOf(member.points, grading.maxPoints),
                  member.pointsDetails,
              ]
            : []),
    ]);
    // A BOM lets spreadsheet apps detect UTF-8 for names with umlauts.
    return `﻿${[header, ...rows]
        .map((row) => row.map(csvCell).join(","))
        .join("\r\n")}\r\n`;
}

function downloadCsv(details: AssignmentDetails) {
    const blob = new Blob([studentsCsv(details)], {
        type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sanitizeRepoName(details.assignment.name) || "assignment"}-students.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

/** Everyone in the assignment with their repository and grading result. */
export function AssignmentStudents({
    orgSlug,
    details,
}: {
    orgSlug: string;
    details: AssignmentDetails;
}) {
    const isGroup = details.assignment.type === "group";
    const archived = details.assignment.archivedAt !== null;
    const grading = details.autograding;
    const [removing, setRemoving] = useState<Member | null>(null);
    const [viewing, setViewing] = useState<Member | null>(null);
    const columns = 5 + (isGroup ? 1 : 0) + (grading ? 1 : 0);
    const [search, setSearch] = useState("");
    const query = search.trim().toLowerCase();
    const members = query
        ? details.members.filter((member) => matches(member, query))
        : details.members;

    return (
        <FormSection
            title={`Students (${details.members.length})`}
            action={
                <div className="flex flex-wrap justify-end gap-2">
                    {!archived && (
                        <AddStudentsDialog
                            key={details.assignment.id}
                            orgSlug={orgSlug}
                            details={details}
                        />
                    )}
                    <Button
                        type="button"
                        variant="outline"
                        disabled={details.members.length === 0}
                        onClick={() => downloadCsv(details)}
                    >
                        <DownloadIcon data-icon="inline-start" />
                        Export CSV
                    </Button>
                </div>
            }
        >
            <div className="space-y-3">
                <InputGroup>
                    <InputGroupInput
                        type="search"
                        aria-label="Search students"
                        placeholder="Search by name, email, group or repository…"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <InputGroupAddon align="inline-end">
                        <SearchIcon aria-hidden="true" />
                    </InputGroupAddon>
                </InputGroup>
                <div className="overflow-x-auto rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                {isGroup && <TableHead>Group</TableHead>}
                                <TableHead>Repository</TableHead>
                                <TableHead>Added</TableHead>
                                {grading && (
                                    <TableHead>
                                        Score
                                        {grading.maxPoints !== null && (
                                            <span className="font-normal text-muted-foreground">
                                                {" "}
                                                / {grading.maxPoints}
                                            </span>
                                        )}
                                    </TableHead>
                                )}
                                <TableHead className="w-10">
                                    <span className="sr-only">Actions</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        {query
                                            ? "No students match your search."
                                            : "No students have joined yet."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                members.map((member) => (
                                    <TableRow key={member.userId}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="size-6">
                                                    {member.avatarUrl && (
                                                        <AvatarImage
                                                            src={
                                                                member.avatarUrl
                                                            }
                                                            alt=""
                                                        />
                                                    )}
                                                    <AvatarFallback>
                                                        {(
                                                            member.username ??
                                                            member.name
                                                        )
                                                            .slice(0, 2)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex min-w-0 flex-col">
                                                    <span className="truncate">
                                                        {member.name}
                                                    </span>
                                                    {member.username && (
                                                        <span className="truncate text-muted-foreground">
                                                            @{member.username}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {member.email ?? "-"}
                                        </TableCell>
                                        {isGroup && (
                                            <TableCell>
                                                {member.groupName ?? (
                                                    <span className="text-muted-foreground">
                                                        No group
                                                    </span>
                                                )}
                                            </TableCell>
                                        )}
                                        <TableCell className="max-w-72">
                                            <RepositoryLink
                                                repository={member}
                                                pendingLabel={
                                                    details.assignment.joinUrl
                                                        ? "Created on join"
                                                        : "Not created yet"
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {member.addedAt.toLocaleDateString()}
                                        </TableCell>
                                        {grading && (
                                            <TableCell>
                                                <Score
                                                    member={member}
                                                    grading={grading}
                                                    onView={() =>
                                                        setViewing(member)
                                                    }
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            {!archived && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-sm"
                                                    aria-label={`Remove ${member.name}`}
                                                    title="Remove from assignment"
                                                    onClick={() =>
                                                        setRemoving(member)
                                                    }
                                                >
                                                    <UserMinusIcon />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
            {removing && (
                <RemoveStudentDialog
                    orgSlug={orgSlug}
                    details={details}
                    member={removing}
                    onClose={() => setRemoving(null)}
                />
            )}
            <Dialog
                open={viewing !== null}
                onOpenChange={(open) => {
                    if (!open) setViewing(null);
                }}
            >
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Autograding details</DialogTitle>
                        {viewing && (
                            <DialogDescription>
                                {scoreSentence(viewing, grading)}
                            </DialogDescription>
                        )}
                    </DialogHeader>
                    <pre className="max-h-[60vh] overflow-auto rounded-lg bg-muted p-3 font-mono text-xs">
                        {viewing?.pointsDetails &&
                            JSON.stringify(
                                JSON.parse(viewing.pointsDetails),
                                null,
                                2,
                            )}
                    </pre>
                </DialogContent>
            </Dialog>
        </FormSection>
    );
}

function Score({
    member,
    grading,
    onView,
}: {
    member: Member;
    grading: NonNullable<Autograding>;
    onView: () => void;
}) {
    if (member.points === null) {
        return <span className="text-muted-foreground">-</span>;
    }
    const percent = percentOf(member.points, grading.maxPoints);
    return (
        <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="tabular-nums">
                {member.points}
                {percent !== null && (
                    <span className="text-muted-foreground"> ({percent}%)</span>
                )}
            </span>
            {member.pointsDetails && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`View autograding details of ${member.name}`}
                    title="View details"
                    onClick={onView}
                >
                    <FileTextIcon />
                </Button>
            )}
        </div>
    );
}

function RemoveStudentDialog({
    orgSlug,
    details,
    member,
    onClose,
}: {
    orgSlug: string;
    details: AssignmentDetails;
    member: Member;
    onClose: () => void;
}) {
    const router = useRouter();
    const [pending, setPending] = useState(false);

    async function remove() {
        setPending(true);
        try {
            const result = await removeAssignmentStudent({
                data: {
                    orgSlug,
                    classId: details.classroom.id,
                    assignmentId: details.assignment.id,
                    userId: member.userId,
                },
            });
            if (!result.success) {
                toast.add({
                    title: "Failed to remove student",
                    description: result.error,
                    type: "error",
                });
                return;
            }
            toast.add({ title: `Removed ${member.name}`, type: "success" });
            await router.invalidate();
            onClose();
        } catch (error) {
            console.error("Failed to remove student", error);
            toast.add({ title: "Failed to remove student", type: "error" });
        } finally {
            setPending(false);
        }
    }

    return (
        <AlertDialog
            open
            onOpenChange={(open) => {
                if (!open && !pending) onClose();
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove {member.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {details.assignment.type === "group"
                            ? `They leave ${member.groupName ?? "their group"} and lose access to its repository. The repository stays with the group.`
                            : member.repositoryName
                              ? `They lose access to ${member.repositoryName}. The repository stays in the organization but is no longer part of this assignment.`
                              : "They are removed from this assignment."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={pending}
                        onClick={remove}
                    >
                        {pending ? "Removing…" : "Remove student"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
