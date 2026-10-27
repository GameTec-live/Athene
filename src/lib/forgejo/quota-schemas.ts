import * as v from "valibot";

export const UNLIMITED_QUOTA_GROUP = "unlimited";
export const UNLIMITED_QUOTA_RULE = "athene-unlimited";

// Forgejos supported subjects
export const quotaSubjects = [
    {
        value: "size:all",
        label: "Total storage",
        description:
            "Everything tracked by Forgejo: repositories, LFS files, attachments, Actions artifacts, packages, and wikis.",
    },
    {
        value: "size:git:all",
        label: "All Git data",
        description:
            "Repository data and Git LFS files combined, across public and private repositories.",
    },
    {
        value: "size:repos:all",
        label: "Repositories",
        description:
            "Git repository storage across public and private repositories. Excludes Git LFS files.",
    },
    {
        value: "size:git:lfs",
        label: "Git LFS",
        description:
            "Large files stored through Git LFS in public and private repositories.",
    },
    {
        value: "size:assets:all",
        label: "All assets",
        description:
            "Attachments, Actions artifacts, packages, and wikis combined.",
    },
    {
        value: "size:assets:attachments:all",
        label: "All attachments",
        description:
            "Uploaded issue, comment, and release attachments combined.",
    },
    {
        value: "size:assets:attachments:issues",
        label: "Issue attachments",
        description: "Files attached to issues and their comments.",
    },
    {
        value: "size:assets:attachments:releases",
        label: "Release attachments",
        description:
            "Files uploaded to releases. Excludes automatically generated source archives.",
    },
    {
        value: "size:assets:artifacts",
        label: "Actions artifacts",
        description: "Artifacts uploaded by Forgejo Actions workflows.",
    },
    {
        value: "size:assets:packages:all",
        label: "Packages",
        description: "Storage used by packages in the package registry.",
    },
    {
        value: "size:assets:wiki",
        label: "Wikis",
        description: "Storage used by repository wikis.",
    },
] as const;

export const quotaLimitUnits = [
    { value: 0, label: "B" },
    { value: 3, label: "KB" },
    { value: 6, label: "MB" },
    { value: 9, label: "GB" },
] as const;

export type QuotaLimitUnit = (typeof quotaLimitUnits)[number]["value"];

/** Shift the decimal exponent so values such as 1.001 KB become exactly 1001 bytes. */
export function parseQuotaLimit(amount: string, unit: QuotaLimitUnit) {
    const value = amount.trim();
    const number = Number(value);
    if (!value || !Number.isFinite(number)) return Number.NaN;
    if (number < 0) return number === -1 ? -1 : Number.NaN;
    const [coefficient, exponent = "0"] = value.split(/[eE]/);
    return Number(`${coefficient}e${Number(exponent) + unit}`);
}

/** Choose a readable unit without changing the exact byte limit when editing. */
export function getQuotaLimitInput(bytes = -1): {
    amount: string;
    unit: QuotaLimitUnit;
} {
    if (bytes === -1) return { amount: "-1", unit: 9 };
    for (const unit of [...quotaLimitUnits].reverse()) {
        const amount = String(Number(`${bytes}e-${unit.value}`));
        if (
            Number(amount) >= 1 &&
            parseQuotaLimit(amount, unit.value) === bytes
        ) {
            return { amount, unit: unit.value };
        }
    }
    return { amount: String(bytes), unit: 0 };
}

export const quotaNameSchema = v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "Enter a name."),
    v.maxLength(255, "Names must be at most 255 characters."),
);

export const quotaRuleSchema = v.object({
    name: quotaNameSchema,
    limit: v.pipe(
        v.number(),
        v.safeInteger("Enter a whole number of bytes."),
        v.minValue(-1, "Use -1 for unlimited, or a nonnegative limit."),
    ),
    subjects: v.pipe(
        v.array(v.pipe(v.string(), v.minLength(1))),
        v.minLength(1, "Select at least one subject."),
        v.check((subjects) => new Set(subjects).size === subjects.length),
    ),
});

export const quotaRuleFormSchema = v.object({
    ...quotaRuleSchema.entries,
    limit: v.pipe(
        v.object({
            amount: v.string(),
            unit: v.picklist(quotaLimitUnits.map((unit) => unit.value)),
        }),
        v.transform(({ amount, unit }) => parseQuotaLimit(amount, unit)),
        quotaRuleSchema.entries.limit,
    ),
});

export function formatQuotaLimit(limit: number) {
    if (limit === -1) return "Unlimited";
    const units = ["B", "KB", "MB", "GB", "TB"];
    const unit = Math.min(
        Math.floor(Math.log10(Math.max(limit, 1)) / 3),
        units.length - 1,
    );
    return `${Number((limit / 1000 ** unit).toFixed(2))} ${units[unit]}`;
}
