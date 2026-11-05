# Field Council: launch design and demand plan

Working name, proposed format and price are editable. Audience: independent US surveying firm owners, especially multi-crew firms near $1m–$10m revenue. Goal: qualified applications and conversations, followed by a compatible founding group. Existing relationships are not required; cold outreach is the intended starting channel.

## Research applied

- **Alex Hormozi:** make the outcome concrete, make the mechanism understandable, and reduce the effort of taking the first step. Application: owner decisions, specific group format, price visibility and a short application without a payment commitment. We have no results evidence yet, so the page makes no earnings promise. Source: [Acquisition.com pricing/value checklist](https://www.acquisition.com/hubfs/Offer%20Checklists%20-%20PDF%20Downloads/Pricing-Value-Checklist.pdf?hsLang=en).
- **Sabri Suby:** communicate a compelling, deliverable offer and make the next conversion clear. Application: one primary CTA, industry-specific problems, precise inclusions, FAQs that handle real objections, and an application-to-conversation path. Source: [King Kong, Suby's offer discussion](https://kingkong.co/blog/the-real-reason-businesses-fail/).
- **Daniel Priestley:** capture interest before launching, ask qualifying questions, and use response data to shape supply. Application: founding-member review list, business bands, service mix, territory, main problem and willingness to share financial summaries. Source: [ScoreApp's account of Priestley's waitlist experiment](https://www.scoreapp.com/waitlist-strategy-300k-launch/). This is a provider-published case study, not a prediction of our results.

These are our applications of their principles, not endorsements or copied programmes. Their own revenue or lead counts are not used as our social proof.

## Page progression

1. Clear surveying-owner positioning and application CTA.
2. Familiar owner questions: pricing, capacity, profit and cash.
3. Specific mechanism: 10–12 owners, separate markets, comparable financial summaries, two proposed in-person meetings and six virtual sessions.
4. Proposed US$4,500 annual price, with travel/accommodation separate and no application payment.
5. Interactive margin illustration, clearly labelled as arithmetic rather than a result claim.
6. Application → fit conversation → compatible group → decision.
7. FAQs, including confidentiality, competition, launch timing and optional public interviews.

The design carries forward the earlier website project's large typography, warm paper palette, clear price and strong CTA. It adds a surveying-specific cadastral illustration and a council-table visual, rather than generic community stock photos. No fabricated members, testimonials, timers, occupied-seat counters or founder credentials.

## Application workflow

Three stages: contact/company/location; revenue/team/service/territory/problem; review/consent. Durable PostgreSQL storage and a server-issued reference only after a successful save. Idempotent retries use a client-generated UUID. Server validation, honeypot, bounded bodies, connection-based rate limits and same-origin writes. Failures retain the form and offer retry.

Owner-only `/admin` supports search, stage filtering, notes, stage updates and CSV export. Fit-call email opens in the organiser's own mail application for review. Neither status changes nor form submissions send email. Booking is manual. No payment provider, automatic acceptance, calendar integration or email service is implied.

## Demand experiment

- Begin with 150 screened owner-led firms across several markets. Use campaign query parameters to distinguish sources. Exclude corporate branches and check actual service overlap before matching a group.
- Track valid outreach, replies, applications, qualified applications, fit conversations, financial-sharing commitments, paid pilot seats and eventual annual-price continuation separately. Application volume alone is not willingness to pay.
- Keep the same proposition while testing a small number of message angles (financial clarity versus owner perspective). Evaluate fit and conversations, not just clicks.
- Build the group from compatible applicants; keep unmatched firms in `waiting_for_match` rather than inventing a launch date.
- Before charging: confirm facilitator, venue/delivery budget, meeting dates, financial pack, confidentiality agreement, terms and launch threshold. The page already tells applicants these remain to be confirmed.
- Warm applicants with useful, consented business material and real progress updates. No automated campaign is configured or sent.
- Publish a member count or capacity deadline only when supported by real accepted members and actual delivery constraints.

## Preview versus launch

The marketing pages are accessible to visitors; organiser data and the dashboard require password authentication. Search indexing remains disabled for the founding preview. Public contact email and booking link are placeholders at the user's request. Public contact/retention details should be completed when preparing the public launch. The application backend requires the database setup documented in README.md before collecting applications. Do not present this as already populated or as a launched member community.
