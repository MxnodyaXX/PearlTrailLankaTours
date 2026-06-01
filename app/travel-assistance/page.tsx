import Navbar        from "@/components/Navbar";
import PageHero      from "@/components/PageHero";
import Footer        from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Link          from "next/link";

const services = [
  { icon:"✈️", title:"Airport Pickup & Drop",     desc:"Reliable 24/7 airport transfer from Bandaranaike International Airport to any destination. We track your flight — we'll be there when you land.", href:"/contact" },
  { icon:"🏨", title:"Hotel Reservations",          desc:"From budget guesthouses to 5-star resorts and boutique villas — we find and book the right accommodation for your style and budget.", href:"/contact" },
  { icon:"🛂", title:"Visa Assistance",             desc:"Guidance on Sri Lanka's tourist ETA process, help with document preparation, and support for a smooth entry into the island.", href:"/contact" },
  { icon:"🗺️", title:"Custom Itinerary Planning",  desc:"Tell us your travel dates, budget, and preferences — we'll design a personalized itinerary covering exactly what you want to experience.", href:"/contact" },
  { icon:"🚗", title:"Chauffeur Services",           desc:"Professional, English-speaking drivers for business travel, corporate events, VIP transfers, and family tour journeys.", href:"/rent-a-car" },
  { icon:"🌏", title:"International Tours",          desc:"Selected international packages for customers wishing to travel beyond Sri Lanka — Asia, Middle East, and beyond.", href:"/contact" },
];

const steps = [
  { n:"1", title:"Contact Us",     desc:"Reach out via WhatsApp, email, or our inquiry form with your travel details." },
  { n:"2", title:"Get Your Quote", desc:"We'll send a personalized quote within a few hours — no hidden charges." },
  { n:"3", title:"Confirm",        desc:"Review and confirm your booking. We handle all the arrangements from there." },
  { n:"4", title:"Enjoy Sri Lanka!", desc:"We take care of everything — you just sit back and enjoy the journey.", gold:true },
];

export default function TravelAssistancePage() {
  return (
    <>
      <Navbar />
      <PageHero
        kicker="We've Got You Covered"
        title="Travel"
        em="Assistance"
        desc="Airport transfers, hotel bookings, visa help, and complete travel support — so you can focus entirely on the journey."
        img="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80"
        crumbs={[{ label: "Home", href: "/" }, { label: "Travel Assistance" }]}
      />

      {/* Services */}
      <section className="bg-[#020617] py-16 px-5">
        <div className="w-[min(1120px,100%)] mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold text-[11px] font-black uppercase tracking-[.2em] mb-3">Full Support</p>
            <h2 className="font-black text-white text-4xl md:text-5xl" style={{ letterSpacing: "-0.03em" }}>Everything you need for a perfect trip.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <Link key={s.title} href={s.href}
                data-glow
                className="group bg-white/[.04] border border-white/[.08] rounded-[24px] p-6 flex flex-col gap-3
                  hover:border-gold/40 hover:bg-white/[.07] transition-all duration-300">
                <span className="text-4xl">{s.icon}</span>
                <h3 className="font-black text-white text-lg">{s.title}</h3>
                <p className="text-white/55 text-[14px] leading-relaxed flex-1">{s.desc}</p>
                <span className="text-gold text-sm font-black group-hover:gap-2 transition-all">Book Now →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#0f172a] py-20 px-5">
        <div className="w-[min(900px,100%)] mx-auto text-center">
          <p className="text-gold text-[11px] font-black uppercase tracking-[.2em] mb-3">Simple Process</p>
          <h2 className="font-black text-white text-4xl mb-12" style={{ letterSpacing: "-0.03em" }}>How it works</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl mb-4 ${s.gold ? "bg-gold text-[#0f172a]" : "bg-teal text-white"}`}>
                  {s.n}
                </div>
                <h4 className="font-black text-white text-sm mb-1">{s.title}</h4>
                <p className="text-white/45 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 px-5 text-center"
        style={{ background: "linear-gradient(120deg,rgba(2,6,23,.92),rgba(2,6,23,.65)), url('https://images.unsplash.com/photo-1540202404-1b927e27fa8b?auto=format&fit=crop&w=1920&q=80') fixed center/cover" }}
      >
        <h2 className="font-black text-white text-4xl md:text-5xl mb-4" style={{ letterSpacing: "-0.03em" }}>Need help planning?</h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">Get in touch and we'll handle everything — from airport arrival to your final departure.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="bg-gold hover:bg-gold-deep text-[#0f172a] font-black px-7 py-3.5 rounded-full text-sm transition-all">Send Inquiry</Link>
          <a href="https://wa.me/94741838376" target="_blank" rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-7 py-3.5 rounded-full text-sm transition-all">WhatsApp Us</a>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
