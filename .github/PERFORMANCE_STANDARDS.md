# Standards de Performance - EasyCo Onboarding

Ce document définit les standards de performance que tout code doit respecter avant d'être mergé.

---

## 📏 Règles Obligatoires

### 1. Imports Optimisés

#### ✅ REQUIS: Imports individuels pour Lucide Icons
```typescript
// ✅ BON
import Home from 'lucide-react/dist/esm/icons/home';
import User from 'lucide-react/dist/esm/icons/user';

// ❌ INTERDIT
import { Home, User } from 'lucide-react';
```

**Justification:** Économise 30-40KB par page

---

### 2. Lazy Loading des Bibliothèques Lourdes

#### ✅ REQUIS: Dynamic import pour Framer Motion, Recharts, etc.
```typescript
// ✅ BON
const AnimatePresence = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.AnimatePresence })),
  { ssr: false }
);

// ❌ INTERDIT (sauf si absolument nécessaire au first paint)
import { AnimatePresence } from 'framer-motion';
```

**Seuils:** Toute bibliothèque > 10KB doit être lazy-loadée si non critique

---

### 3. Mémoïsation des Composants en Liste

#### ✅ REQUIS: React.memo pour les composants de liste
```typescript
// ✅ BON
export const PropertyCard = memo(function PropertyCard({ property }) {
  // ...
});

// ❌ INTERDIT pour les composants rendus > 5 fois
export function PropertyCard({ property }) {
  // ...
}
```

**Justification:** Réduit les re-renders de 60-70%

---

### 4. Requêtes Database Sélectives

#### ✅ REQUIS: SELECT explicite, jamais SELECT *
```typescript
// ✅ BON
.select('id, title, city, monthly_rent')

// ❌ INTERDIT
.select('*')
```

**Exception:** Tests unitaires uniquement

---

### 5. Cache React Query

#### ✅ REQUIS: staleTime configuré pour toutes les queries
```typescript
// ✅ BON
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 5 * 60 * 1000, // 5 minutes
});

// ⚠️ ACCEPTABLE seulement pour données temps-réel
useQuery({
  queryKey: ['live-data'],
  queryFn: fetchData,
  // staleTime: 0 (par défaut)
});
```

---

### 6. Images Optimisées

#### ✅ REQUIS: next/image pour toutes les images
```typescript
// ✅ BON
import Image from 'next/image';
<Image src="/photo.jpg" width={400} height={300} alt="..." />

// ❌ INTERDIT
<img src="/photo.jpg" alt="..." />
```

**Exception:** SVG inline seulement

---

## 🎯 Seuils de Performance

### Bundle Size
| Métrique | Limite | Action si dépassé |
|----------|--------|-------------------|
| Page JavaScript | < 150KB | Lazy loading obligatoire |
| Bundle total | < 250KB | Review architecture |
| First Load JS | < 200KB | Blocking merge |

### Core Web Vitals
| Métrique | Target | Limite | Action |
|----------|--------|--------|--------|
| FCP | < 1.5s | < 2.0s | Warning si dépassé |
| LCP | < 2.5s | < 3.0s | Warning si dépassé |
| TTI | < 2.0s | < 3.0s | Blocking si dépassé |
| CLS | < 0.1 | < 0.25 | Warning si dépassé |

---

## 🔍 Process de Review

### Avant de créer une PR

1. **Lancer l'analyse**
```bash
./scripts/analyze-performance.sh
```

2. **Vérifier le bundle**
```bash
npm run analyze
```

3. **Build de production**
```bash
npm run build
```

4. **Vérifier les warnings**
   - Aucun warning de bundle size
   - Aucun warning de dependencies

### Checklist PR

Copier-coller dans chaque PR:

```markdown
## Performance Checklist

- [ ] Tous les imports Lucide sont individuels (`lucide-react/dist/esm/icons/`)
- [ ] Bibliothèques lourdes lazy-loadées (Framer Motion, Recharts)
- [ ] Composants de liste wrappés dans `memo()`
- [ ] Event handlers utilisent `useCallback()`
- [ ] Calculs coûteux utilisent `useMemo()`
- [ ] Requêtes Supabase avec SELECT explicite
- [ ] React Query avec `staleTime` configuré
- [ ] Images utilisent `next/image`
- [ ] `npm run analyze` vérifié
- [ ] Pas de warning de bundle size
- [ ] Build réussi sans erreur
```

---

## 🚨 Violations Bloquantes

Ces violations **bloquent le merge** automatiquement:

### 1. Bundle > 250KB
```
Error: Bundle size exceeds limit (250KB)
Current: 280KB
```

