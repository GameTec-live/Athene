import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, eq, inArray, isNotNull } from "drizzle-orm";
import * as v from "valibot";
import { db } from "#/db";
import {
    assignment,
    assignmentGroup,
    assignmentMember,
    autograde,
    user,
} from "#/db/schema";
import { env } from "#/env";
import { dashboardMiddleware } from "../auth.functions";
import { api } from "../forgejo/forgejo-api";
import { archiveAssignment, unarchiveAssignment } from "./archive.server";
import {
    findMissingReference,
    generateJoinCode,
    getAssignmentFormOptions,
    getAssignmentRepositories,
    getUsernamesForUsers,
    repositoryUrl,
    requireAssignment,
    withProvisioningLock,
} from "./assignments.server";
import { usesCustomPlaceholder } from "./naming";
import {
    addGroupTeamMember,
    applyFeatures,
    describeError,
    forgejoStatus,
    type ProvisionContext,
    type ProvisionResult,
    type ProvisionTask,
    provisionGroupRepository,
    provisionMemberRepository,
    repoNameFor,
    runLimited,
    streamProvisioning,
} from "./provision.server";
import {
    addStudentsSchema,
    assignmentParamsSchema,
    FUTURE_DEADLINE_MESSAGE,
    type GroupTarget,
    removeStudentSchema,
    updateAssignmentSchema,
} from "./schemas";
import {
    ensureAtheneUsers,
    getForgejoUsersByIds,
    getStudentsForUsers,
} from "./students.server";
import type { ForgejoStudent } from "./types";

type Group = typeof assignmentGroup.$inferSelect;

const fail = (error: string) => ({ success: false as const, error });

function enc(value: string) {
    return encodeURIComponent(value);
}

/**
 * Maximum points of an autograding config: its `maxPoints`, or else the sum
 * of `tests[].points`. Null when the config defines neither.
 */
function maxPointsOf(config: unknown) {
    if (!config || typeof config !== "object") return null;
    if ("maxPoints" in config && typeof config.maxPoints === "number") {
        return config.maxPoints > 0 ? config.maxPoints : null;
    }
    if (!("tests" in config) || !Array.isArray(config.tests)) return null;
    let sum = 0;
    for (const test of config.tests) {
        if (
            test &&
            typeof test === "object" &&
            "points" in test &&
            typeof test.points === "number"
        ) {
            sum += test.points;
        }
    }
    return sum > 0 ? sum : null;
}

/** Placeholder users get an address that is not worth showing. */
function visibleEmail(email: string) {
    return email.endsWith(".invalid") ? null : email;
}

function memberStatus(repositoryName: string | null, error: string | null) {
    if (error) return "failed" as const;
    return repositoryName ? ("ready" as const) : ("pending" as const);
}

