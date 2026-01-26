import { useState, useEffect, useRef } from 'react';
import { ref, onValue, push, remove, set } from 'firebase/database';
import { database, storage, auth } from '../firebase';
import { PlanningFile } from '../types';
import { ref as storageRef, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

// Classe pour optimiser les connexions Firebase et monitoring des coûts
class FirebaseOptimizer {
  private static instance: FirebaseOptimizer;
  private activeConnections = 0;
  private maxConnections = 95;
  private dailyTransfer = 0;
  private dailyStorage = 0;
  private readonly MAX_DAILY_TRANSFER = 10 * 1024 * 1024 * 1024; // 10GB
  private readonly MAX_DAILY_STORAGE = 1024 * 1024 * 1024; // 1GB

  static getInstance() {
    if (!FirebaseOptimizer.instance) {
      FirebaseOptimizer.instance = new FirebaseOptimizer();
    }
    return FirebaseOptimizer.instance;
  }

  trackTransfer(bytes: number) {
    this.dailyTransfer += bytes;
    if (this.dailyTransfer > this.MAX_DAILY_TRANSFER * 0.8) {
      console.warn('⚠️ Limite de transfert quotidien atteinte à 80%');
    }
  }

  trackStorage(bytes: number) {
    this.dailyStorage += bytes;
    if (this.dailyStorage > this.MAX_DAILY_STORAGE * 0.8) {
      console.warn('⚠️ Limite de stockage quotidien atteinte à 80%');
    }
  }

  canCreateConnection(): boolean {
    return this.activeConnections < this.maxConnections;
  }

  registerConnection() {
    this.activeConnections++;
  }

  unregisterConnection() {
    this.activeConnections = Math.max(0, this.activeConnections - 1);
  }
}

// Fonction de compression d'image optimisée
const compressImage = (file: File, maxSizeKB = 500, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    // Vérifier si c'est une image
    if (!file.type.startsWith('image/')) {
      resolve(file); // Retourner le fichier tel quel si ce n'est pas une image
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      // Redimensionner si nécessaire
      const maxWidth = 1200;
      const maxHeight = 1200;
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Image compression failed'));
            return;
          }

          // Vérifier la taille finale
          if (blob.size > maxSizeKB * 1024) {
            // Recompresser avec une qualité plus faible
            const newQuality = Math.max(0.3, quality - 0.1);
            canvas.toBlob(
              (newBlob) => {
                if (!newBlob) {
                  reject(new Error('Image recompression failed'));
                  return;
                }
                const compressedFile = new File([newBlob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              },
              'image/jpeg',
              newQuality
            );
          } else {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Image loading failed'));
    img.src = URL.createObjectURL(file);
  });
};

interface Hotel {
  id: string;
  name: string;
}

interface Restaurant {
  id: string;
  name: string;
}

interface Party {
  id: string;
  name: string;
  sport?: string;
  description?: string;
}

interface PlanningFilesProps {
  isEditing?: boolean;
  isAdmin?: boolean;
  filter?: string;
  showFilterSelector?: boolean;
  hotels?: Hotel[];
  restaurants?: Restaurant[];
  parties?: Party[];
  uploading?: boolean;
  setUploading?: (value: boolean) => void;
  uploadProgress?: number;
  setUploadProgress?: (value: number) => void;
  onLoadingChange?: (loading: boolean) => void;
}

// Données par défaut des hôtels (synchronisées avec PlanningFilesPage)
const DEFAULT_HOTELS: Hotel[] = [
  { id: '1', name: "Ibis Styles Nancy Sud Houdemont" },
  { id: '2', name: "Nemea Home Suite Nancy Centre" },
  { id: '3', name: "Nemea Grand Coeur Nancy Centre" },
  { id: '4', name: "Hotel Ibis Nancy Brabois" },
  { id: '5', name: "Hotel Residome Nancy" },
  { id: '6', name: "Ibis Budget Nancy Laxou" },
  { id: '7', name: "Hotel Revotel Nancy Centre" },
  { id: '8', name: "Hotel Cerise Nancy" },
  { id: '9', name: "F1 Nancy Sud Houdemont" },
  { id: '10', name: "F1 Nancy Nord Bouxières aux Dames" },
  { id: '11', name: "Greet Hôtel Nancy Sud" },
  { id: '12', name: "Hôtel Ibis Styles Sud Houdemont" },
  { id: '13', name: "Hôtel Ibis Budget Centre" },
  { id: '14', name: "Kosy coeur de ville" },
  { id: '15', name: "Hôtel In Hôtel" },
  { id: '16', name: "Campanile Nancy Gare" },
  { id: '17', name: "Kyriad Vandoeuvre" }
];

// Données par défaut des restaurants (synchronisées avec PlanningFilesPage)
const DEFAULT_RESTAURANTS: Restaurant[] = [
  { id: '1', name: "Salle des Fêtes de Gentilly" },
  { id: '2', name: "Parc Expo Hall B" }
];

// Données par défaut des soirées (synchronisées avec PlanningFilesPage)
const DEFAULT_PARTIES: Party[] = [
  { id: '1', name: "Place Stanislas", sport: 'Defile', description: "Défilé" },
  { id: '2', name: "Parc Expo - Pompoms", sport: 'Pompom', description: "Soirée Pompoms" },
  { id: '3', name: "Parc Expo - Showcase", sport: 'Party', description: "Soirée Showcase" },
  { id: '4', name: "Zénith - DJ Contest", sport: 'Party', description: "Soirée DJ Contest" }
];

export default function PlanningFiles({ 
  isEditing = false,
  isAdmin: externalIsAdmin = false, 
  filter, 
  showFilterSelector = true,
  hotels: hotelsProp = DEFAULT_HOTELS,
  restaurants: restaurantsProp = DEFAULT_RESTAURANTS,
  parties: partiesProp = DEFAULT_PARTIES,
  uploading: externalUploading,
  setUploading: externalSetUploading,
  uploadProgress: externalUploadProgress,
  setUploadProgress: externalSetUploadProgress,
  onLoadingChange
}: PlanningFilesProps) {
  // Utiliser les valeurs par défaut si les arrays sont vides
  const hotels = hotelsProp.length > 0 ? hotelsProp : DEFAULT_HOTELS;
  const restaurants = restaurantsProp.length > 0 ? restaurantsProp : DEFAULT_RESTAURANTS;
  const parties = partiesProp.length > 0 ? partiesProp : DEFAULT_PARTIES;
  
  const [files, setFiles] = useState<PlanningFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<PlanningFile[]>([]);
  const [eventType, setEventType] = useState<string>('all');
  const [specificEvent, setSpecificEvent] = useState<string>('all');
  const [internalIsAdmin, setInternalIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFile, setNewFile] = useState({
    name: '',
    type: 'image' as const,
    url: '',
    eventType: ''
  });
  const [formEventType, setFormEventType] = useState<string>('sports');
  const [formSpecificEvent, setFormSpecificEvent] = useState<string>('');
  const [internalUploading, setInternalUploading] = useState(false);
  const [internalUploadProgress, setInternalUploadProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  // Utiliser les props externes si fournies, sinon l'état interne
  const uploading = externalUploading !== undefined ? externalUploading : internalUploading;
  const uploadProgress = externalUploadProgress !== undefined ? externalUploadProgress : internalUploadProgress;
  
  const setUploading = externalSetUploading || setInternalUploading;
  const setUploadProgress = externalSetUploadProgress || setInternalUploadProgress;
  
  // Utiliser la prop externe si fournie, sinon l'état interne
  const isAdmin = externalIsAdmin !== false ? externalIsAdmin : internalIsAdmin;
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Options pour les types d'événements (premier niveau)
  const eventTypeOptions = [
    { value: 'all', label: 'Tous les événements' },
    { value: 'sports', label: 'Sports' },
    { value: 'party', label: 'Soirées/Défilé' },
    { value: 'restaurants', label: 'Restaurants' },
    { value: 'hotel', label: 'Hôtels' },
    { value: 'hse', label: 'HSE' }
  ];

  // Options spécifiques selon le type d'événement (second niveau)
  const getSpecificOptions = (type: string) => {
    switch (type) {
      case 'sports':
        return [
          { value: 'all', label: 'Tous les sports' },
          { value: 'Football', label: 'Football ⚽' },
          { value: 'Basketball', label: 'Basketball 🏀' },
          { value: 'Handball', label: 'Handball 🤾' },
          { value: 'Rugby', label: 'Rugby 🏉' },
          { value: 'Ultimate', label: 'Ultimate 🥏' },
          { value: 'Natation', label: 'Natation 🏊' },
          { value: 'Badminton', label: 'Badminton 🏸' },
          { value: 'Tennis', label: 'Tennis 🎾' },
          { value: 'Cross', label: 'Cross 👟' },
          { value: 'Volleyball', label: 'Volleyball 🏐' },
          { value: 'Ping-pong', label: 'Ping-pong 🏓' },
          { value: 'Echecs', label: 'Echecs ♟️' },
          { value: 'Athlétisme', label: 'Athlétisme 🏃‍♂️' },
          { value: 'Spikeball', label: 'Spikeball ⚡️' },
          { value: 'Pétanque', label: 'Pétanque 🍹' },
          { value: 'Escalade', label: 'Escalade 🧗‍♂️' }
        ];
      case 'party':
        return [
          { value: 'all', label: 'Toutes les soirées/défilé' },
          ...parties.map(party => ({
            value: party.id,
            label: `${party.name} ${party.sport === 'Defile' ? '🎺' : party.sport === 'Pompom' ? '🎀' : party.description?.includes('DJ Contest') ? '🎧' : party.description?.includes('Showcase') ? '🎤' : '🎉'}`
          }))
        ];
      case 'restaurants':
        return [
          { value: 'all', label: 'Tous les restaurants' },
          ...restaurants.map(restaurant => ({
            value: restaurant.id,
            label: `${restaurant.name}`
          }))
        ];
      case 'hotel':
        return [
          { value: 'all', label: 'Tous les hôtels' },
          ...hotels.map(hotel => ({
            value: hotel.id,
            label: `${hotel.name}`
          }))
        ];
      case 'hse':
        return [
          { value: 'all', label: 'Tous les fichiers HSE' },
          { value: 'HSE', label: 'HSE' }
        ];
      default:
        return [{ value: 'all', label: 'Tous' }];
    }
  };

  // Options spécifiques pour le formulaire d'ajout (sans "Tous les...")
  const getFormSpecificOptions = (type: string) => {
    switch (type) {
      case 'sports':
        return [
          { value: '', label: 'Sélectionnez un sport' },
          { value: 'Football', label: 'Football ⚽' },
          { value: 'Basketball', label: 'Basketball 🏀' },
          { value: 'Handball', label: 'Handball 🤾' },
          { value: 'Rugby', label: 'Rugby 🏉' },
          { value: 'Ultimate', label: 'Ultimate 🥏' },
          { value: 'Natation', label: 'Natation 🏊' },
          { value: 'Badminton', label: 'Badminton 🏸' },
          { value: 'Tennis', label: 'Tennis 🎾' },
          { value: 'Cross', label: 'Cross 👟' },
          { value: 'Volleyball', label: 'Volleyball 🏐' },
          { value: 'Ping-pong', label: 'Ping-pong 🏓' },
          { value: 'Echecs', label: 'Echecs ♟️' },
          { value: 'Athlétisme', label: 'Athlétisme 🏃‍♂️' },
          { value: 'Spikeball', label: 'Spikeball ⚡️' },
          { value: 'Pétanque', label: 'Pétanque 🍹' },
          { value: 'Escalade', label: 'Escalade 🧗‍♂️' }
        ];
      case 'party':
        return [
          { value: '', label: 'Sélectionnez une soirée/défilé' },
          ...parties.map(party => ({
            value: party.id,
            label: `${party.name} ${party.sport === 'Defile' ? '🎺' : party.sport === 'Pompom' ? '🎀' : party.description?.includes('DJ Contest') ? '🎧' : party.description?.includes('Showcase') ? '🎤' : '🎉'}`
          }))
        ];
      case 'restaurants':
        return [
          { value: '', label: 'Sélectionnez un restaurant' },
          ...restaurants.map(restaurant => ({
            value: restaurant.id,
            label: restaurant.name
          }))
        ];
      case 'hotel':
        return [
          { value: '', label: 'Sélectionnez un hôtel' },
          ...hotels.map(hotel => ({
            value: hotel.id,
            label: hotel.name
          }))
        ];
      case 'hse':
        return [
          { value: '', label: 'Sélectionnez une catégorie' },
          { value: 'HSE', label: 'HSE' }
        ];
      default:
        return [{ value: '', label: 'Sélectionnez' }];
    }
  };

  // Réinitialiser le sous-type du formulaire quand le type change
  useEffect(() => {
    setFormSpecificEvent('');
  }, [formEventType]);

  // Mettre à jour eventType du newFile quand formSpecificEvent change
  useEffect(() => {
    if (formSpecificEvent) {
      setNewFile(prev => ({ ...prev, eventType: formSpecificEvent }));
    }
  }, [formSpecificEvent]);

  // Helper pour détecter mobile
  const isMobile = window.innerWidth < 600;

  // Réinitialiser le filtre spécifique quand le type change
  useEffect(() => {
    setSpecificEvent('all');
  }, [eventType]);

  // Initialiser le filtre basé sur la prop
  useEffect(() => {
    if (filter) {
      if (filter === 'all') {
        setEventType('all');
        setSpecificEvent('all');
      } else if (filter === 'sports') {
        setEventType('sports');
        setSpecificEvent('all');
      } else if (filter === 'restaurants') {
        setEventType('restaurants');
        setSpecificEvent('all');
      } else if (filter === 'hotel') {
        setEventType('hotel');
        setSpecificEvent('all');
      } else if (filter === 'party') {
        setEventType('party');
        setSpecificEvent('all');
      } else if (filter === 'hse') {
        setEventType('hse');
        setSpecificEvent('all');
      } else {
        // C'est un ID spécifique (sport, hôtel, restaurant, party) ou une valeur générique
        // Vérifier dans quelle catégorie il appartient
        const sportsTypes = ['Football', 'Basketball', 'Handball', 'Rugby', 'Ultimate', 'Natation',
          'Badminton', 'Tennis', 'Cross', 'Volleyball', 'Ping-pong', 'Echecs',
          'Athlétisme', 'Spikeball', 'Pétanque', 'Escalade'];
        
        const filterLower = filter.toLowerCase();
        
        if (sportsTypes.includes(filter)) {
          setEventType('sports');
          setSpecificEvent(filter);
        } else if (parties.some(p => p.id === filter)) {
          setEventType('party');
          setSpecificEvent(filter);
        } else if (restaurants.some(r => r.id === filter)) {
          setEventType('restaurants');
          setSpecificEvent(filter);
        } else if (hotels.some(h => h.id === filter)) {
          setEventType('hotel');
          setSpecificEvent(filter);
        } else if (filter === 'HSE' || filterLower === 'hse') {
          setEventType('hse');
          setSpecificEvent('HSE');
        } else if (filterLower.includes('restaurant')) {
          // Valeur générique "Restaurant"
          setEventType('restaurants');
          setSpecificEvent('all');
        } else if (filterLower.includes('hotel') || filterLower.includes('hôtel')) {
          // Valeur générique "Hotel"
          setEventType('hotel');
          setSpecificEvent('all');
        } else if (filterLower.includes('soirée') || filterLower.includes('soiree') || 
                   filterLower.includes('party') || filterLower.includes('défilé') || 
                   filterLower.includes('defile') || filterLower.includes('gala')) {
          // Valeur générique pour les soirées
          setEventType('party');
          setSpecificEvent('all');
        }
      }
    }
  }, [filter, parties, restaurants, hotels]);

  // Vérifier si l'utilisateur est admin (seulement si pas fourni en prop)
  useEffect(() => {
    if (externalIsAdmin === false) {
      let adminUnsubscribe: (() => void) | null = null;
      
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (adminUnsubscribe) {
          adminUnsubscribe();
        }
        
      if (user) {
        const adminsRef = ref(database, 'admins');
          adminUnsubscribe = onValue(adminsRef, (snapshot) => {
          const admins = snapshot.val();
            setInternalIsAdmin(admins && admins[user.uid]);
        });
      } else {
          setInternalIsAdmin(false);
        }
      });
      
      return () => {
        unsubscribe();
        if (adminUnsubscribe) {
          adminUnsubscribe();
        }
      };
    }
  }, [externalIsAdmin]);

  useEffect(() => {
    // Désactiver l'écoute si la page n'est pas visible
    if (!isVisible) return;

    if (onLoadingChange) {
      onLoadingChange(true);
    }

    // Charger les fichiers avec optimisation des connexions
    const optimizer = FirebaseOptimizer.getInstance();
    
    if (!optimizer.canCreateConnection()) {
      console.warn('Limite de connexions Firebase atteinte pour les fichiers');
      if (onLoadingChange) {
        onLoadingChange(false);
      }
      return;
    }

    optimizer.registerConnection();
    
    const filesRef = ref(database, 'planningFiles');
    const filesUnsubscribe = onValue(filesRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        // Calculer la taille des données transférées
        const dataSize = JSON.stringify(data).length;
        optimizer.trackTransfer(dataSize);
        
        const filesArray = Object.entries(data).map(([id, value]) => ({
          id,
          ...(value as Omit<PlanningFile, 'id'>)
        }));
        setFiles(filesArray);
      } else {
        setFiles([]);
      }
      
      if (onLoadingChange) {
        onLoadingChange(false);
      }
    });

    return () => {
      filesUnsubscribe();
      optimizer.unregisterConnection();
    };
  }, [isVisible, onLoadingChange]);

  // Utiliser IntersectionObserver pour détecter la visibilité
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      setIsVisible(entries[0].isIntersecting);
    });
    
    // Observer le conteneur du composant
    const container = document.querySelector('.planning-files');
    if (container) observer.observe(container);
    
    return () => observer.disconnect();
  }, []);

  // Effet pour filtrer les fichiers quand les filtres ou la liste change
  useEffect(() => {
    let filtered = files;

    // Filtre par type d'événement (premier niveau)
    if (eventType === 'sports') {
      const sportsTypes = [
        'Football', 'Basketball', 'Handball', 'Rugby', 'Ultimate', 'Natation',
        'Badminton', 'Tennis', 'Cross', 'Volleyball', 'Ping-pong', 'Echecs',
        'Athlétisme', 'Spikeball', 'Pétanque', 'Escalade'
      ];
      filtered = filtered.filter(file => 
        sportsTypes.includes(file.eventType || '')
      );
      
      // Filtre spécifique (second niveau)
      if (specificEvent !== 'all') {
        filtered = filtered.filter(file => file.eventType === specificEvent);
      }
    } else if (eventType === 'party') {
      // Filtrer par IDs des parties ou valeurs génériques
      const partyIds = parties.map(p => p.id);
      filtered = filtered.filter(file => {
        const eventType = file.eventType || '';
        return partyIds.includes(eventType) ||
               eventType.toLowerCase().includes('soirée') ||
               eventType.toLowerCase().includes('soiree') ||
               eventType.toLowerCase().includes('gala') ||
               eventType.toLowerCase().includes('défilé') ||
               eventType.toLowerCase().includes('defile') ||
               eventType.toLowerCase().includes('party') ||
               eventType.toLowerCase().includes('pompom') ||
               eventType.toLowerCase().includes('navette');
      });
      
      if (specificEvent !== 'all') {
        filtered = filtered.filter(file => {
          const eventType = file.eventType || '';
          return eventType === specificEvent ||
                 (specificEvent === '1' && (eventType.toLowerCase().includes('défilé') || eventType.toLowerCase().includes('defile') || eventType.toLowerCase().includes('stanislas'))) ||
                 (specificEvent === '2' && (eventType.toLowerCase().includes('pompom'))) ||
                 (specificEvent === '3' && (eventType.toLowerCase().includes('showcase'))) ||
                 (specificEvent === '4' && (eventType.toLowerCase().includes('dj contest') || eventType.toLowerCase().includes('zenith')));
        });
      }
    } else if (eventType === 'restaurants') {
      // Filtrer par IDs des restaurants ou valeurs génériques
      const restaurantIds = restaurants.map(r => r.id);
      filtered = filtered.filter(file => {
        const eventType = file.eventType || '';
        return restaurantIds.includes(eventType) ||
               eventType.toLowerCase().includes('restaurant') ||
               eventType === 'Restaurant' ||
               eventType === 'restaurant';
      });
      
      if (specificEvent !== 'all') {
        filtered = filtered.filter(file => {
          const eventType = file.eventType || '';
          return eventType === specificEvent ||
                 (specificEvent === '1' && (eventType.toLowerCase().includes('gentilly') || eventType.toLowerCase().includes('salle des fêtes'))) ||
                 (specificEvent === '2' && (eventType.toLowerCase().includes('parc expo') || eventType.toLowerCase().includes('hall b')));
        });
      }
    } else if (eventType === 'hotel') {
      // Filtrer par IDs des hôtels ou valeurs génériques
      const hotelIds = hotels.map(h => h.id);
      filtered = filtered.filter(file => {
        const eventType = file.eventType || '';
        return hotelIds.includes(eventType) ||
               eventType.toLowerCase().includes('hôtel') ||
               eventType.toLowerCase().includes('hotel') ||
               eventType === 'Hotel' ||
               eventType === 'hotel';
      });
      
      if (specificEvent !== 'all') {
        filtered = filtered.filter(file => {
          const eventType = file.eventType || '';
          // Si c'est un ID, faire une correspondance exacte
          if (hotelIds.includes(specificEvent)) {
            return eventType === specificEvent;
          }
          // Sinon, chercher par nom d'hôtel
          const selectedHotel = hotels.find(h => h.id === specificEvent);
          if (selectedHotel) {
            return eventType === specificEvent ||
                   eventType.toLowerCase().includes(selectedHotel.name.toLowerCase());
          }
          return false;
        });
      }
    } else if (eventType === 'hse') {
      filtered = filtered.filter(file => 
        file.eventType === 'HSE' ||
        file.eventType?.toLowerCase().includes('hse')
      );
    }

    setFilteredFiles(filtered);
  }, [eventType, specificEvent, files, parties, restaurants, hotels]);

  const handleDeleteFile = async (fileId: string) => {
    if (!isAdmin) return;
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      try {
        const fileToDelete = files.find(f => f.id === fileId);
        if (fileToDelete && fileToDelete.url) {
          const url = new URL(fileToDelete.url);
          const pathMatch = decodeURIComponent(url.pathname).match(/\/o\/(.+)$/);
          let storagePath = '';
          if (pathMatch && pathMatch[1]) {
            storagePath = pathMatch[1].replace(/\?.*$/, '').replace(/%2F/g, '/');
          } else {
            storagePath = `planningFiles/${fileToDelete.name}`;
          }
          try {
            await deleteObject(storageRef(storage, storagePath));
            console.log('Fichier supprimé du storage avec succès');
          } catch (error: any) {
            if (error.code === 'storage/object-not-found') {
              console.info('Fichier déjà supprimé ou inexistant dans Firebase Storage.');
            } else if (error.code === 'storage/unauthorized' || error.code === 'storage/forbidden') {
              console.warn('Permissions insuffisantes pour supprimer le fichier du storage, suppression de la base de données uniquement.');
            } else {
              console.warn('Erreur lors de la suppression du fichier du storage:', error.message);
            }
          }
        }
        await remove(ref(database, `planningFiles/${fileId}`));
        console.log('Fichier supprimé de la base de données avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Une erreur est survenue lors de la suppression du fichier.');
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewFile(prev => ({ ...prev, name: file.name }));
    }
  };

  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !isEditing) return;

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert('Veuillez sélectionner un fichier.');
      return;
    }

    const optimizer = FirebaseOptimizer.getInstance();
    
    if (!optimizer.canCreateConnection()) {
      alert('Limite de connexions Firebase atteinte. Veuillez réessayer plus tard.');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      if (file.size > 100 * 1024 * 1024) {
        throw new Error('Le fichier est trop volumineux. Taille maximum : 100MB');
      }

      let fileToUpload = file;
      if (file.type.startsWith('image/')) {
        setUploadProgress(10);
        try {
          fileToUpload = await compressImage(file, 500, 0.8);
          console.log(`Image compressée: ${file.size} bytes → ${fileToUpload.size} bytes (${Math.round((1 - fileToUpload.size / file.size) * 100)}% de réduction)`);
        } catch (compressionError) {
          console.warn('Erreur de compression, utilisation du fichier original:', compressionError);
          fileToUpload = file;
        }
      }

      const timestamp = Date.now();
      const sanitizedFileName = fileToUpload.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storagePath = `planningFiles/${timestamp}_${sanitizedFileName}`;

      optimizer.trackStorage(fileToUpload.size);
      optimizer.trackTransfer(fileToUpload.size);

      const storageReference = storageRef(storage, storagePath);
      const uploadTask = uploadBytesResumable(storageReference, fileToUpload);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Erreur lors de l\'upload:', error);
          if (error.code === 'storage/unauthorized' || error.code === 'storage/forbidden') {
            console.warn('Permissions insuffisantes pour l\'upload. Vérifiez les règles de sécurité Firebase Storage.');
          }
          setUploading(false);
          setUploadProgress(0);
          throw error;
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            const fileData = {
        ...newFile,
              url: downloadURL,
        uploadDate: Date.now(),
              uploadedBy: 'admin',
              originalSize: file.size,
              compressedSize: fileToUpload.size,
              compressionRatio: file.type.startsWith('image/') ? Math.round((1 - fileToUpload.size / file.size) * 100) : 0
            };
            
            const dataSize = JSON.stringify(fileData).length;
            optimizer.trackTransfer(dataSize);

            const newFileRef = push(ref(database, 'planningFiles'));
            await set(newFileRef, fileData);

      setNewFile({
        name: '',
              type: 'image',
        url: '',
              eventType: ''
      });
      setFormEventType('sports');
      setFormSpecificEvent('');
      setShowAddForm(false);

            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            
            setUploading(false);
            setUploadProgress(0);
          } catch (error) {
            console.error('Erreur lors de la sauvegarde des informations:', error);
            setUploading(false);
            setUploadProgress(0);
            throw error;
          }
        }
      );
    } catch (error) {
      console.error('Erreur lors de l\'ajout du fichier:', error);
      let errorMessage = 'Une erreur est survenue lors de l\'ajout du fichier.';
      
      if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          errorMessage = 'Erreur CORS : Veuillez vérifier la configuration de Firebase Storage.';
        } else if (error.message.includes('trop volumineux')) {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Barre de progression d'upload globale
  const uploadProgressBar = uploading ? (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 10000,
      background: 'rgba(20,20,20,0.95)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: '12px',
      border: '2px solid var(--accent-color)',
      minWidth: '300px',
      maxWidth: '500px',
    }}>
      <div style={{
        color: 'var(--accent-color)',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        marginBottom: '15px',
        textAlign: 'center'
      }}>
        Upload en cours...
      </div>
      <div style={{
        width: '100%',
        height: '16px',
        background: '#333',
        borderRadius: '8px',
        overflow: 'hidden',
        marginBottom: '10px',
      }}>
        <div style={{
          width: `${uploadProgress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, var(--accent-color), #4CAF50)',
          transition: 'width 0.3s ease',
          borderRadius: '8px',
        }}></div>
      </div>
      <div style={{
        color: 'var(--accent-color)',
        fontWeight: 'bold',
        fontSize: '1.3rem',
        marginBottom: '5px'
      }}>
        {Math.round(uploadProgress)}%
      </div>
      <div style={{
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        textAlign: 'center'
      }}>
        {uploadProgress < 100 ? 'Téléchargement du fichier...' : 'Finalisation de l\'upload...'}
      </div>
    </div>
  ) : null;

  return (
    <div className="planning-files" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      width: '100%',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      {uploadProgressBar}
      
      <h2 style={{ marginTop: 0, marginBottom: '10px', textAlign: 'center' }}>Fichiers</h2>
      
      {showFilterSelector && (
        <div className="filters" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', width: '100%', maxWidth: '340px' }}>
          {/* Premier niveau de filtre */}
          <div className="filter-group">
            <label style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '4px', display: 'block', textAlign: 'center' }}>
              Type d'événement :
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="filter-select"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-color)',
                color: 'var(--text-color)',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              {eventTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Second niveau de filtre (conditionnel) */}
          {eventType !== 'all' && (
            <div className="filter-group">
              <label style={{ fontSize: '0.9rem', color: 'var(--text-color)', marginBottom: '4px', display: 'block', textAlign: 'center' }}>
                {eventType === 'sports' ? 'Sport :' :
                 eventType === 'party' ? 'Soirée :' :
                 eventType === 'restaurants' ? 'Restaurant :' :
                 eventType === 'hotel' ? 'Hôtel :' :
                 eventType === 'hse' ? 'HSE :' : 'Spécifique :'}
              </label>
              <select
                value={specificEvent}
                onChange={(e) => setSpecificEvent(e.target.value)}
                className="filter-select"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-color)',
                  color: 'var(--text-color)',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {getSpecificOptions(eventType).map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      <div className="planning-content" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {isEditing && isAdmin && (
        <div className="admin-controls" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1rem' }}>
          <button
            className="add-file-button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
              {showAddForm ? 'Annuler' : 'Ajouter un fichier'}
          </button>
        </div>
      )}

      {showAddForm && isEditing && isAdmin && (
          <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
          }}>
            <div className="modal-content" style={{
              background: 'var(--bg-color)',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '400px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid var(--border-color)',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                borderBottom: '1px solid var(--border-color)',
                position: 'relative'
              }}>
                <h3 style={{ margin: 0, color: 'var(--text-color)', fontSize: '1.2rem' }}>
                  Ajouter un fichier
                </h3>
              <button 
                onClick={() => setShowAddForm(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                    color: 'var(--text-color)',
                    position: 'absolute',
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                  padding: '0.5rem',
                    lineHeight: 1
                  }}
              >
                ×
              </button>
              </div>

              <div style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-color)'
              }}>

              <form onSubmit={handleAddFile} style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '0.7rem' : '1rem',
                width: '100%',
                boxSizing: 'border-box',
              }}>
          <div className="form-group">
                  <label htmlFor="fileName">Nom du fichier</label>
            <input
              type="text"
              id="fileName"
              value={newFile.name}
              onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
              required
              placeholder="Ex: Planning Basketball M"
                    style={{
                      width: '100%',
                      padding: isMobile ? '0.4rem' : '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: isMobile ? '0.98rem' : '1rem',
                      boxSizing: 'border-box',
                    }}
            />
          </div>

          <div className="form-group">
                  <label htmlFor="formEventType">Catégorie</label>
            <select
                    id="formEventType"
                    value={formEventType}
                    onChange={(e) => setFormEventType(e.target.value)}
              required
                    style={{
                      width: '100%',
                      padding: isMobile ? '0.4rem' : '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: isMobile ? '0.98rem' : '1rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    {eventTypeOptions.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
            </select>
          </div>

          <div className="form-group">
                  <label htmlFor="formSpecificEvent">
                    {formEventType === 'sports' ? 'Sport' :
                     formEventType === 'party' ? 'Soirée/Défilé' :
                     formEventType === 'restaurants' ? 'Restaurant' :
                     formEventType === 'hotel' ? 'Hôtel' :
                     formEventType === 'hse' ? 'HSE' : 'Type'}
                  </label>
            <select
                    id="formSpecificEvent"
                    value={formSpecificEvent}
                    onChange={(e) => setFormSpecificEvent(e.target.value)}
              required
                    style={{
                      width: '100%',
                      padding: isMobile ? '0.4rem' : '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: isMobile ? '0.98rem' : '1rem',
                      boxSizing: 'border-box',
                    }}
                  >
                    {getFormSpecificOptions(formEventType).map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
            </select>
          </div>

          <div className="form-group">
                  <label htmlFor="fileInput">Fichier</label>
            <input
                    type="file"
                    id="fileInput"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
              required
                    className="file-input"
                    style={{
                      width: '100%',
                      padding: isMobile ? '0.4rem' : '0.5rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: isMobile ? '0.98rem' : '1rem',
                      boxSizing: 'border-box',
                    }}
            />
          </div>

          <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '1rem', justifyContent: 'space-between', marginTop: '1rem', flexWrap: isMobile ? 'wrap' : 'nowrap', width: '100%' }}>
                  <button 
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    style={{
                      padding: isMobile ? '0.4rem 1rem' : '0.5rem 1.5rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--error-color)',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontWeight: 'bold',
                      fontSize: isMobile ? '0.98rem' : '1rem',
                      minWidth: 0,
                      boxSizing: 'border-box',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    disabled={uploading}
                    style={{
                      padding: isMobile ? '0.4rem 1rem' : '0.5rem 1.5rem',
                      borderRadius: '4px',
                      border: '1px solid var(--border-color)',
                      background: 'linear-gradient(45deg, var(--accent-color), #4CAF50)',
                      color: 'white',
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      opacity: uploading ? 0.7 : 1,
                      transition: 'all 0.2s ease',
                      fontWeight: 'bold',
                      fontSize: isMobile ? '0.98rem' : '1rem',
                      minWidth: 0,
                      boxSizing: 'border-box',
                    }}
                    onMouseOver={(e) => !uploading && (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseOut={(e) => !uploading && (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    {uploading ? 'Upload en cours...' : 'Ajouter le fichier'}
          </button>
                </div>
        </form>
              </div>
            </div>
          </div>
      )}

      {filteredFiles.length === 0 ? (
          <p className="no-files" style={{ textAlign: 'center', width: '100%' }}>Aucun fichier disponible</p>
      ) : (
          <div className="files-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '40vh', overflowY: 'auto', width: '100%', maxWidth: '340px', minWidth: 0, alignItems: 'center' }}>
          {filteredFiles.map((file) => {
            return (
              <div key={file.id} className="file-item" style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: isMobile ? '0.6rem 0.5rem' : '0.75rem 1rem',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                marginBottom: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '0.3rem' : '0.5rem',
                minWidth: 0,
                width: '100%',
                maxWidth: 340,
                boxSizing: 'border-box',
                wordBreak: 'break-word',
                margin: '0 auto',
              }}>
                <div style={{
                  fontWeight: 600,
                  fontSize: isMobile ? '0.98rem' : '1rem',
                  color: 'var(--text-primary)',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  marginBottom: 2,
                  maxWidth: '100%',
                  minWidth: 0,
                }}>{file.name}</div>
                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '4px'
                }}>
                  {file.eventType}
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'flex-end',
                  width: '100%',
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-color)',
                }}>
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    style={{
                      padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem',
                      borderRadius: '4px',
                      background: 'var(--accent-color)',
                      color: 'white',
                      border: 'none',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontWeight: 500,
                      fontSize: isMobile ? '0.9rem' : '0.95rem',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.opacity = '0.9';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.opacity = '1';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    Voir
                  </button>
                  {isEditing && isAdmin && (
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="delete-button"
                      style={{
                        padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1rem',
                        borderRadius: '4px',
                        border: 'none',
                        background: 'var(--error-color)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 500,
                        fontSize: isMobile ? '0.9rem' : '0.95rem',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.opacity = '0.9';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.opacity = '1';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                      Supprimer
                  </button>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
} 
