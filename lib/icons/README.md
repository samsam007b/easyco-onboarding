# Système d'Icônes Izzico

## 🎨 Vue d'Ensemble

Le système d'icônes Izzico utilise **Feather Icons** - une bibliothèque ultra-minimaliste avec des courbes douces et friendly, parfaitement alignée avec l'aesthetic Izzico.

### Pourquoi Feather?

- ✅ **Ultra-minimaliste** - Courbes simples et douces
- ✅ **Friendly** - Style chaleureux et accessible
- ✅ **Cohérent** - 287 icônes au design unifié
- ✅ **Léger** - Seulement 11kb
- ✅ **Personnalité unique** - Se démarque des icon sets mainstream

### Architecture

```
lib/icons/
├── feather-config.ts      # Configuration Feather + système de rôles
├── izzico-icons.ts         # Registre centralisé des icônes
└── README.md               # Documentation (ce fichier)

components/icons/
├── FeatherIcon.tsx         # Wrapper Feather avec rôles Izzico
└── [custom icons à venir]  # Icônes custom brand (rôles, flags, etc.)
```

---

## 📦 Installation

Le package est déjà installé:
```bash
npm install react-feather
```

---

## 🚀 Utilisation

### Méthode 1: Via le Registre Izzico (Recommandé)

```tsx
import { IzzicoIcons } from '@/lib/icons/izzico-icons';

function MyComponent() {
  return (
    <div>
      {/* Icône simple */}
      <IzzicoIcons.Home size={24} />

      {/* Avec couleur de rôle */}
      <IzzicoIcons.Search size={20} color="#ffa000" />

      {/* Avec stroke width personnalisé */}
      <IzzicoIcons.Heart size={24} strokeWidth={1.5} />
    </div>
  );
}
```

### Méthode 2: Via le Wrapper FeatherIcon

```tsx
import FeatherIcon from '@/components/icons/FeatherIcon';
import { Home, Search, Heart } from 'react-feather';

function MyComponent() {
  return (
    <div>
      {/* Avec rôle Owner (mauve) */}
      <FeatherIcon icon={Home} size="md" role="owner" />

      {/* Avec rôle Resident (coral) */}
      <FeatherIcon icon={Search} size="lg" role="resident" />

      {/* Avec rôle Searcher (gold) */}
      <FeatherIcon icon={Heart} size="xl" role="searcher" />

      {/* Neutre (gris) */}
      <FeatherIcon icon={Settings} size="md" role="neutral" />
    </div>
  );
}
```

### Méthode 3: Import Direct de Feather

```tsx
import { Home, Search, Heart } from 'react-feather';

function MyComponent() {
  return (
    <div>
      <Home size={24} color="#9c5698" strokeWidth={1.5} />
      <Search size={20} className="text-resident-500" />
      <Heart size={32} className="text-searcher-500" />
    </div>
  );
}
```

---

## 🎨 Système de Rôles

Les couleurs d'icônes suivent le système de rôles Izzico:

| Rôle | Couleur | Hex | Usage |
|------|---------|-----|-------|
| **Owner** | Mauve/Purple | `#9c5698` | Propriétaires |
| **Resident** | Coral/Orange | `#e05747` | Résidents |
| **Searcher** | Gold/Amber | `#ffa000` | Chercheurs |
| **Neutral** | Gray | `#52525B` | Éléments neutres |

```tsx
// Exemples avec rôles
<FeatherIcon icon={Building} role="owner" size="md" />
<FeatherIcon icon={Key} role="resident" size="lg" />
<FeatherIcon icon={Search} role="searcher" size="xl" />
```

---

## 📏 Tailles d'Icônes

Le système définit 6 tailles standards:

| Taille | Pixels | Tailwind | Usage |
|--------|--------|----------|-------|
| `xs` | 12px | `w-3 h-3` | Très petit, inline text |
| `sm` | 16px | `w-4 h-4` | Petit, badges |
| `md` | 20px | `w-5 h-5` | Défaut, UI standard |
| `lg` | 24px | `w-6 h-6` | Boutons, headers |
| `xl` | 32px | `w-8 h-8` | Grande icône |
| `2xl` | 48px | `w-12 h-12` | Hero sections |

```tsx
<FeatherIcon icon={Home} size="xs" />   {/* 12px */}
<FeatherIcon icon={Home} size="sm" />   {/* 16px */}
<FeatherIcon icon={Home} size="md" />   {/* 20px - défaut */}
<FeatherIcon icon={Home} size="lg" />   {/* 24px */}
<FeatherIcon icon={Home} size="xl" />   {/* 32px */}
<FeatherIcon icon={Home} size="2xl" />  {/* 48px */}

{/* Ou taille custom en pixels */}
<FeatherIcon icon={Home} size={40} />
```

