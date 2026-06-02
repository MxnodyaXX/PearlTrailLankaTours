"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Hero() {
  const bgRef    = useRef<HTMLDivElement>(null);
  const midRef   = useRef<HTMLDivElement>(null);
  const mistRef  = useRef<HTMLDivElement>(null);
  const megaRef  = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef   = useRef<HTMLParagraphElement>(null);
  const btnsRef  = useRef<HTMLDivElement>(null);
  const hintRef  = useRef<HTMLDivElement>(null);

  /* ── Parallax scroll ──────────────────────────────────────────── */
  useEffect(() => {
    let raf: number;
    let ticking = false;

    const apply = () => {
      const y = window.scrollY;
      if (bgRef.current)   bgRef.current.style.transform   = `translateY(${y * 0.38}px) scale(1.18)`;
      if (midRef.current)  midRef.current.style.transform  = `translateY(${y * 0.22}px) scale(1.12)`;
      if (mistRef.current) mistRef.current.style.transform = `translateY(${y * 0.55}px)`;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { raf = requestAnimationFrame(apply); ticking = true; }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  /* ── Entrance reveal ──────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(megaRef.current,  { y: 90, opacity: 0 });
      gsap.set(badgeRef.current, { scale: 0.82, opacity: 0 });
      gsap.set([line1Ref.current, line2Ref.current], { y: "115%" });
      gsap.set(subRef.current,   { y: 28, opacity: 0 });
      gsap.set(hintRef.current,  { opacity: 0 });
      if (btnsRef.current)
        gsap.set(Array.from(btnsRef.current.children), { y: 22, opacity: 0 });

      const tl = gsap.timeline({ delay: 0.1 });

      tl.to(megaRef.current,  { y: 0, opacity: 1, duration: 1.5, ease: "power2.out" }, 0)
        .to(badgeRef.current, { scale: 1, opacity: 1, duration: 0.75, ease: "back.out(1.7)" }, 0.3)
        .to(line1Ref.current, { y: "0%", duration: 1.05, ease: "power3.out" }, 0.48)
        .to(line2Ref.current, { y: "0%", duration: 1.05, ease: "power3.out" }, 0.64)
        .to(subRef.current,   { y: 0, opacity: 1, duration: 0.85, ease: "power2.out" }, 0.88)
        .to(hintRef.current,  { opacity: 1, duration: 0.7 }, 1.6);

      if (btnsRef.current)
        tl.to(Array.from(btnsRef.current.children), {
          y: 0, opacity: 1, stagger: 0.13, duration: 0.72, ease: "power2.out",
        }, 1.04);
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020617]">

      {/* ── 1. Dark grunge texture photo — slowest parallax ─────── */}
      <div
        ref={bgRef}
        className="absolute inset-[-18%] bg-cover bg-center will-change-transform"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1920&q=85')",
          transform: "scale(1.18)",
        }}
      />

      {/* ── 2. Depth mid-layer — parallax 0.22× ──────────────────── */}
      <div
        ref={midRef}
        className="absolute inset-[-12%] will-change-transform pointer-events-none"
        style={{ zIndex: 1, transform: "scale(1.12)" }}
      />

      {/* ── 3. Colour-grade + full bottom dissolve ───────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(2,6,23,.55) 65%, rgba(2,6,23,.88) 82%, #020617 100%)",
        }}
      />

      {/* ── 4. Near layer — parallax 0.55× ───────────────────────── */}
      <div
        ref={mistRef}
        className="absolute inset-[-8%] will-change-transform pointer-events-none"
        style={{ zIndex: 3, transform: "scale(1.08)" }}
      />

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="relative z-10 text-center w-[min(1050px,90%)] pt-16 pb-8 select-none">

        {/* Mega watermark */}
        <div
          ref={megaRef}
          className="font-black leading-none mb-8 text-white/[.13] pointer-events-none"
          style={{ fontSize: "clamp(68px,15vw,200px)", letterSpacing: "-0.06em" }}
        >
          PEARLTRAIL
        </div>

        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 mb-4 bg-white/[.12] border border-white/[.16] px-4 py-2.5 rounded-full backdrop-blur-xl text-[11px] font-black tracking-widest uppercase"
        >
          <span>🇱🇰</span> Premium Sri Lanka Travel Partner
        </div>

        {/* Heading — each line inside overflow:hidden for slide-up reveal */}
        <h1
          className="font-black text-white leading-[.94] mb-5"
          style={{ fontSize: "clamp(38px,6.5vw,82px)", letterSpacing: "-0.04em" }}
        >
          <div style={{ overflow: "hidden" }}>
            <span ref={line1Ref} className="block">Explore Sri Lanka</span>
          </div>
          <div style={{ overflow: "hidden" }}>
            <span ref={line2Ref} className="block text-gold italic">beyond the ordinary.</span>
          </div>
        </h1>

        {/* Sub */}
        <p ref={subRef} className="text-[#dbeafe] text-lg leading-relaxed max-w-2xl mx-auto mb-8">
          Luxury tours, airport transfers, hotel bookings, vehicle rentals,
          and complete travel assistance — crafted for unforgettable journeys.
        </p>

        {/* CTAs */}
        <div ref={btnsRef} className="flex flex-wrap justify-center gap-3 mb-10">
          <Link
            href="/packages"
            className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black px-6 py-3.5 rounded-full text-sm transition-all hover:-translate-y-0.5 shadow-[0_12px_30px_rgba(246,185,59,.35)]"
          >
            Explore Packages
          </Link>
          <Link
            href="/contact"
            className="bg-white/[.12] border border-white/[.18] hover:bg-white/[.2] text-white font-black px-6 py-3.5 rounded-full text-sm backdrop-blur-xl transition-all"
          >
            Plan My Trip
          </Link>
          <a
            href="https://wa.me/94741838376"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3.5 rounded-full text-sm transition-all hover:-translate-y-0.5 flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp
          </a>
        </div>

        {/* Scroll hint */}
        <div ref={hintRef} className="flex flex-col items-center gap-2 text-[10px] font-black tracking-[.2em] uppercase text-white/40 mt-4">
          <div className="w-5 h-8 rounded-full border border-white/30 flex justify-center pt-1.5">
            <div className="w-0.5 h-2 bg-white/60 rounded-full animate-bounce" />
          </div>
          Scroll to Explore
        </div>
      </div>
    </section>
  );
}
