// Gallery photo types + code fallback. Reads from the DB when configured
// (lib/gallery-store.ts), else falls back to this list.

export interface GalleryPhoto {
  id: string;
  src: string;
  label: string;
  active?: boolean;
  sort?: number;
}

export const galleryPhotos: GalleryPhoto[] = [
  { id: "sigiriya", src: "https://images.unsplash.com/photo-1663784025074-49e9e7f11f62?auto=format&fit=crop&w=800&q=80", label: "Sigiriya Rock Fortress", sort: 1 },
  { id: "kandy-temple", src: "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?auto=format&fit=crop&w=800&q=80", label: "Kandy — Temple of the Tooth", sort: 2 },
  { id: "nuwara-tea", src: "https://images.unsplash.com/photo-1544015759-237f87d55ef3?auto=format&fit=crop&w=800&q=80", label: "Nuwara Eliya Tea Plantation", sort: 3 },
  { id: "galle-fort", src: "https://images.unsplash.com/photo-1547818832-470a7998a99a?auto=format&fit=crop&w=800&q=80", label: "Galle Dutch Fort", sort: 4 },
  { id: "ella", src: "https://images.unsplash.com/photo-1590862891-d5545e1d6e4a?auto=format&fit=crop&w=800&q=80", label: "Ella Hill Country", sort: 5 },
  { id: "mirissa", src: "https://images.unsplash.com/photo-1776336885293-fba436d4281a?auto=format&fit=crop&w=800&q=80", label: "Mirissa Beach", sort: 6 },
  { id: "south-coast", src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80", label: "South Coast Sunset", sort: 7 },
  { id: "anuradhapura", src: "https://images.unsplash.com/photo-1663403764000-f927ff20fcbb?auto=format&fit=crop&w=800&q=80", label: "Anuradhapura — Ruwanweli Stupa", sort: 8 },
  { id: "elephant-safari", src: "https://images.unsplash.com/photo-1566650576880-6740b03eaad1?auto=format&fit=crop&w=800&q=80", label: "Elephant Safari — Sri Lanka", sort: 9 },
  { id: "kandy-road", src: "https://images.unsplash.com/photo-1552055642-554ec085233a?auto=format&fit=crop&w=800&q=80", label: "Kandy Mountain Road", sort: 10 },
  { id: "pinnawala", src: "https://images.unsplash.com/photo-1533484482814-3fe2d922be89?auto=format&fit=crop&w=800&q=80", label: "Pinnawala Elephant Orphanage", sort: 11 },
  { id: "colombo", src: "https://images.unsplash.com/photo-1736142260757-6effc558100a?auto=format&fit=crop&w=800&q=80", label: "Colombo City Skyline", sort: 12 },
];
