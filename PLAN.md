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

Three stages: contact/company/location; revenue/team/service/territory/problem; review/consent. Applications emailed to the organiser, with a reference acknowledged only after the email provider accepts the message. Retries use a client-generated UUID and Resend’s 24-hour idempotency window. Server validation, honeypot, bounded bodies, best-effort, per-instance connection limits and same-origin writes. Failures retain the form and offer retry. No application database is required.

Applications are reviewed in the organiser’s email inbox. Replying to the email contacts the applicant. There is no admin dashboard, database, CSV export, automated acceptance, calendar integration or payment collection.

## Demand experiment

- Begin with 150 screened owner-led firms across several markets. Use campaign query parameters to distinguish sources. Exclude corporate branches and check actual service overlap before matching a group.
- Track valid outreach, replies, applications, qualified applications, fit conversations, financial-sharing commitments, paid pilot seats and eventual annual-price continuation separately. Application volume alone is not willingness to pay.
- Keep the same proposition while testing a small number of message angles (financial clarity versus owner perspective). Evaluate fit and conversations, not just clicks.
- Build the group from compatible applicants; keep unmatched firms in the email review queue rather than inventing a launch date.
- Before charging: confirm facilitator, venue/delivery budget, meeting dates, financial pack, confidentiality agreement, terms and launch threshold. The page already tells applicants these remain to be confirmed.
- Warm applicants with useful, consented business material and real progress updates. No automated campaign is configured or sent.
- Publish a member count or capacity deadline only when supported by real accepted members and actual delivery constraints.

## Preview versus launch

The marketing pages are accessible to visitors; application details are emailed privately to the organiser. Search indexing remains disabled for the founding preview. Public contact email and booking link are placeholders at the user's request. Public contact/retention details should be completed when preparing the public launch. The application backend requires the email setup documented in README.md before collecting applications. Do not present this as already populated or as a launched member community.

## Landing-page copy review · 5 November 2026

The earlier page described a pleasant community but left too much of the commercial value implicit. The rewrite connects the pressure of ownership to a specific mechanism: a small continuing group of surveying owners, comparable financial summaries, decisions discussed in depth, and follow-through. This is an editorial judgment from reviewing the pages below, not evidence of their conversion rates.

| Page reviewed                                                                                      | What the page does                                                                                                           | Application to Field Council                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Hampton](https://joinhampton.com/)                                                                | Connects consequential founder decisions to a small peer group; explains admission and backs its offer with member evidence. | Lead with the owner’s problem, immediately define the group, and explain who belongs. Use original wording. Our page cannot borrow its results, credentials, network size, acceptance rate or urgency. |
| [NADA 20 Group](https://www.nada.org/nada/nada-20-group)                                           | Makes the financial-comparison process, group matching and ongoing support concrete.                                         | Explain the numbers members would review and the importance of common definitions. Describe comparisons within the proposed group; do not imply an existing national surveying benchmark database.     |
| [Vistage](https://pages.vistage.com/member-info)                                                   | Connects a recurring peer meeting to working through actual business issues, alongside its own coaching offer.               | Show the decisions and discussion process. Do not add executive coaching, experts or services we have not arranged.                                                                                    |
| [EO Forum](https://eonetwork.org/membership/forum/)                                                | Explains a small recurring group, confidentiality and learning through shared experience.                                    | Make participation and financial-sharing expectations clear. Show what members contribute as well as what they receive.                                                                                |
| [BNI](https://www.bni.com/)                                                                        | Names the commercial purpose of membership clearly and makes the next step easy to find.                                     | Make the job of this council equally clear: financial understanding and owner decisions. Do not promise a referral pipeline.                                                                           |
| [Moda](https://www.modacommunities.com/)                                                           | Leads with the member activity and gives distinct entry points to its trading communities.                                   | Make the offer understandable before asking for an application. Its transaction network and trust tools are not features of this council.                                                              |
| [ACEC Small Firm Coalition](https://www.acec.org/member-center/get-involved/coalitions/sfc/about/) | Describes education, advocacy and business support for small engineering firms.                                              | Clarify the narrower recurring owner-group proposition and independence from professional associations.                                                                                                |

### Decisions implemented

- Hero: “You run the firm. You don’t have to figure it out alone.” Immediately explain the 10–12-owner council, financial comparisons and decisions members bring.
- Replace vague benefit headings with concrete discussions about profitability, hiring/capacity and owner dependence.
- Make the meeting mechanism visible: review the numbers, work the problem, choose a next action.
- Treat the people and their willingness to contribute as the membership’s main value. Keep eligibility and market-overlap review explicit.
- Keep the existing visual identity, proposed $4,500 annual fee, two in-person meetings, six virtual sessions and travel arrangements. Consolidate formation caveats into the format, pricing and relevant FAQs.
- Preserve the arithmetic illustration, defaulting to one margin point, and label it as an illustration rather than a member result or forecast.
- Keep application CTAs consistent. Align the application introduction, footer and metadata with the new proposition.
- No borrowed testimonials, invented member outcomes, founder credentials, acceptance statistics, membership counts, guarantees or countdowns. No change to the email backend.

### Evidence still needed

The biggest remaining credibility gap is product evidence: a named organiser/facilitator with a relevant background, a real sample financial-review pack and, after a pilot, permissioned member accounts of what was useful. Better copy can explain the offer; it cannot substitute for these. Add each when it exists rather than presenting illustrative examples as results.
