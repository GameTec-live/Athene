import { createFileRoute, useLoaderData } from "@tanstack/react-router";

export const Route = createFileRoute(
    "/_authenticated/dashboard/organizations/$orgSlug/",
)({ component: OrganizationContent });

function OrganizationContent() {
    const { organization, classes } = useLoaderData({
        from: "/_authenticated/dashboard/organizations/$orgSlug",
    });

    return (
        <div className="space-y-2">
            <h1 className="text-xl font-semibold">
                {organization.full_name || organization.name}
            </h1>
            <p className="text-muted-foreground">
                {classes.length > 0
                    ? "Select a class to get started."
                    : "This organization has no classes yet."}
            </p>
        </div>
    );
}
