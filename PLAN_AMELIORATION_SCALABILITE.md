# Plan d'Amélioration Scalabilité - Roadmap Exécution

**Date début** : 19 janvier 2026
**Durée totale estimée** : 4 semaines (phases 1 + 2)
**Objectif** : Préparer Izzico pour 10 000 MAU

---

## 🎯 PHILOSOPHIE DU PLAN

1. **Performance AVANT économie** : Ne jamais sacrifier l'UX pour économiser
2. **Optimiser le code TOUJOURS** : Même si on paie Supabase Pro plus tard
3. **Progression mesurée** : Chaque phase = tests + validation avant de continuer
4. **Monitoring continu** : Détecter automatiquement quand migrer vers paid tier

---

## 📅 SEMAINE 1 : OPTIMISATIONS CRITIQUES

### Jour 1 : Éliminer N+1 Queries (PRIORITÉ MAX ⚡)

**Objectif** : Réduire 70% des requêtes DB sur messagerie

#### Étape 1.1 : Audit du code actuel
```bash
# Identifier tous les usages de MessagesContext
npm run grep "useMessages" --glob="**/*.tsx"
npm run grep "MessagesContext" --glob="**/*.tsx"
```

**Fichiers à modifier** :
- [ ] `contexts/MessagesContext.tsx` → marquer comme deprecated
- [ ] `app/messages/page.tsx` → migrer vers use-messages hook
- [ ] `components/messages/ConversationList.tsx` → migrer
- [ ] `components/layout/ModernSearcherHeaderV3.tsx` (badge notifs) → migrer
- [ ] Tous les autres composants utilisant MessagesContext

#### Étape 1.2 : Créer wrapper de transition

**Nouveau fichier** : `lib/hooks/use-messages-v2.ts`

```typescript
/**
 * Hook unifié pour la messagerie - Version 2 (optimisée)
 * Remplace contexts/MessagesContext.tsx
 *
 * Optimisations :
 * - 3 requêtes parallèles au lieu de N séquentielles
 * - Mémoisation des résultats
 * - Debouncing des updates real-time
 */
import { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useMessagesV2(userId: string) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger conversations (version optimisée)
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);

      // REQUÊTE 1 : Conversations de l'utilisateur
      const { data: conversationsData, error: convError } = await supabase
        .from('conversation_participants')
        .select(`
          conversation_id,
          conversation:conversations (
            id,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', userId);

      if (convError) throw convError;

      const conversationIds = conversationsData.map(cp => cp.conversation_id);

      // REQUÊTES 2 + 3 : En parallèle
      const [participantsResult, messagesResult] = await Promise.all([
        // Tous les participants de toutes les conversations
        supabase
          .from('conversation_participants')
          .select(`
            conversation_id,
            user_id,
            user:user_profiles (
              id,
              first_name,
              last_name,
              avatar_url,
              user_type
            )
          `)
          .in('conversation_id', conversationIds),

        // Dernier message de chaque conversation
        supabase
          .from('messages')
          .select('*')
          .in('conversation_id', conversationIds)
          .order('created_at', { ascending: false })
          .limit(1),
      ]);

      if (participantsResult.error) throw participantsResult.error;
      if (messagesResult.error) throw messagesResult.error;

      // Enrichir conversations avec participants + dernier message
      const enriched = conversationsData.map(cp => {
        const conversation = cp.conversation;
        const participants = participantsResult.data.filter(
          p => p.conversation_id === conversation.id && p.user_id !== userId
        );
        const lastMessage = messagesResult.data.find(
          m => m.conversation_id === conversation.id
        );

        return {
          ...conversation,
          participants: participants.map(p => p.user),
          lastMessage,
          unreadCount: 0, // TODO: calculer avec query dédiée
        };
      });

      setConversations(enriched);
      setError(null);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Charger au mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Real-time updates (avec debounce)
  useEffect(() => {
    let debounceTimeout: NodeJS.Timeout;

    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, () => {
        // Debounce : attendre 500ms avant de recharger
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          loadConversations();
        }, 500);
      })
      .subscribe();

    return () => {
      clearTimeout(debounceTimeout);
      channel.unsubscribe();
    };
  }, [loadConversations]);

  // Mémoriser résultats
  const value = useMemo(() => ({
    conversations,
    loading,
    error,
    reload: loadConversations,
  }), [conversations, loading, error, loadConversations]);

  return value;
}
```

#### Étape 1.3 : Tests de validation

```bash
# Test avec données de démo
npm run seed:demo

