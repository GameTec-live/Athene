import { createFileRoute, Outlet } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { AppSidebar } from "#/components/app-sidebar";
import { DashboardSidebars } from "#/components/dashboard-sidebars";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { useDashboardNavigation } from "#/lib/dashboard-navigation";
import { getOrgs } from "#/lib/forgejo/orgs";

export const Route = createFileRoute("/_authenticated/dashboard")({
    loader: async () => ({ organizations: await getOrgs() }),
    component: RouteComponent,
});

function RouteComponent() {
    const { organizations } = Route.useLoaderData();
    const { section, orgId, sidebarCount } = useDashboardNavigation();
    const visibleSidebarCount =
        section === "organizations" &&
        orgId &&
        !organizations.some((org) => org.id === orgId)
            ? 1
            : sidebarCount;

    return (
        <SidebarProvider
            style={
                {
                    "--dashboard-panel-width": "min(300px, calc(100vw - 5rem))",
                    "--sidebar-width": `calc(var(--sidebar-width-icon) + 1px + ${visibleSidebarCount} * var(--dashboard-panel-width))`,
                } as CSSProperties
            }
        >
            <AppSidebar>
                <DashboardSidebars organizations={organizations} />
            </AppSidebar>
            <SidebarInset className="min-w-0">
                <div className="flex-1 p-6">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
