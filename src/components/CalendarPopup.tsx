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
              
              if (sportMatch && venueMatch) {
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

  const getCurrentTimePosition = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const startHour = 8;
    const minutesFromStart = totalMinutes - (startHour * 60);
    const position = `${(minutesFromStart / 60) * 43.33}px`;
    console.log(`Heure actuelle: ${hours}:${minutes}, Position: ${position}`);
    return position;
  };

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (!isOpen) return null;

  return (
    <div className="calendar-popup-overlay" onClick={onClose}>
      <div className="calendar-popup" onClick={e => e.stopPropagation()}>
        <div className="calendar-popup-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
                            return (
                              <div
                                key={`${event.time}-${index}`}
                                className="calendar-event"
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