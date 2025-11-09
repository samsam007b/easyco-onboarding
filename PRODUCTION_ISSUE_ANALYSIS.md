# 🔍 Analyse du Problème en Production

**Date**: 9 Novembre 2025
**Status**: ⚠️ **ERREURS PERSISTENT EN PRODUCTION**

---

## 🎯 Situation Actuelle

### ✅ Ce qui fonctionne localement
- Build local réussit ✅
- Tests automatisés (9/9) passent ✅
- TypeScript compile sans erreur ✅
- Hook `useGoogleMaps` implémenté correctement ✅
- Commits pushed vers GitHub ✅

### ❌ Ce qui échoue en production
1. **Erreur Google Maps persiste**: `TypeError: undefined is not an object (evaluating 'S.browse')`
2. **Erreur Supabase RLS**: `"infinite recursion detected in policy for relation \"conversation_participants\""`

---

## 🔍 Analyse Détaillée

### Problème 1: Google Maps ne se charge toujours pas ❌

**Cause probable**: Le déploiement Vercel n'a **PAS** pris en compte les derniers commits, OU il y a un problème de cache.

**Preuves**:
- Le code local contient bien toutes les corrections
- Le hook `useGoogleMaps` existe et fonctionne
- Mais l'erreur `S.browse` persiste en production

**Solutions possibles**:

1. **Vérifier le déploiement Vercel**:
   ```bash
   # Aller sur https://vercel.com/dashboard
   # Vérifier que le dernier déploiement utilise le commit 37f2d2f
   # Si non, forcer un redéploiement
   ```

2. **Vider le cache navigateur**:
   - Ouvrir DevTools (F12)
   - Clic droit sur le bouton Refresh
   - Sélectionner "Empty Cache and Hard Reload"

3. **Vérifier la variable d'environnement Vercel**:
   - La clé `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` est-elle définie dans Vercel?
   - Aller dans Settings > Environment Variables

4. **Forcer un nouveau build Vercel**:
   ```bash
   git commit --allow-empty -m "chore: force Vercel rebuild"
   git push
   ```

---

### Problème 2: Infinite Recursion Supabase ⚠️ (NOUVEAU)

**Erreur exacte**:
```json
{
  "message": "infinite recursion detected in policy for relation \"conversation_participants\"",
  "code": "42P17",
  "hint": "Infinite recursion detected in policy for table \"conversation_participants\"."
}
```

**Cause racine**:
La fonction RPC `get_unread_count` appelle la table `conversation_participants` qui a une **politique RLS récursive**.

**Fichier affecté**: `app/dashboard/searcher/layout.tsx:56-61`

**Code problématique**:
```typescript
const { data: unreadData, error: unreadError } = await supabase
  .rpc('get_unread_count', { target_user_id: user.id });
```

**Pourquoi ça arrive**:
1. La fonction `get_unread_count` est définie avec `SECURITY INVOKER` (par défaut)
2. Elle appelle `conversation_participants`
3. La RLS policy sur `conversation_participants` fait probablement référence à elle-même
4. Résultat: boucle infinie → erreur 500

---

## 🛠️ Solutions Recommandées

### Solution Immédiate: Désactiver le compteur de messages non lus

Cette solution permet de **débloquer l'interface immédiatement** pendant qu'on corrige Supabase.

**Modification à faire**:
```typescript
// TEMPORAIRE: Désactiver get_unread_count pour éviter l'infinite recursion
// const { data: unreadData, error: unreadError } = await supabase
//   .rpc('get_unread_count', { target_user_id: user.id });

// if (unreadError) {
//   logger.supabaseError('get unread count', unreadError, { userId: user.id });
// }

// const unreadCount = unreadData || 0;
const unreadCount = 0; // TEMPORAIRE: Fixé à 0

setStats({
  favoritesCount: favCount || 0,
  matchesCount: matchCount || 0,
  unreadMessages: unreadCount || 0
});
```

**Avantage**: Interface searcher accessible immédiatement
**Inconvénient**: Le compteur de messages non lus affichera toujours 0

---

### Solution Définitive: Corriger la RLS Policy dans Supabase

**Option A: Changer la fonction en SECURITY DEFINER**

