import { PencilIcon, UnlinkIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { formatQuotaLimit, quotaSubjects } from "#/lib/forgejo/quota-schemas";
import { deleteQuotaRule, removeQuotaRule } from "#/lib/forgejo/quotas";
import { QuotaDeleteButton } from "./quota-delete-button";
import { QuotaRuleDialog } from "./quota-rule-dialog";
import type { QuotaRule } from "./quota-types";
import { useQuotaAction } from "./use-quota-action";

export function QuotaRuleRow({
    group,
    rule,
    usedBy,
    locked,
    protectedRule,
}: {
    group: string;
    rule: QuotaRule;
    usedBy: string[];
    locked: boolean;
    protectedRule: boolean;
}) {
    const [editing, setEditing] = useState(false);
    const { pending, run } = useQuotaAction();

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border px-3 py-2">
            <div className="min-w-0 flex-1 space-y-1">
                <p className="wrap-break-word text-xs font-medium">
                    {rule.name}
                    <span className="ml-2 text-muted-foreground">
                        {formatQuotaLimit(rule.limit)}
                    </span>
                </p>
                <p className="wrap-break-word text-xs text-muted-foreground">
                    {rule.subjects
                        .map(
                            (subject) =>
                                quotaSubjects.find(
                                    (option) => option.value === subject,
                                )?.label ?? subject,
                        )
                        .join(", ")}
                </p>
            </div>
            {!locked && (
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={pending || protectedRule}
                        onClick={() => setEditing(true)}
                        aria-label={`Edit ${rule.name}`}
                        title="Edit rule"
                    >
                        <PencilIcon />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={pending}
                        aria-label={`Detach ${rule.name} from ${group}`}
                        title="Remove from this group and keep the rule"
                        onClick={() =>
                            run("Failed to detach quota rule", async () => {
                                await removeQuotaRule({
                                    data: { group, rule: rule.name },
                                });
                            })
                        }
                    >
                        <UnlinkIcon />
                    </Button>
                    <QuotaDeleteButton
                        name={rule.name}
                        kind="rule"
                        disabled={pending || protectedRule}
                        description={`Removes this rule from ${usedBy.join(", ")}. This cannot be undone.`}
                        onDelete={() =>
                            deleteQuotaRule({
                                data: { group, rule: rule.name },
                            })
                        }
                    />
                </div>
            )}
            {editing && (
                <QuotaRuleDialog
                    group={group}
                    rule={rule}
                    sharedWith={usedBy.filter((name) => name !== group)}
                    open
                    onOpenChange={setEditing}
                />
            )}
        </div>
    );
}
