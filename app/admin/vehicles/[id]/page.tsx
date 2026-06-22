import { createSupabaseServer } from "@/lib/supabase/server";
import VehicleForm from "@/components/admin/VehicleForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  const { data } = await supabase.from("vehicles").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <VehicleForm initial={data} isNew={false} />;
}
