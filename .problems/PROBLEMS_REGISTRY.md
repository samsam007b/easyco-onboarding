# 📚 REGISTRE DES PROBLÈMES - EASYCO

**Base de connaissance des problèmes techniques rencontrés et résolus**

Ce document sert de référence pour les projets futurs. Chaque problème est documenté avec sa complexité, sa cause racine, et sa solution.

---

## 📊 LÉGENDE

**Complexité**:
- 🟢 **Facile** (< 1h) - Problème simple avec solution directe
- 🟡 **Moyen** (1-4h) - Requiert investigation et compréhension
- 🟠 **Difficile** (4-24h) - Debugging complexe, multiple tentatives
- 🔴 **Critique** (> 24h) - Impact majeur, cause obscure, solution non-évidente

**Catégories**:
- 🏗️ Build/Deployment
- 🗄️ Database/Supabase
- 🎨 Frontend/UI
- 🔐 Authentication/Security
- 🌐 API/Backend
- 📦 Dependencies/Packages
- ⚡ Performance

---

## PROBLÈMES RÉSOLUS

---

### 🔴 #001: Crash Total Interface Searcher - Import Non Supprimé

**Date**: 6-10 Novembre 2025
**Complexité**: 🔴 Critique (4 jours)
**Catégorie**: 🏗️ Build/Deployment
**Impact**: Production complètement cassée

#### Symptômes
```
- Page /dashboard/searcher affiche "Oops! Something went wrong"
- Console: TypeError: undefined is not an object (evaluating 'S.browse')
- Erreur uniquement en production Vercel, pas en local
- Erreur dans bundle minifié: 7354-xxxxx.js
```

#### Cause Racine
```typescript
// ❌ PROBLÈME: Import existe même si composant commenté
import GooglePlacesAutocomplete from '@/components/ui/google-places-autocomplete';

// <GooglePlacesAutocomplete /> ← Composant commenté
// Mais Next.js inclut quand même le module dans le bundle!
```

**Explication détaillée**:
1. Next.js voit l'import → charge GooglePlacesAutocomplete dans le bundle
2. Ce composant utilise `useGoogleMaps` hook qui charge dynamiquement Google Maps
3. Race condition / conflit dans le chargement de scripts externes
4. → `S.browse` (variable interne Google Maps minifiée) = undefined
5. → Crash total de la page

#### Solution
```typescript
// ✅ SOLUTION: Commenter AUSSI l'import
// TEMPORARILY DISABLED: GooglePlacesAutocomplete causes crash in production
// import GooglePlacesAutocomplete from '@/components/ui/google-places-autocomplete';
```

**Fichiers modifiés**:
- `components/dashboard/ModernSearcherDashboard.tsx`
- `app/properties/[id]/page.tsx`
- `app/properties/browse/page.tsx`

**Commits**: `82db4d0`, `2fbc61a`, `ad4c82e`

#### Leçons Apprises
1. **Import ≠ Usage**: Un import charge le module même non utilisé
2. **Commenter composant ≠ Exclure du bundle**: Il faut commenter l'import aussi
3. **Bundling Next.js**: Peut créer dépendances inattendues entre pages
4. **Écouter l'utilisateur**: Quand il dit "ça marchait avant X", analyser X en premier

#### Prévention Future
- [ ] Toujours commenter l'import ET le composant
- [ ] Utiliser dynamic imports pour composants lourds
- [ ] Vérifier les imports avant de commenter un composant
- [ ] Tester en production après modifications importantes

