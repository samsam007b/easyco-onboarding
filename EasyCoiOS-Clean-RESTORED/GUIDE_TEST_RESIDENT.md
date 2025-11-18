# 🚀 Guide de Test - Workstream RESIDENT

Ce guide vous aide à tester les nouvelles fonctionnalités du rôle RESIDENT dans Xcode.

## ✅ Ce qui a été ajouté

### 📦 Nouveaux Fichiers Créés

**Modèles (5 fichiers)** :
- ✅ `Models/Household.swift` - Modèle de colocation
- ✅ `Models/Lease.swift` - Modèle de bail
- ✅ `Models/ResidentTask.swift` - Modèle de tâches (évite conflit avec Task)
- ✅ `Models/Expense.swift` - Modèle de dépenses
- ✅ `Models/Event.swift` - Modèle d'événements

**Features Resident** :
- ✅ `Features/Resident/ResidentHubViewModel.swift` - ViewModel du dashboard
- ✅ `Features/Resident/ResidentHubView.swift` - Vue améliorée (169 → 614 lignes)
- ✅ `Features/Resident/TasksView.swift` - Vue des tâches améliorée

## 🔧 Étapes pour Tester

### 1. Vérifier l'Intégration dans Xcode

1. **Ouvrir le projet** :
   ```bash
   open /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj
   ```

2. **Vérifier que les fichiers apparaissent** :
   - Dans le Project Navigator (⌘+1)
   - Vérifiez que tous les nouveaux fichiers sont visibles
   - Ils doivent avoir une icône de fichier Swift (pas gris)

3. **Vérifier les Target Membership** :
   - Sélectionnez chaque nouveau fichier
   - Dans le File Inspector (⌘+⌥+1)
   - Vérifiez que "EasyCo" est coché sous "Target Membership"

### 2. Compiler le Projet

1. **Clean Build Folder** (recommandé) :
   - Menu : Product > Clean Build Folder
   - Ou : ⌘+⇧+K

2. **Build** :
   - Menu : Product > Build
   - Ou : ⌘+B

3. **Vérifier les erreurs** :
   - Si erreurs de compilation, vérifiez :
     - Les imports sont corrects
     - Les noms de fichiers correspondent
     - Pas de typos dans les noms de types

### 3. Lancer sur Simulateur

1. **Sélectionner un simulateur** :
   - Cliquez sur le menu déroulant à côté du bouton Play
   - Choisissez "iPhone 15 Pro" ou "iPhone 15"

2. **Run** :
   - Menu : Product > Run
   - Ou : ⌘+R

3. **Attendez le lancement** :
   - Le simulateur va s'ouvrir
   - L'app va se compiler et s'installer
   - Peut prendre 1-2 minutes la première fois

### 4. Naviguer dans l'App

#### A. Onboarding (si c'est la première fois)
1. Passez les écrans d'onboarding
2. **Choisissez le rôle "Resident"** ← IMPORTANT !

#### B. Tester le ResidentHubView

Une fois sur le hub, vous devriez voir :

