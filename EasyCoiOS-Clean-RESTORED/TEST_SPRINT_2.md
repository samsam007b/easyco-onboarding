# 🧪 Guide de Test - Sprint 2 RESIDENT

## 🎯 Objectif

Tester le **système complet de gestion des tâches** créé dans Sprint 2.

---

## 📋 Pré-requis

### 1. Ouvrir le Projet
```bash
cd /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo
open EasyCo.xcodeproj
```

### 2. Vérifier les Fichiers
Assurez-vous que ces fichiers sont dans le projet Xcode :
- ✅ `Features/Resident/TasksViewModel.swift`
- ✅ `Features/Resident/TasksView.swift`
- ✅ `Features/Resident/CreateTaskView.swift`
- ✅ `Features/Resident/TaskRotationSettingsView.swift`
- ✅ `Features/Resident/TaskStatsView.swift`

### 3. Build
```
⌘+B (Command + B)
```
**Résultat attendu** : Build Succeeded ✅

---

## 🧪 Scénarios de Test

### Scénario 1 : TasksView - Liste des Tâches ✅

#### Test 1.1 : Affichage Initial
1. **Run** l'app (⌘+R)
2. Sélectionner rôle **"Resident"**
3. Naviguer vers **"Tâches"**

**Résultat attendu** :
- ✅ Liste de 6 tâches mockées affichée
- ✅ Search bar en haut
- ✅ 5 filter chips (Toutes, À faire, Complétées, En retard, Aujourd'hui)
- ✅ Menu de tri visible
- ✅ Bouton [+] en haut à droite

#### Test 1.2 : Filtres
1. Tap sur **"À faire"**
   - ✅ Seules les tâches non complétées s'affichent
   - ✅ Chip "À faire" devient Coral
   - ✅ Count badge mis à jour

2. Tap sur **"Complétées"**
   - ✅ Seules les tâches complétées s'affichent
   - ✅ Texte barré sur les titres

3. Tap sur **"En retard"**
   - ✅ Affiche "Réparer le robinet qui fuit" (1 tâche overdue)
   - ✅ Date en rouge

4. Tap sur **"Aujourd'hui"**
   - ✅ Affiche les tâches avec dueDate = aujourd'hui
   - ✅ 2 tâches normalement

#### Test 1.3 : Tri
1. Tap sur menu **"Tri"**
2. Sélectionner **"Priorité"**
   - ✅ Tâches triées par priorité (Urgent → Haute → Normale → Basse)
   - ✅ "Réparer le robinet" en premier (urgent)

3. Sélectionner **"Catégorie"**
   - ✅ Tâches groupées par catégorie

#### Test 1.4 : Recherche
1. Tap dans search bar
2. Taper **"poubelles"**
   - ✅ Seule "Sortir les poubelles" s'affiche
   - ✅ Bouton X apparaît

3. Tap sur X
   - ✅ Search se vide
   - ✅ Toutes les tâches réapparaissent

#### Test 1.5 : Swipe Actions
1. Swipe **LEFT** sur une tâche non complétée
   - ✅ Boutons "Modifier" (bleu) et "Supprimer" (rouge) apparaissent

2. Swipe **RIGHT** sur une tâche non complétée
   - ✅ Bouton "Compléter" (vert) apparaît
   - ✅ Full swipe complète directement la tâche

3. Tap sur **"Compléter"**
   - ✅ Tâche passe en complétée (checkmark vert)
   - ✅ Texte devient barré

#### Test 1.6 : Pull-to-Refresh
1. Scroll vers le haut
2. Pull down pour refresh
   - ✅ Loading indicator apparaît
   - ✅ Liste se recharge (500ms delay)
   - ✅ Spinner disparaît

---

### Scénario 2 : CreateTaskView - Création de Tâche ✅

#### Test 2.1 : Ouverture du Formulaire
1. Depuis TasksView, tap sur bouton **[+]**
   - ✅ Sheet s'ouvre avec "Nouvelle tâche"
   - ✅ Bouton "Annuler" en haut à gauche
   - ✅ Bouton "Créer" (Coral) en haut à droite
   - ✅ Formulaire scrollable

#### Test 2.2 : Remplir le Formulaire
1. **Titre** : Taper "Test nouvelle tâche"
   - ✅ TextField fonctionne

2. **Description** : Taper "Description test"
   - ✅ TextEditor multi-lignes

3. **Catégorie** : Tap dropdown
   - ✅ Menu avec 8 catégories + icônes
   - Sélectionner **"Ménage"**
   - ✅ Icône sparkles + "Ménage" affiché

4. **Priorité** : Tap sur **"Haute"**
   - ✅ Bouton devient orange
   - ✅ Autres boutons désélectionnés

5. **Assigné à** : Tap dropdown
   - ✅ Liste avec Marie, Thomas, Sophie, Marc
   - Sélectionner **"Marie"**
   - ✅ "Marie" s'affiche

6. **Date d'échéance** :
   - Toggle ON
   - ✅ DatePicker apparaît
   - Sélectionner demain + 14h00
   - ✅ Date/heure enregistrée

#### Test 2.3 : Récurrence
1. Toggle **"Tâche récurrente"** ON
   - ✅ Section récurrence apparaît

2. **Fréquence** : Sélectionner **"Chaque semaine"**
   - ✅ Fréquence affichée
   - ✅ Section "Jours de la semaine" apparaît

3. **Jours** : Cocher **Lundi** et **Mercredi**
   - ✅ Checkmarks verts
   - ✅ Multi-sélection fonctionne

4. Toggle **"Rotation automatique"** ON
   - ✅ Description explicative s'affiche
   - ✅ Champ "Assigné à" disparaît

#### Test 2.4 : Validation
1. **Test champs vides** :
   - Vider le titre
   - Tap "Créer"
   - ✅ Message d'erreur rouge : "Le titre est obligatoire"

2. **Test assigné manquant** :
   - Désactiver rotation
   - Ne pas sélectionner d'assigné
   - Tap "Créer"
   - ✅ Message : "Veuillez sélectionner un colocataire"

3. **Test jours manquants** :
   - Activer récurrence hebdomadaire
   - Ne cocher aucun jour
   - Tap "Créer"
   - ✅ Message : "Veuillez sélectionner au moins un jour"

#### Test 2.5 : Création Réussie
1. Remplir tous les champs correctement
2. Tap **"Créer"**
   - ✅ Sheet se ferme
   - ✅ Retour à TasksView
   - ✅ Nouvelle tâche apparaît dans la liste (en premier si tri par date)

#### Test 2.6 : Annulation
1. Ouvrir formulaire
2. Remplir quelques champs
3. Tap **"Annuler"**
   - ✅ Sheet se ferme
   - ✅ Aucune tâche créée
   - ✅ Changements perdus

---

### Scénario 3 : TaskRotationSettingsView - Rotation ✅

#### Test 3.1 : Accès à la Vue
**Note** : Cette vue n'est pas encore linkée depuis TasksView. Pour tester :
1. Ajouter temporairement un bouton dans TasksView :
```swift
Button("Rotation") {
    // Present TaskRotationSettingsView
}
```

OU modifier ResidentHubView pour ajouter un bouton "Rotation"

#### Test 3.2 : Sélection de Tâche
1. Ouvrir TaskRotationSettingsView
   - ✅ Première tâche récurrente sélectionnée automatiquement
   - ✅ "Sortir les poubelles" devrait être affichée

2. Tap dropdown **"Tâche récurrente"**
   - ✅ Menu avec toutes les tâches récurrentes
   - Sélectionner une autre tâche
   - ✅ Configuration se met à jour

#### Test 3.3 : Configuration
1. **Card info** :
   - ✅ Fréquence affichée ("Chaque semaine")
   - ✅ Jours affichés ("Mar, Ven")
   - ✅ Assigné actuel affiché ("Marie")

2. **Toggle rotation** :
   - Toggle OFF
   - ✅ Switch devient gris
   - Toggle ON
   - ✅ Switch devient Coral

#### Test 3.4 : Ordre de Rotation
1. **Liste des colocataires** :
   - ✅ 4 colocataires affichés avec avatars emoji
   - ✅ Position 1 a badge "Assigné actuel"
   - ✅ Position 2 a badge "Prochain"
   - ✅ Drag handles visibles (🔀)

2. **Ajouter colocataire** (si < 4 dans rotation) :
   - Tap **"Ajouter un colocataire"**
   - ✅ Colocataire suivant ajouté à la liste
   - ✅ Bouton disparaît si tous ajoutés

#### Test 3.5 : Prochaines Assignations
1. Scroll vers le bas
2. **Section "Prochaines assignations"** :
   - ✅ 4 lignes affichées
   - ✅ Première ligne = "Maintenant"
   - ✅ Dates calculées correctement (espacées selon fréquence)
   - ✅ Ordre des colocataires respecté

**Vérification des dates** :
- Si hebdomadaire : dates espacées de 7 jours
- Si bi-hebdomadaire : 14 jours
- Si mensuel : 1 mois

#### Test 3.6 : Sauvegarde
1. Modifier l'ordre ou la config
2. Tap **"Sauvegarder"**
   - ✅ Bouton visible en haut à droite
   - ✅ Vue se ferme après 500ms (simulated save)

#### Test 3.7 : Empty State
**Pour tester** : Modifier TasksViewModel pour retourner [] dans getRecurringTasks()

1. Ouvrir TaskRotationSettingsView
   - ✅ Icône rotation circulaire Coral
   - ✅ Titre "Aucune tâche récurrente"
   - ✅ Message explicatif
   - ✅ Bouton CTA "Créer une tâche"

2. Tap sur **"Créer une tâche"**
   - ✅ Vue se ferme
   - ✅ CreateTaskView s'ouvre (via viewModel.showCreateTask)

---

### Scénario 4 : TaskStatsView - Statistiques ✅

#### Test 4.1 : Accès à la Vue
**Note** : Ajouter temporairement un bouton pour tester :
```swift
Button("Stats") {
    // Present TaskStatsView
}
```

#### Test 4.2 : Vue d'Ensemble (Onglet 1)
1. Ouvrir TaskStatsView
   - ✅ Onglet "Vue d'ensemble" sélectionné par défaut
   - ✅ Underline Coral visible

2. **Stat Cards** (grid 2x2) :
   - ✅ **Total** : 6 tâches (icône liste bleue)
   - ✅ **Complétées** : 1 tâche, 17% (icône check verte)
   - ✅ **En retard** : 1 tâche (icône warning rouge)
   - ✅ **Aujourd'hui** : 2 tâches (icône calendrier Coral)

3. **Donut Chart** :
   - ✅ Cercle gris complet (background)
   - ✅ Arc vert pour le pourcentage complété
   - ✅ "17%" au centre en grand
   - ✅ "Complété" en dessous

4. **Activité récente** :
   - ✅ Liste de 1 tâche complétée (max 5)
   - ✅ Checkmark vert
   - ✅ "Nettoyer la salle de bain"
   - ✅ "Thomas · il y a 3j" (date relative)

#### Test 4.3 : Sélecteur de Période
1. Tap sur **"Semaine"**
   - ✅ Bouton devient Coral
   - ✅ "Mois" et "Année" deviennent blancs
   - (Stats ne changent pas car pas de filtrage réel en demo)

2. Tap sur **"Année"**
   - ✅ Sélection change visuellement

#### Test 4.4 : Par Personne (Onglet 2)
1. Tap sur onglet **"Par personne"**
   - ✅ Onglet change
   - ✅ Underline Coral se déplace

2. **Leaderboard** :
   - ✅ Liste triée par taux de complétion
   - ✅ Position 1 : Badge 🥇 or avec trophy
   - ✅ Position 2 : Badge 🥈 argent avec medal
   - ✅ Position 3 : Badge 🥉 bronze avec star
   - ✅ Border colorée pour top 3
   - ✅ Pourcentages affichés à droite

**Vérifier ordre** :
- Thomas devrait être en tête (1 tâche complétée)

3. **Graphique de complétion** :
   - ✅ Barres horizontales par personne
   - ✅ Nom + "X tâches"
   - ✅ Progress bar proportionnelle
   - ✅ Couleur Coral
   - ✅ Tri par nombre décroissant

#### Test 4.5 : Par Catégorie (Onglet 3)
1. Tap sur onglet **"Par catégorie"**
   - ✅ Onglet change

2. **Graphique de répartition** :
   - ✅ Barre segmentée horizontale
   - ✅ Différentes couleurs par catégorie
   - ✅ Pourcentages affichés si > 10%
   - ✅ Height 40px

3. **Légende** (grid 2 colonnes) :
   - ✅ Cercles colorés par catégorie
   - ✅ Noms des catégories
   - ✅ Nombres de tâches

**Vérifier catégories** :
- Ménage (Cleaning) : 3 tâches
- Poubelles (Trash) : 1 tâche
- Courses (Shopping) : 1 tâche
- Maintenance : 1 tâche

4. **Liste détaillée** :
   - ✅ Cards par catégorie
   - ✅ Icône dans cercle coloré
   - ✅ Nom + nombre
   - ✅ Chevron droite

---

## 🎯 Checklist Complète

### Build & Launch
- [ ] Projet s'ouvre sans erreur
- [ ] Build réussit (⌘+B)
- [ ] Run en simulateur (⌘+R)
- [ ] App se lance sans crash

### TasksView
- [ ] Liste affiche 6 tâches mock
- [ ] Search bar fonctionne
- [ ] 5 filtres fonctionnent
- [ ] Tri fonctionne (5 options)
- [ ] Swipe left affiche edit/delete
- [ ] Swipe right complète la tâche
- [ ] Pull-to-refresh fonctionne
- [ ] Bouton [+] ouvre CreateTaskView

### CreateTaskView
- [ ] Sheet s'ouvre depuis [+]
- [ ] Tous les champs fonctionnent
- [ ] Validation affiche erreurs
- [ ] Création ajoute tâche à la liste
- [ ] Annulation ferme sans créer
- [ ] Récurrence affiche jours si hebdo
- [ ] Rotation cache le champ assigné

### TaskRotationSettingsView
- [ ] Liste des tâches récurrentes
- [ ] Toggle rotation fonctionne
- [ ] Ordre des colocataires affiché
- [ ] Prochaines assignations calculées
- [ ] Dates espacées correctement
- [ ] Sauvegarde ferme la vue
- [ ] Empty state si pas de tâches

### TaskStatsView
- [ ] 3 onglets switchent correctement
- [ ] Stat cards affichent bonnes valeurs
- [ ] Donut chart affiche 17%
- [ ] Leaderboard trié correctement
- [ ] Badges or/argent/bronze visibles
- [ ] Graphiques par personne corrects
- [ ] Graphique par catégorie correct
- [ ] Période selector change visuellement

---

## 🐛 Problèmes Connus

### À Fixer
1. **Navigation manquante** : TaskRotationSettingsView et TaskStatsView ne sont pas accessibles depuis l'UI
   - **Solution** : Ajouter boutons dans ResidentHubView ou TasksView

2. **Charts natifs** : Donut chart est custom (pas Charts framework)
   - **Solution** : Migrer vers Charts iOS 16+ pour animations

3. **Drag & drop** : UI préparée mais .onMove non implémenté
   - **Solution** : Activer .onMove sur la liste dans TaskRotationSettingsView

### Limitations Demo
- Mock data hardcodée
- Pas de persistance
- Pas de filtrage par période réel
- Pas d'upload photo

---

## ✅ Résultats Attendus

Si tous les tests passent :
- ✅ **Sprint 2 est 100% fonctionnel en mode demo**
- ✅ **Prêt pour integration backend**
- ✅ **UX validée**
- ✅ **Code production-ready**

---

## 📝 Rapport de Test

Après avoir complété tous les scénarios, remplir :

**Date** : _______________
**Testeur** : _______________
**Simulator** : iPhone 15 / iOS 17+

### Résumé
- Tests réussis : _____ / _____
- Tests échoués : _____ / _____
- Bugs trouvés : _____

### Bugs Identifiés
1. ________________________________
2. ________________________________
3. ________________________________

### Commentaires
________________________________
________________________________

---

## 🚀 Prochaines Étapes

Après validation :
1. ✅ Fixer les bugs identifiés
2. ✅ Ajouter navigation manquante
3. ✅ Connecter au backend Supabase
4. ✅ Implémenter photo upload (Phase 4)
5. ✅ Passer au Sprint 3 (Dépenses)

---

**Bon test !** 🧪
