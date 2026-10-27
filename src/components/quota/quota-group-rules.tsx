import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { UNLIMITED_QUOTA_GROUP } from "#/lib/forgejo/quota-schemas";
import { QuotaRuleAttach } from "./quota-rule-attach";
import { QuotaRuleDialog } from "./quota-rule-dialog";
import { QuotaRuleRow } from "./quota-rule-row";
import type { QuotaDashboardData, QuotaGroup } from "./quota-types";

export function QuotaGroupRules({
    group,
    dashboard,
    locked,
}: {
    group: QuotaGroup;
    dashboard: QuotaDashboardData;
    locked: boolean;
}) {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const protectedRules =
        dashboard.groups.find((group) => group.name === UNLIMITED_QUOTA_GROUP)
            ?.rules ?? [];
    const availableRules = dashboard.rules
        .filter(
            (rule) =>
                !group.rules.some((attached) => attached.name === rule.name),
        )
        .map((rule) => rule.name);

    return (
        <section className="space-y-3" aria-label={`Rules for ${group.name}`}>
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-medium">Quota rules</h3>
                {!locked && (
                    <Button
                        variant="outline"
                        onClick={() => setCreateDialogOpen(true)}
                    >
                        <PlusIcon />
                        Add rule
                    </Button>
                )}
            </div>
            {!group.rules.length && (
                <p className="rounded-md border border-dashed p-3 text-xs text-muted-foreground">
                    No rules. Add a rule to allow storage.
                </p>
            )}
            <div className="space-y-2">
                {group.rules.map((rule) => (
                    <QuotaRuleRow
                        key={rule.name}
                        group={group.name}
                        rule={rule}
                        usedBy={dashboard.groups
                            .filter((group) =>
                                group.rules.some(
                                    (attached) => attached.name === rule.name,
                                ),
                            )
                            .map((group) => group.name)}
                        locked={locked}
                        protectedRule={protectedRules.some(
                            (protectedRule) => protectedRule.name === rule.name,
                        )}
                    />
                ))}
            </div>
            {!locked && availableRules.length > 0 && (
                <QuotaRuleAttach group={group.name} rules={availableRules} />
            )}
            {createDialogOpen && (
                <QuotaRuleDialog
                    group={group.name}
                    sharedWith={[]}
                    open
                    onOpenChange={setCreateDialogOpen}
                />
            )}
        </section>
    );
}
