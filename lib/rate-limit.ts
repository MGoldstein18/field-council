import "server-only";
import { createHash } from "node:crypto";
import { sql, lt } from "drizzle-orm";
import { getDb } from "../db";
import { requestLimits } from "../db/schema";

export async function allowRequest(
  request: Request,
  scope: "application" | "login",
  maximum: number,
  windowMs: number,
) {
  const now = Date.now();
  // Vercel overwrites this header. Never trust arbitrary x-forwarded-for entries.
  const ip = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    : "local";
  // A missing platform header shares a conservative bucket, rather than bypassing limits.
  const key = createHash("sha256")
    .update(`${scope}:${Math.floor(now / windowMs)}:${ip || "unknown"}`)
    .digest("hex");
  const db = getDb();
  const rows = await db
    .insert(requestLimits)
    .values({ key, count: 1, createdAt: now })
    .onConflictDoUpdate({
      target: requestLimits.key,
      set: { count: sql`${requestLimits.count} + 1` },
      setWhere: sql`${requestLimits.count} < ${maximum}`,
    })
    .returning({ count: requestLimits.count });
  await db
    .delete(requestLimits)
    .where(lt(requestLimits.createdAt, now - 86400000));
  return rows.length > 0;
}
