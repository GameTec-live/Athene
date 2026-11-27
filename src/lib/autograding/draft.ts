import * as v from "valibot";
import { validateConfig } from "./schemas";

// Editor switching checks only whether the form can represent the JSON.
// Required fields and scoring rules are validated when saving.
const editableNumber = v.union([v.number(), v.string()]);
const jsonObject = v.custom<Record<string, unknown>>(
    (input) =>
        typeof input === "object" && input !== null && !Array.isArray(input),
);
const editableConfigSchema = v.pipe(
    jsonObject,
    v.strictObject({
        grading: v.optional(
            v.array(
                v.pipe(
                    jsonObject,
                    v.strictObject({
                        name: v.optional(v.string(), ""),
                        command: v.optional(v.string(), ""),
                        codes: v.optional(
                            v.pipe(
                                jsonObject,
                                v.record(v.string(), editableNumber),
                            ),
                            {},
                        ),
                    }),
                ),
            ),
            [],
        ),
        maxPoints: v.optional(editableNumber),
        overlays: v.optional(v.array(v.string())),
    }),
);

export type GradingTaskDraft = {
    id: string;
    name: string;
    command: string;
    codes: { id: string; code: string; points: string }[];
};
export type ConfigDraft = {
    tasks: GradingTaskDraft[];
    maxPoints: string;
    overlays: { id: string; url: string }[];
};

export function newTask(): GradingTaskDraft {
    return {
        id: crypto.randomUUID(),
        name: "",
        command: "",
        codes: [
            { id: crypto.randomUUID(), code: "0", points: "1" },
            { id: crypto.randomUUID(), code: "1", points: "0" },
        ],
    };
}

export function configToDraft(
    config: v.InferOutput<typeof editableConfigSchema>,
): ConfigDraft {
    return {
        tasks: config.grading.map((task) => ({
            ...task,
            id: crypto.randomUUID(),
            codes: Object.entries(task.codes).map(([code, points]) => ({
                id: crypto.randomUUID(),
                code,
                points: String(points),
            })),
        })),
        maxPoints:
            config.maxPoints === undefined ? "" : String(config.maxPoints),
        overlays: (config.overlays ?? []).map((url) => ({
            id: crypto.randomUUID(),
            url,
        })),
    };
}

export function parseDraft(text: string): ConfigDraft | null {
    let input: unknown;
    try {
        input = JSON.parse(text);
    } catch {
        return null;
    }
    const result = v.safeParse(editableConfigSchema, input);
    return result.success ? configToDraft(result.output) : null;
}

function draftValue(draft: ConfigDraft) {
    const errors: string[] = [];
    const grading = draft.tasks.map((task, index) => {
        const codes = task.codes.map((row) => row.code);
        if (new Set(codes).size !== codes.length)
            errors.push(
                `grading.${index}.codes: Each exit code must be unique.`,
            );
        return {
            name: task.name,
            command: task.command,
            codes: Object.fromEntries(
                task.codes.map((row) => [row.code, numericValue(row.points)]),
            ),
        };
    });
    // Detect duplicate rows before converting to an object, which would discard them.
    if (errors.length) return { success: false as const, errors };
    return {
        success: true as const,
        value: {
            grading,
            ...(draft.maxPoints.trim() === ""
                ? {}
                : { maxPoints: numericValue(draft.maxPoints) }),
            overlays: draft.overlays.map((overlay) => overlay.url),
        },
    };
}

function numericValue(value: string) {
    return value.trim() !== "" && Number.isFinite(Number(value))
        ? Number(value)
        : value;
}

export function draftToConfig(draft: ConfigDraft) {
    const result = draftValue(draft);
    return result.success ? validateConfig(result.value) : result;
}

export function draftToJson(draft: ConfigDraft) {
    const result = draftValue(draft);
    return result.success
        ? {
              success: true as const,
              json: JSON.stringify(result.value, null, 4),
          }
        : result;
}
