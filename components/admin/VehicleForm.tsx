"use client";

import { useState } from "react";
import Link from "next/link";
import { uploadPackageImage } from "@/lib/supabase/browser";
import { saveVehicle } from "@/app/admin/actions";
import { BADGE_TONES, fmtPrice, type BadgeTone } from "@/lib/vehicles-data";

interface VehicleRow {
  id?: string; name?: string; category?: string; models?: string;
  seats?: number; fuel?: string; transmission?: string; rating?: number;
  price?: number; emoji?: string; image?: string;
  badge_label?: string; badge_tone?: string; active?: boolean; sort?: number;
}

const field = "w-full bg-white/[.03] border border-white/[.12] rounded-xl px-3.5 py-2.5 text-white text-sm outline-none transition-colors focus:border-gold/70 focus:bg-white/[.05] placeholder:text-white/25";
const labelCls = "block text-white/55 text-[11px] font-bold uppercase tracking-[.12em] mb-1.5";
const card = "rounded-2xl border border-white/[.08] bg-white/[.02] p-5 md:p-6";

const CATEGORIES = ["Economy", "Sedan", "SUV", "Van", "Mini", "Luxury", "Tuk-Tuk", "Coach"];
const TONES: BadgeTone[] = ["gold", "emerald", "blue", "purple", "teal"];

