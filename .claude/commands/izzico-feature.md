---
name: izzico-feature
description: "Workflow Apex pour implémenter une feature Izzico avec validation, review automatique et conformité design/RGPD/voice"
args:
  - name: description
    description: "Description de la feature à implémenter"
    required: true
  - name: A
    description: "Mode Auto - skip les validations utilisateur"
    type: boolean
    default: false
  - name: X
    description: "Mode Examine - active la self-review du code"
    type: boolean
    default: true
  - name: R
    description: "Mode RGPD - vérifie conformité RGPD/sécurité"
    type: boolean
    default: true
  - name: T
    description: "Mode Test - lance les tests et boucle jusqu'au succès"
    type: boolean
    default: false
  - name: PR
    description: "Mode PR - crée automatiquement une Pull Request"
    type: boolean
    default: false
---

# Workflow Izzico Feature (Apex Method)

Tu utilises le **workflow Apex** adapté pour Izzico. Ce workflow garantit des résultats de haute qualité en chargeant les instructions étape par étape, gardant chaque prompt pertinent et prioritaire dans ton contexte.

## Variables de Session

```
FEATURE_DESCRIPTION: $ARGUMENTS.description
AUTO_MODE: $ARGUMENTS.A
EXAMINE_MODE: $ARGUMENTS.X
RGPD_MODE: $ARGUMENTS.R
TEST_MODE: $ARGUMENTS.T
PR_MODE: $ARGUMENTS.PR
CURRENT_STEP: init
```

## Architecture du Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    IZZICO FEATURE WORKFLOW                   │
├─────────────────────────────────────────────────────────────┤
│  Paramètres: -A (auto) -X (examine) -R (rgpd) -T -PR        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 1. ANALYZE  │───▶│  2. PLAN    │───▶│ 3. EXECUTE  │
└─────────────┘    └─────────────┘    └─────────────┘
                         │                    │
                   [Si pas -A]                │
                   Validation user            │
                              │               ▼
                              │       ┌─────────────┐
                              │       │ 4. VALIDATE │
                              │       └─────────────┘
                              │               │
                              │    ┌──────────┴──────────┐
                              │    │                     │
                              │  [Si -X]              [Si -T]
                              │    ▼                     ▼
                              │ ┌───────┐         ┌──────────┐
                              │ │EXAMINE│         │  TESTS   │
                              │ └───┬───┘         └────┬─────┘
                              │     ▼                  │
                              │ ┌───────┐              │
                              │ │RESOLVE│◀─────────────┘
                              │ └───────┘
                              │     │
                              │   [Si -PR]
                              │     ▼
                              │ ┌───────┐
                              │ │  PR   │
                              │ └───────┘
                              │     │
                              └─────┴─────▶ ✅ DONE
```

## Étapes du Workflow

### Étape 1: ANALYZE
**Action**: Lis `.claude/workflows/izzico-feature/steps/01-analyze.md` et exécute les instructions.

### Étape 2: PLAN
**Action**: Lis `.claude/workflows/izzico-feature/steps/02-plan.md` et exécute les instructions.
- Si `AUTO_MODE = false`: Demande validation utilisateur avant de continuer
- Si `AUTO_MODE = true`: Continue automatiquement

### Étape 3: EXECUTE
**Action**: Lis `.claude/workflows/izzico-feature/steps/03-execute.md` et exécute les instructions.

### Étape 4: VALIDATE
**Action**: Lis `.claude/workflows/izzico-feature/steps/04-validate.md` et exécute les instructions.

### Étape 5: EXAMINE (Si -X activé)
**Action**: Lis `.claude/workflows/izzico-feature/steps/05-examine.md` et exécute les instructions.
- Lance les reviews: Design, RGPD, Voice
- Collecte tous les findings

### Étape 6: RESOLVE (Si findings trouvés)
**Action**: Lis `.claude/workflows/izzico-feature/steps/06-resolve.md` et exécute les instructions.
- Corrige les issues identifiées
- Re-validate si nécessaire

### Étape 7: TEST (Si -T activé)
**Action**: Lis `.claude/workflows/izzico-feature/steps/07-test.md` et exécute les instructions.
- Lance les tests
- Boucle jusqu'au succès (max 5 tentatives)

### Étape 8: PR (Si -PR activé)
**Action**: Lis `.claude/workflows/izzico-feature/steps/08-pr.md` et exécute les instructions.
- Crée la Pull Request avec le bon format

## Règles Critiques

1. **CHARGE UNE SEULE ÉTAPE À LA FOIS** - Ne lis jamais plusieurs fichiers d'étape en même temps
2. **Termine l'étape avant de passer à la suivante**
3. **Utilise les reviews Izzico** pour la validation (design, RGPD, voice)
4. **Respecte le CLAUDE.md** - Le color system et les voice guidelines sont prioritaires

## Démarrage

**Commence maintenant** par lire et exécuter:
→ `.claude/workflows/izzico-feature/steps/01-analyze.md`
