# Étape 6: RESOLVE

**Objectif**: Corriger les issues identifiées lors de l'examination.

## Processus de Résolution

### 6.1 Prioriser les Issues

Ordre de résolution:
1. **CRITICAL** - Failles de sécurité, violations RGPD
2. **HIGH** - Bugs fonctionnels, violations design majeures
3. **MEDIUM** - Améliorations importantes
4. **LOW** - Polish, optimisations mineures

### 6.2 Résolution par Catégorie

#### Issues Design (D-*)

Pour chaque issue design:
1. Localise le fichier et la ligne
2. Applique la correction suggérée
3. Vérifie que le fix respecte le design-guide.md
4. Marque comme résolu

```markdown
## Résolution Design

| ID | Status | Action Prise |
|----|--------|--------------|
| D-1 | ✅ FIXED | [description du fix] |
| D-2 | ✅ FIXED | [description du fix] |
```

#### Issues RGPD/Security (S-*)

Pour chaque issue sécurité:
1. Évalue la criticité réelle
2. Applique le fix approprié
3. Vérifie avec le post-code-security-audit
4. Marque comme résolu

```markdown
## Résolution Security

| ID | Status | Action Prise |
|----|--------|--------------|
| S-1 | ✅ FIXED | [description du fix] |
| S-2 | ✅ FIXED | [description du fix] |
```

#### Issues Voice (V-*)

Pour chaque issue voice:
1. Localise le texte problématique
2. Applique la correction selon voice-guidelines.md
3. Vérifie le ton approprié au segment
4. Marque comme résolu

```markdown
## Résolution Voice

| ID | Status | Action Prise |
|----|--------|--------------|
| V-1 | ✅ FIXED | [description du fix] |
| V-2 | ⏭️ DEFERRED | [raison] |
```

### 6.3 Re-Validation

Après toutes les corrections:

1. **Build check**:
   ```bash
   npm run build
   ```

2. **Re-run affected reviews**:
   - Si issues design corrigées → re-check design
   - Si issues security corrigées → re-check security
   - Si issues voice corrigées → re-check voice

### 6.4 Rapport de Résolution

```
★ Resolve Report ─────────────────────────────────

Feature: [FEATURE_DESCRIPTION]

Issues Resolved:
- Design: X/Y fixed
- Security: X/Y fixed
- Voice: X/Y fixed

Total: XX/YY issues resolved (ZZ%)

Deferred Issues: W
- [ID]: [raison du report]

Build Status: [PASS | FAIL]

──────────────────────────────────────────────────
```

## Boucle de Résolution

**Si nouvelles issues introduites** (rare):
- Maximum 2 itérations de resolve
- Après 2 itérations, demande validation utilisateur

**Si toutes les issues CRITICAL/HIGH résolues**:
- Continue le workflow

## Next Step

**Si TEST_MODE = true**:
→ Lis et exécute `.claude/workflows/izzico-feature/steps/07-test.md`

**Si PR_MODE = true**:
→ Lis et exécute `.claude/workflows/izzico-feature/steps/08-pr.md`

**Sinon**:
→ Workflow terminé. Affiche le résumé final.
