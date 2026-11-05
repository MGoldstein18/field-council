import type { Metadata } from "next";
import { Header } from "../shared";
import { redirect } from "next/navigation";
import { isAdmin } from "../../lib/admin";
import Dashboard from "./dashboard";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Application review",
  robots: { index: false, follow: false },
};
export default async function Admin() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <>
      <Header simple />
      <main id="main" className="admin">
        <p className="eyebrow">FIELD COUNCIL · PRIVATE APPLICATION REVIEW</p>
        <h1>The founding-member desk.</h1>
        <p className="admin-intro">
          Review firms, keep your notes and organise the next conversation.
          Status changes do not send emails.
        </p>
        <form action="/api/admin/logout" method="post" className="admin-logout">
          <button className="button outline" type="submit">
            Sign out
          </button>
        </form>
        <Dashboard />
      </main>
    </>
  );
}
