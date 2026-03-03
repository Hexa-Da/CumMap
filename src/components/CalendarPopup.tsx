import React, { useState } from 'react';
import './CalendarPopup.css';
import { Venue } from '../types';

interface Event {
  type: 'match' | 'party';
  time: string;
  endTime?: string;
  name: string;
  teams?: string;
  description?: string;
  color: string;
  sport?: string;
  venue?: string;
  result?: string;
}

interface CalendarPopupProps {
  isOpen: boolean;
  onClose: () => void;
  venues: Venue[];
  eventFilter: string;
  onViewOnMap: (venue: Venue) => void;
  delegationFilter: string;
  venueFilter: string;
  showFemale: boolean;
  showMale: boolean;
  showMixed: boolean;
  isAdmin: boolean;
  onEventFilterChange: (value: string) => void;
  onDelegationFilterChange: (value: string) => void;
  onVenueFilterChange: (value: string) => void;
  onGenderFilterChange: (gender: 'female' | 'male' | 'mixed') => void;
}

const CalendarPopup: React.FC<CalendarPopupProps> = ({ 
  isOpen, 
  onClose, 
  venues, 
  eventFilter, 
  onViewOnMap,
  delegationFilter,
  venueFilter,
  showFemale,
  showMale,
  showMixed,
  isAdmin,
  onEventFilterChange,
  onDelegationFilterChange,
  onVenueFilterChange,
  onGenderFilterChange
}) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showFiltersCalendar, setShowFiltersCalendar] = useState(false);

  const sportOptions = [
    { value: 'none', label: 'Aucun' },
    { value: 'all', label: 'Tous les événements' },
    ...(isAdmin ? [{ value: 'party', label: 'Soirées et Défilé ⭐' }] : []),
    { value: 'Football', label: 'Football ⚽' },
    { value: 'Basketball', label: 'Basketball 🏀' },
    { value: 'Handball', label: 'Handball 🤾' },
    { value: 'Rugby', label: 'Rugby 🏉' },
    { value: 'Ultimate', label: 'Ultimate 🥏' },
    { value: 'Natation', label: 'Natation 🏊' },
    { value: 'Badminton', label: 'Badminton 🏸' },
    { value: 'Tennis', label: 'Tennis 🎾' },
    { value: 'Cross', label: 'Cross 👟' },
    { value: 'Volleyball', label: 'Volleyball 🏐' },
    { value: 'Ping-pong', label: 'Ping-pong 🏓' },
    { value: 'Echecs', label: 'Echecs ♟️' },
    { value: 'Athlétisme', label: 'Athlétisme 🏃‍♂️' },
    { value: 'Spikeball', label: 'Spikeball ⚡️' },
    { value: 'Pétanque', label: 'Pétanque 🍹' },
    { value: 'Escalade', label: 'Escalade 🧗‍♂️' }
  ];

  const days = [
    { date: '2026-04-16', label: 'Jeudi' },
    { date: '2026-04-17', label: 'Vendredi' },
    { date: '2026-04-18', label: 'Samedi' }
  ];

  const hours = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  const getVenueOptions = () => {
    if (eventFilter === 'none') {
      return [{ value: 'Tous', label: 'Tous les lieux' }];
    }

    // Pour les soirées et défilés, retourner les lieux fixes (uniquement si admin)
    if (eventFilter === 'party' && isAdmin) {
      return [
        { value: 'Tous', label: 'Tous les lieux' },
        { value: 'place-stanislas', label: 'Place Stanislas' },
        { value: 'parc-expo-pompom', label: 'Parc Expo (Pompoms)' },
        { value: 'parc-expo-showcase', label: 'Parc Expo (Showcase)' },
        { value: 'zenith', label: 'Zénith' }
      ];
    }

    // Pour les sports, filtrer les lieux par sport
    const filteredVenues = venues.filter(venue => venue.sport === eventFilter);
    const venueOptions = [
      { value: 'Tous', label: 'Tous les lieux' },
      ...filteredVenues.map(venue => ({
        value: venue.id,
        label: venue.name
      }))
    ];

    return venueOptions;
  };

  const isPhaseKeyword = (s: string) =>
    /poule|perdant|vainqueur|gagnant/i.test(s);

  const isShortCode = (s: string) =>
    /^[A-Za-z][0-9A-Za-z]$/.test(s.replace(/\s/g, ''));

  const isIgnoredEntry = (s: string) =>
    !s || s === '...' || s === '…' || isPhaseKeyword(s) || isShortCode(s);

  const normalizeDelegation = (raw: string): string => {
    const l = raw.toLowerCase().trim();
    if (l === 'nancy' || l === 'mines nancy') return 'mines nancy';
    if (l === 'sainté' || l === 'sainte' || l === 'mines sainté' || l === 'mines sainte') return 'mines sainté';
    return l;
  };

  const displayDelegation = (raw: string): string => {
    const n = normalizeDelegation(raw);
    if (n === 'mines nancy') return 'Mines Nancy';
    if (n === 'mines sainté') return 'Mines Sainté';
    return raw.trim();
  };

  const delegationMatchesFn = (teams: string, selectedDelegation: string): boolean => {
    if (selectedDelegation === 'all') return true;
    const rawEntries = teams.split(/vs|VS|contre|CONTRE|,/).map(t => t.trim());
    const normSelected = normalizeDelegation(selectedDelegation);
    for (const entry of rawEntries) {
      if (isIgnoredEntry(entry)) continue;
      const subs = /\sx\s/i.test(entry) ? entry.split(/\sx\s/i).map(s => s.trim()) : [entry];
      for (const sub of subs) {
        if (isIgnoredEntry(sub)) continue;
        if (normalizeDelegation(sub) === normSelected) return true;
      }
    }
    return false;
  };

  const getAllDelegations = () => {
    const delegations = new Set<string>();
    venues.forEach(venue => {
      if (venue.matches) {
        venue.matches.forEach(match => {
          const rawEntries = match.teams.split(/vs|VS|contre|CONTRE|,/).map(t => t.trim());
          rawEntries.forEach(entry => {
            if (isIgnoredEntry(entry)) return;
            const subs = /\sx\s/i.test(entry) ? entry.split(/\sx\s/i).map(s => s.trim()) : [entry];
            subs.forEach(sub => {
              if (!isIgnoredEntry(sub)) delegations.add(displayDelegation(sub));
            });
          });
        });
      }
    });
    return Array.from(delegations).sort();
  };

  const getEventsForDay = (date: string): Event[] => {
    const events: Event[] = [];
    
    if (eventFilter !== 'none') {
      // Pour les matchs sportifs
      if (eventFilter === 'all' || eventFilter !== 'party') {
        venues.forEach(venue => {
          if (venue.matches) {
            venue.matches.forEach(match => {
              const [matchDate, matchTime] = match.date.split('T');
              
              if (matchDate === date) {
                // Vérifier si le match correspond au filtre de sport
                const sportMatch = eventFilter === 'all' || venue.sport === eventFilter;
                // Vérifier si le match correspond au filtre de lieu
                const venueMatch = venueFilter === 'Tous' || venue.id === venueFilter;
                
                // Vérifier si le match correspond au filtre de genre
                const isFemale = match.description?.toLowerCase().includes('féminin');
                const isMale = match.description?.toLowerCase().includes('masculin');
                const isMixed = match.description?.toLowerCase().includes('mixte');
                
                const genderMatch = (!isFemale && !isMale && !isMixed) || 
                                  (isFemale && showFemale) || 
                                  (isMale && showMale) ||
                                  (isMixed && showMixed);

                // Filtre par délégation
                const delegationMatch = delegationFilter === 'all' || 
                  (match.teams ? delegationMatchesFn(match.teams, delegationFilter) : false);
                
                if (sportMatch && venueMatch && genderMatch && delegationMatch) {
                  const eventEndTime = match.endTime ? match.endTime.split('T')[1].split('.')[0] : undefined;
                  const isPassed = isEventPassed(match.date, eventEndTime, 'match');
                  
                  events.push({
                    type: 'match',
                    time: matchTime.split('.')[0],
                    endTime: eventEndTime,
                    name: match.description || match.name,
                    teams: match.teams,
                    sport: venue.sport,
                    venue: venue.name,
                    color: isPassed ? '#808080' : '#4CAF50',
                    result: match.result
                  });
                }
              }
            });
          }
        });
      }

      // Pour les soirées et défilés (uniquement si admin)
      if ((eventFilter === 'all' || eventFilter === 'party') && isAdmin) {
        const parties = [
          {
            id: 'place-stanislas',
            date: '2026-04-16',
            time: '13:00',
            endTime: '17:00',
            name: 'Place Stanislas',
            description: 'Défilé',
            color: '#673AB7',
            type: 'party',
            venue: 'Pl. Stanislas, 54000 Nancy'
          },
          {
            id: 'parc-expo-pompom',
            date: '2026-04-16',
            time: '21:00',
            endTime: '03:00',
            name: 'Parc Expo',
            description: 'Soirée Pompoms',
            color: '#673AB7',
            type: 'party',
            venue: 'Rue Catherine Opalinska, 54500 Vandœuvre-lès-Nancy'
          },
          {
            id: 'parc-expo-showcase',
            date: '2026-04-17',
            time: '20:00',
            endTime: '04:00',
            name: 'Parc Expo',
            description: 'Showcase',
            color: '#673AB7',
            type: 'party',
            venue: 'Rue Catherine Opalinska, 54500 Vandœuvre-lès-Nancy'
          },
          {
            id: 'zenith',
            date: '2026-04-18',
            time: '20:00',
            endTime: '04:00',
            name: 'Zénith',
            description: 'DJ Contest',
            color: '#673AB7',
            type: 'party',
            venue: 'Rue du Zénith, 54320 Maxéville'
          }
        ];

        parties.forEach(party => {
          if (party.date === date) {
            // Vérifier si le filtre de lieu correspond
            const venueMatch = venueFilter === 'Tous' || party.id === venueFilter;
            
            if (venueMatch) {
              events.push({
                type: 'party',
                time: party.time,
                endTime: party.endTime,
                name: party.name,
                description: party.description,
                venue: party.venue,
                color: party.color
              });
            }
          }
        });
      }
    }

    return events;
  };

  const getOverlappingEvents = (events: Event[]): Event[][] => {
    const groups: Event[][] = [];
    const sortedEvents = [...events].sort((a, b) => {
      const aStart = parseInt(a.time.split(':')[0]) * 60 + parseInt(a.time.split(':')[1]);
      const bStart = parseInt(b.time.split(':')[0]) * 60 + parseInt(b.time.split(':')[1]);
      return aStart - bStart;
    });

    sortedEvents.forEach(event => {
      const startTime = parseInt(event.time.split(':')[0]) * 60 + parseInt(event.time.split(':')[1]);
      const endTime = event.endTime 
        ? parseInt(event.endTime.split(':')[0]) * 60 + parseInt(event.endTime.split(':')[1])
        : startTime + 60;

      let placed = false;
      for (const group of groups) {
        const lastEvent = group[group.length - 1];
        const lastStartTime = parseInt(lastEvent.time.split(':')[0]) * 60 + parseInt(lastEvent.time.split(':')[1]);
        const lastEndTime = lastEvent.endTime 
          ? parseInt(lastEvent.endTime.split(':')[0]) * 60 + parseInt(lastEvent.endTime.split(':')[1])
          : lastStartTime + 60;

        if (startTime < lastEndTime && endTime > lastStartTime) {
          group.push(event);
          placed = true;
          break;
        }
      }

      if (!placed) {
        groups.push([event]);
      }
    });

    return groups;
  };

  const getEventPosition = (time: string, endTime: string | undefined, index: number, total: number) => {
    const HOUR_HEIGHT = 43.33; // pixels par heure
    const MIN_HOUR = 8;
    const MAX_HOUR = 23;
    
    let [startHour, startMinute] = time.split(':').map(Number);
    let endHour: number;
    let endMinute: number;
    
    // Parser l'heure de fin si elle existe
    if (endTime) {
      const [parsedEndHour, parsedEndMinute] = endTime.split(':').map(Number);
      if (!isNaN(parsedEndHour) && !isNaN(parsedEndMinute)) {
        endHour = parsedEndHour;
        endMinute = parsedEndMinute;
      } else {
        // Fallback: durée par défaut de 1h
        endHour = startHour + 1;
        endMinute = startMinute;
      }
    } else {
      // Pas d'heure de fin: durée par défaut de 1h
      endHour = startHour + 1;
      endMinute = startMinute;
    }

    // Limiter l'heure de début à la plage affichée (8h minimum)
    if (startHour < MIN_HOUR) {
      startHour = MIN_HOUR;
      startMinute = 0;
    }
    
    // Détecter si l'heure de fin est le lendemain (ex: 03:00 après 21:00)
    // ou si elle dépasse 23h - dans tous les cas, limiter à 23h
    if (endHour < startHour || endHour > MAX_HOUR || (endHour === MAX_HOUR && endMinute > 0)) {
      endHour = MAX_HOUR;
      endMinute = 0;
    }

    // Calculer les positions en heures depuis 8h
    const startPosition = (startHour - MIN_HOUR) + (startMinute / 60);
    const endPosition = (endHour - MIN_HOUR) + (endMinute / 60);
    const duration = Math.max(endPosition - startPosition, 0.5); // Minimum 30 min de hauteur pour visibilité

    const width = total === 1 ? '100%' : `${100 / total}%`;
    const left = total === 1 ? '0%' : `${(100 / total) * index}%`;

    return {
      top: `${startPosition * HOUR_HEIGHT}px`,
      height: `${duration * HOUR_HEIGHT}px`,
      width,
      left
    };
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const getCurrentDate = () => {
    // Simulation de la date du 25/04 à 16h
    return new Date();
  };

  const getCurrentTimePosition = () => {
    const HOUR_HEIGHT = 43.33; // pixels par heure
    const MIN_HOUR = 8;
    const MAX_HOUR = 23;
    
    const now = getCurrentDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Ne pas afficher l'indicateur si l'heure est en dehors de la plage 8h-23h
    if (hours < MIN_HOUR || hours >= MAX_HOUR) {
      return '';
    }
    
    const hoursFromStart = (hours - MIN_HOUR) + (minutes / 60);
    const position = `${hoursFromStart * HOUR_HEIGHT}px`;
    return position;
  };

  const getTodayDate = () => {
    const today = getCurrentDate();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Fonction pour vérifier si un événement est passé
  const isEventPassed = (date: string, endTime?: string, type: 'match' | 'party' = 'match') => {
    const now = new Date();
    const [eventDateStr, eventTimeStr] = date.split('T');
    const eventDate = new Date(eventDateStr);
    
    // Si l'événement est dans le futur, il n'est pas passé
    if (eventDate > now) {
      return false;
    }
    
    // Si l'événement est aujourd'hui, vérifier l'heure
    if (eventDate.toDateString() === now.toDateString()) {
      const [startHours, startMinutes] = eventTimeStr.split(':').map(Number);
      const start = new Date(eventDate);
      start.setHours(startHours, startMinutes, 0, 0);
      
      // Si l'événement n'a pas encore commencé, il n'est pas passé
      if (start > now) {
        return false;
      }
      
      // Si une heure de fin est spécifiée, l'utiliser
      if (endTime) {
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        const end = new Date(eventDate);
        end.setHours(endHours, endMinutes, 0, 0);
        return now > end;
      }
      
      // Sinon, utiliser les durées par défaut
      const defaultDuration = type === 'party' ? 6 : 2; // 6h pour les soirées, 2h pour les matchs
      const end = new Date(start.getTime() + (defaultDuration * 60 * 60 * 1000));
      return now > end;
    }
    
    // Si l'événement est dans le passé, il est passé
    return true;
  };

  // Fonction pour vérifier si un sport a des matchs féminins ou masculins
  const hasGenderMatches = (sport: string): { hasFemale: boolean, hasMale: boolean, hasMixed: boolean } => {
    let hasFemale = false;
    let hasMale = false;
    let hasMixed = false;

    venues.forEach(venue => {
      if (venue.sport === sport && venue.matches) {
        venue.matches.forEach(match => {
          if (match.description?.toLowerCase().includes('féminin')) hasFemale = true;
          if (match.description?.toLowerCase().includes('masculin')) hasMale = true;
          if (match.description?.toLowerCase().includes('mixte')) hasMixed = true;
        });
      }
    });

    return { hasFemale, hasMale, hasMixed };
  };

  if (!isOpen) return null;

  return (
    <div className="calendar-popup-overlay" onClick={onClose}>
      <div className="calendar-popup" onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Header fixe */}
        <div className="calendar-popup-header" style={{ 
          flexShrink: 0,
          backgroundColor: 'var(--bg-primary)', 
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.75rem'
        }}>
          <h3>Calendrier</h3>
          <button 
            className="close-button"
            onClick={onClose}
            title="Retour aux événements"
          >
            Retour
          </button>
        </div>
        
        {/* Zone de filtres - structure identique à App.tsx */}
        <div className="event-filters" style={{ 
          flexShrink: 0,
          padding: '0rem 0.5rem 0.5rem 0.5rem',
          backgroundColor: 'var(--bg-color)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div className="filter-buttons-row" style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="filter-toggle-button"
              onClick={() => setShowFiltersCalendar(v => !v)}
              style={{
                flex: 1,
                padding: '4px 12px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--warning-color)',
                color: 'white'
              }}
            >
              {showFiltersCalendar ? 'Masquer les filtres' : 'Filtrer'}
            </button>
            {showFiltersCalendar && (
              <button 
                className="filter-reset-button"
                onClick={() => {
                  // Vérifier si les filtres sont déjà réinitialisés
                  const isAlreadyReset = 
                    eventFilter === 'all' && 
                    delegationFilter === 'all' && 
                    venueFilter === 'Tous' && 
                    showFemale && 
                    showMale && 
                    showMixed;

                  // Ne réinitialiser que si nécessaire
                  if (!isAlreadyReset) {
                    // Réinitialiser tous les filtres en une seule fois
                    onEventFilterChange('all');
                    onDelegationFilterChange('all');
                    onVenueFilterChange('Tous');
                    // Forcer un délai pour s'assurer que tous les changements sont appliqués
                    setTimeout(() => {
                      onEventFilterChange('all');
                    }, 0);
                  }
                }}
                style={{
                  flex: 1,
                  padding: '4px 12px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white'
                }}
              >
                Réinitialiser
              </button>
            )}
          </div>
        
        {showFiltersCalendar && (
          <>
            {/* Filtres de sélection - structure identique à App.tsx */}
            <select 
              className="filter-select"
              value={eventFilter}
              onChange={(e) => {
                onEventFilterChange(e.target.value);
                // Réinitialiser le filtre de lieu quand le type d'événement change
                onVenueFilterChange('Tous');
              }}
              style={{
                flex: 1,
                minWidth: 0,
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23666\' d=\'M6 8.825L1.175 4 2.238 2.938 6 6.7l3.763-3.763L10.825 4z\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '12px'
              }}
            >
              {sportOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={delegationFilter}
              onChange={(e) => onDelegationFilterChange(e.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23666\' d=\'M6 8.825L1.175 4 2.238 2.938 6 6.7l3.763-3.763L10.825 4z\'/%3E%3C/svg%3E")',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
                backgroundSize: '12px'
              }}
            >
              <option value="all">Toutes les délégations</option>
              {getAllDelegations().map(delegation => (
                <option key={delegation} value={delegation}>
                  {delegation}
                </option>
              ))}
            </select>

            {/* Filtre des lieux sur la même ligne */}
            {eventFilter !== 'none' && eventFilter !== 'all' && (eventFilter !== 'party' || isAdmin) && (
              <select 
                className="filter-select"
                value={venueFilter}
                onChange={(e) => onVenueFilterChange(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-color)',
                  color: 'var(--text-color)',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%23666\' d=\'M6 8.825L1.175 4 2.238 2.938 6 6.7l3.763-3.763L10.825 4z\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  backgroundSize: '12px'
                }}
              >
                {getVenueOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {/* Ligne séparée pour les boutons de genre */}
            {eventFilter !== 'none' && eventFilter !== 'party' && (() => {
              const { hasFemale, hasMale, hasMixed } = hasGenderMatches(eventFilter);
              return (hasFemale || hasMale || hasMixed) && (
                <div className="gender-filter-row" style={{
                  display: 'flex',
                  gap: '0.5rem',
                  flex: 1.03
                }}>
                  {hasFemale && (
                    <button 
                      className={`gender-filter-button ${showFemale ? 'active' : ''}`}
                      onClick={() => onGenderFilterChange('female')}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        backgroundColor: showFemale ? 'var(--primary-color)' : 'var(--bg-color)',
                        color: showFemale ? 'white' : 'var(--text-color)',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Féminin
                    </button>
                  )}
                  {hasMale && (
                    <button 
                      className={`gender-filter-button ${showMale ? 'active' : ''}`}
                      onClick={() => onGenderFilterChange('male')}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        backgroundColor: showMale ? 'var(--primary-color)' : 'var(--bg-color)',
                        color: showMale ? 'white' : 'var(--text-color)',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Masculin
                    </button>
                  )}
                  {hasMixed && (
                    <button 
                      className={`gender-filter-button ${showMixed ? 'active' : ''}`}
                      onClick={() => onGenderFilterChange('mixed')}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '4px',
                        backgroundColor: showMixed ? 'var(--primary-color)' : 'var(--bg-color)',
                        color: showMixed ? 'white' : 'var(--text-color)',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Mixte
                    </button>
                  )}
                </div>
              );
            })()}
          </>
        )}
        </div>

        {/* Zone de contenu avec scroll */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          
          {/* Grille du calendrier avec scroll */}
          <div className="calendar-grid" style={{ flex: 1, minHeight: 0 }}>
          <div className="calendar-hours">
            <div className="calendar-hour-header"></div>
            <div className="calendar-hours-container">
              {hours.map((hour, index) => {
                const HOUR_HEIGHT = 43.33;
                const topPosition = index * HOUR_HEIGHT;
                return (
                  <div 
                    key={hour} 
                    className="calendar-hour"
                    style={{ top: `${topPosition}px` }}
                  >
                    {hour}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="calendar-days">
            {days.map(day => {
              const events = getEventsForDay(day.date);
              return (
                <div key={day.date} className="calendar-day-column">
                  <div className="calendar-day-header">{day.label}</div>
                  <div className="calendar-events">
                    {day.date === getTodayDate() && getCurrentTimePosition() !== '' && (
                      <div 
                        className="current-time-indicator"
                        style={{ top: getCurrentTimePosition() }}
                      />
                    )}
                    {getOverlappingEvents(events).map((group, groupIndex) => {
                      return (
                        <div key={groupIndex} className="event-group">
                          {group.map((event, index) => {
                            const position = getEventPosition(event.time, event.endTime, index, group.length);
                            const isPassed = isEventPassed(`${day.date}T${event.time}`, event.endTime ? `${day.date}T${event.endTime}` : undefined, event.type);
                            return (
                              <div
                                key={`${event.time}-${index}`}
                                className={`calendar-event ${isPassed ? 'passed' : ''}`}
                                style={{
                                  backgroundColor: event.color,
                                  top: position.top,
                                  height: position.height,
                                  width: position.width,
                                  left: position.left
                                }}
                                onClick={() => handleEventClick(event)}
                              >
                                <div className="calendar-event-title-container">
                                  <div className="calendar-event-name">{event.name}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          </div>
          
          {selectedEvent && (
          <div className="match-event-details">
            <h3>{selectedEvent.name}</h3>
            <p>Horaire: {selectedEvent.time} - {selectedEvent.endTime}</p>
            {selectedEvent.type === 'match' ? (
              <>
                {selectedEvent.sport && <p>Sport: {selectedEvent.sport}</p>}
                {selectedEvent.venue && <p>Lieu: {selectedEvent.venue}</p>}
                {selectedEvent.teams && <p>Équipes: {selectedEvent.teams}</p>}
                {selectedEvent.description && <p>Description: {selectedEvent.description}</p>}
                {selectedEvent.result && <p className="match-result"><strong>Résultat :</strong> {selectedEvent.result}</p>}
              </>
            ) : (
              <>
                {selectedEvent.description && <p>Description: {selectedEvent.description}</p>}
                {selectedEvent.venue && <p>Adresse: {selectedEvent.venue}</p>}
              </>
            )}
            <div className="match-event-buttons">
              <button onClick={() => {
                if (selectedEvent.type === 'match') {
                  const venue = venues.find(v => v.name === selectedEvent.venue);
                  if (venue) {
                    onViewOnMap(venue);
                    setSelectedEvent(null)
                  }
                } else if (selectedEvent.type === 'party') {
                  const partyVenues: { [key: string]: Venue } = {
                    'Place Stanislas': {
                      id: 'place-stanislas',
                      name: 'Place Stanislas',
                      description: 'Place Stanislas',
                      address: 'Pl. Stanislas, 54000 Nancy',
                      latitude: 48.693524,
                      longitude: 6.183270,
                      position: [48.693524, 6.183270],
                      sport: 'Defile',
                      date: '',
                      emoji: '🎺',
                      matches: [],
                      type: 'venue'
                    },
                    'Parc Expo': {
                      id: 'parc-expo-pompom',
                      name: 'Parc Expo',
                      description: 'Soirée Pompoms',
                      address: 'Rue Catherine Opalinska, 54500 Vandœuvre-lès-Nancy',
                      latitude: 48.663030,
                      longitude: 6.191597,
                      position: [48.663030, 6.191597],
                      sport: 'Pompom',
                      date: '',
                      emoji: '🎀',
                      matches: [],
                      type: 'venue'
                    },
                    'Zénith': {
                      id: 'zenith',
                      name: 'Zénith',
                      description: 'DJ Contest',
                      address: 'Rue du Zénith, 54320 Maxéville',
                      latitude: 48.710136,
                      longitude: 6.139169,
                      position: [48.710136, 6.139169],
                      sport: 'Party',
                      date: '',
                      emoji: '🎧',
                      matches: [],
                      type: 'venue'
                    }
                  };

                  // Gérer les deux soirées au Parc Expo avec des descriptions différentes
                  let venue: Venue | undefined;
                  if (selectedEvent.name === 'Parc Expo') {
                    // Utiliser la description pour distinguer les deux soirées
                    if (selectedEvent.description?.includes('Pompoms')) {
                      // Soirée Pompoms du 16 avril
                      venue = partyVenues['Parc Expo'];
                    } else if (selectedEvent.description?.includes('Showcase')) {
                      // Soirée Showcase du 17 novembre
                      venue = {
                        id: 'parc-expo-showcase',
                        name: 'Parc Expo',
                        description: 'Showcase 🎤',
                        address: 'Rue Catherine Opalinska, 54500 Vandœuvre-lès-Nancy',
                        latitude: 48.663481,
                        longitude: 6.189737,
                        position: [48.663481, 6.189737],
                        sport: 'Party',
                        date: '',
                        emoji: '🎤',
                        matches: [],
                        type: 'venue'
                      };
                    }
                  } else {
                    venue = partyVenues[selectedEvent.name];
                  }
                  if (venue) {
                    onViewOnMap(venue);
                    setSelectedEvent(null)
                  }
                }
              }}>
                Voir sur la carte
              </button>
              <button onClick={() => setSelectedEvent(null)}>Fermer</button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPopup;