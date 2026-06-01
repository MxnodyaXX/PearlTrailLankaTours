import Navbar        from "@/components/Navbar";
import PageHero      from "@/components/PageHero";
import StatsBar      from "@/components/StatsBar";
import Footer        from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Link          from "next/link";

const values = [
  { icon:"🎯", title:"Our Mission",    desc:"To provide every traveler with a seamless, safe, and unforgettable Sri Lanka experience through personalized service, local expertise, and reliable transportation at the best possible value." },
  { icon:"👁️", title:"Our Vision",    desc:"To be Sri Lanka's most trusted travel partner — known for excellence, authenticity, and creating journeys that are truly Beyond the Ordinary." },
  { icon:"🤝", title:"Integrity",      desc:"We operate with complete transparency — honest pricing, clear communication, no hidden costs. Your trust is the foundation of everything we do." },
  { icon:"❤️", title:"Passion for SL", desc:"We are proud Sri Lankans who genuinely love sharing the beauty, culture, and hospitality of our island with every traveler who visits." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <PageHero
        kicker="Our Story"
        title="About"
        em="Us"
        desc="A Sri Lankan travel agency dedicated to creating unforgettable experiences — from Colombo to the hill country, from ancient temples to golden beaches."
        img="https://images.unsplash.com/photo-1566296314736-6eaea1755b48?auto=format&fit=crop&w=1920&q=80"
        crumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      {/* Story */}
      <section className="bg-[#020617] py-20 px-5">
        <div className="w-[min(1120px,100%)] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=700&q=80" alt="Sri Lanka" className="rounded-[32px] w-full h-[480px] object-cover" />
            <div className="absolute bottom-5 left-5 bg-white/85 backdrop-blur-xl rounded-2xl px-4 py-3">
              <p className="font-black text-slate-900 text-sm">PearlTrailLankaTours</p>
              <p className="text-slate-500 text-xs font-bold mt-0.5">Colombo, Sri Lanka</p>
            </div>
          </div>
          <div className="text-white">
            <p className="text-gold text-[11px] font-black uppercase tracking-[.2em] mb-3">Who We Are</p>
            <h2 className="font-black leading-[.97] mb-5 text-4xl md:text-5xl" style={{ letterSpacing: "-0.03em" }}>
              Your gateway to extraordinary Sri Lanka.
            </h2>
            <p className="text-white/60 leading-relaxed mb-4">
              PearlTrailLankaTours is a Sri Lankan travel agency dedicated to creating unforgettable travel experiences. We specialize in customized tour packages, airport transfers, rent-a-car services, hotel reservations, visa assistance, and complete travel planning for both foreign and local travelers.
            </p>
            <p className="text-white/60 leading-relaxed mb-8">
              Whether you're visiting for culture, wildlife, beaches, adventure, business, or relaxation — PearlTrailLankaTours guides you from arrival to departure with care, expertise, and genuine Sri Lankan hospitality.
            </p>
            <ul className="grid grid-cols-2 gap-2 mb-8">
              {["Customized Tour Packages","Professional Chauffeur Services","24/7 Traveler Support","Best Price Guarantee","Airport Transfer Services","Hotel Booking Assistance","Visa Guidance","Custom Itinerary Planning"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                  <span className="text-gold text-xs">✓</span> {f}
                </li>
              ))}
            </ul>
            <Link href="/contact" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black px-6 py-3 rounded-full text-sm transition-all inline-block">
              Get In Touch →
            </Link>
          </div>
        </div>
      </section>

      <StatsBar />

      {/* Mission / Vision */}
      <section className="bg-[#0f172a] py-20 px-5">
        <div className="w-[min(1120px,100%)] mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold text-[11px] font-black uppercase tracking-[.2em] mb-3">Our Purpose</p>
            <h2 className="font-black text-white text-4xl md:text-5xl" style={{ letterSpacing: "-0.03em" }}>Mission, Vision & Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map((v) => (
              <div key={v.title} data-glow className="bg-white/[.04] border border-white/[.08] rounded-[24px] p-6">
                <span className="text-3xl block mb-3">{v.icon}</span>
                <h3 className="font-black text-white text-lg mb-2">{v.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
