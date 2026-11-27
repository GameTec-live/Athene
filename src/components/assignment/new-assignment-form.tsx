import { revalidateLogic, useForm, useStore } from "@tanstack/react-form";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ShuffleIcon } from "lucide-react";
import { useId, useState } from "react";
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
import { RadioGroup } from "#/components/ui/radio-group";
import { toast } from "#/components/ui/toast";
import {
    createAssignment,
    type getNewAssignmentOptions,
} from "#/lib/assignments/assignments.functions";
import {
    DEFAULT_NAMING_TEMPLATES,
    renderRepoName,
    usesCustomPlaceholder,
} from "#/lib/assignments/naming";
import {
    type AssignmentFormValues,
    assignmentFormSchema,
} from "#/lib/assignments/schemas";
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
import {
    AutogradingFields,
    CheckboxField,
    DeadlineFields,
    distributeIntoGroups,
    type FieldErrors,
    FormSection,
    JoinLinkFields,
    NumberField,
    RadioOption,
    RepositoryFeaturesField,
    StudentPicker,
    TWO_COLUMNS,
} from "./form-fields";
import { NamingTemplateField } from "./naming-template-field";
import { TemplateRepositorySelect } from "./template-repository-select";

type Options = Awaited<ReturnType<typeof getNewAssignmentOptions>>;

const MAX_PREDEFINED_GROUPS = 200;

function groupName(index: number) {
    return `Team ${index + 1}`;
}

const defaultValues: AssignmentFormValues = {
    name: "",
    type: "individual",
    deadline: "",
    archiveOnDeadline: true,
    autograding: false,
    autogradeId: null,
    templateRepository: null,
    studentIsAdmin: false,
    features: {
        issues: true,
        pullRequests: true,
        wiki: true,
        projects: true,
        releases: true,
        packages: true,
    },
    namingTemplate: DEFAULT_NAMING_TEMPLATES.individual,
    joinLink: false,
    rosterRestriction: null,
    students: [],
    groupNaming: "predefined",
    groups: [groupName(0), groupName(1)],
    maxGroups: 0,
    maxGroupMembers: 0,
};

