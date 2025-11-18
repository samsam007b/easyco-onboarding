# 🌍 Internationalization (i18n) Implementation - EasyCo iOS

Documentation complète de l'implémentation du système multi-langue dans l'application iOS EasyCo.

---

## 📋 Vue d'ensemble

L'application iOS utilise un **système i18n natif Swift** inspiré de l'implémentation React de la web app. Le système supporte 4 langues avec une architecture légère et performante.

### Langues supportées

| Code | Langue | Flag | Statut |
|------|--------|------|--------|
| `fr` | Français | 🇫🇷 | Default |
| `en` | English | 🇬🇧 | ✅ |
| `nl` | Nederlands | 🇳🇱 | ✅ |
| `de` | Deutsch | 🇩🇪 | ✅ |

---

## 📁 Structure des fichiers

```
EasyCo/
├── Core/
│   └── i18n/
│       ├── Language.swift           # Enum des langues
│       ├── LanguageManager.swift    # Gestionnaire de langue (Singleton)
│       └── Translations.swift       # Toutes les traductions
├── Components/
│   └── Settings/
│       ├── LanguageSelectorView.swift   # Sélecteur compact
│       └── LanguagePickerView.swift     # Sheet de sélection
└── EasyCoApp.swift                  # Injection du LanguageManager
```

---

## 🎯 Fonctionnalités implémentées

### ✅ Core Features

- [x] Support de 4 langues (FR, EN, NL, DE)
- [x] LanguageManager singleton avec Combine
- [x] Persistance dans UserDefaults
- [x] Changement de langue en temps réel (réactif)
- [x] Traductions structurées par section
- [x] Fallback automatique vers le français
- [x] Intégration SwiftUI avec `@EnvironmentObject`

### ✅ UI Components

- [x] LanguagePickerView (sheet full-screen)
- [x] LanguageSelectorView (compact switcher)
- [x] Intégration dans SettingsView
- [x] Animation de sélection
- [x] Indicateur visuel de langue active

### ✅ Refactored Views

- [x] LoginView (exemple complet)
- [ ] PropertiesListView (TODO)
- [ ] SettingsView (labels statiques)
- [ ] Onboarding flows (TODO)

---

## 🔧 Architecture technique

### 1. Language Enum (`Language.swift`)

```swift
enum Language: String, CaseIterable, Codable {
    case fr = "fr"
    case en = "en"
    case nl = "nl"
    case de = "de"

    var code: String { rawValue }
    var name: String { /* Localized name */ }
    var flag: String { /* Flag emoji */ }
    var locale: Locale { Locale(identifier: rawValue) }
}
```

**Features**:
- `CaseIterable` pour itérer sur toutes les langues
- `Codable` pour la persistance
- Properties computed pour l'UI (name, flag)

---

### 2. LanguageManager (`LanguageManager.swift`)

```swift
@MainActor
class LanguageManager: ObservableObject {
    static let shared = LanguageManager()

    @Published var currentLanguage: Language

    func setLanguage(_ language: Language)
    func translate(_ key: String) -> String
    func getSection<T>(_ keyPath: KeyPath<TranslationSections, T>) -> T
}
```

**Fonctionnalités**:
- **Singleton pattern** pour un accès global
- **@Published** pour réactivité SwiftUI
- **Persistance automatique** dans UserDefaults (key: `easyco_language`)
- **@MainActor** pour thread safety (UI updates)

**Environment integration**:
```swift
extension EnvironmentValues {
    var languageManager: LanguageManager { ... }
}
```

---

### 3. Translations Structure (`Translations.swift`)

#### a) Section Structs

```swift
struct AuthTranslations {
    let loginTitle: String
    let signupTitle: String
    let emailPlaceholder: String
    let passwordPlaceholder: String
    // ... 15+ fields
}

struct CommonTranslations {
    let save: String
    let cancel: String
    let loading: String
    // ... 15+ fields
}

struct PropertiesTranslations {
    let explorer: String
    let filters: String
    let mapView: String
    // ... 10+ fields
}
```

#### b) Translation Data

```swift
private static let auth: [Language: AuthTranslations] = [
    .fr: AuthTranslations(
        loginTitle: "Connexion",
        signupTitle: "Inscription",
        ...
    ),
    .en: AuthTranslations(
        loginTitle: "Login",
        signupTitle: "Sign Up",
        ...
    ),
    // NL, DE...
]
```

#### c) Helper Functions

**Method 1 - Get section**:
```swift
let auth = Translations.getSection(\.auth, language: .en)
print(auth.loginTitle) // "Login"
```

**Method 2 - Dot notation** (simple keys):
```swift
let title = Translations.t("auth.loginTitle", language: .en) // "Login"
```

---

## 💡 Usage dans les vues

### Méthode recommandée (getSection)