/** Everything the assignment details page shows and edits. */
export const getAssignmentDetails = createServerFn({ method: "GET" })
    .middleware([dashboardMiddleware])
    .validator(assignmentParamsSchema)
    .handler(async ({ data }) => {
        const { classroom, ctx } = await requireAssignment(data);
        const a = ctx.assignment;
        const [options, groups, members, [config]] = await Promise.all([
            getAssignmentFormOptions(),
            db
                .select()
                .from(assignmentGroup)
                .where(eq(assignmentGroup.assignmentId, a.id))
                .orderBy(
                    asc(assignmentGroup.createdAt),
                    asc(assignmentGroup.name),
                ),
            db
                .select({
                    member: assignmentMember,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                })
                .from(assignmentMember)
                .innerJoin(user, eq(user.id, assignmentMember.userId))
                .where(eq(assignmentMember.assignmentId, a.id))
                .orderBy(asc(user.name)),
            a.autogradeId
                ? db
                      .select({
                          name: autograde.name,
                          config: autograde.config,
                      })
                      .from(autograde)
                      .where(eq(autograde.id, a.autogradeId))
                : Promise.resolve([]),
        ]);

        // Forgejo profiles are a nicety; the page still works without them.
        let students = new Map<string, ForgejoStudent>();
        try {
            students = await getStudentsForUsers(
                members.map((row) => row.member.userId),
            );
        } catch (error) {
            console.error("Failed to resolve students", error);
        }

        const groupById = new Map(groups.map((group) => [group.id, group]));
        const memberCounts = new Map<string, number>();
        for (const { member } of members) {
            if (!member.groupId) continue;
            memberCounts.set(
                member.groupId,
                (memberCounts.get(member.groupId) ?? 0) + 1,
            );
        }
        const urlOf = (name: string | null) =>
            name ? repositoryUrl(ctx.orgName, name) : null;
        const isGroup = a.type === "group";

        return {
            organization: { name: ctx.orgName },
            classroom: { id: classroom.id, name: classroom.name },
            ...options,
            assignment: {
                id: a.id,
                name: a.name,
                type: a.type,
                deadline: a.deadline,
                archiveOnDeadline: a.archiveOnDeadline,
                archivedAt: a.archivedAt,
                autogradeId: a.autogradeId,
                namingTemplate: a.namingTemplate ?? "",
                studentIsAdmin: a.studentIsAdmin,
                templateRepository: a.templateRepository,
                features: {
                    issues: a.afHasIssues,
                    pullRequests: a.afHasPullRequests,
                    wiki: a.afHasWiki,
                    projects: a.afHasProjects,
                    releases: a.afHasReleases,
                    packages: a.afHasPackages,
                },
                rosterRestriction: a.rosterRestriction,
                joinUrl: a.joinCode
                    ? `${env.BETTER_AUTH_URL.replace(/\/+$/, "")}/join/${a.joinCode}`
                    : null,
                allowCreatingGroups: isGroup && a.allowCreatingGroups,
                maxGroups: a.maxGroups,
                maxGroupMembers: a.maxGroupMembers,
                createdAt: a.createdAt,
            },
            autograding: config
                ? { name: config.name, maxPoints: maxPointsOf(config.config) }
                : null,
            groups: groups.map((group) => ({
                id: group.id,
                name: group.name,
                repositoryName: group.repositoryName,
                repositoryUrl: urlOf(group.repositoryName),
                status: memberStatus(
                    group.repositoryName,
                    group.provisioningError,
                ),
                error: group.provisioningError,
                memberCount: memberCounts.get(group.id) ?? 0,
            })),
            members: members.map(({ member, ...account }) => {
                const student = students.get(member.userId);
                const group = member.groupId
                    ? groupById.get(member.groupId)
                    : undefined;
                const repositoryName = isGroup
                    ? (group?.repositoryName ?? null)
                    : member.repositoryName;
                // A member's own error covers failing to join a group's team.
                const error =
                    (isGroup ? group?.provisioningError : null) ??
                    member.provisioningError;
                return {
                    userId: member.userId,
                    forgejoId: student?.forgejoId ?? null,
                    name: student?.fullName ?? account.name,
                    username: student?.username ?? null,
                    email: student?.email ?? visibleEmail(account.email),
                    avatarUrl: student?.avatarUrl ?? account.image,
                    groupId: member.groupId,
                    groupName: group?.name ?? null,
                    repositoryName,
                    repositoryUrl: urlOf(repositoryName),
                    status: memberStatus(repositoryName, error),
                    error,
                    addedAt: member.createdAt,
                    points: member.autoGradeResult,
                    /** Serialized JSON, shown and exported but never interpreted. */
                    pointsDetails:
                        member.autoGradeResultDetails == null
                            ? null
                            : JSON.stringify(member.autoGradeResultDetails),
                };
            }),
        };
    });

export type AssignmentDetails = Awaited<
    ReturnType<typeof getAssignmentDetails>
>;

