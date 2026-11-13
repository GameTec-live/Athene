import { revalidateLogic, useForm, useStore } from "@tanstack/react-form";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { ShuffleIcon } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "#/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "#/components/ui/card";
import { Checkbox } from "#/components/ui/checkbox";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { RadioGroup, RadioGroupItem } from "#/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select";
import { Switch } from "#/components/ui/switch";
import { toast } from "#/components/ui/toast";
import {
    createAssignment,
    type getNewAssignmentOptions,
    getRosterStudents,
} from "#/lib/assignments/assignments.functions";
import {
    DEFAULT_NAMING_TEMPLATES,
    renderRepoName,
    usesCustomPlaceholder,
} from "#/lib/assignments/naming";
import {
    ASSIGNMENT_FEATURES,
    type AssignmentFormValues,
    assignmentFormSchema,
} from "#/lib/assignments/schemas";
import type { ForgejoStudent } from "#/lib/assignments/types";
import {
    AssignmentMembersTable,
    type MemberRow,
} from "./assignment-members-table";
import {
    type CreationItem,
    CreationProgressDialog,
    type CreationState,
} from "./creation-progress-dialog";
import { NamingTemplateField } from "./naming-template-field";
import { StudentSearch } from "./student-search";
import { TemplateRepositorySelect } from "./template-repository-select";

type Options = Awaited<ReturnType<typeof getNewAssignmentOptions>>;
type FieldErrors = ({ message?: string } | undefined)[];

