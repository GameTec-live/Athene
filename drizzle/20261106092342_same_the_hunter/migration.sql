ALTER TABLE "assignment" ADD COLUMN "classRoomId" uuid NOT NULL;--> statement-breakpoint
CREATE INDEX "assignment_classRoomId_idx" ON "assignment" ("classRoomId");--> statement-breakpoint
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_classRoomId_classRoom_id_fkey" FOREIGN KEY ("classRoomId") REFERENCES "classRoom"("id") ON DELETE CASCADE;