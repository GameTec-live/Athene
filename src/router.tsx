import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import type { DashboardSection } from "#/lib/dashboard-navigation";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
    const router = createTanStackRouter({
        routeTree,
        scrollRestoration: true,
        defaultPreload: "intent",
    });

    return router;
}

declare module "@tanstack/react-router" {
    interface Register {
        router: ReturnType<typeof getRouter>;
    }

    interface StaticDataRouteOption {
        dashboardSection?: DashboardSection;
    }
}
