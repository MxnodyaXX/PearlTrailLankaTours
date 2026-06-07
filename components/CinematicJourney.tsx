"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const q = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=85`;

interface Scene {
  id: string;
  name: string;
  img: string;
  l1: string;
  l2: string;
  sub: string;
  stars?: boolean;
  night?: boolean;
  final?: boolean;
}

const SCENES: Scene[] = [
  { id: "01", name: "Before Time Had a Name", img: q("photo-1683647986987-bcd7c320f3a1"), l1: "Before the world", l2: "knew its name…", sub: "An island slept in the dark of the Indian Ocean.", stars: true, night: true },
  { id: "02", name: "The Island Awakens",    img: q("photo-1552055642-554ec085233a"),    l1: "An island", l2: "unlike any other.", sub: "Mountains rise. Rivers wake. Forests breathe." },
  { id: "03", name: "Kingdoms Rise",         img: q("photo-1612862862126-865765df2ded"), l1: "Kingdoms rose", l2: "from the stone.", sub: "And the Lion Rock climbed toward the sky." },
  { id: "04", name: "Masters of Water",      img: q("photo-1708877873180-12e424230f39"), l1: "Masters of", l2: "water and time.", sub: "Vast reservoirs fed a civilization for centuries." },
  { id: "05", name: "The Sacred Island",     img: q("photo-1593377685064-720da51f3634"), l1: "A sacred,", l2: "golden island.", sub: "Temples, lanterns and a deep, quiet faith." },
  { id: "06", name: "The World Arrives",     img: q("photo-1734279135115-6d8984e08206"), l1: "Then the", l2: "world arrived.", sub: "Arabs, Chinese, Indians and Europeans crossed the sea." },
  { id: "07", name: "Above the Clouds",      img: q("photo-1566766189268-ecac9118f2b7"), l1: "High above", l2: "the clouds.", sub: "Tea estates, waterfalls and the blue train to Ella." },
  { id: "08", name: "The Wild Heart",        img: q("photo-1728455470905-156f4278056a"), l1: "Into the", l2: "wild heart.", sub: "Leopards, elephants and whales beneath the waves." },
  { id: "09", name: "An Endless Coast",      img: q("photo-1552055568-e9943cd2a08f"),    l1: "Along an", l2: "endless coast.", sub: "1,340 kilometres of golden, restless shoreline." },
  { id: "10", name: "The People",            img: q("photo-1582313106868-34e0bfed6e40"), l1: "Carried by", l2: "its people.", sub: "Warm. Resilient. Welcoming. Endlessly proud." },
  { id: "11", name: "Past Meets Future",     img: q("photo-1736142260757-6effc558100a"), l1: "Where past", l2: "meets future.", sub: "Ancient wisdom and modern ambition, side by side." },
  { id: "12", name: "Your Journey Begins",   img: q("photo-1776336885293-fba436d4281a"), l1: "", l2: "", sub: "", final: true },
];

