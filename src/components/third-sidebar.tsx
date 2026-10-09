import { linkOptions } from "@tanstack/react-router";
import { classes } from "#/lib/dashboard-placeholders";
import { SecondSidebar } from "./second-sidebar";

export function ThirdSidebar({
    orgId,
    classId,
}: {
    orgId: string;
    classId?: string;
}) {
    return (
        <SecondSidebar
            key={orgId}
            title="Classes"
            selectedId={classId}
            closeOnSelect
            items={classes.map((item) => ({
                ...item,
                link: linkOptions({
                    to: "/dashboard/$orgId/$classId",
                    params: { orgId, classId: item.id },
                }),
            }))}
        />
    );
}
