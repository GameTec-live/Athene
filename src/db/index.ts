import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "#/env.ts";
import { relations } from "./schema";

export const db = drizzle(env.DATABASE_URL, { relations });
