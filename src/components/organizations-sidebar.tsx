import { Await, linkOptions, useLoaderData } from "@tanstack/react-router";
import { useState } from "react";
import type { Organization } from "#/lib/forgejo/api";
import { SidebarList } from "./sidebar-list";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function OrganizationsSidebar({ orgSlug }: { orgSlug?: string }) {
    const [search, setSearch] = useState("");
    const data = useLoaderData({
        from: "/_authenticated/dashboard/organizations",
    });
    if (!data) return null;
    const { slugs, details } = data;

    function renderList(details: (Organization | null)[]) {
        return (
            <SidebarList
                title="Organizations"
                selectedId={orgSlug}
                search={search}
                onSearchChange={setSearch}
                emptyMessage="You are not a member of any organizations."
                items={slugs.map((slug, index) => ({
                    id: slug,
                    name:
                        details[index]?.full_name ||
                        details[index]?.name ||
                        slug,
                    description: details[index]?.description || slug,
                    icon: (
                        <Avatar>
                            <AvatarImage
                                src={details[index]?.avatar_url}
                                alt=""
                            />
                            <AvatarFallback>
                                {slug.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    ),
                    link: linkOptions({
                        to: "/dashboard/organizations/$orgSlug",
                        params: { orgSlug: slug },
                    }),
                }))}
            />
        );
    }

    return (
        <Await promise={details} fallback={renderList([])}>
            {renderList}
        </Await>
    );
}
