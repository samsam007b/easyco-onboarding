# Guide Rapide : Migration Notifications

## 🚀 Pour activer le système de notifications

### Étape 1 : Appliquer la migration (5 min)

1. Va sur le Dashboard Supabase :
   ```
   https://supabase.com/dashboard/project/fgthoyilfupywmpmiuwd/sql/new
   ```

2. Copie/colle le contenu de :
   ```
   supabase/migrations/042_create_notifications_system.sql
   ```

3. Clique sur "Run" ✅

### Étape 2 : Tester (2 min)

1. Lance le serveur :
   ```bash
   npm run dev
   ```

2. Connecte-toi avec un compte

3. Tu verras l'icône Bell (🔔) dans le header

4. Pour tester les notifications en temps réel :
   - Ouvre 2 onglets avec le même compte
   - Dans l'onglet 1, envoie un message ou ajoute un favori
   - Regarde l'onglet 2 : la notification apparaît instantanément ! ⚡

### Étape 3 : Activer les notifications navigateur (optionnel)

Quand tu cliques sur l'icône Bell, le navigateur te demandera la permission pour les notifications de bureau.

Accepte pour recevoir des notifications même quand l'onglet n'est pas actif !

---

## ✨ Fonctionnalités

- 🔔 **Notifications en temps réel** (WebSocket)
- 🔴 **Badge compteur** non lus
- 📬 **Types** : messages, matchs, favoris, candidatures, système
- ✅ **Marquer comme lu** (individuel ou tout)
- 🗑️ **Supprimer** les notifications
- 🖱️ **Cliquer** pour naviguer vers le contenu
- 💻 **Notifications navigateur** (avec permission)
- 🧹 **Auto-nettoyage** après 30 jours

---

## 📚 Documentation complète

Pour plus de détails : [docs/NOTIFICATIONS_SYSTEM.md](docs/NOTIFICATIONS_SYSTEM.md)

---

**C'est tout !** Le système est prêt à l'emploi après la migration. 🎉
