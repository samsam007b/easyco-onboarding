# Instructions - Nouveau Système de Messages

## 🎯 Fonctionnalités ajoutées

Le système de messages a été complètement revu pour distinguer 5 types de conversations :

### 1. **Discussion de la résidence** 🏠
- Chat de groupe **officiel** automatiquement créé pour chaque résidence
- Tous les membres actifs y sont ajoutés automatiquement
- **Idéal pour** : Annonces, événements, discussions communes

### 2. **Résidence ↔ Propriétaire** 👥
- Canal **officiel** entre tous les résidents et le propriétaire
- Créé automatiquement pour chaque propriété
- **Idéal pour** : Questions sur le loyer, maintenance, règles

### 3. **Messages privés entre résidents** 💬
- Conversations 1-to-1 entre colocataires
- **Idéal pour** : Discussions personnelles entre résidents

### 4. **Messages privés avec le propriétaire** 👤
- Conversations 1-to-1 entre un résident et le propriétaire
- **Idéal pour** : Questions personnelles, problèmes individuels

### 5. **Candidats intéressés** 🆕
- Conversations avec des futurs résidents potentiels
- **Idéal pour** : Questions avant d'emménager

## 📦 Fichiers créés/modifiés

### Nouveaux fichiers :
- `supabase/migrations/070_add_conversation_types.sql` - Migration SQL
- `app/hub/messages/page.tsx` - Nouvelle page messages
- `components/messages/ConversationTypeSection.tsx` - Composant de section

## 🚀 Déploiement

### Étape 1 : Appliquer la migration SQL

**Via le Dashboard Supabase (Recommandé) :**

1. Connectez-vous à https://supabase.com/dashboard
2. Sélectionnez votre projet `easyco-onboarding`
3. Allez dans **SQL Editor**
4. Cliquez sur **New Query**
5. Copiez-collez le contenu de `supabase/migrations/070_add_conversation_types.sql`
6. Cliquez sur **Run**

**Résultat attendu :**
```
✅ Added conversation_type column
✅ Added is_official column
✅ Added metadata column
✅ Created residence group chat for property ...
✅ Conversation types system created!
```

### Étape 2 : Déployer le code

Le code a déjà été poussé sur GitHub, Vercel déploiera automatiquement.

## 🧪 Vérification après déploiement

1. Allez sur https://easyco-onboarding.vercel.app/hub/messages
2. Vous devriez voir :
   - ✅ Section "Discussion de la résidence" avec le chat de groupe
   - ✅ Section "Résidence ↔ Propriétaire"
   - ✅ Les autres sections (vides au début)

## 🔄 Fonctionnement automatique

### Quand un nouveau membre rejoint une propriété :
- Il est **automatiquement ajouté** aux 2 chats officiels :
  - Discussion de la résidence
  - Résidence ↔ Propriétaire

### Quand une nouvelle propriété est créée :
- Les 2 chats officiels sont **automatiquement créés**
- Tous les membres actifs sont ajoutés

## 📱 Prochaines étapes (optionnel)

Pour compléter le système :
1. Page de détail de conversation (`/hub/messages/[id]`)
2. Page "Nouveau message" (`/hub/messages/new`)
3. Notifications en temps réel
4. Envoi de fichiers/images

## 🐛 Dépannage

### Les chats officiels n'apparaissent pas
1. Vérifiez que l'utilisateur est membre d'une propriété active
2. Vérifiez que la migration a bien été exécutée
3. Exécutez manuellement dans Supabase SQL Editor :
```sql
SELECT create_residence_group_chat(
  (SELECT property_id FROM property_members WHERE user_id = 'YOUR_USER_ID' LIMIT 1)
);
```

### Erreurs 400/406
- Vérifiez que toutes les politiques RLS sont en place
- Vérifiez que les tables `conversations`, `conversation_participants`, `messages` existent

## 💡 Conseils d'utilisation

- Les chats **officiels** sont épinglés en haut et ne peuvent pas être supprimés
- Les messages privés peuvent être créés librement
- Le système détecte automatiquement le type de conversation selon les participants
