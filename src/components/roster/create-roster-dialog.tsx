import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import * as v from "valibot";
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
import { Field, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { toast } from "#/components/ui/toast";
import { rosterNameSchema } from "#/lib/common-schemas";
import { createRoster } from "#/lib/rosters.functions";

export function CreateRosterDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const router = useRouter();
    const form = useForm({
        defaultValues: { name: "" },
        validators: {
            onSubmit: v.object({
                name: rosterNameSchema,
            }),
        },
        onSubmit: async ({ value, formApi }) => {
            try {
                const roster = await createRoster({ data: value });
                onOpenChange(false);
                formApi.reset();
                await router.invalidate({
                    filter: (match) =>
                        match.routeId === "/_authenticated/dashboard/rosters",
                    sync: true,
                });
                await router.navigate({
                    to: "/dashboard/rosters/$rosterId",
                    params: { rosterId: roster.id },
                });
            } catch {
                toast.add({ title: "Could not create roster", type: "error" });
            }
        },
    });
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create roster</DialogTitle>
                    <DialogDescription>
                        Create a roster to manage a group of students.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        form.handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <form.Field name="name">
                        {(field) => (
                            <Field>
                                <FieldLabel htmlFor="roster-name">
                                    Roster name
                                </FieldLabel>
                                <Input
                                    id="roster-name"
                                    required
                                    maxLength={255}
                                    value={field.state.value}
                                    onChange={(event) =>
                                        field.handleChange(event.target.value)
                                    }
                                />
                            </Field>
                        )}
                    </form.Field>
                    <DialogFooter>
                        <DialogClose render={<Button variant="outline" />}>
                            Cancel
                        </DialogClose>
                        <form.Subscribe
                            selector={(state) => state.isSubmitting}
                        >
                            {(pending) => (
                                <Button type="submit" disabled={pending}>
                                    {pending ? "Creating…" : "Create roster"}
                                </Button>
                            )}
                        </form.Subscribe>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
