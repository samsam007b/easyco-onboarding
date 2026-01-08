# Configuration Gemini pour Izzico

Guide complet pour utiliser Gemini 2.0 Flash comme alternative à Claude.

---

## 🔐 Étape 1: Obtenir ta clé API (SÉCURISÉE)

### Créer la clé
1. Va sur https://aistudio.google.com/app/apikey
2. Clique **"Create API Key"**
3. Copie la clé (commence par `AIza...`)

### ⚠️ RÈGLES DE SÉCURITÉ STRICTES

**❌ NE JAMAIS:**
- Partager ta clé dans un chat (Discord, Claude, ChatGPT, etc.)
- Commit la clé dans Git
- La mettre dans un fichier non-gitignored
- L'envoyer par email

**✅ TOUJOURS:**
- La stocker dans `.env.local` (gitignored)
- Utiliser des variables d'environnement
- La révoquer si compromise

---

## 📦 Étape 2A: Installation Continue (VSCode Extension)

### Installation
```bash
# Dans VSCode
Cmd+Shift+X → Recherche "Continue" → Install
# Extension ID: Continue.continue
```

### Configuration avec ta clé API

**Option 1: Via l'interface Continue**
1. Ouvre Continue (Cmd+L)
2. Clique sur l'icône engrenage ⚙️
3. Ajoute Gemini dans les modèles:
   ```json
   {
     "models": [
       {
         "title": "Gemini 2.0 Flash",
         "provider": "gemini",
         "model": "gemini-2.0-flash-exp",
         "apiKey": "${GEMINI_API_KEY}"
       }
     ]
   }
   ```

**Option 2: Fichier de config manuel**
```bash
# Le fichier .continue-config.json a déjà été créé à la racine du projet
# Il utilise ${GEMINI_API_KEY} qui sera lu depuis ton environnement
```

### Définir la variable d'environnement

**Dans .env.local (recommandé pour le projet):**
```bash
echo "GEMINI_API_KEY=ta-nouvelle-cle-ici" >> .env.local
```

**OU dans ton shell (global):**
```bash
# Pour Zsh (macOS par défaut)
echo 'export GEMINI_API_KEY="ta-nouvelle-cle-ici"' >> ~/.zshrc
source ~/.zshrc

# Pour Bash
echo 'export GEMINI_API_KEY="ta-nouvelle-cle-ici"' >> ~/.bashrc
source ~/.bashrc
```

### Vérification
```bash
# Vérifie que la variable est définie
echo $GEMINI_API_KEY
# Doit afficher: AIzaSy...
```

### Utilisation dans VSCode
- **Cmd+L**: Ouvre le chat Continue
- **Cmd+I**: Édits inline (comme Copilot)
- **@file**: Référence un fichier dans le chat
- **@folder**: Référence un dossier entier

---

## 📦 Étape 2B: Script CLI d'audit

Le script `scripts/audit-with-gemini.sh` a été créé pour toi.

### Pré-requis
```bash
# Installe jq (pour parser JSON)
brew install jq

# Vérifie que GEMINI_API_KEY est définie
echo $GEMINI_API_KEY
```

### Utilisation

**Audit complet:**
```bash
./scripts/audit-with-gemini.sh
```

**Sauvegarder le rapport:**
```bash
./scripts/audit-with-gemini.sh > audit-report-$(date +%Y%m%d).txt
cat audit-report-$(date +%Y%m%d).txt
```

### Ce que le script audite:
1. ✅ **Couleurs**: Détecte les classes `amber/yellow/orange` legacy
2. ✅ **Voice Guidelines**: Trouve les emojis, "coloc", corporate speak
3. ✅ **Fonts**: Vérifie que les classes sont sur `<html>`
4. ✅ **Commits**: Review des 5 derniers commits
5. ✅ **Sécurité**: Scan de secrets potentiellement exposés

---

## 🎯 Workflows Recommandés

### Workflow 1: Audit avant de revenir sur Claude
```bash
# Tous les 2-3 jours, ou après avoir travaillé avec un autre outil
./scripts/audit-with-gemini.sh > audit.txt

# Lis le rapport
cat audit.txt

# Fixe les problèmes détectés
# Puis retourne sur Claude pour validation finale
```