Modifier la fonction `get_unread_count` pour utiliser `SECURITY DEFINER` au lieu de `SECURITY INVOKER`:

```sql
-- Dans Supabase SQL Editor
CREATE OR REPLACE FUNCTION get_unread_count(target_user_id UUID)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER  -- ← Ajouter cette ligne
SET search_path = public
AS $$
DECLARE
  unread_count INT;
BEGIN
  -- Le code existant de la fonction
  SELECT COUNT(*)
  INTO unread_count
  FROM messages m
  JOIN conversation_participants cp ON cp.conversation_id = m.conversation_id
  WHERE cp.user_id = target_user_id
    AND m.sender_id != target_user_id
    AND m.read = false;

  RETURN COALESCE(unread_count, 0);
END;
$$;
```

**Explication**:
- `SECURITY DEFINER` fait que la fonction s'exécute avec les permissions du créateur (probablement postgres ou service_role)
- Cela bypass les RLS policies → pas de récursion

---

**Option B: Corriger la RLS Policy sur conversation_participants**

Identifier et corriger la policy récursive:

```sql
-- Voir toutes les policies
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'conversation_participants';
```

Puis corriger la policy qui cause la récursion (probablement une policy qui fait un JOIN sur elle-même).

---

## 📊 Vérifications à Faire

### 1. Vérifier le déploiement Vercel

```bash
# Aller sur https://vercel.com/[votre-projet]
# Vérifier:
# - Dernier commit: 37f2d2f ✓ ou ✗
# - Status: Ready ✓ ou Building
# - Variables d'environnement: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY présente?
```

### 2. Tester en production

Après avoir fait les corrections:

1. **Ouvrir** https://[votre-site].vercel.app/dashboard/searcher
2. **Ouvrir DevTools** (F12) → Console
3. **Vérifier**:
   - [ ] Aucune erreur `S.browse`
   - [ ] Aucune erreur 500 (infinite recursion)
   - [ ] L'autocomplete Google Places fonctionne
   - [ ] La page se charge complètement

### 3. Vérifier les logs Vercel

```bash
# Aller dans Vercel Dashboard → Deployments → [Dernier déploiement] → Functions
# Regarder les logs serveur pour voir les erreurs Supabase
```

---

## 🎯 Plan d'Action Recommandé

**Ordre de priorité**:

1. **IMMÉDIAT** (5 min):
   - Commenter l'appel `get_unread_count` dans `searcher/layout.tsx`
   - Commit + push
   - Vérifier que l'interface se charge

2. **COURT TERME** (30 min):
   - Vérifier que Vercel a bien déployé le commit `37f2d2f`
   - Vider le cache navigateur et re-tester
   - Vérifier `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` dans Vercel

3. **MOYEN TERME** (1-2h):
   - Corriger la fonction `get_unread_count` avec `SECURITY DEFINER`
   - Re-activer l'appel dans le code
   - Tester en production

4. **LONG TERME** (optionnel):
   - Auditer toutes les RLS policies pour éviter d'autres récursions
   - Ajouter des tests E2E pour détecter ce genre de problème

---

## 🚨 Note sur Next.js Version

**Question de l'utilisateur**: "Est-ce que Next.js version update pourrait causer le problème?"

**Réponse**: **NON** ❌

- La version actuelle est `14.2.33`
- Cette version est stable et n'a pas changé récemment
- Le problème n'est PAS lié à Next.js mais à:
  1. **Déploiement Vercel** qui n'a peut-être pas les derniers commits
  2. **RLS Policy Supabase** qui a une récursion infinie

---

## ✅ Checklist de Débogage

- [ ] Vérifier commit déployé sur Vercel (`37f2d2f`)
- [ ] Vérifier variable `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` dans Vercel
- [ ] Vider cache navigateur (Hard Reload)
- [ ] Commenter temporairement `get_unread_count`
- [ ] Push et vérifier que l'interface se charge
- [ ] Corriger la fonction Supabase avec `SECURITY DEFINER`
- [ ] Re-activer `get_unread_count`
- [ ] Tester en production

---

**Généré le**: 9 Novembre 2025, 20:30
**Par**: Claude Code Assistant
