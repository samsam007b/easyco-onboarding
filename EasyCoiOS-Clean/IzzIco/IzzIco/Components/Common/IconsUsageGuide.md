# Guide d'utilisation des icônes EasyCo

Ce guide explique comment utiliser le système d'icônes personnalisé basé sur le Design System EasyCo.

## 🎨 Les 3 styles disponibles

Le Design System définit 3 styles d'icônes:

### 1. **Muted** (Terne)
Style subtil avec couleurs grises, pour les éléments secondaires.
```swift
IconContainer(.user, style: .muted, color: .iconColors.user)
```

### 2. **Vivid** (Vif) ⭐ RECOMMANDÉ
Style coloré avec fond transparent, actuellement utilisé dans le menu.
```swift
IconContainer(.sparkles, style: .vivid, color: .iconColors.orange)
```

### 3. **Gradient**
Style avec dégradé, pour les éléments premium ou importants.
```swift
IconContainer(.crown, style: .gradient, color: .iconColors.purple)
```

## 📦 Composants disponibles

### CustomIcon
Icône simple sans conteneur.
```swift
CustomIcon(.home, style: .vivid, color: .iconColors.orange, size: 20)
```

### IconContainer
Icône avec fond coloré (style du Design System).
```swift
IconContainer(.message, style: .vivid, color: .iconColors.info, size: 20, containerSize: 40)
```

## 🎨 Palette de couleurs

Les couleurs suivent le Design System:

```swift
// Couleurs principales
Color.iconColors.orange    // #FFA040 - Marque principale
Color.iconColors.purple    // #6E56CF - Marque secondaire

// Couleurs sémantiques
Color.iconColors.success   // #10B981 - Succès
Color.iconColors.error     // #EF4444 - Erreur
Color.iconColors.warning   // #F59E0B - Attention
Color.iconColors.info      // #3B82F6 - Information

// Couleurs par type d'utilisateur
Color.iconColors.user      // Orange - Chercheur
Color.iconColors.owner     // Purple - Propriétaire
Color.iconColors.resident  // Blue - Résident

// Couleurs par fonctionnalité
Color.iconColors.property  // Green - Immobilier
Color.iconColors.message   // Blue - Messages
Color.iconColors.finance   // Amber - Finance
Color.iconColors.security  // Red - Sécurité
```

## 🔤 Icônes disponibles

### Navigation
- `.home` - Accueil
- `.search` - Recherche
- `.menu` - Menu
- `.chevronLeft` / `.chevronRight` - Navigation
- `.arrowRight` - Flèche
- `.externalLink` - Lien externe

### Utilisateurs
- `.user` - Utilisateur
- `.users` - Groupe d'utilisateurs
- `.crown` - Premium/VIP
- `.baby` - Enfant
- `.accessibility` - Accessibilité

### Immobilier
- `.building` / `.building2` - Immeubles
- `.houseIcon` - Maison
- `.bed` - Lit/Chambre
- `.bath` - Salle de bain
- `.key` - Clé/Accès

### Actions
- `.plus` / `.minus` - Ajouter/Retirer
- `.xmark` - Fermer
- `.check` - Valider
- `.edit` - Modifier
- `.trash` - Supprimer
- `.copy` - Copier
- `.download` - Télécharger

### Sécurité
- `.shield` / `.shieldCheck` - Protection
- `.lock` / `.unlock` - Verrouillage
- `.eye` / `.eyeOff` - Visibilité
- `.fingerprint` - Authentification

### Communication
- `.message` - Messages
- `.mail` - Email
- `.phone` - Téléphone
- `.bell` / `.bellBadge` - Notifications

### Finance
- `.euro` - Monnaie
- `.creditCard` - Carte bancaire
- `.chartBar` - Graphiques
- `.scale` - Balance/Soldes

### Fonctionnalités
- `.sparkles` - Matchs/Premium
- `.heart` / `.heartFill` - Favoris
- `.bookmark` / `.bookmarkFill` - Sauvegardé
- `.calendar` - Calendrier
- `.clock` - Heure
- `.mapPin` - Localisation
- `.star` / `.starFill` - Étoile/Note