const N = SCENES.length;
const SCENE_VH = 90;           // scroll length per scene
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function CinematicJourney() {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bgRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const capRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const finalRef  = useRef<HTMLDivElement>(null);
  const hintRef   = useRef<HTMLDivElement>(null);
  const barRef    = useRef<HTMLDivElement>(null);
  const lastIdx   = useRef(-1);
  const [active, setActive] = useState<{ id: string; name: string }>({ id: "01", name: SCENES[0].name });

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const wrap = wrapRef.current;
      if (!wrap) return;

      const total = wrap.offsetHeight - window.innerHeight;
      const scrolled = window.scrollY - wrap.offsetTop;
      const p = clamp(total > 0 ? scrolled / total : 0, 0, 1);
      const pos = p * (N - 1);
      const t = performance.now() / 1000;

      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;

      for (let i = 0; i < N; i++) {
        const d = pos - i;
        const ad = Math.abs(d);
        const op = clamp(1 - ad, 0, 1);                       // crossfade with neighbour
        const breathe = Math.sin(t * 0.5 + i) * 0.005;        // constant subtle life
        const sc = 1.15 + 0.17 * clamp(d * 0.5 + 0.5, 0, 1) + breathe; // continuous push
        const ty = d * -2.4;

        const s = sceneRefs.current[i];
        if (s) { s.style.opacity = String(op); s.style.visibility = op <= 0.002 ? "hidden" : "visible"; }
        const b = bgRefs.current[i];
        if (b) b.style.transform = `scale(${sc}) translateY(${ty}vh)`;
        const c = capRefs.current[i];
        if (c) {
          c.style.opacity = String(clamp(1 - ad * 1.75, 0, 1));
          c.style.transform = `translateY(${d * -28}px)`;
        }
      }

      // Final CTA fades in at the very end
      const fo = clamp((p - 0.9) / 0.07, 0, 1);
      if (finalRef.current) {
        finalRef.current.style.opacity = String(fo);
        finalRef.current.style.pointerEvents = fo > 0.5 ? "auto" : "none";
      }
      if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - p * 8, 0, 1));

      const idx = clamp(Math.round(pos), 0, N - 1);
      if (idx !== lastIdx.current) {
        lastIdx.current = idx;
        setActive({ id: SCENES[idx].id, name: SCENES[idx].name });
      }
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none" style={{ background: "rgba(255,255,255,.07)" }}>
        <div ref={barRef} className="h-full origin-left" style={{ background: "#f6b93b", transform: "scaleX(0)" }} />
      </div>

      {/* Live chapter indicator */}
      <div className="fixed left-5 bottom-5 z-[60] pointer-events-none hidden md:flex items-center gap-3 select-none">
        <span className="font-black tabular-nums" style={{ fontSize: "13px", color: "#f6b93b" }}>{active.id}</span>
        <span className="w-7 h-px" style={{ background: "rgba(255,255,255,.25)" }} />
        <span className="text-[11px] font-bold uppercase tracking-[.2em]" style={{ color: "rgba(255,255,255,.6)" }}>{active.name}</span>
      </div>

      {/* Tall wrapper drives the scroll; the stage stays pinned via sticky */}
      <div ref={wrapRef} className="relative" style={{ height: `${N * SCENE_VH}vh`, background: "#020617" }}>
        <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "#020617" }}>

          {/* Scene layers — crossfade into one another */}
          {SCENES.map((s, i) => (
            <div
              key={s.id}
              ref={(el) => { sceneRefs.current[i] = el; }}
              className="absolute inset-0"
              style={{ opacity: i === 0 ? 1 : 0, willChange: "opacity" }}
            >
              <div
                ref={(el) => { bgRefs.current[i] = el; }}
                className="absolute inset-0 bg-cover bg-center will-change-transform"
                style={{ backgroundImage: `url('${s.img}')`, transform: "scale(1.15)" }}
              />
              {s.stars && <div className="story-stars absolute inset-0 pointer-events-none" />}

              {/* Readability grade */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: s.night
                  ? "linear-gradient(to bottom, rgba(2,6,23,.72), rgba(2,6,23,.9))"
                  : "linear-gradient(90deg, rgba(2,6,23,.9) 0%, rgba(2,6,23,.55) 42%, rgba(2,6,23,.15) 78%, rgba(2,6,23,.4) 100%), linear-gradient(to bottom, rgba(2,6,23,.4), transparent 28%, transparent 64%, rgba(2,6,23,.62))",
              }} />

              {/* Caption */}
              {!s.final && (
                <div ref={(el) => { capRefs.current[i] = el; }} className="absolute inset-0 flex items-center" style={{ willChange: "opacity, transform" }}>
                  <div className="w-[min(1180px,100%)] mx-auto px-6 md:px-12">
                    <div className="max-w-[780px]">
                      <p className="text-gold text-[11px] md:text-[12px] font-black uppercase tracking-[.28em] mb-5">
                        {s.id} · {s.name}
                      </p>
                      <h2 className="font-black" style={{ fontSize: "clamp(40px,8vw,112px)", lineHeight: 0.92, letterSpacing: "-0.045em", color: "#f8fafc", textShadow: "0 10px 50px rgba(0,0,0,.5)" }}>
                        {s.l1}<br /><span className="italic" style={{ color: "#f6b93b" }}>{s.l2}</span>
                      </h2>
                      <p className="mt-6 text-[15px] md:text-[19px] font-semibold max-w-md" style={{ color: "#c7d0de", textShadow: "0 2px 16px rgba(0,0,0,.6)" }}>
                        {s.sub}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Persistent edge vignette ties every scene together */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 100% 90% at 50% 50%, transparent 55%, rgba(2,6,23,.5) 100%)",
          }} />

          {/* Final CTA overlay */}
          <div ref={finalRef} className="absolute inset-0 flex items-center justify-center text-center px-4" style={{ opacity: 0 }}>
            <div className="w-[min(880px,100%)]">
              <p className="font-bold mb-2" style={{ fontSize: "clamp(18px,2.6vw,30px)", color: "#d7deea" }}>
                One island. Thousands of stories.
              </p>
              <h2 className="font-black" style={{ fontSize: "clamp(40px,7.5vw,104px)", lineHeight: 0.95, letterSpacing: "-0.045em", color: "#f8fafc" }}>
                Welcome to Sri Lanka.
              </h2>
              <p className="font-black italic mt-2" style={{ fontSize: "clamp(20px,3.4vw,48px)", color: "#f6b93b", letterSpacing: "-0.02em" }}>
                The Pearl of the Indian Ocean.
              </p>
              <p className="mt-5 text-[13px] md:text-[14px] font-bold uppercase tracking-[.22em]" style={{ color: "rgba(255,255,255,.55)" }}>
                Explore with PearlTrailLankaTours
              </p>
              <div className="mt-9 flex flex-wrap gap-3 justify-center">
                <Link href="/packages" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black px-8 py-4 rounded-full text-sm transition-all hover:-translate-y-0.5 shadow-[0_14px_40px_rgba(246,185,59,.42)]">
                  Begin Your Journey →
                </Link>
                <a href="https://wa.me/94741838376" target="_blank" rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-8 py-4 rounded-full text-sm transition-all hover:-translate-y-0.5">
                  Talk to Us
                </a>
              </div>
            </div>
          </div>

          {/* Scroll hint (first scene only) */}
          <div ref={hintRef} className="absolute left-1/2 -translate-x-1/2 bottom-7 flex flex-col items-center gap-2 text-[10px] font-black tracking-[.25em] uppercase pointer-events-none"
            style={{ color: "rgba(255,255,255,.5)" }}>
            <div className="w-5 h-8 rounded-full flex justify-center pt-1.5" style={{ border: "1px solid rgba(255,255,255,.35)" }}>
              <div className="w-0.5 h-2 rounded-full animate-bounce" style={{ background: "rgba(255,255,255,.65)" }} />
            </div>
            Scroll to Travel
          </div>
        </div>
      </div>
    </>
  );
}
