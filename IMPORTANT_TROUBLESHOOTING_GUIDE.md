# ⚠️ GUIDE DE DÉPANNAGE CRITIQUE - EASYCO

**Date de création**: 10 Novembre 2025
**Incident résolu**: Crash de l'interface searcher pendant 4 jours
**Commit de résolution**: `ad4c82e`

---

## 🚨 INCIDENT: Interface Searcher Complètement Inaccessible

### Symptômes
- ✗ Page `/dashboard/searcher` affiche "Oops! Something went wrong"
- ✗ Erreur dans la console: `TypeError: undefined is not an object (evaluating 'S.browse')`
- ✗ Erreur dans le fichier bundle: `7354-xxxxx.js`
- ✗ Le problème n'apparaît QUE en production Vercel
- ✓ Le build local fonctionne parfaitement

### Cause Racine Identifiée

**LE PROBLÈME N'ÉTAIT PAS**:
- ❌ Les tables Supabase (toutes fonctionnelles)
- ❌ Les RLS policies (correctement configurées)
- ❌ Google Maps API en général
- ❌ Le commit aesthetic lui-même

**LE VRAI PROBLÈME**:
```typescript
// ❌ MAUVAIS - Ceci cause le crash même si le composant n'est pas utilisé!
import GooglePlacesAutocomplete from '@/components/ui/google-places-autocomplete';

// Plus loin dans le code...
// <GooglePlacesAutocomplete ... /> ← Composant commenté mais IMPORT toujours présent!
```

**POURQUOI C'EST UN PROBLÈME**:
1. Next.js voit l'import → inclut GooglePlacesAutocomplete dans le bundle
2. GooglePlacesAutocomplete charge `useGoogleMaps` hook
3. `useGoogleMaps` tente de charger dynamiquement Google Maps API
4. Conflit/race condition avec d'autres parties de l'app → `S.browse` undefined
5. **CRASH TOTAL** de la page

---

## ✅ SOLUTION APPLIQUÉE

### Étape 1: Supprimer l'import (pas juste commenter le composant)

**Fichier**: `components/dashboard/ModernSearcherDashboard.tsx`

```typescript
// ✅ CORRECT - Import complètement commenté
// TEMPORARILY DISABLED: GooglePlacesAutocomplete causes crash in production
// import GooglePlacesAutocomplete from '@/components/ui/google-places-autocomplete';
```

### Étape 2: Désactiver tous les composants Map

Les composants suivants ont été **complètement désactivés** (fichiers renommés en `.tsx.disabled`):
- `components/PropertyMap.tsx.disabled`
- `components/SinglePropertyMap.tsx.disabled`
- `components/AdvancedPropertyMap.tsx.disabled`

**Raison**: Tous utilisent Google Maps et peuvent causer le même problème

### Étape 3: Remplacer les usages par des placeholders

**Fichiers modifiés**:
- `app/properties/[id]/page.tsx` - SinglePropertyMap → Placeholder
- `app/properties/browse/page.tsx` - PropertyMap → Placeholder
- `app/test-map/page.tsx` - SinglePropertyMap → Placeholder

**Code du placeholder**:
```tsx
{/* TEMPORARILY DISABLED: Map component causes build issues */}
<div className="w-full h-[400px] rounded-b-2xl overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
  <div className="text-center p-8">
    <MapPin className="w-12 h-12 text-orange-400 mx-auto mb-4" />
    <p className="text-gray-600 font-medium mb-2">Carte temporairement indisponible</p>
    <p className="text-sm text-gray-500">
      {property.address}, {property.city} {property.postal_code}
    </p>
  </div>
</div>
```

---

## 📋 CHECKLIST: Éviter Ce Problème à l'Avenir

### Avant d'Ajouter un Nouveau Composant Client Lourd

- [ ] Le composant charge-t-il des scripts externes? (Google Maps, Stripe, etc.)
- [ ] Le composant utilise-t-il des hooks custom qui chargent dynamiquement du code?
- [ ] Le composant sera-t-il importé dans plusieurs pages?
- [ ] Y a-t-il des alternatives plus légères? (lazy loading, dynamic imports)

### Si Tu Dois Commenter un Composant

**⚠️ RÈGLE D'OR**:
```
Commenter le COMPOSANT ≠ Supprimer du bundle
Commenter l'IMPORT = Vraiment supprimer du bundle
```

**MAUVAIS**:
```tsx
import HeavyComponent from './HeavyComponent';

// <HeavyComponent /> ← Composant commenté
// ❌ IMPORT toujours là → Composant inclus dans le bundle!
```

**BON**:
```tsx
// TEMPORARILY DISABLED: Reason here
// import HeavyComponent from './HeavyComponent';

// <HeavyComponent />
// ✅ Import commenté → Composant PAS dans le bundle
```

### Debugging d'Erreurs Similaires

**Si tu vois ces symptômes**:
1. ✗ Erreur `X.something is undefined` dans un fichier bundle minifié
2. ✗ Fonctionne localement mais crash en production Vercel
3. ✗ L'erreur apparaît après avoir ajouté de nouveaux composants

**ALORS suit cette méthodologie**:

#### 1. Identifier QUAND le problème est apparu
```bash
# Chercher le dernier commit qui fonctionnait
git log --oneline --all -20

# Comparer avec le commit qui casse
git diff <bon_commit>..<mauvais_commit> --stat
```

#### 2. Chercher les nouveaux imports de composants clients
```bash
# Chercher tous les nouveaux imports dans les fichiers modifiés
git diff <bon_commit>..<mauvais_commit> | grep "^+.*import"
```

#### 3. Identifier les composants qui chargent des scripts externes
```bash
# Chercher useEffect qui chargent des scripts
grep -r "useEffect.*script" components/ --include="*.tsx"

# Chercher les dynamic imports
grep -r "import(.*)" components/ --include="*.tsx"
```

