# 📋 Checklist de Test - Dashboard Résident iOS

## 🎯 Objectif
Vérifier que toutes les fonctionnalités du dashboard résident fonctionnent correctement avec l'architecture MVVM et les animations.

## ✅ Tests à Effectuer

### 1. Chargement Initial du Dashboard
- [ ] L'app se lance sans crash
- [ ] Le splash screen/login apparaît correctement
- [ ] Après connexion, le dashboard résident s'affiche
- [ ] **Loading state** : Observer le délai de 0.5s (isLoading)
- [ ] **Animations** : Vérifier l'effet cascade des sections qui apparaissent
  - Header apparaît en premier
  - Propriété apparaît avec un léger décalage
  - Paiement, charges, actions rapides suivent en cascade

### 2. Section Propriété Actuelle
- [ ] **Image** : Photo placeholder s'affiche
- [ ] **Titre** : "Appartement 2 chambres - Ixelles"
- [ ] **Localisation** : "Rue de la Paix 42, 1050 Ixelles"
- [ ] **Détails** : 2 chambres, 1 SDB, 75m²
- [ ] **Bail** : Dates de début et fin affichées
- [ ] **Loyer** : 950€ affiché

### 3. Section Prochain Paiement
- [ ] **Montant** : 950€ en grand et en couleur Resident.primary
- [ ] **Date d'échéance** : "Dans Xj" (calculé dynamiquement)
- [ ] **Couleur warning** si < 7 jours
- [ ] **Bouton "Payer maintenant"** :
  - [ ] Feedback haptique au clic
  - [ ] Animation scale (légère compression)
  - [ ] Gradient residentCTA visible

### 4. Section Répartition des Charges
- [ ] **Donut chart** s'affiche
- [ ] **4 segments** visibles :
  - Loyer : 950€ (Resident.primary)
  - Charges : 150€ (Resident._300)
  - Internet : 40€ (Resident._400)
  - Électricité : 80€ (Resident._600)
- [ ] **Légende** affichée en dessous

### 5. Actions Rapides (Grid 2x2)
- [ ] **4 cartes** affichées avec icônes et couleurs différentes
- [ ] **Maintenance** (Resident._400) → Navigue vers MaintenanceView
- [ ] **Documents** (Resident._300) → Navigue vers DocumentsListView
- [ ] **Contacter** (Resident._600) → Navigue vers MessagesListView
- [ ] **Historique** (Resident._700) → Navigue vers PaymentHistoryView
- [ ] Animation au tap sur chaque carte

### 6. Historique des Paiements
- [ ] **Titre** "Historique des paiements" + "Voir tout"
- [ ] **4 paiements** affichés (maximum)
- [ ] Pour chaque paiement :
  - [ ] Icône de statut (✓ vert pour payé, horloge pour pending)
  - [ ] Montant : 950€
  - [ ] Statut coloré selon l'état
  - [ ] Date du paiement
- [ ] Tap sur "Voir tout" → PaymentHistoryView

### 7. Demandes de Maintenance
- [ ] **2 demandes** affichées
- [ ] **Demande 1** : "Fuite d'eau" - En cours - Priorité haute (rouge)
- [ ] **Demande 2** : "Ampoule grillée" - En attente - Priorité basse
- [ ] Badge de statut coloré
- [ ] Badge de priorité
- [ ] Description tronquée sur 2 lignes
- [ ] "Il y a Xj" calculé dynamiquement
- [ ] Bouton "+ Nouvelle" fonctionnel avec feedback haptique

### 8. Documents
- [ ] **3 documents** affichés (maximum)
- [ ] Icônes différentes selon le type :
  - Contrat : icône document
  - État des lieux : icône checklist
  - Quittance : icône reçu
- [ ] Dates formatées correctement
- [ ] Taille de fichier affichée
- [ ] Bouton téléchargement (icône flèche vers le bas)
- [ ] Tap sur "Voir tout" → DocumentsListView

## 🧪 Tests de Navigation

