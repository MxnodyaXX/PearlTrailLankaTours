const reviews = [
  {
    name:    "Emily Carter",
    country: "United Kingdom",
    text:    "Our Sri Lanka tour was perfectly arranged. The vehicle was comfortable, the driver was friendly, and every detail of the itinerary was well planned.",
    init:    "EC",
  },
  {
    name:    "Mark Schneider",
    country: "Germany",
    text:    "PearlTrailLankaTours helped us explore Kandy, Ella, and Mirissa without any stress. Highly recommended for anyone wanting to experience Sri Lanka properly.",
    init:    "MS",
  },
  {
    name:    "Priya Sharma",
    country: "India",
    text:    "The airport pickup and hotel arrangements were absolutely smooth and professional. Great service, very fast communication — will definitely use again.",
    init:    "PS",
  },
];

export default function Testimonials() {
  return (
    <section
      className="relative py-14 md:py-28 px-4"
      style={{
        background:
          "linear-gradient(160deg,rgba(2,6,23,.85),rgba(2,6,23,.70)), url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80') fixed center/cover",
      }}
    >
      <div className="w-[min(1120px,100%)] mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-gold text-[11px] font-black uppercase tracking-[.2em] mb-3">Happy Travelers</p>
          <h2
            className="font-black text-white leading-[.97]"
            style={{ fontSize: "clamp(24px,4vw,56px)", letterSpacing: "-0.03em" }}
          >
            What our guests say.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {reviews.map((r) => (
            <div
              key={r.name}
              data-glow
              className="bg-white/[.08] border border-white/[.13] backdrop-blur-xl rounded-[20px] md:rounded-[24px] p-4 md:p-6 text-white
                hover:bg-white/[.13] transition-colors duration-300"
            >
              <div className="flex gap-0.5 text-gold text-sm mb-3 md:mb-4">
                {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
              </div>
              <p className="text-white/80 text-[14px] md:text-[15px] leading-relaxed italic mb-4 md:mb-5">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gold flex items-center justify-center text-[#0f172a] font-black text-sm shrink-0">
                  {r.init}
                </div>
                <div>
                  <p className="font-black text-sm">{r.name}</p>
                  <p className="text-white/50 text-xs font-medium">{r.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
