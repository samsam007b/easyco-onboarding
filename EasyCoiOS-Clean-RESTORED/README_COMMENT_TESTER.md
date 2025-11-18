# 🚀 Comment Tester le Workstream RESIDENT dans Xcode

## ⚡ Démarrage Rapide

### 1. Ouvrir le Projet
```bash
cd /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo
open EasyCo.xcodeproj
```

**Ou double-cliquez** sur `EasyCo.xcodeproj` dans le Finder.

---

### 2. Vérifier les Fichiers

Dans Xcode, vérifiez que ces fichiers sont présents dans le **Project Navigator** (⌘+1) :

#### 📁 Models/ (dossier des modèles)
- [x] `Household.swift`
- [x] `Lease.swift`
- [x] `ResidentTask.swift` ⭐ IMPORTANT
- [x] `Expense.swift`
- [x] `Event.swift`

#### 📁 Features/Resident/
- [x] `ResidentHubView.swift` (modifié)
- [x] `ResidentHubViewModel.swift` ⭐ NOUVEAU
- [x] `TasksView.swift` (modifié)

**Si un fichier apparaît en gris ou n'est pas visible** :
1. Sélectionnez le fichier
2. Ouvrez le File Inspector (⌘+⌥+1)
3. Cochez "EasyCo" sous "Target Membership"

---

### 3. Compiler (Build)

**Option A - Menu** :
- Product → Build
- Ou appuyez sur **⌘+B**

**Option B - Bouton** :
- Cliquez sur le bouton Play ▶️ (il compile automatiquement)

**Attendu** :
- ✅ "Build Succeeded" dans la barre du haut
- ✅ Pas d'erreurs rouges dans la console

**Si erreurs de compilation** :
1. Clean Build Folder : Product → Clean Build Folder (⌘+⇧+K)
2. Rebuild : ⌘+B

---

### 4. Lancer sur Simulateur

#### Sélectionner un Simulateur
1. Cliquez sur le menu déroulant à côté du bouton ▶️
2. Sélectionnez : **iPhone 15 Pro** (recommandé)

#### Lancer l'App
- Product → Run
- Ou appuyez sur **⌘+R**

**Première fois** :
- Le simulateur iOS va s'ouvrir (peut prendre 30-60 secondes)
- L'app va s'installer et se lancer
- Soyez patient ! ⏳

---

### 5. Naviguer dans l'App

#### A. Onboarding (première fois)
1. **Passez les écrans d'introduction** (swipe ou bouton "Suivant")
2. **IMPORTANT** : Choisissez le rôle **"Resident"** 🏠
3. Vous arrivez sur le **Hub du Résident**

#### B. Explorer le Hub (Dashboard)

Le Hub devrait afficher **8 sections** :

##### 1. 👋 Welcome Card (en haut)
```
┌────────────────────────────┐
│ Bonjour ! 🏠             │
│ Colocation du Centre       │
└────────────────────────────┘
```
- Message change selon l'heure (Bonjour/Bon après-midi/Bonsoir)

##### 2. 🏠 Votre Logement
```
📍 15 Rue de la Paix, 1000 Bruxelles
💰 550.00€ + 100.00€ charges
📅 Fin du bail dans X jours
👥 3 / 4 colocataires
```

##### 3. ✅ Tâches d'aujourd'hui
```
○ Sortir les poubelles
  👤 Marie  ⏰ Aujourd'hui
  [Poubelles]

○ Nettoyer la cuisine ❗
  👤 Thomas  ⏰ Aujourd'hui
  [Ménage]
```
- **Testez** : Tapez sur le cercle ○ → devient ✓ (vert)

##### 4. 💰 Balance
```
Vous devez: XX.XX€ (rouge)
On vous doit: XX.XX€ (vert)

→ Thomas doit 15.50€ à Marie
→ Sophie doit 42.30€ à Marie
```

##### 5. 📅 Événements à venir
```
🎉 Soirée jeux de société
   📅 Dans 2 jours  👤 Marie

👥 Réunion mensuelle
   📅 Dans 5 jours  👤 Thomas
```

##### 6. ⚡ Actions rapides
```
┌─────────────┬─────────────┐
│ 💰 Ajouter  │ ✅ Créer   │
│  dépense    │  tâche      │
├─────────────┼─────────────┤
│ 📅 Nouvel  │ 💬 Messages │
│  événement  │             │
└─────────────┴─────────────┘
```

##### 7. 💸 Dépenses récentes
```
🛒 Courses de la semaine
   Payé par Marie  85.50€
   21.38€/pers

⚡ Facture d'électricité
   Payé par Thomas  120.00€
   30.00€/pers
```