export function NewAssignmentForm({
    orgSlug,
    options,
}: {
    orgSlug: string;
    options: Options;
}) {
    const id = useId();
    const router = useRouter();
    const navigate = useNavigate();
    const [students, setStudents] = useState(
        () => new Map<number, ForgejoStudent>(),
    );
    const [creation, setCreation] = useState<CreationState | null>(null);
    const classId = options.classroom.id;

    function openAssignment(assignmentId: string) {
        return navigate({
            to: "/dashboard/organizations/$orgSlug/$classId/assignment/$assignmentId",
            params: { orgSlug, classId, assignmentId },
        });
    }

    const form = useForm({
        defaultValues,
        validationLogic: revalidateLogic(),
        validators: { onDynamic: assignmentFormSchema },
        onSubmit: async ({ value }) => {
            setCreation({ phase: "saving", items: [] });
            let result: Awaited<ReturnType<typeof createAssignment>>;
            try {
                result = await createAssignment({
                    data: {
                        orgSlug,
                        classId,
                        assignment: {
                            ...value,
                            deadline: value.deadline
                                ? new Date(value.deadline).toISOString()
                                : "",
                        },
                    },
                });
            } catch (error) {
                console.error("Failed to create assignment", error);
                setCreation(null);
                toast.add({
                    title: "Failed to create assignment",
                    description: "An unexpected error occurred.",
                    type: "error",
                });
                return;
            }
            if (!result.success) {
                setCreation(null);
                toast.add({
                    title: "Failed to create assignment",
                    description: result.error,
                    type: "error",
                });
                return;
            }

            const joinUrl = result.joinCode
                ? `${window.location.origin}/join/${result.joinCode}`
                : null;
            const outcome = await readProvisioning(result, (patch) =>
                setCreation({ phase: "provisioning", joinUrl, ...patch }),
            );

            await router.invalidate({
                filter: (match) =>
                    match.routeId ===
                    "/_authenticated/dashboard/organizations/$orgSlug/$classId/",
            });
            if (!joinUrl && !outcome.failed && !outcome.connectionLost) {
                await openAssignment(result.assignmentId);
                return;
            }
            setCreation({
                phase: "done",
                joinUrl,
                assignmentId: result.assignmentId,
                items: outcome.items,
                connectionLost: outcome.connectionLost,
            });
        },
    });

    const values = useStore(form.store, (state) => state.values);
    const fieldMeta = useStore(form.store, (state) => state.fieldMeta);
    const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
    const errorsOf = (name: string): FieldErrors =>
        (fieldMeta as Record<string, { errors?: FieldErrors } | undefined>)[
            name
        ]?.errors ?? [];

    const isGroup = values.type === "group";
    const studentNamed = isGroup && values.groupNaming === "student";
    const showMembers = !studentNamed;
    const deferred = usesCustomPlaceholder(values.namingTemplate);

    function set<K extends keyof AssignmentFormValues>(
        key: K,
        value: AssignmentFormValues[K],
    ) {
        // biome-ignore lint/suspicious/noExplicitAny: keyed setter over the form's own fields
        form.setFieldValue(key as any, value as any);
    }

    function setType(type: AssignmentFormValues["type"]) {
        const other = type === "group" ? "individual" : "group";
        if (values.namingTemplate === DEFAULT_NAMING_TEMPLATES[other]) {
            set("namingTemplate", DEFAULT_NAMING_TEMPLATES[type]);
        }
        set("type", type);
        if (type === "group" && values.groupNaming === "student") {
            set("joinLink", true);
        }
    }

    function setGroupNaming(naming: AssignmentFormValues["groupNaming"]) {
        set("groupNaming", naming);
        if (naming === "student") set("joinLink", true);
    }

    function setJoinLink(enabled: boolean) {
        set("joinLink", enabled);
        if (!enabled) set("rosterRestriction", null);
    }

    function setGroupCount(count: number) {
        const next = Array.from(
            { length: count },
            (_, index) => values.groups[index] ?? groupName(index),
        );
        set("groups", next);
        set(
            "students",
            values.students.map((student) =>
                student.group !== null && student.group >= count
                    ? { ...student, group: null }
                    : student,
            ),
        );
    }

    function addStudents(added: ForgejoStudent[]) {
        // Read the live state: a roster import resolves after later edits.
        const current = form.state.values.students;
        const present = new Set(current.map((s) => s.forgejoId));
        const fresh = added.filter((s) => !present.has(s.forgejoId));
        setStudents((previous) => {
            const next = new Map(previous);
            for (const student of fresh) next.set(student.forgejoId, student);
            return next;
        });
        set("students", [
            ...current,
            ...fresh.map((s) => ({ forgejoId: s.forgejoId, group: null })),
        ]);
        return fresh.length;
    }

    /** Assigns students without a group to the emptiest groups. */
    function distributeStudents() {
        set(
            "students",
            distributeIntoGroups(
                values.students,
                values.groups.map(() => 0),
                values.maxGroupMembers,
            ),
        );
    }

    const namingPreview = {
        assignmentName: values.name,
        className: options.classroom.name,
        orgName: options.organization.name,
    };
    const rows: MemberRow[] = values.students.flatMap((entry) => {
        const student = students.get(entry.forgejoId);
        return student ? [{ student, group: entry.group }] : [];
    });

    return (
        <form
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
                                    <Field data-invalid={invalid}>
                                        <FieldLabel htmlFor={`${id}-name`}>
                                            Name
                                        </FieldLabel>
                                        <Input
                                            id={`${id}-name`}
                                            value={field.state.value}
                                            onChange={(event) =>
                                                field.handleChange(
                                                    event.target.value,
                                                )
                                            }
                                            onBlur={field.handleBlur}
                                            aria-invalid={invalid}
                                            placeholder="Homework 1"
                                            autoComplete="off"
                                        />
                                        {invalid && (
                                            <FieldError
                                                errors={field.state.meta.errors}
                                            />
                                        )}
                                    </Field>
                                );
                            }}
                        </form.Field>

                        <DeadlineFields
                            id={id}
                            deadline={values.deadline}
                            archiveOnDeadline={values.archiveOnDeadline}
                            onDeadlineChange={(value) => set("deadline", value)}
                            onArchiveOnDeadlineChange={(checked) =>
                                set("archiveOnDeadline", checked)
                            }
                            errors={errorsOf("deadline")}
                        />
                    </FieldGroup>
                    <FieldGroup>
                        <FieldSet>
                            <FieldLegend variant="label">
                                Assignment type
                            </FieldLegend>
                            <RadioGroup
                                value={values.type}
                                onValueChange={(value) =>
                                    setType(
                                        value as AssignmentFormValues["type"],
                                    )
                                }
                            >
                                <RadioOption
                                    id={`${id}-type-individual`}
                                    value="individual"
                                    label="Individual assignment"
                                    description="Every student gets their own repository."
                                />
                                <RadioOption
                                    id={`${id}-type-group`}
                                    value="group"
                                    label="Group assignment"
                                    description="Students work in teams that share a repository."
                                />
                            </RadioGroup>
                        </FieldSet>
                    </FieldGroup>
                </div>
            </FormSection>

            {isGroup && (
                <FormSection title="Groups">
                    <div className={TWO_COLUMNS}>
                        <FieldGroup>
                            <FieldSet>
                                <FieldLegend variant="label">
                                    Group names
                                </FieldLegend>
                                <RadioGroup
                                    value={values.groupNaming}
                                    onValueChange={(value) =>
                                        setGroupNaming(
                                            value as AssignmentFormValues["groupNaming"],
                                        )
                                    }
                                >
                                    <RadioOption
                                        id={`${id}-naming-predefined`}
                                        value="predefined"
                                        label="Predefine groups"
                                        description="Groups are created now and students can be preassigned."
                                    />
                                    <RadioOption
                                        id={`${id}-naming-student`}
                                        value="student"
                                        label="Students create groups"
                                        description="The first member names the group on the join page."
                                    />
                                </RadioGroup>
                            </FieldSet>
                        </FieldGroup>
                        <FieldGroup>
                            <div className="grid gap-4 @sm:grid-cols-2">
                                {studentNamed ? (
                                    <NumberField
                                        id={`${id}-max-groups`}
                                        label="Maximum number of groups"
                                        description="0 for unlimited."
                                        value={values.maxGroups}
                                        onChange={(value) =>
                                            set("maxGroups", value)
                                        }
                                        errors={errorsOf("maxGroups")}
                                    />
                                ) : (
                                    <NumberField
                                        id={`${id}-group-count`}
                                        label="Number of groups"
                                        value={values.groups.length}
                                        min={1}
                                        onChange={(value) =>
                                            setGroupCount(
                                                Math.min(
                                                    Math.max(value, 1),
                                                    MAX_PREDEFINED_GROUPS,
                                                ),
                                            )
                                        }
                                    />
                                )}
                                <NumberField
                                    id={`${id}-max-members`}
                                    label="Maximum members per group"
                                    description="0 for unlimited."
                                    value={values.maxGroupMembers}
                                    onChange={(value) =>
                                        set("maxGroupMembers", value)
                                    }
                                    errors={errorsOf("maxGroupMembers")}
                                />
                            </div>
                            {!studentNamed && (
                                <FieldSet>
                                    <FieldLegend variant="label">
                                        Names
                                    </FieldLegend>
                                    <div className="grid grid-cols-1 gap-2 @sm:grid-cols-2">
                                        {values.groups.map((name, index) => {
                                            const errors = errorsOf(
                                                `groups[${index}]`,
                                            );
                                            return (
                                                <Input
                                                    // biome-ignore lint/suspicious/noArrayIndexKey: groups are positional
                                                    key={index}
                                                    aria-label={`Name of group ${index + 1}`}
                                                    value={name}
                                                    aria-invalid={
                                                        errors.length > 0
                                                    }
                                                    onChange={(event) =>
                                                        set(
                                                            "groups",
                                                            values.groups.map(
                                                                (
                                                                    existing,
                                                                    i,
                                                                ) =>
                                                                    i === index
                                                                        ? event
                                                                              .target
                                                                              .value
                                                                        : existing,
                                                            ),
                                                        )
                                                    }
                                                />
                                            );
                                        })}
                                    </div>
                                    <FieldError
                                        errors={[
                                            ...errorsOf("groups"),
                                            ...values.groups.flatMap(
                                                (_, index) =>
                                                    errorsOf(
                                                        `groups[${index}]`,
                                                    ),
                                            ),
                                        ]}
                                    />
                                </FieldSet>
                            )}
                        </FieldGroup>
                    </div>
                </FormSection>
            )}

            <FormSection title="Repository">
                <div className={TWO_COLUMNS}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor={`${id}-template`}>
                                Template repository
                            </FieldLabel>
                            <TemplateRepositorySelect
                                id={`${id}-template`}
                                orgSlug={orgSlug}
                                value={values.templateRepository}
                                onChange={(value) =>
                                    set("templateRepository", value)
                                }
                            />
                            <FieldDescription>
                                Leave empty to start from an empty repository.
                            </FieldDescription>
                        </Field>
                        <NamingTemplateField
                            id={`${id}-naming`}
                            value={values.namingTemplate}
                            onChange={(value) => set("namingTemplate", value)}
                            onBlur={() => {}}
                            errors={errorsOf("namingTemplate")}
                            type={values.type}
                            joinLink={values.joinLink}
                            preview={namingPreview}
                        />
                    </FieldGroup>
                    <FieldGroup>
                        <RepositoryFeaturesField
                            id={id}
                            features={values.features}
                            onChange={(features) => set("features", features)}
                        />
                        <CheckboxField
                            id={`${id}-admin`}
                            checked={values.studentIsAdmin}
                            onChange={(checked) =>
                                set("studentIsAdmin", checked)
                            }
                            label="Students are repository admins"
                            description="Otherwise students get write access."
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
                            rosters={options.rosters}
                            locked={studentNamed}
                            description={
                                studentNamed
                                    ? "Required when students create their own groups."
                                    : isGroup
                                      ? "Students pick or create a group through a shareable link."
                                      : "Students accept the assignment through a shareable link."
                            }
                            onJoinLinkChange={setJoinLink}
                            onRosterRestrictionChange={(value) =>
                                set("rosterRestriction", value)
                            }
                            errors={errorsOf("rosterRestriction")}
                        />
                    </FieldGroup>
                    <FieldGroup>
                        <AutogradingFields
                            id={id}
                            autograding={values.autograding}
                            autogradeId={values.autogradeId}
                            autogrades={options.autogrades}
                            onAutogradingChange={(checked) =>
                                set("autograding", checked)
                            }
                            onAutogradeIdChange={(value) =>
                                set("autogradeId", value)
                            }
                            errors={errorsOf("autogradeId")}
                        />
                    </FieldGroup>
                </div>
            </FormSection>

            {showMembers && (
                <FormSection
                    title="Students"
                    description={
                        deferred
                            ? "Preassigned students get their repository once they open the join link and enter a name."
                            : isGroup
                              ? "Groups and their repositories are created right away, with preassigned students added."
                              : "Repositories for preassigned students are created right away."
                    }
                >
                    <div className="space-y-3">
                        <StudentPicker
                            id={id}
                            excludeIds={
                                new Set(values.students.map((s) => s.forgejoId))
                            }
                            rosters={options.rosters}
                            onAdd={addStudents}
                        >
                            {isGroup && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={
                                        !values.students.some(
                                            (s) => s.group === null,
                                        )
                                    }
                                    onClick={distributeStudents}
                                >
                                    <ShuffleIcon data-icon="inline-start" />
                                    Fill groups
                                </Button>
                            )}
                        </StudentPicker>
                        <AssignmentMembersTable
                            rows={rows}
                            groups={values.groups}
                            showGroups={isGroup}
                            repositoryName={(row) => {
                                if (deferred) return null;
                                if (isGroup) {
                                    if (row.group === null) return "-";
                                    return renderRepoName(
                                        values.namingTemplate,
                                        {
                                            ...namingPreview,
                                            groupName: values.groups[row.group],
                                        },
                                    );
                                }
                                return renderRepoName(values.namingTemplate, {
                                    ...namingPreview,
                                    studentName: row.student.username,
                                });
                            }}
                            onGroupChange={(forgejoId, group) =>
                                set(
                                    "students",
                                    values.students.map((s) =>
                                        s.forgejoId === forgejoId
                                            ? { ...s, group }
                                            : s,
                                    ),
                                )
                            }
                            onRemove={(forgejoId) =>
                                set(
                                    "students",
                                    values.students.filter(
                                        (s) => s.forgejoId !== forgejoId,
                                    ),
                                )
                            }
                        />
                        <FieldError errors={errorsOf("students")} />
                    </div>
                </FormSection>
            )}
            <div className="flex flex-wrap items-center justify-end gap-2">
                <FieldError className="mr-auto" errors={errorsOf("joinLink")} />
                <Button
                    variant="outline"
                    nativeButton={false}
                    render={
                        <Link
                            to="/dashboard/organizations/$orgSlug/$classId"
                            params={{ orgSlug, classId }}
                        />
                    }
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating…" : "Create assignment"}
                </Button>
            </div>
            {creation && (
                <CreationProgressDialog
                    state={creation}
                    onContinue={() => {
                        if (creation.assignmentId) {
                            void openAssignment(creation.assignmentId);
                        }
                    }}
                />
            )}
        </form>
    );
}
