# EasyCo iOS - Guide d'Intégration Backend

## 📋 Table des Matières

1. [Architecture Réseau](#architecture-réseau)
2. [Configuration](#configuration)
3. [Services Créés](#services-créés)
4. [ViewModels](#viewmodels)
5. [Intégration dans les Vues](#intégration-dans-les-vues)
6. [WebSocket en Temps Réel](#websocket-en-temps-réel)
7. [Gestion des Erreurs](#gestion-des-erreurs)
8. [Tests](#tests)

---

## 🏗 Architecture Réseau

### Fichiers Créés

#### Core/Networking/
- **`NetworkManager.swift`** (400 lignes)
  - Singleton gérant toutes les requêtes HTTP
  - Support async/await ET Combine
  - Gestion automatique du token d'authentification
  - Timeout configurables (30s request, 60s resource)
  - Retry logic avec gestion de la connectivité
  - Décodage JSON automatique (snake_case → camelCase)
  - Gestion des erreurs HTTP (200-599)

- **`APIEndpoints.swift`** (700+ lignes)
  - Tous les endpoints API définis comme structs
  - Protocol `NetworkRequest` typé
  - Support des query parameters, headers, body
  - DTOs pour création/mise à jour
  - Response models typés

- **`WebSocketManager.swift`** (350 lignes)
  - WebSocket manager pour temps réel
  - Auto-reconnection exponentielle (max 5 tentatives)
  - Ping/Pong keep-alive (30s interval)
  - Publisher Combine pour messages entrants
  - Support token authentication via query param

#### Core/Services/
- **`AuthService.swift`** (200 lignes)
  - Login/Register/Logout
  - Token refresh automatique
  - ObservableObject avec `@Published` states
  - Notifications pour changements d'auth

- **`PropertyService.swift`** (100 lignes)
  - CRUD complet des propriétés
  - Filtres et pagination
  - Swipe actions avec détection de match

- **`MessagingService.swift`** (120 lignes)
  - Gestion conversations et messages
  - Compteur unread
  - Mark as read
  - Intégration WebSocket

---

## ⚙️ Configuration

### 1. Variables d'Environnement

Ajoutez à votre `Info.plist` ou scheme :

```xml
<key>API_BASE_URL</key>
<string>https://api.easyco.fr/v1</string>

<key>WS_BASE_URL</key>
<string>wss://api.easyco.fr/ws</string>
```

Ou configurez via Xcode Scheme → Arguments → Environment Variables :
- `API_BASE_URL` : `https://api.easyco.fr/v1`
- `WS_BASE_URL` : `wss://api.easyco.fr/ws`

### 2. App Transport Security

Si votre API est en HTTP (dev seulement), ajoutez à `Info.plist` :

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

⚠️ **Production:** Utilisez HTTPS uniquement !

---

## 🔌 Services Créés

### AuthService

```swift
// Singleton accessible partout
let authService = AuthService.shared

// Login
Task {
    try await authService.login(
        email: "user@example.com",
        password: "password123"
    )

    // User is now authenticated
    if let user = authService.currentUser {
        print("Logged in as \(user.firstName)")
    }
}

// Register
Task {
    try await authService.register(
        email: "new@example.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        role: .searcher
    )
}

// Logout
Task {
    await authService.logout()
}

// Check auth state
authService.$isAuthenticated
    .sink { isAuth in
        if isAuth {
            // Show main app
        } else {
            // Show login
        }
    }
    .store(in: &cancellables)
```

### PropertyService

```swift
let propertyService = PropertyService.shared

// Get properties with filters
Task {
    let response = try await propertyService.getProperties(
        page: 1,
        limit: 20,
        filters: PropertyFilters(
            minPrice: 500,
            maxPrice: 1500,
            propertyType: .apartment,
            bedrooms: 2
        )
    )

    print("Found \(response.total) properties")
    print("Page \(response.page) of \(response.totalPages)")
}

// Get single property
Task {
    let property = try await propertyService.getProperty(id: "123")
}

// Swipe property
Task {
    let response = try await propertyService.swipeProperty(
        id: "123",
        direction: .right
    )

    if response.isMatch {
        print("It's a match! 🎉")
    }
}
```

### MessagingService

```swift
let messagingService = MessagingService.shared

// Get conversations
Task {
    let conversations = try await messagingService.getConversations()
}

// Send message
Task {
    let message = try await messagingService.sendMessage(
        conversationId: "conv-123",
        text: "Hello!"
    )
}

// Observe unread count
messagingService.$unreadCount
    .sink { count in
        // Update badge
    }
    .store(in: &cancellables)
```

---

## 🧩 ViewModels

### Créés

1. **PropertiesViewModel** - Liste des propriétés avec filtres et pagination
2. **SwipeViewModel** - Swipe cards avec détection de match
3. **ConversationsViewModel** - Liste des conversations
4. **ConversationViewModel** - Messages d'une conversation avec WebSocket

### Exemple d'Utilisation

```swift
struct PropertiesListView: View {
    @StateObject private var viewModel = PropertiesViewModel()

    var body: some View {
        ScrollView {
            if viewModel.isLoading {
                LoadingStateView(message: "Chargement...")
            } else if let error = viewModel.error {
                ErrorStateView(error: error) {
                    Task { await viewModel.refresh() }
                }
            } else {
                ForEach(viewModel.properties) { property in
                    PropertyCard(property: property)
                        .task {
                            // Pagination automatique
                            await viewModel.loadMoreIfNeeded(currentProperty: property)
                        }
                }
            }
        }
        .task {
            await viewModel.loadProperties()
        }
        .refreshable {
            await viewModel.refresh()
        }
    }
}
```

---

## 🔄 Intégration dans les Vues

### Étape 1: Ajouter ViewModel

```swift
// Avant (mock data)
struct MyView: View {
    let properties: [Property] = Property.mockData
}

// Après (API data)
struct MyView: View {
    @StateObject private var viewModel = PropertiesViewModel()
}
```

### Étape 2: Gérer les États

```swift
var body: some View {
    ZStack {
        if viewModel.isLoading && viewModel.properties.isEmpty {
            LoadingStateView(message: "Chargement...")
        } else if let error = viewModel.error, viewModel.properties.isEmpty {
            ErrorStateView(error: error) {
                Task { await viewModel.refresh() }
            }
        } else if viewModel.properties.isEmpty {
            EmptyStateView(
                icon: "home",
                title: "Aucune propriété",
                message: "Aucune propriété ne correspond à vos critères"
            )
        } else {
            // Content
            contentView
        }
    }
}
```

### Étape 3: Charger les Données

```swift
.task {
    await viewModel.loadProperties()
}
.refreshable {
    await viewModel.refresh()
}
```

### Étape 4: Pagination

```swift
ForEach(viewModel.properties) { property in
    PropertyCard(property: property)
        .task {
            await viewModel.loadMoreIfNeeded(currentProperty: property)
        }
}
```

---

## 🔴 WebSocket en Temps Réel

### Connexion

```swift
// Dans AppDelegate ou SceneDelegate
let webSocketManager = WebSocketManager.shared

// Observer l'état d'authentification
NotificationCenter.default.addObserver(
    forName: .userDidLogin,
    object: nil,
    queue: .main
) { _ in
    webSocketManager.connect()
}

NotificationCenter.default.addObserver(
    forName: .userDidLogout,
    object: nil,
    queue: .main
) { _ in
    webSocketManager.disconnect()
}
```

### Recevoir des Messages

```swift
class ConversationViewModel: ObservableObject {
    private var cancellables = Set<AnyCancellable>()

    init() {
        WebSocketManager.shared.messagePublisher
            .sink { wsMessage in
                switch wsMessage.type {
                case .message:
                    if let message = wsMessage.data?.message {
                        self.handleNewMessage(message)
                    }

                case .typing:
                    if let isTyping = wsMessage.data?.isTyping {
                        self.isTyping = isTyping
                    }

                case .matchCreated:
                    if let match = wsMessage.data?.match {
                        self.handleMatchCreated(match)
                    }

                default:
                    break
                }
            }
            .store(in: &cancellables)
    }
}
```

### Envoyer des Événements

```swift
// Typing indicator
webSocketManager.sendTypingIndicator(
    conversationId: "conv-123",
    isTyping: true
)

// Subscribe to conversation
webSocketManager.subscribeToMessages(conversationId: "conv-123")
```

---

## ⚠️ Gestion des Erreurs

### APIError → AppError

Le système convertit automatiquement les erreurs réseau en `AppError` pour l'UI :

```swift
catch let apiError as APIError {
    viewModel.error = apiError.toAppError
}
```

### Types d'Erreurs

```swift
enum APIError {
    case invalidURL
    case requestFailed(Error)
    case invalidResponse
    case decodingError(Error)
    case serverError(statusCode: Int, message: String?)
    case unauthorized          // 401 → Force logout
    case notFound             // 404
    case networkUnavailable   // No internet
    case timeout
    case unknown
}

enum AppError {
    case network    // No internet - "Pas de connexion internet"
    case server     // Server error - "Erreur serveur"
    case notFound   // Not found - "Ressource non trouvée"
    case unauthorized // Auth error - "Non autorisé"
}
```

### Affichage dans l'UI

```swift
// Utilisez ErrorStateView créé en Phase 8
ErrorStateView(error: viewModel.error) {
    Task {
        await viewModel.retry()
    }
}

// Ou ToastView pour erreurs non-critiques
ToastView(
    type: .error,
    message: error.errorDescription ?? "Erreur"
)
```

---

## 🧪 Tests

### Unit Tests - ViewModels

```swift
import XCTest
@testable import EasyCo

@MainActor
class PropertiesViewModelTests: XCTestCase {
    var viewModel: PropertiesViewModel!

    override func setUp() {
        super.setUp()
        viewModel = PropertiesViewModel()
    }

    func testLoadProperties() async throws {
        await viewModel.loadProperties()

        XCTAssertFalse(viewModel.isLoading)
        XCTAssertFalse(viewModel.properties.isEmpty)
        XCTAssertNil(viewModel.error)
    }

    func testPagination() async throws {
        await viewModel.loadProperties()
        let firstCount = viewModel.properties.count

        viewModel.currentPage = 2
        await viewModel.loadProperties()

        XCTAssertGreaterThan(viewModel.properties.count, firstCount)
    }
}
```

### UI Tests - Flows

```swift
func testLoginFlow() throws {
    let app = XCUIApplication()
    app.launch()

    let emailField = app.textFields["email_field"]
    emailField.tap()
    emailField.typeText("test@example.com")

    let passwordField = app.secureTextFields["password_field"]
    passwordField.tap()
    passwordField.typeText("password123")

    app.buttons["Se connecter"].tap()

    // Wait for navigation
    let homeTitle = app.staticTexts["Accueil"]
    XCTAssertTrue(homeTitle.waitForExistence(timeout: 5))
}
```

---

## 📝 Checklist d'Intégration

### Phase 1: Configuration (✅ FAIT)
- [x] NetworkManager créé
- [x] APIEndpoints définis
- [x] Services créés (Auth, Property, Messaging)
- [x] WebSocket manager
- [x] ViewModels exemples

### Phase 2: Authentification
- [ ] Intégrer AuthService dans LoginView
- [ ] Intégrer AuthService dans RegisterView
- [ ] Gérer le flow de navigation (logged in/out)
- [ ] Persister l'utilisateur au démarrage
- [ ] Gérer le refresh token automatique

### Phase 3: Properties
- [ ] Remplacer mock data dans PropertiesListView
- [ ] Connecter FiltersView au ViewModel
- [ ] Implémenter pagination infinie
- [ ] Gérer le cache local (optionnel)

### Phase 4: Swipe
- [ ] Intégrer SwipeViewModel dans SwipeView
- [ ] Connecter swipe actions à l'API
- [ ] Afficher match celebration sur réponse API

### Phase 5: Messages
- [ ] Intégrer ConversationsViewModel
- [ ] Intégrer ConversationViewModel
- [ ] Connecter WebSocket au démarrage
- [ ] Gérer typing indicators
- [ ] Implémenter message read receipts

### Phase 6: Dashboards
- [ ] Créer DashboardViewModels (Searcher/Owner/Resident)
- [ ] Charger analytics depuis API
- [ ] Mettre à jour les charts avec vraies données

### Phase 7: Applications & Visits
- [ ] Connecter application form à l'API
- [ ] Charger application status depuis API
- [ ] Connecter visit scheduler
- [ ] Gérer les reviews

### Phase 8: Polish
- [ ] Implémenter retry automatique sur erreur réseau
- [ ] Ajouter offline mode avec Core Data
- [ ] Optimiser images avec cache (Kingfisher)
- [ ] Ajouter analytics tracking

---

## 🚀 Prochaines Étapes Recommandées

1. **Tester l'Architecture** (30 min)
   - Lancer l'app
   - Vérifier que les requêtes se font (Network Inspector)
   - Tester login/logout

2. **Intégrer Auth Flow** (2h)
   - LoginView + AuthService
   - Navigation conditionnelle
   - Token persistence

3. **Intégrer Properties** (2h)
   - PropertiesListView + ViewModel
   - FiltersView
   - Pagination

4. **Intégrer Messaging** (2h)
   - ConversationsListView
   - ConversationView + WebSocket
   - Real-time messages

5. **Dashboards** (2h)
   - ViewModels pour chaque dashboard
   - Charger analytics
   - Refresh périodique

**Total estimé:** 6-8 heures pour intégration complète

---

## 📚 Ressources

### Documentation Apple
- [URLSession](https://developer.apple.com/documentation/foundation/urlsession)
- [Codable](https://developer.apple.com/documentation/swift/codable)
- [Combine](https://developer.apple.com/documentation/combine)
- [async/await](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)

### Best Practices
- MVVM avec SwiftUI
- Error handling
- Network layer architecture
- WebSocket reconnection strategies

---

**Dernière mise à jour:** 2 décembre 2025
**Status:** Architecture backend complète ✅
**Prochaine étape:** Intégration dans les vues existantes
