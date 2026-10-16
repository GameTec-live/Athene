import assert from "node:assert/strict";
import { mock, test } from "node:test";

// Keep these tests independent of local credentials and external services.
Object.assign(process.env, {
    DATABASE_URL: "postgres://localhost/athene-test",
    BETTER_AUTH_URL: "https://athene.example.test",
    BETTER_AUTH_SECRET: "test-secret",
    FORGEJO_BASE_URL: "https://forgejo.example.test",
    FORGEJO_TOKEN: "test-token",
    FORGEJO_CLIENT_ID: "test-client",
    FORGEJO_CLIENT_SECRET: "test-client-secret",
    FORGEJO_DISCOVERY_URL:
        "https://forgejo.example.test/.well-known/openid-configuration",
    VITE_FORGEJO_BASE_URL: "https://forgejo.example.test",
});

const { createForgejoOrganization } = await import("./create-org.server");
const options = {
    username: "course-org",
    visibility: "limited" as const,
    repo_admin_change_team_access: false,
};
const organization = { id: 7, name: options.username };

test("organization ownership", async (t) => {
    for (const scenario of [
        { name: "removes the token admin after adding the creator" },
        {
            name: "does not remove an admin who was not added",
            adminMember: false,
        },
        {
            name: "keeps the creator when they also own the token",
            creator: "ADMIN",
        },
        { name: "rolls back if adding the creator fails", failure: "add" },
        { name: "rolls back if the Owners team is missing", failure: "team" },
        { name: "rolls back if removing the admin fails", failure: "remove" },
        { name: "reports ownership and rollback errors", failure: "rollback" },
        {
            name: "does not create an org without a valid token user",
            failure: "token",
        },
    ]) {
        await t.test(scenario.name, async () => {
            const calls: string[] = [];
            const creator = scenario.creator ?? "teacher";
            const failure = scenario.failure;
            const fetchMock = mock.method(
                globalThis,
                "fetch",
                async (url: string | URL | Request, init?: RequestInit) => {
                    const path = new URL(String(url)).pathname.replace(
                        "/api/v1",
                        "",
                    );
                    const call = `${init?.method} ${path}`;
                    calls.push(call);
                    switch (call) {
                        case "GET /user":
                            return Response.json(
                                failure === "token" ? {} : { login: "admin" },
                            );
                        case "POST /orgs":
                            assert.deepEqual(
                                JSON.parse(String(init?.body)),
                                options,
                            );
                            return Response.json(organization, { status: 201 });
                        case "GET /orgs/course-org/teams":
                            return Response.json(
                                failure === "team"
                                    ? []
                                    : [{ id: 42, name: "Owners" }],
                            );
                        case `PUT /teams/42/members/${creator}`:
                            return failure === "add" || failure === "rollback"
                                ? Response.json(
                                      { message: "Add failed" },
                                      { status: 500 },
                                  )
                                : new Response(null, { status: 204 });
                        case "GET /teams/42/members":
                            return Response.json(
                                scenario.adminMember === false
                                    ? [{ login: creator }]
                                    : [{ login: "admin" }, { login: creator }],
                            );
                        case "DELETE /teams/42/members/admin":
                            return failure === "remove"
                                ? Response.json(
                                      { message: "Remove failed" },
                                      { status: 500 },
                                  )
                                : new Response(null, { status: 204 });
                        case "DELETE /orgs/course-org":
                            return failure === "rollback"
                                ? Response.json(
                                      { message: "Rollback failed" },
                                      { status: 500 },
                                  )
                                : new Response(null, { status: 204 });
                        default:
                            assert.fail(`Unexpected Forgejo request: ${call}`);
                    }
                },
            );

            try {
                if (failure) {
                    await assert.rejects(
                        createForgejoOrganization(creator, options),
                        (error) => {
                            if (failure === "rollback") {
                                assert.ok(error instanceof AggregateError);
                                assert.equal(error.errors.length, 2);
                            }
                            return true;
                        },
                    );
                    if (failure === "token") {
                        assert.deepEqual(calls, ["GET /user"]);
                    } else {
                        assert.equal(calls.at(-1), "DELETE /orgs/course-org");
                        if (
                            failure === "add" ||
                            failure === "team" ||
                            failure === "rollback"
                        ) {
                            assert.ok(
                                !calls.includes(
                                    "DELETE /teams/42/members/admin",
                                ),
                            );
                        }
                    }
                } else {
                    assert.deepEqual(
                        await createForgejoOrganization(creator, options),
                        organization,
                    );
                    assert.deepEqual(calls, [
                        "GET /user",
                        "POST /orgs",
                        "GET /orgs/course-org/teams",
                        `PUT /teams/42/members/${creator}`,
                        ...(scenario.creator ? [] : ["GET /teams/42/members"]),
                        ...(scenario.creator || scenario.adminMember === false
                            ? []
                            : ["DELETE /teams/42/members/admin"]),
                    ]);
                }
            } finally {
                fetchMock.mock.restore();
            }
        });
    }
});

test("membership reads include new organizations and follow every page", async () => {
    const { getUserOrganizationSlugs } = await import("./memberships.server");
    let memberships = [
        [{ name: "Existing" }],
        [{ username: "New-Private" }],
        [],
    ];
    const pages: number[] = [];
    const fetchMock = mock.method(
        globalThis,
        "fetch",
        async (input: string | URL | Request) => {
            const url = new URL(String(input));
            assert.equal(url.pathname, "/api/v1/users/teacher/orgs");
            const page = Number(url.searchParams.get("page"));
            pages.push(page);
            return Response.json(memberships[page - 1]);
        },
    );
    try {
        assert.deepEqual(await getUserOrganizationSlugs("teacher"), [
            "existing",
            "new-private",
        ]);
        assert.deepEqual(pages, [1, 2, 3]);

        // The next read must reflect both added and revoked memberships.
        memberships = [[{ name: "Latest" }], []];
        assert.deepEqual(await getUserOrganizationSlugs("teacher"), ["latest"]);
    } finally {
        fetchMock.mock.restore();
    }
});