/** Saves the editable settings and applies feature changes to every repository. */
export const updateAssignment = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .validator(updateAssignmentSchema)
    .handler(async ({ data }) => {
        const { ctx } = await requireAssignment(data);
        const a = ctx.assignment;
        const s = data.settings;
        if (a.archivedAt) {
            return fail("Unarchive the assignment to change its settings.");
        }

        const deadline = s.deadline ? new Date(s.deadline) : null;
        if (
            deadline &&
            deadline.getTime() !== a.deadline?.getTime() &&
            deadline.getTime() <= Date.now()
        ) {
            return fail(FUTURE_DEADLINE_MESSAGE);
        }
        const isGroup = a.type === "group";
        if (
            !s.joinLink &&
            (usesCustomPlaceholder(a.namingTemplate) ||
                (isGroup && a.allowCreatingGroups))
        ) {
            return fail("This assignment requires joining via link.");
        }
        const autogradeId = s.autograding ? s.autogradeId : null;
        const rosterRestriction = s.joinLink ? s.rosterRestriction : null;
        const missing = await findMissingReference({
            autogradeId,
            rosterRestriction,
        });
        if (missing) return fail(missing);

        const features = {
            afHasIssues: s.features.issues,
            afHasPackages: s.features.packages,
            afHasProjects: s.features.projects,
            afHasPullRequests: s.features.pullRequests,
            afHasReleases: s.features.releases,
            afHasWiki: s.features.wiki,
        };
        const featuresChanged = Object.entries(features).some(
            ([key, value]) => a[key as keyof typeof features] !== value,
        );

        const [updated] = await db
            .update(assignment)
            .set({
                name: s.name,
                deadline,
                archiveOnDeadline: !!deadline && s.archiveOnDeadline,
                autogradeId,
                rosterRestriction,
                // Keep the existing link working while joining stays enabled.
                joinCode: s.joinLink
                    ? (a.joinCode ?? generateJoinCode())
                    : null,
                maxGroups:
                    isGroup && a.allowCreatingGroups && s.maxGroups > 0
                        ? s.maxGroups
                        : null,
                maxGroupMembers:
                    isGroup && s.maxGroupMembers > 0 ? s.maxGroupMembers : null,
            })
            .where(eq(assignment.id, a.id))
            .returning();

        // Features are only saved once every repository has them, so saving
        // the same settings again retries the repositories that failed.
        const failedRepositories: string[] = [];
        if (featuresChanged) {
            const updatedCtx = {
                ...ctx,
                assignment: { ...updated, ...features },
            };
            const repositories = await getAssignmentRepositories(a.id);
            await runLimited(repositories, 3, async ({ name }) => {
                try {
                    await applyFeatures(updatedCtx, name);
                } catch (error) {
                    if (forgejoStatus(error) === 404) return;
                    console.error(`Failed to update ${name}`, error);
                    failedRepositories.push(name);
                }
            });
            if (failedRepositories.length === 0) {
                await db
                    .update(assignment)
                    .set(features)
                    .where(eq(assignment.id, a.id));
            }
        }
        return { success: true as const, failedRepositories };
    });

/**
 * Adds members to a group's existing repository, or (re)provisions the
 * repository when it is missing or failed before.
 */
async function addMembersToGroup(
    ctx: ProvisionContext,
    groupId: string,
    added: { userId: string; username: string }[],
): Promise<ProvisionResult> {
    // Re-read under the lock: a join may have provisioned it meanwhile.
    const [group] = await db
        .select()
        .from(assignmentGroup)
        .where(eq(assignmentGroup.id, groupId));
    if (!group) return { success: false, error: "The group no longer exists." };

    if (
        group.repositoryName &&
        group.forgejoTeamId &&
        !group.provisioningError
    ) {
        const failed: string[] = [];
        let lastError = "";
        for (const member of added) {
            const where = and(
                eq(assignmentMember.assignmentId, ctx.assignment.id),
                eq(assignmentMember.userId, member.userId),
            );
            try {
                await addGroupTeamMember(group, member.username);
            } catch (error) {
                console.error("Failed to add group member", error);
                lastError = describeError(error);
                failed.push(member.username);
                await db
                    .update(assignmentMember)
                    .set({ provisioningError: lastError })
                    .where(where);
            }
        }
        return failed.length === 0
            ? { success: true, repositoryName: group.repositoryName }
            : {
                  success: false,
                  error: `Could not add ${failed.join(", ")}: ${lastError}`,
              };
    }

    const members = await db
        .select({ userId: assignmentMember.userId })
        .from(assignmentMember)
        .where(eq(assignmentMember.groupId, group.id));
    const usernames = await getUsernamesForUsers(
        members.map((member) => member.userId),
    );
    return provisionGroupRepository(ctx, group, [...usernames.values()]);
}

