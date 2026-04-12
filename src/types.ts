export interface Venue {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  position: [number, number];
  date: string;
  emoji: string;
  sport: string;
  type: 'venue';
  matches: Match[];
}

export interface Match {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  position: [number, number];
  date: string;
  emoji: string;
  sport: string;
  type: 'match';
  teams: string;
  time: string;
  endTime?: string;
  result?: string;
  venueId: string;
}

/** Catégorie choisie à l’upload ; évite l’ambiguïté des IDs numériques partagés (party/resto/hôtel). */
export type PlanningFileCategory =
  | 'sports'
  | 'party'
  | 'restaurants'
  | 'hotel'
  | 'hse';

/** Soirées / défilés (carte + fichiers planning) — ordre défini dans `data/defaultParties`. */
export interface PartyVenue {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  position: [number, number];
  date: string;
  emoji: string;
  sport: string;
  type: 'party';
  result?: string;
}

/** Restaurants (carte + fichiers planning) — ordre dans `data/defaultRestaurants`. */
export interface RestaurantVenue {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  position: [number, number];
  date: string;
  emoji: string;
  sport: string;
  type: 'restaurant';
  mealType: string;
  matches?: Match[];
}

/** Hôtels (carte + fichiers planning). */
export interface HotelVenue {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  position: [number, number];
  date: string;
  emoji: string;
  sport: string;
  type: 'hotel';
  telephone?: string;
  matches?: Match[];
}

export interface PlanningFile {
  id: string;
  name: string;
  type: 'pdf' | 'excel' | 'image';
  url: string;
  uploadDate: number;
  description?: string;
  uploadedBy: string;
  /** Sous-type (sport, id soirée/resto/hôtel, etc.) — peut collisionner entre catégories sans `fileCategory`. */
  eventType?: string;
  fileCategory?: PlanningFileCategory;
  originalSize?: number;
  compressedSize?: number;
  compressionRatio?: number;
} 