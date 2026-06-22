// Vehicle (fleet) types + the code-managed fallback list. The site reads from
// the DB when Supabase is configured (see lib/vehicles-store.ts), otherwise it
// falls back to this array so the Vehicles page never breaks.

export type BadgeTone = "gold" | "emerald" | "blue" | "purple" | "teal";

export interface VehicleBadge {
  label: string;
  tone: BadgeTone;
}

export interface Vehicle {
  id: string;
  name: string;
  category: string;
  models: string;
  seats: number;
  fuel: string;
  transmission: string;
  rating: number;
  price: number; // LKR per day
  emoji: string;
  image?: string;
  badge?: VehicleBadge;
  active?: boolean;
  sort?: number;
}

export const BADGE_TONES: Record<BadgeTone, { bg: string; fg: string }> = {
  gold: { bg: "#f6b93b", fg: "#0f172a" },
  emerald: { bg: "#10b981", fg: "#042018" },
  blue: { bg: "#3b82f6", fg: "#0a1730" },
  purple: { bg: "#8b5cf6", fg: "#170f30" },
  teal: { bg: "#0d9488", fg: "#022422" },
};

/** Format the LKR/day price for display. */
export const fmtPrice = (n: number) => `LKR ${Math.round(n).toLocaleString("en-US")}`;

export const vehicles: Vehicle[] = [
  { id: "economy", name: "Economy Car", category: "Economy", models: "Toyota Vitz · Suzuki Alto · Honda Fit", seats: 4, fuel: "Petrol", transmission: "Auto", rating: 4.7, price: 9000, emoji: "🚗", image: "/fleet/economy.jpg", badge: { label: "Best Value", tone: "emerald" }, sort: 1 },
  { id: "sedan", name: "Comfort Sedan", category: "Sedan", models: "Toyota Axio · Premio · Honda Grace", seats: 4, fuel: "Petrol", transmission: "Auto", rating: 4.8, price: 14000, emoji: "🚘", image: "/fleet/sedan.jpg", badge: { label: "Popular", tone: "gold" }, sort: 2 },
  { id: "van", name: "Toyota KDH Van", category: "Van", models: "Toyota KDH · Nissan Caravan", seats: 10, fuel: "Diesel", transmission: "Manual", rating: 4.9, price: 22000, emoji: "🚐", image: "/fleet/van.jpg", badge: { label: "Group Favourite", tone: "blue" }, sort: 3 },
  { id: "minicab", name: "Mini Cab", category: "Mini", models: "Suzuki Every · Daihatsu Hijet", seats: 6, fuel: "Petrol", transmission: "Manual", rating: 4.6, price: 12000, emoji: "🚙", sort: 4 },
  { id: "suv", name: "Premium SUV", category: "SUV", models: "Toyota Prado · Mitsubishi Montero", seats: 6, fuel: "Diesel", transmission: "Auto", rating: 4.9, price: 28000, emoji: "🛻", image: "/fleet/suv.jpg", badge: { label: "Hill Country", tone: "gold" }, sort: 5 },
  { id: "luxury", name: "Luxury Class", category: "Luxury", models: "BMW · Mercedes-Benz · Audi", seats: 4, fuel: "Petrol", transmission: "Auto", rating: 5.0, price: 45000, emoji: "⭐", image: "/fleet/luxury.jpg", badge: { label: "Premium", tone: "purple" }, sort: 6 },
  { id: "tuktuk", name: "Tuk-Tuk", category: "Tuk-Tuk", models: "Electric & Petrol Three-Wheelers", seats: 3, fuel: "Petrol", transmission: "Manual", rating: 4.7, price: 3500, emoji: "🛺", image: "/fleet/tuktuk.jpg", badge: { label: "Iconic", tone: "teal" }, sort: 7 },
  { id: "coach", name: "Coach / Bus", category: "Coach", models: "AC Coaches · Mini Buses", seats: 33, fuel: "Diesel", transmission: "Manual", rating: 4.8, price: 55000, emoji: "🚌", image: "/fleet/coach.jpg", sort: 8 },
];
