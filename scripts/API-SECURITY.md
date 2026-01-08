# 🔐 Bonnes Pratiques - Sécurité des Clés API

Guide de référence pour gérer les clés API de manière sécurisée.

---

## ❌ CE QUI VIENT DE SE PASSER (et pourquoi c'est grave)

Tu as partagé ta clé API Gemini dans notre conversation Claude Code.

### Pourquoi c'est un problème:
1. **Historique persistant**: Cette conversation est stockée avec la clé visible
2. **Accès non autorisé**: N'importe qui avec accès à cet historique peut utiliser ta clé
3. **Quota consumé**: Quelqu'un pourrait épuiser ton quota gratuit
4. **Tracking**: Les requêtes API sont liées à ton compte Google

### Actions prises:
✅ Clé révoquée immédiatement
✅ Nouvelle clé créée
✅ Configuration sécurisée mise en place

---

## 🛡️ Règles d'Or - Clés API

### 1. **NE JAMAIS partager dans:**
- ❌ Chats (Claude, ChatGPT, Discord, Slack, etc.)
- ❌ Emails
- ❌ Screenshots
- ❌ Commits Git
- ❌ Issues GitHub publiques
- ❌ Documentation partagée (Notion, Google Docs)
- ❌ Code non-gitignored

### 2. **TOUJOURS stocker dans:**
- ✅ `.env.local` (gitignored)
- ✅ Variables d'environnement système (`~/.zshrc`)
- ✅ Gestionnaire de secrets (Vercel, GitHub Secrets)
- ✅ Gestionnaires de mots de passe (1Password, Bitwarden)

### 3. **Format sécurisé dans le code:**
```typescript
// ✅ BON - Variable d'environnement
const apiKey = process.env.GEMINI_API_KEY;

// ❌ MAUVAIS - Clé en dur
const apiKey = "AIzaSyBxjemu_DxDbaHgKLWGDtcdNrPCoqBKx-w";
```

---

## 📁 Structure Recommandée - Izzico

### Fichiers de configuration
```
projet/
├── .env.local              # ✅ Gitignored, secrets locaux
├── .env.example            # ✅ Committé, template SANS valeurs
├── .gitignore              # ✅ Contient `.env*`
└── scripts/
    └── .env.scripts        # ✅ Gitignored, secrets pour scripts
```

### `.env.local` (JAMAIS committé)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Gemini (pour scripts/Continue)
GEMINI_API_KEY=AIzaSy...

# Sentry
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### `.env.example` (Committé comme template)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key

# Gemini (optionnel - pour scripts/Continue)
GEMINI_API_KEY=your-gemini-key

# Sentry
SENTRY_DSN=your-sentry-dsn
```

---

## 🚨 Que Faire si une Clé est Compromise

### Checklist d'urgence:

#### 1. **Révocation immédiate**
```bash
# Gemini
https://aistudio.google.com/app/apikey → 🗑️

# Supabase
https://supabase.com/dashboard/project/xxx/settings/api → Reset

# Stripe
https://dashboard.stripe.com/apikeys → Delete
```

#### 2. **Vérifier l'historique Git**
```bash
# Cherche des clés committées par accident
git log -p | grep -E "AIza|sk_live|sk_test|eyJhbG"

# Si trouvé, nettoyage obligatoire (voir section suivante)
```

#### 3. **Créer de nouvelles clés**
- Génère de nouvelles clés sur chaque service
- Update `.env.local`
- Redéploie sur Vercel si production affectée

#### 4. **Notifications**
- Vérifie les logs d'usage (API calls inhabituelles?)
- Change le mot de passe du compte si nécessaire

---

## 🧹 Nettoyer une Clé Committée (Git History)

### Si tu as accidentellement committé une clé:

#### Option 1: Utiliser BFG Repo-Cleaner (recommandé)
```bash
# Installation
brew install bfg

# Backup
git clone --mirror https://github.com/ton-user/izzico.git izzico-backup

# Nettoie toutes les clés API du type Gemini
bfg --replace-text passwords.txt izzico.git

# passwords.txt contient:
# AIzaSyBxjemu_DxDbaHgKLWGDtcdNrPCoqBKx-w==[REMOVED]

# Force push (DANGER)
cd izzico.git
git reflog expire --expire=now --all && git gc --prune=now --aggressive
git push --force
```

#### Option 2: Utiliser git-filter-repo
```bash
# Installation
brew install git-filter-repo

