import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";
import PageTransition from "@/components/PageTransition";
import SettingsProvider from "@/components/SettingsProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});


const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pearltraillankatour.com";
const SITE_NAME = "Pearl Trail Lanka Tours";
const TITLE = "Pearl Trail Lanka Tours - Explore Sri Lanka Beyond the Ordinary";
const DESCRIPTION =
  "Premium Sri Lanka tour packages, airport transfers, rent-a-car, hotel bookings and complete travel assistance. Based in Colombo, Sri Lanka.";

export const metadata: Metadata = {
  // Required so the generated icon/OG image URLs are absolute.
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  applicationName: SITE_NAME,
  description: DESCRIPTION,
  keywords: "Pearl Trail Lanka Tours, Sri Lanka tours, tour packages, rent a car Sri Lanka, airport transfer, Colombo",
  // og:image / twitter:image come from app/opengraph-image.png + app/twitter-image.png
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// Structured data — tells Google the business/site name so search shows
// "Pearl Trail Lanka Tours" as the site name instead of the bare domain.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      alternateName: "PearlTrailLankaTours",
      url: SITE_URL,
    },
    {
      "@type": "TravelAgency",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/icon.png`,
      image: `${SITE_URL}/opengraph-image.png`,
      description: DESCRIPTION,
      email: "pearltraillankatours@gmail.com",
      telephone: "+94717179956",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Colombo",
        addressCountry: "LK",
      },
      areaServed: "Sri Lanka",
      sameAs: [
        "https://facebook.com/pearltraillankatours",
        "https://instagram.com/pearltraillankatours",
        "https://tiktok.com/@pearltraillankatours",
        "https://youtube.com/@pearltraillankatours",
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SettingsProvider>
          <PageTransition />
          <CursorGlow />
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
