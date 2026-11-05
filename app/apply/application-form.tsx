"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Arrow } from "../shared";
import {
  roles,
  revenues,
  teams,
  serviceOptions,
  sharingOptions,
  stateCodes,
} from "../../lib/application";
type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  company: string;
  website: string;
  city: string;
  state: string;
  serviceArea: string;
  revenue: string;
  team: string;
  services: string[];
  challenge: string;
  sharing: string;
  consent: boolean;
  fax: string;
};
const initial: FormValues = {
  fullName: "",
  email: "",
  phone: "",
  role: "",
  company: "",
  website: "",
  city: "",
  state: "",
  serviceArea: "",
  revenue: "",
  team: "",
  services: [],
  challenge: "",
  sharing: "",
  consent: false,
  fax: "",
};
export default function ApplicationForm() {
  const [v, setV] = useState(initial);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [key, setKey] = useState("");
  const [source, setSource] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    setKey(crypto.randomUUID());
    const p = new URLSearchParams(window.location.search);
    setSource(
      ["utm_source", "utm_medium", "utm_campaign", "ref"]
        .filter((k) => p.has(k))
        .map((k) => k + "=" + p.get(k)?.slice(0, 100))
        .join("&")
        .slice(0, 500),
    );
  }, []);
  useEffect(() => {
    if (step || reference) heading.current?.focus();
  }, [step, reference]);
  const set = (name: keyof FormValues, value: string | boolean | string[]) =>
    setV((p) => ({ ...p, [name]: value }));
  function select(
    name: "role" | "state" | "revenue" | "team" | "sharing",
    label: string,
    options: readonly string[],
  ) {
    return (
      <div className="field">
        <label htmlFor={name}>{label}</label>
        <select
          id={name}
          name={name}
          required
          value={String(v[name])}
          onChange={(e) => set(name, e.target.value)}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
      </div>
    );
  }
  function input(
    name:
      | "fullName"
      | "email"
      | "phone"
      | "company"
      | "website"
      | "city"
      | "serviceArea",
    label: string,
    opts: {
      type?: string;
      placeholder?: string;
      optional?: boolean;
      full?: boolean;
      autoComplete?: string;
    } = {},
  ) {
    return (
      <div className={`field ${opts.full ? "full" : ""}`}>
        <label htmlFor={name}>
          {label}
          {opts.optional && <small>optional</small>}
        </label>
        <input
          id={name}
          name={name}
          type={opts.type || "text"}
          autoComplete={opts.autoComplete}
          value={v[name]}
          onChange={(e) => set(name, e.target.value)}
          required={!opts.optional}
          maxLength={
            name === "email" ? 254 : name === "serviceArea" ? 300 : 160
          }
          placeholder={opts.placeholder}
        />
      </div>
    );
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (step === 1 && v.services.length === 0) {
      setError("Please select at least one service.");
      return;
    }
    if (step < 2) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 80, behavior: "smooth" });
      return;
    }
    if (busy || !key) return;
    setBusy(true);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...v, submissionKey: key, source }),
      });
      let data: { error?: string; reference?: string };
      try {
        data = (await response.json()) as {
          error?: string;
          reference?: string;
        };
      } catch {
        throw new Error(
          "We could not confirm your application was sent. Please try again.",
        );
      }
      if (!response.ok)
        throw new Error(
          data.error || "We could not send your application. Please try again.",
        );
      if (!data.reference)
        throw new Error(
          "We could not confirm your application was sent. Please try again.",
        );
      setReference(data.reference);
      window.scrollTo({ top: 60, behavior: "smooth" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Your application was not sent. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (reference)
    return (
      <div className="success-card">
        <div className="success-mark" aria-hidden="true">
          ✓
        </div>
        <p className="eyebrow">APPLICATION RECEIVED</p>
        <h1 ref={heading} tabIndex={-1}>
          You’re on
          <br />
          <em>our radar.</em>
        </h1>
        <p>
          Thanks, {v.fullName.split(" ")[0]}. Your application for{" "}
          <strong>{v.company}</strong> has been sent to the organiser for
          review.
        </p>
        <ol>
          <li>We review your firm, service area and goals.</li>
          <li>
            We contact potential members at <strong>{v.email}</strong> to
            explore the fit.
          </li>
          <li>You receive the details before deciding whether to join.</li>
        </ol>
        <p>No payment or membership commitment has been made.</p>
        <span className="success-reference">YOUR REFERENCE: {reference}</span>
        <Link className="button" href="/">
          Back to Field Council <Arrow />
        </Link>
      </div>
    );
  return (
    <>
      <div className="form-intro">
        <p className="eyebrow">THE FOUNDING COUNCIL · APPLICATION</p>
        <h1>
          A good council starts
          <br />
          <em>with your firm.</em>
        </h1>
        <p>
          Tell us about your business and the decision you’d like to talk
          through with other owners. We’ll review the fit and contact potential
          members for a conversation. Applying is free.
        </p>
      </div>
      <div className="application-layout">
        <form onSubmit={submit} className="application-card">
          <div
            className="step-tabs"
            aria-label={`Application step ${step + 1} of 3`}
          >
            {["Your firm", "Your business", "Review"].map((x, i) => (
              <span
                key={x}
                className={i === step ? "current" : ""}
                aria-current={i === step ? "step" : undefined}
              >
                <b>{i < step ? "✓" : i + 1}</b>
                {x}
              </span>
            ))}
          </div>
          <h2 ref={heading} tabIndex={-1}>
            {
              [
                "First, the introductions.",
                "A little business context.",
                "Make sure it looks right.",
              ][step]
            }
          </h2>
          <p className="form-hint">
            {
              [
                "About three minutes. No accounts or client details needed.",
                "Broad ranges help us match compatible businesses.",
                "Your application is free and does not reserve or commit you to a paid place.",
              ][step]
            }
          </p>
          {step === 0 && (
            <div className="form-grid">
              {input("fullName", "Full name", {
                autoComplete: "name",
                placeholder: "Your name",
              })}
              {input("email", "Work email", {
                type: "email",
                autoComplete: "email",
                placeholder: "you@yourfirm.com",
              })}
              {input("company", "Company name", {
                autoComplete: "organization",
                placeholder: "Your surveying firm",
              })}
              {select("role", "Your role", roles)}
              {input("website", "Company website", {
                type: "url",
                placeholder: "https://yourfirm.com",
                optional: true,
              })}
              {input("phone", "Phone", {
                type: "tel",
                autoComplete: "tel",
                optional: true,
              })}
              {input("city", "City", {
                autoComplete: "address-level2",
                placeholder: "Your office location",
              })}
              {select("state", "State", stateCodes)}
            </div>
          )}
          {step === 1 && (
            <div className="form-grid">
              {select("revenue", "Annual revenue (USD)", revenues)}
              {select("team", "Team size, including owners", teams)}
              {input("serviceArea", "Where does your firm work?", {
                full: true,
                placeholder: "States, counties or metropolitan areas you serve",
              })}
              <fieldset
                className="field full"
                style={{ border: 0, padding: 0, margin: 0 }}
              >
                <legend className="fieldset-label">
                  Which services do you offer?
                </legend>
                <div className="service-options">
                  {serviceOptions.map((x) => (
                    <label key={x} className="service-option">
                      <input
                        type="checkbox"
                        name="services"
                        value={x}
                        checked={v.services.includes(x)}
                        onChange={(e) =>
                          set(
                            "services",
                            e.target.checked
                              ? [...v.services, x]
                              : v.services.filter((y) => y !== x),
                          )
                        }
                      />
                      {x}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="field full">
                <label htmlFor="challenge">
                  What would you most like to work through with other owners?
                </label>
                <textarea
                  id="challenge"
                  name="challenge"
                  required
                  minLength={10}
                  maxLength={1500}
                  value={v.challenge}
                  onChange={(e) => set("challenge", e.target.value)}
                  placeholder="For example: pricing, hiring another crew, managing cash flow, or getting more time back."
                />
                <small className="micro">
                  Please leave out client names and confidential financial
                  details.
                </small>
              </div>
              {select(
                "sharing",
                "Would you share financial summaries privately?",
                sharingOptions,
              )}
            </div>
          )}
          {step === 2 && (
            <>
              <dl className="review-list">
                {[
                  ["NAME & ROLE", `${v.fullName} · ${v.role}`],
                  ["COMPANY", v.company],
                  ["EMAIL", v.email],
                  ["PHONE", v.phone || "Not provided"],
                  ["LOCATION", `${v.city}, ${v.state}`],
                  ["WEBSITE", v.website || "Not provided"],
                  [
                    "REVENUE / TEAM",
                    `${v.revenue} annual revenue · ${v.team} people`,
                  ],
                  ["FINANCIAL SHARING", v.sharing],
                  ["SERVICE AREA", v.serviceArea],
                  ["SERVICES", v.services.join(", ")],
                  ["YOUR BUSINESS QUESTION", v.challenge],
                ].map(([label, text], i) => (
                  <div key={label} className={i === 10 ? "wide" : ""}>
                    <dt>{label}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
              <div className="review-terms">
                Proposed membership:{" "}
                <strong>US$4,500 per year + travel and accommodation.</strong>{" "}
                No payment is collected now. Group details and terms will be
                shared before you decide.
              </div>
              <label className="consent">
                <input
                  type="checkbox"
                  required
                  checked={v.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                />
                <span>
                  I agree that Field Council may receive these details by email
                  and contact me about my application and group formation. I
                  have read the{" "}
                  <Link href="/privacy" target="_blank" rel="noopener">
                    privacy & application information
                  </Link>
                  .
                </span>
              </label>
            </>
          )}
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="fax">Leave this blank</label>
            <input
              id="fax"
              name="fax"
              tabIndex={-1}
              autoComplete="off"
              value={v.fax}
              onChange={(e) => set("fax", e.target.value)}
            />
          </div>
          {error && (
            <p role="alert" className="form-error">
              {error}
            </p>
          )}
          <div className="form-actions">
            {step > 0 ? (
              <button
                type="button"
                className="form-back"
                disabled={busy}
                onClick={() => {
                  setStep((s) => s - 1);
                  setError("");
                }}
              >
                ← Back to edit
              </button>
            ) : (
              <span className="micro">
                Your application is private.
                <br />
                No obligation to join.
              </span>
            )}
            <button
              type="submit"
              className="button"
              disabled={busy || (step === 2 && !key)}
            >
              {busy
                ? "Sending your application…"
                : step === 2
                  ? "Submit application"
                  : "Continue"}
              <Arrow />
            </button>
          </div>
        </form>
        <aside className="application-aside">
          <p className="eyebrow">A DIFFERENT KIND OF TABLE</p>
          <h3>
            Better company.
            <br />
            <em>Clearer decisions.</em>
          </h3>
          <ul>
            <li>
              <span>THE PEOPLE</span>Independent surveying owners in separate
              markets.
            </li>
            <li>
              <span>THE CONVERSATION</span>Financial performance, teams and real
              business decisions.
            </li>
            <li>
              <span>THE NEXT STEP</span>An application review and, if there’s a
              potential fit, a conversation.
            </li>
          </ul>
          <p className="micro">
            The first group is being formed. Dates, facilitator and final terms
            will be confirmed before enrolment.
          </p>
        </aside>
      </div>
    </>
  );
}
