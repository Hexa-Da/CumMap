/** Options du filtre « lieu » quand la carte / agenda est sur les soirées (ordre aligné sur les défauts). */
export const PARTY_VENUE_FILTER_OPTIONS = [
  { value: 'Tous', label: 'Tous les lieux' },
  { value: 'parc-expo-pompom', label: 'Parc Expo (Pompoms)' },
  { value: 'parc-expo-showcase', label: 'Parc Expo (Showcase)' },
  { value: 'defile', label: 'Place Stanislas (Défilé)' },
  { value: 'zenith', label: 'Zénith' }
] as const;
