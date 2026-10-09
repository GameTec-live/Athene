import { createFileRoute, Outlet } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import { AppSidebar } from "#/components/app-sidebar";
import { DashboardSidebars } from "#/components/dashboard-sidebars";
import { SidebarInset, SidebarProvider } from "#/components/ui/sidebar";
import { useDashboardNavigation } from "#/lib/dashboard-navigation";

export const Route = createFileRoute("/_authenticated/dashboard")({
    component: RouteComponent,
});

function RouteComponent() {
    const { sidebarCount } = useDashboardNavigation();

    return (
        <SidebarProvider
            style={
                {
                    "--dashboard-panel-width": "min(300px, calc(100vw - 5rem))",
                    "--sidebar-width": `calc(var(--sidebar-width-icon) + 1px + ${sidebarCount} * var(--dashboard-panel-width))`,
                } as CSSProperties
            }
        >
            <AppSidebar>
                <DashboardSidebars />
            </AppSidebar>
            <SidebarInset className="min-w-0">
                <div className="flex-1 p-6">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
