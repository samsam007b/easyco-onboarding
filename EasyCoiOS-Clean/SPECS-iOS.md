# EasyCo iOS - Spécifications Complètes

> Document de référence pour le développement de l'app iOS native
> Basé sur la web app EasyCo - Dernière mise à jour: 30 novembre 2025

---

## 1. ARCHITECTURE GÉNÉRALE

### 1.1 Stack Technique
- **Framework**: SwiftUI (iOS 16+)
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **State Management**: @StateObject, @EnvironmentObject, ObservableObject
- **Navigation**: NavigationStack (iOS 16+)
- **Networking**: URLSession + Async/Await
- **Storage**: Keychain (tokens) + UserDefaults (préférences)

### 1.2 Structure des Dossiers
```
EasyCo/
├── EasyCoApp.swift              # Point d'entrée
├── ContentView.swift            # Router principal (Auth/Onboarding/Main)
├── Config/
│   ├── Theme.swift              # Design System complet
│   ├── Theme+DarkMode.swift     # Support Dark Mode
│   └── AppConfig.swift          # Configuration (URLs, clés)
├── Core/
│   ├── Auth/                    # Authentification
│   ├── Network/                 # API Client
│   ├── Storage/                 # Keychain, UserDefaults
│   ├── Services/                # Services métier
│   └── i18n/                    # Internationalisation
├── Models/                      # Modèles de données
├── Components/
│   ├── Common/                  # Composants génériques
│   ├── Design/                  # Composants UI stylisés
│   ├── Dashboard/               # Composants dashboard
│   └── Map/                     # Composants carte
├── Features/
│   ├── Auth/                    # Login, Signup, ForgotPassword
│   ├── Onboarding/              # Flows d'onboarding par rôle
│   ├── Properties/              # Liste, Détail, Recherche
│   ├── Matches/                 # Swipe, Matchs
│   ├── Messages/                # Chat, Conversations
│   ├── Favorites/               # Favoris, Comparaisons
│   ├── Groups/                  # Groupes de coliving
│   ├── Applications/            # Candidatures
│   ├── Owner/                   # Features propriétaire
│   ├── Resident/                # Features résident (Hub)
│   ├── Profile/                 # Profil, Settings
│   └── Notifications/           # Centre de notifications
└── Extensions/                  # Extensions Swift
```

---

## 2. DESIGN SYSTEM

### 2.1 Palette de Couleurs

#### Couleurs par Rôle (IDENTIQUES à la web app)

**SEARCHER (Jaune/Or)**
| Token | Hex | Usage |
|-------|-----|-------|
| _50 | #FFFEF0 | Backgrounds très subtils |
| _100 | #FFF9E6 | Backgrounds légers |
| _200 | #FFF59D | Backgrounds hover |
| _300 | #FFEB3B | Bordures, dividers |
| _400 | #FFD249 | Icônes secondaires |
| _500 | #FFC107 | **Primary** - Boutons, highlights |
| _600 | #F9A825 | Hover states |
| _700 | #F57F17 | Texte important |
| _800 | #E65100 | Headers, emphasis |
| _900 | #BF360C | Ultra-important |

**OWNER (Mauve/Violet)**
| Token | Hex | Usage |
|-------|-----|-------|
| _50 | #F9F8FF | Backgrounds très subtils |
| _100 | #F3F1FF | Backgrounds légers |
| _200 | #E0D9FF | Backgrounds hover |
| _300 | #BAB2E3 | Bordures |
| _400 | #8E7AD6 | Icônes secondaires |
| _500 | #6E56CF | **Primary** - Boutons, highlights |
| _600 | #5B45B8 | Hover states |
| _700 | #4A148C | Texte important |
| _800 | #38006B | Headers |
| _900 | #1A0033 | Ultra-important |

