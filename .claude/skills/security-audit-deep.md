---
name: security-audit-deep
description: Effectue un audit de sécurité professionnel approfondi basé sur OWASP Top 10 2025, ASVS, et les vulnérabilités spécifiques au code généré par IA
tags: [security, audit, professional]
---

# Security Audit Deep - Skill Professionnelle

## Objectif
Réaliser un audit de sécurité **professionnel** et **exhaustif** d'une application web Next.js/Supabase, avec une attention particulière aux vulnérabilités introduites par le code généré par IA.

## Statistiques Fondamentales (Recherches 2025-2026)

| Métrique | Valeur | Source |
|----------|--------|--------|
| Code IA sécurisé | **55%** seulement | Veracode 2025 |
| Claude Opus 4.5 | 56-69% selon contexte | DarkReading 2026 |
| XSS dans code IA | **2.74x** plus fréquent | The Register 2025 |
| Mauvaise gestion MdP | **1.88x** plus fréquent | The Register 2025 |
| IDOR | **1.91x** plus fréquent | ArXiv 2025 |
| Insecure Deserialization | **1.82x** plus fréquent | Veracode 2025 |
| Path Traversal & Injection | **34%** des vulns IA | DarkReading 2026 |

---

## MÉTHODOLOGIE COMPLÈTE

### Phase 1 : Reconnaissance (2h)

#### 1.1 Cartographie de l'Application

**Utiliser les tools Claude** :
```
Glob: **/*route.ts        → Tous les API endpoints
Glob: **/page.tsx          → Toutes les pages
Grep: "createClient"       → Usages Supabase
Grep: "NEXT_PUBLIC"        → Variables exposées frontend
```

**Créer** :
- Liste de tous les endpoints par méthode (GET, POST, PUT, DELETE)
- Diagramme d'architecture (frontend ↔ API ↔ Supabase ↔ Services externes)
- Inventory des données sensibles (passwords, IBAN, PII)
- Flow des données sensibles (où collectées, stockées, transmises)

#### 1.2 Threat Modeling (STRIDE)

Pour **chaque composant critique** :

| Threat | Questions |
|--------|-----------|
| **S**poofing | Peut-on usurper l'identité d'un autre user ? Admin ? |
| **T**ampering | Quelles données peuvent être modifiées ? Validation ? |
| **R**epudiation | Actions loggées ? Audit trail complet ? |
| **I**nfo Disclosure | Données exposées ? API errors leakent-elles ? |
| **D**enial of Service | Rate limiting ? Timeouts ? Resource limits ? |
| **E**levation of Privilege | IDOR possible ? RLS correct ? |

---

### Phase 2 : OWASP Top 10 2025 (4h)

#### A01:2025 - Broken Access Control ⭐ #1 Risk

**Tests IDOR** :
1. Modifier `user_id` dans body/params → accès aux données d'autrui ?
2. Modifier `property_id` → propriétés non autorisées accessibles ?
3. Tester avec différents roles (searcher/owner/resident)

**Tests Path Traversal** :
- Upload filename : `../../../etc/passwd`
- File read parameter : `../../.env`

**Automation** (Grep tool) :
```
# SQL queries sans auth.uid()
Grep: "FROM.*WHERE" dans migrations/*.sql
Filter : sans "auth.uid()"

# API routes sans auth check
Grep files: app/api/**/route.ts
Filter: sans "session" OU "auth" OU "user"
```

**Checklist** :
- [ ] RLS activé sur toutes les tables sensibles
- [ ] Policies testées avec différents users
- [ ] Authorization vérifiée AVANT chaque query
- [ ] Admin endpoints protégés

---

#### A02:2025 - Security Misconfiguration ⬆️ #2

**Configuration Headers** :
```typescript
// next.config.js - Vérifier headers de sécurité
headers: [
  'X-Frame-Options: DENY',
  'X-Content-Type-Options: nosniff',
  'Referrer-Policy: origin-when-cross-origin',
  'Permissions-Policy: geolocation=()',
  'Content-Security-Policy: ...'
]
```

**Checklist** :
- [ ] CSP configuré (pas de unsafe-inline)
- [ ] CORS restrictif (pas de `*`)
- [ ] Error messages génériques
- [ ] Debug endpoints supprimés (`/api/debug/*`)
- [ ] `.env` dans `.gitignore`
- [ ] Ports non nécessaires fermés

---

#### A03:2025 - Supply Chain Failures 🆕

**NOUVEAU 2025** - Critique pour apps IA (nombreuses dépendances)

**Actions** :
```bash
npm audit --production
npm outdated
npm list --depth=0
```