#### Références
- [IMPORTANT_TROUBLESHOOTING_GUIDE.md](../IMPORTANT_TROUBLESHOOTING_GUIDE.md)
- Next.js docs: [Dynamic Imports](https://nextjs.org/docs/advanced-features/dynamic-import)

---

### 🟠 #002: Supabase RLS Infinite Recursion - conversation_participants

**Date**: 8 Novembre 2025
**Complexité**: 🟠 Difficile (6h)
**Catégorie**: 🗄️ Database/Supabase
**Impact**: Queries échouent, messages non comptés

#### Symptômes
```sql
-- Erreur PostgreSQL
ERROR: infinite recursion detected in policy for relation "conversation_participants"
SQLSTATE: 42P17
```

#### Cause Racine
```sql
-- ❌ PROBLÈME: RLS policy qui s'appelle elle-même
CREATE POLICY "Users can view their own conversation participants"
ON conversation_participants FOR SELECT
USING (
  user_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM conversation_participants cp  -- ← Récursion!
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
);
```

**Explication**: La policy vérifie `conversation_participants` dans son propre `EXISTS`, créant une boucle infinie.

#### Solution
```sql
-- ✅ SOLUTION 1: Utiliser SECURITY DEFINER pour RPC
CREATE OR REPLACE FUNCTION get_unread_count(user_uuid UUID)
RETURNS TABLE (conversation_id UUID, unread_count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER  -- ← Bypass RLS dans la fonction
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT cp.conversation_id, COUNT(*)::BIGINT
  FROM conversation_participants cp
  WHERE cp.user_id = user_uuid AND cp.last_read_at < NOW()
  GROUP BY cp.conversation_id;
END;
$$;

-- ✅ SOLUTION 2: Simplifier la policy
CREATE POLICY "Users can view their own participants"
ON conversation_participants FOR SELECT
USING (user_id = auth.uid());  -- Pas d'EXISTS récursif
```

**Fichiers modifiés**:
- `supabase/migrations/999_fix_get_unread_count_security_definer.sql`
- `components/dashboard/ModernSearcherDashboard.tsx`

**Commits**: `1dd5201`, `cd89b13`

#### Leçons Apprises
1. **RLS policies**: Éviter SELECT sur la même table dans la policy
2. **SECURITY DEFINER**: Utile pour fonctions qui doivent bypass RLS
3. **Testing RLS**: Toujours tester avec un vrai utilisateur, pas en mode admin

#### Prévention Future
- [ ] Review toutes les policies avec EXISTS/SELECT sur même table
- [ ] Utiliser `SECURITY DEFINER` pour fonctions système
- [ ] Tester RLS en appelant depuis frontend, pas juste SQL Editor

#### Références
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- PostgreSQL: [Security Definer Functions](https://www.postgresql.org/docs/current/sql-createfunction.html)

---

### 🟡 #003: Vercel Build Timeout - aesthetic-demo Page

**Date**: 9 Novembre 2025
**Complexité**: 🟡 Moyen (2h)
**Catégorie**: 🏗️ Build/Deployment
**Impact**: Deployment échoue

#### Symptômes
```
Build timeout on /aesthetic-demo
Page took > 60s to generate during SSG
```

#### Cause Racine
```tsx
// ❌ PROBLÈME: Server Component qui fait requêtes lourdes à Supabase pendant build
export default async function AestheticDemoPage() {
  // Fetch data pendant Static Site Generation
  const rooms = await fetchAllAestheticRooms(); // Timeout!
  return <AestheticRoomSearch initialRooms={rooms} />;
}
```

**Explication**: Next.js essaie de générer statiquement la page, mais les requêtes Supabase prennent trop de temps.

#### Solution
```tsx
// ✅ SOLUTION: Forcer Client Component + Dynamic Rendering
'use client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AestheticDemoPage() {
  // Fetch côté client, pas pendant build
  return <AestheticRoomSearch />;
}
```

**Fichiers modifiés**:
- `app/aesthetic-demo/page.tsx`

**Commits**: `dde0f41`

#### Leçons Apprises
1. **SSG vs SSR vs CSR**: Comprendre quand utiliser chaque mode
2. **Vercel limits**: Build timeout = 60s par page en SSG
3. **'use client'**: Force rendu côté client, évite timeout build

#### Prévention Future
- [ ] Utiliser `'use client'` pour pages avec data dynamique
- [ ] Ou utiliser ISR avec `revalidate` pour limiter fréquence rebuild
- [ ] Monitorer temps de build sur Vercel dashboard

#### Références
- [Next.js Rendering Modes](https://nextjs.org/docs/app/building-your-application/rendering)
- [Vercel Build Limits](https://vercel.com/docs/concepts/limits/overview)

---

### 🟢 #004: TypeScript Build Error - Component Non Importé

**Date**: 10 Novembre 2025
**Complexité**: 🟢 Facile (15min)
**Catégorie**: 🏗️ Build/Deployment
**Impact**: Build échoue

#### Symptômes
```typescript
Type error: Cannot find name 'SinglePropertyMap'
Type error: Cannot find name 'MapPin'
```

#### Cause Racine
```tsx
// ❌ PROBLÈME: Composant utilisé mais pas importé
// import SinglePropertyMap from '@/components/SinglePropertyMap';

<SinglePropertyMap ... />  // ← Erreur TypeScript!
```

**Explication**: Import commenté mais usage non commenté.

#### Solution
```tsx
// ✅ SOLUTION: Commenter usage OU réactiver import
{/* <SinglePropertyMap ... /> */}

// OU ajouter l'import manquant (cas MapPin)
import { MapPin } from 'lucide-react';
```

**Fichiers modifiés**:
- `app/properties/[id]/page.tsx`
- `app/properties/browse/page.tsx`
- `app/test-map/page.tsx`

**Commits**: `2fbc61a`, `ad4c82e`

#### Leçons Apprées
1. **Cohérence**: Toujours vérifier que imports = usages
2. **TypeScript**: Catch ces erreurs avant deployment
3. **npx tsc --noEmit**: Vérifier TypeScript localement avant push

#### Prévention Future
- [ ] Activer pre-commit hook avec TypeScript check
- [ ] Lancer `npx tsc --noEmit` avant chaque commit important
- [ ] Configurer IDE pour highlight unused imports

---

### 🟡 #005: Supabase 404 Errors - Tables Présumées Manquantes

**Date**: 6-9 Novembre 2025
**Complexité**: 🟡 Moyen (3h investigation)
**Catégorie**: 🗄️ Database/Supabase
**Impact**: Fausses alertes, debugging confus

#### Symptômes
```
Console Browser:
POST https://xxx.supabase.co/rest/v1/favorites 404 Not Found
POST https://xxx.supabase.co/rest/v1/user_matches 404 Not Found
```

#### Cause Racine
**FAUSSE ALERTE!** Les tables existent et sont accessibles.

**Vraie cause**:
1. RLS policies bloquent accès → Supabase retourne 404 au lieu de 403
2. Ou: Requête malformée → 404 au lieu de 400

**Explication**: C'est un comportement de Supabase PostgREST qui retourne 404 quand RLS bloque, pour éviter de révéler l'existence de tables aux non-autorisés.

#### Solution
```typescript
// ✅ SOLUTION: Script de diagnostic pour vérifier réellement les tables
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, serviceRoleKey); // Service role = bypass RLS

async function checkTable(tableName: string) {
  const { data, error, count } = await supabase
    .from(tableName)
    .select('*', { count: 'exact', head: true });

  console.log(`${tableName}: ${error ? '❌' : '✅'} (${count} rows)`);
}
```

**Résultat diagnostic**:
```
✅ users: 20 rows
✅ favorites: accessible
✅ user_matches: 0 rows
✅ conversation_participants: 0 rows
✅ properties: 10 rows
✅ applications: accessible
```

**Fichiers créés**:
- `scripts/check-supabase-tables.ts`

**Commits**: `82db4d0`

#### Leçons Apprises
1. **Supabase 404**: Ne signifie pas "table n'existe pas", peut être RLS
2. **Service Role Key**: Utile pour diagnostic (bypass RLS)
3. **Ne pas assumer**: Toujours vérifier avec script de diagnostic

#### Prévention Future
- [ ] Garder script de diagnostic dans /scripts
- [ ] Vérifier RLS policies avant d'assumer problème de table
- [ ] Utiliser logs Supabase Dashboard pour voir vraies erreurs

#### Références
- [PostgREST Error Codes](https://postgrest.org/en/stable/errors.html)
- Script: [check-supabase-tables.ts](../scripts/check-supabase-tables.ts)

---

### 🟢 #006: Google Maps API Key Exposée dans Git

**Date**: 9 Novembre 2025
**Complexité**: 🟢 Facile (30min)
**Catégorie**: 🔐 Security
**Impact**: Clé API compromise

#### Symptômes
```
User: "la clés google a été push sur github et est public maintenant"
```

#### Cause Racine
```markdown
<!-- ❌ PROBLÈME: Clé API dans fichier Markdown commité -->
# RESOLUTION_FINALE.md

Google Maps API Key: AIzaSyDMfdC_TfviPX6fx5mQs09s-N7zstSQMVc
```

**Explication**: Documentation créée avec clé API en clair, commitée et pushée sur GitHub public.

#### Solution
```bash
# ✅ SOLUTION IMMÉDIATE: Supprimer du fichier
git add RESOLUTION_FINALE.md
git commit -m "security: remove exposed API key"
git push

# ✅ SOLUTION PERMANENTE:
# 1. Révoquer la clé exposée sur Google Cloud Console
# 2. Créer nouvelle clé
# 3. Ajouter à Vercel Environment Variables (jamais dans code!)
# 4. Nettoyer historique git si nécessaire
```

**Actions post-incident**:
1. ✅ Clé supprimée de la documentation
2. ⚠️ Utilisateur doit révoquer clé et en créer nouvelle
3. ⚠️ (Optionnel) Nettoyer historique git:
```bash
git filter-branch --tree-filter 'sed -i "" "s/AIzaSyDMfdC_TfviPX6fx5mQs09s-N7zstSQMVc/REDACTED/g" RESOLUTION_FINALE.md' HEAD
```

**Commits**: `e610cd4`

#### Leçons Apprises
1. **Jamais commiter secrets**: Même dans docs, markdown, commentaires
2. **Environment variables**: Toujours utiliser pour API keys
3. **Git history**: Une fois commité, considérer clé compromise
4. **.gitignore**: Ajouter patterns pour fichiers sensibles

#### Prévention Future
- [ ] Ajouter pre-commit hook avec [gitleaks](https://github.com/gitleaks/gitleaks)
- [ ] Scanner régulièrement avec `git secrets` ou `truffleHog`
- [ ] Review PRs pour secrets avant merge
- [ ] Utiliser patterns dans .gitignore:
```
# .gitignore
*.env
*.env.local
.env*.local
*-credentials.json
*-key.json
```

#### Références
- [Git Secrets](https://github.com/awslabs/git-secrets)
- [Gitleaks](https://github.com/gitleaks/gitleaks)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

### 🟡 #007: Next.js Webpack Cache - Serializing Big Strings Warning

**Date**: 9-10 Novembre 2025
**Complexité**: 🟡 Moyen (Impact faible mais récurrent)
**Catégorie**: ⚡ Performance
**Impact**: Build plus lent

#### Symptômes
```
<w> [webpack.cache.PackFileCacheStrategy]
Serializing big strings (118kiB) impacts deserialization performance
(consider using Buffer instead and decode when needed)
```

#### Cause Racine
```typescript
// ❌ PROBLÈME: Fichiers de types très larges dans bundle
// types/room-aesthetics.types.ts - 526 lignes
export const DESIGN_STYLE_LABELS = {
  modern: "Moderne",
  contemporary: "Contemporain",
  minimalist: "Minimaliste",
  // ... 500+ lignes de constantes
};
```

**Explication**: Next.js webpack cache sérialise ces gros objets de constantes, ce qui ralentit la désérialisation.

#### Solution
```typescript
// ✅ SOLUTION 1: Lazy load constantes
export const getDesignStyleLabel = async (style: string) => {
  const labels = await import('./design-style-labels.json');
  return labels[style];
};

// ✅ SOLUTION 2: Utiliser Buffer pour gros objets
const LABELS_BUFFER = Buffer.from(JSON.stringify(DESIGN_STYLE_LABELS));

// ✅ SOLUTION 3: Externalize en JSON
// types/design-styles.json
{
  "modern": "Moderne",
  "contemporary": "Contemporain"
}
```

**Status**: ⚠️ Temporaire - Warning accepté pour l'instant, optimisation future

#### Leçons Apprises
1. **Webpack cache**: Grandes constantes impactent performance
2. **JSON externalization**: Mieux que constantes TypeScript pour gros data
3. **Trade-off**: Developer experience vs build performance

#### Prévention Future
- [ ] Limiter constantes TypeScript à < 50 lignes
- [ ] Externaliser gros objets en JSON
- [ ] Considérer database pour vraiment gros datasets (i18n, etc.)

---

### 🟢 #008: Sentry Configuration Warnings - Deprecated Files

**Date**: Récurrent
**Complexité**: 🟢 Facile (Info seulement)
**Catégorie**: 📦 Dependencies
**Impact**: Warnings build (pas d'erreur)

#### Symptômes
```
[@sentry/nextjs] It appears you've configured a `sentry.server.config.ts` file.
Please ensure to put this file's content into the `register()` function of a
Next.js instrumentation file instead.
```

#### Cause Racine
Ancienne configuration Sentry (fichiers séparés) vs nouvelle (instrumentation hook).

#### Solution
```typescript
// ✅ SOLUTION FUTURE: Migrer vers instrumentation.ts
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

// instrumentation-client.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  // Config from sentry.client.config.ts
});
```

**Status**: ⚠️ Low priority - Warnings seulement, pas d'impact fonctionnel

#### Références
- [Sentry Next.js Setup](https://docs.sentry.io/platforms/javascript/guides/nextjs/)

---

## 📊 STATISTIQUES

**Total problèmes résolus**: 8
**Complexité moyenne**: 🟡 Moyen
**Temps total debugging**: ~120 heures
**Impact production**: 2 incidents critiques

**Par catégorie**:
- 🏗️ Build/Deployment: 4 problèmes
- 🗄️ Database/Supabase: 2 problèmes
- 🔐 Security: 1 problème
- ⚡ Performance: 1 problème

**Top 3 plus impactants**:
1. 🔴 #001: Crash searcher (4 jours downtime)
2. 🟠 #002: RLS infinite recursion (6h, fonctionnalités cassées)
3. 🟡 #003: Vercel timeout (2h, deployments bloqués)

---

## 🎯 PATTERNS RÉCURRENTS

### Pattern 1: Import = Inclusion Bundle
**Occurrences**: #001, #004
**Règle**: Commenter import ET usage, pas juste usage

### Pattern 2: Supabase RLS Trompeur
**Occurrences**: #002, #005
**Règle**: 404 != Table manquante, vérifier RLS d'abord

### Pattern 3: SSG/SSR Confusion
**Occurrences**: #003
**Règle**: Data dynamique = 'use client' ou revalidate

---

## 🔧 BOÎTE À OUTILS

### Scripts Utiles

```bash
# Vérifier TypeScript avant commit
npx tsc --noEmit

# Vérifier tables Supabase
npx tsx scripts/check-supabase-tables.ts

# Analyser bundle Next.js
npm run build -- --profile
npx @next/bundle-analyzer

# Scanner secrets dans git
gitleaks detect --source . --verbose

# Nettoyer cache Next.js
rm -rf .next
npm run build
```

### Debugging Checklist

Quand problème en production mais pas en local:

- [ ] Vider cache Vercel (redéployer)
- [ ] Vider cache navigateur (hard reload)
- [ ] Vérifier environment variables Vercel
- [ ] Comparer bundle local vs production
- [ ] Tester en mode production local: `npm run build && npm run start`
- [ ] Vérifier logs Vercel Functions
- [ ] Tester avec même version Node.js que Vercel

---

## 📝 TEMPLATE NOUVEAU PROBLÈME

```markdown
### [Complexité] #XXX: [Titre Court du Problème]

**Date**: JJ Mois AAAA
**Complexité**: [🟢🟡🟠🔴] [Facile/Moyen/Difficile/Critique] (temps)
**Catégorie**: [Icône] Catégorie
**Impact**: Description impact

#### Symptômes
```
Code ou description des symptômes
```

#### Cause Racine
```language
// ❌ PROBLÈME: Description
Code qui montre le problème
```

**Explication**: Pourquoi ça cause le problème

#### Solution
```language
// ✅ SOLUTION: Description
Code de la solution
```

**Fichiers modifiés**:
- `path/to/file.ts`

**Commits**: `abc1234`

#### Leçons Apprises
1. Point 1
2. Point 2

#### Prévention Future
- [ ] Action préventive 1
- [ ] Action préventive 2

#### Références
- [Lien documentation](https://...)
```

---

**Dernière mise à jour**: 10 Novembre 2025
**Mainteneur**: Samuel Baudon
**Version**: 1.0

---

## 🚀 UTILISATION DANS FUTURS PROJETS

Pour exporter cette base de connaissance:

1. **Copier ce fichier** dans nouveau projet: `.problems/PROBLEMS_REGISTRY.md`
2. **Adapter les patterns** au nouveau contexte
3. **Ajouter nouveaux problèmes** avec template ci-dessus
4. **Référencer** ce document dans README principal
5. **Maintenir à jour** après chaque incident résolu

Ce registre devient plus précieux avec le temps - chaque problème ajouté économise des heures de debugging futurs! 💎
