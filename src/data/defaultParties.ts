import type { PartyVenue } from '../types';

/**
 * Ordre affiché (filtres planning + listes) : pompom → showcase → défilé → zenith.
 * L’id canonique du défilé est `defile` (alias `place-stanislas` pour l’existant).
 */
export const DEFAULT_PARTIES: PartyVenue[] = [
  {
    id: 'parc-expo-pompom',
    name: 'Parc Expo — Soirée Pompoms',
    position: [48.66303, 6.191597],
    description: 'Soirée Pompoms du 16 avril',
    address: 'Rue Catherine Opalinska, 54500 Vandœuvre-lès-Nancy',
    type: 'party',
    date: '2026-04-16T20:00:00',
    latitude: 48.66303,
    longitude: 6.191597,
    emoji: '🎀',
    sport: 'Pompom',
    result: 'à venir'
  },
  {
    id: 'parc-expo-showcase',
    name: 'Parc Expo — Showcase',
    position: [48.663481, 6.189737],
    description: 'Soirée Showcase 17 avril',
    address: 'Rue Catherine Opalinska, 54500 Vandœuvre-lès-Nancy',
    type: 'party',
    date: '2026-04-17T20:00:00',
    latitude: 48.663481,
    longitude: 6.189737,
    emoji: '🎤',
    sport: 'Party',
    result: 'à venir'
  },
  {
    id: 'defile',
    name: 'Place Stanislas — Défilé',
    position: [48.693524, 6.18327],
    description: 'Grand défilé',
    address: 'Pl. Stanislas, 54000 Nancy',
    type: 'party',
    date: '2026-04-16T14:00:00',
    latitude: 48.693524,
    longitude: 6.18327,
    emoji: '🎺',
    sport: 'Defile'
  },
  {
    id: 'zenith',
    name: 'Zénith — DJ Contest',
    position: [48.710136, 6.139169],
    description: 'Soirée DJ Contest 18 avril',
    address: 'Rue du Zénith, 54320 Maxéville',
    type: 'party',
    date: '2026-04-18T20:30:00',
    latitude: 48.710136,
    longitude: 6.139169,
    emoji: '🎧',
    sport: 'Party'
  }
];
