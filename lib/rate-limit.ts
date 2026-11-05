import "server-only";
import { createHash } from "node:crypto";
// Best-effort, per-instance protection; no external store or database.
const buckets = new Map<string, { count: number; expires: number }>();
export function allowRequest(request: Request) {
  const now = Date.now();
  for (const [key, bucket] of buckets)
    if (bucket.expires <= now) buckets.delete(key);
  const ip = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    : "local";
  const key = createHash("sha256")
    .update(ip || "unknown")
    .digest("hex");
  let bucket = buckets.get(key);
  if (!bucket) {
    if (buckets.size >= 10000) return false;
    bucket = { count: 0, expires: now + 3600000 };
    buckets.set(key, bucket);
  }
  if (bucket.count >= 6) return false;
  bucket.count++;
  return true;
}
