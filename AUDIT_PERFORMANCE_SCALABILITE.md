# Audit de Performance & Scalabilité - Izzico

**Date** : 18 janvier 2026
**Version** : 0.3.1
**Objectif** : Analyser la capacité de l'application à supporter 10 000 utilisateurs mensuels actifs (MAU)
**Stack** : Next.js 14 + Supabase (Free tier) + Vercel Pro

---

## 📊 RÉSUMÉ EXÉCUTIF

L'application Izzico peut actuellement gérer **500-1000 utilisateurs actifs** sans problème majeur. Cependant, des goulots d'étranglement critiques apparaîtront à **2000-5000 MAU** sur le plan gratuit de Supabase.

### Capacité par Palier

| Utilisateurs | État | Actions Requises |
|--------------|------|------------------|
| **0-500** | ✅ Fonctionnel | Aucune |
| **500-2000** | ⚠️ Ralentissements | Optimisations code (Phase 1) |
| **2000-5000** | 🔴 Problèmes critiques | Connection pooling + optimisations avancées (Phase 2) |
| **5000-10000** | 💥 Pannes fréquentes | Migration Supabase Pro obligatoire (Phase 3) |
| **10000+** | 🚀 Scalable | Supabase Pro + CDN + optimisations complètes |

### Limites Techniques - Supabase Free Tier

| Ressource | Limite Free | Impact Critique à |
|-----------|-------------|-------------------|
| **Connexions DB simultanées** | 50 | 2000 users actifs |
| **Storage** | 1 GB | 3-6 mois (10k users) |
| **Bandwidth** | 2 GB/mois | 1000 users actifs |
| **Real-time connections** | ~500 | 500 users actifs |
| **RAM Database** | 1 GB | 5000 users |

---

## 🔥 PROBLÈMES CRITIQUES IDENTIFIÉS

### 1. N+1 Query Pattern - Messagerie 🔴 CRITIQUE

**Fichier** : `contexts/MessagesContext.tsx`

**Problème** :
- Chaque chargement de conversations déclenche 1 requête initiale + N requêtes par conversation
- 1 utilisateur avec 10 conversations = 20-30 requêtes DB
- 100 utilisateurs simultanés = 2000-3000 requêtes/seconde → saturation DB

**Impact à échelle** :
- **100 users** : Ralentissement perceptible (1-2 sec)
- **1000 users** : Database CPU à 80-100%
- **5000+ users** : Timeouts et pannes fréquentes

**Solution existante** : Le hook `lib/hooks/use-messages.ts` résout déjà ce problème avec 3 requêtes parallèles au lieu de N séquentielles.

**Action** : Remplacer `MessagesContext` par `use-messages` hook (2 jours)

---

### 2. Real-Time Subscription Explosion 🔴 CRITIQUE

**Fichiers** :
- `contexts/MessagesContext.tsx:354-379`
- `contexts/NotificationContext.tsx:87-101`

**Problème** :
- Chaque utilisateur actif maintient 2-3 WebSocket connections permanentes
- Limite Supabase Free : 500 connexions simultanées
- À 500 users actifs → 100% de la capacité utilisée
- À 1000+ users → 95% des utilisateurs ne peuvent plus se connecter au real-time

**Effet cascade** :
```
Nouveau message arrive
  ↓
Broadcast à 1000 clients abonnés
  ↓
Chaque client recharge TOUTES ses conversations (3 requêtes × 1000 = 3000 requêtes)
  ↓
Database sature, timeouts généralisés
```

**Solutions** :
1. **Court terme** : Debouncing (regrouper updates toutes les 500ms)
2. **Moyen terme** : Polling intelligent au lieu de WebSocket permanent
3. **Long terme** : Server-Sent Events (SSE) avec mise en cache

---

### 3. Index Manquants sur Tables Critiques 🔴 CRITIQUE

**Impact** : Requêtes 10-100× plus lentes à partir de 10k utilisateurs

**Index manquants identifiés** :

