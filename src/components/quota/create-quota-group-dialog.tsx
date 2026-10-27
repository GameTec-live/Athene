import { useForm } from "@tanstack/react-form";
import { PlusIcon } from "lucide-react";
import { useId, useState } from "react";
import * as v from "valibot";
import { Button } from "#/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "#/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { quotaNameSchema } from "#/lib/forgejo/quota-schemas";
import { createQuotaGroup } from "#/lib/forgejo/quotas";
import { useQuotaAction } from "./use-quota-action";

export function CreateQuotaGroupDialog({ names }: { names: string[] }) {
    const id = useId();
    const [open, setOpen] = useState(false);
    const { execute } = useQuotaAction();
    const form = useForm({
        defaultValues: { name: "" },
        onSubmit: ({ value }) =>
            execute("Failed to create quota group", async () => {
                await createQuotaGroup({ data: value });
                setOpen(false);
            }),
    });

    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <Dialog
                    open={open}
                    onOpenChange={(open) => {
                        if (isSubmitting) return;
                        if (open) form.reset();
                        setOpen(open);
                    }}
                >
                    <DialogTrigger render={<Button />}>
                        <PlusIcon />
                        Create quota group
                    </DialogTrigger>
                    <DialogContent aria-describedby={undefined}>
                        <DialogHeader>
                            <DialogTitle>Create quota group</DialogTitle>
                        </DialogHeader>
                        <form
                            className="space-y-4"
                            noValidate
                            onSubmit={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                form.handleSubmit();
                            }}
                        >
                            <form.Field
                                name="name"
                                validators={{
                                    onSubmit: v.pipe(
                                        quotaNameSchema,
                                        v.check(
                                            (name) =>
                                                !names.some(
                                                    (existing) =>
                                                        existing.toLowerCase() ===
                                                        name.toLowerCase(),
                                                ),
                                            "A quota group with this name already exists.",
                                        ),
                                    ),
                                }}
                            >
                                {(field) => (
                                    <Field
                                        data-invalid={!field.state.meta.isValid}
                                    >
                                        <FieldLabel htmlFor={id}>
                                            Group name
                                        </FieldLabel>
                                        <Input
                                            id={id}
                                            name={field.name}
                                            value={field.state.value}
                                            onChange={(event) =>
                                                field.handleChange(
                                                    event.target.value,
                                                )
                                            }
                                            onBlur={field.handleBlur}
                                            placeholder="e.g. students"
                                            disabled={isSubmitting}
                                            aria-invalid={
                                                !field.state.meta.isValid
                                            }
                                            autoComplete="off"
                                        />
                                        <FieldError
                                            errors={field.state.meta.errors}
                                        />
                                    </Field>
                                )}
                            </form.Field>
                            <DialogFooter>
                                <DialogClose
                                    disabled={isSubmitting}
                                    render={<Button variant="outline" />}
                                >
                                    Cancel
                                </DialogClose>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting
                                        ? "Creating…"
                                        : "Create group"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </form.Subscribe>
    );
}