**RESIDENT (Orange/Corail)**
| Token | Hex | Usage |
|-------|-----|-------|
| _50 | #FFFAF8 | Backgrounds très subtils |
| _100 | #FFF3EF | Backgrounds légers |
| _200 | #FFB88C | Backgrounds hover |
| _300 | #FF8C5C | Bordures |
| _400 | #FF6F3C | Icônes secondaires |
| _500 | #FF5722 | **Primary** - Boutons, highlights |
| _600 | #E64A19 | Hover states |
| _700 | #D84315 | Texte important |
| _800 | #BF360C | Headers |
| _900 | #8D2A0E | Ultra-important |

#### Couleurs Neutres
| Token | Hex | Usage |
|-------|-----|-------|
| gray_50 | #F9F9F9 | Page backgrounds |
| gray_100 | #F2F2F2 | Subtle backgrounds |
| gray_200 | #E5E5E5 | Dividers |
| gray_300 | #D9D9D9 | Borders |
| gray_400 | #BFBFBF | Disabled |
| gray_500 | #8C8C8C | Placeholder |
| gray_600 | #666666 | Muted text |
| gray_700 | #404040 | Tertiary text |
| gray_800 | #2D2D2D | Secondary text |
| gray_900 | #1A1A1A | Primary text |

#### Couleurs Sémantiques
| Type | Couleur | Light |
|------|---------|-------|
| Success | #10B981 | #D1FAE5 |
| Error | #EF4444 | #FEE2E2 |
| Warning | #F59E0B | #FEF3C7 |
| Info | #3B82F6 | #DBEAFE |

### 2.2 Gradients

**Gradient Tricolore (Signature de marque)**
```swift
LinearGradient(
    colors: [
        Color(hex: "6E56CF"),  // Owner - Mauve
        Color(hex: "FF6F3C"),  // Resident - Orange
        Color(hex: "FFD249")   // Searcher - Yellow
    ],
    startPoint: .topLeading,
    endPoint: .bottomTrailing
)
```

**Gradients par Rôle (pour boutons CTA)**
```swift
// Searcher
LinearGradient(colors: [Color(hex: "FFA040"), Color(hex: "FFB85C"), Color(hex: "FFD080")])

// Owner
LinearGradient(colors: [Color(hex: "7B5FB8"), Color(hex: "A67BB8"), Color(hex: "C98B9E")])

// Resident
LinearGradient(colors: [Color(hex: "D97B6F"), Color(hex: "E8865D"), Color(hex: "FF8C4B")])
```

### 2.3 Typographie

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| largeTitle | 34pt | Bold | Titres de page |
| title1 | 28pt | Bold | Sections majeures |
| title2 | 22pt | Semibold | Sous-sections |
| title3 | 20pt | Semibold | Cards headers |
| body | 17pt | Regular | Texte principal |
| bodySmall | 15pt | Regular | Texte secondaire |
| caption | 13pt | Regular | Labels, métadonnées |
| captionSmall | 11pt | Regular | Badges, tags |

### 2.4 Spacing (Base 8px)

| Token | Value | Usage |
|-------|-------|-------|
| _1 | 4pt | Micro spacing |
| _2 | 8pt | Compact spacing |
| _3 | 12pt | Small spacing |
| _4 | 16pt | Standard spacing |
| _5 | 20pt | Medium spacing |
| _6 | 24pt | Large spacing |
| _8 | 32pt | Section spacing |
| _10 | 40pt | Major spacing |
| _12 | 48pt | Page margins |

### 2.5 Corner Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 6pt | Petits éléments |
| md | 8pt | Inputs, badges |
| lg | 12pt | Cards compactes |
| xl | 16pt | Cards standard |
| _2xl | 20pt | Cards larges |
| _3xl | 24pt | Cards principales (web style) |
| full | 9999pt | Pills, avatars |

### 2.6 Shadows

