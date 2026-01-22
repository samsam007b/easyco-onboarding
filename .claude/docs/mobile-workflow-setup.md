# Guide: Workflow Mobile Claude

Ce guide explique comment lancer des tâches Claude depuis ton iPhone et recevoir des notifications Telegram.

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   iPhone     │────▶│   GitHub     │────▶│   Claude     │
│  (Issue)     │     │   Actions    │     │   Code       │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                    │
                            │                    │
                            ▼                    ▼
                     ┌──────────────┐     ┌──────────────┐
                     │   Telegram   │◀────│     PR       │
                     │   (Notif)    │     │  (Résultat)  │
                     └──────────────┘     └──────────────┘
```

## Étape 1: Créer un Bot Telegram

### 1.1 Créer le bot

1. Ouvre Telegram et cherche `@BotFather`
2. Envoie `/newbot`
3. Donne un nom: `Izzico Claude Bot`
4. Donne un username: `izzico_claude_bot` (doit finir par `_bot`)
5. **Copie le token** qui ressemble à: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

### 1.2 Obtenir ton Chat ID

1. Envoie un message à ton nouveau bot
2. Va sur: `https://api.telegram.org/bot<TON_TOKEN>/getUpdates`
3. Cherche `"chat":{"id":123456789}` → c'est ton Chat ID

**Alternative plus simple:**
1. Cherche `@userinfobot` sur Telegram
2. Envoie `/start`
3. Il te donnera ton ID

### 1.3 Tester le bot

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -d "chat_id=<CHAT_ID>" \
  -d "text=Test depuis Izzico!"
```

## Étape 2: Configurer les Secrets GitHub

Va dans ton repo GitHub → Settings → Secrets and variables → Actions

Ajoute ces secrets:

| Nom | Valeur |
|-----|--------|
| `ANTHROPIC_API_KEY` | Ta clé API Anthropic |
| `TELEGRAM_BOT_TOKEN` | Le token de ton bot (étape 1.1) |
| `TELEGRAM_CHAT_ID` | Ton Chat ID (étape 1.2) |

## Étape 3: Utilisation depuis iPhone

### Option A: Créer une Issue (Recommandé)

1. Ouvre l'app GitHub sur ton iPhone
2. Va dans ton repo → Issues → New Issue
3. Choisis le template "🤖 Tâche Claude" ou "🚀 Tâche Longue"
4. Remplis le formulaire
5. Crée l'issue

→ Claude démarre automatiquement et tu reçois une notif Telegram quand c'est fini!

### Option B: Commenter @claude

Sur n'importe quelle Issue ou PR existante:

```
@claude peux-tu ajouter un bouton de partage sur cette page?
```

→ Claude répond directement dans les commentaires.

### Option C: Créer une PR

Crée une PR depuis GitHub Mobile, Claude la reviewera automatiquement.

## Workflows Disponibles

### Tâche Standard (30 min max)

- **Label**: `claude-task`
- **Déclencheur**: Création d'issue avec ce label
- **Usage**: Tâches courtes et précises

### Tâche Longue / Ralph Loop (2h max)

- **Labels**: `claude-task` + `claude-long`
- **Déclencheur**: Création d'issue avec ces labels
- **Usage**: Implémentations complexes, refactoring majeur
- **Bonus**: Notification au démarrage + à la fin

### Mention @claude

- **Déclencheur**: Commentaire contenant `@claude`
- **Usage**: Questions rapides, demandes de review

## Exemples de Tâches

### Feature Simple
```markdown
Titre: [Claude] Ajouter bouton de partage profil

Description:
Ajoute un bouton de partage sur la page de profil résident.
- Utiliser les couleurs resident-*
- Position: en haut à droite
- Icône: Lucide "Share2"

Workflow: Apex Feature
Options: ✅ Self-review, ✅ PR automatique
```

### Bug Fix
```markdown
Titre: [Claude] Fix gradient cassé sur mobile

Description:
Le gradient de fond de la page owner ne s'affiche pas sur Safari iOS.
Fichier probable: app/dashboard/owner/page.tsx

Workflow: Apex Fix
```

### Tâche Longue
```markdown
Titre: [Ralph] Implémenter matching V2

Objectif: Refondre le système de matching avec nouvel algorithme

Sous-tâches:
1. Analyser système actuel
2. Créer nouvelles tables
3. Implémenter algorithme
4. Tests unitaires

Contraintes:
- Rétrocompatibilité API
- Performance < 200ms
```

## Notifications Telegram

Tu recevras ces messages:

### Tâche démarrée (longues seulement)
```
🚀 Claude démarre une tâche longue

Issue: #42
Timeout: 2 heures max
Progression: [lien]
```

### Tâche terminée
```
✅ Claude a terminé sa tâche

Repo: user/izzico
Lien: [vers l'issue/PR]
```

### Erreur
```
❌ Claude a rencontré une erreur

Repo: user/izzico
Logs: [vers les logs Actions]
```

## Troubleshooting

### Claude ne démarre pas

1. Vérifie que le label `claude-task` est bien appliqué
2. Vérifie les secrets GitHub (Settings → Secrets)
3. Regarde les logs dans Actions

### Pas de notification Telegram

1. Vérifie que tu as bien envoyé un message au bot d'abord
2. Vérifie le `TELEGRAM_BOT_TOKEN` et `TELEGRAM_CHAT_ID`
3. Teste manuellement avec curl

### Timeout

- Tâches standards: 30 min max
- Tâches longues: 2h max
- Découpe en sous-tâches si besoin

## Coûts

- **GitHub Actions**: 2000 min/mois gratuits (compte perso)
- **Anthropic API**: ~$0.015/1K tokens (Claude Sonnet)
- **Telegram**: Gratuit

## Conseils

1. **Sois précis** dans tes descriptions - Claude lit exactement ce que tu écris
2. **Mentionne "apex"** si tu veux le workflow complet avec reviews
3. **Utilise les labels** pour contrôler le comportement
4. **Check les PR** avant de merge - Claude fait du bon travail mais vérifie toujours
