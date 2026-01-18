# 🚨 AI Security Anti-Patterns Reference

**Purpose**: Complete catalog of security mistakes AI commonly makes
**Based on**: Research 2025-2026 (Veracode, Checkmarx, ArXiv)
**Version**: 1.0 - January 18, 2026

---

## 📊 STATISTICAL OVERVIEW

### Vulnerability Rates in AI-Generated Code (2025)

| Vulnerability Type | AI Failure Rate | Impact | Sources |
|-------------------|-----------------|--------|---------|
| **XSS** (Cross-Site Scripting) | 86% | 🔴 High | Veracode 2025 |
| **Log Injection** (CWE-117) | 88% | 🟡 Medium | Veracode 2025 |
| **Missing Input Validation** | 70%+ | 🔴 High | StackHawk 2025 |
| **Weak Authentication** | Frequent | 🔴 Critical | Multiple |
| **SQL Injection** | Moderate | 🔴 Critical | Semgrep 2025 |
| **Insecure Defaults** | Very frequent | 🟡 Medium | Dark Reading 2025 |
| **Path Traversal** | 34% (Sonnet 4) | 🟠 Medium-High | ArXiv 2025 |
| **BLOCKER Bugs** | 13.71% (Sonnet 4) | 🔴 Critical | ArXiv 2025 |

**Overall**: 45% of AI-generated code contains OWASP Top 10 vulnerabilities

---

## 🔴 ANTI-PATTERN CATALOG

### ANTI-PATTERN 1: Placeholder Authentication

**AI Pattern**: Generate auth function with TODO, never implement

**Example in Izzico** (CORRECTED):
```sql
-- BEFORE (VULN-002):
CREATE FUNCTION verify_user_password(p_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- TODO: Implement real password check
  -- This function just serves as a gate that can be extended
  RETURN TRUE; -- ❌ BLOCKER: Always returns TRUE!
END;
$$;

-- AFTER (FIXED):
CREATE FUNCTION verify_user_password(p_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Actually checks for recent password verification
  RETURN has_valid_password_verification(300);
END;
$$;
```

**Detection**:
- Search for `return true` or `return false` in auth functions
- Look for TODO/FIXME in security-critical code
- Functions named verify/check/validate that don't actually verify

**Prevention**:
- Never accept placeholders in auth code
- Demand explicit prompt: "Implement REAL password verification using Supabase Auth"

---

### ANTI-PATTERN 2: Fast Hashing for Passwords

**AI Pattern**: Use SHA256/MD5 instead of bcrypt for passwords

**Example in Izzico** (CORRECTED):
```sql
-- BEFORE (VULN-001):
pin_hash := encode(sha256(pin_code::bytea), 'hex');
-- ❌ SHA256 is TOO FAST (10 billion/sec on GPU)
-- 6-digit PIN cracked in < 1 second

-- AFTER (FIXED):
pin_hash_bcrypt := crypt(pin_code, gen_salt('bf', 10));
-- ✅ bcrypt with cost factor 10
-- Same PIN takes 27+ hours to crack
```

**Why AI makes this mistake**:
- Training data has many "hash a string" examples using SHA256
- AI doesn't distinguish between "hash for integrity" vs "hash for passwords"
- SHA256 is simpler/faster to implement

**Detection**:
- Search for: `sha256(password)`, `md5(password)`, `hashlib`
- Check: Functions named `hashPassword` using wrong algorithm

**Prevention**:
- Always specify: "Hash password with bcrypt, cost factor 10"
- Never say just: "Hash this password"

---

### ANTI-PATTERN 3: Missing Input Validation

**AI Pattern**: Accept user input without validation (70%+ failure rate)

**Example in Izzico** (UNFIXED):
```typescript
// app/api/matching/matches/route.ts
const limit = parseInt(searchParams.get('limit') || '20');
const offset = parseInt(searchParams.get('offset') || '0');

// ❌ No min/max validation
// Attack: ?limit=999999999 → DoS (massive query)
// Attack: ?offset=-1 → SQL error
```

**Why AI makes this mistake**:
- AI prioritizes "make it work" over "make it safe"
- Validation adds boilerplate → skipped for speed
- Happy path coded first, validation never added

