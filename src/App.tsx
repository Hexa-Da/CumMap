import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLng } from 'leaflet';
import { useState, useEffect, useRef } from 'react';
import './App.css';
import { ref, onValue, set, push } from 'firebase/database';
import { auth, database, provider } from './firebase';
import L from 'leaflet';
import ReactGA from 'react-ga4';
import { v4 as uuidv4 } from 'uuid';
import { onAuthStateChanged, signInWithPopup} from 'firebase/auth';
import favicon from './assets/favicon.svg';
import CalendarPopup from './components/CalendarPopup';

// Vérification de l'initialisation
console.log('Firebase Auth:', auth);
console.log('Google Provider:', provider);

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

interface BaseItem {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  position: [number, number];
  date: string;
  emoji: string;
  sport: string;
}

interface Venue extends BaseItem {
  type: 'venue';
  matches: Match[];
}

interface Match extends BaseItem {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  position: [number, number];
  date: string;
  emoji: string;
  sport: string;
  type: 'match';
  teams: string;
  time: string;
  endTime?: string;
  result?: string;
  venueId: string;
}

interface Hotel extends BaseItem {
  type: 'hotel';
}

interface Restaurant extends BaseItem {
  type: 'restaurant';
  mealType: string; // 'midi' ou 'soir'
}

interface Party extends BaseItem {
  type: 'party';
}

