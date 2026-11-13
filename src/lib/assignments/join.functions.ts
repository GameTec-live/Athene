import { notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { and, asc, count, eq } from "drizzle-orm";
import * as v from "valibot";
import { db } from "#/db";
import {
    assignment,
    assignmentGroup,
    assignmentMember,
    classRoom,
    rosterMember,
    user,
} from "#/db/schema";
import { env } from "#/env";
import { authMiddleware } from "../auth.functions";
import { getForgejoUsername } from "../forgejo/orgs.server";
import {
    getOrganizationNameById,
    getUsernamesForUsers,
    repositoryUrl,
    withProvisioningLock,
} from "./assignments.server";
import { usesCustomPlaceholder } from "./naming";
import {
    addGroupTeamMember,
    type ProvisionContext,
    type ProvisionResult,
    provisionGroupRepository,
    provisionMemberRepository,
} from "./provision.server";
import { customNameSchema, groupNameSchema } from "./schemas";

const joinCodeSchema = v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1),
    v.maxLength(64),
);

async function loadJoinable(code: string) {
    const [row] = await db
        .select({
            assignment,
            className: classRoom.name,
            orgId: classRoom.organizationId,
        })
        .from(assignment)
        .innerJoin(classRoom, eq(classRoom.id, assignment.classRoomId))
        .where(eq(assignment.joinCode, code));
    if (!row) throw notFound();
    const orgName = await getOrganizationNameById(row.orgId);
    const ctx: ProvisionContext = {
        assignment: row.assignment,
        orgName,
        className: row.className,
    };
    return ctx;
}

function isClosed(ctx: ProvisionContext) {
    const deadline = ctx.assignment.deadline;
    return !!deadline && deadline.getTime() < Date.now();
}

async function isAllowedByRoster(ctx: ProvisionContext, userId: string) {
    const rosterId = ctx.assignment.rosterRestriction;
    if (!rosterId) return true;
    const [entry] = await db
        .select({ userId: rosterMember.userId })
        .from(rosterMember)
        .where(
            and(
                eq(rosterMember.rosterId, rosterId),
                eq(rosterMember.userId, userId),
            ),
        );
    return !!entry;
}

async function getMembership(assignmentId: string, userId: string) {
    const [member] = await db
        .select()
        .from(assignmentMember)
        .where(
            and(
                eq(assignmentMember.assignmentId, assignmentId),
                eq(assignmentMember.userId, userId),
            ),
        );
    return member;
}

async function getGroup(groupId: string) {
    const [group] = await db
        .select()
        .from(assignmentGroup)
        .where(eq(assignmentGroup.id, groupId));
    return group;
}

/** Who is signed in, so students can tell which account they join with. */
export const getJoinViewer = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .handler(async ({ context }) => {
        let username: string | null = null;
        try {
            username = await getForgejoUsername();
        } catch (error) {
            console.error("Failed to resolve Forgejo username", error);
        }
        return {
            name: context.user.name,
            email: context.user.email,
            image: context.user.image ?? null,
            username,
            forgejoUrl: env.FORGEJO_BASE_URL.replace(/\/+$/, ""),
        };
    });

export const getJoinInfo = createServerFn({ method: "GET" })
    .middleware([authMiddleware])
    .validator(v.object({ code: joinCodeSchema }))
    .handler(async ({ data, context }) => {
        const ctx = await loadJoinable(data.code);
        const a = ctx.assignment;
        const userId = context.user.id;
        const member = await getMembership(a.id, userId);
        const group = member?.groupId
            ? await getGroup(member.groupId)
            : undefined;
        const repositoryName =
            a.type === "group" ? group?.repositoryName : member?.repositoryName;

        const groups =
            a.type === "group"
                ? await db
                      .select({
                          id: assignmentGroup.id,
                          name: assignmentGroup.name,
                          customName: assignmentGroup.customName,
                          memberCount: count(assignmentMember.userId),
                      })
                      .from(assignmentGroup)
                      .leftJoin(
                          assignmentMember,
                          eq(assignmentMember.groupId, assignmentGroup.id),
                      )
                      .where(eq(assignmentGroup.assignmentId, a.id))
                      .groupBy(assignmentGroup.id)
                      .orderBy(
                          asc(assignmentGroup.createdAt),
                          asc(assignmentGroup.name),
                      )
                : [];

        // Names and avatars only, so students can see who they would join.
        const membersByGroup = new Map<
            string,
            { name: string; image: string | null }[]
        >();
        if (groups.length > 0) {
            const rows = await db
                .select({
                    groupId: assignmentMember.groupId,
                    name: user.name,
                    image: user.image,
                })
                .from(assignmentMember)
                .innerJoin(user, eq(user.id, assignmentMember.userId))
                .where(eq(assignmentMember.assignmentId, a.id))
                .orderBy(asc(assignmentMember.createdAt));
            for (const row of rows) {
                if (!row.groupId) continue;
                const list = membersByGroup.get(row.groupId) ?? [];
                list.push({ name: row.name, image: row.image });
                membersByGroup.set(row.groupId, list);
            }
        }

        let status: "joined" | "pending" | "open" | "restricted" | "closed";
        if (repositoryName) status = "joined";
        else if (member) status = isClosed(ctx) ? "closed" : "pending";
        else if (isClosed(ctx)) status = "closed";
        else if (!(await isAllowedByRoster(ctx, userId))) status = "restricted";
        else status = "open";

        const needsCustom =
            usesCustomPlaceholder(a.namingTemplate) &&
            (a.type === "group" ? !group?.customName : !member?.customName);

        return {
            assignment: {
                name: a.name,
                type: a.type,
                deadline: a.deadline,
                className: ctx.className,
                orgName: ctx.orgName,
            },
            status,
            needsCustom,
            usesCustom: usesCustomPlaceholder(a.namingTemplate),
            repositoryUrl: repositoryName
                ? repositoryUrl(ctx.orgName, repositoryName)
                : null,
            groupName: group?.name ?? null,
            provisioningError:
                (a.type === "group"
                    ? group?.provisioningError
                    : member?.provisioningError) ?? null,
            groups: groups.map(({ customName, ...g }) => ({
                ...g,
                members: membersByGroup.get(g.id) ?? [],
                needsCustom:
                    usesCustomPlaceholder(a.namingTemplate) && !customName,
                full:
                    a.maxGroupMembers !== null &&
                    g.memberCount >= a.maxGroupMembers,
            })),
            canCreateGroup:
                a.type === "group" &&
                a.allowCreatingGroups &&
                (a.maxGroups === null || groups.length < a.maxGroups),
            maxGroupMembers: a.maxGroupMembers,
        };
    });

