# Chat en Temps Réel - Documentation

## Résumé

Système de chat en temps réel complet utilisant Supabase Realtime pour la communication instantanée entre chercheurs et propriétaires.

## Fichiers Créés

### Hooks React

#### [hooks/useConversations.ts](hooks/useConversations.ts)
Hook pour gérer la liste des conversations de l'utilisateur
- **Chargement** des conversations avec détails (nom, photo, dernier message, compteur non-lus)
- **Subscription Realtime** aux changements de messages
- **Auto-refresh** quand un nouveau message arrive dans n'importe quelle conversation
- Utilise la fonction RPC `get_user_conversations`

```typescript
export function useConversations(): {
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}
```

#### [hooks/useMessages.ts](hooks/useMessages.ts)
Hook pour gérer les messages d'une conversation spécifique
- **Chargement** des messages d'une conversation
- **Subscription Realtime** aux INSERT/UPDATE/DELETE de messages
- **Envoi de messages** via RPC `send_message`
- **Marquer comme lu** via RPC `mark_conversation_read`
- **Suppression** de messages
- État `sending` pour feedback utilisateur

```typescript
export function useMessages({ conversationId, enabled }): {
  messages: Message[];
  loading: boolean;
  error: string | null;
  sending: boolean;
  sendMessage: (content, options?) => Promise<messageId>;
  markAsRead: () => Promise<void>;
  deleteMessage: (messageId) => Promise<void>;
  refresh: () => Promise<void>;
}
```

#### [hooks/useTypingIndicator.ts](hooks/useTypingIndicator.ts)
Hook pour les indicateurs "en train d'écrire"
- **Affichage** des utilisateurs en train d'écrire
- **Mise à jour** de l'indicateur local (auto-expire après 5s)
- **Subscription Realtime** aux indicateurs des autres utilisateurs
- **Nettoyage automatique** des indicateurs expirés

```typescript
export function useTypingIndicator(conversationId): {
  typingUsers: string[];
  setTyping: () => Promise<void>;
  clearTyping: () => Promise<void>;
  isTyping: boolean;
}
```

### Composants UI

#### [components/chat/ChatBubble.tsx](components/chat/ChatBubble.tsx)
Bulle de message stylisée
- **Design différencié** messages envoyés/reçus
- **Avatar** et nom de l'expéditeur
- **Horodatage** relatif (date-fns)
- **Statut de lecture** (Check / CheckCheck icons)
- **Support d'images** attachées
- Gradient violet pour messages propres, gris pour messages reçus