# Lancer app en dev
npm run dev

# Ouvrir messagerie et vérifier :
# 1. Conversations chargent correctement
# 2. Nouveau message apparaît sans refresh
# 3. Performance : <500ms pour charger 10 conversations
```

#### Étape 1.4 : Mesurer l'impact

**Avant** :
- 10 conversations = 20-30 requêtes
- Temps de chargement : 1-2 sec

**Après** :
- 10 conversations = 3 requêtes parallèles
- Temps de chargement : 200-500ms

**Gain** : -85% de requêtes, -75% de latence

---

### Jour 2 : Ajouter Index Manquants

**Objectif** : Accélérer requêtes DB ×10

#### Étape 2.1 : Créer migration

**Fichier** : `supabase/migrations/125_add_scalability_indexes.sql`

```sql
-- Migration 125: Add critical indexes for scalability
-- Date: 2026-01-19
-- Impact: 10-100× faster queries on conversation lookups, matching, reactions

-- ============================================================================
-- MESSAGING INDEXES
-- ============================================================================

-- Conversation participants lookup (used on every inbox load)
-- BEFORE: Sequential scan on 10k rows = 50-100ms
-- AFTER: Index scan = 1-5ms
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_conversation
  ON public.conversation_participants(user_id, conversation_id);

COMMENT ON INDEX idx_conversation_participants_user_conversation IS
  'Optimizes conversation list loading for users (useMessagesV2 hook)';

-- Messages lookup by conversation (for display)
-- BEFORE: Sequential scan when loading conversation details
-- AFTER: Index scan for instant message history
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created
  ON public.messages(conversation_id, created_at DESC);

COMMENT ON INDEX idx_messages_conversation_created IS
  'Optimizes message history loading in chronological order';

-- Mark messages as read trigger performance
-- Used by: trigger_mark_messages_as_read (migration 027)
-- BEFORE: Sequential scan on UPDATE messages SET read_at = ...
-- AFTER: Index scan targeting exact messages to update
CREATE INDEX IF NOT EXISTS idx_messages_conversation_sender_read
  ON public.messages(conversation_id, sender_id, read_at, created_at)
  WHERE read_at IS NULL;

COMMENT ON INDEX idx_messages_conversation_sender_read IS
  'Optimizes mark_messages_as_read() trigger - partial index on unread only';

-- Message reactions display
-- BEFORE: Full table scan to count reactions per message
-- AFTER: Index scan for instant reaction counts
CREATE INDEX IF NOT EXISTS idx_message_reactions_message_emoji
  ON public.message_reactions(message_id, emoji);

COMMENT ON INDEX idx_message_reactions_message_emoji IS
  'Optimizes reaction counts and display (grouped by emoji)';

-- ============================================================================
-- MATCHING INDEXES
-- ============================================================================

-- User profiles for matching algorithm
-- Used by: RPC calculate_match_score, matching algorithm
-- BEFORE: Sequential scan on user_profiles table
-- AFTER: Index scan for instant profile lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_completion
  ON public.user_profiles(user_id, profile_completion_score);

COMMENT ON INDEX idx_user_profiles_user_completion IS
  'Optimizes matching algorithm and profile completeness checks';

