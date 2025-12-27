# 🚀 PHASE 4 - INTÉGRATION STRIPE
## Roadmap complète pour l'implémentation des paiements

---

## 📋 Vue d'ensemble

**Objectif**: Permettre aux utilisateurs de payer leur abonnement à la fin de leur période d'essai gratuite.

**Contraintes spécifiques EASYCO**:
- Owners: 90 jours de trial → €29.99/mois ou €299/an
- Residents: 180 jours de trial → €19.99/mois ou €199/an
- Mode Searcher: **gratuit à vie** (pas de paiement)

**État actuel**:
- ✅ Système de subscriptions en DB (trials automatiques)
- ✅ SubscriptionBanner qui affiche les jours restants
- ✅ Page Subscription Settings
- ⏳ **Pas encore de paiement configuré**

---

## 🎯 Objectifs de la Phase 4

1. **Configuration Stripe**
   - Créer un compte Stripe
   - Configurer les produits et prix
   - Obtenir les clés API

2. **Stripe Checkout**
   - Implémenter le flux de paiement
   - Redirection vers Stripe pour collecter la carte
   - Gestion du succès/échec

3. **Webhooks Stripe**
   - Synchroniser les statuts de paiement avec Supabase
   - Gérer les événements: payment_succeeded, payment_failed, subscription_canceled

4. **Customer Portal**
   - Permettre aux users de gérer leur abonnement
   - Mettre à jour leur carte bancaire
   - Télécharger leurs factures

5. **Notifications email**
   - Rappels avant expiration du trial (7 jours, 3 jours, 1 jour)
   - Confirmation de paiement
   - Échec de paiement

---

## 📝 Tâches détaillées

### 1️⃣ Configuration initiale Stripe

#### 1.1 Compte Stripe
- [ ] Créer un compte Stripe sur https://dashboard.stripe.com
- [ ] Activer le mode Test pour développement
- [ ] Récupérer les clés API:
  - `STRIPE_PUBLISHABLE_KEY` (commence par `pk_test_...`)
  - `STRIPE_SECRET_KEY` (commence par `sk_test_...`)
  - `STRIPE_WEBHOOK_SECRET` (commence par `whsec_...`)

#### 1.2 Produits et Prix dans Stripe Dashboard
Créer 4 produits dans Stripe:

**1. Owner - Abonnement Mensuel**
- Nom: "EASYCO Owner - Mensuel"
- Prix: €29.99/mois
- Type: Recurring (monthly)
- Métadonnées: `{ "user_type": "owner", "billing_period": "monthly" }`

**2. Owner - Abonnement Annuel**
- Nom: "EASYCO Owner - Annuel"
- Prix: €299/an (économie de €60)
- Type: Recurring (yearly)
- Métadonnées: `{ "user_type": "owner", "billing_period": "annual" }`

**3. Resident - Abonnement Mensuel**
- Nom: "EASYCO Resident - Mensuel"
- Prix: €19.99/mois
- Type: Recurring (monthly)
- Métadonnées: `{ "user_type": "resident", "billing_period": "monthly" }`

**4. Resident - Abonnement Annuel**
- Nom: "EASYCO Resident - Annuel"
- Prix: €199/an (économie de €40)
- Type: Recurring (yearly)
- Métadonnées: `{ "user_type": "resident", "billing_period": "annual" }`

#### 1.3 Variables d'environnement
Ajouter dans `.env.local` et Vercel:

```env
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (récupérés après création des produits)
STRIPE_PRICE_OWNER_MONTHLY=price_...
STRIPE_PRICE_OWNER_ANNUAL=price_...
STRIPE_PRICE_RESIDENT_MONTHLY=price_...
STRIPE_PRICE_RESIDENT_ANNUAL=price_...
```

---

### 2️⃣ Installation et configuration Stripe SDK

#### 2.1 Installer les dépendances
```bash
npm install stripe @stripe/stripe-js
```

#### 2.2 Créer le client Stripe serveur
**Fichier**: `lib/stripe/stripe-server.ts`

