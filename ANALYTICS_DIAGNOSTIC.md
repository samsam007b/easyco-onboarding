# 🔍 DIAGNOSTIC COMPLET - Système Analytics
## Analyse réalisée le 17 novembre 2025

---

## 📋 RÉSUMÉ EXÉCUTIF

**Statut global:** ⚠️ ATTENTION REQUISE
**Bugs critiques détectés:** 3
**Warnings:** 5
**Optimisations recommandées:** 8

---

## 🐛 BUGS CRITIQUES IDENTIFIÉS

### 1. ❌ **React Hooks - Dépendances manquantes dans useEffect**

**Fichier:** `app/onboarding/searcher/quick/basic-info/page.tsx:26-32`

**Problème:**
```tsx
useEffect(() => {
  loadExistingData();

  // Track that user started the Quick Start onboarding
  trackOnboardingStarted();
  trackQuickStartFunnel.modeSelected({ mode: 'quick' });
}, []);  // ❌ Dépendances manquantes!
```

**Impact:**
- ESLint warning `react-hooks/exhaustive-deps`
- Les fonctions `trackOnboardingStarted` et `loadExistingData` peuvent changer entre les renders
- Peut causer des appels multiples ou manqués

**Solution:**
```tsx
useEffect(() => {
  loadExistingData();
  trackOnboardingStarted();
  trackQuickStartFunnel.modeSelected({ mode: 'quick' });
}, [trackOnboardingStarted, loadExistingData]); // ✅ Ajouter dépendances

// OU utiliser useRef pour éviter re-renders:
const hasTrackedStart = useRef(false);
useEffect(() => {
  if (!hasTrackedStart.current) {
    loadExistingData();
    trackOnboardingStarted();
    trackQuickStartFunnel.modeSelected({ mode: 'quick' });
    hasTrackedStart.current = true;
  }
}, [trackOnboardingStarted, loadExistingData]);
```

---

### 2. ⚠️ **Double tracking dans Analytics.tsx**

**Fichier:** `components/Analytics.tsx:32 et 35-42`

**Problème:**
```tsx
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Hook 1: usePageTracking() appelle trackPageView()
  usePageTracking();  // ⚠️

  // Hook 2: useEffect appelle aussi trackPageView() indirectement via gtag
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const url = pathname + searchParams.toString();
      (window as any).gtag('config', GA_MEASUREMENT_ID, {
        page_path: url,
      });
    }
  }, [pathname, searchParams]);  // ⚠️
}
```

**Impact:**
- **DOUBLE TRACKING**: Chaque page view est envoyée 2 fois à GA4
- Fausse les métriques analytics
- Surcharge inutile des providers

**Solution:**
```tsx
// Option 1: Supprimer le useEffect redondant
export default function Analytics() {
  usePageTracking();  // ✅ Suffit!

  // Supprimer le useEffect avec gtag config
}

// Option 2: Garder seulement le useEffect et enlever usePageTracking()
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = pathname + searchParams.toString();
      trackPageView(pathname);  // ✅ Appel unique

      if (window.gtag) {
        window.gtag('config', GA_MEASUREMENT_ID, {
          page_path: url,
        });
      }
    }
  }, [pathname, searchParams]);
}
```

---

### 3. 🔄 **Re-render loops potentiels dans useOnboardingFunnel**

**Fichier:** `lib/analytics/use-analytics.ts:334-383`

**Problème:**
Les callbacks dépendent de `mode`, mais dans `basic-info/page.tsx`, le hook est appelé avec un string literal constant. Ce n'est pas un bug actuellement, mais peut le devenir si `mode` devient une variable.

**Solution préventive:**
```tsx
// Dans basic-info/page.tsx
const MODE = 'quick' as const;  // ✅ Constante
const { trackStepCompleted, trackOnboardingStarted } = useOnboardingFunnel(MODE);
```

---

## ⚠️ WARNINGS ET PROBLÈMES MINEURS

### 4. 📊 **Analytics en development mode**

**Fichier:** `lib/analytics/event-tracker.ts:175-178` et `components/Analytics.tsx:50-52`

