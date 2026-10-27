import { ChevronDownIcon, LockKeyholeIcon } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "#/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "#/components/ui/collapsible";
import { UNLIMITED_QUOTA_GROUP } from "#/lib/forgejo/quota-schemas";
import { deleteQuotaGroup } from "#/lib/forgejo/quotas";
import { QuotaDeleteButton } from "./quota-delete-button";
import { QuotaGroupRules } from "./quota-group-rules";
import { QuotaMembers } from "./quota-members";
import type { QuotaDashboardData, QuotaGroup } from "./quota-types";

export function QuotaGroupCard({
    group,
    dashboard,
}: {
    group: QuotaGroup;
    dashboard: QuotaDashboardData;
}) {
    const [open, setOpen] = useState(false);
    const locked = group.name === UNLIMITED_QUOTA_GROUP;

    return (
        <Card className="gap-0 py-0">
            <Collapsible open={open} onOpenChange={setOpen}>
                <div className="flex items-center gap-2 px-4 py-3">
                    <CollapsibleTrigger className="group flex min-w-0 flex-1 items-center gap-3 text-left">
                        <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-aria-expanded:rotate-180" />
                        <span className="min-w-0 wrap-break-word text-sm font-medium">
                            {group.name}
                        </span>
                        {locked && (
                            <LockKeyholeIcon
                                className="size-3.5 shrink-0 text-muted-foreground"
                                aria-label="Protected group"
                            />
                        )}
                    </CollapsibleTrigger>
                    {!locked && (
                        <QuotaDeleteButton
                            name={group.name}
                            kind="group"
                            description="Removes the group and its memberships. Rules are kept. Accounts without other groups revert to default quotas."
                            onDelete={() =>
                                deleteQuotaGroup({
                                    data: { group: group.name },
                                })
                            }
                        />
                    )}
                </div>
                <CollapsibleContent>
                    <CardContent className="space-y-6 border-t py-4">
                        <QuotaGroupRules
                            group={group}
                            dashboard={dashboard}
                            locked={locked}
                        />
                        {open && (
                            <QuotaMembers
                                group={group.name}
                                members={group.members}
                            />
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}
