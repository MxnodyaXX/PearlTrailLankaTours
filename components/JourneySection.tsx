"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

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
    <section className="bg-[#020617] py-24 md:py-36">
      {panels.map((p, i) => (
        <PanelRow key={i} panel={p} reverse={i % 2 !== 0} />
      ))}
    </section>
  );
}

function PanelRow({ panel, reverse }: { panel: Panel; reverse: boolean }) {
  const imgRef  = useRef<HTMLImageElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = () => {
      if (!wrapRef.current || !imgRef.current) return;
      const rect     = wrapRef.current.getBoundingClientRect();
      const progress = (rect.top - window.innerHeight / 2) / window.innerHeight;
      const clamped  = Math.max(-1, Math.min(1, progress));
      imgRef.current.style.transform = `translateY(${clamped * -60}px)`;
    };
    window.addEventListener("scroll", handle, { passive: true });
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <div
      className={`w-[min(1120px,calc(100%-40px))] mx-auto
        grid grid-cols-1 md:grid-cols-2 gap-12 items-center
        min-h-[680px] py-12 md:py-20
        ${reverse ? "md:[direction:rtl]" : ""}`}
    >
      {/* Text */}
      <div className="md:[direction:ltr]">
        <p className="text-gold text-[11px] font-black uppercase tracking-[.18em] mb-3">
          {panel.kicker}
        </p>
        <h2
          className="font-black text-white leading-[.97] mb-5"
          style={{ fontSize: "clamp(32px,4.5vw,64px)", letterSpacing: "-0.03em" }}
        >
          {panel.heading}
        </h2>
        <p className="text-[#94a3b8] text-[17px] leading-relaxed max-w-[500px] mb-8">
          {panel.body}
        </p>
        <Link
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
        className="md:[direction:ltr] relative h-[480px] md:h-[540px] rounded-[36px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,.5)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={panel.img}
          alt={panel.heading}
          className="w-full object-cover"
          style={{ height: "120%", marginTop: "-5%", transition: "transform .05s linear" }}
        />
        {/* Badge */}
        <div className="absolute left-5 bottom-5 bg-white/85 backdrop-blur-xl text-[#0f172a] rounded-2xl px-4 py-3 shadow-lg">
          <p className="font-black text-sm leading-tight">{panel.badge}</p>
          <p className="text-slate-500 text-xs font-bold mt-0.5">{panel.sub}</p>
        </div>
      </div>
    </div>
  );
}
