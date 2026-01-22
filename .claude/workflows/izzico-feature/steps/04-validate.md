# Étape 4: VALIDATE

**Objectif**: Vérifier que tous les acceptance criteria sont respectés.

## Actions Requises

### 4.1 Vérification des Acceptance Criteria

Reprends la liste des critères définis dans l'étape PLAN et vérifie chacun:

```markdown
## Validation des Acceptance Criteria

### Fonctionnels
- [x] [Critère 1] - ✅ Vérifié dans [fichier:ligne]
- [x] [Critère 2] - ✅ Vérifié dans [fichier:ligne]
- [ ] [Critère 3] - ❌ Non implémenté → ACTION REQUISE

### Non-Fonctionnels
- [x] Performance - ✅ [mesure]
- [x] Accessibilité - ✅ [vérification]
- [x] Mobile - ✅ [test responsive]
- [x] Sécurité - ✅ [validation présente]

### Conformité Izzico
- [x] Colors - ✅ Couleurs [rôle] utilisées
- [x] Voice - ✅ Tutoiement, pas d'emoji
- [x] Design - ✅ V3-fun appliqué
```

### 4.2 Vérification Technique

**Build check**:
```bash
npm run build
```
- Pas d'erreurs TypeScript
- Pas de warnings critiques

**Lint check**:
```bash
npm run lint
```
- Pas d'erreurs ESLint

### 4.3 Liste des Fichiers Modifiés

```markdown
## Fichiers Créés/Modifiés

### Nouveaux Fichiers
| Fichier | Lignes | Purpose |
|---------|--------|---------|
| [path/file.tsx] | XX | [description] |

### Fichiers Modifiés
| Fichier | Changements | Purpose |
|---------|-------------|---------|
| [path/file.tsx] | +XX/-YY | [description] |
```

### 4.4 Rapport de Validation

Génère un rapport:

```
★ Validation Report ──────────────────────────────

Feature: [FEATURE_DESCRIPTION]
Status: [PASS | PARTIAL | FAIL]

Acceptance Criteria: X/Y passed
Build: [PASS | FAIL]
Lint: [PASS | FAIL]

Files Changed: Z
Lines Added: +XX
Lines Removed: -YY

Issues Found: W
──────────────────────────────────────────────────
```

## Décision Point

**Si tous les critères passent**:
- Continue vers EXAMINE (si -X activé)
- Ou vers TEST (si -T activé)
- Ou termine le workflow

**Si des critères échouent**:
- Retourne à EXECUTE pour corriger
- Maximum 3 itérations

## Next Step

**Si EXAMINE_MODE = true**:
→ Lis et exécute `.claude/workflows/izzico-feature/steps/05-examine.md`

**Si EXAMINE_MODE = false et TEST_MODE = true**:
→ Lis et exécute `.claude/workflows/izzico-feature/steps/07-test.md`

**Si EXAMINE_MODE = false et TEST_MODE = false et PR_MODE = true**:
→ Lis et exécute `.claude/workflows/izzico-feature/steps/08-pr.md`

**Sinon**:
→ Workflow terminé. Affiche le résumé final.
