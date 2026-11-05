# Field Council

Next.js 16.4.5 / React 19.3.1 / Node 26.x website for independent US surveying-firm owners. Applications are emailed to the organiser. **No database, database server, admin dashboard or admin password is needed.**

## Connect email in Vercel

The existing GitHub integration builds the site. To enable application delivery:

1. Connect [Resend in Vercel Marketplace](https://vercel.com/marketplace/resend), or create a Resend account and a sending API key yourself. The project is deliberately not provisioned or changed by this migration.
2. Verify a sending domain in Resend and select an address on it (for example, `Field Council <applications@yourdomain.com>`). The applicant's own address is used as **Reply-To**, never as the sender. Resend's `onboarding@resend.dev` address is for testing to the email associated with the Resend account only; it is not a general production sender.
3. Set these **server-only** Vercel environment variables:

   | Variable                  | Value                                                   |
   | ------------------------- | ------------------------------------------------------- |
   | `RESEND_API_KEY`          | Your Resend sending key; Marketplace may provision this |
   | `APPLICATIONS_EMAIL_FROM` | Your verified sender                                    |
   | `APPLICATIONS_EMAIL_TO`   | `mordi@usezaro.com`                                     |

4. Redeploy after setting variables. Submit a test application and confirm it arrives at `mordi@usezaro.com`. The email includes contact/business details, revenue/team bands, services, the owner's question, sharing preference, consent version, campaign reference and application reference. Click Reply to contact the applicant.

Optional: set `SITE_URL` for canonical metadata. Otherwise Vercel's production domain is used. Search indexing remains disabled for the founding preview; public contact and booking details remain placeholders as requested.

`DATABASE_URL`, `ADMIN_PASSWORD_HASH` and `SESSION_SECRET` are no longer used and can be removed from this project's Vercel environment. No database has been provisioned by the migration. Any database or old preview created separately is not deleted by this code change.

## Submission behavior

The form shows success only after Resend accepts the email and returns a message ID. This confirms provider acceptance, not inbox delivery: mailbox filtering, bounces and outages can still affect delivery. Check the Resend delivery log and your inbox/spam folder during launch. There is no website backup copy or dashboard; the inbox is the review queue. Resend and the mailbox provider may retain messages/delivery records.

Identical retries reuse a content-based idempotency key within Resend's 24-hour deduplication window. Edited details produce a new email. A retry after that window can duplicate a message. Timeouts/provider errors preserve the form and ask the applicant to retry; unconfigured email fails without pretending to submit. The integration does not log form bodies or provider errors containing personal data.

Server validation, same-origin checks, body limits, a honeypot and **best-effort per-instance** submission limits remain. These in-memory limits reset on function restarts and are not shared between instances; they are not a durable/global anti-abuse service. No database/Redis is used. The recipient is fixed by server configuration and cannot be chosen by the visitor. No automatic applicant emails, marketing campaigns, calendar booking or payment collection are configured.

## Local use

```sh
nvm use
npm ci
cp .env.example .env.local
# Fill in your Resend key and verified sender. Never commit .env.local.
npm run dev
```

## Verification

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm run test:flow
```

`test:flow` uses the built production server on loopback port 3419 and a test-process Resend interceptor. It verifies the request/response contract, email content, retries, failures and removed data/admin routes without sending real emails. It does not prove live provider credentials, domain verification or inbox delivery; perform the live inbox check after configuration. The production integration always uses `https://api.resend.com/emails`; there is no mock endpoint or success fallback in application code.

The earlier Sites/Cloudflare preview is separate and has been left intact. Any applications in its D1 database are not moved or deleted. Read `PLAN.md` for the proposed offer and demand experiment.

## Provider documentation used

- [Resend Send Email API](https://resend.com/docs/api-reference/emails/send-email)
- [Idempotency keys and 24-hour retention](https://resend.com/docs/dashboard/emails/idempotency-keys)
- [Verified sending domains](https://resend.com/docs/dashboard/domains/introduction)
