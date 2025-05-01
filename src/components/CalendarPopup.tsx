import React, { useState, useEffect } from 'react';
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
}

const CalendarPopup: React.FC<CalendarPopupProps> = ({ isOpen, onClose, venues, eventFilter, onViewOnMap }) => {
  const [calendarEventFilter, setCalendarEventFilter] = useState<string>('Aucun');
  const [delegationFilter, setDelegationFilter] = useState<string>('all');
  const [venueFilter, setVenueFilter] = useState<string>('Tous');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showFemale, setShowFemale] = useState<boolean>(true);
  const [showMale, setShowMale] = useState<boolean>(true);
  const [showMixed, setShowMixed] = useState<boolean>(true);

  useEffect(() => {
    if (eventFilter === 'all' || eventFilter === 'party') {
      setCalendarEventFilter('Aucun');
    } else {
      setCalendarEventFilter(eventFilter);
    }
  }, [eventFilter]);

  const sportOptions = [
    { value: 'Aucun', label: 'Aucun' },
    { value: 'Tous', label: 'Tous les événements' },
    { value: 'Party', label: 'Soirée et Défilé ⭐' },
    { value: 'Football', label: 'Football ⚽' },
    { value: 'Basketball', label: 'Basketball 🏀' },
    { value: 'Handball', label: 'Handball 🤾' },
    { value: 'Rugby', label: 'Rugby 🏉' },
    { value: 'Volleyball', label: 'Volleyball 🏐' },
    { value: 'Tennis', label: 'Tennis 🎾' },
    { value: 'Badminton', label: 'Badminton 🏸' },
    { value: 'Ping-pong', label: 'Ping-pong 🏓' },
    { value: 'Ultimate', label: 'Ultimate 🥏' },
    { value: 'Natation', label: 'Natation 🏊' },
    { value: 'Cross', label: 'Cross 🏃' },
    { value: 'Boxe', label: 'Boxe 🥊' },
    { value: 'Athlétisme', label: 'Athlétisme 🏃‍♂️' },
    { value: 'Pétanque', label: 'Pétanque 🍹' },
    { value: 'Escalade', label: 'Escalade 🧗‍♂️' },
    { value: 'Jeux de société', label: 'Jeux de société 🎲' },
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
    if (calendarEventFilter === 'Aucun') {
      return [{ value: 'Tous', label: 'Tous les lieux' }];
    }

    // Pour les soirées et défilés, retourner les lieux fixes
    if (calendarEventFilter === 'Party') {
      return [
        { value: 'Tous', label: 'Tous les lieux' },
        { value: 'place-stanislas', label: 'Place Stanislas' },
        { value: 'centre-prouve', label: 'Centre Prouvé' },
        { value: 'parc-expo', label: 'Parc des Expositions' },
        { value: 'zenith', label: 'Zénith' }
      ];
    }

    // Pour les sports, filtrer les lieux par sport
    const filteredVenues = venues.filter(venue => venue.sport === calendarEventFilter);
    const venueOptions = [
      { value: 'Tous', label: 'Tous les lieux' },
      ...filteredVenues.map(venue => ({
        value: venue.id,
        label: venue.name
      }))
    ];

    return venueOptions;
  };

  // Fonction pour obtenir toutes les délégations uniques
  const getAllDelegations = () => {
    const delegations = new Set<string>();
    venues.forEach(venue => {
      if (venue.matches) {
        venue.matches.forEach(match => {
          const teams = match.teams.split(/vs|VS|contre|CONTRE|,/).map(team => team.trim());
          teams.forEach(team => {
            // Exclure les "..." et les chaînes vides
            if (team && team !== "..." && team !== "…") delegations.add(team);
          });
        });
      }
    });
    return Array.from(delegations).sort();
  };

  const getEventsForDay = (date: string): Event[] => {
    const events: Event[] = [];
    
    if (calendarEventFilter !== 'Aucun') {
      // Pour les matchs sportifs
      if (calendarEventFilter === 'Tous' || calendarEventFilter !== 'Party') {
        venues.forEach(venue => {
          if (venue.matches) {
            venue.matches.forEach(match => {
              const [matchDate, matchTime] = match.date.split('T');
              
              if (matchDate === date) {
                const sportMatch = calendarEventFilter === 'Tous' || venue.sport === calendarEventFilter;
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
                  (match.teams && match.teams.toLowerCase().includes(delegationFilter.toLowerCase()));
                
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

      // Pour les soirées et défilés
      if (calendarEventFilter === 'Tous' || calendarEventFilter === 'Party') {
        const parties = [
          {
            id: 'place-stanislas',
            date: '2026-04-16',
            time: '13:00',
            endTime: '17:00',
            name: 'Place Stanislas',
            description: 'Défilé',
            color: '#FF9800',
            type: 'Party',
            venue: 'Pl. Stanislas, 54000 Nancy'
          },
          {
            id: 'centre-prouve',
            date: '2026-04-16',
            time: '21:00',
            endTime: '23:00',
            name: 'Centre Prouvé',
            description: 'Show Pompoms',
            color: '#FF9800',
            type: 'Party',
            venue: '1 Pl. de la République, 54000 Nancy'
          },
          {
            id: 'parc-expo',
            date: '2026-04-17',
            time: '22:00',
            endTime: '23:00',
            name: 'Parc des Expositions',
            description: 'Soirée',
            color: '#FF9800',
            type: 'Party',
            venue: 'Rue Catherine Opalinska, 54500 Vandœuvre-lès-Nancy'
          },
          {
            id: 'zenith',
            date: '2026-04-18',
            time: '20:00',
            endTime: '23:00',
            name: 'Zénith',
            description: 'Soirée',
            color: '#FF9800',
            type: 'Party',
            venue: 'Rue du Zénith, 54320 Maxéville'
          }
        ];

        parties.forEach(party => {
          if (party.date === date && (venueFilter === 'Tous' || party.id === venueFilter)) {
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

  const getEventPosition = (time: string, endTime: string | undefined, type: 'match' | 'party', index: number, total: number) => {
    const [startHour, startMinute] = time.split(':').map(Number);
    let endHour = startHour + 1;
    let endMinute = 0;
    
    if (endTime) {
      const [parsedEndHour, parsedEndMinute] = endTime.split(':').map(Number);
      if (!isNaN(parsedEndHour) && !isNaN(parsedEndMinute)) {
        endHour = parsedEndHour;
        endMinute = parsedEndMinute;
      }
    }

    if (!endTime) {
      endHour = 23;
      endMinute = 0;
    }

    const startPosition = (startHour - 8) + (startMinute / 60);
    const endPosition = (endHour - 8) + (endMinute / 60);
    const duration = endPosition - startPosition;

    const width = total === 1 ? '100%' : `${100 / total}%`;
    const left = total === 1 ? '0%' : `${(100 / total) * index}%`;

    return {
      top: `${startPosition * 43.33}px`,
      height: `${duration * 43.33}px`,
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
    const now = getCurrentDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Ne pas afficher l'indicateur si l'heure est en dehors de la plage 8h-23h
    if (hours < 8 || hours >= 23) {
      return '';
    }
    
    const totalMinutes = hours * 60 + minutes;
    const startHour = 8;
    const minutesFromStart = totalMinutes - (startHour * 60);
    const position = `${(minutesFromStart / 60) * 43.33}px`;
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
      <div className="calendar-popup" onClick={e => e.stopPropagation()}>
        <div className="calendar-popup-header">
          <button className="close-button" onClick={onClose}>×</button>
          <div className="filter-row">
            <select 
              className="filter-select"
              value={calendarEventFilter}
              onChange={(e) => {
                setCalendarEventFilter(e.target.value);
                setVenueFilter('Tous');
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
              onChange={(e) => setDelegationFilter(e.target.value)}
            >
              <option value="all">Toutes les délégations</option>
              {getAllDelegations().map(delegation => (
                <option key={delegation} value={delegation}>
                  {delegation}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-row">
            {calendarEventFilter !== 'Aucun' && (
              <select 
                className="filter-select"
                value={venueFilter}
                onChange={(e) => setVenueFilter(e.target.value)}
              >
                {getVenueOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}

            {calendarEventFilter !== 'Aucun' && calendarEventFilter !== 'Party' && (() => {
              const { hasFemale, hasMale, hasMixed } = hasGenderMatches(calendarEventFilter);
              return (hasFemale || hasMale || hasMixed) && (
                <div className="gender-filter-row">
                  {hasFemale && (
                    <button 
                      className={`gender-filter-button ${showFemale ? 'active' : ''}`}
                      onClick={() => setShowFemale(!showFemale)}
                    >
                      Féminin
                    </button>
                  )}
                  {hasMale && (
                    <button 
                      className={`gender-filter-button ${showMale ? 'active' : ''}`}
                      onClick={() => setShowMale(!showMale)}
                    >
                      Masculin
                    </button>
                  )}
                  {hasMixed && (
                    <button 
                      className={`gender-filter-button ${showMixed ? 'active' : ''}`}
                      onClick={() => setShowMixed(!showMixed)}
                    >
                      Mixte
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
        <div className="calendar-grid">
          <div className="calendar-hours">
            <div className="calendar-hour-header"></div>
            {hours.map(hour => (
              <div key={hour} className="calendar-hour">{hour}</div>
            ))}
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
                            const position = getEventPosition(event.time, event.endTime, event.type, index, group.length);
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
                    'Centre Prouvé': {
                      id: 'centre-prouve',
                      name: 'Centre Prouvé',
                      description: 'Centre Prouvé',
                      address: '1 Pl. de la République, 54000 Nancy',
                      latitude: 48.687858,
                      longitude: 6.176977,
                      position: [48.687858, 6.176977],
                      sport: 'Pompom',
                      date: '',
                      emoji: '🎀',
                      matches: [],
                      type: 'venue'
                    },
                    'Parc des Expositions': {
                      id: 'parc-expo',
                      name: 'Parc des Expositions',
                      description: 'Parc des Expositions',
                      address: 'Rue Catherine Opalinska, 54500 Vandœuvre-lès-Nancy',
                      latitude: 48.663272,
                      longitude: 6.190715,
                      position: [48.663272, 6.190715],
                      sport: 'Party',
                      date: '',
                      emoji: '🎉',
                      matches: [],
                      type: 'venue'
                    },
                    'Zénith': {
                      id: 'zenith',
                      name: 'Zénith',
                      description: 'Zénith',
                      address: 'Rue du Zénith, 54320 Maxéville',
                      latitude: 48.710237,
                      longitude: 6.139252,
                      position: [48.710237, 6.139252],
                      sport: 'Party',
                      date: '',
                      emoji: '🎉',
                      matches: [],
                      type: 'venue'
                    }
                  };

                  const venue = partyVenues[selectedEvent.name];
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
  );
};

export default CalendarPopup;