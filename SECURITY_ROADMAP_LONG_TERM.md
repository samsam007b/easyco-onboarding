# Plan d'Amélioration de la Sécurité - Long Terme

## Vue d'ensemble

Ce document présente un plan complet pour renforcer la sécurité de l'application EasyCo sur le long terme, au-delà des correctifs immédiats déjà appliqués.

---

## 🔴 Priorité HAUTE (1-2 mois)

### 1. Audit Complet des Fonctions SECURITY DEFINER

**Problème** : Les fonctions avec `SECURITY DEFINER` sont des risques potentiels.

**Actions** :
```sql
-- Identifier toutes les fonctions SECURITY DEFINER
SELECT
  n.nspname as schema,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.prosecdef = true
  AND n.nspname = 'public'
ORDER BY p.proname;
```

**À faire** :
- [ ] Lister toutes les fonctions `SECURITY DEFINER`
- [ ] Pour chaque fonction, vérifier :
  - Est-elle vraiment nécessaire ?
  - Fait-elle des vérifications d'autorisation explicites ?
  - Peut-elle être remplacée par `SECURITY INVOKER` ?
- [ ] Documenter pourquoi chaque `SECURITY DEFINER` est nécessaire
- [ ] Ajouter des tests de sécurité pour chaque fonction

**Fonctions actuelles à auditer** :
- `get_or_create_conversation` - SECURITY DEFINER (messagerie)
- `send_message` - SECURITY DEFINER (messagerie)
- `mark_conversation_read` - SECURITY DEFINER (messagerie)
- `cleanup_expired_typing_indicators` - SECURITY DEFINER (messagerie)
- `get_user_conversations` - SECURITY DEFINER (messagerie)
- `is_user_admin` - SECURITY DEFINER (vérification admin)
- `calculate_profile_completion` - SECURITY DEFINER (calcul score profil)

---

### 2. Revue Complète des Politiques RLS

**Problème** : Certaines politiques RLS peuvent avoir des failles ou être trop permissives.

**Actions** :

#### A. Vérifier les politiques INSERT
```sql
-- Lister toutes les politiques INSERT
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE cmd = 'INSERT'
  AND schemaname = 'public'
ORDER BY tablename;
```

**Points de vérification** :
- [ ] Les utilisateurs ne peuvent créer que leurs propres données
- [ ] Les IDs utilisateur ne peuvent pas être usurpés
- [ ] Les relations (foreign keys) sont validées

#### B. Vérifier les politiques SELECT
```sql
-- Identifier les politiques SELECT trop permissives
SELECT tablename, policyname, qual
FROM pg_policies
WHERE cmd = 'SELECT'
  AND schemaname = 'public'
  AND qual LIKE '%true%'; -- Politiques qui permettent tout
```

**Points de vérification** :
- [ ] Pas de `USING (true)` sans justification
- [ ] Vérifier les jointures dans les sous-requêtes
- [ ] S'assurer que `auth.uid()` est toujours vérifié

#### C. Vérifier les politiques UPDATE/DELETE
```sql
-- Lister les politiques de modification
SELECT tablename, policyname, cmd, qual, with_check
FROM pg_policies
WHERE cmd IN ('UPDATE', 'DELETE')
  AND schemaname = 'public'
ORDER BY tablename, cmd;
```

**Points de vérification** :
- [ ] Les utilisateurs ne peuvent modifier que leurs données
- [ ] Les champs sensibles sont protégés (pas de modification de `user_id`, etc.)
- [ ] Les suppressions sont sécurisées

---

### 3. Implémenter l'Audit Logging

**Problème** : Pas de traçabilité des actions sensibles.

**Solution** : Créer un système d'audit complet.

