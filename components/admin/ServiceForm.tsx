"use client";

import { useState } from "react";
import Link from "next/link";
import { saveService } from "@/app/admin/actions";

interface ServiceRow {
  id?: string; icon?: string; title?: string; desc?: string; href?: string;
  active?: boolean; sort?: number;
}

const field = "w-full bg-white/[.03] border border-white/[.12] rounded-xl px-3.5 py-2.5 text-white text-sm outline-none transition-colors focus:border-gold/70 focus:bg-white/[.05] placeholder:text-white/25";
const labelCls = "block text-white/55 text-[11px] font-bold uppercase tracking-[.12em] mb-1.5";
const card = "rounded-2xl border border-white/[.08] bg-white/[.02] p-5 md:p-6";

const LINKS = [
  { v: "/contact", l: "Contact page" },
  { v: "/rent-a-car", l: "Vehicles page" },
  { v: "/packages", l: "Packages page" },
  { v: "/gallery", l: "Gallery page" },
];

export default function ServiceForm({ initial = {}, isNew = false }: { initial?: ServiceRow; isNew?: boolean }) {
  const [icon, setIcon] = useState(initial.icon ?? "✨");
  const [title, setTitle] = useState(initial.title ?? "");
  const [desc, setDesc] = useState(initial.desc ?? "");
  const [href, setHref] = useState(initial.href ?? "/contact");
  const [active, setActive] = useState<boolean>(initial.active ?? true);

  return (
    <main className="min-h-screen pb-10" style={{ background: "#020617" }}>
      <header className="sticky top-0 z-30 border-b border-white/[.08] bg-[#020617]/85 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 px-4 md:px-6 h-16">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin/services" className="w-9 h-9 grid place-items-center rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/25 transition-colors shrink-0">←</Link>
            <div className="min-w-0">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[.18em]">{isNew ? "Create" : "Edit"} · Service</p>
              <h1 className="text-white font-black text-lg leading-tight truncate">{title || (isNew ? "New Service" : "Edit Service")}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/admin/services" className="text-white/70 hover:text-white font-bold text-sm px-4 py-2 rounded-full transition-colors">Cancel</Link>
            <button type="submit" form="svc-form" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-6 py-2.5 rounded-full transition-colors">
              {isNew ? "Create Service" : "Save Changes"}
            </button>
          </div>
        </div>
      </header>

      <form id="svc-form" action={saveService} className="px-3 md:px-4 pt-5 grid lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] gap-5 items-start max-w-[1000px] mx-auto">
        {/* Live preview */}
        <div className="lg:sticky lg:top-[84px]">
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-[.12em] mb-2">Live preview</p>
          <div className={`bg-white/[.04] border border-white/[.08] rounded-[24px] p-6 flex flex-col gap-3 transition-opacity ${active ? "" : "opacity-45"}`}>
            <span className="text-4xl">{icon || "✨"}</span>
            <h3 className="font-black text-white text-lg">{title || "Service title"}</h3>
            <p className="text-white/55 text-[14px] leading-relaxed">{desc || "Short description of the service shown on the Travel-Assistance page."}</p>
            <span className="text-gold text-sm font-black">Book Now →</span>
          </div>
          {!active && <p className="text-amber-300/80 text-[11px] mt-2">Hidden — won’t appear on the Travel-Assistance page.</p>}
        </div>

        {/* Fields */}
        <section className={card}>
          <div className="flex items-center justify-between mb-5 pb-5 border-b border-white/[.08]">
            <div>
              <p className="text-white font-bold text-sm">Visibility</p>
              <p className="text-white/40 text-xs">{active ? "Shown on the website." : "Hidden from the website."}</p>
            </div>
            <button type="button" role="switch" aria-checked={active} onClick={() => setActive((a) => !a)}
              className="relative w-14 h-7 rounded-full transition-colors shrink-0" style={{ background: active ? "#10b981" : "rgba(255,255,255,0.14)" }}>
              <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: active ? "translateX(28px)" : "translateX(0)" }} />
            </button>
          </div>
          <input type="hidden" name="active" value={active ? "on" : "off"} />

          <div className="grid sm:grid-cols-[120px_1fr] gap-4 mb-4">
            <div>
              <label className={labelCls}>Icon</label>
              <input name="icon" value={icon} onChange={(e) => setIcon(e.target.value)} maxLength={4} className={`${field} text-center text-lg`} />
            </div>
            <div>
              <label className={labelCls}>Title</label>
              <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Airport Pickup & Drop" className={field} />
            </div>
          </div>

          <div className="mb-4">
            <label className={labelCls}>Description</label>
            <textarea name="desc" value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} className={field} />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Button links to</label>
              <select name="href" value={href} onChange={(e) => setHref(e.target.value)} className={`${field} cursor-pointer`}>
                {LINKS.map((l) => <option key={l.v} value={l.v} className="bg-[#0b1426]">{l.l}</option>)}
                {!LINKS.some((l) => l.v === href) && <option value={href} className="bg-[#0b1426]">{href}</option>}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>ID / slug</label>
                <input name="id" defaultValue={initial.id ?? ""} readOnly={!isNew} required placeholder="airport"
                  className={`${field} ${!isNew ? "opacity-60 cursor-not-allowed" : ""}`} />
              </div>
              <div>
                <label className={labelCls}>Order</label>
                <input name="sort" type="number" defaultValue={initial.sort ?? 0} className={field} />
              </div>
            </div>
          </div>
        </section>
      </form>
    </main>
  );
}