/**
 * Adds students (and, for group assignments, new groups) to an existing
 * assignment. Repositories are created right away unless their name waits
 * for $CUSTOM, with progress streamed like on creation.
 */
export const addAssignmentStudents = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .validator(addStudentsSchema)
    .handler(async ({ data }) => {
        const { ctx } = await requireAssignment(data);
        const a = ctx.assignment;
        const isGroup = a.type === "group";
        if (a.archivedAt)
            return fail("Unarchive the assignment to add students.");
        if (!isGroup && data.newGroups.length > 0) {
            return fail("Individual assignments have no groups.");
        }
        if (data.students.length === 0 && data.newGroups.length === 0) {
            return fail("Add at least one student or group.");
        }
        const forgejoIds = data.students.map((s) => s.forgejoId);
        if (new Set(forgejoIds).size !== forgejoIds.length) {
            return fail("Each student can only be added once.");
        }

        const existingGroups = isGroup
            ? await db
                  .select()
                  .from(assignmentGroup)
                  .where(eq(assignmentGroup.assignmentId, a.id))
            : [];
        const groupById = new Map(existingGroups.map((g) => [g.id, g]));
        const groupNames = new Set(
            existingGroups.map((g) => g.name.toLowerCase()),
        );
        for (const name of data.newGroups) {
            if (groupNames.has(name.toLowerCase())) {
                return fail(`A group named "${name}" already exists.`);
            }
            groupNames.add(name.toLowerCase());
        }

        const targetKey = (target: GroupTarget) =>
            target.type === "existing" ? target.id : `new:${target.index}`;
        if (isGroup) {
            for (const { group } of data.students) {
                if (!group) return fail("Assign every student to a group.");
                const exists =
                    group.type === "existing"
                        ? groupById.has(group.id)
                        : group.index < data.newGroups.length;
                if (!exists) return fail("A selected group no longer exists.");
            }
            if (a.maxGroupMembers !== null) {
                const counts = await db
                    .select({
                        groupId: assignmentMember.groupId,
                        members: count(),
                    })
                    .from(assignmentMember)
                    .where(eq(assignmentMember.assignmentId, a.id))
                    .groupBy(assignmentMember.groupId);
                const totals = new Map<string, number>();
                for (const row of counts) {
                    if (row.groupId) totals.set(row.groupId, row.members);
                }
                for (const { group } of data.students) {
                    if (!group) continue;
                    const key = targetKey(group);
                    const total = (totals.get(key) ?? 0) + 1;
                    if (total > a.maxGroupMembers) {
                        return fail(
                            "A group would have more members than allowed.",
                        );
                    }
                    totals.set(key, total);
                }
            }
        }

        let students: Map<number, ForgejoStudent>;
        try {
            students = await getForgejoUsersByIds(forgejoIds);
        } catch (error) {
            console.error("Failed to resolve students", error);
            return fail("Unable to find one of the selected students.");
        }

        // Reject names that collide with this assignment's repositories.
        const deferred = usesCustomPlaceholder(a.namingTemplate);
        if (!deferred) {
            const taken = new Set(
                (await getAssignmentRepositories(a.id)).map((repo) =>
                    repo.name.toLowerCase(),
                ),
            );
            const names = isGroup
                ? data.newGroups.map((groupName) =>
                      repoNameFor(ctx, { groupName }),
                  )
                : [...students.values()].map((student) =>
                      repoNameFor(ctx, { studentName: student.username }),
                  );
            for (const name of names) {
                if (taken.has(name.toLowerCase())) {
                    return fail(
                        `A repository named "${name}" already exists for this assignment.`,
                    );
                }
                taken.add(name.toLowerCase());
            }
        }

        let userIds: Map<number, string>;
        try {
            userIds = await ensureAtheneUsers(students.values());
        } catch (error) {
            console.error("Failed to create placeholder users", error);
            return fail(
                error instanceof Error
                    ? error.message
                    : "Unable to register the selected students.",
            );
        }
        const usernameByUserId = new Map(
            [...students.values()].map((student) => [
                userIds.get(student.forgejoId) as string,
                student.username,
            ]),
        );
        if (usernameByUserId.size > 0) {
            const [existing] = await db
                .select({ userId: assignmentMember.userId })
                .from(assignmentMember)
                .where(
                    and(
                        eq(assignmentMember.assignmentId, a.id),
                        inArray(assignmentMember.userId, [
                            ...usernameByUserId.keys(),
                        ]),
                    ),
                )
                .limit(1);
            if (existing) {
                return fail(
                    `${usernameByUserId.get(existing.userId)} is already part of this assignment.`,
                );
            }
        }

        let saved: {
            created: Group[];
            members: { userId: string; groupId: string | null }[];
        };
        try {
            saved = await db.transaction(async (tx) => {
                const created =
                    data.newGroups.length > 0
                        ? await tx
                              .insert(assignmentGroup)
                              .values(
                                  data.newGroups.map((name) => ({
                                      assignmentId: a.id,
                                      name,
                                  })),
                              )
                              .returning()
                        : [];
                const createdByName = new Map(created.map((g) => [g.name, g]));
                const groupIdOf = (target: GroupTarget | null) => {
                    if (!isGroup || !target) return null;
                    if (target.type === "existing") return target.id;
                    return (
                        createdByName.get(data.newGroups[target.index])?.id ??
                        null
                    );
                };
                const members = data.students.map((student) => ({
                    userId: userIds.get(student.forgejoId) as string,
                    assignmentId: a.id,
                    groupId: groupIdOf(student.group),
                }));
                if (members.length > 0) {
                    await tx.insert(assignmentMember).values(members);
                }
                return { created, members };
            });
        } catch (error) {
            console.error("Failed to add students", error);
            return fail("Unable to save the changes. Please try again.");
        }

        const tasks: ProvisionTask[] = [];
        if (!isGroup) {
            if (!deferred) {
                for (const { userId } of saved.members) {
                    const username = usernameByUserId.get(userId) as string;
                    tasks.push({
                        name: username,
                        run: () =>
                            withProvisioningLock(
                                `member:${a.id}:${userId}`,
                                () =>
                                    provisionMemberRepository(ctx, {
                                        userId,
                                        username,
                                    }),
                            ),
                    });
                }
            }
        } else {
            const touched = new Map(saved.created.map((g) => [g.id, g]));
            for (const { groupId } of saved.members) {
                const group = groupId ? groupById.get(groupId) : undefined;
                if (group) touched.set(group.id, group);
            }
            for (const group of touched.values()) {
                // Until someone enters the $CUSTOM name there is no repository.
                if (deferred && !group.repositoryName) continue;
                const added = saved.members
                    .filter((member) => member.groupId === group.id)
                    .map((member) => ({
                        userId: member.userId,
                        username: usernameByUserId.get(member.userId) as string,
                    }));
                tasks.push({
                    name: group.name,
                    run: () =>
                        withProvisioningLock(`group:${group.id}`, () =>
                            addMembersToGroup(ctx, group.id, added),
                        ),
                });
            }
        }

        return {
            success: true as const,
            repositories: tasks.map((task) => task.name),
            progress: tasks.length > 0 ? streamProvisioning(tasks) : null,
        };
    });

