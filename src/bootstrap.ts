import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import "./db/migrate";

// Import the server only after migrations finish; Nitro starts listening on import.
await import(pathToFileURL(resolve(".output/server/index.mjs")).href);
