import { and, eq, isNull, lte, sql } from "drizzle-orm";
import { db } from "#/db";
import { assignment, classRoom } from "#/db/schema";
import { api } from "../forgejo/forgejo-api";
import {
    getAssignmentRepositories,
    getOrganizationNameById,
    resolveRepositoryName,
} from "./assignments.server";
import { forgejoStatus, runLimited } from "./provision.server";

/** Archives or unarchives every repository of one assignment. */
async function setRepositoriesArchived(
    assignmentId: string,
    orgName: string,
    archived: boolean,
) {
    const repositories = await getAssignmentRepositories(assignmentId);
    const failed: string[] = [];
    await runLimited(repositories, 3, async (repo) => {
        try {
            const name = await resolveRepositoryName(repo.id, orgName);
            // A deleted repository has nothing left to change.
            if (!name) return;
            await api.repos.repoEdit(
                encodeURIComponent(orgName),
                encodeURIComponent(name),
                { archived },
                { signal: AbortSignal.timeout(15_000) },
            );
        } catch (error) {
            if (forgejoStatus(error) === 404) return;
            console.error(
                `Failed to ${archived ? "archive" : "unarchive"} ${orgName}/${repo.name}`,
                error,
            );
            failed.push(repo.name);
        }
    });
    return { total: repositories.length, failed };
}

/**
 * Archives all repositories of an assignment, which also closes joining. The
 * assignment is only marked archived once every repository is, so a failed
 * run can simply be repeated.
 */
export async function archiveAssignment(assignmentId: string, orgName: string) {
    const result = await setRepositoriesArchived(assignmentId, orgName, true);
    if (result.failed.length === 0) {
        await db
            .update(assignment)
            .set({ archivedAt: new Date() })
            .where(eq(assignment.id, assignmentId));
    }
    return result;
}

/**
 * Reverts {@link archiveAssignment}. Archiving on a deadline that already
 * passed is switched off, or the deadline task would archive it right away.
 */
export async function unarchiveAssignment(
    target: { id: string; deadline: Date | null },
    orgName: string,
) {
    const result = await setRepositoriesArchived(target.id, orgName, false);
    if (result.failed.length === 0) {
        const deadlinePassed =
            !!target.deadline && target.deadline.getTime() <= Date.now();
        await db
            .update(assignment)
            .set({
                archivedAt: null,
                ...(deadlinePassed ? { archiveOnDeadline: false } : {}),
            })
            .where(eq(assignment.id, target.id));
    }
    return result;
}

/**
 * Archives repositories of assignments whose deadline has passed. Failures
 * are retried on the next run.
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
                const { total, failed } = await archiveAssignment(
                    entry.id,
                    orgName,
                );
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
