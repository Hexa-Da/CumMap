/** Anciens fichiers avec eventType numérique (soirées). Le « 1 » pointe désormais vers `defile`. */
export const LEGACY_PARTY_NUM_TO_SLUG: Record<string, string> = {
  '1': 'defile',
  '2': 'parc-expo-pompom',
  '3': 'parc-expo-showcase',
  '4': 'zenith'
};

/** Anciens ids texte → id canonique */
export const PARTY_EVENTTYPE_ALIASES: Record<string, string> = {
  'place-stanislas': 'defile'
};

export function normalizePartyEventType(et: string): string {
  const t = (et || '').trim();
  return PARTY_EVENTTYPE_ALIASES[t] ?? t;
}

/** Anciens fichiers resto numériques */
export const LEGACY_REST_NUM_TO_SLUG: Record<string, string> = {
  '1': 'gentilly',
  '2': 'parc-expo-jeudi',
  '3': 'parc-saint-marie'
};

export const REST_EVENTTYPE_ALIASES: Record<string, string> = {
  'salle-fetes-gentilly': 'gentilly'
};

/** Ancien slug unique « Hall A1 » : conservé pour matcher jeudi + vendredi + recherche */
export const LEGACY_PARC_EXPO_HALL_SLUG = 'parc-expo-hall-a1';

export function normalizeRestaurantEventType(et: string): string {
  const t = (et || '').trim();
  if (t === LEGACY_PARC_EXPO_HALL_SLUG) return t;
  return REST_EVENTTYPE_ALIASES[t] ?? t;
}

/**
 * Query / hash : ancien slug défilé → sous-filtre canonique.
 * `parc-expo-hall-a1` → ouvre la catégorie Restaurants sans sous-lieu (filtre large).
 */
export const PLANNING_FILTER_QUERY_PARTY_ALIAS: Record<string, string> = {
  'place-stanislas': 'defile'
};

export const PLANNING_FILTER_BROAD_RESTAURANT_SLUGS = new Set<string>([LEGACY_PARC_EXPO_HALL_SLUG]);
