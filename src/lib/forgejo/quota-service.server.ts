import type { QuotaGroup, QuotaRuleInfo } from "./api";
import { api } from "./forgejo-api";
import { UNLIMITED_QUOTA_GROUP, UNLIMITED_QUOTA_RULE } from "./quota-schemas";

function hasStatus(error: unknown, status: number) {
    return (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        error.status === status
    );
}

/** Reconciles the reserved group, including existing groups changed outside Athene. */
export async function ensureUnlimitedGroup() {
    let group: QuotaGroup;
    try {
        ({ data: group } = await api.admin.adminGetQuotaGroup(
            UNLIMITED_QUOTA_GROUP,
        ));
    } catch (error) {
        if (!hasStatus(error, 404)) throw error;
        try {
            await api.admin.adminCreateQuotaGroup({
                name: UNLIMITED_QUOTA_GROUP,
            });
        } catch (error) {
            // Another request may have created it in the meantime.
            if (!hasStatus(error, 409)) throw error;
        }
        ({ data: group } = await api.admin.adminGetQuotaGroup(
            UNLIMITED_QUOTA_GROUP,
        ));
    }

    let rule: QuotaRuleInfo;
    try {
        ({ data: rule } =
            await api.admin.adminGetQuotaRule(UNLIMITED_QUOTA_RULE));
    } catch (error) {
        if (!hasStatus(error, 404)) throw error;
        try {
            ({ data: rule } = await api.admin.adminCreateQuotaRule({
                name: UNLIMITED_QUOTA_RULE,
                limit: -1,
                subjects: ["size:all"],
            }));
        } catch (error) {
            if (!hasStatus(error, 409)) throw error;
            ({ data: rule } =
                await api.admin.adminGetQuotaRule(UNLIMITED_QUOTA_RULE));
        }
    }
    if (
        rule.limit !== -1 ||
        rule.subjects?.length !== 1 ||
        rule.subjects[0] !== "size:all"
    ) {
        await api.admin.adminEditQuotaRule(UNLIMITED_QUOTA_RULE, {
            limit: -1,
            subjects: ["size:all"],
        });
    }
    if (!group.rules?.some((rule) => rule.name === UNLIMITED_QUOTA_RULE)) {
        try {
            await api.admin.adminAddRuleToQuotaGroup(
                UNLIMITED_QUOTA_GROUP,
                UNLIMITED_QUOTA_RULE,
            );
        } catch (error) {
            if (!hasStatus(error, 409)) throw error;
        }
    }
    // A finite rule alongside the unlimited rule can still deny operations.
    for (const rule of group.rules ?? []) {
        if (rule.name && rule.name !== UNLIMITED_QUOTA_RULE) {
            try {
                await api.admin.adminRemoveRuleFromQuotaGroup(
                    UNLIMITED_QUOTA_GROUP,
                    encodeURIComponent(rule.name),
                );
            } catch (error) {
                if (!hasStatus(error, 404)) throw error;
            }
        }
    }
}

export function requireEditableQuotaGroup(name: string) {
    if (name.toLowerCase() === UNLIMITED_QUOTA_GROUP) {
        throw new Error(
            "The unlimited quota group cannot be edited or deleted.",
        );
    }
}

export function requireEditableQuotaRule(
    name: string,
    protectedRules: string[],
) {
    if (name === UNLIMITED_QUOTA_RULE || protectedRules.includes(name)) {
        throw new Error("Rules in the unlimited quota group cannot be edited.");
    }
}