##### 8. 🔔 Badge Notifications (en haut à droite)
- Si vous avez des alertes (tâches en retard, etc.)
- Cercle rouge avec un nombre

#### C. Tester le Pull-to-Refresh
1. Sur le Hub, **swipe vers le bas** (pull)
2. Un spinner apparaît
3. Les données se rechargent (simule 0.8s)

#### D. Naviguer vers les Tâches
1. **Tapez sur "Tout voir"** dans la section "Tâches d'aujourd'hui"
2. Vous arrivez sur **TasksView**

##### TasksView devrait afficher :
```
6 tâches avec différents statuts:

✓ Nettoyer la salle de bain (barrée, verte)
  [Ménage] Terminée

○ Sortir les poubelles
  [Poubelles] Aujourd'hui

○ Nettoyer la cuisine ❗
  [Ménage] Aujourd'hui (priorité haute)

○ Faire les courses
  [Courses] Demain

○ Passer l'aspirateur
  [Ménage] Dans 2 jours

○ Réparer le robinet ❗
  [Maintenance] En retard (rouge)
```

**Testez** :
- Tapez sur un cercle ○ pour marquer complété
- Les badges de catégories sont colorés
- Les priorités urgentes ont un ❗

---

## 🎨 Ce Qui Devrait Être Visible

### Couleurs
- **Coral #E8865D** : Éléments principaux du resident
- **Vert** : Tâches complétées, balance positive
- **Rouge** : Tâches en retard, balance négative
- **Gris clair** : Fond des cards
- **Blanc** : Cards individuelles

### Badges Colorés
- 🗑️ **Poubelles** : Gris
- ✨ **Ménage** : Vert
- 🛒 **Courses** : Bleu
- 🔧 **Maintenance** : Rouge
- 🍳 **Cuisine** : Orange
- 🧺 **Lessive** : Violet

### Icônes
- ○ : Tâche non complétée (gris)
- ✓ : Tâche complétée (vert)
- ❗: Priorité haute/urgente (rouge/orange)
- 🏠 : Maison
- 👤 : Personne
- ⏰ : Horloge
- 📍 : Localisation
- 💰 : Argent

---

## ✅ Checklist de Test

Vérifiez que tout fonctionne :

### Compilation
- [ ] Le projet compile sans erreurs (⌘+B)
- [ ] Aucune warning bloquante

### Lancement
- [ ] L'app se lance sur le simulateur
- [ ] Pas de crash au lancement
- [ ] Le splash screen apparaît (si présent)

### Hub du Résident
- [ ] Welcome card affiche le bon message
- [ ] Nom de la colocation visible
- [ ] Section "Votre logement" complète
- [ ] Tâches d'aujourd'hui affichées (2-3)
- [ ] Balance affichée avec montants
- [ ] Événements à venir (3)
- [ ] 4 boutons d'actions rapides
- [ ] Dépenses récentes (3)
- [ ] Badge de notifications visible (si alertes)

### Interactions
- [ ] Pull-to-refresh fonctionne
- [ ] Tap sur cercle de tâche → marque complété
- [ ] Navigation vers TasksView fonctionne
- [ ] Retour depuis TasksView fonctionne

### TasksView
- [ ] 6 tâches affichées
- [ ] Tâche complétée barrée et verte
- [ ] Badges de catégories colorés
- [ ] Badge "En retard" en rouge si overdue
- [ ] Priorité haute/urgente avec ❗
- [ ] Bouton + en haut à droite

### Design
- [ ] Couleur Coral utilisée (resident)
- [ ] Cards avec ombres subtiles
- [ ] Coins arrondis uniformes
- [ ] Espacements cohérents
- [ ] Textes lisibles
- [ ] Pas de texte coupé

### Performance
- [ ] Pas de lag lors du scroll
- [ ] Animations fluides
- [ ] Pas de freeze de l'app

---

## 🐛 Problèmes Courants et Solutions

### ❌ Erreur : "Cannot find type 'ResidentTask'"
**Cause** : Le fichier n'est pas dans le projet
**Solution** :
1. Vérifiez que `ResidentTask.swift` est visible dans le Project Navigator
2. Sélectionnez-le → File Inspector (⌘+⌥+1)
3. Cochez "EasyCo" sous Target Membership
4. Clean + Rebuild (⌘+⇧+K puis ⌘+B)

### ❌ Erreur : "Use of unresolved identifier 'Household'"
**Solution** : Même chose que ci-dessus pour `Household.swift`