```swift
// Small
shadow(color: .black.opacity(0.05), radius: 4, x: 0, y: 2)

// Medium
shadow(color: .black.opacity(0.1), radius: 8, x: 0, y: 4)

// Large
shadow(color: .black.opacity(0.15), radius: 16, x: 0, y: 8)

// Glow (par rôle)
shadow(color: roleColor.opacity(0.3), radius: 12, x: 0, y: 4)
```

### 2.7 Animations

| Type | Duration | Curve |
|------|----------|-------|
| Fast | 0.15s | easeInOut |
| Standard | 0.2s | easeInOut |
| Slow | 0.3s | easeInOut |
| Spring | response: 0.3, damping: 0.7 | spring |

---

## 3. COMPOSANTS UI

### 3.1 Boutons

#### GradientButton (Primary)
- Hauteur: 52pt minimum
- Padding horizontal: 32pt
- Forme: Capsule (pill)
- Fond: Gradient selon rôle
- Texte: Blanc, 16pt, Semibold
- Shadow: Glow coloré
- États: Normal, Loading, Disabled

#### SecondaryButton (Outline)
- Bordure: 2pt solid (couleur du rôle)
- Fond: Blanc
- Texte: Couleur du rôle

#### GhostButton (Text)
- Fond: Transparent
- Texte: Gray-700

#### IconButton
- Taille: 44pt x 44pt (touch target WCAG)
- Forme: Cercle
- Fond: Gradient ou Gray-100

### 3.2 Cards

#### ModernCard
- Padding: 24pt
- Corner radius: 24pt
- Bordure: 1pt Gray-100
- Shadow: Small
- Fond: Blanc

#### InteractiveCard
- Même que ModernCard
- Scale: 0.98 on press
- Animation: 0.2s

#### GlassCard
- Fond: .ultraThinMaterial
- Bordure: 1pt white/20%
- Corner radius: 24pt

### 3.3 Inputs

#### ModernTextField
- Hauteur: 52pt
- Padding: 16pt horizontal, 12pt vertical
- Corner radius: 16pt
- Bordure: 1pt Gray-300
- Focus: Bordure couleur rôle + ring

### 3.4 Badges

- Padding: 8pt horizontal, 4pt vertical
- Corner radius: Full (pill)
- Font: 12pt Medium
- Variantes: Default, Primary, Success, Warning, Error, Gradient

---

## 4. NAVIGATION & ÉCRANS

### 4.1 Flow d'Authentification

```
┌─────────────────────────────────────────────────────────────┐
│                        RootView                              │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  Loading    │  │   LoginView  │  │  MainTabView       │  │
│  │  (splash)   │  │  SignupView  │  │  (après onboarding)│  │
│  └─────────────┘  └──────────────┘  └────────────────────┘  │
│         │                │                    │              │
│         ▼                ▼                    ▼              │
│  isLoading=true    !isAuthenticated    isAuthenticated &&   │
│                                        onboardingCompleted   │
└─────────────────────────────────────────────────────────────┘
```

**Écrans Auth:**
- [x] LoginView - Connexion email/password + OAuth
- [x] SignupView - Inscription
- [x] ForgotPasswordView - Mot de passe oublié
- [ ] ResetPasswordView - Réinitialisation
- [ ] VerifyEmailView - Vérification email

### 4.2 Flow d'Onboarding

**Sélection du rôle (après signup):**
```
WelcomeView → Choix: Searcher | Owner | Resident
```

**SEARCHER Onboarding (11 étapes):**
| # | Écran | Contenu | Status |
|---|-------|---------|--------|
| 1 | ModeSelection | Individuel ou Groupe | 🔲 |
| 2 | GroupSelection | Rejoindre/Créer groupe (si groupe) | 🔲 |
| 3 | BasicInfo | Nom, âge, nationalité, langues | ✅ |
| 4 | Lifestyle | Horaires sommeil, régime, habitudes | ✅ |
| 5 | DailyHabits | Travail, sport, tabac, alcool | ✅ |
| 6 | HomeLifestyle | Propreté, invités, musique, animaux | ✅ |
| 7 | Personality | Introversion, valeurs, conflits | ✅ |
| 8 | SocialVibe | Préférences communauté | ✅ |
| 9 | IdealColiving | Taille groupe, mixité genre | ✅ |
| 10 | Preferences | Budget, localisation, date emménagement | ✅ |
| 11 | Review | Résumé avant validation | ✅ |

