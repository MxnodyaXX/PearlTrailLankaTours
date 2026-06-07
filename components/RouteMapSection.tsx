"use client";

import { useEffect, useRef, useState } from "react";
import type { DayPlan } from "@/lib/packages-data";

// ── Coordinates in 664×936 space (actual PNG width = 664) ────────────────────
const DEST = [
  { x: 184, y: 655, label: "Negombo",      anchor: "end"   as const, days: [1]    },
  { x: 238, y: 408, label: "Anuradhapura", anchor: "end"   as const, days: [2, 3] },
  { x: 379, y: 310, label: "Trincomalee",  anchor: "start" as const, days: [4]    },
  { x: 333, y: 604, label: "Kandy",        anchor: "start" as const, days: [5, 6] },
  { x: 375, y: 665, label: "Nuwara Eliya", anchor: "start" as const, days: [7]    },
  { x: 537, y: 762, label: "Kataragama",   anchor: "end"   as const, days: [8]    },
  { x: 310, y: 877, label: "Galle",        anchor: "end"   as const, days: [9]    },
  { x: 193, y: 720, label: "Colombo",      anchor: "end"   as const, days: [10]   },
];

// Control points scaled from 521→664 space (×1.274) — endpoints use exact DEST values
const SEGMENTS = [
  // 0  Day 1   Colombo → Negombo
  "M 193,720 C 194,705 191,678 184,655",
  // 1  Day 2-3  Negombo → Anuradhapura
  "M 184,655 C 189,580 210,480 238,408",
  // 2  Day 4   Anuradhapura → Trincomalee
  "M 238,408 C 280,385 338,330 379,310",
  // 3  Day 5-6  Trincomalee → Kandy  (via Habarana 354,430)
  "M 379,310 C 376,355 357,400 354,430 C 347,465 341,545 333,604",
  // 4  Day 7   Kandy → Nuwara Eliya
  "M 333,604 C 349,625 372,650 375,665",
  // 5  Day 8   Nuwara Eliya → Kataragama  (via Ella 446,710)
  "M 375,665 C 401,680 433,700 446,710 C 478,722 529,748 537,762",
  // 6  Day 9   Kataragama → Galle  (via Hambantota 482,840)
  "M 537,762 C 548,800 510,838 482,840 C 440,843 376,865 310,877",
  // 7  Day 10  Galle → Colombo
  "M 310,877 C 287,865 236,800 193,720",
];

const FULL_PATH =
  "M 193,720 " +
  "C 194,705 191,678 184,655 " +
  "C 189,580 210,480 238,408 " +
  "C 280,385 338,330 379,310 " +
  "C 376,355 357,400 354,430 C 347,465 341,545 333,604 " +
  "C 349,625 372,650 375,665 " +
  "C 401,680 433,700 446,710 C 478,722 529,748 537,762 " +
  "C 548,800 510,838 482,840 C 440,843 376,865 310,877 " +
  "C 287,865 236,800 193,720";

const DAY_SEG: Record<number, number> = {
  1: 0, 2: 1, 3: 1, 4: 2, 5: 3, 6: 3, 7: 4, 8: 5, 9: 6, 10: 7,
};

// Arrow midpoints scaled to 664 space
const ARROWS = [
  { x: 191, y: 688, angle: -90,  seg: 0 },
  { x: 204, y: 530, angle: -80,  seg: 1 },
  { x: 310, y: 358, angle: -42,  seg: 2 },
  { x: 367, y: 376, angle: 100,  seg: 3 },
  { x: 345, y: 508, angle: 93,   seg: 3 },
  { x: 362, y: 637, angle: 60,   seg: 4 },
  { x: 417, y: 689, angle: 44,   seg: 5 },
  { x: 502, y: 735, angle: 31,   seg: 5 },
  { x: 526, y: 815, angle: 126,  seg: 6 },
  { x: 405, y: 855, angle: 164,  seg: 6 },
  { x: 260, y: 824, angle: -121, seg: 7 },
];

// ── Map SVG ───────────────────────────────────────────────────────────────────

