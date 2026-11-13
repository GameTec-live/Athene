import { notFound } from "@tanstack/react-router";
import { and, eq, sql } from "drizzle-orm";
import { db } from "#/db";
import { classRoom } from "#/db/schema";
import { env } from "#/env";
import { api } from "../forgejo/forgejo-api";
import { getForgejoUserById, getLinkedForgejoIds } from "./students.server";

/** Requires organization access and returns the class within it. */
export async function requireClassroom(
    organizationId: number,
    classId: string,
) {
    const [classroom] = await db
        .select()
        .from(classRoom)
        .where(
            and(
                eq(classRoom.id, classId),
                eq(classRoom.organizationId, organizationId),
            ),
        );
    if (!classroom) throw notFound();
    return classroom;
}

const orgNameCache = new Map<number, { name: string; expires: number }>();

/**
 * Forgejo has no organization-by-id endpoint, so page through the admin
 * listing. Results are cached briefly; renamed organizations resolve again
 * after the cache expires.
 */
export async function getOrganizationNameById(organizationId: number) {
    const cached = orgNameCache.get(organizationId);
    if (cached && cached.expires > Date.now()) return cached.name;

    const limit = 50;
    for (let page = 1; ; page++) {
        const { data } = await api.admin.adminGetAllOrgs(
            { page, limit },
            { signal: AbortSignal.timeout(10_000) },
        );
        for (const org of data) {
            if (org.id && org.name) {
                orgNameCache.set(org.id, {
                    name: org.name,
                    expires: Date.now() + 5 * 60_000,
                });
            }
        }
        const match = data.find((org) => org.id === organizationId);
        if (match?.name) return match.name;
        if (data.length < limit) break;
    }
    throw new Error(`Forgejo organization ${organizationId} not found`);
}

/** Resolves the current Forgejo usernames of Athene users. */
export async function getUsernamesForUsers(userIds: string[]) {
    const forgejoIds = await getLinkedForgejoIds(userIds);
    const usernames = new Map<string, string>();
    for (const [userId, forgejoId] of forgejoIds) {
        const student = await getForgejoUserById(forgejoId);
        if (student) usernames.set(userId, student.username);
    }
    return usernames;
}

export function repositoryUrl(orgName: string, repositoryName: string) {
    return `${env.FORGEJO_BASE_URL.replace(/\/+$/, "")}/${encodeURIComponent(orgName)}/${encodeURIComponent(repositoryName)}`;
}

/**
 * Serializes provisioning of one repository across concurrent requests. The
 * transaction only holds the advisory lock; work inside uses its own queries.
 */
export function withProvisioningLock<T>(key: string, task: () => Promise<T>) {
    return db.transaction(async (tx) => {
        await tx.execute(
            sql`select pg_advisory_xact_lock(hashtext(${`athene:provision:${key}`}))`,
        );
        return task();
    });
}

export function generateJoinCode() {
    const bytes = crypto.getRandomValues(new Uint8Array(12));
    return Buffer.from(bytes).toString("base64url");
}
