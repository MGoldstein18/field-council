import "server-only";
import { z } from "zod";
import { createHash } from "node:crypto";
import type { ApplicationInput } from "./application";

const configSchema = z.object({
  apiKey: z.string().trim().min(1),
  from: z
    .string()
    .trim()
    .min(1)
    .max(320)
    .refine((v) => !/[\r\n]/.test(v)),
  to: z.email(),
});
export function applicationEmail(
  p: ApplicationInput,
  from: string,
  to: string,
) {
  // Deterministic payload: the same submission key and details can be retried safely.
  const lines = [
    ["Application reference", p.submissionKey],
    ["Name", p.fullName],
    ["Email", p.email],
    ["Phone", p.phone || "Not provided"],
    ["Role", p.role],
    ["Company", p.company],
    ["Website", p.website || "Not provided"],
    ["City", p.city],
    ["State", p.state],
    ["Service area", p.serviceArea],
    ["Annual revenue", p.revenue],
    ["Team size", p.team],
    ["Services", p.services.join(", ")],
    ["Main business question", p.challenge],
    ["Willingness to share financial summaries", p.sharing],
    ["Consent", "Agreed to email processing and application-related contact"],
    ["Consent version", "2026-11-05-email-v1"],
    ["Campaign reference", p.source || "Direct"],
  ];
  return {
    from,
    to: [to],
    reply_to: p.email,
    subject: `Field Council application: ${p.company.replace(/[\r\n\t]+/g, " ")}`,
    text: [
      "NEW FIELD COUNCIL APPLICATION",
      "Reply to this email to contact the applicant.",
      "",
      ...lines.map(([label, value]) => `${label}: ${value}`),
    ].join("\n\n"),
  };
}
export async function sendApplicationEmail(p: ApplicationInput) {
  const config = configSchema.parse({
    apiKey: process.env.RESEND_API_KEY,
    from: process.env.APPLICATIONS_EMAIL_FROM,
    to: process.env.APPLICATIONS_EMAIL_TO,
  });
  const body = JSON.stringify(applicationEmail(p, config.from, config.to));
  const fingerprint = createHash("sha256").update(body).digest("hex");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `field-council-application/${p.submissionKey}/${fingerprint}`,
    },
    body,
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  // Never log the provider response: it may contain applicant details or credentials.
  if (!response.ok)
    throw new Error("Email service did not accept the application");
  const result: unknown = await response.json();
  if (
    !result ||
    typeof result !== "object" ||
    !("id" in result) ||
    typeof result.id !== "string" ||
    !result.id
  )
    throw new Error("Email acceptance was not confirmed");
  return p.submissionKey;
}
