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

const field = "w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-sm outline-none focus:border-gold";
const labelCls = "block text-white/60 text-xs font-bold uppercase tracking-wider mb-1.5";

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
    <main className="min-h-screen px-5 py-8" style={{ background: "#020617" }}>
      <div className="w-[min(1480px,100%)] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white font-black text-2xl">{isNew ? "New Package" : "Edit Package"}</h1>
          <Link href="/admin" className="text-white/50 hover:text-white text-sm">← Back</Link>
        </div>

        <form action={savePackage} className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-8 items-start">
          {/* ── LEFT: route map editor (sticky, mirrors the detail page) ── */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <h2 className="text-white font-black text-lg mb-1">Route Map</h2>
            <p className="text-white/40 text-xs mb-4">
              Click the island to trace the route in travel order, then name the cities and tag each
              to its day. On the package page the head moves between these stops as the visitor scrolls.
              Leave empty to hide the map.
            </p>
            <MapEditor value={map} onChange={setMap} dayCount={days.length} />
            <input type="hidden" name="map" value={JSON.stringify(map)} />
          </div>

          {/* ── RIGHT: package details + itinerary ───────────────────── */}
          <div className="flex flex-col gap-4">
          {/* Image */}
          <div>
            <span className={labelCls}>Cover image</span>
            <div className="flex items-center gap-4">
              <div className="w-28 h-20 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {img ? <img src={img} alt="" className="w-full h-full object-cover" /> : <span className="text-white/30 text-[10px] grid place-items-center h-full">no image</span>}
              </div>
              <div>
                <input type="file" accept="image/*" onChange={handleFile} className="text-white/70 text-xs" />
                {uploading && <p className="text-gold text-xs mt-1">Uploading…</p>}
                {err && <p className="text-red-400 text-xs mt-1">{err}</p>}
              </div>
            </div>
            <input type="hidden" name="img" value={img} />
            <input
              type="url" value={img} onChange={(e) => setImg(e.target.value)} placeholder="…or paste an image URL"
              className={`${field} mt-2`}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>ID / slug {isNew && <span className="text-gold">(used in the URL)</span>}</label>
              <input name="id" defaultValue={initial.id ?? ""} readOnly={!isNew} required placeholder="e.g. kandy"
                className={`${field} ${!isNew ? "opacity-60" : ""}`} />
            </div>
            <div>
              <label className={labelCls}>Display order</label>
              <input name="sort" type="number" defaultValue={initial.sort ?? 0} className={field} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Title</label>
            <input name="title" defaultValue={initial.title ?? ""} required className={field} />
          </div>

          <div>
            <label className={labelCls}>Tagline</label>
            <input name="tagline" defaultValue={initial.tagline ?? ""} className={field} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Days (e.g. 2D / 1N)</label>
              <input name="days" defaultValue={initial.days ?? ""} className={field} />
            </div>
            <div>
              <label className={labelCls}>Price (e.g. LKR 45,000)</label>
              <input name="price" defaultValue={initial.price ?? ""} className={field} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Highlights (separate with ·)</label>
            <input name="desc" defaultValue={initial.desc ?? ""} placeholder="Temple of the Tooth · Kandy Lake · Cultural Show" className={field} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Included</label>
              <textarea name="inc" defaultValue={initial.inc ?? ""} rows={2} className={field} />
            </div>
            <div>
              <label className={labelCls}>Excluded</label>
              <textarea name="exc" defaultValue={initial.exc ?? ""} rows={2} className={field} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Overview (long description)</label>
            <textarea name="overview" defaultValue={initial.overview ?? ""} rows={5} className={field} />
          </div>

          {/* Multi-day itinerary (optional) — tabbed day editor */}
          <div className="border-t border-white/10 pt-5 mt-1">
            <ItineraryEditor days={days} onChange={setDays} />
            {/* serialized for the server action */}
            <input type="hidden" name="itinerary" value={JSON.stringify(serialize(days))} />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-7 py-3 rounded-full transition-colors">
              {isNew ? "Create Package" : "Save Changes"}
            </button>
            <Link href="/admin" className="bg-white/[.06] hover:bg-white/[.12] border border-white/10 text-white/80 font-bold text-sm px-6 py-3 rounded-full transition-colors flex items-center">
              Cancel
            </Link>
          </div>
          </div>
        </form>
      </div>
    </main>
  );
}
