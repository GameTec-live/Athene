import { createServerFn } from "@tanstack/react-start";
import { env } from "#/env";

export const getForgejoBaseUrl = createServerFn({ method: "GET" }).handler(
    async () => {
        return env.FORGEJO_BASE_URL;
    },
);
