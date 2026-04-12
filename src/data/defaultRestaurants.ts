import type { RestaurantVenue } from '../types';

/**
 * Ordre : jeudi → vendredi → gentilly → parc-saint-marie.
 * Jeudi / vendredi : même zone Parc Expo (légère offset pour deux marqueurs).
 */
const PARC_EXPO_BASE = { lat: 48.663272, lng: 6.190683 };

export const DEFAULT_RESTAURANTS: RestaurantVenue[] = [
  {
    id: 'parc-expo-jeudi',
    name: 'Parc Expo — Repas jeudi',
    position: [PARC_EXPO_BASE.lat, PARC_EXPO_BASE.lng],
    description: 'Repas du jeudi soir',
    address: 'Rue Catherine Opalinska, 54500 Vandœuvre-lès-Nancy',
    type: 'restaurant',
    date: '',
    latitude: PARC_EXPO_BASE.lat,
    longitude: PARC_EXPO_BASE.lng,
    emoji: '🍽️',
    sport: 'Restaurant',
    mealType: 'soir',
    matches: []
  },
  {
    id: 'parc-expo-vendredi',
    name: 'Parc Expo — Repas vendredi',
    position: [PARC_EXPO_BASE.lat + 0.00012, PARC_EXPO_BASE.lng + 0.00006],
    description: 'Repas du vendredi soir',
    address: 'Rue Catherine Opalinska, 54500 Vandœuvre-lès-Nancy',
    type: 'restaurant',
    date: '',
    latitude: PARC_EXPO_BASE.lat + 0.00012,
    longitude: PARC_EXPO_BASE.lng + 0.00006,
    emoji: '🍽️',
    sport: 'Restaurant',
    mealType: 'soir',
    matches: []
  },
  {
    id: 'gentilly',
    name: 'Salle des Fêtes de Gentilly',
    position: [48.69843, 6.139541],
    description: 'Repas du vendredi soir',
    address: '5001F Av. du Rhin, 54100 Nancy',
    type: 'restaurant',
    date: '',
    latitude: 48.69843,
    longitude: 6.139541,
    emoji: '🍽️',
    sport: 'Restaurant',
    mealType: 'soir',
    matches: []
  },
  {
    id: 'parc-saint-marie',
    name: 'Parc Saint-Marie',
    position: [48.680392, 6.170733],
    description: 'Brunch du Dimanche matin',
    address: '1 Av. Boffrand, 54000 Nancy',
    type: 'restaurant',
    date: '',
    latitude: 48.680392,
    longitude: 6.170733,
    emoji: '🍽️',
    sport: 'Restaurant',
    mealType: 'midi',
    matches: []
  }
];
