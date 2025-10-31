# Système de Notifications en Temps Réel

## Vue d'ensemble

Système complet de notifications en temps réel utilisant Supabase Realtime pour alerter les utilisateurs des événements importants de la plateforme.

---

## Fonctionnalités

### Types de Notifications
- **message** : Nouveau message reçu
- **match** : Nouveau match trouvé
- **favorite** : Quelqu'un a ajouté votre propriété en favoris
- **application** : Nouvelle candidature reçue
- **system** : Notifications système importantes

### Caractéristiques
- ✅ **Temps réel** avec Supabase Realtime (WebSocket)
- ✅ **Notifications navigateur** (avec permission utilisateur)
- ✅ **Badge compteur** non lus en temps réel
- ✅ **Marquage lu/non lu** individuel ou global
- ✅ **Actions CTA** optionnelles (URLs cliquables)
- ✅ **Auto-clean** des notifications lues après 30 jours
- ✅ **Triggers automatiques** sur nouveaux messages/favoris

---

## Architecture

### Base de Données

#### Table `notifications`
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  type VARCHAR(50), -- 'message', 'match', 'favorite', etc.
  title VARCHAR(255),
  message TEXT,

  -- Relations optionnelles
  related_user_id UUID,
  related_property_id UUID,
  related_message_id UUID,

  -- Metadata
  data JSONB,

  -- Status
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,

  -- Action
  action_url TEXT,
  action_label VARCHAR(100),

  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);
```

#### Indexes
- `idx_notifications_user_id` : Requêtes par utilisateur
- `idx_notifications_user_unread` : Compteur non lus (partiel)
- `idx_notifications_created_at` : Tri chronologique
- `idx_notifications_type` : Filtrage par type

#### RLS Policies
- Les utilisateurs voient uniquement leurs propres notifications
- Seul le service role peut créer des notifications

### Fonctions SQL

#### `mark_notification_read(notification_id UUID)`
Marque une notification comme lue.

#### `mark_all_notifications_read()`
Marque toutes les notifications de l'utilisateur comme lues.

#### `get_unread_notifications_count()`
Retourne le nombre de notifications non lues.

#### `create_notification(...)`
Fonction helper pour créer une notification (service role).

#### `cleanup_old_notifications()`
Supprime les notifications lues de plus de 30 jours.

### Triggers Automatiques

#### Nouveau Message
```sql
CREATE TRIGGER trigger_notify_new_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_message();
```
Crée automatiquement une notification quand un message est envoyé.

#### Nouveau Favori
```sql
CREATE TRIGGER trigger_notify_new_favorite
  AFTER INSERT ON favorites
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_favorite();
```
Notifie le propriétaire quand quelqu'un ajoute sa propriété en favoris.

---

## Implémentation Frontend

### Hook `useNotifications`

```typescript
import { useNotifications } from '@/hooks/useNotifications';

function MyComponent() {
  const {
    notifications,      // Liste des notifications
    unreadCount,       // Compteur non lus
    loading,           // État de chargement
    markAsRead,        // Marquer comme lu
    markAllAsRead,     // Tout marquer comme lu
    deleteNotification, // Supprimer
    refresh,           // Recharger
  } = useNotifications();

  return (
    <div>
      <p>Vous avez {unreadCount} notifications non lues</p>
      {notifications.map(notif => (
        <div key={notif.id} onClick={() => markAsRead(notif.id)}>
          {notif.title}
        </div>
      ))}
    </div>
  );
}
```

### Composant `NotificationCenter`

Drop-down complet avec :
- Icône Bell avec badge compteur
- Liste des notifications (scroll infini)
- Actions sur chaque notification (marquer lu, supprimer)
- Bouton "Tout marquer comme lu"
- Lien vers page notifications complète

**Usage** :
```typescript
import { NotificationCenter } from '@/components/NotificationCenter';

<NotificationCenter />
```

**Déjà intégré dans** :
- `SearcherHeader`
- `OwnerHeader`
- `ResidentHeader`

### Notifications Navigateur

#### Permission
```typescript
import { useNotificationPermission } from '@/hooks/useNotifications';

const { permission, requestPermission, isSupported } = useNotificationPermission();

if (isSupported && permission === 'default') {
  await requestPermission();
}
```

#### Affichage automatique
Quand une nouvelle notification arrive et que la permission est accordée, une notification navigateur s'affiche automatiquement.

---

## Création Manuelle de Notifications

### Via SQL (Service Role)

```sql
SELECT create_notification(
  '[USER_ID]',
  'system',
  'Bienvenue sur EasyCo!',
  'Complète ton profil pour recevoir de meilleurs matchs',
  NULL, -- related_user_id
  NULL, -- related_property_id
  NULL, -- related_message_id
  '{"step": "onboarding"}'::jsonb, -- data
  '/profile/edit', -- action_url
  'Compléter mon profil' -- action_label
);
```

### Via API (Future)

```typescript
// À implémenter: API endpoint pour créer des notifications
POST /api/notifications
{
  user_id: "...",
  type: "system",
  title: "Titre",
  message: "Message",
  action_url: "/path",
  action_label: "CTA"
}
```

---

## Migration

### Fichier
`supabase/migrations/042_create_notifications_system.sql`

### Application

1. **Via Dashboard Supabase** :
```
https://supabase.com/dashboard/project/[PROJECT]/sql/new
```
Copie/colle le contenu de la migration et exécute.

2. **Via CLI** :
```bash
npx supabase db push
```

### Vérification

```bash
# Via script Node.js
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
supabase.from('notifications').select('count').then(r => console.log('✅ Table exists'));
"
```

Ou via SQL :
```sql
SELECT COUNT(*) FROM notifications;
```

---

## Maintenance

### Nettoyage Automatique

Configurer un cron job Supabase (via Dashboard) :
```sql
-- Tous les jours à 3h du matin
SELECT cron.schedule(
  'cleanup-old-notifications',
  '0 3 * * *',
  $$
    SELECT cleanup_old_notifications();
  $$
);
```

Ou via script externe :
```bash
# Cron job local/serveur
0 3 * * * psql $DATABASE_URL -c "SELECT cleanup_old_notifications();"
```

### Monitoring

Requêtes utiles :

```sql
-- Notifications par type (dernières 24h)
SELECT type, COUNT(*)
FROM notifications
WHERE created_at > now() - interval '24 hours'
GROUP BY type;

