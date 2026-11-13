import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq } from "drizzle-orm";
import * as v from "valibot";
import { db } from "#/db";
import { assignment, classRoom, user } from "#/db/schema";
import { dashboardMiddleware } from "./auth.functions";
import { classNameSchema, orgSlugSchema } from "./common-schemas";
import { requireOrganizationAccess } from "./forgejo/orgs.server";

export const getOrganizationClasses = createServerFn({ method: "GET" })
    .middleware([dashboardMiddleware])
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

export const getClassAssignments = createServerFn({ method: "GET" })
    .middleware([dashboardMiddleware])
    .validator(
        v.object({
            orgSlug: orgSlugSchema,
            classId: v.pipe(v.string(), v.uuid()),
        }),
    )
    .handler(async ({ data }) => {
        const organization = await requireOrganizationAccess(data.orgSlug);
        const [classroom] = await db
            .select()
            .from(classRoom)
            .where(
                and(
                    eq(classRoom.id, data.classId),
                    eq(classRoom.organizationId, organization.id),
                ),
            );
        if (!classroom) throw notFound();

        const assignments = await db
            .select({
                id: assignment.id,
                name: assignment.name,
                creatorName: user.name,
                type: assignment.type,
                deadline: assignment.deadline,
                afHasIssues: assignment.afHasIssues,
                afHasPackages: assignment.afHasPackages,
                afHasProjects: assignment.afHasProjects,
                afHasPullRequests: assignment.afHasPullRequests,
                afHasReleases: assignment.afHasReleases,
                afHasWiki: assignment.afHasWiki,
                createdAt: assignment.createdAt,
            })
            .from(assignment)
            .where(eq(assignment.classRoomId, classroom.id))
            .leftJoin(user, eq(assignment.creatorId, user.id))
            .orderBy(asc(assignment.name), asc(assignment.id));
        return { classroom, assignments };
    });

export const createClass = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
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

export const updateClass = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .validator(
        v.object({
            orgSlug: orgSlugSchema,
            classId: v.pipe(v.string(), v.uuid()),
            name: classNameSchema,
        }),
    )
    .handler(async ({ data }) => {
        const organization = await requireOrganizationAccess(data.orgSlug);
        const [classroom] = await db
            .update(classRoom)
            .set({ name: data.name })
            .where(
                and(
                    eq(classRoom.id, data.classId),
                    eq(classRoom.organizationId, organization.id),
                ),
            )
            .returning();
        if (!classroom) throw notFound();
        return classroom;
    });

export const deleteClass = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .validator(
        v.object({
            orgSlug: orgSlugSchema,
            classId: v.pipe(v.string(), v.uuid()),
        }),
    )
    .handler(async ({ data }) => {
        const organization = await requireOrganizationAccess(data.orgSlug);
        const [classroom] = await db
            .delete(classRoom)
            .where(
                and(
                    eq(classRoom.id, data.classId),
                    eq(classRoom.organizationId, organization.id),
                ),
            )
            .returning();
        if (!classroom) throw notFound();
        return classroom;
    });

export type Assignment = Awaited<
    ReturnType<typeof getClassAssignments>
>["assignments"][number];
