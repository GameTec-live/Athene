import { useNavigate, useRouter } from "@tanstack/react-router";
import { ArchiveIcon, ArchiveRestoreIcon, Trash2Icon } from "lucide-react";
import { useId, useState } from "react";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import { Field, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { toast } from "#/components/ui/toast";
import {
    type AssignmentDetails,
    deleteAssignment,
    setAssignmentArchived,
} from "#/lib/assignments/details.functions";

function plural(count: number, word: string, many = `${word}s`) {
    return `${count} ${count === 1 ? word : many}`;
}

/** Archive/unarchive and delete, shown in the assignment page header. */
export function AssignmentActions({
    orgSlug,
    details,
}: {
    orgSlug: string;
    details: AssignmentDetails;
}) {
    const a = details.assignment;
    const params = {
        orgSlug,
        classId: details.classroom.id,
        assignmentId: a.id,
    };
    const repositoryCount = (
        a.type === "group" ? details.groups : details.members
    ).filter((entry) => entry.repositoryName).length;

    return (
        <div className="flex flex-wrap gap-2">
            <ArchiveButton
                params={params}
                details={details}
                repositoryCount={repositoryCount}
            />
            <DeleteButton
                params={params}
                details={details}
                repositoryCount={repositoryCount}
            />
        </div>
    );
}

type Params = { orgSlug: string; classId: string; assignmentId: string };

function ArchiveButton({
    params,
    details,
    repositoryCount,
}: {
    params: Params;
    details: AssignmentDetails;
    repositoryCount: number;
}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const a = details.assignment;
    const archive = a.archivedAt === null;
    const deadlinePassed =
        a.deadline !== null && a.deadline.getTime() <= Date.now();
    const verb = archive ? "Archive" : "Unarchive";

    async function run() {
        setPending(true);
        try {
            const result = await setAssignmentArchived({
                data: { ...params, archived: archive },
            });
            if (!result.success) {
                toast.add({
                    title: `Failed to ${verb.toLowerCase()} assignment`,
                    description: result.error,
                    type: "error",
                });
                return;
            }
            toast.add({
                title: archive
                    ? "Assignment archived"
                    : "Assignment unarchived",
                type: "success",
            });
            setOpen(false);
            await router.invalidate();
        } catch (error) {
            console.error(`Failed to ${verb.toLowerCase()} assignment`, error);
            toast.add({
                title: `Failed to ${verb.toLowerCase()} assignment`,
                type: "error",
            });
        } finally {
            setPending(false);
        }
    }

    return (
        <AlertDialog
            open={open}
            onOpenChange={(next) => {
                if (!pending) setOpen(next);
            }}
        >
            <AlertDialogTrigger render={<Button variant="outline" />}>
                {archive ? (
                    <ArchiveIcon data-icon="inline-start" />
                ) : (
                    <ArchiveRestoreIcon data-icon="inline-start" />
                )}
                {verb}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {verb} {a.name}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {archive
                            ? `${plural(repositoryCount, "repository", "repositories")} become read-only and joining via link closes, just like at the deadline. Settings are locked until you unarchive it.`
                            : `${plural(repositoryCount, "repository", "repositories")} become writable again.${deadlinePassed ? " Since the deadline has passed, archiving on the deadline is switched off and joining stays closed." : ""}`}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending}>
                        Cancel
                    </AlertDialogCancel>
                    <Button disabled={pending} onClick={run}>
                        {pending ? `${verb.slice(0, -1)}ing…` : verb}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

/**
 * Deletion is permanent and removes repositories in Forgejo, so it takes two
 * steps: confirming what gets deleted, then typing the assignment name.
 */
function DeleteButton({
    params,
    details,
    repositoryCount,
}: {
    params: Params;
    details: AssignmentDetails;
    repositoryCount: number;
}) {
    const id = useId();
    const router = useRouter();
    const navigate = useNavigate();
    const [step, setStep] = useState<"closed" | "confirm" | "type">("closed");
    const [typed, setTyped] = useState("");
    const [pending, setPending] = useState(false);
    const a = details.assignment;

    function setOpen(open: boolean) {
        if (pending) return;
        setStep(open ? "confirm" : "closed");
        setTyped("");
    }

    async function remove() {
        setPending(true);
        try {
            const result = await deleteAssignment({ data: params });
            if (!result.success) {
                toast.add({
                    title: "Failed to delete assignment",
                    description: result.error,
                    type: "error",
                });
                return;
            }
            toast.add({ title: `Deleted ${a.name}`, type: "success" });
            await navigate({
                to: "/dashboard/organizations/$orgSlug/$classId",
                params: { orgSlug: params.orgSlug, classId: params.classId },
            });
            await router.invalidate();
        } catch (error) {
            console.error("Failed to delete assignment", error);
            toast.add({ title: "Failed to delete assignment", type: "error" });
        } finally {
            setPending(false);
        }
    }

    return (
        <AlertDialog open={step !== "closed"} onOpenChange={setOpen}>
            <AlertDialogTrigger render={<Button variant="destructive" />}>
                <Trash2Icon data-icon="inline-start" />
                Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {a.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {step === "confirm"
                            ? `This permanently deletes ${plural(repositoryCount, "repository", "repositories")}${a.type === "group" ? " and their group teams" : ""} in Forgejo, including all student work, along with the assignment and its autograding results. This cannot be undone.`
                            : "This is your last chance to keep it. Type the assignment name to delete it permanently."}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {step === "type" && (
                    <Field>
                        <FieldLabel htmlFor={`${id}-confirm`}>
                            Type <span className="font-mono">{a.name}</span> to
                            confirm
                        </FieldLabel>
                        <Input
                            id={`${id}-confirm`}
                            value={typed}
                            autoComplete="off"
                            autoFocus
                            disabled={pending}
                            onChange={(event) => setTyped(event.target.value)}
                        />
                    </Field>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending}>
                        Cancel
                    </AlertDialogCancel>
                    {step === "confirm" ? (
                        <Button
                            variant="destructive"
                            onClick={() => setStep("type")}
                        >
                            Continue
                        </Button>
                    ) : (
                        <Button
                            variant="destructive"
                            disabled={pending || typed !== a.name}
                            onClick={remove}
                        >
                            {pending ? "Deleting…" : "Delete permanently"}
                        </Button>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
