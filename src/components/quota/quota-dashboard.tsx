import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { Empty, EmptyHeader, EmptyTitle } from "#/components/ui/empty";
import { Input } from "#/components/ui/input";
import { UNLIMITED_QUOTA_GROUP } from "#/lib/forgejo/quota-schemas";
import { Button } from "../ui/button";
import { CreateQuotaGroupDialog } from "./create-quota-group-dialog";
import { QuotaGroupCard } from "./quota-group-card";
import type { QuotaDashboardData } from "./quota-types";

export function QuotaDashboard({
    dashboard,
}: {
    dashboard: QuotaDashboardData;
}) {
    const [search, setSearch] = useState("");
    const groups = dashboard.groups
        .filter((group) =>
            group.name.toLowerCase().includes(search.toLowerCase()),
        )
        .sort(
            (a, b) =>
                Number(a.name === UNLIMITED_QUOTA_GROUP) -
                Number(b.name === UNLIMITED_QUOTA_GROUP),
        );

    return (
        <>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        nativeButton={false}
                        render={<Link to="/dashboard/settings" />}
                        aria-label="Back to settings"
                        title="Back to settings"
                    >
                        <ArrowLeftIcon />
                    </Button>
                    <h1 className="text-2xl font-semibold">Quotas</h1>
                </div>
                <CreateQuotaGroupDialog
                    names={dashboard.groups.map((group) => group.name)}
                />
            </div>

            <Input
                aria-label="Search quota groups"
                placeholder="Search quota groups…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />
            <div className="space-y-3">
                {groups.map((group) => (
                    <QuotaGroupCard
                        key={group.name}
                        group={group}
                        dashboard={dashboard}
                    />
                ))}
                {groups.length === 0 && (
                    <Empty>
                        <EmptyHeader>
                            <EmptyTitle>No matching quota groups</EmptyTitle>
                        </EmptyHeader>
                    </Empty>
                )}
            </div>
        </>
    );
}