/**
 * Removes a student and revokes their repository access. Repositories stay:
 * a group's keeps serving the group, an individual one remains in the
 * organization but is no longer managed by the assignment.
 */
export const removeAssignmentStudent = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .validator(removeStudentSchema)
    .handler(async ({ data }) => {
        const { ctx } = await requireAssignment(data);
        const a = ctx.assignment;
        if (a.archivedAt) {
            return fail("Unarchive the assignment to remove students.");
        }
        const where = and(
            eq(assignmentMember.assignmentId, a.id),
            eq(assignmentMember.userId, data.userId),
        );
        const [member] = await db.select().from(assignmentMember).where(where);
        if (!member) return fail("The student is not part of this assignment.");

        const lockKey = member.groupId
            ? `group:${member.groupId}`
            : `member:${a.id}:${data.userId}`;
        return withProvisioningLock(lockKey, async () => {
            const [current] = await db
                .select()
                .from(assignmentMember)
                .where(where);
            if (!current) return { success: true as const };

            const username = (await getUsernamesForUsers([data.userId])).get(
                data.userId,
            );
            if (username) {
                try {
                    if (current.groupId) {
                        const [group] = await db
                            .select({ teamId: assignmentGroup.forgejoTeamId })
                            .from(assignmentGroup)
                            .where(eq(assignmentGroup.id, current.groupId));
                        if (group?.teamId) {
                            await api.teams.orgRemoveTeamMember(
                                group.teamId,
                                enc(username),
                            );
                        }
                    } else if (current.repositoryName) {
                        await api.repos.repoDeleteCollaborator(
                            enc(ctx.orgName),
                            enc(current.repositoryName),
                            enc(username),
                        );
                    }
                } catch (error) {
                    if (forgejoStatus(error) !== 404) {
                        console.error("Failed to revoke access", error);
                        return fail(
                            "Could not revoke the student's repository access. Please try again.",
                        );
                    }
                }
            }
            await db.delete(assignmentMember).where(where);
            return { success: true as const };
        });
    });

