import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile, chmod } from "node:fs/promises";
import { hashPassword } from "../lib/password.mjs";
const envPath = new URL("../.env.local", import.meta.url);
let existing = await readFile(envPath, "utf8").catch(() => "");
if (
  /^(ADMIN_PASSWORD_HASH|SESSION_SECRET)=/m.test(existing) &&
  !process.argv.includes("--rotate")
) {
  throw new Error(
    "Credentials already exist. Use npm run admin:setup -- --rotate to replace them and invalidate existing sessions.",
  );
}
const password = randomBytes(24).toString("base64url");
const hash = await hashPassword(password);
const secret = randomBytes(48).toString("base64url");
existing = existing.replace(
  /^(ADMIN_PASSWORD_HASH|SESSION_SECRET)=.*\n?/gm,
  "",
);
await writeFile(
  envPath,
  `${existing.trimEnd()}\nADMIN_PASSWORD_HASH=${hash}\nSESSION_SECRET=${secret}\n`,
  { mode: 0o600 },
);
await mkdir(new URL("../outputs/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../outputs/admin-credentials.txt", import.meta.url),
  `Field Council private admin credentials\n\nSign-in path: /admin\nPassword: ${password}\n\nSet these server-only variables in Vercel (Production, and Preview only if needed):\nADMIN_PASSWORD_HASH=${hash}\nSESSION_SECRET=${secret}\n\nAlso connect a PostgreSQL database and set DATABASE_URL. Run npm run db:migrate before collecting applications. Never commit this file.\n`,
  { mode: 0o600 },
);
await chmod(envPath, 0o600);
await chmod(
  new URL("../outputs/admin-credentials.txt", import.meta.url),
  0o600,
);
console.log(
  "Private credentials saved to outputs/admin-credentials.txt and .env.local (both ignored by Git). No secrets were printed.",
);
