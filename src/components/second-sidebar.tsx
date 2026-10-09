import { Link, type LinkProps } from "@tanstack/react-router";
import { useState } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInput,
    useSidebar,
} from "#/components/ui/sidebar";

export type SidebarEntry = {
    id: string;
    name: string;
    description: string;
    link: LinkProps;
};

export function SecondSidebar({
    title,
    items,
    selectedId,
    closeOnSelect = false,
}: {
    title: string;
    items: SidebarEntry[];
    selectedId?: string;
    closeOnSelect?: boolean;
}) {
    const [search, setSearch] = useState("");
    const { setOpenMobile } = useSidebar();
    const query = search.trim().toLowerCase();
    const filteredItems = items.filter((item) =>
        `${item.name} ${item.description}`.toLowerCase().includes(query),
    );

    return (
        <Sidebar
            collapsible="none"
            aria-label={title}
            className="w-(--dashboard-panel-width)! shrink-0 border-r group-data-[collapsible=icon]:hidden"
        >
            <SidebarHeader className="gap-3.5 border-b p-4">
                <h2 className="text-sm font-semibold">{title}</h2>
                <SidebarInput
                    aria-label={`Search ${title.toLowerCase()}`}
                    placeholder="Type to search..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup className="px-0">
                    <SidebarGroupContent>
                        {filteredItems.map((item) => (
                            <Link
                                {...item.link}
                                key={item.id}
                                aria-current={
                                    selectedId === item.id ? "page" : undefined
                                }
                                data-active={selectedId === item.id}
                                onClick={() => {
                                    if (closeOnSelect) setOpenMobile(false);
                                }}
                                className="flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                            >
                                <span className="font-medium">{item.name}</span>
                                <span className="line-clamp-2 text-xs whitespace-break-spaces">
                                    {item.description}
                                </span>
                            </Link>
                        ))}
                        {filteredItems.length === 0 && (
                            <p className="p-4 text-sm text-muted-foreground">
                                No results found.
                            </p>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
