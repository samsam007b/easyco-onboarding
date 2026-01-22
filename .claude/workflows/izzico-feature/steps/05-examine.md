# Étape 5: EXAMINE

**Objectif**: Self-review du code avec les reviewers spécialisés Izzico.

## Reviews à Exécuter

### 5.1 Design Review (V3-fun)

**Lis et applique**: `.claude/workflows/izzico-feature/reviews/design-v3fun-review.md`

Vérifie:
- [ ] Couleurs du rôle correctes
- [ ] Gradients signature utilisés
- [ ] Rounded corners (2xl, 3xl)
- [ ] Shadows soft
- [ ] Animations Framer Motion appropriées
- [ ] Responsive mobile-first
- [ ] Composants UI existants utilisés

### 5.2 RGPD & Security Review

**Lis et applique**: `.claude/workflows/izzico-feature/reviews/rgpd-security-review.md`

Vérifie:
- [ ] Pas de données sensibles exposées
- [ ] RLS policies appropriées
- [ ] Validation des inputs (Zod)
- [ ] Pas de log injection
- [ ] Authentification vérifiée
- [ ] Consentement si collecte de données
- [ ] Droit à l'oubli possible

### 5.3 Voice Guidelines Review

**Lis et applique**: `.claude/workflows/izzico-feature/reviews/voice-guidelines-review.md`

Vérifie:
- [ ] Tutoiement (pas de "vous" sauf pages légales)
- [ ] Termes Izzico ("co-living", "Living Persona", "Living Match")
- [ ] Pas d'emojis
- [ ] Ton approprié au segment
- [ ] Pas de corporate speak
- [ ] Salutations correctes

## Collecte des Findings

Pour chaque review, collecte les issues dans ce format:

```markdown
## Examine Findings

### Design Issues
| ID | Sévérité | Fichier:Ligne | Issue | Fix Suggéré |
|----|----------|---------------|-------|-------------|
| D-1 | HIGH | [file:line] | [problème] | [correction] |
| D-2 | MEDIUM | [file:line] | [problème] | [correction] |

### RGPD/Security Issues
| ID | Sévérité | Fichier:Ligne | Issue | Fix Suggéré |
|----|----------|---------------|-------|-------------|
| S-1 | CRITICAL | [file:line] | [problème] | [correction] |
| S-2 | HIGH | [file:line] | [problème] | [correction] |

### Voice Issues
| ID | Sévérité | Fichier:Ligne | Issue | Fix Suggéré |
|----|----------|---------------|-------|-------------|
| V-1 | MEDIUM | [file:line] | [problème] | [correction] |
| V-2 | LOW | [file:line] | [problème] | [correction] |
```

## Rapport d'Examination

```
★ Examine Report ─────────────────────────────────

Feature: [FEATURE_DESCRIPTION]

Reviews Completed:
- Design V3-fun: [X issues]
- RGPD/Security: [Y issues]
- Voice Guidelines: [Z issues]

Issues by Severity:
🔴 CRITICAL: X
🟠 HIGH: Y
🟡 MEDIUM: Z
🟢 LOW: W

Total Issues: X+Y+Z+W

Recommendation:
- CRITICAL/HIGH issues: MUST fix before deploy
- MEDIUM issues: SHOULD fix
- LOW issues: CAN fix later

──────────────────────────────────────────────────
```

## Next Step

**Si issues CRITICAL ou HIGH trouvées**:
→ Lis et exécute `.claude/workflows/izzico-feature/steps/06-resolve.md`

**Si seulement issues MEDIUM/LOW ou aucune issue**:
- Si TEST_MODE = true → `.claude/workflows/izzico-feature/steps/07-test.md`
- Si PR_MODE = true → `.claude/workflows/izzico-feature/steps/08-pr.md`
- Sinon → Workflow terminé
