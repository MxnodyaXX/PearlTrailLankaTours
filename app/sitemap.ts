import type { MetadataRoute } from "next";
import { getAllPackages } from "@/lib/packages-store";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pearltraillankatour.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,                 lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE_URL}/packages`,         lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/rent-a-car`,       lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE_URL}/travel-assistance`,lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/gallery`,          lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/discover`,         lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/about`,            lastModified: now, changeFrequency: "yearly",  priority: 0.5 },
    { url: `${SITE_URL}/contact`,          lastModified: now, changeFrequency: "yearly",  priority: 0.6 },
  ];

  // One entry per tour package (from the DB, code list as fallback)
  let packageRoutes: MetadataRoute.Sitemap = [];
  try {
    const packages = await getAllPackages();
    packageRoutes = packages.map((p) => ({
      url: `${SITE_URL}/packages/${p.id}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch {
    packageRoutes = [];
  }

  return [...staticRoutes, ...packageRoutes];
}
