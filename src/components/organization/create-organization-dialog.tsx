import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { useId } from "react";
import type * as v from "valibot";
import { createOrganizationSchema } from "#/lib/common-schemas";
import { createOrganization } from "#/lib/forgejo/orgs";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { toast } from "../ui/toast";

const visibilityOptions = [
    { value: "public", label: "Public" },
    { value: "limited", label: "Limited" },
    { value: "private", label: "Private" },
];

export function CreateOrganizationDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create organization</DialogTitle>
                    <DialogDescription>
                        Create an organization to manage your classes.
                    </DialogDescription>
                </DialogHeader>
                <CreateOrganizationForm onCreated={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}

function CreateOrganizationForm({ onCreated }: { onCreated: () => void }) {
    const router = useRouter();
    const id = useId();
    const defaultValues: v.InferOutput<typeof createOrganizationSchema> = {
        name: "",
        visibility: "limited",
        repoAdminChangeTeamAccess: false,
    };
    const form = useForm({
        defaultValues,
        validators: { onSubmit: createOrganizationSchema },
        onSubmit: async ({ value }) => {
            try {
                const result = await createOrganization({ data: value });
                if (!result.success) {
                    toast.add({
                        title: "Failed to create organization",
                        description: result.error,
                        type: "error",
                    });
                    return;
                }
            } catch {
                toast.add({
                    title: "Failed to create organization",
                    type: "error",
                });
                return;
            }
            onCreated();
            await router.invalidate({
                filter: (match) =>
                    match.routeId === "/_authenticated/dashboard/organizations",
                sync: true,
            });
        },
    });

    return (
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
                                <FieldLabel htmlFor={`${id}-name`}>
                                    Organization name
                                </FieldLabel>
                                <Input
                                    id={`${id}-name`}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(event) =>
                                        field.handleChange(event.target.value)
                                    }
                                    aria-invalid={isInvalid}
                                    placeholder="Enter organization name"
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
                <form.Field name="visibility">
                    {(field) => (
                        <Field>
                            <FieldLabel htmlFor={`${id}-visibility`}>
                                Visibility
                            </FieldLabel>
                            <Select
                                name={field.name}
                                items={visibilityOptions}
                                value={field.state.value}
                                onValueChange={(value) => {
                                    if (value) field.handleChange(value);
                                }}
                            >
                                <SelectTrigger
                                    id={`${id}-visibility`}
                                    className="w-full"
                                    onBlur={field.handleBlur}
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {visibilityOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    )}
                </form.Field>
                <form.Field name="repoAdminChangeTeamAccess">
                    {(field) => (
                        <Field orientation="horizontal">
                            <Checkbox
                                id={`${id}-team-access`}
                                name={field.name}
                                checked={field.state.value}
                                onCheckedChange={field.handleChange}
                                onBlur={field.handleBlur}
                            />
                            <FieldLabel htmlFor={`${id}-team-access`}>
                                Repository admin can add and remove access for
                                teams
                            </FieldLabel>
                        </Field>
                    )}
                </form.Field>
                <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>
                        Cancel
                    </DialogClose>
                    <form.Subscribe selector={(state) => state.isSubmitting}>
                        {(isSubmitting) => (
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting
                                    ? "Creating…"
                                    : "Create organization"}
                            </Button>
                        )}
                    </form.Subscribe>
                </DialogFooter>
            </FieldGroup>
        </form>
    );
}
