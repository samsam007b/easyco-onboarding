# Plan de Développement iOS - EasyCo
## Architecture de Travail Parallèle par Rôle

---

## 📋 Vue d'Ensemble

Ce document définit le plan de développement pour l'application iOS native EasyCo. Le développement est organisé en **2 phases principales** et **3 workstreams parallèles** (un par rôle utilisateur).

### Objectifs Globaux
1. **Phase 1** : Implémenter toutes les fonctionnalités complexes de la web app
2. **Phase 2** : Adapter le design/graphisme pour correspondre à la web app tout en respectant les conventions iOS

### Organisation du Travail
- **3 équipes parallèles** : Searcher, Resident, Owner
- **Chaque équipe** travaille de manière autonome sur son rôle
- **Composants partagés** : authentification, navigation, composants UI communs

---

## 🎯 Phase 1 : Implémentation des Fonctionnalités

### Priorité : Fonctionnalités Complexes d'Abord

Chaque rôle doit implémenter ses fonctionnalités dans l'ordre suivant :
1. Fonctionnalités complexes (logique métier, API, state management)
2. Fonctionnalités moyennes (interactions utilisateur, formulaires)
3. Fonctionnalités simples (affichage, navigation basique)

---

## 👥 WORKSTREAM 1 : SEARCHER (Chercheur de Logement)