**Vérifier** :
- [ ] Pas de CVEs HIGH/CRITICAL non patchées
- [ ] Packages maintenus (dernière release < 6 mois)
- [ ] Pas de packages suspects (typosquatting)
- [ ] Lock file (`package-lock.json`) commité
- [ ] Next.js >= 15.2.3 (CVE-2025-29927)

**Supply Chain Attack Vectors** :
- Packages malveillants (vérifier auteurs, downloads)
- Dependency confusion
- Compromission de packages légitimes

---

#### A04:2025 - Injection

**SQL Injection** (Grep patterns à chercher) :
- String concatenation : `"SELECT * FROM " + table`
- Template strings : `` `WHERE id = ${userId}` ``
- `.raw()` avec user input

**XSS** :
- Chercher insertions HTML dynamiques
- Vérifier sanitization (DOMPurify, etc.)
- Tester tous les inputs reflétés

**Command Injection** :
- Identifier fonctions système avec user input
- S'assurer validation stricte

**NoSQL Injection** (si applicable) :
- `$where`, `$ne`, etc. dans queries MongoDB

---

#### A05:2025 - Insecure Design

**Business Logic Flaws** :
- [ ] Password reset → timing attack pour énumérer emails ?
- [ ] Pricing → prix négatifs / overflow ?
- [ ] Race conditions → double payment ?
- [ ] Workflow bypass → étapes obligatoires skipables ?
- [ ] State machines → états invalides accessibles ?

**Example** :
```
IZZICO : Un user peut-il :
- Postuler à sa propre propriété ?
- Se matcher avec lui-même ?
- Créer un expense avec montant négatif ?
- Bypasser le cooldown de 24h sur bank info ?
```

---

#### A06:2025 - Vulnerable Components

**Dependency Audit** :
```bash
npm audit --json | jq '.vulnerabilities | to_entries[] | select(.value.severity == "high" or .value.severity == "critical")'
```

**Vérifier versions critiques** :
- Next.js >= 15.2.3
- React >= 18.3.0
- Supabase client à jour
- Stripe SDK à jour

**Abandoned Packages** :
```bash
npm outdated | grep "MISSING"
```

---

#### A07:2025 - Authentication Failures

**Password Management** :
- [ ] Min 12 chars, complexité enforced
- [ ] Bcrypt/Argon2 (PAS MD5/SHA256)
- [ ] Jamais en clair dans logs
- [ ] Rate limit login (5/min)

**Session Management** :
- [ ] Timeout < 30min **ET APPLIQUÉ**
- [ ] Invalidation au logout
- [ ] Session fixation impossible

**Account Security** :
- [ ] Lockout après 5 failed attempts
- [ ] MFA disponible
- [ ] Secure password reset (token + expiration)

**Common Mistakes in AI Code** :
- Timeout calculé mais pas appliqué (IZZICO !)
- Weak hashing (SHA256 pour passwords - IZZICO !)
- Password comparison en clair

---

#### A08:2025 - Data Integrity Failures

**File Uploads** :
- [ ] MIME type vérifié
- [ ] Magic bytes vérifiés (vraie signature)
- [ ] Extension allowlist
- [ ] File renaming (éviter double extension)
- [ ] Virus scanning (ClamAV, etc.)

**Webhooks** :
- [ ] Signature vérifiée (Stripe, etc.)
- [ ] Replay attack prevention
- [ ] Timeout configuré

**Serialization** :
- [ ] `JSON.parse()` + validation Zod
- [ ] Pas de désérialisation formats binaires non safe

---

#### A09:2025 - Logging Failures

**Events Critiques à Logger** :
| Event | Data | Retention |
|-------|------|-----------|
| Login/Logout | user_id, IP, timestamp, user-agent | 90 days |
| Failed auth | email (hashed?), IP, timestamp | 90 days |
| Password change | user_id, IP, timestamp | 1 year |
| IBAN modification | user_id, IP, old IBAN (masked), new IBAN (masked) | 7 years (compliance) |
| Admin actions | admin_id, action, resource, IP | 1 year |
| Access denied | user_id, resource, reason | 30 days |

**Logs Sécurisés** :
- [ ] Jamais de passwords/tokens
- [ ] Minimal PII
- [ ] Access restreint (admin only)
- [ ] Tamper-proof (append-only)

**Alerting** :
- [ ] Failed auth spike (> 10/min)
- [ ] Server errors 500 spike
- [ ] Suspicious patterns (SQLi attempts, XSS)

---

#### A10:2025 - Exceptional Conditions 🆕

**NOUVEAU 2025** - 24 CWEs liés aux erreurs

**Error Handling** :
- [ ] Stack traces JAMAIS exposées en production
- [ ] Errors génériques pour users
- [ ] Detailed errors loggés server-side

