import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLng } from 'leaflet';
import { useState, useEffect, useRef } from 'react';
import './App.css';
import { ref, onValue, set, push } from 'firebase/database';
import { db } from './firebase';
import React from 'react';
import L from 'leaflet';
import ReactGA from 'react-ga4';

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

// Interface pour les actions d'historique
interface HistoryAction {
  type: 'ADD_VENUE' | 'UPDATE_VENUE' | 'DELETE_VENUE' | 'ADD_MATCH' | 'UPDATE_MATCH' | 'DELETE_MATCH';
  data: any;
  undo: () => Promise<void>;
}

// Initialiser Google Analytics correctement avec debugging
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXX';
console.log('[GA] ID de mesure utilisé:', GA_MEASUREMENT_ID);

// Configuration avec mode test activé pour la validation
ReactGA.initialize(GA_MEASUREMENT_ID, {
  testMode: process.env.NODE_ENV !== 'production',
  gaOptions: {
    sendPageView: false // Nous enverrons manuellement le pageview
  }
});

// Afficher explicitement l'objet ReactGA pour le déboggage
console.log('[GA] Objet ReactGA:', ReactGA);

// Envoyer un événement test pour vérifier la connexion
ReactGA.event({
  category: 'testing',
  action: 'ga_test',
  label: 'Validation de connexion GA4'
});

