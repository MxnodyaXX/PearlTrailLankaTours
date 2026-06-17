import Navbar          from "@/components/Navbar";
import Hero            from "@/components/Hero";
import SearchBar       from "@/components/SearchBar";
import JourneySection  from "@/components/JourneySection";
import ExperienceCards from "@/components/ExperienceCards";
import TripPlanner     from "@/components/TripPlanner";
import StatsBar        from "@/components/StatsBar";
import GalleryMotion    from "@/components/GalleryMotion";
import Testimonials    from "@/components/Testimonials";
import FAQ             from "@/components/FAQ";
import Footer          from "@/components/Footer";
import WhatsAppFloat   from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <SearchBar />
      <JourneySection />
      <ExperienceCards />
      <TripPlanner />
      <StatsBar />
      <GalleryMotion />
      <Testimonials />
      <FAQ />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
