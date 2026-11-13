CREATE TABLE "assignmentGroup" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"assignmentId" uuid NOT NULL,
	"name" text NOT NULL,
	"customName" text,
	"repositoryId" integer,
	"repositoryName" text,
	"forgejoTeamId" integer,
	"provisioningError" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "assignmentGroup_assignmentId_name_unique" UNIQUE("assignmentId","name")
);
--> statement-breakpoint
ALTER TABLE "assignment" ADD COLUMN "archivedAt" timestamp;--> statement-breakpoint
ALTER TABLE "assignment" ADD COLUMN "maxGroups" integer;--> statement-breakpoint
ALTER TABLE "assignment" ADD COLUMN "maxGroupMembers" integer;--> statement-breakpoint
ALTER TABLE "assignmentMember" ADD COLUMN "groupId" uuid;--> statement-breakpoint
ALTER TABLE "assignmentMember" ADD COLUMN "repositoryName" text;--> statement-breakpoint
ALTER TABLE "assignmentMember" ADD COLUMN "customName" text;--> statement-breakpoint
ALTER TABLE "assignmentMember" ADD COLUMN "provisioningError" text;--> statement-breakpoint
CREATE INDEX "assignmentGroup_assignmentId_idx" ON "assignmentGroup" ("assignmentId");--> statement-breakpoint
CREATE INDEX "assignmentMember_groupId_idx" ON "assignmentMember" ("groupId");--> statement-breakpoint
ALTER TABLE "assignmentGroup" ADD CONSTRAINT "assignmentGroup_assignmentId_assignment_id_fkey" FOREIGN KEY ("assignmentId") REFERENCES "assignment"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "assignmentMember" ADD CONSTRAINT "assignmentMember_groupId_assignmentGroup_id_fkey" FOREIGN KEY ("groupId") REFERENCES "assignmentGroup"("id") ON DELETE CASCADE;