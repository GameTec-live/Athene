import { createMiddleware, createServerFn } from "@tanstack/react-start";
import {
    getRequestHeaders,
    setResponseStatus,
} from "@tanstack/react-start/server";
import { auth } from "#/lib/auth";

export const getSession = createServerFn({ method: "GET" }).handler(
    async () => {
        return auth.api.getSession({ headers: getRequestHeaders() });
    },
);

export const authMiddleware = createMiddleware({ type: "function" }).server(
    async ({ next }) => {
        const session = await auth.api.getSession({
            headers: getRequestHeaders(),
        });
        if (!session) {
            setResponseStatus(401);
            throw new Error("Unauthorized");
        }
        return next({ context: { user: session.user } });
    },
);
