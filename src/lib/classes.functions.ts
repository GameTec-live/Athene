import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import * as v from "valibot";
import { db } from "#/db";
import { classRoom } from "#/db/schema";
import { authMiddleware } from "./auth.functions";
import { classNameSchema, orgSlugSchema } from "./common-schemas";
import { requireOrganizationAccess } from "./forgejo/orgs.server";

export const getOrganizationClasses = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .validator(
        v.object({
            orgSlug: orgSlugSchema,
        }),
    )
    .handler(async ({ data }) => {
        const organization = await requireOrganizationAccess(data.orgSlug);
        const classes = await db
            .select()
            .from(classRoom)
            .where(eq(classRoom.organizationId, organization.id))
            .orderBy(asc(classRoom.name), asc(classRoom.id));
        return { organization, classes };
    });

export const getClass = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .validator(
        v.object({
            classId: v.pipe(v.string(), v.uuid()),
        }),
    )
    .handler(async ({ data }) => {
        const [classroom] = await db
            .select()
            .from(classRoom)
            .where(eq(classRoom.id, data.classId));
        if (!classroom) throw notFound();
        await requireOrganizationAccess(classroom.organizationId);
        return classroom;
    });

export const createClass = createServerFn({ method: "POST" })
    .middleware([authMiddleware])
    .validator(
        v.object({
            orgSlug: orgSlugSchema,
            name: classNameSchema,
        }),
    )
    .handler(async ({ data }) => {
        const organization = await requireOrganizationAccess(data.orgSlug);
        const [classroom] = await db
            .insert(classRoom)
            .values({
                organizationId: organization.id,
                name: data.name,
            })
            .returning();
        return classroom;
    });
