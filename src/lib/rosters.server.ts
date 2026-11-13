import { notFound } from "@tanstack/react-router";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "#/db";
import { account, roster, rosterMember, user } from "#/db/schema";
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
    return Promise.all(
        [...new Map(rows.map((row) => [row.id, row])).values()].map(
            async (row) => {
                const match = row.id.startsWith("forgejo:")
                    ? null
                    : (await searchForgejoEmails(row.email, true))[0];
                return {
                    id: row.id,
                    forgejoUserId:
                        match?.user_id ??
                        (row.id.startsWith("forgejo:")
                            ? Number(row.id.slice(8))
                            : row.accountId
                              ? Number(row.accountId)
                              : null),
                    username: match?.username ?? row.username,
                    name:
                        match && match.username !== row.username
                            ? row.username
                            : null,
                    email: row.email,
                    addedOn: row.addedOn,
                };
            },
        ),
    );
}

export function searchForgejoEmails(query: string, exact = false) {
    return findRosterEmails(api.admin.adminSearchEmails, query, exact);
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
    return db.transaction(async (tx) => {
        // Reuse an existing Athene identity; no OAuth credentials or accounts are created.
        const identityId = `forgejo:${match.user_id}`;
        const identityFilter = sql`${user.id} = ${identityId} OR lower(${user.email}) = ${primaryEmail.toLowerCase()}`;
        const identities = await tx
            .select({ id: user.id })
            .from(user)
            .where(identityFilter)
            .orderBy(
                sql`CASE WHEN ${user.id} = ${identityId} THEN 0 ELSE 1 END`,
            );
        const [linked] = await tx
            .select({ userId: account.userId })
            .from(account)
            .where(
                and(
                    eq(account.providerId, "forgejo"),
                    eq(account.accountId, String(match.user_id)),
                ),
            );
        const identityIds = [
            ...identities.map((identity) => identity.id),
            ...(linked ? [linked.userId] : []),
        ];
        if (identityIds.length) {
            const [existingMember] = await tx
                .select({ userId: rosterMember.userId })
                .from(rosterMember)
                .where(
                    and(
                        eq(rosterMember.rosterId, rosterId),
                        inArray(rosterMember.userId, identityIds),
                    ),
                );
            if (existingMember) return "already-member" as const;
        }
        let userId = linked?.userId ?? identities[0]?.id;
        if (!userId) {
            await tx
                .insert(user)
                .values({
                    id: identityId,
                    name: username,
                    email: primaryEmail,
                    emailVerified: false,
                })
                .onConflictDoNothing();
            const [identity] = await tx
                .select({ id: user.id })
                .from(user)
                .where(identityFilter);
            if (!identity)
                throw new Error("Could not resolve the Forgejo user.");
            userId = identity.id;
        }
        const inserted = await tx
            .insert(rosterMember)
            .values({ rosterId, userId })
            .onConflictDoNothing()
            .returning({ userId: rosterMember.userId });
        return inserted.length
            ? ("added" as const)
            : ("already-member" as const);
    });
}
