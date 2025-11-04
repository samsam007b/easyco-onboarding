# EasyCo Design System - Uniformisation Complète

## 🎯 Mission Critique

Tu es responsable de l'**identité visuelle d'EasyCo**. Cette plateforme de co-living pour Bruxelles a une direction artistique unique basée sur son logo tricolore. Chaque pixel compte. Chaque couleur a un sens. Chaque gradient raconte l'histoire de nos 3 rôles utilisateurs.

**Standard attendu:** Apple, Stripe, Linear - des marques qui ne font AUCUN compromis sur le design.

---

## 🎨 Direction Artistique - Notre ADN Visuel

### Le Logo EasyCo - Notre Étoile du Nord

Le logo EasyCo utilise un **dégradé tricolore** qui représente les 3 rôles de la plateforme:

```
Mauve (#7B5FB8) → Rose/Corail (#C98B9E) → Orange (#E8865D) → Jaune/Doré (#FFD080)
```

**Cette séquence de couleurs est SACRÉE. Elle doit se retrouver partout.**

### Couleurs Extraites du Logo (Zones Spécifiques)

#### 🟣 OWNER (Zone Gauche du Logo)
```css
Gradient authentique du logo:
linear-gradient(135deg, #7B5FB8 0%, #A67BB8 50%, #C98B9E 100%)

Couleur solide principale: #6E56CF (mauve)
```

**Quand utiliser:**
- Pages `/dashboard/owner/*`
- Headers owner
- Boutons CTA owner
- Navigation owner

#### 🟠 RESIDENT (Zone Centrale du Logo)
```css
Gradient authentique du logo:
linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)

Couleur solide principale: #FF6F3C (orange/corail)
```

**Quand utiliser:**
- Pages `/dashboard/resident/*`
- Headers resident
- Boutons CTA resident
- Navigation resident

#### 🟡 SEARCHER (Zone Droite du Logo)
```css
Gradient authentique du logo:
linear-gradient(135deg, #FFA040 0%, #FFB85C 50%, #FFD080 100%)

Couleur solide principale: #FFD249 (jaune/doré)
```

