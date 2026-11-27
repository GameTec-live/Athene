import * as jsonc from "jsonc-parser";

type Repository = {
    fullName: string;
    url: string;
    defaultBranch: string;
    private: boolean;
};
type Completion = {
    label: string;
    filterText: string;
    insertText: string;
    kind: "property" | "repository";
    detail?: string;
    snippet?: boolean;
};

const properties = [
    [
        "grading",
        `"grading": [\n    { "name": "\${1:Task}", "command": "\${2:python main.py}", "codes": { "0": 1, "1": 0 } }\n]`,
    ],
    ["maxPoints", `"maxPoints": \${1:10}`],
    ["overlays", `"overlays": [\${1}]`],
    ["name", '"name": "$1"'],
    ["command", '"command": "$1"'],
    ["codes", `"codes": { "0": \${1:1}, "1": 0 }`],
];

export function getConfigCompletions(
    text: string,
    offset: number,
    repositories: readonly Repository[],
) {
    const location = jsonc.getLocation(text, offset);
    const range = completionRange(text, offset);
    const quoted = text[range.start] === '"';
    const filterText = (value: string) =>
        quoted ? JSON.stringify(value) : value;
    let suggestions: Completion[] = [];

    if (
        location.path[0] === "overlays" &&
        location.path.length === 2 &&
        !location.isAtPropertyKey
    ) {
        suggestions = repositories.map((repo) => ({
            label: repo.fullName,
            filterText: filterText(`${repo.fullName} ${repo.url}`),
            insertText: JSON.stringify(
                `${repo.url}/overlays@${repo.defaultBranch}`,
            ),
            kind: "repository",
            detail: `${repo.private ? "Private" : "Public"} repository · overlay path and reference`,
        }));
    } else if (location.isAtPropertyKey) {
        const hasColon = /^\s*:/.test(text.slice(range.end));
        suggestions = properties.map(([label, snippet]) => ({
            label,
            filterText: filterText(label),
            insertText: hasColon ? JSON.stringify(label) : snippet,
            kind: "property",
            snippet: !hasColon,
        }));
    }
    return { ...range, suggestions };
}

/** Include the whole token, not just the prefix before the cursor. */
function completionRange(text: string, offset: number) {
    const scanner = jsonc.createScanner(text);
    for (
        let token = scanner.scan();
        token !== jsonc.SyntaxKind.EOF;
        token = scanner.scan()
    ) {
        const start = scanner.getTokenOffset();
        const end = start + scanner.getTokenLength();
        if (start > offset) break;
        if (offset > end) continue;
        if (
            token === jsonc.SyntaxKind.StringLiteral ||
            token === jsonc.SyntaxKind.Unknown ||
            token === jsonc.SyntaxKind.NumericLiteral ||
            token === jsonc.SyntaxKind.NullKeyword ||
            token === jsonc.SyntaxKind.TrueKeyword ||
            token === jsonc.SyntaxKind.FalseKeyword
        ) {
            return {
                start,
                end:
                    scanner.getTokenError() ===
                    jsonc.ScanError.UnexpectedEndOfString
                        ? offset
                        : end,
            };
        }
    }
    return { start: offset, end: offset };
}
