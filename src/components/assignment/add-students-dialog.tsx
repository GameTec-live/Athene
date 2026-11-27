import { useRouter } from "@tanstack/react-router";
import { PlusIcon, ShuffleIcon, UserPlusIcon, XIcon } from "lucide-react";
import { useId, useState } from "react";
import * as v from "valibot";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "#/components/ui/dialog";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { toast } from "#/components/ui/toast";
import {
    type AssignmentDetails,
    addAssignmentStudents,
} from "#/lib/assignments/details.functions";
import {
    renderRepoName,
    usesCustomPlaceholder,
} from "#/lib/assignments/naming";
import { type GroupTarget, groupNameSchema } from "#/lib/assignments/schemas";
import type { ForgejoStudent } from "#/lib/assignments/types";
import {
    AssignmentMembersTable,
    type MemberRow,
} from "./assignment-members-table";
import {
    CreationProgressDialog,
    type CreationState,
    readProvisioning,
} from "./creation-progress-dialog";
import { distributeIntoGroups, StudentPicker } from "./form-fields";

type Staged = { forgejoId: number; group: number | null };

/**
 * An "Add" button opening a dialog that stages students (and new groups)
 * for an existing assignment, then adds them in one go. Staged entries
 * survive closing the dialog. Group indexes cover the existing groups
 * first, followed by the new ones.
 */
