"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const q = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=85`;

type Kind = "p" | "a" | "big";
interface Line { t: string; k?: Kind }
interface Ch {
  no: string;
  name: string;
  img: string | null;
  effect?: "rise" | "pan" | "dark";
  lines: Line[];
}

const CHAPTERS: Ch[] = [
  {
    no: "01", name: "Before the Kingdoms", img: null,
    lines: [
      { t: "Long before roads were built." },
      { t: "Long before cities rose from stone." },
      { t: "there was an island in the middle of the Indian Ocean —" },
      { t: "blessed with mountains, rivers, forests and endless coastlines." },
      { t: "An island waiting to tell its story.", k: "a" },
    ],
  },
  {
    no: "02", name: "The Birth of a Civilization", img: q("photo-1621393614326-2f9ed389ce02"),
    lines: [
      { t: "More than 2,500 years ago, great civilizations emerged." },
      { t: "Kings dreamed of kingdoms." },
      { t: "Engineers shaped landscapes." },
      { t: "Farmers turned dry plains into fertile fields." },
      { t: "What began as settlements became one of Asia's most remarkable civilizations.", k: "a" },
    ],
  },
  {
    no: "03", name: "The Age of Kings", img: q("photo-1612862862126-865765df2ded"), effect: "rise",
    lines: [
      { t: "Kingdoms rose." },
      { t: "Anuradhapura. Polonnaruwa. Yapahuwa. Kandy.", k: "a" },
      { t: "Each left behind monuments that still stand against time —" },
      { t: "massive reservoirs, sacred temples, towering palaces." },
      { t: "And from the earth, the Lion Rock rises.", k: "big" },
    ],
  },
  {
    no: "04", name: "Engineers of the Ancient World", img: q("photo-1708877873180-12e424230f39"), effect: "pan",
    lines: [
      { t: "Sri Lanka's greatest treasure was not gold." },
      { t: "It was knowledge.", k: "a" },
      { t: "Ancient engineers built vast irrigation networks," },
      { t: "transforming dry plains into thriving farmland." },
      { t: "Many of these systems still flow today — a testament to those who came before." },
    ],
  },
  {
    no: "05", name: "The Land of Faith", img: q("photo-1593377685064-720da51f3634"),
    lines: [
      { t: "For centuries, faith shaped the soul of the island." },
      { t: "Temples rose among the mountains." },
      { t: "Monasteries flourished within the forests." },
      { t: "Sacred traditions passed from generation to generation —" },
      { t: "a culture built on harmony, respect and spirituality.", k: "a" },
    ],
  },
  {
    no: "06", name: "A Crossroads of the World", img: q("photo-1683647986987-bcd7c320f3a1"),
    lines: [
      { t: "Traders arrived from distant lands." },
      { t: "Arabs. Chinese. Indians. Europeans.", k: "a" },
      { t: "They came seeking spices, gems, ivory and opportunity." },
      { t: "The island became a meeting point of cultures, ideas and traditions." },
    ],
  },
  {
    no: "07", name: "Colonial Footprints", img: q("photo-1547818832-470a7998a99a"),
    lines: [
      { t: "New rulers arrived." },
      { t: "Portuguese. Dutch. British.", k: "a" },
      { t: "Their influence reshaped the island —" },
      { t: "leaving behind architecture, railways and cities" },
      { t: "that still define modern Sri Lanka." },
    ],
  },
  {
    no: "08", name: "The Hill Country", img: q("photo-1566766189268-ecac9118f2b7"),
    lines: [
      { t: "High above the clouds, a different Sri Lanka emerged." },
      { t: "Endless tea estates spread across mist-covered mountains," },
      { t: "creating one of the world's most celebrated tea industries —" },
      { t: "a landscape unlike anywhere else on Earth.", k: "a" },
    ],
  },
  {
    no: "09", name: "Wildlife Kingdom", img: q("photo-1728455470905-156f4278056a"), effect: "dark",
    lines: [
      { t: "Few places on Earth hold such diversity." },
      { t: "Leopards roam ancient forests." },
      { t: "Elephants follow age-old migration routes." },
      { t: "Blue whales glide through the surrounding ocean." },
      { t: "Nature remains at the heart of the island's identity.", k: "a" },
    ],
  },
  {
    no: "10", name: "The Coasts", img: q("photo-1552055568-e9943cd2a08f"),
    lines: [
      { t: "1,340 kilometres of coastline.", k: "a" },
      { t: "Golden beaches. Hidden coves. Surfing waves." },
      { t: "Coral reefs. Fishing villages." },
      { t: "Every shore tells a different story." },
    ],
  },
  {
    no: "11", name: "The People", img: q("photo-1582313106868-34e0bfed6e40"),
    lines: [
      { t: "But the true beauty of Sri Lanka" },
      { t: "is not in its mountains, beaches or monuments." },
      { t: "It is found in its people.", k: "big" },
      { t: "Warm. Resilient. Welcoming.", k: "a" },
      { t: "Proud of their heritage. Hopeful for their future." },
    ],
  },
  {
    no: "12", name: "Sri Lanka Today", img: q("photo-1736142260757-6effc558100a"),
    lines: [
      { t: "Today, Sri Lanka stands between history and innovation —" },
      { t: "a nation preserving thousands of years of heritage" },
      { t: "while embracing tomorrow." },
      { t: "Ancient wisdom. Modern ambition.", k: "a" },
      { t: "One extraordinary island." },
    ],
  },
];

