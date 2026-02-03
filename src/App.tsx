import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLng } from 'leaflet';
import { useState, useEffect, useRef } from 'react';
import './App.css';
import { ref, onValue, set, push, remove, update } from 'firebase/database';
import { auth, database, provider } from './firebase';
import L from 'leaflet';
import ReactGA from 'react-ga4';
import { v4 as uuidv4 } from 'uuid';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import CalendarPopup from './components/CalendarPopup';
import { Venue, Match } from './types';
import PlanningFiles from './components/PlanningFiles';
import NotificationService from './services/NotificationService';

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

interface Hotel extends BaseItem {
  type: 'hotel';
  telephone?: string;
  matches?: Match[];
}

interface Restaurant extends BaseItem {
  type: 'restaurant';
  mealType: string; // 'midi' ou 'soir'
}

interface Party extends BaseItem {
  type: 'party';
  result?: string;
}

type Place = Venue | Hotel | Party | Restaurant;

// Interface pour les actions d'historique
interface HistoryAction {
  type: 'ADD_VENUE' | 'UPDATE_VENUE' | 'DELETE_VENUE' | 'ADD_MATCH' | 'UPDATE_MATCH' | 'DELETE_MATCH';
  data: any;
  undo: () => Promise<void>;
}

// Initialiser Google Analytics
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXX';

