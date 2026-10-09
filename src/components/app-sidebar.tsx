import { Link, linkOptions } from "@tanstack/react-router";
import {
    BookOpenCheckIcon,
    BuildingIcon,
    GraduationCapIcon,
    PersonStandingIcon,
    Settings2Icon,
} from "lucide-react";
import type * as React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "#/components/ui/sidebar";
import { useDashboardNavigation } from "#/lib/dashboard-navigation";
import { NavUser } from "./nav-user";

const navigation = [
    {
        section: "organizations",
        label: "Organizations",
        icon: BuildingIcon,
        link: linkOptions({ to: "/dashboard" }),
    },
    {
        section: "rosters",
        label: "Rosters",
        icon: PersonStandingIcon,
        link: linkOptions({ to: "/dashboard/rosters" }),
    },
    {
        section: "autograding",
        label: "Autograding",
        icon: BookOpenCheckIcon,
        link: linkOptions({ to: "/dashboard/autograding" }),
    },
    {
        section: "settings",
        label: "Settings",
        icon: Settings2Icon,
        link: linkOptions({ to: "/dashboard/settings" }),
    },
];

export function AppSidebar({
    children,
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    const { section } = useDashboardNavigation();
    const { setOpenMobile } = useSidebar();

    return (
        <Sidebar collapsible="icon" className="overflow-hidden" {...props}>
            <div className="flex h-full min-w-0 overflow-x-auto">
                <Sidebar
                    collapsible="none"
                    className="w-[calc(var(--sidebar-width-icon)+1px)]! shrink-0 border-r"
                >
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    size="lg"
                                    className="md:h-8 md:p-0"
                                    render={
                                        <Link
                                            to="/dashboard"
                                            aria-label="Dashboard"
                                        />
                                    }
                                >
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                        <GraduationCapIcon className="size-4" />
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupContent className="px-1.5 md:px-0">
                                <SidebarMenu>
                                    {navigation.map((item) => (
                                        <SidebarMenuItem key={item.section}>
                                            <SidebarMenuButton
                                                tooltip={{
                                                    children: item.label,
                                                    hidden: false,
                                                }}
                                                isActive={
                                                    section === item.section
                                                }
                                                render={
                                                    <Link
                                                        {...item.link}
                                                        aria-label={item.label}
                                                        aria-current={
                                                            section ===
                                                            item.section
                                                                ? "page"
                                                                : undefined
                                                        }
                                                    />
                                                }
                                                onClick={() => {
                                                    if (
                                                        item.section ===
                                                            "settings" ||
                                                        item.section ===
                                                            "autograding"
                                                    )
                                                        setOpenMobile(false);
                                                }}
                                                className="px-2.5 md:px-2"
                                            >
                                                <item.icon />
                                                <span>{item.label}</span>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                        <NavUser />
                    </SidebarFooter>
                </Sidebar>
                {children}
            </div>
        </Sidebar>
    );
}
