import { Link, type LinkProps } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
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
    description?: string;
    icon?: ReactNode;
    link: LinkProps;
};

export function SidebarList({
    title,
    items,
    selectedId,
    closeOnSelect = false,
    emptyMessage = "No items yet.",
    search: searchProp,
    onSearchChange,
}: {
    title: string;
    items: SidebarEntry[];
    selectedId?: string;
    closeOnSelect?: boolean;
    emptyMessage?: string;
    search?: string;
    onSearchChange?: (search: string) => void;
}) {
    const [internalSearch, setInternalSearch] = useState("");
    const search = searchProp ?? internalSearch;
    const { setOpenMobile } = useSidebar();
    const query = search.trim().toLowerCase();
    const filteredItems = items.filter((item) =>
        `${item.name} ${item.description ?? ""}`.toLowerCase().includes(query),
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
                    onChange={(event) =>
                        (onSearchChange ?? setInternalSearch)(
                            event.target.value,
                        )
                    }
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
                                className="flex items-start gap-3 border-b p-4 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                            >
                                {item.icon}
                                <span className="flex min-w-0 flex-col gap-2">
                                    <span className="font-medium">
                                        {item.name}
                                    </span>
                                    {item.description && (
                                        <span className="line-clamp-2 text-xs whitespace-break-spaces">
                                            {item.description}
                                        </span>
                                    )}
                                </span>
                            </Link>
                        ))}
                        {filteredItems.length === 0 && (
                            <p className="p-4 text-sm text-muted-foreground">
                                {query ? "No results found." : emptyMessage}
                            </p>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
