import * as v from "valibot";
import { orgSlugSchema } from "../common-schemas";
import { sanitizeRepoName, validateNamingTemplate } from "./naming";

export const ASSIGNMENT_FEATURES = [
    { key: "issues", label: "Issues" },
    { key: "pullRequests", label: "Pull requests" },
    { key: "wiki", label: "Wiki" },
    { key: "projects", label: "Projects" },
    { key: "releases", label: "Releases" },
    { key: "packages", label: "Packages" },
] as const;

export type AssignmentFeature = (typeof ASSIGNMENT_FEATURES)[number]["key"];

export const groupNameSchema = v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "Enter a group name."),
    v.maxLength(50, "Group names must be at most 50 characters."),
    v.check(
        (name) => sanitizeRepoName(name).length > 0,
        "Group names must contain letters or digits.",
    ),
);

export const customNameSchema = v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "Enter a name."),
    v.maxLength(50, "Names must be at most 50 characters."),
    v.check(
        (name) => sanitizeRepoName(name).length > 0,
        "Names must contain letters or digits.",
    ),
);

const limitSchema = v.pipe(
    v.number("Enter a number."),
    v.integer("Enter a whole number."),
    v.minValue(0, "Enter 0 or more."),
    v.maxValue(10_000),
);

const nameSchema = v.pipe(
    v.string(),
    v.trim(),
    v.minLength(1, "Enter an assignment name."),
    v.maxLength(100, "Names must be at most 100 characters."),
);

/**
 * Empty for no deadline. Forms hold a local `datetime-local` value and
 * convert it to an ISO timestamp before submitting.
 */
const deadlineSchema = v.union([
    v.literal(""),
    v.pipe(
        v.string(),
        v.check(
            (value) => !Number.isNaN(Date.parse(value)),
            "Enter a valid deadline.",
        ),
    ),
]);

export const FUTURE_DEADLINE_MESSAGE = "The deadline must be in the future.";

const featuresSchema = v.object({
    issues: v.boolean(),
    pullRequests: v.boolean(),
    wiki: v.boolean(),
    projects: v.boolean(),
    releases: v.boolean(),
    packages: v.boolean(),
});

export type AssignmentFeatures = v.InferOutput<typeof featuresSchema>;

/** Settings shared by the creation form and the details page. */
const editableFields = {
    name: nameSchema,
    deadline: deadlineSchema,
    archiveOnDeadline: v.boolean(),
    autograding: v.boolean(),
    autogradeId: v.nullable(v.pipe(v.string(), v.uuid())),
    features: featuresSchema,
    joinLink: v.boolean(),
    rosterRestriction: v.nullable(v.pipe(v.string(), v.uuid())),
    /** 0 means unlimited. Only used when students create groups. */
    maxGroups: limitSchema,
    /** 0 means unlimited. */
    maxGroupMembers: limitSchema,
};

