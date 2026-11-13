import { defineTask } from "nitro/task";
import { archiveDueAssignments } from "#/lib/assignments/archive.server";

export default defineTask({
    meta: {
        name: "assignments:archive",
        description: "Archive repositories of assignments past their deadline",
    },
    async run() {
        const result = await archiveDueAssignments();
        if (!result.skipped && result.results.length > 0) {
            console.info("Archived assignments", result.results);
        }
        return { result };
    },
});
