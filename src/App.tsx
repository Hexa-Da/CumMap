import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLng } from 'leaflet';
import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import { ref, onValue, set, push } from 'firebase/database';
import { auth, database, provider } from './firebase';
import React from 'react';
import L from 'leaflet';
import ReactGA from 'react-ga4';
import { v4 as uuidv4 } from 'uuid';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import logo from './assets/logo.svg';

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

let HotelIcon = new Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: 'hotel-icon'
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
  type: 'match';
  teams: string;
  time: string;
  endTime?: string; // Rendre endTime optionnel
  venueId: string;
}

interface Hotel extends BaseItem {
  type: 'hotel';
}

interface Party extends BaseItem {
  type: 'party';
}

type Place = Venue | Hotel | Party;

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
  
  // Suppression du mode admin basé sur l'URL
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('État de l\'authentification changé:', user);
      if (user) {
        console.log('Utilisateur connecté - UID:', user.uid);
        console.log('Email:', user.email);
        console.log('Nom:', user.displayName);
        setUser(user);
        
        // Vérifier si l'utilisateur est admin
        const adminsRef = ref(database, 'admins');
        onValue(adminsRef, (snapshot) => {
          const admins = snapshot.val();
          setIsAdmin(admins && admins[user.uid]);
        });
      } else {
        console.log('Aucun utilisateur connecté');
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

  const [hotels, setHotels] = useState<Hotel[]>([
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
      emoji: '🏨',
      sport: 'Hotel'
    },
    {
      id: '2',
      name: "F1 Orly-Rungis",
      position: [48.7486, 2.3522],
      description: "Hôtel F1 Orly-Rungis",
      address: "7 Rue du Pont des Halles, 94150 Rungis",
      type: 'hotel',
      date: '',
      latitude: 48.7486,
      longitude: 2.3522,
      emoji: '🏨',
      sport: 'Hotel'
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
      position: [48.8655, 2.3144],
      description: "Soirée du 25 au 26 avril 2025, 21h-3h",
      address: "3, Port des Champs-Élysées, 75008 Paris",
      type: 'party',
      date: '2025-04-25T21:00:00',
      latitude: 48.8655,
      longitude: 2.3144,
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
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [newVenueName, setNewVenueName] = useState('');
  const [newVenueDescription, setNewVenueDescription] = useState('');
  const [newVenueAddress, setNewVenueAddress] = useState('');
  const [selectedSport, setSelectedSport] = useState('Football');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [editingMatch, setEditingMatch] = useState<{venueId: string | null, match: Match | null}>({ venueId: null, match: null });
  const [newMatch, setNewMatch] = useState<{date: string, teams: string, description: string, endTime?: string}>({
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
  const [lastFilteredEvents, setLastFilteredEvents] = useState<any[]>([]);
  const filterCheckRef = useRef<number>();
  
  // État pour l'historique des actions et l'index actuel
  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [isEventsPanelOpen, setIsEventsPanelOpen] = useState(false);

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
    Boxe: '🥊',
    Athlétisme: '🏃‍♂️',
    Pétanque: '🍹',
    Escalade: '🧗‍♂️',
    'Jeux de société': '🎲',
    Other: '🎯',
    Pompom: '🎀',
    Party: '🎉',
    Hotel: '🏨'
  };

  const sports = [
    'Football',
    'Basketball',
    'Handball',
    'Rugby',
    'Ultimate',
    'Natation',
    'Badminton',
    'Tennis',
    'Trail',
    'Volleyball',
    'Ping-pong',
    'Boxe',
    'Athlétisme',
    'Pétanque',
    'Escalade',
    'Jeux de société'
  ];

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
      'Trail': '🏃',
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

    // Vérifier et réappliquer le filtre après l'ajout
    checkAndApplyFilter();
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

    // Vérifier et réappliquer le filtre après la suppression
    checkAndApplyFilter();
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
      endTime: newMatch.endTime || '', // Rendre endTime optionnel
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
        endTime: ''
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

    // Vérifier et réappliquer le filtre après l'ajout
    checkAndApplyFilter();
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

    // Vérifier et réappliquer le filtre après la mise à jour
    checkAndApplyFilter();
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

    // Vérifier et réappliquer le filtre après la suppression
    checkAndApplyFilter();
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

    // Vérifier et réappliquer le filtre après la mise à jour
    checkAndApplyFilter();
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
  };

  // Fonction pour vérifier si un match est passé
  const isMatchPassed = (startDate: string, endTime?: string, type: 'match' | 'party' = 'match') => {
    const now = new Date();
    const start = new Date(startDate);
    
    // Si une heure de fin est spécifiée, l'utiliser
    if (endTime) {
      const end = new Date(endTime);
      return now > end;
    }
    
    // Sinon, utiliser les durées par défaut
    const defaultDuration = type === 'party' ? 6 : 2; // 6h pour les soirées, 2h pour les matchs
    const end = new Date(start.getTime() + (defaultDuration * 60 * 60 * 1000));
    return now > end;
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
        isPassed: isMatchPassed(party.date, undefined, 'party'),
        sport: party.sport
      });
    });

    // Trier par date (du plus récent au plus ancien)
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Fonction pour vérifier et réappliquer le filtre
  const checkAndApplyFilter = useCallback(() => {
    if (eventFilter !== 'all') {
      const filteredEvents = getFilteredEvents();
      setLastFilteredEvents(filteredEvents);
      updateMapMarkers();
    }
  }, [eventFilter]);

  // Fonction pour obtenir les événements filtrés
  const getFilteredEvents = useCallback(() => {
    const allEvents = getAllEvents();
    if (eventFilter === 'all') return allEvents;
    
    return allEvents.filter(event => {
      if (eventFilter === 'party') {
        return event.type === 'party';
      }
      return event.type === 'match' && event.sport === eventFilter;
    });
  }, [eventFilter]);

  // Fonction pour mettre à jour les marqueurs
  const updateMapMarkers = useCallback(() => {
    if (!mapRef.current) return;

    const allMarkers = markersRef.current;
    const filteredEvents = getFilteredEvents();

    allMarkers.forEach(marker => {
      const markerElement = marker.getElement();
      if (markerElement) {
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

  // Boucle de vérification continue du filtre
  const checkFilterLoop = useCallback(() => {
    const currentFilteredEvents = getFilteredEvents();
    
    // Vérifier si les événements filtrés ont changé
    if (JSON.stringify(currentFilteredEvents) !== JSON.stringify(lastFilteredEvents)) {
      setLastFilteredEvents(currentFilteredEvents);
      updateMapMarkers();
    }
    
    // Continuer la boucle
    filterCheckRef.current = requestAnimationFrame(checkFilterLoop);
  }, [lastFilteredEvents]);

  // Démarrer la boucle de vérification
  useEffect(() => {
    filterCheckRef.current = requestAnimationFrame(checkFilterLoop);
    
    // Nettoyer la boucle lors du démontage
    return () => {
      if (filterCheckRef.current) {
        cancelAnimationFrame(filterCheckRef.current);
      }
    };
  }, [checkFilterLoop]);

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
  };

  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Démarrage de l\'écouteur d\'authentification...');
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('État de l\'authentification changé:', user);
      if (user) {
        console.log('Utilisateur connecté - UID:', user.uid);
        console.log('Email:', user.email);
        console.log('Nom:', user.displayName);
        setUser(user);
        
        // Vérifier si l'utilisateur est admin
        const adminsRef = ref(database, 'admins');
        onValue(adminsRef, (snapshot) => {
          const admins = snapshot.val();
          setIsAdmin(admins && admins[user.uid]);
        });
      } else {
        console.log('Aucun utilisateur connecté');
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

  return (
    <div className="app">
      <div className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logo} alt="CumMap Logo" style={{ height: '40px', width: 'auto' }} />
          <h1>CumMap</h1>
          <button 
            className={`fullscreen-button ${isFullscreen ? 'active' : ''}`}
            onClick={toggleFullscreen}
            title={isFullscreen ? "Quitter le mode plein écran" : "Mode plein écran"}
            style={{
              padding: '8px',
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
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}
          >
            {user ? "🔓" : "🔒"}
          </button>
        </div>
        <div className="controls">
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
                setTempMarker(null); // Nettoyer le marqueur temporaire
                setIsPlacingMarker(false); // Désactiver le mode placement
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
          {(isAddingPlace || editingVenue.id) && !isPlacingMarker && (
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
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        id="venue-address"
                        type="text"
                        value={newVenueAddress}
                        onChange={(e) => setNewVenueAddress(e.target.value)}
                        placeholder="Entrez l'adresse ou cliquez sur la carte"
                        className="form-input"
                        style={{ flex: 1 }}
                      />
                      <button
                        className="place-marker-button"
                        onClick={() => {
                          setIsPlacingMarker(true);
                          setIsAddingPlace(false); // Cacher le formulaire pendant le placement
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          padding: '4px',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        📍
                      </button>
                    </div>
                    {tempMarker && (
                      <p style={{ color: 'var(--success-color)', fontSize: '0.8rem', marginTop: '4px' }}>
                        Position sélectionnée : {newVenueAddress}
                      </p>
                    )}
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
                      <option value="Boxe">Boxe 🥊</option>
                      <option value="Athlétisme">Athlétisme 🏃‍♂️</option>
                      <option value="Pétanque">Pétanque 🍹</option>
                      <option value="Escalade">Escalade 🧗‍♂️</option>
                      <option value="Jeux de société">Jeux de société 🎲</option>
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
      </div>
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
                    Fermé
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
                    <option value="Volleyball">Volleyball</option>
                    <option value="Ping-pong">Ping-pong</option>
                    <option value="Boxe">Boxe</option>
                    <option value="Athlétisme">Athlétisme</option>
                    <option value="Pétanque">Pétanque</option>
                    <option value="Escalade">Escalade</option>
                    <option value="Jeux de société">Jeux de société</option>
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
                          description: editingMatch.match.description
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
    </div>
  );
}

export default App;
