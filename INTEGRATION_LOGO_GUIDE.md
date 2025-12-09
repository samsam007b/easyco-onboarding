# Guide d'intégration des logos IzzIco

**Date:** 9 décembre 2025
**Version:** 1.0 - Logos finaux

## 📦 Composant React

Un composant TypeScript réutilisable a été créé : [`components/ui/IzzicoLogo.tsx`](components/ui/IzzicoLogo.tsx)

### Import

```tsx
import { IzzicoLogo, IzzicoLogoFull, IzzicoLogoCompact, IzzicoIcon } from '@/components/ui/IzzicoLogo';
```

### Utilisation

#### 1. Logo textuel complet (headers desktop)

```tsx
// Composant générique
<IzzicoLogo variant="text-full" size="lg" />

// Helper dédié (recommandé)
<IzzicoLogoFull size="lg" />
```

**Tailles disponibles :**
- `sm` → h-12 (48px)
- `md` → h-16 (64px) ✅ **par défaut**
- `lg` → h-24 (96px)
- `xl` → h-32 (128px)

**Fichier source :** `/logos/izzico-logo-text-final.svg` (600×200px)

---

#### 2. Logo compact (navigation, headers mobiles)

```tsx
// Composant générique
<IzzicoLogo variant="text-compact" size="md" />

// Helper dédié (recommandé)
<IzzicoLogoCompact size="md" />
```

**Tailles disponibles :**
- `sm` → h-8 (32px)
- `md` → h-12 (48px) ✅ **par défaut**
- `lg` → h-16 (64px)
- `xl` → h-24 (96px)

**Fichier source :** `/logos/izzico-logo-compact.svg` (400×120px)

---

#### 3. Icône seule (favicon, app mobile)

```tsx
// Composant générique
<IzzicoLogo variant="icon" size="md" />

// Helper dédié (recommandé)
<IzzicoIcon size="md" />
```

**Tailles disponibles :**
- `sm` → 32×32px
- `md` → 48×48px ✅ **par défaut**
- `lg` → 64×64px
- `xl` → 96×96px

**Fichier source :** `/logos/izzico-icon.svg` (200×200px)

---

## 🎨 Exemples d'intégration

### Header desktop

```tsx
export function DesktopHeader() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4">
        <IzzicoLogoCompact size="md" />
        <nav>{/* ... */}</nav>
      </div>
    </header>
  );
}
```

### Header mobile

```tsx
export function MobileHeader() {
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="px-4 py-2 flex items-center justify-between">
        <IzzicoIcon size="sm" />
        <button>{/* Menu */}</button>
      </div>
    </header>
  );
}
```

### Landing page hero

```tsx
export function HeroSection() {
  return (
    <section className="py-20 text-center">
      <div className="mb-8 flex justify-center">
        <IzzicoLogoFull size="xl" className="drop-shadow-lg" />
      </div>
      <h1 className="text-4xl font-bold">
        Bienvenue sur IzzIco
      </h1>
    </section>
  );
}
```

### Footer

```tsx
export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <IzzicoIcon size="md" />
          <span className="text-lg font-semibold">IzzIco</span>
        </div>
        {/* ... */}
      </div>
    </footer>
  );
}
```

---

## 🌐 SVG direct (sans React)

Si vous ne pouvez pas utiliser le composant React, utilisez les SVG directement :

### Logo textuel final

```html
<img
  src="/logos/izzico-logo-text-final.svg"
  alt="IzzIco"
  class="h-16"
/>
```

### Logo compact

```html
<img
  src="/logos/izzico-logo-compact.svg"
  alt="IzzIco"
  class="h-12"
/>
```

### Icône

```html
<img
  src="/logos/izzico-icon.svg"
  alt="IzzIco"
  class="w-12 h-12"
/>
```

---

## 📐 Spécifications des fichiers