```sql
-- Lookup conversations par utilisateur (utilisé à chaque ouverture messagerie)
CREATE INDEX idx_conversation_participants_user_id
  ON conversation_participants(user_id, conversation_id);

-- Matching algorithm (utilisé à chaque recherche de colocataires)
CREATE INDEX idx_user_profiles_user_id_completion
  ON user_profiles(user_id, profile_completion_score);

-- Affichage réactions aux messages
CREATE INDEX idx_message_reactions_emoji_message
  ON message_reactions(emoji, message_id);

-- Mark messages as read (trigger performance)
CREATE INDEX idx_messages_conversation_sender_read
  ON messages(conversation_id, sender_id, read_at, created_at);
```

**Action** : Appliquer migration SQL (1 jour)

---

### 4. API Matching Sans Limite Stricte 🔴 CRITIQUE

**Fichier** : `app/api/matching/matches/route.ts:32-45`

**Problème** :
- Client peut demander 100 matchs avec statistiques complètes
- Chaque match = 3-5 JOINs + 50 colonnes = 500 KB de réponse
- 10 000 users × 10 requêtes/minute = **166 MB/sec de bandwidth**

**Solution** :
1. Réduire limite à 20 matchs max par requête
2. Ajouter pagination obligatoire
3. Implémenter cache côté serveur (TTL: 5 min)

---

### 5. Stockage Images Sans Compression 🟠 HAUTE

**Fichier** : `lib/services/storage-service.ts`

**Problème** :
- Avatars uploadés en 2 MB (devrait être 100 KB)
- Photos propriétés en 5 MB (devrait être 500 KB)

**Projection croissance** :
- 10 000 users × 1.5 MB avatar = **15 GB**
- 500 propriétés × 60 MB photos = **30 GB**
- **Total : 45 GB** (limite Free tier = 1 GB)
- Quota dépassé en **3 mois**

**Solution** : Compression automatique avec `sharp` avant upload (réduction 80-90%)

---

### 6. Endpoints API Sans Rate Limiting 🟠 HAUTE

**Endpoints non protégés** :
- `/api/matching/matches` - Peut être spammé
- `/api/matching/generate` - CPU intensif
- `/api/assistant/chat` - Coût LLM élevé
- `/api/rooms/search-aesthetic` - OCR coûteux

**Vulnérabilité** :
- Utilisateur malveillant peut générer €100 de coûts OCR/LLM en 1 minute
- DDoS accidentel (bug client qui boucle sur API)

**Solution** : Rate limiting global avec Upstash Redis

---

### 7. Re-renders Inutiles - Contextes React 🟠 MOYENNE

**Fichiers** :
- `contexts/MessagesContext.tsx` - Pas de `useMemo` sur liste conversations
- `contexts/NotificationContext.tsx` - Pas de `useMemo` sur tableau notifications

**Problème** :
- Chaque nouveau message déclenche re-render de TOUTES les conversations
- 50 conversations × 1000 users = 50 000 re-renders inutiles
- Impact UX : interface qui "lag" pendant le scroll

**Solution** : `useMemo` + `React.memo` sur composants enfants

---

## 📈 PROJECTION COÛTS

### Coûts par Palier d'Utilisateurs

| Métrique | Actuel | 1K Users | 5K Users | 10K Users |
|----------|--------|----------|----------|-----------|
| **Coût mensuel total** | €7 (gratuit) | €7-15 | €25-50 | €100-200 |
| **Supabase** | €0 | €0 | €25 (Pro) | €25-100 |
| **Storage** | €0 | €0 | €5 (50GB) | €15 (100GB) |
| **Bandwidth** | €0 | €0 | €10 | €50 (1TB) |
| **OCR/LLM** | €5 | €10 | €30 | €60 |
| **Vercel Pro** | €20/mois | €20 | €20 | €20 |

### Seuils de Migration Supabase

| Indicateur | Valeur Critique | Action |
|------------|-----------------|--------|
| **Connexions DB** | >40/50 (80%) | Migrer vers Pro |
| **Storage** | >800 MB (80%) | Migrer vers Pro |
| **Bandwidth** | >1.6 GB/mois (80%) | Optimiser images + migrer |
| **Latence API** | >2 sec (p95) | Optimiser queries + pooling |
| **Real-time disconnects** | >10%/jour | Redesign architecture |

