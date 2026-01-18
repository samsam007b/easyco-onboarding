---
description: "Lance un Ralph Loop avec rapport Notion automatique pour Izzico"
arguments:
  - name: prompt
    description: "Le prompt de la feature a developper"
    required: true
  - name: max_iterations
    description: "Nombre max d'iterations (defaut: 25)"
    required: false
    default: "25"
  - name: completion_promise
    description: "Promise de completion (defaut: TASK COMPLETE)"
    required: false
    default: "TASK COMPLETE"
---

# Ralph Loop Izzico avec Rapport Notion

Tu vas executer une session Ralph Loop pour le projet Izzico avec generation automatique d'un rapport dans Notion.

## Configuration Notion

- **Page parent**: Ralph Loop - Developpement Autonome
- **Page ID**: `2ec98c38-d2a6-819c-9ed6-c1501a261d65`
- **Session MCP**: `load`

## Workflow a suivre

### 1. Demarrage

Lance le Ralph Loop avec le prompt fourni:
```
/ralph-loop "$ARGUMENTS.prompt" --max-iterations $ARGUMENTS.max_iterations --completion-promise "$ARGUMENTS.completion_promise"
```

### 2. Pendant l'execution

Travaille normalement sur la feature en suivant les meilleures pratiques Izzico:
- Respecter le design V3-fun
- Utiliser les couleurs par role (searcher/owner/resident)
- Migrations SQL numerotees
- Tests si applicable

### 3. AVANT d'emettre le promise de completion

**OBLIGATOIRE**: Genere le rapport Notion avec ces etapes:

#### A. Collecter les statistiques
```bash
git diff --stat HEAD~X  # X = nombre de commits de cette session
```

#### B. Creer la sous-page rapport dans Notion

Utilise `NOTION_CREATE_NOTION_PAGE` avec:
- `parent_id`: `2ec98c38-d2a6-819c-9ed6-c1501a261d65`
- `title`: Format `[YYYY-MM-DD] [NOM_FEATURE] - [SUCCESS|FAILURE]`
- `icon`: "checkmark" si succes, "x" si echec

#### C. Ajouter le contenu du rapport

Utilise `NOTION_ADD_MULTIPLE_PAGE_CONTENT` avec ces sections:

1. **Callout** - Resume en 1 phrase
2. **Heading 2** - Objectif Initial
   - Copie exacte du prompt
   - Criteres de succes
3. **Heading 2** - Statistiques
   - Tableau avec: iterations, duree, fichiers, lignes, migrations
4. **Heading 2** - Fichiers Modifies
   - Liste a puces de tous les fichiers
5. **Heading 2** - Migrations SQL (si applicable)
   - Nom et description de chaque migration
6. **Heading 2** - Resultat Final
   - Status et details
7. **Heading 2** - Lecons Apprises
   - Ce qui a fonctionne
   - Ce qui a pose probleme

#### D. PUIS emettre le promise

Seulement apres avoir cree le rapport:
```
<promise>$ARGUMENTS.completion_promise</promise>
```

## Exemple de rapport genere

```
Titre: 2026-01-18 Notifications Push - SUCCESS

[Callout] Systeme de notifications push implemente avec succes en 15 iterations.

## Objectif Initial
Prompt: "Implementer un systeme de notifications push..."
Criteres: Notifications visibles, marquage comme lu

## Statistiques
| Metrique | Valeur |
|----------|--------|
| Iterations | 15 |
| Duree | 3h 45m |
| Fichiers crees | 4 |
| Fichiers modifies | 8 |
| Lignes ajoutees | ~450 |
| Migrations SQL | 1 |

## Fichiers Modifies
- lib/services/notification-service.ts (nouveau)
- components/ui/NotificationBell.tsx (nouveau)
- supabase/migrations/XXX_notifications.sql (nouveau)
- app/layout.tsx (modifie)
...

## Resultat Final
SUCCESS - Promise detectee apres 15 iterations
Tests: 12/12 passes
```

## Important

- Ne JAMAIS emettre le promise sans avoir cree le rapport Notion
- Si erreur Notion, noter l'erreur dans les lecons apprises et continuer
- Inclure TOUS les fichiers modifies, meme les petits changements