| Fichier | Dimensions | Format | Gradient | Usage principal |
|---------|-----------|--------|----------|-----------------|
| `izzico-logo-text-final.svg` | 600×200px | Bannière | Horizontal 90deg | Headers desktop, marketing |
| `izzico-logo-compact.svg` | 400×120px | Bannière réduite | Horizontal 90deg | Navigation, emails |
| `izzico-icon.svg` | 200×200px | Carré | Diagonal 135deg | Favicon, app mobile |
| `izzico-logo-text-v1.svg` | 600×200px | Bannière | Horizontal (stop 50%) | Archive / comparaison |
| `izzico-logo-text-v2.svg` | 600×200px | Bannière | Horizontal (stop 55%) | Archive / comparaison |

---

## 🎨 Gradient signature

Tous les logos utilisent le **gradient signature IzzIco** :

### Version finale (horizontale)
```css
linear-gradient(90deg,
  #9c5698 0%,    /* Mauve (Owner) */
  #FF5722 55%,   /* Orange (Resident) - position ajustée */
  #FFB10B 100%   /* Jaune (Searcher) */
)
```

### Version icône (diagonale)
```css
linear-gradient(135deg,
  #9c5698 0%,
  #FF5722 50%,
  #FFB10B 100%
)
```

**Note :** L'icône maison utilise un gradient **diagonal** (135deg) pour un effet plus dynamique, tandis que les logos textuels utilisent un gradient **horizontal** (90deg) qui suit la direction de lecture.

---

## 🔍 Design System

Pour voir tous les logos en action, consultez le design system :

```
http://localhost:3000/admin/dashboard/design-system
```

Puis cliquez sur l'onglet **"Icones & Logo"**.

La page affiche :
- ✅ Logo textuel FINAL (avec soft glow)
- ✅ Logo compact
- ✅ Icône maison
- ✅ Évolution des versions (V1, V2, FINAL)
- ✅ Guide d'utilisation
- ✅ Code SVG copiable

---

## 🚀 Prochaines étapes

### Génération de variantes PNG

Pour créer des versions PNG haute résolution :

```bash
# Installer sharp si nécessaire
npm install sharp --save-dev

# Script de conversion (à créer)
node scripts/generate-logo-pngs.js
```

### Favicon

Pour générer un favicon moderne à partir de l'icône :

```bash
# Créer plusieurs tailles pour favicon.ico
# 16x16, 32x32, 48x48
```

### App icons iOS/Android

Tailles requises pour les plateformes mobiles :

**iOS :**
- 120×120 (iPhone 2x)
- 180×180 (iPhone 3x)
- 1024×1024 (App Store)

**Android :**
- 48×48 (mdpi)
- 72×72 (hdpi)
- 96×96 (xhdpi)
- 144×144 (xxhdpi)
- 192×192 (xxxhdpi)
- 512×512 (Play Store)

---

## 📝 Bonnes pratiques

### ✅ À faire

- Utiliser `IzzicoLogoCompact` pour les headers (meilleure lisibilité)
- Utiliser `IzzicoIcon` pour les petites tailles (< 64px)
- Préserver l'aspect ratio des logos (ne pas étirer)
- Ajouter `alt="IzzIco"` pour l'accessibilité
- Utiliser `loading="eager"` pour les logos above the fold

### ❌ À éviter

- Ne pas modifier les couleurs du gradient
- Ne pas étirer ou déformer les logos
- Ne pas ajouter de fond coloré qui clash avec le gradient
- Ne pas utiliser le logo textuel en très petit (< 32px de hauteur)
- Ne pas remplacer le texte "IzzIco" par un autre

---

## 🎯 Récapitulatif rapide

| Contexte | Composant recommandé | Taille |
|----------|---------------------|--------|
| Header desktop | `<IzzicoLogoCompact size="md" />` | 48px |
| Header mobile | `<IzzicoIcon size="sm" />` | 32px |
| Landing page hero | `<IzzicoLogoFull size="xl" />` | 128px |
| Footer | `<IzzicoIcon size="md" />` | 48px |
| Email signature | `<IzzicoLogoCompact size="sm" />` | 32px |
| Favicon | Utiliser `/logos/izzico-icon.svg` | 16-32px |
| App mobile | Utiliser `/logos/izzico-icon.svg` | Variable |

---

**Documentation créée le :** 9 décembre 2025
**Dernière mise à jour :** 9 décembre 2025
**Auteur :** Samuel Baudon
