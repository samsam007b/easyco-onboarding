# Plan de Migration Méthodique Web → iOS

**Objectif** : Migrer l'app iOS pour qu'elle ressemble **visuellement** au web (design V3-fun) tout en restant native SwiftUI.

**Basé sur** : Recherches best practices 2025-2026 + analyse de nos échecs Phase 1-2.

---

## 📚 Recherches Effectuées

### Sources Consultées

1. [SwiftUI Design System Guide 2025](https://dev.to/swift_pal/swiftui-design-system-a-complete-guide-to-building-consistent-ui-components-2025-299k)
2. [Pixel-Perfect UI in SwiftUI](https://medium.com/@garejakirit/creating-pixel-perfect-ui-design-in-swiftui-c937d2e81578)
3. [Design Tokens at Halodoc](https://blogs.halodoc.io/simplifying-ios-app-design-with-design-tokens/)
4. [Legacy Migration to SwiftUI without Freezing Roadmap](https://medium.com/@maatheusgois/legacy-migration-to-swiftui-without-freezing-your-roadmap-8d6bb2304d10)
5. [SwiftUI Migration Strategies](https://dev.to/sebastienlato/swiftui-app-migration-strategies-uikit-swiftui-legacy-modern-kp7)

### Principes Clés Identifiés

**1. Design Tokens** (Amazon Style Dictionary) :
- YAML/JSON centralisé
- Génération multi-plateforme (web CSS + iOS Swift)
- **Notre cas** : On a déjà `brand-identity/izzico-color-system.html` → extraire en tokens

**2. Pixel-Perfect SwiftUI** :
- `.font(.custom())` avec tailles exactes (pas `.title`, `.body`)
- `.frame(width:height:)` précis
- Spacing manuel : `VStack(spacing: 12)` (pas defaults)

**3. Migration Incrémentale ("Strangler Pattern")** :
- Feature flags pour router legacy vs nouveau
- Chaque étape réversible et shippable
- Commencer par modules non-critiques (Settings, Onboarding)
- **Jamais bloquer** la possibilité de ship

**4. Éviter le Look Natif iOS** :
- Custom components partout (pas List, Form, etc.)
- BorderRadius personnalisés (24px cards, 16px buttons)
- Couleurs custom (pas system colors)
- Polices custom (Nunito, Inter, Fredoka)

---

## 🎯 Notre Approche : Strangler Pattern Adapté

### Principe

**Strangler Fig** : Comme une figue étrangleuse qui pousse autour d'un arbre, on remplace progressivement les vues legacy par des vues IzzicoWeb.

**Implémentation** :

```swift
// AppConfig.swift
struct FeatureFlags {
    static var useIzzicoWebLogin: Bool = true  // Toggle par vue
    static var useIzzicoWebDashboard: Bool = false
    static var useIzzicoWebProperties: Bool = false
    // etc.
}

// ContentView.swift
var body: some View {
    if FeatureFlags.useIzzicoWebLogin {
        LoginViewIzzicoWeb()  // Nouvelle version
    } else {
        LoginView()  // Legacy
    }
}
```

**Bénéfice** : Rollback instantané si problème, shipping jamais bloqué.

---

## 📋 Plan d'Action Méthodique

### Phase 0 : Préparation (Jour 1)

#### 0.1 Audit Initial
- [ ] Lister TOUTES les vues existantes (script)
- [ ] Identifier Models/Types existants (Event, Property, etc.)
- [ ] Documenter dépendances entre vues

#### 0.2 Design Tokens Centralisés
- [ ] Extraire `brand-identity/izzico-color-system.html` → `DesignTokens.json`
- [ ] Script génération Swift depuis JSON
- [ ] Vérifier 100% conformité

**Fichier à créer** : `DesignTokens.json`
```json
{
  "colors": {
    "owner": {
      "50": "#F8F0F7",
      "500": "#9c5698",
      "900": "#2E1A38"
    },
    "resident": { "50": "#FEF2EE", "500": "#e05747", "900": "#4E1C16" },
    "searcher": { "50": "#FFFBEB", "500": "#ffa000", "900": "#4D3000" }
  },
  "spacing": { "xs": 4, "sm": 8, "md": 12, "lg": 16, "xl": 20, "xxl": 24, "xxxl": 32 },
  "radius": { "small": 12, "medium": 16, "large": 20, "xLarge": 24, "xxLarge": 28, "pill": 100 }
}
```

#### 0.3 Feature Flags Setup
- [ ] Créer `MigrationCoordinator.swift`
- [ ] Feature flag par vue (40+ flags)
- [ ] Dashboard de monitoring (optionnel)

**Fichier à créer** : `Core/Migration/MigrationCoordinator.swift`

---

### Phase 1 : Design System Solidifié (Jour 2-3)

**Status actuel** : IzzicoWebDesignSystem existe mais pas testé isolément.

#### 1.1 Test Design System Isolé
- [ ] Créer projet Xcode test "IzzicoWebComponentsPreview"
- [ ] Importer seulement les 5 fichiers Design System
- [ ] Créer Previews pour chaque composant (60+)
- [ ] Build → doit SUCCEED
- [ ] Capturer screenshots

**Bénéfice** : Design System validé **avant** de l'utiliser.

#### 1.2 Documentation Composants
- [ ] Créer `DESIGN_SYSTEM_COMPONENTS.md`
- [ ] Screenshot + code exemple pour chaque composant
- [ ] Mapping web → iOS : quel composant web = quel composant iOS

**Exemple** :
```markdown
## WebInputField

**Usage Web** : `<input className="web-input" />`
**Usage iOS** : `WebInputField(label:placeholder:text:icon:)`

Screenshot : [input-field.png]
```

---

### Phase 2 : Migration Vue par Vue (Semaines 1-4)

**Principe** : 1 vue/jour maximum, testée, validée.

#### Ordre de Migration (Priorité Business)

**Semaine 1 : Auth & Onboarding (Non-critique)**

| Jour | Vue | Complexité | Feature Flag |
|------|-----|------------|--------------|
| J1 | LoginView | Basse | `useIzzicoWebLogin` |
| J2 | SignupView | Basse | `useIzzicoWebSignup` |
| J3 | ForgotPasswordView | Basse | `useIzzicoWebForgotPassword` |
| J4 | RoleSelectionView | Moyenne | `useIzzicoWebRoleSelection` |
| J5 | OnboardingView (container) | Moyenne | `useIzzicoWebOnboarding` |

**Semaine 2 : Dashboard (Critique mais simple)**

| Jour | Vue | Complexité | Feature Flag |
|------|-----|------------|--------------|
| J6 | SearcherDashboardView | Haute | `useIzzicoWebSearcherDashboard` |
| J7 | OwnerDashboardView | Haute | `useIzzicoWebOwnerDashboard` |
| J8 | ResidentDashboardView | Haute | `useIzzicoWebResidentDashboard` |
| J9-J10 | Tests visuels + polish | - | - |

**Semaine 3 : Properties (Critique)**

| Jour | Vue | Complexité |
|------|-----|------------|
| J11-J12 | PropertiesListView | Haute (consolidation V1-V5) |
| J13 | PropertyDetailView | Moyenne |
| J14 | FiltersView (basique, pas 80+ filtres) | Moyenne |
| J15 | Tests + polish | - |

**Semaine 4 : Messages + Profile**

| Jour | Vue | Complexité |
|------|-----|------------|
| J16 | ConversationsListView | Moyenne |
| J17 | ChatView | Moyenne |
| J18 | ProfileView | Moyenne |
| J19 | SettingsView | Haute (redesign complet) |
| J20 | Tests + polish | - |

---

### Phase 3 : Features Signature (Semaines 5-6)

**Approche différente** : Features **NOUVELLES** (pas migration).

**Semaine 5 : Swipe Matching**

| Jour | Tâche |
|------|-------|
| J21 | Architecture (Models, ViewModel) |
| J22 | SwipeCardStack (gestures) |
| J23 | Like/Pass buttons |
| J24 | Match celebration |
| J25 | Tests + polish |

**Semaine 6 : Hub Events + Map**

| Jour | Tâche |
|------|-------|
| J26 | HubEventsView (réutilise Models/Event existant) |
| J27 | MapView (MapKit basics) |
| J28 | PropertyMapAnnotation |
| J29 | Toggle List/Map |
| J30 | Tests + polish |

---

## 🔧 Workflow par Vue (Checklist)

### Avant de Commencer

- [ ] **Lire la vue legacy** entièrement
- [ ] **Identifier types/models utilisés** (Event? Property? Expense?)
- [ ] **Vérifier si types existent** dans Models/ (grep)
- [ ] **Capturer screenshot legacy** (baseline)

### Pendant la Migration

- [ ] **Créer fichier IzzicoWeb** (ex: LoginViewIzzicoWeb.swift)
- [ ] **Importer types existants** (pas redéclarer!)
- [ ] **Utiliser composants IzzicoWeb** uniquement
- [ ] **Respecter tokens** : couleurs, spacing, radius, typography
- [ ] **Build après chaque section** (header, form, buttons)
- [ ] **Pas d'accumulation d'erreurs**

### Après la Migration

- [ ] **Build SUCCEEDED**
- [ ] **Capturer screenshot nouveau**
- [ ] **Comparer** legacy vs nouveau (diff visuel)
- [ ] **Feature flag ON** : tester en simulateur
- [ ] **Valider visuellement** avec web (côte à côte)
- [ ] **Commit** avec message descriptif
- [ ] **Push** (sauvegarde quotidienne)

---

## 🚫 Règles Strictes (Anti-Chaos)

### NE JAMAIS

1. ❌ Lancer plusieurs agents en parallèle sur des features liées
2. ❌ Créer un type (struct, enum, class) sans grep avant
3. ❌ Accumuler plus de 5 erreurs de build
4. ❌ Modifier plus d'1 vue sans build intermédiaire
5. ❌ Travailler sans feature flag (pas de rollback possible)
6. ❌ Copier-coller du code web sans adapter à Swift
7. ❌ Utiliser des noms génériques (Event, Invoice) dans fichiers vues

### TOUJOURS

1. ✅ Grep pour vérifier existence d'un type avant de le créer
2. ✅ Build après chaque modification de 50 lignes
3. ✅ Feature flag pour chaque vue migrée
4. ✅ Screenshot avant/après pour validation
5. ✅ Commit quotidien (même si incomplet)
6. ✅ Utiliser types existants de Models/ (pas redéclarer)
7. ✅ Préfixer types locaux (HubEvent, DashboardProperty, etc.)

---

## 🛠️ Outils à Créer

### 1. Script de Vérification Pre-Migration

**Fichier** : `scripts/check_before_migrate.sh`

```bash
#!/bin/bash

VIEW_NAME=$1

echo "🔍 Vérification avant migration de $VIEW_NAME..."

# Check types utilisés
grep -rn "struct\|enum\|class" "Features/OldPath/$VIEW_NAME.swift" | \
  while read line; do
    TYPE=$(echo $line | grep -oE "(struct|enum|class) \w+" | awk '{print $2}')
    echo "Type trouvé : $TYPE"

    # Vérifier si existe dans Models/
    if grep -q "struct $TYPE\|enum $TYPE\|class $TYPE" Models/*.swift; then
      echo "  ⚠️  ATTENTION : $TYPE existe déjà dans Models/"
    else
      echo "  ✅ $TYPE peut être créé"
    fi
  done
```

### 2. Script de Test Visuel

**Fichier** : `scripts/visual_diff.sh`

```bash
#!/bin/bash

# Capture screenshot simulateur
# Compare avec web screenshot (ImageMagick)
# Output : diff.png avec zones différentes en rouge
```

### 3. Migration Dashboard (Optionnel)

**Fichier** : `MIGRATION_PROGRESS.md` (auto-généré)

```markdown
| Vue | Status | Feature Flag | Screenshot | Notes |
|-----|--------|--------------|------------|-------|
| LoginView | ✅ Done | ON | [login.png] | Gradient signature OK |
| SignupView | 🔄 WIP | OFF | - | En cours |
| Dashboard | ⏳ Todo | OFF | - | Après Auth |
```

---

## 📐 Design Tokens : La Clé

### Problème Actuel

**Web** : CSS Variables dans `app/globals.css`
```css
:root {
  --owner-500: #9c5698;
  --spacing-lg: 16px;
  --radius-card: 24px;
}
```

**iOS** : Hardcodé dans `IzzicoWebDesignSystem.swift`
```swift
static let owner500 = Color(hex: "9c5698")
static let lg: CGFloat = 16
static let card: CGFloat = 24
```

**Risque** : Désynchronisation (web change couleur → iOS pas updaté).

### Solution : Source de Vérité Unique

**Fichier master** : `design-tokens.json` (nouveau)

```json
{
  "colors": {
    "owner": {
      "50": "#F8F0F7",
      "500": "#9c5698",
      "900": "#2E1A38"
    }
  },
  "spacing": { "lg": 16 },
  "radius": { "card": 24 }
}
```

**Génération** :
- `scripts/generate-css.js` → `app/globals.css`
- `scripts/generate-swift.js` → `IzzicoWebDesignSystem.swift`

**Bénéfice** : 1 changement → web + iOS synchronisés automatiquement.

---

## 🎨 Spécificité : Custom Design (Pas Natif iOS)

### Approche

**Ce qu'on NE fait PAS** :
- ❌ Utiliser `List`, `Form`, `NavigationStack` defaults
- ❌ Utiliser system colors (`Color.primary`, `.secondary`)
- ❌ Utiliser system fonts (SF Pro)
- ❌ Suivre Human Interface Guidelines d'Apple

**Ce qu'on FAIT** :
- ✅ Custom components partout (WebInputField, WebButton, etc.)
- ✅ Couleurs brand (#9c5698, #e05747, #ffa000)
- ✅ Polices custom (Nunito, Inter, Fredoka)
- ✅ Radius custom (24px cards, 16px buttons)
- ✅ Shadows custom (soft, subtle)
- ✅ Animations custom (spring physics)

### Exemple Concret

**Natif iOS** :
```swift
List {
    ForEach(items) { item in
        Text(item.name)
    }
}
.listStyle(.insetGrouped)
```

**Izzico Custom** :
```swift
ScrollView {
    VStack(spacing: IzzicoWeb.Spacing.md) {
        ForEach(items) { item in
            HStack {
                Text(item.name)
                    .font(IzzicoWeb.Typography.bodyRegular())
            }
            .padding(IzzicoWeb.Spacing.lg)
            .background(IzzicoWeb.Colors.white)
            .cornerRadius(IzzicoWeb.Radius.xLarge)
            .webShadow(IzzicoWeb.Shadows.soft)
        }
    }
}
```

---

## 📅 Planning Détaillé Semaine 1 (Exemple)

### Lundi - LoginView

**Matin (3h)** :
1. Audit LoginView legacy (1h)
   - Lire code
   - Screenshot baseline
   - Identifier types utilisés

2. Migration (1.5h)
   - Créer LoginViewIzzicoWeb.swift
   - Header avec WebAuthHeader
   - Form avec WebInputField
   - Buttons avec WebPrimaryButton

3. Tests (0.5h)
   - Build
   - Simulateur
   - Screenshot nouveau
   - Diff visuel

**Après-midi (2h)** :
1. Feature flag (0.5h)
   - Ajouter `FeatureFlags.useIzzicoWebLogin`
   - Router dans ContentView

2. Polish (1h)
   - Animations
   - Couleurs exactes
   - Spacing précis

3. Validation (0.5h)
   - Comparaison web (375px)
   - Commit + push

### Mardi - SignupView

*Même workflow...*

---

## 🔄 Gestion des Redéclarations (Leçon Apprise)

### Règle d'Or

**AVANT de créer un type** :

```bash
# 1. Grep dans Models/
grep -rn "struct MyType\|enum MyType\|class MyType" Models/

# 2. Si existe → UTILISER (pas redéclarer)
# 3. Si n'existe pas → Créer dans Models/ (pas dans la vue)
```

### Pattern de Naming

**Si type spécifique à une feature** :

```swift
// ❌ MAUVAIS (générique, conflit probable)
enum EventType { ... }

// ✅ BON (préfixé, clair)
enum HubEventType { ... }
```

**Si type réutilisable** → toujours dans `Models/`

---

## 📊 Métriques de Succès

### Par Vue

- ✅ Build SUCCEEDED
- ✅ Screenshot match web à 90%+
- ✅ 0 warning de couleur hardcodée
- ✅ Feature flag fonctionne (toggle legacy/nouveau)
- ✅ Accessibility VoiceOver basique OK

### Par Semaine

- ✅ 5 vues migrées minimum
- ✅ 0 régression sur vues précédentes
- ✅ App shippable à tout moment

### Global

- ✅ 100% vues utilisent IzzicoWeb
- ✅ 0 couleur hardcodée restante
- ✅ Design tokens synchronisés web/iOS
- ✅ Conformité V3-fun validée

---

## 🚀 Démarrage Immédiat

**Action pour aujourd'hui** :

1. ✅ **Validation du plan** par toi
2. ⏳ **Je crée** :
   - `DesignTokens.json`
   - `MigrationCoordinator.swift`
   - `scripts/check_before_migrate.sh`
   - `DESIGN_SYSTEM_COMPONENTS.md`
3. ⏳ **Je migre LoginView** (1 seule vue, proprement)
4. ⏳ **Build SUCCEEDED**
5. ⏳ **Screenshot comparaison**
6. ⏳ **Commit "feat: migrate LoginView to IzzicoWeb design"**

**Si tout OK** → on continue SignupView demain.

**Si problème** → on fixe ensemble avant de continuer.

---

## 🎯 Différence avec Avant

| Avant (Phase 1-2) | Maintenant (Plan Méthodique) |
|-------------------|------------------------------|
| 7-13 agents parallèles | 0 agent (moi seul, focus) |
| 100+ fichiers d'un coup | 1 fichier/jour |
| Pas de feature flags | Feature flag par vue |
| Pas de validation intermédiaire | Build + screenshot après chaque vue |
| Redéclarations massives | Grep avant chaque type |
| Régression | Progression stable |

---

## ✅ Validation

**Samuel, tu valides ce plan ?**

Si oui, je commence immédiatement par créer les outils (DesignTokens.json, MigrationCoordinator, scripts) puis je migre LoginView proprement aujourd'hui.

**Estimation réaliste** : 4 semaines pour migration complète, stable, sans régression.

**Sources** :
- [SwiftUI Design System 2025](https://dev.to/swift_pal/swiftui-design-system-a-complete-guide-to-building-consistent-ui-components-2025-299k)
- [Pixel-Perfect SwiftUI](https://medium.com/@garejakirit/creating-pixel-perfect-ui-design-in-swiftui-c937d2e81578)
- [Design Tokens Halodoc](https://blogs.halodoc.io/simplifying-ios-app-design-with-design-tokens/)
- [Legacy Migration without Freezing Roadmap](https://medium.com/@maatheusgois/legacy-migration-to-swiftui-without-freezing-your-roadmap-8d6bb2304d10)
- [Migration Strategies](https://dev.to/sebastienlato/swiftui-app-migration-strategies-uikit-swiftui-legacy-modern-kp7)
