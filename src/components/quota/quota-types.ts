import type { getQuotaDashboard, getQuotaMembers } from "#/lib/forgejo/quotas";

type Dashboard = Awaited<ReturnType<typeof getQuotaDashboard>>;
export type QuotaGroup = Dashboard["groups"][number] & {
    members: ReturnType<typeof getQuotaMembers>;
};
export type QuotaDashboardData = Omit<Dashboard, "groups"> & {
    groups: QuotaGroup[];
};
export type QuotaRule = Dashboard["rules"][number];
