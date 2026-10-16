import * as v from "valibot";

export const classNameSchema = v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "Enter a class name."),
);

export const orgSlugSchema = v.pipe(
    v.string(),
    v.trim(),
    v.toLowerCase(),
    v.minLength(1),
    v.maxLength(255),
);

export const createOrganizationSchema = v.object({
    name: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, "Enter an organization name."),
        v.maxLength(255, "Organization names must be at most 255 characters."),
    ),
    visibility: v.picklist(["public", "limited", "private"]),
    repoAdminChangeTeamAccess: v.boolean(),
});
