"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const destinations = ["Colombo","Galle","Kandy","Ella","Nuwara Eliya","Jaffna","Mirissa","Anuradhapura","Yala"];
const tourTypes    = ["Day Tour","2–3 Days","4+ Days","Custom"];

export default function SearchBar() {
  const router = useRouter();
  const [dest, setDest]  = useState("");
  const [type, setType]  = useState("");
  const [date, setDate]  = useState("");

  const search = () => router.push(`/packages${dest ? `?dest=${encodeURIComponent(dest)}` : ""}`);

  return (
    <div
      className="relative z-30 mx-auto -mt-14"
      style={{ width: "min(1040px, calc(100% - 36px))" }}
    >
      <div
        className="bg-white/90 backdrop-blur-2xl text-slate-900 rounded-[28px] p-3.5
          grid grid-cols-[1.2fr_1fr_1fr_auto] gap-2.5
          shadow-[0_30px_90px_rgba(0,0,0,.28)]
          max-md:grid-cols-1"
      >
        <Field label="Destination">
          <select
            value={dest}
            onChange={(e) => setDest(e.target.value)}
            className="w-full bg-transparent text-sm font-black outline-none text-slate-800 cursor-pointer"
          >
            <option value="">Ella / Sigiriya / Galle</option>
            {destinations.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </Field>

        <Field label="Tour Type">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-transparent text-sm font-black outline-none text-slate-800 cursor-pointer"
          >
            <option value="">Luxury · Adventure</option>
            {tourTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Travel Date">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent text-sm font-black outline-none text-slate-800 cursor-pointer"
          />
        </Field>

        <button
          onClick={search}
          className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-black text-sm
            px-7 rounded-[18px] transition-colors whitespace-nowrap
            max-md:h-12"
        >
          Search
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-100 rounded-[18px] px-4 py-3.5">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5">{label}</p>
      {children}
    </div>
  );
}