**OWNER Onboarding (7 étapes):**
| # | Écran | Contenu | Status |
|---|-------|---------|--------|
| 1 | BasicInfo | Type bailleur, nom, contact | ✅ |
| 2 | PropertyBasics | Infos basiques propriété | ✅ |
| 3 | About | Bio, expérience, motivation | ✅ |
| 4 | PaymentInfo | Infos bancaires | ✅ |
| 5 | Verification | Vérification identité | ✅ |
| 6 | Review | Résumé | ✅ |

**RESIDENT Onboarding (6 étapes):**
| # | Écran | Contenu | Status |
|---|-------|---------|--------|
| 1 | BasicInfo | Infos personnelles | 🔲 |
| 2 | LivingSituation | Situation actuelle | ✅ |
| 3 | Lifestyle | Habitudes quotidiennes | 🔲 |
| 4 | Personality | Traits de personnalité | 🔲 |
| 5 | PropertySetup | Préférences logement | 🔲 |
| 6 | Review | Résumé | 🔲 |

### 4.3 Navigation Principale (TabView)

**SEARCHER TabView:**
| Tab | Icône | Écran | Status |
|-----|-------|-------|--------|
| Explorer | magnifyingglass | PropertiesListView | ✅ Base |
| Favoris | heart.fill | FavoritesView | ✅ Base |
| Matchs | sparkles | SwipeMatchesView | 🔲 |
| Groupes | person.3.fill | GroupsListView | ✅ Base |
| Messages | message.fill | MessagesListView | ✅ Base |

**OWNER TabView:**
| Tab | Icône | Écran | Status |
|-----|-------|-------|--------|
| Dashboard | chart.bar.fill | OwnerDashboardView | 🔲 |
| Propriétés | building.2.fill | OwnerPropertiesView | 🔲 |
| Candidatures | doc.text.fill | ApplicationsView | 🔲 |
| Messages | message.fill | MessagesListView | ✅ |

**RESIDENT TabView:**
| Tab | Icône | Écran | Status |
|-----|-------|-------|--------|
| Hub | house.fill | ResidentHubView | 🔲 |
| Tâches | checklist | TasksView | 🔲 |
| Finances | creditcard.fill | ExpensesView | 🔲 |
| Calendrier | calendar | CalendarView | 🔲 |
| Messages | message.fill | MessagesListView | ✅ |

### 4.4 Écrans par Feature

#### Properties (Searcher)
| Écran | Description | Status |
|-------|-------------|--------|
| PropertiesListView | Liste avec filtres | ✅ Structure |
| PropertyDetailView | Détail complet | ✅ Structure |
| FiltersView | Filtres avancés | ✅ Base |
| PropertyMapView | Vue carte | 🔲 |
| SavedSearchesView | Recherches sauvées | 🔲 |

#### Matches (Searcher)
| Écran | Description | Status |
|-------|-------------|--------|
| SwipeMatchesView | Interface swipe Tinder-like | 🔲 |
| MatchesListView | Liste des matchs | 🔲 |
| CompatibilityDetailView | Détail compatibilité | 🔲 |

#### Favorites (Searcher)
| Écran | Description | Status |
|-------|-------------|--------|
| FavoritesView | Liste favoris | ✅ Base |
| ComparisonView | Comparaison côte à côte | 🔲 |

#### Messages (Tous)
| Écran | Description | Status |
|-------|-------------|--------|
| MessagesListView | Liste conversations | ✅ Structure |
| ChatView | Chat temps réel | ✅ Structure |
| MessageTemplatesView | Templates réponses | 🔲 |

