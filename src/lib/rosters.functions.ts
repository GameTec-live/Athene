import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, eq } from "drizzle-orm";
import * as v from "valibot";
import { db } from "#/db";
import { roster, rosterMember } from "#/db/schema";
import { dashboardMiddleware } from "./auth.functions";
import { rosterNameSchema } from "./common-schemas";
import {
    addRosterEmail,
    readRosterMembers,
    requireRoster,
    searchForgejoEmails,
} from "./rosters.server";

const rosterIdSchema = v.pipe(v.string(), v.uuid());
const rosterSchema = v.object({ rosterId: rosterIdSchema });

// Rosters are shared dashboard resources; every operation requires dashboard access.
export const getRosters = createServerFn({ method: "GET" })
    .middleware([dashboardMiddleware])
    .handler(() =>
        db.select().from(roster).orderBy(asc(roster.name), asc(roster.id)),
    );

export const createRoster = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .validator(
        v.object({
            name: rosterNameSchema,
        }),
    )
    .handler(async ({ data }) => {
        const [group] = await db.insert(roster).values(data).returning();
        return group;
    });

export const updateRoster = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .validator(
        v.object({
            rosterId: rosterIdSchema,
            name: rosterNameSchema,
        }),
    )
    .handler(async ({ data }) => {
        const [group] = await db
            .update(roster)
            .set({ name: data.name })
            .where(eq(roster.id, data.rosterId))
            .returning();
        if (!group) throw notFound();
        return group;
    });

export const deleteRoster = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .validator(rosterSchema)
    .handler(async ({ data }) => {
        const [group] = await db
            .delete(roster)
            .where(eq(roster.id, data.rosterId))
            .returning();
        if (!group) throw notFound();
        return group;
    });

export const getRoster = createServerFn({ method: "GET" })
    .middleware([dashboardMiddleware])
    .validator(rosterSchema)
    .handler(async ({ data }) => ({
        roster: await requireRoster(data.rosterId),
        members: await readRosterMembers(data.rosterId),
    }));

export const searchRosterUsers = createServerFn({ method: "GET" })
    .middleware([dashboardMiddleware])
    .validator(
        v.object({
            rosterId: rosterIdSchema,
            query: v.pipe(
                v.string(),
                v.trim(),
                v.minLength(1),
                v.maxLength(320),
            ),
        }),
    )
    .handler(async ({ data }) => {
        await requireRoster(data.rosterId);
        return searchForgejoEmails(data.query);
    });

export const addRosterMember = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .validator(
        v.object({
            rosterId: rosterIdSchema,
            email: v.pipe(
                v.string(),
                v.trim(),
                v.toLowerCase(),
                v.email(),
                v.maxLength(320),
            ),
        }),
    )
    .handler(async ({ data }) => {
        await requireRoster(data.rosterId);
        return addRosterEmail(data.rosterId, data.email);
    });

export const removeRosterMember = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .validator(
        v.object({
            rosterId: rosterIdSchema,
            memberId: v.pipe(v.string(), v.minLength(1)),
        }),
    )
    .handler(async ({ data }) => {
        await requireRoster(data.rosterId);
        await db
            .delete(rosterMember)
            .where(
                and(
                    eq(rosterMember.rosterId, data.rosterId),
                    eq(rosterMember.userId, data.memberId),
                ),
            );
    });
