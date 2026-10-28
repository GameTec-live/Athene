import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./index";

try {
    console.info("Applying database migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.info("Database migrations complete.");
} finally {
    await db.$client.end();
}
