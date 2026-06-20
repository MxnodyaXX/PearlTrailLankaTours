import { createBrowserClient } from "@supabase/ssr";

/** Browser Supabase client — persists the session to cookies so the server
 *  (and proxy.ts) can read it. Used for login, logout & image uploads. */
export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** Upload an image to the package-images bucket, return its public URL. */
export async function uploadPackageImage(file: File): Promise<{ url?: string; error?: string }> {
  const supabase = createSupabaseBrowser();
  const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
  const path = `packages/${Date.now()}-${safe}`;
  const { error } = await supabase.storage.from("package-images").upload(path, file, { upsert: true });
  if (error) return { error: error.message };
  const { data } = supabase.storage.from("package-images").getPublicUrl(path);
  return { url: data.publicUrl };
}
