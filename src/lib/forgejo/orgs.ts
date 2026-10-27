import { createServerFn } from "@tanstack/react-start";
import { dashboardMiddleware } from "#/lib/auth.functions";
import { createOrganizationSchema } from "#/lib/common-schemas";
import { createForgejoOrganization } from "./create-org.server";
import { getCurrentOrganizations, getForgejoUsername } from "./orgs.server";

export const createOrganization = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .validator(createOrganizationSchema)
    .handler(async ({ data }) => {
        try {
            const username = await getForgejoUsername();
            return await createForgejoOrganization(username, {
                username: data.name,
                visibility: data.visibility,
                repo_admin_change_team_access: data.repoAdminChangeTeamAccess,
            });
        } catch (error) {
            console.error("Failed to create organization", error);
            return {
                success: false as const,
                error: "Unable to create the organization. Please try again.",
            };
        }
    });

/** Fetches all organizations the user has access to */
export const getOrganizations = createServerFn({ method: "GET" })
    .middleware([dashboardMiddleware])
    .handler(() => getCurrentOrganizations());
