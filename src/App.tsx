import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLng } from 'leaflet';
import { useState, useEffect, useRef } from 'react';
import './App.css';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

let UserIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'user-location-icon' // Cette classe nous permettra de styliser l'icône
});

interface Match {
  id: number;
  date: string;
  teams: string;
  description: string;
}

interface Venue {
  id: number;
  name: string;
  position: [number, number];
  description: string;
  matches: Match[];
  address?: string;
}

// Composant pour la géolocalisation
function LocationMarker() {
  const [position, setPosition] = useState<LatLng | null>(null);

  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={UserIcon}>
      <Popup>Vous êtes ici</Popup>
    </Marker>
  );
}

// Composant pour gérer les clics sur la carte
function MapEvents({ onMapClick }: { onMapClick: (e: { latlng: { lat: number; lng: number } }) => void }) {
  useMapEvents({
    click: onMapClick,
  });
  return null;
}

function App() {
  const [venues, setVenues] = useState<Venue[]>([
    {
      id: 1,
      name: 'AccorHotels Arena',
      position: [48.8383, 2.3789],
      description: 'Salle de concert et événements sportifs',
      address: '8 Boulevard de Bercy, 75012 Paris',
      matches: [
        { id: 1, date: '2024-04-15 20:00', teams: 'PSG vs Real Madrid', description: 'Champions League' },
        { id: 2, date: '2024-04-20 21:00', teams: 'France vs Espagne', description: 'Match amical' }
      ]
    },
    {
      id: 2,
      name: 'Le Zénith',
      position: [48.8939, 2.3934],
      description: 'Salle de spectacles',
      address: '211 Avenue Jean Jaurès, 75019 Paris',
      matches: [
        { id: 3, date: '2024-04-18 19:00', teams: 'PSG vs Marseille', description: 'Ligue 1' }
      ]
    },
    {
      id: 3,
      name: 'Stade de France',
      position: [48.9244, 2.3601],
      description: 'Stade national',
      address: '93216 Saint-Denis',
      matches: [
        { id: 4, date: '2024-04-25 21:00', teams: 'France vs Allemagne', description: 'Euro 2024' }
      ]
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [newVenueName, setNewVenueName] = useState('');
  const [newVenueDescription, setNewVenueDescription] = useState('');
  const [newVenueAddress, setNewVenueAddress] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [editingMatch, setEditingMatch] = useState<{venueId: number, match: Match | null}>({ venueId: 0, match: null });
  const [newMatch, setNewMatch] = useState<{date: string, teams: string, description: string}>({
    date: '',
    teams: '',
    description: ''
  });
  const [openPopup, setOpenPopup] = useState<number | null>(null);

  // Fonction pour géocoder une adresse avec Nominatim
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (error) {
      console.error('Erreur de géocodage:', error);
      return null;
    }
  };

  // Fonction pour ajouter un nouveau lieu
  const handleAddVenue = async () => {
    if (newVenueName && newVenueDescription && newVenueAddress) {
      const coordinates = await geocodeAddress(newVenueAddress);
      if (coordinates) {
        const newVenue: Venue = {
          id: venues.length + 1,
          name: newVenueName,
          position: coordinates,
          description: newVenueDescription,
          address: newVenueAddress,
          matches: []
        };
        setVenues([...venues, newVenue]);
        setNewVenueName('');
        setNewVenueDescription('');
        setNewVenueAddress('');
      } else {
        alert('Adresse non trouvée. Veuillez vérifier l\'adresse saisie.');
      }
    }
  };

  // Fonction pour supprimer un lieu
  const deleteVenue = (id: number) => {
    setVenues(venues.filter(venue => venue.id !== id));
    setSelectedVenue(null);
  };

  // Fonction pour ajouter un nouveau match
  const handleAddMatch = (venueId: number) => {
    if (newMatch.date && newMatch.teams && newMatch.description) {
      setVenues(venues.map(venue => {
        if (venue.id === venueId) {
          const newMatchWithId = {
            id: Math.max(0, ...venue.matches.map(m => m.id)) + 1,
            ...newMatch
          };
          return {
            ...venue,
            matches: [...venue.matches, newMatchWithId]
          };
        }
        return venue;
      }));
      setNewMatch({ date: '', teams: '', description: '' });
      setEditingMatch({ venueId: 0, match: null });
    }
  };

  // Fonction pour gérer la modification d'un match
  const startEditingMatch = (venueId: number, match: Match | null) => {
    setEditingMatch({ venueId, match });
  };

  // Fonction pour terminer l'édition
  const finishEditingMatch = () => {
    setEditingMatch({ venueId: 0, match: null });
  };

  // Fonction pour modifier un match existant
  const handleUpdateMatch = (venueId: number, matchId: number, updatedData: Partial<Match>) => {
    setVenues(venues.map(venue => {
      if (venue.id === venueId) {
        return {
          ...venue,
          matches: venue.matches.map(match => 
            match.id === matchId ? { ...match, ...updatedData } : match
          )
        };
      }
      return venue;
    }));
  };

  // Fonction pour ouvrir dans Google Maps
  const openInGoogleMaps = (venue: Venue) => {
    const query = encodeURIComponent(venue.address || `${venue.position[0]},${venue.position[1]}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // Fonction pour gérer l'ouverture des popups
  const handlePopupOpen = (venueId: number) => {
    setOpenPopup(venueId);
  };

  const handlePopupClose = () => {
    if (!editingMatch.match && !editingMatch.venueId) {
      setOpenPopup(null);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cum Map</h1>
        <div className="controls">
          <button 
            className={`edit-button ${isEditing ? 'active' : ''}`}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Terminer l\'édition' : 'Mode édition'}
          </button>
          {isEditing && (
            <div className="edit-form">
              <input
                type="text"
                placeholder="Nom du lieu"
                value={newVenueName}
                onChange={(e) => setNewVenueName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Description"
                value={newVenueDescription}
                onChange={(e) => setNewVenueDescription(e.target.value)}
              />
              <input
                type="text"
                placeholder="Adresse"
                value={newVenueAddress}
                onChange={(e) => setNewVenueAddress(e.target.value)}
              />
              <button onClick={handleAddVenue}>Ajouter le lieu</button>
            </div>
          )}
        </div>
      </header>
      <main className="app-main">
        <MapContainer
          center={[48.8566, 2.3522]}
          zoom={12}
          style={{ height: 'calc(100vh - 80px)', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
          {venues.map((venue) => (
            <Marker 
              key={venue.id} 
              position={venue.position}
              icon={DefaultIcon}
              eventHandlers={{
                click: () => handlePopupOpen(venue.id),
              }}
            >
              <Popup onClose={handlePopupClose}>
                <div className="venue-popup">
                  <h3>{venue.name}</h3>
                  <p>{venue.description}</p>
                  <p className="venue-address">{venue.address}</p>
                  <button className="maps-button" onClick={() => openInGoogleMaps(venue)}>
                    Ouvrir dans Google Maps
                  </button>
                  {venue.matches.length > 0 && (
                    <div className="matches-list">
                      <h4>Matchs à venir :</h4>
                      {venue.matches.map(match => (
                        <div key={match.id} className="match-item">
                          {editingMatch.venueId === venue.id && editingMatch.match?.id === match.id ? (
                            <div className="match-edit-form">
                              <input
                                type="datetime-local"
                                defaultValue={match.date.slice(0, 16)}
                                onChange={(e) => handleUpdateMatch(venue.id, match.id, { date: e.target.value })}
                              />
                              <input
                                type="text"
                                defaultValue={match.teams}
                                onChange={(e) => handleUpdateMatch(venue.id, match.id, { teams: e.target.value })}
                              />
                              <input
                                type="text"
                                defaultValue={match.description}
                                onChange={(e) => handleUpdateMatch(venue.id, match.id, { description: e.target.value })}
                              />
                              <div className="edit-buttons">
                                <button 
                                  className="save-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    finishEditingMatch();
                                  }}
                                >
                                  Enregistrer
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="match-date">{new Date(match.date).toLocaleString()}</p>
                              <p className="match-teams">{match.teams}</p>
                              <p className="match-description">{match.description}</p>
                              {isEditing && (
                                <button 
                                  className="edit-match-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startEditingMatch(venue.id, match);
                                  }}
                                >
                                  Modifier
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {isEditing && (
                    <>
                      <button 
                        className="add-match-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingMatch(venue.id, null);
                        }}
                      >
                        Ajouter un match
                      </button>
                      {editingMatch.venueId === venue.id && !editingMatch.match && (
                        <div className="match-edit-form">
                          <input
                            type="datetime-local"
                            placeholder="Date et heure"
                            value={newMatch.date}
                            onChange={(e) => setNewMatch({ ...newMatch, date: e.target.value })}
                          />
                          <input
                            type="text"
                            placeholder="Équipes"
                            value={newMatch.teams}
                            onChange={(e) => setNewMatch({ ...newMatch, teams: e.target.value })}
                          />
                          <input
                            type="text"
                            placeholder="Description"
                            value={newMatch.description}
                            onChange={(e) => setNewMatch({ ...newMatch, description: e.target.value })}
                          />
                          <div className="edit-buttons">
                            <button 
                              className="save-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddMatch(venue.id);
                              }}
                            >
                              Ajouter
                            </button>
                            <button 
                              className="cancel-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                finishEditingMatch();
                              }}
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      )}
                      <button 
                        className="delete-button"
                        onClick={() => deleteVenue(venue.id)}
                      >
                        Supprimer ce lieu
                      </button>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </main>
    </div>
  );
}

export default App;
