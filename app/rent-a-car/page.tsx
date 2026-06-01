import Navbar        from "@/components/Navbar";
import VehicleHero   from "@/components/VehicleHero";
import Footer        from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Link          from "next/link";

const vehicles = [
  { icon:"🚗", title:"Economy Car",     models:"Toyota Vitz · Suzuki Alto · Honda Fit",      cap:"3–4",   best:"City travel · Short trips · Budget",   price:"LKR 9,000/day" },
  { icon:"🚙", title:"Sedan",           models:"Toyota Axio · Toyota Premio · Honda Grace",   cap:"4",     best:"Airport transfers · Business travel",  price:"LKR 14,000/day" },
  { icon:"🚐", title:"Van / KDH",       models:"Toyota KDH · Nissan Caravan",                cap:"8–12",  best:"Family trips · Group tours",           price:"LKR 22,000/day" },
  { icon:"🚌", title:"Mini Cab",        models:"Suzuki Every · Daihatsu Hijet",              cap:"4–6",   best:"Short distance · Budget groups",       price:"LKR 12,000/day" },
  { icon:"🛻", title:"SUV",             models:"Toyota Prado · Mitsubishi Montero",           cap:"4–6",   best:"Hill country · Luxury travel",         price:"LKR 28,000/day" },
  { icon:"⭐", title:"Luxury Vehicle",  models:"BMW · Mercedes-Benz · Audi",                 cap:"3–4",   best:"VIP travel · Weddings · Corporate",    price:"LKR 45,000/day" },
  { icon:"🛺", title:"Three-Wheeler",   models:"Electric & Petrol Tuk-Tuks",                 cap:"2–3",   best:"Short city rides · Local travel",      price:"LKR 3,500/day" },
  { icon:"🚎", title:"Bus / Coach",     models:"AC Coaches · Mini Buses",                    cap:"20–45", best:"Group tours · School trips · Events",  price:"LKR 55,000/day" },
];

export default function RentACarPage() {
  return (
    <>
      <Navbar />
      <VehicleHero />

      {/* Fleet grid */}
      <section id="fleet" className="bg-[#020617] py-16 px-4 md:px-5">
        <div className="w-[min(1120px,100%)] mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold text-[11px] font-black uppercase tracking-[.2em] mb-2">Full Fleet</p>
            <h2 className="font-black text-white text-3xl md:text-4xl" style={{ letterSpacing: "-0.03em" }}>
              Every vehicle. Every budget.
            </h2>
            <p className="text-white/40 text-sm mt-3 max-w-lg mx-auto">
              All vehicles come with professional drivers. Rates shown are starting prices — contact us for exact quotes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vehicles.map((v) => (
              <div
                key={v.title}
                data-glow
                className="bg-white/[.04] border border-white/[.08] rounded-[24px] p-5 flex flex-col gap-3
                  hover:border-gold/40 hover:bg-white/[.07] transition-all duration-300"
              >
                <span className="text-4xl">{v.icon}</span>
                <div>
                  <h3 className="font-black text-white text-lg leading-tight mb-0.5">{v.title}</h3>
                  <p className="text-white/40 text-xs">{v.models}</p>
                </div>
                <div className="flex flex-col gap-1 text-xs text-white/50">
                  <span>👥 {v.cap} Passengers</span>
                  <span>✓ {v.best}</span>
                </div>
                <p className="text-gold font-black text-base mt-auto">From {v.price}</p>
                <Link
                  href="/contact"
                  className="bg-white/[.07] hover:bg-gold hover:text-[#0f172a] text-white text-xs font-black px-4 py-2.5 rounded-full text-center transition-all duration-300"
                >
                  Book This Vehicle
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Driver highlight */}
      <section
        className="relative py-16 md:py-20 px-4 md:px-5 text-center"
        style={{ background: "linear-gradient(120deg,rgba(2,6,23,.93),rgba(2,6,23,.65)), url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80') fixed center/cover" }}
      >
        <p className="text-gold text-[11px] font-black uppercase tracking-[.2em] mb-3">Professional Drivers</p>
        <h2 className="font-black text-white text-3xl md:text-5xl mb-10 md:mb-12" style={{ letterSpacing: "-0.03em" }}>
          Why choose our drivers?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 w-[min(900px,100%)] mx-auto">
          {[
            ["🇱🇰","Local Experts","Deep knowledge of all Sri Lanka destinations and routes"],
            ["🗣️","English Speaking","Clear communication for a stress-free journey"],
            ["🛡️","Safety First","Licensed, experienced, trained for passenger safety"],
            ["⏰","Always Punctual","On time, every time — we value your travel schedule"],
          ].map(([ico, title, desc]) => (
            <div key={title as string} data-glow className="bg-white/[.06] border border-white/[.1] rounded-2xl p-4 md:p-5 text-center">
              <span className="text-3xl block mb-3">{ico}</span>
              <h4 className="font-black text-white text-sm mb-1">{title}</h4>
              <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
