/** Forgejo groups contain organization names and `organization:team` entries. */
export function getForgejoOrganizationNames(groups: unknown): string[] {
    if (!Array.isArray(groups)) return [];

    const names = new Set<string>();
    for (const group of groups) {
        if (typeof group !== "string") continue;
        const name = group.split(":", 1)[0].trim();
        if (name) names.add(name.toLowerCase());
    }
    return [...names];
}
