import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { deletePackage } from "./actions";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminTabs from "@/components/admin/AdminTabs";

export const dynamic = "force-dynamic";

interface Row {
  id: string; title: string; days: string | null; price: string | null; img: string | null; sort: number | null;
}

export default async function AdminHome() {
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase
    .from("packages")
    .select("id,title,days,price,img,sort")
    .order("sort", { ascending: true });

  const packages = (data ?? []) as Row[];

  return (
    <main className="min-h-screen px-5 py-8" style={{ background: "#020617" }}>
      <div className="w-[min(1000px,100%)] mx-auto">
        <AdminTabs active="/admin" />

        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-white font-black text-2xl">Tour Packages</h1>
            <p className="text-white/45 text-sm">Add, edit or remove the packages shown on the site.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/new" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-5 py-2.5 rounded-full transition-colors">
              + New Package
            </Link>
            <LogoutButton />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">Could not load packages: {error.message}</p>}

        <div className="flex flex-col gap-2">
          {packages.length === 0 && (
            <p className="text-white/40 text-sm py-10 text-center border border-white/10 rounded-2xl">
              No packages yet. Run the seed script or click “New Package”.
            </p>
          )}

          {packages.map((p) => (
            <div key={p.id} className="flex items-center gap-4 bg-white/[.04] border border-white/10 rounded-xl p-3">
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/5 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.img ? <img src={p.img} alt={p.title} className="w-full h-full object-cover" /> : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">{p.title}</p>
                <p className="text-white/40 text-xs">{p.days} · {p.price} · <span className="font-mono">{p.id}</span></p>
              </div>
              <Link href={`/admin/${p.id}`} className="bg-white/[.07] hover:bg-white/[.14] text-white font-bold text-xs px-4 py-2 rounded-full transition-colors">
                Edit
              </Link>
              <form action={deletePackage}>
                <input type="hidden" name="id" value={p.id} />
                <button type="submit" className="bg-red-500/15 hover:bg-red-500/30 text-red-300 font-bold text-xs px-4 py-2 rounded-full transition-colors">
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>

        <p className="text-white/25 text-xs mt-8">
          You can create both simple and multi-day packages here (add days, each with up to 3 photos + a thumbnail).
          Add a route map to a multi-day package to show the scroll-synced journey map on its page.
        </p>
      </div>
    </main>
  );
}
