import { createServerFn } from "@tanstack/react-start";
import { asc, count, eq } from "drizzle-orm";
import * as v from "valibot";
import { db } from "#/db";
import {
    assignment,
    assignmentGroup,
    assignmentMember,
    autograde,
    roster,
    rosterMember,
} from "#/db/schema";
import { dashboardMiddleware } from "../auth.functions";
import { orgSlugSchema } from "../common-schemas";
import type { Repository } from "../forgejo/api";
import { api } from "../forgejo/forgejo-api";
import { requireOrganizationAccess } from "../forgejo/orgs.server";
import { generateJoinCode, requireClassroom } from "./assignments.server";
import { usesCustomPlaceholder } from "./naming";
import {
    type ProvisionContext,
    type ProvisionTask,
    provisionGroupRepository,
    provisionMemberRepository,
    repoNameFor,
    streamProvisioning,
} from "./provision.server";
import { createAssignmentSchema } from "./schemas";
import {
    ensureAtheneUsers,
    getForgejoUserById,
    getForgejoUsersByIds,
    getLinkedForgejoIds,
    searchForgejoUsers,
} from "./students.server";

const classParamsSchema = v.object({
    orgSlug: orgSlugSchema,
    classId: v.pipe(v.string(), v.uuid()),
});

/** Everything the new assignment form needs besides live searches. */
export const getNewAssignmentOptions = createServerFn({ method: "GET" })
    .middleware([dashboardMiddleware])
    .validator(classParamsSchema)
    .handler(async ({ data }) => {
        const organization = await requireOrganizationAccess(data.orgSlug);
        const classroom = await requireClassroom(organization.id, data.classId);
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
        return {
            organization: { name: organization.name ?? organization.slug },
            classroom: { id: classroom.id, name: classroom.name },
            rosters,
            autogrades,
        };
    });

function isTemplate(repo: Repository) {
    return !!repo.template && !!repo.full_name;
}

export const searchTemplateRepositories = createServerFn({ method: "GET" })
    .middleware([dashboardMiddleware])
    .validator(
        v.object({
            orgSlug: orgSlugSchema,
            query: v.pipe(v.string(), v.trim(), v.maxLength(100)),
        }),
    )
    .handler(async ({ data }) => {
        const organization = await requireOrganizationAccess(data.orgSlug);
        const { data: result } = await api.repos.repoSearch(
            {
                q: data.query || undefined,
                template: true,
                archived: false,
                priority_owner_id: organization.id,
                limit: 20,
            },
            { signal: AbortSignal.timeout(10_000) },
        );
        return (result.data ?? [])
            .filter(isTemplate)
            .slice(0, 20)
            .map((repo) => ({
                fullName: repo.full_name as string,
                description: repo.description ?? "",
                private: !!repo.private,
            }));
    });

export const searchStudents = createServerFn({ method: "GET" })
    .middleware([dashboardMiddleware])
    .validator(
        v.object({
            query: v.pipe(
                v.string(),
                v.trim(),
                v.minLength(1),
                v.maxLength(100),
            ),
        }),
    )
    .handler(({ data }) => searchForgejoUsers(data.query));

/** Resolves a roster's members to their Forgejo accounts. */
export const getRosterStudents = createServerFn({ method: "GET" })
    .middleware([dashboardMiddleware])
    .validator(v.object({ rosterId: v.pipe(v.string(), v.uuid()) }))
    .handler(async ({ data }) => {
        const members = await db
            .select({ userId: rosterMember.userId })
            .from(rosterMember)
            .where(eq(rosterMember.rosterId, data.rosterId));
        const forgejoIds = await getLinkedForgejoIds(
            members.map((member) => member.userId),
        );
        const students = [];
        for (const forgejoId of forgejoIds.values()) {
            const student = await getForgejoUserById(forgejoId);
            if (student) students.push(student);
        }
        return {
            students,
            skipped: members.length - students.length,
        };
    });

async function requireTemplateRepository(fullName: string) {
    const [owner, name] = fullName.split("/");
    let repo: Repository;
    try {
        ({ data: repo } = await api.repos.repoGet(
            encodeURIComponent(owner),
            encodeURIComponent(name),
        ));
    } catch {
        return null;
    }
    return isTemplate(repo) ? (repo.full_name ?? null) : null;
}

