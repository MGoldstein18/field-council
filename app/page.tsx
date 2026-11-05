import Link from "next/link";
import { Arrow, Brand, Footer, Header, SurveyMap } from "./shared";
import MarginIllustration from "./margin-illustration";
const questions = [
  [
    "01",
    "Are we pricing the work properly?",
    "Compare how other owners think about estimating, scope creep and the jobs that look better on paper.",
  ],
  [
    "02",
    "Is the team as productive as it could be?",
    "Get another perspective on field crews, office capacity, hiring and the handoff between them.",
  ],
  [
    "03",
    "Where does the profit actually go?",
    "Work through overhead, owner time, equipment and cash collection with people who understand the business.",
  ],
];
const faqs = [
  [
    "Is this a surveying association?",
    "Field Council is a new, independent business peer group for surveying firm owners. The focus is running the company: financial performance, people, operations and the decisions on your desk. It is not affiliated with NSPS, ACEC or another professional association.",
  ],
  [
    "Who is a good fit?",
    "We are looking for owners and operating partners of established US land-surveying firms, particularly businesses with several field crews and approximately $1m–$10m in annual revenue. Those are starting guidelines. The application helps us understand your service mix, stage and goals.",
  ],
  [
    "Will my local competitors be in the room?",
    "We review service areas and business overlap before matching a group. Geographic separation alone may not be enough: we also consider the clients and projects you compete for. You can discuss a potential conflict before accepting a place.",
  ],
  [
    "What information would I share?",
    "The intended format uses a standardised financial summary and operating measures, shared privately under a confidentiality agreement. We agree the scope with members before the first meeting. Your application asks for broad business information only; please do not submit accounts or client information.",
  ],
  [
    "How much will membership cost?",
    "The proposed founding membership is US$4,500 per year, plus your travel and accommodation. The intended format includes two in-person meetings, six virtual working sessions, financial preparation and ongoing group access. Final dates, facilitator, venue details and terms will be confirmed before you decide or pay.",
  ],
  [
    "What happens after I apply?",
    "Your application joins our founding-member review list. We review your business and potential group fit, then contact suitable applicants about a conversation. If there is a compatible group, you receive the details and can decide whether to join. Applying is free and does not commit you to membership.",
  ],
  [
    "When does the first group start?",
    "We are forming the first group now. A launch date depends on finding compatible members and confirming the facilitator and meeting plans. There is no announced start date yet. We will keep applicants informed as the group takes shape.",
  ],
  [
    "Are the meetings recorded or used for content?",
    "Financial discussions are intended to stay private. Any public interview, podcast or case study would require a separate, optional agreement. Applying or joining would not give us permission to publish your business information.",
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
              <span className="live-dot" /> FOUNDING COUNCIL · NOW FORMING
            </p>
            <h1>
              You know
              <br />
              your land.
              <br />
              <em>Know your business.</em>
            </h1>
            <p className="hero-description">
              A private peer group for independent surveying firm owners. Open
              the books. Compare notes. Make your next big decision with better
              company.
            </p>
            <div className="hero-actions">
              <Link href="/apply" className="button">
                Apply for the founding group <Arrow />
              </Link>
              <a href="#the-council" className="quiet-link">
                Take a look inside <span>↓</span>
              </a>
            </div>
            <p className="micro hero-note">
              For US surveying owners. Free to apply. No commitment.
            </p>
          </div>
          <div
            className="hero-visual"
            aria-label="Illustration of surveying parcels and an owners’ council"
          >
            <div className="map-sheet">
              <div className="map-top">
                <span>FIELD NOTES / 001</span>
                <span>INDEPENDENT PERSPECTIVE</span>
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
                  A seat at
                  <br />
                  <em>your table.</em>
                </div>
                {Array.from({ length: 12 }, (_, i) => (
                  <span className={`seat seat-${i}`} key={i} />
                ))}
              </div>
              <p>
                A small group.
                <br />
                <strong>A broader perspective.</strong>
              </p>
              <div className="card-bottom">
                <span>OWNERS ONLY</span>
                <span>BY APPLICATION ↗</span>
              </div>
            </div>
            <span className="visual-annotation">
              Good businesses aren’t built alone.
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
              <i>03</i> Real business conversations
            </span>
            <span>
              <i>04</i> Confidential by design
            </span>
          </div>
        </div>
        <section className="section wrap problem" id="why">
          <div>
            <p className="eyebrow">
              THE PART THEY DON’T TEACH YOU IN THE FIELD
            </p>
            <h2>
              Who do you talk to
              <br />
              about <em>the business?</em>
            </h2>
          </div>
          <div className="problem-copy">
            <p>
              You can solve a complicated boundary. Running the company brings a
              different set of questions.
            </p>
            <p>
              What should a crew produce? Is another hire the right move? Are
              growing revenues turning into better profits—or just longer days?
            </p>
            <p className="problem-last">
              It helps to have other owners at the table.
            </p>
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
                <p className="eyebrow">A WORKING GROUP FOR WORKING OWNERS</p>
                <h2>
                  Bring your numbers.
                  <br />
                  Leave with <em>perspective.</em>
                </h2>
              </div>
              <p>
                The proposed founding format.
                <br />
                Small enough for everyone to be heard.
                <br />
                Specific enough to be useful.
              </p>
            </div>
            <div className="format-grid">
              <article className="format-main">
                <span className="label">THE ROOM</span>
                <div className="format-big">
                  10–12<span>owners. One council.</span>
                </div>
                <p>
                  Owners and operating partners, matched by business stage and
                  service mix, with competitive overlap reviewed before a place
                  is offered.
                </p>
                <div className="mini-diagram" aria-hidden="true">
                  <span>YOUR FIRM</span>
                  <i />
                  <span>YOUR PEERS</span>
                  <i />
                  <span>A BETTER VIEW</span>
                </div>
              </article>
              <div className="format-side">
                <article>
                  <span className="label">IN PERSON</span>
                  <strong>02</strong>
                  <div>
                    <h3>Step out. Work on the company.</h3>
                    <p>
                      Two intended in-person meetings each year, with time for
                      financial reviews, owner conversations and the
                      relationships between them.
                    </p>
                  </div>
                </article>
                <article>
                  <span className="label">BETWEEN MEETINGS</span>
                  <strong>06</strong>
                  <div>
                    <h3>Keep the conversation moving.</h3>
                    <p>
                      Six planned virtual working sessions, plus a private place
                      to ask questions and follow through with your group.
                    </p>
                  </div>
                </article>
              </div>
            </div>
            <div className="deliverables">
              {[
                [
                  "01 / COMPARE",
                  "Financial clarity",
                  "A consistent way to look at revenue, labour, overhead and cash—so the discussion starts from common definitions.",
                ],
                [
                  "02 / DISCUSS",
                  "Decisions with context",
                  "Bring a real question. Hear how owners in the same profession have approached it. Decide what fits your firm.",
                ],
                [
                  "03 / FOLLOW THROUGH",
                  "A reason to act",
                  "Leave each session with a practical next step, and come back to people who will ask how it went.",
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
              The founding group is in formation. Facilitator, meeting dates and
              final membership terms will be confirmed before enrolment.
            </p>
          </div>
        </section>
        <section className="section wrap membership" id="membership">
          <div className="membership-copy">
            <p className="eyebrow">THE MEMBERSHIP</p>
            <h2>
              Build a better firm.
              <br />
              <em>Keep your independence.</em>
            </h2>
            <p>
              Your business stays yours. This is a place to think clearly about
              how you run it, with owners who understand what’s at stake.
            </p>
            <ul className="check-list">
              <li>Independent US surveying owners and operating partners</li>
              <li>Particularly firms with multiple field crews</li>
              <li>A willingness to share, listen and follow through</li>
            </ul>
            <p className="micro">
              We’re starting with established firms around $1m–$10m in annual
              revenue. Apply if the idea resonates; group fit matters more than
              a rigid cut-off.
            </p>
          </div>
          <div className="price-card">
            <div className="price-heading">
              <span className="eyebrow">PROPOSED FOUNDING MEMBERSHIP</span>
              <Brand compact />
            </div>
            <div className="price">
              <span className="currency">US$</span>4,500
              <span className="per">/ year</span>
            </div>
            <p className="travel">
              Your travel and accommodation are separate.
            </p>
            <div className="price-includes">
              <span>THE INTENDED MEMBERSHIP INCLUDES</span>
              <ul>
                <li>Two facilitated in-person meetings</li>
                <li>Six virtual working sessions</li>
                <li>Standardised financial comparisons</li>
                <li>Ongoing access to your private group</li>
                <li>Meeting rooms and meeting-day catering</li>
              </ul>
            </div>
            <Link href="/apply" className="button full">
              Apply for a founding place <Arrow />
            </Link>
            <p className="micro">
              No payment to apply. Review the full details before deciding.
            </p>
          </div>
        </section>
        <MarginIllustration />
        <section className="section wrap process" id="how-it-works">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                A GOOD GROUP STARTS WITH THE RIGHT PEOPLE
              </p>
              <h2>
                Find your <em>common ground.</em>
              </h2>
            </div>
            <p>
              A conversation first.
              <br />A commitment only when it makes sense.
            </p>
          </div>
          <div className="process-grid">
            {[
              [
                "01",
                "Tell us about your firm.",
                "A short application covers your business, your market and the questions you want to work on.",
              ],
              [
                "02",
                "Let’s explore the fit.",
                "We review applications and contact potential members to discuss goals, group compatibility and expectations.",
              ],
              [
                "03",
                "Choose your council.",
                "If there’s a suitable match, you receive the group details, meeting plans and terms before deciding whether to join.",
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
            <p className="eyebrow">A FEW GOOD QUESTIONS</p>
            <h2>
              Before you
              <br />
              <em>pull up a chair.</em>
            </h2>
            <p>
              We’re building the first group carefully.
              <br />
              Here’s what to know.
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
            <p className="eyebrow">YOUR NEXT CHAPTER DESERVES GOOD COMPANY</p>
            <h2>
              Survey the possibilities.
              <br />
              <em>Take a seat at the table.</em>
            </h2>
            <p>
              Help shape the founding council for independent surveying owners.
            </p>
            <Link href="/apply" className="button">
              Apply for the founding group <Arrow />
            </Link>
            <span className="micro">
              A short application. A real conversation. No obligation.
            </span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
