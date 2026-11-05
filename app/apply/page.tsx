import type { Metadata } from "next";
import { Header, Footer } from "../shared";
import ApplicationForm from "./application-form";
export const metadata: Metadata = { title: "Apply for the founding council" };
export default function Apply() {
  return (
    <>
      <Header simple />
      <main id="main" className="form-page">
        <ApplicationForm />
      </main>
      <Footer />
    </>
  );
}
