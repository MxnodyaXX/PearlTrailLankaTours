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

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Immediately hide all day reveal elements so they animate in on scroll
      gsap.set(".day-reveal", { opacity: 0, y: 55 });

      // Hero image slow parallax
      if (heroImgRef.current && heroRef.current) {
        gsap.fromTo(
          heroImgRef.current,
          { y: 0 },
          {
            y: 120,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.5,
            },
          }
        );
      }

      // Day section: image parallax + content stagger reveal
      document.querySelectorAll(".day-section").forEach((section) => {
        const img = section.querySelector(".day-bg-img");
        const reveals = section.querySelectorAll(".day-reveal");

        if (img) {
          gsap.fromTo(
            img,
            { y: -60 },
            {
              y: 60,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5,
              },
            }
          );
        }

        if (reveals.length) {
          gsap.to(reveals, {
            opacity: 1,
            y: 0,
            stagger: 0.13,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 72%",
            },
          });
        }
      });

      // Overview section fade-in
      gsap.fromTo(
        ".overview-reveal",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".overview-section",
            start: "top 75%",
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const waText = encodeURIComponent(`I'm interested in the ${pkg.title}`);
  const hasItinerary = pkg.itinerary.length > 0;

  return (
    <>
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={heroImgRef}
          src={pkg.img}
          alt={pkg.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transformOrigin: "center center" }}
        />

        {/* Layered gradient — dark top for navbar, window in middle, heavy fade at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(2,6,23,0.72) 0%, rgba(2,6,23,0.1) 28%, rgba(2,6,23,0.08) 52%, rgba(2,6,23,0.65) 75%, rgba(2,6,23,1) 100%)",
          }}
        />

        {/* Content — anchored to bottom-left */}
        <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-20 max-w-[1200px] mx-auto">
          <p className="text-gold text-[10px] font-black uppercase tracking-[.24em] mb-4">
            {pkg.days}&nbsp;&nbsp;·&nbsp;&nbsp;Starting from {pkg.price}
          </p>

          <h1
            className="text-white font-black leading-[.9] mb-5"
            style={{
              fontSize: "clamp(2.8rem, 7.5vw, 7.5rem)",
              letterSpacing: "-0.03em",
            }}
          >
            {pkg.title}
          </h1>

          <p className="text-white/55 text-base md:text-xl max-w-xl mb-9 leading-relaxed">
            {pkg.tagline}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-6 py-3 rounded-full transition-all"
            >
              Inquire Now
            </Link>
            <a
              href={`https://wa.me/94741838376?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm px-6 py-3 rounded-full transition-all"
            >
              WhatsApp Us
            </a>
            <Link
              href="/packages"
              className="bg-white/[.08] hover:bg-white/[.14] border border-white/[.12] text-white font-black text-sm px-6 py-3 rounded-full transition-all"
            >
              ← All Tours
            </Link>
          </div>
        </div>

        {/* Animated scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-white/25 text-[9px] font-black uppercase tracking-[.2em]">
            Scroll
          </span>
          <div
            className="w-px bg-white/20 overflow-hidden"
            style={{ height: 48 }}
          >
            <div
              className="w-full bg-gold"
              style={{
                height: "50%",
                animation: "scrollLine 1.8s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </section>

      {/* Scroll line keyframe */}
      <style>{`
        @keyframes scrollLine {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>

      {/* ── OVERVIEW ────────────────────────────────────────────── */}
      <section className="overview-section bg-[#020617] py-24 px-6 md:px-16">
        <div className="w-[min(920px,100%)] mx-auto">
          <p className="overview-reveal text-gold text-[10px] font-black uppercase tracking-[.22em] mb-3">
            About This Journey
          </p>
          <h2
            className="overview-reveal text-white font-black mb-7"
            style={{
              fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            What Awaits You
          </h2>
          <p className="overview-reveal text-white/65 text-base md:text-lg leading-relaxed max-w-3xl mb-10">
            {pkg.overview}
          </p>

          {/* Stop highlights — shown for packages without a full itinerary */}
          {!hasItinerary && (
            <div className="overview-reveal flex flex-wrap gap-2 mb-10">
              {pkg.desc.split(" · ").map((stop) => (
                <span
                  key={stop}
                  className="bg-white/[.07] border border-white/[.1] text-white/70 text-xs font-semibold px-3.5 py-1.5 rounded-full"
                >
                  {stop}
                </span>
              ))}
            </div>
          )}

          <div className="overview-reveal grid sm:grid-cols-2 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-6 py-5">
              <p className="text-emerald-400 font-black text-[10px] uppercase tracking-wider mb-2">
                Included
              </p>
              <p className="text-white/70 leading-relaxed text-sm">{pkg.inc}</p>
            </div>
            <div className="bg-white/[.04] border border-white/[.07] rounded-2xl px-6 py-5">
              <p className="text-white/35 font-black text-[10px] uppercase tracking-wider mb-2">
                Not Included
              </p>
              <p className="text-white/50 leading-relaxed text-sm">{pkg.exc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROUTE MAP ───────────────────────────────────────────── */}
      {hasItinerary && <RouteMapSection days={pkg.itinerary} />}

      {/* ── ITINERARY ───────────────────────────────────────────── */}
      {hasItinerary && (
        <>
          {/* Section intro */}
          <div className="bg-[#020617] px-6 md:px-16 pt-2 pb-6">
            <div className="w-[min(920px,100%)] mx-auto border-t border-white/[.07] pt-10">
              <p className="text-gold text-[10px] font-black uppercase tracking-[.22em] mb-2">
                Day by Day
              </p>
              <h2
                className="text-white font-black"
                style={{
                  fontSize: "clamp(1.8rem, 4vw, 3.2rem)",
                  letterSpacing: "-0.02em",
                }}
              >
                Your Journey Unfolds
              </h2>
            </div>
          </div>

          {/* Day sections */}
          {pkg.itinerary.map((day) => (
            <section
              key={day.day}
              className="day-section relative overflow-hidden"
              style={{ minHeight: "95vh" }}
            >
              {/* Background image — slightly oversized so parallax has room */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={day.img}
                alt={day.title}
                className="day-bg-img absolute inset-0 w-full h-full object-cover"
                style={{ height: "115%", top: "-7.5%", bottom: "-7.5%" }}
              />

              {/* Gradient: transparent top → heavy dark bottom */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(2,6,23,0.98) 0%, rgba(2,6,23,0.82) 28%, rgba(2,6,23,0.4) 55%, rgba(2,6,23,0.1) 100%)",
                }}
              />

              {/* Giant faded day number — decorative background element */}
              <div
                className="absolute top-1/2 right-4 md:right-12 -translate-y-1/2 font-black text-white pointer-events-none select-none leading-none"
                style={{
                  fontSize: "clamp(9rem, 25vw, 22rem)",
                  opacity: 0.04,
                  letterSpacing: "-0.06em",
                }}
              >
                {String(day.day).padStart(2, "0")}
              </div>

              {/* Content — bottom aligned */}
              <div
                className="relative z-10 flex flex-col justify-end px-6 md:px-16 pb-16 pt-48 max-w-[1200px] mx-auto"
                style={{ minHeight: "95vh" }}
              >
                {/* Day label + location */}
                <p className="day-reveal text-gold text-[10px] font-black uppercase tracking-[.24em] mb-3">
                  Day {day.day}&nbsp;&nbsp;·&nbsp;&nbsp;{day.subtitle}
                </p>

                {/* Day title */}
                <h2
                  className="day-reveal text-white font-black leading-tight mb-5"
                  style={{
                    fontSize: "clamp(2rem, 5.5vw, 5.5rem)",
                    letterSpacing: "-0.025em",
                  }}
                >
                  {day.title}
                </h2>

                {/* Description */}
                <p className="day-reveal text-white/65 text-base md:text-lg leading-relaxed max-w-2xl mb-8">
                  {day.description}
                </p>

                {/* Highlight pills */}
                <div className="day-reveal flex flex-wrap gap-2 mb-8">
                  {day.highlights.map((h) => (
                    <span
                      key={h}
                      className="bg-white/[.09] backdrop-blur-sm border border-white/[.14] text-white/75 text-[11px] font-semibold px-3.5 py-1.5 rounded-full"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Stay */}
                <div className="day-reveal flex items-center gap-2">
                  <span className="text-white/25 text-[10px] font-black uppercase tracking-[.18em]">
                    Overnight
                  </span>
                  <span className="w-8 h-px bg-white/15" />
                  <span className="text-white/45 text-[10px] font-black uppercase tracking-[.18em]">
                    {day.stay}
                  </span>
                </div>
              </div>
            </section>
          ))}
        </>
      )}

      {/* ── BOOK CTA ────────────────────────────────────────────── */}
      <section className="bg-[#020617] py-28 px-6 md:px-16 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-gold text-[10px] font-black uppercase tracking-[.24em] mb-4">
            Begin Your Journey
          </p>
          <h2
            className="text-white font-black mb-5"
            style={{
              fontSize: "clamp(2rem, 5vw, 4.5rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
            }}
          >
            Ready to Go?
          </h2>
          <p className="text-white/50 text-base md:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
            Tell us your travel dates and group size and we will put together a
            personalised quote within 24 hours.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-8 py-3.5 rounded-full transition-all"
            >
              Send an Enquiry
            </Link>
            <a
              href={`https://wa.me/94741838376?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm px-8 py-3.5 rounded-full transition-all"
            >
              Chat on WhatsApp
            </a>
            <Link
              href="/packages"
              className="bg-white/[.06] hover:bg-white/[.1] border border-white/[.09] text-white font-black text-sm px-8 py-3.5 rounded-full transition-all"
            >
              View All Tours
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
