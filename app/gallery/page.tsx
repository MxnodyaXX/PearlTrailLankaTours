"use client";
import Navbar        from "@/components/Navbar";
import PageHero      from "@/components/PageHero";
import Footer        from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useState }  from "react";

const photos = [
  { src:"https://images.unsplash.com/photo-1663784025074-49e9e7f11f62?auto=format&fit=crop&w=800&q=80", label:"Sigiriya Rock Fortress" },
  { src:"https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?auto=format&fit=crop&w=800&q=80", label:"Kandy — Temple of the Tooth" },
  { src:"https://images.unsplash.com/photo-1544015759-237f87d55ef3?auto=format&fit=crop&w=800&q=80", label:"Nuwara Eliya Tea Plantation" },
  { src:"https://images.unsplash.com/photo-1547818832-470a7998a99a?auto=format&fit=crop&w=800&q=80", label:"Galle Dutch Fort" },
  { src:"https://images.unsplash.com/photo-1590862891-d5545e1d6e4a?auto=format&fit=crop&w=800&q=80", label:"Ella Hill Country" },
  { src:"https://images.unsplash.com/photo-1776336885293-fba436d4281a?auto=format&fit=crop&w=800&q=80", label:"Mirissa Beach" },
  { src:"https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80", label:"South Coast Sunset" },
  { src:"https://images.unsplash.com/photo-1663403764000-f927ff20fcbb?auto=format&fit=crop&w=800&q=80", label:"Anuradhapura — Ruwanweli Stupa" },
  { src:"https://images.unsplash.com/photo-1566650576880-6740b03eaad1?auto=format&fit=crop&w=800&q=80", label:"Elephant Safari — Sri Lanka" },
  { src:"https://images.unsplash.com/photo-1552055642-554ec085233a?auto=format&fit=crop&w=800&q=80", label:"Kandy Mountain Road" },
  { src:"https://images.unsplash.com/photo-1533484482814-3fe2d922be89?auto=format&fit=crop&w=800&q=80", label:"Pinnawala Elephant Orphanage" },
  { src:"https://images.unsplash.com/photo-1736142260757-6effc558100a?auto=format&fit=crop&w=800&q=80", label:"Colombo City Skyline" },
];

export default function GalleryPage() {
  const [lb, setLb] = useState<string | null>(null);

  return (
    <>
      <Navbar />
      <PageHero
        kicker="Photography"
        title="Our"
        em="Gallery"
        desc="Sri Lanka captured through our lens — stunning landscapes, ancient temples, golden beaches and more. Click any photo to enlarge."
        img="https://images.unsplash.com/photo-1663784025074-49e9e7f11f62?auto=format&fit=crop&w=1920&q=80"
        crumbs={[{ label: "Home", href: "/" }, { label: "Gallery" }]}
      />

      <section className="bg-[#020617] py-16 px-5">
        <div className="w-[min(1120px,100%)] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((p) => (
            <button
              key={p.src}
              onClick={() => setLb(p.src)}
              className="group relative rounded-[18px] overflow-hidden aspect-[4/3] cursor-zoom-in"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <p className="absolute bottom-3 left-3 right-3 text-white text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-left">{p.label}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lb && (
        <div
          className="fixed inset-0 z-[200] bg-black/92 flex items-center justify-center p-4"
          onClick={() => setLb(null)}
        >
          <button className="absolute top-5 right-6 text-white text-4xl font-black hover:text-gold" onClick={() => setLb(null)}>×</button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lb.replace("w=800","w=1400")}
            alt="Gallery"
            className="max-w-full max-h-[88vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
