# Étape 2: PLAN

**Objectif**: Créer un plan détaillé avant l'implémentation.

## Actions Requises

### 2.1 Définir les Acceptance Criteria

Liste les critères qui définiront le succès:

```markdown
## Acceptance Criteria

### Fonctionnels
- [ ] [Critère 1 - Ce que la feature DOIT faire]
- [ ] [Critère 2 - Comportement attendu]
- [ ] [Critère 3 - Edge cases à gérer]

### Non-Fonctionnels
- [ ] Performance: [temps de réponse acceptable]
- [ ] Accessibilité: [WCAG AA minimum]
- [ ] Mobile: [responsive behavior]
- [ ] Sécurité: [validations nécessaires]

### Conformité Izzico
- [ ] Colors: Utilise les couleurs du rôle [TARGET_ROLE]
- [ ] Voice: Respecte le ton [segment] (tutoiement, pas d'emoji)
- [ ] Design: V3-fun (rounded, gradients, animations)
```

### 2.2 Planifier l'Architecture

Définis la structure:

```markdown
## Architecture

### Nouveaux Fichiers à Créer
1. `[path/file.tsx]` - [description et responsabilité]
2. `[path/file.ts]` - [description et responsabilité]

### Fichiers à Modifier
1. `[path/existing.tsx]` - [modifications prévues]

### API Routes (si besoin)
1. `app/api/[route]/route.ts` - [méthode, purpose]

### Migrations DB (si besoin)
1. `supabase/migrations/XXX_[description].sql` - [changements]
```

### 2.3 Identifier les Risques

```markdown
## Risques et Mitigations

| Risque | Probabilité | Impact | Mitigation |
|--------|-------------|--------|------------|
| [Risque 1] | [H/M/L] | [H/M/L] | [Comment éviter] |
| [Risque 2] | [H/M/L] | [H/M/L] | [Comment éviter] |
```

### 2.4 Créer le Plan d'Implémentation

```markdown
## Plan d'Implémentation

### Phase 1: [Nom]
- [ ] Tâche 1.1
- [ ] Tâche 1.2

### Phase 2: [Nom]
- [ ] Tâche 2.1
- [ ] Tâche 2.2

### Phase 3: [Nom]
- [ ] Tâche 3.1
- [ ] Tâche 3.2
```

## Validation Utilisateur

**Si AUTO_MODE = false**:

Présente le plan à l'utilisateur:

```
★ Plan d'Implémentation ──────────────────────────

Feature: [FEATURE_DESCRIPTION]
Rôle cible: [TARGET_ROLE]

Acceptance Criteria: X critères
Fichiers à créer: Y
Fichiers à modifier: Z
Risques identifiés: W

[Affiche le résumé du plan]

Souhaites-tu:
1. Valider et continuer
2. Modifier le plan
3. Poser des questions

──────────────────────────────────────────────────
```

**Si AUTO_MODE = true**:
Continue automatiquement à l'exécution.

## Next Step

**Étape suivante**: Lis et exécute `.claude/workflows/izzico-feature/steps/03-execute.md`
