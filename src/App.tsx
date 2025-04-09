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
  iconAnchor: [12, 41],
  className: 'default-marker-icon'
});

let UserIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'user-location-icon' // Cette classe nous permettra de styliser l'icône
});

let HotelIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'hotel-icon'
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
  type?: 'hotel' | 'venue';
}

// Composant pour la géolocalisation
function LocationMarker() {
  const [position, setPosition] = useState<LatLng | null>(null);
  const [error, setError] = useState<string | null>(null);
  const map = useMap();

  useEffect(() => {
    if (map) {
      // Vérifier si la géolocalisation est supportée
      if (!navigator.geolocation) {
        setError("La géolocalisation n'est pas supportée par votre navigateur");
        return;
      }

      // Configurer les options de géolocalisation
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      };

      // Demander la position
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPosition = new LatLng(latitude, longitude);
          setPosition(newPosition);
          map.flyTo(newPosition, 16);
          setError(null); // Réinitialiser l'erreur en cas de succès
        },
        (err) => {
          console.error('Erreur de géolocalisation:', err);
          let errorMessage = "Erreur de géolocalisation";
          switch (err.code) {
            case err.PERMISSION_DENIED:
              errorMessage = "L'accès à la géolocalisation a été refusé. Veuillez autoriser l'accès dans les paramètres de votre navigateur.";
              break;
            case err.POSITION_UNAVAILABLE:
              errorMessage = "La position n'est pas disponible. Vérifiez que la géolocalisation est activée sur votre appareil.";
              break;
            case err.TIMEOUT:
              errorMessage = "La demande de géolocalisation a expiré. Veuillez réessayer.";
              break;
          }
          setError(errorMessage);
        },
        options
      );

      // Surveiller la position
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPosition = new LatLng(latitude, longitude);
          setPosition(newPosition);
          setError(null); // Réinitialiser l'erreur en cas de succès
        },
        (err) => {
          console.error('Erreur de suivi de position:', err);
          // Ne pas afficher d'erreur pour le watchPosition pour éviter les messages répétés
        },
        options
      );

      // Nettoyer le watcher lors du démontage
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [map]);

  if (error) {
    return (
      <div className="error-message">
        {error}
        <div className="retry-container" onClick={() => {
          setError(null);
          // Réessayer la géolocalisation
          if (map) {
            const options = {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            };
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const { latitude, longitude } = pos.coords;
                const newPosition = new LatLng(latitude, longitude);
                setPosition(newPosition);
                map.flyTo(newPosition, 16);
              },
              (err) => {
                console.error('Erreur de géolocalisation:', err);
                let errorMessage = "Erreur de géolocalisation";
                switch (err.code) {
                  case err.PERMISSION_DENIED:
                    errorMessage = "L'accès à la géolocalisation a été refusé. Veuillez autoriser l'accès dans les paramètres de votre navigateur.";
                    break;
                  case err.POSITION_UNAVAILABLE:
                    errorMessage = "La position n'est pas disponible. Vérifiez que la géolocalisation est activée sur votre appareil.";
                    break;
                  case err.TIMEOUT:
                    errorMessage = "La demande de géolocalisation a expiré. Veuillez réessayer.";
                    break;
                }
                setError(errorMessage);
              },
              options
            );
          }
        }}>
          <div className="retry-icon"></div>
          <span>Réessayer</span>
        </div>
      </div>
    );
  }

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
  const [hotels] = useState<Venue[]>([
    {
      name: "F1 Les Ulis",
      position: [48.6819, 2.1694],
      description: "Hôtel F1 Les Ulis - Courtaboeuf",
      address: "Zi Courtaboeuf, Rue Rio Solado N°2, 91940 Les Ulis",
      type: 'hotel',
      matches: []
    },
    {
      name: "F1 Orly-Rungis",
      position: [48.7486, 2.3522],
      description: "Hôtel F1 Orly-Rungis",
      address: "7 Rue du Pont des Halles, 94150 Rungis",
      type: 'hotel',
      matches: []
    }
  ]);

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
  const [isAddingPlace, setIsAddingPlace] = useState(false);
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
  const [locationError, setLocationError] = useState<string | false>(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapStyle, setMapStyle] = useState('osm'); // 'osm' par défaut

  const mapStyles = {
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    cyclosm: {
      url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
      attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - OpenBikeMap">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    humanitarian: {
      url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
    },
    osmfr: {
      url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
      attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  };

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

  // Fonction pour supprimer un match
  const deleteMatch = async (venueId: string, matchId: number) => {
    const venueRef = ref(db, `venues/${venueId}`);
    const venue = venues.find(v => v.id === venueId);
    
    if (venue) {
      const updatedMatches = venue.matches.filter(match => match.id !== matchId);
      await set(venueRef, {
        ...venue,
        matches: updatedMatches
      });
    }
  };

  // Fonction pour vérifier si un match est passé
  const isMatchPassed = (matchDate: string) => {
    return new Date(matchDate) < new Date();
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

  const handleLocationSuccess = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setUserLocation([latitude, longitude]);
    setLocationError(false);
    setLocationLoading(false);
  };

  const handleLocationError = (error: GeolocationPositionError) => {
    console.error('Erreur de géolocalisation:', error);
    
    // Afficher un message d'erreur plus spécifique
    let errorMessage = "Impossible d'accéder à votre position. ";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage += "Veuillez autoriser l'accès à la géolocalisation dans les paramètres de votre navigateur.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage += "La position n'est pas disponible. Vérifiez que la géolocalisation est activée sur votre appareil.";
        break;
      case error.TIMEOUT:
        errorMessage += "La demande a expiré. Veuillez réessayer.";
        break;
      default:
        errorMessage += "Une erreur inattendue s'est produite.";
    }
    setLocationError(errorMessage);
    setLocationLoading(false);
  };

  const retryLocation = () => {
    setLocationError(false);
    setLocationLoading(true);
    
    // Réessayer avec des options optimisées
    navigator.geolocation.getCurrentPosition(
      handleLocationSuccess,
      handleLocationError,
      { 
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>CumMap</h1>
        <div className="controls">
          {!isEditing && (
            <select 
              className="map-style-selector"
              value={mapStyle}
              onChange={(e) => setMapStyle(e.target.value)}
            >
              <option value="osm">OpenStreetMap</option>
              <option value="cyclosm">CyclOSM</option>
              <option value="humanitarian">Humanitarian</option>
              <option value="osmfr">OSM France</option>
            </select>
          )}
          <button 
            className={`edit-button ${isEditing ? 'active' : ''}`}
            onClick={() => {
              setIsEditing(!isEditing);
              if (isEditing) {
                setIsAddingPlace(false);
              }
            }}
          >
            {isEditing ? 'Terminer l\'édition' : 'Mode édition'}
          </button>
          {isEditing && (
            <button 
              className="add-place-button"
              onClick={() => setIsAddingPlace(true)}
            >
              Ajouter un lieu
            </button>
          )}
          {isAddingPlace && (
            <div className="edit-form">
              <div className="edit-form-header">
                <h3>Ajouter un nouveau lieu</h3>
              </div>
              <div className="edit-form-content">
                <div className="form-group">
                  <label htmlFor="venue-name">Nom du lieu</label>
                  <input
                    id="venue-name"
                    type="text"
                    value={newVenueName}
                    onChange={(e) => setNewVenueName(e.target.value)}
                    placeholder="Ex: Stade de France"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="venue-description">Description</label>
                  <input
                    id="venue-description"
                    type="text"
                    value={newVenueDescription}
                    onChange={(e) => setNewVenueDescription(e.target.value)}
                    placeholder="Ex: Stade principal de football"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="venue-address">Adresse</label>
                  <input
                    id="venue-address"
                    type="text"
                    value={newVenueAddress}
                    onChange={(e) => setNewVenueAddress(e.target.value)}
                    placeholder="Ex: Rue Jules Rimet, 93200 Saint-Denis"
                    className="form-input"
                  />
                </div>
                <div className="form-actions">
                  <button 
                    className="add-button"
                    onClick={handleAddVenue}
                    disabled={!newVenueName || !newVenueDescription || !newVenueAddress}
                  >
                    Ajouter le lieu
                  </button>
                  <button 
                    className="cancel-button"
                    onClick={() => setIsAddingPlace(false)}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="app-main">
        {locationError ? (
          <div className="location-error">
            <p>{locationError}</p>
            <div className="retry-container" onClick={retryLocation}>
              <div className="retry-icon"></div>
              <span>Réessayer</span>
            </div>
          </div>
        ) : locationLoading ? (
          <div className="loading">Chargement de la carte...</div>
        ) : (
        <MapContainer
          center={[48.8566, 2.3522]}
          zoom={12}
          style={{ height: 'calc(100vh - 80px)', width: '100%' }}
        >
          <TileLayer
            url={mapStyles[mapStyle as keyof typeof mapStyles].url}
            attribution={mapStyles[mapStyle as keyof typeof mapStyles].attribution}
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
                          ) : (
                            <>
                              <p className="match-date">{new Date(match.date).toLocaleString()}</p>
                              <p className="match-teams">{match.teams}</p>
                              <p className="match-description">{match.description}</p>
                              {isEditing && (
                                  <div className="match-actions">
                                <button 
                                  className="edit-match-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                        startEditingMatch(venue.id || '', match);
                                  }}
                                >
                                  Modifier
                                </button>
                                    <button 
                                      className="delete-match-button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteMatch(venue.id || '', match.id);
                                      }}
                                    >
                                      Supprimer
                                    </button>
                                  </div>
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
            {hotels.map((hotel) => (
              <Marker 
                key={hotel.name} 
                position={hotel.position}
                icon={HotelIcon}
              >
                <Popup>
                  <div className="venue-popup">
                    <h3>{hotel.name}</h3>
                    <p>{hotel.description}</p>
                    <p className="venue-address">{hotel.address}</p>
                    <button className="maps-button" onClick={() => openInGoogleMaps(hotel)}>
                      Ouvrir dans Google Maps
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
        )}
      </main>
    </div>
  );
}

export default App;
