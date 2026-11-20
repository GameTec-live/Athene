import { and, eq, isNotNull, isNull, lte, sql } from "drizzle-orm";
import { db } from "#/db";
import {
    assignment,
    assignmentGroup,
    assignmentMember,
    classRoom,
} from "#/db/schema";
import { api } from "../forgejo/forgejo-api";
import { getOrganizationNameById } from "./assignments.server";

function forgejoStatus(error: unknown) {
    return error &&
        typeof error === "object" &&
        "status" in error &&
        typeof error.status === "number"
        ? error.status
        : undefined;
}

/** Archives every repository of one assignment; returns the names that failed. */
async function archiveAssignmentRepositories(
    assignmentId: string,
    orgName: string,
) {
    const [members, groups] = await Promise.all([
        db
            .select({ name: assignmentMember.repositoryName })
            .from(assignmentMember)
            .where(
                and(
                    eq(assignmentMember.assignmentId, assignmentId),
                    isNotNull(assignmentMember.repositoryName),
                ),
            ),
        db
            .select({ name: assignmentGroup.repositoryName })
            .from(assignmentGroup)
            .where(
                and(
                    eq(assignmentGroup.assignmentId, assignmentId),
                    isNotNull(assignmentGroup.repositoryName),
                ),
            ),
    ]);
    const names = [...members, ...groups].map((row) => row.name as string);

    const failed: string[] = [];
    for (const name of names) {
        try {
            await api.repos.repoEdit(
                encodeURIComponent(orgName),
                encodeURIComponent(name),
                { archived: true },
                { signal: AbortSignal.timeout(15_000) },
            );
        } catch (error) {
            // A deleted repository has nothing left to archive.
            if (forgejoStatus(error) === 404) continue;
            console.error(`Failed to archive ${orgName}/${name}`, error);
            failed.push(name);
        }
    }
    return { total: names.length, failed };
}

/**
 * Archives repositories of assignments whose deadline has passed. An
 * assignment is only marked archived once all of its repositories are, so
 * failures are retried on the next run.
 */
export async function archiveDueAssignments() {
    // Skip this run if another instance (or a slow previous run) is busy.
    return db.transaction(async (tx) => {
        const [{ locked }] = (
            await tx.execute<{ locked: boolean }>(
                sql`select pg_try_advisory_xact_lock(hashtext('athene:archive-assignments')) as locked`,
            )
        ).rows;
        if (!locked) return { skipped: true as const };

        const due = await db
            .select({
                id: assignment.id,
                name: assignment.name,
                organizationId: classRoom.organizationId,
            })
            .from(assignment)
            .innerJoin(classRoom, eq(classRoom.id, assignment.classRoomId))
            .where(
                and(
                    eq(assignment.archiveOnDeadline, true),
                    isNull(assignment.archivedAt),
                    lte(assignment.deadline, new Date()),
                ),
            );

        const results = [];
        for (const entry of due) {
            try {
                const orgName = await getOrganizationNameById(
                    entry.organizationId,
                );
                const { total, failed } = await archiveAssignmentRepositories(
                    entry.id,
                    orgName,
                );
                if (failed.length === 0) {
                    await db
                        .update(assignment)
                        .set({ archivedAt: new Date() })
                        .where(eq(assignment.id, entry.id));
                }
                results.push({ assignment: entry.name, total, failed });
            } catch (error) {
                console.error(
                    `Failed to archive assignment ${entry.name}`,
                    error,
                );
                results.push({ assignment: entry.name, error: String(error) });
            }
        }
        return { skipped: false as const, results };
    });
}