```swift
struct LoginView: View {
    @EnvironmentObject var languageManager: LanguageManager

    // Computed property pour accès facile
    private var auth: AuthTranslations {
        languageManager.getSection(\.auth)
    }

    var body: some View {
        VStack {
            Text(auth.loginTitle)
            ModernTextField(auth.emailPlaceholder, text: $email)
            GradientButton(auth.loginButton) { login() }
        }
    }
}
```

**Avantages**:
✅ Autocomplétion complète
✅ Type-safe (pas de typos possibles)
✅ Performance (accès direct)
✅ Réactivité automatique avec `@Published`

---

## 🎨 UI Components

### 1. LanguagePickerView

**Full-screen sheet** pour sélectionner une langue.

```swift
.sheet(isPresented: $showLanguagePicker) {
    LanguagePickerView()
        .environmentObject(languageManager)
}
```

**Features**:
- Liste de toutes les langues disponibles
- Flag emoji circulaire
- Indicateur de sélection (checkmark vert)
- Dismiss automatique après sélection
- Animation de transition

**Design**:
- List avec `.insetGrouped` style
- Row height: 64px
- Flag circle: 48x48
- Selection indicator: 32x32
- Theme colors (ResidentColors pour sélection)

---

### 2. LanguageSelectorView

**Compact button** pour la navigation bar ou settings.

```swift
CompactLanguageSwitcher()
    .environmentObject(languageManager)
```

**Design**:
- Flag emoji + chevron down
- Background: Theme.GrayColors._100
- Corner radius: Full (pill shape)
- Padding: 12px horizontal, 8px vertical

---

### 3. Integration dans SettingsView

```swift
struct SettingsView: View {
    @EnvironmentObject var languageManager: LanguageManager

    var body: some View {
        SettingsRow(
            icon: "globe",
            title: "Langue",
            value: languageManager.currentLanguage.name, // Reactive!
            color: Color(hex: "10B981")
        ) {
            showLanguageSettings = true
        }
        .sheet(isPresented: $showLanguageSettings) {
            LanguagePickerView()
                .environmentObject(languageManager)
        }
    }
}
```

---

## 🔄 Migration Guide

### Étape 1: Injection du LanguageManager

Dans `EasyCoApp.swift`:
```swift
@main
struct EasyCoApp: App {
    @StateObject private var languageManager = LanguageManager.shared

    var body: some Scene {
        WindowGroup {
            RootView()
                .environmentObject(languageManager)
        }
    }
}
```

### Étape 2: Utiliser dans une vue

**Avant**:
```swift
struct MyView: View {
    var body: some View {
        Text("Bienvenue")
        TextField("Email", text: $email)
        Button("Se connecter") { login() }
    }
}
```

**Après**:
```swift
struct MyView: View {
    @EnvironmentObject var languageManager: LanguageManager

    private var auth: AuthTranslations {
        languageManager.getSection(\.auth)
    }

    var body: some View {
        Text(auth.welcomeTitle)
        TextField(auth.emailPlaceholder, text: $email)
        Button(auth.loginButton) { login() }
    }
}
```

### Étape 3: Ajouter nouvelles traductions

1. Ajouter les champs dans le struct de section:
```swift
struct AuthTranslations {
    // ... existing fields
    let resetPassword: String  // NEW
}
```

2. Ajouter les traductions pour toutes les langues:
```swift
private static let auth: [Language: AuthTranslations] = [
    .fr: AuthTranslations(
        // ... existing
        resetPassword: "Réinitialiser le mot de passe"
    ),
    .en: AuthTranslations(
        // ... existing
        resetPassword: "Reset password"
    ),
    // NL, DE...
]
```

3. Utiliser dans la vue:
```swift
Button(auth.resetPassword) { resetPassword() }
```

---

## 📊 Comparaison Web App vs iOS

| Feature | Web App | iOS App | Notes |
|---------|---------|---------|-------|
| **Framework** | React Context API | Combine + @Published | Équivalent fonctionnel |
| **Persistance** | localStorage + cookie | UserDefaults | iOS standard |
| **Structure** | Nested objects + language keys | Typed structs per section | Plus type-safe sur iOS |
| **Access method** | `t(key)` or `getSection()` | `getSection(keyPath)` | iOS utilise KeyPath |
| **Fallback** | FR → key | FR (hardcoded) | Même logique |
| **Languages** | FR, EN, NL, DE | FR, EN, NL, DE | Identique |
| **Default** | FR | FR | Identique |
| **Dynamic loading** | Oui (optimized version) | Non (all in memory) | iOS plus simple |
| **Bundle size impact** | ~75KB per language | Compilé dans binary | Négligeable |

---

## 🚀 Prochaines étapes

