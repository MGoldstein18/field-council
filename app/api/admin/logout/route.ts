import { NextResponse } from "next/server";
import {
  cookieOptions,
  privateHeaders,
  sameOrigin,
  sessionCookie,
} from "../../../../lib/admin";
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return new Response("Forbidden", { status: 403, headers: privateHeaders });
  const response = NextResponse.redirect(
    new URL("/admin/login", request.headers.get("origin")!),
    {
      status: 303,
      headers: privateHeaders,
    },
  );
  response.cookies.set(sessionCookie, "", { ...cookieOptions, maxAge: 0 });
  return response;
}