#### [components/chat/ChatInput.tsx](components/chat/ChatInput.tsx)
Zone de saisie de message avancée
- **Textarea auto-resizable** (max 120px)
- **Raccourcis clavier**: Entrée pour envoyer, Shift+Entrée pour nouvelle ligne
- **Bouton upload d'image** (placeholder pour implémentation future)
- **Indicateur de chargement** pendant l'envoi
- **Validation** (pas d'envoi si vide)
- **Hint text** pour les raccourcis

#### [components/chat/ConversationList.tsx](components/chat/ConversationList.tsx)
Liste des conversations
- **Cartes interactives** pour chaque conversation
- **Badge** avec compteur de messages non-lus
- **Avatar** de l'autre utilisateur
- **Dernier message** et horodatage
- **Highlight** de la conversation sélectionnée (bordure violette)
- **États vides** avec messages explicatifs
- **Skeleton loader** pendant le chargement

## Architecture Technique

### Base de Données (Supabase)

Tables utilisées (déjà existantes via migration `040_enhance_messaging_system.sql`):

#### `conversations`
```sql
- id: UUID
- participant1_id: UUID (référence auth.users)
- participant2_id: UUID (référence auth.users)
- last_message_text: TEXT
- last_message_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
```

#### `messages`
```sql
- id: UUID
- conversation_id: UUID (référence conversations)
- sender_id: UUID (référence auth.users)
- content: TEXT
- message_type: TEXT (text, image, system)
- image_url: TEXT (nullable)
- image_width: INTEGER (nullable)
- image_height: INTEGER (nullable)
- read_by_recipient: BOOLEAN
- read_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
- metadata: JSONB
```

#### `typing_indicators`
```sql
- id: UUID
- conversation_id: UUID (référence conversations)
- user_id: UUID (référence auth.users)
- expires_at: TIMESTAMPTZ
- created_at: TIMESTAMPTZ
- UNIQUE(conversation_id, user_id)
```

### Fonctions RPC

#### `get_user_conversations(p_user_id)`
Retourne toutes les conversations d'un utilisateur avec:
- Informations de l'autre utilisateur (nom, photo)
- Dernier message et horodatage
- Compteur de messages non-lus

#### `send_message(p_conversation_id, p_sender_id, p_content, p_message_type, p_metadata, p_image_url)`
Insère un message et retourne son ID

#### `mark_conversation_read(p_conversation_id, p_user_id)`
Marque tous les messages d'une conversation comme lus par l'utilisateur

### Supabase Realtime

**Channels utilisés**:

1. **`conversations-updates`** (global)
   - Écoute les changements sur la table `messages`
   - Déclenche un refresh des conversations

2. **`messages:{conversationId}`** (par conversation)
   - INSERT: Ajoute le nouveau message au state
   - UPDATE: Met à jour le message (ex: marquer comme lu)
   - DELETE: Retire le message du state

3. **`typing:{conversationId}`** (par conversation)
   - Écoute les changements sur `typing_indicators`
   - Met à jour la liste des utilisateurs en train d'écrire

### Row Level Security (RLS)

Les politiques RLS existantes assurent que:
- Un utilisateur ne peut voir que ses propres conversations
- Un utilisateur ne peut voir que les messages de ses conversations
- Un utilisateur ne peut envoyer des messages que dans ses conversations
- Les indicateurs de typing sont visibles par tous les participants

## Workflow Utilisateur

1. **Ouverture de la page `/messages`**
   - Chargement de toutes les conversations via `useConversations`
   - Affichage de la liste avec compteurs non-lus

2. **Sélection d'une conversation**
   - Chargement des messages via `useMessages`
   - Subscription Realtime pour les nouveaux messages
   - Marquer automatiquement comme lus

3. **Écriture d'un message**
   - Typing dans le textarea déclenche `setTyping()`
   - Indicateur visible pour l'autre utilisateur
   - Auto-clear après 5 secondes

4. **Envoi d'un message**
   - Clic sur Send ou Entrée
   - Appel RPC `send_message`
   - Message apparaît instantanément via Realtime
   - Clear de l'indicateur typing

5. **Réception d'un message**
   - Message apparaît automatiquement via Realtime
   - Badge non-lus mis à jour
   - Auto-scroll vers le bas
   - Marquer comme lu si conversation ouverte

## Fonctionnalités

### Implémentées ✅
- Chat en temps réel bidirectionnel
- Indicateurs "en train d'écrire"
- Statuts de lecture (simple/double check)
- Compteurs de messages non-lus
- Auto-scroll vers les nouveaux messages
- Horodatages relatifs (date-fns)
- Design responsive
- Avatars et noms d'utilisateurs
- États de chargement

### À Implémenter (Futures)
- Upload et affichage d'images
- Messages vocaux
- Partage de localisation
- Réactions aux messages (emoji)
- Suppression de messages
- Modification de messages
- Recherche dans les messages
- Archivage de conversations
- Notifications push

## Intégration avec le Matching

Quand un chercheur contacte un propriétaire depuis [app/matching/properties/page.tsx](app/matching/properties/page.tsx:1):
1. Création d'une conversation via [app/api/matching/matches/[matchId]/contact/route.ts](app/api/matching/matches/[matchId]/contact/route.ts:1)
2. Notification envoyée au propriétaire
3. Les deux utilisateurs voient la nouvelle conversation dans `/messages`

## Technologies

- **Supabase Realtime**: WebSocket pour les mises à jour en temps réel
- **React Hooks**: Logique réutilisable et performante
- **date-fns**: Formatage des dates avec localisation française
- **Tailwind CSS**: Styling avec gradient violet/jaune
- **Lucide React**: Icônes modernes
- **TypeScript strict**: Sécurité des types

## Performance

- **Subscriptions optimisées**: Un channel par conversation active uniquement
- **Auto-cleanup**: Unsubscribe automatique au démontage des composants
- **Indicateurs expirés**: Nettoyage automatique après 5s
- **Indexes DB**: Sur `conversation_id`, `sender_id`, `read_by_recipient`

## Sécurité

- **RLS policies**: Protection des données au niveau base de données
- **Auth check**: Vérification de l'authentification dans tous les hooks
- **SQL injection**: Protection via paramètres RPC
- **XSS**: Échappement automatique par React

## Date de Création

31 Octobre 2025

## Statut

✅ Prêt à l'emploi - Build réussi

Les hooks et composants de chat sont prêts à être intégrés à la page `/messages` existante pour améliorer l'expérience en temps réel.
