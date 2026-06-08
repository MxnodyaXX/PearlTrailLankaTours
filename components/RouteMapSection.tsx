"use client";

import { useEffect, useRef, useState } from "react";
import type { DayPlan } from "@/lib/packages-data";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ── City markers in 664×936 space (matches /MapSriLanka.png) ──────────────────
const DEST = [
  { x: 125, y: 611, label: "Negombo",      anchor: "end"   as const, days: [1]    },
  { x: 247, y: 362, label: "Anuradhapura", anchor: "end"   as const, days: [2, 3] },
  { x: 430, y: 311, label: "Trincomalee",  anchor: "start" as const, days: [4]    },
  { x: 330, y: 576, label: "Kandy",        anchor: "start" as const, days: [5, 6] },
  { x: 358, y: 704, label: "Nuwara Eliya", anchor: "start" as const, days: [7]    },
  { x: 521, y: 810, label: "Kataragama",   anchor: "end"   as const, days: [8]    },
  { x: 214, y: 907, label: "Galle",        anchor: "end"   as const, days: [9]    },
  { x: 125, y: 696, label: "Colombo",      anchor: "end"   as const, days: [10]   },
];

// Hand-drawn coast-following route (664×936 space). Starts at Negombo (day 1).
const ROUTE = [
  { x: 125, y: 611 },                  // 0  Negombo (start)
  { x: 141, y: 554 }, { x: 152, y: 507 }, { x: 173, y: 465 }, { x: 199, y: 438 }, { x: 228, y: 391 },
  { x: 247, y: 362 },                  // 6  Anuradhapura
  { x: 274, y: 343 }, { x: 302, y: 330 }, { x: 333, y: 317 }, { x: 357, y: 315 }, { x: 401, y: 312 }, { x: 425, y: 300 },
  { x: 430, y: 311 },                  // 13 Trincomalee
  { x: 416, y: 313 }, { x: 416, y: 325 }, { x: 417, y: 339 }, { x: 415, y: 357 }, { x: 417, y: 378 }, { x: 416, y: 410 },
  { x: 401, y: 444 }, { x: 379, y: 467 }, { x: 365, y: 470 }, { x: 363, y: 495 }, { x: 360, y: 526 }, { x: 346, y: 548 }, { x: 349, y: 564 },
  { x: 330, y: 576 },                  // 27 Kandy
  { x: 337, y: 631 }, { x: 342, y: 643 }, { x: 373, y: 674 },
  { x: 358, y: 704 },                  // 31 Nuwara Eliya (day 7)
  { x: 369, y: 727 }, { x: 407, y: 732 }, { x: 465, y: 749 }, { x: 483, y: 765 }, { x: 496, y: 786 }, { x: 521, y: 805 },
  { x: 521, y: 810 },                  // 38 Kataragama
  { x: 496, y: 823 }, { x: 476, y: 839 }, { x: 467, y: 854 }, { x: 458, y: 857 }, { x: 443, y: 863 }, { x: 431, y: 863 },
  { x: 427, y: 873 }, { x: 413, y: 873 }, { x: 395, y: 881 }, { x: 381, y: 881 }, { x: 370, y: 878 }, { x: 362, y: 887 }, { x: 348, y: 895 },
  { x: 326, y: 907 }, { x: 307, y: 913 }, { x: 300, y: 921 }, { x: 294, y: 927 }, { x: 281, y: 919 }, { x: 269, y: 919 }, { x: 253, y: 918 }, { x: 241, y: 921 }, { x: 225, y: 913 },
  { x: 214, y: 907 },                  // 61 Galle
  { x: 197, y: 902 }, { x: 196, y: 891 }, { x: 183, y: 879 }, { x: 178, y: 861 }, { x: 173, y: 848 }, { x: 163, y: 836 }, { x: 165, y: 822 }, { x: 165, y: 810 },
  { x: 158, y: 807 }, { x: 152, y: 787 }, { x: 148, y: 773 }, { x: 139, y: 759 }, { x: 139, y: 747 }, { x: 157, y: 738 }, { x: 142, y: 729 }, { x: 131, y: 727 }, { x: 130, y: 717 },
  { x: 125, y: 696 },                  // 79 Colombo (end)
];

// Route index of each day's city (day 1 … 10). The head rests here when that
// day is centered. Repeats = multi-day stays (Anuradhapura d2-3, Kandy d5-6).
const DAY_VERT = [0, 6, 6, 13, 27, 27, 31, 38, 61, 79];

