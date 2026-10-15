import { useMatches, useParams } from "@tanstack/react-router";

export type DashboardSection =
    | "organizations"
    | "rosters"
    | "autograding"
    | "settings";

export function useDashboardNavigation() {
    const section = useMatches({
        select: (matches) =>
            [...matches]
                .reverse()
                .find((match) => match.staticData.dashboardSection)?.staticData
                .dashboardSection,
    });
    const { orgSlug, classId, rosterId } = useParams({ strict: false });

    return {
        section,
        orgSlug,
        classId,
        rosterId,
        sidebarCount:
            section === "organizations"
                ? orgSlug
                    ? 2
                    : 1
                : section === "rosters"
                  ? 1
                  : 0,
    };
}
