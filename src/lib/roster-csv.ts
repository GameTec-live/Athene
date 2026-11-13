export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;

function normalizeEmail(value: string, location: string) {
    const email = value.trim().toLowerCase();
    if (!/^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/.test(email)) {
        throw new Error(`Invalid email address ${location}.`);
    }
    return email;
}

/** Plain email lists accept line breaks, commas, semicolons and whitespace. */
export function parseRosterText(source: string): string[] {
    const entries = source
        .trim()
        .split(/[\s,;]+/)
        .filter(Boolean);
    if (!entries.length)
        throw new Error("The list contains no email addresses.");
    return [
        ...new Set(
            entries.map((entry, index) =>
                normalizeEmail(entry, `at entry ${index + 1}`),
            ),
        ),
    ];
}

/** Comma-separated CSV with quoted fields, escaped quotes, BOM and CRLF support. */
export function parseRosterCsv(source: string): string[] {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = "";
    let quoted = false;
    let closedQuote = false;
    const input = source.replace(/^\uFEFF/, "");
    for (let i = 0; i < input.length; i++) {
        const char = input[i];
        if (quoted) {
            if (char === '"') {
                if (input[i + 1] === '"') {
                    field += '"';
                    i++;
                } else {
                    quoted = false;
                    closedQuote = true;
                }
            } else field += char;
        } else if (char === "," || char === "\n" || char === "\r") {
            row.push(field.trim());
            field = "";
            closedQuote = false;
            if (char !== ",") {
                if (row.some(Boolean)) rows.push(row);
                row = [];
                if (char === "\r" && input[i + 1] === "\n") i++;
            }
        } else if (char === '"' && !field.trim() && !closedQuote) {
            field = "";
            quoted = true;
        } else {
            if (char === '"' || (closedQuote && char.trim())) {
                throw new Error("Invalid CSV: check the quoting of fields.");
            }
            field += char;
        }
    }
    if (quoted) throw new Error("Invalid CSV: an unfinished quoted field.");
    row.push(field.trim());
    if (row.some(Boolean)) rows.push(row);
    const header = rows.shift();
    const columns = header?.flatMap((name, index) =>
        name.toLowerCase() === "email" ? [index] : [],
    );
    if (columns?.length !== 1) {
        throw new Error("The CSV must contain exactly one email header.");
    }
    const emails = new Set<string>();
    for (const [index, cells] of rows.entries()) {
        if (cells.length !== header?.length) {
            throw new Error(
                `Invalid CSV: inconsistent columns in data row ${index + 1}.`,
            );
        }
        const value = cells[columns[0]].trim();
        if (!value) continue;
        emails.add(normalizeEmail(value, `in data row ${index + 1}`));
    }
    if (!emails.size) throw new Error("The CSV contains no email addresses.");
    return [...emails];
}