-- Match scores lookup
-- BEFORE: Full table scan to find user matches
-- AFTER: Index scan for instant match retrieval
CREATE INDEX IF NOT EXISTS idx_matches_user_score
  ON public.matches(user_id, match_score DESC, status)
  WHERE status IN ('active', 'viewed');

COMMENT ON INDEX idx_matches_user_score IS
  'Optimizes match list loading sorted by score (partial index on active matches only)';

-- ============================================================================
-- NOTIFICATIONS INDEXES
-- ============================================================================

-- Notifications by user (chronological)
-- BEFORE: Sequential scan on notifications table
-- AFTER: Index scan for instant notification feed
CREATE INDEX IF NOT EXISTS idx_notifications_user_created
  ON public.notifications(user_id, created_at DESC);

COMMENT ON INDEX idx_notifications_user_created IS
  'Optimizes notification feed loading in reverse chronological order';

-- Unread notifications count
-- BEFORE: Full table scan to count unread
-- AFTER: Index-only scan for instant badge count
CREATE INDEX IF NOT EXISTS idx_notifications_user_read
  ON public.notifications(user_id, read)
  WHERE read = FALSE;

COMMENT ON INDEX idx_notifications_user_read IS
  'Optimizes unread notification count (partial index on unread only)';

-- ============================================================================
-- REAL-TIME FEATURES INDEXES
-- ============================================================================

-- Typing indicators cleanup
-- Used by: cleanup_old_typing_indicators() function
-- BEFORE: Sequential scan to delete old indicators
-- AFTER: Index scan for fast cleanup
CREATE INDEX IF NOT EXISTS idx_typing_indicators_updated
  ON public.typing_indicators(updated_at)
  WHERE updated_at < NOW() - INTERVAL '10 seconds';

COMMENT ON INDEX idx_typing_indicators_updated IS
  'Optimizes cleanup_old_typing_indicators() - partial index on stale only';

-- Typing indicators display
-- BEFORE: Sequential scan to show "X is typing..."
-- AFTER: Index scan for instant typing status
CREATE INDEX IF NOT EXISTS idx_typing_indicators_conversation_user
  ON public.typing_indicators(conversation_id, user_id);

COMMENT ON INDEX idx_typing_indicators_conversation_user IS
  'Optimizes real-time typing indicator display';

-- ============================================================================
-- PROPERTIES & SEARCH INDEXES
-- ============================================================================

-- Properties search by location + status
-- BEFORE: Sequential scan on properties table
-- AFTER: Index scan for instant search results
CREATE INDEX IF NOT EXISTS idx_properties_city_status_available
  ON public.properties(city, status, available_from)
  WHERE status = 'active';

COMMENT ON INDEX idx_properties_city_status_available IS
  'Optimizes property search by city (partial index on active only)';

-- ============================================================================
-- ANALYTICS
-- ============================================================================

-- Analyze tables to update statistics (helps query planner)
ANALYZE public.conversation_participants;
ANALYZE public.messages;
ANALYZE public.message_reactions;
ANALYZE public.user_profiles;
ANALYZE public.matches;
ANALYZE public.notifications;
ANALYZE public.typing_indicators;
ANALYZE public.properties;

-- ============================================================================
-- VALIDATION
-- ============================================================================

-- Check that all indexes were created
DO $$
DECLARE
  expected_indexes TEXT[] := ARRAY[
    'idx_conversation_participants_user_conversation',
    'idx_messages_conversation_created',
    'idx_messages_conversation_sender_read',
    'idx_message_reactions_message_emoji',
    'idx_user_profiles_user_completion',
    'idx_matches_user_score',
    'idx_notifications_user_created',
    'idx_notifications_user_read',
    'idx_typing_indicators_updated',
    'idx_typing_indicators_conversation_user',
    'idx_properties_city_status_available'
  ];
  idx TEXT;
  missing_indexes TEXT[] := '{}';
