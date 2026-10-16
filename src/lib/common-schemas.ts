import * as v from "valibot";

export const classNameSchema = v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "Enter a class name."),
);

export const orgSlugSchema = v.pipe(
    v.string(),
    v.trim(),
    v.toLowerCase(),
    v.minLength(1),
    v.maxLength(255),
);