const joinSchema = v.variant("action", [
    v.object({
        code: joinCodeSchema,
        action: v.literal("accept"),
        customName: v.nullable(customNameSchema),
    }),
    v.object({
        code: joinCodeSchema,
        action: v.literal("join-group"),
        groupId: v.pipe(v.string(), v.uuid()),
        customName: v.nullable(customNameSchema),
    }),
    v.object({
        code: joinCodeSchema,
        action: v.literal("create-group"),
        groupName: groupNameSchema,
        customName: v.nullable(customNameSchema),
    }),
]);

type JoinResult =
    | { success: true; repositoryUrl: string }
    | { success: false; error: string };

function toJoinResult(
    ctx: ProvisionContext,
    result: ProvisionResult,
): JoinResult {
    if (result.success) {
        return {
            success: true,
            repositoryUrl: repositoryUrl(ctx.orgName, result.repositoryName),
        };
    }
    return {
        success: false,
        error: result.repoNameTaken
            ? "A repository with this name already exists. Choose a different name."
            : "Your repository could not be created. Please try again or contact your teacher.",
    };
}

export const joinAssignment = createServerFn({ method: "POST" })
    .middleware([authMiddleware])
    .validator(joinSchema)
    .handler(async ({ data, context }): Promise<JoinResult> => {
        const ctx = await loadJoinable(data.code);
        const a = ctx.assignment;
        const userId = context.user.id;
        const username = await getForgejoUsername();
        const customRequired = usesCustomPlaceholder(a.namingTemplate);
        const fail = (error: string) => ({ success: false as const, error });

        if (isClosed(ctx))
            return fail("The deadline for this assignment has passed.");
        const existing = await getMembership(a.id, userId);
        if (!existing && !(await isAllowedByRoster(ctx, userId))) {
            return fail(
                "This assignment is restricted to a roster you are not part of.",
            );
        }

        if (a.type === "individual") {
            if (data.action !== "accept") return fail("Invalid action.");
            return withProvisioningLock(
                `member:${a.id}:${userId}`,
                async () => {
                    const member = await getMembership(a.id, userId);
                    const customName = member?.customName ?? data.customName;
                    if (customRequired && !customName)
                        return fail("Enter a name.");
                    if (member) {
                        if (customName !== member.customName) {
                            await db
                                .update(assignmentMember)
                                .set({ customName })
                                .where(
                                    and(
                                        eq(assignmentMember.assignmentId, a.id),
                                        eq(assignmentMember.userId, userId),
                                    ),
                                );
                        }
                    } else {
                        await db
                            .insert(assignmentMember)
                            .values({
                                assignmentId: a.id,
                                userId,
                                customName: customRequired ? customName : null,
                            })
                            .onConflictDoNothing();
                    }
                    const result = await provisionMemberRepository(ctx, {
                        userId,
                        username,
                        customName: customRequired ? customName : null,
                    });
                    if (!result.success && result.repoNameTaken) {
                        // Let the student pick another name on the next attempt.
                        await db
                            .update(assignmentMember)
                            .set({ customName: null })
                            .where(
                                and(
                                    eq(assignmentMember.assignmentId, a.id),
                                    eq(assignmentMember.userId, userId),
                                ),
                            );
                    }
                    return toJoinResult(ctx, result);
                },
            );
        }

        // Group assignments
        let groupId = existing?.groupId ?? null;
        if (!groupId) {
            if (data.action === "accept") return fail("Select a group.");
            const joined =
                data.action === "join-group"
                    ? await joinExistingGroup(ctx, userId, data.groupId)
                    : await createGroup(
                          ctx,
                          userId,
                          data.groupName,
                          data.customName,
                      );
            if (!joined.success) return joined;
            groupId = joined.groupId;
        }

        return withProvisioningLock(`group:${groupId}`, async () => {
            const group = await getGroup(groupId);
            if (!group) return fail("Group not found.");
            if (
                group.repositoryId &&
                group.forgejoTeamId &&
                !group.provisioningError
            ) {
                try {
                    await addGroupTeamMember(group, username);
                } catch (error) {
                    console.error("Failed to add group member", error);
                    return fail(
                        "You could not be added to your group's repository.",
                    );
                }
                return {
                    success: true,
                    repositoryUrl: repositoryUrl(
                        ctx.orgName,
                        group.repositoryName ?? "",
                    ),
                };
            }

            const customName = group.customName ?? data.customName;
            if (customRequired && !customName) return fail("Enter a name.");
            if (customRequired && customName !== group.customName) {
                await db
                    .update(assignmentGroup)
                    .set({ customName })
                    .where(eq(assignmentGroup.id, group.id));
                group.customName = customName;
            }

            const memberIds = await db
                .select({ userId: assignmentMember.userId })
                .from(assignmentMember)
                .where(eq(assignmentMember.groupId, group.id));
            const usernames = await getUsernamesForUsers(
                memberIds.map((m) => m.userId),
            );
            usernames.set(userId, username);
            const result = await provisionGroupRepository(ctx, group, [
                ...usernames.values(),
            ]);
            if (!result.success && result.repoNameTaken) {
                if (data.action === "create-group" && !existing) {
                    // Undo the new group so the student can pick another name.
                    await db
                        .delete(assignmentGroup)
                        .where(eq(assignmentGroup.id, group.id));
                } else if (customRequired) {
                    await db
                        .update(assignmentGroup)
                        .set({ customName: null })
                        .where(eq(assignmentGroup.id, group.id));
                }
            }
            return toJoinResult(ctx, result);
        });
    });

