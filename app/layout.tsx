import type { Metadata, Viewport } from "next";
import { Caveat, Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { contact, photo, site } from "@/data/site";
import { experience } from "@/data/experience";

const body = Hanken_Grotesk({ subsets: ["latin"], variable: "--ff-body", display: "swap" });
const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--ff-display", display: "swap" });
const hand = Caveat({ subsets: ["latin"], weight: ["500", "700"], variable: "--ff-hand", display: "swap" });
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.title}`,
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  alternates: { canonical: site.url },
  icons: { icon: `${base}/favicon.svg` },
  openGraph: {
    type: "profile",
    url: site.url,
    siteName: site.name,
    locale: "en_US",
    title: `${site.name} — ${site.title}`,
    description: site.description,
    images: [{ url: `${base}/images/profile.jpg`, alt: photo.alt }],
  },
  twitter: {
    card: "summary",
    title: `${site.name} — ${site.title}`,
    description: site.description,
    images: [`${base}/images/profile.jpg`],
  },
};

// Structured data for search engines. Only facts already published on the site.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  image: new URL("images/profile.jpg", site.url).toString(),
  jobTitle: experience[0]?.role,
  worksFor: experience[0] && { "@type": "Organization", name: experience[0].company },
  address: { "@type": "PostalAddress", addressLocality: "Dhaka", addressCountry: "BD" },
  knowsAbout: ["Python", "Web scraping", "Automation", "Data processing", "Data quality assurance", "AI agents"],
  sameAs: [contact.github, contact.linkedin].filter(Boolean),
};

export const viewport: Viewport = { themeColor: "#F3EFE6" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} ${hand.variable}`} suppressHydrationWarning>
      {/* browser extensions (e.g. Grammarly) add attributes to <body>; ignore that mismatch */}
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          // static, build-time JSON (no user input); escape "<" so it can't close the script tag
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
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
