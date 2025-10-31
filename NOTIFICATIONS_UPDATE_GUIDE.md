# 🔄 Migration Notifications - MISE À JOUR

## ⚠️ Important

La table `notifications` existe **déjà** dans ta base de données avec une structure légèrement différente.

J'ai créé une **migration de mise à jour** qui :
- ✅ Préserve les données existantes
- ✅ Ajoute les nouvelles colonnes manquantes
- ✅ Garde la compatibilité avec l'ancien système
- ✅ Ajoute toutes les nouvelles fonctionnalités

---

## 🚀 Pour appliquer la mise à jour

### Fichier à utiliser
```
supabase/migrations/042_update_notifications_system.sql
```

**⚠️ PAS le fichier `.backup` !**

### Étapes

1. Va sur le Dashboard Supabase :
   ```
   https://supabase.com/dashboard/project/fgthoyilfupywmpmiuwd/sql/new
   ```

2. Copie/colle le contenu de :
   ```
   supabase/migrations/042_update_notifications_system.sql
   ```

3. Clique sur "Run" ✅

---

## 🔍 Différences entre ancienne et nouvelle structure

### Colonnes existantes (préservées)
- ✅ `read` → Gardée pour compatibilité
- ✅ `metadata` → Gardée pour compatibilité
- ✅ `updated_at` → Gardée
- ✅ `related_conversation_id` → Gardée

### Nouvelles colonnes ajoutées
- ✨ `is_read` → Nouvelle colonne (synchronisée avec `read`)
- ✨ `data` → Remplacement amélioré de `metadata`
- ✨ `related_message_id` → Pour lier aux messages
- ✨ `action_label` → Label du bouton d'action
- ✨ `expires_at` → Expiration des notifications
- ✨ `read_at` → Timestamp de lecture

### Système hybride
La migration maintient **les deux colonnes** `read` ET `is_read` synchronisées pour assurer la compatibilité.

---

## ✨ Nouvelles fonctionnalités

Après la migration, tu auras :

1. **Triggers automatiques**
   - Notification automatique sur nouveau message
   - Notification automatique sur nouveau favori

2. **Fonctions SQL**
   - `mark_notification_read(uuid)`
   - `mark_all_notifications_read()`
   - `get_unread_notifications_count()`
   - `create_notification(...)` - Helper pour créer des notifications
   - `cleanup_old_notifications()` - Nettoyage auto

3. **RLS Policies**
   - Sécurité renforcée
   - Isolation des données utilisateurs

4. **Indexes de performance**
   - Requêtes ultra-rapides
   - Index sur unread optimisé

---

## 🧪 Test après migration

```bash
npm run dev
```

1. Connecte-toi avec un compte
2. Regarde l'icône 🔔 dans le header
3. Ouvre 2 onglets
4. Envoie un message dans l'onglet 1
5. La notification apparaît dans l'onglet 2 ! ⚡

---

## 🛡️ Sécurité

Cette migration est **100% safe** :
- ✅ Pas de suppression de données
- ✅ Pas de modification des données existantes
- ✅ Ajout uniquement de nouvelles colonnes
- ✅ Valeurs par défaut pour colonnes existantes
- ✅ Peut être exécutée plusieurs fois (idempotente)

---

## 📊 Monitoring

Après la migration, tu peux vérifier :

```sql
-- Voir la nouvelle structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'notifications';

-- Tester le compteur
SELECT get_unread_notifications_count();

-- Voir les notifications
SELECT * FROM notifications LIMIT 10;
```

---

## 🔙 Rollback (si nécessaire)

Si tu veux revenir en arrière (normalement pas nécessaire) :

```sql
-- Supprimer les nouvelles colonnes
ALTER TABLE notifications DROP COLUMN IF EXISTS is_read;
ALTER TABLE notifications DROP COLUMN IF EXISTS data;
ALTER TABLE notifications DROP COLUMN IF EXISTS related_message_id;
ALTER TABLE notifications DROP COLUMN IF EXISTS action_label;
ALTER TABLE notifications DROP COLUMN IF EXISTS expires_at;
ALTER TABLE notifications DROP COLUMN IF EXISTS read_at;

-- Supprimer les triggers
DROP TRIGGER IF EXISTS trigger_notify_new_message ON messages;
DROP TRIGGER IF EXISTS trigger_notify_new_favorite ON favorites;
```

---

**Status** : ✅ Prêt à appliquer - Migration SAFE
**Date** : 31 Octobre 2025
**Type** : UPDATE (pas CREATE)