#### A. Table d'audit
```sql
CREATE TABLE public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Qui ?
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  user_role TEXT,

  -- Quoi ?
  action_type TEXT NOT NULL, -- 'login', 'data_access', 'data_modification', 'admin_action', etc.
  table_name TEXT,
  record_id UUID,
  operation TEXT, -- 'SELECT', 'INSERT', 'UPDATE', 'DELETE'

  -- Détails
  old_values JSONB,
  new_values JSONB,
  query TEXT,

  -- Contexte
  ip_address INET,
  user_agent TEXT,
  request_id TEXT,

  -- Résultat
  success BOOLEAN DEFAULT true,
  error_message TEXT,

  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherches rapides
CREATE INDEX idx_audit_user ON public.security_audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_action ON public.security_audit_log(action_type, created_at DESC);
CREATE INDEX idx_audit_table ON public.security_audit_log(table_name, operation, created_at DESC);

-- RLS : Seuls les admins peuvent voir les logs
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs"
  ON public.security_audit_log
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
    )
  );
```

#### B. Fonction d'audit automatique
```sql
CREATE OR REPLACE FUNCTION audit_data_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.security_audit_log (
    user_id,
    user_email,
    action_type,
    table_name,
    record_id,
    operation,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    auth.jwt() ->> 'email',
    'data_modification',
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### C. Appliquer aux tables sensibles
```sql
-- Auditer les modifications de profils
CREATE TRIGGER audit_user_profiles
  AFTER INSERT OR UPDATE OR DELETE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION audit_data_change();

-- Auditer les vérifications KYC
CREATE TRIGGER audit_user_verifications
  AFTER INSERT OR UPDATE OR DELETE ON public.user_verifications
  FOR EACH ROW EXECUTE FUNCTION audit_data_change();

