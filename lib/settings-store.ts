import { DEFAULT_SETTINGS, mergeSettings, type SiteSettings } from "./site-config";
import { supabase, supabaseConfigured } from "./supabase";

/** Server-side: current site settings (contact info + socials), or defaults. */
export async function getSettings(): Promise<SiteSettings> {
  if (!supabaseConfigured || !supabase) return DEFAULT_SETTINGS;
  const { data, error } = await supabase.from("settings").select("*").eq("id", "main").maybeSingle();
  if (error || !data) return DEFAULT_SETTINGS;
  return mergeSettings(data);
}
