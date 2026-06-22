import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { deleteService, toggleService } from "../actions";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminTabs from "@/components/admin/AdminTabs";

export const dynamic = "force-dynamic";

interface Row { id: string; icon: string | null; title: string; href: string | null; active: boolean | null; sort: number | null; }

export default async function AdminServices() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("services")
    .select("id,icon,title,href,active,sort")
    .order("sort", { ascending: true });

  const services = (data ?? []) as Row[];

  return (
    <main className="min-h-screen px-5 py-8" style={{ background: "#020617" }}>
      <div className="w-[min(1000px,100%)] mx-auto">
        <AdminTabs active="/admin/services" />

        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-white font-black text-2xl">Services</h1>
            <p className="text-white/45 text-sm">Manage the services shown on the Travel-Assistance page.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/services/new" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-5 py-2.5 rounded-full transition-colors">+ New Service</Link>
            <LogoutButton />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">Could not load services: {error.message}</p>}

        <div className="flex flex-col gap-2">
          {services.length === 0 && (
            <p className="text-white/40 text-sm py-10 text-center border border-white/10 rounded-2xl">No services yet. Click “New Service” to add one.</p>
          )}
          {services.map((sv) => {
            const isActive = sv.active !== false;
            return (
              <div key={sv.id} className={`flex items-center gap-4 border rounded-xl p-3 transition-opacity ${isActive ? "bg-white/[.04] border-white/10" : "bg-white/[.02] border-white/[.06] opacity-60"}`}>
                <div className="w-12 h-12 rounded-lg bg-white/5 shrink-0 grid place-items-center text-2xl">{sv.icon ?? "✨"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-bold text-sm truncate">{sv.title}</p>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                      style={isActive ? { background: "rgba(16,185,129,.16)", color: "#34d399" } : { background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.5)" }}>
                      {isActive ? "Active" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-white/40 text-xs">→ {sv.href} · <span className="font-mono">{sv.id}</span></p>
                </div>
                <form action={toggleService}>
                  <input type="hidden" name="id" value={sv.id} />
                  <input type="hidden" name="active" value={isActive ? "false" : "true"} />
                  <button type="submit" className="bg-white/[.07] hover:bg-white/[.14] text-white/80 font-bold text-xs px-4 py-2 rounded-full transition-colors">{isActive ? "Hide" : "Show"}</button>
                </form>
                <Link href={`/admin/services/${sv.id}`} className="bg-white/[.07] hover:bg-white/[.14] text-white font-bold text-xs px-4 py-2 rounded-full transition-colors">Edit</Link>
                <form action={deleteService}>
                  <input type="hidden" name="id" value={sv.id} />
                  <button type="submit" className="bg-red-500/15 hover:bg-red-500/30 text-red-300 font-bold text-xs px-4 py-2 rounded-full transition-colors">Delete</button>
                </form>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
