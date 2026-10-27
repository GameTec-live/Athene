import { useForm } from "@tanstack/react-form";
import { InfoIcon } from "lucide-react";
import { useId } from "react";
import { Button } from "#/components/ui/button";
import { Checkbox } from "#/components/ui/checkbox";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "#/components/ui/dialog";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "#/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "#/components/ui/tooltip";
import {
    getQuotaLimitInput,
    parseQuotaLimit,
    quotaLimitUnits,
    quotaRuleFormSchema,
    quotaSubjects,
} from "#/lib/forgejo/quota-schemas";
import { saveQuotaRule } from "#/lib/forgejo/quotas";
import type { QuotaRule } from "./quota-types";
import { useQuotaAction } from "./use-quota-action";

export function QuotaRuleDialog({
    group,
    rule,
    sharedWith,
    open,
    onOpenChange,
}: {
    group: string;
    rule?: QuotaRule;
    sharedWith: string[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const id = useId();
    const { execute } = useQuotaAction();
    const form = useForm({
        defaultValues: {
            name: rule?.name ?? "",
            limit: getQuotaLimitInput(rule?.limit),
            subjects: rule?.subjects ?? ["size:all"],
        },
        validators: { onSubmit: quotaRuleFormSchema },
        onSubmit: ({ value }) =>
            execute("Failed to save quota rule", async () => {
                await saveQuotaRule({
                    data: {
                        group,
                        rule: {
                            ...value,
                            limit: parseQuotaLimit(
                                value.limit.amount,
                                value.limit.unit,
                            ),
                        },
                        create: !rule,
                    },
                });
                onOpenChange(false);
            }),
    });
    const options = [
        ...quotaSubjects,
        ...(rule?.subjects ?? [])
            .filter(
                (subject) =>
                    !quotaSubjects.some((option) => option.value === subject),
            )
            .map((subject) => ({
                value: subject,
                label: subject,
                description: `Forgejo subject: ${subject}. Defined by the connected Forgejo version.`,
            })),
    ];

    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <Dialog
                    open={open}
                    onOpenChange={(open) => {
                        if (!isSubmitting) onOpenChange(open);
                    }}
                >
                    <DialogContent
                        className="max-h-[90dvh] overflow-y-auto"
                        aria-describedby={undefined}
                    >
                        <DialogHeader>
                            <DialogTitle>
                                {rule ? "Edit quota rule" : "Add quota rule"}
                            </DialogTitle>
                        </DialogHeader>
                        <form
                            noValidate
                            onSubmit={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                form.handleSubmit();
                            }}
                        >
                            <fieldset disabled={isSubmitting}>
                                <FieldGroup>
                                    <form.Field name="name">
                                        {(field) => (
                                            <Field
                                                data-invalid={
                                                    !field.state.meta.isValid
                                                }
                                            >
                                                <FieldLabel
                                                    htmlFor={`${id}-name`}
                                                >
                                                    Rule name
                                                </FieldLabel>
                                                <Input
                                                    id={`${id}-name`}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onChange={(event) =>
                                                        field.handleChange(
                                                            event.target.value,
                                                        )
                                                    }
                                                    onBlur={field.handleBlur}
                                                    disabled={!!rule}
                                                    aria-invalid={
                                                        !field.state.meta
                                                            .isValid
                                                    }
                                                    autoComplete="off"
                                                />
                                                <FieldError
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                />
                                            </Field>
                                        )}
                                    </form.Field>
                                    <form.Field name="limit">
                                        {(field) => (
                                            <Field
                                                data-invalid={
                                                    !field.state.meta.isValid
                                                }
                                            >
                                                <FieldLabel
                                                    htmlFor={`${id}-limit`}
                                                >
                                                    Limit
                                                </FieldLabel>
                                                <div className="flex gap-2">
                                                    <Input
                                                        id={`${id}-limit`}
                                                        name={field.name}
                                                        type="number"
                                                        min={-1}
                                                        step="any"
                                                        value={
                                                            field.state.value
                                                                .amount
                                                        }
                                                        onChange={(event) =>
                                                            field.handleChange({
                                                                ...field.state
                                                                    .value,
                                                                amount: event
                                                                    .target
                                                                    .value,
                                                            })
                                                        }
                                                        onBlur={
                                                            field.handleBlur
                                                        }
                                                        aria-invalid={
                                                            !field.state.meta
                                                                .isValid
                                                        }
                                                        className="min-w-0 flex-1"
                                                    />
                                                    <Select
                                                        items={quotaLimitUnits}
                                                        value={
                                                            field.state.value
                                                                .unit
                                                        }
                                                        onValueChange={(
                                                            unit,
                                                        ) => {
                                                            if (unit !== null)
                                                                field.handleChange(
                                                                    {
                                                                        ...field
                                                                            .state
                                                                            .value,
                                                                        unit,
                                                                    },
                                                                );
                                                        }}
                                                        disabled={isSubmitting}
                                                    >
                                                        <SelectTrigger
                                                            aria-label="Limit unit"
                                                            onBlur={
                                                                field.handleBlur
                                                            }
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {quotaLimitUnits.map(
                                                                (unit) => (
                                                                    <SelectItem
                                                                        key={
                                                                            unit.value
                                                                        }
                                                                        value={
                                                                            unit.value
                                                                        }
                                                                    >
                                                                        {
                                                                            unit.label
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <FieldDescription>
                                                    -1 means unlimited. Units
                                                    use powers of 1,000.
                                                </FieldDescription>
                                                <FieldError
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                />
                                            </Field>
                                        )}
                                    </form.Field>
                                    <form.Field name="subjects">
                                        {(field) => (
                                            <fieldset
                                                className="space-y-2"
                                                aria-invalid={
                                                    !field.state.meta.isValid
                                                }
                                            >
                                                <legend className="mb-2 text-xs font-medium">
                                                    <span className="inline-flex items-center gap-1">
                                                        Limit subjects
                                                        <InfoTooltip
                                                            label="How limit subjects combine"
                                                            description="The limit covers the sum of the selected subjects. Broad subjects include their children, so selecting both counts overlapping storage twice."
                                                        />
                                                    </span>
                                                </legend>
                                                <div className="grid gap-2 sm:grid-cols-2">
                                                    {options.map((option) => (
                                                        <Field
                                                            key={option.value}
                                                            orientation="horizontal"
                                                        >
                                                            <Checkbox
                                                                id={`${id}-${option.value}`}
                                                                checked={field.state.value.includes(
                                                                    option.value,
                                                                )}
                                                                onCheckedChange={(
                                                                    checked,
                                                                ) =>
                                                                    field.handleChange(
                                                                        checked
                                                                            ? [
                                                                                  ...field
                                                                                      .state
                                                                                      .value,
                                                                                  option.value,
                                                                              ]
                                                                            : field.state.value.filter(
                                                                                  (
                                                                                      subject,
                                                                                  ) =>
                                                                                      subject !==
                                                                                      option.value,
                                                                              ),
                                                                    )
                                                                }
                                                                onBlur={
                                                                    field.handleBlur
                                                                }
                                                            />
                                                            <FieldLabel
                                                                htmlFor={`${id}-${option.value}`}
                                                            >
                                                                {option.label}
                                                            </FieldLabel>
                                                            <InfoTooltip
                                                                label={`About ${option.label}`}
                                                                description={
                                                                    option.description
                                                                }
                                                            />
                                                        </Field>
                                                    ))}
                                                </div>
                                                <FieldError
                                                    errors={
                                                        field.state.meta.errors
                                                    }
                                                />
                                            </fieldset>
                                        )}
                                    </form.Field>
                                    {sharedWith.length > 0 && (
                                        <p className="text-xs text-amber-700 dark:text-amber-400">
                                            Changes also affect{" "}
                                            {sharedWith.join(", ")}.
                                        </p>
                                    )}
                                    <DialogFooter>
                                        <DialogClose
                                            disabled={isSubmitting}
                                            render={
                                                <Button variant="outline" />
                                            }
                                        >
                                            Cancel
                                        </DialogClose>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting
                                                ? "Saving…"
                                                : "Save rule"}
                                        </Button>
                                    </DialogFooter>
                                </FieldGroup>
                            </fieldset>
                        </form>
                    </DialogContent>
                </Dialog>
            )}
        </form.Subscribe>
    );
}

function InfoTooltip({
    label,
    description,
}: {
    label: string;
    description: string;
}) {
    return (
        <Tooltip>
            <TooltipTrigger
                aria-label={label}
                render={
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        className="shrink-0 text-muted-foreground"
                    />
                }
            >
                <InfoIcon />
            </TooltipTrigger>
            <TooltipContent>{description}</TooltipContent>
        </Tooltip>
    );
}
