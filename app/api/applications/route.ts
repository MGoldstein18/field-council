import { eq, desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { applications } from "../../../db/schema";
import { allowRequest } from "../../../lib/rate-limit";
import { applicationSchema, csvCell } from "../../../lib/application";
import { isAdmin, privateHeaders, sameOrigin } from "../../../lib/admin";
export const dynamic = "force-dynamic";
const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: privateHeaders });
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return json(
      {
        error: "Please submit your application from the Field Council website.",
      },
      403,
    );
  if (Number(request.headers.get("content-length")) > 16000)
    return json({ error: "Your application is too long." }, 413);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return json({ error: "Invalid request format." }, 415);
  try {
    const body = await request.text();
    if (body.length > 16000)
      return json({ error: "Your application is too long." }, 413);
    let input: unknown;
    try {
      input = JSON.parse(body);
    } catch {
      return json(
        { error: "Please check the application and try again." },
        400,
      );
    }
    if (input && typeof input === "object" && "fax" in input && input.fax)
      return json({ reference: crypto.randomUUID() }, 201);
    const parsed = applicationSchema.safeParse(input);
    if (!parsed.success)
      return json(
        {
          error:
            parsed.error.issues[0]?.message || "Please check your application.",
          fields: parsed.error.flatten().fieldErrors,
        },
        400,
      );
    const p = parsed.data;
    const db = getDb();
    // Retries with the same client-generated key acknowledge the existing record without modifying it.
    const [existing] = await db
      .select({ id: applications.id })
      .from(applications)
      .where(eq(applications.submissionKey, p.submissionKey))
      .limit(1);
    if (existing) return json({ reference: existing.id }, 200);
    const now = Date.now();
    if (!(await allowRequest(request, "application", 6, 3600000)))
      return json(
        {
          error:
            "Too many applications from this connection. Please try again in an hour.",
        },
        429,
      );
    const id = crypto.randomUUID();
    const {
      submissionKey,
      fullName,
      email,
      phone,
      role,
      company,
      website,
      city,
      state,
      serviceArea,
      revenue,
      team,
      challenge,
      sharing,
      source,
    } = p;
    const inserted = await db
      .insert(applications)
      .values({
        id,
        submissionKey,
        createdAt: now,
        updatedAt: now,
        fullName,
        email,
        phone,
        role,
        company,
        website,
        city,
        state,
        serviceArea,
        revenue,
        team,
        services: JSON.stringify(p.services),
        challenge,
        sharing,
        source,
        consentVersion: "2026-11-05-v1",
      })
      .onConflictDoNothing({ target: applications.submissionKey })
      .returning({ id: applications.id });
    if (!inserted.length) {
      const [old] = await db
        .select({ id: applications.id })
        .from(applications)
        .where(eq(applications.submissionKey, p.submissionKey))
        .limit(1);
      if (!old) throw new Error("Save unavailable");
      return json({ reference: old.id }, 200);
    }
    return json({ reference: id }, 201);
  } catch {
    console.error("Application submission failed");
    return json(
      {
        error:
          "We could not save your application. Your details are still on this page. Please try again.",
      },
      503,
    );
  }
}
export async function GET(request: Request) {
  if (!(await isAdmin())) return json({ error: "Owner access required." }, 403);
  try {
    const rows = await getDb()
      .select()
      .from(applications)
      .orderBy(desc(applications.createdAt))
      .limit(5000);
    if (new URL(request.url).searchParams.get("format") === "csv") {
      const keys = [
        "id",
        "createdAt",
        "fullName",
        "email",
        "phone",
        "role",
        "company",
        "website",
        "city",
        "state",
        "serviceArea",
        "revenue",
        "team",
        "services",
        "challenge",
        "sharing",
        "status",
        "notes",
        "source",
      ] as const;
      const csv = [
        keys.map(csvCell).join(","),
        ...rows.map((row) =>
          keys
            .map((k) =>
              csvCell(
                k === "createdAt"
                  ? new Date(row.createdAt).toISOString()
                  : row[k],
              ),
            )
            .join(","),
        ),
      ].join("\r\n");
      return new Response("\uFEFF" + csv, {
        headers: {
          ...privateHeaders,
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition":
            'attachment; filename="field-council-applications.csv"',
        },
      });
    }
    return json({ applications: rows });
  } catch {
    return json(
      { error: "Applications could not be loaded. Please try again." },
      503,
    );
  }
}
