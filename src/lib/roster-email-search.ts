import type { Api, Email } from "./forgejo/api";

type EmailMatch = Required<Pick<Email, "email" | "username" | "user_id">>;
type SearchEmails = Api<unknown>["admin"]["adminSearchEmails"];

/** Exact searches must exhaust partial matches before reporting a missing user. */
export async function findRosterEmails(
    search: SearchEmails,
    query: string,
    exact = false,
): Promise<EmailMatch[]> {
    const matches: EmailMatch[] = [];
    for (let page = 1; ; page++) {
        const { data } = await search(
            { q: query, page, limit: 50 },
            { signal: AbortSignal.timeout(10_000) },
        );
        for (const entry of data) {
            if (
                !entry.email ||
                !entry.username ||
                !Number.isSafeInteger(entry.user_id) ||
                !entry.user_id ||
                entry.user_id < 0
            ) {
                throw new Error("Invalid email search response.");
            }
            if (
                !exact ||
                entry.email.trim().toLowerCase() === query.trim().toLowerCase()
            ) {
                matches.push({
                    email: entry.email,
                    username: entry.username,
                    user_id: entry.user_id,
                });
            }
        }
        if (!exact || matches.length || data.length < 50) return matches;
    }
}