export function AddStudentsDialog({
    orgSlug,
    details,
}: {
    orgSlug: string;
    details: AssignmentDetails;
}) {
    const id = useId();
    const router = useRouter();
    const a = details.assignment;
    const isGroup = a.type === "group";
    const deferred = usesCustomPlaceholder(a.namingTemplate);
    const [students, setStudents] = useState(
        () => new Map<number, ForgejoStudent>(),
    );
    const [staged, setStaged] = useState<Staged[]>([]);
    const [newGroups, setNewGroups] = useState<string[]>([]);
    const [groupName, setGroupName] = useState("");
    const [groupError, setGroupError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<CreationState | null>(null);
    const [open, setOpen] = useState(false);

    const existingGroups = details.groups;
    const groupNames = [...existingGroups.map((g) => g.name), ...newGroups];
    const counts = [
        ...existingGroups.map((g) => g.memberCount),
        ...newGroups.map(() => 0),
    ];
    const excludeIds = new Set([
        ...details.members.flatMap((m) => (m.forgejoId ? [m.forgejoId] : [])),
        ...staged.map((s) => s.forgejoId),
    ]);

    function addStudents(added: ForgejoStudent[]) {
        const fresh = added.filter((s) => !excludeIds.has(s.forgejoId));
        setStudents((previous) => {
            const next = new Map(previous);
            for (const student of fresh) next.set(student.forgejoId, student);
            return next;
        });
        // Functional update: a roster import resolves after later edits.
        setStaged((current) => {
            const present = new Set(current.map((s) => s.forgejoId));
            return [
                ...current,
                ...fresh
                    .filter((s) => !present.has(s.forgejoId))
                    .map((s) => ({ forgejoId: s.forgejoId, group: null })),
            ];
        });
        setError(null);
        return fresh.length;
    }

    function addGroup() {
        const result = v.safeParse(groupNameSchema, groupName);
        if (!result.success) {
            setGroupError(result.issues[0].message);
            return;
        }
        const name = result.output;
        if (groupNames.some((g) => g.toLowerCase() === name.toLowerCase())) {
            setGroupError("A group with this name already exists.");
            return;
        }
        setNewGroups([...newGroups, name]);
        setGroupName("");
        setGroupError(null);
    }

    function removeNewGroup(index: number) {
        const removed = existingGroups.length + index;
        setNewGroups(newGroups.filter((_, i) => i !== index));
        setStaged(
            staged.map((s) => {
                if (s.group === null || s.group < removed) return s;
                return {
                    ...s,
                    group: s.group === removed ? null : s.group - 1,
                };
            }),
        );
    }

    function reset() {
        setStaged([]);
        setNewGroups([]);
        setStudents(new Map());
        setError(null);
    }

    /** Client-side checks mirroring the server, for immediate feedback. */
    function validate() {
        if (staged.length === 0 && newGroups.length === 0) {
            return "Add at least one student or group.";
        }
        if (!isGroup) return null;
        if (staged.some((s) => s.group === null)) {
            return "Assign every student to a group.";
        }
        if (a.maxGroupMembers) {
            const totals = [...counts];
            for (const s of staged) if (s.group !== null) totals[s.group]++;
            if (totals.some((total) => total > (a.maxGroupMembers ?? 0))) {
                return "A group would have more members than allowed.";
            }
        }
        return null;
    }

    function targetOf(group: number | null): GroupTarget | null {
        if (group === null) return null;
        return group < existingGroups.length
            ? { type: "existing", id: existingGroups[group].id }
            : { type: "new", index: group - existingGroups.length };
    }

    async function submit() {
        const invalid = validate();
        if (invalid) {
            setError(invalid);
            return;
        }
        setOpen(false);
        setProgress({ phase: "saving", items: [] });
        let result: Awaited<ReturnType<typeof addAssignmentStudents>>;
        try {
            result = await addAssignmentStudents({
                data: {
                    orgSlug,
                    classId: details.classroom.id,
                    assignmentId: a.id,
                    newGroups,
                    students: staged.map((s) => ({
                        forgejoId: s.forgejoId,
                        group: targetOf(s.group),
                    })),
                },
            });
        } catch (error) {
            console.error("Failed to add students", error);
            setProgress(null);
            setOpen(true);
            toast.add({
                title: "Failed to add students",
                description: "An unexpected error occurred.",
                type: "error",
            });
            return;
        }
        if (!result.success) {
            setProgress(null);
            setError(result.error);
            setOpen(true);
            return;
        }

        const outcome = await readProvisioning(result, (patch) =>
            setProgress({ phase: "provisioning", ...patch }),
        );
        reset();
        await router.invalidate();
        if (!outcome.failed && !outcome.connectionLost) {
            setProgress(null);
            toast.add({ title: "Students added", type: "success" });
            return;
        }
        setProgress({
            phase: "done",
            items: outcome.items,
            connectionLost: outcome.connectionLost,
        });
    }

    const namingPreview = {
        assignmentName: a.name,
        className: details.classroom.name,
        orgName: details.organization.name,
    };
    const rows: MemberRow[] = staged.flatMap((entry) => {
        const student = students.get(entry.forgejoId);
        return student ? [{ student, group: entry.group }] : [];
    });
    const submitLabel =
        staged.length > 0
            ? `Add ${staged.length} ${staged.length === 1 ? "student" : "students"}`
            : newGroups.length > 0
              ? `Add ${newGroups.length} ${newGroups.length === 1 ? "group" : "groups"}`
              : "Add students";

    const empty = staged.length === 0 && newGroups.length === 0;

    return (
        <>
            <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(true)}
            >
                <UserPlusIcon data-icon="inline-start" />
                Add
                {!empty && (
                    <Badge variant="secondary">
                        {staged.length + newGroups.length}
                    </Badge>
                )}
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>
                            {isGroup
                                ? "Add students and groups"
                                : "Add students"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="@container min-w-0 space-y-3">
                        {isGroup && (
                            <Field data-invalid={groupError !== null}>
                                <FieldLabel htmlFor={`${id}-new-group`}>
                                    New group
                                </FieldLabel>
                                <div className="flex gap-2">
                                    <Input
                                        id={`${id}-new-group`}
                                        value={groupName}
                                        placeholder={`Team ${groupNames.length + 1}`}
                                        aria-invalid={groupError !== null}
                                        className="max-w-64"
                                        onChange={(event) => {
                                            setGroupName(event.target.value);
                                            setGroupError(null);
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                event.preventDefault();
                                                addGroup();
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addGroup}
                                    >
                                        <PlusIcon data-icon="inline-start" />
                                        Add group
                                    </Button>
                                </div>
                                {groupError && (
                                    <FieldError
                                        errors={[{ message: groupError }]}
                                    />
                                )}
                                {newGroups.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {newGroups.map((name, index) => (
                                            <Badge
                                                key={name}
                                                variant="secondary"
                                                className="h-6 pr-0.5"
                                            >
                                                {name}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon-xs"
                                                    aria-label={`Remove group ${name}`}
                                                    onClick={() =>
                                                        removeNewGroup(index)
                                                    }
                                                >
                                                    <XIcon />
                                                </Button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                                {newGroups.length > 0 && (
                                    <FieldDescription>
                                        New groups are created when you add
                                        them.
                                    </FieldDescription>
                                )}
                            </Field>
                        )}
                        <StudentPicker
                            id={id}
                            excludeIds={excludeIds}
                            rosters={details.rosters}
                            onAdd={addStudents}
                        >
                            {isGroup && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={
                                        !staged.some((s) => s.group === null)
                                    }
                                    onClick={() =>
                                        setStaged(
                                            distributeIntoGroups(
                                                staged,
                                                counts,
                                                a.maxGroupMembers ?? 0,
                                            ),
                                        )
                                    }
                                >
                                    <ShuffleIcon data-icon="inline-start" />
                                    Fill groups
                                </Button>
                            )}
                        </StudentPicker>
                        {rows.length > 0 && (
                            <AssignmentMembersTable
                                rows={rows}
                                groups={groupNames}
                                showGroups={isGroup}
                                repositoryName={(row) => {
                                    if (!isGroup) {
                                        return deferred
                                            ? null
                                            : renderRepoName(a.namingTemplate, {
                                                  ...namingPreview,
                                                  studentName:
                                                      row.student.username,
                                              });
                                    }
                                    if (row.group === null) return "-";
                                    const existing = existingGroups[row.group];
                                    if (existing?.repositoryName) {
                                        return existing.repositoryName;
                                    }
                                    return deferred
                                        ? null
                                        : renderRepoName(a.namingTemplate, {
                                              ...namingPreview,
                                              groupName: groupNames[row.group],
                                          });
                                }}
                                onGroupChange={(forgejoId, group) =>
                                    setStaged(
                                        staged.map((s) =>
                                            s.forgejoId === forgejoId
                                                ? { ...s, group }
                                                : s,
                                        ),
                                    )
                                }
                                onRemove={(forgejoId) =>
                                    setStaged(
                                        staged.filter(
                                            (s) => s.forgejoId !== forgejoId,
                                        ),
                                    )
                                }
                            />
                        )}
                    </div>
                    <DialogFooter className="flex-wrap items-center">
                        {error && (
                            <FieldError
                                className="mr-auto"
                                errors={[{ message: error }]}
                            />
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            disabled={empty}
                            onClick={reset}
                        >
                            Clear
                        </Button>
                        <Button
                            type="button"
                            disabled={progress !== null || empty}
                            onClick={submit}
                        >
                            {submitLabel}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {progress && (
                <CreationProgressDialog
                    state={progress}
                    title={{
                        working: "Adding students",
                        done: "Students added",
                    }}
                    savingLabel="Saving and registering students…"
                    continueLabel="Done"
                    onContinue={() => setProgress(null)}
                />
            )}
        </>
    );
}