type GroupJoinResult =
    | { success: true; groupId: string }
    | { success: false; error: string };

async function joinExistingGroup(
    ctx: ProvisionContext,
    userId: string,
    groupId: string,
): Promise<GroupJoinResult> {
    return db.transaction(async (tx) => {
        const [group] = await tx
            .select()
            .from(assignmentGroup)
            .where(
                and(
                    eq(assignmentGroup.id, groupId),
                    eq(assignmentGroup.assignmentId, ctx.assignment.id),
                ),
            )
            .for("update");
        if (!group) return { success: false, error: "Group not found." };

        const [{ members }] = await tx
            .select({ members: count() })
            .from(assignmentMember)
            .where(eq(assignmentMember.groupId, group.id));
        const max = ctx.assignment.maxGroupMembers;
        if (max !== null && members >= max) {
            return { success: false, error: "This group is full." };
        }
        const inserted = await tx
            .insert(assignmentMember)
            .values({
                assignmentId: ctx.assignment.id,
                userId,
                groupId: group.id,
            })
            .onConflictDoNothing()
            .returning();
        if (inserted.length === 0) {
            return {
                success: false,
                error: "You already joined this assignment.",
            };
        }
        return { success: true, groupId: group.id };
    });
}

async function createGroup(
    ctx: ProvisionContext,
    userId: string,
    name: string,
    customName: string | null,
): Promise<GroupJoinResult> {
    const a = ctx.assignment;
    if (!a.allowCreatingGroups) {
        return { success: false, error: "Creating groups is not allowed." };
    }
    if (usesCustomPlaceholder(a.namingTemplate) && !customName) {
        return { success: false, error: "Enter a name." };
    }
    return db.transaction(async (tx) => {
        // Lock the assignment so concurrent creations respect the group limit.
        await tx
            .select({ id: assignment.id })
            .from(assignment)
            .where(eq(assignment.id, a.id))
            .for("update");
        const groups = await tx
            .select({ name: assignmentGroup.name })
            .from(assignmentGroup)
            .where(eq(assignmentGroup.assignmentId, a.id));
        if (a.maxGroups !== null && groups.length >= a.maxGroups) {
            return { success: false, error: "No more groups can be created." };
        }
        if (groups.some((g) => g.name.toLowerCase() === name.toLowerCase())) {
            return {
                success: false,
                error: "A group with this name already exists.",
            };
        }
        const [member] = await tx
            .select({ userId: assignmentMember.userId })
            .from(assignmentMember)
            .where(
                and(
                    eq(assignmentMember.assignmentId, a.id),
                    eq(assignmentMember.userId, userId),
                ),
            );
        if (member) {
            return {
                success: false,
                error: "You already joined this assignment.",
            };
        }
        const [group] = await tx
            .insert(assignmentGroup)
            .values({
                assignmentId: a.id,
                name,
                customName: usesCustomPlaceholder(a.namingTemplate)
                    ? customName
                    : null,
            })
            .returning();
        await tx
            .insert(assignmentMember)
            .values({ assignmentId: a.id, userId, groupId: group.id });
        return { success: true, groupId: group.id };
    });
}