### Workflow 2: Review d'une feature avec Continue
```bash
# Dans VSCode
Cmd+L → "Review ma nouvelle feature PaymentModal"

# Continue va:
# 1. Lire le composant
# 2. Vérifier les guidelines Izzico
# 3. Proposer des améliorations
```

### Workflow 3: Refactoring massif
```bash
# Dans Continue (VSCode)
Cmd+L

"Refactore tous les composants dans app/dashboard/
pour remplacer les classes amber-* par searcher-*

Règles:
- Searcher: searcher-* (#ffa000)
- Owner: owner-* (#9c5698)
- Resident: resident-* (#e05747)

@folder app/dashboard"
```

---

## 🔄 Stratégie Multi-Agents

### Quand utiliser quoi:

| Besoin | Outil | Pourquoi |
|--------|-------|----------|
| **Audit complet** | Script Gemini CLI | Gratuit, gros contexte, rapport complet |
| **Dev quotidien** | Continue + Gemini | Intégré VSCode, rapide |
| **Review PR** | GitHub Copilot | Natif GitHub |
| **Architecture** | Claude Code | Meilleur raisonnement |
| **Prototypage rapide** | Continue + Gemini | Génération de code rapide |

### Checklist avant de revenir sur Claude:
```bash
# 1. Audit avec Gemini
./scripts/audit-with-gemini.sh > pre-claude-audit.txt

# 2. Commit tout
git add -A
git commit -m "WIP: Travail avec Gemini/Continue"

# 3. Liste les changements
git log --oneline -10

# 4. Sur Claude, demande:
# "Review ces commits et vérifie la conformité aux guidelines Izzico"
```

---

## 🆘 Troubleshooting

### "GEMINI_API_KEY non définie"
```bash
# Solution rapide (temporaire pour cette session):
export GEMINI_API_KEY="ta-cle-ici"

# Solution permanente:
echo 'export GEMINI_API_KEY="ta-cle-ici"' >> ~/.zshrc
source ~/.zshrc
```

### "curl: (52) Empty reply from server"
→ Ta clé API est invalide ou révoquée. Crée-en une nouvelle.

### Continue ne voit pas la clé
```bash
# Redémarre VSCode après avoir défini GEMINI_API_KEY
# OU lance VSCode depuis le terminal:
code .
```

### Le script audit est lent
→ Normal, Gemini analyse beaucoup de données. Attends 30-60s par section.

---

## 📊 Limites Gratuites Gemini

- **Flash**: 2M tokens/minute, 15 req/min
- **Pro**: 2M tokens/minute, 10 req/min
- **Thinking**: 32k tokens/minute, 2 req/min

→ Largement suffisant pour ton usage quotidien.

---

## 🔒 Si ta clé est compromise

1. **Révoque immédiatement:**
   https://aistudio.google.com/app/apikey → 🗑️

2. **Crée une nouvelle clé**

3. **Update partout:**
   ```bash
   # Mise à jour .env.local
   sed -i '' 's/GEMINI_API_KEY=.*/GEMINI_API_KEY=nouvelle-cle/' .env.local

   # Mise à jour shell
   sed -i '' 's/GEMINI_API_KEY=.*/GEMINI_API_KEY="nouvelle-cle"/' ~/.zshrc
   source ~/.zshrc
   ```

4. **Check Git history:**
   ```bash
   # Vérifie que l'ancienne clé n'est pas committée
   git log -p | grep -i "AIza"

   # Si trouvée, utilise BFG Repo-Cleaner ou git-filter-repo
   ```

---

## ✅ Checklist Installation Complète

- [ ] Clé API créée sur Google AI Studio
- [ ] Clé stockée dans `.env.local` (vérifie `.gitignore`)
- [ ] Variable exportée dans `~/.zshrc` ou `~/.bashrc`
- [ ] Continue installé dans VSCode
- [ ] Continue configuré avec Gemini
- [ ] `jq` installé (`brew install jq`)
- [ ] Script audit testé: `./scripts/audit-with-gemini.sh`
- [ ] Clé API JAMAIS partagée dans un chat/commit

---

**Prochaine étape:** Lance ton premier audit !
```bash
./scripts/audit-with-gemini.sh
```