**Quand utiliser:**
- Pages `/dashboard/searcher/*`
- Headers searcher
- Boutons CTA searcher
- Navigation searcher (PRIORITAIRE - c'est notre audience #1)

#### 🌈 GRADIENT TRICOLORE COMPLET (Identité EasyCo)
```css
linear-gradient(135deg, #6E56CF 0%, #FF6F3C 50%, #FFD249 100%)
```

**Quand utiliser:**
- Landing page hero
- Logo hover effects
- Brand moments forts
- Call-to-action multi-rôles

---

## 🚨 Problèmes Actuels à Résoudre

### Problème #1: Duplication de Variables CSS (URGENT)

**Situation actuelle:**
```css
/* ❌ SYSTÈME 1 - Legacy (à supprimer) */
--easy-purple-900: #6E56CF;
--easy-purple-700: #5B45B8;
--easy-yellow-500: #FFD249;

/* ❌ SYSTÈME 2 - Rôles (incomplet) */
--owner-primary: #6E56CF;
--searcher-primary: #FFD249;

/* ❌ SYSTÈME 3 - Échelle (incohérent) */
--owner-500: #6E56CF;
--searcher-500: #FFC107;  /* ⚠️ Différent de primary! */
```

**Solution attendue:**

```css
/* ✅ UN SEUL SYSTÈME - Role-based avec échelle cohérente */

/* SEARCHER */
--searcher-50: #FFFEF0;      /* Backgrounds très subtils */
--searcher-100: #FFF9E6;     /* Backgrounds légers */
--searcher-200: #FFE5A0;     /* Hover backgrounds */
--searcher-300: #FFD080;     /* Borders, dividers */
--searcher-400: #FFB85C;     /* Icons secondaires */
--searcher-500: #FFA040;     /* ⭐ PRINCIPALE (du logo) */
--searcher-600: #FF8C20;     /* Hover states */
--searcher-700: #F57F17;     /* Textes importants */
--searcher-800: #E65100;     /* Headers */
--searcher-900: #BF360C;     /* Ultra-dark */

/* OWNER */
--owner-50: #F9F8FF;
--owner-100: #F3F1FF;
--owner-200: #E0D9FF;
--owner-300: #C98B9E;        /* Du logo */
--owner-400: #A67BB8;        /* Du logo */
--owner-500: #7B5FB8;        /* ⭐ PRINCIPALE (du logo) */
--owner-600: #6B4FA8;
--owner-700: #5B45B8;
--owner-800: #4A148C;
--owner-900: #38006B;

/* RESIDENT */
--resident-50: #FFFAF8;
--resident-100: #FFF3EF;
--resident-200: #FFA66B;
--resident-300: #FF8C4B;     /* Du logo */
--resident-400: #E8865D;     /* Du logo */
--resident-500: #D97B6F;     /* ⭐ PRINCIPALE (du logo) */
--resident-600: #C96A5E;
--resident-700: #BF360C;
--resident-800: #8D2A0E;
--resident-900: #5D1A09;
```

**Action requise:**

1. **Auditer tout le codebase:**
```bash
# Chercher toutes les utilisations de l'ancien système
grep -r "easy-purple" app/ components/
grep -r "easy-yellow" app/ components/
grep -r "easy-orange" app/ components/
```

2. **Remplacer systématiquement:**
```tsx
// ❌ AVANT
className="bg-[var(--easy-purple-900)]"

// ✅ APRÈS
className="bg-owner-500"  // ou bg-[var(--owner-500)]
```

3. **Supprimer de globals.css:**
```css
/* TOUT SUPPRIMER */
--easy-purple-*
--easy-yellow-*
--easy-orange-*
```

---

### Problème #2: Trop de Gradients (Paralysie du Choix)

**Situation actuelle:**
```css
--gradient-searcher-logo
--gradient-searcher
--gradient-searcher-soft
--gradient-searcher-light
--gradient-searcher-medium
--gradient-searcher-dark
--gradient-searcher-subtle
--gradient-searcher-cta
--gradient-searcher-vibrant
/* 9 gradients = confusion totale */
```

**Solution attendue:**

```css
/* ✅ 3 GRADIENTS MAX PAR RÔLE */

/* SEARCHER - Jaune/Orange du logo */
--gradient-searcher: linear-gradient(135deg, #FFA040 0%, #FFB85C 50%, #FFD080 100%);
--gradient-searcher-subtle: linear-gradient(135deg, #FFF9E6 0%, #FFE5A0 100%);
--gradient-searcher-cta: var(--gradient-searcher); /* Alias pour clarté */

/* OWNER - Mauve/Rose du logo */
--gradient-owner: linear-gradient(135deg, #7B5FB8 0%, #A67BB8 50%, #C98B9E 100%);
--gradient-owner-subtle: linear-gradient(135deg, #F3F1FF 0%, #E0D9FF 100%);
--gradient-owner-cta: var(--gradient-owner);

/* RESIDENT - Orange/Corail du logo */
--gradient-resident: linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%);
--gradient-resident-subtle: linear-gradient(135deg, #FFF3EF 0%, #FFB88C 100%);
--gradient-resident-cta: var(--gradient-resident);

/* BRAND - Tricolore complet (moments forts) */
--gradient-brand: linear-gradient(135deg, #7B5FB8 0%, #E8865D 50%, #FFD080 100%);
```

**Règle d'usage:**

- **`-cta`**: Boutons principaux, call-to-action, headers
- **`-subtle`**: Backgrounds, sections, cards
- **`-brand`**: Landing page, logo effects, multi-rôle moments

**Action requise:**

1. Supprimer tous les autres gradients de `globals.css`
2. Chercher/remplacer les usages:
```tsx
// ❌ AVANT
className="bg-[var(--gradient-searcher-vibrant)]"

// ✅ APRÈS
className="bg-[var(--gradient-searcher-cta)]"
```

---

### Problème #3: Classes CSS `.btn` vs Composant React `<Button>`

**Situation actuelle:**

```css
/* globals.css - Classes CSS */
.btn-primary { ... }
.btn-secondary { ... }
```

```tsx
/* components/ui/button.tsx - Composant React */
<Button variant="default">Click</Button>
```

**Confusion:** Développeurs utilisent les deux, styles incohérents.

**Solution attendue:**

```tsx
/* ✅ UN SEUL SYSTÈME - Composant React uniquement */

// SUPPRIMER de globals.css:
.btn
.btn-primary
.btn-secondary
.btn-outline
.btn-ghost
.btn-sm
.btn-lg

// GARDER uniquement le composant React:
<Button variant="default">Primary action</Button>
<Button variant="outline">Secondary action</Button>
<Button variant="ghost">Tertiary action</Button>
<Button variant="destructive">Delete</Button>

// Pour les CTA avec gradient (role-based):
<Button
  className="cta-searcher text-white font-semibold"
>
  Trouver mon Coliving
</Button>
```

**Classes CTA à conserver:**

```css
/* Boutons CTA avec gradient + grain texture */
.cta-searcher {
  background: var(--gradient-searcher-cta);
  position: relative;
  overflow: hidden;
}

.cta-searcher::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--grain-url-medium);
  background-size: 200px 200px;
  background-repeat: repeat;
  mix-blend-mode: overlay;
  opacity: 0.45;
  pointer-events: none;
}

.cta-searcher:hover {
  filter: brightness(1.1);
  transform: scale(1.02);
  transition: all 0.2s ease;
}

/* Même structure pour .cta-owner et .cta-resident */
```

**Action requise:**

1. Trouver tous les `className="btn-*"` dans le code
2. Remplacer par `<Button variant="...">`
3. Supprimer les classes `.btn-*` de `globals.css`

---

### Problème #4: Border Radius - Modernisation

**Situation actuelle:**
```css
.btn { @apply rounded-full; }  /* 9999px - trop "pilule" */
.card { @apply rounded-2xl; }  /* 24px - ok */
.input { @apply rounded-xl; }  /* 16px - ok */
```

**Solution attendue (2025 Modern):**

```css
/* ✅ Standardiser sur rounded-xl pour boutons */
Boutons: rounded-xl (16px)      /* Plus moderne, moins "pilule" */
Cards: rounded-2xl (24px)       /* Garder */
Inputs: rounded-xl (16px)       /* Garder */
Badges: rounded-full (9999px)   /* Garder - c'est approprié */
Modals: rounded-2xl (24px)
Avatars: rounded-full
```

**Références modernes (2025):**
- Stripe: rounded-lg à rounded-xl
- Linear: rounded-lg
- Vercel: rounded-lg à rounded-xl
- **Pas** rounded-full pour les boutons

**Action requise:**

1. Modifier `components/ui/button.tsx`:
```tsx
// ❌ AVANT
className={cn("rounded-full", ...)}

// ✅ APRÈS
className={cn("rounded-xl", ...)}
```

2. Chercher tous les boutons avec `rounded-full` et les passer en `rounded-xl`

---

### Problème #5: Shadows - Simplification

**Situation actuelle:**
```css
--shadow-xs
--shadow-sm
--shadow-md
--shadow-lg
--shadow-xl
--shadow-2xl   /* ⚠️ Trop dramatique */
--shadow-inner
```

**Solution attendue:**

```css
/* ✅ 3 NIVEAUX SUFFISENT */
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* SUPPRIMER */
--shadow-xs
--shadow-xl
--shadow-2xl
--shadow-inner
```

**Règle d'usage:**
- `shadow-sm`: Cards au repos
- `shadow-md`: Hover states, dropdowns
- `shadow-lg`: Modals, popovers

**Action requise:**

1. Chercher `shadow-xl` et `shadow-2xl` dans le code
2. Remplacer par `shadow-lg`
3. Supprimer variables inutilisées

---

## 🎯 Composants Critiques à Vérifier

### 1. Headers (Role-based)

**Fichiers:**
- `components/layout/ModernSearcherHeader.tsx`
- `components/layout/ModernOwnerHeader.tsx`
- `components/layout/ModernResidentHeader.tsx`

**Vérifications:**

```tsx
// ✅ Le header doit utiliser le gradient du rôle

/* SEARCHER HEADER */
<header className="header-gradient-searcher">
  {/* Navigation avec effet gradient au hover */}
  <nav className="nav-item-searcher">
    <span className="nav-text">Explorer</span>
  </nav>
</header>

/* CSS attendu */
.header-gradient-searcher {
  background: linear-gradient(135deg,
    rgba(255, 160, 64, 0.95) 0%,
    rgba(255, 184, 92, 0.95) 50%,
    rgba(255, 208, 128, 0.95) 100%
  );
  backdrop-filter: blur(10px);  /* Glassmorphism */
}

.nav-item-searcher:hover .nav-text {
  background: var(--gradient-searcher);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

**Action requise:**

1. Vérifier que chaque header utilise SON gradient de rôle
2. Vérifier l'effet glassmorphism (backdrop-filter)
3. Vérifier le hover gradient sur navigation

---

### 2. Boutons CTA (Call-to-Action)

**Où les trouver:**
- Landing page (`app/page.tsx`)
- Headers
- Property cards
- Onboarding flows

**Design attendu:**

```tsx
/* SEARCHER CTA (jaune/orange du logo) */
<button className="cta-searcher px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200">
  Trouver Mon Coliving
</button>

/* OWNER CTA (mauve/rose du logo) */
<button className="cta-owner px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200">
  Louer Ma Propriété
</button>

/* RESIDENT CTA (orange/corail du logo) */
<button className="cta-resident px-8 py-4 rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200">
  Rejoindre la Communauté
</button>
```

**Effets attendus:**

1. **Grain texture overlay** (déjà implémenté - GARDER)
2. **Hover: brightness(1.1) + scale(1.02)**
3. **Transition: 200ms**
4. **Shadow: lg → xl au hover**

**Action requise:**

1. Auditer tous les boutons principaux
2. S'assurer qu'ils utilisent `.cta-{role}`
3. Vérifier les effets hover

---

### 3. Cards (Property Cards, Dashboard Cards)

**Fichiers:**
- `components/PropertyCard.tsx`
- `components/dashboard/*.tsx`

**Design attendu:**

```tsx
<div className="card-interactive bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
  {/* Contenu */}
