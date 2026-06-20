import { createSupabaseServer } from "@/lib/supabase/server";
import PackageForm from "@/components/admin/PackageForm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createSupabaseServer();
  const { data } = await supabase.from("packages").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  return <PackageForm initial={data} isNew={false} />;
}
