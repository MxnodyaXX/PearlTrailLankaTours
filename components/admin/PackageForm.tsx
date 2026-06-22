"use client";

import { useState } from "react";
import Link from "next/link";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import { savePackage } from "@/app/admin/actions";
import ItineraryEditor, { type DayDraft, type DayPhoto } from "./ItineraryEditor";
import MapEditor from "./MapEditor";
import type { DayPlan, PackageMap } from "@/lib/packages-data";

interface PkgRow {
  id?: string; title?: string; tagline?: string; days?: string; price?: string;
  img?: string; desc?: string; inc?: string; exc?: string; overview?: string;
  sort?: number; itinerary?: DayPlan[]; map?: PackageMap;
}

/* Convert stored itinerary → editable drafts */
function toDrafts(itin: DayPlan[] = []): DayDraft[] {
  return itin.map((d) => {
    const photos: DayPhoto[] = [];
    if (d.img) photos.push({ url: d.img, caption: "" });
    (d.gallery ?? []).forEach((g) => { if (photos.length < 3) photos.push({ url: g.img, caption: g.caption }); });
    return {
      title: d.title ?? "", subtitle: d.subtitle ?? "", description: d.description ?? "",
      highlights: (d.highlights ?? []).join("\n"), stay: d.stay ?? "",
      photos, thumb: 0, // stored img is always first → thumbnail = slot 0
    };
  });
}

/* Convert editable drafts → itinerary to store */
function serialize(days: DayDraft[]): DayPlan[] {
  return days.map((d, i) => {
    const photos = d.photos.filter((p): p is DayPhoto => !!p && !!p.url);
    const thumb = (d.photos[d.thumb] && d.photos[d.thumb]!.url) ? d.photos[d.thumb]! : photos[0];
    const gallery = photos
      .filter((p) => p.url !== thumb?.url)
      .map((p) => ({ img: p.url, caption: p.caption || "" }));
    return {
      day: i + 1,
      title: d.title.trim(),
      subtitle: d.subtitle.trim(),
      description: d.description.trim(),
      highlights: d.highlights.split("\n").map((s) => s.trim()).filter(Boolean),
      img: thumb?.url ?? "",
      gallery,
      stay: d.stay.trim(),
    };
  });
}

const field = "w-full bg-white/[.03] border border-white/[.12] rounded-xl px-3.5 py-2.5 text-white text-sm outline-none transition-colors focus:border-gold/70 focus:bg-white/[.05] placeholder:text-white/25";
const labelCls = "block text-white/55 text-[11px] font-bold uppercase tracking-[.12em] mb-1.5";
const card = "rounded-2xl border border-white/[.08] bg-white/[.02] p-5 md:p-6";

