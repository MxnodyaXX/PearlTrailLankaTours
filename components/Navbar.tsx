"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const links = [
  { label: "Packages",   href: "/packages" },
  { label: "Vehicles",   href: "/rent-a-car" },
  { label: "Services",   href: "/travel-assistance" },
  { label: "Gallery",    href: "/gallery" },
  { label: "About",      href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between
          w-[min(1120px,calc(100%-36px))] h-[58px] px-4 rounded-full
          border border-white/10 backdrop-blur-2xl transition-all duration-300
          ${scrolled
            ? "bg-[rgba(2,6,23,0.90)] shadow-[0_8px_40px_rgba(0,0,0,.5)]"
            : "bg-[rgba(2,6,23,0.55)]"
          }`}
      >
        {/* Logo */}
        <Link href="/" className="text-xl font-black tracking-tight shrink-0 select-none">
          Pearl<span className="text-gold">Trail</span>
          <span className="text-[10px] font-bold text-white/40 ml-1 tracking-widest uppercase">Lanka</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-[11px] font-extrabold uppercase tracking-widest text-blue-100">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-gold transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <a
            href="https://wa.me/94741838376"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-black px-3.5 py-2 rounded-full transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp
          </a>
          <Link
            href="/contact"
            className="bg-gold hover:bg-gold-deep text-[#0f172a] text-[11px] font-black px-4 py-2 rounded-full transition-colors"
          >
            Plan Trip
          </Link>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-[5px] p-2 ml-2"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${open ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-0.5 bg-white rounded transition-all duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-72 bg-[#020617]/95 backdrop-blur-2xl border-l border-white/10
          flex flex-col pt-24 px-6 pb-8 gap-2 transition-transform duration-400 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="text-white/80 hover:text-gold font-bold text-base py-3 border-b border-white/5 transition-colors"
          >
            {l.label}
          </Link>
        ))}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="bg-gold text-[#0f172a] font-black text-sm px-5 py-3 rounded-full text-center"
          >
            Plan My Trip
          </Link>
          <a
            href="https://wa.me/94741838376"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 text-white font-black text-sm px-5 py-3 rounded-full text-center"
          >
            WhatsApp Us
          </a>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
