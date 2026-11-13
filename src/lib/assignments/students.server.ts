import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "#/db";
import { account, user } from "#/db/schema";
import type { User as ForgejoUser } from "../forgejo/api";
import { api } from "../forgejo/forgejo-api";
import type { ForgejoStudent } from "./types";

export const FORGEJO_PROVIDER_ID = "forgejo";

export type { ForgejoStudent };

function toStudent(forgejoUser: ForgejoUser): ForgejoStudent | null {
    if (
        !forgejoUser.id ||
        !Number.isSafeInteger(forgejoUser.id) ||
        forgejoUser.id <= 0 ||
        !forgejoUser.login
    ) {
        return null;
    }
    return {
        forgejoId: forgejoUser.id,
        username: forgejoUser.login,
        fullName: forgejoUser.full_name?.trim() || forgejoUser.login,
        email: forgejoUser.email?.trim() || null,
        avatarUrl: forgejoUser.avatar_url || null,
    };
}

/** Searches Forgejo users by username, full name or email. */
export async function searchForgejoUsers(query: string, limit = 10) {
    const { data } = await api.users.userSearch(
        { q: query, limit },
        { signal: AbortSignal.timeout(10_000) },
    );
    return (data.data ?? [])
        .map(toStudent)
        .filter((student) => student !== null);
}

export async function getForgejoUserById(forgejoId: number) {
    const { data } = await api.users.userSearch(
        { uid: forgejoId, limit: 1 },
        { signal: AbortSignal.timeout(10_000) },
    );
    const match = (data.data ?? []).find((entry) => entry.id === forgejoId);
    return match ? toStudent(match) : null;
}

/** Re-fetches students from Forgejo so client-supplied ids are verified. */
export async function getForgejoUsersByIds(forgejoIds: number[]) {
    const students = new Map<number, ForgejoStudent>();
    for (const forgejoId of new Set(forgejoIds)) {
        const student = await getForgejoUserById(forgejoId);
        if (!student) throw new Error(`Forgejo user ${forgejoId} not found`);
        students.set(forgejoId, student);
    }
    return students;
}

/** Maps Athene user ids to their linked Forgejo user ids. */
export async function getLinkedForgejoIds(userIds: string[]) {
    if (userIds.length === 0) return new Map<string, number>();
    const rows = await db
        .select({ userId: account.userId, accountId: account.accountId })
        .from(account)
        .where(
            and(
                eq(account.providerId, FORGEJO_PROVIDER_ID),
                inArray(account.userId, userIds),
            ),
        );
    return new Map(
        rows
            .map((row) => [row.userId, Number(row.accountId)] as const)
            .filter(([, id]) => Number.isSafeInteger(id) && id > 0),
    );
}

/**
 * Returns the Athene user for a Forgejo user, creating a placeholder if the
 * student has never signed in. The placeholder carries a Forgejo account row
 * keyed by the OIDC subject (the Forgejo user id), so better-auth signs the
 * student into this user on their first login.
 */
async function ensureAtheneUser(student: ForgejoStudent) {
    const accountId = String(student.forgejoId);
    return db.transaction(async (tx) => {
        const [linked] = await tx
            .select({ userId: account.userId })
            .from(account)
            .where(
                and(
                    eq(account.providerId, FORGEJO_PROVIDER_ID),
                    eq(account.accountId, accountId),
                ),
            )
            .limit(1);
        if (linked) return linked.userId;

        const email =
            student.email?.toLowerCase() ??
            `forgejo-${student.forgejoId}@users.noreply.invalid`;
        const [existing] = await tx
            .select({ id: user.id })
            .from(user)
            .where(sql`lower(${user.email}) = ${email}`)
            .limit(1);

        let userId = existing?.id;
        if (userId) {
            const [otherAccount] = await tx
                .select({ id: account.id })
                .from(account)
                .where(
                    and(
                        eq(account.providerId, FORGEJO_PROVIDER_ID),
                        eq(account.userId, userId),
                    ),
                )
                .limit(1);
            if (otherAccount) {
                throw new Error(
                    `The email of ${student.username} belongs to a different Athene user.`,
                );
            }
        } else {
            userId = crypto.randomUUID();
            await tx.insert(user).values({
                id: userId,
                name: student.fullName,
                email,
                emailVerified: false,
                image: student.avatarUrl,
            });
        }

        const now = new Date();
        await tx.insert(account).values({
            id: crypto.randomUUID(),
            accountId,
            providerId: FORGEJO_PROVIDER_ID,
            userId,
            createdAt: now,
            updatedAt: now,
        });
        return userId;
    });
}

/** Returns a map of Forgejo user id → Athene user id. */
export async function ensureAtheneUsers(students: Iterable<ForgejoStudent>) {
    const userIds = new Map<number, string>();
    for (const student of students) {
        userIds.set(student.forgejoId, await ensureAtheneUser(student));
    }
    return userIds;
}
