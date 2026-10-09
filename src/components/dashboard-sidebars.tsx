import { linkOptions } from "@tanstack/react-router";
import { useDashboardNavigation } from "#/lib/dashboard-navigation";
import { organizations, rosters } from "#/lib/dashboard-placeholders";
import { SecondSidebar } from "./second-sidebar";
import { ThirdSidebar } from "./third-sidebar";

export function DashboardSidebars() {
    const { section, orgId, classId, rosterId } = useDashboardNavigation();

    if (section === "organizations") {
        return (
            <>
                <SecondSidebar
                    key="organizations"
                    title="Organizations"
                    selectedId={orgId}
                    items={organizations.map((item) => ({
                        ...item,
                        link: linkOptions({
                            to: "/dashboard/$orgId",
                            params: { orgId: item.id },
                        }),
                    }))}
                />
                {orgId && <ThirdSidebar orgId={orgId} classId={classId} />}
            </>
        );
    }

    if (section === "rosters") {
        return (
            <SecondSidebar
                key="rosters"
                title="Rosters"
                selectedId={rosterId}
                closeOnSelect
                items={rosters.map((item) => ({
                    ...item,
                    link: linkOptions({
                        to: "/dashboard/rosters/$rosterId",
                        params: { rosterId: item.id },
                    }),
                }))}
            />
        );
    }

    return null;
}
