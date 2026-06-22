/**
 * One-time seed: pushes the starter photos from lib/gallery-data.ts into
 * your Supabase `gallery` table.
 *   npx tsx --env-file=.env.local scripts/seed-gallery.ts
 */
import { createClient } from "@supabase/supabase-js";
import { galleryPhotos } from "../lib/gallery-data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  const rows = galleryPhotos.map((p, i) => ({
    id: p.id, src: p.src, label: p.label, sort: p.sort ?? i,
  }));
  const { error } = await supabase.from("gallery").upsert(rows, { onConflict: "id" });
  if (error) { console.error("✗ Seed failed:", error.message); process.exit(1); }
  console.log(`✓ Seeded ${rows.length} gallery photos.`);
}

main();
