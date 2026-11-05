import { applicationSchema } from "../../../lib/application";
import { sameOrigin, privateHeaders } from "../../../lib/http";
import { allowRequest } from "../../../lib/rate-limit";
import { sendApplicationEmail } from "../../../lib/email";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
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
    if (!allowRequest(request))
      return json(
        {
          error:
            "Too many attempts from this connection. Please try again in an hour.",
        },
        429,
      );
    const reference = await sendApplicationEmail(parsed.data);
    return json({ reference }, 201);
  } catch {
    console.error("Application email could not be confirmed");
    return json(
      {
        error:
          "We could not confirm your application was sent. Your details are still on this page. Please try again.",
      },
      503,
    );
  }
}