```typescript
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});
```

#### 2.3 Créer le client Stripe client-side
**Fichier**: `lib/stripe/stripe-client.ts`

```typescript
import { loadStripe } from '@stripe/stripe-js';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
}

export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};
```

---

### 3️⃣ Migration DB - Ajouter colonnes Stripe

#### 3.1 Créer migration `091_add_stripe_fields.sql`

```sql
-- Add Stripe-related fields to subscriptions table
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id
  ON public.subscriptions(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id
  ON public.subscriptions(stripe_subscription_id);

-- Add comments
COMMENT ON COLUMN public.subscriptions.stripe_customer_id IS 'Stripe Customer ID (cus_...)';
COMMENT ON COLUMN public.subscriptions.stripe_subscription_id IS 'Stripe Subscription ID (sub_...)';
COMMENT ON COLUMN public.subscriptions.stripe_price_id IS 'Stripe Price ID (price_...)';
COMMENT ON COLUMN public.subscriptions.current_period_start IS 'Start of current billing period';
COMMENT ON COLUMN public.subscriptions.current_period_end IS 'End of current billing period';
COMMENT ON COLUMN public.subscriptions.cancel_at_period_end IS 'Whether subscription will cancel at period end';
```

---

### 4️⃣ API Routes Stripe

#### 4.1 Route: Créer Checkout Session
**Fichier**: `app/api/stripe/create-checkout-session/route.ts`

**Fonctionnalité**:
- User clique sur "Upgrade to Pro" dans SubscriptionBanner
- Backend crée une Stripe Checkout Session
- Redirige user vers Stripe pour entrer sa carte
- Après paiement, revient sur `/settings/subscription?success=true`

**Code structure**:
```typescript
export async function POST(request: NextRequest) {
  // 1. Vérifier l'authentification
  // 2. Récupérer le plan choisi (monthly/annual)
  // 3. Créer ou récupérer le Stripe Customer
  // 4. Créer la Checkout Session
  // 5. Retourner l'URL de redirection
}
```

#### 4.2 Route: Créer Customer Portal Session
**Fichier**: `app/api/stripe/create-portal-session/route.ts`

**Fonctionnalité**:
- User clique sur "Manage Subscription" dans Settings
- Backend crée une Customer Portal Session
- Redirige vers Stripe pour gérer l'abonnement
- Après, revient sur `/settings/subscription`

#### 4.3 Route: Webhook Stripe
**Fichier**: `app/api/stripe/webhook/route.ts`

**Événements à gérer**:
- `checkout.session.completed`: Paiement initial réussi → statut = 'active'
- `invoice.payment_succeeded`: Paiement mensuel/annuel réussi → statut = 'active'
- `invoice.payment_failed`: Paiement échoué → statut = 'past_due'
- `customer.subscription.updated`: Changement de plan
- `customer.subscription.deleted`: Annulation → statut = 'canceled'

**Code structure**:
```typescript
export async function POST(request: NextRequest) {
  // 1. Récupérer le body brut et la signature
  // 2. Vérifier la signature Stripe (sécurité)
  // 3. Switch sur event.type
  // 4. Mettre à jour Supabase en fonction de l'événement
  // 5. Créer un subscription_event pour l'audit
}
```

---

### 5️⃣ Composants UI

#### 5.1 Modifier SubscriptionBanner
**Fichier**: `components/dashboard/subscription-banner.tsx`

**Changements**:
- Ajouter bouton "Upgrade Now" quand trial < 30 jours
- Bouton appelle `handleUpgrade()` qui redirige vers Checkout

```typescript
const handleUpgrade = async () => {
  const response = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId: user.user_type === 'owner'
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_OWNER_MONTHLY
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_RESIDENT_MONTHLY,
      successUrl: `${window.location.origin}/settings/subscription?success=true`,
      cancelUrl: `${window.location.origin}/settings/subscription?canceled=true`,
    }),
  });

  const { url } = await response.json();
  window.location.href = url; // Redirection vers Stripe
};
```

