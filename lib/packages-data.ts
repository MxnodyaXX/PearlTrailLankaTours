export interface DayPlan {
  day: number;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  img: string;
  /** Optional captioned real photos shown as a strip under the main image */
  gallery?: { img: string; caption: string }[];
  stay: string;
}

/** A point on the route line, in the 664×936 map coordinate space. */
export interface MapPoint { x: number; y: number }

/** A named city marker tied to one or more itinerary days. */
export interface MapStop {
  x: number;
  y: number;
  label: string;
  days: number[];
  anchor?: "start" | "end"; // which side the label sits
}

/** A package's editable route map. */
export interface PackageMap {
  route: MapPoint[];
  stops: MapStop[];
}

export interface TourPackage {
  id: string;
  title: string;
  tagline: string;
  days: string;
  price: string;
  img: string;
  desc: string;
  inc: string;
  exc: string;
  overview: string;
  itinerary: DayPlan[];
  map?: PackageMap;
}

export const packages: TourPackage[] = [
  {
    id: "colombo",
    title: "Colombo City Tour",
    tagline: "One day. A thousand stories.",
    days: "1 Day",
    price: "LKR 18,000",
    img: "https://images.unsplash.com/photo-1736142260757-6effc558100a?auto=format&fit=crop&w=1920&q=80",
    desc: "Colombo Fort · Galle Face · Gangaramaya · Lotus Tower · One Galle Face",
    inc: "Private vehicle, driver, fuel, city guidance",
    exc: "Entrance tickets, meals, personal expenses",
    overview: "Experience the vibrant capital city of Sri Lanka in a single immersive day. From the colonial grandeur of Colombo Fort to the serene lakeside Gangaramaya Temple, this curated city tour weaves through centuries of history, culture, and modern urban energy — with the iconic Lotus Tower rising above it all. A perfect introduction to the island.",
    itinerary: []
  },
  {
    id: "galle",
    title: "Galle Heritage Tour",
    tagline: "Walk where Dutch traders walked three centuries ago.",
    days: "1 Day",
    price: "LKR 28,000",
    img: "https://images.unsplash.com/photo-1547818832-470a7998a99a?auto=format&fit=crop&w=1920&q=80",
    desc: "Galle Fort · Unawatuna Beach · Jungle Beach · Dutch Fort · Lighthouse",
    inc: "Private transport, driver, highway charges",
    exc: "Meals, entrance tickets, activity fees",
    overview: "Galle is where colonial history meets tropical coastline in spectacular fashion. Walk the UNESCO-listed Dutch Fort ramparts with the Indian Ocean stretching to the horizon, discover boutique galleries and spice merchants hidden in 300-year-old alleyways, then cool off on the white sands of Unawatuna and the secret cove of Jungle Beach.",
    itinerary: []
  },
  {
    id: "kandy",
    title: "Kandy Cultural Tour",
    tagline: "The cultural crown of the island awaits.",
    days: "2D / 1N",
    price: "LKR 45,000",
    img: "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?auto=format&fit=crop&w=1920&q=80",
    desc: "Temple of the Tooth · Peradeniya Garden · Kandy Lake · Cultural Dance Show",
    inc: "Vehicle, driver, fuel, hotel assistance",
    exc: "Hotel charges, meals, entrance tickets",
    overview: "Set among mist-wrapped hills, Kandy is Sri Lanka's last royal capital and a living centre of Buddhist tradition. Visit the sacred Temple of the Tooth Relic — one of the most venerated shrines in the Buddhist world — stroll the colonial-era botanical gardens at Peradeniya, and end the evening with a mesmerising Kandyan cultural dance performance.",
    itinerary: []
  },
  {
    id: "nuwara",
    title: "Nuwara Eliya Tea Tour",
    tagline: "Where the air is crisp and every hill is emerald.",
    days: "2D / 1N",
    price: "LKR 52,000",
    img: "https://images.unsplash.com/photo-1544015759-237f87d55ef3?auto=format&fit=crop&w=1920&q=80",
    desc: "Tea Plantations · Gregory Lake · Ramboda Falls · Hakgala Garden · Seetha Amman Temple",
    inc: "Transport, driver, fuel, travel guidance",
    exc: "Accommodation, meals, entry fees",
    overview: "Sri Lanka's 'Little England' sits at nearly 2,000 metres above sea level, wrapped in rolling tea estates and cooled by highland breezes. This tour takes you through working tea plantations where you can watch the leaves being plucked and processed, past the thundering Ramboda Falls, into the immaculate Hakgala Botanical Garden, and finally to the spiritually significant Seetha Amman Temple.",
    itinerary: []
  },
  {
    id: "ella",
    title: "Ella Adventure Tour",
    tagline: "Nine arches, infinite views, and untamed hillsides.",
    days: "3D / 2N",
    price: "LKR 68,000",
    img: "https://images.unsplash.com/photo-1590862891-d5545e1d6e4a?auto=format&fit=crop&w=1920&q=80",
    desc: "Nine Arch Bridge · Little Adam's Peak · Ravana Falls · Ella Rock · Tea Estates",
    inc: "Private transport, driver, route planning",
    exc: "Hotel, meals, activity charges",
    overview: "Ella is Sri Lanka's adventure capital — a compact hill town surrounded by dramatic peaks, thundering waterfalls, and some of the most photographed railway scenery in the world. Hike to Little Adam's Peak at sunrise, position yourself at the Nine Arch Bridge to catch the famous blue train, and summit Ella Rock for panoramic highland views that stretch all the way to the southern coast.",
    itinerary: []
  },
  {
    id: "jaffna",
    title: "Jaffna Northern Experience",
    tagline: "The raw, untouched soul of the north.",
    days: "3D / 2N",
    price: "LKR 75,000",
    img: "https://images.unsplash.com/photo-1621393614326-2f9ed389ce02?auto=format&fit=crop&w=1920&q=80",
    desc: "Jaffna Fort · Nallur Temple · Casuarina Beach · Delft Island · Point Pedro",
    inc: "Vehicle, driver, fuel, route planning",
    exc: "Accommodation, meals, ferry charges, entrance tickets",
    overview: "Jaffna stands apart from the rest of Sri Lanka — a world of ancient Tamil culture, weathered Dutch fortifications, and windswept limestone islands connected by causeways over turquoise shallows. Cross to Delft Island to see wild ponies roaming among colonial ruins, pray at the magnificent Nallur Kandaswamy Temple during its evening ceremonies, and stand at Point Pedro — the northernmost tip of the island.",
    itinerary: []
  },
  {
    id: "anuradhapura",
    title: "Anuradhapura Heritage Tour",
    tagline: "A civilisation that shaped the ancient world.",
    days: "2D / 1N",
    price: "LKR 48,000",
    img: "https://images.unsplash.com/photo-1663403764000-f927ff20fcbb?auto=format&fit=crop&w=1920&q=80",
    desc: "Sri Maha Bodhi · Ruwanwelisaya · Thuparamaya · Mihintale · Isurumuniya",
    inc: "Private vehicle, driver, fuel",
    exc: "Accommodation, meals, entrance fees",
    overview: "Anuradhapura was one of the ancient world's greatest cities — a hydraulic civilisation that flourished for over a millennium and whose ruins still speak of astonishing ambition. Stand before the sacred Sri Maha Bodhi, one of the oldest documented trees on Earth and a living link to the Buddha himself, and circle the great white dagobas that still rise above the ancient plain.",
    itinerary: []
  },
  {
    id: "southern",
    title: "Southern Beach Escape",
    tagline: "Sun, surf, and the slow pace of the south.",
    days: "4D / 3N",
    price: "LKR 95,000",
    img: "https://images.unsplash.com/photo-1776336885293-fba436d4281a?auto=format&fit=crop&w=1920&q=80",
    desc: "Galle · Mirissa · Weligama · Unawatuna · Bentota",
    inc: "Vehicle, driver, route planning",
    exc: "Hotel, meals, activity fees",
    overview: "The southern coast of Sri Lanka is a sun-drenched ribbon of palm-fringed bays, surf breaks, and colonial port towns. This four-day escape takes you from the heritage streets of Galle to the whale-watching grounds off Mirissa, through Weligama's beginner-friendly surf break, and on to the river-mouth resort town of Bentota with its water sports and riverside lodges.",
    itinerary: []
  },
];

export function getPackage(id: string): TourPackage | undefined {
  return packages.find(p => p.id === id);
}
