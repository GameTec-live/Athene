import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "#/db/index.ts";
import { assignment, assignmentMember, autograde } from "#/db/schema";

export const Route = createFileRoute("/api/autograding/config/$reposetoryId")({
    server: {
        handlers: {
            GET: async ({ params }) => {
                const reposetoryIdStr = params.reposetoryId;
                const reposetoryId = parseInt(reposetoryIdStr);
                if (isNaN(reposetoryId)) {
                    return new Response(
                        JSON.stringify({
                            error: "id format error",
                        }),
                        { headers: { "Content-Type": "application/json" } },
                    );
                }
                const config = await db
                    .select({ field1: autograde.config })
                    .from(assignmentMember)
                    .where(eq(assignmentMember.repositoryId, reposetoryId))
                    .leftJoin(
                        assignment,
                        eq(assignmentMember.assignmentId, assignment.id),
                    )
                    .leftJoin(
                        autograde,
                        eq(assignment.autogradeId, autograde.id),
                    );

                return new Response(JSON.stringify(config), {
                    headers: { "Content-Type": "application/json" },
                });
            },
        },
    },
});
