import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { deleteVehicle, toggleVehicle } from "../actions";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminTabs from "@/components/admin/AdminTabs";
import { fmtPrice } from "@/lib/vehicles-data";

export const dynamic = "force-dynamic";

interface Row {
  id: string; name: string; category: string | null; price: number | null;
  image: string | null; emoji: string | null; active: boolean | null; sort: number | null;
}

export default async function AdminVehicles() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("vehicles")
    .select("id,name,category,price,image,emoji,active,sort")
    .order("sort", { ascending: true });

  const vehicles = (data ?? []) as Row[];

  return (
    <main className="min-h-screen px-5 py-8" style={{ background: "#020617" }}>
      <div className="w-[min(1000px,100%)] mx-auto">
        <AdminTabs active="/admin/vehicles" />

        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-white font-black text-2xl">Vehicle Fleet</h1>
            <p className="text-white/45 text-sm">Manage the vehicles shown on the Rent-a-Car page.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/vehicles/new" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-5 py-2.5 rounded-full transition-colors">
              + New Vehicle
            </Link>
            <LogoutButton />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">Could not load vehicles: {error.message}</p>}

        <div className="flex flex-col gap-2">
          {vehicles.length === 0 && (
            <p className="text-white/40 text-sm py-10 text-center border border-white/10 rounded-2xl">
              No vehicles yet. Click “New Vehicle” to add your first one.
            </p>
          )}

          {vehicles.map((v) => {
            const isActive = v.active !== false;
            return (
            <div key={v.id} className={`flex items-center gap-4 border rounded-xl p-3 transition-opacity ${isActive ? "bg-white/[.04] border-white/10" : "bg-white/[.02] border-white/[.06] opacity-60"}`}>
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0 grid place-items-center text-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {v.image ? <img src={v.image} alt={v.name} className="w-full h-full object-cover" /> : <span>{v.emoji ?? "🚗"}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold text-sm truncate">{v.name}</p>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                    style={isActive ? { background: "rgba(16,185,129,.16)", color: "#34d399" } : { background: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.5)" }}>
                    {isActive ? "Active" : "Hidden"}
                  </span>
                </div>
                <p className="text-white/40 text-xs">{v.category} · {fmtPrice(v.price ?? 0)}/day · <span className="font-mono">{v.id}</span></p>
              </div>
              <form action={toggleVehicle}>
                <input type="hidden" name="id" value={v.id} />
                <input type="hidden" name="active" value={isActive ? "false" : "true"} />
                <button type="submit" className="bg-white/[.07] hover:bg-white/[.14] text-white/80 font-bold text-xs px-4 py-2 rounded-full transition-colors">
                  {isActive ? "Hide" : "Show"}
                </button>
              </form>
              <Link href={`/admin/vehicles/${v.id}`} className="bg-white/[.07] hover:bg-white/[.14] text-white font-bold text-xs px-4 py-2 rounded-full transition-colors">
                Edit
              </Link>
              <form action={deleteVehicle}>
                <input type="hidden" name="id" value={v.id} />
                <button type="submit" className="bg-red-500/15 hover:bg-red-500/30 text-red-300 font-bold text-xs px-4 py-2 rounded-full transition-colors">
                  Delete
                </button>
              </form>
            </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
