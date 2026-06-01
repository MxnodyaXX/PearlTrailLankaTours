"use client";
import { useState } from "react";

const faqs = [
  { q: "Do you provide airport pickup and drop services?",      a: "Yes — reliable 24/7 airport transfers from Bandaranaike International Airport to any destination in Sri Lanka." },
  { q: "Can I customize my tour package?",                      a: "Absolutely. All packages are fully customizable based on your travel dates, budget, number of travelers, and specific interests." },
  { q: "Do your vehicles come with drivers?",                   a: "Most vehicles are available with professional, English-speaking drivers who know Sri Lanka's roads and tourist sites." },
  { q: "Can you help with hotel bookings?",                     a: "Yes — from budget guesthouses to 5-star resorts and boutique villas, we find and book the right option for you." },
  { q: "Do you provide visa assistance?",                       a: "Yes — we guide you through Sri Lanka's tourist ETA process and help with travel document preparation." },
  { q: "How do I make a booking?",                              a: "Contact us via WhatsApp (0741838376), fill in our inquiry form, or email pearltraillankatours@company.com. We respond within a few hours." },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-[#020617] py-14 md:py-24 px-4">
      <div className="w-[min(820px,100%)] mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-gold text-[11px] font-black uppercase tracking-[.2em] mb-3">Need Help?</p>
          <h2
            className="font-black text-white leading-[.97]"
            style={{ fontSize: "clamp(24px,4vw,52px)", letterSpacing: "-0.03em" }}
          >
            Frequently asked questions.
          </h2>
        </div>

        <div className="flex flex-col gap-2 md:gap-3">
          {faqs.map((f, i) => (
            <button
              key={i}
              data-glow
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full text-left bg-white/[.04] hover:bg-white/[.07] border border-white/[.08]
                rounded-xl md:rounded-2xl px-4 md:px-5 py-4 transition-colors duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-bold text-[14px] md:text-[15px] text-white/90">{f.q}</span>
                <span className={`text-gold text-lg font-black shrink-0 transition-transform duration-300 ${open === i ? "rotate-45" : ""}`}>+</span>
              </div>
              <div
                className={`overflow-hidden transition-all duration-300 ${open === i ? "max-h-64 mt-3" : "max-h-0"}`}
              >
                <p className="text-[#94a3b8] text-sm leading-relaxed">{f.a}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