**Detection**:
- Search for: `parseInt()`, `parseFloat()`, `JSON.parse()` without try/catch
- Look for: `request.json()`, `searchParams.get()` used directly
- Check: No Zod schema imports in API routes

**Prevention**:
- Always specify: "Validate ALL inputs with Zod schema"
- Demand: "Enforce min/max, whitelist enums, regex patterns"

---

### ANTI-PATTERN 4: Log Injection

**AI Pattern**: Log user input directly without sanitization (88% failure rate)

**Example in Izzico** (UNFIXED):
```typescript
// middleware.ts
console.warn(`[SECURITY] Session timeout for user ${user.id} on ${pathname}`);

// ❌ If pathname = "/admin\n[ADMIN] Backdoor access granted"
// Log becomes:
// [SECURITY] Session timeout for user abc123 on /admin
// [ADMIN] Backdoor access granted ← FORGED LOG
```

**Why AI makes this mistake**:
- Logging is seen as "debugging" (not security boundary)
- Training data rarely shows sanitized logs
- Performance impact of sanitization not considered worth it

**Detection**:
- Search for: `console.log(`, `console.warn(`, `logger.info(`
- Check: Any user-controlled variables in log strings
- Look for: Template literals with ${} containing external data

**Prevention**:
- Create sanitizeLog() utility
- Always use: `console.log(sanitizeLog(userInput))`

---

### ANTI-PATTERN 5: Insecure Defaults

**AI Pattern**: Development-friendly configs that go to production

**Examples in Izzico** (UNFIXED):
```typescript
// lib/security/admin-protection.ts
const IP_ALLOWLIST_ENABLED = false; // ❌ Should default true

// next.config.mjs
'Access-Control-Allow-Origin': '*' // ❌ Should restrict domains

// lib/ratelimit.ts
Ratelimit.slidingWindow(10, '10 s') // ❌ Too permissive (should be 5/min)
```

**Why AI makes this mistake**:
- "Make it work in dev" mentality
- Permissive configs = less friction during development
- Forgets to tighten for production

**Detection**:
- Search for: `= true`, `= false`, `= '*'` in security configs
- Look for: Hardcoded numbers in rate limits
- Check: No environment variable usage

**Prevention**:
- Demand: "Use secure-by-default configs"
- Always use: `process.env.FEATURE_ENABLED === 'true'`
- Document secure defaults in .env.example

---

### ANTI-PATTERN 6: Path Traversal Vulnerability

**AI Pattern**: Concatenate user input to file paths (34% Sonnet 4 failure)

**Example** (PARTIALLY MITIGATED by RLS):
```typescript
// app/api/documents/upload/route.ts
const filePath = `${userId}/${fileName}`;

// ❌ If fileName = "../../admin/secrets.pdf"
// Path becomes: userId/../../admin/secrets.pdf → /admin/secrets.pdf
```

**Why AI makes this mistake**:
- Path operations seem "simple"
- Doesn't consider ../ escalation
- Trusts framework (Supabase RLS) without defense-in-depth

**Detection**:
- Search for: String concatenation with `/`
- Look for: `path.join()` without validation
- Check: No `path.basename()` or `path.normalize()` used

**Prevention**:
- Always use: `path.basename(fileName)` to strip directories
- Check: Normalized path stays within base directory
- Validate: No `..` sequences allowed

---

### ANTI-PATTERN 7: Verbose Error Messages

**AI Pattern**: Return full error details to users (information disclosure)

**Example**:
```typescript
catch (error) {
  return Response.json({
    error: error.message, // ❌ Exposes: "relation 'secret_table' does not exist"
    query: sqlQuery, // ❌ Leaks DB structure
    stack: error.stack // ❌ Reveals file paths, dependencies
  }, { status: 500 });
}
```

**Why AI makes this mistake**:
- Helpful during development (detailed errors)
- Training data often shows verbose error handling
- Doesn't consider information disclosure risk

**Detection**:
- Search for: `error.message`, `error.stack` in Response.json
- Look for: SQL queries, table names in error returns
- Check: Errors that differ based on user existence (username enumeration)

**Prevention**:
- Return generic: "Unable to process request"
- Log detailed errors internally only
- Use: `console.error('[INTERNAL]', error)` + generic response