export const assignmentFormSchema = v.pipe(
    v.object({
        ...editableFields,
        deadline: v.pipe(
            deadlineSchema,
            v.check(
                (value) => value === "" || Date.parse(value) > Date.now(),
                FUTURE_DEADLINE_MESSAGE,
            ),
        ),
        type: v.picklist(["individual", "group"]),
        /** `owner/name` of a Forgejo template repository. */
        templateRepository: v.nullable(
            v.pipe(
                v.string(),
                v.regex(/^[^/\s]+\/[^/\s]+$/, "Select a template repository."),
            ),
        ),
        studentIsAdmin: v.boolean(),
        namingTemplate: v.pipe(v.string(), v.trim()),
        /** Preassigned students. `group` indexes into `groups`. */
        students: v.array(
            v.object({
                forgejoId: v.pipe(v.number(), v.integer(), v.minValue(1)),
                group: v.nullable(v.pipe(v.number(), v.integer())),
            }),
        ),
        groupNaming: v.picklist(["predefined", "student"]),
        groups: v.array(groupNameSchema),
    }),
    v.forward(
        v.check(
            (input) =>
                validateNamingTemplate(
                    input.namingTemplate,
                    input.type,
                    input.joinLink,
                ) === undefined,
            (issue) =>
                validateNamingTemplate(
                    issue.input.namingTemplate,
                    issue.input.type,
                    issue.input.joinLink,
                ) ?? "Invalid template.",
        ),
        ["namingTemplate"],
    ),
    v.forward(
        v.check(
            (input) => !input.autograding || !!input.autogradeId,
            "Select an autograding config.",
        ),
        ["autogradeId"],
    ),
    v.forward(
        v.check(
            (input) => input.joinLink || !input.rosterRestriction,
            "Restricting to a roster requires joining via link.",
        ),
        ["rosterRestriction"],
    ),
    v.forward(
        v.check(
            (input) =>
                input.type === "group" ||
                input.joinLink ||
                input.students.length > 0,
            "Add at least one student or enable joining via link.",
        ),
        ["students"],
    ),
    v.forward(
        v.check(
            (input) =>
                new Set(input.students.map((s) => s.forgejoId)).size ===
                input.students.length,
            "Each student can only be added once.",
        ),
        ["students"],
    ),
    v.forward(
        v.check(
            (input) =>
                input.type !== "group" ||
                input.groupNaming !== "student" ||
                input.joinLink,
            "Letting students name their group requires joining via link.",
        ),
        ["joinLink"],
    ),
    v.forward(
        v.check(
            (input) =>
                input.type !== "group" ||
                input.groupNaming !== "predefined" ||
                input.groups.length > 0,
            "Add at least one group.",
        ),
        ["groups"],
    ),
    v.forward(
        v.check(
            (input) =>
                input.type !== "group" ||
                input.groupNaming !== "predefined" ||
                new Set(input.groups.map((name) => name.toLowerCase())).size ===
                    input.groups.length,
            "Group names must be unique.",
        ),
        ["groups"],
    ),
    v.forward(
        v.check(
            (input) =>
                input.type !== "group" ||
                input.joinLink ||
                input.students.length > 0,
            "Without a join link, preassign at least one student.",
        ),
        ["students"],
    ),
    v.forward(
        v.check((input) => {
            if (input.type !== "group") return true;
            // Students form their own groups; preassignments are ignored.
            if (input.groupNaming === "student") return true;
            return input.students.every(
                (s) =>
                    s.group !== null &&
                    s.group >= 0 &&
                    s.group < input.groups.length,
            );
        }, "Assign every student to a group."),
        ["students"],
    ),
    v.forward(
        v.check((input) => {
            if (
                input.type !== "group" ||
                input.groupNaming === "student" ||
                input.maxGroupMembers === 0
            ) {
                return true;
            }
            const counts = new Map<number, number>();
            for (const s of input.students) {
                if (s.group === null) continue;
                counts.set(s.group, (counts.get(s.group) ?? 0) + 1);
            }
            return [...counts.values()].every(
                (count) => count <= input.maxGroupMembers,
            );
        }, "A group has more members than allowed."),
        ["students"],
    ),
);

export type AssignmentFormValues = v.InferInput<typeof assignmentFormSchema>;

export const createAssignmentSchema = v.object({
    orgSlug: orgSlugSchema,
    classId: v.pipe(v.string(), v.uuid()),
    assignment: assignmentFormSchema,
});

/**
 * Settings that stay editable after creation. The deadline may lie in the
 * past here, since an existing past deadline has to survive unrelated edits;
 * the server only rejects a past deadline when it changes.
 */
export const assignmentSettingsSchema = v.pipe(
    v.object(editableFields),
    v.forward(
        v.check(
            (input) => !input.autograding || !!input.autogradeId,
            "Select an autograding config.",
        ),
        ["autogradeId"],
    ),
    v.forward(
        v.check(
            (input) => input.joinLink || !input.rosterRestriction,
            "Restricting to a roster requires joining via link.",
        ),
        ["rosterRestriction"],
    ),
);

export type AssignmentSettingsValues = v.InferInput<
    typeof assignmentSettingsSchema
>;

export const assignmentParamsSchema = v.object({
    orgSlug: orgSlugSchema,
    classId: v.pipe(v.string(), v.uuid()),
    assignmentId: v.pipe(v.string(), v.uuid()),
});

export const updateAssignmentSchema = v.object({
    ...assignmentParamsSchema.entries,
    settings: assignmentSettingsSchema,
});

/** A group an added student goes into: an existing one or one of `newGroups`. */
const groupTargetSchema = v.variant("type", [
    v.object({ type: v.literal("existing"), id: v.pipe(v.string(), v.uuid()) }),
    v.object({
        type: v.literal("new"),
        index: v.pipe(v.number(), v.integer(), v.minValue(0)),
    }),
]);

export type GroupTarget = v.InferOutput<typeof groupTargetSchema>;

export const addStudentsSchema = v.object({
    ...assignmentParamsSchema.entries,
    newGroups: v.pipe(v.array(groupNameSchema), v.maxLength(200)),
    students: v.array(
        v.object({
            forgejoId: v.pipe(v.number(), v.integer(), v.minValue(1)),
            group: v.nullable(groupTargetSchema),
        }),
    ),
});

export const removeStudentSchema = v.object({
    ...assignmentParamsSchema.entries,
    userId: v.pipe(v.string(), v.minLength(1)),
});
