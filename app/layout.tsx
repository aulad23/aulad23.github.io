import type { Metadata, Viewport } from "next";
import { Caveat, Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";

const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--ff-body", display: "swap" });
const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--ff-display", display: "swap" });
const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--ff-hand", display: "swap" });
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.title}`,
  description: site.description,
  icons: { icon: `${base}/favicon.svg` },
  openGraph: {
    type: "website",
    url: site.url,
    title: `${site.name} — ${site.title}`,
    description: site.description,
    images: [{ url: `${base}/images/profile.jpg`, alt: site.name }],
  },
  twitter: {
    card: "summary",
    title: `${site.name} — ${site.title}`,
    description: site.description,
  },
};

export const viewport: Viewport = { themeColor: "#F3EFE6" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} ${hand.variable}`} suppressHydrationWarning>
      {/* browser extensions (e.g. Grammarly) add attributes to <body>; ignore that mismatch */}
      <body suppressHydrationWarning>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