#### 4. Tester en désactivant les imports un par un
```typescript
// Commenter l'import suspect
// import SuspectComponent from './SuspectComponent';

// Déployer sur Vercel
// Tester si l'erreur persiste
```

---

## 🔧 RÉACTIVER GOOGLE MAPS (À faire plus tard)

Pour réactiver Google Maps de façon sûre:

### Option 1: Utiliser @vis.gl/react-google-maps (Recommandé)

```bash
npm install @vis.gl/react-google-maps
```

```tsx
// app/layout.tsx ou ClientProviders.tsx
import { APIProvider } from '@vis.gl/react-google-maps';

export function ClientProviders({ children }) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      {children}
    </APIProvider>
  );
}
```

```tsx
// Nouveau composant: components/ui/SafeGooglePlacesAutocomplete.tsx
'use client';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

export function SafeGooglePlacesAutocomplete({ onPlaceSelect }) {
  const places = useMapsLibrary('places');
  // Implementation with vis.gl
}
```

### Option 2: Dynamic Import avec Lazy Loading

```tsx
// components/dashboard/ModernSearcherDashboard.tsx
import dynamic from 'next/dynamic';

const GooglePlacesAutocomplete = dynamic(
  () => import('@/components/ui/google-places-autocomplete'),
  {
    ssr: false,
    loading: () => <div>Chargement...</div>
  }
);

// Utiliser seulement si nécessaire
{isClient && <GooglePlacesAutocomplete />}
```

### Option 3: Alternative - Downshift + Geocoding API

Utiliser une bibliothèque comme `downshift` pour l'autocomplete UI et appeler Google Geocoding API côté serveur:

```tsx
// API Route: app/api/geocode/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );

  return Response.json(await response.json());
}
```

---

## 📊 MÉTRIQUES DE L'INCIDENT

- **Durée**: 4 jours (6-10 Novembre 2025)
- **Impact**: Interface searcher complètement inaccessible en production
- **Commits de tentatives de fix**: 10 commits
- **Cause identifiée**: Import non supprimé
- **Temps de résolution final**: 2 heures (une fois la vraie cause identifiée)

---

## 🎓 LEÇONS APPRISES

### 1. **Écouter l'utilisateur quand il dit "ça marchait avant X"**
L'utilisateur avait correctement identifié que le problème venait du commit aesthetic (`e3df143`). J'ai perdu du temps à chercher ailleurs.

### 2. **Import ≠ Usage**
Un import JavaScript charge le module même si tu ne l'utilises pas dans le code. Pour l'exclure du bundle, il FAUT commenter/supprimer l'import.

### 3. **Next.js bundling est intelligent mais opaque**
Next.js optimise automatiquement les chunks, ce qui peut créer des dépendances inattendues. Utiliser `next build` avec `--debug` pour voir les chunks.

### 4. **Production ≠ Development**
Certains problèmes (comme les race conditions de chargement de scripts) n'apparaissent qu'en production avec les bundles minifiés.

### 5. **Méthodologie avant solutions rapides**
Plutôt que 10 tentatives de fix, une analyse méthodique du commit incriminé aurait résolu le problème en 1 heure.

---

## 🔗 COMMITS IMPORTANTS

- `e3df143` - Commit aesthetic qui a déclenché le problème
- `82db4d0` - Suppression import GooglePlacesAutocomplete (searcher)
- `2fbc61a` - Désactivation Map components dans toutes les pages
- `ad4c82e` - Fix final (import MapPin manquant)

---

## 📞 SI ÇA SE REPRODUIT

### Étape 1: NE PAS PANIQUER
- Le code fonctionne localement? → C'est un problème de bundling/production
- Vérifier les logs Vercel pour identifier le fichier problématique

### Étape 2: IDENTIFIER LE COMMIT
```bash
git log --oneline --all -20
# Chercher le dernier commit où ça fonctionnait
# Comparer avec le commit actuel
```

### Étape 3: ANALYSER LES NOUVEAUX IMPORTS
```bash
git diff <bon_commit>..HEAD -- "*.tsx" "*.ts" | grep "^+.*import"
```

### Étape 4: DÉSACTIVER MÉTHODIQUEMENT
- Commenter les nouveaux imports un par un
- Tester sur Vercel après chaque changement
- Noter quel import cause le problème

### Étape 5: COMPRENDRE POURQUOI
- Le composant charge-t-il des scripts externes?
- Y a-t-il une race condition?
- Le composant est-il compatible SSR?

### Étape 6: SOLUTION DURABLE
- Utiliser dynamic imports
- Lazy load les composants lourds
- Isoler les dépendances problématiques

---

## ✅ VÉRIFICATION POST-FIX

Pour confirmer que tout fonctionne:

```bash
# 1. Build local
npm run build

# 2. Vérifier qu'il n'y a pas d'erreurs TypeScript
npx tsc --noEmit

# 3. Tester en production
# - Vider le cache navigateur (Cmd+Shift+R)
# - Tester /dashboard/searcher
# - Vérifier la console (F12) - pas d'erreurs S.browse
# - Tester /properties/browse
# - Tester /properties/[id]
```

---

**Créé par**: Claude Code
**Dernière mise à jour**: 10 Novembre 2025
**Version**: 1.0

---

## 🎯 RAPPEL FINAL

> **"Commenter un composant ne suffit pas - il faut AUSSI commenter son import!"**

Cette simple règle aurait évité 4 jours de downtime.

Garde ce document précieusement. Si un jour l'interface crash en production avec une erreur obscure dans un bundle minifié, reviens ici. La solution est probablement un import non supprimé d'un composant qui charge des scripts externes.