**1. Welcome Card** (en haut)
- Message "Bonjour !" / "Bon après-midi !" / "Bonsoir !" (selon l'heure)
- Nom de la colocation : "Colocation du Centre"
- Icône de maison en coral

**2. Votre Logement**
- Adresse : "15 Rue de la Paix, 1000 Bruxelles, Belgique"
- Loyer : "550.00€ + 100.00€ charges"
- Fin du bail avec compte à rebours si < 30 jours
- Colocataires : "3 / 4"

**3. Tâches d'aujourd'hui**
- Liste de 2-3 tâches
- Badge de catégorie coloré (Poubelles, Ménage, etc.)
- Possibilité de cliquer sur le cercle pour marquer complété
- Indicateur "En retard" en rouge si overdue

**4. Balance**
- Montant que vous devez (en rouge)
- Montant qu'on vous doit (en vert)
- Liste des 3 premières balances

**5. Événements à venir**
- 3 prochains événements
- Type d'événement avec icône colorée
- Date et organisateur

**6. Actions rapides**
- 4 boutons en grille :
  - Ajouter une dépense (vert)
  - Créer une tâche (coral)
  - Nouvel événement (violet)
  - Messages (bleu)

**7. Dépenses récentes**
- 3 dernières dépenses
- Icône de catégorie
- Montant total et par personne

**8. Badge de notifications** (en haut à droite)
- Si alertes présentes (tâches en retard, etc.)
- Nombre dans un cercle rouge

#### C. Tester TasksView

1. **Naviguer vers les tâches** :
   - Tapez sur "Tout voir" dans la section "Tâches d'aujourd'hui"
   - Ou utilisez l'onglet de navigation si disponible

2. **Vérifier l'affichage** :
   - 6 tâches mockées avec différents statuts
   - Tâche complétée barrée avec checkmark vert
   - Tâches non complétées avec cercle gris
   - Badge de catégorie coloré (ex: "Poubelles" en gris)
   - Badge de statut ("En retard" en rouge, "Aujourd'hui", "Demain")
   - Icône d'urgence (!) pour tâches urgentes/hautes

3. **Tester l'interaction** :
   - Tapez sur le cercle pour marquer complété (devrait animer)

### 5. Tester le Pull to Refresh

1. Sur le ResidentHubView
2. Swipe vers le bas (pull to refresh)
3. Un spinner devrait apparaître
4. Les données se rechargent (simulate delay de 0.8s)

## 🐛 Résolution des Problèmes Courants

### Erreur : "Cannot find type 'ResidentTask' in scope"
**Solution** :
1. Vérifiez que `ResidentTask.swift` est dans le projet
2. Vérifiez le Target Membership
3. Clean Build Folder (⌘+⇧+K) puis rebuild

### Erreur : "Use of unresolved identifier 'Household'"
**Solution** :
1. Vérifiez que `Household.swift` est dans le projet
2. Rebuild le projet

### Erreur : "Cannot find 'LoadingView' in scope"
**Solution** :
1. Vérifiez que les composants communs sont présents :
   - `Components/Common/LoadingView.swift`
   - `Components/Common/ErrorView.swift`
2. Si manquants, il faut les créer (voir le prompt RESIDENT)

### L'app crash au lancement
**Solution** :
1. Vérifiez les logs dans la console Xcode
2. Vérifiez que `AppConfig.FeatureFlags.demoMode = true`
3. Vérifiez qu'il n'y a pas de force unwrap (!) sur nil

### Les couleurs ne s'affichent pas correctement
**Solution** :
1. Vérifiez que `Theme.swift` contient l'extension `Color(hex:)`
2. Vérifiez que les codes hex sont corrects (sans #)

### Le mode démo ne fonctionne pas
**Solution** :
1. Ouvrez `Config/AppConfig.swift`
2. Vérifiez que `static let demoMode = true`
3. Rebuild

## 📸 Screenshots Attendus

### ResidentHubView
```
┌─────────────────────────────────┐
│  Hub                         🔔1 │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Bonjour ! 🏠               │ │
│ │ Colocation du Centre        │ │
│ └─────────────────────────────┘ │
│                                 │
│ Votre logement                  │
│ ┌─────────────────────────────┐ │
│ │ 📍 15 Rue de la Paix...     │ │
│ │ 💰 550€ + 100€ charges      │ │
│ │ 📅 Fin : dans 180 jours     │ │
│ │ 👥 3 / 4 colocataires       │ │
│ └─────────────────────────────┘ │
│                                 │
│ Tâches d'aujourd'hui        3   │
│ ┌─────────────────────────────┐ │
│ │ ○ Sortir les poubelles      │ │
│ │   👤 Marie  ⏰ Aujourd'hui  │ │
│ │   [Poubelles]               │ │
│ └─────────────────────────────┘ │
│ ...                             │
└─────────────────────────────────┘
```

### TasksView
```
┌─────────────────────────────────┐
│  Tâches                        + │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ ○ Sortir les poubelles      │ │
│ │   👤 Marie                  │ │
│ │   [Poubelles] Aujourd'hui   │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ○ Nettoyer la cuisine    ❗│ │
│ │   👤 Thomas                 │ │
│ │   [Ménage] Aujourd'hui      │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ ✓ Nettoyer la salle de bain │ │
│ │   👤 Thomas                 │ │
│ │   [Ménage] Terminée         │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## ✅ Checklist de Validation

Avant de considérer le test terminé, vérifiez :

- [ ] Le projet compile sans erreurs (⌘+B)
- [ ] L'app se lance sur le simulateur
- [ ] Le ResidentHubView affiche toutes les sections
- [ ] Les données mockées s'affichent correctement
- [ ] Les couleurs sont en Coral (#E8865D) pour le resident
- [ ] Le pull-to-refresh fonctionne
- [ ] La navigation vers TasksView fonctionne
- [ ] TasksView affiche les 6 tâches mockées
- [ ] Les badges de catégories sont colorés
- [ ] Les tâches complétées sont barrées
- [ ] Le badge de notifications s'affiche si alertes
- [ ] Pas de crashs lors de la navigation
- [ ] Les loading states apparaissent brièvement

## 🚀 Prochaines Étapes

Une fois que tout fonctionne :

1. **Sprint 2 : Système de Tâches Avancé**
   - TasksViewModel complet
   - CreateTaskView (formulaire de création)
   - TaskRotationSettingsView
   - TaskStatsView
   - Upload de photos de preuve

2. **Sprint 3 : Dépenses**
   - ExpensesView complète
   - AddExpenseView avec upload reçu
   - BalanceView avec calcul automatique
   - ExpenseStatsView avec graphiques

3. **Sprint 4 : Calendrier**
   - CalendarView mensuel
   - CreateEventView
   - EventDetailView
   - Système de RSVP

## 📞 Aide

Si vous rencontrez des problèmes :
1. Vérifiez les logs Xcode (⌘+⇧+Y pour ouvrir la console)
2. Relisez ce guide
3. Vérifiez le PROMPT_CLAUDE_RESIDENT.md pour plus de détails

---

**Date de création** : Novembre 2025
**Workstream** : RESIDENT
**Status** : Sprint 1 Complété ✅
