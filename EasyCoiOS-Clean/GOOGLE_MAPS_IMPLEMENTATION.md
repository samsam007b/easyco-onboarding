# 🗺️ Google Maps / MapKit Implementation - EasyCo iOS

Documentation de l'implémentation de la fonctionnalité de carte pour visualiser les propriétés.

## 📋 Vue d'ensemble

L'application iOS utilise **MapKit** (Apple natif) au lieu de Google Maps pour :
- **Coût**: Gratuit (pas de frais d'API)
- **Performance**: Optimisé pour iOS
- **Intégration**: Native SwiftUI
- **Fonctionnalités**: Équivalentes à Google Maps

---

## 🎯 Fonctionnalités implémentées

### ✅ Affichage de base
- [x] Carte centrée automatiquement sur les propriétés
- [x] Zoom adaptatif
- [x] Contrôles de zoom (+/- et recentrage)
- [x] Gestures de navigation (pinch, pan)

### ✅ Markers personnalisés
- [x] Pins avec icône custom (mappin.circle.fill)
- [x] Couleur role-based (orange résidentiel)
- [x] Animation au tap (scale + couleur)
- [x] États: Normal, Sélectionné

### ✅ Property Cards au tap
- [x] Card avec image de propriété
- [x] Prix affiché
- [x] Triangle pointer vers le pin
- [x] Animation d'apparition/disparition

### ✅ Interactions
- [x] Tap sur marker → Sélection
- [x] Tap sur marker sélectionné → Désélection
- [x] Centrage automatique sur propriété sélectionnée

### ✅ Utilitaires de géolocalisation
- [x] Calcul du centre (moyenne coordonnées)
- [x] Calcul de distance (Haversine)
- [x] Formatage d'adresse

---

## 📁 Fichiers créés

### 1. **Location.swift** (Models)
**Chemin**: `/EasyCoiOS-Clean/EasyCo/EasyCo/Models/Location.swift`

**Contenu**:
```swift
// GeoLocation: Wrapper pour coordonnées
struct GeoLocation: Codable, Equatable {
    let latitude: Double
    let longitude: Double
    var coordinate: CLLocationCoordinate2D
}

// Property Extension: Ajout de location et coordinate
extension Property {
    var location: GeoLocation?
    var coordinate: CLLocationCoordinate2D?
    var fullAddress: String
}

// LocationUtilities: Fonctions helper
struct LocationUtilities {
    static func calculateCenter(from: [Property]) -> CLLocationCoordinate2D
    static func distance(from:to:) -> Double
    static func formatDistance(_ meters: Double) -> String
}
```

**Utilisé pour**:
- Stocker et manipuler les coordonnées géographiques
- Extension du modèle Property avec données de localisation
- Utilitaires de calcul (centre, distance)

---

### 2. **PropertyAnnotation.swift** (Components/Map)
**Chemin**: `/EasyCoiOS-Clean/EasyCo/EasyCo/Components/Map/PropertyAnnotation.swift`

**Contenu**:
```swift
// PropertyAnnotation: Annotation MapKit pour propriété
class PropertyAnnotation: NSObject, MKAnnotation {
    let property: Property
    var coordinate: CLLocationCoordinate2D
    var title: String?
    var subtitle: String?
}

// PropertyAnnotationView: Vue personnalisée UIKit (non utilisée pour SwiftUI)
class PropertyAnnotationView: MKAnnotationView {
    // Custom UI avec pinView, cardContainerView, propertyImageView, etc.
}
```

**Note**: Ce fichier contient l'approche UIKit (MKAnnotationView) mais nous utilisons l'approche SwiftUI pure dans PropertyMapView.

---

### 3. **PropertyMapView.swift** (Components/Map) ⭐
**Chemin**: `/EasyCoiOS-Clean/EasyCo/EasyCo/Components/Map/PropertyMapView.swift`

**Composants principaux**:

#### A. **PropertyMapView** (Vue principale multi-propriétés)
```swift
struct PropertyMapView: View {
    let properties: [Property]
    @Binding var selectedPropertyId: UUID?

    // Fonctionnalités:
    // - Affiche toutes les propriétés sur la carte
    // - Markers personnalisés avec sélection
    // - Contrôles de zoom
    // - Centrage automatique
}
```

**Usage**:
```swift
PropertyMapView(
    properties: viewModel.properties,
    selectedPropertyId: $selectedPropertyId
)
.frame(height: 600)
```

#### B. **PropertyMapMarker** (Marker personnalisé)
```swift
private struct PropertyMapMarker: View {
    let property: Property
    let isSelected: Bool
    let action: () -> Void

    // Affiche:
    // - Pin circulaire avec icône
    // - Card avec image/prix quand sélectionné
    // - Animations de scale et couleur
}
```

**États visuels**:
- **Normal**: Pin orange (Theme.ResidentColors._400), taille 40x40
- **Sélectionné**: Pin orange foncé (_600), scale 1.25, shadow augmentée
- **Card**: Apparaît au-dessus du pin quand sélectionné

#### C. **PropertyMarkerCard** (Card d'info)
```swift
private struct PropertyMarkerCard: View {
    let property: Property

    // Contient:
    // - Image de propriété (120x60)
    // - Badge de prix (capsule blanche)
    // - Triangle pointer
}
```

**Design matching web app**:
- Taille: 124x~90px
- Border radius: Theme.CornerRadius.lg
- Shadow: 8px blur, 4px offset
- Triangle: 16x8px pointant vers le pin

#### D. **SinglePropertyMapView** (Vue propriété unique)
```swift
struct SinglePropertyMapView: View {
    let property: Property

    // Fonctionnalités:
    // - Zoom plus proche (latitudeDelta: 0.01)
    // - Pin unique plus grand (50x50)
    // - Card info toujours visible sous le pin
}
```

**Usage**:
```swift
SinglePropertyMapView(property: property)
    .frame(height: 400)
```

#### E. **MapControlButton** (Boutons de contrôle)
```swift
private struct MapControlButton: View {
    let icon: String
    let action: () -> Void

    // Boutons:
    // - Plus (+) : Zoom in
    // - Moins (-) : Zoom out
    // - Location (⊙) : Recentrer
}
```

**Position**: Top-right overlay sur la carte

---

## 🎨 Design Tokens utilisés

### Couleurs
```swift
// Pins
Theme.ResidentColors._400  // Normal state
Theme.ResidentColors._600  // Selected state
Theme.ResidentColors._700  // Price text

// Backgrounds
Color.white                 // Card background
Color.white.opacity(0.95)  // Price badge background

// Grays
Theme.GrayColors._200      // Placeholder image
Theme.GrayColors._300      // Placeholder icon
Theme.GrayColors._400      // Placeholder icon color
```

### Tailles
```swift
// Pin
40x40 (normal)
50x50 (scale 1.25 when selected)

// Card
124x~90 (width x height)

// Image
120x60 (dans la card)

// Controls
40x40 (boutons de zoom)
```

### Animations
```swift
Theme.Animations.spring    // Scale effects, transitions
Theme.Animations.base      // Tap feedback
```

### Spacing
```swift
Theme.Spacing._2   // Card internal padding
Theme.Spacing._3   // Control buttons spacing
Theme.Spacing._4   // Control buttons container padding
```

### Corner Radius
```swift
Theme.CornerRadius.lg   // Card corners
Theme.CornerRadius.md   // Property image corners
```

---

## 🔄 Intégration dans PropertiesListView

### Étape 1: Ajouter un toggle Map/List

Dans `PropertiesViewModel.swift`:
```swift
@Published var viewMode: ViewMode = .list

enum ViewMode {
    case list
    case map
}
```

### Étape 2: Ajouter le toggle dans la barre de filtres

```swift
// Dans filtersAndSortBar
Picker("View Mode", selection: $viewModel.viewMode) {
    Label("Liste", systemImage: "list.bullet").tag(ViewMode.list)
    Label("Carte", systemImage: "map").tag(ViewMode.map)
}
.pickerStyle(.segmented)
.frame(width: 140)
```

### Étape 3: Affichage conditionnel

```swift
if viewModel.viewMode == .list {
    propertiesGrid
} else {
    PropertyMapView(
        properties: viewModel.properties,
        selectedPropertyId: $selectedPropertyId
    )
    .frame(height: 700)
    .cornerRadius(Theme.CornerRadius._3xl)
}
```

---

## 📊 Données requises

### Property Model
```swift
struct Property {
    // Coordonnées (OBLIGATOIRES pour la carte)
    var latitude: Double?
    var longitude: Double?

    // Adresse
    var address: String?
    var city: String
    var postalCode: String?

    // Image
    var mainImageURL: String?

    // Prix
    var monthlyRent: Int
}
```

### Gestion des propriétés sans coordonnées
```swift
// Filter properties with coordinates
let propertiesWithCoordinates = properties.filter { $0.latitude != nil && $0.longitude != nil }

// Or show warning
if propertiesWithCoordinates.isEmpty {
    Text("Aucune propriété avec coordonnées disponibles")
}
```

---

## 🎯 Comparaison Web App vs iOS

| Fonctionnalité | Web App (Google Maps) | iOS App (MapKit) | Status |
|---|---|---|---|
| **Library** | @vis.gl/react-google-maps | Native MapKit | ✅ |
| **Markers customisés** | AdvancedMarker + HTML | MapAnnotation + SwiftUI | ✅ |
| **Clustering** | ❌ Non utilisé | ❌ Non implémenté | ✅ Match |
| **InfoWindow** | InfoWindow component | PropertyMarkerCard | ✅ |
| **Zoom controls** | Default UI | Custom MapControlButton | ✅ |
| **Center calculation** | Moyenne coordonnées | LocationUtilities.calculateCenter | ✅ |
| **Tap interaction** | onClick handler | Button action | ✅ |
| **Card with image** | PropertyMarkerCard.tsx | PropertyMarkerCard | ✅ |
| **Glassmorphism** | backdrop-blur CSS | ❌ Non trivial sur MapKit | ⚠️ |
| **Drawing tools** | MapDrawingControls | ❌ Non implémenté | ⏳ Future |
| **Places autocomplete** | Google Places API | ❌ Non implémenté | ⏳ Future |

---

## 🚀 Fonctionnalités futures

### Phase 2
- [ ] **Clustering** des markers quand nombreux
- [ ] **Search by location** avec autocomplete
- [ ] **Filter by proximity** (cercle de rayon)
- [ ] **Heat map** des prix par zone

### Phase 3
- [ ] **Drawing tools** (cercle, rectangle, polygone)
- [ ] **Route calculation** vers les propriétés
- [ ] **Nearby POIs** (métro, écoles, etc.)
- [ ] **Street View** (Apple Look Around)

---

## 💡 Tips d'utilisation

### Performance
```swift
// Limiter le nombre de markers affichés
let displayedProperties = properties.prefix(100)

// Ou filter par bounds visible
extension MKCoordinateRegion {
    func contains(_ coordinate: CLLocationCoordinate2D) -> Bool {
        // Implementation
    }
}
```

### Accessibilité
```swift
// Ajouter VoiceOver labels
.accessibilityLabel("Propriété à \(property.city)")
.accessibilityHint("Double tap pour voir les détails")
```

### Tests
```swift
// Mock properties avec coordonnées
let testProperty = Property(
    ...
    latitude: 50.8503,
    longitude: 4.3517
)
```

---

## 🐛 Problèmes connus

### 1. Annotations SwiftUI vs UIKit
**Problème**: MapKit SwiftUI ne supporte pas bien les animations complexes sur les annotations.

**Solution**: Utiliser MapAnnotation avec des vues SwiftUI simples. Pour animations avancées, considérer UIViewRepresentable avec MKAnnotationView.

### 2. Image loading performance
**Problème**: AsyncImage peut être lent pour charger les images des cards.

**Solution**: Implémenter un cache d'images ou utiliser Kingfisher/SDWebImage.

### 3. Memory avec nombreuses propriétés
**Problème**: Afficher 100+ markers peut impacter la performance.

**Solution**: Implémenter pagination/clustering ou limiter à 50 markers max.

---

## 📝 Documentation complémentaire

- [Apple MapKit Documentation](https://developer.apple.com/documentation/mapkit/)
- [SwiftUI Map](https://developer.apple.com/documentation/mapkit/map)
- [Core Location](https://developer.apple.com/documentation/corelocation/)
- [Web App Google Maps Implementation](../components/SafePropertyMap.tsx)

---

**Dernière mise à jour**: 17 novembre 2025
**Version**: 1.0.0
**Auteur**: EasyCo Team
