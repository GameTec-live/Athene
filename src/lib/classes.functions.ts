import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import * as v from "valibot";
import { db } from "#/db";
import { classRoom } from "#/db/schema";
import { authMiddleware } from "./auth.functions";
import { requireOrganizationAccess } from "./forgejo/orgs.server";

export const getOrganizationClasses = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .validator(
        v.object({
            orgSlug: v.pipe(
                v.string(),
                v.trim(),
                v.toLowerCase(),
                v.minLength(1),
                v.maxLength(255),
            ),
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
