"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    title: "Custom Tours",
    desc:  "Tailor-made Sri Lanka packages",
    img:   "https://images.unsplash.com/photo-1663784025074-49e9e7f11f62?auto=format&fit=crop&w=800&q=80",
    href:  "/packages",
  },
  {
    title: "Vehicle Rentals",
    desc:  "Cars, vans, SUVs and coaches",
    img:   "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80",
    href:  "/rent-a-car",
  },
  {
    title: "Hotel Booking",
    desc:  "Budget to luxury resorts",
    img:   "https://images.unsplash.com/photo-1704797390597-24dea42ffea8?auto=format&fit=crop&w=800&q=80",
    href:  "/travel-assistance",
  },
  {
    title: "Airport Transfers",
    desc:  "Arrival to departure support",
    img:   "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80",
    href:  "/travel-assistance",
  },
];

export default function ExperienceCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const kickerRef  = useRef<HTMLParagraphElement>(null);
  const headRef    = useRef<HTMLHeadingElement>(null);
  const descRef    = useRef<HTMLParagraphElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headerEls = [kickerRef.current, headRef.current, descRef.current].filter(Boolean);
      gsap.set(headerEls, { y: 36, opacity: 0 });
      gsap.to(headerEls, {
        y: 0, opacity: 1, stagger: 0.13, duration: 0.85, ease: "power2.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none none" },
      });

      if (gridRef.current) {
        const cardEls = Array.from(gridRef.current.children);
        gsap.set(cardEls, { clipPath: "inset(0 0 100% 0)", scale: 1.04 });
        gsap.to(cardEls, {
          clipPath: "inset(0 0 0% 0)", scale: 1, stagger: 0.12, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: gridRef.current, start: "top 82%", toggleActions: "play none none none" },
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#f8fafc] text-slate-900 py-14 md:py-24 px-4 md:px-5">
      <div className="w-[min(1120px,100%)] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-7 md:mb-9">
          <div>
            <p ref={kickerRef} className="text-[11px] font-black uppercase tracking-[.2em] text-teal mb-2">
              Premium Experiences
            </p>
            <h2
              ref={headRef}
              className="font-black text-slate-900 leading-[.97]"
              style={{ fontSize: "clamp(24px,4vw,56px)", letterSpacing: "-0.03em" }}
            >
              Everything your journey needs.
            </h2>
          </div>
          <p ref={descRef} className="text-slate-500 leading-relaxed max-w-md text-[14px] md:text-[15px]">
            Tours, hotels, vehicles, transfers and custom itineraries —
            designed for every type of Sri Lanka traveler.
          </p>
        </div>

        {/* Cards */}
        <div ref={gridRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {cards.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              data-glow
              className="group flex flex-col rounded-[20px] md:rounded-[24px] overflow-hidden
                bg-white shadow-[0_8px_32px_rgba(15,23,42,.10)]
                transition-transform duration-300 hover:-translate-y-2 md:hover:-translate-y-3"
            >
              {/* Image */}
              <div className="relative h-[140px] sm:h-[190px] lg:h-[240px] overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.img}
                  alt={c.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Arrow badge */}
                <div className="absolute top-3 right-3 w-7 h-7 md:w-8 md:h-8 bg-gold rounded-full flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#0f172a] font-black text-xs">
                  →
                </div>
              </div>

              {/* Text — always visible below image */}
              <div className="px-3 py-3 md:px-4 md:py-4">
                <h3 className="font-black text-slate-900 text-sm md:text-base leading-tight mb-0.5">{c.title}</h3>
                <p className="text-slate-500 text-[11px] md:text-xs font-medium">{c.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
