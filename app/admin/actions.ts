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

// ── Vehicles (rent-a-car fleet) ────────────────────────────────────
export async function saveVehicle(formData: FormData) {
  const supabase = await requireUser();

  const id = String(formData.get("id") || "").trim().toLowerCase().replace(/\s+/g, "-");
  if (!id) throw new Error("A vehicle ID (slug) is required.");

  const row = {
    id,
    name:         String(formData.get("name")         || "").trim(),
    category:     String(formData.get("category")     || "Other").trim(),
    models:       String(formData.get("models")       || "").trim(),
    seats:        Number(formData.get("seats")        || 0),
    fuel:         String(formData.get("fuel")         || "").trim(),
    transmission: String(formData.get("transmission") || "").trim(),
    rating:       Number(formData.get("rating")       || 0),
    price:        Number(formData.get("price")        || 0),
    emoji:        String(formData.get("emoji")        || "🚗").trim() || "🚗",
    image:        String(formData.get("image")        || "").trim(),
    badge_label:  String(formData.get("badge_label")  || "").trim(),
    badge_tone:   String(formData.get("badge_tone")   || "gold").trim(),
    active:       String(formData.get("active")       || "") === "on",
    sort:         Number(formData.get("sort")         || 0),
  };

  const { error } = await supabase.from("vehicles").upsert(row, { onConflict: "id" });
  if (error) throw new Error(error.message);

  revalidatePath("/rent-a-car");
  revalidatePath("/admin/vehicles");
  redirect("/admin/vehicles");
}

/** Quick show/hide toggle from the vehicles list. */
export async function toggleVehicle(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") || "");
  const active = String(formData.get("active") || "") === "true"; // desired new state
  const { error } = await supabase.from("vehicles").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/rent-a-car");
  revalidatePath("/admin/vehicles");
}

export async function deleteVehicle(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") || "");
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/rent-a-car");
  revalidatePath("/admin/vehicles");
}

// ── Services (travel-assistance) ───────────────────────────────────
export async function saveService(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") || "").trim().toLowerCase().replace(/\s+/g, "-");
  if (!id) throw new Error("A service ID (slug) is required.");

  const row = {
    id,
    icon:   String(formData.get("icon")  || "✨").trim() || "✨",
    title:  String(formData.get("title") || "").trim(),
    desc:   String(formData.get("desc")  || "").trim(),
    href:   String(formData.get("href")  || "/contact").trim() || "/contact",
    active: String(formData.get("active") || "") === "on",
    sort:   Number(formData.get("sort")  || 0),
  };

  const { error } = await supabase.from("services").upsert(row, { onConflict: "id" });
  if (error) throw new Error(error.message);
  revalidatePath("/travel-assistance");
  revalidatePath("/admin/services");
  redirect("/admin/services");
}

export async function toggleService(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") || "");
  const active = String(formData.get("active") || "") === "true";
  const { error } = await supabase.from("services").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/travel-assistance");
  revalidatePath("/admin/services");
}

export async function deleteService(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") || "");
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/travel-assistance");
  revalidatePath("/admin/services");
}

// ── Gallery photos ─────────────────────────────────────────────────
export async function saveGalleryPhoto(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") || "").trim().toLowerCase().replace(/\s+/g, "-");
  if (!id) throw new Error("A photo ID (slug) is required.");
  const src = String(formData.get("src") || "").trim();
  if (!src) throw new Error("A photo image is required.");

  const row = {
    id,
    src,
    label:  String(formData.get("label") || "").trim(),
    active: String(formData.get("active") || "") === "on",
    sort:   Number(formData.get("sort")  || 0),
  };

  const { error } = await supabase.from("gallery").upsert(row, { onConflict: "id" });
  if (error) throw new Error(error.message);
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}

export async function toggleGalleryPhoto(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") || "");
  const active = String(formData.get("active") || "") === "true";
  const { error } = await supabase.from("gallery").update({ active }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

export async function deleteGalleryPhoto(formData: FormData) {
  const supabase = await requireUser();
  const id = String(formData.get("id") || "");
  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/gallery");
  revalidatePath("/admin/gallery");
}

// ── Site settings (contact info + social links) ────────────────────
export async function saveSettings(formData: FormData) {
  const supabase = await requireUser();

  const field = (k: string) => String(formData.get(k) || "").trim();
  const row = {
    id: "main",
    whatsapp:  field("whatsapp"),
    phone:     field("phone"),
    telegram:  field("telegram"),
    email:     field("email"),
    address:   field("address"),
    facebook:  field("facebook"),
    instagram: field("instagram"),
    tiktok:    field("tiktok"),
    youtube:   field("youtube"),
  };

  const { error } = await supabase.from("settings").upsert(row, { onConflict: "id" });
  if (error) throw new Error(error.message);

  // Contact info shows site-wide — refresh everything.
  revalidatePath("/", "layout");
  redirect("/admin/settings");
}
