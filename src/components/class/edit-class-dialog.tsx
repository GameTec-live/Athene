import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";
import { useId, useState, useTransition } from "react";
import * as v from "valibot";
import { deleteClass, updateClass } from "#/lib/classes.functions";
import { classNameSchema } from "#/lib/common-schemas";
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
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { toast } from "../ui/toast";

export function EditClassDialog({
    orgSlug,
    classroom,
    open,
    onOpenChange,
    onDeleted,
}: {
    orgSlug: string;
    classroom: { id: string; name: string };
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted: () => Promise<void>;
}) {
    const router = useRouter();
    const nameId = useId();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, startDeleteTransition] = useTransition();
    const form = useForm({
        defaultValues: { name: classroom.name },
        validators: {
            onSubmit: v.object({ name: classNameSchema }),
        },
        onSubmit: async ({ value }) => {
            try {
                await updateClass({
                    data: { orgSlug, classId: classroom.id, ...value },
                });
            } catch {
                toast.add({ title: "Failed to update class", type: "error" });
                return;
            }
            onOpenChange(false);
            await router.invalidate({
                filter: (match) =>
                    match.routeId ===
                        "/_authenticated/dashboard/organizations/$orgSlug" &&
                    match.params.orgSlug === orgSlug,
                sync: true,
            });
        },
    });
    function handleDelete() {
        startDeleteTransition(async () => {
            try {
                await deleteClass({ data: { orgSlug, classId: classroom.id } });
            } catch {
                toast.add({ title: "Failed to delete class", type: "error" });
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
                    <DialogTitle>Edit class</DialogTitle>
                    <DialogDescription>
                        Update {classroom.name} in {orgSlug}.
                    </DialogDescription>
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
                                            Class name
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
                                            placeholder="Enter class name"
                                            autoComplete="off"
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
                                            disabled={isSubmitting}
                                            render={
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    className="sm:mr-auto"
                                                />
                                            }
                                        >
                                            <Trash2Icon />
                                            Delete class
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Delete class?
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This will permanently delete{" "}
                                                    {classroom.name}. This
                                                    action cannot be undone.
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
                                                        : "Delete class"}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <DialogClose
                                        render={<Button variant="outline" />}
                                    >
                                        Cancel
                                    </DialogClose>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
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
