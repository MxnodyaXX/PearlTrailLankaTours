"use client";
import { useState } from "react";
import type { GalleryPhoto } from "@/lib/gallery-data";

export default function GalleryGrid({ photos }: { photos: GalleryPhoto[] }) {
  const [lb, setLb] = useState<string | null>(null);

  return (
    <>
      <section className="bg-[#020617] py-16 px-5">
        <div className="w-[min(1120px,100%)] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {photos.map((p) => (
            <button
              key={p.id}
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
            src={lb.replace("w=800", "w=1400")}
            alt="Gallery"
            className="max-w-full max-h-[88vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
