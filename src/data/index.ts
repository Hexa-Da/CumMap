import { DEFAULT_HOTELS } from './defaultHotels';
import { DEFAULT_RESTAURANTS } from './defaultRestaurants';
import { DEFAULT_PARTIES } from './defaultParties';

export { DEFAULT_PARTIES } from './defaultParties';
export { DEFAULT_RESTAURANTS } from './defaultRestaurants';
export { DEFAULT_HOTELS } from './defaultHotels';
export { PARTY_VENUE_FILTER_OPTIONS } from './partyVenueFilterOptions';

/** Lignes minimales pour les sélecteurs PlanningFiles (sans props App). */
export const DEFAULT_PLANNING_HOTEL_ROWS = DEFAULT_HOTELS.map((h) => ({ id: h.id, name: h.name }));
export const DEFAULT_PLANNING_RESTAURANT_ROWS = DEFAULT_RESTAURANTS.map((r) => ({
  id: r.id,
  name: r.name
}));
export const DEFAULT_PLANNING_PARTY_ROWS = DEFAULT_PARTIES.map((p) => ({
  id: p.id,
  name: p.name,
  sport: p.sport,
  description: p.description
}));