function SriLankaMap({ activeDay }: { activeDay: number }) {
  const activeDestIdx = DEST.findIndex((d) => (d.days as number[]).includes(activeDay));
  const activeSegIdx  = DAY_SEG[activeDay] ?? 0;
  const visibleSegs   = SEGMENTS.slice(0, activeSegIdx + 1);
  const visibleArrows = ARROWS.filter((a) => a.seg <= activeSegIdx);

  return (
    <svg
      viewBox="0 0 664 936"
      preserveAspectRatio="xMidYMid meet"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <defs>
        {/* A' = −R − G − B + 3 → white (1,1,1)→0, blue island→≥1 clamped to opaque */}
        <filter id="rm-white" colorInterpolationFilters="sRGB" x="0" y="0" width="1" height="1">
          <feColorMatrix type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 0 3" />
        </filter>
        <filter id="sglow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* PNG — white background removed, island stays */}
      <image href="/MapSriLanka.png" x={0} y={0} width={664} height={936} filter="url(#rm-white)" />

      {/* Full route underlay — faint dashed */}
      <path d={FULL_PATH} fill="none" stroke="rgba(255,255,255,0.14)"
        strokeWidth="2.5" strokeDasharray="10 7" strokeLinecap="round" />

      {/* Completed route — gold */}
      {visibleSegs.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#f6b93b"
          strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      ))}

      {/* Direction arrows */}
      {visibleArrows.map(({ x, y, angle }, i) => (
        <polygon key={i} points="-7,-4 7,0 -7,4" fill="#f6b93b" fillOpacity="0.82"
          transform={`translate(${x},${y}) rotate(${angle})`} />
      ))}

      {/* Destination dots + labels */}
      {DEST.map((d, i) => {
        const isActive = i === activeDestIdx;
        const isPast   = i < activeDestIdx;
        const lx = d.anchor === "start" ? d.x + 13 : d.x - 13;

        return (
          <g key={d.label}>
            {isActive && (
              <circle cx={d.x} cy={d.y} r="15" fill="none"
                stroke="#f6b93b" strokeWidth="1.5" strokeOpacity="0.5">
                <animate attributeName="r"              values="15;28;15" dur="2.2s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.5;0;0.5"  dur="2.2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={d.x} cy={d.y}
              r={isActive ? 10 : isPast ? 7 : 5}
              fill={isActive ? "#f6b93b" : isPast ? "rgba(246,185,59,0.6)" : "rgba(255,255,255,0.25)"}
              filter={isActive ? "url(#sglow)" : undefined}
            />
            <text x={lx} y={d.y + 5} fontSize="14" fontWeight="700"
              fontFamily="system-ui,sans-serif" textAnchor={d.anchor}
              fill={isActive ? "#f6b93b" : isPast ? "rgba(246,185,59,0.5)" : "rgba(255,255,255,0.25)"}>
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
          if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio))
            best = e;
        });
        if (best) {
          const day = parseInt(
            (best as IntersectionObserverEntry).target.getAttribute("data-day") ?? "1", 10,
          );
          if (!isNaN(day)) setActiveDay(day);
        }
      },
      { threshold: [0.25, 0.5, 0.75] },
    );
    panelRefs.current.forEach((p) => p && obs.observe(p));
    return () => obs.disconnect();
  }, [days]);

  return (
    <section className="bg-navy border-t border-white/6">

      {/* Heading */}
      <div className="px-6 md:px-16 pt-16 pb-10">
        <p className="text-gold text-[10px] font-black uppercase tracking-[.22em] mb-2">Tour Route</p>
        <h2 className="text-white font-black"
          style={{ fontSize: "clamp(1.8rem,4vw,3.2rem)", letterSpacing: "-0.02em" }}>
          The Journey at a Glance
        </h2>
      </div>

      <div className="md:grid md:grid-cols-2 md:items-start">

        {/* LEFT — sticky, transparent background so island floats on page navy */}
        <div className="hidden md:block md:sticky md:top-0 md:h-screen p-8 border-r border-white/5">
          <SriLankaMap activeDay={activeDay} />
        </div>

        {/* Mobile map */}
        <div className="md:hidden p-6" style={{ height: 400 }}>
          <SriLankaMap activeDay={activeDay} />
        </div>

        {/* RIGHT — day panels */}
        <div className="bg-navy">
          {days.map((day, i) => {
            const on   = day.day === activeDay;
            const city = DEST.find((d) => (d.days as number[]).includes(day.day))?.label ?? "";

            return (
              <div
                key={day.day}
                data-day={day.day}
                ref={(el) => { panelRefs.current[i] = el; }}
                className="min-h-screen flex flex-col justify-center px-8 md:px-12 py-20
                           border-b border-white/5 transition-colors duration-500"
                style={{ background: on ? "rgba(246,185,59,0.028)" : "transparent" }}
              >
                {/* Day badge + city name */}
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center
                               font-black text-sm shrink-0 transition-all duration-500"
                    style={{
                      background: on ? "#f6b93b" : "rgba(255,255,255,0.06)",
                      color:      on ? "#0f172a" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {day.day}
                  </span>
                  <p className="text-[9px] font-black uppercase tracking-[.22em] transition-colors duration-500"
                    style={{ color: on ? "#f6b93b" : "rgba(255,255,255,0.28)" }}>
                    {city}
                  </p>
                </div>

                <h3 className="text-white font-black leading-tight mb-2 transition-opacity duration-500"
                  style={{
                    fontSize: "clamp(1.6rem,3.2vw,2.6rem)",
                    letterSpacing: "-0.025em",
                    opacity: on ? 1 : 0.48,
                  }}>
                  {day.title}
                </h3>

                <p className="text-white/30 text-xs font-bold uppercase tracking-wider mb-7">
                  {day.subtitle}
                </p>

                <div className="rounded-2xl overflow-hidden mb-6 transition-opacity duration-500"
                  style={{ height: 220, opacity: on ? 1 : 0.52 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={day.img} alt={day.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                    style={{ transform: on ? "scale(1.04)" : "scale(1)" }} />
                </div>

                <p className="text-sm leading-relaxed mb-7 transition-colors duration-500"
                  style={{
                    color: on ? "rgba(255,255,255,0.62)" : "rgba(255,255,255,0.3)",
                    maxWidth: "38ch",
                  }}>
                  {day.description.length > 185
                    ? day.description.slice(0, 185) + "…"
                    : day.description}
                </p>

                <div className="grid grid-cols-2 gap-2.5 mb-7">
                  {day.highlights.slice(0, 4).map((h) => (
                    <div key={h} className="rounded-xl px-3 py-2.5 transition-all duration-500"
                      style={{
                        background: on ? "rgba(246,185,59,0.07)"           : "rgba(255,255,255,0.03)",
                        border:     on ? "1px solid rgba(246,185,59,0.18)" : "1px solid rgba(255,255,255,0.06)",
                      }}>
                      <p className="text-[11px] font-semibold leading-snug"
                        style={{ color: on ? "rgba(246,185,59,0.85)" : "rgba(255,255,255,0.3)" }}>
                        {h}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/20">
                  Overnight&nbsp;·&nbsp;{day.stay}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
