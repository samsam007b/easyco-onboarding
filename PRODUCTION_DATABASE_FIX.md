# 🔴 IMPORTANT - Correction Base de Données PRODUCTION

## ⚠️ ATTENTION - Ce guide est pour la base de données de PRODUCTION

Les erreurs que vous voyez sur **www.izzico.be** viennent de la base de données de **PRODUCTION** Supabase.

Le fichier `FIX_DB_ERRORS.sql` que vous avez exécuté a été appliqué sur votre base de données **LOCALE**, pas sur la production.

---

## 📍 Comment Identifier Votre Base de Données Production

1. Allez sur [https://supabase.com/dashboard/projects](https://supabase.com/dashboard/projects)
2. Trouvez le projet qui est lié à **www.izzico.be**
3. L'URL du projet devrait contenir le même `NEXT_PUBLIC_SUPABASE_URL` que dans votre fichier `.env.local` pour la production

---

## ✅ Étapes pour Corriger la Base de Données Production

### Étape 1: Ouvrir le SQL Editor de Production

1. Connectez-vous à [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet **PRODUCTION** (celui lié à www.izzico.be)
3. Allez dans **SQL Editor** (dans la barre latérale gauche)
4. Cliquez sur **New query** pour créer une nouvelle requête

### Étape 2: Copier le SQL de Correction

Copiez **TOUT** le contenu ci-dessous (lignes 31 à 81):

```sql
-- ============================================================================
-- FIX MESSAGING FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION get_unread_count(target_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  unread_count INTEGER;
BEGIN
  SELECT COUNT(*)::INTEGER INTO unread_count
  FROM messages
  WHERE receiver_id = target_user_id
    AND read = FALSE
    AND sender_id != target_user_id;

  RETURN COALESCE(unread_count, 0);
END;
$$;

-- ============================================================================
-- FIX RLS POLICIES
-- ============================================================================

-- Enable RLS on tables if not already enabled
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_members ENABLE ROW LEVEL SECURITY;

-- user_profiles policies
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;
CREATE POLICY "Users can view all profiles" ON user_profiles
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- property_members policies
DROP POLICY IF EXISTS "Users can view property members" ON property_members;
CREATE POLICY "Users can view property members" ON property_members
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Members can view own membership" ON property_members;
CREATE POLICY "Members can view own membership" ON property_members
  FOR SELECT
  USING (auth.uid() = user_id);
```

### Étape 3: Exécuter le SQL

1. Collez le SQL copié dans le SQL Editor
2. Vérifiez que vous êtes bien sur le projet **PRODUCTION**
3. Cliquez sur **Run** ou appuyez sur `Ctrl+Enter` (Windows) ou `Cmd+Enter` (Mac)
4. Attendez le message de succès

### Étape 4: Vérifier que Ça Fonctionne

1. Allez sur **www.izzico.be**
2. Ouvrez la console du navigateur (`F12` → onglet Console)
3. Rafraîchissez la page (`F5`)
4. Vérifiez que les erreurs suivantes ont **DISPARU**:
   - ❌ `Failed to load resource: the server responded with a status of 404 (get_unread_count)`
   - ❌ `Failed to load resource: the server responded with a status of 400 (user_profiles)`
   - ❌ `Failed to load resource: the server responded with a status of 400 (property_members)`

---

## 🎯 Résultat Attendu

Après avoir exécuté le SQL sur la **base de données PRODUCTION**:

- ✅ La fonction `get_unread_count` existera et retournera 0 ou un nombre (plus d'erreur 404)
- ✅ Les tables `user_profiles` et `property_members` seront accessibles (plus d'erreur 400)
- ✅ Les policies RLS permettront la lecture pour tous les utilisateurs authentifiés
- ✅ La console du navigateur n'affichera plus ces 3 erreurs

---

## ⚠️ Note sur l'Erreur OCR

L'erreur OCR (`[OCR] ❌ Scan failed: "Error: Error attempting to read image."`) est **différente** et sera corrigée par le déploiement Vercel en cours.

Une fois le déploiement terminé (vous recevrez un email de Vercel), l'erreur OCR devrait être résolue.

---

## 📋 Checklist Finale

Après avoir appliqué le SQL sur la production:

- [ ] Les 3 erreurs de base de données ont disparu de la console
- [ ] Le dashboard Resident charge sans erreur
- [ ] Les notifications s'affichent correctement
- [ ] Attendre le déploiement Vercel pour tester le scanner OCR

---

## 🆘 Si Vous Avez Besoin d'Aide

Si vous ne trouvez pas votre projet de production ou si vous avez des questions:

1. Vérifiez le fichier `.env.local` pour trouver `NEXT_PUBLIC_SUPABASE_URL`
2. Ce URL correspond à votre projet de production Supabase
3. Le nom du projet devrait être visible dans l'URL (ex: `https://xxxxxxxxxxxx.supabase.co`)
