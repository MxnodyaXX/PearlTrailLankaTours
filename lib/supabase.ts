import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True once the Supabase env vars are set. Until then the site falls
 *  back to the code-managed package data, so nothing breaks. */
export const supabaseConfigured = Boolean(url && anon);

/** Public (anon) client for read-only access from the website. */
export const supabase = supabaseConfigured ? createClient(url!, anon!) : null;