console.log('[GA] Google Analytics initialisé en mode test');

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
  
  // Déterminer le mode d'accès (admin ou visiteur) en fonction de l'URL
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  
  useEffect(() => {
    // Vérifier si l'URL contient un paramètre 'mode=admin'
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    setIsAdminMode(mode === 'admin');
    
    // Par défaut, le mode édition est désactivé
    setIsEditing(false);
  }, []);
  
  const [hotels, setHotels] = useState<Venue[]>([
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
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [editingVenue, setEditingVenue] = useState<{ id: string | null, venue: Venue | null }>({ id: null, venue: null });
  const [selectedEmoji, setSelectedEmoji] = useState('⚽');
  const [eventFilter, setEventFilter] = useState<string>('all'); // Nouvel état pour le filtre
  
  // État pour l'historique des actions et l'index actuel
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

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
    Ultimate: '🥏',
    Natation: '🏊',
    Trail: '🏃',
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
    const sportIcons: { [key: string]: string } = {
      'Football': '⚽',
      'Basketball': '🏀',
      'Handball': '🤾',
      'Rugby': '🏉',
      'Ultimate': '🥏',
      'Natation': '🏊',
      'Badminton': '🏸',
      'Tennis': '🎾',
      'Trail': '🏃'
    };
    return sportIcons[sport] || '🏆';
  };

  // Fonction pour vérifier les droits d'administration avant d'exécuter une action
  const checkAdminRights = () => {
    // En mode développement, toujours retourner true
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    
    // En production, vérifier le mot de passe
    const password = prompt('Entrez le mot de passe admin:');
    return password === 'admin';
  };

  // Fonction pour ajouter une action à l'historique
  const addToHistory = (action: HistoryAction) => {
    // Supprimer les actions futures (si on est revenu en arrière)
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(action);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Fonction pour annuler la dernière action
  const undoLastAction = async () => {
    if (historyIndex >= 0) {
      const action = history[historyIndex];
      await action.undo();
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Fonction pour refaire la dernière action annulée
  const redoLastAction = async () => {
    if (historyIndex < history.length - 1) {
      const nextAction = history[historyIndex + 1];
      
      // Recréer l'action en fonction du type
      switch (nextAction.type) {
        case 'ADD_VENUE':
          // Ré-ajouter le lieu
          {
            const venueData = nextAction.data;
            const venueRef = ref(db, `venues/${venueData.id}`);
            await set(venueRef, {
              name: venueData.name,
              position: [venueData.latitude, venueData.longitude],
              description: venueData.description,
              address: venueData.address,
              matches: venueData.matches || [],
              sport: venueData.sport,
              date: venueData.date,
              latitude: venueData.latitude,
              longitude: venueData.longitude
            });
          }
          break;
        case 'UPDATE_VENUE':
          // Réappliquer la mise à jour
          {
            const { after } = nextAction.data;
            const venueRef = ref(db, `venues/${after.id}`);
            await set(venueRef, after);
          }
          break;
        case 'DELETE_VENUE':
          // Supprimer à nouveau le lieu
          {
            const venueData = nextAction.data;
            const venueRef = ref(db, `venues/${venueData.id}`);
            await set(venueRef, null);
          }
          break;
        case 'ADD_MATCH':
          // Ré-ajouter le match
          {
            const { venueId, match } = nextAction.data;
            const venue = venues.find(v => v.id === venueId);
            if (venue) {
              const matches = [...(venue.matches || [])];
              // Vérifier si le match existe déjà pour éviter les doublons
              if (!matches.some(m => m.id === match.id)) {
                matches.push(match);
                const venueRef = ref(db, `venues/${venueId}`);
                await set(venueRef, {
                  ...venue,
                  matches
                });
              }
            }
          }
          break;
        case 'UPDATE_MATCH':
          // Réappliquer la mise à jour du match
          {
            const { venueId, matchId, after } = nextAction.data;
            const venue = venues.find(v => v.id === venueId);
            if (venue) {
              const updatedMatches = venue.matches.map(match =>
                match.id === matchId ? { ...match, ...after } : match
              );
              const venueRef = ref(db, `venues/${venueId}`);
              await set(venueRef, {
                ...venue,
                matches: updatedMatches
              });
            }
          }
          break;
        case 'DELETE_MATCH':
          // Supprimer à nouveau le match
          {
            const { venueId, match } = nextAction.data;
            const venue = venues.find(v => v.id === venueId);
            if (venue) {
              const updatedMatches = venue.matches.filter(m => m.id !== match.id);
              const venueRef = ref(db, `venues/${venueId}`);
              await set(venueRef, {
                ...venue,
                matches: updatedMatches
              });
            }
          }
          break;
      }
      
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Gestionnaire d'événements pour écouter Ctrl+Z (undo) et Shift+Ctrl+Z (redo)
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      // Ctrl+Z ou Cmd+Z (Mac) pour annuler
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        await undoLastAction();
      }
      
      // Shift+Ctrl+Z ou Shift+Cmd+Z (Mac) pour refaire
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        await redoLastAction();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [history, historyIndex, venues]);

  // Fonction pour ajouter un nouveau lieu
  const handleAddVenue = async () => {
    if (!newVenueName || !newVenueDescription || !newVenueAddress) {
      return;
    }

      const coordinates = await geocodeAddress(newVenueAddress);
    if (!coordinates) {
      alert('Adresse non trouvée. Veuillez vérifier l\'adresse saisie.');
      return;
    }

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
      
      // Ajouter l'action à l'historique avec une fonction d'annulation
      const venueId = newVenueRef.key || '';
      addToHistory({
        type: 'ADD_VENUE',
        data: { ...newVenue, id: venueId },
        undo: async () => {
          const undoRef = ref(db, `venues/${venueId}`);
          await set(undoRef, null);
        }
      });
      
        setNewVenueName('');
        setNewVenueDescription('');
        setNewVenueAddress('');
      setSelectedSport('Football');
      // Fermer le formulaire d'ajout après avoir ajouté le lieu
      setIsAddingPlace(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du lieu:', error);
      alert('Une erreur est survenue lors de l\'ajout du lieu.');
    }
  };

  // Fonction pour supprimer un lieu
  const deleteVenue = async (id: string) => {
    // Demander confirmation avant la suppression
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lieu ? Cette action est irréversible.')) {
      return;
    }
    
    // Sauvegarder l'état du lieu avant suppression pour pouvoir annuler
    const venue = venues.find(v => v.id === id);
    if (venue) {
      const venueRef = ref(db, `venues/${id}`);
      await set(venueRef, null);
      
      // Ajouter l'action à l'historique avec une fonction d'annulation
      addToHistory({
        type: 'DELETE_VENUE',
        data: venue,
        undo: async () => {
          const undoRef = ref(db, `venues/${id}`);
          await set(undoRef, {
            name: venue.name,
            position: [venue.latitude, venue.longitude],
            description: venue.description,
            address: venue.address,
            matches: venue.matches || [],
            sport: venue.sport,
            date: venue.date,
            latitude: venue.latitude,
            longitude: venue.longitude
          });
        }
      });
      
    setSelectedVenue(null);
    }
  };

  // Fonction pour ajouter un nouveau match
  const handleAddMatch = async (venueId: string) => {
    if (!checkAdminRights()) return;
    
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
        
        try {
          const venueBefore = { ...venue };
          await set(venueRef, {
            ...venue,
            matches
          });
          
          // Ajouter l'action à l'historique avec une fonction d'annulation
          addToHistory({
            type: 'ADD_MATCH',
            data: { venueId, match: newMatchWithId },
            undo: async () => {
              const undoRef = ref(db, `venues/${venueId}`);
              await set(undoRef, venueBefore);
            }
          });
          
      setNewMatch({ date: '', teams: '', description: '' });
          // Fermer uniquement le formulaire d'édition du match
          setEditingMatch({ venueId: null, match: null });
          // Conserver l'état du popup ouvert pour voir le match ajouté
          setOpenPopup(venueId);
          
          // Forcer le rechargement du popup pour afficher le nouveau match
          const marker = markersRef.current.find(m => 
            m.getLatLng().lat === venue.latitude && m.getLatLng().lng === venue.longitude
          );
          
          if (marker) {
            // Fermer puis rouvrir le popup pour actualiser son contenu
            setTimeout(() => {
              marker.openPopup();
            }, 300);
          }
        } catch (error) {
          console.error('Erreur lors de l\'ajout du match:', error);
          alert('Une erreur est survenue lors de l\'ajout du match.');
        }
      }
    }
  };

  // Fonction pour mettre à jour un match
  const handleUpdateMatch = async (venueId: string, matchId: number, updatedData: Partial<Match>) => {
    if (!checkAdminRights()) return;
    
    const venueRef = ref(db, `venues/${venueId}`);
    const venue = venues.find(v => v.id === venueId);
    
    if (venue) {
      // Sauvegarder l'état avant modification pour pouvoir annuler
      const venueBefore = { ...venue };
      const matchBefore = venue.matches.find(m => m.id === matchId);
      
      const updatedMatches = venue.matches.map(match =>
            match.id === matchId ? { ...match, ...updatedData } : match
      );
      
      try {
        await set(venueRef, {
          ...venue,
          matches: updatedMatches
        });
        
        // Ajouter l'action à l'historique avec une fonction d'annulation
        if (matchBefore) {
          addToHistory({
            type: 'UPDATE_MATCH',
            data: { venueId, matchId, before: matchBefore, after: { ...matchBefore, ...updatedData } },
            undo: async () => {
              const undoRef = ref(db, `venues/${venueId}`);
              await set(undoRef, venueBefore);
            }
          });
        }
        
        // Maintenir le popup ouvert après la mise à jour
        setOpenPopup(venueId);
        
        // Forcer le rechargement du popup pour afficher les modifications
        const marker = markersRef.current.find(m => 
          m.getLatLng().lat === venue.latitude && m.getLatLng().lng === venue.longitude
        );
        
        if (marker) {
          // Fermer puis rouvrir le popup pour actualiser son contenu
          setTimeout(() => {
            marker.openPopup();
          }, 300);
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour du match:', error);
        alert('Une erreur est survenue lors de la mise à jour du match.');
      }
    }
  };

  // Fonction pour supprimer un match
  const deleteMatch = async (venueId: string, matchId: number) => {
    // Demander confirmation avant la suppression
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce match ? Cette action est irréversible.')) {
      return;
    }
    
    const venueRef = ref(db, `venues/${venueId}`);
    const venue = venues.find(v => v.id === venueId);
    
    if (venue) {
      // Sauvegarder l'état avant suppression pour pouvoir annuler
      const venueBefore = { ...venue };
      const matchToDelete = venue.matches.find(m => m.id === matchId);
      
      const updatedMatches = venue.matches.filter(match => match.id !== matchId);
      await set(venueRef, {
        ...venue,
        matches: updatedMatches
      });
      
      // Ajouter l'action à l'historique avec une fonction d'annulation
      if (matchToDelete) {
        addToHistory({
          type: 'DELETE_MATCH',
          data: { venueId, match: matchToDelete },
          undo: async () => {
            const undoRef = ref(db, `venues/${venueId}`);
            await set(undoRef, venueBefore);
          }
        });
      }
    }
  };

  // Fonction pour mettre à jour un lieu existant
  const handleUpdateVenue = async () => {
    if (!checkAdminRights()) return;
    
    if (editingVenue.id && newVenueName && newVenueDescription) {
      // Trouver le lieu dans la liste
      const venue = venues.find(v => v.id === editingVenue.id);
      
      if (venue) {
        // Sauvegarder l'état avant modification pour pouvoir annuler
        const venueBefore = { ...venue };
        const venueRef = ref(db, `venues/${editingVenue.id}`);
        
        // Si l'adresse a changé, essayer de la géocoder
        if (newVenueAddress !== venue.address) {
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newVenueAddress)}`);
            const data = await response.json();
            
            if (data && data.length > 0) {
              // Mettre à jour avec les nouvelles coordonnées
              const updatedVenue = {
          ...venue,
                name: newVenueName,
                description: newVenueDescription,
                address: newVenueAddress,
                sport: selectedSport,
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                position: [parseFloat(data[0].lat), parseFloat(data[0].lon)]
              };
              
              await set(venueRef, updatedVenue);
              
              // Ajouter l'action à l'historique avec une fonction d'annulation
              addToHistory({
                type: 'UPDATE_VENUE',
                data: { before: venueBefore, after: updatedVenue },
                undo: async () => {
                  const undoRef = ref(db, `venues/${editingVenue.id}`);
                  await set(undoRef, venueBefore);
                }
              });
            } else {
              // Garder les anciennes coordonnées mais mettre à jour les autres informations
              const updatedVenue = {
                ...venue,
                name: newVenueName,
                description: newVenueDescription,
                address: newVenueAddress,
                sport: selectedSport
              };
              
              await set(venueRef, updatedVenue);
              
              // Ajouter l'action à l'historique avec une fonction d'annulation
              addToHistory({
                type: 'UPDATE_VENUE',
                data: { before: venueBefore, after: updatedVenue },
                undo: async () => {
                  const undoRef = ref(db, `venues/${editingVenue.id}`);
                  await set(undoRef, venueBefore);
                }
              });
            }
          } catch (error) {
            console.error('Erreur lors de la géolocalisation de l\'adresse:', error);
            // Mettre à jour sans changer les coordonnées
            const updatedVenue = {
              ...venue,
              name: newVenueName,
              description: newVenueDescription,
              address: newVenueAddress,
              sport: selectedSport
            };
            
            await set(venueRef, updatedVenue);
            
            // Ajouter l'action à l'historique avec une fonction d'annulation
            addToHistory({
              type: 'UPDATE_VENUE',
              data: { before: venueBefore, after: updatedVenue },
              undo: async () => {
                const undoRef = ref(db, `venues/${editingVenue.id}`);
                await set(undoRef, venueBefore);
              }
            });
          }
        } else {
          // Mettre à jour sans changer l'adresse ni les coordonnées
          const updatedVenue = {
            ...venue,
            name: newVenueName,
            description: newVenueDescription,
            sport: selectedSport
          };
          
          await set(venueRef, updatedVenue);
          
          // Ajouter l'action à l'historique avec une fonction d'annulation
          addToHistory({
            type: 'UPDATE_VENUE',
            data: { before: venueBefore, after: updatedVenue },
            undo: async () => {
              const undoRef = ref(db, `venues/${editingVenue.id}`);
              await set(undoRef, venueBefore);
            }
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

  // Fonction pour commencer l'édition d'un lieu
  const startEditingVenue = (venue: Venue) => {
    // Fermer le formulaire d'édition de match s'il est ouvert
    if (editingMatch.venueId) {
      finishEditingMatch();
    }
    
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
      venueId?: string;
      isPassed: boolean;
      sport?: string;
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
            venueId: venue.id,
            isPassed: isMatchPassed(match.date),
            sport: venue.sport
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
        isPassed: isMatchPassed(party.date),
        sport: party.sport
      });
    });

    // Trier par date (du plus récent au plus ancien)
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Fonction pour filtrer les événements
  const getFilteredEvents = () => {
    const allEvents = getAllEvents();
    if (eventFilter === 'all') return allEvents;
    
    return allEvents.filter(event => {
      if (eventFilter === 'party') {
        return event.type === 'party';
      }
      return event.type === 'match' && event.sport === eventFilter;
    });
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
    // Tracker l'ouverture dans Google Maps
    ReactGA.event({
      category: 'navigation',
      action: 'open_google_maps',
      label: venue.name
    });

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
    // Tracker la demande de géolocalisation
    ReactGA.event({
      category: 'location',
      action: 'retry_location'
    });
    
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
  const centerOnEvent = (event: any) => {
    handleEventSelect(event);
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

        // Ajouter les matchs au popup
        const matchesListDiv = document.createElement('div');
        matchesListDiv.className = 'matches-list';
        
        if (venue.matches && venue.matches.length > 0) {
          matchesListDiv.innerHTML = '<h4>Matchs à venir :</h4>';
          
          venue.matches.forEach(match => {
            const matchItemDiv = document.createElement('div');
            matchItemDiv.className = `match-item ${isMatchPassed(match.date) ? 'match-passed' : ''}`;
            matchItemDiv.innerHTML = `
              <p class="match-date">${formatDate(match.date)}</p>
              <p class="match-teams">${match.teams}</p>
              <p class="match-description">${match.description}</p>
            `;
            
            // Boutons d'édition en mode édition - toujours visibles
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

        // Ajouter les boutons d'édition si on est en mode édition - toujours visibles
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

        // Créer le contenu du popup
        const popupContent = document.createElement('div');
        popupContent.className = 'venue-popup';
        
        // Contenu de base de l'hôtel
        popupContent.innerHTML = `
          <h3>${hotel.name}</h3>
          <p>${hotel.description}</p>
          <p class="venue-address">${hotel.address || `${hotel.latitude}, ${hotel.longitude}`}</p>
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
  }, [venues, hotels, parties, isEditing, isAdminMode]);

  // Fonction pour commencer l'édition d'un match
  const startEditingMatch = (venueId: string, match: Match | null) => {
    // Fermer le formulaire d'édition de lieu s'il est ouvert
    if (editingVenue.id || isAddingPlace) {
      setEditingVenue({ id: null, venue: null });
      setIsAddingPlace(false);
    }
    
    setEditingMatch({ venueId, match });
    
    if (match) {
      setNewMatch({
        date: match.date,
        teams: match.teams,
        description: match.description
      });
    } else {
      setNewMatch({ date: '', teams: '', description: '' });
    }
  };

  // Fonction pour terminer l'édition d'un match
  const finishEditingMatch = () => {
    setEditingMatch({ venueId: null, match: null });
  };

  // Enregistrer la visite de la page au chargement
  useEffect(() => {
    // Forcer l'envoi d'un pageview après un court délai pour assurer le chargement complet
    setTimeout(() => {
      console.log('[GA] Envoi du pageview à Google Analytics');
      ReactGA.send({ 
        hitType: "pageview", 
        page: window.location.pathname + window.location.search
      });
      console.log('[GA] Pageview envoyé');
      
      // Forcer un événement pour tester la connexion
      ReactGA.event({
        category: 'page',
        action: 'view',
        label: window.location.pathname
      });
    }, 1000);
    
    // Fonction pour enregistrer les événements personnalisés
    const trackEvent = (category: string, action: string) => {
      console.log(`[GA] Envoi d'événement: ${category}/${action}`);
      ReactGA.event({
        category,
        action
      });
    };

    // Tracker l'événement "app_loaded"
    trackEvent('app', 'app_loaded');
    
    return () => {
      // Tracker l'événement quand l'utilisateur quitte
      trackEvent('app', 'app_closed');
    };
  }, []);

  // Fonction pour mettre à jour les marqueurs sur la carte
  const updateMapMarkers = () => {
    if (!mapRef.current) return;

    // Récupérer tous les marqueurs existants
    const allMarkers = markersRef.current;
    const filteredEvents = getFilteredEvents();

    // Mettre à jour la visibilité de chaque marqueur
    allMarkers.forEach(marker => {
      const markerElement = marker.getElement();
      if (markerElement) {
        // Trouver l'événement correspondant au marqueur
        const event = filteredEvents.find(event => {
          const [lat, lng] = event.location;
          const markerLatLng = marker.getLatLng();
          return lat === markerLatLng.lat && lng === markerLatLng.lng;
        });

        // Afficher ou cacher le marqueur
        if (event) {
          markerElement.style.display = 'block';
          markerElement.style.opacity = '1';
        } else {
          markerElement.style.display = 'none';
          markerElement.style.opacity = '0';
        }
      }
    });
  };

  // Mettre à jour les marqueurs lorsque le filtre change
  useEffect(() => {
    if (mapRef.current) {
      updateMapMarkers();
    }
  }, [eventFilter]);

  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
    setActiveTab('map'); // Fermer le panneau en revenant à l'onglet map
    
    if (event.type === 'party') {
      const partyId = event.id.split('-')[1];
      const party = parties.find(p => p.id === partyId || p.name === partyId);
      if (party) {
        mapRef.current?.flyTo([party.latitude, party.longitude], 18, {
          duration: 2.5
        });
        const marker = markersRef.current.find(m => 
          m.getLatLng().lat === party.latitude && m.getLatLng().lng === party.longitude
        );
        if (marker) {
          setTimeout(() => {
            marker.openPopup();
          }, 2500);
        }
      }
    } else {
      const venue = venues.find(v => v.id === event.venueId);
      if (venue) {
        mapRef.current?.flyTo([venue.latitude, venue.longitude], 18, {
          duration: 2.5
        });
        const marker = markersRef.current.find(m => 
          m.getLatLng().lat === venue.latitude && m.getLatLng().lng === venue.longitude
        );
        if (marker) {
          setTimeout(() => {
            marker.openPopup();
          }, 2500);
        }
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>CumMap</h1>
        <div className="controls">
          {!isEditing && activeTab === 'map' && (
            <select 
              className="map-style-selector"
              value={mapStyle}
              onChange={(e) => {
                // Tracker le changement de style de carte
                ReactGA.event({
                  category: 'map',
                  action: 'change_map_style',
                  label: e.target.value
                });
                setMapStyle(e.target.value);
              }}
            >
              <option value="osm">OpenStreetMap</option>
              <option value="cyclosm">CyclOSM</option>
              <option value="humanitarian">Humanitarian</option>
              <option value="osmfr">OSM France</option>
            </select>
          )}
          {/* Afficher toujours le bouton d'édition */}
          <button 
            className={`edit-button ${isEditing ? 'active' : ''}`}
            onClick={() => {
              // Tracker le changement de mode édition
              ReactGA.event({
                category: 'app',
                action: 'toggle_edit_mode',
                label: isEditing ? 'off' : 'on'
              });
              
              setIsEditing(!isEditing);
              if (isEditing) {
                setIsAddingPlace(false);
                setEditingVenue({ id: null, venue: null });
              }
            }}
          >
            {isEditing ? 'Terminer l\'édition' : 'Mode édition'}
          </button>
          {/* Afficher toujours le bouton d'ajout de lieu */}
          {isEditing && (
            <button 
              className="add-place-button"
              onClick={() => {
                // Fermer le formulaire d'édition de match s'il est ouvert
                if (editingMatch.venueId) {
                  finishEditingMatch();
                }
                
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
            <div className="form-overlay">
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
                      <option value="Ultimate">Ultimate 🥏</option>
                      <option value="Natation">Natation 🏊</option>
                      <option value="Trail">Trail 🏃</option>
                      <option value="Other">Autre 🎯</option>
                    </select>
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
              onClick={() => {
                // Tracker le changement d'onglet
                ReactGA.event({
                  category: 'navigation',
                  action: 'change_tab',
                  label: activeTab === 'map' ? 'events' : 'map'
                });
                setActiveTab(activeTab === 'map' ? 'events' : 'map');
              }}
            >
              {activeTab === 'map' ? '📆 Événements' : '✖️ Fermer'}
                  </button>
            
            {activeTab === 'events' && (
              <div className="events-panel">
                <div className="events-panel-header">
                  <h3>Événements à venir</h3>
                  <button 
                    className="close-events-button"
                    onClick={() => setActiveTab('map')}
                    title="Fermer le panneau"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div className="event-filters">
                  <select 
                    className="filter-select"
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                  >
                    <option value="all">Tous les événements</option>
                    <option value="party">Soirées</option>
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Handball">Handball</option>
                    <option value="Rugby">Rugby</option>
                    <option value="Ultimate">Ultimate</option>
                    <option value="Natation">Natation</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Trail">Trail</option>
                  </select>
                </div>
                <div className="events-list">
                  {getFilteredEvents().map(event => (
                    <div 
                      key={event.id} 
                      className={`event-item ${event.isPassed ? 'passed' : ''} ${event.type === 'match' ? 'match-event' : 'party-event'} ${selectedEvent?.id === event.id ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedEvent(event);
                        setActiveTab('map'); // Fermer le panneau en revenant à l'onglet map
                        
                        if (event.type === 'party') {
                          const partyId = event.id.split('-')[1];
                          const party = parties.find(p => p.id === partyId || p.name === partyId);
                          if (party) {
                            mapRef.current?.flyTo([party.latitude, party.longitude], 18, {
                              duration: 2.5
                            });
                            const marker = markersRef.current.find(m => 
                              m.getLatLng().lat === party.latitude && m.getLatLng().lng === party.longitude
                            );
                            if (marker) {
                              setTimeout(() => {
                                marker.openPopup();
                              }, 2500);
                            }
                          }
                        } else {
                          const venue = venues.find(v => v.id === event.venueId);
                          if (venue) {
                            mapRef.current?.flyTo([venue.latitude, venue.longitude], 18, {
                              duration: 2.5
                            });
                            const marker = markersRef.current.find(m => 
                              m.getLatLng().lat === venue.latitude && m.getLatLng().lng === venue.longitude
                            );
                            if (marker) {
                              setTimeout(() => {
                                marker.openPopup();
                              }, 2500);
                            }
                          }
                        }
                      }}
                    >
                      <div className="event-header">
                        <span className="event-type-badge">
                          {event.type === 'match' 
                            ? `${getSportIcon(event.sport || '')} Match`
                            : '🎉 Soirée'}
                        </span>
                        <span className="event-date">{formatDate(event.date)}</span>
                      </div>
                      <div className="event-title-container">
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
        <div className="form-overlay">
          <div className="edit-form match-edit-form">
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
                      // Fermer le formulaire après la mise à jour
                      finishEditingMatch();
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
        </div>
      )}
    </div>
  );
}

export default App;
