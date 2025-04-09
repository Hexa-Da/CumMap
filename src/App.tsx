import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLng } from 'leaflet';
import { useState, useEffect, useRef } from 'react';
import './App.css';
import { ref, onValue, set, push } from 'firebase/database';
import { db } from './firebase';
import React from 'react';
import L from 'leaflet';

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
  type?: 'hotel' | 'venue' | 'party';
  sport: string;
  date: string;
  latitude: number;
  longitude: number;
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
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [hotels] = useState<Venue[]>([
    {
      name: "F1 Les Ulis",
      position: [48.6819, 2.1694],
      description: "Hôtel F1 Les Ulis - Courtaboeuf",
      address: "Zi Courtaboeuf, Rue Rio Solado N°2, 91940 Les Ulis",
      type: 'hotel',
      matches: [],
      sport: 'Hotel',
      date: '',
      latitude: 48.6819,
      longitude: 2.1694
    },
    {
      name: "F1 Orly-Rungis",
      position: [48.7486, 2.3522],
      description: "Hôtel F1 Orly-Rungis",
      address: "7 Rue du Pont des Halles, 94150 Rungis",
      type: 'hotel',
      matches: [],
      sport: 'Hotel',
      date: '',
      latitude: 48.7486,
      longitude: 2.3522
    }
  ]);

  const [parties] = useState<Venue[]>([
    {
      name: "La Palmeraie",
      position: [48.8392, 2.2756],
      description: "Soirée Pompoms du 24 au 25 avril 2025, 21h-3h",
      address: "20, rue du Colonel Pierre Avia, 75015 Paris",
      type: 'party',
      matches: [],
      sport: 'Pompom',
      date: '2025-04-24T21:00:00',
      latitude: 48.8392,
      longitude: 2.2756
    },
    {
      name: "Bridge Club",
      position: [48.8655, 2.3144],
      description: "Soirée du 25 au 26 avril 2025, 21h-3h",
      address: "3, Port des Champs-Élysées, 75008 Paris",
      type: 'party',
      matches: [],
      sport: 'Party',
      date: '2025-04-25T21:00:00',
      latitude: 48.8655,
      longitude: 2.3144
    },
    {
      name: "Terminal 7",
      position: [48.8323, 2.2883],
      description: "Soirée du 26 au 27 avril 2025, 22h-4h",
      address: "1, Place de la Porte de Versailles Pavillon 7 - Etage 7.4, 75015 Paris",
      type: 'party',
      matches: [],
      sport: 'Party',
      date: '2025-04-26T22:00:00',
      latitude: 48.8323,
      longitude: 2.2883
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
          matches: value.matches || [],  // Assurer que matches est toujours un tableau
          sport: value.sport || '',
          date: value.date || '',
          latitude: value.position ? value.position[0] : 0,
          longitude: value.position ? value.position[1] : 0
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
  const [selectedSport, setSelectedSport] = useState('Football');
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
  const [mapStyle, setMapStyle] = useState('osm');
  const [activeTab, setActiveTab] = useState<'map' | 'events'>('map');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [editingVenue, setEditingVenue] = useState<{ id: string | null, venue: Venue | null }>({ id: null, venue: null });
  const [selectedEmoji, setSelectedEmoji] = useState('⚽');

  const mapStyles = {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    cyclosm: {
      url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    humanitarian: {
      url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    osmfr: {
      url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
  };

  const sportEmojis: { [key: string]: string } = {
    Football: '⚽',
    Basketball: '🏀',
    Handball: '🤾',
    Rugby: '🏉',
    Volleyball: '🏐',
    Tennis: '🎾',
    Badminton: '🏸',
    Hockey: '🏑',
    'Base-ball': '⚾',
    Golf: '⛳',
    'Ping-pong': '🏓',
    Other: '🎯',
    Pompom: '🎀',
    Party: '🎉',
    Hotel: '🏨'
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

  const getMarkerColor = (date: string) => {
    const matchDate = new Date(date);
    const now = new Date();
    const diffTime = matchDate.getTime() - now.getTime();
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 0) return { color: '#808080', rotation: '0deg' }; // Gris pour les matchs passés
    if (diffHours <= 1) return { color: '#FF0000', rotation: '0deg' }; // Rouge pour les matchs dans moins d'1h
    if (diffHours <= 3) return { color: '#FF4500', rotation: '45deg' }; // Orange foncé pour les matchs dans 1-3h
    if (diffHours <= 6) return { color: '#FFA500', rotation: '90deg' }; // Orange pour les matchs dans 3-6h
    if (diffHours <= 12) return { color: '#FFD700', rotation: '135deg' }; // Jaune pour les matchs dans 6-12h
    return { color: '#4CAF50', rotation: '180deg' }; // Vert pour les matchs plus éloignés
  };

  // Modifier la fonction getSportIcon pour utiliser des emojis
  const getSportIcon = (sport: string) => {
    return sportEmojis[sport] || '🏟️';
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
          matches: [],
          sport: selectedSport,
          date: '',
          latitude: coordinates[0],
          longitude: coordinates[1]
        };
        
        try {
          await set(newVenueRef, newVenue);
        setNewVenueName('');
        setNewVenueDescription('');
        setNewVenueAddress('');
          setSelectedSport('Football');
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

  // Fonction pour commencer l'édition d'un lieu
  const startEditingVenue = (venue: Venue) => {
    setEditingVenue({ id: venue.id || '', venue });
    setIsEditing(true);
    setIsAddingPlace(true);
    // Pré-remplir les champs du formulaire avec les données du lieu
    setNewVenueName(venue.name);
    setNewVenueDescription(venue.description);
    setNewVenueAddress(venue.address || '');
    setSelectedSport(venue.sport);
    setSelectedEmoji(sportEmojis[venue.sport as keyof typeof sportEmojis] || '⚽');
  };

  // Fonction pour mettre à jour un lieu existant
  const handleUpdateVenue = async () => {
    if (editingVenue.id && newVenueName && newVenueDescription) {
      // Trouver le lieu dans la liste
      const venue = venues.find(v => v.id === editingVenue.id);
      
      if (venue) {
        const venueRef = ref(db, `venues/${editingVenue.id}`);
        
        // Si l'adresse a changé, essayer de la géocoder
        if (newVenueAddress !== venue.address) {
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newVenueAddress)}`);
            const data = await response.json();
            
            if (data && data.length > 0) {
              // Mettre à jour avec les nouvelles coordonnées
              await set(venueRef, {
                ...venue,
                name: newVenueName,
                description: newVenueDescription,
                address: newVenueAddress,
                sport: selectedSport,
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                position: [parseFloat(data[0].lat), parseFloat(data[0].lon)]
              });
            } else {
              // Garder les anciennes coordonnées mais mettre à jour les autres informations
              await set(venueRef, {
                ...venue,
                name: newVenueName,
                description: newVenueDescription,
                address: newVenueAddress,
                sport: selectedSport
              });
            }
          } catch (error) {
            console.error('Erreur lors de la géolocalisation de l\'adresse:', error);
            // Mettre à jour sans changer les coordonnées
            await set(venueRef, {
              ...venue,
              name: newVenueName,
              description: newVenueDescription,
              address: newVenueAddress,
              sport: selectedSport
            });
          }
        } else {
          // Mettre à jour sans changer l'adresse ni les coordonnées
          await set(venueRef, {
            ...venue,
            name: newVenueName,
            description: newVenueDescription,
            sport: selectedSport
          });
        }
        
        // Réinitialiser le formulaire et l'état d'édition
        setNewVenueName('');
        setNewVenueDescription('');
        setNewVenueAddress('');
        setSelectedSport('Football');
        setEditingVenue({ id: null, venue: null });
        setIsAddingPlace(false);
      }
    }
  };

  // Fonction pour annuler l'édition
  const cancelEditingVenue = () => {
    setEditingVenue({ id: null, venue: null });
    setNewVenueName('');
    setNewVenueDescription('');
    setNewVenueAddress('');
    setSelectedSport('Football');
    setIsAddingPlace(false);
  };

  // Fonction pour vérifier si un match est passé
  const isMatchPassed = (matchDate: string) => {
    return new Date(matchDate) < new Date();
  };

  // Fonction pour récupérer tous les événements (matchs et soirées)
  const getAllEvents = () => {
    const events: Array<{
      id: string;
      name: string;
      date: string;
      description: string;
      address: string;
      location: [number, number];
      type: 'match' | 'party';
      teams?: string;
      venue?: string;
      isPassed: boolean;
    }> = [];

    // Ajouter les matchs
    venues.forEach(venue => {
      if (venue.matches && venue.matches.length > 0) {
        venue.matches.forEach(match => {
          events.push({
            id: `match-${venue.id}-${match.id}`,
            name: match.teams,
            date: match.date,
            description: match.description,
            address: venue.address || `${venue.latitude}, ${venue.longitude}`,
            location: [venue.latitude, venue.longitude],
            type: 'match',
            teams: match.teams,
            venue: venue.name,
            isPassed: isMatchPassed(match.date)
          });
        });
      }
    });

    // Ajouter les soirées
    parties.forEach(party => {
      events.push({
        id: `party-${party.id || party.name}`,
        name: party.name,
        date: party.date,
        description: party.description,
        address: party.address || `${party.latitude}, ${party.longitude}`,
        location: [party.latitude, party.longitude],
        type: 'party',
        isPassed: isMatchPassed(party.date)
      });
    });

    // Trier par date (du plus récent au plus ancien)
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Fonction pour formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // Fonction pour copier au presse-papier
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Adresse copiée !');
      })
      .catch(err => {
        console.error('Erreur lors de la copie : ', err);
      });
  };

  // Fonction pour centrer la carte sur un événement
  const centerOnEvent = (eventId: string) => {
    setSelectedEvent(eventId);
    
    // Trouver l'événement correspondant
    const allEvents = getAllEvents();
    const event = allEvents.find(e => e.id === eventId);
    
    if (event) {
      // Extraire les coordonnées
      const [lat, lng] = event.location;
      
      // Centrer la carte
      if (mapRef.current) {
        mapRef.current.flyTo([lat, lng], 16);
      }
      
      // Ouvrir le popup correspondant
      if (event.type === 'match') {
        const [_, venueId, matchId] = eventId.split('-');
        const marker = markersRef.current.find(m => {
          const venue = venues.find(v => v.id === venueId);
          return venue && m.getLatLng().lat === venue.latitude && m.getLatLng().lng === venue.longitude;
        });
        
        if (marker) {
          marker.openPopup();
        }
      } else if (event.type === 'party') {
        const [_, partyId] = eventId.split('-');
        const party = parties.find(p => p.id === partyId || p.name === partyId);
        
        if (party) {
          const marker = markersRef.current.find(m => 
            m.getLatLng().lat === party.latitude && m.getLatLng().lng === party.longitude
          );
          
          if (marker) {
            marker.openPopup();
          }
        }
      }
    }
    
    // Basculer vers l'onglet carte
    setActiveTab('map');
  };

  // Générer les marqueurs pour la carte
  useEffect(() => {
    if (!locationError && mapRef.current) {
      // Nettoyer les marqueurs existants
      markersRef.current.forEach(marker => {
        marker.remove();
      });
      markersRef.current = [];

      // Ajouter les marqueurs pour les lieux
      venues.forEach(venue => {
        const markerColor = getMarkerColor(venue.date);
        const marker = L.marker([venue.latitude, venue.longitude], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-content" style="background-color: ${markerColor.color}; color: white; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
                     <span style="font-size: 20px; line-height: 1; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">${getSportIcon(venue.sport)}</span>
                   </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
          })
        });

        // Créer le contenu du popup
        const popupContent = document.createElement('div');
        popupContent.className = 'venue-popup';
        
        // Contenu de base du lieu
        popupContent.innerHTML = `
          <h3>${venue.name}</h3>
          <p>${venue.description}</p>
          <p><strong>Sport:</strong> ${venue.sport}</p>
          <p class="venue-address">${venue.address || `${venue.latitude}, ${venue.longitude}`}</p>
        `;

        // Boutons d'actions
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'popup-buttons';
        
        // Bouton Google Maps
        const mapsButton = document.createElement('button');
        mapsButton.className = 'maps-button';
        mapsButton.textContent = 'Ouvrir dans Google Maps';
        mapsButton.addEventListener('click', () => {
          openInGoogleMaps(venue);
        });
        buttonsContainer.appendChild(mapsButton);
        
        // Bouton Copier l'adresse
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copier l\'adresse';
        copyButton.addEventListener('click', () => {
          copyToClipboard(venue.address || `${venue.latitude},${venue.longitude}`);
        });
        buttonsContainer.appendChild(copyButton);
        
        popupContent.appendChild(buttonsContainer);

        // Liste des matchs
        if (venue.matches && venue.matches.length > 0) {
          const matchesListDiv = document.createElement('div');
          matchesListDiv.className = 'matches-list';
          matchesListDiv.innerHTML = '<h4>Matchs à venir :</h4>';
          
          venue.matches.forEach(match => {
            const matchItemDiv = document.createElement('div');
            matchItemDiv.className = 'match-item';
            
            // Contenu du match
            matchItemDiv.innerHTML = `
              <p class="match-date">${new Date(match.date).toLocaleString()}</p>
              <p class="match-teams">${match.teams}</p>
              <p class="match-description">${match.description}</p>
            `;
            
            // Boutons d'édition en mode édition
            if (isEditing) {
              const matchActionsDiv = document.createElement('div');
              matchActionsDiv.className = 'match-actions';
              
              const editButton = document.createElement('button');
              editButton.className = 'edit-match-button';
              editButton.textContent = 'Modifier';
              editButton.addEventListener('click', (e) => {
                e.stopPropagation();
                startEditingMatch(venue.id || '', match);
              });
              
              const deleteButton = document.createElement('button');
              deleteButton.className = 'delete-match-button';
              deleteButton.textContent = 'Supprimer';
              deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteMatch(venue.id || '', match.id);
              });
              
              matchActionsDiv.appendChild(editButton);
              matchActionsDiv.appendChild(deleteButton);
              matchItemDiv.appendChild(matchActionsDiv);
            }
            
            matchesListDiv.appendChild(matchItemDiv);
          });
          
          popupContent.appendChild(matchesListDiv);
        }

        // Ajouter les boutons d'édition si on est en mode édition
        if (isEditing) {
          // Boutons d'édition
          const editButtonsContainer = document.createElement('div');
          editButtonsContainer.className = 'popup-buttons';
          
          // Bouton pour ajouter un match
          const addMatchButton = document.createElement('button');
          addMatchButton.className = 'add-match-button';
          addMatchButton.textContent = 'Ajouter un match';
          addMatchButton.addEventListener('click', (e) => {
            e.stopPropagation();
            startEditingMatch(venue.id || '', null);
          });
          editButtonsContainer.appendChild(addMatchButton);
          
          // Bouton Modifier
          const editButton = document.createElement('button');
          editButton.className = 'edit-button';
          editButton.textContent = 'Modifier ce lieu';
          editButton.addEventListener('click', () => {
            startEditingVenue(venue);
          });
          editButtonsContainer.appendChild(editButton);
          
          // Bouton Supprimer
          const deleteButton = document.createElement('button');
          deleteButton.className = 'delete-button';
          deleteButton.textContent = 'Supprimer ce lieu';
          deleteButton.addEventListener('click', () => {
            deleteVenue(venue.id || '');
          });
          editButtonsContainer.appendChild(deleteButton);
          
          popupContent.appendChild(editButtonsContainer);
        }

        marker.bindPopup(popupContent);
        
        marker.on('click', () => {
          handlePopupOpen(venue.id || '');
        });

        if (mapRef.current) {
          marker.addTo(mapRef.current);
          markersRef.current.push(marker);
        }
      });

      // Ajouter les marqueurs pour les hôtels
      hotels.forEach(hotel => {
        const marker = L.marker([hotel.latitude, hotel.longitude], {
          icon: L.divIcon({
            className: 'custom-marker hotel-marker',
            html: `<div style="background-color: #1976D2; color: white; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
                     <span style="font-size: 20px; line-height: 1; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">🏨</span>
                   </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
          })
        });

        // Créer le contenu du popup pour l'hôtel
        const popupContent = document.createElement('div');
        popupContent.className = 'venue-popup';
        
        // Contenu de base de l'hôtel
        popupContent.innerHTML = `
          <h3>${hotel.name}</h3>
          <p>${hotel.description}</p>
          <p class="venue-address">${hotel.address}</p>
        `;
        
        // Boutons d'actions
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'popup-buttons';
        
        // Bouton Google Maps
        const mapsButton = document.createElement('button');
        mapsButton.className = 'maps-button';
        mapsButton.textContent = 'Ouvrir dans Google Maps';
        mapsButton.addEventListener('click', () => {
          openInGoogleMaps(hotel);
        });
        buttonsContainer.appendChild(mapsButton);
        
        // Bouton Copier l'adresse
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copier l\'adresse';
        copyButton.addEventListener('click', () => {
          copyToClipboard(hotel.address || `${hotel.latitude},${hotel.longitude}`);
        });
        buttonsContainer.appendChild(copyButton);
        
        popupContent.appendChild(buttonsContainer);

        marker.bindPopup(popupContent);
        
        if (mapRef.current) {
          marker.addTo(mapRef.current);
          markersRef.current.push(marker);
        }
      });

      // Ajouter les marqueurs pour les soirées
      parties.forEach(party => {
        const marker = L.marker([party.latitude, party.longitude], {
          icon: L.divIcon({
            className: 'custom-marker party-marker',
            html: `<div style="background-color: #9C27B0; color: white; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
                     <span style="font-size: 20px; line-height: 1; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">${party.sport === 'Pompom' ? '🎀' : '🎉'}</span>
                   </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
          })
        });

        // Créer le contenu du popup pour la soirée
        const popupContent = document.createElement('div');
        popupContent.className = 'venue-popup';
        
        // Contenu de base de la soirée
        popupContent.innerHTML = `
          <h3>${party.name}</h3>
          <p>${party.description}</p>
          <p class="venue-address">${party.address}</p>
        `;
        
        // Boutons d'actions
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'popup-buttons';
        
        // Bouton Google Maps
        const mapsButton = document.createElement('button');
        mapsButton.className = 'maps-button';
        mapsButton.textContent = 'Ouvrir dans Google Maps';
        mapsButton.addEventListener('click', () => {
          openInGoogleMaps(party);
        });
        buttonsContainer.appendChild(mapsButton);
        
        // Bouton Copier l'adresse
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copier l\'adresse';
        copyButton.addEventListener('click', () => {
          copyToClipboard(party.address || `${party.latitude},${party.longitude}`);
        });
        buttonsContainer.appendChild(copyButton);
        
        popupContent.appendChild(buttonsContainer);

        marker.bindPopup(popupContent);
        
        if (mapRef.current) {
          marker.addTo(mapRef.current);
          markersRef.current.push(marker);
        }
      });
    }
  }, [venues, hotels, parties, isEditing]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>CumMap</h1>
        <div className="controls">
          {!isEditing && activeTab === 'map' && (
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
                setEditingVenue({ id: null, venue: null });
              }
            }}
          >
            {isEditing ? 'Terminer l\'édition' : 'Mode édition'}
          </button>
          {isEditing && (
            <button 
              className="add-place-button"
              onClick={() => {
                setIsAddingPlace(true);
                setEditingVenue({ id: null, venue: null });
                setNewVenueName('');
                setNewVenueDescription('');
                setNewVenueAddress('');
                setSelectedSport('Football');
              }}
            >
              Ajouter un lieu
            </button>
          )}
          {(isAddingPlace || editingVenue.id) && (
            <div className="edit-form">
              <div className="edit-form-header">
                <h3>{editingVenue.id ? 'Modifier le lieu' : 'Ajouter un nouveau lieu'}</h3>
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
                    placeholder="Entrez l'adresse complète"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="venue-sport">Sport</label>
                  <select
                    id="venue-sport"
                    value={selectedSport}
                    onChange={(e) => {
                      setSelectedSport(e.target.value);
                      setSelectedEmoji(sportEmojis[e.target.value] || '⚽');
                    }}
                    className="form-input"
                  >
                    <option value="Football">Football ⚽</option>
                    <option value="Basketball">Basketball 🏀</option>
                    <option value="Handball">Handball 🤾</option>
                    <option value="Rugby">Rugby 🏉</option>
                    <option value="Volleyball">Volleyball 🏐</option>
                    <option value="Tennis">Tennis 🎾</option>
                    <option value="Badminton">Badminton 🏸</option>
                    <option value="Hockey">Hockey 🏑</option>
                    <option value="Base-ball">Base-ball ⚾</option>
                    <option value="Golf">Golf ⛳</option>
                    <option value="Ping-pong">Ping-pong 🏓</option>
                    <option value="Other">Autre 🎯</option>
                  </select>
                </div>
                <div className="form-group emoji-preview">
                  <label>Emoji sélectionné</label>
                  <div className="selected-emoji">{selectedEmoji}</div>
                </div>
                <div className="form-actions">
                  <button 
                    className="add-button"
                    onClick={() => {
                      if (editingVenue.id) {
                        handleUpdateVenue();
                      } else {
                        handleAddVenue();
                      }
                    }}
                    disabled={!newVenueName || !newVenueDescription}
                  >
                    {editingVenue.id ? 'Mettre à jour' : 'Ajouter'}
                  </button>
                  <button 
                    className="cancel-button"
                    onClick={() => {
                      if (editingVenue.id) {
                        cancelEditingVenue();
                      } else {
                        setIsAddingPlace(false);
                        setNewVenueName('');
                        setNewVenueDescription('');
                        setNewVenueAddress('');
                        setSelectedSport('Football');
                      }
                    }}
                  >
                    Annuler
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
          <div className="map-container">
        <MapContainer
          center={[48.8566, 2.3522]}
          zoom={12}
              style={{ height: '100%', width: '100%' }}
              ref={(map) => { mapRef.current = map || null; }}
              zoomControl={false}
        >
          <TileLayer
                url={mapStyles[mapStyle as keyof typeof mapStyles].url}
                attribution={mapStyles[mapStyle as keyof typeof mapStyles].attribution}
          />
          <LocationMarker />
              <div className="leaflet-control-container">
                <div className="leaflet-top leaflet-right">
                  <div className="leaflet-control-zoom leaflet-bar leaflet-control">
                    <a className="leaflet-control-zoom-in" href="#" title="Zoom in" role="button" aria-label="Zoom in" onClick={(e) => {
                      e.preventDefault();
                      mapRef.current?.zoomIn();
                    }}>+</a>
                    <a className="leaflet-control-zoom-out" href="#" title="Zoom out" role="button" aria-label="Zoom out" onClick={(e) => {
                      e.preventDefault();
                      mapRef.current?.zoomOut();
                    }}>−</a>
                  </div>
                </div>
              </div>
            </MapContainer>
            
            {/* Bouton flottant pour afficher les événements */}
            <button 
              className={`events-toggle-button ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab(activeTab === 'map' ? 'events' : 'map')}
            >
              {activeTab === 'map' ? '📆 Événements' : '✖️ Fermer'}
                  </button>
            
            {activeTab === 'events' && (
              <div className="events-panel">
                <h2>Événements à venir</h2>
                <div className="events-list">
                  {getAllEvents().map(event => (
                    <div 
                      key={event.id} 
                      className={`event-item ${event.isPassed ? 'passed' : ''} ${event.type === 'match' ? 'match-event' : 'party-event'} ${selectedEvent === event.id ? 'selected' : ''}`}
                      onClick={() => centerOnEvent(event.id)}
                    >
                      <div className="event-header">
                        <span className="event-type-badge">
                          {event.type === 'match' ? '🏆 Match' : '🎉 Soirée'}
                        </span>
                        <span className="event-date">{formatDate(event.date)}</span>
                      </div>
                      <div className="event-title-container">
                        {event.type === 'match' && venues.find(v => v.name === event.venue) && (
                          <span className="event-sport-icon">
                            {getSportIcon(venues.find(v => v.name === event.venue)?.sport || '')}
                          </span>
                        )}
                        <h3 className="event-name">{event.name}</h3>
                      </div>
                      {event.type === 'match' && event.venue && (
                        <p className="event-venue">Lieu: {event.venue}</p>
                      )}
                      <p className="event-description">{event.description}</p>
                      <p className="event-address">{event.address}</p>
                      <div className="event-actions">
                                <button 
                          className="maps-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`, '_blank');
                                  }}
                                >
                          Ouvrir dans Google Maps
                                </button>
                                <button 
                          className="copy-button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                            copyToClipboard(event.address);
                                  }}
                                >
                          Copier l'adresse
                                </button>
                      </div>
                        </div>
                      ))}
                </div>
                    </div>
                  )}
                    </div>
                  )}
      </main>

      {/* Formulaire d'ajout/modification de match */}
      {editingMatch.venueId && (
        <div className="edit-form">
          <div className="edit-form-header">
            <h3>{editingMatch.match ? 'Modifier le match' : 'Ajouter un match'}</h3>
          </div>
          <div className="edit-form-content">
            <div className="form-group">
              <label htmlFor="match-date">Date et heure</label>
                          <input
                id="match-date"
                            type="datetime-local"
                value={editingMatch.match ? editingMatch.match.date : newMatch.date}
                onChange={(e) => {
                  if (editingMatch.match) {
                    // Modification d'un match existant
                    const updatedMatch = { ...editingMatch.match, date: e.target.value };
                    setEditingMatch({ ...editingMatch, match: updatedMatch });
                  } else {
                    // Création d'un nouveau match
                    setNewMatch({ ...newMatch, date: e.target.value });
                  }
                }}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="match-teams">Équipes</label>
                          <input
                id="match-teams"
                            type="text"
                value={editingMatch.match ? editingMatch.match.teams : newMatch.teams}
                onChange={(e) => {
                  if (editingMatch.match) {
                    // Modification d'un match existant
                    const updatedMatch = { ...editingMatch.match, teams: e.target.value };
                    setEditingMatch({ ...editingMatch, match: updatedMatch });
                  } else {
                    // Création d'un nouveau match
                    setNewMatch({ ...newMatch, teams: e.target.value });
                  }
                }}
                placeholder="Ex: France vs Brésil"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="match-description">Description</label>
                          <input
                id="match-description"
                            type="text"
                value={editingMatch.match ? editingMatch.match.description : newMatch.description}
                onChange={(e) => {
                  if (editingMatch.match) {
                    // Modification d'un match existant
                    const updatedMatch = { ...editingMatch.match, description: e.target.value };
                    setEditingMatch({ ...editingMatch, match: updatedMatch });
                  } else {
                    // Création d'un nouveau match
                    setNewMatch({ ...newMatch, description: e.target.value });
                  }
                }}
                placeholder="Ex: Match de qualification"
                className="form-input"
              />
            </div>
            <div className="form-actions">
                            <button 
                className="add-button"
                onClick={() => {
                  if (editingMatch.match) {
                    // Mettre à jour un match existant
                    handleUpdateMatch(
                      editingMatch.venueId!, 
                      editingMatch.match.id, 
                      {
                        date: editingMatch.match.date,
                        teams: editingMatch.match.teams,
                        description: editingMatch.match.description
                      }
                    );
                  } else {
                    // Ajouter un nouveau match
                    handleAddMatch(editingMatch.venueId!);
                  }
                }}
                disabled={
                  editingMatch.match 
                    ? !editingMatch.match.date || !editingMatch.match.teams || !editingMatch.match.description
                    : !newMatch.date || !newMatch.teams || !newMatch.description
                }
              >
                {editingMatch.match ? 'Mettre à jour' : 'Ajouter'}
                            </button>
                            <button 
                              className="cancel-button"
                onClick={finishEditingMatch}
                            >
                              Annuler
                            </button>
                          </div>
                          </div>
                        </div>
      )}
    </div>
  );
}

export default App;
