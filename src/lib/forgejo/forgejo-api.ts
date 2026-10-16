import { env } from "#/env";
import { forgejoApi } from "./api";

export const api = forgejoApi(env.FORGEJO_BASE_URL, {
    token: env.FORGEJO_TOKEN,
});