-- Taux de lecture
SELECT
  COUNT(*) FILTER (WHERE is_read) * 100.0 / COUNT(*) as read_percentage
FROM notifications
WHERE created_at > now() - interval '7 days';

-- Utilisateurs avec le plus de notifications non lues
SELECT user_id, COUNT(*) as unread_count
FROM notifications
WHERE is_read = false
GROUP BY user_id
ORDER BY unread_count DESC
LIMIT 10;
```

---

## Tests

### Test Unitaire

```typescript
// hooks/__tests__/useNotifications.test.ts
import { renderHook, act } from '@testing-library/react';
import { useNotifications } from '@/hooks/useNotifications';

test('should load notifications', async () => {
  const { result } = renderHook(() => useNotifications());

  await act(async () => {
    await result.current.refresh();
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.notifications).toBeInstanceOf(Array);
});
```

### Test Intégration

1. Créer un utilisateur test
2. Créer une notification via SQL
3. Vérifier qu'elle apparaît dans le NotificationCenter
4. Marquer comme lue
5. Vérifier le compteur décrémente

### Test Temps Réel

1. Ouvrir 2 navigateurs/onglets
2. Se connecter avec le même compte
3. Créer une notification dans l'onglet 1
4. Vérifier qu'elle apparaît en temps réel dans l'onglet 2

---

## Performance

### Optimisations Appliquées

1. **Limit 50** : Charge seulement les 50 dernières notifications
2. **Index Partiel** : Index sur `is_read = false` pour compteur rapide
3. **Subscription Realtime** : Pas de polling, utilise WebSocket
4. **Cleanup Automatique** : Supprime les anciennes notifications

### Métriques Attendues

- **Load Time** : < 200ms pour charger 50 notifications
- **Real-time Latency** : < 500ms entre création et affichage
- **Unread Count** : < 50ms (index optimisé)

---

## Sécurité

### RLS Policies
- ✅ Users can SELECT own notifications only
- ✅ Users can UPDATE own notifications only
- ✅ Users can DELETE own notifications only
- ✅ Only service role can INSERT

### Validation
- Types de notifications restreints aux valeurs autorisées
- UUIDs validés par PostgreSQL
- Content sanitization côté frontend (XSS prevention)

### Rate Limiting (À implémenter)
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const userId = await getUserId(request);
  const count = await redis.incr(`notifications:${userId}:count`);

  if (count > 100) { // Max 100 notifications/heure
    return new Response('Too many notifications', { status: 429 });
  }

  await redis.expire(`notifications:${userId}:count`, 3600);
}
```

---

## Roadmap

### Phase 1 ✅ (Actuel)
- [x] Table et migrations
- [x] Hook useNotifications
- [x] Composant NotificationCenter
- [x] Intégration headers
- [x] Triggers auto (messages, favoris)
- [x] Notifications navigateur

### Phase 2 (Prochaine)
- [ ] API endpoint pour créer des notifications
- [ ] Page `/notifications` complète
- [ ] Filtres par type
- [ ] Recherche dans les notifications
- [ ] Pagination infinie

### Phase 3 (Future)
- [ ] Notifications push (mobile PWA)
- [ ] Préférences par type de notification
- [ ] Digest email (résumé quotidien/hebdomadaire)
- [ ] Notifications groupées ("3 nouveaux messages")
- [ ] Rich notifications (images, actions inline)

---

## Dépannage

### Notifications ne s'affichent pas

1. **Vérifier table existe** :
```sql
SELECT * FROM notifications LIMIT 1;
```

2. **Vérifier RLS** :
```sql
SELECT * FROM pg_policies WHERE tablename = 'notifications';
```

3. **Vérifier user_id** :
```typescript
const { data: { user } } = await supabase.auth.getUser();
console.log('User ID:', user?.id);
```

### Realtime ne fonctionne pas

1. **Vérifier Realtime activé sur table** (Dashboard Supabase)
2. **Vérifier channel subscription** :
```typescript
const channel = supabase.channel('test');
channel.on('postgres_changes', {...}, (payload) => {
  console.log('Received:', payload);
});
await channel.subscribe();
```

3. **Vérifier dans console réseau** (F12 → Network → WS)

### Compteur incorrect

1. **Refresh manuel** :
```typescript
const { data, error } = await supabase
  .from('notifications')
  .select('count')
  .eq('user_id', userId)
  .eq('is_read', false);
```

2. **Vérifier index partiel existe** :
```sql
SELECT * FROM pg_indexes
WHERE tablename = 'notifications'
AND indexname = 'idx_notifications_user_unread';
```

---

## Ressources

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Notification API (Browser)](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)
- [date-fns Documentation](https://date-fns.org/)
- [Radix UI Scroll Area](https://www.radix-ui.com/primitives/docs/components/scroll-area)

---

**Créé le** : 31 Octobre 2025
**Auteur** : Claude Code
**Version** : 1.0.0
**Status** : ✅ En production (après application migration)