**Problème:**
```tsx
// event-tracker.ts
if (process.env.NODE_ENV === 'development') {
  console.log('📊 [Analytics]', eventName, properties);
  return;  // Ne track pas en dev
}

// Analytics.tsx
if (isDevelopment) {
  return null;  // Scripts analytics non chargés en dev
}
```

**Impact:**
- ✅ Bon pour la performance dev
- ❌ Impossible de tester analytics en développement local
- ❌ Les développeurs ne peuvent pas vérifier que les events fonctionnent

**Recommandation:**
```tsx
// Option: Mode debug avec variable d'environnement
const ANALYTICS_DEBUG = process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === 'true';
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment && !ANALYTICS_DEBUG) {
  console.log('📊 [Analytics Debug]', eventName, properties);
  return;
}

// Permettre: NEXT_PUBLIC_ANALYTICS_DEBUG=true npm run dev
```

---

### 5. 🔐 **Validation insuffisante des event properties**

**Fichier:** `lib/analytics/event-tracker.ts:161-206`

**Problème:**
Aucune validation des propriétés des événements avant envoi.

**Risques:**
- Propriétés `undefined` ou `null` envoyées
- Types incorrects (objets complexes au lieu de primitives)
- PII (Personally Identifiable Information) accidentellement envoyée

**Solution:**
```tsx
export function trackEvent(
  eventName: string,
  properties?: EventProperties
): void {
  if (typeof window === 'undefined') return;

  // ✅ Valider et nettoyer les propriétés
  const cleanProperties = sanitizeEventProperties(properties);

  // ✅ Vérifier qu'on n'envoie pas de PII
  if (containsPII(cleanProperties)) {
    console.error('⚠️ Analytics: Blocked event with potential PII');
    return;
  }

  // Continue...
}

function sanitizeEventProperties(props?: EventProperties): EventProperties {
  if (!props) return {};

  return Object.entries(props).reduce((acc, [key, value]) => {
    // Filtrer undefined, null, objets complexes
    if (value === undefined || value === null) return acc;
    if (typeof value === 'object' && !Array.isArray(value)) {
      console.warn(`Analytics: Skipping complex object for key "${key}"`);
      return acc;
    }

    // Garder seulement primitives et arrays simples
    acc[key] = value;
    return acc;
  }, {} as EventProperties);
}

function containsPII(props: EventProperties): boolean {
  const piiKeys = ['email', 'password', 'ssn', 'creditCard', 'phone'];
  return Object.keys(props).some(key =>
    piiKeys.some(pii => key.toLowerCase().includes(pii))
  );
}
```

---

### 6. 🌐 **Gestion d'erreurs réseau absente**

**Fichier:** `lib/analytics/event-tracker.ts:318-334`

**Problème:**
```tsx
async function sendToCustomAnalytics(eventData: any): Promise<void> {
  const customEndpoint = process.env.NEXT_PUBLIC_CUSTOM_ANALYTICS_ENDPOINT;
  if (!customEndpoint) return;

  try {
    await fetch(customEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
      keepalive: true,
    });
  } catch (error) {
    console.error('Custom analytics error:', error);  // ❌ Pas de retry
  }
}
```

**Impact:**
- Perte de données analytics en cas d'erreur réseau temporaire
- Pas de queue/retry mechanism

**Solution:**
```tsx
// Ajouter un système de queue simple
const analyticsQueue: any[] = [];
let isProcessing = false;

async function sendToCustomAnalytics(eventData: any): Promise<void> {
  const customEndpoint = process.env.NEXT_PUBLIC_CUSTOM_ANALYTICS_ENDPOINT;
  if (!customEndpoint) return;

  analyticsQueue.push(eventData);

  if (!isProcessing) {
    processQueue(customEndpoint);
  }
}

async function processQueue(endpoint: string, retries = 3): Promise<void> {
  isProcessing = true;

  while (analyticsQueue.length > 0) {
    const eventData = analyticsQueue[0];

    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
        keepalive: true,
      });

      analyticsQueue.shift(); // ✅ Retirer si succès
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
        await processQueue(endpoint, retries - 1);
        return;
      } else {
        console.error('Analytics: Failed after retries', error);
        analyticsQueue.shift(); // Abandonner cet événement
      }
    }
  }

  isProcessing = false;
}
```

