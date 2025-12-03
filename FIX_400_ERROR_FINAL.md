# FIX FINAL : Erreur 400 sur user_profiles

## Problème Identifié

Les erreurs 400 viennent de plusieurs pages qui font des **upsert directs** sur la table `user_profiles` :

```typescript
// app/onboarding/searcher/quick/basic-info/page.tsx:118
await supabase
  .from('user_profiles')
  .upsert(
    {
      user_id: user.id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      date_of_birth: dateOfBirth,
      nationality: nationality.trim(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
```

### Pourquoi ça échoue ?

1. Le upsert essaie de faire un **INSERT** pour un nouveau profil
2. Mais il ne fournit que 5-6 colonnes (user_id, first_name, last_name, etc.)
3. Si la table a des colonnes avec `NOT NULL` sans valeur par défaut, PostgreSQL rejette l'INSERT
4. Supabase retourne une erreur **400 Bad Request**

## Solution

Il y a 2 approches :

### Approche 1 : Relâcher les contraintes NOT NULL (RECOMMANDÉ)

Exécuter `FIX_NOT_NULL_DEFAULTS.sql` dans le SQL Editor de Supabase.

Ce script :
- ✅ Rend nullable les colonnes comme `first_name`, `last_name`, etc.
- ✅ Garde `user_id` comme NOT NULL (PRIMARY KEY)
- ✅ Ajoute une valeur par défaut pour `user_type` = 'searcher'
- ✅ Permet les upserts partiels sans erreur

**Avantages** :
- Fix immédiat sans changer le code
- Permet de construire le profil progressivement
- Plus flexible pour l'onboarding en plusieurs étapes

### Approche 2 : Modifier tous les upserts (NON RECOMMANDÉ)

Modifier chaque page qui fait un upsert pour fournir TOUTES les colonnes NOT NULL.

**Désavantages** :
- Beaucoup de code à changer (11+ fichiers)
- Complexe à maintenir
- Moins flexible

## Pages Affectées

Pages qui font des upserts directs :
1. [app/onboarding/searcher/quick/basic-info/page.tsx](app/onboarding/searcher/quick/basic-info/page.tsx:118)
2. [app/onboarding/searcher/quick/lifestyle/page.tsx](app/onboarding/searcher/quick/lifestyle/page.tsx:76)
3. [app/onboarding/searcher/quick/budget-location/page.tsx](app/onboarding/searcher/quick/budget-location/page.tsx:109)
4. [app/onboarding/searcher/quick/availability/page.tsx](app/onboarding/searcher/quick/availability/page.tsx:106)
5. [app/onboarding/resident/living-situation/page.tsx](app/onboarding/resident/living-situation/page.tsx:130)
6. Plus d'autres pages...

## Action Requise

1. ✅ Va dans Supabase Dashboard
2. ✅ Ouvre le SQL Editor
3. ✅ Copie tout le contenu de `FIX_NOT_NULL_DEFAULTS.sql`
4. ✅ Exécute le script
5. ✅ Teste sur https://easyco-onboarding.vercel.app

L'erreur 400 devrait disparaître immédiatement ! 🎉
