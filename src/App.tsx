import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLng } from 'leaflet';
import { useState, useEffect, useRef } from 'react';
import './App.css';
import { ref, onValue, set, push } from 'firebase/database';
import { db } from './firebase';

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
  id?: string;  // ID Firebase est une string
  name: string;
  position: [number, number];
  description: string;
  matches: Match[];
  address?: string;
}

// Composant pour la géolocalisation
function LocationMarker() {
  const [position, setPosition] = useState<LatLng | null>(null);
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.locate({
        setView: true,
        maxZoom: 16,
        timeout: 10000
      });

      map.on('locationfound', (e) => {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
      });

      map.on('locationerror', (e) => {
        console.error('Erreur de géolocalisation:', e.message);
      });
    }
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
  const [venues, setVenues] = useState<Venue[]>([]);

  // Charger les lieux depuis Firebase au démarrage
  useEffect(() => {
    const venuesRef = ref(db, 'venues');
    const unsubscribe = onValue(venuesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const venuesArray = Object.entries(data).map(([key, value]: [string, any]) => ({
          ...value,
          id: key,
          matches: value.matches || []  // Assurer que matches est toujours un tableau
        }));
        setVenues(venuesArray);
      } else {
        setVenues([]); // Si pas de données, initialiser avec un tableau vide
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [newVenueName, setNewVenueName] = useState('');
  const [newVenueDescription, setNewVenueDescription] = useState('');
  const [newVenueAddress, setNewVenueAddress] = useState('');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [editingMatch, setEditingMatch] = useState<{venueId: string | null, match: Match | null}>({ venueId: null, match: null });
  const [newMatch, setNewMatch] = useState<{date: string, teams: string, description: string}>({
    date: '',
    teams: '',
    description: ''
  });
  const [openPopup, setOpenPopup] = useState<string | null>(null);

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
        const venuesRef = ref(db, 'venues');
        const newVenueRef = push(venuesRef);
        const newVenue: Omit<Venue, 'id'> = {
          name: newVenueName,
          position: coordinates,
          description: newVenueDescription,
          address: newVenueAddress,
          matches: []
        };
        
        try {
          await set(newVenueRef, newVenue);
          setNewVenueName('');
          setNewVenueDescription('');
          setNewVenueAddress('');
        } catch (error) {
          console.error('Erreur lors de l\'ajout du lieu:', error);
          alert('Une erreur est survenue lors de l\'ajout du lieu.');
        }
      } else {
        alert('Adresse non trouvée. Veuillez vérifier l\'adresse saisie.');
      }
    }
  };

  // Fonction pour supprimer un lieu
  const deleteVenue = async (id: string) => {
    const venueRef = ref(db, `venues/${id}`);
    await set(venueRef, null);
    setSelectedVenue(null);
  };

  // Fonction pour ajouter un nouveau match
  const handleAddMatch = async (venueId: string) => {
    if (newMatch.date && newMatch.teams && newMatch.description) {
      const venueRef = ref(db, `venues/${venueId}`);
      const venue = venues.find(v => v.id === venueId);
      
      if (venue) {
        const matches = [...(venue.matches || [])];
        const newMatchWithId = {
          id: matches.length > 0 ? Math.max(...matches.map(m => m.id)) + 1 : 1,
          ...newMatch
        };
        matches.push(newMatchWithId);
        
        await set(venueRef, {
          ...venue,
          matches
        });
        
        setNewMatch({ date: '', teams: '', description: '' });
        setEditingMatch({ venueId: null, match: null });
      }
    }
  };

  // Fonction pour gérer la modification d'un match
  const startEditingMatch = (venueId: string, match: Match | null) => {
    setEditingMatch({ venueId, match });
  };

  // Fonction pour terminer l'édition
  const finishEditingMatch = () => {
    setEditingMatch({ venueId: null, match: null });
  };

  // Fonction pour mettre à jour un match
  const handleUpdateMatch = async (venueId: string, matchId: number, updatedData: Partial<Match>) => {
    const venueRef = ref(db, `venues/${venueId}`);
    const venue = venues.find(v => v.id === venueId);
    
    if (venue) {
      const updatedMatches = venue.matches.map(match =>
        match.id === matchId ? { ...match, ...updatedData } : match
      );
      
      await set(venueRef, {
        ...venue,
        matches: updatedMatches
      });
    }
  };

  // Fonction pour ouvrir dans Google Maps
  const openInGoogleMaps = (venue: Venue) => {
    const query = encodeURIComponent(venue.address || `${venue.position[0]},${venue.position[1]}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // Fonction pour gérer l'ouverture des popups
  const handlePopupOpen = (venueId: string) => {
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
                click: () => handlePopupOpen(venue.id || ''),
              }}
            >
              <Popup>
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
                                onChange={(e) => handleUpdateMatch(venue.id || '', match.id, { date: e.target.value })}
                              />
                              <input
                                type="text"
                                defaultValue={match.teams}
                                onChange={(e) => handleUpdateMatch(venue.id || '', match.id, { teams: e.target.value })}
                              />
                              <input
                                type="text"
                                defaultValue={match.description}
                                onChange={(e) => handleUpdateMatch(venue.id || '', match.id, { description: e.target.value })}
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
                                    startEditingMatch(venue.id || '', match);
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
                          startEditingMatch(venue.id || '', null);
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
                                handleAddMatch(venue.id || '');
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
                        onClick={() => deleteVenue(venue.id || '')}
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
