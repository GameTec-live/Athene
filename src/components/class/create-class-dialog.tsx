import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import * as v from "valibot";
import { createClass } from "#/lib/classes.functions";
import { classNameSchema } from "#/lib/common-schemas";
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

export function CreateClassDialog({
    orgSlug,
    open,
    onOpenChange,
}: {
    orgSlug: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create class</DialogTitle>
                    <DialogDescription>
                        Add a class to {orgSlug}.
                    </DialogDescription>
                </DialogHeader>
                <CreateClassForm
                    orgSlug={orgSlug}
                    onCreated={() => onOpenChange(false)}
                />
            </DialogContent>
        </Dialog>
    );
}

function CreateClassForm({
    orgSlug,
    onCreated,
}: {
    orgSlug: string;
    onCreated: () => void;
}) {
    const router = useRouter();
    const form = useForm({
        defaultValues: { name: "" },
        validators: {
            onSubmit: v.object({
                name: classNameSchema,
            }),
        },
        onSubmit: async ({ value }) => {
            try {
                await createClass({ data: { orgSlug, ...value } });
            } catch {
                toast.add({
                    title: "Failed to create class",
                    type: "error",
                });
                return { errors: { name: ["Failed to create class"] } };
            }
            onCreated();
            await router.invalidate({
                filter: (match) =>
                    match.routeId ===
                        "/_authenticated/dashboard/organizations/$orgSlug" &&
                    match.params.orgSlug === orgSlug,
                sync: true,
            });
        },
    });

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
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
                                <FieldLabel htmlFor={field.name}>
                                    Class name
                                </FieldLabel>
                                <Input
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
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

                <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>
                        Cancel
                    </DialogClose>
                    <form.Subscribe selector={(state) => state.isSubmitting}>
                        {(isSubmitting) => (
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Creating…" : "Create class"}
                            </Button>
                        )}
                    </form.Subscribe>
                </DialogFooter>
            </FieldGroup>
        </form>
    );
}
