import { getPackage } from "@/lib/packages-data";
import PackageDetailClient from "./PackageDetailClient";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pkg = getPackage(id);
  if (!pkg) notFound();
  return <PackageDetailClient pkg={pkg} />;
}
