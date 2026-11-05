import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { applications } from "../../../../db/schema";
import { statuses } from "../../../../lib/application";
import { isAdmin, sameOrigin, privateHeaders } from "../../../../lib/admin";
export const dynamic = "force-dynamic";
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!sameOrigin(request) || !(await isAdmin()))
    return Response.json(
      { error: "Owner access required." },
      { status: 403, headers: privateHeaders },
    );
  try {
    const text = await request.text();
    if (text.length > 7000)
      return Response.json(
        { error: "Notes are too long." },
        { status: 413, headers: privateHeaders },
      );
    const p = JSON.parse(text);
    const { id } = await params;
    if (
      typeof p.status !== "string" ||
      !Object.hasOwn(statuses, p.status) ||
      typeof p.notes !== "string" ||
      p.notes.length > 5000 ||
      !/^[a-f0-9-]{36}$/.test(id)
    )
      return Response.json(
        { error: "Invalid update." },
        { status: 400, headers: privateHeaders },
      );
    const updated = await getDb()
      .update(applications)
      .set({ status: p.status, notes: p.notes, updatedAt: Date.now() })
      .where(eq(applications.id, id))
      .returning({ id: applications.id });
    return Response.json(
      updated.length ? { ok: true } : { error: "Application not found." },
      { status: updated.length ? 200 : 404, headers: privateHeaders },
    );
  } catch {
    return Response.json(
      { error: "The update was not saved. Please try again." },
      { status: 503, headers: privateHeaders },
    );
  }
}