---

### 7. 📱 **useScrollDepth peut causer des memory leaks**

**Fichier:** `lib/analytics/use-analytics.ts:569-590`

**Problème:**
```tsx
export function useScrollDepth() {
  const trackedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;

      const depths = [25, 50, 75, 100];
      depths.forEach((depth) => {
        if (scrollPercentage >= depth && !trackedDepths.current.has(depth)) {
          trackedDepths.current.add(depth);
          trackEvent('scroll_depth', {
            depth_percentage: depth,
            page_path: window.location.pathname,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);  // ✅ Cleanup OK
  }, []);  // ❌ Dépendances vides
}
```

**Problème:**
- `trackEvent` n'est pas dans les dépendances
- `trackedDepths` persiste entre navigations de pages (Next.js client-side routing)

**Solution:**
```tsx
export function useScrollDepth() {
  const trackedDepths = useRef<Set<number>>(new Set());
  const pathname = usePathname();  // ✅ Détecter changement de page

  useEffect(() => {
    // ✅ Reset sur changement de page
    trackedDepths.current = new Set();

    const handleScroll = () => {
      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;

      const depths = [25, 50, 75, 100];
      depths.forEach((depth) => {
        if (scrollPercentage >= depth && !trackedDepths.current.has(depth)) {
          trackedDepths.current.add(depth);
          trackEvent('scroll_depth', {
            depth_percentage: depth,
            page_path: pathname,  // ✅ Utiliser pathname du hook
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);  // ✅ Reset quand page change
}
```

---

### 8. 🎯 **TypeScript - Strict mode issues**

**Fichier:** `lib/analytics/event-tracker.ts` et `lib/analytics/use-analytics.ts`

**Problème:**
Utilisation de `any` dans plusieurs endroits:

```tsx
// event-tracker.ts ligne 318
async function sendToCustomAnalytics(eventData: any): Promise<void> { // ❌ any

// Analytics.tsx lignes 36, 38
(window as any).gtag  // ❌ any
```

**Solution:**
```tsx
// Définir types stricts
interface CustomAnalyticsEvent {
  event: string;
  timestamp: string;
  page_url: string;
  page_path: string;
  referrer: string;
  user_agent: string;
  screen_width: number;
  screen_height: number;
  [key: string]: string | number | boolean;
}

async function sendToCustomAnalytics(
  eventData: CustomAnalyticsEvent
): Promise<void> {
  // ...
}

// Pour window.gtag, utiliser la déclaration globale déjà existante
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
}
```

---

## 🚀 OPTIMISATIONS RECOMMANDÉES

### 9. 📦 **Batching des événements analytics**

**Objectif:** Réduire le nombre de requêtes réseau

**Implémentation:**
```tsx
// lib/analytics/event-batcher.ts
const EVENT_BATCH_SIZE = 10;
const EVENT_BATCH_TIMEOUT = 5000; // 5 secondes

let eventBatch: any[] = [];
let batchTimeout: NodeJS.Timeout | null = null;

export function batchTrackEvent(event: any) {
  eventBatch.push(event);

  if (eventBatch.length >= EVENT_BATCH_SIZE) {
    flushBatch();
  } else if (!batchTimeout) {
    batchTimeout = setTimeout(flushBatch, EVENT_BATCH_TIMEOUT);
  }
}

function flushBatch() {
  if (eventBatch.length === 0) return;

  // Envoyer tous les événements d'un coup
  sendBatchToAnalytics(eventBatch);

  eventBatch = [];
  if (batchTimeout) {
    clearTimeout(batchTimeout);
    batchTimeout = null;
  }
}

// Flush avant fermeture de page
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushBatch);
}
```

---

### 10. 💾 **Persistence des événements hors-ligne**

**Objectif:** Ne pas perdre d'événements quand l'utilisateur est offline

