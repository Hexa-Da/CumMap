# CumMap

CumMap est une application web interactive développée pour le Cartel NAncy 2026, un événement majeur rassemblant plus de 3000 étudiants des écoles d'ingénieur de l'Alliance IMT.

## 🎯 Objectif du projet

L'objectif principal de CumMap est de faciliter la navigation et l'organisation des participants lors du Cartel Paris 2025 (Version supporter des Mines de Nancy). L'application permet de centraliser toutes les informations concernant les événements sportifs, les soirées et les lieux importants, offrant ainsi une expérience utilisateur optimale pour les participants. 

## 🎥 Démo des fonctionnalités principales

Une démo de l'application est disponible à l'adresse [https://cummap.netlify.app](https://cummap.netlify.app). 
Vous pouvez y découvrir toutes les fonctionnalités de l'application, notamment :

### Carte interactive
- 🗺️ Visualisation des lieux d'événements sur une carte interactive avec Leaflet
- 🎯 Géolocalisation des utilisateurs avec gestion des erreurs et retry
- 📍 Marqueurs personnalisés pour différents types d'événements (matchs, soirées, hôtels)
- 🔍 4 styles de carte différents (OpenStreetMap, CyclOSM, Humanitarian, OSM France)
- 🎨 Support du mode sombre

### Gestion des événements
- 📅 Affichage chronologique des événements
- 🏷️ Filtrage avancé par type d'événement (sportif, soirée, etc.), délégation, lieu, et genre (Féminin, Masculin, Mixte)
- 🎛️ Boutons "Filtrer" et "Réinitialiser" pour un contrôle rapide des filtres
- 📋 Liste détaillée avec informations complètes
- ⭐ Système de favoris pour marquer les événements importants
- 🗂️ Onglet "Planning" pour consulter les plannings PDF/Excel (bus, tournois, soirées)
- 📆 Calendrier interactif avec header harmonisé, filtres contextuels, et affichage compact des filtres
- 🔄 Synchronisation des filtres entre l'onglet événements et le calendrier
- ⏩ Auto-scroll automatique vers le prochain événement à venir

### Fonctionnalités sociales et sécurité
- 💬 Chat d'organisation intégré (messages admins, édition/suppression, responsive, couleurs adaptées, nom personnalisable)
- 🚨 Popup contacts d'urgence accessible en un clic depuis le header

### Fonctionnalités administratives
- 🔒 Authentification Google via Firebase
- 👤 Gestion des droits administrateur
- ✏️ Mode édition pour ajouter/modifier/supprimer des lieux
- 📝 Gestion des matchs avec dates et descriptions
- ↩️ Système d'annulation/rétablissement des actions
- 🗨️ Gestion des messages d'organisation (ajout, édition, suppression de messages dans le chat)

### UI/UX et accessibilité
- 📱 Interface responsive adaptée mobile et desktop
- 🦾 Accessibilité renforcée (contrastes, navigation clavier, textes lisibles en mode sombre et clair)
- 🎯 Boutons et éléments interactifs accessibles et bien espacés

## 💻 Technologies utilisées

### Frontend
- **React** : Bibliothèque JavaScript pour l'interface utilisateur
- **TypeScript** : Pour un développement plus robuste
- **Vite** : Outil de build moderne
- **Leaflet** : Bibliothèque de cartographie interactive

### Backend & Base de données
- **Firebase** : 
  - **Realtime Database** : Stockage des données en temps réel
  - **Authentication** : Gestion des utilisateurs avec Google

### Analytics
- **Google Analytics 4** : Suivi des événements et interactions utilisateurs

## 🔧 Installation et développement

### Prérequis
- Node.js (v18 ou supérieur)
- npm ou yarn
- Compte Firebase

### Installation
```bash
# Cloner le repository
git clone https://github.com/votre-username/cummap.git

# Installer les dépendances
cd cummap
npm install

# Lancer l'application en mode développement
npm run dev
```

### Configuration Firebase
1. Créer un projet Firebase
2. Activer les services nécessaires (Realtime Database, Authentication)
3. Configurer les règles de sécurité
4. Créer un fichier `.env` avec les variables d'environnement Firebase :
```
VITE_FIREBASE_API_KEY=votre-clé-api
VITE_FIREBASE_AUTH_DOMAIN=votre-domaine
VITE_FIREBASE_DATABASE_URL=votre-url-database
VITE_FIREBASE_PROJECT_ID=votre-id-projet
VITE_FIREBASE_STORAGE_BUCKET=votre-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=votre-sender-id
VITE_FIREBASE_APP_ID=votre-app-id
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer au projet :
1. Fork le repository
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

