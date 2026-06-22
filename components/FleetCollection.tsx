"use client";

import { useMemo, useState } from "react";
import { BADGE_TONES as TONE, fmtPrice, type Vehicle } from "@/lib/vehicles-data";
import { useSettings } from "@/components/SettingsProvider";
import { waHref } from "@/lib/site-config";

const SORTS = [
  { id: "popular", label: "Most Popular" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
] as const;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-gold text-xs font-black">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
      {rating.toFixed(1)}
    </span>
  );
}

export default function FleetCollection({ vehicles }: { vehicles: Vehicle[] }) {
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("popular");
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [failed, setFailed] = useState<Set<string>>(new Set());
  const settings = useSettings();

  const CATEGORIES = useMemo(() => ["All", ...Array.from(new Set(vehicles.map((v) => v.category)))], [vehicles]);

  const toggleFav = (id: string) =>
    setFavs((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const list = useMemo(() => {
    let v = cat === "All" ? vehicles : vehicles.filter((x) => x.category === cat);
    v = [...v];
    if (sort === "price-asc") v.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") v.sort((a, b) => b.price - a.price);
    else if (sort === "rating") v.sort((a, b) => b.rating - a.rating);
    return v;
  }, [cat, sort, vehicles]);

  return (
    <section id="fleet" className="bg-navy py-16 px-4 md:px-5">
      <div className="w-[min(1200px,100%)] mx-auto">
        {/* Heading */}
        <div className="mb-7">
          <p className="text-gold text-[11px] font-black uppercase tracking-[.2em] mb-2">Choose Your Ride</p>
          <h2 className="font-black text-white text-3xl md:text-4xl" style={{ letterSpacing: "-0.03em" }}>
            Browse Our Fleet
          </h2>
          <p className="text-white/40 text-sm mt-2">Every vehicle comes with a professional, English-speaking driver. Rates are per day.</p>
        </div>

        {/* Toolbar: filters + sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-7">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const on = c === cat;
              return (
                <button key={c} type="button" onClick={() => setCat(c)}
                  className="text-xs font-bold px-4 py-2 rounded-full border transition-all duration-200"
                  style={{
                    background: on ? "#f6b93b" : "rgba(255,255,255,0.04)",
                    color: on ? "#0f172a" : "rgba(255,255,255,0.7)",
                    borderColor: on ? "#f6b93b" : "rgba(255,255,255,0.1)",
                  }}>
                  {c === "All" ? "All Vehicles" : c}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-white/40 text-xs whitespace-nowrap"><b className="text-white/70">{list.length}</b> vehicles</span>
            <div className="relative">
              <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
                className="appearance-none bg-white/[.05] border border-white/10 text-white/80 text-xs font-bold pl-3.5 pr-8 py-2.5 rounded-full outline-none focus:border-gold/60 cursor-pointer">
                {SORTS.map((s) => <option key={s.id} value={s.id} className="bg-[#0b1426] text-white">{s.label}</option>)}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-6" /></svg>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.map((v) => {
            const waLink = waHref(settings, `Hi PearlTrail, I'd like to book the ${v.name} (${fmtPrice(v.price)}/day with driver).`);
            const showImg = v.image && !failed.has(v.id);
            return (
              <article key={v.id} data-glow
                className="group bg-white/[.04] border border-white/[.08] rounded-2xl overflow-hidden flex flex-col
                  hover:border-gold/40 hover:bg-white/[.06] transition-all duration-300">
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  {showImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.image} alt={v.name} onError={() => setFailed((s) => new Set(s).add(v.id))}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center overflow-hidden"
                      style={{ background: "radial-gradient(ellipse 90% 85% at 50% 25%, rgba(246,185,59,.10), transparent 62%), linear-gradient(160deg,#0c1730,#020617)" }}>
                      <span className="absolute right-3 -bottom-3 font-black leading-none select-none" style={{ fontSize: 58, color: "rgba(255,255,255,0.045)", letterSpacing: "-0.04em" }}>{v.category}</span>
                      <span className="text-5xl" style={{ filter: "drop-shadow(0 6px 14px rgba(0,0,0,.5))" }}>{v.emoji}</span>
                    </div>
                  )}

                  {v.badge && (
                    <span className="absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full"
                      style={{ background: TONE[v.badge.tone].bg, color: TONE[v.badge.tone].fg }}>
                      {v.badge.label}
                    </span>
                  )}

                  <button type="button" onClick={() => toggleFav(v.id)} aria-label="Save"
                    className="absolute top-2.5 right-2.5 w-8 h-8 grid place-items-center rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" strokeWidth="2"
                      fill={favs.has(v.id) ? "#f6b93b" : "none"} stroke={favs.has(v.id) ? "#f6b93b" : "rgba(255,255,255,.7)"}>
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </button>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-gold text-[10px] font-black uppercase tracking-[.14em] mb-1">{v.category}</p>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-white text-[15px] leading-tight">{v.name}</h3>
                    <Stars rating={v.rating} />
                  </div>
                  <p className="text-white/35 text-[11px] mt-1 line-clamp-1">{v.models}</p>

                  {/* Specs */}
                  <div className="flex items-center gap-3 mt-3 text-white/55 text-[11px] font-semibold">
                    <span className="inline-flex items-center gap-1">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /></svg>
                      {v.seats} Seats
                    </span>
                    <span className="w-px h-3 bg-white/15" />
                    <span className="inline-flex items-center gap-1">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 22V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v18" /><path d="M3 12h10" /><path d="M14 8h2a2 2 0 0 1 2 2v6a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5" /></svg>
                      {v.fuel}
                    </span>
                    <span className="w-px h-3 bg-white/15" />
                    <span>{v.transmission}</span>
                  </div>

                  {/* Price + CTA */}
                  <div className="mt-4 pt-3 border-t border-white/[.08] flex items-end justify-between gap-2">
                    <p className="leading-none">
                      <span className="text-gold font-black text-lg">{fmtPrice(v.price)}</span>
                      <span className="text-white/40 text-[11px] font-bold"> /day</span>
                    </p>
                  </div>
                  <a href={waLink} target="_blank" rel="noopener noreferrer"
                    className="mt-3 bg-white/[.07] hover:bg-gold hover:text-[#0f172a] text-white text-xs font-black px-4 py-2.5 rounded-full text-center transition-all duration-300 inline-flex items-center justify-center gap-1.5">
                    Reserve This <span aria-hidden>→</span>
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <p className="text-white/35 text-xs text-center mt-8">
          Rates are starting prices and include a professional driver. <a href="/contact" className="text-gold hover:underline">Contact us</a> for an exact quote.
        </p>
      </div>
    </section>
  );
}
