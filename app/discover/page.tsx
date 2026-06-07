import type { Metadata } from "next";
import Navbar         from "@/components/Navbar";
import SmoothScroll   from "@/components/SmoothScroll";
import Story3D        from "@/components/Story3D";
import Footer         from "@/components/Footer";
import WhatsAppFloat  from "@/components/WhatsAppFloat";

export const metadata: Metadata = {
  title: "The Story of Sri Lanka — PearlTrailLankaTours",
  description:
    "A continuous, real-time 3D journey through Sri Lanka — ocean, an island rising from the sea, mountains, fog and stars. The Pearl of the Indian Ocean.",
};

export default function DiscoverPage() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main className="relative z-10">
        <Story3D />
        <Footer />
      </main>
      <WhatsAppFloat />
    </>
  );
}
