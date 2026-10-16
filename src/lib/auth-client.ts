import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, adminRole, teacherRole } from "./permissions";

export const authClient = createAuthClient({
    plugins: [
        adminClient({
            ac,
            roles: {
                admin: adminRole,
                teacher: teacherRole,
            },
        }),
    ],
});
