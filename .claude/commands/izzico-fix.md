---
name: izzico-fix
description: "Workflow Apex pour debugger et résoudre les bugs avec analyse systématique"
args:
  - name: description
    description: "Description du bug ou comportement inattendu"
    required: true
  - name: A
    description: "Mode Auto - applique les fixes sans validation"
    type: boolean
    default: false
  - name: max
    description: "Nombre maximum de tentatives de fix"
    type: number
    default: 5
---

# Workflow Izzico Fix (Apex Debug Method)

Tu utilises le **workflow Apex Debug** adapté pour Izzico. Ce workflow garantit une résolution systématique des bugs en analysant méthodiquement avant de corriger.

## Variables de Session

```
BUG_DESCRIPTION: $ARGUMENTS.description
AUTO_MODE: $ARGUMENTS.A
MAX_ATTEMPTS: $ARGUMENTS.max
CURRENT_ATTEMPT: 1
CURRENT_STEP: init
```

## Architecture du Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    IZZICO FIX WORKFLOW                       │
├─────────────────────────────────────────────────────────────┤
│  Paramètres: -A (auto) --max [N] (tentatives)               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 1. ANALYZE  │───▶│ 2. DIAGNOSE │───▶│ 3. PROPOSE  │
└─────────────┘    └─────────────┘    └─────────────┘
                                             │
                                       [Si pas -A]
                                       Validation user
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │   4. FIX    │
                                      └─────────────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │  5. VERIFY  │
                                      └──────┬──────┘
                                             │
                                   ┌─────────┴─────────┐
                                   │                   │
                                 [PASS]              [FAIL]
                                   │                   │
                                   ▼                   ▼
                               ✅ DONE        ┌───────────────┐
                                              │ ATTEMPT < MAX │
                                              └───────┬───────┘
                                                      │
                                              ┌───────┴───────┐
                                              │               │
                                            [YES]           [NO]
                                              │               │
                                              ▼               ▼
                                      Retour ANALYZE    ⚠️ ESCALATE
```

## Étapes du Workflow

### Étape 1: ANALYZE
Comprendre le contexte du bug.

**Actions**:
1. Reproduire le bug mentalement (comprendre les étapes)
2. Identifier les fichiers potentiellement impliqués
3. Chercher les logs d'erreur existants
4. Vérifier si c'est un bug connu dans `bugs-registry.md`

**Output**:
```markdown
## Analyse du Bug

**Description**: [BUG_DESCRIPTION]
**Reproductible**: [Oui/Non/Incertain]

### Fichiers Suspects
- [file1.tsx] - [pourquoi suspect]
- [file2.ts] - [pourquoi suspect]

### Logs/Erreurs Trouvés
- [erreur 1]
- [erreur 2]

### Hypothèses Initiales
1. [Hypothèse 1]
2. [Hypothèse 2]
```

### Étape 2: DIAGNOSE
Trouver la cause racine.

**Actions**:
1. Lire les fichiers suspects
2. Tracer le flux de données/logique
3. Identifier le point de défaillance exact
4. Comprendre POURQUOI ça échoue

**Techniques de diagnostic**:
- Analyse statique du code
- Recherche de patterns connus qui causent ce type de bug
- Vérification des types TypeScript
- Analyse des dépendances

**Output**:
```markdown
## Diagnostic

### Cause Racine Identifiée
**Fichier**: [path/file.tsx:ligne]
**Problème**: [Description précise]

### Explication
[Pourquoi ce code cause le bug]

### Impact
- [Composants affectés]
- [Comportement observé vs attendu]
```

### Étape 3: PROPOSE
Proposer une ou plusieurs solutions.

**Actions**:
1. Générer 1-3 solutions possibles
2. Évaluer chaque solution (effort, risque, complétude)
3. Recommander la meilleure

**Output**:
```markdown
## Solutions Proposées

### Solution 1 (Recommandée)
**Description**: [Ce qu'on fait]
**Effort**: [Faible/Moyen/Élevé]
**Risque**: [Faible/Moyen/Élevé]
**Fichiers à modifier**: [liste]

### Solution 2 (Alternative)
**Description**: [Ce qu'on fait]
**Effort**: [Faible/Moyen/Élevé]
**Risque**: [Faible/Moyen/Élevé]
**Fichiers à modifier**: [liste]
```

**Si AUTO_MODE = false**:
Demande validation de la solution choisie.

**Si AUTO_MODE = true**:
Applique la solution recommandée.

### Étape 4: FIX
Appliquer la correction.

**Actions**:
1. Implémenter la solution choisie
2. Vérifier que le code compile
3. S'assurer que les patterns Izzico sont respectés

**Règles**:
- Fix minimal (pas d'over-engineering)
- Pas de changements non liés au bug
- Commentaire si logique non évidente

### Étape 5: VERIFY
Vérifier que le bug est corrigé.

**Actions**:
1. Build check: `npm run build`
2. Lint check: `npm run lint`
3. Test si applicable: `npm run test`
4. Vérification logique du fix

**Output**:
```markdown
## Vérification

### Build
- Status: [PASS/FAIL]
- Erreurs: [si applicable]

### Lint
- Status: [PASS/FAIL]
- Warnings: [si applicable]

### Tests
- Status: [PASS/FAIL/SKIPPED]
- Tests affectés: [liste]

### Fix Validé
- [x] Le bug est corrigé
- [x] Pas de régression introduite
- [x] Code compile sans erreur
```

## Boucle de Résolution

```
ATTEMPT 1: Analyze → Diagnose → Propose → Fix → Verify
           ↓
        [FAIL] → Nouvelle hypothèse → ATTEMPT 2
           ↓
        [FAIL] → Nouvelle hypothèse → ATTEMPT 3
           ...
        [FAIL après MAX_ATTEMPTS] → ESCALATE
```

**En cas d'échec répété**:
1. Log toutes les tentatives
2. Demande intervention utilisateur
3. Suggère des pistes d'investigation avancées

## Rapport Final

```
★ Fix Report ─────────────────────────────────────

Bug: [BUG_DESCRIPTION]
Status: [FIXED | PARTIALLY FIXED | UNRESOLVED]

Attempts: [CURRENT_ATTEMPT]/[MAX_ATTEMPTS]

Root Cause:
[Explication de la cause]

Fix Applied:
[Description du fix]

Files Modified:
- [file1.tsx] - [changement]
- [file2.ts] - [changement]

Verification:
- Build: [PASS/FAIL]
- Lint: [PASS/FAIL]
- Tests: [PASS/FAIL/SKIPPED]

──────────────────────────────────────────────────
```

## Démarrage

**Commence maintenant** par l'analyse:

1. **Comprends le bug** décrit: `[BUG_DESCRIPTION]`
2. **Identifie les fichiers** potentiellement impliqués
3. **Cherche les erreurs** dans les logs ou le code
4. **Formule des hypothèses** sur la cause

Ensuite, passe au diagnostic pour trouver la cause racine exacte.