ReactGA.initialize(GA_MEASUREMENT_ID, {
  testMode: process.env.NODE_ENV !== 'production',
  gaOptions: {
    sendPageView: false // Nous enverrons manuellement le pageview
  }
});

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
        () => {
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

interface Message {
  id?: string; // id Firebase
  content: string;
  sender: string;
  timestamp: number;
  isAdmin: boolean;
}

function App() {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]); // messages du chat, lus depuis Firebase
  const [showAddMessage, setShowAddMessage] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newMessageSender, setNewMessageSender] = useState(''); // nom personnalisé pour l'envoi
  const [editingMessageIndex, setEditingMessageIndex] = useState<number | null>(null); // index du message en cours d'édition
  const [editingMessageValue, setEditingMessageValue] = useState(''); // valeur temporaire pour l'édition
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null); // id du message en cours d'édition
  const [lastSeenChatTimestamp, setLastSeenChatTimestamp] = useState<number>(() => Number(localStorage.getItem('lastSeenChatTimestamp') || 0)); // timestamp du dernier message vu
  
  // Initialiser le service de notifications
  useEffect(() => {
    const notificationService = NotificationService.getInstance();
    notificationService.initialize().catch((error) => {
      console.error('Erreur lors de l\'initialisation du service de notifications:', error);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsAdmin(true);
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsEditing(false);
        setIsAddingPlace(false);
        setEditingVenue({ id: null, venue: null });
        setTempMarker(null);
        setIsPlacingMarker(false);
      }
      setIsLoading(false);
    });
    
    return () => unsubscribe();
  }, []);



  // Lecture en temps réel des messages depuis Firebase
  useEffect(() => {
    const messagesRef = ref(database, 'chatMessages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() || {};
      // Transforme l'objet en tableau [{id, ...}] et trie par timestamp (plus récent en premier)
      const messagesArray = Object.entries(data)
        .map(([id, value]) => ({ id, ...(value as any) }))
        .sort((a, b) => b.timestamp - a.timestamp);
      setMessages(messagesArray);
    });
    return () => unsubscribe();
  }, []);

  // Ajout d'un message dans Firebase (avec nom personnalisé)
  const handleAddMessage = async (msg: string, sender: string) => {
    const newMsgRef = push(ref(database, 'chatMessages'));
    set(newMsgRef, {
      content: msg,
      sender: sender || "Organisation",
      timestamp: Date.now(),
      isAdmin: true
    });

    // Envoyer la notification via le service (Cloud Functions)
    // Si sender est vide, envoyer une chaîne vide pour la notification
    try {
      const notificationService = NotificationService.getInstance();
      await notificationService.notifyChatMessage(msg, sender || '');
    } catch (error) {
      // L'erreur est déjà gérée dans le service, on ne bloque pas l'utilisateur
      console.error('Erreur lors de l\'envoi de la notification:', error);
    }
  };

  // Modification d'un message dans Firebase (texte et nom)
  const handleEditMessage = (id: string, newContent: string, newSender: string) => {
    update(ref(database, `chatMessages/${id}`), { content: newContent, sender: newSender || 'Organisation' });
  };

  // Fonction pour ajuster automatiquement la hauteur du textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // Ajuster la hauteur du textarea quand le message change
  useEffect(() => {
    adjustTextareaHeight();
  }, [newMessage]);

  // Suppression d'un message dans Firebase
  const handleDeleteMessage = (id: string) => {
    remove(ref(database, `chatMessages/${id}`));
  };

  // Fonction pour vérifier les droits d'administration avant d'exécuter une action
  const checkAdminRights = () => {
    if (!isAdmin) {
      alert('Cette action nécessite des droits d\'administrateur.');
      return false;
    }
    return true;
  };

  const [hotels] = useState<Hotel[]>(() => {
    // Les descriptions seront chargées depuis Firebase via les listeners
    return [
      {
        id: '1',
        name: "Ibis Styles Nancy Sud Houdemont",
        position: [48.638767, 6.183726],
        description: '',
        address: "8 Allée De La Genelière, Rn 57, 54180 Houdemont",
        telephone: "03 83 56 10 25",
        type: 'hotel',
        date: '',
        latitude: 48.638751,
        longitude: 6.183532,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      },
      {
        id: '2',
        name: "Nemea Home Suite Nancy Centre",
        position: [48.685828, 6.190530],
        description: '',
        address: "13 Rue Albert Lebrun, 54000 Nancy",
        telephone: "03 83 33 88 40",
        type: 'hotel',
        date: '',
        latitude: 48.685828,
        longitude: 6.190530,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      },
      {
        id: '3',
        name: "Nemea Grand Coeur Nancy Centre",
        position: [48.685564, 6.181711],
        description: '',
        address: "12 Rue Charles III, 54000 Nancy",
        telephone: "03 83 27 02 66",
        type: 'hotel',
        date: '',
        latitude: 48.685564,
        longitude: 6.181711,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      },
      {
        id: '4',
        name: "Hotel Ibis Nancy Brabois",
        position: [48.650700, 6.144908],
        description: '',
        address: "All. de Bourgogne, 54500 Vandœuvre-lès-Nancy",
        telephone: "03 83 44 55 77",
        type: 'hotel',
        date: '',
        latitude: 48.650700,
        longitude: 6.144908,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      },
      {
        id: '5',
        name: "Hotel Residome Nancy",
        position: [48.694090, 6.195636],
        description: '',
        address: "9 Bd de la Mothe, 54000 Nancy",
        telephone: "03 83 19 55 60",
        type: 'hotel',
        date: '',
        latitude: 48.694090,
        longitude: 6.195636,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      },
      {
        id: '6',
        name: "Ibis Budget Nancy Laxou",
        position: [48.695594, 6.124011],
        description: '',
        address: "1 Rue du Vair, 54520 Laxou",
        telephone: "08 92 68 04 82",
        type: 'hotel',
        date: '',
        latitude: 48.695594,
        longitude: 6.124011,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      },
      {
        id: '7',
        name: "Hotel Revotel Nancy Centre",
        position: [48.689027, 6.170853],
        description: '',
        address: "41 Rue Raymond Poincaré, 54000 Nancy",
        telephone: "03 83 28 02 13",
        type: 'hotel',
        date: '',
        latitude: 48.689027,
        longitude: 6.170853,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      },
      {
        id: '8',
        name: "Hotel Cerise Nancy",
        position: [48.699409, 6.144490],
        description: '',
        address: "1339 Av. Raymond Pinchard, 54100 Nancy",
        telephone: "03 83 98 03 33",
        type: 'hotel',
        date: '',
        latitude: 48.699409,
        longitude: 6.144490,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      },
      {
        id: '9',
        name: "F1 Nancy Sud Houdemont",
        position: [48.639247, 6.183667],
        description: '',
        address: "Zac Houdemont, 4 All. de la Genelière, 54180 Heillecourt",
        telephone: "08 91 70 53 34",
        type: 'hotel',
        date: '',
        latitude: 48.639247,
        longitude: 6.183667,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      },
      {
        id: '10',
        name: "F1 Nancy Nord Bouxières aux Dames",
        position: [48.758371, 6.152435],
        description: '',
        address: "4 Rue Charles Bourseul, 54136 Bouxières-aux-Dames",
        telephone: "08 91 70 53 33",
        type: 'hotel',
        date: '',
        latitude: 48.758371,
        longitude: 6.152435,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      },
      {
        id: '11',
        name: "Greet Hôtel Nancy Sud",
        position: [48.636457, 6.180432],
        description: '',
        address: "2 rue des Egrez, ZAC des Egrez, 54180 Houdemont",
        telephone: "03 54 00 16 54",
        type: 'hotel',
        date: '',
        latitude: 48.636457,
        longitude: 6.180432,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      },
      {
        id: '12',
        name: "Hôtel Ibis Styles Sud Houdemont",
        position: [48.637822, 6.183618],
        description: '',
        address: "8, allée de la Genellière, 54180 Houdemont",
        telephone: "03 83 56 10 25",
        type: 'hotel',
        date: '',
        latitude: 48.637822,
        longitude: 6.183618,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      },
      {
        id: '13',
        name: "Hôtel Ibis Budget Centre",
        position: [48.692579, 6.195264],
        description: '',
        address: "4, allée du Chanoine Drioton, 54000 Nancy",
        telephone: "08 92 68 12 86",
        type: 'hotel',
        date: '',
        latitude: 48.692579,
        longitude: 6.195264,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      },
      {
        id: '14',
        name: "Kosy coeur de ville",
        position: [48.690394, 6.174923],
        description: '',
        address: "Place Simone Veil nº2, 54000 Nancy",
        telephone: "03 83 28 93 45",
        type: 'hotel',
        date: '',
        latitude: 48.690394,
        longitude: 6.174923,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      },
      {
        id: '15',
        name: "Hôtel In Hôtel",
        position: [48.743194, 6.151185],
        description: '',
        address: "5 Rue de Nerbevaux, 54390 Frouard",
        telephone: "03 83 23 49 02",
        type: 'hotel',
        date: '',
        latitude: 48.743194,
        longitude: 6.151185,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      },
      {
        id: '16',
        name: "Campanile Nancy Gare",
        position: [48.691665, 6.175432],
        description: '',
        address: "12 rue de Serre, 54000 Nancy",
        telephone: "03 57 29 10 07",
        type: 'hotel',
        date: '',
        latitude: 48.691665,
        longitude: 6.175432,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      },
      {
        id: '17',
        name: "Kyriad Vandoeuvre",
        position: [48.650664, 6.146260],
        description: '',
        address: "1 avenue de Forêt de Haye, 54500 Vandoeuvre",
        telephone: "03 83 44 66 00",
        type: 'hotel',
        date: '',
        latitude: 48.650664,
        longitude: 6.146260,
        emoji: '🏢',
        sport: 'Hotel',
        matches: []
      }
    ];
  });

  const [restaurants] = useState<Restaurant[]>(() => {
    // Les descriptions seront chargées depuis Firebase via les listeners
    return [
      {
        id: '1',
        name: "Salle des Fêtes de Gentilly",
        position: [48.698430, 6.139541],
        description: "Repas du Vendredi soir",
        address: "5001F Av. du Rhin, 54100 Nancy",
        type: 'restaurant',
        date: '',
        latitude: 48.698430, 
        longitude: 6.139541,
        emoji: '🍽️',
        sport: 'Restaurant', 
        mealType: 'soir',
        matches: []
      },
      {
        id: '2',
        name: "Parc Expo Hall B",
        position: [48.662595, 6.190721],
        description: "Repas du Jeudi et Vendredi soir",
        address: "Rue Catherine Opalinska, 54500 Vandœuvre-lès-Nancy",
        type: 'restaurant',
        date: '',
        latitude: 48.662595,
        longitude: 6.190721,
        emoji: '🍽️',
        sport: 'Restaurant',
        mealType: 'soir',
        matches: []
      }
    ];
  });

  const [parties] = useState<Party[]>(() => {
    // Les descriptions et résultats seront chargés depuis Firebase via les listeners
    return [
      {
        id: '1',
        name: "Place Stanislas",
        position: [48.693524, 6.183270],
        description: "Rendez vous 12h puis départ du Défilé à 13h",
        address: "Pl. Stanislas, 54000 Nancy",
        type: 'party',
        date: '2026-04-16T12:00:00',
        latitude: 48.693524,
        longitude: 6.183270,
        emoji: '🎺',
        sport: 'Defile'
      },
      {
        id: '2',
        name: "Parc Expo",
        position: [48.663030, 6.191597],
        description: "Soirée Pompoms du 16 avril, 21h-3h",
        address: "Rue Catherine Opalinska, 54500 Vandœuvre-lès-Nancy",
        type: 'party',
        date: '2026-04-16T21:00:00',
        latitude: 48.663030,
        longitude: 6.191597,
        emoji: '🎀',
        sport: 'Pompom',
        result: 'à venir'
      },
      {
        id: '3',
        name: "Parc Expo",
        position: [48.663481, 6.189737],
        description: "Soirée Showcase 17 avril, 20h-4h",
        address: "Rue Catherine Opalinska, 54500 Vandœuvre-lès-Nancy",
        type: 'party',
        date: '2026-04-17T20:00:00',
        latitude: 48.663481,
        longitude: 6.189737,
        emoji: '🎤',
        sport: 'Party',
        result: 'à venir'
      },
      {
        id: '4',
        name: "Zénith",
        position: [48.710136, 6.139169],
        description: "Soirée DJ Contest 18 avril, 20h-4h",
        address: "Rue du Zénith, 54320 Maxéville",
        type: 'party',
        date: '2026-04-18T20:00:00',
        latitude: 48.710136,
        longitude: 6.139169,
        emoji: '🎧',
        sport: 'Party'
      }
    ];
  });

  // Charger les lieux depuis Firebase au démarrage
  useEffect(() => {
    const venuesRef = ref(database, 'venues');
    const unsubscribe = onValue(venuesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const venuesArray = Object.entries(data)
          .map(([key, value]: [string, any]) => ({
            ...value,
            id: key,
            matches: value.matches || [],  // Assurer que matches est toujours un tableau
            sport: value.sport || '',
            date: value.date || '',
            latitude: value.position ? value.position[0] : 0,
            longitude: value.position ? value.position[1] : 0,
            emoji: value.emoji || ''
          }))
          .filter((venue: any) => venue.placeType !== 'indication'); // Filtrer les marqueurs avec placeType "indication"
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
  const [_selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [editingMatch, setEditingMatch] = useState<{venueId: string | null, match: Match | null}>({ venueId: null, match: null });
  const [newMatch, setNewMatch] = useState<{date: string, teams: string, description: string, endTime?: string, result?: string}>({
    date: '',
    teams: '',
    description: '',
    result: ''
  });
  const [_openPopup, setOpenPopup] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [_userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [mapStyle, setMapStyle] = useState('osm');
  const [activeTab, setActiveTab] = useState<'map' | 'events' | 'chat' | 'planning'>('map');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [editingVenue, setEditingVenue] = useState<{ id: string | null, venue: Venue | null }>({ id: null, venue: null });
  const [selectedEmoji, setSelectedEmoji] = useState('⚽');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [delegationFilter, setDelegationFilter] = useState<string>('all');
  const [venueFilter, setVenueFilter] = useState<string>('Tous');
  const [showFemale, setShowFemale] = useState<boolean>(true);
  const [showMale, setShowMale] = useState<boolean>(true);
  const [showMixed, setShowMixed] = useState<boolean>(true);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [appAction, setAppAction] = useState<number>(0);
  
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
    Ultimate: '🥏',
    Natation: '🏊',
    Badminton: '🏸',
    Tennis: '🎾',
    Cross: '👟',
    Volleyball: '🏐',
    'Ping-pong': '🏓',
    Echecs: '♟️',
    Athlétisme: '🏃‍♂️',
    Spikeball: '⚡️',
    Pétanque: '🍹',
    Escalade: '🧗‍♂️',
    Other: '🎯',
    Party: '🎉'
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
      'Cross': '👟',
      'Volleyball': '🏐',
      'Ping-pong': '🏓',
      'Echecs': '♟️',
      'Athlétisme': '🏃‍♂️',
      'Spikeball': '⚡️',
      'Pétanque': '🍹',
      'Escalade': '🧗‍♂️'
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

    // Ajouter les soirées (uniquement si admin)
    if (isAdmin) {
      parties.forEach(party => {
        events.push({
          id: `party-${party.id}`,
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
    }

    // Trier par date (du plus récent au plus ancien)
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Fonction pour filtrer les événements
  const getFilteredEvents = () => {
    const allEvents = getAllEvents();
    
    return allEvents.filter(event => {
      // Filtre par type d'événement
      const typeMatch = eventFilter === 'all' || 
        (eventFilter === 'none' ? false :
          (eventFilter === 'party' && event.type === 'party' && isAdmin) ||
          (event.type === 'match' && event.sport === eventFilter));

      // Filtre par délégation
      // Les soirées et défilés sont toujours affichés, quelle que soit la délégation
      const delegationMatch = event.type === 'party' || 
        delegationFilter === 'all' || 
        (event.teams && event.teams.toLowerCase().includes(delegationFilter.toLowerCase()));

      // Filtre par lieu
      let venueMatch = true;
      if (venueFilter !== 'Tous') {
        if (event.type === 'party') {
          // Pour les soirées et défilés, utiliser les identifiants spécifiques
          let partyId = '';
          // Utiliser l'ID de l'événement pour distinguer les soirées au même endroit
          const eventId = event.id.replace('party-', '');
          switch (eventId) {
            case '1':
              partyId = 'place-stanislas';
              break;
            case '2':
              partyId = 'parc-expo-pompom';
              break;
            case '3':
              partyId = 'parc-expo-showcase';
              break;
            case '4':
              partyId = 'zenith';
              break;
            default:
              // Fallback sur le nom si l'ID ne correspond pas
              switch (event.name) {
                case 'Place Stanislas':
                  partyId = 'place-stanislas';
                  break;
                case 'Parc Expo':
                  // Distinguer par la description
                  if (event.description?.includes('Pompoms')) {
                    partyId = 'parc-expo-pompom';
                  } else if (event.description?.includes('Showcase')) {
                    partyId = 'parc-expo-showcase';
                  } else {
                    partyId = 'parc-expo';
                  }
                  break;
                case 'Zénith':
                  partyId = 'zenith';
                  break;
                default:
                  partyId = event.name.toLowerCase().replace(/\s+/g, '-');
              }
          }
          venueMatch = partyId === venueFilter;
        } else {
          // Pour les matchs, utiliser l'ID du lieu
          venueMatch = event.venueId === venueFilter;
        }
      }

      // Filtre par genre
      const isFemale = event.description?.toLowerCase().includes('féminin');
      const isMale = event.description?.toLowerCase().includes('masculin');
      const isMixed = event.description?.toLowerCase().includes('mixte');
      
      const genderMatch = (!isFemale && !isMale && !isMixed) || 
        (isFemale && showFemale) || 
        (isMale && showMale) ||
        (isMixed && showMixed);

      return typeMatch && delegationMatch && venueMatch && genderMatch;
    });
  };

  // Fonction pour formater la date et l'heure
  const formatDateTime = (dateString: string, endTimeString?: string) => {
    // Parser la date comme heure locale (évite les problèmes de fuseau horaire)
    let date: Date;
    if (dateString.includes('T') && !dateString.includes('Z') && !dateString.includes('+') && !dateString.includes('-', 10)) {
      // Format ISO sans fuseau horaire, on le traite comme heure locale
      const [datePart, timePart] = dateString.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hours, minutes, seconds] = (timePart || '00:00:00').split(':').map(Number);
      date = new Date(year, month - 1, day, hours, minutes, seconds || 0);
    } else {
      date = new Date(dateString);
    }
    
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const day = days[date.getDay()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    if (endTimeString) {
      let endTime: Date;
      if (endTimeString.includes('T') && !endTimeString.includes('Z') && !endTimeString.includes('+') && !endTimeString.includes('-', 10)) {
        const [datePart, timePart] = endTimeString.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes, seconds] = (timePart || '00:00:00').split(':').map(Number);
        endTime = new Date(year, month - 1, day, hours, minutes, seconds || 0);
      } else {
        endTime = new Date(endTimeString);
      }
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
    
    // Attendre que le popup soit ouvert et le DOM mis à jour
    setTimeout(() => {
      const popup = document.querySelector('.leaflet-popup-content');
      if (popup) {
        const firstNonPassedMatch = popup.querySelector('.match-item:not(.match-passed)');
        if (firstNonPassedMatch) {
          firstNonPassedMatch.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 100);
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

      // Ajouter les marqueurs pour les lieux (exclure ceux avec placeType "indication")
      venues.forEach(venue => {
        // Filtrer les marqueurs avec placeType "indication"
        if ((venue as any).placeType === 'indication') {
          return; // Ignorer ce marqueur
        }
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
          
          // Créer un conteneur pour la liste des matchs avec défilement
          const matchesScrollContainer = document.createElement('div');
          matchesScrollContainer.className = 'matches-scroll-container';
          matchesScrollContainer.style.maxHeight = '200px';
          matchesScrollContainer.style.overflowY = 'auto';
          
          // Ajouter les styles pour les matchs passés
          const style = document.createElement('style');
          style.textContent = `
            .match-passed {
              background-color:rgba(255, 255, 255, 0.05);
            }
            .match-passed p {
              opacity: 0.3;
              color: var(--text-color);
            }
            .match-passed .match-result {
              opacity: 0.3;
              font-weight: bold;
              color: var(--text-color);
            }
          `;
          document.head.appendChild(style);
          
          sortedMatches.forEach(match => {
            const matchItemDiv = document.createElement('div');
            matchItemDiv.className = `match-item ${isMatchPassed(match.date, match.endTime) ? 'match-passed' : ''}`;
            matchItemDiv.innerHTML = `
              <p class="match-date">${formatDateTime(match.date, match.endTime)}</p>
              <p class="match-teams">${match.teams}</p>
              <p class="match-description">${match.description}</p>
              ${match.result ? `<p class="match-result"><strong>Résultat :</strong> ${match.result}</p>` : ''} 
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
            
            matchesScrollContainer.appendChild(matchItemDiv);
          });
          
          matchesListDiv.appendChild(matchesScrollContainer);
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

      // Ajouter les marqueurs pour les hôtels (uniquement si admin)
      if (isAdmin) {
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
      }

      // Ajouter les marqueurs pour les restaurants (uniquement si admin)
      if (isAdmin) {
        restaurants.forEach(restaurant => {
        const marker = L.marker([restaurant.latitude, restaurant.longitude], {
          icon: L.divIcon({
            className: 'custom-marker restaurant-marker',
            html: `<div style="background-color:rgb(255, 31, 31); color: white; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
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
      }

      // Ajouter les marqueurs pour les soirées (uniquement si admin)
      if (isAdmin) {
        parties.forEach(party => {
          const marker = L.marker([party.latitude, party.longitude], {
            icon: L.divIcon({
              className: 'custom-marker party-marker',
              html: `<div style="background-color: #9C27B0; color: white; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
                       <span style="font-size: 20px; line-height: 1; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">${party.emoji || '🎉'}</span>
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
          // 1. Le filtre est sur "all" ou correspond au sport
          // 2. Le filtre de lieu est sur "Tous" ou correspond au lieu
          const shouldShow = 
            (eventFilter === 'all' || eventFilter === venue.sport) &&
            (venueFilter === 'Tous' || venue.id === venueFilter);

          markerElement.style.display = shouldShow ? 'block' : 'none';
          markerElement.style.opacity = shouldShow ? '1' : '0';
        } else if (party) {
          // Les marqueurs de parties ne sont créés que si l'utilisateur est admin
          // Donc si on arrive ici, c'est qu'on est admin, on peut donc toujours afficher
          const shouldShow = eventFilter === 'all' || eventFilter === 'party';

          markerElement.style.display = shouldShow ? 'block' : 'none';
          markerElement.style.opacity = shouldShow ? '1' : '0';
        } else if (hotel || restaurant) {
          // Afficher les hôtels et restaurants uniquement si admin
          const shouldShow = isAdmin && (eventFilter === 'all');

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
  }, [eventFilter, venueFilter, delegationFilter, showFemale, showMale, showMixed, venues, appAction, isAdmin]);

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


  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      setIsAdmin(true);
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  // Met à jour le timestamp quand on est dans le chat (en temps réel)
  useEffect(() => {
    if (activeTab === 'chat' && messages.length > 0) {
      const lastMsg = messages[0]; // Le message le plus récent est maintenant en premier
      if (lastMsg.timestamp > lastSeenChatTimestamp) {
        localStorage.setItem('lastSeenChatTimestamp', String(lastMsg.timestamp));
        setLastSeenChatTimestamp(lastMsg.timestamp);
      }
    }
  }, [activeTab, messages, lastSeenChatTimestamp]);

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
    // Déclencher l'auto-scroll vers le premier événement non passé
    setTimeout(() => {
      const firstNonPassedEvent = document.querySelector('.event-item:not(.passed)');
      if (firstNonPassedEvent) {
        firstNonPassedEvent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleViewOnMap = (venue: Venue) => {
    // Fermer le calendrier et l'onglet événements
    setIsCalendarOpen(false);
    setActiveTab('map');
    
    // Centrer la carte sur le lieu
    if (mapRef.current) {
      mapRef.current.flyTo([venue.latitude, venue.longitude], 18, {
        duration: 2.5
      });
      
      // Trouver et ouvrir le marqueur correspondant
      const marker = markersRef.current.find(m => 
        m.getLatLng().lat === venue.latitude && m.getLatLng().lng === venue.longitude
      );
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 2500);
      }
    }
  };

  // Fonction pour obtenir toutes les délégations uniques
  const getAllDelegations = () => {
    const delegations = new Set<string>();
    venues.forEach(venue => {
      if (venue.matches) {
        venue.matches.forEach(match => {
          const teams = match.teams.split(/vs|VS|contre|CONTRE|,/).map(team => team.trim());
          teams.forEach(team => {
            // Exclure les "..." et les chaînes vides
            if (team && team !== "..." && team !== "…") delegations.add(team);
          });
        });
      }
    });
    return Array.from(delegations).sort();
  };

  const scrollToFirstNonPassedEvent = () => {
    const eventsList = document.querySelector('.events-list');
    if (eventsList) {
      const firstNonPassedEvent = eventsList.querySelector('.event-item:not(.passed)');
      if (firstNonPassedEvent) {
        firstNonPassedEvent.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Update the filter change handlers to include the scroll
  const handleEventFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    ReactGA.event({
      category: 'filter',
      action: 'change_event_filter',
      label: e.target.value
    });
    setEventFilter(e.target.value);
    // Réinitialiser le filtre de lieu quand le type d'événement change
    setVenueFilter('Tous');
    triggerMarkerUpdate();
    setTimeout(scrollToFirstNonPassedEvent, 100);
  };

  const handleDelegationFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    ReactGA.event({
      category: 'filter',
      action: 'change_delegation_filter',
      label: e.target.value
    });
    setDelegationFilter(e.target.value);
    triggerMarkerUpdate();
    setTimeout(scrollToFirstNonPassedEvent, 100); // Small delay to ensure the list is updated
  };

  const getVenueOptions = () => {
    if (eventFilter === 'all') {
      return [{ value: 'Tous', label: 'Tous les lieux' }];
    }

    // Pour les soirées et défilés, retourner les lieux fixes
    if (eventFilter === 'party') {
      return [
        { value: 'Tous', label: 'Tous les lieux' },
        { value: 'place-stanislas', label: 'Place Stanislas' },
        { value: 'parc-expo-pompom', label: 'Parc Expo (Pompoms)' },
        { value: 'parc-expo-showcase', label: 'Parc Expo (Showcase)' },
        { value: 'zenith', label: 'Zénith' }
      ];
    }

    // Pour les sports, filtrer les lieux par sport
    const filteredVenues = venues.filter(venue => venue.sport === eventFilter);
    const venueOptions = [
      { value: 'Tous', label: 'Tous les lieux' },
      ...filteredVenues.map(venue => ({
        value: venue.id,
        label: venue.name
      }))
    ];

    return venueOptions;
  };

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

  const handleVenueFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    ReactGA.event({
      category: 'filter',
      action: 'change_venue_filter',
      label: e.target.value
    });
    setVenueFilter(e.target.value);
    triggerMarkerUpdate();
    setTimeout(scrollToFirstNonPassedEvent, 100);
  };

  const handleGenderFilterChange = (gender: 'female' | 'male' | 'mixed') => {
    ReactGA.event({
      category: 'filter',
      action: 'change_gender_filter',
      label: gender
    });
    if (gender === 'female') setShowFemale(!showFemale);
    if (gender === 'male') setShowMale(!showMale);
    if (gender === 'mixed') setShowMixed(!showMixed);
    triggerMarkerUpdate();
    setTimeout(scrollToFirstNonPassedEvent, 100);
  };

  // Calcul du nombre de messages non lus
  const unreadCount = messages.filter(m => m.timestamp > lastSeenChatTimestamp).length;

  // Quand on ouvre/ferme le chat, on marque tous les messages comme lus
  const handleOpenChat = () => {
    // Toggle: si on est sur chat, on retourne à map, sinon on ouvre chat
    const newTab = activeTab === 'chat' ? 'map' : 'chat';
    setActiveTab(newTab);
    // Marquer les messages comme lus quand on ouvre le chat
    if (newTab === 'chat' && messages.length > 0) {
      const lastMsg = messages[0]; // Le message le plus récent est maintenant en premier
      const newTimestamp = lastMsg.timestamp;
      localStorage.setItem('lastSeenChatTimestamp', String(newTimestamp));
      setLastSeenChatTimestamp(newTimestamp);
    }
  };

  return (
    <div className="app">
      <div className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <button 
            className={`fullscreen-button ${isFullscreen ? 'active' : ''}`}
            onClick={toggleFullscreen}
            title={isFullscreen ? "Quitter le mode plein écran" : "Mode plein écran"}
            style={{
              padding: '2px',
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
          {!isEditing && (
            <select 
              className="map-style-selector"
              value={mapStyle}
              style={{
                padding: '2px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
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
                {isEditing ? "Terminer" : 'Éditer'}
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
                  Ajouter
                </button>
              )}
            </>
          )}
        </div>
        {isAdmin && (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              className="chat-button"
              onClick={() => {
                ReactGA.event({
                  category: 'navigation',
                  action: 'change_tab',
                  label: activeTab === 'map' ? 'chat' : 'map'
                });
                handleOpenChat();
              }}
              title="Messages de l'orga"
              style={{
                padding: '0px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                position: 'relative'
              }}
            >
              💬
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  minWidth: 18,
                  height: 18,
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 5px',
                  zIndex: 10,
                  fontWeight: 700,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
                }}>{unreadCount}</span>
              )}
            </button>
          </div>
        )}
        <button 
          className="admin-button"
          onClick={() => {
            if (!user) {
              signInWithGoogle();
            } else {
              // Si on est en mode édition, le terminer avant de se déconnecter
              if (isEditing) {
                setIsEditing(false);
                setIsAddingPlace(false);
                setEditingVenue({ id: null, venue: null });
                setTempMarker(null);
                setIsPlacingMarker(false);
                triggerMarkerUpdate();
              }
              auth.signOut();
            }
          }}
          title={user ? (isAdmin ? "Se déconnecter (Admin)" : "Se déconnecter") : "Se connecter"}
          style={{
            padding: '0px',
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
          center={[48.686881, 6.1880492]}
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
                    style={{ width: 100 }}
                  >
                    <i className="fas fa-calendar"></i>Calendrier
                  </button>
                  {/* AJOUTER bouton Fichiers (admin uniquement) */}
                  {isAdmin && (
                    <button
                      className="planning-button"
                      style={{ left: 120, width: 100 }}
                      onClick={() => setActiveTab('planning')}
                      title="Voir les fichiers (bus, tournois, etc.)"
                    >
                      <i className="fas fa-table"></i>Fichiers
                    </button>
                  )}
                  <button 
                    className="close-events-button"
                    onClick={() => setActiveTab('map')}
                    title="Fermer le panneau"
                  >
                    Fermer
                  </button>
                </div>
                <div className="event-filters">
                  <div className="filter-buttons-row">
                    <button 
                      className="filter-toggle-button"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      {showFilters ? 'Masquer les filtres' : 'Filtrer'}
                    </button>
                    {showFilters && (
                      <button 
                        className="filter-reset-button"
                        onClick={() => {
                          setEventFilter('all');
                          setDelegationFilter('all');
                          setVenueFilter('Tous');
                          setShowFemale(true);
                          setShowMale(true);
                          setShowMixed(true);
                          triggerMarkerUpdate();
                          setTimeout(scrollToFirstNonPassedEvent, 100);
                        }}
                      >
                        Réinitialiser
                      </button>
                    )}
                  </div>
                  {showFilters && (
                    <>
                      <select 
                        className="filter-select"
                        value={eventFilter}
                        onChange={handleEventFilterChange}
                      >
                        <option value="none">Aucun</option>
                        <option value="all">Tous les événements</option>
                        <option value="party">Soirées et Défilé ⭐</option>
                        <option value="Football">Football ⚽</option>
                        <option value="Basketball">Basketball 🏀</option>
                        <option value="Handball">Handball 🤾</option>
                        <option value="Rugby">Rugby 🏉</option>
                        <option value="Ultimate">Ultimate 🥏</option>
                        <option value="Natation">Natation 🏊</option>
                        <option value="Badminton">Badminton 🏸</option>
                        <option value="Tennis">Tennis 🎾</option>
                        <option value="Cross">Cross 👟</option>
                        <option value="Volleyball">Volleyball 🏐</option>
                        <option value="Ping-pong">Ping-pong 🏓</option>
                        <option value="Echecs">Echecs ♟️</option>
                        <option value="Athlétisme">Athlétisme 🏃‍♂️</option>
                        <option value="Spikeball">Spikeball ⚡️</option>
                        <option value="Pétanque">Pétanque 🍹</option>
                        <option value="Escalade">Escalade 🧗‍♂️</option>
                      </select>

                      <select
                        className="filter-select"
                        value={delegationFilter}
                        onChange={handleDelegationFilterChange}
                      >
                        <option value="all">Toutes les délégations</option>
                        {getAllDelegations().map(delegation => (
                          <option key={delegation} value={delegation}>
                            {delegation}
                          </option>
                        ))}
                      </select>

                      {eventFilter !== 'none' && eventFilter !== 'all' && (
                        <select 
                          className="filter-select"
                          value={venueFilter}
                          onChange={handleVenueFilterChange}
                        >
                          {getVenueOptions().map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {eventFilter !== 'all' && eventFilter !== 'party' && (() => {
                        const { hasFemale, hasMale, hasMixed } = hasGenderMatches(eventFilter);
                        if (!hasFemale && !hasMale && !hasMixed) return null;
                        return (
                          <div className="gender-filter-row">
                            {hasFemale && (
                              <button 
                                className={`gender-filter-button ${showFemale ? 'active' : ''}`}
                                onClick={() => handleGenderFilterChange('female')}
                              >
                                Féminin
                              </button>
                            )}
                            {hasMale && (
                              <button 
                                className={`gender-filter-button ${showMale ? 'active' : ''}`}
                                onClick={() => handleGenderFilterChange('male')}
                              >
                                Masculin
                              </button>
                            )}
                            {hasMixed && (
                              <button 
                                className={`gender-filter-button ${showMixed ? 'active' : ''}`}
                                onClick={() => handleGenderFilterChange('mixed')}
                              >
                                Mixte
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </>
                  )}
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
                              : event.sport === 'Pompom'
                                ? '🎀 Pompom'
                                : event.description?.includes('Showcase')
                                  ? '🎤 Showcase'
                                  : event.description?.includes('DJ Contest')
                                    ? '🎧 DJ Contest'
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
                          {event.result && <p className="event-result">Résultat : {event.result}</p>}
                        </>
                      )}
                      {event.type === 'party' && (
                        <>
                          <p className="event-description">{event.description}</p>
                          <p className="event-address">{event.address}</p>
                          {event.name === 'Centre Prouvé' && (
                            <div className="party-results">
                              <h4 style={{ color: 'var(--success-color)', marginTop: '10px' }}>Résultat : à venir</h4>
                            </div>
                          )}
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
            {/* AJOUTER panneau Fichiers */}
            {activeTab === 'planning' && (
              <div className="planning-panel">
                <div className="planning-panel-header">
                  <h3>Fichiers</h3>
                  <button 
                    className="close-planning-button"
                    onClick={() => {
                      setActiveTab('events');
                      // Déclencher l'auto-scroll vers le premier événement non passé
                      setTimeout(() => {
                        const firstNonPassedEvent = document.querySelector('.event-item:not(.passed)');
                        if (firstNonPassedEvent) {
                          firstNonPassedEvent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }}
                    title="Retour aux événements"
                  >
                    Retour
                  </button>
                </div>
                <div style={{ padding: '2rem', textAlign: 'left', maxWidth: 800, margin: '0 auto' }}>
                  <PlanningFiles isEditing={isEditing} isAdmin={isAdmin} />
                </div>
              </div>
            )}
            {activeTab === 'chat' && (
              <div className="chat-panel">
                <div className="chat-panel-header">
                  <h3>Messages de l'orga</h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {isAdmin && (
                      <button
                        className="add-message-button"
                        onClick={() => setShowAddMessage((v) => !v)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 20, width: 70 }}
                      >
                        {showAddMessage ? 'Annuler' : 'Ajouter'}
                      </button>
                    )}
                    <button 
                      className="close-chat-button"
                      onClick={() => setActiveTab('map')}
                      title="Fermer le panneau"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 20, width: 70 }}
                    >
                      Fermer
                    </button>
                  </div>
                </div>
                {showAddMessage && (
                  <form
                    className="add-message-form"
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: '8px', 
                      padding: '1rem', 
                      background: 'var(--bg-secondary)',
                      borderBottom: '1px solid var(--border-color)'
                    }}
                    onSubmit={e => {
                      e.preventDefault();
                      if (newMessage.trim()) {
                        if (editingMessageId) {
                          // Si on édite un message existant
                          handleEditMessage(editingMessageId, newMessage, newMessageSender || 'Organisation');
                        } else {
                          // Sinon, on ajoute un nouveau message
                          handleAddMessage(newMessage, newMessageSender || '');
                        }
                        setNewMessage('');
                        setNewMessageSender('');
                        setShowAddMessage(false);
                        setEditingMessageId(null);
                        if (textareaRef.current) {
                          textareaRef.current.style.height = 'auto';
                        }
                      }
                    }}
                  >
                    {/* Première ligne : Champ pour le nom de l'expéditeur et bouton d'envoi */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {/* Champ pour le nom de l'expéditeur (admin uniquement) */}
                      {isAdmin && (
                        <input
                          type="text"
                          value={newMessageSender}
                          onChange={e => setNewMessageSender(e.target.value)}
                          placeholder="Nom (ex: Organisation, Prénom...)"
                          style={{ flex: 1, height: 25, padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                        />
                      )}
                      <button
                        type="submit"
                        className="add-message-button"
                        style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          border: 'none', 
                          background: 'var(--primary-color)', 
                          color: 'white', 
                          cursor: 'pointer',
                        }}
                      >
                        {editingMessageId ? 'Modifier' : 'Envoyer'}
                      </button>
                    </div>
                    
                    {/* Deuxième ligne : Champ de saisie du message */}
                    <textarea
                      ref={textareaRef}
                      value={newMessage}
                      onChange={e => {
                        setNewMessage(e.target.value);
                        adjustTextareaHeight();
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (newMessage.trim()) {
                            if (editingMessageId) {
                              handleEditMessage(editingMessageId, newMessage, newMessageSender || 'Organisation');
                            } else {
                              handleAddMessage(newMessage, newMessageSender || '');
                            }
                            setNewMessage('');
                            setNewMessageSender('');
                            setShowAddMessage(false);
                            setEditingMessageId(null);
                            if (textareaRef.current) {
                              textareaRef.current.style.height = 'auto';
                            }
                          }
                        }
                      }}
                      placeholder="Votre message... (Entrée pour envoyer, Maj+Entrée pour revenir à la ligne)"
                      style={{ 
                        width: '100%',
                        minHeight: 25, 
                        maxHeight: 200,
                        padding: '8px', 
                        borderRadius: '4px', 
                        border: '1px solid var(--border-color)',
                        resize: 'none',
                        overflowY: 'auto',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        lineHeight: '1.4'
                      }}
                      autoFocus
                      rows={1}
                    />
                  </form>
                )}
                <div className="chat-container">
                  {messages.map((message, index) => (
                    <div key={message.id || index} className={`chat-message ${message.isAdmin ? 'admin' : ''}`} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
                      {/* Header du message : affiche le nom de l'expéditeur */}
                      <div className="chat-message-header" style={{ justifyContent: 'space-between' }}>
                        <span>{message.sender || 'Organisation'}</span>
                        <span>{new Date(message.timestamp).toLocaleString()}</span>
                      </div>
                      {/* Contenu du message */}
                      <div className="chat-message-content" style={{ paddingBottom: isAdmin ? 28 : 0, textAlign: 'left' }}>
                        {/* Si ce message est en cours d'édition, affiche un input */}
                        {isAdmin && editingMessageIndex === index ? (
                          <form
                            style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                            onSubmit={e => {
                              e.preventDefault();
                              if (message.id) {
                                handleEditMessage(message.id, editingMessageValue, newMessageSender || 'Organisation');
                              }
                              setEditingMessageIndex(null);
                              setEditingMessageValue('');
                            }}
                          >
                            <input
                              type="text"
                              value={editingMessageValue}
                              onChange={e => setEditingMessageValue(e.target.value)}
                              style={{ flex: 1, padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                              autoFocus
                            />
                            <button type="submit" className="add-message-button">Valider</button>
                            <button type="button" className="close-chat-button" onClick={() => { setEditingMessageIndex(null); setEditingMessageValue(''); }}>Annuler</button>
                          </form>
                        ) : (
                          <>{message.content}</>
                        )}
                      </div>
                      {/* Boutons admin en bas à droite */}
                      {isAdmin && editingMessageIndex !== index && (
                        <div style={{ position: 'absolute', right: 0, bottom: 6, display: 'flex', gap: 0 }}>
                          <button
                            className="edit-message-button"
                            title="Modifier"
                            onClick={() => {
                              // Ouvre le formulaire d'ajout en haut, pré-rempli
                              setShowAddMessage(true);
                              setNewMessage(message.content);
                              setNewMessageSender(message.sender || 'Organisation');
                              setEditingMessageId(message.id || null);
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3498db', fontSize: 16 }}
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-message-button"
                            title="Supprimer"
                            onClick={() => {
                              if (window.confirm('Supprimer ce message ?') && message.id) {
                                handleDeleteMessage(message.id);
                              }
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: 16 }}
                          >
                            🗑️
                          </button>
                        </div>
                      )}
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
                  placeholder="Ex: Nancy vs Alès"
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
                  placeholder="Ex: Phase de poules M"
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
      
      {/* Formulaire d'édition de lieu */}
      {isAddingPlace && (
        <div className="form-overlay">
          <div className="edit-form venue-edit-form">
            <div className="edit-form-header">
              <h3>{editingVenue.id ? 'Modifier le lieu' : 'Ajouter un lieu'}</h3>
            </div>
            <div className="edit-form-content">
              <div className="form-group">
                <label htmlFor="venue-name">Nom du lieu</label>
                <input
                  id="venue-name"
                  type="text"
                  value={newVenueName}
                  onChange={(e) => setNewVenueName(e.target.value)}
                  placeholder="Ex: Gymnase Raymond Poincaré"
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
                  placeholder="Ex: Pour rentrer il faut..."
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
                  placeholder="Ex: 56 Rue Raymond Poincaré, 54000 Nancy"
                  className="form-input"
                />
                <button
                  className="place-marker-button"
                  onClick={() => {
                    setIsPlacingMarker(true);
                    setIsAddingPlace(false);
                  }}
                >
                  Placer sur la carte
                </button>
              </div>
              <div className="form-group">
                <label htmlFor="venue-sport">Sport</label>
                <select
                  id="venue-sport"
                  value={selectedSport}
                  onChange={(e) => {
                    setSelectedSport(e.target.value);
                    setSelectedEmoji(sportEmojis[e.target.value as keyof typeof sportEmojis] || '⚽');
                  }}
                  className="form-input"
                >
                  <option value="Football">Football ⚽</option>
                  <option value="Basketball">Basketball 🏀</option>
                  <option value="Handball">Handball 🤾</option>
                  <option value="Rugby">Rugby 🏉</option>
                  <option value="Ultimate">Ultimate 🥏</option>
                  <option value="Natation">Natation 🏊</option>
                  <option value="Badminton">Badminton 🏸</option>
                  <option value="Tennis">Tennis 🎾</option>
                  <option value="Cross">Cross 👟</option>
                  <option value="Volleyball">Volleyball 🏐</option>
                  <option value="Ping-pong">Ping-pong 🏓</option>
                  <option value="Echecs">Echecs ♟️</option>
                  <option value="Athlétisme">Athlétisme 🏃‍♂️</option>
                  <option value="Spikeball">Spikeball ⚡️</option>
                  <option value="Pétanque">Pétanque 🍹</option>
                  <option value="Escalade">Escalade 🧗‍♂️</option>
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
                  disabled={!newVenueName || !newVenueDescription || (!newVenueAddress && !tempMarker)}
                >
                  {editingVenue.id ? 'Mettre à jour' : 'Ajouter'}
                </button>
                <button
                  className="cancel-button"
                  onClick={cancelEditingVenue}
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
        onViewOnMap={handleViewOnMap}
        delegationFilter={delegationFilter}
        venueFilter={venueFilter}
        showFemale={showFemale}
        showMale={showMale}
        showMixed={showMixed}
        isAdmin={isAdmin}
        onEventFilterChange={setEventFilter}
        onDelegationFilterChange={setDelegationFilter}
        onVenueFilterChange={setVenueFilter}
        onGenderFilterChange={(gender) => {
          if (gender === 'female') setShowFemale(!showFemale);
          if (gender === 'male') setShowMale(!showMale);
          if (gender === 'mixed') setShowMixed(!showMixed);
        }}
      />
    </div>
  );
}

export default App;
