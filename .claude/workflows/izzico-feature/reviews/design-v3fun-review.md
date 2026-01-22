# Review: Design V3-fun

**Objectif**: Vérifier la conformité au design system Izzico V3-fun.

## Sources de Vérité

- `brand-identity/izzico-color-system.html` - Couleurs absolues
- `.claude/skills/design-guide.md` - Patterns React/Tailwind
- `app/globals.css` - Variables CSS

## Checklist de Review

### 1. Couleurs par Rôle

**Règle**: Chaque page doit utiliser UNE seule palette de rôle.

| Rôle | Classes Tailwind | Variables CSS |
|------|------------------|---------------|
| Searcher | `bg-searcher-*`, `text-searcher-*` | `--searcher-*` |
| Owner | `bg-owner-*`, `text-owner-*` | `--owner-*` |
| Resident | `bg-resident-*`, `text-resident-*` | `--resident-*` |

**Vérifier**:
- [ ] Pas de mélange de couleurs de rôles différents sur une même page
- [ ] Utilisation des classes role-based (pas de `bg-purple-500` hardcodé)
- [ ] Gradients signature utilisés pour les CTAs

**Pattern recherché** (FAIL):
```tsx
// ❌ Couleurs hardcodées
className="bg-purple-500"
className="bg-yellow-400"
className="text-orange-600"

// ❌ Mélange de rôles
<div className="bg-searcher-100">
  <button className="bg-owner-500"> // FAIL: Owner dans contexte Searcher
</div>
```

**Pattern attendu** (PASS):
```tsx
// ✅ Classes role-based
className="bg-searcher-500"
className="bg-gradient-searcher"
className="text-owner-600"

// ✅ Contexte cohérent
<div className="bg-searcher-100">
  <button className="bg-searcher-500 hover:bg-searcher-600">
</div>
```

### 2. Gradients Signature

**Le gradient Izzico** (3 couleurs primaires des rôles):
```css
linear-gradient(135deg,
  #9c5698 0%,    /* Owner Primary */
  #c85570 20%,
  #d15659 35%,
  #e05747 50%,   /* Resident Primary */
  #ff7c10 75%,
  #ffa000 100%   /* Searcher Primary */
)
```

**Vérifier**:
- [ ] Gradient signature utilisé pour éléments de marque
- [ ] Gradients par rôle pour les CTAs spécifiques

### 3. Arrondis (Rounded Corners)

**Standards V3-fun**:
| Élément | Classe | Valeur |
|---------|--------|--------|
| Cards | `rounded-2xl` | 16px |
| Hero sections | `rounded-3xl` | 24px |
| Inputs | `rounded-xl` | 12px |
| Buttons | `rounded-full` | Pill |
| Badges | `rounded-full` | Pill |

**Vérifier**:
- [ ] Pas de `rounded-md` ou `rounded-lg` (trop carré pour V3-fun)
- [ ] Cohérence des arrondis par type d'élément

**Pattern recherché** (FAIL):
```tsx
// ❌ Arrondis insuffisants
className="rounded-md"
className="rounded"
className="rounded-lg"
```

### 4. Shadows (Ombres Douces)

**Standards V3-fun**:
```css
shadow-sm   → Cards au repos
shadow-md   → Hover states
shadow-lg   → Modals, dropdowns
shadow-soft → Custom soft shadow
```

**Vérifier**:
- [ ] Pas de `shadow-2xl` (trop dramatique)
- [ ] Pas de shadows colorées
- [ ] Transitions sur hover

**Pattern attendu**:
```tsx
className="shadow-sm hover:shadow-md transition-shadow"
```

### 5. Animations Framer Motion

**Standards V3-fun**:
- Fade in au chargement
- Scale subtle sur hover
- Slide up pour les listes

**Vérifier**:
- [ ] Animations présentes mais subtiles
- [ ] Durées < 300ms
- [ ] Pas d'animations distrayantes

**Pattern attendu**:
```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2 }}
>
```

### 6. Responsive Design

**Standards**:
- Mobile-first
- Breakpoints Tailwind standards

**Vérifier**:
- [ ] Layout fonctionne à 375px
- [ ] Pas de scroll horizontal sur mobile
- [ ] Touch targets ≥ 44px

### 7. Composants UI Existants

**Vérifier**:
- [ ] Utilisation de `components/ui/` en priorité
- [ ] Pas de re-création de composants existants

## Format du Rapport

Pour chaque issue trouvée:

```markdown
### D-[ID]: [Titre du problème]

**Sévérité**: [CRITICAL | HIGH | MEDIUM | LOW]
**Fichier**: [path/file.tsx:ligne]
**Règle violée**: [Nom de la règle]

**Code problématique**:
```tsx
[code actuel]
```

**Fix suggéré**:
```tsx
[code corrigé]
```

**Impact**: [Pourquoi c'est important]
```

## Scoring

| Catégorie | Points Max | Critères |
|-----------|------------|----------|
| Couleurs | 25 | Cohérence rôle, pas de hardcode |
| Gradients | 15 | Usage approprié |
| Arrondis | 15 | V3-fun standards |
| Shadows | 10 | Subtilité |
| Animations | 15 | Présence, subtilité |
| Responsive | 10 | Mobile-first |
| Composants | 10 | Réutilisation |

**Score Design = Total / 100**

- ≥ 90: ✅ EXCELLENT
- 75-89: 🟡 GOOD (minor fixes)
- 60-74: 🟠 NEEDS WORK
- < 60: 🔴 MAJOR ISSUES
