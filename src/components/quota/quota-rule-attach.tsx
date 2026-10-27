import { useForm } from "@tanstack/react-form";
import * as v from "valibot";
import { Button } from "#/components/ui/button";
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from "#/components/ui/combobox";
import { Field, FieldError } from "#/components/ui/field";
import { quotaNameSchema } from "#/lib/forgejo/quota-schemas";
import { attachQuotaRule } from "#/lib/forgejo/quotas";
import { useQuotaAction } from "./use-quota-action";

export function QuotaRuleAttach({
    group,
    rules,
}: {
    group: string;
    rules: string[];
}) {
    const { execute } = useQuotaAction();
    const form = useForm({
        defaultValues: { rule: "" },
        onSubmit: ({ value, formApi }) =>
            execute("Failed to attach quota rule", async () => {
                await attachQuotaRule({ data: { group, rule: value.rule } });
                formApi.reset();
            }),
    });

    return (
        <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
                <form
                    className="flex items-start gap-2"
                    noValidate
                    onSubmit={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        form.handleSubmit();
                    }}
                >
                    <form.Field
                        name="rule"
                        validators={{
                            onSubmit: v.pipe(
                                quotaNameSchema,
                                v.check(
                                    (name) => rules.includes(name),
                                    "Select an available rule.",
                                ),
                            ),
                        }}
                    >
                        {(field) => (
                            <>
                                <Field
                                    className="min-w-0 flex-1"
                                    data-invalid={!field.state.meta.isValid}
                                >
                                    <Combobox
                                        items={rules}
                                        value={field.state.value || null}
                                        onValueChange={(rule) =>
                                            field.handleChange(rule ?? "")
                                        }
                                        disabled={isSubmitting}
                                    >
                                        <ComboboxInput
                                            aria-label="Existing quota rule"
                                            aria-invalid={
                                                !field.state.meta.isValid
                                            }
                                            onBlur={field.handleBlur}
                                            placeholder="Search existing rules…"
                                            showClear
                                        />
                                        <ComboboxContent>
                                            <ComboboxEmpty>
                                                No rules found.
                                            </ComboboxEmpty>
                                            <ComboboxList>
                                                {(name: string) => (
                                                    <ComboboxItem
                                                        key={name}
                                                        value={name}
                                                    >
                                                        {name}
                                                    </ComboboxItem>
                                                )}
                                            </ComboboxList>
                                        </ComboboxContent>
                                    </Combobox>
                                    <FieldError
                                        errors={field.state.meta.errors}
                                    />
                                </Field>
                                <Button
                                    type="submit"
                                    variant="outline"
                                    disabled={
                                        isSubmitting || !field.state.value
                                    }
                                >
                                    {isSubmitting
                                        ? "Attaching…"
                                        : "Attach rule"}
                                </Button>
                            </>
                        )}
                    </form.Field>
                </form>
            )}
        </form.Subscribe>
    );
}
