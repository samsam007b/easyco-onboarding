/**
 * Rate Limiting Middleware
 * Protège les endpoints API contre les abus et DDoS
 *
 * CONFIGURATION REQUISE :
 * - Upstash Redis gratuit : https://upstash.com
 * - Ajouter dans .env.local :
 *   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
 *   UPSTASH_REDIS_REST_TOKEN=AXX...
 *
 * USAGE :
 * import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';
 *
 * export async function POST(request: NextRequest) {
 *   const rateLimitResponse = await rateLimitMiddleware(request, 'matching', userId);
 *   if (rateLimitResponse) return rateLimitResponse; // 429 Too Many Requests
 *
 *   // ... traitement normal
 * }
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Vérifier que les credentials Upstash sont configurés
const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Si Upstash n'est pas configuré, on désactive le rate limiting (mode graceful degradation)
const RATE_LIMITING_ENABLED = !!(UPSTASH_URL && UPSTASH_TOKEN);

// Créer client Redis seulement si configuré
let redis: Redis | null = null;
if (RATE_LIMITING_ENABLED) {
  redis = new Redis({
    url: UPSTASH_URL!,
    token: UPSTASH_TOKEN!,
  });
}

// ============================================================================
// LIMITERS PAR TYPE D'ENDPOINT
// ============================================================================

/**
 * Configuration des limiters par type d'endpoint
 * Format : X requêtes par Y minutes
 */
const limiterConfigs = {
  // Matching : 20 requêtes par minute (recherche colocataires, génération matchs)
  matching: {
    requests: 20,
    window: '1 m',
  },

  // Assistant IA : 10 requêtes par minute (coût LLM élevé)
  assistant: {
    requests: 10,
    window: '1 m',
  },

  // Endpoints coûteux (OCR, génération documents) : 5 requêtes par minute
  expensive: {
    requests: 5,
    window: '1 m',
  },

  // Analytics : 100 requêtes par minute (déjà existant, on le garde)
  analytics: {
    requests: 100,
    window: '1 m',
  },

  // Messagerie : 30 requêtes par minute (envoi messages)
  messaging: {
    requests: 30,
    window: '1 m',
  },

  // Upload fichiers : 10 uploads par minute (éviter spam)
  upload: {
    requests: 10,
    window: '1 m',
  },
};

// Créer les limiters si Redis est configuré
const limiters: Record<keyof typeof limiterConfigs, Ratelimit | null> = {
  matching: null,
  assistant: null,
  expensive: null,
  analytics: null,
  messaging: null,
  upload: null,
};

if (RATE_LIMITING_ENABLED && redis) {
  Object.entries(limiterConfigs).forEach(([key, config]) => {
    limiters[key as keyof typeof limiters] = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(config.requests, config.window),
      analytics: true,
      prefix: `ratelimit:${key}`,
    });
  });
}

// ============================================================================
// MIDDLEWARE FUNCTION
// ============================================================================

export type RateLimitType = keyof typeof limiterConfigs;

/**
 * Vérifie le rate limit pour un utilisateur/endpoint
 *
 * @param request - NextRequest object
 * @param type - Type de limiter à utiliser
 * @param identifier - User ID ou IP address (pour identifier l'utilisateur)
 * @returns NextResponse avec 429 si limite atteinte, null sinon
 *
 * @example
 * const rateLimitResponse = await rateLimitMiddleware(request, 'matching', userId);
 * if (rateLimitResponse) return rateLimitResponse;
 */
export async function rateLimitMiddleware(
  request: NextRequest,
  type: RateLimitType,
  identifier: string
): Promise<NextResponse | null> {
  // Si rate limiting désactivé, on laisse passer
  if (!RATE_LIMITING_ENABLED) {
    console.warn('[Rate Limit] Upstash not configured - rate limiting disabled');
    return null;
  }

  const limiter = limiters[type];
  if (!limiter) {
    console.error(`[Rate Limit] No limiter found for type: ${type}`);
    return null;
  }

  try {
    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    // Ajouter headers de rate limit à la réponse (même si succès)
    const headers = {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    };

    if (!success) {
      // Limite atteinte
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);

      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: `Vous avez atteint la limite de ${limit} requêtes par minute. Réessayez dans ${retryAfter} secondes.`,
          limit,
          remaining: 0,
          reset: new Date(reset).toISOString(),
          retryAfter,
        },
        {
          status: 429,
          headers: {
            ...headers,
            'Retry-After': retryAfter.toString(),
          },
        }
      );
    }

    // Limite OK, on retourne null (pas de blocage)
    return null;
  } catch (error) {
    // En cas d'erreur Upstash, on laisse passer (graceful degradation)
    console.error('[Rate Limit] Error checking rate limit:', error);
    return null;
  }
}

/**
 * Helper pour ajouter les headers de rate limit à une réponse existante
 * Utile si tu veux ajouter les headers même quand la requête passe
 */
export async function addRateLimitHeaders(
  response: NextResponse,
  type: RateLimitType,
  identifier: string
): Promise<NextResponse> {
  if (!RATE_LIMITING_ENABLED) return response;

  const limiter = limiters[type];
  if (!limiter) return response;

  try {
    const { limit, remaining, reset } = await limiter.limit(identifier);

    response.headers.set('X-RateLimit-Limit', limit.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', reset.toString());
  } catch (error) {
    console.error('[Rate Limit] Error adding headers:', error);
  }

  return response;
}

/**
 * Helper pour obtenir un identifier unique pour l'utilisateur
 * Préfère user ID si disponible, sinon utilise IP
 */
export function getRateLimitIdentifier(request: NextRequest, userId?: string): string {
  if (userId) return userId;

  // Fallback sur IP
  const ip = request.ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous';

  return `ip:${ip}`;
}

// ============================================================================
// EXPORTS
// ============================================================================

export { RATE_LIMITING_ENABLED, limiterConfigs };