</div>

/* CSS */
.card-interactive {
  @apply bg-white rounded-2xl shadow-sm p-6;
  @apply hover:shadow-md hover:scale-[1.01];
  @apply active:scale-[0.99];
  @apply transition-all duration-200;
  @apply cursor-pointer;
}
```

**Règles:**

- Border radius: `rounded-2xl` (24px)
- Shadow repos: `shadow-sm`
- Shadow hover: `shadow-md`
- Scale hover: `1.01` (subtil!)
- Background: toujours `bg-white` (pas de couleur)
- Accents de couleur: via badges, bordures, ou icônes

**Action requise:**

1. Vérifier toutes les cards
2. Uniformiser le border-radius
3. Vérifier les transitions

---

### 4. Landing Page Hero

**Fichier:** `app/page.tsx`

**Design attendu:**

```tsx
<section className="hero-section min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
  {/* Background avec grain subtil */}
  <div className="grain-subtle absolute inset-0 opacity-30" />

  {/* Contenu centré */}
  <div className="container mx-auto px-4 text-center relative z-10">
    <h1 className="text-6xl font-bold mb-6">
      <span className="text-gradient-brand">
        Votre Coliving Parfait à Bruxelles
      </span>
    </h1>

    <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
      Trouvez des colocataires compatibles, des propriétés vérifiées, et une communauté accueillante.
    </p>

    {/* CTA avec gradient tricolore */}
    <button className="cta-brand px-12 py-5 rounded-xl text-white font-bold text-xl shadow-xl hover:shadow-2xl">
      Commencer Maintenant
    </button>
  </div>
