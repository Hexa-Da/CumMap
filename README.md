# CumMap

CumMap est une application web interactive qui a évolué pour devenir le client web de l'application officielle du Cartel Nancy 2026. Initialement créée pour le Cartel de Paris 2025 en tant que support pour les supportères des Mines de Nancy, l'application a été adaptée et enrichie pour répondre aux besoins de l'événement majeur rassemblant plus de 2000 étudiants des écoles d'ingénieur de l'Alliance IMT.

## 🎯 Objectif du projet

**Origine** : CumMap a été développée initialement pour faciliter la navigation et l'organisation des participants lors du Cartel Paris 2025, spécifiquement pour les supportères des Mines de Nancy.

**Évolution** : L'application a évolué pour devenir le client web de l'application officielle du Cartel Nancy 2026 (repo privé : `App_Cartel_Nancy`). Elle centralise maintenant toutes les informations concernant les événements sportifs, les soirées et les lieux importants, offrant une expérience utilisateur optimale pour tous les participants, quelle que soit leur délégation.

## 🏗️ Architecture du projet

CumMap fonctionne comme un client web frontend qui se connecte à la base de données Firebase partagée avec l'application officielle mobile du Cartel Nancy 2026. Cette architecture permet :

- **Synchronisation en temps réel** des données entre l'application mobile et web
- **Gestion centralisée** des événements, lieux et informations
- **Interface web responsive** complémentaire à l'application mobile native
- **Accès multi-plateforme** aux informations du Cartel

## 🎥 Démo des fonctionnalités principales

L'application web est en ligne sur [https://cummap.homeofparis.com](https://cummap.homeofparis.com).
Vous pouvez y découvrir une partie des fonctionnalités de l'application finale, notamment :

### Carte interactive
- 🗺️ Visualisation des lieux d'événements sur une carte interactive avec Leaflet
- 🎯 Géolocalisation des utilisateurs avec gestion des erreurs et retry automatique
- 📍 Marqueurs personnalisés pour différents types d'événements (matchs, soirées, hôtels et restaurants)
- 🔍 4 styles de carte différents (OpenStreetMap, CyclOSM, Humanitarian, OSM France)
- 🏨 Gestion des hôtels avec informations de contact
- 🍽️ Gestion des restaurants avec types de repas (midi/soir)
- 🔄 Mise à jour en temps réel de la position de l'utilisateur

### Gestion des événements
- 📅 Affichage chronologique des événements
- 🏷️ Filtrage avancé par type d'événement (sportif, soirée, etc.), délégation, lieu, et genre (Féminin, Masculin, Mixte)
- 🎛️ Boutons "Filtrer" et "Réinitialiser" pour un contrôle rapide des filtres
- 📋 Liste détaillée avec informations complètes (équipes, horaires, résultats)
- 🗂️ Onglet "Planning" pour consulter les plannings PDF (bus, tournois, soirées)
- 📆 Calendrier interactif avec header harmonisé, filtres contextuels, et affichage compact des filtres
- 🔄 Synchronisation des filtres entre l'onglet événements et le calendrier
- ⏩ Auto-scroll automatique vers le prochain événement à venir

### Fonctionnalités sociales et sécurité
- 💬 Chat d'organisation intégré (messages admins, édition/suppression, responsive, couleurs adaptées, nom personnalisable)
- 🔔 Notifications push pour les nouveaux messages de chat (web et mobile)
- 📱 Support Capacitor pour notifications natives (Android/iOS)
- 🚨 Popup contacts d'urgence accessible en un clic depuis le header
- 🔐 Authentification sécurisée des endpoints Cloud Functions

### Fonctionnalités administratives
- 🔒 Authentification Google via Firebase
- 👤 Gestion des droits administrateur
- ✏️ Mode édition pour ajouter/modifier/supprimer des lieux
- 📝 Gestion des matchs avec dates, descriptions et résultats
- ↩️ Système d'annulation/rétablissement des actions (historique)
- 🗨️ Gestion des messages d'organisation (ajout, édition, suppression de messages dans le chat)
- 📤 Upload de fichiers de planning avec compression automatique d'images
- 🗂️ Organisation des fichiers par catégories (sports, soirées, restaurants, hôtels, transports, HSE)

### UI/UX et accessibilité
- 📱 Interface responsive adaptée mobile et desktop
- 🦾 Accessibilité renforcée (contrastes, navigation clavier, textes lisibles en mode sombre et clair)
- 🎯 Boutons et éléments interactifs accessibles et bien espacés

## 💻 Technologies utilisées

### Frontend
- **React** : Bibliothèque JavaScript pour l'interface utilisateur
- **TypeScript** : Pour un développement plus robuste
- **Vite** : Outil de build moderne et rapide
- **Leaflet** : Bibliothèque de cartographie interactive
- **React Router DOM** : Navigation et routage
- **React GA4** : Intégration Google Analytics 4

### Backend & Base de données
- **Firebase** : 
  - **Realtime Database** : Stockage des données en temps réel
  - **Authentication** : Gestion des utilisateurs avec Google
  - **Storage** : Stockage de fichiers (PDF, images) avec compression automatique
  - **Cloud Functions** : Fonctions serverless pour les notifications push et la synchronisation
  - **Cloud Messaging (FCM)** : Notifications push pour web et mobile

### Services & Optimisations
- **NotificationService** : Service centralisé pour les notifications push (web et native via Capacitor)
- **FirebaseOptimizer** : Optimisation des connexions Firebase et monitoring des coûts
- **Logger** : Service de logging centralisé

### Analytics
- **Google Analytics 4** : Suivi des événements et interactions utilisateurs

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🔗 Liens utiles

- **Application en ligne** : [https://cummap.homeofparis.com](https://cummap.homeofparis.com)
- **Documentation Firebase** : [https://firebase.google.com/docs](https://firebase.google.com/docs)
- **Documentation Leaflet** : [https://leafletjs.com/](https://leafletjs.com/)

