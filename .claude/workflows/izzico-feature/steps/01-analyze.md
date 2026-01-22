# Étape 1: ANALYZE

**Objectif**: Comprendre le contexte existant avant toute modification.

## Actions Requises

### 1.1 Identifier le Rôle Utilisateur

La feature concerne quel segment ?

| Rôle | Identifiant URL | Couleur |
|------|-----------------|---------|
| Searcher | `/searcher/*`, `/hub/*` (searcher view) | Yellow/Gold |
| Owner | `/owner/*`, `/hub/*` (owner view) | Mauve/Purple |
| Resident | `/resident/*`, `/hub/*` (resident view) | Orange/Coral |
| Multi-rôle | Pages communes | Neutre (gray) |

**Stocke**: `TARGET_ROLE = [searcher|owner|resident|multi]`

### 1.2 Explorer le Code Existant

Lance des agents d'exploration en parallèle:

**Agent 1 - Structure**:
- Trouve les fichiers existants liés à la feature
- Identifie les patterns utilisés (composants, hooks, API routes)

**Agent 2 - Dépendances**:
- Identifie les composants UI réutilisables dans `components/ui/`
- Trouve les hooks existants dans `lib/hooks/`
- Vérifie les types dans `lib/types/`

**Agent 3 - Database**:
- Vérifie si des tables/colonnes existent pour cette feature
- Identifie les RLS policies pertinentes

### 1.3 Vérifier les Guidelines

Lis et note les règles applicables:

1. **Color System** (OBLIGATOIRE si UI):
   - Consulte `brand-identity/izzico-color-system.html`
   - Note les couleurs du rôle identifié

2. **Voice Guidelines** (OBLIGATOIRE si texte user-facing):
   - Consulte `brand-identity/izzico-voice-guidelines.md`
   - Note le ton approprié au segment

3. **Design V3-fun** (OBLIGATOIRE si UI):
   - Rounded corners (`rounded-2xl`, `rounded-3xl`)
   - Gradients par rôle
   - Animations Framer Motion

### 1.4 Documenter le Contexte

Crée un résumé structuré:

```markdown
## Analyse de Contexte

**Feature**: [Description]
**Rôle cible**: [searcher|owner|resident|multi]

### Fichiers Existants Pertinents
- [fichier1.tsx] - [description]
- [fichier2.ts] - [description]

### Composants Réutilisables
- `components/ui/[composant]` - [usage prévu]

### Tables DB Concernées
- [table] - [colonnes pertinentes]

### Guidelines Applicables
- Color: [couleurs du rôle]
- Voice: [ton, tutoiement, termes]
- Design: [patterns V3-fun à utiliser]
```

## Validation de l'Étape

Avant de passer à l'étape suivante, vérifie:
- [ ] Rôle utilisateur identifié
- [ ] Code existant exploré
- [ ] Guidelines consultées
- [ ] Résumé de contexte créé

## Next Step

**Étape suivante**: Lis et exécute `.claude/workflows/izzico-feature/steps/02-plan.md`
