import Navbar        from "@/components/Navbar";
import PageHero      from "@/components/PageHero";
import Footer        from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Link          from "next/link";

const packages = [
  { id:"colombo",     title:"Colombo City Tour",           days:"1 Day",         price:"LKR 18,000", img:"https://images.unsplash.com/photo-1560693463-a8adb872c70c?auto=format&fit=crop&w=800&q=80", desc:"Colombo Fort · Galle Face · Gangaramaya · Lotus Tower · One Galle Face", inc:"Private vehicle, driver, fuel, city guidance", exc:"Entrance tickets, meals, personal expenses" },
  { id:"galle",       title:"Galle Heritage Tour",         days:"1 Day",         price:"LKR 28,000", img:"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80", desc:"Galle Fort · Unawatuna Beach · Jungle Beach · Dutch Fort · Lighthouse", inc:"Private transport, driver, highway charges", exc:"Meals, entrance tickets, activity fees" },
  { id:"kandy",       title:"Kandy Cultural Tour",         days:"2D / 1N",       price:"LKR 45,000", img:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80", desc:"Temple of the Tooth · Peradeniya Garden · Kandy Lake · Cultural Dance Show", inc:"Vehicle, driver, fuel, hotel assistance", exc:"Hotel charges, meals, entrance tickets" },
  { id:"nuwara",      title:"Nuwara Eliya Tea Tour",       days:"2D / 1N",       price:"LKR 52,000", img:"https://images.unsplash.com/photo-1595152772835-219674b2a163?auto=format&fit=crop&w=800&q=80", desc:"Tea Plantations · Gregory Lake · Ramboda Falls · Hakgala Garden · Seetha Amman Temple", inc:"Transport, driver, fuel, travel guidance", exc:"Accommodation, meals, entry fees" },
  { id:"ella",        title:"Ella Adventure Tour",         days:"3D / 2N",       price:"LKR 68,000", img:"https://images.unsplash.com/photo-1590862891-d5545e1d6e4a?auto=format&fit=crop&w=800&q=80", desc:"Nine Arch Bridge · Little Adam's Peak · Ravana Falls · Ella Rock · Tea Estates", inc:"Private transport, driver, route planning", exc:"Hotel, meals, activity charges" },
  { id:"jaffna",      title:"Jaffna Northern Experience",  days:"3D / 2N",       price:"LKR 75,000", img:"https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80", desc:"Jaffna Fort · Nallur Temple · Casuarina Beach · Delft Island · Point Pedro", inc:"Vehicle, driver, fuel, route planning", exc:"Accommodation, meals, ferry charges, entrance tickets" },
  { id:"anuradhapura",title:"Anuradhapura Heritage Tour",  days:"2D / 1N",       price:"LKR 48,000", img:"https://images.unsplash.com/photo-1566296314736-6eaea1755b48?auto=format&fit=crop&w=800&q=80", desc:"Sri Maha Bodhi · Ruwanwelisaya · Thuparamaya · Mihintale · Isurumuniya", inc:"Private vehicle, driver, fuel", exc:"Accommodation, meals, entrance fees" },
  { id:"southern",    title:"Southern Beach Escape",       days:"4D / 3N",       price:"LKR 95,000", img:"https://images.unsplash.com/photo-1540202404-1b927e27fa8b?auto=format&fit=crop&w=800&q=80", desc:"Galle · Mirissa · Weligama · Unawatuna · Bentota", inc:"Vehicle, driver, route planning", exc:"Hotel, meals, activity fees" },
];

export default function PackagesPage() {
  return (
    <>
      <Navbar />
      <PageHero
        kicker="Explore Sri Lanka"
        title="Our Tour"
        em="Packages"
        desc="Handpicked tours for every traveler — from day trips to multi-day adventures across Sri Lanka's most iconic destinations."
        img="https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1920&q=80"
        crumbs={[{ label: "Home", href: "/" }, { label: "Tour Packages" }]}
      />

      <section className="bg-[#020617] py-16 px-5">
        <div className="w-[min(1120px,100%)] mx-auto flex flex-col gap-6">
          {packages.map((p) => (
            <article
              key={p.id}
              id={p.id}
              data-glow
              className="grid md:grid-cols-[400px_1fr] bg-white/[.04] border border-white/[.08] rounded-[28px] overflow-hidden
                hover:border-white/[.14] transition-colors duration-300"
            >
              {/* Image */}
              <div className="relative h-60 md:h-auto min-h-[260px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.img} alt={p.title} className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 bg-gold text-[#0f172a] text-xs font-black px-3 py-1.5 rounded-full">
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
                  <div className="bg-white/[.04] border border-white/[.07] rounded-xl px-4 py-3">
                    <p className="text-white/30 font-black text-[10px] uppercase tracking-wider mb-1">Excluded</p>
                    <p className="text-white/50 leading-relaxed">{p.exc}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 mt-auto flex-wrap">
                  <div>
                    <p className="text-white/30 text-[11px] font-bold">Starting From</p>
                    <p className="text-gold font-black text-2xl" style={{ letterSpacing: "-0.03em" }}>{p.price}</p>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/contact" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black text-sm px-5 py-2.5 rounded-full transition-all">
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
