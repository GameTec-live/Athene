import { linkOptions } from "@tanstack/react-router";
import { rosters } from "#/lib/dashboard-placeholders";
import { SidebarList } from "./sidebar-list";

export function RostersSidebar({ rosterId }: { rosterId?: string }) {
    return (
        <SidebarList
            title="Rosters"
            selectedId={rosterId}
            closeOnSelect
            items={rosters.map((roster) => ({
                ...roster,
                link: linkOptions({
                    to: "/dashboard/rosters/$rosterId",
                    params: { rosterId: roster.id },
                }),
            }))}
        />
    );
}