### Contexte
- **Couleur principale** : Orange (#FFA040)
- **Persona** : Utilisateur cherchant un logement en colocation
- **Pages principales** : Recherche, Favoris, Matches, Groupes, Messages, Profil

### Phase 1A : Fonctionnalités Complexes

#### 1.1 Recherche de Propriétés avec Filtres Avancés
**Priorité : CRITIQUE**

- [ ] **Système de filtrage multi-critères**
  - Localisation : Ville, quartier, rayon de recherche
  - Prix : Min/Max avec slider
  - Type de logement : Appartement, Maison, Studio, etc.
  - Nombre de chambres : Min/Max
  - Date de disponibilité : Date picker
  - Équipements : Multi-sélection (wifi, parking, meublé, etc.)
  - Préférences de colocataires : Genre, âge, fumeur/non-fumeur, animaux

- [ ] **Recherche temps réel avec debouncing**
  - Barre de recherche avec suggestions
  - Debounce 500ms pour éviter trop de requêtes
  - Recherche par ville, quartier, code postal

- [ ] **Système de sauvegarde de filtres**
  - Sauvegarder des recherches favorites
  - Notifications pour nouvelles propriétés matchant les critères
  - Gérer plusieurs recherches sauvegardées

- [ ] **Tri et pagination**
  - Tri par : Prix, Date, Pertinence, Distance
  - Infinite scroll avec lazy loading
  - Cache des résultats pour performance

**Fichiers concernés** :
- `Features/Properties/Filters/FiltersView.swift` ✅ (existe)
- `Features/Properties/List/PropertiesViewModel.swift` ✅ (existe)
- `Models/Property.swift` ✅ (existe)

**API à implémenter** :
```swift
// Core/Network/APIEndpoint.swift
case searchProperties(filters: PropertyFilters, page: Int)
case saveSearch(SearchPreferences)
case getSavedSearches
```

#### 1.2 Système de Matches Intelligents
**Priorité : CRITIQUE**

- [ ] **Algorithme de compatibilité**
  - Calcul du score de compatibilité (0-100%)
  - Critères : Budget, localisation, préférences, lifestyle
  - Pondération des critères selon priorités utilisateur

- [ ] **Affichage des matches**
  - Liste des propriétés avec score > 80%
  - Explication du score (pourquoi c'est un bon match)
  - Filtrer par score minimum

- [ ] **Notifications de nouveaux matches**
  - Push notifications pour matches > 90%
  - Badge sur l'onglet Matches

**Fichiers concernés** :
- `Features/Matches/MatchesView.swift` ✅ (existe)
- `Models/Property.swift` (ajouter `compatibilityScore`)

**API à implémenter** :
```swift
case getMatches(minScore: Int)
case calculateCompatibility(propertyId: UUID, userId: UUID)
```

#### 1.3 Système de Groupes de Recherche
**Priorité : HAUTE**

- [ ] **Création et gestion de groupes**
  - Créer un groupe avec nom, description
  - Inviter des membres par email/lien
  - Définir des préférences de groupe (budget commun, localisation)
  - Gérer les rôles : Admin, Membre

- [ ] **Recherche collaborative**
  - Recherche partagée entre membres du groupe
  - Vote sur les propriétés (Like/Dislike)
  - Chat de groupe intégré
  - Notifications de groupe

- [ ] **Décisions de groupe**
  - Système de vote pour candidater ensemble
  - Voir les votes de chaque membre
  - Finaliser la candidature quand consensus

**Fichiers concernés** :
- `Features/Groups/GroupsListView.swift` ✅ (existe)
- `Models/Group.swift` ✅ (existe)
- Créer : `Features/Groups/CreateGroupView.swift`
- Créer : `Features/Groups/GroupDetailView.swift`
- Créer : `Features/Groups/GroupChatView.swift`

**API à implémenter** :
```swift
case createGroup(GroupCreationData)
case inviteToGroup(groupId: UUID, emails: [String])
case voteOnProperty(groupId: UUID, propertyId: UUID, vote: Vote)
case getGroupVotes(groupId: UUID, propertyId: UUID)
```

#### 1.4 Système de Candidature
**Priorité : HAUTE**

- [ ] **Formulaire de candidature multi-étapes**
  - Étape 1 : Informations personnelles
  - Étape 2 : Situation professionnelle/études
  - Étape 3 : Documents (pièce d'identité, justificatifs)
  - Étape 4 : Message de motivation
  - Validation à chaque étape

- [ ] **Upload de documents**
  - Pièce d'identité (recto/verso)
  - Justificatifs de revenus (3 derniers bulletins)
  - Attestation employeur/école
  - Caution/Garant si nécessaire
  - Compression et optimisation des images
  - Validation du format et de la taille

- [ ] **Tracking des candidatures**
  - Statuts : En attente, Acceptée, Refusée, En cours d'examen
  - Notifications de changement de statut
  - Historique des candidatures
  - Possibilité de retirer une candidature

**Fichiers à créer** :
- `Features/Applications/ApplyView.swift`
- `Features/Applications/ApplicationFormView.swift`
- `Features/Applications/DocumentUploadView.swift`
- `Features/Applications/MyApplicationsView.swift`

**API à implémenter** :
```swift
case submitApplication(ApplicationData)
case uploadDocument(type: DocumentType, data: Data)
case getMyApplications
case withdrawApplication(id: UUID)
```

#### 1.5 Messagerie en Temps Réel
**Priorité : HAUTE**

- [ ] **Chat one-to-one avec propriétaires**
  - Liste des conversations
  - Interface de chat temps réel
  - WebSocket pour messages instantanés
  - Indicateur "en train d'écrire..."
  - Notifications push pour nouveaux messages

- [ ] **Fonctionnalités avancées**
  - Envoi de photos
  - Partage de localisation
  - Messages vocaux (optionnel)
  - Recherche dans l'historique
  - Archiver/Supprimer conversations

- [ ] **Gestion des conversations**
  - Badge de messages non lus
  - Marquer comme lu/non lu
  - Bloquer un utilisateur
  - Signaler un abus

**Fichiers concernés** :
- `Features/Messages/MessagesListView.swift` ✅ (existe)
- Créer : `Features/Messages/ChatView.swift`
- Créer : `Features/Messages/ConversationViewModel.swift`
- Créer : `Core/WebSocket/MessageWebSocketManager.swift`

**API à implémenter** :
```swift
case getConversations
case getMessages(conversationId: UUID, page: Int)
case sendMessage(conversationId: UUID, content: String, attachments: [Data])
case markAsRead(conversationId: UUID)
// WebSocket pour temps réel
```

### Phase 1B : Fonctionnalités Moyennes

#### 1.6 Système de Favoris
**Priorité : MOYENNE**

- [ ] **Gestion des favoris**
  - Ajouter/Retirer des favoris
  - Liste des favoris avec filtres
  - Synchronisation cloud
  - Organiser en collections/dossiers

- [ ] **Notifications sur favoris**
  - Alerte si prix baisse
  - Alerte si bientôt plus disponible
  - Nouvelles photos ajoutées

**Fichiers concernés** :
- `Features/Favorites/FavoritesView.swift` ✅ (existe)

**API à implémenter** :
```swift
case toggleFavorite(propertyId: UUID)
case getFavorites
```

#### 1.7 Profil et Paramètres
**Priorité : MOYENNE**

- [ ] **Gestion du profil**
  - Modifier informations personnelles
  - Changer photo de profil
  - Gérer préférences de recherche par défaut
  - Définir budget et critères principaux

- [ ] **Paramètres de compte**
  - Notifications (push, email)
  - Confidentialité
  - Langue
  - Changer de rôle (Searcher → Resident)
  - Déconnexion / Suppression de compte

**Fichiers concernés** :
- `Features/Profile/ProfileView.swift` ✅ (existe)
- `Features/Profile/SettingsView.swift` ✅ (existe)

### Phase 1C : Fonctionnalités Simples

#### 1.8 Détail de Propriété
**Priorité : BASSE**

- [ ] **Page de détail complète**
  - Galerie d'images avec zoom
  - Informations détaillées
  - Carte de localisation
  - Équipements en icônes
  - Description complète
  - Informations sur le propriétaire

- [ ] **Actions rapides**
  - Bouton Favoris
  - Bouton Partager
  - Bouton Candidater
  - Bouton Contacter

**Fichiers concernés** :
- `Features/Properties/Detail/PropertyDetailView.swift` ✅ (existe)

---

## 🏠 WORKSTREAM 2 : RESIDENT (Résident Actuel)

### Contexte
- **Couleur principale** : Coral (#E8865D)
- **Persona** : Utilisateur déjà en colocation, gère sa vie quotidienne
- **Pages principales** : Hub, Tâches, Dépenses, Messages, Événements, Profil

### Phase 1A : Fonctionnalités Complexes

#### 2.1 Hub du Résident (Dashboard)
**Priorité : CRITIQUE**

- [ ] **Dashboard centralisé**
  - Vue d'ensemble de la colocation
  - Tâches à faire aujourd'hui
  - Dépenses en attente
  - Événements à venir
  - Messages non lus
  - Alertes importantes

- [ ] **Informations du logement**
  - Détails du bail
  - Date de fin de bail
  - Montant du loyer et charges
  - Contact du propriétaire
  - Adresse et informations pratiques

- [ ] **Widgets personnalisables**
  - Choisir quels widgets afficher
  - Réorganiser l'ordre
  - Taille des widgets

**Fichiers concernés** :
- `Features/Resident/ResidentHubView.swift` ✅ (existe)
- Créer : `Features/Resident/WidgetConfigView.swift`

**API à implémenter** :
```swift
case getResidentDashboard
case getLeaseInfo
case updateWidgetPreferences(WidgetConfig)
```

#### 2.2 Système de Gestion des Tâches Partagées
**Priorité : CRITIQUE**

- [ ] **Gestion des tâches ménagères**
  - Créer des tâches récurrentes (ex: poubelles chaque mardi)
  - Créer des tâches ponctuelles
  - Assigner à un colocataire ou rotation automatique
  - Définir priorité et date d'échéance
  - Templates de tâches courantes

- [ ] **Rotation et planification**
  - Système de rotation automatique équitable
  - Planning hebdomadaire/mensuel
  - Notifications avant échéance
  - Voir l'historique des tâches accomplies

- [ ] **Suivi et validation**
  - Marquer comme complété
  - Photo de preuve (optionnel)
  - Validation par autre colocataire (optionnel)
  - Statistiques : qui fait le plus de tâches

- [ ] **Rappels et notifications**
  - Push notification avant échéance
  - Rappels récurrents si non fait
  - Alerte si tâche en retard

**Fichiers concernés** :
- `Features/Resident/TasksView.swift` ✅ (existe)
- Créer : `Features/Resident/CreateTaskView.swift`
- Créer : `Features/Resident/TaskRotationSettingsView.swift`
- Créer : `Features/Resident/TaskStatsView.swift`

**API à implémenter** :
```swift
case getTasks(filter: TaskFilter)
case createTask(TaskData)
case updateTask(id: UUID, TaskData)
case completeTask(id: UUID, proof: Data?)
case deleteTask(id: UUID)
case getTaskStats(householdId: UUID)
case setupRotation(RotationConfig)
```

#### 2.3 Gestion des Dépenses Partagées
**Priorité : CRITIQUE**

- [ ] **Ajout de dépenses**
  - Montant, description, date
  - Catégorie (loyer, courses, électricité, etc.)
  - Upload du reçu/facture
  - Qui a payé
  - Répartition : égale ou personnalisée

- [ ] **Calcul automatique des remboursements**
  - Algorithme de compensation optimale
  - Qui doit combien à qui
  - Historique des dettes
  - Rappels de paiement

- [ ] **Catégories et budget**
  - Catégories personnalisables
  - Budget mensuel par catégorie
  - Alertes si budget dépassé
  - Graphiques de dépenses

- [ ] **Validation des dépenses**
  - Dépenses en attente de validation
  - Système de vote si montant élevé
  - Contester une dépense

**Fichiers à créer** :
- `Features/Resident/ExpensesView.swift`
- `Features/Resident/AddExpenseView.swift`
- `Features/Resident/BalanceView.swift`
- `Features/Resident/ExpenseStatsView.swift`
- `Models/Expense.swift`

**API à implémenter** :
```swift
case getExpenses(householdId: UUID, filter: ExpenseFilter)
case addExpense(ExpenseData)
case updateExpense(id: UUID, ExpenseData)
case deleteExpense(id: UUID)
case getBalance(householdId: UUID)
case settleDebt(from: UUID, to: UUID, amount: Double)
case getExpenseStats(householdId: UUID, period: Period)
```

#### 2.4 Système d'Événements et Calendrier Partagé
**Priorité : HAUTE**

- [ ] **Calendrier partagé de la colocation**
  - Vue mensuelle/hebdomadaire/journalière
  - Créer des événements
  - Types : Soirée, Réunion coloc, Invités, Maintenance
  - Inviter les colocataires
  - Synchronisation avec calendrier natif iOS (optionnel)

- [ ] **Gestion des invités**
  - Déclarer des invités qui dorment
  - Durée du séjour
  - Approbation des autres colocataires si > 3 jours
  - Notifications aux colocataires

- [ ] **Événements récurrents**
  - Soirée hebdomadaire
  - Réunion mensuelle
  - Jour des poubelles
  - Ménage collectif

**Fichiers à créer** :
- `Features/Resident/CalendarView.swift`
- `Features/Resident/CreateEventView.swift`
- `Features/Resident/EventDetailView.swift`
- `Models/Event.swift`

**API à implémenter** :
```swift
case getEvents(householdId: UUID, from: Date, to: Date)
case createEvent(EventData)
case updateEvent(id: UUID, EventData)
case deleteEvent(id: UUID)
case inviteToEvent(eventId: UUID, userIds: [UUID])
case rsvp(eventId: UUID, response: RSVPResponse)
```

#### 2.5 Messages et Communication Interne
**Priorité : HAUTE**

- [ ] **Chat de groupe de la colocation**
  - Messages temps réel
  - Partage de photos/documents
  - Épingler messages importants
  - Mentions (@nom)

- [ ] **Messagerie avec le propriétaire**
  - Canal dédié
  - Signaler un problème
  - Demande de réparation
  - Questions administratives

- [ ] **Annonces et notifications**
  - Annonces importantes visibles par tous
  - Sondages rapides
  - Notifications push configurables

**Fichiers concernés** :
- `Features/Messages/MessagesListView.swift` ✅ (existe)
- Créer : `Features/Messages/GroupChatView.swift`
- Créer : `Features/Messages/AnnouncementsView.swift`

### Phase 1B : Fonctionnalités Moyennes

#### 2.6 Règles et Documents de la Colocation
**Priorité : MOYENNE**

- [ ] **Règles de vie commune**
  - Liste des règles définies ensemble
  - Modifier/Ajouter des règles (vote requis)
  - Voir l'historique des règles

- [ ] **Documents partagés**
  - Bail de location
  - Contrats d'électricité/internet
  - Inventaire d'entrée
  - Assurance habitation
  - Stockage cloud sécurisé

**Fichiers à créer** :
- `Features/Resident/RulesView.swift`
- `Features/Resident/DocumentsView.swift`

#### 2.7 Profil et Paramètres Resident
**Priorité : MOYENNE**

- [ ] **Gestion du profil résident**
  - Informations personnelles
  - Date de début/fin de bail
  - Préférences de notification
  - Changer de rôle (Resident → Searcher si déménage)

- [ ] **Quitter la colocation**
  - Initier processus de départ
  - Régler les dépenses en cours
  - Transférer responsabilités
  - Rechercher un remplaçant (optionnel)

**Fichiers concernés** :
- `Features/Profile/ProfileView.swift` ✅ (existe)
- `Features/Profile/SettingsView.swift` ✅ (existe)

### Phase 1C : Fonctionnalités Simples

#### 2.8 Informations sur les Colocataires
**Priorité : BASSE**

- [ ] **Liste des colocataires**
  - Voir profils des colocataires
  - Coordonnées
  - Date d'arrivée
  - Chambres attribuées

**Fichiers à créer** :
- `Features/Resident/RoommatesView.swift`

---

## 🏢 WORKSTREAM 3 : OWNER (Propriétaire)

### Contexte
- **Couleur principale** : Purple (#6E56CF)
- **Persona** : Propriétaire qui loue des logements en colocation
- **Pages principales** : Propriétés, Candidatures, Messages, Tâches, Statistiques, Profil

### Phase 1A : Fonctionnalités Complexes

#### 3.1 Gestion des Propriétés
**Priorité : CRITIQUE**

- [ ] **Tableau de bord des propriétés**
  - Liste de toutes les propriétés
  - Statuts : Publiée, Brouillon, Archivée, Louée
  - Statistiques par propriété : Vues, Favoris, Candidatures
  - Filtres et tri

- [ ] **Création/Modification de propriété - Multi-étapes**
  - **Étape 1** : Informations de base
    - Titre, description détaillée
    - Type de logement
    - Adresse complète avec autocomplete
    - Surface, nombre de chambres/salles de bain

  - **Étape 2** : Informations financières
    - Loyer mensuel
    - Charges incluses/non incluses
    - Dépôt de garantie
    - Frais d'agence (si applicable)

  - **Étape 3** : Équipements et commodités
    - Multi-sélection des équipements
    - Description de chaque pièce
    - Règlement intérieur

  - **Étape 4** : Photos et médias
    - Upload multiple d'images
    - Réorganiser l'ordre
    - Photo de couverture
    - Visite virtuelle (optionnel)

  - **Étape 5** : Disponibilité et préférences
    - Date de disponibilité
    - Durée min/max du bail
    - Préférences de locataires (âge, genre, fumeur, animaux)

- [ ] **Gestion avancée**
  - Dupliquer une annonce
  - Archiver/Désarchiver
  - Marquer comme louée
  - Statistiques détaillées par propriété
  - Modifier rapidement le prix
  - Mettre en avant (boost)

**Fichiers concernés** :
- `Features/Owner/OwnerPropertiesView.swift` ✅ (existe)
- Créer : `Features/Owner/CreatePropertyView.swift`
- Créer : `Features/Owner/PropertyFormStep1View.swift` ... Step5
- Créer : `Features/Owner/PropertyStatsView.swift`

**API à implémenter** :
```swift
case getOwnerProperties
case createProperty(PropertyData)
case updateProperty(id: UUID, PropertyData)
case deleteProperty(id: UUID)
case archiveProperty(id: UUID)
case publishProperty(id: UUID)
case getPropertyStats(id: UUID)
case uploadPropertyImages([Data])
```

#### 3.2 Gestion des Candidatures
**Priorité : CRITIQUE**

- [ ] **Vue d'ensemble des candidatures**
  - Nombre de candidatures par propriété
  - Statuts : Nouvelle, En examen, Acceptée, Refusée
  - Filtrer par propriété, statut, date
  - Badge de nouvelles candidatures

- [ ] **Examen détaillé d'une candidature**
  - Informations du candidat
  - Profil complet (si groupe : tous les profils)
  - Documents fournis (téléchargeables)
  - Justificatifs de revenus
  - Score de solvabilité (si disponible)
  - Historique de location (si disponible)

- [ ] **Actions sur candidatures**
  - Accepter / Refuser
  - Demander informations complémentaires
  - Marquer comme favori
  - Proposer visite
  - Prendre des notes privées

- [ ] **Gestion des visites**
  - Planifier une visite
  - Confirmer/Annuler rendez-vous
  - Rappel avant visite
  - Notes après visite

- [ ] **Processus de validation**
  - Checklist de vérification
  - Signature électronique du bail (optionnel)
  - Paiement du dépôt de garantie
  - Génération de documents

**Fichiers concernés** :
- `Features/Owner/ApplicationsView.swift` ✅ (existe)
- Créer : `Features/Owner/ApplicationDetailView.swift`
- Créer : `Features/Owner/VisitScheduleView.swift`
- Créer : `Features/Owner/ApplicationActionsView.swift`

**API à implémenter** :
```swift
case getApplications(propertyId: UUID?, status: ApplicationStatus?)
case getApplicationDetail(id: UUID)
case updateApplicationStatus(id: UUID, status: ApplicationStatus)
case requestMoreInfo(applicationId: UUID, message: String)
case scheduleVisit(applicationId: UUID, date: Date)
case addNote(applicationId: UUID, note: String)
case downloadDocument(documentId: UUID)
```

#### 3.3 Messagerie Propriétaire
**Priorité : HAUTE**

- [ ] **Conversations avec candidats**
  - Liste des conversations
  - Contexte : candidature liée
  - Quick replies (templates de réponses)
  - Marquer comme important

- [ ] **Conversations avec locataires actuels**
  - Canal séparé pour chaque colocation
  - Signalements de problèmes
  - Demandes de réparation
  - Questions administratives

- [ ] **Templates de messages**
  - Réponses pré-écrites personnalisables
  - Demande de visite
  - Refus poli
  - Demande documents
  - Rappel de loyer

**Fichiers concernés** :
- `Features/Messages/MessagesListView.swift` ✅ (existe)
- Créer : `Features/Messages/OwnerChatView.swift`
- Créer : `Features/Messages/MessageTemplatesView.swift`

#### 3.4 Gestion des Tâches de Maintenance
**Priorité : HAUTE**

- [ ] **Suivi des tâches de maintenance**
  - Liste des tâches par propriété
  - Statuts : À faire, En cours, Terminée
  - Priorité : Urgente, Haute, Normale, Basse
  - Assigner à : Moi-même, Prestataire, Locataire

- [ ] **Créer des tâches**
  - Description du problème
  - Photos
  - Catégorie : Plomberie, Électricité, etc.
  - Date d'échéance
  - Budget estimé

- [ ] **Suivi des prestataires**
  - Carnet d'adresses de prestataires
  - Historique des interventions
  - Notes et évaluations
  - Coordonnées

- [ ] **Rappels et notifications**
  - Rappels pour tâches urgentes
  - Notification quand locataire signale problème
  - Suivi des coûts de maintenance

**Fichiers concernés** :
- Créer : `Features/Owner/MaintenanceView.swift`
- Créer : `Features/Owner/CreateMaintenanceTaskView.swift`
- Créer : `Features/Owner/ContractorsView.swift`

**API à implémenter** :
```swift
case getMaintenanceTasks(propertyId: UUID?)
case createTask(MaintenanceTaskData)
case updateTask(id: UUID, MaintenanceTaskData)
case assignTask(id: UUID, contractorId: UUID)
case completeTask(id: UUID)
case getContractors
```

#### 3.5 Statistiques et Revenus
**Priorité : HAUTE**

- [ ] **Dashboard financier**
  - Revenus mensuels totaux
  - Taux d'occupation
  - Revenus par propriété
  - Graphiques d'évolution

- [ ] **Suivi des loyers**
  - Loyers payés/en attente
  - Historique des paiements
  - Rappels de loyer
  - Gestion des retards

- [ ] **Dépenses et rentabilité**
  - Charges par propriété
  - Coûts de maintenance
  - Taxes et impôts
  - Calcul de rentabilité nette

- [ ] **Rapports**
  - Export mensuel/annuel
  - Déclaration fiscale
  - Rapport par propriété
  - Export PDF/Excel

**Fichiers à créer** :
- `Features/Owner/StatsView.swift`
- `Features/Owner/RevenueView.swift`
- `Features/Owner/ExpensesView.swift`
- `Features/Owner/ReportsView.swift`

**API à implémenter** :
```swift
case getDashboardStats
case getRevenue(period: Period)
case getExpenses(period: Period)
case getRentPayments(propertyId: UUID?)
case generateReport(type: ReportType, period: Period)
```

### Phase 1B : Fonctionnalités Moyennes

#### 3.6 Gestion des Locataires
**Priorité : MOYENNE**

- [ ] **Liste des locataires**
  - Vue d'ensemble de tous les locataires
  - Par propriété
  - Informations de contact
  - Dates de début/fin de bail

- [ ] **Profils locataires**
  - Historique de paiements
  - Signalements/Incidents
  - Notes privées
  - Documents (bail, assurance, etc.)

- [ ] **Renouvellement de bail**
  - Alertes avant fin de bail
  - Proposer renouvellement
  - Ajuster le loyer
  - Signature électronique

**Fichiers à créer** :
- `Features/Owner/TenantsView.swift`
- `Features/Owner/TenantDetailView.swift`
- `Features/Owner/LeaseRenewalView.swift`

#### 3.7 Documents et Contrats
**Priorité : MOYENNE**

- [ ] **Gestion documentaire**
  - Baux de location
  - États des lieux (entrée/sortie)
  - Assurances
  - Diagnostics obligatoires (DPE, etc.)
  - Règlements de copropriété

- [ ] **Génération de documents**
  - Templates de bail
  - Quittances de loyer
  - Attestations
  - Courriers types

**Fichiers à créer** :
- `Features/Owner/DocumentsView.swift`
- `Features/Owner/GenerateDocumentView.swift`

### Phase 1C : Fonctionnalités Simples

#### 3.8 Profil et Paramètres Owner
**Priorité : BASSE**

- [ ] **Profil propriétaire**
  - Informations personnelles/entreprise
  - Photo de profil
  - Description
  - Coordonnées

- [ ] **Paramètres**
  - Notifications
  - Préférences de communication
  - Gestion d'équipe (si plusieurs gestionnaires)

**Fichiers concernés** :
- `Features/Profile/ProfileView.swift` ✅ (existe)
- `Features/Profile/SettingsView.swift` ✅ (existe)

---

## 🔧 COMPOSANTS PARTAGÉS (Tous les Workstreams)

### Authentification et Onboarding
**Priorité : CRITIQUE - À faire en PREMIER**

- [ ] **Système d'authentification**
  - Login avec email/password
  - Connexion avec Apple (Sign in with Apple)
  - Connexion Google (optionnel)
  - Mot de passe oublié
  - Validation email

- [ ] **Onboarding**
  - 3-4 écrans d'introduction
  - Choix du rôle : Searcher, Resident, Owner
  - Explication des fonctionnalités

- [ ] **Création de compte**
  - Formulaire multi-étapes
  - Validation des champs
  - Conditions d'utilisation
  - Politique de confidentialité

**Fichiers concernés** :
- `Features/Auth/LoginView.swift` ✅ (existe)
- `Features/Auth/SignupView.swift` ✅ (existe)
- `Features/Auth/ForgotPasswordView.swift` ✅ (existe)
- `Features/Auth/AuthViewModel.swift` ✅ (existe)
- `Features/Onboarding/OnboardingView.swift` ✅ (existe)
- `Core/Auth/AuthManager.swift` ✅ (existe)

### Navigation et Layout

- [ ] **Navigation principale**
  - TabView avec icônes personnalisées
  - Badge de notifications
  - Couleurs selon le rôle
  - Navigation cohérente

- [ ] **Composants UI réutilisables**
  - Boutons (primary, secondary, destructive)
  - Champs de texte
  - Cards
  - Empty states
  - Loading states
  - Error states

**Fichiers concernés** :
- `Components/Common/CustomButton.swift` ✅ (existe)
- `Components/Common/EmptyStateView.swift` ✅ (existe)
- `Components/Common/ErrorView.swift` ✅ (existe)
- `Components/Common/LoadingView.swift` ✅ (existe)

### Configuration et Thème

- [ ] **Système de thème**
  - Couleurs par rôle
  - Typographie
  - Espacements
  - Coins arrondis

**Fichiers concernés** :
- `Config/Theme.swift` ✅ (existe)
- `Config/AppConfig.swift` ✅ (existe)

---

## 🎨 Phase 2 : Design et Adaptation iOS

### Principes de Design

1. **Respect des conventions iOS**
   - Navigation native (NavigationStack)
   - Gestures iOS (swipe to delete, pull to refresh)
   - Haptic feedback
   - Safe areas
   - Dark mode support

2. **Adaptation de la web app**
   - Couleurs identiques (Orange, Purple, Coral)
   - Typographie similaire
   - Espacements cohérents
   - Même hiérarchie visuelle

3. **Optimisation mobile**
   - Interface touch-friendly
   - Boutons suffisamment grands
   - Textes lisibles
   - Images optimisées

### Phase 2A : Design des Composants (Tous les rôles)

#### Composants de Base
**Priorité : CRITIQUE**

- [ ] **Boutons**
  - Primary (gradient selon rôle)
  - Secondary (outline)
  - Destructive (rouge)
  - Icon buttons
  - États : normal, pressed, disabled, loading

- [ ] **Champs de formulaire**
  - Text fields
  - Text areas
  - Selects/Pickers
  - Date pickers
  - Checkboxes
  - Radio buttons
  - Sliders
  - États : focus, error, disabled

- [ ] **Cards**
  - Property card
  - User card
  - Conversation card
  - Task card
  - Expense card
  - Ombres subtiles
  - Coins arrondis 16px

- [ ] **Navigation**
  - Tab bar personnalisée
  - Navigation bar
  - Back button
  - Search bar
  - Filter button

**Fichiers à créer/modifier** :
- `Components/Custom/` (tous les composants)
- Référence web app pour les styles exacts

### Phase 2B : Design par Rôle

#### Searcher - Design Orange (#FFA040)

- [ ] **Écran de recherche**
  - Barre de recherche proéminente
  - Filtres accessibles
  - Grid de propriétés (2 colonnes)
  - Floating action button "Filtres"

- [ ] **Card de propriété**
  - Image grande
  - Badge de prix en haut
  - Badge de score de match (si > 80%)
  - Cœur pour favoris
  - Informations essentielles visibles

- [ ] **Écran de détail**
  - Hero image avec galerie
  - Sticky header avec prix
  - Tabs pour différentes sections
  - CTA "Candidater" toujours visible

- [ ] **Filtres**
  - Sheet modal
  - Sections pliables
  - Sliders pour prix/surface
  - Chips pour sélections multiples
  - Badge de nombre de filtres actifs

#### Resident - Design Coral (#E8865D)

- [ ] **Hub**
  - Cards pour chaque section
  - Quick actions en haut
  - Liste de tâches du jour
  - Prochains événements
  - Balance des dépenses

- [ ] **Tâches**
  - Liste avec statuts visuels
  - Checkbox pour compléter
  - Swipe actions (modifier, supprimer)
  - Filtres par statut

- [ ] **Dépenses**
  - Liste chronologique
  - Badges de catégorie
  - Montants en gros
  - Graphique en haut (camembert)
  - Balance "Qui doit quoi"

- [ ] **Calendrier**
  - Vue mensuelle
  - Dots pour jours avec événements
  - Liste d'événements sous le calendrier
  - Quick add button

#### Owner - Design Purple (#6E56CF)

- [ ] **Dashboard propriétés**
  - Cards par propriété
  - Stats en preview (vues, favoris, candidatures)
  - Badge de statut
  - Quick actions (modifier, stats)

- [ ] **Candidatures**
  - Liste avec photos de profil
  - Badge "Nouveau"
  - Swipe actions (accepter, refuser)
  - Score de solvabilité visible

- [ ] **Stats**
  - Graphiques de revenus
  - Taux d'occupation
  - Comparaison mensuelle
  - Export en haut

- [ ] **Création d'annonce**
  - Progress bar des étapes
  - Formulaire clair
  - Upload d'images avec preview
  - Bouton "Enregistrer brouillon"

### Phase 2C : Animations et Transitions

- [ ] **Transitions**
  - Navigation fluide
  - Modal sheets
  - Push animations
  - Shared element transitions (hero)

- [ ] **Micro-interactions**
  - Haptic feedback au touch
  - Loading skeletons
  - Pull to refresh
  - Success animations
  - Error shake

- [ ] **États**
  - Loading states cohérents
  - Empty states avec illustrations
  - Error states avec retry
  - Success states avec confirmation

---

## 📱 Spécificités iOS à Implémenter

### Fonctionnalités Natives

- [ ] **Notifications Push**
  - Configuration APNs
  - Permissions
  - Deep linking depuis notifications
  - Badge counts
  - Notification actions (répondre, voir)

- [ ] **Localisation**
  - Demande de permission
  - Recherche par proximité
  - Carte interactive
  - Directions vers propriété

- [ ] **Partage**
  - Share sheet native
  - Partager propriété
  - Partager profil
  - Inviter à l'app

- [ ] **Photos**
  - Accès à la galerie
  - Prendre une photo
  - Édition basique
  - Compression

- [ ] **Contacts**
  - Importer contacts pour invitations
  - Autocomplétion email

- [ ] **Biométrie**
  - Face ID / Touch ID pour login
  - Sécurité des données sensibles

### Performance

- [ ] **Optimisations**
  - Lazy loading des images
  - Pagination des listes
  - Cache des données
  - Mode offline basique
  - Compression des uploads

- [ ] **Gestion mémoire**
  - Libération des ressources
  - Gestion du cache
  - Background tasks

---

## 🔄 Dépendances entre Workstreams

### Composants Partagés à Créer AVANT

1. **Modèles de données** (Models/)
   - User.swift ✅
   - Property.swift ✅
   - Conversation.swift
   - Message.swift
   - Task.swift (renommer ResidentTask pour éviter conflit)
   - Expense.swift
   - Event.swift
   - Application.swift
   - Group.swift ✅

2. **Services**
   - APIClient ✅
   - AuthManager ✅
   - WebSocketManager (pour messages temps réel)
   - NotificationManager
   - ImageUploadService
   - CacheManager

3. **Extensions et Helpers**
   - Date+Extensions ✅
   - String+Extensions ✅
   - View+Extensions ✅
   - Color+Extensions (pour hex)

### Ordre de Développement Recommandé

**Sprint 0 : Fondations (Commun à tous)**
- Authentification complète
- Navigation de base
- Modèles de données
- Services API
- Composants UI de base

**Sprint 1-3 : Fonctionnalités Complexes par Rôle** (Parallèle)
- Chaque équipe travaille sur sa Phase 1A
- Synchronisation hebdomadaire

**Sprint 4-5 : Fonctionnalités Moyennes par Rôle** (Parallèle)
- Chaque équipe travaille sur sa Phase 1B
- Partage des composants créés

**Sprint 6 : Fonctionnalités Simples et Polish**
- Phase 1C pour tous
- Corrections de bugs
- Tests d'intégration

**Sprint 7-9 : Design et Adaptation iOS**
- Phase 2 pour tous
- Refonte visuelle
- Animations
- Tests utilisateurs

---

## 📊 Suivi de Progression

### Métriques par Rôle

Pour chaque rôle, tracker :
- [ ] Nombre de fonctionnalités complétées / total
- [ ] Nombre d'écrans complétés / total
- [ ] Couverture de tests
- [ ] Performance (temps de chargement)
- [ ] Bugs ouverts

### Checklist de Complétion d'une Fonctionnalité

Une fonctionnalité est considérée **COMPLÈTE** quand :
- [ ] Code implémenté
- [ ] API connectée (ou mock en démo mode)
- [ ] UI fonctionnelle
- [ ] Gestion des erreurs
- [ ] Loading states
- [ ] Empty states
- [ ] Tests manuels effectués
- [ ] Pas de crashes
- [ ] Performance acceptable

---

## 🚀 Démarrage Rapide pour Chaque Workstream

### Pour SEARCHER
1. Lire cette section : "WORKSTREAM 1 : SEARCHER"
2. Commencer par Phase 1A → 1.1 (Filtres de recherche)
3. Ensuite 1.2 (Matches), 1.3 (Groupes), etc.
4. Référence web app : https://easyco-onboarding.vercel.app/ (mode Searcher)

### Pour RESIDENT
1. Lire cette section : "WORKSTREAM 2 : RESIDENT"
2. Commencer par Phase 1A → 2.1 (Hub)
3. Ensuite 2.2 (Tâches), 2.3 (Dépenses), etc.
4. Référence web app : https://easyco-onboarding.vercel.app/ (mode Resident)

### Pour OWNER
1. Lire cette section : "WORKSTREAM 3 : OWNER"
2. Commencer par Phase 1A → 3.1 (Gestion propriétés)
3. Ensuite 3.2 (Candidatures), 3.3 (Messages), etc.
4. Référence web app : https://easyco-onboarding.vercel.app/ (mode Owner)

---

## 📝 Notes Importantes

### Mode Démo
- Toutes les fonctionnalités doivent fonctionner en mode démo (`AppConfig.FeatureFlags.demoMode = true`)
- Utiliser des données mockées réalistes
- Simuler délais d'API avec `_Concurrency.Task.sleep`

### Architecture
- **MVVM** : View → ViewModel → Model
- **Combine** pour la réactivité
- **async/await** pour l'asynchrone
- **Supabase** pour le backend

### Conventions de Code
- SwiftUI natif (pas de UIKit sauf nécessaire)
- Nommage en français pour l'UI, anglais pour le code
- Comments en français
- Git : branches par feature, PRs pour review

### Communication entre Équipes
- Slack/Discord pour questions
- Partage de composants communs sur repo partagé
- Code review croisée recommandée
- Sync meeting hebdomadaire

---

## ✅ Checklist de Démarrage

Avant de commencer votre workstream :

- [ ] J'ai lu ce document en entier
- [ ] J'ai compris mon rôle (Searcher/Resident/Owner)
- [ ] J'ai accès à la web app de référence
- [ ] J'ai la structure du projet iOS
- [ ] J'ai vérifié que les composants partagés existent
- [ ] Je sais par quelle fonctionnalité commencer (Phase 1A)
- [ ] J'ai mon environnement de dev configuré
- [ ] Je peux build et run l'app sur simulateur

---

**Bonne chance ! 🚀**

Pour toute question, se référer à ce document ou contacter l'équipe.
