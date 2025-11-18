# Prompt pour Claude Code - Workstream RESIDENT

Bonjour ! Tu vas travailler sur le développement de l'application iOS native EasyCo, spécifiquement sur le **rôle RESIDENT** (résident en colocation).

## 📋 Contexte du Projet

EasyCo est une plateforme de coliving qui existe en version web (https://easyco-onboarding.vercel.app/). Nous créons maintenant une application iOS native en SwiftUI qui réplique toutes les fonctionnalités de la web app.

Le projet est divisé en **3 workstreams parallèles** :
- **Searcher** (chercheur de logement) - Orange #FFA040
- **Resident** (résident actuel) - Coral #E8865D ← **TON RÔLE**
- **Owner** (propriétaire) - Purple #6E56CF

## 🎯 Ta Mission

Tu es responsable de développer **toutes les fonctionnalités du rôle RESIDENT**.

### Persona Resident
- Utilisateur déjà en colocation
- Gère sa vie quotidienne avec ses colocataires
- A besoin d'outils pour : tâches ménagères, dépenses partagées, événements, communication

### Couleur Principale
**Coral #E8865D** - À utiliser partout dans ton interface

## 📚 Documentation à Lire

**AVANT DE COMMENCER, lis attentivement :**

1. **PLAN_DEVELOPPEMENT_IOS.md** - Le plan complet du projet
   - Lis TOUTE la section "WORKSTREAM 2 : RESIDENT"
   - Lis aussi "COMPOSANTS PARTAGÉS" (car tu en auras besoin)
   - Lis "Phase 2 : Design" pour comprendre les attentes visuelles

2. **Web App de Référence**
   - Va sur https://easyco-onboarding.vercel.app/
   - Crée un compte et choisis le rôle "Resident"
   - Explore TOUTES les fonctionnalités disponibles
   - Prends des screenshots pour référence
   - Note les interactions, animations, comportements

## 🚀 Par Où Commencer

### Étape 1 : Exploration du Code Existant

Familiarise-toi avec la structure du projet :

```
EasyCoiOS-Clean/EasyCo/EasyCo/
├── Models/               # Modèles de données
│   ├── User.swift       ✅ Existe
│   ├── Property.swift   ✅ Existe
│   └── ...
├── Core/                # Services partagés
│   ├── Auth/           ✅ AuthManager existe
│   ├── Network/        ✅ APIClient existe
│   └── Storage/        ✅ Existe
├── Features/
│   ├── Resident/
│   │   ├── ResidentHubView.swift    ✅ Existe (basique)
│   │   └── TasksView.swift          ✅ Existe (basique)
│   └── ...
└── Components/         # Composants UI réutilisables
    ├── Common/         ✅ Existent
    └── Custom/         ✅ Existent
```

### Étape 2 : Ordre de Développement STRICT

**Tu DOIS suivre cet ordre pour éviter les blocages :**

#### Sprint 1 : Hub du Résident (2.1)
C'est la page d'accueil des résidents, le dashboard central.

**Tâches :**
1. Lire le fichier existant `Features/Resident/ResidentHubView.swift`
2. Regarder la web app pour voir à quoi doit ressembler le Hub
3. Implémenter :
   - Dashboard centralisé avec widgets
   - Informations du logement actuel
   - Raccourcis vers Tâches, Dépenses, Événements
   - Tâches à faire aujourd'hui
   - Balance des dépenses
   - Prochains événements

**Fichiers à créer/modifier :**
- `Features/Resident/ResidentHubView.swift` (améliorer)
- `Features/Resident/ResidentHubViewModel.swift` (créer)
- `Models/Household.swift` (créer)
- `Models/Lease.swift` (créer)

#### Sprint 2 : Système de Tâches Partagées (2.2) - PRIORITÉ CRITIQUE
C'est la fonctionnalité LA PLUS IMPORTANTE pour les résidents.

**Tâches :**
1. Créer le modèle `ResidentTask` (ne pas confondre avec le `Task` Swift!)
2. Implémenter la liste des tâches
3. Créer/éditer des tâches
4. Système de rotation automatique
5. Compléter des tâches avec photo de preuve
6. Notifications et rappels

**Fichiers à créer/modifier :**
- `Models/ResidentTask.swift` (créer)
- `Features/Resident/TasksView.swift` (améliorer considérablement)
- `Features/Resident/TasksViewModel.swift` (créer)
- `Features/Resident/CreateTaskView.swift` (créer)
- `Features/Resident/TaskRotationSettingsView.swift` (créer)
- `Features/Resident/TaskStatsView.swift` (créer)

**API à implémenter :**
```swift
// Dans Core/Network/APIEndpoint.swift
case getTasks(filter: TaskFilter)
case createTask(TaskData)
case updateTask(id: UUID, TaskData)
case completeTask(id: UUID, proof: Data?)
case deleteTask(id: UUID)
case getTaskStats(householdId: UUID)
case setupRotation(RotationConfig)
```

#### Sprint 3 : Gestion des Dépenses Partagées (2.3) - PRIORITÉ CRITIQUE

**Tâches :**
1. Créer le système de dépenses
2. Ajouter une dépense avec reçu
3. Répartition égale ou personnalisée
4. Calcul automatique des remboursements ("qui doit combien à qui")
5. Graphiques de dépenses
6. Budget par catégorie

**Fichiers à créer :**
- `Models/Expense.swift`
- `Features/Resident/ExpensesView.swift`
- `Features/Resident/ExpensesViewModel.swift`
- `Features/Resident/AddExpenseView.swift`
- `Features/Resident/BalanceView.swift`
- `Features/Resident/ExpenseStatsView.swift`

#### Sprint 4 : Calendrier et Événements (2.4)

**Tâches :**
1. Calendrier partagé de la colocation
2. Créer des événements
3. Gestion des invités
4. RSVP
5. Notifications

**Fichiers à créer :**
- `Models/Event.swift`
- `Features/Resident/CalendarView.swift`
- `Features/Resident/CreateEventView.swift`
- `Features/Resident/EventDetailView.swift`

#### Sprint 5 : Messages et Communication (2.5)

**Tâches :**
1. Chat de groupe de la colocation
2. Messages avec le propriétaire
3. Annonces importantes

**Fichiers à créer :**
- `Features/Messages/GroupChatView.swift`
- `Features/Messages/AnnouncementsView.swift`
- `Core/WebSocket/MessageWebSocketManager.swift`

#### Sprint 6 : Fonctionnalités Secondaires (2.6, 2.7)
- Règles de vie commune
- Documents partagés
- Profil et paramètres

## 🎨 Guidelines de Design

### Couleurs
```swift
// Ta couleur principale
Color(hex: "E8865D") // Coral - utilise partout

// Couleurs complémentaires
Color(hex: "F9FAFB") // Background
Color(hex: "111827") // Texte principal
Color(hex: "6B7280") // Texte secondaire
Color(hex: "10B981") // Success
Color(hex: "EF4444") // Danger
```

### Typographie
```swift
// Titres
.font(.system(size: 24, weight: .bold))

// Sous-titres
.font(.system(size: 18, weight: .semibold))

// Corps
.font(.system(size: 16))

// Secondaire
.font(.system(size: 14))

// Small
.font(.system(size: 12))
```

### Espacements
```swift
Theme.Spacing.xs   // 4px
Theme.Spacing.sm   // 8px
Theme.Spacing.md   // 12px
Theme.Spacing.lg   // 16px
Theme.Spacing.xl   // 24px
```

### Coins Arrondis
```swift
.cornerRadius(16)  // Cards
.cornerRadius(12)  // Petits éléments
.cornerRadius(999) // Pills/Boutons
```

## 📝 Conventions de Code

### Nommage
```swift
// Vues
struct ResidentHubView: View { }
struct TasksView: View { }

// ViewModels
class ResidentHubViewModel: ObservableObject { }

// Modèles
struct ResidentTask: Identifiable { }
struct Expense: Identifiable { }

// Variables en camelCase
var isLoading: Bool
var tasksList: [ResidentTask]
```

### Architecture MVVM
```swift
// Vue
struct TasksView: View {
    @StateObject private var viewModel = TasksViewModel()

    var body: some View {
        // UI uniquement
    }
}

// ViewModel
class TasksViewModel: ObservableObject {
    @Published var tasks: [ResidentTask] = []
    @Published var isLoading = false
    @Published var error: String?

    func loadTasks() async {
        // Logique ici
    }
}
```

### Gestion des erreurs
```swift
do {
    try await apiCall()
} catch {
    errorMessage = error.localizedDescription
    showError = true
}
```

### Mode Démo
```swift
if AppConfig.FeatureFlags.demoMode {
    try? await _Concurrency.Task.sleep(nanoseconds: 500_000_000)
    tasks = ResidentTask.mockTasks
} else {
    tasks = try await APIClient.shared.getTasks()
}
```

## ⚠️ Points d'Attention CRITIQUES

### 1. Conflit de Nommage avec `Task`
Swift a déjà un type `Task` pour la concurrence. **TU DOIS ABSOLUMENT** :

```swift
// ❌ NE FAIS PAS ça
struct Task { } // Conflit!

// ✅ FAIS ça
struct ResidentTask: Identifiable {
    let id: UUID
    let title: String
    // ...
}

// Pour les tâches async
_Concurrency.Task {
    await something()
}
```

### 2. Navigation
```swift
// Utilise NavigationStack (pas NavigationView - déprécié)
NavigationStack {
    List {
        // ...
    }
}
```

### 3. Async/Await
```swift
// Dans une Vue
.task {
    await viewModel.loadData()
}

// Dans un Button
Button("Action") {
    _Concurrency.Task {
        await viewModel.doSomething()
    }
}
```

### 4. Images et Assets
```swift
// Pour upload d'images
import PhotosUI

// Pour affichage
AsyncImage(url: URL(string: imageUrl)) { phase in
    switch phase {
    case .success(let image):
        image.resizable()
    case .failure(_):
        placeholderImage
    case .empty:
        ProgressView()
    @unknown default:
        EmptyView()
    }
}
```

## 🧪 Testing en Mode Démo

Toutes tes fonctionnalités DOIVENT fonctionner en mode démo avec des données mockées :

```swift
// Dans ResidentTask.swift
extension ResidentTask {
    static let mockTasks: [ResidentTask] = [
        ResidentTask(
            id: UUID(),
            title: "Sortir les poubelles",
            assignee: "Marie",
            dueDate: Date(),
            isCompleted: false,
            category: .cleaning,
            isRecurring: true,
            recurringDays: [.tuesday, .friday]
        ),
        // ... plus de mocks
    ]
}
```

## 📊 Checklist de Complétion

Avant de considérer une fonctionnalité terminée :

- [ ] Le code compile sans erreurs
- [ ] Ça fonctionne en mode démo avec mock data
- [ ] L'UI ressemble à la web app (couleurs, espacements, typo)
- [ ] Les loading states sont gérés
- [ ] Les error states sont gérés
- [ ] Les empty states sont gérés
- [ ] La navigation fonctionne
- [ ] Pas de crashs
- [ ] Testé sur simulateur iPhone 15 Pro
- [ ] Code commenté en français

## 🤝 Communication avec les Autres Workstreams

### Composants que tu peux UTILISER (déjà créés)
- `CustomButton` - Boutons stylisés
- `LoadingView` - Écran de chargement
- `EmptyStateView` - État vide
- `ErrorView` - État d'erreur
- `Theme` - Couleurs et espacements
- `AuthManager` - Gestion auth
- `APIClient` - Appels API

### Composants que tu dois PARTAGER (si tu les crées)
Si tu crées des composants réutilisables, mets-les dans :
- `Components/Common/` - Si utilisable par tous
- `Components/Custom/` - Si spécifique mais réutilisable

### Modèles Partagés
Coordonne-toi pour ces modèles utilisés par plusieurs rôles :
- `User.swift` - Déjà existe
- `Message.swift` - Partagé avec Searcher et Owner
- `Conversation.swift` - Partagé avec tous

## 🚀 Comment Démarrer

### Commande Initiale
```bash
cd /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo
open EasyCo.xcodeproj
```

### Premier Sprint - Hub du Résident

1. **Lis le plan complet** : `PLAN_DEVELOPPEMENT_IOS.md` section Resident

2. **Explore la web app** : https://easyco-onboarding.vercel.app/ en mode Resident

3. **Regarde le code existant** :
```bash
# Ouvre ces fichiers dans Xcode
Features/Resident/ResidentHubView.swift
Features/Resident/TasksView.swift
Models/User.swift
```

4. **Commence par le Hub** :
   - Crée `ResidentHubViewModel.swift`
   - Améliore `ResidentHubView.swift`
   - Crée les modèles nécessaires (`Household.swift`, `Lease.swift`)

5. **Build et test** :
   - Cmd+B pour build
   - Cmd+R pour run
   - Test sur simulateur

## 📞 Questions Fréquentes

**Q : Je ne trouve pas un composant, que faire ?**
A : Vérifie d'abord dans `Components/`, sinon crée-le et mets-le là.

**Q : Comment tester sans backend ?**
A : Utilise `AppConfig.FeatureFlags.demoMode = true` et crée des mocks.

**Q : Un modèle existe déjà mais il manque des champs ?**
A : Ajoute les champs nécessaires, mais vérifie que ça ne casse pas les autres workstreams.

**Q : J'ai une erreur de compilation sur `Task` ?**
A : Utilise `ResidentTask` pour ton modèle et `_Concurrency.Task` pour async.

**Q : Comment gérer les couleurs ?**
A : Utilise `Color(hex: "E8865D")` pour ton coral principal.

## ✅ Checklist Avant de Commencer

- [ ] J'ai lu `PLAN_DEVELOPPEMENT_IOS.md` section Resident
- [ ] J'ai exploré la web app en mode Resident
- [ ] J'ai compris le système de couleurs (Coral #E8865D)
- [ ] J'ai ouvert le projet Xcode
- [ ] Je peux build sans erreurs
- [ ] Je comprends l'architecture MVVM
- [ ] Je sais comment éviter le conflit avec `Task`
- [ ] Je commence par le Hub (2.1) puis les Tâches (2.2)

---

**Bonne chance ! 🚀**

Tu vas créer une expérience incroyable pour les résidents en colocation. Concentre-toi sur la simplicité d'utilisation et la clarté visuelle.

Si tu es bloqué, relis le `PLAN_DEVELOPPEMENT_IOS.md` ou pose des questions spécifiques.
