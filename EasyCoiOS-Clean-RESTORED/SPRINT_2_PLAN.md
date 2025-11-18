# 📋 Sprint 2 RESIDENT - Système de Tâches Complet

## 🎯 Objectif

Créer un système complet de gestion des tâches ménagères pour la colocation, avec :
- Création et gestion de tâches
- Rotation automatique entre colocataires
- Statistiques et suivi
- Upload de photos de preuve

---

## 📝 Features à Implémenter

### 1. TasksViewModel ✅ (En cours)
**Fichier** : `Features/Resident/TasksViewModel.swift`

**Responsabilités** :
- Gestion de l'état des tâches
- CRUD complet (Create, Read, Update, Delete)
- Filtrage et tri
- Complétion de tâches
- Calcul des statistiques

**Properties** :
```swift
@Published var tasks: [ResidentTask] = []
@Published var filteredTasks: [ResidentTask] = []
@Published var isLoading = false
@Published var error: String?
@Published var selectedFilter: TaskFilter = .all
@Published var selectedSort: TaskSort = .dueDate
```

**Methods** :
- `loadTasks()` : Chargement initial
- `createTask(_ task: ResidentTask)` : Création
- `updateTask(_ task: ResidentTask)` : Modification
- `deleteTask(_ taskId: UUID)` : Suppression
- `completeTask(_ taskId: UUID, photo: UIImage?)` : Complétion avec photo
- `applyFilters()` : Application des filtres
- `getTaskStats()` : Calcul des stats

---

### 2. TasksView Améliorée ✅
**Fichier** : `Features/Resident/TasksView.swift` (déjà existant, à améliorer)

**Améliorations** :
- Intégration du ViewModel
- Filtres (Toutes, À faire, Complétées, En retard)
- Tri (Date, Priorité, Catégorie, Assigné)
- Pull-to-refresh
- Swipe actions (Compléter, Modifier, Supprimer)
- Navigation vers détails

**UI** :
```
┌─────────────────────────────┐
│ Tâches              [+]     │
├─────────────────────────────┤
│ [Filtres: Toutes ▼]         │
│ [Tri: Date ▼]               │
├─────────────────────────────┤
│ ☐ Sortir les poubelles      │
│   Thomas · Aujourd'hui       │
│   🔴 Urgent                  │
├─────────────────────────────┤
│ ✓ Nettoyer la cuisine       │
│   Marie · Complété          │
├─────────────────────────────┤
│ ⚠️ Faire la vaisselle       │
│   Pierre · En retard        │
└─────────────────────────────┘
```

---

### 3. CreateTaskView 📝
**Fichier** : `Features/Resident/CreateTaskView.swift`

**Formulaire complet** :
- Titre de la tâche
- Description (optionnelle)
- Catégorie (dropdown)
- Priorité (Normal, Haute, Urgente)
- Assigné à (picker de colocataires)
- Date d'échéance (date picker)
- Récurrence (optionnelle)
  - Pattern (Quotidien, Hebdomadaire, Mensuel)
  - Jours spécifiques (si hebdomadaire)
- Rotation automatique (toggle)

**Validation** :
- Titre obligatoire
- Date d'échéance >= aujourd'hui
- Assigné obligatoire si pas de rotation

**UI Flow** :
1. Tap bouton [+] dans TasksView
2. Sheet avec formulaire
3. Validation
4. Création + retour à la liste

---

### 4. TaskRotationSettingsView ⚙️
**Fichier** : `Features/Resident/TaskRotationSettingsView.swift`

**Configuration de rotation** :
- Liste des tâches récurrentes
- Ordre de rotation des colocataires
- Fréquence de rotation
- Historique des assignations

**Features** :
- Drag & drop pour réordonner colocataires
- Toggle pour activer/désactiver rotation
- Prévisualisation des prochaines assignations

**UI** :
```
┌─────────────────────────────┐
│ Rotation des Tâches         │
├─────────────────────────────┤
│ Sortir les poubelles        │
│ ✓ Rotation activée          │
│ Ordre:                       │
│ 1. Thomas (actuel)          │
│ 2. Marie                     │
│ 3. Pierre                    │
│ 4. Sophie                    │
│ Prochain: 15/11 - Marie     │
└─────────────────────────────┘
```

---

### 5. TaskStatsView 📊
**Fichier** : `Features/Resident/TaskStatsView.swift`

