# 🚀 EasyCo - Application iOS Native (Swift/SwiftUI)

## Architecture du Projet

Cette application est une **vraie application native iOS** développée en Swift et SwiftUI, offrant la meilleure expérience utilisateur possible.

## 📁 Structure du Projet

```
EasyCoiOS/
├── EasyCoApp.swift                 # Point d'entrée de l'app
├── ContentView.swift               # Vue principale avec navigation
├── Config/
│   ├── AppConfig.swift             # Configuration (API URLs, etc.)
│   └── Theme.swift                 # Design system (couleurs, fonts)
├── Core/
│   ├── Network/
│   │   ├── APIClient.swift         # Client HTTP générique
│   │   ├── APIEndpoint.swift       # Définition des endpoints
│   │   └── NetworkError.swift      # Gestion des erreurs
│   ├── Storage/
│   │   ├── CoreDataManager.swift   # Gestion CoreData
│   │   └── UserDefaultsManager.swift
│   └── Auth/
│       ├── AuthManager.swift       # Gestion authentification
│       └── SupabaseAuth.swift      # Client Supabase
├── Models/
│   ├── User.swift                  # Modèle utilisateur
│   ├── Property.swift              # Modèle propriété
│   ├── Message.swift               # Modèle message
│   └── Group.swift                 # Modèle groupe
├── Features/
│   ├── Onboarding/
│   │   ├── OnboardingView.swift
│   │   ├── OnboardingViewModel.swift
│   │   └── OnboardingSteps/
│   ├── Auth/
│   │   ├── LoginView.swift
│   │   ├── SignupView.swift
│   │   ├── ForgotPasswordView.swift
│   │   └── AuthViewModel.swift
│   ├── Properties/
│   │   ├── List/
│   │   │   ├── PropertiesListView.swift
│   │   │   ├── PropertyCardView.swift
│   │   │   └── PropertiesViewModel.swift
│   │   ├── Detail/
│   │   │   ├── PropertyDetailView.swift
│   │   │   ├── PropertyImageGalleryView.swift
│   │   │   └── PropertyDetailViewModel.swift
│   │   └── Filters/
│   │       ├── FiltersView.swift
│   │       └── FilterViewModel.swift
│   ├── Profile/
│   │   ├── ProfileView.swift
│   │   ├── EditProfileView.swift
│   │   ├── PreferencesView.swift
│   │   └── ProfileViewModel.swift
│   ├── Messages/
│   │   ├── MessagesListView.swift
│   │   ├── ChatView.swift
│   │   ├── MessageBubbleView.swift
│   │   └── MessagesViewModel.swift
│   ├── Groups/
│   │   ├── GroupsListView.swift
│   │   ├── GroupDetailView.swift
│   │   └── GroupsViewModel.swift
│   └── Favorites/
│       ├── FavoritesView.swift
│       └── FavoritesViewModel.swift
├── Components/
│   ├── Common/
│   │   ├── LoadingView.swift
│   │   ├── ErrorView.swift
│   │   ├── EmptyStateView.swift
│   │   └── CustomButton.swift
│   └── Custom/
│       ├── SearchBar.swift
│       ├── FilterChip.swift
│       └── BadgeView.swift
├── Extensions/
│   ├── Color+Theme.swift
│   ├── View+Extensions.swift
│   └── String+Extensions.swift
└── Resources/
    ├── Assets.xcassets
    ├── Localizable.strings
    └── Info.plist
```

## 🎨 Design System

### Couleurs
- **Primary**: #7c3aed (Violet - brand)
- **Secondary**: #ec4899 (Rose)
- **Background**: #FFFFFF / #F9FAFB
- **Text**: #111827 / #6B7280
- **Success**: #10B981
- **Error**: #EF4444

### Typography
- **Titre**: SF Pro Display Bold
- **Sous-titre**: SF Pro Display Semibold
- **Body**: SF Pro Text Regular
- **Caption**: SF Pro Text Regular (petit)

## 🔧 Technologies Utilisées

- **SwiftUI**: Interface utilisateur déclarative
- **Combine**: Programmation réactive
- **URLSession**: Requêtes HTTP
- **CoreData**: Stockage local et cache
- **Keychain**: Stockage sécurisé des tokens
- **UserDefaults**: Préférences utilisateur
- **Supabase Swift Client**: Authentification et API

## 📡 API Integration

L'application communique avec le backend Next.js via API REST :

### Endpoints Principaux
```
GET    /api/properties        # Liste des propriétés
GET    /api/properties/:id    # Détail d'une propriété
POST   /api/properties        # Créer une propriété
GET    /api/profile          # Profil utilisateur
PUT    /api/profile          # Mettre à jour le profil
GET    /api/messages         # Liste des conversations
POST   /api/messages         # Envoyer un message
GET    /api/groups           # Liste des groupes
POST   /api/favorites        # Ajouter aux favoris
```

### Authentification
- **Supabase Auth** pour l'authentification
- Token JWT stocké dans le Keychain
- Refresh automatique du token

## 🚀 Fonctionnalités Implémentées

### Phase 1 : Core (MVP)
- [x] Authentification (Login/Signup)
- [ ] Liste des propriétés avec images
- [ ] Détail d'une propriété
- [ ] Profil utilisateur
- [ ] Filtres de recherche

### Phase 2 : Social
- [ ] Messagerie en temps réel
- [ ] Groupes de colocation
- [ ] Favoris et likes
- [ ] Notifications push

### Phase 3 : Advanced
- [ ] Matching intelligent
- [ ] Vérification d'identité
- [ ] Partage de propriété
- [ ] Mode offline avec cache

## 🏗️ Architecture Patterns

### MVVM (Model-View-ViewModel)
Chaque feature utilise le pattern MVVM pour séparer la logique métier de l'UI.

```swift
// Exemple
Property (Model)
    ↓
PropertyDetailViewModel (ViewModel)
    ↓
PropertyDetailView (View)
```

### Repository Pattern
Couche d'abstraction pour les sources de données (API + Cache)

### Dependency Injection
Services injectés via Environment Objects

## 📦 Dépendances Swift Package Manager

```swift
dependencies: [
    .package(url: "https://github.com/supabase/supabase-swift", from: "2.0.0"),
    // Autres packages si nécessaire
]
```

## 🧪 Testing

- **Unit Tests**: Tests de la logique métier
- **UI Tests**: Tests des flows utilisateur
- **Snapshot Tests**: Tests visuels

## 🚀 Build & Run

### Prérequis
- macOS Ventura ou supérieur
- Xcode 15+
- iOS 16+ (target)

### Configuration
1. Ouvrir `EasyCo.xcodeproj` dans Xcode
2. Configurer les variables d'environnement dans `AppConfig.swift`
3. Sélectionner un simulateur ou device
4. Appuyer sur Run (⌘R)

## 🔐 Configuration Requise

### Variables d'Environnement
À configurer dans `Config/AppConfig.swift` :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `API_BASE_URL`

## 📱 Target iOS

- **Minimum**: iOS 16.0
- **Recommandé**: iOS 17.0+
- **Devices**: iPhone et iPad

## 🎯 Prochaines Étapes

1. Configurer le projet Xcode
2. Implémenter les modèles de données
3. Créer le client API
4. Développer l'authentification
5. Construire les vues principales
6. Ajouter le cache local
7. Tester et optimiser
8. Soumettre à l'App Store

---

**Développé avec ❤️ pour offrir la meilleure expérience iOS**