BEGIN
  FOREACH idx IN ARRAY expected_indexes
  LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes WHERE indexname = idx
    ) THEN
      missing_indexes := array_append(missing_indexes, idx);
    END IF;
  END LOOP;

  IF array_length(missing_indexes, 1) > 0 THEN
    RAISE EXCEPTION 'Missing indexes: %', array_to_string(missing_indexes, ', ');
  ELSE
    RAISE NOTICE 'All scalability indexes created successfully ✓';
  END IF;
END $$;
```

#### Étape 2.2 : Appliquer migration

```bash
# Se connecter à Supabase
npx supabase db push

# Vérifier que indexes sont créés
npx supabase db query "SELECT indexname FROM pg_indexes WHERE schemaname = 'public' ORDER BY indexname;"
```

#### Étape 2.3 : Valider performance

```sql
-- Tester requête conversation_participants AVANT index
EXPLAIN ANALYZE
SELECT * FROM conversation_participants
WHERE user_id = 'xxx';
-- Résultat AVANT: "Seq Scan ... (cost=0.00..500.00 rows=100 ...)" = 50-100ms

-- Résultat APRÈS: "Index Scan using idx_... (cost=0.00..8.50 rows=1 ...)" = 1-5ms
-- Gain: 10-20× plus rapide
```

---

### Jour 3 : Rate Limiting Global

**Objectif** : Protéger tous les endpoints critiques

#### Étape 3.1 : Setup Upstash Redis

```bash
# 1. Créer compte Upstash (gratuit) : https://upstash.com
# 2. Créer database Redis
# 3. Copier credentials dans .env.local
```

**Fichier** : `.env.local`
```bash
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXX...
```

#### Étape 3.2 : Créer middleware rate limiting

**Fichier** : `lib/middleware/rate-limit.ts`

```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Limiters par type d'endpoint
export const limiters = {
  // Matching : 20 requêtes par minute
  matching: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'),
    analytics: true,
    prefix: 'ratelimit:matching',
  }),

  // Assistant IA : 10 requêtes par minute (coût LLM)
  assistant: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
    prefix: 'ratelimit:assistant',
  }),

  // Endpoints coûteux (OCR, génération) : 5 requêtes par minute
  expensive: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 m'),
    analytics: true,
    prefix: 'ratelimit:expensive',
  }),

  // Analytics : 100 requêtes par minute
  analytics: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
    prefix: 'ratelimit:analytics',
  }),
};

/**
 * Vérifie rate limit pour un utilisateur
 * @param userId - ID utilisateur (ou IP si anonymous)
 * @param type - Type de limiter à utiliser
 * @returns NextResponse avec 429 si limite atteinte, null sinon
 */
