import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/dashboard/_admin/settings",
)({
    staticData: { dashboardSection: "settings" },
    component: SettingsLayout,
});

function SettingsLayout() {
    return (
        <div className="mx-auto max-w-5xl space-y-6">
            <Outlet />
        </div>
    );
}
