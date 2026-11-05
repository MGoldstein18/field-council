// Test-process preload only. Production always calls the real Resend endpoint.
import { appendFile } from "node:fs/promises";
const originalFetch = globalThis.fetch;
const accepted = new Map();
globalThis.fetch = async (input, options) => {
  const url =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input.url;
  if (url !== "https://api.resend.com/emails")
    return originalFetch(input, options);
  const body = JSON.parse(options.body);
  if (body.subject.includes("Provider failure"))
    return Response.json({ error: "test failure" }, { status: 503 });
  if (body.subject.includes("Malformed success")) return Response.json({});
  const key = options.headers["Idempotency-Key"];
  if (!accepted.has(key)) {
    accepted.set(key, crypto.randomUUID());
    await appendFile(
      process.env.FIELD_COUNCIL_TEST_MAIL_LOG,
      JSON.stringify(body) + "\n",
    );
  }
  return Response.json({ id: accepted.get(key) });
};
