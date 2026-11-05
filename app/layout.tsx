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
    default: "Field Council — A private table for surveying owners",
    template: "%s | Field Council",
  },
  description:
    "A confidential peer council for independent US land-surveying firm owners. Compare financials, work through decisions and help shape the founding group.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "You know your land. Know your business.",
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
