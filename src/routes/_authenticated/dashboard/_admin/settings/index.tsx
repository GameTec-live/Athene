import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";

export const Route = createFileRoute(
    "/_authenticated/dashboard/_admin/settings/",
)({
    component: SettingsPage,
});

function SettingsPage() {
    return (
        <>
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">Settings</h1>
            </div>
            <Card>
                <CardContent className="flex items-center justify-between gap-4">
                    <h2 className="text-sm font-medium">Quotas</h2>
                    <Button
                        nativeButton={false}
                        render={<Link to="/dashboard/settings/quotas" />}
                        aria-label="Open Quotas"
                    >
                        Open
                    </Button>
                </CardContent>
            </Card>
        </>
    );
}