### ❌ L'app crash au lancement
**Cause** : Probable force unwrap (!) sur nil
**Solution** :
1. Regardez les logs dans la console (⌘+⇧+Y)
2. Cherchez la ligne avec "Fatal error: Unexpectedly found nil"
3. Vérifiez le fichier et la ligne indiqués

### ❌ Rien ne s'affiche sur le Hub
**Cause** : Mode démo pas activé
**Solution** :
1. Ouvrez `Config/AppConfig.swift`
2. Vérifiez `static let demoMode = true`
3. Rebuild

### ❌ Les couleurs sont incorrectes
**Cause** : Hex mal formaté
**Solution** :
1. Vérifiez que `Color(hex: "E8865D")` (sans #)
2. Vérifiez que `Theme.swift` a l'extension `Color(hex:)`

### ❌ Le simulateur ne se lance pas
**Solutions** :
1. Redémarrez Xcode
2. Xcode → Product → Clean Build Folder
3. Supprimez Derived Data : Xcode → Preferences → Locations → Derived Data → Flèche → Supprimer le dossier
4. Relancez Xcode

---

## 📸 Screenshots Attendus

### Hub du Résident (vue complète)
```
┌─────────────────────────────────┐
│ ◀ Hub                       🔔1 │ ← Toolbar
├─────────────────────────────────┤
│                                 │
│ ┌───────────────────────────┐   │
│ │ Bonjour ! 🏠            │   │ ← Welcome
│ │ Colocation du Centre      │   │
│ └───────────────────────────┘   │
│                                 │
│ Votre logement                  │ ← Household Info
│ ┌───────────────────────────┐   │
│ │ 📍 Adresse              │   │
│ │ 💰 Loyer                │   │
│ │ 📅 Fin bail             │   │
│ │ 👥 Colocataires         │   │
│ └───────────────────────────┘   │
│                                 │
│ Tâches d'aujourd'hui        3   │ ← Tasks
│ ┌───────────────────────────┐   │
│ │ ○ Tâche 1                │   │
│ └───────────────────────────┘   │
│                                 │
│ Balance           Détails →     │ ← Balance
│ ┌──────────┬──────────┐         │
│ │ Vous     │ On vous  │         │
│ │ devez    │ doit     │         │
│ └──────────┴──────────┘         │
│                                 │
│ Événements à venir  Voir tout → │ ← Events
│ ...                             │
│                                 │
│ Actions rapides                 │ ← Quick Actions
│ ┌──────┬──────┐                 │
│ │      │      │                 │
│ └──────┴──────┘                 │
│                                 │
│ Dépenses récentes  Voir tout → │ ← Expenses
│ ...                             │
│                                 │
└─────────────────────────────────┘
```

---

## 🎯 Prochaines Étapes

Une fois que tout fonctionne :

### Sprint 2 : Système de Tâches Avancé
- Créer/éditer des tâches
- Système de rotation
- Upload de photos de preuve
- Statistiques

### Sprint 3 : Dépenses
- Ajouter des dépenses
- Upload de reçus
- Calcul des remboursements
- Graphiques

### Sprint 4 : Calendrier
- Vue mensuelle
- Créer des événements
- Système de RSVP

---

## 💡 Astuces Xcode

### Raccourcis Utiles
- **⌘+B** : Build
- **⌘+R** : Run
- **⌘+.** : Stop
- **⌘+⇧+K** : Clean Build Folder
- **⌘+1** : Project Navigator
- **⌘+⇧+Y** : Console (logs)
- **⌘+⇧+L** : Library (SF Symbols)
- **⌘+/** : Commenter/Décommenter

### Debug
- **Breakpoints** : Cliquez sur le numéro de ligne
- **Print** : `print("Debug:", variable)`
- **Console** : ⌘+⇧+Y pour voir les logs

### Preview
Si une vue a `#Preview`, vous pouvez :
1. Ouvrir le fichier
2. Canvas apparaît à droite (⌥+⌘+↩)
3. Voir le rendu en temps réel

---

## 📞 Besoin d'Aide ?

### Documents à Consulter
1. **GUIDE_TEST_RESIDENT.md** - Guide détaillé de test
2. **RESIDENT_SPRINT1_COMPLETE.md** - Récapitulatif complet
3. **PROMPT_CLAUDE_RESIDENT.md** - Instructions originales

### Vérifications Rapides
```bash
# Lister les fichiers créés
find EasyCo -name "*.swift" | grep -E "(Household|Lease|ResidentTask|Expense|Event|ResidentHubViewModel)"

# Vérifier le mode démo
grep "demoMode" EasyCo/Config/AppConfig.swift
```

---

**Bon test ! 🚀**

Si tout fonctionne, vous devriez avoir un dashboard complet et fonctionnel pour les résidents de colocation !
