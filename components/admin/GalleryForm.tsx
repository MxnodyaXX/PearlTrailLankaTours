"use client";

import { useState } from "react";
import Link from "next/link";
import { uploadPackageImage } from "@/lib/supabase/browser";
import { saveGalleryPhoto } from "@/app/admin/actions";

interface GalleryRow {
  id?: string; src?: string; label?: string; active?: boolean; sort?: number;
}

const field = "w-full bg-white/[.03] border border-white/[.12] rounded-xl px-3.5 py-2.5 text-white text-sm outline-none transition-colors focus:border-gold/70 focus:bg-white/[.05] placeholder:text-white/25";
const labelCls = "block text-white/55 text-[11px] font-bold uppercase tracking-[.12em] mb-1.5";
const card = "rounded-2xl border border-white/[.08] bg-white/[.02] p-5 md:p-6";

export default function GalleryForm({ initial = {}, isNew = false }: { initial?: GalleryRow; isNew?: boolean }) {
  const [src, setSrc] = useState(initial.src ?? "");
  const [label, setLabel] = useState(initial.label ?? "");
  const [active, setActive] = useState<boolean>(initial.active ?? true);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true); setErr("");
    const { url, error } = await uploadPackageImage(file);
    setUploading(false);
    if (error) { setErr(error); return; }
    if (url) setSrc(url);
  }

  return (
    <main className="min-h-screen pb-10" style={{ background: "#020617" }}>
      <header className="sticky top-0 z-30 border-b border-white/[.08] bg-[#020617]/85 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 px-4 md:px-6 h-16">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin/gallery" className="w-9 h-9 grid place-items-center rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition-colors shrink-0">←</Link>
            <div className="min-w-0">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[.18em]">{isNew ? "Add" : "Edit"} · Photo</p>
              <h1 className="text-white font-black text-lg leading-tight truncate">{label || (isNew ? "New Photo" : "Edit Photo")}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/admin/gallery" className="text-white/70 hover:text-white font-bold text-sm px-4 py-2 rounded-full transition-colors">Cancel</Link>
            <button type="submit" form="gal-form" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-6 py-2.5 rounded-full transition-colors">
              {isNew ? "Add Photo" : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <form id="gal-form" action={saveGalleryPhoto} className="px-3 md:px-4 pt-5 grid lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] gap-5 items-start max-w-[1000px] mx-auto">
        {/* Live preview */}
        <div className="lg:sticky lg:top-[84px]">
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-[.12em] mb-2">Live preview</p>
          <div className={`relative rounded-[18px] overflow-hidden aspect-[4/3] bg-white/[.04] border border-white/[.08] transition-opacity ${active ? "" : "opacity-45"}`}>
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={label} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-white/25 text-sm">No image yet</div>
            )}
            {src && label && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-black text-left">{label}</p>
              </>
            )}
          </div>
          {!active && <p className="text-amber-300/80 text-[11px] mt-2">Hidden — won’t appear in the gallery.</p>}
        </div>

        {/* Fields */}
        <section className={card}>
          <div className="flex items-center justify-between mb-5 pb-5 border-b border-white/[.08]">
            <div>
              <p className="text-white font-bold text-sm">Visibility</p>
              <p className="text-white/40 text-xs">{active ? "Shown in the gallery." : "Hidden from the gallery."}</p>
            </div>
            <button type="button" role="switch" aria-checked={active} onClick={() => setActive((a) => !a)}
              className="relative w-14 h-7 rounded-full transition-colors shrink-0" style={{ background: active ? "#10b981" : "rgba(255,255,255,0.14)" }}>
              <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: active ? "translateX(28px)" : "translateX(0)" }} />
            </button>
          </div>
          <input type="hidden" name="active" value={active ? "on" : "off"} />

          <div className="mb-4">
            <span className={labelCls}>Photo</span>
            <div className="flex gap-3">
              <div className="w-32 h-24 rounded-xl overflow-hidden bg-white/[.04] border border-white/10 shrink-0 grid place-items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {src ? <img src={src} alt="" className="w-full h-full object-cover" /> : <span className="text-white/25 text-[10px]">no image</span>}
              </div>
              <div className="flex-1 flex flex-col justify-center gap-2 min-w-0">
                <label className="inline-flex items-center justify-center gap-2 cursor-pointer bg-white/[.06] hover:bg-white/[.12] border border-white/10 text-white/80 font-bold text-xs px-4 py-2 rounded-lg transition-colors w-fit">
                  {uploading ? "Uploading…" : "Upload photo"}
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
                <input type="url" value={src} onChange={(e) => setSrc(e.target.value)} placeholder="…or paste an image URL" className={field} />
                {err && <p className="text-red-400 text-xs">{err}</p>}
              </div>
            </div>
            <input type="hidden" name="src" value={src} />
          </div>

          <div className="mb-4">
            <label className={labelCls}>Caption</label>
            <input name="label" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Sigiriya Rock Fortress" className={field} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>ID / slug</label>
              <input name="id" defaultValue={initial.id ?? ""} readOnly={!isNew} required placeholder="sigiriya"
                className={`${field} ${!isNew ? "opacity-60 cursor-not-allowed" : ""}`} />
            </div>
            <div>
              <label className={labelCls}>Order</label>
              <input name="sort" type="number" defaultValue={initial.sort ?? 0} className={field} />
            </div>
          </div>
        </section>
      </form>
    </main>
  );
}