#### Groups (Searcher)
| Écran | Description | Status |
|-------|-------------|--------|
| GroupsListView | Mes groupes | ✅ Base |
| CreateGroupView | Créer groupe | ✅ Base |
| GroupDetailView | Détail groupe | ✅ Base |
| JoinGroupView | Rejoindre groupe | 🔲 |

#### Applications (Searcher)
| Écran | Description | Status |
|-------|-------------|--------|
| MyApplicationsView | Mes candidatures | ✅ Structure |
| ApplyView | Formulaire candidature | ✅ Structure |
| ApplicationStatusView | Suivi candidature | 🔲 |

#### Owner Features
| Écran | Description | Status |
|-------|-------------|--------|
| OwnerDashboardView | KPIs, stats | 🔲 |
| OwnerPropertiesView | Liste propriétés | 🔲 |
| CreatePropertyView | Ajouter propriété (5 steps) | ✅ Structure |
| PropertyStatsView | Stats par propriété | 🔲 |
| ApplicationsView | Gérer candidatures | 🔲 |
| ApplicationDetailView | Détail candidature | ✅ Structure |
| VisitScheduleView | Planifier visites | 🔲 |
| MaintenanceView | Maintenance | 🔲 |

#### Resident Hub
| Écran | Description | Status |
|-------|-------------|--------|
| ResidentHubView | Vue d'ensemble | 🔲 |
| GroupChatView | Chat groupe | ✅ Structure |
| TasksView | Tâches ménagères | 🔲 |
| ExpensesView | Dépenses partagées | 🔲 |
| CalendarView | Calendrier partagé | 🔲 |
| AnnouncementsView | Annonces | 🔲 |

#### Profile & Settings
| Écran | Description | Status |
|-------|-------------|--------|
| ProfileView | Mon profil | ✅ Structure |
| SettingsView | Paramètres | ✅ Structure |
| EditProfileView | Modifier profil | 🔲 |
| SecuritySettingsView | Sécurité (2FA) | 🔲 |
| NotificationSettingsView | Préférences notifs | 🔲 |
| LanguageSettingsView | Langue | ✅ |

---

## 5. FONCTIONNALITÉS CLÉS

### 5.1 Swipe Matching (PRIORITÉ HAUTE)

**Comportement attendu:**
- Cards empilées (3 visibles max)
- Swipe droite = Like
- Swipe gauche = Pass
- Swipe haut = Super Like
- Rotation proportionnelle au déplacement (-25° à +25°)
- Indicateurs visuels (coeur vert, X rouge, étoile)
- Animation de sortie fluide
- Bouton Undo (dernière action)

**Données affichées sur card:**
- Image principale (plein écran)
- Titre propriété
- Localisation
- Prix/mois
- Score de compatibilité (badge gradient)
- Résidents actuels (avatars)
- Amenities principales (icônes)

### 5.2 Messaging Temps Réel

**Features:**
- Liste conversations avec preview
- Indicateur messages non lus
- Typing indicator
- Envoi images
- Templates de réponse
- Push notifications

**Intégration Supabase Realtime:**
```swift
// Subscription aux nouveaux messages
supabase.channel("messages")
    .on("INSERT", schema: "public", table: "messages")
    .subscribe()
```

### 5.3 Filtres Propriétés

**Filtres disponibles:**
- Budget (range slider)
- Localisation (ville, quartier)
- Type de bien
- Nombre de chambres
- Date de disponibilité
- Amenities (multi-select)
- Préférences (animaux, fumeurs, couples)

### 5.4 Favoris & Comparaisons

**Features:**
- Ajouter/retirer favoris (animation coeur)
- Créer groupes de comparaison
- Comparaison côte à côte (max 3)
- Sauvegarder recherches
- Alertes prix

### 5.5 Notifications Push

**Types:**
- Nouveau message
- Match mutuel
- Candidature acceptée/refusée
- Nouveau bien correspondant
- Rappels (visite, paiement)

