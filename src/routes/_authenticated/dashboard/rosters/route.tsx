import { createFileRoute, Outlet } from "@tanstack/react-router";

import { getRosters } from "#/lib/rosters.functions";

export const Route = createFileRoute("/_authenticated/dashboard/rosters")({
    loader: () => getRosters(),
    staticData: { dashboardSection: "rosters" },
    component: Outlet,
});
