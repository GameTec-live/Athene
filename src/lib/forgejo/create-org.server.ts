import type { CreateOrgOption } from "./api";
import { api } from "./forgejo-api";

/** Creates an organization with the UI user as its owner. */
export async function createForgejoOrganization(
    username: string,
    options: CreateOrgOption,
) {
    const { data: tokenUser } = await api.user.userGetCurrent();
    if (!tokenUser.login)
        throw new Error("Invalid Forgejo token user response");

    const { data: organization } = await api.orgs.orgCreate(options);
    const slug = encodeURIComponent(options.username);

    try {
        // A newly created organization contains only the built-in Owners team.
        const { data: teams } = await api.orgs.orgListTeams(slug);
        const owners = teams.find(
            (team) => team.name?.toLowerCase() === "owners",
        );
        if (!owners?.id || !Number.isSafeInteger(owners.id) || owners.id < 0) {
            throw new Error("Forgejo organization has no Owners team");
        }

        // Establish ownership before removing the automatically added admin.
        await api.teams.orgAddTeamMember(
            owners.id,
            encodeURIComponent(username),
        );
        if (tokenUser.login.toLowerCase() !== username.toLowerCase()) {
            const { data: members } = await api.teams.orgListTeamMembers(
                owners.id,
            );
            if (
                members.some(
                    (member) =>
                        member.login?.toLowerCase() ===
                        tokenUser.login?.toLowerCase(),
                )
            ) {
                await api.teams.orgRemoveTeamMember(
                    owners.id,
                    encodeURIComponent(tokenUser.login),
                );
            }
        }

        // Create teachers team on org with "All repositories" and "Create repositories"
        await api.orgs.orgCreateTeam(slug, {
            name: "teachers",
            permission: "admin",
            includes_all_repositories: true,
            can_create_org_repo: true,
        });
    } catch (error) {
        // Roll back this new, empty organization if ownership setup fails.
        try {
            await api.orgs.orgDelete(slug);
        } catch (rollbackError) {
            throw new AggregateError(
                [error, rollbackError],
                "Failed to configure organization ownership and roll back creation",
            );
        }
        throw error;
    }

    return organization;
}
