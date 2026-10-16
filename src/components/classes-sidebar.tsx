import { linkOptions, useLoaderData, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { CreateClassDialog } from "./create-class-dialog";
import { EditClassDialog } from "./edit-class-dialog";
import { SidebarList } from "./sidebar-list";

export function ClassesSidebar({
    orgSlug,
    classId,
}: {
    orgSlug: string;
    classId?: string;
}) {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<{
        id: string;
        name: string;
    } | null>(null);
    const router = useRouter();
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
                onEdit={setEditingClass}
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
            {editingClass && (
                <EditClassDialog
                    key={editingClass.id}
                    orgSlug={orgSlug}
                    classroom={editingClass}
                    open
                    onOpenChange={(open) => {
                        if (!open) setEditingClass(null);
                    }}
                    onDeleted={async () => {
                        if (classId === editingClass.id) {
                            await router.navigate({
                                to: "/dashboard/organizations/$orgSlug",
                                params: { orgSlug },
                            });
                        }
                        await router.invalidate();
                    }}
                />
            )}
        </>
    );
}