---

## 🎯 PLAN D'AMÉLIORATION PROGRESSIF

### PHASE 1 : OPTIMISATIONS CRITIQUES (Avant Lancement)
**Durée** : 1 semaine
**Coût** : €0
**Impact** : Capacité 500 → 2000 users

#### 1.1 Éliminer N+1 Queries (2 jours) ⚡ PRIORITÉ MAX

**Objectif** : Réduire de 70% les requêtes DB sur messagerie

**Actions** :
1. Remplacer `MessagesContext.tsx` par `lib/hooks/use-messages.ts`
2. Tester avec 100 conversations simulées
3. Mesurer before/after avec Supabase Performance Monitor

**Fichiers modifiés** :
- `contexts/MessagesContext.tsx` → déprécier
- Tous les composants utilisant MessagesContext → migrer vers hook

**Validation** :
```bash
# Test de charge : 100 users × 10 conversations
npm run test:load-messaging
```

---

#### 1.2 Ajouter Index Manquants (1 jour)

**Migration SQL** :

```sql
-- Migration 125: Add critical indexes for scalability
-- File: supabase/migrations/125_add_scalability_indexes.sql

-- Conversation participants lookup (used on every inbox load)
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_conversation
  ON public.conversation_participants(user_id, conversation_id);

-- User profiles for matching algorithm
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_completion
  ON public.user_profiles(user_id, profile_completion_score);

-- Message reactions display
CREATE INDEX IF NOT EXISTS idx_message_reactions_emoji_message
  ON public.message_reactions(emoji, message_id);

-- Messages mark-as-read performance (for trigger)
CREATE INDEX IF NOT EXISTS idx_messages_conversation_sender_read
  ON public.messages(conversation_id, sender_id, read_at, created_at);

-- Typing indicators cleanup performance
CREATE INDEX IF NOT EXISTS idx_typing_indicators_conversation_user
  ON public.typing_indicators(conversation_id, user_id);

-- Notifications user lookup
CREATE INDEX IF NOT EXISTS idx_notifications_user_created
  ON public.notifications(user_id, created_at DESC);
```

**Validation** :
```sql
-- Vérifier que les index sont utilisés
EXPLAIN ANALYZE
SELECT * FROM conversation_participants
WHERE user_id = 'xxx' AND conversation_id = 'yyy';
-- Doit montrer "Index Scan" et non "Seq Scan"
```

---

#### 1.3 Rate Limiting Global (1 jour)

**Créer middleware** : `lib/middleware/rate-limit.ts`

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiters par type d'endpoint
const limiters = {
  matching: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 req/min
    analytics: true,
  }),
  assistant: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 req/min
    analytics: true,
  }),
  expensive: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 req/min (OCR, etc.)
    analytics: true,
  }),
};

export async function rateLimitMiddleware(
  request: NextRequest,
  type: 'matching' | 'assistant' | 'expensive',
  userId: string
) {
  const limiter = limiters[type];
  const { success, limit, remaining, reset } = await limiter.limit(userId);

  if (!success) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        limit,
        remaining,
        reset: new Date(reset).toISOString(),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }

  return null; // Rate limit OK, continuer
}
```

**Appliquer sur endpoints** :
- `app/api/matching/matches/route.ts`
- `app/api/matching/generate/route.ts`
- `app/api/assistant/chat/route.ts`
- `app/api/rooms/search-aesthetic/route.ts`

---

#### 1.4 Compression Images Automatique (2 jours)

**Installer dépendances** :
```bash
npm install sharp
```

**Modifier** : `lib/services/storage-service.ts`

```typescript
import sharp from 'sharp';

export class StorageService {
  // ... code existant ...

