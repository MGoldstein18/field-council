import Link from "next/link";
import { Arrow, Brand, Footer, Header, SurveyMap } from "./shared";
const questions = [
  [
    "01",
    "Are we busy—or actually profitable?",
    "Put revenue, direct labour and overhead into the same conversation. Compare how other owners read their numbers, and ask better questions of your own.",
  ],
  [
    "02",
    "Is another hire the right move?",
    "Talk through capacity, responsibilities and the cost of adding a crew or a manager before you take on the overhead.",
  ],
  [
    "03",
    "Why does everything still come back to me?",
    "Estimating. Client calls. Hiring. Quality control. Work through the handoffs that could give your team more responsibility and you more room to lead.",
  ],
];
const faqs = [
  [
    "Who would be in my council?",
    "Owners and operating partners of independent US land-surveying firms. We’re starting with established businesses around $1m–$10m in annual revenue, often with several field crews. We review business stage, service mix and market overlap before proposing a group.",
  ],
  [
    "How do you handle competing firms?",
    "We review where you work, the services you offer and the projects you compete for. Geography is part of the check, but it isn’t the whole check. Potential conflicts are discussed before you accept a place.",
  ],
  [
    "What would I need to share?",
    "Come prepared to discuss your business openly and share an agreed financial summary under a confidentiality agreement. The group needs common definitions to make comparisons useful. We agree the scope before meetings begin; the application asks for broad business bands, never accounts or client records.",
  ],
  [
    "What does membership cost?",
    "Regular membership is US$399 per month, billed annually at US$4,788. The current founding member discount is US$299 per month, billed annually at US$3,588. Travel and accommodation are separate. Membership covers the planned two in-person meetings, four virtual working sessions per year, shared financial review format, private group access, meeting rooms and meeting-day catering. You’ll receive the facilitator details, dates and final terms before deciding or paying.",
  ],
  [
    "Is the founding council already running?",
    "We’re recruiting the first group now. The facilitator, meeting dates and launch plans are still being finalised. Applying starts a conversation about fit; it does not purchase a membership or guarantee a place. We will confirm the full plan with prospective members before enrolment.",
  ],
  [
    "What happens after I apply?",
    "Your application is emailed privately to the organiser. We review your firm and territory, then contact potential members for a fit conversation. If we can put together a compatible group, you receive the membership details and decide whether to join. There is no payment or commitment when you apply.",
  ],
  [
    "How is this different from a professional association?",
    "The focus is the business you own: its numbers, people, operations and the decisions you’re responsible for. You work with a small, continuing group of owners. Field Council is independent and is not affiliated with NSPS, ACEC or another professional association.",
  ],
  [
    "Are meetings recorded or used for podcasts?",
    "Financial discussions are intended to stay private. A public interview, podcast or case study would always need a separate, optional agreement. Applying or joining does not give us permission to publish your business information.",
  ],
];
export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="hero wrap">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="live-dot" /> FOR US SURVEYING OWNERS · FOUNDING
              GROUP FORMING
            </p>
            <h1>
              You run the firm.
              <br />
              You don’t have to
              <br />
              <em>figure it out alone.</em>
            </h1>
            <p className="hero-description">
              A private peer council of 10–12 independent surveying firm owners.
              Compare your numbers. Work through the decisions you can’t hand
              off. Build relationships with owners who understand the business
              behind the fieldwork.
            </p>
            <div className="hero-actions">
              <Link href="/apply" className="button">
                Apply to join <Arrow />
              </Link>
              <a href="#the-council" className="quiet-link">
                See how it works <span>↓</span>
              </a>
            </div>
            <p className="micro hero-note">
              For established firms around $1m–$10m revenue. Free to apply.
            </p>
          </div>
          <div
            className="hero-visual"
            aria-label="Illustration of surveying parcels and an owners’ council"
          >
            <div className="map-sheet">
              <div className="map-top">
                <span>FIELD NOTES / 001</span>
                <span>THE BUSINESS BEHIND THE FIELDWORK</span>
              </div>
              <SurveyMap />
              <div className="map-bottom">
                <span>DIFFERENT MARKETS.</span>
                <span>COMMON GROUND.</span>
              </div>
            </div>
            <div className="council-card">
              <div className="card-eyebrow">
                <span className="tiny-cross">+</span> THE FOUNDING COUNCIL
              </div>
              <div className="table-diagram" aria-hidden="true">
                <div className="table-center">
                  Your firm.
                  <br />
                  <em>Your council.</em>
                </div>
                {Array.from({ length: 12 }, (_, i) => (
                  <span className={`seat seat-${i}`} key={i} />
                ))}
              </div>
              <p>
                Same profession.
                <br />
                <strong>Different markets.</strong>
              </p>
              <div className="card-bottom">
                <span>OWNERS ONLY</span>
                <span>BY APPLICATION ↗</span>
              </div>
            </div>
            <span className="visual-annotation">
              People you can talk numbers with.
            </span>
          </div>
        </section>
        <div className="principle-strip">
          <div className="wrap">
            <span>
              <i>01</i> Same profession
            </span>
            <span>
              <i>02</i> Separate markets
            </span>
            <span>
              <i>03</i> Compare the numbers
            </span>
            <span>
              <i>04</i> Confidential by design
            </span>
          </div>
        </div>
        <section className="section wrap problem" id="why">
          <div>
            <p className="eyebrow">THE DECISIONS THAT FOLLOW YOU HOME</p>
            <h2>
              A busy firm.
              <br />
              <em>Some hard questions.</em>
            </h2>
          </div>
          <div className="problem-copy">
            <p>
              You’re responsible for the work, the team and the bottom line. But
              when it’s time to raise prices, add a crew or step back from the
              day-to-day, who do you talk it through with?
            </p>
            <p>
              Some conversations are hard to have with your team. Others need
              someone who has carried a payroll, managed field crews and dealt
              with the same client pressures.
            </p>
            <p className="problem-last">That’s the room we’re building.</p>
          </div>
          <div className="question-list">
            {questions.map(([n, t, b]) => (
              <article key={n}>
                <span className="number">{n}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{b}</p>
                </div>
                <span className="question-plus" aria-hidden="true">
                  +
                </span>
              </article>
            ))}
          </div>
        </section>
        <section className="council-section" id="the-council">
          <div className="wrap section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">
                  YOUR NUMBERS. YOUR DECISIONS. YOUR COUNCIL.
                </p>
                <h2>
                  Bring a real decision.
                  <br />
                  <em>Give it a proper hearing.</em>
                </h2>
              </div>
              <p>
                The same small group, meeting throughout the year.
                <br />
                Time to understand the numbers, challenge assumptions and work
                out what to do next.
              </p>
            </div>
            <div className="format-grid">
              <article className="format-main">
                <span className="label">THE PEOPLE AROUND YOU</span>
                <div className="format-big">
                  10–12<span>owners. One council.</span>
                </div>
                <p>
                  Owners and operating partners running firms with similar
                  challenges. We review business stage, service mix and market
                  overlap so the group can have useful, candid conversations.
                </p>
                <div className="mini-diagram" aria-hidden="true">
                  <span>YOUR NUMBERS</span>
                  <i />
                  <span>YOUR PEERS</span>
                  <i />
                  <span>YOUR NEXT STEP</span>
                </div>
              </article>
              <div className="format-side">
                <article>
                  <span className="label">IN PERSON</span>
                  <strong>02</strong>
                  <div>
                    <h3>Time to open the books.</h3>
                    <p>
                      Two in-person working meetings each year. Step out of the
                      office, review financial performance and work through the
                      decisions that deserve more than a quick call.
                    </p>
                  </div>
                </article>
                <article>
                  <span className="label">BETWEEN MEETINGS</span>
                  <strong>04</strong>
                  <div>
                    <h3>Keep the work moving.</h3>
                    <p>
                      Four virtual working sessions each year, plus a private
                      channel for your council. Bring back what you tried, what
                      changed and where you’re stuck.
                    </p>
                  </div>
                </article>
              </div>
            </div>
            <div className="deliverables">
              {[
                [
                  "01 / OPEN THE BOOKS",
                  "Understand the differences.",
                  "Review revenue, direct labour, overhead and owner compensation using shared definitions. Explore what sits behind the differences between firms.",
                ],
                [
                  "02 / WORK THE PROBLEM",
                  "Put your thinking to the test.",
                  "Bring a hiring, capacity or growth decision. Let other owners question the assumptions and share the trade-offs they’ve experienced.",
                ],
                [
                  "03 / FOLLOW THROUGH",
                  "Turn the discussion into action.",
                  "Choose a next step for your firm. Bring it back to the group, review what happened and work out what to change.",
                ],
              ].map(([n, t, b]) => (
                <div key={n}>
                  <span>{n}</span>
                  <h3>{t}</h3>
                  <p>{b}</p>
                </div>
              ))}
            </div>
            <p className="micro format-note">
              This is the planned founding format. Your group, facilitator,
              meeting dates and final terms will be confirmed before you join.
            </p>
          </div>
        </section>
        <section className="section wrap membership" id="membership">
          <div className="membership-copy">
            <p className="eyebrow">THE QUALITY OF THE GROUP MATTERS</p>
            <h2>
              A useful room starts
              <br />
              <em>with the right owners.</em>
            </h2>
            <p>
              Your peers are the reason to join. We’re looking for owners who
              will prepare, speak openly about the business and make time to
              help the other people at the table.
            </p>
            <ul className="check-list">
              <li>You own or help lead an independent US surveying firm</li>
              <li>
                You run an established business, often with several field crews
              </li>
              <li>
                You’re willing to share financial summaries privately and
                contribute
              </li>
            </ul>
            <p className="micro">
              Our starting focus is firms around $1m–$10m in annual revenue. We
              review each application for fit. Service mix, business stage and
              competitive overlap matter alongside size.
            </p>
          </div>
          <div className="price-card">
            <div className="price-heading">
              <span className="eyebrow">FOUNDING MEMBER DISCOUNT</span>
              <Brand compact />
            </div>
            <div className="price">
              <span className="currency">US$</span>299
              <span className="per">/ month</span>
            </div>
            <p className="travel">
              <strong>US$3,588 billed annually.</strong>
            </p>
            <p className="travel">
              Regular price: US$399/month, billed annually at US$4,788.
            </p>
            <p className="travel">
              Your travel and accommodation are separate.
            </p>
            <div className="price-includes">
              <span>THE PLANNED MEMBERSHIP</span>
              <ul>
                <li>Two in-person working meetings</li>
                <li>Four virtual working sessions per year</li>
                <li>A shared format for financial reviews</li>
                <li>A private channel for your council</li>
                <li>Meeting rooms and meeting-day catering</li>
              </ul>
            </div>
            <Link href="/apply" className="button full">
              Apply to join <Arrow />
            </Link>
            <p className="micro">
              Free to apply. Confirm the group and full terms before you pay.
            </p>
          </div>
        </section>
        <section className="section wrap process" id="how-it-works">
          <div className="section-heading">
            <div>
              <p className="eyebrow">A CONVERSATION BEFORE A COMMITMENT</p>
              <h2>
                Let’s find <em>your people.</em>
              </h2>
            </div>
            <p>
              A small group takes care to put together.
              <br />
              Here’s how we’ll explore the fit.
            </p>
          </div>
          <div className="process-grid">
            {[
              [
                "01",
                "Start with your firm.",
                "Tell us what you do, where you work and the business question you’d most like to work through with other owners.",
              ],
              [
                "02",
                "Have a real conversation.",
                "We review your application and contact potential members to discuss the business, what you want from a council and what you’d bring to it.",
              ],
              [
                "03",
                "Decide when the group fits.",
                "If there’s a compatible group, you receive the membership details, facilitator and meeting plans. Then you decide. Nothing is charged when you apply.",
              ],
            ].map(([n, t, b]) => (
              <article key={n}>
                <span className="process-number">{n}</span>
                <h3>{t}</h3>
                <p>{b}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="faq-section wrap" id="questions">
          <div>
            <p className="eyebrow">BEFORE YOU APPLY</p>
            <h2>
              The questions
              <br />
              <em>worth asking.</em>
            </h2>
            <p>
              A clear picture of the people, the commitment and how we’re
              forming the first council.
            </p>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="closing">
          <div className="wrap">
            <p className="eyebrow">
              A SMALL GROUP. A SERIOUS COMMITMENT TO EACH OTHER.
            </p>
            <h2>
              Bring the decision
              <br />
              <em>you’ve been sitting with.</em>
            </h2>
            <p>
              Apply to the founding council for independent US surveying owners.
              Tell us about your firm and the conversation you wish you could
              have.
            </p>
            <Link href="/apply" className="button">
              Apply to join <Arrow />
            </Link>
            <span className="micro">
              Free to apply. No payment or membership commitment.
            </span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
