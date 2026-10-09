import { Link } from "@tanstack/react-router";
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
} from "#/components/ui/sidebar.tsx";
import { NavUser } from "./nav-user";

export function AppSidebar({
    children,
    ...props
}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            collapsible="icon"
            className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
            {...props}
        >
            {/* This is the first sidebar */}
            {/* We disable collapsible and adjust width to icon. */}
            {/* This will make the sidebar appear as icons. */}
            <Sidebar
                collapsible="none"
                className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
            >
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                className="md:h-8 md:p-0"
                                render={<Link to="/dashboard" />}
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
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        tooltip={{
                                            children: "Organizations",
                                            hidden: false,
                                        }}
                                        isActive={false}
                                        render={
                                            <Link to="/dashboard/organizations" />
                                        }
                                        className="px-2.5 md:px-2"
                                    >
                                        <BuildingIcon />
                                        <span>Organizations</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        tooltip={{
                                            children: "Rosters",
                                            hidden: false,
                                        }}
                                        isActive={false}
                                        render={
                                            <Link to="/dashboard/rosters" />
                                        }
                                        className="px-2.5 md:px-2"
                                    >
                                        <PersonStandingIcon />
                                        <span>Rosters</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        tooltip={{
                                            children: "Autograding",
                                            hidden: false,
                                        }}
                                        isActive={false}
                                        render={
                                            <Link to="/dashboard/autograding" />
                                        }
                                        className="px-2.5 md:px-2"
                                    >
                                        <BookOpenCheckIcon />
                                        <span>Autograding</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        tooltip={{
                                            children: "Settings",
                                            hidden: false,
                                        }}
                                        isActive={false}
                                        render={
                                            <Link to="/dashboard/settings" />
                                        }
                                        className="px-2.5 md:px-2"
                                    >
                                        <Settings2Icon />
                                        <span>Settings</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
            </Sidebar>

            {children}
        </Sidebar>
    );
}
