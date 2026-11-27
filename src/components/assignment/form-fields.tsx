import { type ReactNode, useState } from "react";
import {
    Card,
    CardAction,
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
    FieldLabel,
    FieldLegend,
    FieldSet,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { RadioGroupItem } from "#/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select";
import { Switch } from "#/components/ui/switch";
import { toast } from "#/components/ui/toast";
import { getRosterStudents } from "#/lib/assignments/assignments.functions";
import {
    ASSIGNMENT_FEATURES,
    type AssignmentFeatures,
} from "#/lib/assignments/schemas";
import type { ForgejoStudent } from "#/lib/assignments/types";
import { StudentSearch } from "./student-search";

/**
 * Building blocks shared by the new assignment form and the assignment
 * details page, so both keep the same layout.
 */

export type FieldErrors = ({ message?: string } | undefined)[];

type Roster = { id: string; name: string; memberCount: number };
type AutogradeConfig = { id: string; name: string };

const ANYONE = "anyone";

/** Side-by-side field columns inside a section card on wide forms. */
export const TWO_COLUMNS = "grid gap-4 @3xl:grid-cols-2 @3xl:gap-x-8";

/** A titled card holding one section of the form. */
export function FormSection({
    title,
    description,
    action,
    children,
}: {
    title: string;
    description?: ReactNode;
    action?: ReactNode;
    children: ReactNode;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                {description && (
                    <CardDescription>{description}</CardDescription>
                )}
                {action && <CardAction>{action}</CardAction>}
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

export function RadioOption({
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

export function CheckboxField({
    id,
    checked,
    onChange,
    label,
    description,
    disabled,
}: {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
    description?: string;
    disabled?: boolean;
}) {
    return (
        <Field orientation="horizontal" data-disabled={disabled}>
            <Checkbox
                id={id}
                checked={checked}
                disabled={disabled}
                onCheckedChange={onChange}
            />
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

export function NumberField({
    id,
    label,
    description,
    value,
    min = 0,
    onChange,
    errors = [],
    disabled,
}: {
    id: string;
    label: string;
    description?: string;
    value: number;
    min?: number;
    onChange: (value: number) => void;
    errors?: FieldErrors;
    disabled?: boolean;
}) {
    const [text, setText] = useState(String(value));
    // Keep the text in sync when the value changes from elsewhere.
    if (text !== "" && Number(text) !== value) setText(String(value));

    return (
        <Field data-invalid={errors.length > 0} data-disabled={disabled}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Input
                id={id}
                type="number"
                inputMode="numeric"
                min={min}
                step={1}
                value={text}
                disabled={disabled}
                className="max-w-32"
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

/** A setting fixed at creation, shown read-only for reference. */
export function ReadOnlyField({
    id,
    label,
    value,
    mono,
}: {
    id: string;
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <Field data-disabled>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <Input
                id={id}
                value={value}
                readOnly
                disabled
                className={mono ? "font-mono" : undefined}
            />
        </Field>
    );
}

export function DeadlineFields({
    id,
    deadline,
    archiveOnDeadline,
    onDeadlineChange,
    onArchiveOnDeadlineChange,
    errors,
    disabled,
}: {
    id: string;
    /** Local `datetime-local` value, empty for no deadline. */
    deadline: string;
    archiveOnDeadline: boolean;
    onDeadlineChange: (deadline: string) => void;
    onArchiveOnDeadlineChange: (archive: boolean) => void;
    errors: FieldErrors;
    disabled?: boolean;
}) {
    return (
        <>
            <Field data-invalid={errors.length > 0} data-disabled={disabled}>
                <FieldLabel htmlFor={`${id}-deadline`}>Deadline</FieldLabel>
                <Input
                    id={`${id}-deadline`}
                    type="datetime-local"
                    className="max-w-64"
                    value={deadline}
                    disabled={disabled}
                    onChange={(event) => onDeadlineChange(event.target.value)}
                    aria-invalid={errors.length > 0}
                />
                <FieldDescription>
                    Leave empty for no deadline. Joining via link closes at the
                    deadline.
                </FieldDescription>
                <FieldError errors={errors} />
            </Field>
            {deadline && (
                <CheckboxField
                    id={`${id}-archive`}
                    checked={archiveOnDeadline}
                    disabled={disabled}
                    onChange={onArchiveOnDeadlineChange}
                    label="Archive repositories on deadline"
                />
            )}
        </>
    );
}

export function RepositoryFeaturesField({
    id,
    features,
    onChange,
    description,
    disabled,
}: {
    id: string;
    features: AssignmentFeatures;
    onChange: (features: AssignmentFeatures) => void;
    description?: string;
    disabled?: boolean;
}) {
    return (
        <FieldSet>
            <FieldLegend variant="label">Repository features</FieldLegend>
            {description && <FieldDescription>{description}</FieldDescription>}
            <div className="grid w-fit grid-cols-2 gap-x-8 gap-y-3 @md:grid-cols-3">
                {ASSIGNMENT_FEATURES.map((feature) => (
                    <CheckboxField
                        key={feature.key}
                        id={`${id}-feature-${feature.key}`}
                        checked={features[feature.key]}
                        disabled={disabled}
                        onChange={(checked) =>
                            onChange({ ...features, [feature.key]: checked })
                        }
                        label={feature.label}
                    />
                ))}
            </div>
        </FieldSet>
    );
}

export function JoinLinkFields({
    id,
    joinLink,
    rosterRestriction,
    rosters,
    description,
    locked,
    onJoinLinkChange,
    onRosterRestrictionChange,
    errors,
    disabled,
    children,
}: {
    id: string;
    joinLink: boolean;
    rosterRestriction: string | null;
    rosters: Roster[];
    description: string;
    /** Joining via link is required and cannot be switched off. */
    locked?: boolean;
    onJoinLinkChange: (enabled: boolean) => void;
    onRosterRestrictionChange: (rosterId: string | null) => void;
    errors: FieldErrors;
    disabled?: boolean;
    /** Shown below the roster restriction, such as the current join link. */
    children?: ReactNode;
}) {
    const items = [
        { value: ANYONE, label: "Anyone with the link" },
        ...rosters.map((roster) => ({
            value: roster.id,
            label: `${roster.name} (${roster.memberCount})`,
        })),
    ];
    return (
        <>
            <Field orientation="horizontal" data-disabled={disabled || locked}>
                <Switch
                    id={`${id}-join`}
                    checked={joinLink}
                    disabled={disabled || locked}
                    onCheckedChange={onJoinLinkChange}
                />
                <FieldContent>
                    <FieldLabel htmlFor={`${id}-join`}>
                        Join via link
                    </FieldLabel>
                    <FieldDescription>{description}</FieldDescription>
                </FieldContent>
            </Field>
            {joinLink && (
                <Field
                    data-invalid={errors.length > 0}
                    data-disabled={disabled}
                >
                    <FieldLabel htmlFor={`${id}-restrict`}>
                        Restrict joining to roster
                    </FieldLabel>
                    <Select
                        items={items}
                        value={rosterRestriction ?? ANYONE}
                        disabled={disabled}
                        onValueChange={(value) =>
                            onRosterRestrictionChange(
                                value && value !== ANYONE ? value : null,
                            )
                        }
                    >
                        <SelectTrigger id={`${id}-restrict`} className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {items.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FieldError errors={errors} />
                </Field>
            )}
            {joinLink && children}
        </>
    );
}

export function AutogradingFields({
    id,
    autograding,
    autogradeId,
    autogrades,
    onAutogradingChange,
    onAutogradeIdChange,
    errors,
    disabled,
}: {
    id: string;
    autograding: boolean;
    autogradeId: string | null;
    autogrades: AutogradeConfig[];
    onAutogradingChange: (enabled: boolean) => void;
    onAutogradeIdChange: (autogradeId: string | null) => void;
    errors: FieldErrors;
    disabled?: boolean;
}) {
    const items = autogrades.map((config) => ({
        value: config.id,
        label: config.name,
    }));
    return (
        <>
            <Field orientation="horizontal" data-disabled={disabled}>
                <Switch
                    id={`${id}-autograding`}
                    checked={autograding}
                    disabled={disabled}
                    onCheckedChange={onAutogradingChange}
                />
                <FieldContent>
                    <FieldLabel htmlFor={`${id}-autograding`}>
                        Autograding
                    </FieldLabel>
                    <FieldDescription>
                        Grade submissions automatically with an autograding
                        config.
                    </FieldDescription>
                </FieldContent>
            </Field>
            {autograding && (
                <Field
                    data-invalid={errors.length > 0}
                    data-disabled={disabled}
                >
                    <FieldLabel htmlFor={`${id}-autograde-config`}>
                        Autograding config
                    </FieldLabel>
                    <Select
                        items={items}
                        value={autogradeId}
                        disabled={disabled}
                        onValueChange={onAutogradeIdChange}
                    >
                        <SelectTrigger
                            id={`${id}-autograde-config`}
                            className="w-full"
                            aria-invalid={errors.length > 0}
                        >
                            <SelectValue placeholder="Select a config" />
                        </SelectTrigger>
                        <SelectContent>
                            {items.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {autogrades.length === 0 && (
                        <FieldDescription>
                            No autograding configs exist yet.
                        </FieldDescription>
                    )}
                    <FieldError errors={errors} />
                </Field>
            )}
        </>
    );
}

/**
 * Student search plus "Add from roster". `onAdd` returns how many students
 * were actually new, for the roster toast.
 */
export function StudentPicker({
    id,
    excludeIds,
    rosters,
    onAdd,
    children,
}: {
    id: string;
    excludeIds: Set<number>;
    rosters: Roster[];
    onAdd: (students: ForgejoStudent[]) => number;
    /** Extra actions that wrap together with the roster picker. */
    children?: ReactNode;
}) {
    const [addingRoster, setAddingRoster] = useState(false);
    const items = rosters.map((roster) => ({
        value: roster.id,
        label: `${roster.name} (${roster.memberCount})`,
    }));

    async function addRoster(rosterId: string) {
        setAddingRoster(true);
        try {
            const result = await getRosterStudents({ data: { rosterId } });
            const added = onAdd(result.students);
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

    return (
        <div className="flex flex-wrap gap-2">
            <div className="min-w-0 flex-1 basis-80">
                <StudentSearch
                    id={`${id}-student-search`}
                    excludeIds={excludeIds}
                    onSelect={(student) => onAdd([student])}
                />
            </div>
            {/* Roster picker and extra actions wrap together. */}
            <div className="flex max-w-full gap-2">
                <Select
                    items={items}
                    value={null}
                    disabled={addingRoster || items.length === 0}
                    onValueChange={(value) => {
                        if (value) void addRoster(value);
                    }}
                >
                    <SelectTrigger
                        className="min-w-0 flex-1 @sm:w-56 @sm:flex-none"
                        aria-label="Add students from roster"
                    >
                        <SelectValue
                            placeholder={
                                addingRoster
                                    ? "Adding roster…"
                                    : items.length === 0
                                      ? "No rosters"
                                      : "Add from roster"
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {items.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {children}
            </div>
        </div>
    );
}

/**
 * Assigns students without a group to the emptiest groups, respecting the
 * member limit (0 for unlimited). `counts` holds the members each group
 * already has besides `students`.
 */
export function distributeIntoGroups<T extends { group: number | null }>(
    students: T[],
    counts: number[],
    maxMembers: number,
) {
    const totals = [...counts];
    for (const student of students) {
        if (student.group !== null) totals[student.group]++;
    }
    const max = maxMembers || Number.POSITIVE_INFINITY;
    return students.map((student) => {
        if (student.group !== null) return student;
        let target = -1;
        for (let index = 0; index < totals.length; index++) {
            if (
                totals[index] < max &&
                (target === -1 || totals[index] < totals[target])
            ) {
                target = index;
            }
        }
        if (target === -1) return student;
        totals[target]++;
        return { ...student, group: target };
    });
}
