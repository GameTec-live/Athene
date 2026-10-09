import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/rosters")({
    staticData: { dashboardSection: "rosters" },
    component: Outlet,
});
