# ✅ CHECKLIST DE TEST - CORRECTIONS SÉCURITÉ

**Date**: 18 janvier 2026
**Migrations à tester**: 121, 122, 123 + middleware.ts

---

## 🧪 PHASE 1: Tests en Staging (Supabase)

### Migration 121: Bcrypt Admin PINs

**Objectif**: Vérifier que les PINs admin sont hashés avec bcrypt

```sql
-- Test 1: Vérifier la colonne bcrypt existe
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'admins' AND column_name = 'pin_hash_bcrypt';

-- Résultat attendu: 1 ligne (colonne existe)
```

```sql
-- Test 2: Créer un admin test avec PIN
SELECT set_admin_pin_secure(
  auth.uid(),  -- Votre user_id
  '123456'     -- PIN test
);

-- Résultat attendu: {"success": true, "message": "PIN configured successfully"}
```

```sql
-- Test 3: Vérifier que le PIN est hashé (commence par $2b$)
SELECT
  user_id,
  LEFT(pin_hash_bcrypt, 10) as bcrypt_prefix,
  pin_hash as old_sha256
FROM admins
WHERE user_id = auth.uid();

-- Résultat attendu: bcrypt_prefix = '$2b$10$...'
```

```sql
-- Test 4: Vérifier le PIN (bon password)
SELECT verify_admin_pin_secure(
  auth.uid(),
  '123456'
) as pin_valid;

-- Résultat attendu: true
```

```sql
-- Test 5: Vérifier le PIN (mauvais password)
SELECT verify_admin_pin_secure(
  auth.uid(),
  '999999'
) as pin_valid;

-- Résultat attendu: false
```

**✅ Migration 121**: □ PASS / □ FAIL

---

### Migration 122: Password Re-verification

**Objectif**: Vérifier que la vérification password fonctionne

```sql
-- Test 1: Vérifier la table existe
SELECT COUNT(*) FROM password_verifications;

-- Résultat attendu: 0 (table vide au départ)
```

```sql
-- Test 2: Enregistrer une vérification (après reauthenticate côté client)
SELECT record_password_verification(
  '192.168.1.1',  -- IP test
  'Mozilla/5.0',  -- User agent test
  'password'      -- Type
);

-- Résultat attendu: {"success": true, "verification_id": "uuid...", "expires_at": "timestamp"}
```

```sql
-- Test 3: Vérifier qu'on a une vérification valide
SELECT has_valid_password_verification(300) as has_valid;

-- Résultat attendu: true (dans les 5 minutes)
```

```sql
-- Test 4: Vérifier que verify_user_password utilise la vérification
SELECT verify_user_password('dummy_password') as verified;

-- Résultat attendu: true (si vérification récente existe)
```

```sql
-- Test 5: Attendre 6 minutes, vérifier expiration
SELECT pg_sleep(360);  -- Attendre 6 minutes
SELECT has_valid_password_verification(300) as has_valid;

-- Résultat attendu: false (vérification expirée)
```

**⚠️ IMPORTANT**: Pour tester complètement, il faut aussi tester côté frontend :
1. Appeler `supabase.auth.reauthenticateWithPassword()`
2. Puis appeler `record_password_verification()`
3. Puis tenter modification IBAN

**✅ Migration 122**: □ PASS / □ FAIL

---

### Migration 123: IBAN Encryption

**Objectif**: Vérifier que les IBANs sont chiffrés uniquement

```sql
-- Test 1: Vérifier que la contrainte existe
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'user_bank_info'::regclass
  AND conname = 'chk_iban_must_be_encrypted';

-- Résultat attendu: 1 ligne avec CHECK constraint
```

```sql
-- Test 2: Vérifier qu'on ne peut PAS insérer IBAN plaintext
INSERT INTO user_bank_info (user_id, iban, created_at)
VALUES (auth.uid(), 'BE68539007547034', NOW());

-- Résultat attendu: ERREUR "violates check constraint"
```

```sql
-- Test 3: Vérifier que tous les IBANs existants sont marqués encrypted
SELECT COUNT(*) as plaintext_count
FROM user_bank_info
WHERE iban IS NOT NULL
  AND iban != ''
  AND iban != '***ENCRYPTED***';

-- Résultat attendu: 0
```

