import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";
import { useId, useState, useTransition } from "react";
import * as v from "valibot";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "#/components/ui/dialog";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { toast } from "#/components/ui/toast";
import { rosterNameSchema } from "#/lib/common-schemas";
import { deleteRoster, updateRoster } from "#/lib/rosters.functions";

export function EditRosterDialog({
    roster,
    open,
    onOpenChange,
    onDeleted,
}: {
    roster: { id: string; name: string };
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted: () => Promise<void>;
}) {
    const router = useRouter();
    const nameId = useId();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, startDeleteTransition] = useTransition();
    const form = useForm({
        defaultValues: { name: roster.name },
        validators: {
            onSubmit: v.object({ name: rosterNameSchema }),
        },
        onSubmit: async ({ value }) => {
            try {
                await updateRoster({
                    data: { rosterId: roster.id, ...value },
                });
            } catch {
                toast.add({ title: "Failed to update roster", type: "error" });
                return;
            }
            onOpenChange(false);
            await router.invalidate({
                filter: (match) =>
                    match.routeId === "/_authenticated/dashboard/rosters" ||
                    (match.routeId ===
                        "/_authenticated/dashboard/rosters/$rosterId" &&
                        match.params.rosterId === roster.id),
                sync: true,
            });
        },
    });

    function handleDelete() {
        startDeleteTransition(async () => {
            try {
                await deleteRoster({ data: { rosterId: roster.id } });
            } catch {
                toast.add({ title: "Failed to delete roster", type: "error" });
                return;
            }
            setDeleteDialogOpen(false);
            onOpenChange(false);
            await onDeleted();
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit roster</DialogTitle>
                    <DialogDescription>Update {roster.name}.</DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.handleSubmit();
                    }}
                >
                    <FieldGroup>
                        <form.Field name="name">
                            {(field) => {
                                const isInvalid =
                                    field.state.meta.isTouched &&
                                    !field.state.meta.isValid;
                                return (
                                    <Field data-invalid={isInvalid}>
                                        <FieldLabel htmlFor={nameId}>
                                            Roster name
                                        </FieldLabel>
                                        <Input
                                            id={nameId}
                                            name={field.name}
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(event) =>
                                                field.handleChange(
                                                    event.target.value,
                                                )
                                            }
                                            aria-invalid={isInvalid}
                                            placeholder="Enter roster name"
                                            autoComplete="off"
                                            maxLength={255}
                                        />
                                        {isInvalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>
                        <form.Subscribe
                            selector={(state) => state.isSubmitting}
                        >
                            {(isSubmitting) => (
                                <DialogFooter>
                                    <AlertDialog
                                        open={deleteDialogOpen}
                                        onOpenChange={(nextOpen) => {
                                            if (!isDeleting)
                                                setDeleteDialogOpen(nextOpen);
                                        }}
                                    >
                                        <AlertDialogTrigger
                                            disabled={
                                                isSubmitting || isDeleting
                                            }
                                            render={
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    className="sm:mr-auto"
                                                />
                                            }
                                        >
                                            <Trash2Icon />
                                            Delete roster
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Delete roster?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete{" "}
                                                    {roster.name} and its roster
                                                    memberships. This action
                                                    cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel
                                                    disabled={isDeleting}
                                                >
                                                    Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction
                                                    variant="destructive"
                                                    disabled={isDeleting}
                                                    onClick={handleDelete}
                                                >
                                                    {isDeleting
                                                        ? "Deleting…"
                                                        : "Delete roster"}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <DialogClose
                                        render={<Button variant="outline" />}
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </DialogClose>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || isDeleting}
                                    >
                                        {isSubmitting
                                            ? "Saving…"
                                            : "Save changes"}
                                    </Button>
                                </DialogFooter>
                            )}
                        </form.Subscribe>
                    </FieldGroup>
                </form>
            </DialogContent>
        </Dialog>
    );
}