### DocumentsListView
- [ ] Navigation depuis le dashboard fonctionne
- [ ] Titre "Mes Documents" affiché
- [ ] **État vide** : Message "Aucun document" si pas de données
- [ ] Liste des documents (si données présentes)
- [ ] Bouton retour fonctionne

### PaymentHistoryView
- [ ] Navigation depuis le dashboard fonctionne
- [ ] Titre "Historique des paiements" affiché
- [ ] **Filtres** (pills horizontales) :
  - [ ] "Tous" (par défaut sélectionné)
  - [ ] "Payés"
  - [ ] "En attente"
  - [ ] "En retard"
  - [ ] Changement de filtre met à jour la liste
- [ ] **2 paiements mockés** :
  - 1 pending (850€)
  - 1 payé (850€)
- [ ] Icônes et couleurs correctes selon le statut
- [ ] **État vide** si filtre ne retourne rien
- [ ] Bouton retour fonctionne

### SettingsView
- [ ] Icône settings en haut à droite du dashboard
- [ ] Navigation fonctionne
- [ ] Vue settings s'affiche (déjà existante)

### MaintenanceView
- [ ] Navigation depuis "Actions rapides"
- [ ] Vue maintenance s'affiche (déjà existante)

### MessagesListView
- [ ] Navigation depuis "Actions rapides"
- [ ] Vue messages s'affiche (déjà existante)

## 🎨 Tests Visuels

### Thème et Couleurs
- [ ] Toutes les couleurs utilisent `Theme.Colors.Resident.*`
- [ ] Gradient du bouton paiement utilise `residentCTA`
- [ ] Background : `Theme.Colors.backgroundSecondary`
- [ ] Cartes : `Theme.Colors.backgroundPrimary`
- [ ] Ombres des cartes visibles (`cardShadow()`)

### Animations
- [ ] **Entrée en cascade** des sections (staggered)
- [ ] **Spring animation** sur les cartes (bounce léger)
- [ ] **Scale effect** sur les boutons au tap
- [ ] **Smooth transitions** entre les vues
- [ ] Pas de lag ou de saccades

### Typography
- [ ] Titres : `Theme.Typography.title3()`
- [ ] Corps : `Theme.Typography.body()`
- [ ] Petits textes : `Theme.Typography.bodySmall()`
- [ ] Police cohérente partout

## 🔍 Tests Techniques

### Performance
- [ ] Chargement en < 1s (0.5s de simulation réseau)
- [ ] Scroll fluide dans le dashboard
- [ ] Pas de freeze lors du chargement
- [ ] Animations à 60fps

### État de l'App
- [ ] Aucun crash
- [ ] Aucune erreur dans la console (sauf warnings normaux)
- [ ] Logs de debug visibles :
  ```
  ✅ Dashboard data loaded successfully
  ```

### Gestion des Erreurs
- [ ] Si une erreur survient, `viewModel.error` est set
- [ ] Message d'erreur affiché à l'utilisateur (si implémenté)
- [ ] Fallback aux données mockées fonctionne

## 📊 Résultats Attendus

### ✅ Critères de Succès
- **Toutes les vues** s'affichent correctement
- **Toutes les navigations** fonctionnent
- **Toutes les animations** sont fluides
- **Toutes les données mockées** s'affichent
- **Aucun crash** ni erreur critique
- **Design cohérent** avec le système de thème

### ⚠️ Problèmes Potentiels
Si vous rencontrez des problèmes :
1. Vérifier les logs Xcode pour les erreurs
2. Vérifier que le bon user_type est défini (resident)
3. Vérifier que l'authentification fonctionne
4. Nettoyer le build folder (Cmd+Shift+K)

## 🚀 Prochaines Étapes Après Tests

Une fois tous les tests validés :
1. ✅ Marquer l'interface comme **prête pour démo client**
2. 🔄 Commencer l'intégration Supabase réelle
3. 🔄 Implémenter le système de paiement
4. 📝 Documenter les éventuels bugs trouvés

---

**Date de création** : 4 décembre 2025
**Version** : iOS Dashboard Résident v1.0
**Status** : Architecture MVVM complète avec données mockées
