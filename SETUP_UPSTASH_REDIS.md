# Guide Setup - Upstash Redis (Rate Limiting)

**Durée** : 5 minutes
**Coût** : €0 (Free tier permanent)
**Pourquoi** : Rate limiting pour protéger les API contre abus et DDoS

---

## 🎯 Pourquoi Upstash Redis ?

Le rate limiting protège tes endpoints API contre :
- **Spam/abus** : Utilisateur malveillant qui spam l'API
- **DDoS accidentel** : Bug client qui boucle sur l'API
- **Coûts explosifs** : Empêche €100 de facture OCR/LLM en 1 minute
- **Surcharge DB** : Limite la pression sur Supabase

**Upstash Free Tier** :
- 10 000 requêtes/jour (largement suffisant pour rate limiting)
- Latence ~20-50ms par check
- Pas de carte bancaire requise
- Redis serverless (pas de serveur à gérer)

---

## 📝 Étapes de Configuration

### 1. Créer compte Upstash (2 min)

1. Aller sur **https://upstash.com**
2. Cliquer "Sign Up" (gratuit, pas de CB requise)
3. Se connecter avec GitHub, Google ou email

---

### 2. Créer database Redis (1 min)

1. Dans le dashboard Upstash, cliquer **"Create Database"**
2. Choisir les options :
   - **Name** : `izzico-rate-limiting`
   - **Type** : **Global** (meilleure latence multi-région)
   - **Region** : **EU-West-1** (Dublin - proche de tes users)
   - **Eviction** : LRU (défaut)
   - **TLS** : Activé (défaut)

3. Cliquer **"Create"**

---

### 3. Récupérer credentials (30 sec)

Une fois la database créée :

1. Cliquer sur ta database **"izzico-rate-limiting"**
2. Aller dans l'onglet **"REST API"**
3. Copier les 2 variables :
   - `UPSTASH_REDIS_REST_URL` : `https://xxx-xxxx.upstash.io`
   - `UPSTASH_REDIS_REST_TOKEN` : `AXX...`

---

### 4. Ajouter dans .env.local (30 sec)

**Fichier** : `.env.local`

Ajouter à la fin du fichier :

```bash
# ============================================================================
# UPSTASH REDIS - Rate Limiting
# ============================================================================
# Free tier: 10,000 requests/day (permanent)
# Used for: API rate limiting, prevent abuse/DDoS
# Dashboard: https://console.upstash.com

UPSTASH_REDIS_REST_URL=https://xxx-xxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXX...
```

**IMPORTANT** : Remplace `https://xxx-xxxx.upstash.io` et `AXX...` par tes vraies valeurs copiées à l'étape 3.

---

### 5. Ajouter dans Vercel Dashboard (1 min)

Pour que ça marche en production :

1. Aller sur **https://vercel.com/dashboard**
2. Sélectionner ton projet **Izzico**
3. Aller dans **Settings → Environment Variables**
4. Ajouter 2 variables :

| Name | Value | Environments |
|------|-------|--------------|
| `UPSTASH_REDIS_REST_URL` | `https://xxx-xxxx.upstash.io` | Production, Preview, Development |
| `UPSTASH_REDIS_REST_TOKEN` | `AXX...` | Production, Preview, Development |

5. Cliquer **"Save"**
6. Redéployer : `git push` (ou redeploy depuis Vercel dashboard)

---

### 6. Valider Configuration (30 sec)

```bash
# Vérifier que les variables sont dans .env.local
grep UPSTASH .env.local

# Lancer l'app en local
npm run dev

# Tester un endpoint protégé (devrait fonctionner)
curl -X GET http://localhost:3000/api/matching/matches \
  -H "Authorization: Bearer YOUR_TOKEN"

# Spam l'endpoint 25 fois (devrait bloquer après 20)
for i in {1..25}; do
  curl -X GET http://localhost:3000/api/matching/matches \
    -H "Authorization: Bearer YOUR_TOKEN" &
done

# Attendre résultats → devrait voir des 429 Too Many Requests après 20 requêtes
```

