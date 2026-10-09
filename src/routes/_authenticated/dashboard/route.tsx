import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SecondSidebar } from "#/components/second-sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const Route = createFileRoute("/_authenticated/dashboard")({
    component: RouteComponent,
});

function RouteComponent() {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "350px",
                } as React.CSSProperties
            }
        >
            <AppSidebar>
                <SecondSidebar />
            </AppSidebar>
            <SidebarInset>
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    );
}
