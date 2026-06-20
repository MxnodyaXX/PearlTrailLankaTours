import { packages as codePackages, type TourPackage, type DayPlan, type PackageMap } from "./packages-data";
import { supabase, supabaseConfigured } from "./supabase";

/* The flagship "Sacred Circuit" has a hand-tuned animated route map keyed to
   its coordinates, so it stays CODE-MANAGED. Everything else — simple AND
   multi-day packages — is editable from the DB (the multi-day ones store their
   itinerary as JSON; admin packages just don't get the animated map). */
const CODE_MANAGED_IDS = new Set(["sacred-circuit"]);
const codeManaged = codePackages.filter((p) => CODE_MANAGED_IDS.has(p.id));

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

/** All packages for the listing page — simple ones from the DB (or code as a
 *  fallback) plus the code-managed complex ones appended. */
export async function getAllPackages(): Promise<TourPackage[]> {
  if (!supabaseConfigured || !supabase) return codePackages;

  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .order("sort", { ascending: true });

  if (error || !data || data.length === 0) return codePackages; // graceful fallback
  const dbPackages = data.map(rowToPackage).filter((p) => !CODE_MANAGED_IDS.has(p.id));
  return [...dbPackages, ...codeManaged];
}

/** A single package by id (code-managed flagship, else from the DB). */
export async function getPackageById(id: string): Promise<TourPackage | null> {
  const coded = codeManaged.find((p) => p.id === id);
  if (coded) return coded;

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
