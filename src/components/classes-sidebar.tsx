import { linkOptions, useLoaderData } from "@tanstack/react-router";
import { useState } from "react";
import { CreateClassDialog } from "./create-class-dialog";
import { SidebarList } from "./sidebar-list";

export function ClassesSidebar({
    orgSlug,
    classId,
}: {
    orgSlug: string;
    classId?: string;
}) {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const data = useLoaderData({
        from: "/_authenticated/dashboard/organizations/$orgSlug",
    });
    return (
        <>
            <SidebarList
                title="Classes"
                selectedId={classId}
                closeOnSelect
                emptyMessage={
                    data
                        ? "No classes in this organization."
                        : "Classes unavailable."
                }
                onCreateNew={() => setCreateDialogOpen(true)}
                items={(data?.classes ?? []).map((classroom) => ({
                    ...classroom,
                    link: linkOptions({
                        to: "/dashboard/organizations/$orgSlug/$classId",
                        params: { orgSlug, classId: classroom.id },
                    }),
                }))}
            />
            <CreateClassDialog
                orgSlug={orgSlug}
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
        </>
    );
}