**Résultat attendu** :
- Requêtes 1-20 : ✅ `200 OK`
- Requêtes 21-25 : 🔴 `429 Too Many Requests`

---

## 🛡️ Endpoints Protégés

Après setup, les endpoints suivants seront automatiquement protégés :

| Endpoint | Limite | Window | Type |
|----------|--------|--------|------|
| `/api/matching/matches` | 20 req | 1 min | matching |
| `/api/matching/generate` | 20 req | 1 min | matching |
| `/api/assistant/chat` | 10 req | 1 min | assistant |
| `/api/rooms/search-aesthetic` | 5 req | 1 min | expensive |
| `/api/owner/payments/reminder` | 5 req | 1 min | expensive |

**Graceful Degradation** :
- Si Upstash n'est PAS configuré → rate limiting désactivé (app fonctionne quand même)
- Si Upstash est DOWN → rate limiting bypass automatique (pas de blocage)

---

## 📊 Monitoring Rate Limiting

### Dashboard Upstash

1. Aller sur https://console.upstash.com
2. Cliquer sur ta database **"izzico-rate-limiting"**
3. Aller dans **"Metrics"**

Tu verras :
- Nombre de requêtes/jour
- Latence moyenne
- Hit rate
- Bandwidth utilisé

### Logs dans ton app

Les rate limits sont loggés dans la console :

```
[Rate Limit] User xyz blocked - 20/20 requests in window
[Rate Limit] Upstash not configured - rate limiting disabled
```

---

## 🔧 Configuration Avancée (Optionnel)

### Ajuster les limites

**Fichier** : `lib/middleware/rate-limit.ts`

Modifier la config selon tes besoins :

```typescript
const limiterConfigs = {
  matching: {
    requests: 20, // ← Change ici pour ajuster
    window: '1 m',
  },
  assistant: {
    requests: 10,
    window: '1 m',
  },
  // ... etc
};
```

### Ajouter d'autres endpoints

```typescript
// Dans ton API route
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit';

export async function POST(request: NextRequest) {
  const { user } = await getUser();

  // Appliquer rate limiting
  const rateLimitResponse = await rateLimitMiddleware(request, 'matching', user.id);
  if (rateLimitResponse) return rateLimitResponse;

  // ... reste du code
}
```

---

## ❓ FAQ

### Que se passe-t-il si je dépasse 10 000 requêtes/jour ?

Upstash **ne bloque pas** ton app. Tu auras juste un message dans le dashboard pour upgrade vers le plan payant ($10/mois pour 100k requêtes).

Mais avec rate limiting actif, tu ne devrais JAMAIS dépasser 10k req/jour :
- 10 000 utilisateurs × 20 req/jour = 200 000 checks/jour
- Mais avec 20 req/min max, physiquement impossible de dépasser 28 800 req/jour

**Conclusion** : Free tier est suffisant, même avec 10k MAU.

### Puis-je tester sans Upstash ?

Oui ! Le middleware a un **graceful degradation** :
- Si `UPSTASH_REDIS_REST_URL` est absent → rate limiting désactivé
- L'app fonctionne normalement, juste sans protection

Mais **je recommande fortement de l'activer** avant de lancer en prod.

---

## ✅ Checklist

- [ ] Compte Upstash créé
- [ ] Database Redis créée (`izzico-rate-limiting`)
- [ ] Credentials copiés (URL + TOKEN)
- [ ] Variables ajoutées dans `.env.local`
- [ ] Variables ajoutées dans Vercel Dashboard
- [ ] App redéployée (`git push`)
- [ ] Testé endpoint protégé (20 requêtes OK, 21e bloquée)
- [ ] Dashboard Upstash vérifié (metrics apparaissent)

---

**Prochaine étape** : Phase 1.3 - Compression images automatique (économiser 80% storage) 📸

---

*Guide créé le 19 janvier 2026*