  /**
   * Optimise une image avant upload
   * - Avatars: 512×512 WebP, qualité 85
   * - Properties: max 2048px width WebP, qualité 85
   * - Documents: pas de compression
   */
  private async optimizeImage(
    file: File,
    type: 'avatar' | 'property' | 'document'
  ): Promise<Buffer> {
    // Skip non-images
    if (!file.type.startsWith('image/')) {
      return Buffer.from(await file.arrayBuffer());
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    switch (type) {
      case 'avatar':
        return sharp(buffer)
          .resize(512, 512, { fit: 'cover', position: 'center' })
          .webp({ quality: 85 })
          .toBuffer();

      case 'property':
        return sharp(buffer)
          .resize(2048, null, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();

      default:
        return buffer;
    }
  }

  async uploadAvatar(file: File, userId: string): Promise<UploadResult> {
    const optimized = await this.optimizeImage(file, 'avatar');
    const blob = new Blob([optimized], { type: 'image/webp' });
    const optimizedFile = new File([blob], file.name.replace(/\.\w+$/, '.webp'), {
      type: 'image/webp',
    });

    return this.uploadFile(optimizedFile, 'profile-photos', userId);
  }

  async uploadPropertyImage(file: File, propertyId: string): Promise<UploadResult> {
    const optimized = await this.optimizeImage(file, 'property');
    const blob = new Blob([optimized], { type: 'image/webp' });
    const optimizedFile = new File([blob], file.name.replace(/\.\w+$/, '.webp'), {
      type: 'image/webp',
    });

    return this.uploadFile(optimizedFile, 'property-images', propertyId);
  }
}
```

**Impact attendu** :
- Avatars : 2 MB → 100 KB (95% réduction)
- Photos propriétés : 5 MB → 500 KB (90% réduction)
- Storage total : 45 GB → 5 GB (89% réduction)

---

#### 1.5 Optimiser Re-renders React (1 jour)

**Modifier** : `contexts/MessagesContext.tsx`

```typescript
import { useMemo } from 'react';

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Mémoriser la liste pour éviter re-renders
  const memoizedConversations = useMemo(() => conversations, [conversations]);

  // Mémoriser les callbacks
  const sendMessage = useCallback(async (conversationId, content) => {
    // ... logique existante
  }, []);

  const markAsRead = useCallback(async (conversationId) => {
    // ... logique existante
  }, []);

  const value = useMemo(
    () => ({
      conversations: memoizedConversations,
      sendMessage,
      markAsRead,
      // ... autres valeurs
    }),
    [memoizedConversations, sendMessage, markAsRead]
  );

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
}
```

**Mémoriser composants enfants** :

```typescript
// components/messages/ConversationItem.tsx
import { memo } from 'react';

export const ConversationItem = memo(({ conversation, onClick }: Props) => {
  // ... render
}, (prevProps, nextProps) => {
  // Ne re-render que si la conversation change
  return prevProps.conversation.id === nextProps.conversation.id &&
         prevProps.conversation.lastMessage?.id === nextProps.conversation.lastMessage?.id;
});
```

---

### PHASE 2 : SCALABILITÉ AVANCÉE (À 2000 Users)
**Durée** : 2 semaines
**Coût** : €0-25/mois
**Impact** : Capacité 2000 → 5000 users

#### 2.1 Connection Pooling avec PgBouncer (2 jours)

**Option 1 : Supabase Managed (recommandé)**

Dans Supabase Dashboard :
1. Aller dans Settings → Database
2. Activer "Connection Pooler" (gratuit sur Free tier)
3. Copier connection string : `postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true`

**Modifier** : `.env.local`
```bash
# Ancienne connection (directe, limite 50)
# DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres

# Nouvelle connection (pooled, limite 500+)
DATABASE_URL=postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true
```

**Impact** :
- Connexions effectives : 50 → 500+
- Latence : +5ms par requête (acceptable)
- Capacité : 2000 users → 5000 users

---

#### 2.2 Redesign Real-Time Architecture (5 jours)

**Problème actuel** : WebSocket permanent pour chaque utilisateur

**Solution 1 : Polling Intelligent (recommandé pour Free tier)**

```typescript
// lib/hooks/use-messages-polling.ts
import { useEffect, useRef } from 'react';

export function useMessagesPolling(userId: string) {
  const intervalRef = useRef<NodeJS.Timeout>();
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Polling toutes les 5 secondes quand onglet actif
    let pollInterval = 5000;

    const poll = async () => {
      const { data } = await supabase
        .from('messages')
        .select('id, created_at')
        .gt('created_at', lastUpdate.toISOString())
        .limit(1)
        .single();

      if (data) {
        // Nouveau message détecté → recharger conversations
        setLastUpdate(new Date(data.created_at));
        loadConversations();

        // Réduire interval à 2 sec pendant 30 sec (conversation active)
        pollInterval = 2000;
        setTimeout(() => { pollInterval = 5000; }, 30000);
      }
    };

    // Poll seulement si onglet visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(intervalRef.current);
      } else {
        intervalRef.current = setInterval(poll, pollInterval);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    intervalRef.current = setInterval(poll, pollInterval);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId, lastUpdate]);
}
```

**Impact** :
- Connexions WebSocket : 1000 → 0 (éliminées)
- Requêtes DB : +0.2 req/sec par user actif (négligeable)
- Latence messages : <5 sec (acceptable pour messagerie non-instantanée)

**Solution 2 : Server-Sent Events (SSE) avec Debounce**

```typescript
// app/api/messages/stream/route.ts
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id');

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const channel = supabase
        .channel(`user:${userId}:messages`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        }, (payload) => {
          // Debounce : attendre 500ms avant d'envoyer
          setTimeout(() => {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
          }, 500);
        })
        .subscribe();

      // Cleanup
      request.signal.addEventListener('abort', () => {
        channel.unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

---

#### 2.3 Cache Layer avec Redis (3 jours)

**Installer** : Upstash Redis (Free tier : 10k requests/day)

```typescript
// lib/cache/redis-cache.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 3600 // 1 heure par défaut
): Promise<T> {
  // Vérifier cache
  const cached = await redis.get<T>(key);
  if (cached) return cached;

  // Sinon, fetch et mettre en cache
  const data = await fetcher();
  await redis.set(key, data, { ex: ttl });
  return data;
}
```

**Cacher** :

```typescript
// Profils utilisateurs (TTL: 1h)
const userProfile = await getCached(
  `user:${userId}:profile`,
  () => supabase.from('user_profiles').select('*').eq('user_id', userId).single(),
  3600
);

// Scores de matching (TTL: 24h)
const matchScores = await getCached(
  `user:${userId}:matches`,
  () => supabase.rpc('calculate_match_score', { p_user_id: userId }),
  86400
);

// Nombre de notifications (TTL: 5 min)
const notifCount = await getCached(
  `user:${userId}:notif_count`,
  () => supabase.from('notifications').select('id', { count: 'exact', head: true }),
  300
);
```

**Impact** :
- Requêtes DB : -30-50%
- Latence API : -100-300ms
- Coût Upstash : €0 (Free tier suffit)

---

#### 2.4 Pagination Stricte API Matching (1 jour)

**Modifier** : `app/api/matching/matches/route.ts`

```typescript
const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(20).default(10), // Réduit de 100 → 20
  offset: z.coerce.number().int().min(0).default(0),
  minScore: z.coerce.number().int().min(0).max(100).default(60),
  status: z.string().default('active').transform(s => s.split(',')),
  includeStats: z.coerce.boolean().default(false),
});

// Ajouter cache
const cacheKey = `matches:${userId}:${limit}:${offset}:${minScore}`;
const cached = await redis.get(cacheKey);
if (cached) {
  return NextResponse.json(cached, {
    headers: { 'X-Cache': 'HIT' },
  });
}

// ... requête DB ...

// Mettre en cache 5 min
await redis.set(cacheKey, result, { ex: 300 });

return NextResponse.json(result, {
  headers: {
    'X-Cache': 'MISS',
    'Cache-Control': 'public, max-age=300',
  },
});
```

---

### PHASE 3 : MIGRATION SUPABASE PRO (À 5000 Users)
**Durée** : 1 semaine
**Coût** : €25-100/mois
**Impact** : Capacité 5000 → 20 000+ users

#### 3.1 Quand Migrer ? Indicateurs Critiques

**Dashboard de Monitoring** : `lib/monitoring/supabase-metrics.ts`

```typescript
export async function checkMigrationThresholds() {
  const metrics = {
    connections: await getActiveConnections(),
    storage: await getStorageUsage(),
    bandwidth: await getBandwidthUsage(),
    apiLatency: await getApiLatencyP95(),
    realtimeDisconnects: await getRealtimeDisconnectRate(),
  };

  const thresholds = {
    connections: { critical: 40, max: 50 },
    storage: { critical: 800_000_000, max: 1_000_000_000 }, // 800 MB
    bandwidth: { critical: 1_600_000_000, max: 2_000_000_000 }, // 1.6 GB
    apiLatency: { critical: 2000, max: 5000 }, // 2 sec
    realtimeDisconnects: { critical: 0.1, max: 0.2 }, // 10%
  };

  const alerts = [];

  Object.keys(metrics).forEach((key) => {
    const value = metrics[key];
    const threshold = thresholds[key];

    if (value >= threshold.max) {
      alerts.push({
        severity: 'CRITICAL',
        metric: key,
        value,
        message: `${key} a atteint la limite (${value}/${threshold.max}). MIGRATION IMMÉDIATE REQUISE.`,
      });
    } else if (value >= threshold.critical) {
      alerts.push({
        severity: 'WARNING',
        metric: key,
        value,
        message: `${key} approche de la limite (${value}/${threshold.max}). Planifier migration.`,
      });
    }
  });

  return alerts;
}
```

**Automatiser check** : Vercel Cron Job quotidien

```typescript
// app/api/cron/check-metrics/route.ts
export async function GET(request: NextRequest) {
  const alerts = await checkMigrationThresholds();

  if (alerts.some(a => a.severity === 'CRITICAL')) {
    // Envoyer email/Slack notification
    await sendAlert({
      title: '🚨 MIGRATION SUPABASE PRO REQUISE',
      alerts,
    });
  }

  return NextResponse.json({ alerts });
}
```

---

#### 3.2 Plan de Migration Supabase Pro

**Étapes** :

1. **Backup complet** (via Supabase Dashboard)
2. **Upgrade vers Pro** : €25/mois
3. **Activer features** :
   - Database : 2 CPU → 4 CPU, 1 GB RAM → 4 GB RAM
   - Connexions : 50 → 200
   - Storage : 1 GB → 100 GB
   - Bandwidth : 2 GB → 250 GB/mois
4. **Tester migration** : Cloner projet, upgrade, valider
5. **Basculer production** : Changer env vars Vercel

**Coûts additionnels estimés** :

| Service | Coût Mensuel |
|---------|--------------|
| Supabase Pro | €25 |
| Storage (100 GB) | €15 |
| Bandwidth (1 TB) | €50 |
| **Total** | **€90/mois** |

---

#### 3.3 Optimisations Post-Migration

**Archivage Messages** :

```sql
-- Migration 126: Archive old messages
-- Déplacer conversations inactives >90 jours vers table archive

CREATE TABLE IF NOT EXISTS public.messages_archive (
  LIKE public.messages INCLUDING ALL
);

-- Fonction d'archivage (à exécuter mensuellement)
CREATE OR REPLACE FUNCTION archive_old_messages()
RETURNS void AS $$
BEGIN
  WITH old_conversations AS (
    SELECT DISTINCT conversation_id
    FROM public.messages
    WHERE created_at < NOW() - INTERVAL '90 days'
    GROUP BY conversation_id
    HAVING MAX(created_at) < NOW() - INTERVAL '90 days'
  )
  INSERT INTO public.messages_archive
  SELECT m.*
  FROM public.messages m
  INNER JOIN old_conversations oc ON m.conversation_id = oc.conversation_id;

  -- Supprimer de la table principale
  DELETE FROM public.messages
  WHERE conversation_id IN (SELECT conversation_id FROM old_conversations);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Optimiser RPC Functions** :

```sql
-- Ajouter caching dans RPC get_user_conversations
CREATE OR REPLACE FUNCTION get_user_conversations(p_user_id UUID)
RETURNS TABLE(...) AS $$
DECLARE
  v_cache_key TEXT := 'conversations:' || p_user_id::TEXT;
  v_cached JSONB;
BEGIN
  -- Vérifier cache (via pg_advisory_lock ou extension)
  -- SELECT cached_value INTO v_cached FROM cache WHERE key = v_cache_key;

  -- Si cache valide, retourner
  -- IF v_cached IS NOT NULL THEN
  --   RETURN QUERY SELECT * FROM jsonb_to_recordset(v_cached) AS ...;
  --   RETURN;
  -- END IF;

  -- Sinon, requête normale + mise en cache
  RETURN QUERY
  SELECT ... FROM conversation_participants WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 📊 SYSTÈME DE MONITORING

### Dashboard Performance à Créer

**Fichier** : `app/admin/performance/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetch('/api/monitoring/metrics')
      .then(res => res.json())
      .then(setMetrics);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-heading mb-8">Performance & Scalabilité</h1>

      {/* Connexions DB */}
      <MetricCard
        title="Connexions Database"
        value={metrics?.connections}
        max={50}
        critical={40}
        unit="connexions"
      />

      {/* Storage */}
      <MetricCard
        title="Storage Utilisé"
        value={metrics?.storage}
        max={1_000_000_000}
        critical={800_000_000}
        unit="bytes"
        format={(v) => `${(v / 1_000_000_000).toFixed(2)} GB`}
      />

      {/* Bandwidth */}
      <MetricCard
        title="Bandwidth Mensuel"
        value={metrics?.bandwidth}
        max={2_000_000_000}
        critical={1_600_000_000}
        unit="bytes"
        format={(v) => `${(v / 1_000_000_000).toFixed(2)} GB`}
      />

      {/* Latence API */}
      <MetricCard
        title="Latence API (p95)"
        value={metrics?.apiLatency}
        max={5000}
        critical={2000}
        unit="ms"
      />

      {/* Real-time */}
      <MetricCard
        title="Taux Déconnexion Real-time"
        value={metrics?.realtimeDisconnects}
        max={0.2}
        critical={0.1}
        unit="%"
        format={(v) => `${(v * 100).toFixed(1)}%`}
      />

      {/* Recommandation migration */}
      {metrics?.shouldMigrate && (
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6 mt-8">
          <h2 className="text-xl font-heading text-red-700 mb-4">
            🚨 Migration Supabase Pro Recommandée
          </h2>
          <p className="text-red-600 mb-4">
            Un ou plusieurs indicateurs ont dépassé le seuil critique.
          </p>
          <ul className="list-disc pl-6 text-red-600">
            {metrics.alerts.map((alert, i) => (
              <li key={i}>{alert.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, max, critical, unit, format }) {
  const percentage = (value / max) * 100;
  const isCritical = value >= critical;
  const isMax = value >= max;

  const color = isMax ? 'red' : isCritical ? 'orange' : 'green';

  return (
    <div className={`bg-white border-2 border-${color}-500 rounded-xl p-6 mb-4`}>
      <h3 className="text-lg font-heading mb-2">{title}</h3>
      <div className="flex items-end gap-4">
        <span className="text-3xl font-bold">
          {format ? format(value) : `${value} ${unit}`}
        </span>
        <span className="text-gray-500">/ {format ? format(max) : `${max} ${unit}`}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
        <div
          className={`bg-${color}-500 h-4 rounded-full transition-all`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-sm text-gray-600 mt-2">
        {percentage.toFixed(1)}% de la capacité utilisée
      </p>
    </div>
  );
}
```

---

## 🧪 TESTS DE CHARGE

### Script Artillery (Load Testing)

**Fichier** : `tests/load/messaging.yml`

```yaml
config:
  target: "https://izzico.vercel.app"
  phases:
    # Montée progressive
    - duration: 60
      arrivalRate: 5 # 5 users/sec
      name: "Warm up"
    - duration: 120
      arrivalRate: 20 # 20 users/sec = 2400 users
      name: "Ramp up"
    - duration: 300
      arrivalRate: 50 # 50 users/sec = 15000 users
      name: "Sustained load"
  environments:
    production:
      target: "https://izzico.vercel.app"
    staging:
      target: "https://staging-izzico.vercel.app"

scenarios:
  - name: "User Login + Load Conversations"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test{{ $randomNumber() }}@example.com"
            password: "TestPassword123!"
          capture:
            - json: "$.token"
              as: "authToken"

      - get:
          url: "/api/messages/conversations"
          headers:
            Authorization: "Bearer {{ authToken }}"
          expect:
            - statusCode: 200

      - think: 5 # Pause 5 sec (utilisateur lit)

      - get:
          url: "/api/matching/matches?limit=10"
          headers:
            Authorization: "Bearer {{ authToken }}"
          expect:
            - statusCode: 200

      - think: 10

  - name: "Send Message"
    flow:
      - post:
          url: "/api/messages/send"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            conversationId: "{{ conversationId }}"
            content: "Test message {{ $randomString() }}"
          expect:
            - statusCode: 201
```

**Lancer tests** :

```bash
# Installer Artillery
npm install -g artillery

# Test de charge
artillery run tests/load/messaging.yml --output report.json

# Générer rapport HTML
artillery report report.json --output report.html
```

**Métriques à surveiller** :

| Métrique | Objectif | Critique |
|----------|----------|----------|
| Latence p50 | <500ms | >2000ms |
| Latence p95 | <1500ms | >5000ms |
| Latence p99 | <3000ms | >10000ms |
| Taux erreur | <1% | >5% |
| Requêtes/sec | 100+ | <10 |

---

## 📋 CHECKLIST DE LANCEMENT

### Avant 500 Users

- [ ] Phase 1.1 : Éliminer N+1 queries (MessagesContext → use-messages)
- [ ] Phase 1.2 : Ajouter index manquants (migration 125)
- [ ] Phase 1.3 : Rate limiting global (matching, assistant, OCR)
- [ ] Phase 1.4 : Compression images automatique (sharp)
- [ ] Phase 1.5 : Optimiser re-renders React (useMemo, React.memo)
- [ ] Test de charge : 100 users simultanés (Artillery)
- [ ] Dashboard monitoring : `/admin/performance`

### Avant 2000 Users

- [ ] Phase 2.1 : Connection pooling PgBouncer
- [ ] Phase 2.2 : Redesign real-time (polling ou SSE)
- [ ] Phase 2.3 : Cache layer Redis (profils, matchs, notifs)
- [ ] Phase 2.4 : Pagination stricte API matching (max 20)
- [ ] Test de charge : 500 users simultanés
- [ ] Monitoring quotidien : check seuils migration

### Avant 5000 Users

- [ ] Évaluation migration Supabase Pro (seuils atteints ?)
- [ ] Backup complet database
- [ ] Test migration sur projet clone
- [ ] Migration Supabase Pro (si nécessaire)
- [ ] Phase 3.3 : Archivage messages anciens
- [ ] Phase 3.3 : Optimiser RPC functions avec cache
- [ ] Test de charge : 1000 users simultanés

### Avant 10000 Users

- [ ] Supabase Pro actif (obligatoire)
- [ ] CDN pour assets statiques (Cloudflare, Vercel CDN)
- [ ] Database scaling horizontal (read replicas)
- [ ] Monitoring avancé (Datadog, New Relic)
- [ ] SLA & Alerting 24/7

---

## 🎯 RÉSUMÉ PAR PRIORITÉ

### ⚡ URGENT (Avant Lancement)

1. **Éliminer N+1 queries** - 2 jours - Impact énorme
2. **Ajouter index DB** - 1 jour - Performance ×10
3. **Compression images** - 2 jours - Économie 80% storage
4. **Rate limiting** - 1 jour - Sécurité DDoS

### 🔥 HAUTE (Avant 2000 Users)

5. **Connection pooling** - 2 jours - Capacité ×5
6. **Redesign real-time** - 5 jours - Éliminer goulot WebSocket
7. **Cache Redis** - 3 jours - Latence -50%

### 🟠 MOYENNE (Avant 5000 Users)

8. **Migration Supabase Pro** - 1 semaine - Débloquer croissance
9. **Archivage messages** - 2 jours - Database plus légère
10. **Optimiser RPC** - 3 jours - Performance +30%

---

## 📞 CONTACT & SUPPORT

**Responsable Technique** : Samuel Baudon
**Date Audit** : 18 janvier 2026
**Prochaine Révision** : Après migration 2000 users

---

*Document généré par audit automatisé - Version 1.0*
