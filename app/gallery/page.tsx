"use client";
import Navbar        from "@/components/Navbar";
import PageHero      from "@/components/PageHero";
import Footer        from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useState }  from "react";

const photos = [
  { src:"https://images.unsplash.com/photo-1566296314736-6eaea1755b48?auto=format&fit=crop&w=800&q=80", label:"Sigiriya Rock Fortress" },
  { src:"https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80", label:"Kandy — Temple of the Tooth" },
  { src:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80", label:"Nuwara Eliya Tea Plantation" },
  { src:"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80", label:"Galle Dutch Fort" },
  { src:"https://images.unsplash.com/photo-1590862891-d5545e1d6e4a?auto=format&fit=crop&w=800&q=80", label:"Ella Hill Country" },
  { src:"https://images.unsplash.com/photo-1540202404-1b927e27fa8b?auto=format&fit=crop&w=800&q=80", label:"Mirissa Beach" },
  { src:"https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80", label:"South Coast Sunset" },
  { src:"https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80", label:"Ancient Heritage Site" },
  { src:"https://images.unsplash.com/photo-1595152772835-219674b2a163?auto=format&fit=crop&w=800&q=80", label:"Misty Hill Country" },
  { src:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80", label:"Sri Lanka Mountains" },
  { src:"https://images.unsplash.com/photo-1448375240890-95a3e6b83b13?auto=format&fit=crop&w=800&q=80", label:"Tropical Rainforest" },
  { src:"https://images.unsplash.com/photo-1560693463-a8adb872c70c?auto=format&fit=crop&w=800&q=80", label:"Colombo City" },
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
        img="https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1920&q=80"
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
