/**
 * One-time seed: pushes the starter fleet from lib/vehicles-data.ts into
 * your Supabase `vehicles` table.
 *
 * Run after creating the table (supabase/schema.sql) and adding env vars:
 *   npx tsx --env-file=.env.local scripts/seed-vehicles.ts
 */
import { createClient } from "@supabase/supabase-js";
import { vehicles } from "../lib/vehicles-data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  const rows = vehicles.map((v, i) => ({
    id: v.id,
    name: v.name,
    category: v.category,
    models: v.models,
    seats: v.seats,
    fuel: v.fuel,
    transmission: v.transmission,
    rating: v.rating,
    price: v.price,
    emoji: v.emoji,
    image: v.image ?? "",
    badge_label: v.badge?.label ?? "",
    badge_tone: v.badge?.tone ?? "gold",
    sort: v.sort ?? i,
  }));

  const { error } = await supabase.from("vehicles").upsert(rows, { onConflict: "id" });
  if (error) {
    console.error("✗ Seed failed:", error.message);
    process.exit(1);
  }
  console.log(`✓ Seeded ${rows.length} vehicles.`);
}

main();
