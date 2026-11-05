// Local contract test with a test-process Resend interceptor; sends no real email.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
const folder = await mkdtemp(join(tmpdir(), "field-council-email-"));
const log = join(folder, "mail.jsonl");
const origin = "http://127.0.0.1:3419";
const env = {
  ...process.env,
  NODE_ENV: "production",
  VERCEL: "1",
  RESEND_API_KEY: "test-only-key",
  APPLICATIONS_EMAIL_FROM: "Field Council <applications@example.test>",
  APPLICATIONS_EMAIL_TO: "organiser@example.test",
  FIELD_COUNCIL_TEST_MAIL_LOG: log,
};
let server;
async function start(overrides = {}) {
  server = spawn(
    process.execPath,
    [
      "--import",
      "./tests/resend-preload.mjs",
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3419",
    ],
    { env: { ...env, ...overrides }, stdio: ["ignore", "pipe", "pipe"] },
  );
  let logs = "";
  server.stdout.on("data", (c) => (logs += c));
  server.stderr.on("data", (c) => (logs += c));
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(origin)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("Test server failed to start: " + logs);
}
async function stop() {
  if (server && server.exitCode === null) {
    server.kill("SIGTERM");
    await once(server, "exit");
  }
}
const request = (path, { ip = "192.0.2.10", headers, ...options } = {}) =>
  fetch(origin + path, {
    redirect: "manual",
    ...options,
    headers: { Origin: origin, "x-vercel-forwarded-for": ip, ...headers },
  });
const post = (data, options = {}) =>
  request("/api/applications", {
    method: "POST",
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    body: JSON.stringify(data),
  });
const input = () => ({
  submissionKey: crypto.randomUUID(),
  fullName: "Test Owner",
  email: "OWNER@example.test",
  phone: "",
  role: "Owner / founder",
  company: "Integration Surveying",
  website: "",
  city: "Austin",
  state: "TX",
  serviceArea: "Central Texas",
  revenue: "$1m–$3m",
  team: "10–19",
  services: ["Boundary / residential"],
  challenge: "How can we improve project profitability?",
  sharing: "Yes, under confidentiality",
  consent: true,
  source: "test-only",
  fax: "",
});
const messages = async () => {
  const text = await readFile(log, "utf8").catch(() => "");
  return text.trim()
    ? text
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line))
    : [];
};
try {
  await start();
  for (const path of ["/", "/apply", "/privacy"])
    assert.equal((await request(path)).status, 200, path);
  for (const path of [
    "/admin",
    "/admin/login",
    "/api/admin/login",
    "/api/applications/example",
  ])
    assert.equal((await request(path)).status, 404, path);
  for (const path of ["/api/applications", "/api/applications?format=csv"])
    assert.equal((await request(path)).status, 405, path);
  assert.equal(
    (await post(input(), { headers: { Origin: "https://other.example" } }))
      .status,
    403,
  );
  assert.equal((await post({ ...input(), consent: false })).status, 400);
  assert.equal(
    (await post({ ...input(), challenge: "x".repeat(17000) })).status,
    413,
  );
  assert.equal((await post({ ...input(), fax: "bot" })).status, 201);
  assert.equal((await messages()).length, 0);
  const p = input();
  const saved = await post(p);
  assert.equal(saved.status, 201);
  assert.equal((await saved.json()).reference, p.submissionKey);
  const retry = await post(p);
  assert.equal(retry.status, 201);
  assert.equal((await retry.json()).reference, p.submissionKey);
  let sent = await messages();
  assert.equal(sent.length, 1);
  assert.deepEqual(sent[0].to, ["organiser@example.test"]);
  assert.equal(sent[0].reply_to, "owner@example.test");
  assert.ok(sent[0].text.includes(p.challenge));
  assert.ok(sent[0].text.includes(p.submissionKey));
  for (const company of ["Provider failure", "Malformed success"]) {
    const r = await post({ ...input(), company });
    assert.equal(r.status, 503);
    assert.equal((await r.json()).reference, undefined);
  }
  assert.equal((await messages()).length, 1);
  for (let i = 0; i < 6; i++)
    assert.equal((await post(input(), { ip: "192.0.2.20" })).status, 201);
  assert.equal((await post(input(), { ip: "192.0.2.20" })).status, 429);
  await stop();
  await start({ RESEND_API_KEY: "" });
  const unconfigured = await post(input());
  assert.equal(unconfigured.status, 503);
  assert.equal((await unconfigured.json()).reference, undefined);
  console.log(
    "Passed: production pages, removed admin/data routes, validation/consent, origin checks, honeypot, email payload, reply-to, provider-accepted success, retry deduplication, provider failure, malformed acceptance, rate limits and missing configuration. No real emails sent.",
  );
} finally {
  await stop();
  await rm(folder, { recursive: true, force: true });
}
