import { packages as codePackages, type TourPackage, type DayPlan, type PackageMap } from "./packages-data";
import { supabase, supabaseConfigured } from "./supabase";

/* Every package — simple and multi-day — is managed from the DB. The list in
   packages-data.ts is only the fallback used before the table is seeded. */

type Row = {
  id: string; title: string; tagline: string | null; days: string | null;
  price: string | null; img: string | null; desc: string | null;
  inc: string | null; exc: string | null; overview: string | null;
  itinerary: DayPlan[] | null; map: PackageMap | null; sort: number | null;
};

function rowToPackage(r: Row): TourPackage {
  const map = r.map && Array.isArray(r.map.route) && Array.isArray(r.map.stops) ? r.map : undefined;
  return {
    id: r.id,
    title: r.title,
    tagline: r.tagline ?? "",
    days: r.days ?? "",
    price: r.price ?? "",
    img: r.img ?? "",
    desc: r.desc ?? "",
    inc: r.inc ?? "",
    exc: r.exc ?? "",
    overview: r.overview ?? "",
    itinerary: Array.isArray(r.itinerary) ? r.itinerary : [],
    map,
  };
}

/** All packages for the listing page, from the DB (code list as a fallback). */
export async function getAllPackages(): Promise<TourPackage[]> {
  if (!supabaseConfigured || !supabase) return codePackages;

  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .order("sort", { ascending: true });

  if (error || !data || data.length === 0) return codePackages; // graceful fallback
  return data.map(rowToPackage);
}

/** A single package by id, from the DB (code list as a fallback). */
export async function getPackageById(id: string): Promise<TourPackage | null> {
  if (!supabaseConfigured || !supabase) {
    return codePackages.find((p) => p.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return codePackages.find((p) => p.id === id) ?? null;
  return rowToPackage(data);
}
