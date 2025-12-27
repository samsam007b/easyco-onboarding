# 🚀 PLAN DE RESTRUCTURATION - LANCEMENT IZZICO 2025

**Document Stratégique - Circuits Fermés Owner + Resident**

**Date**: 27 Décembre 2025
**Version**: 1.0
**Statut**: 🔴 Plan d'Action - Pré-implémentation
**Approuvé par**: Alain (Business Angel)

---

## 📋 TABLE DES MATIÈRES

1. [Stratégie de Lancement](#1-stratégie-de-lancement)
2. [Analyse Technique Actuelle](#2-analyse-technique-actuelle)
3. [Plan d'Implémentation](#3-plan-dimplémentation)
4. [Système d'Abonnement](#4-système-dabonnement)
5. [Checklist Pré-Lancement](#5-checklist-pré-lancement)
6. [Timeline & Estimation](#6-timeline--estimation)

---

## 1. STRATÉGIE DE LANCEMENT

### 1.1 Vision du Lancement

**Approche**: Double lancement simultané **Owner + Resident** en circuits fermés

**Principe**:
- ✅ **Owners**: Peuvent créer et gérer leurs résidences
- ✅ **Residents**: Peuvent rejoindre et gérer leur colocation
- ❌ **Searchers**: **DÉSACTIVÉ** temporairement - "À venir prochainement"
- ❌ **Marketplace**: **FERMÉE** - Pas de recherche publique de propriétés
- ❌ **Matching Tinder**: **FERMÉ** - Pas de matching public de personnes

### 1.2 Justification Stratégique

**Pourquoi circuits fermés ?**

1. **Validation produit** avec utilisateurs existants (locataires actuels + propriétaires)
2. **Création de contenu** organique (propriétés + résidents) avant l'ouverture
3. **Perfectionnement UX** sans pression de marketplace publique
4. **Construction d'une base** de propriétés avant matching public
5. **Éviter le problème de la poule et l'œuf** (0 propriété = 0 searcher intéressé)

**Avantages business**:
- Test de l'appétence au paiement (après périodes gratuites)
- Feedback qualité des early adopters
- Ajustements produit avant scaling
- Word-of-mouth naturel (locataires actuels recommandent)

### 1.3 Modèle d'Abonnement

| Rôle | Période Gratuite | Abonnement Mensuel | Objectif |
|------|------------------|-------------------|----------|
| **Owner** | 3 mois offerts | €X/mois (TBD) | Montrer la valeur immédiate |
| **Resident** | 6 mois offerts | €Y/mois (TBD) | Adoption sans friction |
| **Searcher** | N/A (désactivé) | Gratuit (futur) | Sera lancé en phase 2 |

**Message clé**: "Gratuit maintenant, mais ce service a de la valeur - profitez-en !"

---

## 2. ANALYSE TECHNIQUE ACTUELLE

### 2.1 Points d'Accès Searcher Identifiés

#### A. Sélection de Rôle (5 points d'entrée)

1. **Page Welcome** (`/welcome/page.tsx`)
   - Ligne 68-85: `handleRoleSelect()` - Sélection initiale
   - Ligne 103-137: 3 cartes de rôle cliquables
   - **ACTION**: Masquer la carte Searcher + message "Coming Soon"

2. **Page Profile** (`/profile/page.tsx`)
   - Ligne 135-137: Switch de rôle via `RoleSwitchModal`
   - **ACTION**: Désactiver l'option Searcher dans le switch

3. **My Profile Resident** (`/dashboard/my-profile-resident`)
   - Switch de rôle disponible
   - **ACTION**: Retirer Searcher des options

4. **My Profile Owner** (`/dashboard/my-profile-owner`)
   - Switch de rôle disponible
   - **ACTION**: Retirer Searcher des options

5. **Post-OAuth Signup** (`/auth/complete-signup/page.tsx`)
   - Ligne 32-50: Gestion `easyco_pending_user_type`
   - **ACTION**: Rediriger vers Welcome si type = Searcher

#### B. Composant de Switch de Rôle

**Fichier**: `/components/RoleSwitchModal.tsx` (Lignes 1-162)
- **ACTION**: Ajouter logique pour désactiver l'option Searcher
- **UI**: Option grisée avec badge "Bientôt disponible"

### 2.2 Features Marketplace à Désactiver

#### A. Routes Searcher (Dashboard & Pages)

**Dashboard Principal**:
- `/dashboard/searcher/page.tsx` → ⛔ Redirect to coming-soon page

**Sous-pages Searcher**:
1. `/dashboard/searcher/my-applications` → ⛔ Applications aux propriétés
2. `/dashboard/searcher/favorites` → ⛔ Favoris propriétés
3. `/dashboard/searcher/alerts` → ⛔ Alertes de propriétés
4. `/dashboard/searcher/saved-searches` → ⛔ Recherches sauvegardées
5. `/dashboard/searcher/groups` → ⛔ Groupes de matching
6. `/dashboard/searcher/groups/create` → ⛔ Création de groupe
7. `/dashboard/searcher/my-visits` → ⛔ Visites programmées
8. `/dashboard/searcher/notifications` → ⛔ Notifications
9. `/dashboard/searcher/messages` → ⛔ Messages

**ACTION**: Middleware redirect vers `/coming-soon/searcher`

#### B. Matching & Swipe (Features "Tinder")

**Matching de Personnes**:
- `/matching/swipe/page.tsx` → ⛔ Swipe interface utilisateurs
- **ACTION**: Redirect + message "Bientôt disponible"

**Matching de Propriétés**:
- `/matching/properties/page.tsx` → ⛔ Matching algorithme propriétés
- Ligne 52-63: Check role "searcher" déjà présent
- **ACTION**: Renforcer + redirect

**API Matching**:
- `/api/matching/generate/route.ts` → ⛔ Génération de matches
- Ligne 37-42: Déjà vérifie role = searcher
- **ACTION**: Retourner erreur "Feature not available yet"

#### C. Browse & Marketplace Publique

**Pages de Navigation**:
1. `/favorites/page.tsx` → ⛔ Page favoris (Ligne 56-65 déjà check role)
2. `/properties/[id]` → ⛔ Vue publique détail propriété
3. `/browse` ou équivalent → ⛔ Navigation marketplace

**Composants Browse**:
- `/components/browse/PropertyCard.tsx` → ⛔ Cartes propriétés publiques
- `/components/browse/PropertyFilters.tsx` → ⛔ Filtres recherche
- `/components/browse/BrowseContent.tsx` → ⛔ Contenu navigation

**ACTION**: Masquer ces composants ou redirect vers coming-soon

#### D. Onboarding Searcher (13 étapes)

**Flow Complet** (`/onboarding/searcher/*`):
1. `/onboarding/searcher/profile-type` → ⛔ Type de profil
2. `/onboarding/searcher/group-selection` → ⛔ Sélection groupe
3. `/onboarding/searcher/create-group` → ⛔ Création groupe
4. `/onboarding/searcher/basic-info` → ⛔ Infos de base
5. `/onboarding/searcher/home-lifestyle` → ⛔ Lifestyle maison
6. `/onboarding/searcher/daily-habits` → ⛔ Habitudes quotidiennes
7. `/onboarding/searcher/ideal-coliving` → ⛔ Coliving idéal
8. `/onboarding/searcher/social-vibe` → ⛔ Préférences sociales
9. `/onboarding/searcher/preferences` → ⛔ Préférences supplémentaires
10. `/onboarding/searcher/verification` → ⛔ Vérification téléphone/ID
11. `/onboarding/searcher/privacy` → ⛔ Consentements privacy
12. `/onboarding/searcher/review` → ⛔ Review profil
13. `/onboarding/searcher/success` → ⛔ Succès
14. `/onboarding/searcher/enhance/*` → ⛔ 7 pages d'amélioration profil

**ACTION**: Middleware redirect toutes ces routes vers `/coming-soon/searcher`

### 2.3 Composants Partagés à Vérifier

**Composants utilisés par plusieurs rôles**:
- `/components/layout/Header.tsx` → Vérifier navigation role-based
- `/components/messages/*` → Vérifier si accessible aux Searchers
- `/components/notifications/*` → Vérifier ciblage notifications

**ACTION**: Audit de chaque composant partagé pour isolation Searcher

---

## 3. PLAN D'IMPLÉMENTATION

### 3.1 Phase 1: Gating Searcher Role (Priorité 🔴 CRITIQUE)

#### A. Créer Page "Coming Soon" Searcher

**Nouveau fichier**: `/app/coming-soon/searcher/page.tsx`

**Contenu**:
```typescript
'use client';

import { motion } from 'framer-motion';
import { Search, Calendar, Bell } from 'lucide-react';

export default function SearcherComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center"
      >
        {/* Icon animé */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="mx-auto w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-8"
        >
          <Search className="w-16 h-16 text-white" />
        </motion.div>

        {/* Titre */}
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Bientôt Disponible ! 🚀
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          La fonction <span className="font-semibold text-yellow-600">Chercheur</span> arrive très prochainement.
        </p>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Qu'est-ce qui arrive ?
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Marketplace</h3>
              <p className="text-sm text-gray-600">
                Parcourez des centaines de propriétés disponibles
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Matching Intelligent</h3>
              <p className="text-sm text-gray-600">
                Trouvez votre colocation idéale par compatibilité
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bell className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Alertes Temps Réel</h3>
              <p className="text-sm text-gray-600">
                Soyez notifié dès qu'une propriété correspond
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-semibold mb-2">Inscrivez-vous à la liste d'attente</h3>
          <p className="mb-4 opacity-90">
            Soyez parmi les premiers à accéder à la marketplace !
          </p>
          <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow">
            Rejoindre la Liste d'Attente
          </button>
        </div>

        {/* Retour */}
        <a
          href="/"
          className="inline-block mt-8 text-gray-600 hover:text-gray-900 underline"
        >
          ← Retour à l'accueil
        </a>
      </motion.div>
    </div>
  );
}
```

**Fonctionnalités**:
- ✨ Animation Framer Motion
- 📧 Form email pour waitlist (optionnel - intégration Supabase)
- 🎨 Design cohérent avec brand Izzico
- 📱 Mobile responsive

#### B. Modifier Middleware de Routing

**Fichier**: `/middleware.ts`

**Modifications nécessaires** (après ligne 186):

```typescript
// GATING SEARCHER ROLE - Closed Beta
const isSearcherRoute = request.nextUrl.pathname.startsWith('/dashboard/searcher') ||
                        request.nextUrl.pathname.startsWith('/onboarding/searcher') ||
                        request.nextUrl.pathname.startsWith('/matching') ||
                        request.nextUrl.pathname === '/favorites';

if (isSearcherRoute) {
  // Redirect ALL searcher-related routes to coming-soon
  return NextResponse.redirect(new URL('/coming-soon/searcher', request.url));
}

// Also block if user tries to access with user_type = 'searcher'
if (userData?.user_type === 'searcher') {
  const allowedPathsForSearchers = ['/coming-soon/searcher', '/profile', '/auth'];
  const isAllowedPath = allowedPathsForSearchers.some(path =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (!isAllowedPath) {
    return NextResponse.redirect(new URL('/coming-soon/searcher', request.url));
  }
}
```

**Logique**:
1. Toute route commençant par `/dashboard/searcher`, `/onboarding/searcher`, `/matching` → Redirect
2. Si `user_type = 'searcher'` → Redirect (sauf pages autorisées)
3. Empêche l'accès même si l'utilisateur modifie l'URL manuellement

#### C. Modifier Page Welcome (Sélection Rôle Initiale)

**Fichier**: `/app/welcome/page.tsx`

**Modifications Ligne 103-137** (Cartes de rôle):

```typescript
// Ajouter state pour désactiver Searcher
const [searcherAvailable] = useState(false); // 🔴 FERMÉ pour beta

// Dans le render des cartes:
<div className="grid md:grid-cols-3 gap-6">
  {/* Carte Owner - ACTIVE */}
  <button
    onClick={() => handleRoleSelect('owner')}
    className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
  >
    {/* Contenu owner... */}
  </button>

  {/* Carte Resident - ACTIVE */}
  <button
    onClick={() => handleRoleSelect('resident')}
    className="relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
  >
    {/* Contenu resident... */}
  </button>

  {/* Carte Searcher - DÉSACTIVÉE */}
  <div className="relative p-8 bg-gray-100 rounded-2xl shadow-lg opacity-60 cursor-not-allowed">
    {/* Badge "Bientôt" */}
    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
      🚀 Bientôt
    </div>

    <div className="text-6xl mb-4">🔍</div>
    <h3 className="text-2xl font-bold text-gray-700 mb-2">Chercheur</h3>
    <p className="text-gray-500 mb-4">
      Trouvez votre colocation idéale
    </p>

    {/* Message explicatif */}
    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <p className="text-sm text-yellow-800 font-medium">
        Cette fonctionnalité arrive très prochainement !
      </p>
    </div>
  </div>
</div>
```

**Résultat visuel**:
- Carte Searcher grisée et non-cliquable
- Badge "🚀 Bientôt" visible en haut à droite
- Message explicatif au survol

#### D. Modifier RoleSwitchModal (Switching de Rôle)

**Fichier**: `/components/RoleSwitchModal.tsx`

**Modifications Ligne 60-120** (Options de rôle):

```typescript
const roleOptions: UserType[] = ['owner', 'resident']; // 🔴 Retirer 'searcher'

// OU avec désactivation visuelle:
const allRoles: UserType[] = ['owner', 'resident', 'searcher'];
const disabledRoles: UserType[] = ['searcher']; // 🔴 Désactiver Searcher

// Dans le render:
{allRoles.map((roleType) => {
  const isDisabled = disabledRoles.includes(roleType);

  return (
    <button
      key={roleType}
      disabled={isDisabled}
      onClick={() => !isDisabled && handleConfirmSwitch(roleType)}
      className={`
        relative p-6 rounded-xl border-2 transition-all
        ${isDisabled
          ? 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
          : 'bg-white border-gray-200 hover:border-orange-400'
        }
      `}
    >
      {/* Badge "Bientôt" si désactivé */}
      {isDisabled && (
        <div className="absolute -top-2 -right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
          Bientôt
        </div>
      )}

      <div className="text-4xl mb-2">{roleConfig[roleType].icon}</div>
      <h4 className="font-semibold text-gray-900 mb-1">
        {roleConfig[roleType].label.fr}
      </h4>
      <p className="text-sm text-gray-600">
        {roleConfig[roleType].description.fr}
      </p>

      {isDisabled && (
        <p className="mt-3 text-xs text-yellow-700 font-medium">
          Disponible très prochainement
        </p>
      )}
    </button>
  );
})}
```

**Résultat**:
- Searcher visible mais désactivé dans le modal de switch
- Badge "Bientôt" visible
- Impossible de cliquer (disabled)

#### E. Modifier Pages My Profile (Owner & Resident)

**Fichiers**:
- `/app/dashboard/my-profile-owner/page.tsx`
- `/app/dashboard/my-profile-resident/page.tsx`

**Modification**: S'assurer que `RoleSwitchModal` est utilisé (déjà modifié ci-dessus)

Si besoin, ajouter logique de filtrage:
```typescript
const availableRoles = ['owner', 'resident']; // Exclure searcher
```

#### F. Bloquer API Matching

**Fichier**: `/app/api/matching/generate/route.ts`

**Modifier Ligne 37-42**:

```typescript
// EXISTANT:
if (profile.user_type !== 'searcher') {
  return NextResponse.json(
    { error: 'Only searchers can generate matches' },
    { status: 403 }
  );
}

// NOUVEAU (Bloquer complètement):
return NextResponse.json(
  {
    error: 'Matching feature coming soon',
    message: 'La fonction de matching sera disponible prochainement. Inscrivez-vous à la liste d\'attente !',
    status: 'coming_soon'
  },
  { status: 503 } // Service Unavailable
);
```

**Raison**: Même si un utilisateur "searcher" existe dans la DB (ancien), bloquer l'API

### 3.2 Phase 2: Système d'Abonnement (Priorité 🟠 HAUTE)

#### A. Structure Base de Données

**Nouvelle table**: `subscriptions`

**Migration SQL** (`/supabase/migrations/089_add_subscriptions.sql`):

```sql
-- Table des abonnements
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_type TEXT NOT NULL CHECK (user_type IN ('owner', 'resident')),

  -- Statut
  status TEXT NOT NULL CHECK (status IN ('trial', 'active', 'past_due', 'canceled', 'expired')) DEFAULT 'trial',

  -- Périodes gratuites
  trial_start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  trial_end_date TIMESTAMPTZ NOT NULL,
  trial_days_total INTEGER NOT NULL, -- 90 pour owner, 180 pour resident

  -- Abonnement payant
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,

  -- Pricing
  plan_name TEXT NOT NULL, -- 'owner_monthly', 'resident_monthly'
  monthly_price_cents INTEGER, -- Prix en centimes (ex: 999 = €9.99)

  -- Métadonnées
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, user_type)
);

-- Index pour performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_trial_end ON subscriptions(trial_end_date);

-- RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription
CREATE POLICY "Users can view own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Only authenticated users can insert (during signup)
CREATE POLICY "Users can create own subscription"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own subscription (payment info)
CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Function pour auto-update updated_at
CREATE OR REPLACE FUNCTION update_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscription_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_subscription_updated_at();

-- Function pour créer subscription automatiquement lors de l'onboarding
CREATE OR REPLACE FUNCTION create_subscription_on_onboarding()
RETURNS TRIGGER AS $$
DECLARE
  trial_days INTEGER;
  plan TEXT;
BEGIN
  -- Déterminer période d'essai selon le rôle
  IF NEW.user_type = 'owner' THEN
    trial_days := 90; -- 3 mois
    plan := 'owner_monthly';
  ELSIF NEW.user_type = 'resident' THEN
    trial_days := 180; -- 6 mois
    plan := 'resident_monthly';
  ELSE
    RETURN NEW; -- Pas de subscription pour searcher (désactivé)
  END IF;

  -- Créer subscription si onboarding complété
  IF NEW.onboarding_completed = TRUE THEN
    INSERT INTO subscriptions (
      user_id,
      user_type,
      status,
      trial_start_date,
      trial_end_date,
      trial_days_total,
      plan_name
    ) VALUES (
      NEW.id,
      NEW.user_type,
      'trial',
      NOW(),
      NOW() + (trial_days || ' days')::INTERVAL,
      trial_days,
      plan
    )
    ON CONFLICT (user_id, user_type) DO NOTHING; -- Si existe déjà, ne rien faire
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour auto-création subscription
CREATE TRIGGER auto_create_subscription
  AFTER INSERT OR UPDATE ON users
  FOR EACH ROW
  WHEN (NEW.onboarding_completed = TRUE)
  EXECUTE FUNCTION create_subscription_on_onboarding();

COMMENT ON TABLE subscriptions IS 'Gestion des abonnements owner/resident avec périodes gratuites';
```

**Explication**:
- **trial**: Période gratuite (3 mois owner, 6 mois resident)
- **active**: Abonnement payant actif
- **past_due**: Paiement en retard
- **canceled**: Utilisateur a annulé
- **expired**: Période gratuite expirée, pas de paiement

#### B. Composant Subscription Banner

**Nouveau fichier**: `/components/subscriptions/SubscriptionBanner.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { differenceInDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Crown, Calendar, CreditCard } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Subscription {
  status: 'trial' | 'active' | 'past_due' | 'canceled' | 'expired';
  trial_end_date: string;
  user_type: 'owner' | 'resident';
  trial_days_total: number;
}

export default function SubscriptionBanner() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchSubscription() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setSubscription(data);
        const days = differenceInDays(new Date(data.trial_end_date), new Date());
        setDaysRemaining(Math.max(0, days));
      }
    }

    fetchSubscription();
  }, []);

  if (!subscription || subscription.status !== 'trial') return null;

  // Gradient selon le rôle
  const gradientClass = subscription.user_type === 'owner'
    ? 'from-indigo-500 to-purple-600'
    : 'from-emerald-500 to-teal-600';

  const roleLabel = subscription.user_type === 'owner' ? 'Propriétaire' : 'Résident';
  const trialMonths = subscription.user_type === 'owner' ? '3 mois' : '6 mois';

  return (
    <div className={`bg-gradient-to-r ${gradientClass} text-white p-4 rounded-xl shadow-lg mb-6`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Crown className="w-6 h-6 text-white" />
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              Offre de Lancement - {roleLabel}
            </h3>
            <p className="text-white/90 text-sm">
              {trialMonths} gratuits • Plus que <strong>{daysRemaining} jours</strong> restants
            </p>
          </div>
        </div>

        <button className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow">
          Voir l'Offre
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
        <div
          className="bg-white h-full rounded-full transition-all duration-500"
          style={{
            width: `${((subscription.trial_days_total - daysRemaining) / subscription.trial_days_total) * 100}%`
          }}
        />
      </div>

      <p className="text-xs text-white/80 mt-2">
        Fin de la période gratuite: {format(new Date(subscription.trial_end_date), 'dd MMMM yyyy', { locale: fr })}
      </p>
    </div>
  );
}
```

**Intégration**: Ajouter dans les dashboards Owner et Resident en haut de page

#### C. Page Subscription Settings

**Nouveau fichier**: `/app/dashboard/subscription/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Crown, Check, CreditCard, Calendar } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function SubscriptionPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchSubscription();
  }, []);

  async function fetchSubscription() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) setSubscription(data);
    setLoading(false);
  }

  if (loading) return <div>Chargement...</div>;

  const daysRemaining = subscription
    ? differenceInDays(new Date(subscription.trial_end_date), new Date())
    : 0;

  const roleLabel = subscription?.user_type === 'owner' ? 'Propriétaire' : 'Résident';
  const monthlyPrice = subscription?.user_type === 'owner' ? '€9.99' : '€4.99'; // À définir

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Abonnement</h1>

      {/* Statut actuel */}
      {subscription?.status === 'trial' && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-8 h-8 text-green-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Période Gratuite Active</h2>
              <p className="text-green-700">Profitez de toutes les fonctionnalités gratuitement</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Jours Restants</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{daysRemaining}</p>
              <p className="text-sm text-gray-500 mt-1">
                Expire le {format(new Date(subscription.trial_end_date), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <CreditCard className="w-5 h-5" />
                <span className="font-medium">Prix Futur</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{monthlyPrice}</p>
              <p className="text-sm text-gray-500 mt-1">par mois après la période gratuite</p>
            </div>
          </div>
        </div>
      )}

      {/* Fonctionnalités incluses */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Fonctionnalités Incluses - {roleLabel}
        </h3>

        <div className="space-y-3">
          {subscription?.user_type === 'owner' ? (
            <>
              <FeatureItem text="Gestion illimitée de propriétés" />
              <FeatureItem text="Analytics et statistiques avancées" />
              <FeatureItem text="Système de candidatures automatisé" />
              <FeatureItem text="Calendrier de disponibilités synchronisé" />
              <FeatureItem text="Génération de codes d'invitation" />
              <FeatureItem text="Support prioritaire" />
            </>
          ) : (
            <>
              <FeatureItem text="Hub de gestion de colocation complet" />
              <FeatureItem text="Split automatique des dépenses" />
              <FeatureItem text="Scanner OCR de tickets de caisse" />
              <FeatureItem text="Calendrier partagé avec colocataires" />
              <FeatureItem text="Gestion des tâches et corvées" />
              <FeatureItem text="Coffre-fort de documents" />
              <FeatureItem text="Messagerie temps réel" />
            </>
          )}
        </div>
      </div>

      {/* CTA Upgrade (futur) */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold mb-3">Prêt à Continuer Après la Période Gratuite ?</h3>
        <p className="text-white/90 mb-6">
          Configurez votre moyen de paiement dès maintenant pour une transition sans interruption
        </p>
        <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:shadow-xl transition-shadow">
          Configurer le Paiement
        </button>
      </div>
    </div>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <Check className="w-4 h-4 text-green-600" />
      </div>
      <span className="text-gray-700">{text}</span>
    </div>
  );
}
```

**Navigation**: Ajouter lien "Mon Abonnement" dans Header/Profile dropdown

### 3.3 Phase 3: Optimisations & Tests (Priorité 🟡 MOYENNE)

#### A. Audit Complet Features Owner/Resident

**Checklist à vérifier**:

**Owner Dashboard**:
- ✅ Création de propriété (sans marketplace publique)
- ✅ Gestion multi-propriétés
- ✅ Génération codes invitation
- ✅ Calendrier disponibilités
- ✅ Analytics basiques
- ⚠️ Vérifier: Aucune référence à "matching" ou "searchers"

**Resident Hub**:
- ✅ Dashboard overview
- ✅ Finances + OCR scanner
- ✅ Tasks management
- ✅ Calendar partagé
- ✅ Documents vault
- ✅ Messages (entre résidents uniquement)
- ✅ Rules voting
- ✅ Maintenance requests
- ✅ Members management avec permissions
- ⚠️ Vérifier: Aucune feature "recherche de propriété"

**Tests à effectuer**:
1. Signup Owner → Onboarding → Dashboard complet
2. Signup Resident → Onboarding → Hub complet
3. Invitation code → Resident rejoint propriété
4. Switch de rôle Owner ↔ Resident (sans Searcher)
5. Subscription banner affichage + countdown
6. Protection routes Searcher (redirect coming-soon)

#### B. Performance & SEO

**Optimisations**:
- Lazy loading composants non-critiques
- Image optimization (déjà en place avec Next.js)
- Route prefetching pour navigation rapide
- Cache strategy pour données statiques

**SEO pour Circuits Fermés**:
- Robots.txt: Désindexer routes Searcher
- Sitemap.xml: Exclure routes marketplace
- Meta tags: Focus sur "Gestion de colocation" plutôt que "Recherche"

**robots.txt mise à jour**:
```
# Désindexer marketplace (fermée)
Disallow: /dashboard/searcher/
Disallow: /onboarding/searcher/
Disallow: /matching/
Disallow: /favorites/
Disallow: /coming-soon/

# Autoriser Owner et Resident
Allow: /dashboard/owner/
Allow: /dashboard/resident/
Allow: /hub/
```

#### C. Messaging & Communication

**Email Transactionnels** (via Supabase Auth):
1. **Welcome Email Owner**:
   - "Bienvenue ! 3 mois gratuits pour tester"
   - CTA: Créer votre première propriété

2. **Welcome Email Resident**:
   - "Bienvenue ! 6 mois gratuits"
   - CTA: Rejoindre une résidence ou inviter vos colocataires

3. **Trial Ending Warning** (J-30, J-7, J-1):
   - "Votre période gratuite se termine bientôt"
   - CTA: Configurer paiement pour continuer

**Notifications In-App**:
- Badge "Nouveau" sur menu Subscription pendant 7 premiers jours
- Countdown visible dans header quand < 30 jours restants

---

## 4. SYSTÈME D'ABONNEMENT

### 4.1 Pricing Strategy (À Définir avec Alain)

**Proposition initiale**:

| Rôle | Gratuit | Prix/Mois | Valeur Perçue |
|------|---------|-----------|---------------|
| **Owner** | 3 mois | €12.99/mois | Gestion multi-propriétés, Analytics, Invitations, Réduction 80% temps admin |
| **Resident** | 6 mois | €5.99/mois | Hub complet, OCR, Split auto, Documents, Calendrier |
| **Searcher** | ∞ (futur) | Gratuit | Accès marketplace, matching gratuit (monétisation via owners) |

**Justification pricing**:
- **Owner**: €12.99/mois = €155/an → ROI en 1-2 heures de temps admin économisé
- **Resident**: €5.99/mois = €72/an → Prix d'un café/semaine pour gérer toute la colocation

### 4.2 Intégration Stripe (Phase Future)

**Pour plus tard** (pas prioritaire pour beta):
- Stripe Checkout intégration
- Webhooks subscription events
- Customer portal pour gérer abonnement
- Invoice generation automatique

**Pour l'instant**:
- Système de tracking périodes gratuites uniquement
- UI/UX abonnement prêt
- Database prête pour Stripe IDs

---

## 5. CHECKLIST PRÉ-LANCEMENT

### 5.1 Checklist Technique

#### Gating Searcher Role
- [ ] Page `/coming-soon/searcher` créée avec design premium
- [ ] Middleware bloque toutes routes `/dashboard/searcher/*`
- [ ] Middleware bloque toutes routes `/onboarding/searcher/*`
- [ ] Middleware bloque `/matching/*` et `/favorites`
- [ ] API `/api/matching/generate` retourne 503 (service unavailable)
- [ ] Page Welcome: Carte Searcher grisée + badge "Bientôt"
- [ ] RoleSwitchModal: Option Searcher désactivée
- [ ] My Profile Owner: Pas d'option Searcher dans switch
- [ ] My Profile Resident: Pas d'option Searcher dans switch
- [ ] Tests: Impossible d'accéder aux routes Searcher (même URL manuelle)

#### Système Abonnement
- [ ] Migration `089_add_subscriptions.sql` appliquée
- [ ] Trigger auto-création subscription à l'onboarding
- [ ] Composant `SubscriptionBanner` créé
- [ ] Page `/dashboard/subscription` créée
- [ ] Banner affiché dans Dashboard Owner
- [ ] Banner affiché dans Dashboard Resident
- [ ] Countdown jours restants fonctionne
- [ ] Tests: Subscription créée automatiquement après onboarding

#### Features Owner
- [ ] Création propriété fonctionne (circuit fermé)
- [ ] Multi-propriétés gestion OK
- [ ] Génération codes invitation OK
- [ ] Calendrier disponibilités OK
- [ ] Analytics dashboard OK (sans searchers)
- [ ] Aucune référence "marketplace" ou "matching"

#### Features Resident
- [ ] Dashboard Hub complet fonctionnel
- [ ] Finances + OCR scanner opérationnel
- [ ] Tasks management OK
- [ ] Calendar partagé OK
- [ ] Documents vault OK
- [ ] Messages entre résidents OK
- [ ] Rules voting OK
- [ ] Maintenance requests OK
- [ ] Members + permissions OK
- [ ] Invitation code: Rejoindre résidence OK

#### SEO & Performance
- [ ] robots.txt mis à jour (désindexer marketplace)
- [ ] Sitemap.xml exclu routes Searcher
- [ ] Meta tags focus "Gestion colocation"
- [ ] Images optimisées
- [ ] Lazy loading non-critiques
- [ ] Lighthouse score > 90

#### Sécurité
- [ ] RLS policies vérifiées sur toutes tables
- [ ] Aucune fuite de données Searcher (anciennes)
- [ ] Rate limiting API OK
- [ ] CORS configuré correctement
- [ ] Environment variables sécurisées

### 5.2 Checklist UX/UI

- [ ] Design cohérent Owner/Resident
- [ ] Mobile responsive 100%
- [ ] Messages d'erreur clairs et en français
- [ ] Loading states partout
- [ ] Toast notifications pour actions
- [ ] Formulaires validation Zod
- [ ] Accessibility WCAG 2.1 Level AA

### 5.3 Checklist Contenu

- [ ] Page Coming Soon Searcher: Texte engageant
- [ ] Welcome emails Owner/Resident rédigés
- [ ] Trial ending emails (J-30, J-7, J-1) rédigés
- [ ] FAQ section abonnements
- [ ] CGV/CGU mis à jour pour abonnements
- [ ] Politique de remboursement définie

---

## 6. TIMELINE & ESTIMATION

### 6.1 Estimation Développement

**Développement avec Claude Code** (AI-assisted 6-7x speedup):

| Phase | Tâches | Temps Traditionnel | Temps AI-Assisted | Jours |
|-------|--------|-------------------|-------------------|-------|
| **Phase 1: Gating Searcher** | Coming soon page + Middleware + Welcome + RoleSwitchModal + API blocking | 20-24h | 3-4h | 0.5 jour |
| **Phase 2: Abonnement** | Migration DB + SubscriptionBanner + Subscription page + Triggers | 30-40h | 5-6h | 1 jour |
| **Phase 3: Tests & Optimisation** | Tests manuels + E2E + Performance + SEO | 20-25h | 3-4h | 0.5 jour |
| **Phase 4: Contenu & Communication** | Emails + FAQ + CGV + Messages | 15-20h | 2-3h | 0.5 jour |
| **TOTAL** | | **85-109h** | **13-17h** | **2.5 jours** |

**Avec marge de sécurité**: **3-4 jours de développement actif**

### 6.2 Planning Proposé

#### Semaine 1 (30 Déc - 5 Jan 2026)

**Jour 1-2 (30-31 Déc)**:
- ✅ Phase 1: Gating Searcher complet
- ✅ Tests protection routes
- ✅ Commit: "feat: Disable Searcher role for closed beta"

**Jour 3-4 (1-2 Jan)**:
- ✅ Phase 2: Système abonnement complet
- ✅ Tests subscription banner & countdown
- ✅ Commit: "feat: Add subscription system with free trials"

**Jour 5 (3 Jan)**:
- ✅ Phase 3: Tests complets Owner & Resident
- ✅ Performance & SEO optimizations
- ✅ Commit: "perf: Optimize for closed beta launch"

#### Semaine 2 (6-12 Jan 2026)

**Jour 6-7 (6-7 Jan)**:
- ✅ Phase 4: Contenu & emails
- ✅ Documentation utilisateur
- ✅ FAQ section
- ✅ Commit: "docs: Add closed beta documentation"

**Jour 8-9 (8-9 Jan)**:
- 🧪 QA Testing complet
- 🐛 Bug fixes
- ✅ Staging deployment

**Jour 10 (10 Jan)**:
- 🚀 **LANCEMENT BETA** 🎉
- 📊 Monitoring actif
- 📧 First welcome emails

### 6.3 Post-Lancement (J+1 à J+90)

**Semaine 1-2 (11-24 Jan)**:
- Monitoring quotidien (erreurs, usage, performance)
- Feedback utilisateurs early adopters
- Bug fixes critiques
- Ajustements UX mineurs

**Mois 2-3 (Feb-Mar 2026)**:
- Analyse utilisation réelle
- Optimisation features les plus utilisées
- Préparation intégration Stripe (si besoin)
- Collecte feedback pour roadmap Searcher

**Fin Période Gratuite Owners (10 Avril 2026 = J+90)**:
- Vérification emails trial ending envoyés
- Analyse conversion trial → paid
- Support utilisateurs pour setup paiement

---

## 7. RISQUES & MITIGATION

### 7.1 Risques Techniques

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| **Utilisateurs Searcher existants bloqués** | 🔴 Haut | Faible | Vérifier DB avant launch, migration si needed |
| **Fuites routes Searcher** | 🟠 Moyen | Moyen | Tests exhaustifs + middleware layers |
| **Subscription trigger ne se déclenche pas** | 🔴 Haut | Faible | Tests unitaires + E2E onboarding |
| **Performance dégradée** | 🟡 Faible | Faible | Monitoring + lazy loading |
| **Bug paiement Stripe (futur)** | 🟠 Moyen | Moyen | Sandbox tests, webhooks vérification |

### 7.2 Risques Business

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| **Faible adoption Owner** | 🔴 Haut | Moyen | Onboarding simple, demo vidéo, support proactif |
| **Churn élevé post-trial** | 🟠 Moyen | Moyen | Valeur démontrable, rappels email, incentives |
| **Frustration absence Searcher** | 🟡 Faible | Haut | Communication claire, waitlist engageante |
| **Concurrence lancement similaire** | 🟠 Moyen | Faible | Lancement rapide, features uniques (OCR, permissions) |

### 7.3 Plan de Contingence

**Si problème critique au lancement**:
1. **Rollback immédiat** via Vercel
2. **Communication transparente** utilisateurs
3. **Fix en < 2h** (monitoring Sentry)
4. **Post-mortem** documentation

**Si faible adoption (< 20 users J+30)**:
1. Analyse feedback utilisateurs
2. Ajustements UX urgents
3. Campagne email ciblée
4. Incentives early adopters (extension gratuite)

---

## 8. CONCLUSION

### 8.1 Résumé Exécutif

**Objectif**: Lancer Izzico en **circuits fermés Owner + Resident** avec système d'abonnement à périodes gratuites.

**Stratégie**:
1. ✅ Désactiver complètement rôle Searcher ("Bientôt disponible")
2. ✅ Fermer marketplace et matching public
3. ✅ Offrir 3 mois gratuits aux Owners, 6 mois aux Residents
4. ✅ Préparer transition vers abonnement payant
5. ✅ Valider product-market fit avant ouverture marketplace

**Livrable**: Application production-ready en **3-4 jours de développement**.

**Lancement Target**: **10 Janvier 2026** 🚀

### 8.2 Prochaines Étapes Immédiates

1. **Validation Alain**: Valider pricing et timeline
2. **Kickoff Dev**: Commencer Phase 1 (Gating Searcher)
3. **Tests Parallèles**: QA testing pendant dev
4. **Communication**: Préparer emails et contenu
5. **Launch**: 10 Janvier 2026 🎉

---

**Document préparé par**: Claude Code + Samuel
**Date**: 27 Décembre 2025
**Prochaine Review**: 2 Janvier 2026 (après Phase 1+2 complétées)

---

## ANNEXES

### A. Commandes Git Suggérées

```bash
# Phase 1
git checkout -b feat/closed-beta-searcher-gating
git commit -m "feat: Create coming soon page for Searcher role"
git commit -m "feat: Add middleware gating for Searcher routes"
git commit -m "feat: Disable Searcher option in role selection"
git commit -m "feat: Block Searcher in role switching modal"

# Phase 2
git checkout -b feat/subscription-system
git commit -m "feat: Add subscriptions database schema"
git commit -m "feat: Create subscription banner component"
git commit -m "feat: Add subscription settings page"
git commit -m "feat: Implement auto-subscription on onboarding"

# Phase 3
git checkout -b perf/closed-beta-optimizations
git commit -m "perf: Optimize Owner/Resident workflows"
git commit -m "fix: Update robots.txt for closed beta"
git commit -m "test: Add E2E tests for closed circuit flows"

# Merge to main
git checkout main
git merge feat/closed-beta-searcher-gating
git merge feat/subscription-system
git merge perf/closed-beta-optimizations
git push origin main
```

### B. Variables d'Environnement à Ajouter

```bash
# .env.local
NEXT_PUBLIC_SEARCHER_ENABLED=false
NEXT_PUBLIC_MARKETPLACE_ENABLED=false
NEXT_PUBLIC_OWNER_TRIAL_DAYS=90
NEXT_PUBLIC_RESIDENT_TRIAL_DAYS=180
NEXT_PUBLIC_OWNER_MONTHLY_PRICE=1299  # en centimes
NEXT_PUBLIC_RESIDENT_MONTHLY_PRICE=599 # en centimes
STRIPE_SECRET_KEY=sk_test_xxx  # Pour futur
STRIPE_WEBHOOK_SECRET=whsec_xxx # Pour futur
```

### C. Métriques à Tracker Post-Launch

**KPIs Semaine 1**:
- Nombre signups Owner
- Nombre signups Resident
- Taux completion onboarding
- Propriétés créées
- Résidences activées
- Messages envoyés

**KPIs Mois 1**:
- DAU/MAU (Daily/Monthly Active Users)
- Retention J7, J14, J30
- Features les plus utilisées
- Taux abandon onboarding
- Support tickets volume

**KPIs Mois 3 (Fin Trial Owners)**:
- Conversion Trial → Paid
- Churn rate
- NPS (Net Promoter Score)
- Feature requests top 10
- Readiness score pour lancement Searcher
