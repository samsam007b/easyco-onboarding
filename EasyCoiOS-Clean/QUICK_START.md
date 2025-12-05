# 🚀 Guide de Démarrage Rapide - EasyCo iOS

## 📱 Lancer l'App sur le Simulateur

### Option 1 : Via Xcode (Recommandé)
```bash
# 1. Ouvrir le projet dans Xcode
open /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo/EasyCo.xcodeproj

# 2. Dans Xcode :
#    - Sélectionner "EasyCo" comme scheme (en haut, à gauche de "iPhone 15")
#    - Sélectionner "iPhone 15" comme destination
#    - Appuyer sur Cmd+R ou cliquer sur le bouton Play ▶️
```

### Option 2 : Via Ligne de Commande
```bash
cd /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo

# Build et run sur simulateur
xcodebuild -project EasyCo.xcodeproj \
  -scheme EasyCo \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  -derivedDataPath /tmp/EasyCo-build \
  build

# Lancer le simulateur
open -a Simulator

# Installer l'app (après le build)
xcrun simctl install booted /tmp/EasyCo-build/Build/Products/Debug-iphonesimulator/EasyCo.app

# Lancer l'app
xcrun simctl launch booted com.easyco.app
```

## 🧪 Tester le Dashboard Résident

### Étape 1 : Se Connecter
1. Au lancement, l'écran de connexion s'affiche
2. Se connecter avec un compte "resident"
3. Le profil sera chargé depuis Supabase

### Étape 2 : Vérifier le Dashboard
Une fois connecté avec `user_type = "resident"`, vous devriez voir :

#### ✅ Écran Principal
- **Header** : "Bienvenue chez vous ! 🏠"
- **Propriété** : Carte avec photo, détails, bail
- **Paiement** : Prochain loyer à payer avec bouton gradient
- **Charges** : Graphique en donut avec répartition
- **Actions Rapides** : 4 cartes (Maintenance, Documents, Contacter, Historique)
- **Historique** : 4 derniers paiements
- **Maintenance** : 2 demandes en cours
- **Documents** : 3 documents disponibles

#### 🎨 Animations à Observer
1. **Chargement initial** : Délai de 0.5s puis affichage en cascade
2. **Effet spring** : Les cartes "rebondissent" légèrement en apparaissant
3. **Boutons** : Compression au tap avec feedback haptique
4. **Navigation** : Transitions fluides entre les vues

### Étape 3 : Tester la Navigation
Cliquer sur chaque élément pour vérifier :
- ⚙️ **Settings** (icône en haut à droite)
- 🔧 **Maintenance** (action rapide)
- 📄 **Documents** (action rapide) → DocumentsListView
- 💬 **Contacter** (action rapide) → MessagesListView
- 📅 **Historique** (action rapide) → PaymentHistoryView avec filtres

## 📊 Données Mockées Affichées

### Propriété
- **Titre** : Appartement 2 chambres - Ixelles
- **Localisation** : Rue de la Paix 42, 1050 Ixelles
- **Détails** : 2 chambres, 1 SDB, 75m²
- **Loyer** : 950€/mois

### Paiement
- **Prochain** : 950€ dans 5 jours
- **Historique** : 4 paiements passés (tous payés)

### Charges
- Loyer : 950€
- Charges : 150€
- Internet : 40€
- Électricité : 80€
- **Total** : 1220€

### Maintenance
1. "Fuite d'eau dans la cuisine" - En cours - Priorité haute
2. "Ampoule grillée dans le salon" - En attente - Priorité basse

### Documents
1. "Contrat de location" - 2.4 MB
2. "État des lieux d'entrée" - 5.1 MB
3. "Quittance Novembre 2025" - 245 KB

## 🐛 Debugging

### Voir les Logs
Dans Xcode, ouvrir la console (Cmd+Shift+Y) pour voir :
```
✅ Dashboard data loaded successfully
```

### Build Clean si Nécessaire
```bash
# Si vous avez des problèmes, nettoyer le build
cd /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo
xcodebuild clean -project EasyCo.xcodeproj -scheme EasyCo
```

### Vérifier les Simulateurs Disponibles
```bash
xcrun simctl list devices
```

## 📱 Simulateurs Recommandés

### Pour Tester
- **iPhone 15** (par défaut)
- **iPhone 15 Pro Max** (pour grand écran)
- **iPhone SE (3rd gen)** (pour petit écran)