**Statistiques affichées** :
- Par colocataire :
  - Nombre de tâches complétées
  - Taux de complétion
  - Tâches en retard
  - Temps moyen de complétion
- Par catégorie :
  - Répartition des tâches
  - Graphique en donut
- Timeline :
  - Activité sur 30 jours
  - Graphique en barres

**UI Components** :
- Cards avec stats individuelles
- Graphiques (DonutChart, BarChart)
- Leaderboard des colocataires
- Filtres par période

---

### 6. Upload de Photos 📸
**Intégration dans** : CreateTaskView + TaskCompletionView

**Flow** :
1. Bouton "Ajouter une photo"
2. ActionSheet : Caméra / Galerie
3. ImagePicker
4. Crop/resize
5. Upload (mock pour l'instant)
6. Affichage thumbnail

**Modèle** :
```swift
struct TaskPhoto: Identifiable, Codable {
    let id: UUID
    var taskId: UUID
    var imageURL: String
    var uploadedAt: Date
    var uploadedBy: UUID
}
```

---

## 🗂️ Fichiers à Créer

```
Features/Resident/
├── TasksViewModel.swift              ← Nouveau
├── TasksView.swift                    ← Améliorer (déjà existant)
├── CreateTaskView.swift               ← Nouveau
├── TaskDetailView.swift               ← Nouveau
├── TaskRotationSettingsView.swift     ← Nouveau
├── TaskStatsView.swift                ← Nouveau
└── Components/
    ├── TaskFilterChip.swift           ← Nouveau
    ├── TaskSortMenu.swift             ← Nouveau
    ├── TaskStatCard.swift             ← Nouveau
    └── PhotoPicker.swift              ← Nouveau
```

---

## 📊 Ordre d'Implémentation

### Phase 1 : Foundation (1-2h)
1. ✅ TasksViewModel (logique complète)
2. ✅ Amélioration TasksView (filtres, tri, ViewModel)

### Phase 2 : CRUD (1-2h)
3. ✅ CreateTaskView (formulaire complet)
4. ✅ TaskDetailView (détails + édition)

### Phase 3 : Features Avancées (1-2h)
5. ✅ TaskRotationSettingsView
6. ✅ TaskStatsView

### Phase 4 : Media (1h)
7. ✅ PhotoPicker component
8. ✅ Intégration upload photos

---

## 🎨 Design System

### Couleurs
- **Coral** : #E8865D (actions principales)
- **Success** : #10B981 (tâches complétées)
- **Warning** : #F59E0B (en retard)
- **Error** : #EF4444 (urgent)
- **Gray** : #6B7280 (texte secondaire)

### Composants Réutilisables
- TaskCard (déjà créé)
- FilterChip (à créer)
- StatCard (à créer)
- FormField (réutiliser de ResidentHubView)

---

## ✅ Critères de Succès

### TasksViewModel
- [ ] Chargement des tâches
- [ ] Filtrage par statut
- [ ] Tri par critères multiples
- [ ] CRUD complet
- [ ] Gestion d'erreurs
- [ ] Demo mode avec mock data

### TasksView
- [ ] Liste scrollable de tâches
- [ ] Filtres visuels (chips)
- [ ] Tri dropdown
- [ ] Pull-to-refresh
- [ ] Swipe actions
- [ ] Navigation vers détails
- [ ] Empty state si aucune tâche

### CreateTaskView
- [ ] Formulaire validé
- [ ] Tous les champs fonctionnels
- [ ] Sélecteur de récurrence
- [ ] Rotation toggle
- [ ] Sauvegarde dans ViewModel
- [ ] Dismiss après création

### TaskRotationSettingsView
- [ ] Liste tâches récurrentes
- [ ] Configuration rotation
- [ ] Drag & drop colocataires
- [ ] Prévisualisation

### TaskStatsView
- [ ] Stats par colocataire
- [ ] Graphiques visuels
- [ ] Leaderboard
- [ ] Filtres période

### Upload Photos
- [ ] ImagePicker fonctionnel
- [ ] Crop/resize
- [ ] Upload mock
- [ ] Affichage thumbnails

---

## 🚀 Commençons !

Je vais maintenant créer **TasksViewModel.swift** avec toute la logique métier.

Êtes-vous prêt ? Je commence immédiatement !
