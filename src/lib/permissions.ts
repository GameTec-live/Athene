import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

const statement = {
    ...defaultStatements,
    siteAccess: ["dashboard", "admin"],
} as const;

export const ac = createAccessControl(statement);

export const adminRole = ac.newRole({
    ...adminAc.statements,
    siteAccess: ["dashboard", "admin"],
});

export const teacherRole = ac.newRole({
    siteAccess: ["dashboard"],
});

export const roles = {
    admin: adminRole,
    teacher: teacherRole,
};