/** Archives or unarchives all repositories, like the deadline task does. */
export const setAssignmentArchived = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .validator(
        v.object({ ...assignmentParamsSchema.entries, archived: v.boolean() }),
    )
    .handler(async ({ data }) => {
        const { ctx } = await requireAssignment(data);
        const result = data.archived
            ? await archiveAssignment(ctx.assignment.id, ctx.orgName)
            : await unarchiveAssignment(ctx.assignment, ctx.orgName);
        if (result.failed.length > 0) {
            return fail(
                `${result.failed.length} of ${result.total} repositories could not be ${data.archived ? "archived" : "unarchived"}. Please try again.`,
            );
        }
        return { success: true as const };
    });

/**
 * Permanently deletes the assignment with all its repositories and teams.
 * If anything in Forgejo cannot be deleted, the assignment is kept so the
 * deletion can be retried.
 */
export const deleteAssignment = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .validator(assignmentParamsSchema)
    .handler(async ({ data }) => {
        const { ctx } = await requireAssignment(data);
        const a = ctx.assignment;
        // Close joining first so no new repositories appear meanwhile.
        await db
            .update(assignment)
            .set({ joinCode: null })
            .where(eq(assignment.id, a.id));

        const [repositories, teams] = await Promise.all([
            getAssignmentRepositories(a.id),
            db
                .select({ id: assignmentGroup.forgejoTeamId })
                .from(assignmentGroup)
                .where(
                    and(
                        eq(assignmentGroup.assignmentId, a.id),
                        isNotNull(assignmentGroup.forgejoTeamId),
                    ),
                ),
        ]);
        const failed: string[] = [];
        const attempt = async (label: string, run: () => Promise<unknown>) => {
            try {
                await run();
            } catch (error) {
                if (forgejoStatus(error) === 404) return;
                console.error(`Failed to delete ${label}`, error);
                failed.push(label);
            }
        };
        await runLimited(repositories, 3, (repo) =>
            attempt(repo.name, async () => {
                // Resolve by id: the stored name may be stale after a rename,
                // and could by now belong to an unrelated repository.
                if (repo.id === null) return;
                const { data } = await api.repositories.repoGetById(repo.id);
                const [owner, name] = (data.full_name ?? "").split("/");
                // Moved out of the organization, so no longer ours to delete.
                if (owner?.toLowerCase() !== ctx.orgName.toLowerCase()) return;
                await api.repos.repoDelete(enc(owner), enc(name));
            }),
        );
        await runLimited(teams, 3, (team) =>
            attempt(`team ${team.id}`, () =>
                api.teams.orgDeleteTeam(team.id as number),
            ),
        );
        if (failed.length > 0) {
            await db
                .update(assignment)
                .set({ joinCode: a.joinCode })
                .where(eq(assignment.id, a.id));
            return fail(
                `${failed.length} repositories or teams could not be deleted, so the assignment was kept. Please try again.`,
            );
        }
        await db.delete(assignment).where(eq(assignment.id, a.id));
        return { success: true as const };
    });
