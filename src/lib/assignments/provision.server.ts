import { and, eq } from "drizzle-orm";
import { db } from "#/db";
import {
    type assignment,
    assignmentGroup,
    assignmentMember,
} from "#/db/schema";
import { api } from "../forgejo/forgejo-api";
import { renderRepoName } from "./naming";
import type { ProvisionEvent } from "./types";

type Assignment = typeof assignment.$inferSelect;
type Group = typeof assignmentGroup.$inferSelect;

export type ProvisionContext = {
    assignment: Assignment;
    /** Forgejo organization login that owns the repositories. */
    orgName: string;
    className: string;
};

export class RepoNameTakenError extends Error {
    constructor(readonly repoName: string) {
        super(`A repository named ${repoName} already exists.`);
    }
}

/** The generated Forgejo client throws the failed response object. */
function forgejoStatus(error: unknown) {
    return error &&
        typeof error === "object" &&
        "status" in error &&
        typeof error.status === "number"
        ? error.status
        : undefined;
}

function describeError(error: unknown) {
    if (error instanceof Error) return error.message;
    const status = forgejoStatus(error);
    const message =
        error &&
        typeof error === "object" &&
        "error" in error &&
        error.error &&
        typeof error.error === "object" &&
        "message" in error.error &&
        typeof error.error.message === "string"
            ? error.error.message
            : undefined;
    return `Forgejo request failed${status ? ` (${status})` : ""}${message ? `: ${message}` : ""}`;
}

function enc(value: string) {
    return encodeURIComponent(value);
}

function studentPermission(ctx: ProvisionContext) {
    return ctx.assignment.studentIsAdmin ? "admin" : "write";
}

export function repoNameFor(
    ctx: ProvisionContext,
    names: { studentName?: string; groupName?: string; custom?: string | null },
) {
    const name = renderRepoName(ctx.assignment.namingTemplate ?? "", {
        assignmentName: ctx.assignment.name,
        className: ctx.className,
        orgName: ctx.orgName,
        studentName: names.studentName,
        groupName: names.groupName,
        custom: names.custom ?? undefined,
    });
    if (!name)
        throw new Error("The repository name template produced an empty name.");
    return name;
}

/** Creates the repository (from the template if set) and applies feature settings. */
async function createRepository(ctx: ProvisionContext, name: string) {
    const a = ctx.assignment;
    const owner = enc(ctx.orgName);
    let repo: { id?: number; name?: string };
    try {
        if (a.templateRepository) {
            const [templateOwner, templateName] =
                a.templateRepository.split("/");
            ({ data: repo } = await api.repos.generateRepo(
                enc(templateOwner),
                enc(templateName),
                {
                    owner: ctx.orgName,
                    name,
                    private: true,
                    git_content: true,
                    labels: true,
                    topics: true,
                    protected_branch: true,
                },
            ));
        } else {
            ({ data: repo } = await api.orgs.createOrgRepo(owner, {
                name,
                private: true,
                auto_init: true,
                default_branch: "main",
            }));
        }
    } catch (error) {
        if (forgejoStatus(error) === 409) throw new RepoNameTakenError(name);
        throw error;
    }
    if (!repo.id || !repo.name) {
        throw new Error("Invalid Forgejo repository response");
    }

    await api.repos.repoEdit(owner, enc(repo.name), {
        has_issues: a.afHasIssues,
        has_pull_requests: a.afHasPullRequests,
        has_wiki: a.afHasWiki,
        has_projects: a.afHasProjects,
        has_releases: a.afHasReleases,
        has_packages: a.afHasPackages,
    });
    return { id: repo.id, name: repo.name };
}

export type ProvisionResult =
    | { success: true; repositoryName: string }
    | { success: false; error: string; repoNameTaken?: boolean };

/** Creates an individual student's repository and grants them access. */
export async function provisionMemberRepository(
    ctx: ProvisionContext,
    member: { userId: string; username: string; customName?: string | null },
): Promise<ProvisionResult> {
    const where = and(
        eq(assignmentMember.assignmentId, ctx.assignment.id),
        eq(assignmentMember.userId, member.userId),
    );
    const [existing] = await db.select().from(assignmentMember).where(where);
    let repo =
        existing?.repositoryId && existing.repositoryName
            ? { id: existing.repositoryId, name: existing.repositoryName }
            : undefined;

    try {
        if (!repo) {
            repo = await createRepository(
                ctx,
                repoNameFor(ctx, {
                    studentName: member.username,
                    custom: member.customName,
                }),
            );
            await db
                .update(assignmentMember)
                .set({ repositoryId: repo.id, repositoryName: repo.name })
                .where(where);
        }
        await api.repos.repoAddCollaborator(
            enc(ctx.orgName),
            enc(repo.name),
            enc(member.username),
            { permission: studentPermission(ctx) },
        );
        await db
            .update(assignmentMember)
            .set({ provisioningError: null })
            .where(where);
        return { success: true, repositoryName: repo.name };
    } catch (error) {
        const message = describeError(error);
        console.error("Failed to provision member repository", error);
        await db
            .update(assignmentMember)
            .set({ provisioningError: message })
            .where(where);
        return {
            success: false,
            error: message,
            repoNameTaken: error instanceof RepoNameTakenError,
        };
    }
}

