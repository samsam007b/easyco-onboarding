---
description: "Add newly discovered security patterns to anti-patterns catalog. Use when finding new vulnerability types or false positives."
skillType: security-maintenance
trigger: manual
priority: medium
---

# 🔄 Update Security Patterns

**Use when**:
- New vulnerability discovered in code
- Research published on new AI error patterns
- False positive identified (pattern wrongly flagged)
- Project-specific pattern found (Izzico-only)

**Updates**: `.claude/resources/ai-security-antipatterns.md`

---

## 📝 PATTERN ADDITION WORKFLOW

### Step 1: Document New Pattern

Collect information:

```
□ Pattern name: [Descriptive name]
□ Discovered in: [File:line or research URL]
□ AI failure rate: [X%] or "Unknown"
□ Severity: BLOCKER / HIGH / MEDIUM / LOW
□ Example code: [Vulnerable snippet]
□ Fix: [Corrected code]
□ Detection method: [Grep/manual/tool]
□ Prevention: [How to avoid in future]
```

### Step 2: Categorize Pattern

Determine category:

```
□ Authentication/Authorization
□ Input Validation
□ Encryption/Data Protection
□ Logging/Monitoring
□ File Operations
□ Error Handling
□ Configuration Management
□ Other: [Specify]
```

### Step 3: Add to Anti-Patterns Resource

Format:

```markdown
### ANTI-PATTERN X: [Name]

**Discovered**: [Date] in [Project/Research]
**AI Failure Rate**: [X%] or "Unknown (project-specific)"
**Severity**: 🔴 BLOCKER / 🟠 HIGH / 🟡 MEDIUM / 🟢 LOW
**CWE**: [CWE-XXX] (if applicable)
**OWASP**: [A0X:2025 Category]

**Example** (VULNERABLE):
```[language]
[Bad code example]
```

**Why AI makes this mistake**:
- [Reason 1: Training data bias]
- [Reason 2: Prioritization issue]
- [Reason 3: Complexity]

**Detection**:
- Grep: `[pattern to search]`
- Manual: [What to look for]
- Tool: [Semgrep rule / ESLint rule]

**Fix** (SECURE):
```[language]
[Good code example]
```

**Prevention**:
- User prompt: "[Specific phrasing to avoid issue]"
- Checklist item: "[What to verify]"

**Sources**:
- [Research URL if applicable]
- [Project where discovered]
```

### Step 4: Update Related Skills

If new pattern affects:
- `pre-code-security-check.md` → Add to checklist
- `post-code-security-audit.md` → Add to scan list
- `security-audit-deep.md` → Add to comprehensive audit

**Update format**:
```markdown
#### Check X: [New Pattern Name]

**Reference**: Anti-Pattern #X ([Failure rate]%)

**Search for**:
[Detection method]

**Remediation**:
[Fix template]
```

---

## 🎯 EXAMPLES FROM IZZICO

### Example 1: Placeholder Authentication (Added Jan 2026)

```markdown
### ANTI-PATTERN 2: Placeholder Authentication

**Discovered**: January 18, 2026 in Izzico (VULN-002)
**AI Failure Rate**: Unknown (but BLOCKER severity)
**Severity**: 🔴 BLOCKER
**CWE**: CWE-306 (Missing Authentication)
**OWASP**: A07:2025 - Identification and Authentication Failures

**Example** (VULNERABLE):
```sql
CREATE FUNCTION verify_user_password(p_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- TODO: Implement real verification
  RETURN TRUE; -- Always returns TRUE!
END;
$$;
```

**Why AI makes this mistake**:
- Generates working skeleton first, details later
- "Later" never happens (code goes to production)
- Comments suggest future implementation that doesn't occur

**Detection**:
- Grep: `RETURN TRUE.*verify|RETURN TRUE.*check|RETURN TRUE.*auth`
- Manual: Functions named verify/check/validate with hardcoded returns
- Look for: TODO/FIXME comments in security functions

**Fix** (SECURE):
```sql
CREATE FUNCTION verify_user_password(p_password TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Actually check for recent password verification
  RETURN has_valid_password_verification(300);
END;
$$;
```

**Prevention**:
- User prompt: "Implement REAL password verification using Supabase Auth reauthenticate"
- Checklist: "No hardcoded TRUE/FALSE returns in auth functions"

**Sources**:
- Izzico security audit January 2026
- VULN-002 detailed report
```

---

## 📊 FALSE POSITIVE HANDLING

If pattern wrongly flagged as vulnerable:

### Step 1: Document False Positive

```markdown
### FALSE POSITIVE: [Pattern Name]

**Date**: [When discovered]
**Context**: [Why it's actually safe]
**Example**:
```[language]
[Code that was flagged but is safe]
```

**Reason safe**:
- [Explanation why not vulnerable]
- [Framework/library protection]
- [Context that makes it safe]

**Action**: Remove from auto-scan or add exception
```

### Step 2: Update Scan Rules

Add exception to post-audit skill:

```typescript
// Example: React auto-escape makes this safe
if (isReactComponent && !usesDangerousHTML) {
  skip_xss_check = true; // Framework handles it
}
```

---

## 🔄 PERIODIC REVIEW

**Monthly**: Review anti-patterns catalog for:
- [ ] Outdated information (old research)
- [ ] New research published (update failure rates)
- [ ] Patterns no longer relevant (framework updates)
- [ ] Missing patterns (new vulnerability classes)

**Quarterly**: Run comprehensive scan:
```bash
# Scan entire codebase against all patterns
./scripts/security-scan-all.sh

# Generate report
# Compare to previous quarter
# Track improvement metrics
```

---

## 📈 METRICS TO TRACK

Track effectiveness over time:

```json
{
  "total_patterns": 12,
  "patterns_found_in_code": 6,
  "patterns_fixed": 4,
  "patterns_accepted_risk": 0,
  "patterns_pending": 2,
  "coverage_percentage": 95,
  "last_updated": "2026-01-18"
}
```

**Goals**:
- 100% pattern coverage (all known patterns in catalog)
- <5% false positive rate
- 0 BLOCKER patterns in production code
- <2 weeks to fix HIGH patterns

---

## 🚀 INTEGRATION WITH OTHER TOOLS

### Semgrep Rules

Generate Semgrep rules from anti-patterns:

```yaml
# .semgrep/ai-antipatterns.yml
rules:
  - id: placeholder-auth
    pattern: |
      def $FUNC(...):
        ...
        return True
    message: "Potential placeholder authentication (Anti-Pattern #2)"
    severity: ERROR
    languages: [python]

  - id: weak-hash-password
    pattern: sha256($PASSWORD)
    message: "Weak hashing for password (Anti-Pattern #4)"
    severity: ERROR
```

### Pre-commit Hooks

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run pattern detection
grep -r "RETURN TRUE" supabase/migrations/ | grep -i verify && {
  echo "❌ BLOCKER: Placeholder auth detected (Anti-Pattern #2)"
  exit 1
}

# More checks...
```

---

**This skill maintains the living catalog of AI security mistakes**
**Ensures continuous learning and improvement**
**Applicable to ALL future projects, not just Izzico**