# Nettoie un pattern
git filter-repo --replace-text passwords.txt

# Force push
git push --force --all
```

**⚠️ WARNING**: Le force push réécrit l'historique. Coordonne avec ton équipe !

---

## 🎓 Types de Clés - Niveau de Risque

| Type | Exemple | Risque | Rotation |
|------|---------|--------|----------|
| **API Key publique** | `NEXT_PUBLIC_SUPABASE_URL` | 🟢 Faible | Rarement |
| **Anon Key** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 🟡 Moyen | Annuellement |
| **Service Role** | `SUPABASE_SERVICE_ROLE_KEY` | 🔴 CRITIQUE | Immédiat si exposé |
| **Stripe Secret** | `sk_live_xxx` | 🔴 CRITIQUE | Immédiat si exposé |
| **Gemini/OpenAI** | `AIzaSy...` / `sk-proj-...` | 🟡 Moyen | Immédiat si partagé |

### Clés "NEXT_PUBLIC_*"
- Exposées dans le bundle frontend (normales)
- Protégées par RLS/CORS/rate limiting côté serveur
- Risque faible SI les policies backend sont solides

### Clés secrètes (SERVICE_ROLE, sk_live, etc.)
- ❌ NE DOIVENT JAMAIS être dans le code client
- ✅ Utilisées uniquement côté serveur (API routes, edge functions)
- 🔴 Exposition = accès admin complet

---

## 🔍 Audit de Sécurité - Checklist

### Avant chaque commit:
```bash
# 1. Scan de secrets avec gitleaks
brew install gitleaks
gitleaks detect --source . --verbose

# 2. Vérification manuelle
git diff --cached | grep -E "API_KEY|SECRET|PASSWORD|TOKEN"

# 3. Review des fichiers staged
git status
# Vérifie qu'aucun .env n'est staged
```

### Audit mensuel:
```bash
# 1. Liste toutes les variables d'env
cat .env.local

# 2. Vérifie .gitignore
cat .gitignore | grep env

# 3. Check les clés actives
# - Gemini: https://aistudio.google.com/app/apikey
# - Supabase: Dashboard → Settings → API
# - Stripe: Dashboard → Developers → API keys

# 4. Rotation des clés anciennes (> 6 mois)
```

---

## 📚 Ressources - Sécurité

### Outils recommandés
- **gitleaks**: Scan de secrets dans Git → https://github.com/gitleaks/gitleaks
- **truffleHog**: Détection de secrets → https://github.com/trufflesecurity/trufflehog
- **1Password CLI**: Gestion sécurisée → https://developer.1password.com/docs/cli

### GitHub Security
- **GitHub Secret Scanning**: Auto-détecte les clés commitées
- **Dependabot Alerts**: Vulnérabilités dans les deps
- **Branch Protection**: Prévient les force push accidentels

### Vercel Best Practices
```bash
# Variables d'environnement Vercel
# Dashboard → Settings → Environment Variables

# ✅ Bon: Secrets dans Vercel, pas dans .env.local committé
# ✅ Bon: Variables différentes par environnement (dev/preview/prod)
# ✅ Bon: Rotation régulière des secrets production
```

---

## ✅ Checklist Finale - Izzico

Configuration actuelle à vérifier:

- [ ] `.env.local` existe et contient toutes les clés
- [ ] `.env.local` est dans `.gitignore` (ligne 12: `.env*`)
- [ ] `.env.example` existe pour l'onboarding
- [ ] Aucune clé en dur dans `app/`, `components/`, `lib/`
- [ ] Git history clean (pas de clés committées)
- [ ] Variables Vercel configurées (production)
- [ ] Clés Gemini stockée seulement dans `.env.local` ou `~/.zshrc`
- [ ] Continue VSCode configuré avec `${GEMINI_API_KEY}`
- [ ] Toutes les clés actives documentées (où, pourquoi, rotation)

---

## 🆘 Contacts d'Urgence

Si tu détectes un problème de sécurité:

1. **Révoque la clé immédiatement** (ne pas attendre)
2. **Check les logs** (Supabase/Stripe/Vercel pour usage anormal)
3. **Rotate toutes les clés** potentiellement affectées
4. **Force push** si clé committée (après backup)
5. **Notifie l'équipe** si projet collaboratif

---

**Prochaine étape**: Audit de sécurité complet
```bash
# Scan de secrets
brew install gitleaks
gitleaks detect --source . --verbose

# Review manuelle
./scripts/audit-with-gemini.sh
```
