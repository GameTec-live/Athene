import { createFileRoute } from "@tanstack/react-router";

function getSafeRedirect(value: unknown) {
    return typeof value === "string" &&
        value.startsWith("/") &&
        !value.startsWith("//")
        ? value
        : "/";
}

export const Route = createFileRoute("/login")({
    validateSearch: (search) => {
        const { redirect } = search;
        return {
            redirect: getSafeRedirect(redirect),
        };
    },
    component: RouteComponent,
});

function RouteComponent() {
    const { redirect } = Route.useSearch();

    return <div>Hello "/login"!, redirecting to {redirect}</div>;
}
