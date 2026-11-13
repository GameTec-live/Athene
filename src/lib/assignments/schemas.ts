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

export const assignmentFormSchema = v.pipe(
    v.object({
        name: v.pipe(
            v.string(),
            v.trim(),
            v.minLength(1, "Enter an assignment name."),
            v.maxLength(100, "Names must be at most 100 characters."),
        ),
        type: v.picklist(["individual", "group"]),
        /**
         * Empty for no deadline. The form holds a local `datetime-local`
         * value and converts it to an ISO timestamp before submitting.
         */
        deadline: v.union([
            v.literal(""),
            v.pipe(
                v.string(),
                v.check(
                    (value) => !Number.isNaN(Date.parse(value)),
                    "Enter a valid deadline.",
                ),
                v.check(
                    (value) => Date.parse(value) > Date.now(),
                    "The deadline must be in the future.",
                ),
            ),
        ]),
        archiveOnDeadline: v.boolean(),
        autograding: v.boolean(),
        autogradeId: v.nullable(v.pipe(v.string(), v.uuid())),
        /** `owner/name` of a Forgejo template repository. */
        templateRepository: v.nullable(
            v.pipe(
                v.string(),
                v.regex(/^[^/\s]+\/[^/\s]+$/, "Select a template repository."),
            ),
        ),
        studentIsAdmin: v.boolean(),
        features: v.object({
            issues: v.boolean(),
            pullRequests: v.boolean(),
            wiki: v.boolean(),
            projects: v.boolean(),
            releases: v.boolean(),
            packages: v.boolean(),
        }),
        namingTemplate: v.pipe(v.string(), v.trim()),
        joinLink: v.boolean(),
        rosterRestriction: v.nullable(v.pipe(v.string(), v.uuid())),
        /** Preassigned students. `group` indexes into `groups`. */
        students: v.array(
            v.object({
                forgejoId: v.pipe(v.number(), v.integer(), v.minValue(1)),
                group: v.nullable(v.pipe(v.number(), v.integer())),
            }),
        ),
        groupNaming: v.picklist(["predefined", "student"]),
        groups: v.array(groupNameSchema),
        /** 0 means unlimited. Only used when students create groups. */
        maxGroups: limitSchema,
        /** 0 means unlimited. */
        maxGroupMembers: limitSchema,
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
            if (input.type !== "group" || input.maxGroupMembers === 0) {
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
