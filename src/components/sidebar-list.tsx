import { Link, type LinkProps } from "@tanstack/react-router";
import { PencilIcon, PlusIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Empty, EmptyHeader, EmptyTitle } from "#/components/ui/empty";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarInput,
    useSidebar,
} from "#/components/ui/sidebar";
import { Button } from "./ui/button";

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
    onCreateNew,
    onEdit,
}: {
    title: string;
    items: SidebarEntry[];
    selectedId?: string;
    closeOnSelect?: boolean;
    emptyMessage?: string;
    search?: string;
    onSearchChange?: (search: string) => void;
    onCreateNew: () => void;
    onEdit?: (item: SidebarEntry) => void;
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
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-sm font-semibold">{title}</h2>

                    <Button
                        variant="outline"
                        size="icon"
                        aria-label={`Create new ${title.toLowerCase()}`}
                        onClick={onCreateNew}
                    >
                        <PlusIcon />
                    </Button>
                </div>
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
                            <div
                                key={item.id}
                                data-active={selectedId === item.id}
                                className="flex items-center border-b text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                            >
                                <Link
                                    {...item.link}
                                    aria-current={
                                        selectedId === item.id
                                            ? "page"
                                            : undefined
                                    }
                                    onClick={() => {
                                        if (closeOnSelect) setOpenMobile(false);
                                    }}
                                    className="flex min-w-0 flex-1 items-start gap-3 p-4"
                                >
                                    {item.icon}
                                    <span className="flex min-w-0 flex-col gap-2">
                                        <span className="font-medium break-words">
                                            {item.name}
                                        </span>
                                        {item.description && (
                                            <span className="line-clamp-2 text-xs whitespace-break-spaces">
                                                {item.description}
                                            </span>
                                        )}
                                    </span>
                                </Link>
                                {onEdit && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="mr-4"
                                        aria-label={`Edit ${item.name}`}
                                        title={`Edit ${item.name}`}
                                        onClick={() => onEdit(item)}
                                    >
                                        <PencilIcon />
                                    </Button>
                                )}
                            </div>
                        ))}
                        {filteredItems.length === 0 && (
                            <Empty>
                                <EmptyHeader>
                                    <EmptyTitle>
                                        {query
                                            ? "No results found."
                                            : emptyMessage}
                                    </EmptyTitle>
                                </EmptyHeader>
                            </Empty>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