export async function checkRateLimit(
  userId: string,
  type: keyof typeof limiters
): Promise<NextResponse | null> {
  const limiter = limiters[type];
  const { success, limit, remaining, reset } = await limiter.limit(userId);

  if (!success) {
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: `Vous avez atteint la limite de ${limit} requêtes par minute. Réessayez dans ${Math.ceil((reset - Date.now()) / 1000)} secondes.`,
        limit,
        remaining: 0,
        reset: new Date(reset).toISOString(),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': reset.toString(),
          'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  return null; // Rate limit OK
}

/**
 * Helper pour ajouter headers rate limit à une response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  limit: number,
  remaining: number,
  reset: number
): NextResponse {
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());
  return response;
}
```

#### Étape 3.3 : Appliquer sur endpoints

**Exemple** : `app/api/matching/matches/route.ts`

```typescript
import { checkRateLimit } from '@/lib/middleware/rate-limit';

export async function GET(request: NextRequest) {
  // 1. Vérifier auth
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Rate limiting
  const rateLimitResponse = await checkRateLimit(session.user.id, 'matching');
  if (rateLimitResponse) {
    return rateLimitResponse; // 429 Too Many Requests
  }

  // 3. Traitement normal
  const matches = await supabase
    .from('matches')
    .select('*')
    .eq('user_id', session.user.id)
    .limit(20);

  return NextResponse.json(matches);
}
```

**Endpoints à protéger** :
- [ ] `app/api/matching/matches/route.ts` → type: 'matching'
- [ ] `app/api/matching/generate/route.ts` → type: 'matching'
- [ ] `app/api/assistant/chat/route.ts` → type: 'assistant'
- [ ] `app/api/rooms/search-aesthetic/route.ts` → type: 'expensive'
- [ ] `app/api/owner/payments/reminder/route.ts` → type: 'expensive'
- [ ] `app/api/alerts/run/route.ts` → type: 'expensive'

---

### Jours 4-5 : Compression Images Automatique

**Objectif** : Réduire 80-90% du stockage

#### Étape 4.1 : Installer sharp

```bash
npm install sharp
npm install --save-dev @types/sharp
```

#### Étape 4.2 : Modifier storage service

**Fichier** : `lib/services/storage-service.ts`

```typescript
import sharp from 'sharp';

export class StorageService {
  // ... code existant ...

  /**
   * Optimise une image avant upload
   * - Conversion WebP (meilleur ratio compression)
   * - Redimensionnement adaptatif
   * - Qualité 85 (imperceptible vs 100, -50% taille)
   */
  private async optimizeImage(
    file: File,
    options: {
      type: 'avatar' | 'property' | 'document';
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    }
  ): Promise<{ file: File; sizeReduction: number }> {
    // Skip si pas une image
    if (!file.type.startsWith('image/')) {
      return { file, sizeReduction: 0 };
    }

    const originalSize = file.size;
    const buffer = Buffer.from(await file.arrayBuffer());

    let optimized: Buffer;

    switch (options.type) {
      case 'avatar':
        // Avatar : carré 512×512, WebP qualité 85
        optimized = await sharp(buffer)
          .resize(512, 512, {
            fit: 'cover',
            position: 'center',
          })
          .webp({ quality: 85 })
          .toBuffer();
        break;

      case 'property':
        // Propriété : max 2048px largeur, conserve ratio, WebP 85
        optimized = await sharp(buffer)
          .resize(options.maxWidth || 2048, null, {
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 85 })
          .toBuffer();
        break;

      case 'document':
        // Documents : pas de compression (PDF, etc.)
        return { file, sizeReduction: 0 };

      default:
        return { file, sizeReduction: 0 };
    }

    const optimizedSize = optimized.length;
    const sizeReduction = ((originalSize - optimizedSize) / originalSize) * 100;

    // Créer nouveau File avec buffer optimisé
    const blob = new Blob([optimized], { type: 'image/webp' });
    const optimizedFile = new File(
      [blob],
      file.name.replace(/\.\w+$/, '.webp'),
      { type: 'image/webp' }
    );

    console.log(
      `Image optimized: ${(originalSize / 1024).toFixed(0)} KB → ${(optimizedSize / 1024).toFixed(0)} KB (${sizeReduction.toFixed(1)}% reduction)`
    );

    return { file: optimizedFile, sizeReduction };
  }

  /**
   * Upload avatar (optimisé)
   */
  async uploadAvatar(file: File, userId: string): Promise<UploadResult> {
    const { file: optimizedFile } = await this.optimizeImage(file, {
      type: 'avatar',
    });

    return this.uploadFile(optimizedFile, 'profile-photos', userId);
  }

  /**
   * Upload photo propriété (optimisé)
   */
  async uploadPropertyImage(
    file: File,
    propertyId: string
  ): Promise<UploadResult> {
    const { file: optimizedFile } = await this.optimizeImage(file, {
      type: 'property',
      maxWidth: 2048,
    });

    return this.uploadFile(optimizedFile, 'property-images', propertyId);
  }

  /**
   * Upload document (pas d'optimisation)
   */
  async uploadDocument(
    file: File,
    userId: string
  ): Promise<UploadResult> {
    return this.uploadFile(file, 'application-documents', userId);
  }
}
```

#### Étape 4.3 : Tester compression

```typescript
// Test unitaire
import { StorageService } from '@/lib/services/storage-service';

