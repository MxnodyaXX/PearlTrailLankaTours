import { services as codeServices, type Service } from "./services-data";
import { supabase, supabaseConfigured } from "./supabase";

type Row = {
  id: string; icon: string | null; title: string; desc: string | null;
  href: string | null; active: boolean | null; sort: number | null;
};

function rowToService(r: Row): Service {
  return {
    id: r.id,
    icon: r.icon ?? "✨",
    title: r.title,
    desc: r.desc ?? "",
    href: r.href || "/contact",
    active: r.active ?? true,
    sort: r.sort ?? 0,
  };
}

/** Active services for the public Travel-Assistance page, or the code fallback. */
export async function getAllServices(): Promise<Service[]> {
  if (!supabaseConfigured || !supabase) return codeServices;

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort", { ascending: true });

  if (error || !data || data.length === 0) return codeServices; // unseeded → fallback
  return data.map(rowToService).filter((s) => s.active !== false);
}
