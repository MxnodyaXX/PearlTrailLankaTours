import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { deleteGalleryPhoto, toggleGalleryPhoto } from "../actions";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminTabs from "@/components/admin/AdminTabs";

export const dynamic = "force-dynamic";

interface Row { id: string; src: string; label: string | null; active: boolean | null; sort: number | null; }

export default async function AdminGallery() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("gallery")
    .select("id,src,label,active,sort")
    .order("sort", { ascending: true });

  const photos = (data ?? []) as Row[];

  return (
    <main className="min-h-screen px-5 py-8" style={{ background: "#020617" }}>
      <div className="w-[min(1100px,100%)] mx-auto">
        <AdminTabs active="/admin/gallery" />

        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-white font-black text-2xl">Gallery</h1>
            <p className="text-white/45 text-sm">Manage the photos shown on the Gallery page.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/gallery/new" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-5 py-2.5 rounded-full transition-colors">+ Add Photo</Link>
            <LogoutButton />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">Could not load gallery: {error.message}</p>}

        {photos.length === 0 ? (
          <p className="text-white/40 text-sm py-10 text-center border border-white/10 rounded-2xl">No photos yet. Click “Add Photo” to add one.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((p) => {
              const isActive = p.active !== false;
              return (
                <div key={p.id} className={`rounded-xl overflow-hidden border transition-opacity ${isActive ? "border-white/10" : "border-white/[.06] opacity-55"}`}>
                  <div className="relative aspect-[4/3] bg-white/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.src} alt={p.label ?? ""} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={isActive ? { background: "rgba(16,185,129,.85)", color: "#04221a" } : { background: "rgba(0,0,0,.6)", color: "#fff" }}>
                      {isActive ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <div className="p-2.5 bg-white/[.03]">
                    <p className="text-white text-xs font-bold truncate mb-2">{p.label || p.id}</p>
                    <div className="flex items-center gap-1.5">
                      <Link href={`/admin/gallery/${p.id}`} className="flex-1 text-center bg-white/[.07] hover:bg-white/[.14] text-white font-bold text-[11px] px-2 py-1.5 rounded-full transition-colors">Edit</Link>
                      <form action={toggleGalleryPhoto} className="flex-1">
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="active" value={isActive ? "false" : "true"} />
                        <button type="submit" className="w-full bg-white/[.07] hover:bg-white/[.14] text-white/80 font-bold text-[11px] px-2 py-1.5 rounded-full transition-colors">{isActive ? "Hide" : "Show"}</button>
                      </form>
                      <form action={deleteGalleryPhoto}>
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="bg-red-500/15 hover:bg-red-500/30 text-red-300 font-bold text-[11px] px-2.5 py-1.5 rounded-full transition-colors">✕</button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