const WRITE_UNITS = {
    "repo.code": "write",
    "repo.issues": "write",
    "repo.pulls": "write",
    "repo.releases": "write",
    "repo.wiki": "write",
    "repo.projects": "write",
    "repo.packages": "write",
    "repo.actions": "read",
    "repo.ext_issues": "none",
    "repo.ext_wiki": "none",
};

/**
 * Creates a group's repository and a Forgejo team (named like the
 * repository) that only has access to it, then adds the given members.
 */
export async function provisionGroupRepository(
    ctx: ProvisionContext,
    group: Group,
    usernames: string[],
): Promise<ProvisionResult> {
    const where = eq(assignmentGroup.id, group.id);
    let repo =
        group.repositoryId && group.repositoryName
            ? { id: group.repositoryId, name: group.repositoryName }
            : undefined;
    let teamId = group.forgejoTeamId;

    try {
        if (!repo) {
            repo = await createRepository(
                ctx,
                repoNameFor(ctx, {
                    groupName: group.name,
                    custom: group.customName,
                }),
            );
            await db
                .update(assignmentGroup)
                .set({ repositoryId: repo.id, repositoryName: repo.name })
                .where(where);
        }
        if (!teamId) {
            const permission = studentPermission(ctx);
            const { data: team } = await api.orgs.orgCreateTeam(
                enc(ctx.orgName),
                {
                    name: repo.name,
                    description: `${ctx.assignment.name}: ${group.name}`,
                    permission,
                    includes_all_repositories: false,
                    can_create_org_repo: false,
                    ...(permission === "write"
                        ? { units_map: WRITE_UNITS }
                        : {}),
                },
            );
            if (!team.id) throw new Error("Invalid Forgejo team response");
            teamId = team.id;
            await db
                .update(assignmentGroup)
                .set({ forgejoTeamId: teamId })
                .where(where);
        }
        // Idempotent, so a retry also repairs a team without its repository.
        await api.teams.orgAddTeamRepository(
            teamId,
            enc(ctx.orgName),
            enc(repo.name),
        );
        for (const username of usernames) {
            await api.teams.orgAddTeamMember(teamId, enc(username));
        }
        await db
            .update(assignmentGroup)
            .set({ provisioningError: null })
            .where(where);
        return { success: true, repositoryName: repo.name };
    } catch (error) {
        const message = describeError(error);
        console.error("Failed to provision group repository", error);
        await db
            .update(assignmentGroup)
            .set({ provisioningError: message })
            .where(where);
        return {
            success: false,
            error: message,
            repoNameTaken: error instanceof RepoNameTakenError,
        };
    }
}

/** Adds a student to an already provisioned group's team. */
export async function addGroupTeamMember(group: Group, username: string) {
    if (!group.forgejoTeamId) return;
    await api.teams.orgAddTeamMember(group.forgejoTeamId, enc(username));
}

/** Runs tasks with bounded concurrency to keep Forgejo load reasonable. */
export async function runLimited<T>(
    items: T[],
    limit: number,
    task: (item: T) => Promise<unknown>,
) {
    let next = 0;
    const workers = Array.from(
        { length: Math.min(limit, items.length) },
        async () => {
            while (next < items.length) {
                const item = items[next++];
                await task(item);
            }
        },
    );
    await Promise.all(workers);
}

export type ProvisionTask = {
    /** Student username or group name shown in the progress list. */
    name: string;
    run: () => Promise<ProvisionResult>;
};

/**
 * Starts the tasks immediately and reports progress through the returned
 * stream. The work is detached from the stream, so repositories keep being
 * created even if the client disconnects midway.
 */
export function streamProvisioning(tasks: ProvisionTask[], limit = 3) {
    let controller: ReadableStreamDefaultController<ProvisionEvent>;
    let open = true;
    const send = (event: ProvisionEvent) => {
        if (!open) return;
        try {
            controller.enqueue(event);
        } catch {
            open = false;
        }
    };
    const stream = new ReadableStream<ProvisionEvent>({
        start(c) {
            controller = c;
        },
        cancel() {
            open = false;
        },
    });

    void runLimited(tasks, limit, async (task) => {
        send({ type: "started", name: task.name });
        let result: ProvisionResult;
        try {
            result = await task.run();
        } catch (error) {
            result = { success: false, error: describeError(error) };
        }
        send(
            result.success
                ? {
                      type: "finished",
                      name: task.name,
                      success: true,
                      repositoryName: result.repositoryName,
                  }
                : {
                      type: "finished",
                      name: task.name,
                      success: false,
                      error: result.error,
                  },
        );
    }).finally(() => {
        if (!open) return;
        open = false;
        try {
            controller.close();
        } catch {
            // Already closed by the client.
        }
    });

    return stream;
}
