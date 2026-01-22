# Étape 7: TEST

**Objectif**: Exécuter les tests et corriger jusqu'au succès.

## Configuration

```
MAX_ATTEMPTS: 5
CURRENT_ATTEMPT: 1
```

## Processus de Test

### 7.1 Identifier les Tests Pertinents

Recherche les tests existants liés à la feature:

```bash
# Tests unitaires
npm run test -- --testPathPattern="[feature-name]"

# Tests E2E si disponibles
npm run test:e2e -- --grep "[feature-name]"
```

### 7.2 Exécuter les Tests

**Attempt [CURRENT_ATTEMPT]/[MAX_ATTEMPTS]**

```bash
# Full test suite
npm run test

# Ou tests spécifiques
npm run test -- [specific-test-file]
```

### 7.3 Analyser les Résultats

**Si tous les tests passent**:
```
✅ All tests passed

Test Suites: X passed, X total
Tests:       Y passed, Y total
Time:        Z.ZZs
```
→ Continue au next step

**Si des tests échouent**:
```
❌ Some tests failed

Failed Tests:
- [test-file.test.ts] - [test name]
  Error: [error message]
  Expected: [expected]
  Received: [received]
```
→ Passe à la résolution

### 7.4 Résoudre les Échecs

Pour chaque test en échec:

1. **Analyse la cause**:
   - Bug dans le code implémenté ?
   - Test obsolète à mettre à jour ?
   - Mock manquant ?

2. **Applique le fix**:
   ```typescript
   // Si bug dans le code:
   // → Corrige le code source

   // Si test obsolète:
   // → Met à jour le test (avec justification)

   // Si mock manquant:
   // → Ajoute le mock approprié
   ```

3. **Re-run les tests**

### 7.5 Boucle de Test

```
ATTEMPT 1: Run tests
           ↓
        [FAIL] → Fix issues → ATTEMPT 2
           ↓
        [FAIL] → Fix issues → ATTEMPT 3
           ↓
        [FAIL] → Fix issues → ATTEMPT 4
           ↓
        [FAIL] → Fix issues → ATTEMPT 5
           ↓
        [FAIL] → STOP: Demande intervention utilisateur
```

### 7.6 Rapport de Test

```
★ Test Report ────────────────────────────────────

Feature: [FEATURE_DESCRIPTION]

Attempts: [CURRENT_ATTEMPT]/[MAX_ATTEMPTS]
Final Status: [PASS | FAIL]

Test Results:
- Passed: X
- Failed: Y
- Skipped: Z

Fixes Applied:
1. [fix 1 description]
2. [fix 2 description]

──────────────────────────────────────────────────
```

## Gestion des Échecs Persistants

**Si MAX_ATTEMPTS atteint et tests toujours en échec**:

```
⚠️ Tests still failing after 5 attempts

Remaining failures:
- [test-file.test.ts]: [error]

Options:
1. Continue sans ces tests (risqué)
2. Skip les tests problématiques (avec justification)
3. Arrêter le workflow pour investigation manuelle

Que souhaites-tu faire ?
```

## Next Step

**Si tests passent et PR_MODE = true**:
→ Lis et exécute `.claude/workflows/izzico-feature/steps/08-pr.md`

**Si tests passent et PR_MODE = false**:
→ Workflow terminé. Affiche le résumé final.
