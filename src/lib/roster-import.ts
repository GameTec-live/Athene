export type RosterImportResult = "added" | "already-member" | "not-found";
export type RosterImportSummary = {
    added: number;
    skipped: number;
    missing: string[];
    failed: string[];
};

/** Each entry commits independently, so an error never rolls back prior additions. */
export async function importRosterEmails(
    emails: string[],
    add: (email: string) => Promise<RosterImportResult>,
    onProgress: (processed: number) => void,
): Promise<RosterImportSummary> {
    const summary: RosterImportSummary = {
        added: 0,
        skipped: 0,
        missing: [],
        failed: [],
    };
    for (const [index, email] of emails.entries()) {
        try {
            const result = await add(email);
            if (result === "added") summary.added++;
            else if (result === "already-member") summary.skipped++;
            else summary.missing.push(email);
        } catch {
            summary.failed.push(email);
        }
        onProgress(index + 1);
    }
    return summary;
}