**Action:** Refactoring obligatoire

### 2. SELECT * en production
```
Error: SELECT * found in production code
File: app/matching/page.tsx:42
```

**Action:** Spécifier les colonnes

### 3. Import direct de bibliothèque lourde
```
Error: Direct import of heavy library
import { motion } from 'framer-motion' // 40KB
```

**Action:** Utiliser dynamic import

### 4. Images non-optimisées
```
Error: <img> tag found, use next/image
File: components/PropertyCard.tsx:15
```

**Action:** Remplacer par `next/image`

---

## ⚠️ Violations Warning

Ces violations génèrent des **warnings** mais ne bloquent pas:

### 1. Composant non mémoïsé en liste
```
Warning: Component rendered in map without memo()
File: components/PropertyList.tsx
```

### 2. Formatter recréé dans render
```
Warning: Intl.NumberFormat created in render
File: components/Price.tsx:10
```

### 3. React Query sans staleTime
```
Warning: useQuery without staleTime
File: hooks/use-properties.ts:8
```

---

## 📊 Monitoring Automatique

### CI/CD Pipeline

Chaque PR déclenche automatiquement:

1. **Build Analysis**
   - Taille du bundle
   - Nombre de chunks
   - Dépendances lourdes

2. **Code Scanning**
   - Imports non-optimisés
   - SELECT *
   - Images non-optimisées

3. **Lighthouse CI**
   - Performance score
   - Accessibility score
   - Best practices

### Rapports

Les rapports sont automatiquement postés en commentaire de PR:

```markdown
## Performance Report

### Bundle Size
- Total: 220KB ✅ (limit: 250KB)
- First Load: 180KB ✅ (limit: 200KB)

### Code Quality
- Optimized imports: 95% ✅
- Memoized components: 78% ⚠️
- Selective queries: 100% ✅

### Lighthouse Scores
- Performance: 92 ✅
- Accessibility: 98 ✅
- Best Practices: 95 ✅
- SEO: 100 ✅
```

---

## 🛠️ Outils de Développement

### ESLint Rules (à venir)

```json
{
  "rules": {
    "no-barrel-imports": "error",
    "require-lazy-loading": "warn",
    "require-memo-in-lists": "warn",
    "no-select-star": "error"
  }
}
```

### Pre-commit Hooks (à venir)

```bash
# .husky/pre-commit
npm run analyze-performance
```

---

## 📚 Formation

### Resources Recommandées

1. **Next.js Performance**
   - [Official Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
   - Durée: 2h

2. **React Performance**
   - [React.dev Optimization](https://react.dev/learn/render-and-commit)
   - Durée: 1h

3. **Web Performance**
   - [Web.dev Performance](https://web.dev/performance/)
   - Durée: 3h

### Exercices Pratiques

1. **Optimiser un composant existant**
   - Trouver un composant non-optimisé
   - Appliquer memo + useCallback
   - Mesurer l'amélioration

2. **Lazy loading**
   - Identifier une bibliothèque lourde
   - Implémenter le dynamic import
   - Vérifier le bundle size

3. **Database optimization**
   - Trouver une query SELECT *
   - Refactorer avec colonnes explicites
   - Mesurer la réduction de données

---

## 🎖️ Best Practices Champions

### Hall of Fame

Développeurs ayant le plus contribué aux optimisations:

1. **[Nom]** - 15 PRs optimisées
2. **[Nom]** - 12 PRs optimisées
3. **[Nom]** - 10 PRs optimisées

### Contributions Notables

- **Réduction de 50KB** - [Nom] - Refactoring imports Lucide
- **-40% re-renders** - [Nom] - Mémoïsation PropertyMatchCard
- **-60% data transfer** - [Nom] - Optimisation queries Supabase

---

## 🤝 Contribution

### Comment Aider

1. **Améliorer ce document**
   - Proposer de nouvelles règles
   - Ajouter des exemples
   - Corriger des erreurs

2. **Créer des outils**
   - ESLint plugins
   - Pre-commit hooks
   - Scripts d'analyse

3. **Former l'équipe**
   - Sessions de formation
   - Code reviews
   - Pair programming

---

## 📞 Contact

Pour toute question sur les standards de performance:

- **Canal Slack:** #performance
- **Email:** dev-team@easyco.com
- **Documentation:** [PERFORMANCE_GUIDE.md](../PERFORMANCE_GUIDE.md)

---

**Version:** 1.0.0
**Dernière mise à jour:** 2025-11-02
**Maintenu par:** Équipe Performance EasyCo