/* Line styling per kind */
function lineClass(k?: Kind) {
  if (k === "big") return "font-black";
  if (k === "a")   return "font-black";
  return "font-semibold";
}
function lineStyle(k?: Kind): React.CSSProperties {
  if (k === "big") return { fontSize: "clamp(32px,5.5vw,76px)", letterSpacing: "-0.035em", color: "#f8fafc", lineHeight: 1.02 };
  if (k === "a")   return { fontSize: "clamp(26px,3.8vw,52px)", letterSpacing: "-0.03em", color: "#f6b93b", lineHeight: 1.05 };
  return { fontSize: "clamp(19px,2.4vw,32px)", color: "#d7deea", lineHeight: 1.4 };
}

export default function StoryExperience() {
  const [active, setActive] = useState<{ n: string; name: string }>({ n: "01", name: "Before the Kingdoms" });
  const barRef = useRef<HTMLDivElement>(null);

  const onChapter = useCallback((n: string, name: string) => {
    setActive((prev) => (prev.n === n && prev.name === name ? prev : { n, name }));
  }, []);

  /* Top scroll-progress bar */
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      {/* Fixed scroll-progress bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none" style={{ background: "rgba(255,255,255,.07)" }}>
        <div ref={barRef} className="h-full origin-left" style={{ background: "#f6b93b", transform: "scaleX(0)" }} />
      </div>

      {/* Live chapter indicator */}
      <div className="fixed left-5 bottom-5 z-[60] pointer-events-none hidden md:flex items-center gap-3 select-none">
        <span className="font-black tabular-nums" style={{ fontSize: "13px", color: "#f6b93b", letterSpacing: ".05em" }}>{active.n}</span>
        <span className="w-7 h-px" style={{ background: "rgba(255,255,255,.25)" }} />
        <span className="text-[11px] font-bold uppercase tracking-[.2em]" style={{ color: "rgba(255,255,255,.55)" }}>{active.name}</span>
      </div>

      <StoryTitle />
      <Chapter ch={CHAPTERS[0]} onChapter={onChapter} />
      {/* WebGL fly-through ends here */}
      <div id="webgl-end" />
      {CHAPTERS.slice(1).map((c) => (
        <Chapter key={c.no} ch={c} onChapter={onChapter} />
      ))}
      <StoryFinal onChapter={onChapter} />
    </>
  );
}