### Changer de Simulateur
```bash
# Dans la commande xcodebuild, remplacer :
-destination 'platform=iOS Simulator,name=iPhone 15'
# Par :
-destination 'platform=iOS Simulator,name=iPhone 15 Pro Max'
```

## 🎯 Checklist de Test Complète

Consulter [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) pour la liste exhaustive des tests à effectuer.

## 📝 Fichiers Importants

### Code Principal
- `EasyCo/Features/Dashboard/ResidentDashboardView.swift` - Vue principale
- `EasyCo/Features/Dashboard/DashboardViewModels.swift` - ViewModel avec données
- `EasyCo/Features/Documents/DocumentsListView.swift` - Liste des documents
- `EasyCo/Features/Payments/PaymentHistoryView.swift` - Historique des paiements

### Documentation
- `RESIDENT_INTERFACE_STATUS.md` - État complet de l'interface
- `TESTING_CHECKLIST.md` - Checklist de test détaillée
- `QUICK_START.md` - Ce fichier

## 🚨 Troubleshooting

### L'app crash au démarrage
- Vérifier que Supabase est configuré
- Vérifier les credentials dans `.env.local`
- Nettoyer le build (Cmd+Shift+K dans Xcode)

### Les données ne s'affichent pas
- Vérifier que `user_type = "resident"` dans le profil
- Vérifier les logs pour `✅ Dashboard data loaded successfully`
- Vérifier que `viewModel.isLoading` passe bien à `false`

### Animations ne fonctionnent pas
- Vérifier que "Reduce Motion" est désactivé dans le simulateur :
  Settings → Accessibility → Motion → Reduce Motion = OFF

### Build FAILED
```bash
# Nettoyer complètement
cd /Users/samuelbaudon/easyco-onboarding/EasyCoiOS-Clean/EasyCo
rm -rf ~/Library/Developer/Xcode/DerivedData/EasyCo-*
xcodebuild clean -project EasyCo.xcodeproj -scheme EasyCo
xcodebuild -project EasyCo.xcodeproj -scheme EasyCo -sdk iphonesimulator build
```

## ✅ Prêt pour Production?

### Ce qui fonctionne :
- ✅ Architecture MVVM complète
- ✅ Toutes les vues implémentées
- ✅ Animations fluides
- ✅ Navigation complète
- ✅ Design uniformisé
- ✅ Données mockées structurées

### À faire avant production :
- ✅ ~~Remplacer les données mockées par Supabase~~ **TERMINÉ !**
- 🔄 Implémenter le paiement en ligne
- 🔄 Ajouter la création de demandes de maintenance
- 🔄 Permettre le téléchargement de documents
- 🔄 Tests utilisateurs réels

---

## 🎉 Nouvelles Fonctionnalités Supabase

### ✅ Intégrations Supabase Complètes
- ✅ **Properties List** : Les 5 propriétés s'affichent depuis Supabase
- ✅ **Resident Dashboard** : Propriété active + paiements + historique
- ✅ **Owner Dashboard** : Propriétés + candidatures + analytics
- ✅ **Favorites** : Add/Remove avec Supabase
- ✅ **Applications** : Soumettre une candidature

### 🧪 Test Rapide Supabase

**Explorer (Properties List)** :
```
1. Va dans "Explorer"
2. ✅ Tu devrais voir les 5 propriétés de la web app
```

**Console logs attendus** :
```
🏠 Fetching properties from Supabase...
✅ Loaded 5 properties from Supabase
```

**Resident Dashboard** :
```
1. Connecte-toi avec un compte résident
2. Va dans "Dashboard"
3. ✅ Propriété active + paiements s'affichent
```

**Console logs attendus** :
```
🔍 Loading dashboard for user: <user-id>
✅ Found active property membership: <property-id>
✅ Property loaded: Appartement 2 chambres
✅ Dashboard loaded from Supabase
```

### 📚 Documentation Supabase
- [`SUPABASE_COMPLETE_INTEGRATION.md`](SUPABASE_COMPLETE_INTEGRATION.md) - Guide complet
- [`INTEGRATION_SUMMARY.md`](INTEGRATION_SUMMARY.md) - Résumé rapide

---

**Dernière mise à jour** : 4 décembre 2025
**Version** : 2.0 - **Intégration Supabase Complète** 🎉
**Status** : ✅ BUILD SUCCEEDED - **Toutes les intégrations Supabase terminées !**
