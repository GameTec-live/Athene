import { useDashboardNavigation } from "#/lib/dashboard-navigation";
import { ClassesSidebar } from "./classes-sidebar";
import { OrganizationsSidebar } from "./organizations-sidebar";
import { RostersSidebar } from "./rosters-sidebar";

export function DashboardSidebars() {
    const { section, orgSlug, classId, rosterId } = useDashboardNavigation();

    if (section === "organizations") {
        return (
            <>
                <OrganizationsSidebar orgSlug={orgSlug} />
                {orgSlug && (
                    <ClassesSidebar
                        key={orgSlug}
                        orgSlug={orgSlug}
                        classId={classId}
                    />
                )}
            </>
        );
    }

    if (section === "rosters") {
        return <RostersSidebar rosterId={rosterId} />;
    }

    return null;
}