/* ── Title ─────────────────────────────────────────────────────── */
function StoryTitle() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".st-line", { yPercent: 120 });
      const tl = gsap.timeline({ delay: 0.3 });
      tl.to(".st-kicker", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" })
        .to(".st-line", { yPercent: 0, stagger: 0.14, duration: 1.1, ease: "power3.out" }, 0.2)
        .to(".st-sub", { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 1.0)
        .to(".st-hint", { opacity: 1, duration: 0.8 }, 1.5);

      gsap.to(ref.current, {
        opacity: 0, yPercent: -12, ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: 1 },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "transparent" }}>
      {/* Starfield over the WebGL mountains */}
      <div className="story-stars absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 45%, rgba(2,6,23,.35) 0%, transparent 60%), linear-gradient(to bottom, rgba(2,6,23,.4), transparent 35%, transparent 65%, rgba(2,6,23,.65))" }} />

      <div className="relative z-10 text-center w-[min(1100px,92%)] select-none">
        <p className="st-kicker text-gold text-[11px] md:text-[12px] font-black uppercase tracking-[.34em] mb-7" style={{ opacity: 0, transform: "translateY(18px)" }}>
          PearlTrail Lanka Presents
        </p>
        <h1 className="font-black" style={{ fontSize: "clamp(36px,7.5vw,108px)", letterSpacing: "-0.045em", color: "#f8fafc", lineHeight: 0.95, textShadow: "0 10px 50px rgba(0,0,0,.55)" }}>
          <span className="block overflow-hidden"><span className="st-line block">The Story of</span></span>
          <span className="block overflow-hidden"><span className="st-line block italic" style={{ color: "#f6b93b" }}>Sri Lanka.</span></span>
        </h1>
        <p className="st-sub mx-auto mt-7 text-[14px] md:text-[17px] font-bold uppercase tracking-[.28em]" style={{ color: "#c7d0de", opacity: 0, transform: "translateY(24px)" }}>
          The Pearl of the Indian Ocean
        </p>
        <div className="st-hint mt-14 flex flex-col items-center gap-2 text-[10px] font-black tracking-[.25em] uppercase" style={{ color: "rgba(255,255,255,.55)", opacity: 0 }}>
          <div className="w-5 h-8 rounded-full flex justify-center pt-1.5" style={{ border: "1px solid rgba(255,255,255,.4)" }}>
            <div className="w-0.5 h-2 rounded-full animate-bounce" style={{ background: "rgba(255,255,255,.7)" }} />
          </div>
          Begin the Journey
        </div>
      </div>
    </section>
  );
}

