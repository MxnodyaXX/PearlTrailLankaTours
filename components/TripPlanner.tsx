"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const styles   = ["Luxury","Adventure","Cultural","Wildlife","Beach","Honeymoon","Family","Budget"];
const durations = ["1 Day","2–3 Days","4–5 Days","6–9 Days","10+ Days"];
const budgets  = ["Under LKR 30K","LKR 30K–70K","LKR 70K–150K","LKR 150K+","Flexible"];

export default function TripPlanner() {
  const router = useRouter();
  const [style, setStyle]   = useState("");
  const [dur,   setDur]     = useState("");
  const [budget, setBudget] = useState("");

  const generate = () => router.push("/contact?intent=custom");

  return (
    <section
      className="relative flex items-center justify-center py-14 md:py-24 px-4"
      style={{
        background:
          "linear-gradient(120deg,rgba(2,6,23,.92),rgba(2,6,23,.60)), url('https://images.unsplash.com/photo-1544015759-237f87d55ef3?auto=format&fit=crop&w=1920&q=80') fixed center/cover",
      }}
    >
      <div
        data-glow
        className="w-[min(920px,100%)] bg-white/[.10] border border-white/[.16] backdrop-blur-2xl
          rounded-[24px] md:rounded-[42px] p-5 sm:p-8 md:p-12 grid md:grid-cols-2 gap-6 md:gap-10"
      >
        {/* Left */}
        <div className="text-white flex flex-col justify-center">
          <p className="text-gold text-[11px] font-black uppercase tracking-[.18em] mb-3">
            Smart Trip Planner
          </p>
          <h2
            className="font-black leading-[.97] mb-4"
            style={{ fontSize: "clamp(24px,4vw,52px)", letterSpacing: "-0.03em" }}
          >
            Let us design your perfect journey.
          </h2>
          <p className="text-[#dbeafe] text-[14px] md:text-[15px] leading-relaxed">
            Select your interests, budget, and duration. We'll craft a personalized Sri Lanka
            itinerary — and can later connect you to hotels, vehicles, and guides.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Sigiriya","Ella","Mirissa","Kandy","Yala"].map((d) => (
              <span key={d} className="bg-white/10 border border-white/15 text-white/70 text-[10px] font-bold px-3 py-1 rounded-full">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white text-slate-900 rounded-[20px] md:rounded-[28px] p-4 md:p-6 flex flex-col gap-3">
          <PlanField label="Travel Style">
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-transparent font-black text-sm outline-none cursor-pointer"
            >
              <option value="">Choose your style</option>
              {styles.map((s) => <option key={s}>{s}</option>)}
            </select>
          </PlanField>

          <PlanField label="Duration">
            <select
              value={dur}
              onChange={(e) => setDur(e.target.value)}
              className="w-full bg-transparent font-black text-sm outline-none cursor-pointer"
            >
              <option value="">How many days?</option>
              {durations.map((d) => <option key={d}>{d}</option>)}
            </select>
          </PlanField>

          <PlanField label="Budget Range">
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-transparent font-black text-sm outline-none cursor-pointer"
            >
              <option value="">Select budget</option>
              {budgets.map((b) => <option key={b}>{b}</option>)}
            </select>
          </PlanField>

          <button
            onClick={generate}
            className="mt-2 h-12 md:h-14 rounded-xl md:rounded-2xl bg-gold hover:bg-gold-deep text-[#0f172a]
              font-black text-sm transition-all hover:-translate-y-0.5 shadow-[0_6px_20px_rgba(246,185,59,.35)]"
          >
            Generate My Trip →
          </button>
        </div>
      </div>
    </section>
  );
}

function PlanField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-100 rounded-[12px] md:rounded-[14px] px-4 py-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{label}</p>
      {children}
    </div>
  );
}
