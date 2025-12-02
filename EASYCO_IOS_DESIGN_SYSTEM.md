# EasyCo iOS - Design System & UI/UX Guidelines
## Plan de Design Complet pour l'Application iOS

---

## 📋 Table des Matières

1. [Vision & Philosophie](#vision--philosophie)
2. [Analyse Comparative](#analyse-comparative)
3. [Système de Design](#système-de-design)
4. [Navigation & Architecture](#navigation--architecture)
5. [Composants UI](#composants-ui)
6. [Fonctionnalités Clés](#fonctionnalités-clés)
7. [Animations & Interactions](#animations--interactions)
8. [Accessibilité & i18n](#accessibilité--i18n)
9. [Plan d'Implémentation](#plan-dimplémentation)

---

## 🎯 Vision & Philosophie

### Objectif Principal
Créer une expérience iOS native qui combine :
- **L'identité visuelle d'EasyCo** (couleurs, typographie, gradients)
- **Les meilleures pratiques iOS** (Human Interface Guidelines)
- **L'excellence UX** des leaders du marché (Airbnb, Tinder, Booking)

### Principes de Design

1. **Native-First**
   - Interactions gestuelles iOS (swipe, long-press, pull-to-refresh)
   - Animations fluides avec spring animations
   - Respect des zones sûres et des conventions iOS

2. **Clarity over Density**
   - Cartes espacées avec respiration visuelle
   - Hiérarchie claire avec typographie bold/medium
   - Espaces blancs généreux (16-24px entre sections)

3. **Progressive Disclosure**
   - Information essentielle en premier
   - Détails accessibles via swipe/tap
   - Bottom sheets pour actions contextuelles

4. **Delightful Interactions**
   - Micro-animations subtiles
   - Feedback haptique
   - Transitions contextuelles

---

## 🔍 Analyse Comparative

### 1. Airbnb - Excellence en Navigation

**Ce qu'on adopte :**
- **Tab Bar minimaliste** : 5 items max avec icônes Lucide
- **Search Header fixe** : Barre de recherche toujours accessible
- **Cards avec images hero** : Photos en plein écran, coins arrondis 16px
- **Skeleton loading** : Placeholder animés pendant le chargement
- **Map integration** : Vue carte/liste switchable

**Adaptation EasyCo :**
```swift
// Tab Bar Structure
TabBar {
    - Recherche (search icon) - PropertiesListView
    - Matchs (sparkles icon) - MatchesView
    - Hub (home icon) - RoleDashboard
    - Messages (message-circle icon) - MessagesView
    - Profil (user icon) - ProfileView
}

// Search Header (sticky)
SearchBar {
    - Icon: search (Lucide)
    - Placeholder: "Ville, quartier, adresse..."
    - Style: Rounded 16px, shadow soft
    - Action: → SearchFiltersView (bottom sheet)
}
```

### 2. Tinder - Swipe Interactions

**Ce qu'on adopte :**
- **Card Stack** : Propriétés empilées pour swipe
- **Match Animation** : Célébration visuelle des matchs
- **Quick Actions** : Boutons flottants (like/dislike/super like)
- **Profile Preview** : Tap pour voir détails, swipe pour décider

**Adaptation EasyCo :**
```swift
// Swipe Cards pour Matchs
PropertyCardStack {
    - Swipe Right → Like + Animation confetti
    - Swipe Left → Passer
    - Swipe Up → Super Like (prioritaire)
    - Tap → PropertyDetailView (modal)

    Actions Buttons:
    - ✕ Passer (gray)
    - ★ Super Like (orange gradient)
    - ❤ Like (pink gradient)
}

// Match Celebration
MatchFoundView {
    - Background: Gradient orange + particles
    - Animation: Scale + rotation
    - CTA: "Envoyer un message"
    - Action: → ConversationView
}
```

### 3. Booking.com - Information Density

**Ce qu'on adopte :**
- **Chips pour filtres** : Scrollable horizontal, multisélection
- **Price Highlight** : Prix en gras, détails en small
- **Availability Indicators** : Badges colorés (Disponible, Presque complet, Complet)
- **Trust Signals** : Avis, vérifications, badges

**Adaptation EasyCo :**
```swift
// Filters Chips (horizontal scroll)
FiltersRow {
    - Prix: "500-1000€"
    - Chambres: "2-3"
    - Meublé: ✓
    - Animaux: ✓
    - Badge count: "12 filtres"
}

// Property Card Info
PropertyCard {
    Header:
    - Photo carousel (3-5 images)
    - Heart icon (favoris) - top right
    - Badge "Nouveau" / "Vérifié" - top left

    Body:
    - Prix: 850€/mois (bold, 20px)
    - Type: "Appartement 2 chambres"
    - Location: "Bruxelles, Ixelles" + distance
    - Features: Icons (bed, bath, area)
    - Match %: "85% compatible" (gradient badge)

    Footer:
    - Disponible: "À partir du 15 mars"
    - Action: "Voir détails" →
}
```

### 4. Uber - Real-time Updates

**Ce qu'on adopte :**
- **Status Timeline** : Étapes de candidature visuelles
- **Live Updates** : Messages, notifications en temps réel
- **Quick Replies** : Réponses prédéfinies pour messages
- **ETA Display** : Temps estimé pour réponses/visites

**Adaptation EasyCo :**
```swift
// Application Timeline
ApplicationStatusView {
    Steps:
    1. ✓ Candidature envoyée (gris)
    2. ⏳ En cours d'examen (orange, animated)
    3. ○ Visite planifiée (à venir)
    4. ○ Décision finale (à venir)

    Each step:
    - Icon + status
    - Date/heure
    - Action possible (si applicable)
}

// Message Quick Replies
MessageComposer {
    Suggestions:
    - "Je suis intéressé(e)"
    - "Puis-je visiter ?"
    - "Quelle est la date de disponibilité ?"
}
```

### 5. Immoweb - Property Details

**Ce qu'on adopte :**
- **Full-screen Photo Gallery** : Swipe horizontal, zoom pinch
- **Sticky CTA** : Bouton "Postuler" toujours visible
- **Tabs pour sections** : Description, Détails, Localisation, Avis
- **Virtual Tour** : 360° / Plan interactif

**Adaptation EasyCo :**
```swift
// Property Detail Structure
PropertyDetailView {
    Header:
    - Photo Gallery (full-width, page indicators)
    - Back button (top-left, white circle)
    - Share/Favorite (top-right)

    Content (ScrollView):
    - Price + Quick Info Card
    - Host Profile Card (photo + nom + badge)
    - Description (expandable "Voir plus")
    - Amenities (grid icons)
    - Location Map (interactive)
    - Reviews (carousel)
    - Similar Properties

    Footer (sticky):
    - Price: "850€/mois"
    - CTA: "Postuler" (gradient orange, full-width)
}
```

---

## 🎨 Système de Design

### Couleurs

#### Palette Principale (identique web)
```swift
// Brand Colors
Primary Orange: #FFA040 → #FFB85C (gradient)
Secondary Purple: #6E56CF
Accent Coral: #E8865D

// Semantic Colors
Success: #10B981
Warning: #F59E0B
Error: #EF4444
Info: #3B82F6

// Neutrals
Gray 50: #F9FAFB (backgrounds)
Gray 100: #F3F4F6 (cards)
Gray 200: #E5E7EB (borders)
Gray 300: #D1D5DB
Gray 400: #9CA3AF (secondary text)
Gray 500: #6B7280
Gray 600: #4B5563
Gray 900: #111827 (primary text)

// Overlays
Dark Overlay: rgba(0,0,0,0.4)
Light Overlay: rgba(255,255,255,0.95)
```

#### Couleurs iOS Spécifiques
```swift
// Dynamic Colors (Dark Mode)
Background Primary:
  - Light: #FFFFFF
  - Dark: #000000

Background Secondary:
  - Light: #F9FAFB
  - Dark: #1C1C1E

Label Primary:
  - Light: #111827
  - Dark: #FFFFFF
```

### Typographie

#### Hiérarchie (SF Pro, system default)
```swift
// Headers
H1: 34px, Bold (Large Titles)
H2: 28px, Bold (Section Headers)
H3: 22px, Semibold (Card Titles)
H4: 20px, Semibold (Subtitles)

// Body
Body Large: 17px, Regular (Default iOS)
Body: 15px, Regular
Body Small: 13px, Medium
Caption: 11px, Medium (Uppercase for labels)

// Special
Price: 24px, Bold (Primary color)
Badge: 12px, Semibold (Rounded background)
```

### Spacing & Layout

#### Grid System
```swift
Margins:
- Phone: 16px (sides)
- Tablet: 24px (sides)

Spacing Scale:
- 4px (tight)
- 8px (compact)
- 12px (cozy)
- 16px (normal) ← Default
- 24px (relaxed) ← Between sections
- 32px (loose)
- 48px (spacious)
```

#### Corner Radius
```swift
- Small: 8px (chips, small buttons)
- Medium: 12px (inputs, secondary buttons)
- Large: 16px (cards, primary buttons)
- XLarge: 24px (modals, sheets)
- Circle: 50% (avatars, icon buttons)
```

#### Shadows
```swift
// Elevation
Card:
  - color: rgba(0,0,0,0.04)
  - blur: 8px
  - offset: (0, 2)

Floating Button:
  - color: rgba(FFA040, 0.3)
  - blur: 16px
  - offset: (0, 4)

Modal:
  - color: rgba(0,0,0,0.2)
  - blur: 40px
  - offset: (0, 20)
```

---

## 🧭 Navigation & Architecture

### Tab Bar Structure

```swift
MainTabView {
    Tab 1: Recherche / Explorer
    - Icon: search (Lucide)
    - Color: Orange gradient
    - View: PropertiesListView

    Tab 2: Matchs / Favoris
    - Icon: sparkles (Lucide)
    - Color: Pink gradient
    - View: MatchesView
    - Badge: Nombre de nouveaux matchs

    Tab 3: Hub Central (role-based)
    - Icon: home (Lucide)
    - Color: Purple gradient
    - View: RoleDashboard (Searcher/Owner/Resident)

    Tab 4: Messages
    - Icon: message-circle (Lucide)
    - Color: Blue gradient
    - View: MessagesListView
    - Badge: Messages non lus

    Tab 5: Profil
    - Icon: user (Lucide)
    - Color: Gray
    - View: ProfileView
}
```

### Navigation Patterns

#### 1. Stack Navigation (Push/Pop)
```swift
// Pour parcours linéaire
PropertiesListView
  → PropertyDetailView
    → ApplicationFormView
      → ConfirmationView
```

#### 2. Modal Presentation (Sheet)
```swift
// Pour actions ponctuelles
- Filtres de recherche (bottom sheet, 60% height)
- Ajout de propriété (full screen)
- Modification profil (full screen)
- Paramètres (full screen)
```

#### 3. Bottom Sheet (Custom)
```swift
// Pour quick actions
- Quick filters (detent: .medium)
- Sort options (detent: .small)
- Share options (detent: .small)
```

#### 4. Swipe Gestures
```swift
// Navigation alternative
- Swipe back: Retour (edge swipe)
- Swipe down: Fermer modal
- Swipe card: Like/Dislike
- Pull to refresh: Recharger
```

---

## 🧩 Composants UI

### 1. Cards

#### PropertyCard (Liste)
```swift
PropertyCard {
    Layout: VStack

    ImageCarousel {
        - Height: 200px
        - Corner radius: 16px (top only)
        - Page indicators (dots)
        - Heart icon (favorite) - overlay top-right
    }

    ContentStack {
        Padding: 16px

        Row 1:
        - Price (24px, bold, orange)
        - Badge "Nouveau" / "Vérifié"

        Row 2:
        - Title (17px, bold)
        - Location (15px, gray + map-pin icon)

        Row 3:
        - Features (icons: bed, bath, ruler)

        Row 4:
        - Match score (gradient badge "85% compatible")
        - Availability date
    }

    Shadow: soft
    Corner radius: 16px
    Background: white
}
```

#### PropertyCard (Grid - compact)
```swift
PropertyCardCompact {
    Layout: VStack (width: 48%)

    Image {
        - Aspect ratio: 1:1
        - Corner radius: 16px
        - Heart icon overlay
    }

    Info (padding: 12px) {
        - Price (18px, bold)
        - Title (14px, 2 lines max)
        - Location (12px, gray)
    }
}
```

### 2. Buttons

#### Primary Button
```swift
PrimaryButton {
    Style:
    - Background: Linear gradient orange
    - Text: White, 16px, semibold
    - Height: 52px
    - Corner radius: 16px
    - Shadow: orange glow
    - Full width (with 16px margins)

    States:
    - Normal: Full opacity
    - Pressed: 0.85 opacity + scale 0.98
    - Disabled: 0.5 opacity, gray gradient
    - Loading: Spinner + "Chargement..."
}
```

#### Secondary Button
```swift
SecondaryButton {
    Style:
    - Background: White
    - Border: 2px, orange
    - Text: Orange, 16px, semibold
    - Height: 52px
    - Corner radius: 16px
}
```

#### Icon Button
```swift
IconButton {
    Style:
    - Size: 44x44px (minimum touch target)
    - Background: White circle
    - Icon: 20x20px, colored
    - Shadow: subtle
    - Corner radius: 50%
}
```

### 3. Inputs

#### TextField
```swift
ModernTextField {
    Style:
    - Height: 52px
    - Background: Gray 50
    - Border: 2px transparent (1px gray on focus)
    - Corner radius: 12px
    - Padding: 16px
    - Font: 15px regular

    With icon:
    - Leading icon: 20x20px, gray
    - Trailing action: Clear/Show password

    States:
    - Default: Gray background
    - Focus: White background + orange border
    - Error: Red border + error message below
    - Disabled: 0.5 opacity
}
```

#### SearchBar
```swift
SearchBar {
    Style:
    - Height: 48px
    - Background: White
    - Shadow: soft
    - Corner radius: 24px (pill shape)
    - Leading: Search icon (orange)
    - Placeholder: Gray 400
    - Trailing: Filter button (badge if active)
}
```

### 4. Chips & Tags

#### FilterChip
```swift
FilterChip {
    Style:
    - Height: 36px
    - Padding: 12px 16px
    - Corner radius: 18px (pill)

    Unselected:
    - Background: Gray 100
    - Text: Gray 700
    - Border: none

    Selected:
    - Background: Orange gradient
    - Text: White
    - Border: none
    - Icon: checkmark
}
```

#### Badge
```swift
Badge {
    Style:
    - Padding: 4px 8px
    - Corner radius: 8px
    - Font: 11px, semibold, uppercase

    Variants:
    - Success: Green background, dark green text
    - Warning: Yellow background, dark yellow text
    - Info: Blue background, white text
    - New: Orange gradient, white text
}
```

### 5. Bottom Sheets

#### Custom Sheet
```swift
BottomSheet {
    Handle {
        - Width: 40px
        - Height: 4px
        - Color: Gray 300
        - Corner radius: 2px
        - Center top (12px from top)
    }

    Header {
        - Title (22px, bold)
        - Close button (top-right)
        - Padding: 24px
    }

    Content {
        - ScrollView if needed
        - Padding: 0 24px
    }

    Footer (if CTA) {
        - Sticky bottom
        - Primary button
        - Padding: 24px
        - Background: White with top shadow
    }

    Detents:
    - .small: 30%
    - .medium: 60%
    - .large: 90%
}
```

---

## ⚡ Fonctionnalités Clés

### 1. Recherche de Propriétés

#### Interface
```swift
PropertiesSearchView {
    Header (sticky):
    - SearchBar
    - Filters button (badge count)

    Filters Row (horizontal scroll):
    - Quick filters chips
    - "Tous les filtres" button

    View Toggle:
    - List icon
    - Grid icon (2 columns)
    - Map icon

    Content:
    - Property cards (liste ou grid)
    - Infinite scroll
    - Pull to refresh

    Empty State:
    - Illustration
    - "Aucune propriété trouvée"
    - "Modifier les filtres" button
}
```

#### Filtres Avancés (Bottom Sheet)
```swift
FiltersSheet {
    Sections:

    1. Prix
       - Dual range slider (min/max)
       - Display: "500€ - 1500€"

    2. Type de logement
       - Segmented control: Appartement / Studio / Maison

    3. Chambres & Salles de bain
       - Stepper buttons (0-5+)

    4. Équipements (grid, multi-select)
       - Meublé, Cuisine équipée, Balcon
       - Parking, Animaux acceptés, Jardin

    5. Disponibilité
       - Date picker (à partir de)

    6. Distance
       - Slider (0-10km)
       - Center: Ma position / Lieu personnalisé

    Footer:
    - "Réinitialiser" (text button, left)
    - "Voir X résultats" (primary button, right)
}
```

### 2. Détails de Propriété

```swift
PropertyDetailView {
    Structure:

    1. Photo Gallery (full-width)
       - Swipeable carousel
       - Page indicators
       - Zoom on tap
       - Share/Favorite buttons (overlay)

    2. Quick Info Card (sticky on scroll)
       - Price + per month
       - Type + size
       - Location
       - Match score

    3. Host Card
       - Avatar + name
       - Badge vérifié
       - Response rate + time
       - "Contacter" button

    4. Description
       - Expandable text (show more)
       - Max 3 lines initially

    5. Amenities Grid
       - Icons + labels (3 columns)
       - Show all button if >9

    6. Location Section
       - Interactive map (small)
       - Address
       - "Voir sur la carte" button
       - Nearby (transport, commerces)

    7. House Rules
       - Icons + text
       - Pets, Smoking, Guests, etc.

    8. Reviews
       - Average rating (stars + number)
       - Recent reviews (2-3)
       - "Voir tous les avis" button

    9. Similar Properties
       - Horizontal scroll
       - Compact cards

    Sticky Footer:
    - Price (bold)
    - Primary CTA: "Postuler" / "Contacter"
}
```

### 3. Système de Match

#### Swipe Cards (Tinder-like)
```swift
MatchSwipeView {
    Card Stack (ZStack):
    - Top card: interactive
    - 2nd card: visible behind (scale 0.95)
    - 3rd card: visible behind (scale 0.90)

    Card Content:
    - Full-height image
    - Gradient overlay (bottom)
    - Info overlay:
      - Title
      - Location
      - Price
      - Match % (gradient badge)
    - Tap → Full detail modal

    Gestures:
    - Drag to swipe
    - Swipe right (>100px) → Like + green overlay "❤️"
    - Swipe left (<-100px) → Pass + red overlay "✕"
    - Swipe up (>150px) → Super like + orange overlay "★"
    - Release <threshold → Return to center (spring)

    Action Buttons (bottom):
    - Pass (gray circle, ✕ icon)
    - Super Like (orange gradient circle, ★ icon) - larger
    - Like (pink gradient circle, ❤ icon)

    Match Found Modal:
    - Full screen overlay
    - Gradient background + confetti animation
    - Property image + your profile side by side
    - "C'est un match!" (bold, white)
    - "Envoyez un message" (primary button)
    - "Continuer" (text button)
}
```

### 4. Messages

#### Liste de Conversations
```swift
ConversationsListView {
    Header:
    - Title "Messages"
    - Search bar (optional, swipe down)

    Tabs (segmented):
    - Toutes
    - Non lues (badge count)
    - Archivées

    Conversation Row:
    - Avatar (circle, 56x56)
    - Badge "en ligne" (green dot)
    - Name (bold if unread)
    - Last message preview (2 lines max)
    - Timestamp
    - Unread badge (orange circle, count)
    - Swipe actions:
      - Leading: Archive (blue)
      - Trailing: Delete (red)

    Empty State:
    - Illustration
    - "Aucune conversation"
    - "Commencez à matcher" CTA
}
```

#### Vue Conversation
```swift
ConversationView {
    Header:
    - Back button
    - Avatar + name + online status
    - Menu (•••) → Report, Block, Archive

    Messages (ScrollView):
    - Reverse scroll (latest at bottom)
    - Date separators
    - Message bubbles:
      - Received: Gray background, left aligned
      - Sent: Orange gradient, right aligned
      - Max width: 75%
      - Tail indicator
      - Timestamp (small, gray)
      - Read receipt (double checkmark)

    - System messages:
      - Center aligned
      - Gray text
      - Ex: "Match établi le 12 mars"

    - Property card (shared):
      - Compact card
      - Tappable → Detail

    Input Bar (sticky bottom):
    - TextField (expandable, max 4 lines)
    - Attachment button (image, document)
    - Send button (orange, disabled if empty)

    Quick Replies (contextual):
    - Show above input if no message sent
    - Chips with suggestions
    - Ex: "Intéressé(e)", "Quand puis-je visiter?"
}
```

### 5. Profil & Paramètres

#### Profil View
```swift
ProfileView {
    Header:
    - Cover image (optional, gradient fallback)
    - Avatar (large, center, editable)
    - Name (bold, 24px)
    - Role badge (Chercheur / Propriétaire / Résident)
    - "Modifier" button

    Stats Row (3 columns):
    - Annonces actives
    - Matchs
    - Avis reçus

    Verification Card:
    - Icon + status
    - Email vérifié ✓
    - Téléphone vérifié ✓
    - Document d'identité (pending/verified)
    - "Compléter" button

    Menu Sections:

    Mon activité:
    - Mes favoris
    - Mes candidatures
    - Mes visites programmées
    - Historique

    Préférences:
    - Notifications
    - Langue (FR/EN/NL)
    - Thème (Auto/Clair/Sombre)

    Compte:
    - Informations personnelles
    - Sécurité & connexion
    - Confidentialité
    - Paiement (si owner/resident)

    Support:
    - Centre d'aide
    - Nous contacter
    - Signaler un problème

    Footer:
    - Déconnexion (red)
    - Version app
}
```

---

## 🎬 Animations & Interactions

### Principes

1. **Spring-based** : Toutes les animations utilisent `.spring()` pour un rendu naturel
2. **Durée courte** : 0.3-0.4s max pour la plupart des animations
3. **Purposeful** : Chaque animation guide l'attention ou donne un feedback

### Catalog d'Animations

#### 1. Page Transitions
```swift
// Navigation push/pop
.transition(.asymmetric(
    insertion: .move(edge: .trailing),
    removal: .move(edge: .leading)
))
.animation(.spring(response: 0.35, dampingFraction: 0.8))

// Modal presentation
.transition(.move(edge: .bottom).combined(with: .opacity))
.animation(.spring(response: 0.4, dampingFraction: 0.85))
```

#### 2. Card Interactions
```swift
// Card tap
.scaleEffect(isPressed ? 0.98 : 1.0)
.animation(.spring(response: 0.25, dampingFraction: 0.7), value: isPressed)

// Card swipe (match)
.offset(x: dragOffset)
.rotationEffect(.degrees(dragOffset / 20))
.animation(.spring(response: 0.35, dampingFraction: 0.75))
```

#### 3. Button States
```swift
// Primary button press
.scaleEffect(isPressed ? 0.96 : 1.0)
.opacity(isPressed ? 0.9 : 1.0)
.animation(.spring(response: 0.2, dampingFraction: 0.6), value: isPressed)

// Loading state
ProgressView()
    .progressViewStyle(CircularProgressViewStyle(tint: .white))
    .scaleEffect(1.2)
```

#### 4. List Animations
```swift
// Appear animation (stagger)
ForEach(Array(items.enumerated()), id: \.element.id) { index, item in
    ItemRow(item: item)
        .transition(.opacity.combined(with: .move(edge: .top)))
        .animation(.spring(response: 0.4, dampingFraction: 0.8).delay(Double(index) * 0.05))
}

// Delete animation
.transition(.asymmetric(
    insertion: .scale.combined(with: .opacity),
    removal: .move(edge: .leading).combined(with: .opacity)
))
```

#### 5. Success Feedback
```swift
// Match found
.scaleEffect(showMatch ? 1.0 : 0.5)
.opacity(showMatch ? 1.0 : 0)
.animation(.spring(response: 0.6, dampingFraction: 0.6), value: showMatch)

// Confetti particles
ParticleEmitter()
    .animation(.easeOut(duration: 1.5))
```

#### 6. Skeleton Loading
```swift
// Shimmer effect
Rectangle()
    .fill(
        LinearGradient(
            colors: [.gray.opacity(0.3), .gray.opacity(0.1), .gray.opacity(0.3)],
            startPoint: .leading,
            endPoint: .trailing
        )
    )
    .offset(x: animateGradient ? 400 : -400)
    .animation(.linear(duration: 1.5).repeatForever(autoreverses: false))
```

### Haptic Feedback

```swift
// Impact feedback
func lightImpact() {
    UIImpactFeedbackGenerator(style: .light).impactOccurred()
}

func mediumImpact() {
    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
}

// Notification feedback
func successFeedback() {
    UINotificationFeedbackGenerator().notificationOccurred(.success)
}

func errorFeedback() {
    UINotificationFeedbackGenerator().notificationOccurred(.error)
}

// Selection feedback
func selectionFeedback() {
    UISelectionFeedbackGenerator().selectionChanged()
}

// Usage examples:
- Button tap → lightImpact()
- Card swipe → mediumImpact()
- Match found → successFeedback()
- Error submit → errorFeedback()
- Filter selection → selectionFeedback()
```

---

## ♿ Accessibilité & i18n

### Accessibilité (VoiceOver)

```swift
// Labels
.accessibilityLabel("Postuler pour cette propriété")

// Hints
.accessibilityHint("Ouvre le formulaire de candidature")

// Values
.accessibilityValue("Prix: 850 euros par mois")

// Actions
.accessibilityAction(named: "Ajouter aux favoris") {
    toggleFavorite()
}

// Traits
.accessibilityAddTraits(.isButton)
.accessibilityRemoveTraits(.isImage)

// Groups
.accessibilityElement(children: .combine)

// Dimamic Type
Text("Title")
    .font(.system(size: 24, weight: .bold))
    .dynamicTypeSize(.medium ... .xxxLarge)
```

### Internationalisation

#### Structure
```
i18n/
├── fr.lproj/
│   └── Localizable.strings
├── en.lproj/
│   └── Localizable.strings
└── nl.lproj/
    └── Localizable.strings
```

#### Utilisation
```swift
// In code
Text("search.placeholder")
    .localized()

// Dans Localizable.strings
// FR
"search.placeholder" = "Ville, quartier, adresse...";
"property.bedrooms" = "%d chambre(s)";
"match.percentage" = "%d%% compatible";

// EN
"search.placeholder" = "City, neighborhood, address...";
"property.bedrooms" = "%d bedroom(s)";
"match.percentage" = "%d%% match";

// NL
"search.placeholder" = "Stad, wijk, adres...";
"property.bedrooms" = "%d slaapkamer(s)";
"match.percentage" = "%d%% match";
```

#### LanguageManager
```swift
class LanguageManager: ObservableObject {
    @Published var currentLanguage: Language = .french

    enum Language: String, CaseIterable {
        case french = "fr"
        case english = "en"
        case dutch = "nl"

        var name: String {
            switch self {
            case .french: return "Français"
            case .english: return "English"
            case .dutch: return "Nederlands"
            }
        }

        var flag: String {
            switch self {
            case .french: return "🇫🇷"
            case .english: return "🇬🇧"
            case .dutch: return "🇳🇱"
            }
        }
    }

    func setLanguage(_ language: Language) {
        currentLanguage = language
        UserDefaults.standard.set(language.rawValue, forKey: "app_language")
        Bundle.setLanguage(language.rawValue)
    }
}
```

---

## 📅 Plan d'Implémentation

### Phase 1 : Fondations (Semaines 1-2)

#### Objectif : Établir le système de design et l'architecture de base

**Tasks :**
1. ✅ Créer le Design System
   - Fichier `Theme.swift` avec couleurs, typographie, spacing
   - Extension `Color+Hex.swift`
   - Extension `View+Modifiers.swift` (styles réutilisables)

2. ✅ Icônes Lucide
   - Télécharger tous les icônes nécessaires (50-60 icônes)
   - Créer imagesets dans Assets.xcassets
   - Mapper dans `Image.lucide()` extension

3. ✅ Composants de Base
   - `PrimaryButton.swift`
   - `SecondaryButton.swift`
   - `ModernTextField.swift`
   - `SearchBar.swift`
   - `FilterChip.swift`
   - `Badge.swift`

4. Structure de Navigation
   - Refactoriser `MainTabView`
   - Configurer NavigationStack pour chaque tab
   - Implémenter tab bar personnalisé avec icônes Lucide

**Livrables :**
- Design System fonctionnel
- Tous les icônes intégrés
- 6 composants réutilisables
- Navigation de base fonctionnelle

---

### Phase 2 : Recherche & Propriétés (Semaines 3-4)

#### Objectif : Interface de recherche et affichage des propriétés

**Tasks :**
1. Vue Liste de Propriétés
   - `PropertiesListView` avec SearchBar sticky
   - `PropertyCard` (version liste)
   - Grid toggle (2 colonnes)
   - Pull to refresh
   - Infinite scroll

2. Filtres Avancés
   - `FiltersBottomSheet`
   - Range sliders (prix, distance)
   - Multi-select chips (équipements)
   - Date picker (disponibilité)
   - Compteur de filtres actifs

3. Détails de Propriété
   - `PropertyDetailView`
   - Photo gallery avec carousel
   - Sections (description, équipements, carte, avis)
   - Sticky footer avec CTA
   - Share & Favorite actions

4. Vue Carte
   - Intégration MapKit
   - Marqueurs personnalisés (prix)
   - Clustering
   - Bottom sheet avec card preview

**Livrables :**
- Recherche fonctionnelle avec filtres
- Cards de propriété design
- Détails complets avec toutes les sections
- Vue carte interactive

---

### Phase 3 : Matchs & Swipe (Semaine 5)

#### Objectif : Système de match type Tinder

**Tasks :**
1. Swipe Cards
   - `MatchSwipeView` avec card stack
   - Drag gestures (left/right/up)
   - Overlays visuels (like/pass/super)
   - Spring animations sur release

2. Action Buttons
   - 3 boutons flottants (pass, super like, like)
   - Haptic feedback
   - Animations coordonnées avec swipe

3. Match Celebration
   - `MatchFoundModal` full-screen
   - Confetti/particles animation
   - Transition vers conversation

4. Liste des Matchs
   - `MatchesListView`
   - Grid 2 colonnes
   - Badge "Nouveau"
   - Quick actions (message, unmatch)

**Livrables :**
- Swipe cards fluides et réactives
- Animations de célébration
- Liste des matchs fonctionnelle

---

### Phase 4 : Messages (Semaine 6)

#### Objectif : Système de messagerie complet

**Tasks :**
1. Liste des Conversations
   - `ConversationsListView`
   - Row avec avatar, preview, timestamp
   - Swipe actions (archive, delete)
   - Badges non lus
   - Search bar

2. Vue Conversation
   - `ConversationView`
   - Bubbles messages (sent/received)
   - Date separators
   - Read receipts
   - Keyboard handling

3. Input & Envoi
   - `MessageInputBar`
   - Auto-expand textarea
   - Attachment button (images)
   - Send button state

4. Quick Replies
   - Suggestions contextuelles
   - Templates de messages
   - Property card sharing

**Livrables :**
- Messagerie complète et fonctionnelle
- Real-time updates (mock ou WebSocket)
- UX fluide avec keyboard

---

### Phase 5 : Profil & Paramètres (Semaine 7)

#### Objectif : Gestion du profil utilisateur

**Tasks :**
1. ProfileView
   - Header avec cover + avatar
   - Stats row
   - Verification badges
   - Menu sections organisées

2. Édition Profil
   - `EditProfileView`
   - Photo upload (camera/gallery)
   - Form avec validation
   - Save states

3. Paramètres
   - `SettingsView` redesign complet
   - Grouped cards par section
   - Language switcher avec flags
   - Theme switcher (light/dark/auto)
   - Notifications preferences

4. Vérifications
   - `VerificationFlow`
   - Email verification
   - Phone verification (SMS)
   - ID upload

**Livrables :**
- Profil complet et éditable
- Paramètres organisés par cards
- Multi-langue fonctionnel
- Dark mode support

---

### Phase 6 : Dashboards Role-Based (Semaine 8)

#### Objectif : Hub central pour chaque rôle

**Tasks :**
1. Searcher Dashboard
   - Quick stats (candidatures, favoris, matchs)
   - Recommended properties (carousel)
   - Recent activity
   - Quick actions (nouvelle recherche, mes visites)

2. Owner Dashboard
   - KPIs (propriétés, candidatures, revenus)
   - Charts (occupancy, finances)
   - Recent applications
   - Quick actions (add property, view calendar)

3. Resident Dashboard
   - Hub colocation
   - Expense summary
   - Tasks list
   - Announcements feed
   - Quick actions (add expense, create task)

4. Widgets iOS (optionnel)
   - Small widget : Stats du jour
   - Medium widget : Recent activity
   - Large widget : Dashboard summary

**Livrables :**
- 3 dashboards rôle-spécifiques
- Charts & graphs
- Quick actions contextuelles

---

### Phase 7 : Features Avancées (Semaines 9-10)

#### Objectif : Fonctionnalités différenciantes

**Tasks :**
1. Application Flow
   - `ApplicationFormView` multi-step
   - Document upload
   - Status timeline
   - Notifications

2. Visits Management
   - `VisitsCalendarView`
   - Book a visit (date/time picker)
   - Confirmation
   - Reminders

3. Reviews & Ratings
   - `ReviewsListView`
   - Write review modal
   - Star rating component
   - Moderation

4. Search Saved & Alerts
   - Save search criteria
   - Create alert (notifications)
   - Manage alerts

5. Onboarding
   - `OnboardingView` 3-4 écrans
   - Value proposition
   - Permissions requests
   - Role selection

**Livrables :**
- Candidature complète avec docs
- Système de visites
- Reviews fonctionnels
- Onboarding fluide

---

### Phase 8 : Polish & Optimisation (Semaines 11-12)

#### Objectif : Perfectionner l'expérience

**Tasks :**
1. Animations & Transitions
   - Revoir toutes les transitions
   - Ajouter micro-interactions
   - Haptic feedback partout
   - Skeleton loaders

2. Error Handling
   - Error states design
   - Empty states illustrations
   - Retry mechanisms
   - Offline mode indicators

3. Performance
   - Image caching (Kingfisher/SDWebImage)
   - Lazy loading
   - Pagination optimization
   - Memory leak checks

4. Accessibility
   - VoiceOver labels/hints
   - Dynamic Type support
   - Color contrast checks (WCAG AA)
   - Keyboard navigation

5. Testing
   - Unit tests (ViewModels)
   - UI tests (critical flows)
   - Beta testing (TestFlight)
   - Bug fixes

**Livrables :**
- App performante et stable
- Accessible WCAG AA
- Prête pour review App Store

---

## 🎯 Success Metrics

### UX Metrics
- **Task Completion Rate** : >90% pour les flows principaux
- **Time to First Match** : <5 minutes après onboarding
- **Search to Application** : <3 taps
- **Message Response Time** : <2 heures (display)

### Technical Metrics
- **App Launch Time** : <2 secondes (cold start)
- **Frame Rate** : 60 FPS constant (animations)
- **Crash Rate** : <0.1%
- **Network Errors** : <2% (avec retry)

### Business Metrics
- **Daily Active Users** : Croissance 20% MoM
- **Match Rate** : 15% des swipes
- **Message Rate** : 60% des matchs → conversation
- **Application Rate** : 30% des vues détail → candidature

---

## 📚 Ressources & Références

### Design Inspiration
- [Airbnb iOS App](https://www.airbnb.com/mobile)
- [Tinder iOS App](https://tinder.com)
- [Booking.com iOS App](https://www.booking.com/apps.html)
- [Zillow iOS App](https://www.zillow.com/mobile/)

### Apple Guidelines
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
- [iOS Design Resources](https://developer.apple.com/design/resources/)

### SwiftUI Resources
- [SwiftUI by Example](https://www.hackingwithswift.com/quick-start/swiftui)
- [iOS Architecture Patterns](https://medium.com/ios-os-x-development/ios-architecture-patterns-ecba4c38de52)

### Icons
- [Lucide Icons](https://lucide.dev) - 1000+ icons open source
- [SF Symbols](https://developer.apple.com/sf-symbols/) - Icons système Apple

---

## ✅ Next Steps

1. **Validation** : Review ce document avec l'équipe
2. **Prioritization** : Confirmer l'ordre des phases
3. **Kick-off Phase 1** : Commencer le Design System
4. **Setup Figma** : Créer les mockups haute-fidélité (optionnel)
5. **Weekly Reviews** : Points d'avancement chaque vendredi

---

**Document créé le** : 2 décembre 2025
**Version** : 1.0
**Auteur** : Claude + EasyCo Team
**Status** : Draft → À valider
