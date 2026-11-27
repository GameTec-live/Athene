import { notFound } from "@tanstack/react-router";
import { and, asc, count, eq, isNotNull } from "drizzle-orm";
import { db } from "#/db";
import {
    assignment,
    assignmentGroup,
    assignmentMember,
    autograde,
    classRoom,
    roster,
    rosterMember,
} from "#/db/schema";
import { env } from "#/env";
import { api } from "../forgejo/forgejo-api";
import { requireOrganizationAccess } from "../forgejo/orgs.server";
import type { ProvisionContext } from "./provision.server";
import { getStudentsForUsers } from "./students.server";

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

/**
 * Requires organization access and returns the assignment within the class,
 * ready for provisioning.
 */
export async function requireAssignment(params: {
    orgSlug: string;
    classId: string;
    assignmentId: string;
}) {
    const organization = await requireOrganizationAccess(params.orgSlug);
    const classroom = await requireClassroom(organization.id, params.classId);
    const [row] = await db
        .select()
        .from(assignment)
        .where(
            and(
                eq(assignment.id, params.assignmentId),
                eq(assignment.classRoomId, classroom.id),
            ),
        );
    if (!row) throw notFound();
    const ctx: ProvisionContext = {
        assignment: row,
        orgName: organization.name ?? organization.slug,
        className: classroom.name,
    };
    return { classroom, ctx };
}

/** Rosters and autograding configs offered by the assignment forms. */
export async function getAssignmentFormOptions() {
    const [rosters, autogrades] = await Promise.all([
        db
            .select({
                id: roster.id,
                name: roster.name,
                memberCount: count(rosterMember.userId),
            })
            .from(roster)
            .leftJoin(rosterMember, eq(rosterMember.rosterId, roster.id))
            .groupBy(roster.id)
            .orderBy(asc(roster.name)),
        db
            .select({ id: autograde.id, name: autograde.name })
            .from(autograde)
            .orderBy(asc(autograde.name)),
    ]);
    return { rosters, autogrades };
}

/** Returns an error message if a referenced config or roster is missing. */
export async function findMissingReference(refs: {
    autogradeId: string | null;
    rosterRestriction: string | null;
}) {
    if (refs.autogradeId) {
        const [config] = await db
            .select({ id: autograde.id })
            .from(autograde)
            .where(eq(autograde.id, refs.autogradeId));
        if (!config) return "The autograding config was not found.";
    }
    if (refs.rosterRestriction) {
        const [restriction] = await db
            .select({ id: roster.id })
            .from(roster)
            .where(eq(roster.id, refs.rosterRestriction));
        if (!restriction) return "The roster was not found.";
    }
    return null;
}

/** All repositories an assignment manages, of members and groups. */
export async function getAssignmentRepositories(assignmentId: string) {
    const [members, groups] = await Promise.all([
        db
            .select({
                id: assignmentMember.repositoryId,
                name: assignmentMember.repositoryName,
            })
            .from(assignmentMember)
            .where(
                and(
                    eq(assignmentMember.assignmentId, assignmentId),
                    isNotNull(assignmentMember.repositoryName),
                ),
            ),
        db
            .select({
                id: assignmentGroup.repositoryId,
                name: assignmentGroup.repositoryName,
            })
            .from(assignmentGroup)
            .where(
                and(
                    eq(assignmentGroup.assignmentId, assignmentId),
                    isNotNull(assignmentGroup.repositoryName),
                ),
            ),
    ]);
    return [...members, ...groups].map((row) => ({
        id: row.id,
        name: row.name as string,
    }));
}

/** Resolves the current Forgejo usernames of Athene users. */
export async function getUsernamesForUsers(userIds: string[]) {
    const students = await getStudentsForUsers(userIds);
    return new Map(
        [...students].map(([userId, student]) => [userId, student.username]),
    );
}

export function repositoryUrl(orgName: string, repositoryName: string) {
    return `${env.FORGEJO_BASE_URL.replace(/\/+$/, "")}/${encodeURIComponent(orgName)}/${encodeURIComponent(repositoryName)}`;
}

const provisioningLocks = new Map<string, Promise<void>>();

/**
 * Serializes provisioning of one repository across concurrent requests.
 * In-process because Athene runs as a single server: a database lock would
 * hold a pooled connection while the work inside needs another one, so a
 * burst of joins could exhaust the pool.
 */
export async function withProvisioningLock<T>(
    key: string,
    task: () => Promise<T>,
): Promise<T> {
    const run = (provisioningLocks.get(key) ?? Promise.resolve()).then(task);
    const tail = run.then(
        () => {},
        () => {},
    );
    provisioningLocks.set(key, tail);
    try {
        return await run;
    } finally {
        if (provisioningLocks.get(key) === tail) provisioningLocks.delete(key);
    }
}

export function generateJoinCode() {
    const bytes = crypto.getRandomValues(new Uint8Array(12));
    return Buffer.from(bytes).toString("base64url");
}