#### 5.2 Page Subscription Settings
**Fichier**: `app/settings/subscription/page.tsx`

**Fonctionnalités**:
- Afficher le plan actuel (trial, active, past_due, canceled)
- Bouton "Manage Subscription" si abonnement actif
- Section "Payment History" avec les dernières factures
- Modal pour choisir monthly vs annual

---

### 6️⃣ Helper Functions

#### 6.1 Créer ou récupérer Stripe Customer
**Fichier**: `lib/stripe/create-or-retrieve-customer.ts`

```typescript
export async function createOrRetrieveCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  // 1. Vérifier si stripe_customer_id existe en DB
  // 2. Si oui, retourner le customer_id
  // 3. Si non, créer un nouveau customer dans Stripe
  // 4. Stocker le customer_id en DB
  // 5. Retourner le customer_id
}
```

#### 6.2 Mapper plan Supabase → Stripe Price ID
**Fichier**: `lib/stripe/get-price-id.ts`

```typescript
export function getPriceId(plan: string): string {
  const priceIds: Record<string, string> = {
    'owner_monthly': process.env.STRIPE_PRICE_OWNER_MONTHLY!,
    'owner_annual': process.env.STRIPE_PRICE_OWNER_ANNUAL!,
    'resident_monthly': process.env.STRIPE_PRICE_RESIDENT_MONTHLY!,
    'resident_annual': process.env.STRIPE_PRICE_RESIDENT_ANNUAL!,
  };

  return priceIds[plan];
}
```

---

### 7️⃣ Tests en mode Test Stripe

#### 7.1 Cartes de test Stripe
Utiliser ces numéros de carte pour tester:

| Carte | Numéro | Résultat |
|-------|--------|----------|
| Visa (succès) | `4242 4242 4242 4242` | Paiement réussi |
| Visa (échec) | `4000 0000 0000 0002` | Paiement échoué |
| 3D Secure | `4000 0027 6000 3184` | Requiert authentification |

Date d'expiration: n'importe quelle date future (ex: 12/25)
CVC: n'importe quel nombre à 3 chiffres (ex: 123)

#### 7.2 Scénarios de test

**Test 1: Paiement réussi (Owner)**
1. Créer un compte Owner
2. Terminer l'onboarding → trial créé automatiquement
3. Cliquer sur "Upgrade Now" dans le banner
4. Entrer carte `4242 4242 4242 4242`
5. Vérifier redirection vers `/settings/subscription?success=true`
6. Vérifier en DB que `status = 'active'` et `stripe_subscription_id` est rempli

**Test 2: Paiement échoué**
1. Utiliser carte `4000 0000 0000 0002`
2. Vérifier que le paiement échoue
3. Vérifier message d'erreur
4. Vérifier que status reste en `trial`

**Test 3: Customer Portal**
1. Avec un abonnement actif, cliquer "Manage Subscription"
2. Vérifier redirection vers Stripe Customer Portal
3. Tester:
   - Changer la carte bancaire
   - Télécharger une facture
   - Annuler l'abonnement
4. Vérifier webhook reçu et DB mise à jour

**Test 4: Webhook - Subscription canceled**
1. Annuler un abonnement dans le Customer Portal
2. Vérifier webhook `customer.subscription.deleted`
3. Vérifier en DB que `status = 'canceled'`
4. Vérifier qu'un `subscription_event` a été créé

---

### 8️⃣ Déploiement Production

#### 8.1 Activer le mode Live Stripe
- [ ] Dans Stripe Dashboard, passer en mode Live
- [ ] Récupérer les nouvelles clés API (live)
- [ ] Mettre à jour les variables d'environnement Vercel

#### 8.2 Configurer le webhook en production
- [ ] URL du webhook: `https://easyco.vercel.app/api/stripe/webhook`
- [ ] Événements à écouter:
  - `checkout.session.completed`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
