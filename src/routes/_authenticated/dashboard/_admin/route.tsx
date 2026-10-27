import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authClient } from "#/lib/auth-client";
import type { roles } from "#/lib/permissions";

export const Route = createFileRoute("/_authenticated/dashboard/_admin")({
    beforeLoad: ({ context }) => {
        if (
            !authClient.admin.checkRolePermission({
                role: (context.session.user.role ??
                    "user") as keyof typeof roles,
                permissions: { siteAccess: ["admin"] },
            })
        ) {
            throw redirect({ to: "/dashboard", replace: true });
        }
    },
    component: Outlet,
});
