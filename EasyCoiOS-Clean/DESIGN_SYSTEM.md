# 🎨 EasyCo iOS Design System

Documentation complète du Design System iOS natif, aligné avec l'application web.

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Tokens de design](#tokens-de-design)
3. [Composants](#composants)
4. [Utilisation](#utilisation)
5. [Exemples](#exemples)

---

## Vue d'ensemble

Le Design System EasyCo pour iOS est une implémentation complète en SwiftUI qui reproduit fidèlement le design de l'application web. Il est conçu pour garantir une cohérence visuelle parfaite entre les plateformes.

### Principes clés

- **Cohérence cross-platform** : Design identique entre web et iOS
- **Role-based theming** : 3 palettes distinctes (Searcher, Owner, Resident)
- **Composants réutilisables** : DRY (Don't Repeat Yourself)
- **Accessibilité** : Tailles de police et contrastes respectant les normes
- **Performance** : Optimisé pour SwiftUI

---

## Tokens de design

Tous les tokens de design sont centralisés dans `Theme.swift`.

### 1. Couleurs

#### Palettes par rôle

Chaque rôle utilisateur dispose d'une palette complète (50-900) :

```swift
// Searcher (Jaune/Or/Ambre)
Theme.SearcherColors._50   // #FFFEF0
Theme.SearcherColors._400  // #FFD249 (Primary)
Theme.SearcherColors._900  // #BF360C

// Owner (Violet/Mauve/Indigo)
Theme.OwnerColors._50      // #F9F8FF
Theme.OwnerColors._500     // #6E56CF (Primary)
Theme.OwnerColors._900     // #1A0033

// Resident (Orange/Coral)
Theme.ResidentColors._50   // #FFFAF8
Theme.ResidentColors._400  // #FF6F3C (Primary)
Theme.ResidentColors._900  // #8D2A0E
```

#### Échelle de gris

```swift
Theme.GrayColors._50   // #F9F9F9
Theme.GrayColors._100  // #F2F2F2
Theme.GrayColors._500  // #8C8C8C
Theme.GrayColors._900  // #1A1A1A
```

#### Couleurs sémantiques

```swift
Theme.SemanticColors.success     // #10B981
Theme.SemanticColors.error       // #EF4444
Theme.SemanticColors.warning     // #F59E0B
Theme.SemanticColors.info        // #3B82F6

// Avec backgrounds
Theme.SemanticColors.successBg   // #D1FAE5
Theme.SemanticColors.errorBg     // #FEE2E2
```

### 2. Gradients

```swift
// Gradient signature (tricolore)
Theme.Gradients.brand

// Gradients par rôle
Theme.Gradients.searcher
Theme.Gradients.owner
Theme.Gradients.resident

// Gradients subtils
Theme.Gradients.searcherSubtle
Theme.Gradients.ownerSubtle
Theme.Gradients.residentSubtle

// Helper dynamique
Theme.Gradients.forRole(.owner)
```

### 3. Typographie

```swift
// Display & Titles
Theme.Typography.display()        // 48pt, bold
Theme.Typography.largeTitle()     // 36pt, bold
Theme.Typography.title1()         // 30pt, bold
Theme.Typography.title2()         // 24pt, bold
Theme.Typography.title3()         // 20pt, semibold

// Body
Theme.Typography.bodyLarge()      // 18pt
Theme.Typography.body()           // 16pt (default)
Theme.Typography.bodySmall()      // 14pt

// Captions
Theme.Typography.caption()        // 12pt
Theme.Typography.captionSmall()   // 11pt

// Avec weights personnalisés
Theme.Typography.body(.semibold)
Theme.Typography.title2(.regular)
```

### 4. Espacement

Échelle basée sur 8px (système de grille) :

```swift
Theme.Spacing._0    // 0px
Theme.Spacing._1    // 4px   (0.25rem)
Theme.Spacing._2    // 8px   (0.5rem)
Theme.Spacing._3    // 12px  (0.75rem)
Theme.Spacing._4    // 16px  (1rem)
Theme.Spacing._6    // 24px  (1.5rem)
Theme.Spacing._8    // 32px  (2rem)
Theme.Spacing._12   // 48px  (3rem)
Theme.Spacing._16   // 64px  (4rem)

// Alias legacy
Theme.Spacing.xs    // 8px
Theme.Spacing.md    // 16px
Theme.Spacing.lg    // 24px
```

### 5. Border Radius

```swift
Theme.CornerRadius.sm      // 6px
Theme.CornerRadius.md      // 8px
Theme.CornerRadius.lg      // 12px
Theme.CornerRadius.xl      // 16px
Theme.CornerRadius._2xl    // 24px
Theme.CornerRadius._3xl    // 32px (cartes principales)
Theme.CornerRadius.full    // 9999px (cercle)
```

### 6. Ombres

```swift
// Ombres standard
Theme.Shadows.xs
Theme.Shadows.sm
Theme.Shadows.md
Theme.Shadows.lg
Theme.Shadows.xl
Theme.Shadows._2xl

// Ombres colorées avec glow
Theme.Shadows.searcherGlow
Theme.Shadows.ownerGlow
Theme.Shadows.residentGlow
```

### 7. Animations

```swift
Theme.Animations.fast          // 0.15s
Theme.Animations.base          // 0.2s
Theme.Animations.slow          // 0.3s
Theme.Animations.spring        // Spring physics
Theme.Animations.springBouncy  // Bouncy spring
```

---

## Composants

### 1. Cards

#### ModernCard

Carte standard avec bordure et ombre :

```swift
ModernCard {
    VStack(alignment: .leading) {
        Text("Titre")
            .font(Theme.Typography.title3())
        Text("Contenu")
            .font(Theme.Typography.body())
    }
}

// Personnalisé
ModernCard(
    padding: Theme.Spacing._8,
    cornerRadius: Theme.CornerRadius.xl,
    shadow: Theme.Shadows.md
) {
    // Contenu
}
```

#### InteractiveCard

Carte avec effet de tap :

```swift
InteractiveCard(action: {
    print("Card tapped!")
}) {
    // Contenu
}
```

#### ElevatedCard

Carte avec ombre plus prononcée :

```swift
ElevatedCard {
    // Contenu
}
```

#### GlassCard

Carte avec effet glassmorphism :

```swift
GlassCard(role: .owner) {
    VStack {
        Text("Premium Card")
            .foregroundColor(.white)
    }
}
```

### 2. Buttons

#### GradientButton

Bouton principal avec gradient :

```swift
GradientButton("Connexion", role: .owner) {
    // Action
}

// Avec icône
GradientButton("Ajouter", role: .searcher, icon: "plus") {
    // Action
}

// States
GradientButton("Chargement...", role: .owner, isLoading: true) { }
GradientButton("Désactivé", role: .searcher, isDisabled: true) { }

// Tailles
GradientButton("Petit", role: .owner, size: .small) { }
GradientButton("Grand", role: .owner, size: .large) { }
```

#### SecondaryButton

Bouton outline :

```swift
SecondaryButton("Annuler", color: Theme.OwnerColors._500) {
    // Action
}
```

#### GhostButton

Bouton texte uniquement :

```swift
GhostButton("Passer", icon: "arrow.right") {
    // Action
}
```

#### IconButton

Bouton icône circulaire :

```swift
IconButton(icon: "heart.fill", role: .owner) {
    // Action
}

// Sans gradient
IconButton(icon: "gearshape.fill") {
    // Action
}
```

### 3. Text Fields

#### ModernTextField

Champ de texte moderne :

```swift
@State private var email = ""

ModernTextField(
    "Email",
    text: $email,
    icon: "envelope.fill",
    keyboardType: .emailAddress
)

// Avec erreur
ModernTextField(
    "Email",
    text: $email,
    icon: "envelope.fill",
    error: "Email invalide"
)

// Password field
ModernTextField(
    "Mot de passe",
    text: $password,
    icon: "lock.fill",
    isSecure: true
)

// Avec couleur de rôle
ModernTextField(
    "Message",
    text: $message,
    role: .owner
)
```

#### ModernTextArea

Zone de texte multi-ligne :

```swift
@State private var description = ""

ModernTextArea(
    "Description",
    text: $description,
    minHeight: 120
)
```

#### SearchField

Champ de recherche :

```swift
@State private var searchQuery = ""

SearchField(
    text: $searchQuery,
    placeholder: "Rechercher...",
    onSubmit: {
        performSearch()
    }
)
```

### 4. Badges

#### ModernBadge

Badge personnalisable :

```swift
ModernBadge("Nouveau")

// Avec icône
ModernBadge("Premium", icon: "crown.fill")

// Personnalisé
ModernBadge(
    "Custom",
    color: Theme.OwnerColors._100,
    textColor: Theme.OwnerColors._700,
    borderColor: Theme.OwnerColors._300
)

// Tailles
ModernBadge("Small", size: .small)
ModernBadge("Large", size: .large)
```

#### RoleBadge

Badge pour rôle utilisateur :

```swift
RoleBadge(.searcher)
RoleBadge(.owner)
RoleBadge(.resident)
```

#### StatusBadge

Badge de statut :

```swift
StatusBadge(.success)
StatusBadge(.error)
StatusBadge(.warning)
StatusBadge(.pending)
StatusBadge(.active)
```

#### CountBadge

Badge de notification :

```swift
CountBadge(5)
CountBadge(12, role: .owner)
```

### 5. Dividers

#### ModernDivider

Séparateur horizontal :

```swift
ModernDivider()

// Personnalisé
ModernDivider(color: Theme.OwnerColors._300, thickness: 2)
```

#### SectionDivider

Séparateur avec texte :

```swift
SectionDivider("OU")
```

#### GradientDivider

Séparateur avec gradient :

```swift
GradientDivider(role: .owner)
```

#### VerticalDivider

Séparateur vertical :

```swift
VerticalDivider(height: 40)
```

### 6. Loading States

#### SkeletonView

Vue skeleton pour chargement :

```swift
SkeletonView(height: 100)
```

#### SkeletonCard & SkeletonList

Composants skeleton pré-configurés :

```swift
SkeletonCard()
SkeletonList(count: 5)
```

#### LoadingSpinner

Indicateur de chargement circulaire :

```swift
LoadingSpinner()
LoadingSpinner(role: .owner, size: 60)
```

#### FullScreenLoading

Overlay de chargement plein écran :

```swift
if isLoading {
    FullScreenLoading(role: .owner, message: "Chargement...")
}
```

#### TypingIndicator

Indicateur de saisie (chat) :

```swift
TypingIndicator(role: .owner)
```

#### EmptyStateView

Vue d'état vide :

```swift
EmptyStateView(
    icon: "magnifyingglass",
    title: "Aucun résultat",
    message: "Essayez de modifier vos critères",
    actionTitle: "Réinitialiser",
    action: { reset() }
)
```

---

## Utilisation

### View Modifiers

#### Cards

```swift
VStack {
    // Contenu
}
.modernCard()
.elevatedCard()
.premiumGlass(role: .owner)
```

#### Buttons

```swift
Text("Button")
    .primaryButton(role: .owner)
    .secondaryButton(color: Theme.OwnerColors._500)
    .ghostButton()
```

#### Text Fields

```swift
TextField("Email", text: $email)
    .modernTextField(focused: isFocused, error: hasError)
```

#### Badges

```swift
Text("Label")
    .badge()
    .roleBadge(.owner)
```

#### Shadows

```swift
VStack {
    // Contenu
}
.themeShadow(Theme.Shadows.md)
```

#### Animations

```swift
VStack {
    // Contenu
}
.scaleOnTap()
.bounce(trigger: shouldBounce)
```

---

## Exemples

### Exemple 1 : Card de propriété

```swift
ModernCard {
    VStack(alignment: .leading, spacing: Theme.Spacing._3) {
        // Image
        AsyncImage(url: URL(string: property.imageURL))
            .frame(height: 200)
            .cornerRadius(Theme.CornerRadius.lg)

        // Titre
        Text(property.title)
            .font(Theme.Typography.title3())
            .foregroundColor(Theme.Colors.textPrimary)

        // Prix
        HStack {
            Text("\(property.price)€")
                .font(Theme.Typography.title2(.bold))
                .foregroundColor(Theme.OwnerColors._600)
            Spacer()
            RoleBadge(.owner)
        }

        // Détails
        HStack(spacing: Theme.Spacing._2) {
            ModernBadge("\(property.rooms) pièces", icon: "bed.double.fill")
            ModernBadge("\(property.surface)m²", icon: "ruler.fill")
        }
    }
}
```

### Exemple 2 : Formulaire de connexion

```swift
VStack(spacing: Theme.Spacing._4) {
    // Email
    ModernTextField(
        "Email",
        text: $email,
        icon: "envelope.fill",
        keyboardType: .emailAddress,
        error: emailError
    )

    // Password
    ModernTextField(
        "Mot de passe",
        text: $password,
        icon: "lock.fill",
        isSecure: true,
        error: passwordError
    )

    // Submit
    GradientButton("Connexion", role: .owner, isLoading: isLoading) {
        login()
    }

    ModernDivider()

    // Alternative
    SecondaryButton("S'inscrire", color: Theme.OwnerColors._500) {
        showSignup()
    }
}
.padding(Theme.Spacing._6)
```

### Exemple 3 : Liste avec états de chargement

```swift
VStack {
    if isLoading {
        SkeletonList(count: 5)
    } else if properties.isEmpty {
        EmptyStateView(
            icon: "house.fill",
            title: "Aucune propriété",
            message: "Commencez par ajouter votre première propriété",
            actionTitle: "Ajouter",
            action: { showAddProperty() }
        )
    } else {
        ForEach(properties) { property in
            InteractiveCard(action: {
                selectProperty(property)
            }) {
                PropertyRow(property: property)
            }
        }
    }
}
```

### Exemple 4 : Header avec glassmorphism

```swift
ZStack(alignment: .top) {
    // Background image
    AsyncImage(url: backgroundURL)
        .frame(height: 300)

    // Glass overlay
    GlassCard(role: .owner) {
        HStack {
            VStack(alignment: .leading) {
                Text("Bienvenue")
                    .font(Theme.Typography.title2())
                    .foregroundColor(.white)
                Text("John Doe")
                    .font(Theme.Typography.body())
                    .foregroundColor(.white.opacity(0.9))
            }
            Spacer()
            CountBadge(3, role: .owner)
        }
        .padding(Theme.Spacing._4)
    }
    .padding(Theme.Spacing._4)
}
```

---

## 📝 Notes importantes

### Accessibilité

- Toutes les tailles de police respectent les normes Dynamic Type
- Les contrastes de couleurs sont conformes WCAG AA
- Les éléments interactifs ont une taille minimale de 44x44pt

### Performance

- Les gradients sont pré-calculés
- Les animations utilisent SwiftUI natif (performant)
- Les skeletons utilisent un cache de shimmer

### Migration

Pour migrer une vue existante vers le nouveau design system :

1. Remplacer les couleurs hardcodées par les tokens (`Theme.OwnerColors._500`)
2. Utiliser les composants réutilisables au lieu de vues custom
3. Appliquer les modifiers appropriés (`.modernCard()`, etc.)
4. Utiliser les spacings du système (`Theme.Spacing._4`)

### Contribution

Lors de l'ajout de nouveaux composants :

1. Suivre la structure existante (fichiers séparés dans `/Components/Design/`)
2. Ajouter des previews SwiftUI
3. Documenter l'utilisation dans ce fichier
4. Compiler et vérifier qu'il n'y a pas d'erreurs

---

## 🚀 Prochaines étapes

- [ ] Implémenter les animations avancées (parallax, etc.)
- [ ] Créer des composants de formulaire avancés (DatePicker, Slider, etc.)
- [ ] Ajouter support Dark Mode
- [ ] Créer des layouts pré-configurés (grids, etc.)
- [ ] Ajouter haptic feedback aux interactions

---

**Dernière mise à jour** : 17 novembre 2025
**Version** : 1.0.0
**Auteur** : EasyCo Team