### Priority #1: Refactor existing views
- [ ] PropertiesListView
- [ ] SettingsView (labels de sections)
- [ ] OnboardingViews (tous les steps)
- [ ] ProfileView
- [ ] DashboardView

### Priority #2: Add missing sections
- [ ] Welcome translations
- [ ] Dashboard translations
- [ ] Resident translations
- [ ] Complete onboarding translations

### Priority #3: Advanced features
- [ ] Locale-aware number formatting (€800 vs $800)
- [ ] Date formatting per locale
- [ ] Pluralization support
- [ ] RTL language support (future)

---

## 💡 Best Practices

### 1. Toujours utiliser getSection()

✅ **Bon**:
```swift
private var auth: AuthTranslations {
    languageManager.getSection(\.auth)
}
Text(auth.loginTitle)
```

❌ **Mauvais**:
```swift
Text(Translations.t("auth.loginTitle", language: languageManager.currentLanguage))
// Pas de réactivité, pas de type safety
```

### 2. Créer des computed properties

✅ **Bon**:
```swift
struct MyView: View {
    @EnvironmentObject var languageManager: LanguageManager

    private var common: CommonTranslations {
        languageManager.getSection(\.common)
    }

    private var auth: AuthTranslations {
        languageManager.getSection(\.auth)
    }
}
```

### 3. Éviter les traductions inline

❌ **Mauvais**:
```swift
Text(languageManager.getSection(\.auth).loginTitle)
```

✅ **Bon**:
```swift
private var auth: AuthTranslations {
    languageManager.getSection(\.auth)
}

Text(auth.loginTitle)
```

### 4. Grouper les traductions par feature

Créer des sections logiques:
- `auth` pour authentification
- `properties` pour l'exploration de propriétés
- `onboarding` pour l'onboarding
- `common` pour les actions/labels réutilisables

---

## 🐛 Troubleshooting

### Problème: Les traductions ne se mettent pas à jour

**Cause**: LanguageManager n'est pas injecté comme `@EnvironmentObject`

**Solution**:
```swift
.environmentObject(LanguageManager.shared)
```

### Problème: Autocomplétion ne fonctionne pas

**Cause**: Utilisation de `t()` au lieu de `getSection()`

**Solution**: Utiliser la méthode `getSection()` avec KeyPath

### Problème: Crash au changement de langue

**Cause**: Vue pas sur `@MainActor`

**Solution**: LanguageManager est déjà `@MainActor`, assurer que la vue est bien sur le main thread

---

## 📝 Exemples complets

### Exemple 1: Login View

```swift
struct LoginView: View {
    @StateObject private var viewModel = AuthViewModel()
    @EnvironmentObject var languageManager: LanguageManager
    @State private var isLoginMode = true

    private var auth: AuthTranslations {
        languageManager.getSection(\.auth)
    }

    var body: some View {
        VStack(spacing: 20) {
            Text(isLoginMode ? auth.loginSubtitle : auth.signupSubtitle)

            ModernTextField(auth.emailPlaceholder, text: $viewModel.email)
            ModernTextField(auth.passwordPlaceholder, text: $viewModel.password, isSecure: true)

            if isLoginMode {
                Button(auth.forgotPassword) { showForgotPassword = true }
            }

            GradientButton(
                isLoginMode ? auth.loginButton : auth.signupButton
            ) {
                Task {
                    if isLoginMode {
                        await viewModel.login()
                    } else {
                        await viewModel.signup()
                    }
                }
            }

            if !isLoginMode {
                Text(auth.termsAndConditions)
                    .font(.caption)
            }
        }
    }
}
```

### Exemple 2: Settings avec Language Switcher

```swift
struct SettingsView: View {
    @EnvironmentObject var languageManager: LanguageManager
    @State private var showLanguagePicker = false

    var body: some View {
        NavigationStack {
            List {
                Section("Préférences") {
                    SettingsRow(
                        icon: "globe",
                        title: "Langue",
                        value: languageManager.currentLanguage.name
                    ) {
                        showLanguagePicker = true
                    }
                }
            }
            .sheet(isPresented: $showLanguagePicker) {
                LanguagePickerView()
                    .environmentObject(languageManager)
            }
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    CompactLanguageSwitcher()
                        .environmentObject(languageManager)
                }
            }
        }
    }
}
```

---

## 📚 Références

- [Web App i18n Implementation](../lib/i18n/translations.ts) - Structure de référence
- [Apple Localization Guide](https://developer.apple.com/documentation/xcode/localization) - Documentation officielle
- [SwiftUI Environment](https://developer.apple.com/documentation/swiftui/environment) - EnvironmentObject pattern

---

**Dernière mise à jour**: 17 novembre 2025
**Version**: 1.0.0
**Auteur**: EasyCo Team
**Statut**: ✅ Production Ready (Core features) | 🚧 En cours (Full app coverage)