```sql
-- Test 4: Stocker un IBAN chiffré (après password verification)
-- D'abord créer une vérification
SELECT record_password_verification('127.0.0.1', 'test', 'password');

-- Puis stocker IBAN
SELECT store_iban_encrypted(
  auth.uid(),
  'BE68539007547034'
) as stored;

-- Résultat attendu: true
```

```sql
-- Test 5: Vérifier que l'IBAN est bien chiffré
SELECT
  iban,
  iban_encrypted IS NOT NULL as has_encrypted
FROM user_bank_info
WHERE user_id = auth.uid();

-- Résultat attendu: iban = '***ENCRYPTED***', has_encrypted = true
```

```sql
-- Test 6: Récupérer l'IBAN déchiffré
SELECT get_decrypted_iban(auth.uid()) as decrypted_iban;

-- Résultat attendu: 'BE68539007547034'
```

**✅ Migration 123**: □ PASS / □ FAIL

---

## 🧪 PHASE 2: Tests Frontend (Next.js)

### Test 1: Session Timeout (middleware.ts)

**Routes sensibles** (30 min timeout):
- `/settings/bank`
- `/dashboard/owner/bank`
- `/admin`

**Routes standard** (2h timeout):
- `/dashboard/owner`
- `/messages`
- `/profile`

**Procédure de test**:

```bash
# 1. Se connecter
# 2. Noter l'heure (T0)
# 3. Aller sur /settings/bank
# 4. Attendre 31 minutes (ou modifier SESSION_CONFIG.SENSITIVE_TIMEOUT_MS à 2min pour test rapide)
# 5. Rafraîchir la page

# Résultat attendu: Redirection vers /auth/reauth?redirect=/settings/bank&reason=session_timeout
```

**Cookie à vérifier**:
```javascript
// Dans DevTools > Application > Cookies
// Chercher: izzico_last_activity
// Valeur: timestamp (mis à jour à chaque navigation)
```

**✅ Session Timeout**: □ PASS / □ FAIL

---

### Test 2: Re-authentication Page

**URL**: `/auth/reauth?redirect=/settings/bank`

**Éléments à vérifier**:
- □ Affiche l'email de l'utilisateur
- □ Champ password présent
- □ Message explicite "Votre session a expiré"
- □ Bouton "Se ré-authentifier"
- □ Après succès → redirect vers `/settings/bank`

**✅ Reauth Page**: □ PASS / □ FAIL

---

### Test 3: Flow Modification IBAN Complet

**Scénario end-to-end**:

```
1. User connecté va sur /settings/bank
   ✅ Page charge normalement

2. User clique "Modifier IBAN"
   ✅ Modal s'ouvre, demande password

3. User entre mauvais password
   ✅ Erreur "Password incorrect"

4. User entre bon password
   ✅ reauthenticateWithPassword() réussit
   ✅ record_password_verification() appelé
   ✅ has_valid_password_verification() = true

5. User entre nouvel IBAN "BE12345678901234"
   ✅ store_iban_encrypted() appelé
   ✅ IBAN stocké chiffré dans DB
   ✅ Colonne iban = '***ENCRYPTED***'
   ✅ Colonne iban_encrypted = bytea chiffré

6. User actualise la page
   ✅ IBAN affiché masqué: "BE** **** **** 1234"

7. Admin check DB directement
   ✅ SELECT iban FROM user_bank_info → '***ENCRYPTED***'
   ✅ SELECT iban_encrypted → bytea incompréhensible

8. User essaie de modifier IBAN sans re-password (>5min)
   ✅ Erreur "Password re-verification required"
```

**✅ Flow IBAN Complet**: □ PASS / □ FAIL

---

## 🐛 TESTS DE SÉCURITÉ (Attaques simulées)

### Attack 1: Brute Force Admin PIN

```sql
-- Tentative 1000 PINs rapides
DO $$
DECLARE
  i INT;
BEGIN
  FOR i IN 100000..101000 LOOP
    PERFORM verify_admin_pin_secure(
      'admin-user-id-here'::uuid,
      i::text
    );
  END LOOP;
END $$;

-- Résultat attendu:
-- - Temps d'exécution: >30 secondes (bcrypt lent = bon)
-- - Aucun succès (sauf si PIN dans range)
```

**✅ Résistance Brute Force**: □ PASS / □ FAIL

---

