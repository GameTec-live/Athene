import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { adminMiddleware, dashboardMiddleware } from "#/lib/auth.functions";
import { api } from "./forgejo-api";
import {
    quotaNameSchema,
    quotaRuleSchema,
    UNLIMITED_QUOTA_GROUP,
} from "./quota-schemas";
import {
    ensureUnlimitedGroup,
    requireEditableQuotaGroup,
    requireEditableQuotaRule,
} from "./quota-service.server";

const groupSchema = v.object({ group: quotaNameSchema });
const groupRuleSchema = v.object({
    group: quotaNameSchema,
    rule: quotaNameSchema,
});

async function requireUnprotectedRule(name: string) {
    const { data: unlimited } = await api.admin.adminGetQuotaGroup(
        UNLIMITED_QUOTA_GROUP,
    );
    requireEditableQuotaRule(
        name,
        (unlimited.rules ?? []).flatMap((rule) =>
            rule.name ? [rule.name] : [],
        ),
    );
}

/** Only names are exposed to organization creators, management requires admin permission. */
export const getQuotaGroupOptions = createServerFn({ method: "POST" })
    .middleware([dashboardMiddleware])
    .handler(async () => {
        await ensureUnlimitedGroup();
        const { data } = await api.admin.adminListQuotaGroups();
        return data.map((group) => v.parse(quotaNameSchema, group.name)).sort();
    });

export const getQuotaDashboard = createServerFn({ method: "POST" })
    .middleware([adminMiddleware])
    .handler(async () => {
        await ensureUnlimitedGroup();
        const [groups, rules] = await Promise.all([
            api.admin.adminListQuotaGroups(),
            api.admin.adminListQuotaRules(),
        ]);
        return {
            groups: groups.data
                .map((group) => ({
                    name: v.parse(quotaNameSchema, group.name),
                    rules: (group.rules ?? []).map((rule) =>
                        v.parse(quotaRuleSchema, rule),
                    ),
                }))
                .sort((a, b) => a.name.localeCompare(b.name)),
            rules: rules.data.map((rule) => v.parse(quotaRuleSchema, rule)),
        };
    });

export const createQuotaGroup = createServerFn({ method: "POST" })
    .middleware([adminMiddleware])
    .validator(v.object({ name: quotaNameSchema }))
    .handler(async ({ data }) => {
        requireEditableQuotaGroup(data.name);
        await api.admin.adminCreateQuotaGroup({ name: data.name });
    });

export const deleteQuotaGroup = createServerFn({ method: "POST" })
    .middleware([adminMiddleware])
    .validator(groupSchema)
    .handler(async ({ data }) => {
        requireEditableQuotaGroup(data.group);
        await api.admin.adminDeleteQuotaGroup(encodeURIComponent(data.group));
    });

export const getQuotaMembers = createServerFn({ method: "GET" })
    .middleware([adminMiddleware])
    .validator(groupSchema)
    .handler(async ({ data }) => {
        const { data: members } = await api.admin.adminListUsersInQuotaGroup(
            encodeURIComponent(data.group),
        );
        return members.map((member) => ({
            login: v.parse(quotaNameSchema, member.login),
            fullName: member.full_name,
        }));
    });

export const updateQuotaMembership = createServerFn({ method: "POST" })
    .middleware([adminMiddleware])
    .validator(
        v.object({
            group: quotaNameSchema,
            username: quotaNameSchema,
            action: v.picklist(["add", "remove"]),
        }),
    )
    .handler(async ({ data }) => {
        // Memberships remain manageable even when a group's policy is immutable.
        const method =
            data.action === "add"
                ? api.admin.adminAddUserToQuotaGroup
                : api.admin.adminRemoveUserFromQuotaGroup;
        await method(
            encodeURIComponent(data.group),
            encodeURIComponent(data.username),
        );
    });

export const saveQuotaRule = createServerFn({ method: "POST" })
    .middleware([adminMiddleware])
    .validator(
        v.object({
            group: quotaNameSchema,
            rule: quotaRuleSchema,
            create: v.boolean(),
        }),
    )
    .handler(async ({ data }) => {
        requireEditableQuotaGroup(data.group);
        await requireUnprotectedRule(data.rule.name);
        if (data.create) {
            await api.admin.adminCreateQuotaRule(data.rule);
            try {
                await api.admin.adminAddRuleToQuotaGroup(
                    encodeURIComponent(data.group),
                    encodeURIComponent(data.rule.name),
                );
            } catch (error) {
                // Remove the newly created rule if attaching it failed.
                await api.admin.adminDeleteQuotaRule(
                    encodeURIComponent(data.rule.name),
                );
                throw error;
            }
        } else {
            const { data: group } = await api.admin.adminGetQuotaGroup(
                encodeURIComponent(data.group),
            );
            if (!group.rules?.some((rule) => rule.name === data.rule.name)) {
                throw new Error(
                    "This rule is no longer attached to the group.",
                );
            }
            await api.admin.adminEditQuotaRule(
                encodeURIComponent(data.rule.name),
                {
                    limit: data.rule.limit,
                    subjects: data.rule.subjects,
                },
            );
        }
    });

export const attachQuotaRule = createServerFn({ method: "POST" })
    .middleware([adminMiddleware])
    .validator(groupRuleSchema)
    .handler(async ({ data }) => {
        requireEditableQuotaGroup(data.group);
        await api.admin.adminAddRuleToQuotaGroup(
            encodeURIComponent(data.group),
            encodeURIComponent(data.rule),
        );
    });

export const removeQuotaRule = createServerFn({ method: "POST" })
    .middleware([adminMiddleware])
    .validator(groupRuleSchema)
    .handler(async ({ data }) => {
        requireEditableQuotaGroup(data.group);
        await api.admin.adminRemoveRuleFromQuotaGroup(
            encodeURIComponent(data.group),
            encodeURIComponent(data.rule),
        );
    });

export const deleteQuotaRule = createServerFn({ method: "POST" })
    .middleware([adminMiddleware])
    .validator(groupRuleSchema)
    .handler(async ({ data }) => {
        requireEditableQuotaGroup(data.group);
        await requireUnprotectedRule(data.rule);
        await api.admin.adminDeleteQuotaRule(encodeURIComponent(data.rule));
    });
