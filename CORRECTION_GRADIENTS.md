# ⚠️ CORRECTION - GRADIENTS EASYCO

## 🎨 DEUX GRADIENTS DIFFÉRENTS

EasyCo utilise **DEUX gradients orange différents** selon l'interface utilisateur :

---

## 1. GRADIENT RESIDENT (Corail)

**Couleur**: Orange corail
**Hex**: `#D97B6F → #E8865D → #FF8C4B`

### CSS
```css
background: linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%);
```

### Tailwind
```tsx
className="bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]"
```

### Utilisation
- ✅ Interface RESIDENT (colocataires)
- ✅ Dashboard resident
- ✅ Onboarding resident
- ✅ Matching resident
- ✅ Logo EasyCo dans le header resident

**Nuances**:
- `#D97B6F` - Corail rosé (début)
- `#E8865D` - Orange corail (milieu)
- `#FF8C4B` - Orange vif (fin)

---

## 2. GRADIENT SEARCHER (Orange vif)

**Couleur**: Orange bright
**Hex**: `#FFA040 → #FFB85C`

### CSS
```css
background: linear-gradient(135deg, #FFA040 0%, #FFB85C 100%);
```

### Tailwind
```tsx
className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C]"
```

### Utilisation
- ✅ Interface SEARCHER (chercheurs de logement)
- ✅ Dashboard searcher
- ✅ Onboarding searcher
- ✅ Matching/swipe searcher
- ✅ Logo EasyCo dans le header searcher

**Nuances**:
- `#FFA040` - Orange vif
- `#FFB85C` - Orange clair/doré

---

## 📋 FICHIERS CORRIGÉS AU GRADIENT CORAIL

### Composants Principaux
1. `components/layout/ModernResidentHeader.tsx`
   - Logo: ✅ Gradient corail
   - Triangle actif: ✅ `#E8865D`
   - Avatar: ✅ Gradient corail

2. `components/dashboard/ModernResidentDashboard.tsx`
   - KPI cards: ✅ Gradient corail
   - Boutons: ✅ Gradient corail
   - Community happiness: ✅ Gradient corail

### Onboarding Pages (6 fichiers)
3. `app/onboarding/resident/basic-info/page.tsx` ✅
4. `app/onboarding/resident/lifestyle/page.tsx` ✅
5. `app/onboarding/resident/personality/page.tsx` ✅
6. `app/onboarding/resident/living-situation/page.tsx` ✅
7. `app/onboarding/resident/review/page.tsx` ✅
8. `app/onboarding/resident/success/page.tsx` ✅

### Matching
9. `app/dashboard/resident/matching/page.tsx` ✅

---

## 🔧 HELPER CRÉÉ

Fichier: `lib/design-system/gradients.ts`

```typescript
export const GRADIENTS = {
  searcher: {
    css: 'linear-gradient(135deg, #FFA040 0%, #FFB85C 100%)',
    tailwind: 'from-[#FFA040] to-[#FFB85C]',
    colors: { start: '#FFA040', end: '#FFB85C' }
  },
  resident: {
    css: 'linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)',
    tailwind: 'from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]',
    colors: { start: '#D97B6F', mid: '#E8865D', end: '#FF8C4B' }
  }
};
```

**Utilisation**:
```tsx
import { GRADIENTS } from '@/lib/design-system/gradients';

// CSS inline
style={{ background: GRADIENTS.resident.css }}

// Tailwind
className={`bg-gradient-to-r ${GRADIENTS.resident.tailwind}`}
```

---

## ✅ VALIDATION VISUELLE

### Gradient Resident (Corail)
```
🟠 Début: #D97B6F (corail rosé)
🟠 Milieu: #E8865D (orange corail)
🟠 Fin: #FF8C4B (orange vif)
```

### Gradient Searcher (Bright)
```
🟠 Début: #FFA040 (orange vif)
🟠 Fin: #FFB85C (orange doré)
```

---

## 📝 NOTES IMPORTANTES

1. **NE PAS CONFONDRE** :
   - Resident = Corail (3 couleurs)
   - Searcher = Bright (2 couleurs)

2. **Utiliser le bon gradient** selon le contexte:
   - Headers/Logos: Utiliser le gradient du rôle
   - CTAs: Utiliser le gradient du rôle
   - Badges: Utiliser le gradient du rôle

3. **Pattern pour futurs composants**:
   ```tsx
   // ❌ INCORRECT
   className="bg-gradient-to-r from-orange-500 to-orange-700"

   // ✅ CORRECT pour RESIDENT
   className="bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B]"

   // ✅ CORRECT pour SEARCHER
   className="bg-gradient-to-r from-[#FFA040] to-[#FFB85C]"
   ```

---

## 🎯 RÉSUMÉ

| Interface | Gradient | Hex | Couleurs |
|-----------|----------|-----|----------|
| **RESIDENT** | Corail | `#D97B6F → #E8865D → #FF8C4B` | 3 couleurs |
| **SEARCHER** | Bright | `#FFA040 → #FFB85C` | 2 couleurs |

✅ **9 fichiers corrigés** avec le gradient corail resident
✅ **Helper créé** dans `lib/design-system/gradients.ts`
✅ **Documentation** mise à jour

---

*Document créé le 5 novembre 2025*
*Correction effectuée pour respecter le gradient corail original des residents*