export default function VehicleForm({ initial = {}, isNew = false }: { initial?: VehicleRow; isNew?: boolean }) {
  const [img, setImg] = useState(initial.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  // controlled bits → drive the live preview
  const [name, setName] = useState(initial.name ?? "");
  const [category, setCategory] = useState(initial.category ?? "");
  const [emoji, setEmoji] = useState(initial.emoji ?? "🚗");
  const [price, setPrice] = useState<number>(initial.price ?? 0);
  const [rating, setRating] = useState<number>(initial.rating ?? 4.8);
  const [seats, setSeats] = useState<number>(initial.seats ?? 4);
  const [fuel, setFuel] = useState(initial.fuel ?? "Petrol");
  const [transmission, setTransmission] = useState(initial.transmission ?? "Auto");
  const [badgeLabel, setBadgeLabel] = useState(initial.badge_label ?? "");
  const [badgeTone, setBadgeTone] = useState<BadgeTone>((initial.badge_tone as BadgeTone) || "gold");
  const [active, setActive] = useState<boolean>(initial.active ?? true);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr("");
    const { url, error } = await uploadPackageImage(file);
    setUploading(false);
    if (error) { setErr(error); return; }
    if (url) setImg(url);
  }

  const tone = BADGE_TONES[badgeTone];

  return (
    <main className="min-h-screen pb-10" style={{ background: "#020617" }}>
      {/* Sticky action bar */}
      <header className="sticky top-0 z-30 border-b border-white/[.08] bg-[#020617]/85 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 px-4 md:px-6 h-16">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin/vehicles" className="w-9 h-9 grid place-items-center rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition-colors shrink-0">←</Link>
            <div className="min-w-0">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[.18em]">{isNew ? "Create" : "Edit"} · Vehicle</p>
              <h1 className="text-white font-black text-lg leading-tight truncate">{name || (isNew ? "New Vehicle" : "Edit Vehicle")}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/admin/vehicles" className="text-white/70 hover:text-white font-bold text-sm px-4 py-2 rounded-full transition-colors">Cancel</Link>
            <button type="submit" form="veh-form" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-6 py-2.5 rounded-full transition-colors">
              {isNew ? "Create Vehicle" : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <form id="veh-form" action={saveVehicle} className="px-3 md:px-4 pt-5 grid lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] gap-5 items-start max-w-[1100px] mx-auto">
        {/* ── LEFT: live preview ─────────────────────────────────── */}
        <div className="lg:sticky lg:top-[84px]">
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-[.12em] mb-2">Live preview</p>
          <article className={`bg-white/[.04] border border-white/[.08] rounded-2xl overflow-hidden transition-opacity ${active ? "" : "opacity-45"}`}>
            <div className="relative h-44 overflow-hidden">
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={img} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center overflow-hidden"
                  style={{ background: "radial-gradient(ellipse 90% 85% at 50% 25%, rgba(246,185,59,.10), transparent 62%), linear-gradient(160deg,#0c1730,#020617)" }}>
                  <span className="absolute right-3 -bottom-3 font-black leading-none select-none" style={{ fontSize: 58, color: "rgba(255,255,255,0.045)", letterSpacing: "-0.04em" }}>{category || "Fleet"}</span>
                  <span className="text-5xl">{emoji || "🚗"}</span>
                </div>
              )}
              {badgeLabel && (
                <span className="absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-full" style={{ background: tone.bg, color: tone.fg }}>
                  {badgeLabel}
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="text-gold text-[10px] font-black uppercase tracking-[.14em] mb-1">{category || "Category"}</p>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-black text-white text-[15px] leading-tight">{name || "Vehicle name"}</h3>
                <span className="inline-flex items-center gap-1 text-gold text-xs font-black">★ {Number(rating || 0).toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-3 mt-3 text-white/55 text-[11px] font-semibold">
                <span>{seats || 0} Seats</span><span className="w-px h-3 bg-white/15" />
                <span>{fuel || "—"}</span><span className="w-px h-3 bg-white/15" />
                <span>{transmission || "—"}</span>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[.08]">
                <span className="text-gold font-black text-lg">{fmtPrice(price || 0)}</span>
                <span className="text-white/40 text-[11px] font-bold"> /day</span>
              </div>
            </div>
          </article>

          {!active && <p className="text-amber-300/80 text-[11px] mt-2">Hidden — this vehicle won’t appear on the Rent-a-Car page.</p>}
        </div>

        {/* ── RIGHT: form fields ─────────────────────────────────── */}
        <section className={card}>
          {/* Availability toggle */}
          <div className="flex items-center justify-between mb-5 pb-5 border-b border-white/[.08]">
            <div>
              <p className="text-white font-bold text-sm">Visibility</p>
              <p className="text-white/40 text-xs">{active ? "Shown on the Rent-a-Car page." : "Hidden from the website."}</p>
            </div>
            <button type="button" role="switch" aria-checked={active} onClick={() => setActive((a) => !a)}
              className="relative w-14 h-7 rounded-full transition-colors shrink-0"
              style={{ background: active ? "#10b981" : "rgba(255,255,255,0.14)" }}>
              <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: active ? "translateX(28px)" : "translateX(0)" }} />
            </button>
          </div>
          <input type="hidden" name="active" value={active ? "on" : "off"} />

          {/* Image */}
          <div className="mb-4">
            <span className={labelCls}>Photo</span>
            <div className="flex gap-3">
              <div className="w-32 h-24 rounded-xl overflow-hidden bg-white/[.04] border border-white/10 shrink-0 grid place-items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <span className="text-white/25 text-[10px]">no image</span>}
              </div>
              <div className="flex-1 flex flex-col justify-center gap-2 min-w-0">
                <label className="inline-flex items-center justify-center gap-2 cursor-pointer bg-white/[.06] hover:bg-white/[.12] border border-white/10 text-white/80 font-bold text-xs px-4 py-2 rounded-lg transition-colors w-fit">
                  {uploading ? "Uploading…" : "Upload photo"}
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
                <input type="url" value={img} onChange={(e) => setImg(e.target.value)} placeholder="…or paste an image URL" className={field} />
                {err && <p className="text-red-400 text-xs">{err}</p>}
              </div>
            </div>
            <input type="hidden" name="image" value={img} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>ID / slug {isNew && <span className="text-gold normal-case tracking-normal">· used internally</span>}</label>
              <input name="id" defaultValue={initial.id ?? ""} readOnly={!isNew} required placeholder="e.g. economy"
                className={`${field} ${!isNew ? "opacity-60 cursor-not-allowed" : ""}`} />
            </div>
            <div>
              <label className={labelCls}>Display order</label>
              <input name="sort" type="number" defaultValue={initial.sort ?? 0} className={field} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={labelCls}>Name</label>
              <input name="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Comfort Sedan" className={field} />
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <input name="category" value={category} onChange={(e) => setCategory(e.target.value)} list="veh-cats" placeholder="Sedan" className={field} />
              <datalist id="veh-cats">{CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
            </div>
          </div>

          <div className="mb-4">
            <label className={labelCls}>Example models <span className="text-white/30 normal-case tracking-normal">· separate with ·</span></label>
            <input name="models" defaultValue={initial.models ?? ""} placeholder="Toyota Axio · Premio · Honda Grace" className={field} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <label className={labelCls}>Seats</label>
              <input name="seats" type="number" min={1} value={seats} onChange={(e) => setSeats(Number(e.target.value))} className={field} />
            </div>
            <div>
              <label className={labelCls}>Fuel</label>
              <input name="fuel" value={fuel} onChange={(e) => setFuel(e.target.value)} placeholder="Petrol" className={field} />
            </div>
            <div>
              <label className={labelCls}>Transmission</label>
              <input name="transmission" value={transmission} onChange={(e) => setTransmission(e.target.value)} placeholder="Auto" className={field} />
            </div>
            <div>
              <label className={labelCls}>Rating</label>
              <input name="rating" type="number" step="0.1" min={0} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} className={field} />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-[1fr_120px] gap-4 mb-4">
            <div>
              <label className={labelCls}>Price <span className="text-white/30 normal-case tracking-normal">· LKR per day</span></label>
              <input name="price" type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="14000" className={field} />
            </div>
            <div>
              <label className={labelCls}>Icon</label>
              <input name="emoji" value={emoji} onChange={(e) => setEmoji(e.target.value)} maxLength={4} placeholder="🚘" className={`${field} text-center text-lg`} />
            </div>
          </div>

          <div className="grid sm:grid-cols-[1fr_160px] gap-4">
            <div>
              <label className={labelCls}>Badge label <span className="text-white/30 normal-case tracking-normal">· optional ribbon</span></label>
              <input name="badge_label" value={badgeLabel} onChange={(e) => setBadgeLabel(e.target.value)} placeholder="Popular" className={field} />
            </div>
            <div>
              <label className={labelCls}>Badge colour</label>
              <select name="badge_tone" value={badgeTone} onChange={(e) => setBadgeTone(e.target.value as BadgeTone)}
                className={`${field} cursor-pointer`}>
                {TONES.map((t) => <option key={t} value={t} className="bg-[#0b1426]">{t}</option>)}
              </select>
            </div>
          </div>
        </section>
      </form>
    </main>
  );
}