type Place = Venue | Hotel | Party | Restaurant;

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
  const lastErrorTime = useRef<number>(0);

  useEffect(() => {
    if (map) {
      if (!navigator.geolocation) {
        setError("La géolocalisation n'est pas supportée par votre navigateur");
        return;
      }
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
          setError(null);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            // Ne pas afficher d'erreur si refus explicite
            return;
          }
          const now = Date.now();
          if (now - lastErrorTime.current < 3000) {
            // Moins de 3s depuis la dernière erreur, ne pas réafficher
            return;
          }
          lastErrorTime.current = now;
          let errorMessage = "Erreur de géolocalisation";
          switch (err.code) {
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
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPosition = new LatLng(latitude, longitude);
          setPosition(newPosition);
          setError(null);
        },
        (err) => {
          // Ne pas afficher d'erreur pour le watchPosition
        },
        options
      );
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, [map]);

  if (error) {
    return (
      <div className="location-error">
        <p>{error}</p>
        <div className="location-error-buttons">
          <button className="retry-button" onClick={() => {
            setError(null);
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
            Réessayer
          </button>
          <button className="retry-button" onClick={() => setError(null)}>
            Annuler
          </button>
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        
        // Vérifier si l'utilisateur est admin
        const adminsRef = ref(database, 'admins');
        onValue(adminsRef, (snapshot) => {
          const admins = snapshot.val();
          setIsAdmin(admins && admins[user.uid]);
        });
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fonction pour vérifier les droits d'administration avant d'exécuter une action
  const checkAdminRights = () => {
    if (!isAdmin) {
      alert('Cette action nécessite des droits d\'administrateur.');
      return false;
    }
    return true;
  };

  const [hotels] = useState<Hotel[]>([
    {
      id: '1',
      name: "F1 Les Ulis",
      position: [48.6819, 2.1694],
      description: "Hôtel F1 Les Ulis - Courtaboeuf",
      address: "Zi Courtaboeuf, Rue Rio Solado N°2, 91940 Les Ulis",
      type: 'hotel',
      date: '',
      latitude: 48.6819,
      longitude: 2.1694,
      emoji: '🏢',
      sport: 'Hotel'
    },
    {
      id: '2',
      name: "F1 Orly-Rungis",
      position: [48.755812, 2.349089],
      description: "Hôtel F1 Orly-Rungis",
      address: "7 Rue du Pont des Halles, 94150 Rungis",
      type: 'hotel',
      date: '',
      latitude: 48.755812,
      longitude: 2.349089,
      emoji: '🏢',
      sport: 'Hotel'
    }
  ]);

  const [restaurants] = useState<Restaurant[]>([
    {
      id: '1',
      name: "Restaurant Universitaire Châtelet",
      position: [48.841762, 2.348505],
      description: "Repas du soir",
      address: "10 Rue Jean Calvin, 75005 Paris",
      type: 'restaurant',
      date: '',
      latitude: 48.841762,
      longitude: 2.348505,
      emoji: '🍽️',
      sport: 'Restaurant',
      mealType: 'soir'
    },
    {
      id: '2',
      name: "Restaurant Universitaire Bullier",
      position: [48.840057, 2.337497],
      description: "Repas du soir",
      address: "39 Avenue Georges Bernanos, 75005 Paris",
      type: 'restaurant',
      date: '',
      latitude: 48.840057,
      longitude: 2.337497,
      emoji: '🍽️',
      sport: 'Restaurant',
      mealType: 'soir'
    },
    {
      id: '3',
      name: "Cité Internationale Universitaire de Paris",
      position: [48.819303, 2.337373],
      description: "Repas du midi",
      address: "17 Boulevard Jourdan, 75014 Paris",
      type: 'restaurant',
      date: '',
      latitude: 48.819303,
      longitude: 2.337373,
      emoji: '🍽️',
      sport: 'Restaurant',
      mealType: 'midi'
    },
    {
      id: '4',
      name: "Halle Georges Carpentier",
      position: [48.820122, 2.367752],
      description: "Repas du midi",
      address: "81 Bd Masséna, 75013 Paris",
      type: 'restaurant',
      date: '',
      latitude: 48.820122,
      longitude: 2.367752,
      emoji: '🍽️',
      sport: 'Restaurant',
      mealType: 'midi'
    }
  ]);

  const [parties] = useState<Party[]>([
    {
      id: '1',
      name: "La Palmeraie",
      position: [48.8392, 2.2756],
      description: "Soirée Pompoms du 24 au 25 avril 2025, 21h-3h",
      address: "20, rue du Colonel Pierre Avia, 75015 Paris",
      type: 'party',
      date: '2025-04-24T21:00:00',
      latitude: 48.8392,
      longitude: 2.2756,
      emoji: '🎉',
      sport: 'Pompom'
    },
    {
      id: '2',
      name: "Bridge Club",
      position: [48.864579, 2.313845],
      description: "Soirée du 25 au 26 avril 2025, 21h-3h",
      address: "3, Port des Champs-Élysées, 75008 Paris",
      type: 'party',
      date: '2025-04-25T21:00:00',
      latitude: 48.864579,
      longitude: 2.313845,
      emoji: '🎉',
      sport: 'Party'
    },
    {
      id: '3',
      name: "Terminal 7",
      position: [48.8323, 2.2883],
      description: "Soirée du 26 au 27 avril 2025, 22h-4h",
      address: "1, Place de la Porte de Versailles Pavillon 7 - Etage 7.4, 75015 Paris",
      type: 'party',
      date: '2025-04-26T22:00:00',
      latitude: 48.8323,
      longitude: 2.2883,
      emoji: '🎉',
      sport: 'Party'
    },
    {
      id: '4',
      name: "Pantheon",
      position: [48.846451, 2.344851],
      description: "Rendez vous 12h puis départ du Défilé à 13h",
      address: "75006 Paris",
      type: 'party',
      date: '2025-04-24T12:00:00',
      latitude: 48.846451,
      longitude: 2.344851,
      emoji: '🎺',
      sport: 'Defile'
    }
  ]);

  // Charger les lieux depuis Firebase au démarrage
  useEffect(() => {
    const venuesRef = ref(database, 'venues');
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
          longitude: value.position ? value.position[1] : 0,
          emoji: value.emoji || ''
        }));
        setVenues(venuesArray);
      } else {
        setVenues([]); // Si pas de données, initialiser avec un tableau vide
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [newVenueName, setNewVenueName] = useState('');
  const [newVenueDescription, setNewVenueDescription] = useState('');
  const [newVenueAddress, setNewVenueAddress] = useState('');
  const [selectedSport, setSelectedSport] = useState('Football');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [editingMatch, setEditingMatch] = useState<{venueId: string | null, match: Match | null}>({ venueId: null, match: null });
  const [newMatch, setNewMatch] = useState<{date: string, teams: string, description: string, endTime?: string, result?: string}>({
    date: '',
    teams: '',
    description: '',
    result: ''
  });
  const [openPopup, setOpenPopup] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapStyle, setMapStyle] = useState('osm');
  const [activeTab, setActiveTab] = useState<'map' | 'events'>('map');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [editingVenue, setEditingVenue] = useState<{ id: string | null, venue: Venue | null }>({ id: null, venue: null });
  const [selectedEmoji, setSelectedEmoji] = useState('⚽');
  const [eventFilter, setEventFilter] = useState<string>('all'); // Nouvel état pour le filtre
  const [appAction, setAppAction] = useState<number>(0); // Nouvel état pour suivre les actions
  
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
    Cross: '🏃',
    Boxe: '🥊',
    Athlétisme: '🏃‍♂️',
    Pétanque: '🍹',
    Escalade: '🧗‍♂️',
    'Jeux de société': '🎲',
    Other: '🎯',
    Pompom: '🎀',
    Defile: '🎺',
    Party: '🎉',
    Hotel: '🏢',
    Restaurant: '🍽️'
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
      'Cross': '🏃',
      'Volleyball': '🏐',
      'Ping-pong': '🏓',
      'Boxe': '🥊',
      'Athlétisme': '🏃‍♂️',
      'Pétanque': '🍹',
      'Escalade': '🧗‍♂️',
      'Jeux de société': '🎲'
    };
    return sportIcons[sport] || '🏆';
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
            const venueRef = ref(database, `venues/${venueData.id}`);
            await set(venueRef, {
              name: venueData.name,
              position: [venueData.latitude, venueData.longitude],
              description: venueData.description,
              address: venueData.address,
              matches: venueData.matches || [],
              sport: venueData.sport,
              date: venueData.date,
              latitude: venueData.latitude,
              longitude: venueData.longitude,
              emoji: venueData.emoji
            });
          }
          break;
        case 'UPDATE_VENUE':
          // Réappliquer la mise à jour
          {
            const { after } = nextAction.data;
            const venueRef = ref(database, `venues/${after.id}`);
            await set(venueRef, after);
          }
          break;
        case 'DELETE_VENUE':
          // Supprimer à nouveau le lieu
          {
            const venueData = nextAction.data;
            const venueRef = ref(database, `venues/${venueData.id}`);
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
                const venueRef = ref(database, `venues/${venueId}`);
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
              const venueRef = ref(database, `venues/${venueId}`);
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
              const venueRef = ref(database, `venues/${venueId}`);
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

  // Ajouter ces états au début du composant App
  const [tempMarker, setTempMarker] = useState<[number, number] | null>(null);
  const [isPlacingMarker, setIsPlacingMarker] = useState(false);

  // Modifier la fonction qui gère l'ajout d'un lieu
  const handleAddVenue = async () => {
    if (!checkAdminRights()) return;

    if (!newVenueName || !newVenueDescription || (!newVenueAddress && !tempMarker)) {
      alert('Veuillez remplir tous les champs requis ou placer un marqueur sur la carte.');
      return;
    }

    let coordinates: [number, number] | null = null;
    
    if (tempMarker) {
      coordinates = tempMarker;
    } else if (newVenueAddress) {
      coordinates = await geocodeAddress(newVenueAddress);
      if (!coordinates) {
        alert('Adresse non trouvée. Veuillez vérifier l\'adresse saisie ou placer un marqueur sur la carte.');
        return;
      }
    }

    if (!coordinates) {
      alert('Une erreur est survenue lors de la récupération des coordonnées.');
      return;
    }

    const venuesRef = ref(database, 'venues');
    const newVenueRef = push(venuesRef);
    const newVenue: Omit<Venue, 'id'> = {
      name: newVenueName,
      position: coordinates,
      description: newVenueDescription,
      address: newVenueAddress || `${coordinates[0]}, ${coordinates[1]}`,
      matches: [],
      sport: selectedSport,
      date: '',
      latitude: coordinates[0],
      longitude: coordinates[1],
      emoji: selectedEmoji,
      type: 'venue'
    };

    try {
      await set(newVenueRef, newVenue);
      triggerMarkerUpdate(); // Ajouter cette ligne
      
      const venueId = newVenueRef.key || '';
      addToHistory({
        type: 'ADD_VENUE',
        data: { ...newVenue, id: venueId },
        undo: async () => {
          const undoRef = ref(database, `venues/${venueId}`);
          await set(undoRef, null);
        }
      });
      
      setNewVenueName('');
      setNewVenueDescription('');
      setNewVenueAddress('');
      setSelectedSport('Football');
      setTempMarker(null);
      setIsPlacingMarker(false);
      setIsAddingPlace(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du lieu:', error);
      alert('Une erreur est survenue lors de l\'ajout du lieu.');
    }
  };

  // Ajouter le gestionnaire de clic sur la carte
  const handleMapClick = (e: { latlng: { lat: number; lng: number } }) => {
    if (isPlacingMarker) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setTempMarker([lat, lng]);
      // Garder uniquement les coordonnées comme adresse
      setNewVenueAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      
      // Réactiver le formulaire après le placement du marqueur
      setIsPlacingMarker(false);
      setIsAddingPlace(true);
      triggerMarkerUpdate();
    }
  };

  // Fonction pour supprimer un lieu
  const deleteVenue = async (id: string) => {
    if (!checkAdminRights()) return;

    // Demander confirmation avant la suppression
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lieu ? Cette action est irréversible.')) {
      return;
    }
    
    // Sauvegarder l'état du lieu avant suppression pour pouvoir annuler
    const venue = venues.find(v => v.id === id);
    if (venue) {
      const venueRef = ref(database, `venues/${id}`);
      await set(venueRef, null);
      triggerMarkerUpdate(); // Ajouter cette ligne
      
      // Ajouter l'action à l'historique avec une fonction d'annulation
      addToHistory({
        type: 'DELETE_VENUE',
        data: venue,
        undo: async () => {
          const undoRef = ref(database, `venues/${id}`);
          await set(undoRef, {
            name: venue.name,
            position: [venue.latitude, venue.longitude],
            description: venue.description,
            address: venue.address,
            matches: venue.matches || [],
            sport: venue.sport,
            date: venue.date,
            latitude: venue.latitude,
            longitude: venue.longitude,
            emoji: venue.emoji
          });
        }
      });
      
    setSelectedVenue(null);
    }
  };

  // Fonction pour ajouter un nouveau match
  const handleAddMatch = async (venueId: string) => {
    if (!checkAdminRights()) return;

    const venue = venues.find(v => v.id === venueId);
    if (!venue) return;

    if (!newMatch.date || !newMatch.teams || !newMatch.description) {
      alert('Veuillez remplir tous les champs requis (date de début, équipes et description)');
      return;
    }

    const matchId = uuidv4();
    const match: Match = {
      id: matchId,
      name: `${venue.name} - Match`,
      description: newMatch.description,
      address: venue.address,
      latitude: venue.latitude,
      longitude: venue.longitude,
      position: [venue.latitude, venue.longitude],
      date: newMatch.date,
      type: 'match',
      teams: newMatch.teams,
      sport: venue.sport,
      time: new Date(newMatch.date).toTimeString().split(' ')[0],
      endTime: newMatch.endTime || '',
      result: newMatch.result || '',
      venueId: venue.id,
      emoji: venue.emoji
    };

    try {
      const venueRef = ref(database, `venues/${venueId}`);
      const updatedMatches = [...(venue.matches || []), match];
      
      await set(venueRef, {
        ...venue,
        matches: updatedMatches
      });
      triggerMarkerUpdate(); // Ajouter cette ligne
      
      // Ajouter l'action à l'historique
      addToHistory({
        type: 'ADD_MATCH',
        data: { venueId, match },
        undo: async () => {
          const undoRef = ref(database, `venues/${venueId}`);
          await set(undoRef, {
            ...venue,
            matches: venue.matches || []
          });
        }
      });

      // Réinitialiser le formulaire
      setNewMatch({
        date: '',
        teams: '',
        description: '',
        endTime: '',
        result: ''
      });
      setEditingMatch({ venueId: null, match: null });
      setOpenPopup(venueId);

      // Ouvrir le popup du lieu après l'ajout
      const marker = markersRef.current.find(m => 
        m.getLatLng().lat === venue.latitude && m.getLatLng().lng === venue.longitude
      );
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 300);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du match:', error);
      alert('Une erreur est survenue lors de l\'ajout du match.');
    }
  };

  // Fonction pour mettre à jour un match
  const handleUpdateMatch = async (venueId: string, matchId: string, updatedData: Partial<Match>) => {
    if (!checkAdminRights()) return;
    
    const venueRef = ref(database, `venues/${venueId}`);
    const venue = venues.find(v => v.id === venueId);
    
    if (venue) {
      const venueBefore = { ...venue };
      const matchBefore = venue.matches.find(m => m.id === matchId);
      
      const updatedMatches = venue.matches.map(match =>
        match.id === matchId ? { 
          ...match, 
          ...updatedData,
          endTime: updatedData.endTime || '' // Permettre une chaîne vide pour endTime
        } : match
      );
      
      try {
        await set(venueRef, {
          ...venue,
          matches: updatedMatches
        });
        triggerMarkerUpdate(); // Ajouter cette ligne
        
        if (matchBefore) {
          addToHistory({
            type: 'UPDATE_MATCH',
            data: { venueId, matchId, before: matchBefore, after: { ...matchBefore, ...updatedData } },
            undo: async () => {
              const undoRef = ref(database, `venues/${venueId}`);
              await set(undoRef, venueBefore);
            }
          });
        }
        
        setOpenPopup(venueId);
        
        const marker = markersRef.current.find(m => 
          m.getLatLng().lat === venue.latitude && m.getLatLng().lng === venue.longitude
        );
        
        if (marker) {
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
  const deleteMatch = async (venueId: string, matchId: string) => {
    if (!checkAdminRights()) return;

    // Demander confirmation avant la suppression
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce match ? Cette action est irréversible.')) {
      return;
    }
    
    const venueRef = ref(database, `venues/${venueId}`);
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
      triggerMarkerUpdate(); // Ajouter cette ligne
      
      // Ajouter l'action à l'historique avec une fonction d'annulation
      if (matchToDelete) {
        addToHistory({
          type: 'DELETE_MATCH',
          data: { venueId, match: matchToDelete },
          undo: async () => {
            const undoRef = ref(database, `venues/${venueId}`);
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
        const venueRef = ref(database, `venues/${editingVenue.id}`);
        
        // Utiliser les coordonnées du marqueur temporaire si disponible
        const coordinates: [number, number] = tempMarker || [venue.latitude, venue.longitude];
        
        // Créer l'objet de mise à jour
        const updatedVenue = {
          ...venue,
          name: newVenueName,
          description: newVenueDescription,
          address: newVenueAddress || `${coordinates[0].toFixed(6)}, ${coordinates[1].toFixed(6)}`,
          sport: selectedSport,
          latitude: coordinates[0],
          longitude: coordinates[1],
          position: coordinates
        };
        
        try {
          await set(venueRef, updatedVenue);
          triggerMarkerUpdate(); // Ajouter cette ligne
          
          // Ajouter l'action à l'historique avec une fonction d'annulation
          addToHistory({
            type: 'UPDATE_VENUE',
            data: { before: venueBefore, after: updatedVenue },
            undo: async () => {
              const undoRef = ref(database, `venues/${editingVenue.id}`);
              await set(undoRef, venueBefore);
            }
          });
          
          // Réinitialiser le formulaire et l'état d'édition
          setNewVenueName('');
          setNewVenueDescription('');
          setNewVenueAddress('');
          setSelectedSport('Football');
          setTempMarker(null);
          setEditingVenue({ id: null, venue: null });
          setIsAddingPlace(false);
        } catch (error) {
          console.error('Erreur lors de la mise à jour du lieu:', error);
          alert('Une erreur est survenue lors de la mise à jour du lieu.');
        }
      }
    }
  };

  // Fonction pour commencer l'édition d'un lieu
  const startEditingVenue = (venue: Venue) => {
    if (!checkAdminRights()) return;

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
    // Initialiser le marqueur temporaire avec la position actuelle du lieu
    setTempMarker([venue.latitude, venue.longitude]);
    triggerMarkerUpdate();
  };

  // Fonction pour annuler l'édition
  const cancelEditingVenue = () => {
    setEditingVenue({ id: null, venue: null });
    setNewVenueName('');
    setNewVenueDescription('');
    setNewVenueAddress('');
    setSelectedSport('Football');
    setTempMarker(null);
    setIsPlacingMarker(false);
    setIsAddingPlace(false);
    triggerMarkerUpdate();
  };

  // Fonction pour vérifier si un match est passé
  const isMatchPassed = (startDate: string, endTime?: string, type: 'match' | 'party' = 'match') => {
    // Simulation de la date du 25/04 à 16h
    const now = new Date();
    const start = new Date(startDate);
    
    // Si l'événement est dans le futur, il n'est pas passé
    if (start > now) {
      return false;
    }
    
    // Si une heure de fin est spécifiée, l'utiliser
    if (endTime) {
      const end = new Date(endTime);
      return end < now;
    }
    
    // Pour les soirées sans heure de fin, on considère qu'elles se terminent à 23h
    if (type === 'party') {
      const end = new Date(startDate);
      end.setHours(23, 0, 0, 0);
      return end < now;
    }
    
    // Pour les matchs sans heure de fin, on considère qu'ils durent 1h
    const end = new Date(startDate);
    end.setHours(end.getHours() + 1);
    return end < now;
  };

  // Fonction pour récupérer tous les événements (matchs et soirées)
  const getAllEvents = () => {
    const events: Array<{
      id: string;
      name: string;
      date: string;
      endTime?: string;
      description: string;
      address: string;
      location: [number, number];
      type: 'match' | 'party';
      teams?: string;
      venue?: string;
      venueId?: string;
      isPassed: boolean;
      sport?: string;
      result?: string;
    }> = [];

    // Ajouter les matchs
    venues.forEach(venue => {
      if (venue.matches && venue.matches.length > 0) {
        venue.matches.forEach(match => {
          events.push({
            id: `match-${venue.id}-${match.id}`,
            name: match.teams,
            date: match.date,
            endTime: match.endTime,
            description: match.description,
            address: venue.address || `${venue.latitude}, ${venue.longitude}`,
            location: [venue.latitude, venue.longitude],
            type: 'match',
            teams: match.teams,
            venue: venue.name,
            venueId: venue.id,
            isPassed: isMatchPassed(match.date, match.endTime, 'match'),
            sport: venue.sport,
            result: match.result
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
        isPassed: isMatchPassed(party.date, undefined, 'party'),
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
      // Vérifier si le sport de l'événement correspond au filtre
      return event.type === 'match' && event.sport === eventFilter;
    });
  };

  // Fonction pour formater la date et l'heure
  const formatDateTime = (dateString: string, endTimeString?: string) => {
    const date = new Date(dateString);
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const day = days[date.getDay()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    if (endTimeString) {
      const endTime = new Date(endTimeString);
      const endHours = endTime.getHours().toString().padStart(2, '0');
      const endMinutes = endTime.getMinutes().toString().padStart(2, '0');
      return `${day} ${hours}:${minutes} - ${endHours}:${endMinutes}`;
    }
    
    return `${day} ${hours}:${minutes}`;
  };

  // Fonction pour ouvrir dans Google Maps
  const openInGoogleMaps = (place: Place) => {
    // Tracker l'ouverture dans Google Maps
    ReactGA.event({
      category: 'navigation',
      action: 'open_google_maps',
      label: place.name
    });

    const query = encodeURIComponent(place.address || `${place.latitude},${place.longitude}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // Fonction pour gérer l'ouverture des popups
  const handlePopupOpen = (venueId: string) => {
    setOpenPopup(venueId);
    triggerMarkerUpdate();
  };

  const handleLocationSuccess = (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    setUserLocation([latitude, longitude]);
    setLocationError(null);
    setLocationLoading(false);
  };

  const handleLocationError = (error: GeolocationPositionError) => {
    let errorMessage = "Impossible d'obtenir votre position. ";
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "L'accès à la géolocalisation a été refusé. Veuillez autoriser l'accès dans les paramètres de votre navigateur.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "La position n'est pas disponible. Vérifiez que la géolocalisation est activée sur votre appareil.";
        break;
      case error.TIMEOUT:
        errorMessage = "La demande de géolocalisation a expiré. Veuillez réessayer.";
        break;
      default:
        errorMessage = "Une erreur inattendue s'est produite.";
    }
    setLocationError(errorMessage);
    setShowLocationPrompt(true);
  };

  const handleDontAskAgain = () => {
    setShowLocationPrompt(false);
    setLocationError(null);
  };

  const retryLocation = () => {
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      handleLocationSuccess,
      handleLocationError,
      { enableHighAccuracy: true }
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
          
          // Trier les matchs par date
          const sortedMatches = [...venue.matches].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
          
          sortedMatches.forEach(match => {
            const matchItemDiv = document.createElement('div');
            matchItemDiv.className = `match-item ${isMatchPassed(match.date, match.endTime) ? 'match-passed' : ''}`;
            matchItemDiv.innerHTML = `
              <p class="match-date">${formatDateTime(match.date, match.endTime)}</p>
              <p class="match-teams">${match.teams}</p>
              <p class="match-description">${match.description}</p>
              ${match.result ? `<p class="match-result"><strong>Résultat:</strong> ${match.result}</p>` : ''}
            `;
            
            // Boutons d'édition en mode édition - toujours visibles
            if (isEditing && isAdmin) {
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
        } else {
          matchesListDiv.innerHTML = '<p>Aucun match prévu</p>';
          popupContent.appendChild(matchesListDiv);
        }

        // Ajouter les boutons d'édition si on est en mode édition - toujours visibles
        if (isEditing && isAdmin) {
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
                     <span style="font-size: 20px; line-height: 1; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">🏢</span>
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

      // Ajouter les marqueurs pour les restaurants
      restaurants.forEach(restaurant => {
        const marker = L.marker([restaurant.latitude, restaurant.longitude], {
          icon: L.divIcon({
            className: 'custom-marker restaurant-marker',
            html: `<div style="background-color:rgb(204, 33, 27); color: white; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
                     <span style="font-size: 20px; line-height: 1; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">🍽️</span>
                   </div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            popupAnchor: [0, -15]
          })
        });

        // Créer le contenu du popup pour le restaurant
        const popupContent = document.createElement('div');
        popupContent.className = 'venue-popup';
        
        // Contenu de base du restaurant
        popupContent.innerHTML = `
          <h3>${restaurant.name}</h3>
          <p>${restaurant.description}</p>
          <p class="venue-address">${restaurant.address}</p>
        `;
        
        // Boutons d'actions
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'popup-buttons';
        
        // Bouton Google Maps
        const mapsButton = document.createElement('button');
        mapsButton.className = 'maps-button';
        mapsButton.textContent = 'Ouvrir dans Google Maps';
        mapsButton.addEventListener('click', () => {
          openInGoogleMaps(restaurant);
        });
        buttonsContainer.appendChild(mapsButton);
        
        // Bouton Copier l'adresse
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copier l\'adresse';
        copyButton.addEventListener('click', () => {
          copyToClipboard(restaurant.address || `${restaurant.latitude},${restaurant.longitude}`);
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
                     <span style="font-size: 20px; line-height: 1; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">${party.sport === 'Pompom' ? '🎀' : party.sport === 'Defile' ? '🎺' : '🎉'}</span>
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
  }, [venues, hotels, parties, restaurants, isEditing, isAdmin]);

  // Fonction pour commencer l'édition d'un match
  const startEditingMatch = (venueId: string, match: Match | null) => {
    if (!checkAdminRights()) return;

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
        description: match.description,
        endTime: match.endTime,
        result: match.result
      });
    } else {
      setNewMatch({ date: '', teams: '', description: '', endTime: '', result: '' });
    }
    triggerMarkerUpdate();
  };

  // Fonction pour terminer l'édition d'un match
  const finishEditingMatch = () => {
    setEditingMatch({ venueId: null, match: null });
    triggerMarkerUpdate();
  };

  // Enregistrer la visite de la page au chargement
  useEffect(() => {
    // Forcer l'envoi d'un pageview après un court délai pour assurer le chargement complet
    setTimeout(() => {
      ReactGA.send({ 
        hitType: "pageview", 
        page: window.location.pathname + window.location.search
      });
      
      // Forcer un événement pour tester la connexion
      ReactGA.event({
        category: 'page',
        action: 'view',
        label: window.location.pathname
      });
    }, 1000);
    
    // Fonction pour enregistrer les événements personnalisés
    const trackEvent = (category: string, action: string) => {
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

    // Mettre à jour la visibilité de chaque marqueur
    allMarkers.forEach(marker => {
      const markerElement = marker.getElement();
      if (markerElement) {
        // Trouver le lieu correspondant au marqueur
        const venue = venues.find(v => {
          const markerLatLng = marker.getLatLng();
          return v.latitude === markerLatLng.lat && v.longitude === markerLatLng.lng;
        });

        // Trouver la soirée correspondante au marqueur
        const party = parties.find(p => {
          const markerLatLng = marker.getLatLng();
          return p.latitude === markerLatLng.lat && p.longitude === markerLatLng.lng;
        });

        // Trouver l'hôtel correspondant au marqueur
        const hotel = hotels.find(h => {
          const markerLatLng = marker.getLatLng();
          return h.latitude === markerLatLng.lat && h.longitude === markerLatLng.lng;
        });

        // Trouver le restaurant correspondant au marqueur
        const restaurant = restaurants.find(r => {
          const markerLatLng = marker.getLatLng();
          return r.latitude === markerLatLng.lat && r.longitude === markerLatLng.lng;
        });

        if (venue) {
          // Afficher le marqueur si :
          // 1. Le filtre est sur "all"
          // 2. Le filtre est sur le sport du lieu
          const shouldShow = 
            eventFilter === 'all' || 
            eventFilter === venue.sport;

          markerElement.style.display = shouldShow ? 'block' : 'none';
          markerElement.style.opacity = shouldShow ? '1' : '0';
        } else if (party) {
          // Afficher le marqueur de soirée si :
          // 1. Le filtre est sur "all"
          // 2. Le filtre est sur "party"
          const shouldShow = 
            eventFilter === 'all' || 
            eventFilter === 'party';

          markerElement.style.display = shouldShow ? 'block' : 'none';
          markerElement.style.opacity = shouldShow ? '1' : '0';
        } else if (hotel || restaurant) {
          // Afficher les hôtels et restaurants uniquement si le filtre est sur "all"
          const shouldShow = eventFilter === 'all';

          markerElement.style.display = shouldShow ? 'block' : 'none';
          markerElement.style.opacity = shouldShow ? '1' : '0';
        }
      }
    });
  };

  // Mettre à jour les marqueurs lorsque le filtre change ou qu'une action est effectuée
  useEffect(() => {
    if (mapRef.current) {
      updateMapMarkers();
    }
  }, [eventFilter, venues, appAction]);

  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
    setActiveTab('map'); // Fermer le panneau en revenant à l'onglet map
    triggerMarkerUpdate();
    
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
      // Pour les matchs, y compris la natation
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

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    triggerMarkerUpdate();
  };

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Démarrage de l\'écouteur d\'authentification...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        
        // Vérifier si l'utilisateur est admin
        const adminsRef = ref(database, 'admins');
        onValue(adminsRef, (snapshot) => {
          const admins = snapshot.val();
          setIsAdmin(admins && admins[user.uid]);
        });
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log('Tentative de connexion...');
      console.log('Provider configuré:', provider);
      const result = await signInWithPopup(auth, provider);
      console.log('Résultat de la connexion:', result);
      console.log('UID de l\'utilisateur:', result.user.uid);
      console.log('Email de l\'utilisateur:', result.user.email);
    } catch (error) {
      console.error('Erreur détaillée de connexion:', error);
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  // Fonction pour déclencher une mise à jour des marqueurs
  const triggerMarkerUpdate = () => {
    setAppAction(prev => prev + 1);
  };

  // Fonction pour gérer le changement de style de carte
  const handleMapStyleChange = (style: string) => {
    setMapStyle(style);
    triggerMarkerUpdate();
  };

  // Fonction pour gérer le changement d'onglet
  const handleTabChange = (tab: 'map' | 'events') => {
    setActiveTab(tab);
    if (tab === 'events') {
      // Attendre que le DOM soit mis à jour
      setTimeout(() => {
        const firstNonPassedEvent = document.querySelector('.event-item:not(.passed)');
        if (firstNonPassedEvent) {
          firstNonPassedEvent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleCalendarClick = () => {
    setIsCalendarOpen(true);
  };

  const handleCalendarClose = () => {
    setIsCalendarOpen(false);
  };

  return (
    <div className="app">
      <div className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {!isEditing && (
            <select 
              className="map-style-selector"
              value={mapStyle}
              onChange={(e) => {
                ReactGA.event({
                  category: 'map',
                  action: 'change_map_style',
                  label: e.target.value
                });
                handleMapStyleChange(e.target.value);
              }}
            >
              <option value="osm">OpenStreetMap</option>
              <option value="cyclosm">CyclOSM</option>
              <option value="humanitarian">Humanitarian</option>
              <option value="osmfr">OSM France</option>
            </select>
          )}
          <button 
            className={`fullscreen-button ${isFullscreen ? 'active' : ''}`}
            onClick={toggleFullscreen}
            title={isFullscreen ? "Quitter le mode plein écran" : "Mode plein écran"}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isFullscreen ? (
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
            )}
          </button>
          <button 
            className="admin-button"
            onClick={() => {
              if (!user) {
                signInWithGoogle();
              } else {
                auth.signOut();
              }
            }}
            title={user ? "Se déconnecter" : "Se connecter"}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}
          >
            {!user ? "🔒" : (isAdmin ? "🔓" : "🔒")}
          </button>
        </div>
        <div className="controls">
          {isAdmin && (
            <>
              <button
                className={`edit-button ${isEditing ? 'active' : ''}`}
                onClick={() => {
                  ReactGA.event({
                    category: 'app',
                    action: 'toggle_edit_mode',
                    label: isEditing ? 'off' : 'on'
                  });
                  
                  setIsEditing(!isEditing);
                  if (isEditing) {
                    setIsAddingPlace(false);
                    setEditingVenue({ id: null, venue: null });
                    setTempMarker(null);
                    setIsPlacingMarker(false);
                  }
                  triggerMarkerUpdate();
                }}
              >
                {isEditing ? 'Terminer l\'édition' : 'Mode édition'}
              </button>
              {isEditing && (
                <button 
                  className="add-place-button"
                  onClick={() => {
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
            </>
          )}
        </div>
      </div>
      <main className="app-main">
        {locationError && showLocationPrompt && (
          <div className="location-error">
            <p>{locationError}</p>
            <div className="location-error-buttons">
              <button className="retry-button" onClick={retryLocation}>
                Réessayer
              </button>
              <button className="retry-button" onClick={handleDontAskAgain}>
                Annuler
              </button>
            </div>
          </div>
        )}
        {locationLoading ? (
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
          <MapEvents onMapClick={handleMapClick} />
          {tempMarker && (
            <Marker
              position={tempMarker}
              icon={DefaultIcon}
            >
              <Popup>Nouveau lieu</Popup>
            </Marker>
          )}
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
                handleTabChange(activeTab === 'map' ? 'events' : 'map');
              }}
            >
              {activeTab === 'map' ? '📆 Événements' : '✖️ Fermer'}
                  </button>
            
            {activeTab === 'events' && (
              <div className="events-panel">
                <div className="events-panel-header">
                  <button 
                    className="calendar-button"
                    onClick={handleCalendarClick}
                    title="Voir le calendrier"
                  >
                    <i className="fas fa-calendar"></i>📅 Calendrier
                  </button>
                  <button 
                    className="close-events-button"
                    onClick={() => setActiveTab('map')}
                    title="Fermer le panneau"
                  >
                    Fermer
                  </button>
                </div>
                <div className="event-filters">
                  <select 
                    className="filter-select"
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                  >
                    <option value="all">Tous les événements</option>
                    <option value="party">Soirées 🎉</option>
                    <option value="Football">Football ⚽</option>
                    <option value="Basketball">Basketball 🏀</option>
                    <option value="Handball">Handball 🤾</option>
                    <option value="Rugby">Rugby 🏉</option>
                    <option value="Ultimate">Ultimate 🥏</option>
                    <option value="Natation">Natation 🏊</option>
                    <option value="Badminton">Badminton 🏸</option>
                    <option value="Tennis">Tennis 🎾</option>
                    <option value="Cross">Cross 🏃</option>
                    <option value="Volleyball">Volleyball 🏐</option>
                    <option value="Ping-pong">Ping-pong 🏓</option>
                    <option value="Boxe">Boxe 🥊</option>
                    <option value="Athlétisme">Athlétisme 🏃‍♂️</option>
                    <option value="Pétanque">Pétanque 🍹</option>
                    <option value="Escalade">Escalade 🧗‍♂️</option>
                    <option value="Jeux de société">Jeux de société 🎲</option>
                  </select>
                            </div>
                <div className="events-list">
                  {getFilteredEvents().map(event => (
                    <div 
                      key={event.id} 
                      className={`event-item ${event.isPassed ? 'passed' : ''} ${event.type === 'match' ? 'match-event' : 'party-event'} ${selectedEvent?.id === event.id ? 'selected' : ''}`}
                      onClick={() => handleEventSelect(event)}
                    >
                      <div className="event-header">
                        <span className="event-type-badge">
                          {event.type === 'match' 
                            ? `${getSportIcon(event.sport || '')} ${event.sport}`
                            : event.sport === 'Defile'
                              ? '🎺 Défilé'
                              : '🎉 Soirée'}
                        </span>
                        <span className="event-date">{formatDateTime(event.date)}</span>
                      </div>
                      <div className="event-title-container">
                        <h3 className="event-name">{event.name}</h3>
                      </div>
                      {event.type === 'match' && (
                        <>
                          <p className="event-description">{event.description}</p>
                          <p className="event-venue">{event.venue}</p>
                          {event.result && <p className="event-result">Résultat: {event.result}</p>}
                        </>
                      )}
                      {event.type === 'party' && (
                        <>
                          <p className="event-description">{event.description}</p>
                          <p className="event-address">{event.address}</p>
                        </>
                      )}
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
                <label htmlFor="match-date">Date et heure de début</label>
                <input
                  id="match-date"
                  type="datetime-local"
                  value={editingMatch.match ? editingMatch.match.date : newMatch.date}
                  onChange={(e) => {
                    if (editingMatch.match) {
                      const updatedMatch = { ...editingMatch.match, date: e.target.value };
                      setEditingMatch({ ...editingMatch, match: updatedMatch });
                    } else {
                      setNewMatch({ ...newMatch, date: e.target.value });
                    }
                  }}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="match-end-time">Heure de fin</label>
                <input
                  id="match-end-time"
                  type="datetime-local"
                  value={editingMatch.match ? editingMatch.match.endTime : (newMatch.endTime || '')}
                  min={editingMatch.match ? editingMatch.match.date : newMatch.date}
                  onChange={(e) => {
                    if (editingMatch.match) {
                      const updatedMatch = { ...editingMatch.match, endTime: e.target.value };
                      setEditingMatch({ ...editingMatch, match: updatedMatch });
                    } else {
                      setNewMatch({ ...newMatch, endTime: e.target.value });
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
                      const updatedMatch = { ...editingMatch.match, teams: e.target.value };
                      setEditingMatch({ ...editingMatch, match: updatedMatch });
                    } else {
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
                      const updatedMatch = { ...editingMatch.match, description: e.target.value };
                      setEditingMatch({ ...editingMatch, match: updatedMatch });
                    } else {
                      setNewMatch({ ...newMatch, description: e.target.value });
                    }
                  }}
                  placeholder="Ex: Match de qualification"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="match-result">Résultat</label>
                <input
                  id="match-result"
                  type="text"
                  value={editingMatch.match ? editingMatch.match.result : (newMatch.result || '')}
                  onChange={(e) => {
                    if (editingMatch.match) {
                      const updatedMatch = { ...editingMatch.match, result: e.target.value };
                      setEditingMatch({ ...editingMatch, match: updatedMatch });
                    } else {
                      setNewMatch({ ...newMatch, result: e.target.value });
                    }
                  }}
                  placeholder="Ex: 2-1"
                  className="form-input"
                />
              </div>
              <div className="form-actions">
                <button 
                  className="add-button"
                  onClick={() => {
                    if (editingMatch.match) {
                      handleUpdateMatch(
                        editingMatch.venueId!, 
                        editingMatch.match.id, 
                        {
                          date: editingMatch.match.date,
                          endTime: editingMatch.match.endTime || '',
                          teams: editingMatch.match.teams,
                          description: editingMatch.match.description,
                          result: editingMatch.match.result
                        }
                      );
                      finishEditingMatch();
                    } else {
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
      <CalendarPopup 
        isOpen={isCalendarOpen} 
        onClose={handleCalendarClose}
        venues={venues}
        eventFilter={eventFilter}
      />
    </div>
  );
}

export default App;
