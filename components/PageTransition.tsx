"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

/* Global navigation curtain.
   - Click an internal link → the curtain covers the screen (after a short
     debounce, so instant navigations don't flash).
   - When the new route has rendered (pathname changes) → the curtain reveals it.
   This shows a loading screen for the whole compile/render wait and hides it
   once the page is ready. */
export default function PageTransition() {
  const panelRef = useRef<HTMLDivElement>(null);
  const barRef   = useRef<HTMLDivElement>(null);
  const logoRef  = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const covering   = useRef(false);
  const pendingTm  = useRef<number | null>(null);
  const failsafeTm = useRef<number | null>(null);
  const isFirst    = useRef(true);
  const tlRef      = useRef<gsap.core.Timeline | null>(null);

  const clearTimers = () => {
    if (pendingTm.current)  { clearTimeout(pendingTm.current);  pendingTm.current = null; }
    if (failsafeTm.current) { clearTimeout(failsafeTm.current); failsafeTm.current = null; }
  };

  const showCover = () => {
    const panel = panelRef.current, bar = barRef.current, logo = logoRef.current;
    if (!panel || !bar || !logo) return;
    tlRef.current?.kill();
    covering.current = true;
    gsap.set(panel, { yPercent: 0, pointerEvents: "auto", opacity: 1 });
    gsap.set(logo, { opacity: 0, y: 12 });
    gsap.to(logo, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" });
    bar.classList.add("pt-bar-loading");
    // Safety: never trap the user if a navigation stalls/cancels.
    if (failsafeTm.current) clearTimeout(failsafeTm.current);
    failsafeTm.current = window.setTimeout(() => reveal(), 12000);
  };

  const reveal = () => {
    const panel = panelRef.current, bar = barRef.current;
    if (!panel || !bar) return;
    clearTimers();
    bar.classList.remove("pt-bar-loading");
    const tl = gsap.timeline();
    tlRef.current = tl;
    tl.to(panel, {
      yPercent: -100, duration: 0.65, ease: "power3.inOut",
      onComplete: () => { gsap.set(panel, { pointerEvents: "none" }); covering.current = false; },
    });
  };

  /* Route committed (or first load) */
  useEffect(() => {
    if (pendingTm.current) { clearTimeout(pendingTm.current); pendingTm.current = null; }

    if (isFirst.current) {
      isFirst.current = false;
      // Intro: brief brand flash, then reveal the home page.
      const panel = panelRef.current, logo = logoRef.current;
      if (panel && logo) {
        gsap.set(panel, { yPercent: 0, pointerEvents: "auto" });
        gsap.set(logo, { opacity: 0, y: 12 });
        gsap.timeline()
          .to(logo, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" })
          .to({}, { duration: 0.2 })
          .to(panel, { yPercent: -100, duration: 0.7, ease: "power3.inOut",
            onComplete: () => gsap.set(panel, { pointerEvents: "none" }) });
      }
      return;
    }

    // A navigation finished — if the curtain is up, reveal the new page.
    if (covering.current) reveal();
  }, [pathname]);

  /* Intercept internal navigations to raise the curtain immediately */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href) return;
      const target = a.getAttribute("target");
      if (target && target !== "_self") return;
      if (a.hasAttribute("download") || a.hasAttribute("data-no-curtain")) return;
      if (/^(#|mailto:|tel:|javascript:)/i.test(href)) return;

      let url: URL;
      try { url = new URL(href, window.location.href); } catch { return; }
      if (url.origin !== window.location.origin) return;     // external (incl. wa.me, social)
      if (url.pathname === window.location.pathname) return;  // same page / hash only

      // Debounce so genuinely instant navigations don't flash the curtain.
      if (pendingTm.current) clearTimeout(pendingTm.current);
      pendingTm.current = window.setTimeout(showCover, 120);
    };

    const onPop = () => {
      if (pendingTm.current) clearTimeout(pendingTm.current);
      pendingTm.current = window.setTimeout(showCover, 120);
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPop);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPop);
      clearTimers();
    };
  }, []);

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-7"
      style={{ background: "#020617" }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes ptIndet { 0% { transform: translateX(-120%); } 100% { transform: translateX(420%); } }
        .pt-bar { width: 28%; }
        .pt-bar-loading { animation: ptIndet 1.05s ease-in-out infinite; }
      `}</style>

      {/* Grain texture */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.18]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <filter id="pt-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#pt-grain)" />
      </svg>

      {/* Radial centre glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(246,185,59,.07) 0%, transparent 70%)",
      }} />

      {/* Brand mark */}
      <div ref={logoRef} className="relative text-center" style={{ opacity: 0 }}>
        <div className="w-8 h-px mx-auto mb-5" style={{ background: "rgba(255,255,255,.2)" }} />
        <p className="font-black tracking-tight" style={{ fontSize: "clamp(28px,6vw,44px)", letterSpacing: "-0.04em", color: "#fff" }}>
          Pearl<span style={{ color: "#f6b93b" }}>Trail</span>
        </p>
        <p className="mt-1.5 text-[9px] font-extrabold uppercase tracking-[0.35em]" style={{ color: "rgba(255,255,255,.35)" }}>
          Lanka Tours
        </p>
        <div className="w-8 h-px mx-auto mt-5" style={{ background: "rgba(255,255,255,.2)" }} />
      </div>

      {/* Progress bar (indeterminate while loading) */}
      <div className="relative w-24 h-[1.5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.1)" }}>
        <div ref={barRef} className="pt-bar h-full rounded-full" style={{ background: "#f6b93b" }} />
      </div>
    </div>
  );
}
