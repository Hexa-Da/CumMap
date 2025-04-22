import React, { useState } from 'react';
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
}

const CalendarPopup: React.FC<CalendarPopupProps> = ({ isOpen, onClose, venues }) => {
  const [eventFilter, setEventFilter] = useState<string>('Aucun');

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

  const getEventsForDay = (date: string): Event[] => {
    const events: Event[] = [];
    
    venues.forEach(venue => {
      if (venue.matches) {
        venue.matches.forEach(match => {
          const [matchDate, matchTime] = match.date.split('T');
          
          if (matchDate === date) {
            if (eventFilter !== 'Aucun' && venue.sport === eventFilter) {
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

    // Ajouter les soirées (toujours affichées, quel que soit le filtre)
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
        const lastEndTime = lastEvent.endTime 
          ? parseInt(lastEvent.endTime.split(':')[0]) * 60 + parseInt(lastEvent.endTime.split(':')[1])
          : parseInt(lastEvent.time.split(':')[0]) * 60 + parseInt(lastEvent.time.split(':')[1]) + 60;

        if (startTime >= lastEndTime) {
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

  const getEventPosition = (time: string, endTime: string | undefined, type: 'match' | 'party') => {
    if(type != 'party'){
      console.log('Input time:', time);
      console.log('Input endTime:', endTime);
    }
    
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

    // Pour les soirées, on force la fin à 23h si non spécifié
    if (type === 'party' && !endTime) {
      endHour = 23;
      endMinute = 0;
    }
    if(type != 'party'){
      console.log('Calculated times:', startHour, startMinute, endHour, endMinute);
    }

    // Calcul de la position en heures décimales (ex: 9h30 = 9.5)
    const startPosition = (startHour - 8) + (startMinute / 60);
    const endPosition = (endHour - 8) + (endMinute / 60);
    const duration = endPosition - startPosition;

    return {
      top: `${startPosition * 43.33}px`,
      height: `${duration * 43.33}px`,
      width: type === 'party' ? '100%' : undefined
    };
  };

  if (!isOpen) return null;

  return (
    <div className="calendar-popup-overlay" onClick={onClose}>
      <div className="calendar-popup" onClick={e => e.stopPropagation()}>
        <div className="calendar-popup-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h2>Calendrier</h2>
            <select 
              className="filter-select"
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
            >
              {sportOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
              const matches = events.filter(event => event.type === 'match');
              return (
                <div key={day.date} className="calendar-day-column">
                  <div className="calendar-day-header">{day.label}</div>
                  <div className="calendar-events">
                    {getOverlappingEvents(events).map((group, groupIndex) => {
                      const matchesInGroup = group.filter(event => event.type === 'match');
                      return (
                        <div key={groupIndex} className="event-group">
                          {group.map((event, index) => {
                            const position = getEventPosition(event.time, event.endTime, event.type);
                            return (
                              <div
                                key={`${event.time}-${index}`}
                                className="calendar-event"
                                style={{
                                  backgroundColor: event.color,
                                  top: position.top,
                                  height: ((parseInt(event.endTime?.split(':')[0] || '0') * 60 + parseInt(event.endTime?.split(':')[1] || '0') - (parseInt(event.time.split(':')[0]) * 60 + parseInt(event.time.split(':')[1]))) * 43.33 / 60) + 'px',
                                  width: '100%',
                                  left: '0%'
                                }}
                              >
                                <div className="event-time">{event.time}</div>
                                <div className="event-venue">{event.venue}</div>
                                <div className="event-name">{event.name}</div>
                                {event.type === 'match' && event.description && <div className="event-description">{event.description}</div>}
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
      </div>
    </div>
  );
};

export default CalendarPopup;