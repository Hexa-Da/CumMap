import type { PlanningFile } from '../types';
import {
  LEGACY_PARTY_NUM_TO_SLUG,
  LEGACY_REST_NUM_TO_SLUG,
  LEGACY_PARC_EXPO_HALL_SLUG,
  normalizePartyEventType,
  normalizeRestaurantEventType
} from '../config/planningVenueSlugs';

export interface PlanningVenueRow {
  id: string;
  name: string;
  sport?: string;
  description?: string;
}

export interface FilterPlanningFilesArgs {
  files: PlanningFile[];
  eventType: string;
  specificEvent: string;
  parties: PlanningVenueRow[];
  restaurants: PlanningVenueRow[];
  hotels: PlanningVenueRow[];
}

const SPORTS_TYPES = [
  'Football',
  'Basketball',
  'Handball',
  'Rugby',
  'Ultimate',
  'Natation',
  'Badminton',
  'Tennis',
  'Cross',
  'Volleyball',
  'Ping-pong',
  'Echecs',
  'Athlétisme',
  'Spikeball',
  'Pétanque',
  'Escalade'
];

function matchesPartySpecific(etRaw: string, specificEvent: string): boolean {
  const et = (etRaw || '').trim();
  const n = normalizePartyEventType(et);
  if (n === specificEvent || et === specificEvent) return true;
  if (LEGACY_PARTY_NUM_TO_SLUG[et] === specificEvent) return true;
  const low = et.toLowerCase();
  if (specificEvent === 'defile') {
    return (
      n === 'defile' ||
      et === 'place-stanislas' ||
      low.includes('défilé') ||
      low.includes('defile') ||
      low.includes('stanislas')
    );
  }
  if (specificEvent === 'parc-expo-pompom') {
    return low.includes('pompom');
  }
  if (specificEvent === 'parc-expo-showcase') {
    return low.includes('showcase');
  }
  if (specificEvent === 'zenith') {
    return low.includes('dj contest') || low.includes('zenith');
  }
  return false;
}

function matchesRestaurantSpecific(etRaw: string, specificEvent: string): boolean {
  const et = (etRaw || '').trim();
  const n = normalizeRestaurantEventType(et);
  if (n === specificEvent || et === specificEvent) return true;
  if (LEGACY_REST_NUM_TO_SLUG[et] === specificEvent) return true;
  const low = et.toLowerCase();

  if (specificEvent === 'gentilly') {
    return (
      n === 'gentilly' ||
      et === 'salle-fetes-gentilly' ||
      low.includes('gentilly') ||
      low.includes('salle des fêtes')
    );
  }
  if (specificEvent === 'parc-saint-marie') {
    return (
      low.includes('parc saint-marie') ||
      low.includes('saint-marie') ||
      low.includes('boffrand') ||
      low.includes('brunch')
    );
  }
  if (specificEvent === 'parc-expo-jeudi') {
    return (
      et === 'parc-expo-jeudi' ||
      et === LEGACY_PARC_EXPO_HALL_SLUG ||
      et === '2' ||
      (low.includes('jeudi') && (low.includes('parc expo') || low.includes('hall'))) ||
      (low.includes('parc expo') && low.includes('hall a1') && !low.includes('vendredi'))
    );
  }
  if (specificEvent === 'parc-expo-vendredi') {
    return (
      et === 'parc-expo-vendredi' ||
      et === LEGACY_PARC_EXPO_HALL_SLUG ||
      et === '2' ||
      (low.includes('vendredi') && (low.includes('parc expo') || low.includes('hall')))
    );
  }
  return false;
}

export function filterPlanningFiles(args: FilterPlanningFilesArgs): PlanningFile[] {
  const { files, eventType, specificEvent, parties, restaurants, hotels } = args;
  let filtered = files;

  if (eventType === 'sports') {
    filtered = filtered.filter((file) => {
      if (file.fileCategory) return file.fileCategory === 'sports';
      return SPORTS_TYPES.includes(file.eventType || '');
    });
    if (specificEvent !== 'all') {
      filtered = filtered.filter((file) => file.eventType === specificEvent);
    }
    return filtered;
  }

  if (eventType === 'party') {
    const partyIds = parties.map((p) => p.id);
    filtered = filtered.filter((file) => {
      if (file.fileCategory) return file.fileCategory === 'party';
      const raw = file.eventType || '';
      const n = normalizePartyEventType(raw);
      return (
        partyIds.includes(n) ||
        partyIds.includes(raw) ||
        Object.keys(LEGACY_PARTY_NUM_TO_SLUG).includes(raw) ||
        raw === 'place-stanislas' ||
        raw.toLowerCase().includes('soirée') ||
        raw.toLowerCase().includes('soiree') ||
        raw.toLowerCase().includes('gala') ||
        raw.toLowerCase().includes('défilé') ||
        raw.toLowerCase().includes('defile') ||
        raw.toLowerCase().includes('party') ||
        raw.toLowerCase().includes('pompom') ||
        raw.toLowerCase().includes('navette')
      );
    });
    if (specificEvent !== 'all') {
      filtered = filtered.filter((file) => matchesPartySpecific(file.eventType || '', specificEvent));
    }
    return filtered;
  }

  if (eventType === 'restaurants') {
    const restaurantIds = restaurants.map((r) => r.id);
    filtered = filtered.filter((file) => {
      if (file.fileCategory) return file.fileCategory === 'restaurants';
      const raw = file.eventType || '';
      const n = normalizeRestaurantEventType(raw);
      return (
        restaurantIds.includes(n) ||
        restaurantIds.includes(raw) ||
        Object.keys(LEGACY_REST_NUM_TO_SLUG).includes(raw) ||
        raw === LEGACY_PARC_EXPO_HALL_SLUG ||
        raw === 'salle-fetes-gentilly' ||
        raw.toLowerCase().includes('restaurant') ||
        raw === 'Restaurant' ||
        raw === 'restaurant'
      );
    });
    if (specificEvent !== 'all') {
      filtered = filtered.filter((file) => matchesRestaurantSpecific(file.eventType || '', specificEvent));
    }
    return filtered;
  }

  if (eventType === 'hotel') {
    const hotelIds = hotels.map((h) => h.id);
    filtered = filtered.filter((file) => {
      if (file.fileCategory) return file.fileCategory === 'hotel';
      const raw = file.eventType || '';
      return (
        hotelIds.includes(raw) ||
        raw.toLowerCase().includes('hôtel') ||
        raw.toLowerCase().includes('hotel') ||
        raw === 'Hotel' ||
        raw === 'hotel'
      );
    });
    if (specificEvent !== 'all') {
      filtered = filtered.filter((file) => {
        const eventTypeVal = file.eventType || '';
        if (hotelIds.includes(specificEvent)) {
          return eventTypeVal === specificEvent;
        }
        const selectedHotel = hotels.find((h) => h.id === specificEvent);
        if (selectedHotel) {
          return (
            eventTypeVal === specificEvent ||
            eventTypeVal.toLowerCase().includes(selectedHotel.name.toLowerCase())
          );
        }
        return false;
      });
    }
    return filtered;
  }

  if (eventType === 'hse') {
    return filtered.filter((file) => {
      if (file.fileCategory) return file.fileCategory === 'hse';
      return file.eventType === 'HSE' || file.eventType?.toLowerCase().includes('hse') === true;
    });
  }

  return filtered;
}
