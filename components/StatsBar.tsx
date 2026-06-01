"use client";
import { useEffect, useRef, useState } from "react";

const stats = [
  { num: 5000, suffix: "+", label: "Happy Travelers" },
  { num: 50,   suffix: "+", label: "Destinations" },
  { num: 100,  suffix: "%", label: "Satisfaction" },
  { num: 30,   suffix: "+", label: "Vehicles" },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0);
  const ref  = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !done.current) {
          done.current = true;
          const dur = 1800;
          const step = target / (dur / 16);
          let cur = 0;
          const id = setInterval(() => {
            cur += step;
            if (cur >= target) { setVal(target); clearInterval(id); }
            else setVal(Math.floor(cur));
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="tabular-nums">
      {val.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsBar() {
  return (
    <section className="bg-[#0f172a] py-12 border-y border-white/5">
      <div className="w-[min(1120px,calc(100%-32px))] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center gap-1">
            <p
              className="font-black text-gold leading-none"
              style={{ fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.04em" }}
            >
              <Counter target={s.num} suffix={s.suffix} />
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[.15em] text-white/40">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
