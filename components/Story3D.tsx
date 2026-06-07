"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import World3D from "./World3D";

interface Ch { id: string; name: string; l1: string; l2: string; sub: string; final?: boolean }

const CH: Ch[] = [
  { id: "01", name: "Before Time Had a Name", l1: "Before the world", l2: "knew its name…", sub: "An island slept in the dark of the Indian Ocean." },
  { id: "02", name: "The Island Awakens",     l1: "An island", l2: "rises from the sea.", sub: "Mountains, rivers and forests breathe into being." },
  { id: "03", name: "Kingdoms Rise",          l1: "Kingdoms rose", l2: "from the stone.", sub: "Anuradhapura, Polonnaruwa, Kandy — wonders ahead of their time." },
  { id: "04", name: "Masters of Water",       l1: "Masters of", l2: "water and time.", sub: "Vast reservoirs fed a civilization for two thousand years." },
  { id: "05", name: "The Sacred Island",      l1: "A sacred,", l2: "golden island.", sub: "Temples among the mountains. A deep and quiet faith." },
  { id: "06", name: "The World Arrives",      l1: "Then the", l2: "world arrived.", sub: "Arabs, Chinese, Indians and Europeans crossed the sea." },
  { id: "07", name: "Above the Clouds",       l1: "High above", l2: "the clouds.", sub: "Tea estates and the blue train, drifting through mist." },
  { id: "08", name: "The Wild Heart",         l1: "Into the", l2: "wild heart.", sub: "Leopards, elephants, and whales beneath the waves." },
  { id: "09", name: "An Endless Coast",       l1: "Along an", l2: "endless coast.", sub: "1,340 kilometres of golden, restless shoreline." },
  { id: "10", name: "The People",             l1: "Carried by", l2: "its people.", sub: "Warm. Resilient. Welcoming. Endlessly proud." },
  { id: "11", name: "Past Meets Future",      l1: "Where past", l2: "meets future.", sub: "Ancient wisdom and modern ambition, side by side." },
  { id: "12", name: "Your Journey Begins",    l1: "", l2: "", sub: "", final: true },
];

const N = CH.length;
const SCENE_VH = 95;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function Story3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const capRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const lastIdx = useRef(-1);
  const [active, setActive] = useState({ id: "01", name: CH[0].name });

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const wrap = wrapRef.current; if (!wrap) return;
      const total = wrap.offsetHeight - window.innerHeight;
      const p = clamp(total > 0 ? (window.scrollY - wrap.offsetTop) / total : 0, 0, 1);
      const pos = p * (N - 1);

      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;

      for (let i = 0; i < N; i++) {
        const ad = Math.abs(pos - i);
        const c = capRefs.current[i];
        if (c) {
          const o = clamp(1 - ad * 1.7, 0, 1);
          c.style.opacity = String(o);
          c.style.visibility = o <= 0.002 ? "hidden" : "visible";
          c.style.transform = `translateY(${(pos - i) * -26}px)`;
        }
      }

      const fo = clamp((p - 0.9) / 0.07, 0, 1);
      if (finalRef.current) { finalRef.current.style.opacity = String(fo); finalRef.current.style.pointerEvents = fo > 0.5 ? "auto" : "none"; }
      if (hintRef.current) hintRef.current.style.opacity = String(clamp(1 - p * 8, 0, 1));

      const idx = clamp(Math.round(pos), 0, N - 1);
      if (idx !== lastIdx.current) { lastIdx.current = idx; setActive({ id: CH[idx].id, name: CH[idx].name }); }
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <World3D />

      {/* progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none" style={{ background: "rgba(255,255,255,.07)" }}>
        <div ref={barRef} className="h-full origin-left" style={{ background: "#f6b93b", transform: "scaleX(0)" }} />
      </div>
      {/* chapter indicator */}
      <div className="fixed left-5 bottom-5 z-[60] pointer-events-none hidden md:flex items-center gap-3 select-none">
        <span className="font-black tabular-nums" style={{ fontSize: "13px", color: "#f6b93b" }}>{active.id}</span>
        <span className="w-7 h-px" style={{ background: "rgba(255,255,255,.25)" }} />
        <span className="text-[11px] font-bold uppercase tracking-[.2em]" style={{ color: "rgba(255,255,255,.6)" }}>{active.name}</span>
      </div>

      {/* scroll wrapper drives everything; the canvas (z-0) shows through */}
      <div id="story3d" ref={wrapRef} className="relative" style={{ height: `${N * SCENE_VH}vh`, zIndex: 10 }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* legibility wash (very light so the 3D reads) */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "radial-gradient(ellipse 100% 75% at 50% 60%, transparent 45%, rgba(2,6,23,.45) 100%), linear-gradient(to bottom, rgba(2,6,23,.35), transparent 28%, transparent 62%, rgba(2,6,23,.55))",
          }} />

          {/* captions */}
          {CH.map((c, i) => !c.final && (
            <div key={c.id} ref={(el) => { capRefs.current[i] = el; }} className="absolute inset-0 flex items-center justify-center text-center px-5" style={{ opacity: 0, willChange: "opacity, transform" }}>
              <div className="w-[min(960px,100%)]">
                <p className="text-gold text-[11px] md:text-[12px] font-black uppercase tracking-[.3em] mb-5">{c.id} · {c.name}</p>
                <h2 className="font-black" style={{ fontSize: "clamp(40px,8vw,116px)", lineHeight: 0.92, letterSpacing: "-0.045em", color: "#f8fafc", textShadow: "0 12px 60px rgba(0,0,0,.6)" }}>
                  {c.l1}<br /><span className="italic" style={{ color: "#f6b93b" }}>{c.l2}</span>
                </h2>
                <p className="mx-auto mt-6 max-w-lg text-[15px] md:text-[19px] font-semibold" style={{ color: "#c7d0de", textShadow: "0 2px 18px rgba(0,0,0,.7)" }}>{c.sub}</p>
              </div>
            </div>
          ))}

          {/* final CTA */}
          <div ref={finalRef} className="absolute inset-0 flex items-center justify-center text-center px-4" style={{ opacity: 0 }}>
            <div className="w-[min(900px,100%)]">
              <p className="font-bold mb-2" style={{ fontSize: "clamp(18px,2.6vw,30px)", color: "#d7deea" }}>One island. Thousands of stories.</p>
              <h2 className="font-black" style={{ fontSize: "clamp(42px,7.5vw,108px)", lineHeight: 0.95, letterSpacing: "-0.045em", color: "#f8fafc" }}>Welcome to Sri Lanka.</h2>
              <p className="font-black italic mt-2" style={{ fontSize: "clamp(20px,3.4vw,48px)", color: "#f6b93b", letterSpacing: "-0.02em" }}>The Pearl of the Indian Ocean.</p>
              <div className="mt-9 flex flex-wrap gap-3 justify-center">
                <Link href="/packages" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black px-8 py-4 rounded-full text-sm transition-all hover:-translate-y-0.5 shadow-[0_14px_40px_rgba(246,185,59,.42)]">Begin Your Journey →</Link>
                <a href="https://wa.me/94741838376" target="_blank" rel="noopener noreferrer" className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-8 py-4 rounded-full text-sm transition-all hover:-translate-y-0.5">Talk to Us</a>
              </div>
            </div>
          </div>

          {/* scroll hint */}
          <div ref={hintRef} className="absolute left-1/2 -translate-x-1/2 bottom-7 flex flex-col items-center gap-2 text-[10px] font-black tracking-[.25em] uppercase pointer-events-none" style={{ color: "rgba(255,255,255,.5)" }}>
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
