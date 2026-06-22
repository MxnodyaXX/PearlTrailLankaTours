import { createSupabaseServer } from "@/lib/supabase/server";
import ServiceForm from "@/components/admin/ServiceForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  const { data } = await supabase.from("services").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <ServiceForm initial={data} isNew={false} />;
}
