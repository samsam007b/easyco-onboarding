# EasyCo Messaging System Setup

## Overview

Le système de messaging real-time d'EasyCo permet aux utilisateurs de communiquer entre eux avec :
- ✅ Messages texte en temps réel
- ✅ Indicateurs de saisie (typing indicators)
- ✅ Notifications sonores
- ✅ Upload et partage d'images
- ✅ Statuts de lecture (read receipts)
- ✅ Historique des conversations

## Architecture

### Tables de base de données
1. **conversations** - Stocke les conversations entre utilisateurs
2. **messages** - Stocke les messages individuels
3. **conversation_read_status** - Track le statut de lecture
4. **typing_indicators** - Indicateurs de saisie temporaires

### Composants React
1. **ConversationList** - Liste des conversations
2. **ChatWindow** - Fenêtre de chat principale
3. **MessageImage** - Affichage d'images dans les messages
4. **ImageUploadButton** - Upload d'images

### Services
- **messaging-service.ts** - Fonctions pour gérer les conversations et messages
- **use-message-sound.ts** - Hook pour les notifications sonores

## Configuration requise

### 1. Base de données Supabase

Exécutez les scripts SQL suivants dans l'ordre via le SQL Editor de Supabase :

#### A. Enhancements du système de messaging
```bash
# Fichier: supabase/messaging_enhancements_only.sql
```

Ce script crée :
- Table `typing_indicators`
- Colonnes pour les images dans `messages` (image_url, image_width, image_height)
- Fonctions RPC nécessaires :
  - `get_or_create_conversation()`
  - `get_user_conversations()`
  - `send_message()`
  - `mark_conversation_read()`

#### B. Bucket de stockage pour les images
```bash
# Fichier: supabase/create_message_images_storage.sql
```

Ce script crée :
- Bucket public `message-images`
- Policies RLS pour l'upload et la suppression

### 2. Vérification de la configuration

Vérifiez que les éléments suivants existent dans votre base Supabase :

**Tables** :
```sql
SELECT tablename FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('conversations', 'messages', 'conversation_read_status', 'typing_indicators');
```

**Fonctions RPC** :
```sql
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
  'get_or_create_conversation',
  'get_user_conversations',
  'send_message',
  'mark_conversation_read'
);
```

**Storage Bucket** :
```sql
SELECT * FROM storage.buckets WHERE id = 'message-images';
```

## Utilisation

### Démarrer une conversation

```typescript
import { getOrCreateConversation } from '@/lib/services/messaging-service';

// Entre deux utilisateurs
const result = await getOrCreateConversation(userId1, userId2);
if (result.success) {
  const conversationId = result.data;
  // Redirect to /messages?conversation={conversationId}
}
```

### Envoyer un message

```typescript
import { sendMessage } from '@/lib/services/messaging-service';

await sendMessage({
  conversationId: 'uuid',
  content: 'Hello!',
  messageType: 'text'
});
```

### Envoyer un message avec image

Les images sont automatiquement uploadées via le composant `ImageUploadButton` et l'URL est stockée dans `message.image_url`.

### S'abonner aux messages en temps réel

```typescript
import { subscribeToConversation } from '@/lib/services/messaging-service';

const cleanup = subscribeToConversation(
  conversationId,
  (message) => {
    console.log('New message:', message);
    // Update UI
  },
  (userId, isTyping) => {
    console.log(`User ${userId} is ${isTyping ? 'typing' : 'stopped typing'}`);
  }
);

// Cleanup on unmount
return cleanup;
```

## Features implémentées

### ✅ Real-time messaging
- Supabase Realtime pour les messages instantanés
- Auto-scroll vers le bas à l'arrivée de nouveaux messages
- Groupement des messages par date

### ✅ Typing indicators
- Affichage "typing..." quand l'autre utilisateur tape
- Auto-expiration après 3 secondes d'inactivité
- Nettoyage automatique des indicateurs expirés

### ✅ Notifications sonores
- Son généré avec Web Audio API (pas de fichier externe nécessaire)
- Joue uniquement pour les messages reçus (pas les messages envoyés)
- Vibration en fallback sur mobile

### ✅ Upload d'images
- Upload vers Supabase Storage
- Validation du type et de la taille (max 5MB)
- Preview avant envoi
- Affichage en fullscreen au clic
- Dimensions stockées pour optimisation

### ✅ Read receipts
- Marquage automatique comme lu quand la conversation est ouverte
- Double checkmark (✓✓) pour les messages lus
- Compteur de messages non lus par conversation

### ✅ Archive & Delete
- Archive des conversations (soft delete)
- Filtre pour afficher les conversations archivées
- Suppression des messages (soft delete)

## Testing

### Test manuel

1. **Créer deux utilisateurs de test**
   ```bash
   # User 1: test1@example.com
   # User 2: test2@example.com
   ```

2. **Ouvrir deux navigateurs/onglets**
   - Onglet 1 : Connecté comme User 1
   - Onglet 2 : Connecté comme User 2

3. **Démarrer une conversation**
   - User 1 : Aller sur `/messages`
   - User 1 : Créer une conversation avec User 2
   - User 2 : Voir la notification et la nouvelle conversation

4. **Tester les features**
   - ✅ Envoyer des messages texte
   - ✅ Voir les typing indicators
   - ✅ Entendre les sons de notification
   - ✅ Uploader et voir des images
   - ✅ Voir les read receipts
   - ✅ Archiver une conversation

### Vérifier les logs en temps réel

```javascript
// Dans la console du navigateur
localStorage.setItem('supabase.realtime.debug', 'true');
```

## Troubleshooting

### Les messages ne s'affichent pas en temps réel
- Vérifier que Supabase Realtime est activé pour votre projet
- Vérifier les RLS policies sur la table `messages`
- Check la console pour les erreurs de subscription

### Les images ne s'uploadent pas
- Vérifier que le bucket `message-images` existe et est public
- Vérifier les RLS policies sur `storage.objects`
- Vérifier la limite de taille (5MB max)

### Les fonctions RPC ne fonctionnent pas
- Exécuter le script `messaging_enhancements_only.sql`
- Vérifier les permissions : `GRANT EXECUTE ON FUNCTION ... TO authenticated`
- Vérifier les logs Supabase pour les erreurs SQL

### Le son ne joue pas
- Le navigateur bloque l'audio avant interaction utilisateur
- Solution : Le son jouera après la première interaction (clic, tape, etc.)
- Alternative : La vibration fonctionne sur mobile

## Prochaines améliorations possibles

- [ ] Réactions aux messages (emoji)
- [ ] Messages vocaux
- [ ] Partage de localisation
- [ ] Messages épinglés
- [ ] Recherche dans les messages
- [ ] Appels vidéo/audio
- [ ] Bot de conversation automatique
- [ ] Traduction automatique des messages

## Support

Pour toute question ou problème :
1. Vérifier ce README
2. Consulter les logs Supabase
3. Vérifier la console du navigateur
4. Contacter l'équipe dev
