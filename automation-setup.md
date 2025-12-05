# 🚀 Setup d'Automatisation Notion - Guide Simple

## 🎯 Ce Qu'on Va Créer

Un système où **vous me parlez directement** et **je fais tout** automatiquement :
- Analyser vos emails → Créer tâches Notion
- Morning briefing → Tout dans Notion
- Analyser GitHub → Update Notion
- Etc.

---

## 📋 Setup en 5 Minutes

### ÉTAPE 1 : Créer une Intégration Notion

1. **Ouvrez** : https://www.notion.so/my-integrations
2. **Cliquez** sur "+ New integration"
3. **Remplissez** :
   - Name: `Samuel Automation Bot`
   - Type: `Internal`
   - Associated workspace: Sélectionnez votre workspace
4. **Capabilities** (cochez tout) :
   - ✅ Read content
   - ✅ Update content
   - ✅ Insert content
5. **Cliquez** sur "Submit"
6. **COPIEZ** le "Internal Integration Secret" (commence par `secret_...`)
   - **GARDEZ-LE SECRET !**

---

### ÉTAPE 2 : Partager Votre Master Inbox

1. **Dans Notion**, ouvrez votre **Master Inbox**
2. **Cliquez** sur "..." (en haut à droite) → **"Connecter à"** ou **"Add connections"**
3. **Cherchez** et sélectionnez **"Samuel Automation Bot"**
4. **Confirmez**

---

### ÉTAPE 3 : Installer les Dépendances

Dans votre terminal (dans le dossier `easyco-onboarding`) :

\`\`\`bash
npm install @notionhq/client dotenv
\`\`\`

---

### ÉTAPE 4 : Créer le Fichier .env

Je vais créer ce fichier pour vous.

**VOUS DEVREZ JUSTE** remplacer `YOUR_NOTION_SECRET` par votre vraie clé.

---

## 🎯 Ce Que Je Vais Créer Pour Vous

### 1. `notion-client.js`
Client Notion réutilisable pour tous les scripts

### 2. `morning-briefing.js`
Morning briefing automatique qui :
- Analyse Gmail
- Check Google Calendar
- Vérifie Notion
- Crée un résumé + nouvelles tâches

### 3. `add-task.js`
Script simple pour ajouter une tâche :
\`\`\`bash
node add-task.js "Titre de la tâche" "🚀 EasyCo" "🔴 Urgent"
\`\`\`

### 4. `email-to-notion.js`
Analyse emails et crée des tâches automatiquement

### 5. `github-sync.js`
Sync bugs GitHub → Tâches Notion

---

## 📝 Donnez-Moi Juste Votre Clé API

Une fois que vous avez :
1. ✅ Créé l'intégration
2. ✅ Partagé la Master Inbox avec l'intégration
3. ✅ Copié la clé secrète

**Dites-moi juste** : "Voilà ma clé : secret_XXXXX" et je crée TOUT le système !

---

## 🚀 Comment Ça Va Marcher Après

### Via Moi (Claude Code)

Vous me dites directement :

```
"Lance mon morning briefing"
```

→ Je lance le script automatiquement
→ Analyse tout
→ Crée les tâches dans Notion
→ Vous donne le résumé

### Via Terminal (Si vous préférez)

```bash
npm run morning-briefing
npm run add-task "Ma tâche" "Catégorie" "Priorité"
npm run sync-github
```

---

## 🎯 Prochaines Étapes

1. **Maintenant** : Créez l'intégration Notion (2 min)
2. **Ensuite** : Partagez Master Inbox avec l'intégration (30 sec)
3. **Puis** : Donnez-moi votre clé secrète
4. **Enfin** : Je crée tout le système (5 min de ma part)

**Total** : 10 minutes et vous avez un système d'automatisation complet ! 🎉

---

Prêt ? Allez créer votre intégration maintenant : https://www.notion.so/my-integrations
