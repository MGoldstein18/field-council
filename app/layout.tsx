import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: {
    default: "Field Council — A peer council for surveying owners",
    template: "%s | Field Council",
  },
  description:
    "A private peer council for independent US surveying owners. Compare financials, work through hiring and growth decisions, and apply to the founding group.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "You run the firm. You don’t have to figure it out alone.",
    description:
      "A private peer group for independent surveying firm owners. Applications for the founding council are open.",
    type: "website",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
