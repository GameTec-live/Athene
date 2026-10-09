import { useMatches, useParams } from "@tanstack/react-router";

export type DashboardSection =
    | "organizations"
    | "rosters"
    | "autograding"
    | "settings";

declare module "@tanstack/react-router" {
    interface StaticDataRouteOption {
        dashboardSection?: DashboardSection;
    }
}

export function useDashboardNavigation() {
    const section = useMatches({
        select: (matches) =>
            [...matches]
                .reverse()
                .find((match) => match.staticData.dashboardSection)?.staticData
                .dashboardSection,
    });
    const { orgId, classId, rosterId } = useParams({ strict: false });

    return {
        section,
        orgId,
        classId,
        rosterId,
        sidebarCount:
            section === "organizations"
                ? orgId
                    ? 2
                    : 1
                : section === "rosters"
                  ? 1
                  : 0,
    };
}
