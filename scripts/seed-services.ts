/**
 * One-time seed: pushes the starter services from lib/services-data.ts into
 * your Supabase `services` table.
 *   npx tsx --env-file=.env.local scripts/seed-services.ts
 */
import { createClient } from "@supabase/supabase-js";
import { services } from "../lib/services-data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  const rows = services.map((s, i) => ({
    id: s.id, icon: s.icon, title: s.title, desc: s.desc, href: s.href, sort: s.sort ?? i,
  }));
  const { error } = await supabase.from("services").upsert(rows, { onConflict: "id" });
  if (error) { console.error("✗ Seed failed:", error.message); process.exit(1); }
  console.log(`✓ Seeded ${rows.length} services.`);
}

main();
