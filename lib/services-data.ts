// Services (travel-assistance) types + code fallback. Reads from the DB when
// configured (lib/services-store.ts), else falls back to this list.

export interface Service {
  id: string;
  icon: string;
  title: string;
  desc: string;
  href: string;
  active?: boolean;
  sort?: number;
}

export const services: Service[] = [
  { id: "airport", icon: "✈️", title: "Airport Pickup & Drop", desc: "Reliable 24/7 airport transfer from Bandaranaike International Airport to any destination. We track your flight — we'll be there when you land.", href: "/contact", sort: 1 },
  { id: "hotel", icon: "🏨", title: "Hotel Reservations", desc: "From budget guesthouses to 5-star resorts and boutique villas — we find and book the right accommodation for your style and budget.", href: "/contact", sort: 2 },
  { id: "visa", icon: "🛂", title: "Visa Assistance", desc: "Guidance on Sri Lanka's tourist ETA process, help with document preparation, and support for a smooth entry into the island.", href: "/contact", sort: 3 },
  { id: "itinerary", icon: "🗺️", title: "Custom Itinerary Planning", desc: "Tell us your travel dates, budget, and preferences — we'll design a personalized itinerary covering exactly what you want to experience.", href: "/contact", sort: 4 },
  { id: "chauffeur", icon: "🚗", title: "Chauffeur Services", desc: "Professional, English-speaking drivers for business travel, corporate events, VIP transfers, and family tour journeys.", href: "/rent-a-car", sort: 5 },
  { id: "international", icon: "🌏", title: "International Tours", desc: "Selected international packages for customers wishing to travel beyond Sri Lanka — Asia, Middle East, and beyond.", href: "/contact", sort: 6 },
];
