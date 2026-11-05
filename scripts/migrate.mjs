import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import pg from "pg";
if (!process.env.DATABASE_URL)
  throw new Error("Set DATABASE_URL before running migrations.");
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
});
try {
  await client.connect();
  await client.query("BEGIN");
  await client.query("SELECT pg_advisory_xact_lock(727411230)");
  await client.query(
    "CREATE TABLE IF NOT EXISTS field_council_migrations (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())",
  );
  for (const name of (await readdir(new URL("../migrations/", import.meta.url)))
    .filter((n) => n.endsWith(".sql"))
    .sort()) {
    const sql = await readFile(
      new URL(`../migrations/${name}`, import.meta.url),
      "utf8",
    );
    const checksum = createHash("sha256").update(sql).digest("hex");
    const { rows } = await client.query(
      "SELECT checksum FROM field_council_migrations WHERE name = $1",
      [name],
    );
    if (rows.length) {
      if (rows[0].checksum !== checksum)
        throw new Error(`Applied migration changed: ${name}`);
      continue;
    }
    await client.query(sql);
    await client.query(
      "INSERT INTO field_council_migrations (name, checksum) VALUES ($1, $2)",
      [name, checksum],
    );
    console.log(`Applied ${name}`);
  }
  await client.query("COMMIT");
  console.log("Database migrations complete.");
} catch {
  await client.query("ROLLBACK").catch(() => {});
  throw new Error(
    "Migration failed; check database connectivity and migration history. No connection credentials were logged.",
  );
} finally {
  await client.end();
}
