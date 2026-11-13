import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
    resolve: { tsconfigPaths: true },
    plugins: [
        devtools(),
        nitro({
            rollupConfig: { external: [/^@sentry\//] },
            experimental: { tasks: true },
            tasks: {
                "assignments:archive": {
                    handler: fileURLToPath(
                        new URL(
                            "./src/tasks/archive-assignments.ts",
                            import.meta.url,
                        ),
                    ),
                    description:
                        "Archive repositories of assignments past their deadline",
                },
            },
            scheduledTasks: { "* * * * *": "assignments:archive" },
        }),
        tailwindcss(),
        tanstackStart(),
        viteReact(),
    ],
});

export default config;
