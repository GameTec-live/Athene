/**
 * Repository naming templates.
 *
 * A template is plain text with `$PLACEHOLDER` tokens (case-insensitive), e.g.
 * `$YYYY-$ORGNAME-project-$STUDENTNAME`. Use `${PLACEHOLDER}` when a token is
 * directly followed by letters, e.g. `${YYYY}project`. The rendered result is
 * sanitized into a valid Forgejo repository name.
 */

export type AssignmentType = "individual" | "group";

export type NamingPlaceholder = {
    token: string;
    description: string;
    /** Only available for this assignment type. */
    type?: AssignmentType;
    /** Only available when students join via link. */
    requiresJoinLink?: boolean;
};

export const NAMING_PLACEHOLDERS: NamingPlaceholder[] = [
    { token: "ASSIGNMENTNAME", description: "Assignment name" },
    { token: "CLASSNAME", description: "Class name" },
    { token: "ORGNAME", description: "Organization name" },
    {
        token: "STUDENTNAME",
        description: "Student's Forgejo username",
        type: "individual",
    },
    { token: "GROUPNAME", description: "Group name", type: "group" },
    { token: "YYYY", description: "Year (4 digits)" },
    { token: "YY", description: "Year (2 digits)" },
    { token: "MM", description: "Month (2 digits)" },
    { token: "DD", description: "Day (2 digits)" },
    {
        token: "CUSTOM",
        description: "Name entered by the student on the join page",
        requiresJoinLink: true,
    },
];

/** The placeholder that keeps repository names unique per assignment type. */
export const UNIQUE_PLACEHOLDER: Record<AssignmentType, string> = {
    individual: "STUDENTNAME",
    group: "GROUPNAME",
};

export const DEFAULT_NAMING_TEMPLATES: Record<AssignmentType, string> = {
    individual: "$ASSIGNMENTNAME-$STUDENTNAME",
    group: "$ASSIGNMENTNAME-$GROUPNAME",
};

export const REPO_NAME_MAX_LENGTH = 100;

const TOKEN_PATTERN = /\$(?:\{([A-Za-z]+)\}|([A-Za-z]+))/g;

export function availablePlaceholders(type: AssignmentType, joinLink: boolean) {
    return NAMING_PLACEHOLDERS.filter(
        (placeholder) =>
            (!placeholder.type || placeholder.type === type) &&
            (!placeholder.requiresJoinLink || joinLink),
    );
}

/** Returns the uppercased tokens used by a template, in order of appearance. */
export function templateTokens(template: string) {
    return [...template.matchAll(TOKEN_PATTERN)].map((match) =>
        (match[1] ?? match[2]).toUpperCase(),
    );
}

export function usesCustomPlaceholder(template: string | null | undefined) {
    return !!template && templateTokens(template).includes("CUSTOM");
}

/** Returns an error message, or undefined if the template is valid. */
export function validateNamingTemplate(
    template: string,
    type: AssignmentType,
    joinLink: boolean,
) {
    if (!template.trim()) return "Enter a repository naming template.";
    const allowed = new Set(
        availablePlaceholders(type, joinLink).map((p) => p.token),
    );
    const tokens = templateTokens(template);
    for (const token of tokens) {
        if (allowed.has(token)) continue;
        if (token === "CUSTOM") {
            return "$CUSTOM is only available when joining via link is enabled.";
        }
        if (NAMING_PLACEHOLDERS.some((p) => p.token === token)) {
            return `$${token} is not available for ${type} assignments.`;
        }
        return `Unknown placeholder $${token}.`;
    }
    const unique = UNIQUE_PLACEHOLDER[type];
    if (!tokens.includes(unique)) {
        return `The template must contain $${unique} so every repository name is unique.`;
    }
    return undefined;
}

/** Converts arbitrary text into characters Forgejo accepts in repository names. */
export function sanitizeRepoName(value: string) {
    return value
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/ß/g, "ss")
        .replace(/\s+/g, "-")
        .replace(/[^A-Za-z0-9._-]/g, "")
        .replace(/-{2,}/g, "-")
        .replace(/^[-.]+|[-.]+$/g, "")
        .slice(0, REPO_NAME_MAX_LENGTH)
        .replace(/[-.]+$/g, "");
}

export type NamingContext = {
    assignmentName: string;
    className: string;
    orgName: string;
    studentName?: string;
    groupName?: string;
    custom?: string;
    date?: Date;
};

export function renderRepoName(template: string, context: NamingContext) {
    const date = context.date ?? new Date();
    const values: Record<string, string | undefined> = {
        ASSIGNMENTNAME: context.assignmentName,
        CLASSNAME: context.className,
        ORGNAME: context.orgName,
        STUDENTNAME: context.studentName,
        GROUPNAME: context.groupName,
        YYYY: String(date.getFullYear()),
        YY: String(date.getFullYear()).slice(-2),
        MM: String(date.getMonth() + 1).padStart(2, "0"),
        DD: String(date.getDate()).padStart(2, "0"),
        CUSTOM: context.custom,
    };
    const rendered = template.replace(
        TOKEN_PATTERN,
        (_, braced: string | undefined, bare: string | undefined) =>
            values[(braced ?? bare ?? "").toUpperCase()] ?? "",
    );
    return sanitizeRepoName(rendered);
}
