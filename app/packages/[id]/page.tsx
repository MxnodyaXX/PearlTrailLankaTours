import { getPackageById } from "@/lib/packages-store";
import PackageDetailClient from "./PackageDetailClient";
import { notFound } from "next/navigation";

// Always read fresh from the DB so admin edits appear immediately
export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pkg = await getPackageById(id);
  if (!pkg) notFound();
  return <PackageDetailClient pkg={pkg} />;
}
