import { galleryPhotos as codePhotos, type GalleryPhoto } from "./gallery-data";
import { supabase, supabaseConfigured } from "./supabase";

type Row = { id: string; src: string; label: string | null; active: boolean | null; sort: number | null };

function rowToPhoto(r: Row): GalleryPhoto {
  return { id: r.id, src: r.src, label: r.label ?? "", active: r.active ?? true, sort: r.sort ?? 0 };
}

/** Active gallery photos for the public Gallery page, or the code fallback. */
export async function getAllGallery(): Promise<GalleryPhoto[]> {
  if (!supabaseConfigured || !supabase) return codePhotos;

  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("sort", { ascending: true });

  if (error || !data || data.length === 0) return codePhotos; // unseeded → fallback
  return data.map(rowToPhoto).filter((p) => p.active !== false);
}
