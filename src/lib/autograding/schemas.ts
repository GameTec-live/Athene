import * as v from "valibot";

const pointsSchema = v.pipe(v.number(), v.finite(), v.minValue(0));
const requiredText = v.pipe(
    v.string(),
    v.check((value) => value.trim().length > 0, "This field is required."),
);

export const overlayUrlSchema = v.pipe(
    v.string(),
    v.url(),
    v.regex(/^https?:\/\//, "Use an HTTP or HTTPS overlay URL."),
);

export const autogradingConfigSchema = v.strictObject({
    grading: v.pipe(
        v.array(
            v.strictObject({
                name: requiredText,
                command: requiredText,
                codes: v.pipe(
                    v.record(
                        v.pipe(
                            v.string(),
                            v.regex(
                                /^\d+$/,
                                "Exit codes must be non-negative integers.",
                            ),
                        ),
                        pointsSchema,
                    ),
                    v.check(
                        (codes) => Object.keys(codes).length > 0,
                        "Add at least one exit code.",
                    ),
                ),
            }),
        ),
        v.minLength(1, "Add at least one task."),
    ),
    maxPoints: v.optional(pointsSchema),
    overlays: v.optional(v.array(overlayUrlSchema)),
});

export type AutogradingConfig = v.InferOutput<typeof autogradingConfigSchema>;

export const presetSchema = v.object({
    name: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, "Enter a preset name."),
        v.maxLength(255),
    ),
    config: autogradingConfigSchema,
});

export function validateConfig(input: unknown) {
    const result = v.safeParse(autogradingConfigSchema, input);
    if (result.success)
        return { success: true as const, config: result.output, errors: [] };
    return {
        success: false as const,
        errors: result.issues.map((issue) => {
            const path = v.getDotPath(issue);
            return path ? `${path}: ${issue.message}` : issue.message;
        }),
    };
}

export function parseConfig(text: string) {
    let value: unknown;
    try {
        value = JSON.parse(text);
    } catch (error) {
        return {
            success: false as const,
            errors: [error instanceof Error ? error.message : "Invalid JSON."],
        };
    }
    return validateConfig(value);
}
