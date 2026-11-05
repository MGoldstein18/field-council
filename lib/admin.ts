import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { createHash } from "node:crypto";
import { verifyPassword } from "./password.mjs";

export const sessionCookie = "field_council_admin";
export const privateHeaders = {
  "Cache-Control": "private, no-store",
  Vary: "Cookie",
};
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  // NextRequest normalizes loopback hosts; Host preserves the address used by the browser.
  const url = new URL(request.url);
  const host = request.headers.get("host") || url.host;
  return !!origin && origin === `${url.protocol}//${host}`;
}
export function authConfigured() {
  return (
    !!process.env.ADMIN_PASSWORD_HASH &&
    (process.env.SESSION_SECRET?.length ?? 0) >= 32
  );
}
function credentialsVersion() {
  return createHash("sha256")
    .update(process.env.ADMIN_PASSWORD_HASH || "")
    .digest("hex");
}
export async function checkPassword(password: string) {
  return (
    authConfigured() &&
    verifyPassword(password, process.env.ADMIN_PASSWORD_HASH!)
  );
}
export async function createSession() {
  if (!authConfigured()) throw new Error("Admin access is not configured");
  return new SignJWT({ role: "admin", version: credentialsVersion() })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("field-council-owner")
    .setIssuer("field-council")
    .setAudience("field-council-admin")
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(new TextEncoder().encode(process.env.SESSION_SECRET!));
}
export async function isAdmin() {
  if (!authConfigured()) return false;
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.SESSION_SECRET!),
      {
        algorithms: ["HS256"],
        issuer: "field-council",
        audience: "field-council-admin",
        subject: "field-council-owner",
      },
    );
    return payload.role === "admin" && payload.version === credentialsVersion();
  } catch {
    return false;
  }
}
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};
