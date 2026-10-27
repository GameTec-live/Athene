import { linkOptions, useLoaderData } from "@tanstack/react-router";
import { useState } from "react";
import { SidebarList } from "../sidebar-list";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CreateOrganizationDialog } from "./create-organization-dialog";

export function OrganizationsSidebar({ orgSlug }: { orgSlug?: string }) {
    const [search, setSearch] = useState("");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const organizations = useLoaderData({
        from: "/_authenticated/dashboard/organizations",
    });
    if (!organizations) return null;

    return (
        <>
            <SidebarList
                title="Organizations"
                selectedId={orgSlug}
                search={search}
                onSearchChange={setSearch}
                emptyMessage="You are not a member of any organizations."
                onCreateNew={() => setCreateDialogOpen(true)}
                items={organizations.map((organization) => {
                    const { slug } = organization;
                    return {
                        id: slug,
                        name:
                            organization.full_name || organization.name || slug,
                        description: organization.description || slug,
                        icon: (
                            <Avatar>
                                <AvatarImage
                                    src={organization.avatar_url}
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
                    };
                })}
            />
            <CreateOrganizationDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
        </>
    );
}
