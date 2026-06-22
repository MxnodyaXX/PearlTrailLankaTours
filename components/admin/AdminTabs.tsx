import Link from "next/link";

const tabs = [
  { href: "/admin", label: "Tour Packages" },
  { href: "/admin/vehicles", label: "Vehicles" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/settings", label: "Contact & Socials" },
];

export default function AdminTabs({ active }: { active: string }) {
  return (
    <div className="flex items-center gap-2 mb-6 flex-wrap">
      {tabs.map((t) =>
        t.href === active ? (
          <span key={t.href} className="text-[#0f172a] font-bold text-sm px-4 py-2 rounded-full bg-gold">{t.label}</span>
        ) : (
          <Link key={t.href} href={t.href} className="text-white/55 hover:text-white font-bold text-sm px-4 py-2 rounded-full bg-white/[.04] border border-white/10 transition-colors">{t.label}</Link>
        )
      )}
    </div>
  );
}