const MAX_PREDEFINED_GROUPS = 200;
const ANYONE = "anyone";

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
    const [addingRoster, setAddingRoster] = useState(false);
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
            const items = new Map<string, CreationItem>(
                result.repositories.map((name) => [
                    name,
                    { name, status: "pending" },
                ]),
            );
            const update = (patch: Partial<CreationState>) =>
                setCreation({
                    phase: "provisioning",
                    assignmentId: result.assignmentId,
                    joinUrl,
                    items: [...items.values()],
                    ...patch,
                });
            update({});

            let connectionLost = false;
            if (result.progress) {
                const reader = result.progress.getReader();
                try {
                    for (;;) {
                        const { done, value: event } = await reader.read();
                        if (done) break;
                        items.set(
                            event.name,
                            event.type === "started"
                                ? { name: event.name, status: "running" }
                                : event.success
                                  ? {
                                        name: event.name,
                                        status: "done",
                                        detail: event.repositoryName,
                                    }
                                  : {
                                        name: event.name,
                                        status: "failed",
                                        detail: event.error,
                                    },
                        );
                        update({});
                    }
                } catch (error) {
                    console.error("Lost repository progress updates", error);
                }
                connectionLost = [...items.values()].some(
                    (item) =>
                        item.status === "pending" || item.status === "running",
                );
            }

            await router.invalidate({
                filter: (match) =>
                    match.routeId ===
                    "/_authenticated/dashboard/organizations/$orgSlug/$classId/",
            });
            const failed = [...items.values()].some(
                (item) => item.status === "failed",
            );
            if (!joinUrl && !failed && !connectionLost) {
                await openAssignment(result.assignmentId);
                return;
            }
            update({ phase: "done", connectionLost });
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
        const present = new Set(values.students.map((s) => s.forgejoId));
        const fresh = added.filter((s) => !present.has(s.forgejoId));
        setStudents((previous) => {
            const next = new Map(previous);
            for (const student of fresh) next.set(student.forgejoId, student);
            return next;
        });
        set("students", [
            ...values.students,
            ...fresh.map((s) => ({ forgejoId: s.forgejoId, group: null })),
        ]);
        return fresh.length;
    }

    async function addRoster(rosterId: string) {
        setAddingRoster(true);
        try {
            const result = await getRosterStudents({ data: { rosterId } });
            const added = addStudents(result.students);
            toast.add({
                title: `Added ${added} ${added === 1 ? "student" : "students"}`,
                description:
                    result.skipped > 0
                        ? `${result.skipped} roster members have no Forgejo account and were skipped.`
                        : undefined,
                type: "success",
            });
        } catch {
            toast.add({ title: "Failed to add roster", type: "error" });
        } finally {
            setAddingRoster(false);
        }
    }

    /** Assigns students without a group to the emptiest groups. */
    function distributeStudents() {
        const counts = values.groups.map(
            (_, index) =>
                values.students.filter((s) => s.group === index).length,
        );
        const max = values.maxGroupMembers || Number.POSITIVE_INFINITY;
        set(
            "students",
            values.students.map((student) => {
                if (student.group !== null) return student;
                let target = -1;
                for (let index = 0; index < counts.length; index++) {
                    if (
                        counts[index] < max &&
                        (target === -1 || counts[index] < counts[target])
                    ) {
                        target = index;
                    }
                }
                if (target === -1) return student;
                counts[target]++;
                return { ...student, group: target };
            }),
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
    const rosterItems = options.rosters.map((roster) => ({
        value: roster.id,
        label: `${roster.name} (${roster.memberCount})`,
    }));

    return (
        <form
            className="@container space-y-6"
            onSubmit={(event) => {
                event.preventDefault();
                form.handleSubmit();
            }}
        >
            <div className="grid grid-cols-1 gap-6 @4xl:grid-cols-2">
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <form.Field name="name">
                                    {(field) => {
                                        const invalid =
                                            field.state.meta.errors.length > 0;
                                        return (
                                            <Field data-invalid={invalid}>
                                                <FieldLabel
                                                    htmlFor={`${id}-name`}
                                                >
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
                                                        errors={
                                                            field.state.meta
                                                                .errors
                                                        }
                                                    />
                                                )}
                                            </Field>
                                        );
                                    }}
                                </form.Field>

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

                                <Field
                                    data-invalid={
                                        errorsOf("deadline").length > 0
                                    }
                                >
                                    <FieldLabel htmlFor={`${id}-deadline`}>
                                        Deadline
                                    </FieldLabel>
                                    <Input
                                        id={`${id}-deadline`}
                                        type="datetime-local"
                                        value={values.deadline}
                                        onChange={(event) =>
                                            set("deadline", event.target.value)
                                        }
                                        aria-invalid={
                                            errorsOf("deadline").length > 0
                                        }
                                    />
                                    <FieldDescription>
                                        Leave empty for no deadline. Joining via
                                        link closes at the deadline.
                                    </FieldDescription>
                                    <FieldError errors={errorsOf("deadline")} />
                                </Field>
                                {values.deadline && (
                                    <CheckboxField
                                        id={`${id}-archive`}
                                        checked={values.archiveOnDeadline}
                                        onChange={(checked) =>
                                            set("archiveOnDeadline", checked)
                                        }
                                        label="Archive repositories on deadline"
                                    />
                                )}
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    {isGroup && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Groups</CardTitle>
                            </CardHeader>
                            <CardContent>
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
                                        <>
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
                                            <FieldSet>
                                                <FieldLegend variant="label">
                                                    Names
                                                </FieldLegend>
                                                <div className="grid grid-cols-1 gap-2 @md:grid-cols-2">
                                                    {values.groups.map(
                                                        (name, index) => {
                                                            const errors =
                                                                errorsOf(
                                                                    `groups[${index}]`,
                                                                );
                                                            return (
                                                                <Input
                                                                    // biome-ignore lint/suspicious/noArrayIndexKey: groups are positional
                                                                    key={index}
                                                                    aria-label={`Name of group ${index + 1}`}
                                                                    value={name}
                                                                    aria-invalid={
                                                                        errors.length >
                                                                        0
                                                                    }
                                                                    onChange={(
                                                                        event,
                                                                    ) =>
                                                                        set(
                                                                            "groups",
                                                                            values.groups.map(
                                                                                (
                                                                                    existing,
                                                                                    i,
                                                                                ) =>
                                                                                    i ===
                                                                                    index
                                                                                        ? event
                                                                                              .target
                                                                                              .value
                                                                                        : existing,
                                                                            ),
                                                                        )
                                                                    }
                                                                />
                                                            );
                                                        },
                                                    )}
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
                                        </>
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
                                </FieldGroup>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Repository</CardTitle>
                        </CardHeader>
                        <CardContent>
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
                                        Leave empty to start from an empty
                                        repository.
                                    </FieldDescription>
                                </Field>
                                <NamingTemplateField
                                    id={`${id}-naming`}
                                    value={values.namingTemplate}
                                    onChange={(value) =>
                                        set("namingTemplate", value)
                                    }
                                    onBlur={() => {}}
                                    errors={errorsOf("namingTemplate")}
                                    type={values.type}
                                    joinLink={values.joinLink}
                                    preview={namingPreview}
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
                                <FieldSet>
                                    <FieldLegend variant="label">
                                        Repository features
                                    </FieldLegend>
                                    <div className="grid grid-cols-2 gap-3 @md:grid-cols-3">
                                        {ASSIGNMENT_FEATURES.map((feature) => (
                                            <CheckboxField
                                                key={feature.key}
                                                id={`${id}-feature-${feature.key}`}
                                                checked={
                                                    values.features[feature.key]
                                                }
                                                onChange={(checked) =>
                                                    set("features", {
                                                        ...values.features,
                                                        [feature.key]: checked,
                                                    })
                                                }
                                                label={feature.label}
                                            />
                                        ))}
                                    </div>
                                </FieldSet>
                            </FieldGroup>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Access &amp; grading</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FieldGroup>
                                <Field orientation="horizontal">
                                    <Switch
                                        id={`${id}-join`}
                                        checked={values.joinLink}
                                        disabled={studentNamed}
                                        onCheckedChange={setJoinLink}
                                    />
                                    <FieldContent>
                                        <FieldLabel htmlFor={`${id}-join`}>
                                            Join via link
                                        </FieldLabel>
                                        <FieldDescription>
                                            {studentNamed
                                                ? "Required when students create their own groups."
                                                : isGroup
                                                  ? "Students pick or create a group through a shareable link."
                                                  : "Students accept the assignment through a shareable link."}
                                        </FieldDescription>
                                    </FieldContent>
                                </Field>
                                {values.joinLink && (
                                    <Field
                                        data-invalid={
                                            errorsOf("rosterRestriction")
                                                .length > 0
                                        }
                                    >
                                        <FieldLabel htmlFor={`${id}-restrict`}>
                                            Restrict joining to roster
                                        </FieldLabel>
                                        <Select
                                            items={[
                                                {
                                                    value: ANYONE,
                                                    label: "Anyone with the link",
                                                },
                                                ...rosterItems,
                                            ]}
                                            value={
                                                values.rosterRestriction ??
                                                ANYONE
                                            }
                                            onValueChange={(value) =>
                                                set(
                                                    "rosterRestriction",
                                                    value && value !== ANYONE
                                                        ? value
                                                        : null,
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                id={`${id}-restrict`}
                                                className="w-full"
                                            >
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={ANYONE}>
                                                    Anyone with the link
                                                </SelectItem>
                                                {rosterItems.map((item) => (
                                                    <SelectItem
                                                        key={item.value}
                                                        value={item.value}
                                                    >
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FieldError
                                            errors={errorsOf(
                                                "rosterRestriction",
                                            )}
                                        />
                                    </Field>
                                )}
                                <CheckboxField
                                    id={`${id}-autograding`}
                                    checked={values.autograding}
                                    onChange={(checked) =>
                                        set("autograding", checked)
                                    }
                                    label="Autograding"
                                />
                                {values.autograding && (
                                    <Field
                                        data-invalid={
                                            errorsOf("autogradeId").length > 0
                                        }
                                    >
                                        <FieldLabel
                                            htmlFor={`${id}-autograde-config`}
                                        >
                                            Autograding config
                                        </FieldLabel>
                                        <Select
                                            items={options.autogrades.map(
                                                (config) => ({
                                                    value: config.id,
                                                    label: config.name,
                                                }),
                                            )}
                                            value={values.autogradeId}
                                            onValueChange={(value) =>
                                                set("autogradeId", value)
                                            }
                                        >
                                            <SelectTrigger
                                                id={`${id}-autograde-config`}
                                                className="w-full"
                                                aria-invalid={
                                                    errorsOf("autogradeId")
                                                        .length > 0
                                                }
                                            >
                                                <SelectValue placeholder="Select a config" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {options.autogrades.map(
                                                    (config) => (
                                                        <SelectItem
                                                            key={config.id}
                                                            value={config.id}
                                                        >
                                                            {config.name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {options.autogrades.length === 0 && (
                                            <FieldDescription>
                                                No autograding configs exist
                                                yet.
                                            </FieldDescription>
                                        )}
                                        <FieldError
                                            errors={errorsOf("autogradeId")}
                                        />
                                    </Field>
                                )}
                            </FieldGroup>
                        </CardContent>
                    </Card>
                </div>
            </div>
            {showMembers && (
                <Card>
                    <CardHeader>
                        <CardTitle>Students</CardTitle>
                        <CardDescription>
                            {deferred
                                ? "Preassigned students get their repository once they open the join link and enter a name."
                                : isGroup
                                  ? "Groups and their repositories are created right away, with preassigned students added."
                                  : "Repositories for preassigned students are created right away."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex flex-col gap-2 @2xl:flex-row">
                            <div className="flex-1">
                                <StudentSearch
                                    id={`${id}-student-search`}
                                    excludeIds={
                                        new Set(
                                            values.students.map(
                                                (s) => s.forgejoId,
                                            ),
                                        )
                                    }
                                    onSelect={(student) =>
                                        addStudents([student])
                                    }
                                />
                            </div>
                            <Select
                                items={rosterItems}
                                value={null}
                                disabled={
                                    addingRoster || rosterItems.length === 0
                                }
                                onValueChange={(value) => {
                                    if (value) void addRoster(value);
                                }}
                            >
                                <SelectTrigger
                                    className="w-full @2xl:w-56"
                                    aria-label="Add students from roster"
                                >
                                    <SelectValue
                                        placeholder={
                                            addingRoster
                                                ? "Adding roster…"
                                                : rosterItems.length === 0
                                                  ? "No rosters"
                                                  : "Add from roster"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {rosterItems.map((item) => (
                                        <SelectItem
                                            key={item.value}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                        </div>
                        <AssignmentMembersTable
                            rows={rows}
                            groups={values.groups}
                            showGroups={isGroup}
                            repositoryName={(row) => {
                                if (deferred) return null;
                                if (isGroup) {
                                    if (row.group === null) return "—";
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
                    </CardContent>
                </Card>
            )}
            <FieldError errors={errorsOf("joinLink")} />
            <div className="flex justify-end gap-2">
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

function RadioOption({
    id,
    value,
    label,
    description,
}: {
    id: string;
    value: string;
    label: string;
    description: string;
}) {
    return (
        <Field orientation="horizontal">
            <RadioGroupItem id={id} value={value} />
            <FieldContent>
                <FieldLabel htmlFor={id}>{label}</FieldLabel>
                <FieldDescription>{description}</FieldDescription>
            </FieldContent>
        </Field>
    );
}

function CheckboxField({
    id,
    checked,
    onChange,
    label,
    description,
}: {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description?: string;
}) {
    return (
        <Field orientation="horizontal">
            <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
            {description ? (
                <FieldContent>
                    <FieldLabel htmlFor={id}>{label}</FieldLabel>
                    <FieldDescription>{description}</FieldDescription>
                </FieldContent>
            ) : (
                <FieldLabel htmlFor={id}>{label}</FieldLabel>
            )}
        </Field>
    );
}

function NumberField({
    id,
    label,
    description,
    value,
    min = 0,
    onChange,
    errors = [],
}: {
    id: string;
    label: string;
    description?: string;
    value: number;
    min?: number;
    onChange: (value: number) => void;
    errors?: FieldErrors;
}) {
    const [text, setText] = useState(String(value));
    // Keep the text in sync when the value changes from elsewhere.
    if (text !== "" && Number(text) !== value) setText(String(value));

    return (
        <Field data-invalid={errors.length > 0}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Input
                id={id}
                type="number"
                inputMode="numeric"
                min={min}
                step={1}
                value={text}
                className="w-32"
                aria-invalid={errors.length > 0}
                onChange={(event) => {
                    setText(event.target.value);
                    const parsed = Number.parseInt(event.target.value, 10);
                    if (!Number.isNaN(parsed)) onChange(parsed);
                }}
                onBlur={() => setText(String(value))}
            />
            {description && <FieldDescription>{description}</FieldDescription>}
            <FieldError errors={errors} />
        </Field>
    );
}
