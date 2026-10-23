import { createServerFn } from "@tanstack/react-start";
import { dashboardMiddleware } from "#/lib/auth.functions";
import { createOrganizationSchema } from "#/lib/common-schemas";
import { createForgejoOrganization } from "./create-org.server";
import {
    getForgejoUsername,
    getOrganization,
    getOrganizationSlugs,
} from "./orgs.server";

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
        } catch {
            return {
                success: false as const,
                error: "Unable to create the organization. Please try again.",
            };
        }
    });

/** Fetches all organizations the user has access to */
export const getOrganizations = createServerFn({ method: "GET" })
    .middleware([dashboardMiddleware])
    .handler(async () => {
        const slugs = await getOrganizationSlugs();
        return {
            slugs,
            details: Promise.all(
                slugs.map((slug) => getOrganization(slug).catch(() => null)),
            ),
        };
    });