### Paramètres & Outils
- `.settings` / `.gear` - Paramètres
- `.sliders` - Préférences
- `.wrench` / `.hammer` - Maintenance
- `.toggleLeft` - Interrupteur

### Autres
- `.checkList` - Liste de tâches
- `.doc` - Document
- `.folder` - Dossier
- `.image` - Image
- `.video` - Vidéo
- `.megaphone` - Annonce
- `.layers` - Couches

## 💡 Exemples d'utilisation

### Dans un menu (style actuel)
```swift
MenuItem(
    icon: "sparkles",
    title: "Mes Matchs",
    destination: AnyView(MatchesView())
)
// La couleur est automatiquement inférée selon le type d'icône
```

### Dans un header de section
```swift
HStack {
    IconContainer(.building, style: .vivid, color: .iconColors.property)
    Text("Mes propriétés")
        .font(.headline)
}
```

### Dans un bouton d'action
```swift
Button(action: { /* ... */ }) {
    HStack {
        CustomIcon(.plus, style: .vivid, color: .iconColors.success)
        Text("Ajouter")
    }
}
```

### Dans une card
```swift
VStack {
    IconContainer(.crown, style: .gradient, color: .iconColors.orange, containerSize: 60)
    Text("Premium")
        .font(.title3)
}
```

## 🔄 Migration depuis les icônes système

### Avant
```swift
Image(systemName: "house.fill")
    .font(.system(size: 20))
    .foregroundColor(.gray)
```

### Après (Option 1 - Simple)
```swift
CustomIcon(.home, style: .vivid, color: .iconColors.orange)
```

### Après (Option 2 - Avec conteneur)
```swift
IconContainer(.home, style: .vivid, color: .iconColors.orange)
```

## 📱 Exemples d'écrans

### Écran de profil
```swift
VStack(spacing: 20) {
    // Header
    HStack {
        IconContainer(.user, style: .gradient, color: .iconColors.user, containerSize: 60)
        VStack(alignment: .leading) {
            Text("Jean Dupont")
            Text("Premium")
        }
    }

    // Actions
    HStack(spacing: 16) {
        IconContainer(.edit, style: .vivid, color: .iconColors.info)
        IconContainer(.settings, style: .vivid, color: .iconColors.gray)
    }
}
```

### Liste de fonctionnalités
```swift
VStack(spacing: 12) {
    FeatureRow(icon: .sparkles, color: .iconColors.orange, title: "Matchs intelligents")
    FeatureRow(icon: .shield, color: .iconColors.security, title: "Sécurité renforcée")
    FeatureRow(icon: .bell, color: .iconColors.info, title: "Notifications en temps réel")
}

struct FeatureRow: View {
    let icon: AppIcon
    let color: Color
    let title: String

    var body: some View {
        HStack {
            IconContainer(icon.sfSymbol, style: .vivid, color: color, containerSize: 40)
            Text(title)
            Spacer()
        }
    }
}
```

## ✅ Bonnes pratiques

1. **Utilisez le style Vivid par défaut** - C'est le style principal du Design System
2. **Respectez la palette de couleurs** - Utilisez `Color.iconColors.*` pour la cohérence
3. **Choisissez des icônes sémantiques** - L'icône doit représenter clairement sa fonction
4. **Taille cohérente** - Utilisez des tailles standardisées (20, 24, 32, 40, 48)
5. **Style Gradient avec parcimonie** - Réservez-le pour les éléments premium ou importants

## 🚫 À éviter

- ❌ Mélanger différents styles dans le même écran
- ❌ Utiliser des couleurs custom hors de la palette
- ❌ Des icônes trop grandes (>60px) ou trop petites (<16px)
- ❌ Surcharger l'interface avec trop d'icônes colorées

## 📚 Ressources

- Design System: `app/admin/(dashboard)/dashboard/design-system/page.tsx`
- Composants: `EasyCoiOS-Clean/EasyCo/EasyCo/Components/Common/CustomIcons.swift`
- Menu: `EasyCoiOS-Clean/EasyCo/EasyCo/Features/Navigation/SideMenuView.swift`
