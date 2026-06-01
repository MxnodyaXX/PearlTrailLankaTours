"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function PageTransition() {
  const panelRef = useRef<HTMLDivElement>(null);
  const barRef   = useRef<HTMLDivElement>(null);
  const logoRef  = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const panel = panelRef.current;
    const bar   = barRef.current;
    const logo  = logoRef.current;
    if (!panel || !bar || !logo) return;

    const tl = gsap.timeline();

    /* 1. Snap panel to cover screen, reset children */
    gsap.set(panel, { yPercent: 0, pointerEvents: "auto" });
    gsap.set(bar,   { scaleX: 0 });
    gsap.set(logo,  { opacity: 0, y: 12 });

    /* 2. Logo fades in */
    tl.to(logo, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" })

    /* 3. Progress bar sweeps left → right */
      .to(bar, {
        scaleX: 1,
        duration: 0.45,
        ease: "power2.inOut",
        transformOrigin: "left center",
      }, "-=0.1")

    /* 4. Short hold so the brand reads */
      .to({}, { duration: 0.12 })

    /* 5. Panel slides up, revealing the new page */
      .to(panel, {
        yPercent: -100,
        duration: 0.75,
        ease: "power3.inOut",
        onComplete: () => gsap.set(panel, { pointerEvents: "none" }),
      });

    return () => { tl.kill(); };
  }, [pathname]);

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-7"
      style={{ background: "#020617" }}
      aria-hidden="true"
    >
      {/* Grain texture — same as hero */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.18]"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="pt-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#pt-grain)"/>
      </svg>

      {/* Radial centre glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(246,185,59,.07) 0%, transparent 70%)",
        }}
      />

      {/* Brand mark */}
      <div ref={logoRef} className="relative text-center" style={{ opacity: 0 }}>
        {/* Thin rule above */}
        <div className="w-8 h-px bg-white/20 mx-auto mb-5" />

        <p
          className="font-black text-white tracking-tight"
          style={{ fontSize: "clamp(28px,6vw,44px)", letterSpacing: "-0.04em" }}
        >
          Pearl<span style={{ color: "#f6b93b" }}>Trail</span>
        </p>
        <p className="mt-1.5 text-[9px] font-extrabold uppercase tracking-[0.35em] text-white/35">
          Lanka Tours
        </p>

        {/* Thin rule below */}
        <div className="w-8 h-px bg-white/20 mx-auto mt-5" />
      </div>

      {/* Progress bar */}
      <div className="w-24 h-[1.5px] bg-white/10 rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full"
          style={{
            background: "#f6b93b",
            transformOrigin: "left center",
            transform: "scaleX(0)",
          }}
        />
      </div>
    </div>
  );
}
