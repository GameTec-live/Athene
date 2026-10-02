import { defineRelationsPart } from "drizzle-orm";
import {
    boolean,
    index,
    integer,
    json,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
    role: text("role"),
    banned: boolean("banned").default(false),
    banReason: text("ban_reason"),
    banExpires: timestamp("ban_expires"),
});

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        impersonatedBy: text("impersonated_by"),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const classRoom = pgTable(
    "classRoom",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        organizationId: integer("organizationId").notNull(),
        name: text("name").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [index("classRoom_organizationId_idx").on(table.organizationId)],
);

export const classRoomMember = pgTable(
    "classRoomMember",
    {
        userId: text("userId")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        classRoomId: uuid("classRoomId")
            .notNull()
            .references(() => classRoom.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.userId, table.classRoomId] }),
        index("classRoomMember_userId_idx").on(table.userId),
        index("classRoomMember_classRoomId_idx").on(table.classRoomId),
    ],
);

export const roster = pgTable("roster", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const rosterMember = pgTable(
    "rosterMember",
    {
        userId: text("userId")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        rosterId: uuid("rosterId")
            .notNull()
            .references(() => roster.id, { onDelete: "cascade" }),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.userId, table.rosterId] }),
        index("rosterMember_userId_idx").on(table.userId),
        index("rosterMember_rosterId_idx").on(table.rosterId),
    ],
);

export const autograde = pgTable("autograde", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    config: json("config").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const assignmentTypeEnum = pgEnum("assignment_type_enum", [
    "individual",
    "group",
]);

export const assignment = pgTable(
    "assignment",
    {
        id: uuid("id").primaryKey().defaultRandom(),
        creatorId: text("creatorId")
            .notNull()
            .references(() => user.id, { onDelete: "set null" }),
        name: text("name").notNull(),
        type: assignmentTypeEnum("type").notNull(),
        deadline: timestamp("deadline"),
        archiveOnDeadline: boolean("archiveOnDeadline").default(true).notNull(),
        autogradeId: uuid("autogradeId").references(() => autograde.id, {
            onDelete: "set null",
        }),
        namingTemplate: text("namingTemplate"),
        studentIsAdmin: boolean("studentIsAdmin").default(false).notNull(),
        templateRepository: text("templateRepository"),
        afHasIssues: boolean("afHasIssues").default(true).notNull(),
        afHasPackages: boolean("afHasPackages").default(true).notNull(),
        afHasProjects: boolean("afHasProjects").default(true).notNull(),
        afHasPullRequests: boolean("afHasPullRequests").default(true).notNull(),
        afHasReleases: boolean("afHasReleases").default(true).notNull(),
        afHasWiki: boolean("afHasWiki").default(true).notNull(),
        rosterRestriction: uuid("rosterRestriction").references(
            () => roster.id,
            {
                onDelete: "set null",
            },
        ),
        joinCode: text("joinCode").unique(),
        groupNamingTemplate: text("groupNamingTemplate"),
        allowCreatingGroups: boolean("allowCreatingGroups")
            .default(true)
            .notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        index("deadline_idx").on(table.deadline),
        index("joinCode_idx").on(table.joinCode),
    ],
);

export const assignmentMember = pgTable(
    "assignmentMember",
    {
        userId: text("userId")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        assignmentId: uuid("assignmentId")
            .notNull()
            .references(() => assignment.id, { onDelete: "cascade" }),
        autoGradeResult: integer("autoGradeResult"),
        autoGradeResultDetails: json("autoGradeResultDetails"),
        repositoryId: integer("repositoryId"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.userId, table.assignmentId] }),
        index("assignmentMember_userId_idx").on(table.userId),
        index("assignmentMember_assignmentId_idx").on(table.assignmentId),
    ],
);

export const relations = defineRelationsPart(
    {
        user,
        session,
        account,
        verification,
        classRoom,
        classRoomMember,
        roster,
        rosterMember,
        autograde,
        assignment,
        assignmentMember,
    },
    (r) => ({
        user: {
            sessions: r.many.session({
                from: r.user.id,
                to: r.session.userId,
            }),
            accounts: r.many.account({
                from: r.user.id,
                to: r.account.userId,
            }),
        },
        session: {
            user: r.one.user({
                from: r.session.userId,
                to: r.user.id,
            }),
        },
        account: {
            user: r.one.user({
                from: r.account.userId,
                to: r.user.id,
            }),
        },
        classRoom: {
            members: r.many.classRoomMember({
                from: r.classRoom.id,
                to: r.classRoomMember.classRoomId,
            }),
        },
        classRoomMember: {
            user: r.one.user({
                from: r.classRoomMember.userId,
                to: r.user.id,
            }),
            classRoom: r.one.classRoom({
                from: r.classRoomMember.classRoomId,
                to: r.classRoom.id,
            }),
        },
        roster: {
            members: r.many.rosterMember({
                from: r.roster.id,
                to: r.rosterMember.rosterId,
            }),
        },
        rosterMember: {
            user: r.one.user({
                from: r.rosterMember.userId,
                to: r.user.id,
            }),
            roster: r.one.roster({
                from: r.rosterMember.rosterId,
                to: r.roster.id,
            }),
        },
        assignment: {
            members: r.many.assignmentMember({
                from: r.assignment.id,
                to: r.assignmentMember.assignmentId,
            }),
        },
        assignmentMember: {
            user: r.one.user({
                from: r.assignmentMember.userId,
                to: r.user.id,
            }),
            assignment: r.one.assignment({
                from: r.assignmentMember.assignmentId,
                to: r.assignment.id,
            }),
        },
    }),
);
