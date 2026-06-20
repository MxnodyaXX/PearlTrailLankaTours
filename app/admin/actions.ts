"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireUser() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return supabase;
}

export async function savePackage(formData: FormData) {
  const supabase = await requireUser();

  const id = String(formData.get("id") || "").trim().toLowerCase().replace(/\s+/g, "-");
  if (!id) throw new Error("A package ID (slug) is required.");

  let itinerary: unknown = [];
  try {
    const raw = String(formData.get("itinerary") || "[]");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) itinerary = parsed;
  } catch {
    itinerary = [];
  }

  let map: unknown = { route: [], stops: [] };
  try {
    const raw = String(formData.get("map") || "");
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.route) && Array.isArray(parsed.stops)) map = parsed;
  } catch {
    map = { route: [], stops: [] };
  }

  const row = {
    id,
    title:     String(formData.get("title")    || "").trim(),
    tagline:   String(formData.get("tagline")  || "").trim(),
    days:      String(formData.get("days")     || "").trim(),
    price:     String(formData.get("price")    || "").trim(),
    img:       String(formData.get("img")      || "").trim(),
    desc:      String(formData.get("desc")     || "").trim(),
    inc:       String(formData.get("inc")      || "").trim(),
    exc:       String(formData.get("exc")      || "").trim(),
    overview:  String(formData.get("overview") || "").trim(),
    itinerary,
    map,
    sort:      Number(formData.get("sort")     || 0),
  };

  const { error } = await supabase.from("packages").upsert(row, { onConflict: "id" });
  if (error) throw new Error(error.message);

  revalidatePath("/packages");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deletePackage(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") || "");
  const { error } = await supabase.from("packages").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/packages");
  revalidatePath("/admin");
}
