import Navbar        from "@/components/Navbar";
import PageHero      from "@/components/PageHero";
import Footer        from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Link          from "next/link";
import { packages }  from "@/lib/packages-data";

export default function PackagesPage() {
  return (
    <>
      <Navbar />
      <PageHero
        kicker="Explore Sri Lanka"
        title="Our Tour"
        em="Packages"
        desc="Handpicked tours for every traveler — from day trips to multi-day adventures across Sri Lanka's most iconic destinations."
        img="https://images.unsplash.com/photo-1663784025074-49e9e7f11f62?auto=format&fit=crop&w=1920&q=80"
        crumbs={[{ label: "Home", href: "/" }, { label: "Tour Packages" }]}
      />

      <section className="bg-navy py-16 px-5">
        <div className="w-[min(1120px,100%)] mx-auto flex flex-col gap-6">
          {packages.map((p) => (
            <article
              key={p.id}
              id={p.id}
              data-glow
              className="grid md:grid-cols-[400px_1fr] bg-white/4 border border-white/8 rounded-[28px] overflow-hidden
                hover:border-white/[.14] transition-colors duration-300"
            >
              {/* Image */}
              <div className="relative h-60 md:h-auto min-h-65">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 bg-gold text-mid text-xs font-black px-3 py-1.5 rounded-full">
                  {p.days}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 md:p-8 flex flex-col">
                <p className="text-gold text-[10px] font-black uppercase tracking-[.15em] mb-1.5">Sri Lanka Tour</p>
                <h2 className="font-black text-white text-2xl leading-tight mb-2" style={{ letterSpacing: "-0.02em" }}>{p.title}</h2>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.desc.split(" · ").map((d) => (
                    <span key={d} className="bg-white/[.07] text-white/60 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                      {d}
                    </span>
                  ))}
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-5 text-[13px]">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                    <p className="text-emerald-400 font-black text-[10px] uppercase tracking-wider mb-1">Included</p>
                    <p className="text-white/70 leading-relaxed">{p.inc}</p>
                  </div>
                  <div className="bg-white/4 border border-white/[.07] rounded-xl px-4 py-3">
                    <p className="text-white/30 font-black text-[10px] uppercase tracking-wider mb-1">Excluded</p>
                    <p className="text-white/50 leading-relaxed">{p.exc}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 mt-auto flex-wrap">
                  <div>
                    <p className="text-white/30 text-[11px] font-bold">Starting From</p>
                    <p className="text-gold font-black text-2xl" style={{ letterSpacing: "-0.03em" }}>{p.price}</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <Link
                      href={`/packages/${p.id}`}
                      className="bg-white/7 hover:bg-white/13 border border-white/10 text-white font-black text-sm px-5 py-2.5 rounded-full transition-all"
                    >
                      View Details
                    </Link>
                    <Link href="/contact" className="bg-gold hover:bg-gold-deep text-mid font-black text-sm px-5 py-2.5 rounded-full transition-all">
                      Inquire Now
                    </Link>
                    <a
                      href={`https://wa.me/94741838376?text=I'm interested in the ${encodeURIComponent(p.title)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm px-4 py-2.5 rounded-full transition-all"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
