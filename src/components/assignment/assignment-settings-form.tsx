import { revalidateLogic, useForm, useStore } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { type ReactNode, useId } from "react";
import * as v from "valibot";
import { Button } from "#/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { toast } from "#/components/ui/toast";
import {
    type AssignmentDetails,
    updateAssignment,
} from "#/lib/assignments/details.functions";
import { usesCustomPlaceholder } from "#/lib/assignments/naming";
import {
    type AssignmentSettingsValues,
    assignmentSettingsSchema,
    FUTURE_DEADLINE_MESSAGE,
} from "#/lib/assignments/schemas";
import { JoinLink } from "./creation-progress-dialog";
import {
    AutogradingFields,
    CheckboxField,
    DeadlineFields,
    type FieldErrors,
    FormSection,
    JoinLinkFields,
    NumberField,
    ReadOnlyField,
    RepositoryFeaturesField,
    TWO_COLUMNS,
} from "./form-fields";
import { RepositoryLink } from "./repository-link";

/** Formats a date as the local value a `datetime-local` input expects. */
function toLocalInput(date: Date) {
    const pad = (value: number) => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function toFormValues(
    a: AssignmentDetails["assignment"],
): AssignmentSettingsValues {
    return {
        name: a.name,
        deadline: a.deadline ? toLocalInput(a.deadline) : "",
        archiveOnDeadline: a.deadline ? a.archiveOnDeadline : true,
        autograding: a.autogradeId !== null,
        autogradeId: a.autogradeId,
        features: a.features,
        joinLink: a.joinUrl !== null,
        rosterRestriction: a.rosterRestriction,
        maxGroups: a.maxGroups ?? 0,
        maxGroupMembers: a.maxGroupMembers ?? 0,
    };
}

/**
 * Settings of an existing assignment, laid out like the creation form. Only
 * what can still change is editable; the rest is shown for reference. While
 * there are unsaved edits, a save bar sticks to the bottom of the page.
 */
export function AssignmentSettingsForm({
    orgSlug,
    details,
    children,
}: {
    orgSlug: string;
    details: AssignmentDetails;
    /** Rendered between the settings and the save bar, which stays last. */
    children?: ReactNode;
}) {
    const id = useId();
    const router = useRouter();
    const a = details.assignment;
    const archived = a.archivedAt !== null;
    const isGroup = a.type === "group";
    const studentNamed = a.allowCreatingGroups;
    const customNames = usesCustomPlaceholder(a.namingTemplate);
    const initial = toFormValues(a);

    const form = useForm({
        defaultValues: initial,
        validationLogic: revalidateLogic(),
        validators: {
            // A past deadline may stay as it is, but not be newly set.
            onDynamic: v.pipe(
                assignmentSettingsSchema,
                v.forward(
                    v.check(
                        (input) =>
                            input.deadline === "" ||
                            input.deadline === initial.deadline ||
                            Date.parse(input.deadline) > Date.now(),
                        FUTURE_DEADLINE_MESSAGE,
                    ),
                    ["deadline"],
                ),
            ),
        },
        onSubmit: async ({ value }) => {
            let result: Awaited<ReturnType<typeof updateAssignment>>;
            try {
                result = await updateAssignment({
                    data: {
                        orgSlug,
                        classId: details.classroom.id,
                        assignmentId: a.id,
                        settings: {
                            ...value,
                            deadline: value.deadline
                                ? new Date(value.deadline).toISOString()
                                : "",
                        },
                    },
                });
            } catch (error) {
                console.error("Failed to update assignment", error);
                toast.add({
                    title: "Failed to save changes",
                    description: "An unexpected error occurred.",
                    type: "error",
                });
                return;
            }
            if (!result.success) {
                toast.add({
                    title: "Failed to save changes",
                    description: result.error,
                    type: "error",
                });
                return;
            }
            const failed = result.failedRepositories;
            toast.add(
                failed.length > 0
                    ? {
                          title: "Changes saved with errors",
                          description: `Repository features could not be updated for ${failed.join(", ")}. Save again to retry.`,
                          type: "warning",
                      }
                    : { title: "Changes saved", type: "success" },
            );
            form.reset(value);
            await router.invalidate();
        },
    });

    const values = useStore(form.store, (state) => state.values);
    const fieldMeta = useStore(form.store, (state) => state.fieldMeta);
    const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
    const unchanged = useStore(form.store, (state) => state.isDefaultValue);
    const errorsOf = (name: string): FieldErrors =>
        (fieldMeta as Record<string, { errors?: FieldErrors } | undefined>)[
            name
        ]?.errors ?? [];

    function set<K extends keyof AssignmentSettingsValues>(
        key: K,
        value: AssignmentSettingsValues[K],
    ) {
        // biome-ignore lint/suspicious/noExplicitAny: keyed setter over the form's own fields
        form.setFieldValue(key as any, value as any);
    }

    return (
        <>
            <form
                id={id}
                className="@container space-y-6"
                onSubmit={(event) => {
                    event.preventDefault();
                    form.handleSubmit();
                }}
            >
                <FormSection title="Details">
                    <div className={TWO_COLUMNS}>
                        <FieldGroup>
                            <form.Field name="name">
                                {(field) => {
                                    const invalid =
                                        field.state.meta.errors.length > 0;
                                    return (
                                        <Field
                                            data-invalid={invalid}
                                            data-disabled={archived}
                                        >
                                            <FieldLabel htmlFor={`${id}-name`}>
                                                Name
                                            </FieldLabel>
                                            <Input
                                                id={`${id}-name`}
                                                value={field.state.value}
                                                disabled={archived}
                                                onChange={(event) =>
                                                    field.handleChange(
                                                        event.target.value,
                                                    )
                                                }
                                                onBlur={field.handleBlur}
                                                aria-invalid={invalid}
                                                autoComplete="off"
                                            />
                                            <FieldDescription>
                                                Existing repositories keep their
                                                names.
                                            </FieldDescription>
                                            {invalid && (
                                                <FieldError
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                />
                                            )}
                                        </Field>
                                    );
                                }}
                            </form.Field>
                        </FieldGroup>
                        <FieldGroup>
                            <DeadlineFields
                                id={id}
                                deadline={values.deadline}
                                archiveOnDeadline={values.archiveOnDeadline}
                                onDeadlineChange={(value) =>
                                    set("deadline", value)
                                }
                                onArchiveOnDeadlineChange={(checked) =>
                                    set("archiveOnDeadline", checked)
                                }
                                errors={errorsOf("deadline")}
                                disabled={archived}
                            />
                        </FieldGroup>
                    </div>
                </FormSection>

                {isGroup && (
                    <FormSection
                        title="Groups"
                        description={
                            studentNamed
                                ? "Students create and name their groups on the join page."
                                : "Groups are predefined by the teacher. Add more with the Add button in the students list."
                        }
                    >
                        <div className={TWO_COLUMNS}>
                            <FieldGroup>
                                <div className="grid gap-4 @sm:grid-cols-2">
                                    {studentNamed && (
                                        <NumberField
                                            id={`${id}-max-groups`}
                                            label="Maximum number of groups"
                                            description="0 for unlimited."
                                            value={values.maxGroups}
                                            onChange={(value) =>
                                                set("maxGroups", value)
                                            }
                                            errors={errorsOf("maxGroups")}
                                            disabled={archived}
                                        />
                                    )}
                                    <NumberField
                                        id={`${id}-max-members`}
                                        label="Maximum members per group"
                                        description="0 for unlimited. Existing members stay."
                                        value={values.maxGroupMembers}
                                        onChange={(value) =>
                                            set("maxGroupMembers", value)
                                        }
                                        errors={errorsOf("maxGroupMembers")}
                                        disabled={archived}
                                    />
                                </div>
                            </FieldGroup>
                            <FieldGroup>
                                <FieldSet>
                                    <FieldLegend variant="label">
                                        Groups ({details.groups.length})
                                    </FieldLegend>
                                    {details.groups.length === 0 ? (
                                        <FieldDescription>
                                            No groups yet.
                                        </FieldDescription>
                                    ) : (
                                        <ul className="max-h-72 divide-y overflow-y-auto rounded-lg border">
                                            {details.groups.map((group) => (
                                                <li
                                                    key={group.id}
                                                    className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2"
                                                >
                                                    <span className="min-w-0 truncate">
                                                        {group.name}{" "}
                                                        <span className="text-muted-foreground">
                                                            ({group.memberCount}
                                                            {a.maxGroupMembers
                                                                ? ` / ${a.maxGroupMembers}`
                                                                : ""}
                                                            )
                                                        </span>
                                                    </span>
                                                    <span className="ml-auto min-w-0">
                                                        <RepositoryLink
                                                            repository={group}
                                                        />
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </FieldSet>
                            </FieldGroup>
                        </div>
                    </FormSection>
                )}

                <FormSection title="Repository">
                    <div className={TWO_COLUMNS}>
                        <FieldGroup>
                            <ReadOnlyField
                                id={`${id}-template`}
                                label="Template repository"
                                value={
                                    a.templateRepository ?? "Empty repository"
                                }
                            />
                            <ReadOnlyField
                                id={`${id}-naming`}
                                label="Repository name"
                                value={a.namingTemplate}
                                mono
                            />
                        </FieldGroup>
                        <FieldGroup>
                            <RepositoryFeaturesField
                                id={id}
                                features={values.features}
                                onChange={(features) =>
                                    set("features", features)
                                }
                                description="Changes apply to all existing repositories."
                                disabled={archived}
                            />
                            <CheckboxField
                                id={`${id}-admin`}
                                checked={a.studentIsAdmin}
                                onChange={() => {}}
                                label="Students are repository admins"
                                description="Otherwise students get write access."
                                disabled
                            />
                        </FieldGroup>
                    </div>
                </FormSection>

                <FormSection title="Access & grading">
                    <div className={TWO_COLUMNS}>
                        <FieldGroup>
                            <JoinLinkFields
                                id={id}
                                joinLink={values.joinLink}
                                rosterRestriction={values.rosterRestriction}
                                rosters={details.rosters}
                                locked={studentNamed || customNames}
                                description={
                                    studentNamed
                                        ? "Required when students create their own groups."
                                        : customNames
                                          ? "Required because students enter part of the repository name."
                                          : isGroup
                                            ? "Students pick or create a group through a shareable link."
                                            : "Students accept the assignment through a shareable link."
                                }
                                onJoinLinkChange={(enabled) => {
                                    set("joinLink", enabled);
                                    if (!enabled)
                                        set("rosterRestriction", null);
                                }}
                                onRosterRestrictionChange={(value) =>
                                    set("rosterRestriction", value)
                                }
                                errors={errorsOf("rosterRestriction")}
                                disabled={archived}
                            >
                                {a.joinUrl ? (
                                    <JoinLink url={a.joinUrl} />
                                ) : (
                                    <FieldDescription>
                                        A join link is created when you save.
                                    </FieldDescription>
                                )}
                            </JoinLinkFields>
                        </FieldGroup>
                        <FieldGroup>
                            <AutogradingFields
                                id={id}
                                autograding={values.autograding}
                                autogradeId={values.autogradeId}
                                autogrades={details.autogrades}
                                onAutogradingChange={(checked) =>
                                    set("autograding", checked)
                                }
                                onAutogradeIdChange={(value) =>
                                    set("autogradeId", value)
                                }
                                errors={errorsOf("autogradeId")}
                                disabled={archived}
                            />
                        </FieldGroup>
                    </div>
                </FormSection>
            </form>
            {children}
            {!archived && !unchanged && (
                // Last on the page, so it never hides content at the end. The
                // negative margins span the dashboard layout's p-6 padding.
                <div className="sticky bottom-0 z-10 -mx-6 -mb-6 flex flex-wrap items-center gap-2 border-t bg-background/95 px-6 py-3 backdrop-blur-sm animate-in fade-in-0 slide-in-from-bottom-2">
                    <span className="mr-auto text-muted-foreground">
                        You have unsaved changes.
                    </span>
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() => form.reset()}
                    >
                        Discard
                    </Button>
                    <Button type="submit" form={id} disabled={isSubmitting}>
                        {isSubmitting ? "Saving…" : "Save changes"}
                    </Button>
                </div>
            )}
        </>
    );
}