---

## 6. INTÉGRATION SUPABASE

### 6.1 Tables Principales

```
users / user_profiles
properties / rooms / property_images
applications / scheduled_visits
conversations / messages
groups / group_members
user_swipes / user_matches
user_favorites / saved_searches
notifications
```

### 6.2 RPC Functions

```sql
-- Matching
get_compatible_properties(user_id, filters)
record_swipe(swiper_id, property_id, action)
get_mutual_matches(user_id)

-- Messaging
get_conversations(user_id)
send_message(conversation_id, content)
mark_as_read(conversation_id)

-- Favorites
toggle_favorite(user_id, property_id)
get_user_favorites(user_id)
```

### 6.3 Realtime Subscriptions

- `messages` - Nouveaux messages
- `notifications` - Nouvelles notifications
- `user_matches` - Nouveaux matchs

---

## 7. PRIORITÉS D'IMPLÉMENTATION

### Phase 1 - Core Experience (Searcher)
1. ✅ Authentification (Login/Signup)
2. ✅ Onboarding Searcher
3. 🔲 **SwipeMatchesView** - Interface swipe
4. 🔲 **PropertyDetailView** - Améliorer
5. 🔲 **Filtres avancés** - Fonctionnels
6. 🔲 **Favoris** - Avec animations

### Phase 2 - Communication
7. 🔲 **Chat temps réel** - Avec Supabase Realtime
8. 🔲 **Notifications push** - Configuration APNs
9. 🔲 **Typing indicators**

### Phase 3 - Owner Experience
10. 🔲 **Dashboard Owner** - KPIs, stats
11. 🔲 **Gestion propriétés** - CRUD complet
12. 🔲 **Gestion candidatures** - Workflow

### Phase 4 - Resident Hub
13. 🔲 **Hub Resident** - Vue d'ensemble
14. 🔲 **Tâches partagées** - CRUD + rotation
15. 🔲 **Dépenses** - Split, balance
16. 🔲 **Calendrier** - Events partagés

### Phase 5 - Polish
17. 🔲 **Dark Mode** - Support complet
18. 🔲 **Animations** - Micro-interactions
19. 🔲 **Offline Mode** - Cache local
20. 🔲 **Accessibility** - VoiceOver, Dynamic Type

---

## 8. ADAPTATIONS iOS SPÉCIFIQUES

### 8.1 Navigation
- **Web**: Sidebar + routing URL
- **iOS**: TabView + NavigationStack + sheets

### 8.2 Gestures
- Swipe back natif (NavigationStack)
- Pull to refresh
- Long press pour actions contextuelles
- Swipe actions sur listes

### 8.3 Haptics
- Selection feedback (tabs)
- Impact feedback (swipe, like)
- Notification feedback (erreur, succès)

### 8.4 Composants Natifs
- DatePicker natif (au lieu du custom web)
- Picker natif pour sélections
- ShareSheet natif
- PhotosPicker pour images

### 8.5 Safe Areas
- Respecter les safe areas (notch, home indicator)
- Keyboard avoidance automatique

---

## 9. CHECKLIST AVANT CHAQUE ÉCRAN

- [ ] Design conforme au Theme.swift
- [ ] Loading states avec skeleton/spinner
- [ ] Empty states avec illustration
- [ ] Error handling avec retry
- [ ] Pull to refresh si liste
- [ ] Animations de transition
- [ ] Support Dynamic Type
- [ ] Haptic feedback approprié
- [ ] Accessibilité (labels, hints)

---

## 10. RESSOURCES

### Fichiers Clés Existants
- `Config/Theme.swift` - Design system
- `Core/Auth/AuthManager.swift` - Authentification
- `Core/Network/APIClient.swift` - Appels API
- `Models/` - Tous les modèles de données

### Dépendances
- Supabase Swift SDK
- Kingfisher (images async)

---

*Ce document sera mis à jour au fur et à mesure du développement.*
