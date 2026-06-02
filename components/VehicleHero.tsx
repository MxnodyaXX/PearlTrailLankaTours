"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { n: "8+",   label: "Vehicle Types" },
  { n: "24/7", label: "Support" },
  { n: "100%", label: "English Drivers" },
  { n: "LKA",  label: "Island-wide" },
];

export default function VehicleHero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef      = useRef<HTMLDivElement>(null);
  const imgRef     = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  /* ── Parallax on scroll ─────────────────────────────────────── */
  useEffect(() => {
    let raf: number;
    let ticking = false;

    const apply = () => {
      const y = window.scrollY;
      if (bgRef.current)      bgRef.current.style.transform      = `translateY(${y * 0.40}px)`;
      if (imgRef.current)     imgRef.current.style.transform     = `translateY(${y * 0.22}px) scale(1.06)`;
      if (contentRef.current) contentRef.current.style.transform = `translateY(${y * 0.10}px)`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { raf = requestAnimationFrame(apply); ticking = true; }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  /* ── Entrance reveal ────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      if (!section) return;

      const kicker  = section.querySelector(".vh-kicker");
      const lines   = section.querySelectorAll(".vh-line");
      const desc    = section.querySelector(".vh-desc");
      const badges  = section.querySelectorAll(".vh-badge");
      const btns    = section.querySelectorAll(".vh-btn");
      const imgWrap = section.querySelector(".vh-img-wrap");
      const stats   = section.querySelectorAll(".vh-stat");

      gsap.set([kicker, desc, btns],  { opacity: 0, y: 24 });
      gsap.set(lines,                  { clipPath: "inset(0 0 100% 0)", y: 20 });
      gsap.set(badges,                 { opacity: 0, scale: 0.88 });
      gsap.set(imgWrap,                { clipPath: "inset(0 100% 0 0)", x: 40 });
      gsap.set(stats,                  { opacity: 0, y: 16 });

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(imgWrap,  { clipPath: "inset(0 0% 0 0)", x: 0, duration: 1.1, ease: "power3.inOut" }, 0)
        .to(kicker,   { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.3)
        .to(lines,    { clipPath: "inset(0 0 0% 0)", y: 0, stagger: 0.14, duration: 0.9, ease: "power3.out" }, 0.5)
        .to(desc,     { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.85)
        .to(badges,   { opacity: 1, scale: 1, stagger: 0.07, duration: 0.55, ease: "back.out(1.6)" }, 1.0)
        .to(btns,     { opacity: 1, y: 0, stagger: 0.1,  duration: 0.6, ease: "power2.out" }, 1.15)
        .to(stats,    { opacity: 1, y: 0, stagger: 0.08, duration: 0.55, ease: "power2.out" }, 1.25);
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#020617] flex flex-col"
    >
      {/* ── Background grain + ambient ──────────────────────────── */}
      <div ref={bgRef} className="absolute inset-[-12%] will-change-transform pointer-events-none" style={{ zIndex: 0 }}>
        <svg className="absolute inset-0 w-full h-full opacity-[0.17]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <filter id="vh-g3"><feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/></filter>
          <rect width="100%" height="100%" filter="url(#vh-g3)"/>
        </svg>
        <div className="absolute inset-0" style={{
          background: [
            "radial-gradient(ellipse 60% 70% at 75% 45%, rgba(246,185,59,.055) 0%, transparent 62%)",
            "radial-gradient(ellipse 55% 60% at 10% 30%, rgba(2,6,23,.9) 0%, transparent 55%)",
            "#020617",
          ].join(","),
        }}/>
      </div>

      {/* ── Vehicle image — right side, parallax ────────────────── */}
      <div
        ref={imgRef}
        className="absolute top-0 right-0 will-change-transform pointer-events-none"
        style={{ zIndex: 1, width: "62%", height: "108%", transform: "scale(1.06)" }}
      >
        <div className="vh-img-wrap w-full h-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1758411897832-9c1ff680fff3?auto=format&fit=crop&w=1400&q=90"
            alt="Premium 4×4 SUV"
            className="w-full h-full object-cover"
            style={{ objectPosition: "40% center" }}
          />
          {/* Left-edge blend so image melts into the dark left side */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to right, #020617 0%, rgba(2,6,23,.75) 18%, rgba(2,6,23,.25) 45%, transparent 70%)",
          }}/>
          {/* Top + bottom fade — image dissolves fully into dark */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(2,6,23,.55) 0%, transparent 22%, transparent 58%, rgba(2,6,23,.80) 78%, #020617 100%)",
          }}/>
        </div>
      </div>

      {/* ── Content — left column ────────────────────────────────── */}
      <div
        ref={contentRef}
        className="relative will-change-transform flex flex-col justify-center
          px-5 md:px-10 lg:px-16
          pt-[clamp(100px,16vh,140px)]
          pb-[clamp(80px,12vh,110px)]
          w-full lg:w-[52%]"
        style={{ zIndex: 10, minHeight: "100svh" }}
      >
        {/* Kicker */}
        <p className="vh-kicker text-gold text-[11px] font-black uppercase tracking-[.24em] mb-5">
          PearlTrail Lanka · Our Fleet
        </p>

        {/* Heading lines — each in overflow:hidden for clip-path reveal */}
        <h1 className="font-black text-white leading-[.93] mb-5" style={{ fontSize: "clamp(36px,6vw,82px)", letterSpacing: "-0.04em" }}>
          {["Sri Lanka's", "Premium", "Vehicle Fleet."].map((line, i) => (
            <div key={i} style={{ overflow: "hidden" }}>
              <span className={`vh-line block ${i === 2 ? "text-gold italic" : ""}`}>{line}</span>
            </div>
          ))}
        </h1>

        {/* Description */}
        <p className="vh-desc text-[#94a3b8] text-[15px] md:text-[16px] leading-relaxed max-w-[420px] mb-7">
          From tuk-tuks to luxury coaches — every vehicle comes with a professional,
          English-speaking driver and island-wide coverage.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          {["✓  Professional Drivers", "✓  Airport Transfers", "✓  Island-wide", "✓  24 / 7 Support"].map((b) => (
            <span key={b} className="vh-badge bg-white/[.07] border border-white/[.12] text-white/70 text-[11px] font-bold px-3.5 py-1.5 rounded-full">
              {b}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 mb-12 md:mb-16">
          <Link
            href="/contact"
            className="vh-btn bg-gold hover:bg-gold-deep text-[#0f172a] font-black px-7 py-3.5 rounded-full text-sm transition-all hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(246,185,59,.38)]"
          >
            Book a Vehicle
          </Link>
          <a
            href="#fleet"
            className="vh-btn bg-white/[.08] hover:bg-white/[.14] border border-white/[.14] text-white font-black px-7 py-3.5 rounded-full text-sm backdrop-blur-xl transition-all"
          >
            Explore Fleet ↓
          </a>
        </div>

        {/* Stats row */}
        <div className="border-t border-white/[.08] pt-7 grid grid-cols-4 gap-4 max-w-[400px]">
          {FEATURES.map((f) => (
            <div key={f.label} className="vh-stat">
              <p className="font-black text-white text-lg md:text-xl leading-none mb-1" style={{ letterSpacing: "-0.03em" }}>
                {f.n}
              </p>
              <p className="text-white/35 text-[10px] font-bold uppercase tracking-[.12em] leading-tight">{f.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom dissolve — tall fade so section blends seamlessly ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 11, height: "45%",
        background: "linear-gradient(to bottom, transparent 0%, rgba(2,6,23,.4) 40%, rgba(2,6,23,.82) 70%, #020617 100%)" }}/>
    </section>
  );
}
