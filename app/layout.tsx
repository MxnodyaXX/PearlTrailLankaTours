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
const TITLE = "Pearl Trail Lanka Tours - Explore Sri Lanka Beyond the Ordinary";
const DESCRIPTION =
  "Premium Sri Lanka tour packages, airport transfers, rent-a-car, hotel bookings and complete travel assistance. Based in Colombo, Sri Lanka.";

export const metadata: Metadata = {
  // Required so the generated icon/OG image URLs are absolute.
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  keywords: "Sri Lanka tours, tour packages, rent a car Sri Lanka, airport transfer, Colombo, PearlTrailLankaTours",
  // og:image / twitter:image come from app/opengraph-image.png + app/twitter-image.png
  openGraph: {
    type: "website",
    siteName: "PearlTrail Lanka Tours",
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full">
        <SettingsProvider>
          <PageTransition />
          <CursorGlow />
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
