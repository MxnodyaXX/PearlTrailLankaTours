"use client";
import Link from "next/link";
import GridMotion from "./GridMotion";

const q = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=640&q=75`;

const tile = (t: string) => (
  <span style={{ color: "#f6b93b", fontWeight: 900, textTransform: "uppercase", letterSpacing: ".1em", fontSize: "clamp(11px,1.4vw,16px)", textAlign: "center", lineHeight: 1.2 }}>{t}</span>
);

// 28 tiles (4 rows × 7) — verified real Sri Lanka photos + a few gold word-tiles
const items: (string | React.ReactNode)[] = [
  q("photo-1612862862126-865765df2ded"), // Sigiriya aerial
  tile("Ceylon"),
  q("photo-1665849050332-8d5d7e59afb6"), // Kandy temple
  q("photo-1544015759-237f87d55ef3"),    // tea aerial
  q("photo-1728455470905-156f4278056a"), // leopard
  tile("Pearl of the Indian Ocean"),
  q("photo-1734279135115-6d8984e08206"), // Mirissa aerial
  // row 2
  q("photo-1547818832-470a7998a99a"),    // Galle fort
  q("photo-1566766189268-ecac9118f2b7"), // Nine Arch train
  tile("🇱🇰"),
  q("photo-1593377685064-720da51f3634"), // Buddha statue
  q("photo-1736142260757-6effc558100a"), // Colombo
  q("photo-1585171328560-947fbd92d6f0"), // tea path
  q("photo-1533484482814-3fe2d922be89"), // Pinnawala elephants
  // row 3
  tile("Beyond the Ordinary"),
  q("photo-1663403764000-f927ff20fcbb"), // Anuradhapura stupa
  q("photo-1590862891-d5545e1d6e4a"),    // Ella hill
  q("photo-1776336885293-fba436d4281a"), // Mirissa beach
  q("photo-1566650576880-6740b03eaad1"), // elephant safari
  q("photo-1552055642-554ec085233a"),    // mountain road
  tile("Explore"),
  // row 4
  q("photo-1683647986987-bcd7c320f3a1"), // ocean Kirinda
  q("photo-1582313106868-34e0bfed6e40"), // local portrait
  q("photo-1663784025074-49e9e7f11f62"), // Sigiriya field
  q("photo-1704797390597-24dea42ffea8"), // Mirissa coast
  q("photo-1552055568-e9943cd2a08f"),    // aerial coast
  q("photo-1621393614326-2f9ed389ce02"), // Anuradhapura green
  q("photo-1559827291-72673e0be0a7"),    // Negombo beach
];

export default function GalleryMotion() {
  return (
    <section className="relative overflow-hidden" style={{ height: "92vh", background: "#020617" }}>
      <GridMotion items={items} gradientColor="#0a1326" />

      {/* Cinematic title overlay */}
      <div
        className="absolute inset-0 z-[5] flex flex-col items-center justify-center text-center px-5"
        style={{
          pointerEvents: "none",
          background: "radial-gradient(ellipse 68% 58% at 50% 50%, rgba(2,6,23,.82) 0%, rgba(2,6,23,.32) 52%, rgba(2,6,23,.74) 100%)",
        }}
      >
        <p className="text-[11px] font-black uppercase tracking-[.3em] mb-4" style={{ color: "#f6b93b", textShadow: "0 2px 12px rgba(0,0,0,.6)" }}>
          The Gallery
        </p>
        <h2 className="font-black leading-[.95]" style={{ fontSize: "clamp(34px,6vw,88px)", letterSpacing: "-0.04em", color: "#f8fafc", textShadow: "0 12px 55px rgba(0,0,0,.6)" }}>
          Sri Lanka,<br /><span className="italic" style={{ color: "#f6b93b" }}>frame by frame.</span>
        </h2>
        <p className="mt-5 max-w-xl text-[15px] md:text-[17px] leading-relaxed" style={{ color: "#cbd5e1", textShadow: "0 2px 14px rgba(0,0,0,.7)" }}>
          Ancient rock fortresses, misty tea hills, wild safaris and golden coasts —
          move your cursor and let the island drift past.
        </p>
        <Link
          href="/gallery"
          className="mt-8 bg-gold hover:bg-gold-deep text-[#0f172a] font-black px-7 py-3.5 rounded-full text-sm transition-all hover:-translate-y-0.5 shadow-[0_12px_30px_rgba(246,185,59,.35)]"
          style={{ pointerEvents: "auto" }}
        >
          Open Full Gallery →
        </Link>
      </div>
    </section>
  );
}
