// Uses isolated embedded PostgreSQL over its wire protocol, never production data.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { randomBytes, createHash } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { SignJWT } from "jose";
import { hashPassword } from "../lib/password.mjs";
const db = await PGlite.create();
const socket = new PGLiteSocketServer({ db, host: "127.0.0.1", port: 55439 });
const origin = "http://127.0.0.1:3419";
const password = randomBytes(24).toString("hex");
const passwordHash = await hashPassword(password);
const sessionSecret = randomBytes(48).toString("hex");
const env = {
  ...process.env,
  NODE_ENV: "production",
  DATABASE_URL:
    "postgresql://postgres:postgres@127.0.0.1:55439/postgres?sslmode=disable",
  ADMIN_PASSWORD_HASH: passwordHash,
  SESSION_SECRET: sessionSecret,
  VERCEL: "1",
};
let server;
const run = async (file) => {
  const child = spawn(process.execPath, [file], {
    env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let log = "";
  child.stdout.on("data", (chunk) => (log += chunk));
  child.stderr.on("data", (chunk) => (log += chunk));
  const [code] = await once(child, "exit");
  assert.equal(code, 0, log);
};
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
const login = (value, options = {}) =>
  request("/api/admin/login", {
    method: "POST",
    ...options,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...options.headers,
    },
    body: new URLSearchParams({ password: value }),
  });
const input = () => ({
  submissionKey: crypto.randomUUID(),
  fullName: "=Test Owner",
  email: "TEST@example.com",
  phone: "",
  role: "Owner / founder",
  company: "Integration Test Surveying",
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
  source: "automated-local-test",
  fax: "",
});
try {
  await socket.start();
  await run("scripts/migrate.mjs");
  await run("scripts/migrate.mjs");
  server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3419",
    ],
    { env, stdio: ["ignore", "pipe", "pipe"] },
  );
  let logs = "";
  server.stdout.on("data", (c) => (logs += c));
  server.stderr.on("data", (c) => (logs += c));
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(origin)).ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  assert.ok(ready, logs);
  for (const path of ["/", "/apply", "/privacy", "/admin/login"])
    assert.equal((await request(path)).status, 200, path);
  const privatePage = await request("/admin");
  assert.equal(privatePage.status, 307);
  assert.ok(privatePage.headers.get("location").endsWith("/admin/login"));
  for (const path of ["/api/applications", "/api/applications?format=csv"]) {
    assert.equal((await request(path)).status, 403);
    assert.equal(
      (
        await request(path, {
          headers: {
            "oai-authenticated-user-email": "owner@example.com",
            "oai-authenticated-user-id": "fake",
          },
        })
      ).status,
      403,
    );
  }
  assert.equal(
    (await login(password, { headers: { Origin: "https://other.example" } }))
      .status,
    403,
  );
  const wrong = await login("incorrect");
  assert.equal(wrong.status, 303, await wrong.text());
  assert.ok(wrong.headers.get("location")?.endsWith("error=invalid"));
  assert.equal(wrong.headers.get("set-cookie"), null);
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
  const honeypot = await post({ ...input(), fax: "bot" });
  assert.equal(honeypot.status, 201);
  assert.equal(
    (await db.query("SELECT count(*)::int AS count FROM applications")).rows[0]
      .count,
    0,
  );
  const application = input();
  const saved = await post(application);
  assert.equal(saved.status, 201);
  const { reference } = await saved.json();
  const retry = await post({ ...application, company: "Must not overwrite" });
  assert.equal(retry.status, 200);
  assert.equal((await retry.json()).reference, reference);
  assert.equal(
    (await db.query("SELECT count(*)::int AS count FROM applications")).rows[0]
      .count,
    1,
  );
  const signedIn = await login(password);
  assert.equal(signedIn.status, 303);
  const setCookie = signedIn.headers.get("set-cookie");
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /Secure/i);
  assert.match(setCookie, /SameSite=strict/i);
  assert.match(setCookie, /Max-Age=28800/i);
  const cookie = setCookie.split(";")[0];
  const adminPage = await request("/admin", { headers: { Cookie: cookie } });
  assert.equal(adminPage.status, 200);
  assert.ok((await adminPage.text()).includes("The founding-member desk."));
  const rows = await (
    await request("/api/applications", { headers: { Cookie: cookie } })
  ).json();
  assert.equal(rows.applications[0].email, "test@example.com");
  assert.equal(rows.applications[0].company, application.company);
  const patch = (headers, body) =>
    request(`/api/applications/${reference}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    });
  assert.equal(
    (await patch({}, { status: "reviewing", notes: "private" })).status,
    403,
  );
  assert.equal(
    (
      await patch(
        { Cookie: cookie, Origin: "https://other.example" },
        { status: "reviewing", notes: "private" },
      )
    ).status,
    403,
  );
  assert.equal(
    (await patch({ Cookie: cookie }, { status: "__proto__", notes: "" }))
      .status,
    400,
  );
  assert.equal(
    (
      await patch(
        { Cookie: cookie },
        { status: "reviewing", notes: "Reviewed test application" },
      )
    ).status,
    200,
  );
  const updated = (
    await db.query("SELECT status,notes FROM applications WHERE id=$1", [
      reference,
    ])
  ).rows[0];
  assert.equal(updated.status, "reviewing");
  assert.equal(updated.notes, "Reviewed test application");
  const csv = await request("/api/applications?format=csv", {
    headers: { Cookie: cookie },
  });
  assert.equal(csv.status, 200);
  assert.match(csv.headers.get("cache-control"), /no-store/);
  assert.ok((await csv.text()).includes("' =Test Owner".replace("' ", "'")));
  const token = cookie.split("=")[1];
  const tampered = token.slice(0, -4) + "AAAA";
  assert.equal(
    (
      await request("/api/applications", {
        headers: { Cookie: `field_council_admin=${tampered}` },
      })
    ).status,
    403,
  );
  const expired = await new SignJWT({
    role: "admin",
    version: createHash("sha256").update(passwordHash).digest("hex"),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("field-council-owner")
    .setIssuer("field-council")
    .setAudience("field-council-admin")
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) - 60)
    .sign(new TextEncoder().encode(sessionSecret));
  assert.equal(
    (
      await request("/api/applications", {
        headers: { Cookie: `field_council_admin=${expired}` },
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await request("/api/admin/logout", {
        method: "POST",
        headers: { Cookie: cookie, Origin: "https://other.example" },
      })
    ).status,
    403,
  );
  const logout = await request("/api/admin/logout", {
    method: "POST",
    headers: { Cookie: cookie },
  });
  assert.match(logout.headers.get("set-cookie"), /Max-Age=0/i);
  assert.equal((await request("/api/applications")).status, 403);
  for (let i = 0; i < 6; i++)
    assert.equal((await post(input(), { ip: "192.0.2.20" })).status, 201);
  assert.equal((await post(input(), { ip: "192.0.2.20" })).status, 429);
  const burst = await Promise.all(
    Array.from({ length: 9 }, () => post(input(), { ip: "192.0.2.21" })),
  );
  assert.equal(
    burst.filter((r) => r.status === 201).length,
    6,
    JSON.stringify(burst.map((r) => r.status)),
  );
  assert.equal(burst.filter((r) => r.status === 429).length, 3);
  for (let i = 0; i < 10; i++)
    assert.ok(
      (await login("incorrect", { ip: "192.0.2.30" })).headers
        .get("location")
        .endsWith("error=invalid"),
    );
  assert.ok(
    (await login(password, { ip: "192.0.2.30" })).headers
      .get("location")
      .endsWith("error=limited"),
  );
  server.kill("SIGTERM");
  await once(server, "exit");
  server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      "3419",
    ],
    {
      env: {
        ...env,
        ADMIN_PASSWORD_HASH: "",
        SESSION_SECRET: "",
        DATABASE_URL: "",
      },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  server.stdout.on("data", () => {});
  server.stderr.on("data", () => {});
  let unconfiguredReady = false;
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(origin)).ok) {
        unconfiguredReady = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  assert.ok(unconfiguredReady);
  assert.equal(
    (await request("/api/applications", { headers: { Cookie: cookie } }))
      .status,
    403,
  );
  assert.ok(
    (await (await request("/admin/login")).text()).includes(
      "Admin access has not been configured",
    ),
  );
  assert.ok(
    (await login(password)).headers
      .get("location")
      .endsWith("error=unavailable"),
  );
  assert.equal((await post(input())).status, 503);
  console.log(
    "Passed: production pages, repeatable migrations, PostgreSQL saves/retries, consent, CSRF, honeypot, private API/CSV, password login, cookie security, expired/tampered sessions, updates, logout, atomic concurrent submission limits, login limits, and fail-closed behavior without database/auth configuration.",
  );
} finally {
  if (server && server.exitCode === null) {
    server.kill("SIGTERM");
    await once(server, "exit");
  }
  await socket.stop();
  await db.close();
}