-- Auditer les données bancaires
-- (Important pour la conformité PCI-DSS si vous gérez des paiements)
```

**À faire** :
- [ ] Implémenter la table d'audit
- [ ] Créer les triggers sur les tables sensibles
- [ ] Créer un dashboard admin pour consulter les logs
- [ ] Configurer des alertes pour les actions suspectes

---

### 4. Sécuriser les Données Sensibles (Chiffrement)

**Problème** : Certaines données sensibles sont en clair dans la base.

#### A. Chiffrer les données bancaires

**Données concernées** :
- IBAN, BIC/SWIFT
- Numéros de documents d'identité
- Informations de paiement

**Solution avec pgcrypto** :
```sql
-- Activer l'extension pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fonction pour chiffrer
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Utiliser une clé stockée dans Supabase Vault (plus sécurisé)
  RETURN encode(
    pgp_sym_encrypt(data, current_setting('app.encryption_key')),
    'base64'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour déchiffrer
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(
    decode(encrypted_data, 'base64'),
    current_setting('app.encryption_key')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Migration** :
```sql
-- Ajouter colonnes chiffrées
ALTER TABLE user_profiles
  ADD COLUMN iban_encrypted TEXT,
  ADD COLUMN bic_swift_encrypted TEXT;

-- Migrer les données existantes
UPDATE user_profiles
SET
  iban_encrypted = encrypt_sensitive_data(iban),
  bic_swift_encrypted = encrypt_sensitive_data(bic_swift)
WHERE iban IS NOT NULL OR bic_swift IS NOT NULL;

-- Supprimer les colonnes en clair après vérification
-- ALTER TABLE user_profiles DROP COLUMN iban, DROP COLUMN bic_swift;
```

#### B. Masquage des données (Data Masking)

**Pour les environnements de dev/test** :
```sql
CREATE OR REPLACE FUNCTION mask_email(email TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN regexp_replace(email, '^(.{2}).*(@.*)$', '\1***\2');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION mask_phone(phone TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN regexp_replace(phone, '(\d{2})\d+(\d{2})$', '\1****\2');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Vue pour les développeurs (données masquées)
CREATE VIEW dev_user_profiles AS
SELECT
  id,
  user_id,
  first_name,
  LEFT(last_name, 1) || '***' as last_name,
  mask_email(COALESCE(
    (SELECT email FROM users WHERE id = user_id),
    'no-email@example.com'
  )) as email,
  date_of_birth,
  -- Autres champs non sensibles
FROM user_profiles;
```

**À faire** :
- [ ] Identifier toutes les données sensibles (PII - Personally Identifiable Information)
- [ ] Implémenter le chiffrement pour IBAN, BIC, documents ID
- [ ] Créer des vues masquées pour dev/staging
- [ ] Documenter quelles données sont chiffrées et pourquoi
- [ ] Mettre en place la rotation des clés de chiffrement

---

## 🟡 Priorité MOYENNE (3-4 mois)

### 5. Rate Limiting et Protection DDoS

**Problème** : Pas de limitation des requêtes, risque d'abus.

#### A. Rate limiting au niveau base de données
```sql
CREATE TABLE public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  endpoint TEXT,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT NOW(),
  blocked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rate_limits_user ON public.rate_limits(user_id, window_start);
CREATE INDEX idx_rate_limits_ip ON public.rate_limits(ip_address, window_start);

-- Fonction de vérification rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id UUID,
  p_ip_address INET,
  p_endpoint TEXT,
  p_max_requests INTEGER DEFAULT 100,
  p_window_minutes INTEGER DEFAULT 15
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_count INTEGER;
  v_blocked_until TIMESTAMPTZ;
BEGIN
  -- Vérifier si déjà bloqué
  SELECT blocked_until INTO v_blocked_until
  FROM public.rate_limits
  WHERE user_id = p_user_id
    AND blocked_until > NOW()
  LIMIT 1;

  IF v_blocked_until IS NOT NULL THEN
    RAISE EXCEPTION 'Rate limit exceeded. Try again after %', v_blocked_until;
  END IF;

  -- Compter les requêtes dans la fenêtre
  SELECT COUNT(*) INTO v_current_count
  FROM public.rate_limits
  WHERE user_id = p_user_id
    AND endpoint = p_endpoint
    AND window_start > (NOW() - (p_window_minutes || ' minutes')::INTERVAL);

  IF v_current_count >= p_max_requests THEN
    -- Bloquer l'utilisateur
    UPDATE public.rate_limits
    SET blocked_until = NOW() + (p_window_minutes || ' minutes')::INTERVAL
    WHERE user_id = p_user_id;

    RETURN FALSE;
  END IF;

  -- Enregistrer la requête
  INSERT INTO public.rate_limits (user_id, ip_address, endpoint)
  VALUES (p_user_id, p_ip_address, p_endpoint);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### B. Limites spécifiques
```sql
-- Limites recommandées par endpoint
-- API publique: 100 req/15min
-- Authentification: 5 tentatives/15min
-- Upload fichiers: 10 fichiers/heure
-- Envoi messages: 50 messages/heure
-- Recherche: 200 req/15min
```

**À faire** :
- [ ] Implémenter rate limiting au niveau application
- [ ] Configurer Supabase Edge Functions avec rate limits
- [ ] Mettre en place des alertes pour les abus détectés
- [ ] Créer un dashboard de monitoring des rate limits

---

### 6. Gestion des Secrets et Clés API

**Problème** : Clés potentiellement exposées dans le code.

**Solutions** :

#### A. Utiliser Supabase Vault
```sql
-- Stocker les secrets dans Vault (interface admin Supabase)
-- Puis y accéder via:
SELECT vault.read_secret('encryption_key');
SELECT vault.read_secret('api_key_stripe');
```

#### B. Rotation automatique des clés
```sql
CREATE TABLE public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  key_hash TEXT NOT NULL, -- Jamais stocker la clé en clair
  name TEXT,
  scopes TEXT[],
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fonction pour générer une clé API
CREATE OR REPLACE FUNCTION generate_api_key(
  p_user_id UUID,
  p_name TEXT,
  p_scopes TEXT[],
  p_expires_in_days INTEGER DEFAULT 90
)
RETURNS TEXT AS $$
DECLARE
  v_key TEXT;
  v_hash TEXT;
BEGIN
  -- Générer une clé sécurisée
  v_key := 'easyco_' || encode(gen_random_bytes(32), 'hex');
  v_hash := encode(digest(v_key, 'sha256'), 'hex');

  INSERT INTO public.api_keys (user_id, key_hash, name, scopes, expires_at)
  VALUES (
    p_user_id,
    v_hash,
    p_name,
    p_scopes,
    NOW() + (p_expires_in_days || ' days')::INTERVAL
  );

  -- Retourner la clé UNE SEULE FOIS
  RETURN v_key;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**À faire** :
- [ ] Migrer tous les secrets vers Supabase Vault
- [ ] Implémenter la rotation automatique des clés (90 jours)
- [ ] Créer un système de clés API pour les intégrations
- [ ] Auditer les accès aux secrets

---

### 7. Protection Contre les Injections

#### A. Validation stricte des entrées
```typescript
// Côté application - validation avec Zod
import { z } from 'zod';

const ProfileSchema = z.object({
  first_name: z.string().min(1).max(100).regex(/^[a-zA-ZÀ-ÿ\s-]+$/),
  email: z.string().email(),
  budget_min: z.number().int().min(0).max(100000),
  bio: z.string().max(500),
  // ... autres champs
});

// Valider avant d'envoyer à la base
const validatedData = ProfileSchema.parse(userInput);
```

#### B. Prepared statements (déjà fait par Supabase)
Supabase utilise automatiquement des prepared statements, mais vérifier :

```typescript
// ✅ BON (paramétré)
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', userEmail);

// ❌ MAUVAIS (construction manuelle de requête)
const { data } = await supabase
  .rpc('raw_sql', { query: `SELECT * FROM users WHERE email = '${userEmail}'` });
```

**À faire** :
- [ ] Audit de toutes les requêtes dynamiques
- [ ] Ajouter validation Zod sur tous les endpoints
- [ ] Sanitization des inputs utilisateur
- [ ] Tests de pénétration (injection SQL, XSS, etc.)

---

### 8. Sécurité des Fichiers Uploadés

**Problème** : Risque d'upload de fichiers malveillants.

#### A. Validation des fichiers
```sql
CREATE TABLE public.file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),

  -- Métadonnées
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,

  -- Sécurité
  virus_scanned BOOLEAN DEFAULT FALSE,
  virus_scan_result TEXT,
  content_hash TEXT, -- SHA-256

  -- Type de document
  document_type TEXT CHECK (document_type IN ('profile_photo', 'id_document', 'property_image')),

  -- Statut
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Politique de stockage sécurisée
-- Dans Supabase Storage:
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-uploads'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND (
      -- Limiter les types de fichiers
      mime_type IN (
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf'
      )
    )
    AND -- Limiter la taille (5MB)
    size < 5242880
  );
```

#### B. Scan antivirus (intégration ClamAV)
```typescript
// Edge Function pour scanner les fichiers
import { createClient } from '@supabase/supabase-js';
import ClamScan from 'clamscan';

export async function scanUploadedFile(filePath: string) {
  const clamscan = await new ClamScan().init({
    clamdscan: {
      host: process.env.CLAMAV_HOST,
      port: 3310,
    },
  });

  const { isInfected, viruses } = await clamscan.scanFile(filePath);

  return {
    safe: !isInfected,
    viruses: viruses || [],
  };
}
```

**À faire** :
- [ ] Implémenter validation stricte des types MIME
- [ ] Limiter la taille des fichiers (5MB pour images, 10MB pour PDF)
- [ ] Intégrer un scan antivirus (ClamAV ou service cloud)
- [ ] Générer des thumbnails côté serveur (éviter exécution client)
- [ ] Implémenter la quarantaine des fichiers suspects

---

## 🟢 Priorité BASSE (5-6 mois)

### 9. Authentification Multi-Facteurs (MFA/2FA)

**Supabase supporte MFA nativement** :

```typescript
// Activer MFA pour un utilisateur
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
});

// Vérifier le code MFA
const { data, error } = await supabase.auth.mfa.verify({
  factorId: factorId,
  challengeId: challengeId,
  code: userCode,
});
```

**À faire** :
- [ ] Rendre MFA obligatoire pour les admins
- [ ] Proposer MFA optionnel pour tous les users
- [ ] Implémenter backup codes
- [ ] Ajouter SMS 2FA (via Twilio)

---

### 10. Monitoring et Alertes de Sécurité

#### A. Alertes en temps réel
```sql
CREATE TABLE public.security_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Type d'alerte
  alert_type TEXT NOT NULL CHECK (alert_type IN (
    'suspicious_login',
    'multiple_failed_attempts',
    'unusual_activity',
    'data_breach_attempt',
    'privilege_escalation',
    'rate_limit_exceeded'
  )),

  -- Contexte
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  user_agent TEXT,

  -- Détails
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT,
  metadata JSONB,

  -- Statut
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')),
  assigned_to UUID REFERENCES public.admins(id),
  resolved_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fonction pour créer une alerte
CREATE OR REPLACE FUNCTION create_security_alert(
  p_alert_type TEXT,
  p_severity TEXT,
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.security_alerts (
    alert_type,
    user_id,
    severity,
    description,
    metadata
  ) VALUES (
    p_alert_type,
    auth.uid(),
    p_severity,
    p_description,
    p_metadata
  );

  -- Envoyer notification si critique
  IF p_severity = 'critical' THEN
    -- Intégration avec service de notification (email, Slack, etc.)
    PERFORM pg_notify('security_alert', json_build_object(
      'type', p_alert_type,
      'severity', p_severity,
      'description', p_description
    )::text);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### B. Détection d'anomalies
```sql
-- Détecter les connexions depuis des pays inhabituels
-- Détecter les pics d'activité anormaux
-- Détecter les accès aux données sensibles en masse
CREATE OR REPLACE FUNCTION detect_suspicious_activity()
RETURNS void AS $$
BEGIN
  -- Exemple: Détecter trop de requêtes d'un user
  INSERT INTO public.security_alerts (alert_type, user_id, severity, description)
  SELECT
    'unusual_activity',
    user_id,
    'medium',
    'User made ' || COUNT(*) || ' requests in the last hour'
  FROM public.security_audit_log
  WHERE created_at > NOW() - INTERVAL '1 hour'
  GROUP BY user_id
  HAVING COUNT(*) > 1000;
END;
$$ LANGUAGE plpgsql;

-- Exécuter périodiquement (via pg_cron ou Edge Function)
```

**À faire** :
- [ ] Configurer alertes email pour admins
- [ ] Intégrer avec Slack/Discord pour alertes temps réel
- [ ] Créer un dashboard de sécurité
- [ ] Implémenter détection d'anomalies ML (machine learning)

---

### 11. Conformité RGPD Complète

#### A. Droit à l'oubli (Right to be Forgotten)
```sql
CREATE OR REPLACE FUNCTION anonymize_user_data(p_user_id UUID)
RETURNS void AS $$
BEGIN
  -- Vérifier que c'est le bon utilisateur
  IF p_user_id != auth.uid() AND NOT is_user_admin() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Anonymiser les données personnelles
  UPDATE public.user_profiles
  SET
    first_name = 'Deleted',
    last_name = 'User',
    email = 'deleted_' || id::text || '@deleted.local',
    date_of_birth = NULL,
    bio = NULL,
    profile_photo_url = NULL,
    phone_number = NULL,
    iban = NULL,
    bic_swift = NULL,
    -- Garder les données statistiques anonymes
    updated_at = NOW()
  WHERE user_id = p_user_id;

  -- Logger l'anonymisation
  INSERT INTO public.security_audit_log (
    user_id,
    action_type,
    description
  ) VALUES (
    p_user_id,
    'gdpr_deletion',
    'User data anonymized per GDPR request'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

#### B. Export des données (Data Portability)
```sql
CREATE OR REPLACE FUNCTION export_user_data(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_export JSONB;
BEGIN
  IF p_user_id != auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT jsonb_build_object(
    'user', row_to_json(u.*),
    'profile', row_to_json(up.*),
    'verifications', row_to_json(uv.*),
    'consents', row_to_json(uc.*),
    'messages', (
      SELECT jsonb_agg(row_to_json(m.*))
      FROM public.messages m
      WHERE m.sender_id = p_user_id
    ),
    'exported_at', NOW()
  ) INTO v_export
  FROM public.users u
  LEFT JOIN public.user_profiles up ON u.id = up.user_id
  LEFT JOIN public.user_verifications uv ON u.id = uv.user_id
  LEFT JOIN public.user_consents uc ON u.id = uc.user_id
  WHERE u.id = p_user_id;

  RETURN v_export;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**À faire** :
- [ ] Implémenter le droit à l'oubli
- [ ] Permettre l'export des données (format JSON)
- [ ] Créer un workflow de suppression de compte
- [ ] Documenter la politique de rétention des données
- [ ] Implémenter le consentement granulaire

---

### 12. Tests de Sécurité Automatisés

#### A. Tests unitaires de sécurité
```typescript
// tests/security/rls.test.ts
import { createClient } from '@supabase/supabase-js';

describe('RLS Security Tests', () => {
  it('should prevent users from seeing other users profiles', async () => {
    const user1 = createClient(url, key, { auth: { token: user1Token } });
    const user2 = createClient(url, key, { auth: { token: user2Token } });

    // User 1 essaie de voir le profil de User 2
    const { data, error } = await user1
      .from('user_profiles')
      .select('*')
      .eq('user_id', user2Id);

    expect(data).toEqual([]); // Ne devrait rien voir
  });

  it('should prevent unauthorized admin access', async () => {
    const regularUser = createClient(url, key, { auth: { token: userToken } });

    const { data, error } = await regularUser.rpc('get_platform_metrics');

    expect(error).toBeTruthy();
    expect(error.message).toContain('Access denied');
  });
});
```

#### B. Tests de pénétration automatisés
```bash
# Utiliser OWASP ZAP ou Burp Suite
# Script de test automatique
#!/bin/bash

echo "Running security tests..."

# Test injection SQL
npm run test:security:sql-injection

# Test XSS
npm run test:security:xss

# Test CSRF
npm run test:security:csrf

# Test RLS
npm run test:security:rls

# Test rate limiting
npm run test:security:rate-limit

echo "Security tests complete!"
```

**À faire** :
- [ ] Écrire des tests RLS pour chaque table
- [ ] Implémenter tests de pénétration dans CI/CD
- [ ] Tests de charge pour identifier les vulnérabilités DDoS
- [ ] Tests de fuzzing sur les endpoints API

---

## 📊 Métriques de Sécurité à Suivre

### KPIs de Sécurité
```sql
-- Dashboard de sécurité
CREATE VIEW security_dashboard AS
SELECT
  -- Connexions
  (SELECT COUNT(*) FROM public.security_audit_log
   WHERE action_type = 'login'
   AND created_at > NOW() - INTERVAL '24 hours') as logins_24h,

  -- Tentatives échouées
  (SELECT COUNT(*) FROM public.security_audit_log
   WHERE action_type = 'login'
   AND success = false
   AND created_at > NOW() - INTERVAL '24 hours') as failed_logins_24h,

  -- Alertes actives
  (SELECT COUNT(*) FROM public.security_alerts
   WHERE status = 'open') as active_alerts,

  -- Alertes critiques
  (SELECT COUNT(*) FROM public.security_alerts
   WHERE status = 'open'
   AND severity = 'critical') as critical_alerts,

  -- Utilisateurs bloqués
  (SELECT COUNT(DISTINCT user_id) FROM public.rate_limits
   WHERE blocked_until > NOW()) as blocked_users,

  -- Dernière violation
  (SELECT MAX(created_at) FROM public.security_alerts
   WHERE severity IN ('high', 'critical')) as last_critical_alert;
```

---

## 🗓️ Planning de Mise en Œuvre

### Mois 1-2 (Priorité HAUTE)
- ✅ Semaine 1-2: Audit des fonctions SECURITY DEFINER
- ✅ Semaine 3-4: Revue complète des politiques RLS
- ✅ Semaine 5-6: Implémenter audit logging
- ✅ Semaine 7-8: Chiffrer les données sensibles

### Mois 3-4 (Priorité MOYENNE)
- ⏳ Semaine 1-2: Rate limiting
- ⏳ Semaine 3-4: Gestion des secrets
- ⏳ Semaine 5-6: Protection contre injections
- ⏳ Semaine 7-8: Sécurité des fichiers uploadés

### Mois 5-6 (Priorité BASSE)
- ⏳ Semaine 1-2: MFA/2FA
- ⏳ Semaine 3-4: Monitoring et alertes
- ⏳ Semaine 5-6: Conformité RGPD complète
- ⏳ Semaine 7-8: Tests de sécurité automatisés

---

## 📚 Ressources et Documentation

### Standards de Sécurité
- **OWASP Top 10** : https://owasp.org/www-project-top-ten/
- **OWASP API Security** : https://owasp.org/www-project-api-security/
- **CWE Top 25** : https://cwe.mitre.org/top25/

### Supabase Security
- **Supabase Security Docs** : https://supabase.com/docs/guides/auth/row-level-security
- **Supabase Security Best Practices** : https://supabase.com/docs/guides/platform/going-into-prod

### Conformité
- **RGPD** : https://gdpr.eu/
- **ISO 27001** : https://www.iso.org/isoiec-27001-information-security.html

### Outils
- **OWASP ZAP** : Scanner de vulnérabilités
- **Burp Suite** : Tests de pénétration
- **SonarQube** : Analyse de code
- **Snyk** : Sécurité des dépendances

---

## ✅ Checklist de Sécurité Mensuelle

### À faire chaque mois :
- [ ] Revoir les logs d'audit pour activités suspectes
- [ ] Vérifier les alertes de sécurité non résolues
- [ ] Mettre à jour les dépendances (npm audit)
- [ ] Revoir les permissions des utilisateurs admins
- [ ] Vérifier les backups et leur chiffrement
- [ ] Tester la procédure de récupération après incident
- [ ] Revoir les politiques RLS pour nouvelles fonctionnalités
- [ ] Scanner les vulnérabilités avec OWASP ZAP
- [ ] Vérifier la rotation des clés API
- [ ] Revoir les accès aux secrets (Vault)

---

## 🚨 Plan de Réponse aux Incidents

### En cas de violation de sécurité :

1. **Détection** (0-15min)
   - Alerte automatique détectée
   - Notification immédiate de l'équipe

2. **Confinement** (15-60min)
   - Bloquer l'accès compromis
   - Isoler les systèmes affectés
   - Préserver les preuves (logs)

3. **Investigation** (1-4h)
   - Identifier l'origine de la breach
   - Évaluer l'étendue des dégâts
   - Documenter tous les détails

4. **Éradication** (4-24h)
   - Corriger la vulnérabilité
   - Déployer le patch
   - Vérifier que la menace est éliminée

5. **Récupération** (1-3 jours)
   - Restaurer les systèmes
   - Surveiller l'activité
   - Communiquer avec les utilisateurs affectés

6. **Post-mortem** (1 semaine)
   - Analyser ce qui s'est passé
   - Documenter les leçons apprises
   - Mettre à jour les procédures

### Contacts d'urgence :
```
Responsable Sécurité : [À définir]
DevOps Lead : [À définir]
CTO : [À définir]
Support Supabase : support@supabase.com
```

---

## 📈 Budget Estimé

### Coûts annuels estimés :

| Item | Coût annuel estimé |
|------|-------------------|
| Outils de monitoring (DataDog, Sentry) | €3,000 - €5,000 |
| Service de scan antivirus (cloud) | €1,000 - €2,000 |
| Tests de pénétration externes | €5,000 - €10,000 |
| Formation sécurité équipe | €2,000 - €4,000 |
| Audit de sécurité externe | €10,000 - €20,000 |
| Assurance cyber-risques | €5,000 - €15,000 |
| **TOTAL** | **€26,000 - €56,000** |

### ROI :
- Éviter une violation de données : €500,000 - €5,000,000 (coût moyen)
- Protection de la réputation : Inestimable
- Conformité RGPD : Éviter des amendes jusqu'à 4% du CA

---

## 📝 Conclusion

Ce plan de sécurité long terme assure :

✅ **Protection des données** - Chiffrement, RLS, audit
✅ **Conformité réglementaire** - RGPD, ISO 27001
✅ **Détection proactive** - Monitoring, alertes, anomalies
✅ **Résilience** - Plan de réponse aux incidents
✅ **Amélioration continue** - Tests automatisés, audits réguliers

**Prochaine révision** : Dans 3 mois (Janvier 2026)

---

*Document créé le : 2025-10-29*
*Dernière mise à jour : 2025-10-29*
*Version : 1.0*
