import "server-only";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

// Lazy initialization lets the marketing site build before secrets are configured.
let db: ReturnType<typeof createDb> | undefined;
function createDb() {
  if (!process.env.DATABASE_URL)
    throw new Error("DATABASE_URL is not configured");
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  });
  pool.on("error", () => console.error("Database connection unavailable"));
  return drizzle(pool, { schema });
}
export function getDb() {
  return (db ??= createDb());
}