---

## 🔤 Registre des Icônes

Toutes les icônes utilisées dans Izzico sont centralisées dans `IzzicoIcons`:

### Navigation & Structure
```tsx
IzzicoIcons.Home
IzzicoIcons.Menu
IzzicoIcons.X
IzzicoIcons.ChevronLeft
IzzicoIcons.ChevronRight
IzzicoIcons.ChevronDown
IzzicoIcons.ChevronUp
IzzicoIcons.ArrowLeft
IzzicoIcons.ArrowRight
IzzicoIcons.MoreHorizontal
IzzicoIcons.MoreVertical
```

### Utilisateurs
```tsx
IzzicoIcons.User
IzzicoIcons.Users
IzzicoIcons.UserPlus
IzzicoIcons.UserCheck
IzzicoIcons.UserX
```

### Communication
```tsx
IzzicoIcons.Mail
IzzicoIcons.MessageCircle
IzzicoIcons.MessageSquare
IzzicoIcons.Send
IzzicoIcons.Phone
IzzicoIcons.Bell
IzzicoIcons.BellOff
```

### Actions
```tsx
IzzicoIcons.Plus
IzzicoIcons.Minus
IzzicoIcons.Edit
IzzicoIcons.Trash2
IzzicoIcons.Copy
IzzicoIcons.Check
IzzicoIcons.CheckCircle
IzzicoIcons.XCircle
IzzicoIcons.Save
IzzicoIcons.Download
IzzicoIcons.Upload
IzzicoIcons.RefreshCw
IzzicoIcons.Search
IzzicoIcons.Filter
IzzicoIcons.Eye
IzzicoIcons.EyeOff
```

### Immobilier & Logement
```tsx
IzzicoIcons.Building
IzzicoIcons.Key
IzzicoIcons.Lock
IzzicoIcons.Unlock
```

### Social & Feedback
```tsx
IzzicoIcons.Heart
IzzicoIcons.Star
IzzicoIcons.ThumbsUp
IzzicoIcons.ThumbsDown
IzzicoIcons.Bookmark
IzzicoIcons.Flag
IzzicoIcons.Award
IzzicoIcons.Share
```

### Finance
```tsx
IzzicoIcons.DollarSign
IzzicoIcons.CreditCard
IzzicoIcons.TrendingUp
IzzicoIcons.TrendingDown
IzzicoIcons.BarChart
IzzicoIcons.PieChart
```

### Localisation
```tsx
IzzicoIcons.MapPin
IzzicoIcons.Map
IzzicoIcons.Navigation
IzzicoIcons.Globe
```

### Temps & Calendrier
```tsx
IzzicoIcons.Calendar
IzzicoIcons.Clock
```

### Sécurité & Paramètres
```tsx
IzzicoIcons.Settings
IzzicoIcons.Shield
IzzicoIcons.LogOut
IzzicoIcons.LogIn
```

### Alertes & Statuts
```tsx
IzzicoIcons.AlertCircle
IzzicoIcons.AlertTriangle
IzzicoIcons.Info
IzzicoIcons.HelpCircle
IzzicoIcons.Loader
```

---

## 🎭 Avec IconBadge

Le composant `IconBadge` crée un badge circulaire coloré autour de l'icône:

```tsx
import IconBadge from '@/components/IconBadge';
import { Home, Search, Heart } from 'react-feather';

<IconBadge icon={Home} variant="owner" size="md" />
<IconBadge icon={Search} variant="resident" size="lg" />
<IconBadge icon={Heart} variant="searcher" size="xl" />

{/* Variants de couleur génériques */}
<IconBadge icon={Star} variant="purple" size="md" />
<IconBadge icon={Bell} variant="blue" size="lg" />
```

**Variants disponibles**:
- **Rôles**: `owner`, `resident`, `searcher`
- **Couleurs**: `purple`, `blue`, `green`, `yellow`, `orange`, `red`, `pink`, `teal`, `indigo`, `cyan`

**Tailles**: `sm`, `md` (défaut), `lg`, `xl`

---

## ♿ Accessibilité

Toujours fournir un `aria-label` pour les icônes standalone:

```tsx
<FeatherIcon
  icon={Home}
  size="md"
  role="owner"
  aria-label="Accueil"
/>

{/* Ou avec Feather direct */}
<Home
  size={24}
  aria-label="Rechercher"
  role="img"
/>

{/* Icône décorative (pas de label nécessaire) */}
<Heart size={20} role="presentation" />
```