### Attack 2: Bypass Password Verification

```sql
-- Essayer de modifier IBAN sans vérification récente
-- 1. Attendre 6 minutes après dernière vérification
SELECT pg_sleep(360);

-- 2. Tenter update_bank_info_secure
SELECT update_bank_info_secure(
  p_iban := 'BE99999999999999'
);

-- Résultat attendu: {"success": false, "error": "VERIFICATION_REQUIRED"}
```

**✅ Bypass Protection**: □ PASS / □ FAIL

---

### Attack 3: SQL Injection sur IBAN

```sql
-- Tentative injection via store_iban_encrypted
SELECT store_iban_encrypted(
  auth.uid(),
  'BE12345''; DROP TABLE users; --'
);

-- Résultat attendu:
-- - Pas d'erreur SQL
-- - String stocké tel quel (chiffré)
-- - Table users toujours présente
```

**✅ SQL Injection Protection**: □ PASS / □ FAIL

---

### Attack 4: Session Hijacking

**Procédure**:
```
1. User A se connecte, copie son cookie de session
2. User A attend 31 minutes sur route sensible
3. User B (attaquant) utilise le cookie copié
4. User B tente d'accéder /settings/bank

Résultat attendu:
- Redirection vers /auth/reauth (session expirée)
- Cookie izzico_last_activity expiré
```

**✅ Session Hijacking Protection**: □ PASS / □ FAIL

---

## 📊 RÉSULTATS GLOBAUX

### Score de Sécurité

| Catégorie | Tests | Passés | Échoués | Score |
|-----------|-------|--------|---------|-------|
| Migration 121 (Bcrypt) | 5 | □ | □ | __/5 |
| Migration 122 (Password) | 5 | □ | □ | __/5 |
| Migration 123 (IBAN) | 6 | □ | □ | __/6 |
| Frontend (Session) | 1 | □ | □ | __/1 |
| Frontend (Reauth) | 1 | □ | □ | __/1 |
| Flow IBAN Complet | 1 | □ | □ | __/1 |
| Attaques Simulées | 4 | □ | □ | __/4 |
| **TOTAL** | **23** | **__** | **__** | **__/23** |

### Verdict

```
Score >= 20/23 (87%): ✅ EXCELLENT - Déployer en production
Score 17-19/23 (74%): 🟡 BIEN - Corriger échecs mineurs
Score 14-16/23 (61%): ⚠️ MOYEN - Corriger échecs avant prod
Score < 14/23 (61%): 🔴 INSUFFISANT - Ne pas déployer
```

**Votre score**: ___/23 = ___%

**Action requise**: _________________________

---

## 🔧 CORRECTIFS SI ÉCHECS

### Si Migration 121 échoue

```sql
-- Vérifier extension pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Vérifier fonction crypt existe
SELECT crypt('test', gen_salt('bf', 10));

-- Si erreur, installer pgcrypto:
-- https://supabase.com/docs/guides/database/extensions/pgcrypto
```

### Si Migration 122 échoue

```sql
-- Vérifier permissions
GRANT EXECUTE ON FUNCTION record_password_verification TO authenticated;
GRANT EXECUTE ON FUNCTION has_valid_password_verification TO authenticated;

-- Vérifier RLS
ALTER TABLE password_verifications ENABLE ROW LEVEL SECURITY;
```

### Si Migration 123 échoue

```sql
-- Vérifier que migration 115 (vault) a bien run
SELECT encrypt_iban('BE68539007547034');

-- Si erreur "function does not exist":
-- Ré-appliquer migration 115_supabase_vault_iban.sql
```

### Si Session Timeout ne marche pas

```typescript
// Dans middleware.ts, ajouter logs debug:
console.log('[MIDDLEWARE] Session check:', {
  pathname,
  lastActivity,
  isSensitive: isSensitiveRoute,
  isExpired: isSessionExpired(lastActivity, isSensitiveRoute)
});
```

---

## 📝 NOTES IMPORTANTES

1. **Environnement de test**: Utiliser une DB de staging, PAS production
2. **Backup avant test**: `supabase db dump` avant d'appliquer migrations
3. **Logs**: Activer verbose logging pendant tests
4. **Cleanup**: Supprimer données de test après validation

---

**Checklist complétée le**: _______________
**Par**: _______________
**Validé par**: _______________
