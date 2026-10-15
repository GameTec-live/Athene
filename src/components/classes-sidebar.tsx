import { linkOptions, useLoaderData } from "@tanstack/react-router";
import { SidebarList } from "./sidebar-list";

export function ClassesSidebar({
    orgSlug,
    classId,
}: {
    orgSlug: string;
    classId?: string;
}) {
    const data = useLoaderData({
        from: "/_authenticated/dashboard/organizations/$orgSlug",
    });
    return (
        <SidebarList
            title="Classes"
            selectedId={classId}
            closeOnSelect
            emptyMessage={
                data
                    ? "No classes in this organization."
                    : "Classes unavailable."
            }
            items={(data?.classes ?? []).map((classroom) => ({
                ...classroom,
                link: linkOptions({
                    to: "/dashboard/organizations/$orgSlug/$classId",
                    params: { orgSlug, classId: classroom.id },
                }),
            }))}
        />
    );
}
