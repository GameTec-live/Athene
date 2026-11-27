import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { asc, eq } from "drizzle-orm";
import * as v from "valibot";
import { db } from "#/db";
import { assignment, autograde } from "#/db/schema";
import { dashboardMiddleware } from "../auth.functions";
import { getVisibleRepositories } from "./repositories.server";
import { presetSchema } from "./schemas";

const idSchema = v.pipe(v.string(), v.uuid());

// Like rosters, presets are shared resources for users with dashboard access.
export const getAutogradingPresets = createServerFn({ method: "GET" })
    .middleware([dashboardMiddleware])
    .handler(async () => {
        const presets = await db
            .select()
            .from(autograde)
            .orderBy(asc(autograde.name), asc(autograde.id));
        // Existing JSON may predate the config schema; preserve it for repair.
        return presets.map((preset) => ({
            id: preset.id,
            name: preset.name,
            configJson: JSON.stringify(preset.config, null, 4),
            createdAt: preset.createdAt,
            updatedAt: preset.updatedAt,
        }));
    });

export const saveAutogradingPreset = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .validator(v.object({ id: v.optional(idSchema), preset: presetSchema }))
    .handler(async ({ data }) => {
        const [preset] = data.id
            ? await db
                  .update(autograde)
                  .set(data.preset)
                  .where(eq(autograde.id, data.id))
                  .returning()
            : await db.insert(autograde).values(data.preset).returning();
        if (!preset) throw notFound();
        return { id: preset.id };
    });

export const deleteAutogradingPreset = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .validator(v.object({ id: idSchema }))
    .handler(({ data }) =>
        db.transaction(async (tx) => {
            const [preset] = await tx
                .select({ id: autograde.id })
                .from(autograde)
                .where(eq(autograde.id, data.id))
                .for("update");
            if (!preset) throw notFound();
            const [reference] = await tx
                .select({ id: assignment.id })
                .from(assignment)
                .where(eq(assignment.autogradeId, data.id))
                .limit(1);
            if (reference) return { status: "in-use" as const };
            await tx.delete(autograde).where(eq(autograde.id, data.id));
            return { status: "deleted" as const };
        }),
    );

export const getAutogradingRepositories = createServerFn({ method: "GET" })
    .middleware([dashboardMiddleware])
    .handler(() => getVisibleRepositories());
