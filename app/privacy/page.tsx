import type { Metadata } from "next";
import { Header, Footer } from "../shared";
export const metadata: Metadata = {
  title: "Privacy & application information",
};
export default function Privacy() {
  return (
    <>
      <Header simple />
      <main id="main" className="legal wrap">
        <p className="eyebrow">LAST UPDATED · 5 NOVEMBER 2026</p>
        <h1>
          Privacy &<br />
          <em>application information.</em>
        </h1>
        <p>
          Field Council is a new independent surveying-owner community in
          formation. This private preview collects applications so the organiser
          can review potential members and form compatible groups.
        </p>
        <h2>What the application collects</h2>
        <p>
          Your name, contact details, company, role, location, service area,
          broad revenue and team-size bands, services, business question and
          willingness to share financial summaries privately. Website and phone
          are optional. The email also includes your contact consent, an
          application reference and any campaign reference supplied with the
          link.
        </p>
        <h2>How the information is used</h2>
        <p>
          To review applications, assess potential group fit and competitive
          overlap, contact applicants about the application or group formation,
          and manage the membership selection process. Submitting the
          application does not subscribe you to unrelated marketing or commit
          you to membership.
        </p>
        <h2>Storage and access</h2>
        <p>
          Applications are sent through Resend to the organiser’s email inbox.
          This website does not maintain an application database or admin
          dashboard. The email service and inbox provider process and may retain
          the message and delivery records. Applications are not published to
          other applicants or shared with a proposed group without discussing
          that with you first. No advertising pixels are included.
        </p>
        <h2>Application security</h2>
        <p>
          Please do not submit accounts, client names, bank details or other
          sensitive records. A temporary hash of a connection identifier is used
          for per-instance submission limits. These counters expire after an
          hour and are not stored in a database.
        </p>
        <h2>Your choices</h2>
        <p>
          You can decline membership, withdraw your application or request
          correction or deletion. Applicant contact and retention arrangements
          will be finalised before a public launch. No fixed deletion period is
          currently automated.
        </p>
        <h2>Contact details</h2>
        <p>
          <strong>Placeholder for launch:</strong> public contact details and a
          scheduling link have not yet been supplied. This preview does not
          contain a working public contact address or automated call booking.
        </p>
        <h2>What applying means</h2>
        <p>
          Applying is free. It records interest in the proposed founding group
          and permits application-related contact. A place, meeting date or
          membership is not guaranteed. Membership pricing, dates, facilitator,
          confidentiality arrangements and final terms will be confirmed before
          any enrolment or payment. Public interviews or case studies would
          require separate permission.
        </p>
      </main>
      <Footer />
    </>
  );
}
