"use client";

import { useState } from "react";
import { uploadPackageImage } from "@/lib/supabase/browser";

export interface DayPhoto { url: string; caption: string }
export interface DayDraft {
  title: string; subtitle: string; description: string;
  highlights: string; stay: string; photos: (DayPhoto | undefined)[]; thumb: number;
}

export const emptyDay = (): DayDraft => ({
  title: "", subtitle: "", description: "", highlights: "", stay: "", photos: [], thumb: 0,
});

const field = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-gold";
const label = "block text-white/55 text-[11px] font-bold uppercase tracking-wider mb-1";

function PhotoSlot({
  photo, isThumb, onUpload, onCaption, onThumb, onRemove,
}: {
  photo?: DayPhoto; isThumb: boolean;
  onUpload: (url: string) => void; onCaption: (c: string) => void;
  onThumb: () => void; onRemove: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true); setErr("");
    const { url, error } = await uploadPackageImage(f);
    setBusy(false);
    if (error) { setErr(error); return; }
    if (url) onUpload(url);
  }

  return (
    <div className="border rounded-lg p-2" style={{ borderColor: isThumb ? "#f6b93b" : "rgba(255,255,255,0.1)" }}>
      <div className="h-24 rounded bg-white/5 overflow-hidden mb-1.5 grid place-items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {photo?.url ? <img src={photo.url} alt="" className="w-full h-full object-cover" /> : <span className="text-white/30 text-[10px]">empty</span>}
      </div>
      {photo?.url ? (
        <>
          <input value={photo.caption} onChange={(e) => onCaption(e.target.value)} placeholder="caption (optional)"
            className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-[11px] mb-1.5 outline-none" />
          <div className="flex items-center justify-between gap-2">
            <button type="button" onClick={onThumb}
              className="text-[10px] font-bold px-2 py-1 rounded-full transition-colors"
              style={{ background: isThumb ? "#f6b93b" : "rgba(255,255,255,0.08)", color: isThumb ? "#0b1220" : "rgba(255,255,255,0.7)" }}>
              {isThumb ? "★ Thumbnail" : "Set as thumbnail"}
            </button>
            <button type="button" onClick={onRemove} className="text-red-300/70 hover:text-red-300 text-[10px]">remove</button>
          </div>
        </>
      ) : (
        <label className="block text-center text-[11px] text-gold cursor-pointer py-2">
          {busy ? "uploading…" : "+ upload"}
          <input type="file" accept="image/*" className="hidden" onChange={pick} />
        </label>
      )}
      {err && <p className="text-red-400 text-[10px] mt-1">{err}</p>}
    </div>
  );
}

export default function ItineraryEditor({ days, onChange }: { days: DayDraft[]; onChange: (d: DayDraft[]) => void }) {
  const [active, setActive] = useState(0);
  const set = (i: number, patch: Partial<DayDraft>) => onChange(days.map((d, idx) => (idx === i ? { ...d, ...patch } : d)));
  const addDay = () => { onChange([...days, emptyDay()]); setActive(days.length); };
  const removeDay = (i: number) => { onChange(days.filter((_, idx) => idx !== i)); setActive((a) => Math.max(0, Math.min(a, days.length - 2))); };
  const moveDay = (i: number, dir: -1 | 1) => {
    const j = i + dir; if (j < 0 || j >= days.length) return;
    const n = [...days]; [n[i], n[j]] = [n[j], n[i]]; onChange(n); setActive(j);
  };

  const cur = Math.min(active, days.length - 1);
  const d = days[cur];

  return (
    <div>
      {/* header: title + numbered day tabs (top-right) + add */}
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div>
          <h2 className="text-white font-black text-lg">Itinerary</h2>
          <p className="text-white/40 text-xs">Leave empty for a simple package. Add days for a multi-day tour.</p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {days.map((_, i) => (
            <button key={i} type="button" onClick={() => setActive(i)} title={`Day ${i + 1}`}
              className="w-8 h-8 rounded-full font-black text-xs transition-all"
              style={{
                background: i === cur ? "#f6b93b" : "rgba(255,255,255,0.08)",
                color: i === cur ? "#0b1220" : "rgba(255,255,255,0.7)",
                boxShadow: i === cur ? "0 0 0 4px rgba(246,185,59,0.15)" : "none",
              }}>
              {i + 1}
            </button>
          ))}
          <button type="button" onClick={addDay} className="bg-white/[.07] hover:bg-white/[.14] text-white font-bold text-xs px-3.5 h-8 rounded-full transition-colors">
            + Add Day
          </button>
        </div>
      </div>

      {days.length === 0 && (
        <p className="text-white/35 text-sm py-8 text-center border border-white/10 rounded-xl">
          No days yet — click “+ Add Day” to build a multi-day itinerary.
        </p>
      )}

      {/* active day panel */}
      {d && (
        <div className="border border-white/10 rounded-xl p-5 bg-white/[.02]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gold font-black">Day {cur + 1}</span>
            <div className="flex items-center gap-2 text-xs">
              <button type="button" onClick={() => moveDay(cur, -1)} className="text-white/40 hover:text-white px-1.5">▲</button>
              <button type="button" onClick={() => moveDay(cur, 1)} className="text-white/40 hover:text-white px-1.5">▼</button>
              <button type="button" onClick={() => removeDay(cur)} className="text-red-300/70 hover:text-red-300 px-1.5">✕ remove day</button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <div><label className={label}>Day title</label><input value={d.title} onChange={(e) => set(cur, { title: e.target.value })} className={field} placeholder="The Sea Temple" /></div>
            <div><label className={label}>Route / subtitle</label><input value={d.subtitle} onChange={(e) => set(cur, { subtitle: e.target.value })} className={field} placeholder="Dambulla → Kandy" /></div>
          </div>

          <div className="mb-3"><label className={label}>Description</label><textarea value={d.description} onChange={(e) => set(cur, { description: e.target.value })} rows={3} className={field} /></div>

          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <div><label className={label}>Highlights (one per line)</label><textarea value={d.highlights} onChange={(e) => set(cur, { highlights: e.target.value })} rows={3} className={field} placeholder={"Marble Beach swim\nHarbour sunset"} /></div>
            <div><label className={label}>Overnight stay</label><input value={d.stay} onChange={(e) => set(cur, { stay: e.target.value })} className={field} placeholder="Trincomalee" /></div>
          </div>

          <label className={label}>Photos (up to 3) — choose one as the day thumbnail</label>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((slot) => (
              <PhotoSlot
                key={slot}
                photo={d.photos[slot]}
                isThumb={d.thumb === slot}
                onUpload={(url) => { const photos = [...d.photos]; photos[slot] = { url, caption: d.photos[slot]?.caption ?? "" }; set(cur, { photos, thumb: d.photos.some((p) => p?.url) ? d.thumb : slot }); }}
                onCaption={(c) => { const photos = [...d.photos]; if (photos[slot]) photos[slot] = { ...photos[slot]!, caption: c }; set(cur, { photos }); }}
                onThumb={() => set(cur, { thumb: slot })}
                onRemove={() => { const photos = [...d.photos]; photos[slot] = undefined; set(cur, { photos }); }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