---

## 🎨 Stroke Width

Feather utilise un stroke width de **2px par défaut** pour un look friendly. Vous pouvez le personnaliser:

```tsx
{/* Défaut Izzico: 1.5px (plus fin) */}
<FeatherIcon icon={Home} strokeWidth={1.5} />

{/* Plus épais */}
<FeatherIcon icon={Heart} strokeWidth={2} />

{/* Très fin */}
<FeatherIcon icon={Star} strokeWidth={1} />
```

---

## ✨ Custom Icons Izzico

Les icônes custom Izzico sont disponibles avec le style "squircle épais" du logo:

### Role Icons
```tsx
import { SearcherIcon, OwnerIcon, ResidentIcon } from '@/components/icons/custom';

// With gradient (signature Izzico)
<SearcherIcon size={32} useGradient />
<OwnerIcon size={32} useGradient />
<ResidentIcon size={32} useGradient />

// With role colors
<SearcherIcon size={24} color="#ffa000" />
<OwnerIcon size={24} color="#9c5698" />
<ResidentIcon size={24} color="#e05747" />
```

### Brand Icons
```tsx
import { StarIcon } from '@/components/icons/custom';

// Rating/favorite star
<StarIcon size={20} filled color="#ffa000" />
<StarIcon size={20} useGradient />
```

### Language Flags
```tsx
import { FlagIcon } from '@/components/icons/custom';

// Minimalist country indicators (NO emojis)
<FlagIcon country="FR" size={24} />
<FlagIcon country="GB" size={24} />
<FlagIcon country="NL" size={24} />
<FlagIcon country="DE" size={24} />
<FlagIcon country="ES" size={24} />
```

**Props communes:**
- `size`: Taille en pixels (défaut: 24)
- `color`: Couleur hex (défaut: couleur de rôle)
- `useGradient`: Utiliser le gradient signature Izzico
- `className`: Classes Tailwind additionnelles
- `strokeWidth`: Épaisseur du trait (défaut: 2.5 pour rôles)

---

## 📚 Ressources

- [Feather Icons Site](https://feathericons.com/)
- [react-feather Documentation](https://github.com/feathericons/react-feather)
- [Brand Identity Izzico](/brand-identity/izzico-color-system.html)
- [Voice Guidelines](/brand-identity/izzico-voice-guidelines.md)

---

## 🚫 Ce qu'il NE faut PAS faire

❌ **N'utilisez PAS d'emojis** - Violer les brand guidelines
```tsx
// ❌ MAUVAIS
<span>🏠 Home</span>
<span>⭐ Featured</span>
```

✅ **Utilisez Feather Icons**
```tsx
// ✅ BON
<IzzicoIcons.Home size={20} /> Home
<IzzicoIcons.Star size={20} /> Featured
```

❌ **N'inventez PAS des couleurs custom**
```tsx
// ❌ MAUVAIS
<Home color="#FF00FF" />
```

✅ **Utilisez le système de rôles**
```tsx
// ✅ BON
<FeatherIcon icon={Home} role="owner" />
<Home className="text-owner-500" />
```

---

## 🎯 Exemples Complets

### Bouton avec Icône
```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-owner-500 text-white rounded-xl">
  <IzzicoIcons.Plus size={20} />
  Ajouter une propriété
</button>
```

### Card Header avec IconBadge
```tsx
<div className="flex items-center gap-3">
  <IconBadge icon={Home} variant="owner" size="lg" />
  <div>
    <h3 className="font-heading font-bold">Ma Propriété</h3>
    <p className="text-sm text-gray-600">Paris 15ème</p>
  </div>
</div>
```

### Liste avec Icônes
```tsx
<ul className="space-y-3">
  <li className="flex items-center gap-2">
    <IzzicoIcons.Check size={20} className="text-green-500" />
    <span>Profil complété</span>
  </li>
  <li className="flex items-center gap-2">
    <IzzicoIcons.XCircle size={20} className="text-red-500" />
    <span>Documents manquants</span>
  </li>
</ul>
```

### Navigation Header
```tsx
<nav className="flex items-center gap-6">
  <button>
    <IzzicoIcons.Home size={24} className="text-owner-500" />
  </button>
  <button>
    <IzzicoIcons.Search size={24} className="text-gray-600" />
  </button>
  <button className="relative">
    <IzzicoIcons.Bell size={24} className="text-gray-600" />
    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
  </button>
</nav>
```
