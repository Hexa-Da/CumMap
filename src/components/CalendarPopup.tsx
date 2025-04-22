import React, { useState, useEffect } from 'react';
import './CalendarPopup.css';

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
}

interface Venue {
  id: string;
  name: string;
  matches: Match[];
  sport?: string;
}

interface Match {
  id: string;
  name: string;
  date: string;
  time: string;
  endTime?: string;
  teams: string;
  description?: string;
}

interface CalendarPopupProps {
  isOpen: boolean;
  onClose: () => void;
  venues: Venue[];
  eventFilter: string;
}

const CalendarPopup: React.FC<CalendarPopupProps> = ({ isOpen, onClose, venues, eventFilter }) => {
  const [calendarEventFilter, setCalendarEventFilter] = useState<string>('Aucun');
  const [venueFilter, setVenueFilter] = useState<string>('Tous');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const sportOptions = [
    { value: 'Aucun', label: 'Aucun' },
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
    { value: 'Trail', label: 'Trail 🏃' },
    { value: 'Boxe', label: 'Boxe 🥊' },
    { value: 'Athlétisme', label: 'Athlétisme 🏃‍♂️' },
    { value: 'Pétanque', label: 'Pétanque 🍹' },
    { value: 'Escalade', label: 'Escalade 🧗‍♂️' },
    { value: 'Jeux de société', label: 'Jeux de société 🎲' },
  ];

  const days = [
    { date: '2025-04-24', label: 'Jeudi' },
    { date: '2025-04-25', label: 'Vendredi' },
    { date: '2025-04-26', label: 'Samedi' }
  ];

  const hours = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  const getVenueOptions = () => {
    if (calendarEventFilter === 'Aucun') {
      return [{ value: 'Tous', label: 'Tous les lieux' }];
    }

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

  const getEventsForDay = (date: string): Event[] => {
    const events: Event[] = [];
    
    if (calendarEventFilter !== 'Aucun') {
      venues.forEach(venue => {
        if (venue.matches) {
          venue.matches.forEach(match => {
            const [matchDate, matchTime] = match.date.split('T');
            
            if (matchDate === date) {
              const sportMatch = venue.sport === calendarEventFilter;
              const venueMatch = venueFilter === 'Tous' || venue.id === venueFilter;
              
              // Vérifier si le match correspond au filtre de genre
              const isFemale = match.description?.toLowerCase().includes('féminin');
              const isMale = match.description?.toLowerCase().includes('masculin');
              const isMixed = match.description?.toLowerCase().includes('mixte');
              
              const genderMatch = (!isFemale && !isMale && !isMixed) || 
                                (isFemale && showFemale) || 
                                (isMale && showMale) ||
                                (isMixed && showMixed);
              
              if (sportMatch && venueMatch && genderMatch) {
                events.push({
                  type: 'match',
                  time: matchTime.split('.')[0],
                  endTime: match.endTime ? match.endTime.split('T')[1].split('.')[0] : undefined,
                  name: match.description || match.name,
                  teams: match.teams,
                  sport: venue.sport,
                  venue: venue.name,
                  color: '#4CAF50'
                });
              }
            }
          });
        }
      });
    }

    const parties = [
      {
        date: '2025-04-24',
        time: '21:00',
        endTime: '23:00',
        name: 'La Palmeraie',
        description: 'Soirée Pompoms',
        color: '#FF9800'
      },
      {
        date: '2025-04-25',
        time: '21:00',
        endTime: '23:00',
        name: 'Bridge Club',
        description: 'Soirée',
        color: '#FF9800'
      },
      {
        date: '2025-04-26',
        time: '22:00',
        endTime: '23:00',
        name: 'Terminal 7',
        description: 'Soirée',
        color: '#FF9800'
      }
    ];

    parties.forEach(party => {
      if (party.date === date) {
        events.push({
          type: 'party',
          time: party.time,
          endTime: party.endTime,
          name: party.name,
          description: party.description,
          color: party.color
        });
      }
    });

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

    if (type === 'party' && !endTime) {
      endHour = 23;
      endMinute = 0;
    }

    const startPosition = (startHour - 8) + (startMinute / 60);
    const endPosition = (endHour - 8) + (endMinute / 60);
    const duration = endPosition - startPosition;

    const width = type === 'party' || total === 1 ? '100%' : `${100 / total}%`;
    const left = type === 'party' || total === 1 ? '0%' : `${(100 / total) * index}%`;

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
    return new Date();
  };

  const getCurrentTimePosition = () => {
    const now = getCurrentDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
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
    const eventDate = new Date(date);
    
    // Si l'événement est dans le futur, il n'est pas passé
    if (eventDate > now) {
      return false;
    }
    
    // Si l'événement est aujourd'hui, vérifier l'heure
    if (eventDate.toDateString() === now.toDateString()) {
      // Si une heure de fin est spécifiée, l'utiliser
      if (endTime) {
        const [hours, minutes] = endTime.split(':').map(Number);
        const end = new Date(eventDate);
        end.setHours(hours, minutes, 0, 0);
        return now > end;
      }
      
      // Sinon, utiliser les durées par défaut
      const defaultDuration = type === 'party' ? 6 : 2; // 6h pour les soirées, 2h pour les matchs
      const end = new Date(eventDate.getTime() + (defaultDuration * 60 * 60 * 1000));
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
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        {calendarEventFilter !== 'Aucun' && (() => {
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
                    {day.date === getTodayDate() && (
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
            {selectedEvent.venue && <p>Lieu: {selectedEvent.venue}</p>}
            {selectedEvent.teams && <p>Équipes: {selectedEvent.teams}</p>}
            {selectedEvent.description && <p>Description: {selectedEvent.description}</p>}
            <button onClick={() => setSelectedEvent(null)}>Fermer</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPopup;