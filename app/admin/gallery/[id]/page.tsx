import { createSupabaseServer } from "@/lib/supabase/server";
import GalleryForm from "@/components/admin/GalleryForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  const { data } = await supabase.from("gallery").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <GalleryForm initial={data} isNew={false} />;
}