export const createAssignment = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .validator(createAssignmentSchema)
    .handler(async ({ data, context }) => {
        const organization = await requireOrganizationAccess(data.orgSlug);
        const classroom = await requireClassroom(organization.id, data.classId);
        const input = data.assignment;
        const orgName = organization.name ?? organization.slug;

        const fail = (error: string) => ({ success: false as const, error });

        let templateRepository: string | null = null;
        if (input.templateRepository) {
            templateRepository = await requireTemplateRepository(
                input.templateRepository,
            );
            if (!templateRepository) {
                return fail("The template repository is not available.");
            }
        }
        const autogradeId = input.autograding ? input.autogradeId : null;
        if (autogradeId) {
            const [config] = await db
                .select({ id: autograde.id })
                .from(autograde)
                .where(eq(autograde.id, autogradeId));
            if (!config) return fail("The autograding config was not found.");
        }
        if (input.rosterRestriction) {
            const [restriction] = await db
                .select({ id: roster.id })
                .from(roster)
                .where(eq(roster.id, input.rosterRestriction));
            if (!restriction) return fail("The roster was not found.");
        }

        const isGroup = input.type === "group";
        const predefinedGroups =
            isGroup && input.groupNaming === "predefined" ? input.groups : [];
        const preassigned =
            isGroup && input.groupNaming === "student" ? [] : input.students;
        let students: Awaited<ReturnType<typeof getForgejoUsersByIds>>;
        try {
            students = await getForgejoUsersByIds(
                preassigned.map((student) => student.forgejoId),
            );
        } catch (error) {
            console.error("Failed to resolve students", error);
            return fail("Unable to find one of the selected students.");
        }

        // Reject templates that would give two repositories the same name.
        const deferred = usesCustomPlaceholder(input.namingTemplate);
        if (!deferred) {
            const previewContext = {
                assignment: {
                    name: input.name,
                    namingTemplate: input.namingTemplate,
                },
                orgName,
                className: classroom.name,
            } as ProvisionContext;
            const names = isGroup
                ? predefinedGroups.map((groupName) =>
                      repoNameFor(previewContext, { groupName }),
                  )
                : [...students.values()].map((student) =>
                      repoNameFor(previewContext, {
                          studentName: student.username,
                      }),
                  );
            const seen = new Set<string>();
            for (const name of names) {
                const key = name.toLowerCase();
                if (seen.has(key)) {
                    return fail(
                        `Two repositories would be named "${name}". Adjust the naming template or names.`,
                    );
                }
                seen.add(key);
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

        let saved: {
            created: typeof assignment.$inferSelect;
            groups: (typeof assignmentGroup.$inferSelect)[];
            members: { userId: string; groupId: string | null }[];
        };
        try {
            saved = await db.transaction(async (tx) => {
                const [created] = await tx
                    .insert(assignment)
                    .values({
                        classRoomId: classroom.id,
                        creatorId: context.user.id,
                        name: input.name,
                        type: input.type,
                        deadline: input.deadline
                            ? new Date(input.deadline)
                            : null,
                        archiveOnDeadline:
                            !!input.deadline && input.archiveOnDeadline,
                        autogradeId,
                        namingTemplate: input.namingTemplate,
                        studentIsAdmin: input.studentIsAdmin,
                        templateRepository,
                        afHasIssues: input.features.issues,
                        afHasPackages: input.features.packages,
                        afHasProjects: input.features.projects,
                        afHasPullRequests: input.features.pullRequests,
                        afHasReleases: input.features.releases,
                        afHasWiki: input.features.wiki,
                        rosterRestriction: input.rosterRestriction,
                        joinCode: input.joinLink ? generateJoinCode() : null,
                        allowCreatingGroups:
                            isGroup && input.groupNaming === "student",
                        maxGroups:
                            isGroup &&
                            input.groupNaming === "student" &&
                            input.maxGroups > 0
                                ? input.maxGroups
                                : null,
                        maxGroupMembers:
                            isGroup && input.maxGroupMembers > 0
                                ? input.maxGroupMembers
                                : null,
                    })
                    .returning();

                const groups =
                    predefinedGroups.length > 0
                        ? await tx
                              .insert(assignmentGroup)
                              .values(
                                  predefinedGroups.map((name) => ({
                                      assignmentId: created.id,
                                      name,
                                  })),
                              )
                              .returning()
                        : [];
                const groupIds = new Map(
                    groups.map((group) => [group.name, group.id]),
                );

                const members = preassigned.map((student) => ({
                    userId: userIds.get(student.forgejoId) as string,
                    assignmentId: created.id,
                    groupId:
                        isGroup && student.group !== null
                            ? (groupIds.get(predefinedGroups[student.group]) ??
                              null)
                            : null,
                }));
                if (members.length > 0) {
                    await tx.insert(assignmentMember).values(members);
                }
                return { created, groups, members };
            });
        } catch (error) {
            console.error("Failed to save assignment", error);
            return fail("Unable to save the assignment. Please try again.");
        }
        const { created, groups, members } = saved;

        // With $CUSTOM the name is only known once someone joins via link.
        const tasks: ProvisionTask[] = [];
        if (!deferred) {
            const ctx: ProvisionContext = {
                assignment: created,
                orgName,
                className: classroom.name,
            };
            const usernameByUserId = new Map(
                [...students.values()].map((student) => [
                    userIds.get(student.forgejoId) as string,
                    student.username,
                ]),
            );
            if (isGroup) {
                for (const group of groups) {
                    const usernames = members
                        .filter((member) => member.groupId === group.id)
                        .map(
                            (member) =>
                                usernameByUserId.get(member.userId) as string,
                        );
                    tasks.push({
                        name: group.name,
                        run: () =>
                            provisionGroupRepository(ctx, group, usernames),
                    });
                }
            } else {
                for (const member of members) {
                    const username = usernameByUserId.get(
                        member.userId,
                    ) as string;
                    tasks.push({
                        name: username,
                        run: () =>
                            provisionMemberRepository(ctx, {
                                userId: member.userId,
                                username,
                            }),
                    });
                }
            }
        }

        return {
            success: true as const,
            assignmentId: created.id,
            joinCode: created.joinCode,
            repositories: tasks.map((task) => task.name),
            progress: tasks.length > 0 ? streamProvisioning(tasks) : null,
        };
    });
