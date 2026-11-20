import { linkOptions, useLoaderData, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { CreateRosterDialog } from "./roster/create-roster-dialog";
import { EditRosterDialog } from "./roster/edit-roster-dialog";
import { SidebarList } from "./sidebar-list";

export function RostersSidebar({ rosterId }: { rosterId?: string }) {
    const router = useRouter();
    const rosters = useLoaderData({
        from: "/_authenticated/dashboard/rosters",
    });
    const [creating, setCreating] = useState(false);
    const [editingRoster, setEditingRoster] = useState<{
        id: string;
        name: string;
    } | null>(null);
    return (
        <>
            <SidebarList
                title="Rosters"
                selectedId={rosterId}
                closeOnSelect
                onCreateNew={() => setCreating(true)}
                onEdit={setEditingRoster}
                items={(rosters ?? []).map((roster) => ({
                    ...roster,
                    link: linkOptions({
                        to: "/dashboard/rosters/$rosterId",
                        params: { rosterId: roster.id },
                    }),
                }))}
            />
            <CreateRosterDialog open={creating} onOpenChange={setCreating} />
            {editingRoster && (
                <EditRosterDialog
                    key={editingRoster.id}
                    roster={editingRoster}
                    open
                    onOpenChange={(open) => {
                        if (!open) setEditingRoster(null);
                    }}
                    onDeleted={async () => {
                        if (rosterId === editingRoster.id) {
                            await router.navigate({
                                to: "/dashboard/rosters",
                            });
                        }
                        await router.invalidate({
                            filter: (match) =>
                                match.routeId ===
                                "/_authenticated/dashboard/rosters",
                            sync: true,
                        });
                    }}
                />
            )}
        </>
    );
}