async function testImageOptimization() {
  const storageService = new StorageService();

  // Créer fake file (5 MB)
  const fakeImage = new File([new ArrayBuffer(5 * 1024 * 1024)], 'test.jpg', {
    type: 'image/jpeg',
  });

  const result = await storageService.uploadAvatar(fakeImage, 'test-user-id');

  console.log('Original size:', 5 * 1024, 'KB');
  console.log('Optimized size:', result.sizeReduction, 'KB');
  console.log('Reduction:', result.sizeReduction, '%');
}
```

**Résultat attendu** :
- Avatar 2 MB → ~100 KB (95% réduction)
- Photo propriété 5 MB → ~500 KB (90% réduction)

---

## 📅 SEMAINE 2 : OPTIMISATIONS REACT

### Jour 6 : Mémorisation Contextes

**Objectif** : Éliminer re-renders inutiles

#### Code à appliquer :

```typescript
// contexts/MessagesContext.tsx
import { useMemo, useCallback } from 'react';

const value = useMemo(
  () => ({
    conversations,
    sendMessage,
    markAsRead,
    loading,
    error,
  }),
  [conversations, sendMessage, markAsRead, loading, error]
);
```

---

### Jours 7-10 : Tests de Charge

**Objectif** : Valider que Phase 1 fonctionne

#### Setup Artillery

```bash
npm install -g artillery
mkdir -p tests/load
```

**Créer** : `tests/load/messaging.yml`

```yaml
config:
  target: "http://localhost:3000"
  phases:
    - duration: 60
      arrivalRate: 5
      name: "Warm up"
    - duration: 120
      arrivalRate: 20
      name: "Load test"

scenarios:
  - name: "Load Conversations"
    flow:
      - get:
          url: "/api/messages/conversations"
          headers:
            Authorization: "Bearer {{ authToken }}"
```

**Lancer tests** :

```bash
artillery run tests/load/messaging.yml --output report.json
artillery report report.json
```

**Métriques attendues après Phase 1** :
- Latence p50 : <300ms (avant: 1-2 sec)
- Latence p95 : <800ms (avant: 3-5 sec)
- Requêtes DB : -70%
- Storage utilisé : -80%

---

## 📅 SEMAINE 3-4 : PHASE 2 (Si >2000 users)

### Connection Pooling PgBouncer
### Redesign Real-Time Architecture
### Cache Layer Redis

*(Détails dans AUDIT_PERFORMANCE_SCALABILITE.md)*

---

## 📊 VALIDATION & GO/NO-GO

### Checklist avant chaque phase

**Avant Phase 2** :
- [ ] Phase 1 complétée à 100%
- [ ] Tests de charge passés (500 users simultanés)
- [ ] Monitoring montre >1500 MAU actifs
- [ ] Aucun bug critique introduit

**Avant Phase 3 (Migration Supabase Pro)** :
- [ ] Un indicateur dépasse 80% de limite Free tier
- [ ] Backup DB complet réalisé
- [ ] Test migration sur projet clone réussi
- [ ] Budget mensuel €100+ approuvé

---

## 🎯 RESPONSABILITÉS

| Phase | Responsable | Validation |
|-------|-------------|------------|
| Phase 1.1 (N+1) | Dev Lead | Code review + tests |
| Phase 1.2 (Indexes) | Dev Lead | EXPLAIN ANALYZE |
| Phase 1.3 (Rate limit) | Dev Lead | Test Artillery |
| Phase 1.4 (Images) | Dev Lead | Vérif storage Supabase |
| Phase 2 | Dev Lead + DevOps | Monitoring 7 jours |
| Phase 3 | DevOps | Migration réussie |

---

*Roadmap mise à jour : 19 janvier 2026*
