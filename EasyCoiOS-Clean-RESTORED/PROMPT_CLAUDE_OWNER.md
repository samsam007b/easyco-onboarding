# Prompt pour Claude Code - Workstream OWNER

Bonjour ! Tu vas travailler sur le développement de l'application iOS native EasyCo, spécifiquement sur le **rôle OWNER** (propriétaire).

## 📋 Contexte du Projet

EasyCo est une plateforme de coliving qui existe en version web (https://easyco-onboarding.vercel.app/). Nous créons maintenant une application iOS native en SwiftUI qui réplique toutes les fonctionnalités de la web app.

Le projet est divisé en **3 workstreams parallèles** :
- **Searcher** (chercheur de logement) - Orange #FFA040
- **Resident** (résident actuel) - Coral #E8865D
- **Owner** (propriétaire) - Purple #6E56CF ← **TON RÔLE**

## 🎯 Ta Mission

Tu es responsable de développer **toutes les fonctionnalités du rôle OWNER**.

### Persona Owner
- Propriétaire qui loue des logements en colocation
- Gère plusieurs propriétés simultanément
- Examine des candidatures, communique avec candidats et locataires
- Suit les revenus, dépenses, maintenance

### Couleur Principale
**Purple #6E56CF** - À utiliser partout dans ton interface

## 📚 Documentation à Lire

**AVANT DE COMMENCER, lis attentivement :**

1. **PLAN_DEVELOPPEMENT_IOS.md** - Le plan complet du projet
   - Lis TOUTE la section "WORKSTREAM 3 : OWNER"
   - Lis aussi "COMPOSANTS PARTAGÉS" (car tu en auras besoin)
   - Lis "Phase 2 : Design" pour comprendre les attentes visuelles

2. **Web App de Référence**
   - Va sur https://easyco-onboarding.vercel.app/
   - Crée un compte et choisis le rôle "Owner"
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
│   ├── Property.swift   ✅ Existe (avec PropertyStatus, etc.)
│   └── ...
├── Core/                # Services partagés
│   ├── Auth/           ✅ AuthManager existe
│   ├── Network/        ✅ APIClient existe
│   └── Storage/        ✅ Existe
├── Features/
│   ├── Owner/
│   │   ├── OwnerPropertiesView.swift    ✅ Existe (avec cards)
│   │   └── ApplicationsView.swift       ✅ Existe (basique)
│   └── ...
└── Components/         # Composants UI réutilisables
    ├── Common/         ✅ Existent
    └── Custom/         ✅ Existent
```

### Étape 2 : Ordre de Développement STRICT

**Tu DOIS suivre cet ordre pour éviter les blocages :**

#### Sprint 1 : Gestion des Propriétés (3.1) - PRIORITÉ CRITIQUE

**Vue d'ensemble existante :**
- `OwnerPropertiesView.swift` affiche déjà une liste basique
- Les cards (`OwnerPropertyCard`) existent avec stats (vues, candidatures, favoris)
- Les badges de statut (`StatusBadge`) existent

**Ce que tu dois faire :**

1. **Améliorer le dashboard des propriétés**
   - Filtres par statut (Publiée, Brouillon, Archivée, Louée)
   - Tri (date, prix, candidatures)
   - Statistiques globales en haut
   - Pull to refresh

2. **Créer le formulaire de création de propriété - MULTI-ÉTAPES**

**Fichiers à créer :**
```swift
Features/Owner/CreatePropertyView.swift          // Vue principale
Features/Owner/PropertyFormStep1View.swift       // Infos de base
Features/Owner/PropertyFormStep2View.swift       // Finances
Features/Owner/PropertyFormStep3View.swift       // Équipements
Features/Owner/PropertyFormStep4View.swift       // Photos
Features/Owner/PropertyFormStep5View.swift       // Disponibilité
Features/Owner/CreatePropertyViewModel.swift     // ViewModel
```

**Étape 1 - Infos de base :**
- Titre (TextField)
- Description (TextEditor)
- Type de logement (Picker)
- Adresse avec autocomplete
- Surface en m²
- Nombre de chambres, salles de bain

**Étape 2 - Finances :**
- Loyer mensuel (TextField avec formatter €)
- Charges incluses ? (Toggle)
- Montant des charges si non incluses
- Dépôt de garantie
- Frais d'agence

**Étape 3 - Équipements :**
- Multi-sélection des `PropertyAmenity`
- Disposition en grid avec icônes
- Description de chaque pièce (optionnel)
- Règlement intérieur (TextEditor)

**Étape 4 - Photos :**
- PhotosPicker pour upload multiple
- Preview des images
- Drag & drop pour réorganiser
- Sélectionner photo de couverture
- Compression avant upload

**Étape 5 - Disponibilité :**
- Date de disponibilité (DatePicker)
- Durée min/max du bail
- Préférences de locataires :
  - Âge min/max (Slider)
  - Genre (Any, Homme, Femme)
  - Fumeur accepté ? (Toggle)
  - Animaux acceptés ? (Toggle)

**Progress bar entre les étapes :**
```swift
HStack {
    ForEach(1...5, id: \.self) { step in
        Circle()
            .fill(step <= currentStep ? Color(hex: "6E56CF") : Color.gray.opacity(0.3))
            .frame(width: 12, height: 12)
    }
}
```

3. **Statistiques détaillées par propriété**

**Fichiers à créer :**
```swift
Features/Owner/PropertyStatsView.swift
Features/Owner/PropertyStatsViewModel.swift
```

**Contenu :**
- Graphique de vues (7/30 derniers jours)
- Nombre de favoris
- Nombre de candidatures (par statut)
- Taux de conversion
- Temps moyen avant candidature

**API à implémenter :**
```swift
// Dans Core/Network/APIEndpoint.swift
case getOwnerProperties
case createProperty(PropertyData)
case updateProperty(id: UUID, PropertyData)
case deleteProperty(id: UUID)
case archiveProperty(id: UUID)
case publishProperty(id: UUID)
case getPropertyStats(id: UUID)
case uploadPropertyImages([Data])
```

#### Sprint 2 : Gestion des Candidatures (3.2) - PRIORITÉ CRITIQUE

**Vue existante :**
- `ApplicationsView.swift` existe mais très basique

**Ce que tu dois faire :**

1. **Améliorer la liste des candidatures**
   - Filtrer par propriété (Dropdown)
   - Filtrer par statut (Nouvelle, En examen, Acceptée, Refusée)
   - Badge "NOUVEAU" sur nouvelles candidatures
   - Swipe actions (Accepter, Refuser, Voir détails)
   - Search bar par nom de candidat

2. **Écran de détail d'une candidature**

**Fichiers à créer :**
```swift
Features/Owner/ApplicationDetailView.swift
Features/Owner/ApplicationDetailViewModel.swift
Models/Application.swift                    // Modèle complet
```

**Contenu du détail :**
- Header avec photo de profil du candidat
- Nom, âge, profession
- Si groupe : tous les profils des membres
- Message de motivation
- Documents fournis (téléchargeables)
  - Pièce d'identité
  - Justificatifs de revenus (3 derniers bulletins)
  - Attestation employeur/école
  - Garant si applicable
- Score de solvabilité (calculé ou manuel)
- Notes privées du propriétaire (non visibles par candidat)

**Actions :**
```swift
// Boutons d'action en bas
HStack(spacing: 12) {
    Button("Refuser") { }
        .buttonStyle(.bordered)
        .tint(.red)

    Button("Demander plus d'infos") { }
        .buttonStyle(.bordered)

    Button("Accepter") { }
        .buttonStyle(.borderedProminent)
        .tint(Color(hex: "6E56CF"))
}
```

3. **Gestion des visites**

**Fichiers à créer :**
```swift
Features/Owner/VisitScheduleView.swift
Models/Visit.swift
```

**Fonctionnalités :**
- Proposer un créneau de visite
- Calendrier avec créneaux disponibles
- Confirmer/Annuler rendez-vous
- Notification avant visite (1h avant)
- Notes après visite

**API à implémenter :**
```swift
case getApplications(propertyId: UUID?, status: ApplicationStatus?)
case getApplicationDetail(id: UUID)
case updateApplicationStatus(id: UUID, status: ApplicationStatus, reason: String?)
case requestMoreInfo(applicationId: UUID, message: String)
case scheduleVisit(applicationId: UUID, date: Date)
case cancelVisit(visitId: UUID)
case addNote(applicationId: UUID, note: String)
case downloadDocument(documentId: UUID)
```

#### Sprint 3 : Messagerie Propriétaire (3.3)

**Vue existante :**
- `MessagesListView.swift` existe (partagée avec tous les rôles)

**Ce que tu dois faire :**

1. **Adapter la messagerie pour le propriétaire**
   - Tabs : "Candidats" / "Locataires"
   - Badge de contexte (ex: "Candidature pour Studio Paris 15")
   - Quick replies (templates)

2. **Templates de messages**

**Fichiers à créer :**
```swift
Features/Messages/OwnerChatView.swift
Features/Messages/MessageTemplatesView.swift
Features/Messages/MessageTemplate.swift
```

**Templates prédéfinis :**
```swift
struct MessageTemplate: Identifiable {
    let id: UUID
    let name: String
    let content: String
    let category: TemplateCategory
}

enum TemplateCategory {
    case visitRequest      // "Je vous propose une visite..."
    case politeRefusal     // "Merci pour votre candidature..."
    case documentRequest   // "Pourriez-vous fournir..."
    case rentReminder      // "Rappel : loyer du mois..."
}
```

**UI des templates :**
- Bouton "Templates" dans la barre de chat
- Sheet qui s'ouvre avec liste de templates
- Tap pour insérer le template
- Possibilité de personnaliser avant envoi

#### Sprint 4 : Maintenance (3.4)

**Fichiers à créer :**
```swift
Features/Owner/MaintenanceView.swift
Features/Owner/MaintenanceViewModel.swift
Features/Owner/CreateMaintenanceTaskView.swift
Features/Owner/ContractorsView.swift
Models/MaintenanceTask.swift
Models/Contractor.swift
```

**MaintenanceTask model :**
```swift
struct MaintenanceTask: Identifiable {
    let id: UUID
    let propertyId: UUID
    let title: String
    let description: String
    let category: MaintenanceCategory  // Plomberie, Électricité, etc.
    let priority: Priority              // Urgente, Haute, Normale, Basse
    let status: TaskStatus              // À faire, En cours, Terminée
    let assignedTo: AssignedTo          // Moi, Prestataire, Locataire
    let contractorId: UUID?
    let dueDate: Date?
    let estimatedCost: Double?
    let actualCost: Double?
    let photos: [String]
    let createdAt: Date
    let completedAt: Date?
}

enum MaintenanceCategory {
    case plumbing, electricity, heating, painting, cleaning, other
}

enum AssignedTo {
    case myself, contractor, tenant
}
```

**Vue Maintenance :**
- Liste des tâches groupées par propriété
- Filtres par statut, priorité, propriété
- Quick add avec floating button
- Swipe pour marquer comme terminée
- Statistiques : coût total mensuel/annuel

**Gestion des prestataires :**
- Carnet d'adresses
- Notes et évaluations
- Historique des interventions
- Quick call/SMS

#### Sprint 5 : Statistiques et Revenus (3.5)

**Fichiers à créer :**
```swift
Features/Owner/StatsView.swift
Features/Owner/StatsViewModel.swift
Features/Owner/RevenueView.swift
Features/Owner/ExpensesView.swift
Features/Owner/ReportsView.swift
Models/Revenue.swift
Models/OwnerExpense.swift
```

**Dashboard financier :**

1. **Overview card en haut :**
```swift
VStack(spacing: 8) {
    Text("Revenus ce mois")
        .font(.system(size: 14))
        .foregroundColor(.gray)

    Text("3 450 €")
        .font(.system(size: 32, weight: .bold))
        .foregroundColor(Color(hex: "6E56CF"))

    HStack {
        Image(systemName: "arrow.up.right")
        Text("+12% vs mois dernier")
    }
    .font(.system(size: 12))
    .foregroundColor(.green)
}
```

2. **Graphiques :**
- Revenus mensuels (Bar chart - 12 derniers mois)
- Taux d'occupation (Line chart)
- Répartition des dépenses (Pie chart)

3. **Tableaux :**
- Revenus par propriété
- Loyers payés / en attente ce mois
- Retards de paiement
- Coûts de maintenance

4. **Export de rapports :**
- Période sélectionnable
- Type : Mensuel, Annuel, Personnalisé
- Format : PDF, Excel
- Share sheet natif iOS

**API à implémenter :**
```swift
case getDashboardStats
case getRevenue(from: Date, to: Date)
case getExpenses(from: Date, to: Date)
case getRentPayments(propertyId: UUID?)
case generateReport(type: ReportType, period: Period, format: Format)
```

#### Sprint 6 : Fonctionnalités Secondaires (3.6, 3.7, 3.8)

1. **Gestion des locataires** (3.6)
2. **Documents et contrats** (3.7)
3. **Profil et paramètres** (3.8)

## 🎨 Guidelines de Design

### Couleurs
```swift
// Ta couleur principale
Color(hex: "6E56CF") // Purple - utilise partout

// Gradient pour boutons
LinearGradient(
    colors: [Color(hex: "6E56CF"), Color(hex: "8B5CF6")],
    startPoint: .leading,
    endPoint: .trailing
)

// Couleurs complémentaires
Color(hex: "F9FAFB") // Background
Color(hex: "111827") // Texte principal
Color(hex: "6B7280") // Texte secondaire
Color(hex: "10B981") // Success
Color(hex: "EF4444") // Danger
Color(hex: "FBBF24") // Warning
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

### Cards pour Propriétés
```swift
VStack(alignment: .leading, spacing: 0) {
    // Image
    AsyncImage(url: URL(string: imageUrl))
        .frame(height: 200)
        .cornerRadius(16, corners: [.topLeft, .topRight])

    // Content
    VStack(alignment: .leading, spacing: 12) {
        Text(property.title)
            .font(.system(size: 18, weight: .bold))

        HStack(spacing: 16) {
            StatBadge(icon: "eye.fill", value: "245", color: Color(hex: "6E56CF"))
            StatBadge(icon: "doc.text.fill", value: "12", color: Color(hex: "10B981"))
            StatBadge(icon: "heart.fill", value: "34", color: Color(hex: "EF4444"))
        }

        Divider()

        HStack {
            Text("€\(property.monthlyRent)/mois")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(Color(hex: "6E56CF"))

            Spacer()

            StatusBadge(status: property.status)
        }
    }
    .padding(16)
}
.background(Color.white)
.cornerRadius(16)
.shadow(color: .black.opacity(0.05), radius: 8, x: 0, y: 2)
```

### Badges de Statut (déjà existent dans le code)
```swift
// Utilise StatusBadge existant
StatusBadge(status: .published)   // Vert
StatusBadge(status: .draft)       // Gris
StatusBadge(status: .archived)    // Rouge
StatusBadge(status: .rented)      // Bleu
StatusBadge(status: .underReview) // Jaune
```

## 📝 Conventions de Code

### Architecture MVVM
```swift
// Vue
struct OwnerPropertiesView: View {
    @StateObject private var viewModel = OwnerPropertiesViewModel()

    var body: some View {
        // UI uniquement
    }
}

// ViewModel
class OwnerPropertiesViewModel: ObservableObject {
    @Published var properties: [Property] = []
    @Published var isLoading = false
    @Published var error: String?

    func loadProperties() async {
        // Logique ici
    }
}
```

### Gestion des formulaires multi-étapes
```swift
struct CreatePropertyView: View {
    @StateObject private var viewModel = CreatePropertyViewModel()
    @State private var currentStep = 1

    var body: some View {
        NavigationStack {
            VStack {
                // Progress bar
                progressBar

                // Content selon l'étape
                Group {
                    switch currentStep {
                    case 1: PropertyFormStep1View(viewModel: viewModel)
                    case 2: PropertyFormStep2View(viewModel: viewModel)
                    case 3: PropertyFormStep3View(viewModel: viewModel)
                    case 4: PropertyFormStep4View(viewModel: viewModel)
                    case 5: PropertyFormStep5View(viewModel: viewModel)
                    default: EmptyView()
                    }
                }

                // Navigation buttons
                HStack {
                    if currentStep > 1 {
                        Button("Précédent") {
                            currentStep -= 1
                        }
                    }

                    Spacer()

                    Button(currentStep == 5 ? "Publier" : "Suivant") {
                        if currentStep == 5 {
                            _Concurrency.Task {
                                await viewModel.createProperty()
                            }
                        } else {
                            currentStep += 1
                        }
                    }
                    .disabled(!viewModel.isStepValid(currentStep))
                }
            }
        }
    }
}
```

### Upload d'images
```swift
import PhotosUI

struct PropertyFormStep4View: View {
    @ObservedObject var viewModel: CreatePropertyViewModel
    @State private var selectedItems: [PhotosPickerItem] = []

    var body: some View {
        VStack {
            PhotosPicker(
                selection: $selectedItems,
                maxSelectionCount: 10,
                matching: .images
            ) {
                Label("Ajouter des photos", systemImage: "photo.on.rectangle.angled")
            }
            .onChange(of: selectedItems) { newItems in
                _Concurrency.Task {
                    await viewModel.loadImages(from: newItems)
                }
            }

            // Preview grid
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 100))]) {
                ForEach(viewModel.images.indices, id: \.self) { index in
                    Image(uiImage: viewModel.images[index])
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 100, height: 100)
                        .cornerRadius(8)
                        .overlay(
                            Button {
                                viewModel.removeImage(at: index)
                            } label: {
                                Image(systemName: "xmark.circle.fill")
                                    .foregroundColor(.white)
                                    .background(Circle().fill(.black.opacity(0.5)))
                            }
                            .offset(x: 8, y: -8),
                            alignment: .topTrailing
                        )
                }
            }
        }
    }
}
```

## ⚠️ Points d'Attention CRITIQUES

### 1. PropertyStatus déjà défini
Le modèle `Property.swift` a déjà `PropertyStatus` :
```swift
enum PropertyStatus: String, Codable {
    case published = "published"
    case draft = "draft"
    case archived = "archived"
    case rented = "rented"
    case underReview = "under_review"
}
```

### 2. Les Cards existent déjà
Dans `OwnerPropertiesView.swift`, il y a déjà :
- `OwnerPropertyCard` - Card de propriété
- `StatBadge` - Badge pour stats
- `StatusBadge` - Badge de statut

**Réutilise-les !** Ne les recrée pas.

### 3. Conflit `Task`
```swift
// ❌ NE FAIS PAS ça
Task { }

// ✅ FAIS ça
_Concurrency.Task { }
```

### 4. Compression d'images avant upload
```swift
func compressImage(_ image: UIImage) -> Data? {
    // Compresse à 80% qualité
    guard let data = image.jpegData(compressionQuality: 0.8) else {
        return nil
    }

    // Si > 1MB, compresse plus
    if data.count > 1_000_000 {
        return image.jpegData(compressionQuality: 0.5)
    }

    return data
}
```

### 5. Formatage des montants
```swift
extension Double {
    var formattedEuro: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "EUR"
        formatter.locale = Locale(identifier: "fr_FR")
        return formatter.string(from: NSNumber(value: self)) ?? "€\(self)"
    }
}

// Usage
Text(property.monthlyRent.formattedEuro)
```

## 🧪 Testing en Mode Démo

Mock data pour les propriétés (déjà existe) :
```swift
Property.mockProperties  // Utilise ça
```

Pour les candidatures, crée des mocks :
```swift
// Dans Models/Application.swift
extension Application {
    static let mockApplications: [Application] = [
        Application(
            id: UUID(),
            propertyId: UUID(),
            applicantId: UUID(),
            applicantName: "Marie Dupont",
            applicantEmail: "marie.dupont@example.com",
            status: .new,
            message: "Bonjour, je suis très intéressée par votre logement...",
            submittedAt: Date(),
            documents: [
                Document(type: .idCard, url: "mock_url"),
                Document(type: .payslip, url: "mock_url")
            ]
        ),
        // ... plus de mocks
    ]
}
```

## 📊 Checklist de Complétion

Avant de considérer une fonctionnalité terminée :

- [ ] Le code compile sans erreurs
- [ ] Ça fonctionne en mode démo avec mock data
- [ ] L'UI ressemble à la web app (couleurs purple, espacements, typo)
- [ ] Les loading states sont gérés
- [ ] Les error states sont gérés
- [ ] Les empty states sont gérés
- [ ] La navigation fonctionne
- [ ] Les formulaires ont une validation
- [ ] Les images sont compressées avant upload
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
- `OwnerPropertyCard` - Card de propriété ✅
- `StatBadge` - Badge de stats ✅
- `StatusBadge` - Badge de statut ✅

### Modèles Partagés
Coordonne-toi pour ces modèles utilisés par plusieurs rôles :
- `User.swift` - Déjà existe
- `Property.swift` - Déjà existe avec tout ce qu'il faut ✅
- `Message.swift` - Partagé avec Searcher et Resident
- `Conversation.swift` - Partagé avec tous

## 🚀 Comment Démarrer

### Commande Initiale
```bash
cd /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo
open EasyCo.xcodeproj
```

### Premier Sprint - Gestion des Propriétés

1. **Lis le plan complet** : `PLAN_DEVELOPPEMENT_IOS.md` section Owner

2. **Explore la web app** : https://easyco-onboarding.vercel.app/ en mode Owner

3. **Regarde le code existant** :
```bash
# Ouvre ces fichiers dans Xcode
Features/Owner/OwnerPropertiesView.swift  # Déjà bien fait!
Features/Owner/ApplicationsView.swift     # Basique, à améliorer
Models/Property.swift                      # Complet!
```

4. **Commence par créer le formulaire de propriété** :
   - Crée `CreatePropertyView.swift` (vue principale)
   - Crée `CreatePropertyViewModel.swift`
   - Crée les 5 steps (PropertyFormStep1View.swift à Step5View.swift)
   - Implémente la navigation entre steps
   - Ajoute la progress bar

5. **Build et test** :
   - Cmd+B pour build
   - Cmd+R pour run
   - Test sur simulateur

## 📞 Questions Fréquentes

**Q : Je veux ajouter un champ à Property, comment faire ?**
A : Vérifie d'abord si le champ n'existe pas déjà. Si non, ajoute-le mais coordonne avec les autres (peut impacter Searcher).

**Q : Comment gérer l'upload de 10 photos ?**
A : Utilise `PhotosPicker` avec `maxSelectionCount: 10`, puis compresse et upload une par une.

**Q : Les statistiques doivent être en temps réel ?**
A : Non, refresh au pull to refresh ou toutes les 30 secondes en mode démo.

**Q : Comment générer un PDF pour les rapports ?**
A : Utilise `PDFKit` ou pour l'instant, fais juste le bouton "Export" qui affiche un share sheet.

**Q : Les cards de propriété sont trop basiques ?**
A : Non, elles sont bien ! Juste améliore-les si besoin (ajoute des quick actions par exemple).

## ✅ Checklist Avant de Commencer

- [ ] J'ai lu `PLAN_DEVELOPPEMENT_IOS.md` section Owner
- [ ] J'ai exploré la web app en mode Owner
- [ ] J'ai compris le système de couleurs (Purple #6E56CF)
- [ ] J'ai ouvert le projet Xcode
- [ ] Je peux build sans erreurs
- [ ] J'ai regardé `OwnerPropertiesView.swift` (déjà bien fait!)
- [ ] J'ai regardé `Property.swift` (modèle complet)
- [ ] Je comprends l'architecture MVVM
- [ ] Je sais comment éviter le conflit avec `Task`
- [ ] Je commence par le formulaire de création de propriété (3.1)

---

**Bonne chance ! 🚀**

Tu vas créer une expérience professionnelle et efficace pour les propriétaires. Concentre-toi sur la clarté des données et la rapidité d'accès aux informations importantes.

Si tu es bloqué, relis le `PLAN_DEVELOPPEMENT_IOS.md` ou pose des questions spécifiques.