**Implémentation:**
```tsx
// lib/analytics/offline-queue.ts
import { safeLocalStorage } from '@/lib/browser';

const QUEUE_KEY = 'analytics_offline_queue';

export function queueOfflineEvent(event: any) {
  const queue = safeLocalStorage.get(QUEUE_KEY, []);
  queue.push({...event, queued_at: Date.now()});
  safeLocalStorage.set(QUEUE_KEY, queue);
}

export async function processOfflineQueue() {
  const queue = safeLocalStorage.get(QUEUE_KEY, []);

  if (queue.length === 0) return;

  // Envoyer tous les événements en queue
  for (const event of queue) {
    try {
      await sendToCustomAnalytics(event);
    } catch (error) {
      console.error('Failed to send queued event', error);
    }
  }

  // Vider la queue
  safeLocalStorage.set(QUEUE_KEY, []);
}

// Process queue quand l'utilisateur revient online
if (typeof window !== 'undefined') {
  window.addEventListener('online', processOfflineQueue);

  // Process au chargement de la page
  if (navigator.onLine) {
    processOfflineQueue();
  }
}
```

---

### 11. 🎭 **Sampling pour réduire le volume**

**Objectif:** Ne tracker qu'un % des utilisateurs pour économiser quota analytics

**Implémentation:**
```tsx
// lib/analytics/sampling.ts
const SAMPLE_RATE = parseFloat(
  process.env.NEXT_PUBLIC_ANALYTICS_SAMPLE_RATE || '1.0'
); // 1.0 = 100%

export function shouldSampleEvent(): boolean {
  return Math.random() < SAMPLE_RATE;
}

// Dans event-tracker.ts
export function trackEvent(
  eventName: string,
  properties?: EventProperties
): void {
  if (!shouldSampleEvent()) {
    return; // Ne track pas cet événement
  }

  // Continue avec tracking normal...
}

// Sauvegarder le sampling decision par user
const USER_SAMPLED_KEY = 'analytics_user_sampled';

export function isUserSampled(): boolean {
  let sampled = safeLocalStorage.get(USER_SAMPLED_KEY, null);

  if (sampled === null) {
    sampled = Math.random() < SAMPLE_RATE;
    safeLocalStorage.set(USER_SAMPLED_KEY, sampled);
  }

  return sampled;
}
```

---

## 🔒 SÉCURITÉ

### 12. 🛡️ **Protection contre injection de code**

**Fichier:** `components/Analytics.tsx:87-90, 101-107`

**Problème actuel:**
```tsx
dangerouslySetInnerHTML={{
  __html: `
    posthog.init('${POSTHOG_API_KEY}',{api_host:'https://app.posthog.com'})
  `,
}}
```

**Risque:** Si `POSTHOG_API_KEY` contient des caractères spéciaux ou du code malicieux

**Solution:**
```tsx
// Valider les API keys avant injection
function sanitizeAPIKey(key: string): string {
  // Autoriser seulement alphanumériques, tirets, underscores
  return key.replace(/[^a-zA-Z0-9-_]/g, '');
}

const SANITIZED_POSTHOG_KEY = sanitizeAPIKey(POSTHOG_API_KEY);
const SANITIZED_MIXPANEL_TOKEN = sanitizeAPIKey(MIXPANEL_TOKEN);

// Utiliser dans dangerouslySetInnerHTML
posthog.init('${SANITIZED_POSTHOG_KEY}', ...)
```

---

### 13. 🔐 **RGPD / Cookie Consent**

**Problème:** Le système charge les analytics même sans consentement utilisateur

**Solution requise:**
```tsx
// lib/analytics/consent.ts
export function hasAnalyticsConsent(): boolean {
  const consent = safeLocalStorage.get('cookie-consent');
  return consent === 'accepted';
}

// Dans components/Analytics.tsx
export default function Analytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setHasConsent(hasAnalyticsConsent());

    // Écouter les changements de consentement
    const handleConsentChange = () => {
      setHasConsent(hasAnalyticsConsent());
    };

    window.addEventListener('cookie-consent-changed', handleConsentChange);
    return () => window.removeEventListener('cookie-consent-changed', handleConsentChange);
  }, []);

  if (!hasConsent) {
    return null;  // ✅ Ne charge pas analytics sans consentement
  }

  // Continue...
}

// Dans event-tracker.ts
export function trackEvent(...) {
  if (!hasAnalyticsConsent()) {
    return;  // ✅ Ne track pas sans consentement
  }
  // Continue...
}
```

---

## 📊 TESTS MANQUANTS

### 14. 🧪 **Tests unitaires recommandés**

