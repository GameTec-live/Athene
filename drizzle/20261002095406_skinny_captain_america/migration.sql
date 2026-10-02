CREATE TYPE "assignment_type_enum" AS ENUM('individual', 'group');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assignment" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"creatorId" text NOT NULL,
	"name" text NOT NULL,
	"type" "assignment_type_enum" NOT NULL,
	"deadline" timestamp,
	"archiveOnDeadline" boolean DEFAULT true NOT NULL,
	"autogradeId" uuid,
	"namingTemplate" text,
	"studentIsAdmin" boolean DEFAULT false NOT NULL,
	"templateRepository" text,
	"afHasIssues" boolean DEFAULT true NOT NULL,
	"afHasPackages" boolean DEFAULT true NOT NULL,
	"afHasProjects" boolean DEFAULT true NOT NULL,
	"afHasPullRequests" boolean DEFAULT true NOT NULL,
	"afHasReleases" boolean DEFAULT true NOT NULL,
	"afHasWiki" boolean DEFAULT true NOT NULL,
	"rosterRestriction" uuid,
	"joinCode" text UNIQUE,
	"groupNamingTemplate" text,
	"allowCreatingGroups" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assignmentMember" (
	"userId" text,
	"assignmentId" uuid,
	"autoGradeResult" integer,
	"autoGradeResultDetails" json,
	"repositoryId" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "assignmentMember_pkey" PRIMARY KEY("userId","assignmentId")
);
--> statement-breakpoint
CREATE TABLE "autograde" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"config" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classRoom" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"organizationId" integer NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "classRoomMember" (
	"userId" text,
	"classRoomId" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "classRoomMember_pkey" PRIMARY KEY("userId","classRoomId")
);
--> statement-breakpoint
CREATE TABLE "roster" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rosterMember" (
	"userId" text,
	"rosterId" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rosterMember_pkey" PRIMARY KEY("userId","rosterId")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role" text,
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX "deadline_idx" ON "assignment" ("deadline");--> statement-breakpoint
CREATE INDEX "joinCode_idx" ON "assignment" ("joinCode");--> statement-breakpoint
CREATE INDEX "assignmentMember_userId_idx" ON "assignmentMember" ("userId");--> statement-breakpoint
CREATE INDEX "assignmentMember_assignmentId_idx" ON "assignmentMember" ("assignmentId");--> statement-breakpoint
CREATE INDEX "classRoom_organizationId_idx" ON "classRoom" ("organizationId");--> statement-breakpoint
CREATE INDEX "classRoomMember_userId_idx" ON "classRoomMember" ("userId");--> statement-breakpoint
CREATE INDEX "classRoomMember_classRoomId_idx" ON "classRoomMember" ("classRoomId");--> statement-breakpoint
CREATE INDEX "rosterMember_userId_idx" ON "rosterMember" ("userId");--> statement-breakpoint
CREATE INDEX "rosterMember_rosterId_idx" ON "rosterMember" ("rosterId");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_creatorId_user_id_fkey" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_autogradeId_autograde_id_fkey" FOREIGN KEY ("autogradeId") REFERENCES "autograde"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_rosterRestriction_roster_id_fkey" FOREIGN KEY ("rosterRestriction") REFERENCES "roster"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "assignmentMember" ADD CONSTRAINT "assignmentMember_userId_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "assignmentMember" ADD CONSTRAINT "assignmentMember_assignmentId_assignment_id_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classRoomMember" ADD CONSTRAINT "classRoomMember_userId_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "classRoomMember" ADD CONSTRAINT "classRoomMember_classRoomId_classRoom_id_fkey" FOREIGN KEY ("classRoomId") REFERENCES "classRoom"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "rosterMember" ADD CONSTRAINT "rosterMember_userId_user_id_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "rosterMember" ADD CONSTRAINT "rosterMember_rosterId_roster_id_fkey" FOREIGN KEY ("rosterId") REFERENCES "roster"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;