**Fail Secure** :
- [ ] Erreur → deny access (pas grant)
- [ ] Timeouts sur toutes les requêtes externes
- [ ] Graceful degradation

**Race Conditions** :
- [ ] DB transactions pour opérations critiques
- [ ] Locks sur ressources partagées
- [ ] Idempotency keys (paiements Stripe)

---

### Phase 3 : AI Code Vulnerabilities (2h)

#### Patterns Spécifiques Code IA

**1. Path Traversal (34% des vulns)**
```typescript
// ❌ DANGEREUX
const filePath = `./uploads/${req.body.filename}`;
fs.readFile(filePath);

// ✅ SAFE
const filename = path.basename(req.body.filename);
const filePath = path.join('./uploads', filename);
```

**2. Weak Password Hashing (1.88x)**
```sql
-- ❌ IZZICO actuel
sha256(pin_code::bytea)

-- ✅ FIX
crypt(pin_code, gen_salt('bf', 10))
```

**3. IDOR (1.91x)**
```typescript
// ❌ DANGEREUX
const data = await supabase
  .from('user_bank_info')
  .select('*')
  .eq('id', req.params.id);  // Pas de check ownership!

// ✅ SAFE
const data = await supabase
  .from('user_bank_info')
  .select('*')
  .eq('id', req.params.id)
  .eq('user_id', session.user.id);  // Ownership check
```

**4. Code Duplication**
AI copie-colle souvent le même code → bugs répliqués.
Chercher :
```bash
# Fonctions similaires
find . -name "*.ts" -type f | while read file; do
  md5sum "$file"
done | sort | uniq -w32 -d
```

---

### Phase 4 : Database Security (2h)

#### RLS Audit Complet

**Queries SQL à Exécuter** :
```sql
-- 1. Tables sans RLS
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false;

-- 2. Tables sensibles DOIVENT avoir RLS
-- user_profiles, user_bank_info, messages, properties, etc.

-- 3. Policies par table et commande
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;

-- 4. Policies suspectes (sans auth.uid)
SELECT tablename, policyname, definition
FROM pg_policies
WHERE definition NOT LIKE '%auth.uid()%'
  AND schemaname = 'public';

-- 5. WITH CHECK policies (INSERT/UPDATE)
SELECT tablename, policyname, with_check
FROM pg_policies
WHERE with_check IS NOT NULL;
```

#### Service Role Key

**CRITIQUE** : Chercher expositions :
```
Grep: "SERVICE_ROLE_KEY" dans app/**/page.tsx
Grep: "SERVICE_ROLE_KEY" dans components/**/*.tsx

Si résultats → ❌ CRITIQUE : key exposée au client !
```

**Utilisations légitimes** :
- API routes server-side uniquement
- Webhooks (Stripe, etc.)
- Admin operations justifiées

#### Data Encryption

**Supabase Vault** (column-level encryption) :
```sql
-- Créer encryption key
INSERT INTO vault.secrets (secret)
VALUES ('32-char-minimum-encryption-key-here')
RETURNING id;

-- Encrypt column
ALTER TABLE user_bank_info
  ADD COLUMN iban_encrypted bytea;

UPDATE user_bank_info
SET iban_encrypted = vault.encrypt(iban::bytea, (
  SELECT id FROM vault.secrets WHERE name = 'iban_key'
));

-- Drop plaintext
ALTER TABLE user_bank_info DROP COLUMN iban;
```

---

### Phase 5 : Cryptography (1h)

#### Password Hashing

| Algorithm | Status | Notes |
|-----------|--------|-------|
| MD5 | ❌ BANNED | Collisions, trop rapide |
| SHA1 | ❌ BANNED | Collisions démontrées |
| SHA256 | ❌ BANNED for passwords | Pas de salt auto, trop rapide |
| bcrypt | ✅ GOOD | Standard, éprouvé, salt auto |
| Argon2 | ✅ BEST | Moderne, résistant GPU |
| scrypt | ✅ GOOD | Memory-hard |
| PBKDF2 | ✅ OK | Moins recommandé qu'Argon2 |

#### PostgreSQL Crypto

```sql
-- Générer salt bcrypt
gen_salt('bf', 10)  -- 10 rounds = 2^10 iterations

-- Hash password
crypt('user_password', gen_salt('bf', 10))

-- Verify
SELECT crypt('input', stored_hash) = stored_hash;
```

#### Secrets Management

**Checklist** :
- [ ] `.env` dans `.gitignore`
- [ ] `.env.example` = placeholders only
- [ ] Service keys = env variables
- [ ] Rotation policy documentée
- [ ] Secrets différents dev/staging/prod

---

### Phase 6 : Rate Limiting (1h)