- [ ] Récupérer le `STRIPE_WEBHOOK_SECRET` (whsec_...)
- [ ] Ajouter la variable dans Vercel

#### 8.3 Tests en production
- [ ] Créer un vrai compte test
- [ ] Utiliser une vraie carte (ou carte test en mode live)
- [ ] Vérifier le flow complet
- [ ] Vérifier réception des webhooks

---

## 🔐 Sécurité et bonnes pratiques

### ✅ Validation des webhooks
**CRITIQUE**: Toujours vérifier la signature Stripe pour éviter les attaques

```typescript
const sig = request.headers.get('stripe-signature');
const event = stripe.webhooks.constructEvent(
  rawBody,
  sig!,
  process.env.STRIPE_WEBHOOK_SECRET!
);
```

### ✅ Idempotence
- Utiliser `idempotency_key` pour éviter les double-paiements
- Vérifier que l'événement webhook n'a pas déjà été traité

### ✅ Gestion des erreurs
- Logger tous les webhooks (succès et échecs)
- Retry automatique en cas d'échec
- Alertes si trop d'échecs

### ✅ Données sensibles
- **Jamais** stocker les numéros de carte en DB
- **Jamais** logger les clés API dans les logs
- Utiliser HTTPS partout

---

## 📊 Métriques à monitorer

Une fois Stripe intégré, suivre ces métriques dans le Security Dashboard:

1. **Taux de conversion trial → paid**
   - Combien de users payent à la fin du trial?
   - Objectif: >20%

2. **MRR (Monthly Recurring Revenue)**
   - Revenus mensuels récurrents
   - Croissance mois par mois

3. **Churn rate**
   - Taux d'annulation d'abonnement
   - Objectif: <5% par mois

4. **Échecs de paiement**
   - Combien de paiements échouent?
   - Envoyer des rappels automatiques

---

## 🚀 Ordre d'implémentation recommandé

### Semaine 1: Configuration et API Routes
1. ✅ Créer compte Stripe + produits
2. ✅ Installer SDK + créer clients Stripe
3. ✅ Migration DB pour colonnes Stripe
4. ✅ Route: `/api/stripe/create-checkout-session`
5. ✅ Route: `/api/stripe/webhook` (basique)

### Semaine 2: UI et Checkout
6. ✅ Modifier `SubscriptionBanner` avec bouton "Upgrade"
7. ✅ Page Subscription Settings complète
8. ✅ Tests en mode Test avec cartes Stripe
9. ✅ Gestion des erreurs et messages users

### Semaine 3: Customer Portal et Webhooks
10. ✅ Route: `/api/stripe/create-portal-session`
11. ✅ Webhooks complets (tous les événements)
12. ✅ Tests webhook avec Stripe CLI
13. ✅ Monitoring et logs

### Semaine 4: Polish et Production
14. ✅ Emails transactionnels (Resend)
15. ✅ Tests end-to-end complets
16. ✅ Configuration production Stripe
17. ✅ Déploiement et monitoring

---

## 📚 Ressources utiles

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Node.js SDK](https://github.com/stripe/stripe-node)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Webhook Events Reference](https://stripe.com/docs/api/events/types)
- [Stripe CLI](https://stripe.com/docs/stripe-cli) (pour tester webhooks en local)

---

## ✅ Checklist finale avant lancement

- [ ] Tous les tests passent (unit + integration)
- [ ] Webhooks fonctionnent en production
- [ ] Emails transactionnels configurés
- [ ] Dashboard Stripe configuré (alertes, rapports)
- [ ] Variables d'environnement correctes sur Vercel
- [ ] RLS policies testées
- [ ] Logs et monitoring en place
- [ ] Documentation technique à jour
- [ ] Tests de charge effectués
- [ ] Plan de rollback défini

---

**Prêt à démarrer? 🚀**

Prochaine étape recommandée:
1. Créer le compte Stripe
2. Configurer les produits et récupérer les clés API
3. Commencer par la route `/api/stripe/create-checkout-session`

Tu veux que je commence l'implémentation maintenant?
