# FIX: 400 Error on user_profiles Upsert

## Root Cause

Le code dans `app/api/profile/enhance/route.ts` utilise une logique manuelle pour vérifier si le profil existe :

```typescript
// PROBLÈME : Cette approche échoue si des colonnes NOT NULL n'ont pas de valeur
if (existingProfile) {
  result = await supabase.from('user_profiles').update(updateData).eq('user_id', user.id);
} else {
  result = await supabase.from('user_profiles').insert({ user_id: user.id, ...updateData });
}
```

Quand on fait un INSERT, si la table a des colonnes NOT NULL sans valeur par défaut, on obtient une erreur 400.

## Solution

Utiliser le **vrai upsert** de Supabase avec `upsert()` qui gère automatiquement INSERT vs UPDATE :

```typescript
// SOLUTION : Utiliser upsert() natif de Supabase
const result = await supabase
  .from('user_profiles')
  .upsert(
    {
      user_id: user.id,
      ...updateData,
    },
    {
      onConflict: 'user_id',  // On a déjà le PRIMARY KEY sur user_id
      ignoreDuplicates: false, // On veut UPDATE si existe déjà
    }
  );
```

## Avantages

1. ✅ Pas besoin de SELECT avant pour vérifier si le profil existe
2. ✅ Supabase gère automatiquement INSERT vs UPDATE
3. ✅ Évite les problèmes de NOT NULL constraints sur INSERT
4. ✅ Plus performant (1 requête au lieu de 2)
5. ✅ Atomique (évite les race conditions)

## Fichier à modifier

`app/api/profile/enhance/route.ts` - lignes 26-99
