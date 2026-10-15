import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "#/lib/auth.functions";
import { getOrganization, getOrganizationSlugs } from "./orgs.server";

/** Fetches all organizations the user has access to */
export const getOrganizations = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .handler(async () => {
        const slugs = await getOrganizationSlugs();
        return {
            slugs,
            details: Promise.all(
                slugs.map((slug) => getOrganization(slug).catch(() => null)),
            ),
        };
    });
