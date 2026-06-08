"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import type { TourPackage } from "@/lib/packages-data";
import RouteMapSection from "@/components/RouteMapSection";

gsap.registerPlugin(ScrollTrigger);

export default function PackageDetailClient({ pkg }: { pkg: TourPackage }) {
  const heroRef = useRef<HTMLElement>(null);
  const heroImgRef = useRef<HTMLImageElement>(null);

  const hasItinerary = pkg.itinerary.length > 0;
  const waText = encodeURIComponent(`I'm interested in the ${pkg.title}`);
  const stops = hasItinerary ? pkg.itinerary.length : pkg.desc.split(" · ").length;

  const facts = [
    { l: "Duration", v: pkg.days },
    { l: "From", v: pkg.price },
    { l: hasItinerary ? "Itinerary" : "Highlights", v: hasItinerary ? `${pkg.itinerary.length} Days` : `${stops} Stops` },
    { l: "Travel Style", v: "Private · Guided" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero — slow zoom + drift on scroll (cinematic Ken-Burns)
      if (heroImgRef.current && heroRef.current) {
        gsap.fromTo(heroImgRef.current,
          { y: 0, scale: 1.06 },
          { y: 120, scale: 1.16, ease: "none",
            scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1.5 } });
      }
      // Generic reveal for marked blocks
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 84%" } });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={heroImgRef} src={pkg.img} alt={pkg.title}
          className="absolute inset-0 w-full h-full object-cover" style={{ transformOrigin: "center" }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(2,6,23,0.72) 0%, rgba(2,6,23,0.1) 28%, rgba(2,6,23,0.08) 50%, rgba(2,6,23,0.7) 76%, rgba(2,6,23,1) 100%)",
        }} />

        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-24 w-[min(1200px,100%)] mx-auto">
          <p className="text-gold text-[10px] md:text-[11px] font-black uppercase tracking-[.24em] mb-4">
            {pkg.days}&nbsp;&nbsp;·&nbsp;&nbsp;Starting from {pkg.price}
          </p>
          <h1 className="text-white font-black leading-[.9] mb-5" style={{ fontSize: "clamp(2.8rem,7.5vw,7rem)", letterSpacing: "-0.03em" }}>
            {pkg.title}
          </h1>
          <p className="text-white/60 text-base md:text-xl max-w-xl mb-9 leading-relaxed">{pkg.tagline}</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-6 py-3 rounded-full transition-all">Inquire Now</Link>
            <a href={`https://wa.me/94741838376?text=${waText}`} target="_blank" rel="noopener noreferrer" className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm px-6 py-3 rounded-full transition-all">WhatsApp Us</a>
            <Link href="/packages" className="bg-white/[.08] hover:bg-white/[.14] border border-white/[.12] text-white font-black text-sm px-6 py-3 rounded-full transition-all">← All Tours</Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/30 text-[9px] font-black uppercase tracking-[.2em]">Scroll</span>
          <div className="w-px bg-white/20 overflow-hidden" style={{ height: 48 }}>
            <div className="w-full bg-gold" style={{ height: "50%", animation: "scrollLine 1.8s ease-in-out infinite" }} />
          </div>
        </div>
      </section>
      <style>{`@keyframes scrollLine{0%{transform:translateY(-100%)}100%{transform:translateY(300%)}}`}</style>

      {/* ── QUICK FACTS ────────────────────────────────────────── */}
      <section className="bg-[#020617] border-b border-white/[.06]">
        <div className="w-[min(1120px,100%)] mx-auto grid grid-cols-2 md:grid-cols-4">
          {facts.map((f, i) => (
            <div key={f.l} className={`px-6 py-7 md:py-9 ${i < 3 ? "md:border-r" : ""} ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b md:border-b-0" : ""} border-white/[.06]`}>
              <p className="text-white/35 text-[10px] font-black uppercase tracking-[.18em] mb-2">{f.l}</p>
              <p className="text-white font-black text-lg md:text-2xl" style={{ letterSpacing: "-0.02em" }}>{f.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OVERVIEW ───────────────────────────────────────────── */}
      <section className="bg-[#020617] py-20 md:py-28 px-6 md:px-16">
        <div className="w-[min(920px,100%)] mx-auto">
          <p className="reveal text-gold text-[10px] font-black uppercase tracking-[.22em] mb-3">About This Journey</p>
          <h2 className="reveal text-white font-black mb-7" style={{ fontSize: "clamp(1.8rem,4vw,3.2rem)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            What Awaits You
          </h2>
          <p className="reveal text-white/65 text-base md:text-lg leading-relaxed max-w-3xl mb-10">{pkg.overview}</p>

          {!hasItinerary && (
            <div className="reveal flex flex-wrap gap-2 mb-10">
              {pkg.desc.split(" · ").map((stop) => (
                <span key={stop} className="bg-white/[.07] border border-white/[.1] text-white/70 text-xs font-semibold px-3.5 py-1.5 rounded-full">{stop}</span>
              ))}
            </div>
          )}

          <div className="reveal grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-5">
              <p className="text-emerald-400 font-black text-[10px] uppercase tracking-wider mb-2">Included</p>
              <p className="text-white/70 leading-relaxed text-sm">{pkg.inc}</p>
            </div>
            <div className="bg-white/[.04] border border-white/[.07] rounded-2xl px-6 py-5">
              <p className="text-white/35 font-black text-[10px] uppercase tracking-wider mb-2">Not Included</p>
              <p className="text-white/50 leading-relaxed text-sm">{pkg.exc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── DAY-BY-DAY GUIDE (map-synced) ──────────────────────── */}
      {hasItinerary && <RouteMapSection days={pkg.itinerary} />}

      {/* ── BOOK CTA ───────────────────────────────────────────── */}
      <section className="bg-[#020617] py-24 md:py-28 px-6 md:px-16 text-center border-t border-white/[.06]">
        <div className="max-w-2xl mx-auto">
          <p className="reveal text-gold text-[10px] font-black uppercase tracking-[.24em] mb-4">Begin Your Journey</p>
          <h2 className="reveal text-white font-black mb-5" style={{ fontSize: "clamp(2rem,5vw,4.5rem)", letterSpacing: "-0.03em", lineHeight: 1.02 }}>Ready to Go?</h2>
          <p className="reveal text-white/50 text-base md:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
            Tell us your travel dates and group size — we&apos;ll put together a personalised quote within 24 hours.
          </p>
          <div className="reveal flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-8 py-3.5 rounded-full transition-all">Send an Enquiry</Link>
            <a href={`https://wa.me/94741838376?text=${waText}`} target="_blank" rel="noopener noreferrer" className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm px-8 py-3.5 rounded-full transition-all">Chat on WhatsApp</a>
            <Link href="/packages" className="bg-white/[.06] hover:bg-white/[.1] border border-white/[.09] text-white font-black text-sm px-8 py-3.5 rounded-full transition-all">View All Tours</Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