---

### ANTI-PATTERN 8: Trust Framework Without Defense-in-Depth

**AI Pattern**: Assume framework handles security completely

**Examples**:
```
❌ "React auto-escapes, no XSS possible" → Forgets about DOM APIs
❌ "Supabase RLS active, no validation needed" → Forgets about DoS
❌ "Next.js handles CSRF" → FALSE, no automatic CSRF protection
❌ "HTTPS = encrypted" → Forgets about logging, caching, proxies
```

**Why AI makes this mistake**:
- Frameworks DO provide security features
- AI over-generalizes their protection scope
- Doesn't implement defense-in-depth

**Detection**:
- Missing validation despite RLS
- No CSRF tokens (Next.js doesn't provide automatically)
- Sensitive data in URLs (logged despite HTTPS)

**Prevention**:
- Demand: "Implement defense-in-depth"
- Multiple layers: Framework + validation + RLS + encryption
- Never rely on single security mechanism

---

## 🎯 CHECKLIST TEMPLATES BY FEATURE

### API Route Checklist
```
□ Input validation (Zod schema)
□ Authentication check (auth.uid())
□ Authorization check (RLS or manual)
□ Rate limiting configured
□ Error messages generic
□ Audit logging present
□ No SQL string concatenation
□ CORS headers appropriate
```

### Database Function Checklist
```
□ SECURITY DEFINER only if needed
□ SET search_path = public
□ Parameters used (NOT string concatenation)
□ RLS policies defined
□ Input validation in PL/pgSQL
□ Audit triggers for sensitive tables
□ No dynamic SQL execution
□ Comments explain security model
```

### Sensitive Data Checklist
```
□ Encryption at rest (Supabase Vault)
□ Encryption in transit (HTTPS enforced)
□ Password re-verification required
□ 24h cooldown for changes
□ Audit logging (IP + UA)
□ No plaintext storage
□ Masked display (BE** **** 7034)
□ Access logged in audit_logs
```

### File Operation Checklist
```
□ File type whitelist (NOT blacklist)
□ File size limit enforced
□ Filename sanitized (basename + alphanumeric)
□ Path traversal protection (no ..)
□ Virus scanning (if production)
□ Storage RLS policies
□ CDN for public files
□ No execution of uploaded files
```

---

## 📈 VERSION HISTORY

### v1.0 - January 18, 2026
- Initial catalog based on Izzico security audit
- 8 anti-patterns documented
- Sources: Veracode, Dark Reading, Checkmarx, ArXiv
- Found in Izzico: VULN-001 to VULN-009

### Future additions
- WebSocket security patterns
- GraphQL-specific vulnerabilities
- Serverless security patterns
- Container/Docker security
- CI/CD pipeline security

---

## 📚 RESEARCH SOURCES

1. **Veracode: AI-Generated Code Security Risks (2025)**
   - URL: https://www.veracode.com/blog/ai-generated-code-security-risks/
   - Key stat: 45% AI code contains OWASP Top 10 vulnerabilities

2. **Veracode: GenAI Code Security Report (2025)**
   - URL: https://www.veracode.com/blog/genai-code-security-report/
   - Key stats: XSS 86% fail, Log injection 88% fail

3. **Dark Reading: Claude Code Security Reviews (2025)**
   - URL: https://www.darkreading.com/application-security/do-claude-code-security-reviews-pass-vibe-check
   - Key finding: "Relatively easy to trick, even by accident"

4. **Checkmarx: Bypassing Claude Security Reviews (2025)**
   - URL: https://checkmarx.com/zero-post/bypassing-claude-code-how-easy-is-it-to-trick-an-ai-security-reviewer/
   - Key finding: Payload splitting bypasses detection

5. **UpGuard: YOLO Mode Risks (2025)**
   - URL: https://www.upguard.com/blog/yolo-mode-hidden-risks-in-claude-code-permissions
   - Key stat: 20% users allow unchecked git pushes

6. **ArXiv: AI Code Quality Assessment (2025)**
   - URL: https://arxiv.org/html/2508.14727v1
   - Key stat: Claude Sonnet 4 BLOCKER bugs 13.71% (vs 7.1% Sonnet 3.7)

---

**This is a living document** - update as new patterns emerge
