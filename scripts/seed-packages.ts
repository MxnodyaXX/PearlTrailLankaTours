/**
 * One-time seed: pushes the simple packages from lib/packages-data.ts into
 * your Supabase `packages` table.
 *
 * Run after creating the table (supabase/schema.sql) and adding env vars:
 *   npx tsx --env-file=.env.local scripts/seed-packages.ts
 */
import { createClient } from "@supabase/supabase-js";
import { packages } from "../lib/packages-data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  // only the simple packages (no itinerary) go to the DB
  const simple = packages.filter((p) => p.itinerary.length === 0);

  const rows = simple.map((p, i) => ({
    id: p.id,
    title: p.title,
    tagline: p.tagline,
    days: p.days,
    price: p.price,
    img: p.img,
    desc: p.desc,
    inc: p.inc,
    exc: p.exc,
    overview: p.overview,
    sort: i,
  }));

  const { error } = await supabase.from("packages").upsert(rows, { onConflict: "id" });
  if (error) {
    console.error("✗ Seed failed:", error.message);
    process.exit(1);
  }
  console.log(`✓ Seeded ${rows.length} packages.`);
}

main();