Créer des tests pour:

```tsx
// __tests__/analytics/event-tracker.test.ts
describe('trackEvent', () => {
  it('should not track in development mode', () => {
    process.env.NODE_ENV = 'development';
    trackEvent('test_event');
    expect(window.gtag).not.toHaveBeenCalled();
  });

  it('should sanitize event properties', () => {
    trackEvent('test', { valid: 'string', invalid: undefined });
    expect(window.gtag).toHaveBeenCalledWith(
      'event',
      'test',
      { valid: 'string' }  // undefined removed
    );
  });

  it('should block PII data', () => {
    trackEvent('test', { email: 'user@example.com' });
    expect(window.gtag).not.toHaveBeenCalled();
  });
});

// __tests__/analytics/use-analytics.test.tsx
describe('useOnboardingFunnel', () => {
  it('should track step completion with correct mode', () => {
    const { result } = renderHook(() => useOnboardingFunnel('quick'));

    act(() => {
      result.current.trackStepCompleted('basic_info', 1);
    });

    expect(trackEvent).toHaveBeenCalledWith(
      OnboardingEvent.STEP_COMPLETED,
      expect.objectContaining({ onboarding_mode: 'quick' })
    );
  });
});
```

---

## 🎯 PRIORITÉS D'ACTION

### 🔴 CRITIQUE (À corriger immédiatement)
1. ✅ **Bug #1**: Fixer dépendances useEffect dans basic-info/page.tsx
2. ✅ **Bug #2**: Supprimer double tracking dans Analytics.tsx
3. ✅ **Sécurité #13**: Implémenter cookie consent avant tracking

### 🟡 IMPORTANT (À corriger cette semaine)
4. ⚠️ **Warning #5**: Ajouter validation event properties
5. ⚠️ **Warning #6**: Ajouter retry mechanism
6. ⚠️ **Warning #7**: Fixer useScrollDepth memory leak
7. 🔒 **Sécurité #12**: Sanitizer API keys

### 🟢 AMÉLIORATIONS (À planifier)
8. 🚀 **Optim #9**: Implémenter event batching
9. 🚀 **Optim #10**: Queue offline events
10. 🚀 **Optim #11**: Ajouter sampling
11. 🧪 **Tests #14**: Écrire tests unitaires

---

## 📝 CHECKLIST DE VALIDATION

### Avant déploiement en production:

- [ ] Tous les bugs critiques corrigés
- [ ] Cookie consent implémenté (RGPD)
- [ ] Variables d'environnement configurées:
  - [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  - [ ] `NEXT_PUBLIC_POSTHOG_API_KEY`
  - [ ] `NEXT_PUBLIC_MIXPANEL_TOKEN`
- [ ] Tests manuels des funnels principaux
- [ ] Vérification dans GA4 que les événements arrivent
- [ ] Vérification dans PostHog que les événements arrivent
- [ ] Vérification dans Mixpanel que les événements arrivent
- [ ] Documentation à jour pour l'équipe
- [ ] Tests de charge (100+ événements/sec)

---

## 🎓 BONNES PRATIQUES GÉNÉRALES

### À faire:
✅ Utiliser les hooks fournis plutôt que trackEvent directement
✅ Toujours inclure un `user_type` dans les événements utilisateur
✅ Utiliser les funnels pré-configurés pour les parcours principaux
✅ Vérifier le cookie consent avant tracking
✅ Logger en console en mode développement

### À éviter:
❌ Ne jamais tracker d'informations personnelles (email, mot de passe, etc.)
❌ Ne pas créer de nouveaux événements sans les documenter
❌ Ne pas tracker trop souvent (max 1 événement/seconde par utilisateur)
❌ Ne pas utiliser `any` dans les types TypeScript
❌ Ne pas oublier les dépendances dans useEffect/useCallback

---

## 📞 CONTACTS & SUPPORT

Pour questions sur ce diagnostic:
- Documentation: `/docs/ANALYTICS_GUIDE.md`
- Code review: Vérifier les fichiers listés ci-dessus
- Tests: Exécuter `npm run test` (quand tests ajoutés)

---

**Fin du diagnostic - Généré automatiquement le 17/11/2025**
