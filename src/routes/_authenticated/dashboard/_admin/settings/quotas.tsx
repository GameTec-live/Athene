import { createFileRoute, useRouter } from "@tanstack/react-router";
import { QuotaDashboard } from "#/components/quota/quota-dashboard";
import { Button } from "#/components/ui/button";
import { getQuotaDashboard, getQuotaMembers } from "#/lib/forgejo/quotas";

export const Route = createFileRoute(
    "/_authenticated/dashboard/_admin/settings/quotas",
)({
    staleTime: 30_000,
    loader: async ({ abortController }) => {
        const dashboard = await getQuotaDashboard({
            signal: abortController.signal,
        });
        return {
            ...dashboard,
            groups: dashboard.groups.map((group) => ({
                ...group,
                members: getQuotaMembers({
                    data: { group: group.name },
                    signal: abortController.signal,
                }),
            })),
        };
    },
    pendingComponent: () => (
        <p role="status" className="text-sm text-muted-foreground">
            Loading quota groups…
        </p>
    ),
    errorComponent: QuotasError,
    component: RouteComponent,
});

function QuotasError() {
    const router = useRouter();
    return (
        <div role="alert" className="space-y-3">
            <p className="text-sm">
                Unable to load Forgejo quotas. Check that quotas are enabled and
                Athenes Forgejo token has administrator access.
            </p>
            <Button variant="outline" onClick={() => router.invalidate()}>
                Retry
            </Button>
        </div>
    );
}

function RouteComponent() {
    const dashboard = Route.useLoaderData();
    return <QuotaDashboard dashboard={dashboard} />;
}
