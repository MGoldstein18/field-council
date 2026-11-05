import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Header } from "../../shared";
import { authConfigured, isAdmin } from "../../../lib/admin";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Organiser sign-in",
  robots: { index: false, follow: false },
};
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;
  const configured = authConfigured();
  const message =
    error === "limited"
      ? "Too many attempts. Please try again in 15 minutes."
      : error === "unavailable"
        ? "Sign-in is temporarily unavailable. Please try again later."
        : error
          ? "The password was not accepted."
          : "";
  return (
    <>
      <Header simple />
      <main id="main" className="legal wrap login-page">
        <p className="eyebrow">FIELD COUNCIL · ORGANISER ACCESS</p>
        <h1>
          The private
          <br />
          <em>member desk.</em>
        </h1>
        <p>
          Sign in to review applications and organise the next conversation.
        </p>
        {configured ? (
          <form action="/api/admin/login" method="post" className="login-form">
            <label htmlFor="password">Admin password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={256}
            />
            {message && (
              <p className="form-error" role="alert">
                {message}
              </p>
            )}
            <button type="submit" className="button">
              Sign in
            </button>
          </form>
        ) : (
          <p className="form-error" role="alert">
            Admin access has not been configured. The organiser must set the
            private credentials before signing in.
          </p>
        )}
      </main>
    </>
  );
}
