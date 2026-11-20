import { notFound } from "@tanstack/react-router";
import { and, eq } from "drizzle-orm";
import { db } from "#/db";
import { account, roster, rosterMember, user } from "#/db/schema";
import { ensureAtheneUsers } from "./assignments/students.server";
import { api } from "./forgejo/forgejo-api";
import { findRosterEmails } from "./roster-email-search";

export async function requireRoster(rosterId: string) {
    const [group] = await db
        .select()
        .from(roster)
        .where(eq(roster.id, rosterId));
    if (!group) throw notFound();
    return group;
}

export async function readRosterMembers(rosterId: string) {
    const rows = await db
        .select({
            id: user.id,
            username: user.name,
            email: user.email,
            addedOn: rosterMember.createdAt,
            accountId: account.accountId,
        })
        .from(rosterMember)
        .innerJoin(user, eq(user.id, rosterMember.userId))
        .leftJoin(
            account,
            and(eq(account.userId, user.id), eq(account.providerId, "forgejo")),
        )
        .where(eq(rosterMember.rosterId, rosterId));
    const uniqueRows = [...new Map(rows.map((row) => [row.id, row])).values()];
    const members = uniqueRows.map((row) => ({
        id: row.id,
        forgejoUserId: row.id.startsWith("forgejo:")
            ? Number(row.id.slice(8))
            : row.accountId
              ? Number(row.accountId)
              : null,
        username: row.username,
        name: null as string | null,
        email: row.email,
        addedOn: row.addedOn,
    }));
    // All optional lookups share one deadline, regardless of the roster size.
    const signal = AbortSignal.timeout(2_000);
    for (let offset = 0; offset < uniqueRows.length; offset += 5) {
        if (signal.aborted) break;
        await Promise.all(
            uniqueRows.slice(offset, offset + 5).map(async (row, index) => {
                if (row.id.startsWith("forgejo:")) return;
                const [match] = await searchForgejoEmails(
                    row.email,
                    true,
                    signal,
                ).catch(() => []); // Keep saved data if Forgejo fails or the deadline expires.
                if (!match || signal.aborted) return;
                members[offset + index] = {
                    ...members[offset + index],
                    forgejoUserId: match.user_id,
                    username: match.username,
                    name: match.username !== row.username ? row.username : null,
                };
            }),
        );
    }
    return members;
}

export function searchForgejoEmails(
    query: string,
    exact = false,
    signal?: AbortSignal,
) {
    return findRosterEmails(api.admin.adminSearchEmails, query, exact, signal);
}

export async function addRosterEmail(rosterId: string, email: string) {
    const [match] = await searchForgejoEmails(email, true);
    if (!match) return "not-found" as const;
    const { data: profile } = await api.users.userGet(
        encodeURIComponent(match.username),
        { signal: AbortSignal.timeout(10_000) },
    );
    if (profile.id !== match.user_id || !profile.login) {
        throw new Error("Could not read the Forgejo user.");
    }
    const primaryEmail = profile.email || match.email;
    const username = profile.login;
    const userIds = await ensureAtheneUsers([
        {
            forgejoId: match.user_id,
            username,
            fullName: profile.full_name?.trim() || username,
            email: primaryEmail,
            avatarUrl: profile.avatar_url || null,
        },
    ]);
    const userId = userIds.get(match.user_id);
    if (!userId) throw new Error("Could not resolve the Forgejo user.");
    const inserted = await db
        .insert(rosterMember)
        .values({ rosterId, userId })
        .onConflictDoNothing()
        .returning({ userId: rosterMember.userId });
    return inserted.length ? ("added" as const) : ("already-member" as const);
}