// Centripetal Catmull-Rom → cubic bézier. Passes exactly through every point
// and, unlike the uniform version, does NOT overshoot at sharp city turns —
// so the line meets each city dot cleanly.
function smoothPath(raw: { x: number; y: number }[]): string {
  // drop consecutive duplicate points (avoids divide-by-zero & kinks)
  const pts = raw.filter((p, i) => i === 0 || p.x !== raw[i - 1].x || p.y !== raw[i - 1].y);
  const n = pts.length;
  if (n < 2) return n ? `M ${pts[0].x},${pts[0].y}` : "";

  const A = 0.5; // centripetal
  const EPS = 1e-6;
  const dpow = (a: { x: number; y: number }, b: { x: number; y: number }) =>
    Math.pow(Math.hypot(b.x - a.x, b.y - a.y), A);

  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(n - 1, i + 2)];
    const t01 = dpow(p0, p1), t12 = dpow(p1, p2), t23 = dpow(p2, p3);

    let m1x: number, m1y: number, m2x: number, m2y: number;
    if (t01 < EPS) { m1x = p2.x - p1.x; m1y = p2.y - p1.y; }
    else {
      m1x = (p2.x - p1.x) + t12 * ((p1.x - p0.x) / t01 - (p2.x - p0.x) / (t01 + t12));
      m1y = (p2.y - p1.y) + t12 * ((p1.y - p0.y) / t01 - (p2.y - p0.y) / (t01 + t12));
    }
    if (t23 < EPS) { m2x = p2.x - p1.x; m2y = p2.y - p1.y; }
    else {
      m2x = (p2.x - p1.x) + t12 * ((p3.x - p2.x) / t23 - (p3.x - p1.x) / (t12 + t23));
      m2y = (p2.y - p1.y) + t12 * ((p3.y - p2.y) / t23 - (p3.y - p1.y) / (t12 + t23));
    }
    const c1x = p1.x + m1x / 3, c1y = p1.y + m1y / 3;
    const c2x = p2.x - m2x / 3, c2y = p2.y - m2y / 3;
    d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x},${p2.y}`;
  }
  return d;
}
const SMOOTH = smoothPath(ROUTE);

// ── Map ───────────────────────────────────────────────────────────────────────
function SriLankaMap({
  activeDay, panelRefs, total,
}: { activeDay: number; panelRefs: React.RefObject<(HTMLDivElement | null)[]>; total: number }) {
  const goldRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const activeDestIdx = DEST.findIndex((d) => (d.days as number[]).includes(activeDay));

  useEffect(() => {
    const gold = goldRef.current;
    if (!gold) return;
    const L = gold.getTotalLength();
    gold.style.strokeDasharray = `${L}`;
    gold.style.strokeDashoffset = `${L}`;

    // Sample the path once, then find the length at each day's city vertex
    const SAMPLES = 1500;
    const samp: { l: number; x: number; y: number }[] = [];
    for (let s = 0; s <= SAMPLES; s++) {
      const l = (L * s) / SAMPLES;
      const q = gold.getPointAtLength(l);
      samp.push({ l, x: q.x, y: q.y });
    }
    const lenAt = (idx: number) => {
      const pt = ROUTE[idx];
      let best = 0, bd = Infinity;
      for (const sp of samp) {
        const dd = (sp.x - pt.x) ** 2 + (sp.y - pt.y) ** 2;
        if (dd < bd) { bd = dd; best = sp.l; }
      }
      return best;
    };
    const dayLen = DAY_VERT.map(lenAt);

    let raf = 0;
    const update = () => {
      raf = 0;
      const panels = (panelRefs.current ?? []).filter(Boolean) as HTMLDivElement[];
      if (!panels.length) return;
      // Continuous day-progress from real panel positions (robust to any height)
      const vc = window.innerHeight / 2;
      let dfsum = 0;
      for (const p of panels) {
        const r = p.getBoundingClientRect();
        dfsum += clamp((vc - r.top) / r.height, 0, 1);
      }
      const dayPos = clamp(dfsum - 0.5, 0, total - 1); // = k when day k+1 is centred
      const i = Math.floor(dayPos);
      const nx = Math.min(i + 1, total - 1);
      const headLen = lerp(dayLen[i], dayLen[nx], dayPos - i);

      gold.style.strokeDashoffset = `${L - headLen}`;
      const pt = gold.getPointAtLength(headLen);
      if (headRef.current) {
        headRef.current.setAttribute("transform", `translate(${pt.x},${pt.y})`);
        headRef.current.style.opacity = dfsum > 0.05 ? "1" : "0";
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [panelRefs, total]);

  return (
    <svg viewBox="0 0 664 936" preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", height: "100%" }}>
      <defs>
        {/* Remove the PNG's black background (alpha = R+G+B) + soft sea glow */}
        <filter id="rm-bg" colorInterpolationFilters="sRGB" x="-10%" y="-10%" width="120%" height="120%">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1 1 1 0 0" result="island" />
          <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#3f7bb8" floodOpacity="0.45" />
        </filter>
        <filter id="sglow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Island */}
      <image href="/MapSriLanka.png" x={0} y={0} width={664} height={936} filter="url(#rm-bg)" />

      {/* Full planned route — faint dashed underlay */}
      <path d={SMOOTH} fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="2.4" strokeDasharray="9 8" strokeLinecap="round" />

      {/* Gold route — progressively drawn by scroll */}
      <path ref={goldRef} d={SMOOTH} fill="none" stroke="#f6b93b" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#sglow)" />

      {/* Moving "you are here" head */}
      <g ref={headRef} style={{ opacity: 0 }}>
        <circle r="13" fill="none" stroke="#f6b93b" strokeWidth="1.5" strokeOpacity="0.5">
          <animate attributeName="r" values="9;20;9" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.6;0;0.6" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle r="6" fill="#f6b93b" />
        <circle r="2.4" fill="#0b1220" />
      </g>

      {/* Destination dots + labels */}
      {DEST.map((d, i) => {
        const isActive = i === activeDestIdx;
        const isPast = i < activeDestIdx;
        const lx = d.anchor === "start" ? d.x + 13 : d.x - 13;
        return (
          <g key={d.label}>
            <circle cx={d.x} cy={d.y} r={isActive ? 9 : isPast ? 6 : 5}
              fill={isActive ? "#f6b93b" : isPast ? "rgba(246,185,59,0.6)" : "rgba(255,255,255,0.3)"}
              filter={isActive ? "url(#sglow)" : undefined} />
            <text x={lx} y={d.y + 5} fontSize="14" fontWeight="700" fontFamily="system-ui,sans-serif" textAnchor={d.anchor}
              style={{ paintOrder: "stroke", stroke: "#020617", strokeWidth: 4 }}
              fill={isActive ? "#f6b93b" : isPast ? "rgba(246,185,59,0.55)" : "rgba(255,255,255,0.4)"}>
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function RouteMapSection({ days }: { days: DayPlan[] }) {
  const [activeDay, setActiveDay] = useState(1);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null;
        entries.forEach((e) => {
          if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) best = e;
        });
        if (best) {
          const day = parseInt((best as IntersectionObserverEntry).target.getAttribute("data-day") ?? "1", 10);
          if (!isNaN(day)) setActiveDay(day);
        }
      },
      { threshold: [0.25, 0.5, 0.75] },
    );
    panelRefs.current.forEach((p) => p && obs.observe(p));
    return () => obs.disconnect();
  }, [days]);

  // Snap each day section fully into view (desktop only — day content fits a screen)
  useEffect(() => {
    const html = document.documentElement;
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => { html.style.scrollSnapType = mq.matches ? "y proximity" : ""; };
    apply();
    mq.addEventListener("change", apply);
    return () => { mq.removeEventListener("change", apply); html.style.scrollSnapType = ""; };
  }, []);

  return (
    <section className="bg-navy border-t border-white/6">
      <div className="px-6 md:px-16 pt-16 pb-10">
        <p className="text-gold text-[10px] font-black uppercase tracking-[.22em] mb-2">Tour Route</p>
        <h2 className="text-white font-black" style={{ fontSize: "clamp(1.8rem,4vw,3.2rem)", letterSpacing: "-0.02em" }}>
          The Journey at a Glance
        </h2>
      </div>

      <div className="md:grid md:grid-cols-[1fr_1.3fr] md:items-start">
        {/* LEFT — sticky animated map on a soft sea glow */}
        <div className="hidden md:flex md:sticky md:top-0 md:h-screen p-6 lg:p-26 items-center"
          style={{ background: "radial-gradient(ellipse 72% 58% at 50% 46%, rgba(34,64,104,0.28) 0%, transparent 70%)" }}>
          <SriLankaMap activeDay={activeDay} panelRefs={panelRefs} total={days.length} />
        </div>

        {/* Mobile map */}
        <div className="md:hidden p-6" style={{ height: 420 }}>
          <SriLankaMap activeDay={activeDay} panelRefs={panelRefs} total={days.length} />
        </div>

        {/* RIGHT — detailed day guide */}
        <div className="bg-navy">
          {days.map((day, i) => {
            const on = day.day === activeDay;
            const city = DEST.find((d) => (d.days as number[]).includes(day.day))?.label ?? day.stay;
            return (
              <div
                key={day.day}
                id={`day-${day.day}`}
                data-day={day.day}
                ref={(el) => { panelRefs.current[i] = el; }}
                className="relative overflow-hidden min-h-screen flex flex-col justify-center px-7 md:px-12 py-20 border-b border-white/5 transition-colors duration-500"
                style={{ background: on ? "rgba(246,185,59,0.03)" : "transparent", scrollSnapAlign: "center", scrollSnapStop: "always" }}
              >
                {/* cinematic ghost day-number */}
                <span className="absolute pointer-events-none select-none font-black" style={{
                  right: "2%", top: "50%", transform: "translateY(-50%)", lineHeight: 1,
                  fontSize: "clamp(160px,22vw,340px)", letterSpacing: "-0.06em",
                  color: on ? "rgba(246,185,59,0.05)" : "rgba(255,255,255,0.025)",
                }}>{String(day.day).padStart(2, "0")}</span>

                {/* identifier */}
                <div className="relative flex items-center gap-4 mb-6">
                  <div className="relative shrink-0">
                    <span className="block w-14 h-14 rounded-full flex items-center justify-center font-black text-xl transition-all duration-500"
                      style={{ background: on ? "#f6b93b" : "rgba(255,255,255,0.05)", color: on ? "#0f172a" : "rgba(255,255,255,0.35)", boxShadow: on ? "0 0 0 6px rgba(246,185,59,0.12)" : "none" }}>
                      {day.day}
                    </span>
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-[.24em] transition-colors duration-500" style={{ fontSize: 12, color: on ? "#f6b93b" : "rgba(255,255,255,0.32)" }}>{city}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="h-px w-5" style={{ background: on ? "rgba(246,185,59,0.6)" : "rgba(255,255,255,0.2)" }} />
                      <p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/30">Day {String(day.day).padStart(2, "0")} of {String(days.length).padStart(2, "0")}</p>
                    </div>
                  </div>
                </div>

                <h3 className="relative text-white font-black leading-[1.02] mb-3 transition-opacity duration-500"
                  style={{ fontSize: "clamp(1.9rem,3.6vw,3.1rem)", letterSpacing: "-0.03em", opacity: on ? 1 : 0.5 }}>
                  {day.title}
                </h3>
                <p className="relative text-white/35 text-xs font-bold uppercase tracking-[.18em] mb-6">{day.subtitle}</p>

                <div className="relative z-[1] rounded-2xl overflow-hidden mb-3 transition-opacity duration-500" style={{ height: 280, opacity: on ? 1 : 0.55 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={day.img} alt={day.title} className="w-full h-full object-cover transition-transform duration-700" style={{ transform: on ? "scale(1.05)" : "scale(1)" }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(2,6,23,.5), transparent 50%)" }} />
                  <span className="absolute left-4 bottom-3 text-white/90 font-black" style={{ fontSize: 13, letterSpacing: ".04em" }}>{city}</span>
                </div>

                {day.gallery && day.gallery.length > 0 && (
                  <div className="relative z-[1] grid grid-cols-2 gap-3 mb-6 transition-opacity duration-500" style={{ opacity: on ? 1 : 0.55 }}>
                    {day.gallery.map((g, gi) => (
                      <div key={gi} className="relative rounded-xl overflow-hidden" style={{ height: 132 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={g.img} alt={g.caption} className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(2,6,23,.9) 0%, rgba(2,6,23,.1) 55%, transparent)" }} />
                        <span className="absolute left-2.5 right-2.5 bottom-2 text-[11px] font-bold leading-snug" style={{ color: "#fff" }}>{g.caption}</span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="relative z-[1] w-full text-sm md:text-[15px] leading-relaxed mb-7 transition-colors duration-500"
                  style={{ color: on ? "rgba(255,255,255,0.66)" : "rgba(255,255,255,0.32)" }}>
                  {day.description}
                </p>

                <p className="relative z-[1] text-[10px] font-black uppercase tracking-[.2em] mb-3" style={{ color: on ? "#f6b93b" : "rgba(255,255,255,0.25)" }}>Day Highlights</p>
                <ul className="relative z-[1] grid sm:grid-cols-2 gap-x-5 gap-y-2.5 mb-8">
                  {day.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5">
                      <span className="mt-1 shrink-0" style={{ color: on ? "#f6b93b" : "rgba(255,255,255,0.25)" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                      </span>
                      <span className="text-[13px] leading-snug" style={{ color: on ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)" }}>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative z-[1] flex items-center gap-2.5">
                  <span className="text-[10px] font-black uppercase tracking-[.18em] text-white/25">Overnight</span>
                  <span className="h-px w-7 bg-white/15" />
                  <span className="text-[10px] font-black uppercase tracking-[.18em]" style={{ color: on ? "rgba(246,185,59,0.8)" : "rgba(255,255,255,0.4)" }}>{day.stay}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