function Section({ n, title, hint, children }: { n: number | string; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className={card}>
      <div className="flex items-start gap-3 mb-5">
        <span className="w-7 h-7 rounded-lg grid place-items-center text-xs font-black bg-gold/15 text-gold shrink-0 mt-0.5">{n}</span>
        <div>
          <h2 className="text-white font-black text-[15px] leading-tight">{title}</h2>
          {hint && <p className="text-white/40 text-xs mt-0.5">{hint}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function PackageForm({ initial = {}, isNew = false }: { initial?: PkgRow; isNew?: boolean }) {
  const [img, setImg] = useState(initial.img ?? "");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [days, setDays] = useState<DayDraft[]>(toDrafts(initial.itinerary));
  const [map, setMap] = useState<PackageMap>(initial.map ?? { route: [], stops: [] });

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr("");
    const supabase = createSupabaseBrowser();
    const path = `packages/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;
    const { error } = await supabase.storage.from("package-images").upload(path, file, { upsert: true });
    if (error) { setErr(error.message); setUploading(false); return; }
    const { data } = supabase.storage.from("package-images").getPublicUrl(path);
    setImg(data.publicUrl);
    setUploading(false);
  }

  return (
    <main className="min-h-screen pb-10" style={{ background: "#020617" }}>
      {/* ── Sticky action bar ─────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-white/[.08] bg-[#020617]/85 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 px-4 md:px-6 h-16">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin" className="w-9 h-9 grid place-items-center rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition-colors shrink-0">←</Link>
            <div className="min-w-0">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[.18em]">{isNew ? "Create" : "Edit"}</p>
              <h1 className="text-white font-black text-lg leading-tight truncate">{initial.title || (isNew ? "New Package" : "Edit Package")}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/admin" className="text-white/70 hover:text-white font-bold text-sm px-4 py-2 rounded-full transition-colors">Cancel</Link>
            <button type="submit" form="pkg-form" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-6 py-2.5 rounded-full transition-colors">
              {isNew ? "Create Package" : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <form id="pkg-form" action={savePackage} className="px-3 md:px-4 pt-5 grid xl:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] gap-5 items-start">
        {/* ── LEFT: route map editor (sticky, mirrors the detail page) ── */}
        <div className="xl:sticky xl:top-[84px] xl:self-start">
          <div className={`${card} !p-4`}>
            <div className="flex items-start gap-3 mb-4">
              <span className="w-7 h-7 rounded-lg grid place-items-center text-xs font-black bg-gold/15 text-gold shrink-0 mt-0.5">★</span>
              <div>
                <h2 className="text-white font-black text-[15px] leading-tight">Route Map</h2>
                <p className="text-white/40 text-xs mt-0.5">Trace the route in travel order, then name the cities and tag each to its day. Leave empty to hide the map.</p>
              </div>
            </div>
            <MapEditor value={map} onChange={setMap} dayCount={days.length} />
            <input type="hidden" name="map" value={JSON.stringify(map)} />
          </div>
        </div>

        {/* ── RIGHT: package details + itinerary ───────────────────── */}
        <div className="flex flex-col gap-5">
          <Section n={1} title="Package basics" hint="The essentials shown on the listing card and hero.">
            {/* Cover image */}
            <div className="mb-4">
              <span className={labelCls}>Cover image</span>
              <div className="flex gap-3">
                <div className="w-32 h-24 rounded-xl overflow-hidden bg-white/[.04] border border-white/10 shrink-0 grid place-items-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <span className="text-white/25 text-[10px]">no image</span>}
                </div>
                <div className="flex-1 flex flex-col justify-center gap-2 min-w-0">
                  <label className="inline-flex items-center justify-center gap-2 cursor-pointer bg-white/[.06] hover:bg-white/[.12] border border-white/10 text-white/80 font-bold text-xs px-4 py-2 rounded-lg transition-colors w-fit">
                    {uploading ? "Uploading…" : "Upload image"}
                    <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  </label>
                  <input type="url" value={img} onChange={(e) => setImg(e.target.value)} placeholder="…or paste an image URL" className={field} />
                  {err && <p className="text-red-400 text-xs">{err}</p>}
                </div>
              </div>
              <input type="hidden" name="img" value={img} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelCls}>ID / slug {isNew && <span className="text-gold normal-case tracking-normal">· used in the URL</span>}</label>
                <input name="id" defaultValue={initial.id ?? ""} readOnly={!isNew} required placeholder="e.g. kandy"
                  className={`${field} ${!isNew ? "opacity-60 cursor-not-allowed" : ""}`} />
              </div>
              <div>
                <label className={labelCls}>Display order</label>
                <input name="sort" type="number" defaultValue={initial.sort ?? 0} className={field} />
              </div>
            </div>

            <div className="mb-4">
              <label className={labelCls}>Title</label>
              <input name="title" defaultValue={initial.title ?? ""} required placeholder="Kandy Day Tour" className={field} />
            </div>

            <div className="mb-4">
              <label className={labelCls}>Tagline</label>
              <input name="tagline" defaultValue={initial.tagline ?? ""} placeholder="A short, evocative one-liner" className={field} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Duration</label>
                <input name="days" defaultValue={initial.days ?? ""} placeholder="2D / 1N" className={field} />
              </div>
              <div>
                <label className={labelCls}>Price</label>
                <input name="price" defaultValue={initial.price ?? ""} placeholder="LKR 45,000" className={field} />
              </div>
            </div>
          </Section>

          <Section n={2} title="Description" hint="Highlights, what's included, and the long overview.">
            <div className="mb-4">
              <label className={labelCls}>Highlights <span className="text-white/30 normal-case tracking-normal">· separate with ·</span></label>
              <input name="desc" defaultValue={initial.desc ?? ""} placeholder="Temple of the Tooth · Kandy Lake · Cultural Show" className={field} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelCls}>Included</label>
                <textarea name="inc" defaultValue={initial.inc ?? ""} rows={3} className={field} />
              </div>
              <div>
                <label className={labelCls}>Excluded</label>
                <textarea name="exc" defaultValue={initial.exc ?? ""} rows={3} className={field} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Overview <span className="text-white/30 normal-case tracking-normal">· long description</span></label>
              <textarea name="overview" defaultValue={initial.overview ?? ""} rows={5} className={field} />
            </div>
          </Section>

          {/* Multi-day itinerary (optional) — tabbed day editor */}
          <section className={card}>
            <ItineraryEditor days={days} onChange={setDays} />
            <input type="hidden" name="itinerary" value={JSON.stringify(serialize(days))} />
          </section>
        </div>
      </form>
    </main>
  );
}
