import { NextResponse } from "next/server";
import { allowRequest } from "../../../../lib/rate-limit";
import {
  authConfigured,
  checkPassword,
  cookieOptions,
  createSession,
  privateHeaders,
  sameOrigin,
  sessionCookie,
} from "../../../../lib/admin";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return new Response("Forbidden", { status: 403, headers: privateHeaders });
  if (Number(request.headers.get("content-length")) > 2048)
    return new Response("Request too large", {
      status: 413,
      headers: privateHeaders,
    });
  const fail = (error: string) =>
    NextResponse.redirect(
      new URL(`/admin/login?error=${error}`, request.headers.get("origin")!),
      {
        status: 303,
        headers: privateHeaders,
      },
    );
  if (!authConfigured()) return fail("unavailable");
  if (
    !request.headers
      .get("content-type")
      ?.includes("application/x-www-form-urlencoded")
  )
    return new Response("Invalid request format", {
      status: 415,
      headers: privateHeaders,
    });
  try {
    const body = await request.text();
    if (body.length > 2048)
      return new Response("Request too large", {
        status: 413,
        headers: privateHeaders,
      });
    if (!(await allowRequest(request, "login", 10, 900000)))
      return fail("limited");
    const password = new URLSearchParams(body).get("password");
    if (!password || !(await checkPassword(password))) return fail("invalid");
    const response = NextResponse.redirect(
      new URL("/admin", request.headers.get("origin")!),
      {
        status: 303,
        headers: privateHeaders,
      },
    );
    response.cookies.set(sessionCookie, await createSession(), {
      ...cookieOptions,
      maxAge: 8 * 3600,
    });
    return response;
  } catch {
    console.error("Admin sign-in unavailable");
    return fail("unavailable");
  }
}
