import { createFileRoute } from "@tanstack/react-router";
import { AutogradingPresets } from "#/components/autograding/autograding-presets";
import { getAutogradingPresets } from "#/lib/autograding/autograding.functions";

export const Route = createFileRoute("/_authenticated/dashboard/autograding")({
    staticData: { dashboardSection: "autograding" },
    loader: () => getAutogradingPresets(),
    component: RouteComponent,
});

function RouteComponent() {
    const presets = Route.useLoaderData();
    return <AutogradingPresets presets={presets} />;
}
