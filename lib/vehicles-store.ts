import { vehicles as codeVehicles, type Vehicle, type BadgeTone } from "./vehicles-data";
import { supabase, supabaseConfigured } from "./supabase";

type Row = {
  id: string; name: string; category: string | null; models: string | null;
  seats: number | null; fuel: string | null; transmission: string | null;
  rating: number | null; price: number | null; emoji: string | null;
  image: string | null; badge_label: string | null; badge_tone: string | null;
  active: boolean | null; sort: number | null;
};

const TONES = new Set<BadgeTone>(["gold", "emerald", "blue", "purple", "teal"]);

export function rowToVehicle(r: Row): Vehicle {
  const tone = (r.badge_tone && TONES.has(r.badge_tone as BadgeTone) ? r.badge_tone : "gold") as BadgeTone;
  return {
    id: r.id,
    name: r.name,
    category: r.category ?? "Other",
    models: r.models ?? "",
    seats: r.seats ?? 0,
    fuel: r.fuel ?? "",
    transmission: r.transmission ?? "",
    rating: r.rating ?? 0,
    price: r.price ?? 0,
    emoji: r.emoji ?? "🚗",
    image: r.image ?? undefined,
    badge: r.badge_label ? { label: r.badge_label, tone } : undefined,
    active: r.active ?? true,
    sort: r.sort ?? 0,
  };
}

/** Active vehicles for the public Vehicles page — from the DB, or the code list
 *  as a fallback. Hidden (inactive) vehicles are filtered out. */
export async function getAllVehicles(): Promise<Vehicle[]> {
  if (!supabaseConfigured || !supabase) return codeVehicles;

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("sort", { ascending: true });

  if (error || !data || data.length === 0) return codeVehicles; // unseeded → fallback
  // Table is seeded: honour the active flag (all-hidden → empty fleet, not the fallback)
  return data.map(rowToVehicle).filter((v) => v.active !== false);
}
