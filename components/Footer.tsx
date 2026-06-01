import Link from "next/link";

const quickLinks = [
  { label: "Home",              href: "/" },
  { label: "Tour Packages",     href: "/packages" },
  { label: "Rent A Car",        href: "/rent-a-car" },
  { label: "Travel Assistance", href: "/travel-assistance" },
  { label: "Gallery",           href: "/gallery" },
  { label: "About Us",          href: "/about" },
  { label: "Contact",           href: "/contact" },
];

const tours = [
  { label: "Colombo City Tour",    href: "/packages#colombo" },
  { label: "Galle Heritage",       href: "/packages#galle" },
  { label: "Kandy Cultural",       href: "/packages#kandy" },
  { label: "Nuwara Eliya Tea",     href: "/packages#nuwara" },
  { label: "Ella Adventure",       href: "/packages#ella" },
  { label: "Jaffna Northern",      href: "/packages#jaffna" },
  { label: "Southern Beach",       href: "/packages#southern" },
];

const socials = [
  { label: "Facebook",  href: "https://facebook.com/pearltraillankatours",  icon: "f" },
  { label: "Instagram", href: "https://instagram.com/pearltraillankatours", icon: "ig" },
  { label: "TikTok",    href: "https://tiktok.com/@pearltraillankatours",   icon: "tt" },
  { label: "YouTube",   href: "https://youtube.com/@pearltraillankatours",  icon: "yt" },
];

export default function Footer() {
  return (
    <footer className="bg-[#020617] text-white border-t border-white/[.06] pt-12 md:pt-20 pb-8 px-4 md:px-5">
      <div className="w-[min(1120px,100%)] mx-auto">

        {/* Top CTA row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10 md:mb-16 pb-10 md:pb-16 border-b border-white/[.06]">
          <h2
            className="font-black text-white leading-[.95]"
            style={{ fontSize: "clamp(24px,5vw,68px)", letterSpacing: "-0.04em" }}
          >
            Make Sri Lanka feel like a premium global experience.
          </h2>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/contact"
              className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-5 py-3 md:px-6 md:py-3.5 rounded-full transition-all"
            >
              Request a Quote
            </Link>
            <a
              href="https://wa.me/94741838376"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm px-5 py-3 md:px-6 md:py-3.5 rounded-full transition-all"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Link grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-10 md:mb-16">
          {/* Brand — full width on mobile */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-black text-xl mb-3">
              Pearl<span className="text-gold">Trail</span>
              <span className="block text-[10px] font-bold text-white/30 tracking-widest uppercase mt-0.5">Lanka Tours</span>
            </p>
            <p className="text-white/50 text-[13px] leading-relaxed mb-4">
              Premium Sri Lanka tours, vehicle rentals, airport transfers, hotel bookings and complete travel assistance from Colombo.
            </p>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 bg-white/[.06] hover:bg-gold rounded-full flex items-center justify-center text-[10px] font-black text-white hover:text-[#0f172a] transition-all"
                >
                  {s.icon.slice(0,2).toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/30 mb-3 md:mb-4">Quick Links</p>
            <ul className="flex flex-col gap-2">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/55 hover:text-gold text-[13px] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/30 mb-3 md:mb-4">Popular Tours</p>
            <ul className="flex flex-col gap-2">
              {tours.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/55 hover:text-gold text-[13px] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[.18em] text-white/30 mb-3 md:mb-4">Contact Us</p>
            <ul className="flex flex-col gap-2.5 text-[13px] text-white/55">
              <li><a href="tel:+94741838376" className="hover:text-gold transition-colors">0741 838 376</a></li>
              <li><a href="https://wa.me/94741838376" className="hover:text-gold transition-colors">WhatsApp Us</a></li>
              <li><a href="mailto:mxnodya.00@gmail.com" className="hover:text-gold transition-colors break-all">mxnodya.00@gmail.com</a></li>
              <li><a href="mailto:pearltraillankatours@company.com" className="hover:text-gold transition-colors break-all">pearltraillankatours@company.com</a></li>
              <li className="text-white/40">Colombo, Sri Lanka</li>
            </ul>
          </div>
        </div>

        {/* Mega logo */}
        <div
          className="font-black text-white/[.06] leading-none overflow-hidden select-none"
          style={{ fontSize: "clamp(48px,14vw,200px)", letterSpacing: "-0.06em", marginBottom: "-0.15em" }}
        >
          Pearl<span className="text-gold/20">Trail</span>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[.05] pt-5 flex flex-col md:flex-row justify-between gap-2 text-[11px] md:text-[12px] text-white/25">
          <p>© 2024 PearlTrailLankaTours. All rights reserved. Colombo, Sri Lanka.</p>
          <p>Crafted with ♥ for Sri Lanka Travel</p>
        </div>
      </div>
    </footer>
  );
}
