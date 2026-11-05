import test from "node:test";
import assert from "node:assert/strict";
import { applicationEmail, sendApplicationEmail } from "../lib/email.ts";
const input = {
  submissionKey: crypto.randomUUID(),
  fullName: "Test Owner",
  email: "owner@example.test",
  phone: "12345",
  role: "Owner / founder",
  company: "Surveying\r\nTest",
  website: "https://example.test",
  city: "Austin",
  state: "TX",
  serviceArea: "Central Texas",
  revenue: "$1m–$3m",
  team: "10–19",
  services: ["Boundary / residential"],
  challenge: "How can we improve project profitability?",
  sharing: "Yes, under confidentiality",
  consent: true,
  source: "campaign=test",
  fax: "",
};
const keys = [
  "RESEND_API_KEY",
  "APPLICATIONS_EMAIL_FROM",
  "APPLICATIONS_EMAIL_TO",
];
function configure(t) {
  const prior = keys.map((key) => process.env[key]);
  keys.forEach(
    (key, i) =>
      (process.env[key] = [
        "test-only-key",
        "Field Council <applications@example.test>",
        "organiser@example.test",
      ][i]),
  );
  t.after(() =>
    keys.forEach((key, i) => {
      if (prior[i] === undefined) delete process.env[key];
      else process.env[key] = prior[i];
    }),
  );
}
test("email contains all application details, fixed recipient and applicant reply address", () => {
  const message = applicationEmail(
    input,
    "Field Council <applications@example.test>",
    "organiser@example.test",
  );
  assert.deepEqual(message.to, ["organiser@example.test"]);
  assert.equal(message.reply_to, input.email);
  assert.doesNotMatch(message.subject, /[\r\n]/);
  for (const key of [
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
    "challenge",
    "sharing",
    "source",
    "submissionKey",
  ])
    assert.ok(message.text.includes(input[key]), key);
  assert.ok(message.text.includes("2026-11-05-email-v1"));
  assert.ok(message.text.includes(input.services[0]));
  assert.equal(message.html, undefined);
});
test("provider must accept the email; unchanged retries reuse key and edited details use a new key", async (t) => {
  configure(t);
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url, options });
    return Response.json({ id: crypto.randomUUID() });
  });
  assert.equal(await sendApplicationEmail(input), input.submissionKey);
  await sendApplicationEmail(input);
  await sendApplicationEmail({
    ...input,
    challenge: "Updated business question for the same application.",
  });
  assert.equal(calls[0].url, "https://api.resend.com/emails");
  assert.equal(calls[0].options.headers.Authorization, "Bearer test-only-key");
  assert.equal(
    calls[0].options.headers["Idempotency-Key"],
    calls[1].options.headers["Idempotency-Key"],
  );
  assert.notEqual(
    calls[1].options.headers["Idempotency-Key"],
    calls[2].options.headers["Idempotency-Key"],
  );
  assert.deepEqual(JSON.parse(calls[0].options.body).to, [
    "organiser@example.test",
  ]);
});
test("provider failures, malformed success and timeouts never acknowledge submission", async (t) => {
  configure(t);
  for (const response of [
    new Response("unavailable", { status: 503 }),
    Response.json({}),
    new Response("not json", { status: 200 }),
  ]) {
    const mock = t.mock.method(globalThis, "fetch", async () => response);
    await assert.rejects(() => sendApplicationEmail(input));
    mock.mock.restore();
  }
  t.mock.method(globalThis, "fetch", async () => {
    throw new Error("timeout");
  });
  await assert.rejects(() => sendApplicationEmail(input));
});
test("missing email configuration fails before any network request", async (t) => {
  configure(t);
  delete process.env.RESEND_API_KEY;
  const mock = t.mock.method(globalThis, "fetch", async () => {
    throw new Error("Must not be called");
  });
  await assert.rejects(() => sendApplicationEmail(input));
  assert.equal(mock.mock.callCount(), 0);
});
