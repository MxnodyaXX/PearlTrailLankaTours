import Navbar        from "@/components/Navbar";
import PageHero      from "@/components/PageHero";
import Footer        from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import GalleryGrid   from "@/components/GalleryGrid";
import { getAllGallery } from "@/lib/gallery-store";

// Always read fresh from the DB so admin edits appear immediately
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const photos = await getAllGallery();

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

      <GalleryGrid photos={photos} />

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