</section>
```

**Classe spéciale pour la landing:**

```css
.cta-brand {
  background: var(--gradient-brand);  /* Tricolore */
  position: relative;
  overflow: hidden;
}

.cta-brand::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--grain-url-medium);
  background-size: 200px 200px;
  background-repeat: repeat;
  mix-blend-mode: overlay;
  opacity: 0.5;
  pointer-events: none;
}

.text-gradient-brand {
  background: var(--gradient-brand);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

**Action requise:**

1. Vérifier que le hero utilise le gradient tricolore
2. Vérifier la grain texture
3. Vérifier le CTA principal

---

## 📐 Grille & Spacing (NE PAS TOUCHER)

**Cette partie est PARFAITE - ne change RIEN:**

```css
/* Grille 8px stricte */
--spacing-2: 0.5rem;   /* 8px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-12: 3rem;    /* 48px */
```

**Règle absolue:**
- Tout spacing DOIT être multiple de 8px (ou 4px pour fine-tuning)
- Jamais de `padding: 13px` ou `margin: 27px`
- Toujours `p-4`, `p-6`, `p-8`, `mb-4`, `gap-6`, etc.

---

## 🎨 Grain Textures (GARDER - C'est Unique)

**Fichiers:**
- `public/textures/grain-subtle.svg`
- `public/textures/grain-medium.svg`
- `public/textures/grain-strong.svg`

**Usage actuel (PARFAIT):**

```css
.cta-searcher::after,
.cta-owner::after,
.cta-resident::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: var(--grain-url-medium);
  background-size: 200px 200px;
  background-repeat: repeat;
  mix-blend-mode: overlay;
  opacity: 0.45;
  pointer-events: none;
}
```

**Ne change rien ici - c'est ce qui rend EasyCo unique.**

---

## 🔍 Checklist d'Uniformisation

### Phase 1: Cleanup Variables (Priorité 1)

- [ ] Supprimer toutes les variables `--easy-purple-*` de `globals.css`
- [ ] Supprimer toutes les variables `--easy-yellow-*` de `globals.css`
- [ ] Supprimer toutes les variables `--easy-orange-*` de `globals.css`
- [ ] Chercher/remplacer tous les usages dans le code
- [ ] Tester que rien n'est cassé visuellement

### Phase 2: Gradients (Priorité 1)

- [ ] Supprimer les gradients en trop (garder 3 par rôle + brand)
- [ ] Vérifier que tous les headers utilisent le bon gradient
- [ ] Vérifier que tous les CTAs utilisent `.cta-{role}`
- [ ] Tester les hover effects

### Phase 3: Boutons (Priorité 2)

- [ ] Supprimer les classes `.btn-*` de `globals.css`
- [ ] Migrer tous les `className="btn-*"` vers `<Button variant="...">`
- [ ] Changer `rounded-full` → `rounded-xl` pour les boutons
- [ ] Tester tous les boutons de l'app

### Phase 4: Cards & Components (Priorité 2)

- [ ] Uniformiser border-radius des cards (rounded-2xl)
- [ ] Uniformiser shadows (sm → md hover)
- [ ] Vérifier transitions (200ms standard)
- [ ] Tester hover effects

### Phase 5: Pages Critiques (Priorité 3)

- [ ] Landing page hero (gradient tricolore)
- [ ] Searcher header (gradient jaune/orange)
- [ ] Owner header (gradient mauve/rose)
- [ ] Resident header (gradient orange/corail)
- [ ] Property cards (uniformes)

---

## 🚫 Ce qu'il NE FAUT PAS Faire

### ❌ Ne JAMAIS:

1. **Créer de nouvelles couleurs** hors du système
2. **Mélanger les gradients de rôles** sur une même page
3. **Utiliser du CSS inline** avec des couleurs hardcodées
4. **Ignorer la grille 8px** (spacing random)
5. **Ajouter des animations** sans transition standard
6. **Utiliser `shadow-2xl`** (trop dramatique)
7. **Mettre des couleurs vives** sur du texte (gray only)
8. **Créer des boutons** sans passer par `<Button>` component

### ✅ Toujours:

1. **Utiliser les variables CSS** du design system
2. **Respecter la grille 8px** pour le spacing
3. **Utiliser les gradients du logo** pour les moments de marque
4. **Garder les textes en gray** (sauf highlights rôle)
5. **Utiliser les composants React** existants
6. **Tester sur mobile** (60% du traffic)
7. **Demander si incertain** avant de créer du nouveau

---

## 🎯 Standards de Qualité

### Niveau "Apple/Stripe" signifie:

1. **Cohérence absolue**
   - Même border-radius partout
   - Même spacing rhythm
   - Même transitions timing

2. **Attention aux détails**
   - Gradients exactement du logo
   - Grain texture subtile mais présente
   - Hover states fluides (200ms)

3. **Performance**
   - Pas d'animations lourdes
   - Transitions CSS only (pas de JS)
   - Images optimisées

4. **Accessibilité**
   - Contraste texte/fond respecté
   - Focus states visibles
   - Touch targets 44px minimum

---

## 📝 Workflow de Travail

### Avant de commencer:

1. **Lire TOUT ce document**
2. **Comprendre la direction artistique**
3. **Identifier les fichiers à modifier**
4. **Faire un plan étape par étape**

### Pendant le travail:

1. **Travailler par phase** (ne pas tout faire d'un coup)
2. **Tester après chaque changement**
3. **Comparer avant/après** visuellement
4. **Prendre des screenshots** si nécessaire
5. **S'ARRÊTER et DEMANDER** si quelque chose n'est pas clair

### Questions à se poser à chaque modification:

- ❓ Est-ce que cette couleur vient du logo ?
- ❓ Est-ce que ce gradient respecte le rôle ?
- ❓ Est-ce que ce spacing est multiple de 8px ?
- ❓ Est-ce que cette transition fait 200ms ?
- ❓ Est-ce que ça ressemble à du Apple/Stripe/Linear ?
- ❓ Est-ce que c'est cohérent avec le reste de l'app ?

**Si la réponse est NON à une seule question → S'ARRÊTER et DEMANDER.**

---

## 🎨 Inspirations Visuelles (Notre Benchmark)

### Marques de référence:

1. **Stripe** - Subtilité, professionnalisme
2. **Linear** - Modernité, performance
3. **Vercel** - Minimalisme, clarté
4. **Apple** - Attention aux détails
5. **Airbnb** - Chaleur, accessibilité

### Ce qu'on prend de chacune:

- **Stripe**: Gradients subtils, shadows légères
- **Linear**: Border-radius modernes, transitions rapides
- **Vercel**: Spacing généreux, typographie claire
- **Apple**: Cohérence absolue, aucun compromis
- **Airbnb**: Chaleur humaine, couleurs accueillantes

### Notre différenciateur:

- **Grain textures** (personne d'autre ne fait ça)
- **Gradients tricolores du logo** (identité unique)
- **Role-based theming** (expérience personnalisée)

---

## 📞 Quand Demander de l'Aide

### 🛑 ARRÊTE-TOI et DEMANDE si:

1. Tu ne comprends pas **pourquoi** une couleur est utilisée
2. Tu hésites entre **2 approches** de design
3. Tu veux **créer une nouvelle classe CSS** (peut-être pas nécessaire)
4. Tu veux **changer le logo** ou les couleurs principales
5. Tu trouves une **incohérence** non documentée ici
6. Tu n'es **pas sûr à 100%** de ton choix

### ✅ Continue si:

1. Tu suis exactement ce qui est écrit ici
2. Tu remplaces du legacy par du nouveau système
3. Tu uniformises selon les standards définis
4. Tu corriges une erreur évidente (typo, etc.)

---

## 🎯 Objectif Final

### À la fin de cette mission:

✅ **Zéro variable legacy** dans le code
✅ **Un seul système de couleurs** (role-based)
✅ **3 gradients par rôle** maximum (+ brand)
✅ **Composants React uniquement** (pas de classes CSS .btn)
✅ **Border-radius cohérent** partout
✅ **Shadows simplifiées** (3 niveaux)
✅ **Headers avec gradients du logo** pour chaque rôle
✅ **CTAs avec grain texture** et bon gradient
✅ **Landing page** avec gradient tricolore
✅ **Expérience visuelle** digne d'Apple/Stripe

### EasyCo aura:

- Une identité visuelle **forte et unique**
- Une cohérence **absolue** sur toutes les pages
- Des gradients qui **racontent l'histoire** des 3 rôles
- Un design system **maintenable** et **scalable**
- Une app qui fait dire "wow" au premier coup d'œil

---

## 🚀 Commencer Maintenant

1. **Lis ce document en entier** (ne skip rien)
2. **Pose toutes tes questions** AVANT de commencer
3. **Fais un plan** de tes 5 premières tâches
4. **Commence par Phase 1** (cleanup variables)
5. **Teste après chaque changement**
6. **Partage ton progrès** régulièrement

**Rappelle-toi: Il s'agit de notre identité. Chaque pixel compte. Ne précipite rien. Fais-le bien.**

---

**Prêt ? Pose tes questions maintenant ou commence par la Phase 1 de la checklist. 🎨**