#### Limites Recommandées

| Endpoint | Limite | Raison |
|----------|--------|--------|
| `POST /api/auth/login` | 5/min per IP | Brute-force |
| `POST /api/auth/signup` | 3/hour per IP | Spam |
| `POST /api/auth/reset-password` | 3/hour per email | Enumeration |
| `POST /api/upload/*` | 10/hour per user | Storage abuse |
| `POST /api/matching/generate` | 1/hour per user | Expensive query |
| `PUT /api/user/bank-info` | 2/day per user | Fraud prevention |
| `*` (global) | 1000/hour per user | DoS prevention |

#### Implementation Check

```typescript
// Vérifier présence rate limiter
Grep: "RateLimit|ratelimit|Ratelimit" dans app/api/**/*.ts

// Endpoints sensibles sans rate limit ?
Grep files: app/api/**/route.ts avec "POST|PUT|DELETE"
Filter: sans "ratelimit"
```

---

### Phase 7 : ASVS Level 2 (2h)

#### Checklist Condensée

**V2: Authentication** ✅/❌
- [ ] Password >= 12 chars
- [ ] Bcrypt/Argon2 hashing
- [ ] MFA available
- [ ] Session timeout < 30min ENFORCED
- [ ] Account lockout functional

**V3: Session** ✅/❌
- [ ] Framework-generated session IDs
- [ ] Logout invalidates session
- [ ] Session fixation prevented

**V4: Access Control** ✅/❌
- [ ] Deny by default
- [ ] RLS on all sensitive tables
- [ ] Authorization checked per request

**V5: Validation** ✅/❌
- [ ] Server-side validation
- [ ] Output encoding (XSS prevention)
- [ ] File upload strict validation

**V8: Data Protection** ✅/❌
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced (HSTS)
- [ ] Logs don't contain secrets

**V9: Communications** ✅/❌
- [ ] TLS 1.2+ only
- [ ] Certificate validation
- [ ] API keys in headers (not URL)

**V10: Malicious Code** ✅/❌
- [ ] npm audit clean
- [ ] No debug code in production
- [ ] Code review process

---

## RAPPORT D'AUDIT - TEMPLATE

### Executive Summary

**Project** : Izzico
**Date** : [Date]
**Auditor** : Claude Code Security Audit
**Scope** : Full-stack (Frontend, API Routes, Database, Infrastructure)

**Security Posture** : [CRITICAL / HIGH / MEDIUM / LOW]

**Summary** :
- Critical : [N] findings
- High : [N] findings
- Medium : [N] findings
- Low : [N] findings

**Top Risks** :
1. [Risk 1]
2. [Risk 2]
3. [Risk 3]

**Recommendation** : [Deploy / Do NOT deploy before fixes]

---

### Methodology

**Standards** :
- OWASP Top 10 2025
- ASVS Level 2
- CWE Top 25
- AI Code Security (Veracode 2025)

**Coverage** :
- [N] files analyzed
- [N] API routes reviewed
- [N] SQL migrations audited
- [N]% of critical code covered

---

### Critical Findings

#### VULN-XXX: [Title]

**Severity** : 🔴 CRITICAL
**CVSS** : [Score]
**CWE** : CWE-XXX
**OWASP** : A0X:2025

**Location** : `[file:line]`

**Description** :
[Clear description of the vulnerability]

**Impact** :
- [Impact 1]
- [Impact 2]

**Remediation** :
```[language]
[Code fix]
```

**Effort** : [Hours]
**Priority** : P[0-3]
**Status** : [PENDING / IN PROGRESS / FIXED]

---

### Recommendations

#### Immediate (P0)
1. [Action 1]
2. [Action 2]

#### Short-term (P1)
1. [Action 1]

#### Long-term
1. Professional pentest
2. Bug bounty program
3. SAST/DAST in CI/CD

---

## Sources & Standards

- OWASP Top 10 2025 : https://owasp.org/Top10/2025/
- ASVS 4.0 : https://owasp.org/www-project-application-security-verification-standard/
- CWE Top 25 : https://cwe.mitre.org/top25/
- Veracode AI Security : https://www.veracode.com/blog/ai-generated-code-security-risks/
- Next.js Security 2025 : https://www.turbostarter.dev/blog/complete-nextjs-security-guide-2025
- Supabase Security : https://www.supadex.app/blog/best-security-practices-in-supabase-a-comprehensive-guide

---

## Continuous Improvement

Après chaque audit :
1. Documenter nouvelles vulnérabilités trouvées
2. Ajouter tests automatiques
3. Mettre à jour cette skill
4. Former l'équipe sur erreurs communes
5. Réviser secure coding guidelines
