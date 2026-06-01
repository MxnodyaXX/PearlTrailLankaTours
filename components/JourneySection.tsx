"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Panel {
  kicker:  string;
  heading: string;
  body:    string;
  img:     string;
  badge:   string;
  sub:     string;
  href:    string;
}

const panels: Panel[] = [
  {
    kicker:  "01 · Ancient Wonders",
    heading: "Begin with ancient Sri Lanka.",
    body:    "Discover Sigiriya, Dambulla, Kandy, and Anuradhapura through curated cultural tours, private guides, premium vehicles, and handpicked boutique stays.",
    img:     "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
    badge:   "Heritage Tours",
    sub:     "Sigiriya · Kandy · Anuradhapura",
    href:    "/packages#kandy",
  },
  {
    kicker:  "02 · Misty Highlands",
    heading: "Ride through misty tea country.",
    body:    "From Kandy to Ella — experience lush tea estates, the iconic Nine Arch Bridge, Ravana Falls, private drivers, and cosy hill-country villas.",
    img:     "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=80",
    badge:   "Hill Country Escape",
    sub:     "Ella · Nuwara Eliya · Tea Estates",
    href:    "/packages#ella",
  },
  {
    kicker:  "03 · Wild Sri Lanka",
    heading: "Safari moments unlike any other.",
    body:    "Yala and Udawalawe wildlife experiences with jeep reservations, naturalist guides, safari-side lodges, and full itinerary management.",
    img:     "https://images.unsplash.com/photo-1590862891-d5545e1d6e4a?auto=format&fit=crop&w=1200&q=80",
    badge:   "Wildlife Safari",
    sub:     "Yala · Udawalawe · Wilpattu",
    href:    "/packages",
  },
  {
    kicker:  "04 · Golden Shores",
    heading: "End beside the Indian Ocean.",
    body:    "Mirissa, Galle, Bentota, and Unawatuna become premium beach escapes with whale watching, surf lessons, ocean villas, and sunset transfers.",
    img:     "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
    badge:   "South Coast",
    sub:     "Mirissa · Galle · Bentota",
    href:    "/packages#southern",
  },
];

export default function JourneySection() {
  return (
    <section className="bg-[#020617] py-12 md:py-36">
      {panels.map((p, i) => (
        <PanelRow key={i} panel={p} reverse={i % 2 !== 0} />
      ))}
    </section>
  );
}

function PanelRow({ panel, reverse }: { panel: Panel; reverse: boolean }) {
  const imgRef    = useRef<HTMLImageElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const textRef   = useRef<HTMLDivElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const headRef   = useRef<HTMLHeadingElement>(null);
  const bodyRef   = useRef<HTMLParagraphElement>(null);
  const linkRef   = useRef<HTMLAnchorElement>(null);

  /* ── Image parallax ─────────────────────────────────────────── */
  useEffect(() => {
    const handle = () => {
      if (!wrapRef.current || !imgRef.current) return;
      const rect     = wrapRef.current.getBoundingClientRect();
      const progress = (rect.top - window.innerHeight / 2) / window.innerHeight;
      const clamped  = Math.max(-1, Math.min(1, progress));
      imgRef.current.style.transform = `translateY(${clamped * -40}px)`;
    };
    window.addEventListener("scroll", handle, { passive: true });
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, []);

  /* ── Scroll reveal ──────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(wrapRef.current, { clipPath: "inset(48% 0% 48% 0%)" });
      gsap.to(wrapRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.2,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      const els = [kickerRef.current, headRef.current, bodyRef.current, linkRef.current].filter(Boolean);
      gsap.set(els, { y: 40, opacity: 0 });
      gsap.to(els, {
        y: 0,
        opacity: 1,
        stagger: 0.13,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      className={`w-[min(1120px,calc(100%-32px))] mx-auto
        grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center
        py-8 md:py-20
        ${reverse ? "md:[direction:rtl]" : ""}`}
    >
      {/* Text */}
      <div ref={textRef} className="md:[direction:ltr]">
        <p ref={kickerRef} className="text-gold text-[11px] font-black uppercase tracking-[.18em] mb-3">
          {panel.kicker}
        </p>
        <h2
          ref={headRef}
          className="font-black text-white leading-[.97] mb-4"
          style={{ fontSize: "clamp(26px,4.5vw,64px)", letterSpacing: "-0.03em" }}
        >
          {panel.heading}
        </h2>
        <p ref={bodyRef} className="text-[#94a3b8] text-[15px] md:text-[17px] leading-relaxed max-w-[500px] mb-6 md:mb-8">
          {panel.body}
        </p>
        <Link
          ref={linkRef}
          href={panel.href}
          className="inline-flex items-center gap-2 bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-6 py-3 rounded-full transition-all hover:-translate-y-0.5"
        >
          Explore This Route →
        </Link>
      </div>

      {/* Image */}
      <div
        ref={wrapRef}
        data-glow
        className="md:[direction:ltr] relative h-[260px] sm:h-[380px] md:h-[540px] rounded-[24px] md:rounded-[36px] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,.5)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={panel.img}
          alt={panel.heading}
          className="w-full object-cover"
          style={{ height: "120%", marginTop: "-5%", transition: "transform .05s linear" }}
        />
        <div className="absolute left-4 bottom-4 bg-white/85 backdrop-blur-xl text-[#0f172a] rounded-xl md:rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-lg">
          <p className="font-black text-xs md:text-sm leading-tight">{panel.badge}</p>
          <p className="text-slate-500 text-[11px] font-bold mt-0.5">{panel.sub}</p>
        </div>
      </div>
    </div>
  );
}
