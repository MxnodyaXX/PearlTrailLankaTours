import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CursorGlow from "@/components/CursorGlow";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});


export const metadata: Metadata = {
  title: "PearlTrailLankaTours — Explore Sri Lanka Beyond the Ordinary",
  description:
    "Premium Sri Lanka tour packages, airport transfers, rent-a-car, hotel bookings and complete travel assistance. Based in Colombo, Sri Lanka.",
  keywords: "Sri Lanka tours, tour packages, rent a car Sri Lanka, airport transfer, Colombo, PearlTrailLankaTours",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full">
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
