import Navbar        from "@/components/Navbar";
import VehicleHero   from "@/components/VehicleHero";
import FleetCollection from "@/components/FleetCollection";
import Footer        from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getAllVehicles } from "@/lib/vehicles-store";

// Always read fresh from the DB so admin edits appear immediately
export const dynamic = "force-dynamic";

export default async function RentACarPage() {
  const vehicles = await getAllVehicles();
  return (
    <>
      <Navbar />
      <VehicleHero />

      {/* Fleet collection — filterable grid */}
      <FleetCollection vehicles={vehicles} />

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