/* ── Chapter ───────────────────────────────────────────────────── */
function Chapter({ ch, onChapter }: { ch: Ch; onChapter?: (n: string, name: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = ref.current!;

      /* Background parallax */
      if (imgRef.current) {
        if (ch.effect === "rise") {
          gsap.fromTo(imgRef.current, { yPercent: 16, scale: 1.16 }, {
            yPercent: -6, scale: 1.08, ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 },
          });
        } else if (ch.effect === "pan") {
          gsap.fromTo(imgRef.current, { xPercent: -6, scale: 1.18 }, {
            xPercent: 6, scale: 1.18, ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 },
          });
        } else {
          gsap.fromTo(imgRef.current, { yPercent: -8, scale: 1.14 }, {
            yPercent: 10, scale: 1.14, ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 },
          });
        }
      }

      /* "Emerge from the dark" reveal (leopard) */
      if (ch.effect === "dark" && darkRef.current) {
        gsap.fromTo(darkRef.current, { opacity: 0.92 }, {
          opacity: 0.35, ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "center center", scrub: 1 },
        });
      }

      /* Line reveal */
      gsap.from(section.querySelectorAll(".line"), {
        yPercent: 118, opacity: 0, duration: 0.95, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 60%", once: true },
      });

      /* Active-chapter indicator */
      ScrollTrigger.create({
        trigger: section, start: "top 55%", end: "bottom 55%",
        onEnter:     () => onChapter?.(ch.no, ch.name),
        onEnterBack: () => onChapter?.(ch.no, ch.name),
      });
    }, ref);
    return () => ctx.revert();
  }, [ch, onChapter]);

  const isWebgl = ch.img === null;

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: isWebgl ? "transparent" : "#020617" }}
    >
      {/* Background image */}
      {!isWebgl && (
        <>
          <div
            ref={imgRef}
            className="absolute inset-[-8%] bg-cover bg-center will-change-transform"
            style={{ backgroundImage: `url('${ch.img}')` }}
          />
          {/* Readability grade */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(90deg, rgba(2,6,23,.92) 0%, rgba(2,6,23,.7) 38%, rgba(2,6,23,.25) 70%, rgba(2,6,23,.45) 100%), linear-gradient(to bottom, rgba(2,6,23,.5) 0%, transparent 30%, transparent 70%, rgba(2,6,23,.7) 100%)",
          }} />
          {ch.effect === "dark" && <div ref={darkRef} className="absolute inset-0 pointer-events-none" style={{ background: "#020617" }} />}
        </>
      )}
      {isWebgl && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(2,6,23,.55) 0%, transparent 65%)" }} />
      )}

      {/* Giant chapter number watermark */}
      <span className="absolute pointer-events-none select-none font-black" style={{
        right: "4%", top: "8%", fontSize: "clamp(120px,26vw,420px)", lineHeight: 1,
        color: "rgba(255,255,255,.035)", letterSpacing: "-0.05em",
      }}>{ch.no}</span>

      {/* Content */}
      <div className="relative z-10 w-[min(1180px,100%)] mx-auto px-6 md:px-12">
        <div className="max-w-[820px]">
          <div className="overflow-hidden mb-7">
            <p className="line text-gold text-[11px] md:text-[12px] font-black uppercase tracking-[.28em]">
              Chapter {ch.no} · {ch.name}
            </p>
          </div>
          <div className="flex flex-col gap-3 md:gap-4">
            {ch.lines.map((l, i) => (
              <div key={i} className="overflow-hidden">
                <p className={`line ${lineClass(l.k)}`} style={lineStyle(l.k)}>{l.t}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Final ─────────────────────────────────────────────────────── */
function StoryFinal({ onChapter }: { onChapter?: (n: string, name: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = ref.current!;
      gsap.fromTo(imgRef.current, { scale: 1.25 }, {
        scale: 1.1, ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 },
      });
      gsap.from(section.querySelectorAll(".fline"), {
        yPercent: 120, opacity: 0, duration: 1, stagger: 0.13, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 55%", once: true },
      });
      gsap.from(section.querySelector(".fbtn"), {
        opacity: 0, y: 30, duration: 0.8, ease: "back.out(1.5)",
        scrollTrigger: { trigger: section, start: "top 45%", once: true },
      });
      ScrollTrigger.create({
        trigger: section, start: "top 55%", end: "bottom bottom",
        onEnter: () => onChapter?.("✦", "Welcome to Sri Lanka"),
        onEnterBack: () => onChapter?.("✦", "Welcome to Sri Lanka"),
      });
    }, ref);
    return () => ctx.revert();
  }, [onChapter]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "#020617" }}>
      <div ref={imgRef} className="absolute inset-[-10%] bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url('${q("photo-1734279135115-6d8984e08206")}')` }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(2,6,23,.55) 0%, rgba(2,6,23,.82) 100%)",
      }} />

      <div className="relative z-10 text-center w-[min(900px,92%)] px-4">
        <div className="flex flex-col gap-2 md:gap-3 mb-3">
          {["One island.", "Thousands of stories.", "Millions of memories waiting to be made."].map((t, i) => (
            <div key={i} className="overflow-hidden">
              <p className="fline font-bold" style={{ fontSize: "clamp(20px,3vw,38px)", color: "#d7deea" }}>{t}</p>
            </div>
          ))}
        </div>
        <div className="overflow-hidden mt-4">
          <h2 className="fline font-black" style={{ fontSize: "clamp(38px,7vw,96px)", letterSpacing: "-0.045em", color: "#f8fafc", lineHeight: 0.96 }}>
            Welcome to Sri Lanka.
          </h2>
        </div>
        <div className="overflow-hidden">
          <p className="fline font-black italic" style={{ fontSize: "clamp(20px,3.4vw,46px)", color: "#f6b93b", letterSpacing: "-0.02em", marginTop: ".25em" }}>
            The Pearl of the Indian Ocean.
          </p>
        </div>

        <div className="fbtn mt-10 flex flex-wrap gap-3 justify-center">
          <Link href="/packages" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black px-8 py-4 rounded-full text-sm transition-all hover:-translate-y-0.5 shadow-[0_14px_40px_rgba(246,185,59,.42)]">
            Begin Your Journey →
          </Link>
          <a href="https://wa.me/94741838376" target="_blank" rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-8 py-4 rounded-full text-sm transition-all hover:-translate-y-0.5">
            Talk to Us
          </a>
        </div>
      </div>
    </section>
  );
}
