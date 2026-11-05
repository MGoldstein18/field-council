# Field Council

A Next.js App Router website for a proposed peer council for independent US surveying-firm owners. It includes the landing page, a three-step application, PostgreSQL persistence, and a password-protected organiser dashboard at `/admin`.

## Runtime

- Next.js **16.4.5**, React **19.3.1**.
- Node.js **26.x** on Vercel; `.nvmrc` pins **26.13.0** locally. Verified against the official release pages and npm on 5 November 2026.
- Standard `next dev`, `next build`, `next start`. No Sites, Vinext, Wrangler, Cloudflare bindings or ChatGPT authentication headers.

## Vercel setup after the GitHub build

The GitHub push triggers the project's existing Vercel integration. Use the **Next.js** framework preset, repository root, `npm ci` install and `npm run build` build command. The `engines.node` field requests Node 26.

The landing page can build without credentials. **Application collection and admin sign-in require the following setup before use:**

1. Connect a **dedicated PostgreSQL database** from Vercel Storage/Marketplace (Neon is suitable). Set `DATABASE_URL` to its connection URL. Use the provider's recommended pooled URL and TLS settings; do not disable TLS on a hosted database.
2. Run `npm run admin:setup` locally. It generates a random admin password, an scrypt password hash and a random session secret. Credentials are saved in `outputs/admin-credentials.txt` and `.env.local`, both excluded from Git; the script never prints secrets. A credential file has already been generated in the migration's local checkout.
3. Copy **`ADMIN_PASSWORD_HASH`** and **`SESSION_SECRET`** from that private file into Vercel's server-side Production environment. Add them to Preview only if a private preview dashboard is needed. Never use `NEXT_PUBLIC_` names. Keep preview data in a separate database.
4. Put the intended database's `DATABASE_URL` in local `.env.local` and run `npm run db:migrate`. Alternatively, run the migration command in a trusted environment with that variable set. It applies versioned SQL in a transaction, checks applied migration checksums, and is safe to rerun. `migrations/0001_initial.sql` contains the schema. Schema changes are deliberately not applied as a side effect of every build.
5. Redeploy through the existing Vercel Git integration after setting environment variables. Open `/apply` to test a submission, then `/admin` to sign in and confirm it appears.

Optional: set `SITE_URL` to the canonical public HTTPS URL. Otherwise metadata uses Vercel's production domain. Indexing remains disabled for the founding preview. Public contact and booking details remain placeholders as requested.

## Admin security

The server checks authentication for the admin page, application list, CSV and update endpoint. Signed eight-hour sessions use HttpOnly, Secure (production), SameSite=Strict cookies. Passwords are salted and hashed using scrypt; plaintext passwords are never stored in the database or source. All writes check request origin. Login attempts are limited to ten per connection per 15-minute bucket in PostgreSQL; application submissions are limited to six per connection per hour, using atomic counters. Vercel's platform IP header is used; if absent, requests share a conservative bucket. Database errors fail closed.

Changing either the password hash or session secret invalidates existing sessions on all deployments that receive the change. Run `npm run admin:setup -- --rotate`, update Vercel's values and redeploy. Sign-out clears the current browser cookie; a previously copied session token remains valid until expiry or credential rotation. There is one organiser password, no public registration, and no self-service password reset.

## Local development

```sh
nvm use
npm ci
npm run admin:setup # skip if local credentials already exist
# Add a development DATABASE_URL to .env.local.
npm run db:migrate
npm run dev
```

Use a separate local/development database. The production app never stores applications on Vercel's ephemeral filesystem. Unconfigured storage returns a save error without falsely acknowledging a real submission; the form retains entered values for retry. An unset admin configuration denies access.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:flow
```

`test:flow` runs the built production Next.js server and an isolated in-memory PGlite database over PostgreSQL's wire protocol. It exercises migrations, durable SQL writes within the test database, retry deduplication, validation, CSRF, CSV escaping, password login, private routes, expired/tampered sessions, logout and concurrent rate limiting. It uses loopback ports 3419 and 55439, generates test-only credentials, and never accesses production storage. PGlite is a development dependency, not a production database. Hosted database connectivity must still be checked after configuration.

## Application workflow

Successful applications receive a reference only after the database write succeeds. Retries reuse a submission UUID. The admin can search/filter, change review stages, save notes, export CSV and open a manually reviewed fit-call email draft. The site does not send email, book calls automatically or collect payment. Read `PLAN.md` for the proposed offer and demand experiment.

## Previous preview

The previous Sites/Cloudflare preview has been left intact. This repository creates a new PostgreSQL database; it does **not** transfer or delete any records from the old D1 database. If that preview has received real applications, export and import those before retiring it. Do not put applicant exports or credentials in Git.

## Primary documentation

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js authentication and sessions](https://nextjs.org/docs/app/guides/authentication)
- [Vercel Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Node.js releases](https://nodejs.org/en/download/current)
- [node-postgres](https://node-postgres.com/)
