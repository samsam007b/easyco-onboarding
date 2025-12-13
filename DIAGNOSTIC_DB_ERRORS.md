# 🔍 Diagnostic des Erreurs Base de Données

## Erreurs Actuelles

### 1. 404 - `get_unread_count`
**Erreur**: `Failed to load resource: the server responded with a status of 404 (get_unread_count)`

**Cause**: La fonction `get_unread_count` n'existe pas dans la base de données de production.

**Solution**: Appliquer la migration qui crée cette fonction.

**Fichiers de migration disponibles**:
- `supabase/migrations/999_fix_get_unread_count_security_definer.sql`
- `supabase/migrations/013_create_messaging_system_fixed.sql`
- `supabase/migrations/013_create_messaging_system.sql`

**Action à faire**:
```sql
-- Exécuter dans Supabase SQL Editor:
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
```

---

### 2. 400 - `user_profiles`
**Erreur**: `Failed to load resource: the server responded with a status of 400 (user_profiles)`

**Causes possibles**:
1. Table `user_profiles` n'existe pas
2. Problème de RLS (Row Level Security)
3. Requête malformée

**Vérification**:
```sql
-- Vérifier que la table existe
SELECT * FROM information_schema.tables
WHERE table_name = 'user_profiles';

-- Vérifier les policies RLS
SELECT * FROM pg_policies
WHERE tablename = 'user_profiles';
```

**Solution probable**: Créer/modifier les policies RLS pour user_profiles

---

### 3. 400 - `property_members`
**Erreur**: `Failed to load resource: the server responded with a status of 400 (property_members)`

**Causes possibles**: Identiques à `user_profiles`

**Vérification**:
```sql
-- Vérifier que la table existe
SELECT * FROM information_schema.tables
WHERE table_name = 'property_members';

-- Vérifier les policies RLS
SELECT * FROM pg_policies
WHERE tablename = 'property_members';
```

---

## 🛠️ Actions Recommandées

### Option 1: Appliquer les migrations manquantes

1. **get_unread_count**: Exécuter le SQL ci-dessus dans Supabase SQL Editor

2. **user_profiles & property_members**: Vérifier les policies RLS:

```sql
-- Politique RLS pour user_profiles (lecture pour tous les utilisateurs authentifiés)
DROP POLICY IF EXISTS "Users can view all profiles" ON user_profiles;
CREATE POLICY "Users can view all profiles" ON user_profiles
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Politique RLS pour property_members
DROP POLICY IF EXISTS "Users can view property members" ON property_members;
CREATE POLICY "Users can view property members" ON property_members
  FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can view own memberships" ON property_members;
CREATE POLICY "Users can view own memberships" ON property_members
  FOR SELECT
  USING (auth.uid() = user_id);
```

### Option 2: Script de migration complet

Créer un script SQL unique pour appliquer toutes les corrections:

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

---

## 📋 Checklist de Vérification

Après avoir appliqué les fixes, vérifier:

- [ ] `get_unread_count` retourne 0 ou un nombre (pas d'erreur 404)
- [ ] `user_profiles` accessible en lecture (pas d'erreur 400)
- [ ] `property_members` accessible en lecture (pas d'erreur 400)
- [ ] Pas d'erreur dans la console navigateur
- [ ] Le dashboard Resident charge correctement
- [ ] Les notifications s'affichent

---

## 🎯 Ordre d'Exécution Recommandé

1. Copier tout le SQL de "Option 2: Script de migration complet"
2. Aller dans Supabase Dashboard → SQL Editor
3. Coller le SQL et exécuter
4. Rafraîchir l'application dans le navigateur
5. Vérifier que les erreurs ont disparu

---

**Note**: Ces erreurs n'empêchent pas l'application de fonctionner, mais causent des warning dans la console et peuvent affecter les fonctionnalités de messagerie et de profil.
