import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { betterAuth } from "better-auth";
import { admin, genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "#/db";
import * as schema from "#/db/schema";
import { env } from "#/env";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    plugins: [
        admin(),
        genericOAuth({
            config: [
                {
                    providerId: "forgejo",
                    clientId: env.FORGEJO_CLIENT_ID,
                    clientSecret: env.FORGEJO_CLIENT_SECRET,
                    discoveryUrl: env.FORGEJO_DISCOVERY_URL,
                },
            ],
        }),
        tanstackStartCookies(),
    ],
});
