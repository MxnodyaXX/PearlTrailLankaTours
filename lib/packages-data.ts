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
  {
    id: "sacred-circuit",
    title: "Sacred Temples Grand Circuit",
    tagline: "Ten days across the divine heartlands of Sri Lanka.",
    days: "10D / 9N",
    price: "LKR 195,000",
    img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1920&q=80",
    desc: "Munneswaram Temple · Anuradhapura Kingdom · Thirukoneswaram · Dambulla Cave Temple · Temple of the Tooth · Pinnawala Elephants · Ramboda Hanuman Shrine · Hakgala Gardens · Kataragama · Kelaniya Temple",
    inc: "Private vehicle, driver, fuel, multilingual guide, 24/7 on-trip support",
    exc: "Accommodation, meals, entrance tickets, personal expenses",
    overview: "A rare journey that traces the sacred geography of Sri Lanka from the western coast to the southern shores. Over ten days you will visit ancient Hindu temples, Buddhist kingdoms, colonial-era botanical wonders, elephant sanctuaries, and wild coastlines — connecting with the island's layered spiritual heritage at a pace that allows genuine discovery. This is not a rushed checklist; it is a journey with depth.",
    itinerary: [
      {
        day: 1,
        title: "Arrival & Coastal Welcome",
        subtitle: "Negombo",
        description: "Your journey begins in Negombo, a sun-drenched fishing town north of the international airport where the Indian Ocean meets a network of Dutch-era canals. After your arrival transfer, take the evening to explore the lively fish market, stroll the beach promenade, and settle into the coastal rhythm that will set the mood for everything that follows.",
        highlights: ["Airport pickup & private transfer", "Negombo beach promenade", "Dutch canal waterfront walk", "Sunset over the Indian Ocean", "Welcome briefing with your guide"],
        img: "https://images.unsplash.com/photo-1559827291-72673e0be0a7?auto=format&fit=crop&w=1920&q=80",
        gallery: [
          { img: "/photos/dutch-canal.jpg",    caption: "Dutch canal waterfront walk" },
          { img: "/photos/negombo-sunset.jpg", caption: "Sunset over the Indian Ocean" },
        ],
        stay: "Negombo"
      },
      {
        day: 2,
        title: "The Western Shrines",
        subtitle: "Chilaw → Munneswaram → Anuradhapura",
        description: "Drive north along the coastal highway to Chilaw, where one of Sri Lanka's most revered Hindu temple complexes stands on the edge of town. At Munneswaram, a shrine dedicated to Lord Shiva that has drawn pilgrims for over a thousand years, the air is thick with incense and the sound of bells. Visit the quieter Manavari shrine nearby before heading inland to Anuradhapura, arriving in time to watch the ancient dagobas glow gold in the late afternoon sun.",
        highlights: ["Munneswaram Temple complex", "Manavari Shiva shrine", "Scenic coastal highway drive", "Arrival at Anuradhapura", "Dagoba sunset views"],
        img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1920&q=80",
        gallery: [
          { img: "https://i0.wp.com/amazinglanka.com/wp/wp-content/uploads/2025/02/munneswaram-03.jpg?ssl=1", caption: "Munneswaram Temple complex" },
          { img: "https://images.unsplash.com/photo-1663403764000-f927ff20fcbb?auto=format&fit=crop&w=900&q=80", caption: "Dagoba sunset views" },
          { img: "https://images.unsplash.com/photo-1621393614326-2f9ed389ce02?auto=format&fit=crop&w=900&q=80", caption: "Arrival at Anuradhapura" },
        ],
        stay: "Anuradhapura"
      },
      {
        day: 3,
        title: "The Sacred Kingdom",
        subtitle: "Anuradhapura → Trincomalee",
        description: "Anuradhapura was the first great capital of Sri Lanka — a city that thrived for over a thousand years and whose ruins still speak of extraordinary ambition. Begin at the Sri Maha Bodhi, one of the oldest documented trees on Earth. Walk the sacred precinct of Ruwanwelisaya, a great white dome rising against the blue sky, and explore Isurumuniya, where ancient rock carvings emerge from granite boulders beside a lily pond. By afternoon, head east toward the shores of Trincomalee.",
        highlights: ["Sri Maha Bodhi — sacred fig tree", "Ruwanwelisaya stupa", "Thuparamaya — first dagoba of Lanka", "Isurumuniya rock temple & carvings", "Drive east to Trincomalee"],
        img: "https://images.unsplash.com/photo-1663403764000-f927ff20fcbb?auto=format&fit=crop&w=1920&q=80",
        gallery: [
          { img: "https://images.unsplash.com/photo-1621393614326-2f9ed389ce02?auto=format&fit=crop&w=900&q=80", caption: "Sri Maha Bodhi — sacred precinct" },
        ],
        stay: "Trincomalee"
      },
      {
        day: 4,
        title: "The Sea Temple",
        subtitle: "Thirukoneswaram · Trincomalee",
        description: "Perched on a rocky promontory where the ocean breaks on three sides, the Koneswaram temple at Trincomalee is one of the most dramatically situated shrines on the island. Explore the temple complex and its clifftop views before spending the afternoon at Marble Beach — one of the finest and least-known beaches in Sri Lanka, with water so clear it seems impossible. The evening offers a vivid harbour sunset over one of the world's finest natural deep-water ports.",
        highlights: ["Thirukoneswaram Hindu temple", "Swami Rock clifftop views", "Marble Beach afternoon swim", "Trincomalee natural harbour", "Harbour sunset from the fort"],
        img: "https://images.unsplash.com/photo-1614109067456-e471b6e3f41e?auto=format&fit=crop&w=1920&q=80",
        stay: "Trincomalee"
      },
      {
        day: 5,
        title: "Cave Temples & Kandy",
        subtitle: "Dambulla → Kandy",
        description: "The cave temple complex at Dambulla is a world unto itself — five caverns carved into a single golden rock, their ceilings and walls covered in more than 2,100 square metres of ancient murals. Over 150 Buddha statues sit in serene rows within. After this extraordinary morning, wind upward into the hills toward Kandy, Sri Lanka's last royal capital, arriving in time to visit the sacred Temple of the Tooth Relic as evening prayers begin and the ceremonial drums fill the air.",
        highlights: ["Dambulla Cave Temple complex", "Ancient Buddhist murals spanning 2,100 sq m", "153 seated Buddha statues", "Hill country ascent by road", "Temple of the Tooth evening puja"],
        img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1920&q=80",
        gallery: [
          { img: "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?auto=format&fit=crop&w=900&q=80", caption: "Temple of the Tooth evening puja" },
          { img: "https://images.unsplash.com/photo-1552055642-554ec085233a?auto=format&fit=crop&w=900&q=80", caption: "Hill country ascent by road" },
        ],
        stay: "Kandy"
      },
      {
        day: 6,
        title: "Royal Gardens & Giants",
        subtitle: "Peradeniya → Pinnawala → Kandy",
        description: "Morning belongs to the Royal Botanical Gardens at Peradeniya — 147 acres of extraordinary plant collections including an avenue of royal palms, a century-old Java fig tree whose canopy covers nearly an entire acre, and orchid houses of remarkable diversity. Then on to Pinnawala, where the island's famous elephant sanctuary gives you the chance to watch a herd of rescued elephants bathe and play in the Maha Oya river — one of Sri Lanka's most unforgettable sights.",
        highlights: ["Royal Botanical Gardens Peradeniya", "Avenue of royal palms", "Giant Java fig tree", "Pinnawala Elephant Orphanage", "River bathing with the elephant herd"],
        img: "https://images.unsplash.com/photo-1547199336-d4f3d27df35f?auto=format&fit=crop&w=1920&q=80",
        gallery: [
          { img: "https://images.unsplash.com/photo-1533484482814-3fe2d922be89?auto=format&fit=crop&w=900&q=80", caption: "Pinnawala Elephant Orphanage" },
          { img: "https://images.unsplash.com/photo-1566650576880-6740b03eaad1?auto=format&fit=crop&w=900&q=80", caption: "River bathing with the elephant herd" },
        ],
        stay: "Kandy"
      },
      {
        day: 7,
        title: "Through the Mist",
        subtitle: "Ramboda → Nuwara Eliya",
        description: "The road from Kandy to Nuwara Eliya climbs through some of Sri Lanka's most dramatic scenery — hairpin bends cut through mist, cascading waterfalls emerge from forest, and tea estates turn every hillside into a patchwork of vivid green. Stop at Ramboda to visit the hilltop Hanuman shrine, where an 18-foot statue of Hanuman overlooks the valley far below, and pause at the viewpoints above Ramboda Falls. Nuwara Eliya — 'Little England' at nearly 2,000 metres — awaits with cool mountain air and colonial charm.",
        highlights: ["Hill country mountain road", "Ramboda Hanuman Temple & 18-ft statue", "Ramboda Falls viewpoint", "Tea estate walk & tasting", "Arrival in Nuwara Eliya"],
        img: "https://images.unsplash.com/photo-1544015759-237f87d55ef3?auto=format&fit=crop&w=1920&q=80",
        gallery: [
          { img: "https://images.unsplash.com/photo-1585171328560-947fbd92d6f0?auto=format&fit=crop&w=900&q=80", caption: "Tea estate walk & tasting" },
          { img: "https://images.unsplash.com/photo-1552055642-554ec085233a?auto=format&fit=crop&w=900&q=80", caption: "Hill country mountain road" },
        ],
        stay: "Nuwara Eliya"
      },
      {
        day: 8,
        title: "Gardens, Shrines & the Sacred South",
        subtitle: "Hakgala → Divurumpola → Kataragama",
        description: "Begin the morning at Hakgala Botanical Garden — a highland garden set at 1,700 metres among rocky outcrops, its formal beds giving way to natural cloud forest. Just below lies a temple built on a site of deep mythological significance associated with the Ramayana epic and the story of Sita. Pause also at Divurumpola, a sacred temple in a river meadow where legend says an ancient trial by fire took place, before the long but beautiful drive south to Kataragama — the holiest pilgrimage town in Sri Lanka, sacred to Buddhists, Hindus, and Muslims alike.",
        highlights: ["Hakgala Botanical Garden", "Sita Amman Temple", "Divurumpola sacred temple", "Mountain-to-coast scenic drive", "Kataragama sacred precinct at dusk"],
        img: "https://images.unsplash.com/photo-1590862891-d5545e1d6e4a?auto=format&fit=crop&w=1920&q=80",
        gallery: [
          { img: "https://images.unsplash.com/photo-1552055642-554ec085233a?auto=format&fit=crop&w=900&q=80", caption: "Mountain-to-coast scenic drive" },
        ],
        stay: "Kataragama"
      },
      {
        day: 9,
        title: "Southern Legends",
        subtitle: "Ussangoda → Rumassala → Galle",
        description: "The south coast holds its own mythological landscape. Ussangoda is a strange, wind-scoured coastal plateau — an otherworldly red-earth headland where the ground is iron-rich and almost nothing grows, lending it an eerie, sacred stillness. Continue to Rumassala, a forested headland near Galle believed to be a fragment of a legendary Himalayan mountain, before reaching Galle itself: a walled Dutch colonial fort town that stands in almost perfect preservation and glows amber in the late afternoon light.",
        highlights: ["Ussangoda red coastal plateau", "Rumassala sacred headland", "Galle Dutch Fort UNESCO site", "Fort rampart & lighthouse walk", "Galle sunset stroll through old town"],
        img: "https://images.unsplash.com/photo-1547818832-470a7998a99a?auto=format&fit=crop&w=1920&q=80",
        gallery: [
          { img: "https://images.unsplash.com/photo-1547818832-470a7998a99a?auto=format&fit=crop&w=900&q=80", caption: "Galle Dutch Fort — UNESCO site" },
        ],
        stay: "Galle"
      },
      {
        day: 10,
        title: "River, Reef & Farewell",
        subtitle: "Madu River → Kosgoda → Kelaniya → Colombo",
        description: "The final day brings a gentle, unhurried journey north along the west coast. A morning boat ride through the Madu River mangroves reveals a world of water birds, cinnamon islands, and floating fish traps that have operated for generations. Stop at the Kosgoda Turtle Hatchery, where five species of sea turtle are protected and released into the ocean. In Colombo, the Kelaniya temple — one of the most revered Buddhist shrines in Sri Lanka — offers a meditative final encounter with the island's spiritual heart before your airport transfer.",
        highlights: ["Madu River mangrove boat ride", "Cinnamon island & bird spotting", "Kosgoda Sea Turtle Hatchery", "Kelaniya Raja Maha Vihara", "Colombo farewell & airport transfer"],
        img: "https://images.unsplash.com/photo-1736142260757-6effc558100a?auto=format&fit=crop&w=1920&q=80",
        stay: "Colombo / Departure"
      }
    ]
  }
];

export function getPackage(id: string): TourPackage | undefined {
  return packages.find(p => p.id === id);
}
