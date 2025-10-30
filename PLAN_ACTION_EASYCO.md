# Plan d'Action EasyCo MVP - Documentation Complète

**Date de création**: 30 octobre 2025
**Dernière mise à jour**: 30 octobre 2025 - Session 2
**Statut du projet**: Phase 1 & 2 terminées (Design System + Dashboards + Marketing Pages)
**Dernier commit**: `42d62c1` - Fix TypeScript literal type error

---

## 🎯 Vision Globale

EasyCo est une plateforme de colocation moderne avec **3 rôles distincts** :
- **Searcher** (Chercheur) - Jaune #FFD249
- **Owner** (Propriétaire) - Mauve #6E56CF
- **Resident** (Colocataire actuel) - Orange #FF6F3C

### Objectifs Stratégiques
1. **Browse First, Sign Up Later** - Inspiré d'Airbnb/Immoweb
2. **Conversion Intelligente** - CTAs contextuels partout
3. **Expérience Role-Based** - Chaque rôle a sa couleur, son dashboard, sa navigation
4. **Design Unifié** - Malgré 3 rôles distincts, maintenir l'identité EasyCo

### Références Inspirantes
- **Airbnb** - Recherche publique, UX fluide
- **HousingAnywhere** - Matching intelligent
- **Cohabs** - Community focus
- **Booking.com** - Conversion optimization
- **Tinder** - Swipe mechanics
- **Immoweb** - Browse sans inscription

---

## ✅ Phase 1 : Design System + Public Access (TERMINÉE)

### 1.1 Design System (globals.css)
**Fichier**: `/app/globals.css`

```css
/* SEARCHER - Yellow */
--searcher-primary: #FFD249;
--searcher-hover: #FFC107;
--searcher-light: #FFF9E6;
--searcher-dark: #F9A825;

/* OWNER - Mauve */
--owner-primary: #6E56CF;
--owner-hover: #5B45B8;
--owner-light: #F3F1FF;
--owner-dark: #4A148C;

/* RESIDENT - Orange */
--resident-primary: #FF6F3C;
--resident-hover: #FF5722;
--resident-light: #FFF3EF;
--resident-dark: #E64A19;
```

**Utilisation**:
```tsx
<body className="theme-searcher"> // ou theme-owner, theme-resident
  {/* Les composants utilisent var(--role-primary) */}
</body>
```

### 1.2 Composants de Recherche Publique

#### PublicSearchBar.tsx ✅
**Fichier**: `/components/PublicSearchBar.tsx`
- **Variants**: `hero` (landing page) et `compact` (header)
- **Filtres**: Localisation, budget, date d'emménagement
- **Quick filters**: Ville populaires
- **Redirect**: `/properties/browse?city=X&budget=Y&moveIn=Z`

#### PropertyCard.tsx ✅
**Fichier**: `/components/PropertyCard.tsx`
- **Variants**: `default` et `compact`
- **Features**: Photo, prix, localisation, chambres, favoris
- **Props optionnelles**: `showCompatibilityScore`, `isFavorite`

#### PropertyPreviewGrid.tsx ✅
**Fichier**: `/components/PropertyPreviewGrid.tsx`
- **Usage**: Landing page (6 propriétés featured)
- **Status**: Utilise mock data (à connecter à Supabase)
- **CTA**: "Voir toutes les propriétés" → `/properties/browse`

### 1.3 Middleware & Routing ✅

**Fichier**: `/middleware.ts`

```typescript
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/properties/browse', // ← Nouveau
  '/legal',
];

const guestLimitedRoutes = [
  '/properties/', // Property details (guest mode)
];
```

**Guest Mode**:
- Header: `X-Guest-Mode: true`
- Limite: 20 résultats pour les guests
- Authentifiés: Tous les résultats

### 1.4 Page Browse avec Guest Mode ✅

**Fichier**: `/app/properties/browse/page.tsx`

**Features**:
- Détection automatique guest vs authenticated
- Banner pour guests avec CTA "Créer mon compte gratuit"
- Limite 20 résultats pour guests
- Filtres: Ville, type, budget, chambres, disponibilité

**À faire**:
- Connecter à Supabase au lieu de mock data
- Ajouter filtres avancés (équipements, règles maison)

### 1.5 Composants Teaser (Conversion) ✅

**Fichier**: `/components/ui/TeaserCard.tsx`

**3 Variants**:

1. **TeaserCard** - Full card blur
```tsx
<TeaserCard
  isLocked={!isAuthenticated}
  blurLevel={2}
  ctaText="Créer un compte pour voir ton score"
  ctaHref="/auth/signup"
  badge="Premium"
>
  {/* Contenu blurré */}
</TeaserCard>
```

2. **TeaserCardCompact** - Inline teaser
3. **TeaserModal** - Full-screen modal

**Exemple d'usage**: `/app/properties/[id]/guest-example.tsx`

### 1.6 Landing Page Refactor ✅

**Fichier**: `/app/page.tsx`

**Changements**:
- Hero avec PublicSearchBar variant="hero"
- 3 CTAs role-based (Searcher, Owner, Resident)
- PropertyPreviewGrid (6 propriétés)
- Sections réduites pour focus sur search

### 1.7 Headers Role-Aware ✅

#### SearcherHeader.tsx ✅
**Fichier**: `/components/layout/SearcherHeader.tsx`
- **Couleur**: Jaune (#FFD249)
- **Navigation**: Accueil / Explorer / Matchs / Groupes / Messages
- **Badges**: Nouveaux matchs, messages non lus
- **Mobile**: Bottom nav avec scroll horizontal

#### OwnerHeader.tsx ✅
**Fichier**: `/components/layout/OwnerHeader.tsx`
- **Couleur**: Mauve (#6E56CF)
- **Navigation**: Dashboard / Analytiques / Annonces / Candidatures / Messages
- **Stats**: Revenu mensuel affiché
- **Quick Actions Bar**: ROI moyen, Taux d'occupation
- **Submenu Analytiques**: Vue d'ensemble, Performances, Finances, Occupants

#### ResidentHeader.tsx ✅
**Fichier**: `/components/layout/ResidentHeader.tsx`
- **Couleur**: Orange (#FF6F3C)
- **Navigation**: Hub / Tâches / Finances / Calendrier / Tickets / Chat
- **Group Name**: Nom de la coloc affiché
- **Balance Indicator**: "On te doit €X" ou "Tu dois €X"
- **Mobile**: Swipe navigation

---

## 🚀 Phase 2 : Dashboards Role-Based (TERMINÉE ✅)

**Status**: Implémentée et déployée
**Commits**: `01700d3`, `8784683`, `032a4c6`, `42d62c1`

### 2.1 Owner Dashboard v2 - Focus FINTECH 💰 ✅

**Fichier créé**: `/app/dashboard/owner/v2/page.tsx`
**Statut**: ✅ TERMINÉ

#### KPIs en Haut
```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <KPICard
    title="Revenu Mensuel"
    value="€3,450"
    trend="+12%"
    icon={DollarSign}
  />
  <KPICard
    title="Taux d'Occupation"
    value="96%"
    trend="+3%"
    icon={Home}
  />
  <KPICard
    title="ROI Annuel"
    value="8.2%"
    trend="+0.5%"
    icon={TrendingUp}
  />
  <KPICard
    title="Candidatures en attente"
    value="12"
    badge="urgent"
    icon={Users}
  />
</div>
```

#### Graphiques & Insights IA
- **Graphique Revenus**: Line chart 12 derniers mois
- **Graphique Occupation**: Bar chart par propriété
- **Insights IA**:
  ```
  💡 "Votre propriété 'Appart Ixelles' pourrait augmenter son loyer de 8%
     selon les prix du marché actuel"
  ```
  ```
  ⚠️ "3 baux expirent dans les 60 prochains jours - commencez à recruter"
  ```

#### Quick Actions
- Créer une annonce
- Voir candidatures urgentes
- Télécharger rapport financier
- Contacter un candidat

#### Tableau Propriétés
| Propriété | Occupation | Revenus/mois | Actions |
|-----------|------------|--------------|---------|
| Appart Ixelles | 100% (4/4) | €2,400 | Voir |
| Maison Etterbeek | 75% (3/4) | €1,800 | Recruter |

**Références Design**:
- Stripe Dashboard (KPIs, graphiques)
- Airbnb Host Dashboard (quick actions)
- Property management SaaS (tableaux)

---

### 2.2 Searcher Dashboard - Matching & Discovery 💛

**Fichier à créer**: `/app/dashboard/searcher/page.tsx`

#### Section Hero
```tsx
<div className="bg-gradient-to-r from-yellow-400 to-yellow-500">
  <h1>Bienvenue {firstName} 👋</h1>
  <p>Tu as {newMatches} nouveaux matchs aujourd'hui!</p>
  <Button>Commencer à swiper</Button>
</div>
```

#### Mes Matchs Récents
- Cards horizontales avec score de compatibilité
- **TeaserCard** si > 5 matchs (CTA pour voir plus)
- Boutons: "Contacter" / "Voir profil" / "Passer"

#### Propriétés Recommandées
- Algorithme de matching basique (budget, localisation, move-in date)
- PropertyCard avec `showCompatibilityScore={true}`
- Swipe mechanics (à implémenter)

#### Mes Groupes de Coloc
- Liste des groupes rejoints
- Status: "En formation" / "Complet" / "En recherche"
- Quick actions: "Inviter quelqu'un" / "Voir groupe"

#### Quick Stats
```tsx
<div className="grid grid-cols-3 gap-4">
  <StatCard title="Matchs" value={47} />
  <StatCard title="Favoris" value={12} />
  <StatCard title="Visites planifiées" value={3} />
</div>
```

**Références Design**:
- Tinder (swipe, matchs)
- LinkedIn (recommandations)
- Airbnb (favoris, saved searches)

---

### 2.3 Resident Dashboard - Community Hub 🧡

**Fichier à créer**: `/app/dashboard/resident/page.tsx`

#### Header Coloc Info
```tsx
<div className="bg-orange-500 text-white p-6">
  <h1>{groupName}</h1>
  <div className="flex gap-4">
    <Avatar /> <Avatar /> <Avatar /> <Avatar />
  </div>
  <p>4 colocataires • Bail jusqu'au 31/08/2026</p>
</div>
```

#### Balance Financier
```tsx
<FinanceCard
  yourBalance={-45}
  nextPaymentDate="05/11/2025"
  nextPaymentAmount={650}
  status="warning" // si balance négative
/>
```

#### Tâches à Faire
```tsx
<TaskList>
  <Task
    title="Sortir les poubelles"
    assignedTo="Toi"
    dueDate="Aujourd'hui"
    priority="high"
  />
  <Task
    title="Nettoyer cuisine"
    assignedTo="Marie"
    dueDate="Demain"
    priority="medium"
  />
</TaskList>
```

#### Calendrier Partagé
- Événements coloc (soirées, réunions)
- Dates importantes (loyer, inspections)
- Rotation des tâches

#### Tickets & Maintenance
- Liste des tickets ouverts
- Status: "Nouveau" / "En cours" / "Résolu"
- Bouton "Créer un ticket"

#### Chat de Coloc
- Messages récents du groupe
- Quick reply
- Lien vers page chat complète

**Références Design**:
- Splitwise (finances partagées)
- Notion (tâches, calendrier)
- WhatsApp (chat interface)

---

## 🔄 Phase 3 : Matching & Applications (MOYEN TERME)

### 3.1 Algorithme de Matching v0

**Fichier à créer**: `/lib/matching/algorithm.ts`

#### Critères de Base
```typescript
interface MatchingCriteria {
  // Hard filters (must match)
  budget: { min: number; max: number };
  location: string[];
  moveInDate: Date;

  // Soft filters (score calculation)
  lifestyle: {
    cleanliness: 1-5;
    socialLevel: 1-5;
    workSchedule: 'early' | 'regular' | 'late' | 'flexible';
    pets: boolean;
    smoking: boolean;
    guests: 'never' | 'sometimes' | 'often';
  };

  interests: string[]; // hobbies, activities
  languages: string[];
  ageRange: { min: number; max: number };
}
```

#### Score Calculation
```typescript
function calculateCompatibilityScore(
  searcher: UserProfile,
  property: Property,
  residents: UserProfile[]
): number {
  let score = 0;

  // Budget match (30%)
  if (property.monthly_rent <= searcher.budget.max) {
    score += 30;
  }

  // Lifestyle compatibility (40%)
  const lifestyleScore = calculateLifestyleMatch(
    searcher.lifestyle,
    residents.map(r => r.lifestyle)
  );
  score += lifestyleScore * 0.4;

  // Common interests (20%)
  const interestScore = calculateInterestOverlap(
    searcher.interests,
    residents.flatMap(r => r.interests)
  );
  score += interestScore * 0.2;

  // Location preference (10%)
  const locationScore = searcher.location.includes(property.city) ? 10 : 5;
  score += locationScore * 0.1;

  return Math.round(score);
}
```

### 3.2 Swipe Interface (à la Tinder)

**Fichier à créer**: `/app/matching/swipe/page.tsx`

**Features**:
- Stack de cards avec propriétés recommandées
- Swipe gauche = Pass
- Swipe droite = Like
- Super like = Match direct + notification
- Animation smooth (Framer Motion)

**Composants nécessaires**:
- `SwipeCard.tsx`
- `SwipeStack.tsx`
- `SwipeActions.tsx` (boutons Like/Pass/SuperLike)

### 3.3 Application Flow

**Fichiers à créer**:
- `/app/properties/[id]/apply/page.tsx` - Formulaire de candidature
- `/app/applications/page.tsx` - Liste des candidatures (pour Searcher)
- `/app/applications/[id]/page.tsx` - Détails d'une candidature (pour Owner)

**Application Form**:
```tsx
<ApplicationForm>
  <Section title="À propos de toi">
    <Textarea name="bio" />
    <Upload name="profile_picture" />
  </Section>

  <Section title="Questions du propriétaire">
    {property.custom_questions.map(q => (
      <Question key={q.id} question={q} />
    ))}
  </Section>

  <Section title="Documents">
    <Upload name="id_document" required />
    <Upload name="proof_of_income" required />
    <Upload name="references" optional />
  </Section>

  <Button type="submit">Envoyer ma candidature</Button>
</ApplicationForm>
```

**Owner Review Interface**:
```tsx
<ApplicationReview application={application}>
  <ApplicantProfile
    score={application.compatibility_score}
    bio={application.bio}
    lifestyle={application.lifestyle}
  />

  <Documents
    documents={application.documents}
    canDownload={true}
  />

  <Actions>
    <Button variant="success">Accepter</Button>
    <Button variant="secondary">Demander plus d'infos</Button>
    <Button variant="error">Refuser</Button>
  </Actions>
</ApplicationReview>
```

---

## 💬 Phase 4 : Messaging Real-Time (MOYEN TERME)

### 4.1 Architecture Messaging

**Tables Supabase**:
```sql
-- conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  type VARCHAR CHECK (type IN ('direct', 'group')),
  participants UUID[], -- Array of user IDs
  property_id UUID REFERENCES properties(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- messages
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  sender_id UUID REFERENCES users(id),
  content TEXT,
  type VARCHAR CHECK (type IN ('text', 'image', 'file', 'system')),
  read_by UUID[], -- Array of user IDs who read the message
  created_at TIMESTAMP
);
```

**Real-time avec Supabase**:
```typescript
// Subscribe to new messages
supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    },
    (payload) => {
      setMessages(prev => [...prev, payload.new]);
    }
  )
  .subscribe();
```

### 4.2 Composants Messaging

**Fichiers à créer**:
- `/app/messages/page.tsx` - Liste des conversations
- `/app/messages/[id]/page.tsx` - Conversation individuelle
- `/components/chat/MessageList.tsx`
- `/components/chat/MessageInput.tsx`
- `/components/chat/ConversationCard.tsx`

**Features**:
- Typing indicators
- Read receipts
- Image/file upload
- Emoji reactions
- Message search

---

## 🎨 Phase 5 : CTAs & Conversion Optimization (CONTINU)

### 5.1 CTAs Contextuels à Implémenter

#### Exit Intent Modal
```tsx
<ExitIntentModal
  trigger="mouseleave"
  delay={3000}
  showOnce={true}
>
  <h2>Attends! Ne pars pas sans créer ton compte 🎁</h2>
  <p>Inscris-toi maintenant et reçois:</p>
  <ul>
    <li>✨ Accès à toutes les propriétés</li>
    <li>💬 Messagerie avec propriétaires</li>
    <li>🎯 Matching intelligent personnalisé</li>
  </ul>
  <Button href="/auth/signup">Créer mon compte gratuit</Button>
</ExitIntentModal>
```

#### Scroll-Triggered Toast
```tsx
// Après 5 propriétés vues en guest mode
<Toast variant="info" duration={10000}>
  Tu as vu 5 annonces sur {totalCount}.
  <Link href="/auth/signup">Crée un compte</Link> pour tout voir!
</Toast>
```

#### Favorite CTA (Guest)
```tsx
// Quand guest clique sur favorite
<Modal>
  <HeartIcon className="text-red-500 w-16 h-16" />
  <h3>Sauvegarde tes coups de coeur ❤️</h3>
  <p>Crée un compte pour retrouver facilement tes propriétés préférées</p>
  <Button href="/auth/signup">M'inscrire gratuitement</Button>
</Modal>
```

#### Application CTA (Guest)
```tsx
// Quand guest clique "Postuler"
<TeaserModal
  isLocked={true}
  ctaText="Créer mon profil pour postuler"
  ctaHref="/auth/signup"
>
  <ApplicationFormPreview blur={3} />
</TeaserModal>
```

### 5.2 Analytics & Tracking

**Tool**: PostHog (déjà intégré)

**Events à tracker**:
```typescript
// Guest behavior
posthog.capture('guest_property_view', {
  property_id: propertyId,
  view_count: guestViewCount,
});

posthog.capture('guest_cta_shown', {
  cta_type: 'exit_intent' | 'scroll_trigger' | 'feature_block',
  location: pathname,
});

posthog.capture('guest_cta_clicked', {
  cta_type: string,
  destination: '/auth/signup' | '/auth/login',
});

// Conversion funnel
posthog.capture('signup_started', { role: 'searcher' | 'owner' });
posthog.capture('signup_completed', { role: string });
posthog.capture('profile_completed', { role: string });
posthog.capture('first_action', {
  role: string,
  action: 'property_view' | 'application_sent' | 'message_sent'
});
```

**Funnels à créer dans PostHog**:
1. Guest → Signup (par CTA type)
2. Signup → Profile Complete
3. Profile → First Application
4. Application → Accepted

---

## 🛠️ Tâches Techniques

### Priorité HAUTE (Cette semaine)

1. **Connecter browse page à Supabase** ✅ Mock data → Real data
   ```typescript
   // Remplacer mockProperties par:
   const { data: properties } = await supabase
     .from('properties')
     .select(`
       *,
       owner:users!properties_owner_id_fkey(first_name, last_name)
     `)
     .eq('status', 'available')
     .order('created_at', { ascending: false });
   ```

2. **Créer les 3 dashboards** (Owner, Searcher, Resident)
   - Voir Phase 2 ci-dessus

3. **Implémenter guest tracking**
   - Cookie pour compter les vues
   - Modal après 20 propriétés vues
   - PostHog events

### Priorité MOYENNE (2-3 semaines)

4. **Matching algorithm v0**
   - Voir Phase 3.1
   - Tester avec vraies données

5. **Application flow**
   - Formulaire de candidature
   - Review interface pour Owner
   - Notifications

6. **Messaging real-time**
   - Voir Phase 4
   - Intégrer Supabase Realtime

### Priorité BASSE (1-2 mois)

7. **Swipe interface**
   - Framer Motion animations
   - Gesture handling
   - Like/Pass logic

8. **Advanced filters**
   - Équipements (wifi, lave-linge, etc.)
   - Règles maison (pets, smoking, guests)
   - Disponibilité flexible

9. **Property management features** (pour Owner)
   - Bulk edit
   - Duplicate listing
   - Archive/Activate

---

## 📊 Structure Base de Données (Supabase)

### Tables Existantes à Vérifier

```sql
-- users (via Supabase Auth)
-- profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role VARCHAR CHECK (role IN ('searcher', 'owner', 'resident')),
  first_name VARCHAR,
  last_name VARCHAR,
  avatar_url VARCHAR,
  phone VARCHAR,
  bio TEXT,

  -- Lifestyle (pour matching)
  lifestyle JSONB, -- { cleanliness, socialLevel, workSchedule, etc. }
  interests TEXT[], -- Array of interests
  languages TEXT[],

  -- Preferences (pour searcher)
  budget_min INTEGER,
  budget_max INTEGER,
  preferred_locations TEXT[],
  move_in_date DATE,

  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- properties
CREATE TABLE properties (
  id UUID PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id),
  title VARCHAR,
  description TEXT,
  property_type VARCHAR,
  address TEXT,
  city VARCHAR,
  postal_code VARCHAR,

  -- Financial
  monthly_rent INTEGER,
  deposit INTEGER,
  charges_included BOOLEAN,

  -- Details
  bedrooms INTEGER,
  total_rooms INTEGER,
  bathrooms INTEGER,
  square_meters INTEGER,
  floor INTEGER,

  -- Features
  amenities TEXT[], -- ['wifi', 'washing_machine', 'dishwasher', etc.]
  house_rules JSONB, -- { pets, smoking, guests, etc. }

  -- Media
  photos JSONB[], -- [{ url, order, caption }]

  -- Availability
  available_from DATE,
  lease_duration INTEGER, -- en mois

  status VARCHAR CHECK (status IN ('draft', 'available', 'rented', 'archived')),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- applications
CREATE TABLE applications (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  applicant_id UUID REFERENCES profiles(id),

  status VARCHAR CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),

  -- Application data
  bio TEXT,
  answers JSONB, -- Réponses aux questions custom du owner
  documents JSONB[], -- [{ type, url, name }]

  -- Matching
  compatibility_score INTEGER,

  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- groups (colocs formées)
CREATE TABLE groups (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  name VARCHAR,

  members UUID[], -- Array of user IDs
  admin_id UUID REFERENCES profiles(id),

  status VARCHAR CHECK (status IN ('forming', 'complete', 'active')),

  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  property_id UUID REFERENCES properties(id),
  created_at TIMESTAMP,

  UNIQUE(user_id, property_id)
);

-- matches (pour système de matching)
CREATE TABLE matches (
  id UUID PRIMARY KEY,
  searcher_id UUID REFERENCES profiles(id),
  property_id UUID REFERENCES properties(id),

  score INTEGER, -- 0-100
  status VARCHAR CHECK (status IN ('suggested', 'liked', 'passed', 'mutual')),

  created_at TIMESTAMP,

  UNIQUE(searcher_id, property_id)
);
```

---

## 🎨 Composants UI à Créer

### Design System

```
/components/ui/
  ├── badge.tsx ✅
  ├── button.tsx ✅
  ├── card.tsx ✅
  ├── input.tsx ✅
  ├── textarea.tsx ✅
  ├── select.tsx ✅
  ├── dialog.tsx ✅
  ├── dropdown-menu.tsx ✅
  ├── toast.tsx ✅
  ├── teaser-card.tsx ✅
  │
  ├── kpi-card.tsx ⚠️ À créer
  ├── stat-card.tsx ⚠️ À créer
  ├── chart.tsx ⚠️ À créer (recharts)
  ├── swipe-card.tsx ⚠️ À créer
  ├── exit-intent-modal.tsx ⚠️ À créer
  └── progress-ring.tsx ⚠️ À créer
```

### Feature Components

```
/components/
  ├── PublicSearchBar.tsx ✅
  ├── PropertyCard.tsx ✅
  ├── PropertyPreviewGrid.tsx ✅
  │
  ├── ApplicationForm.tsx ⚠️
  ├── ApplicationReview.tsx ⚠️
  ├── MatchCard.tsx ⚠️
  ├── SwipeStack.tsx ⚠️
  ├── MessageList.tsx ⚠️
  ├── MessageInput.tsx ⚠️
  ├── ConversationCard.tsx ⚠️
  ├── TaskList.tsx ⚠️
  ├── FinanceCard.tsx ⚠️
  └── CalendarWidget.tsx ⚠️
```

### Layout Components

```
/components/layout/
  ├── SearcherHeader.tsx ✅
  ├── OwnerHeader.tsx ✅
  ├── ResidentHeader.tsx ✅
  ├── PublicHeader.tsx ⚠️ À créer (pour non-authentifiés)
  └── Footer.tsx ⚠️ À créer
```

---

## 🚨 Issues Connues & Dette Technique

### Résolues ✅
1. ~~Badge variant "destructive" n'existe pas~~ → Fixed avec variant="error"

### En cours
1. **Mock data partout** - PropertyPreviewGrid et browse page utilisent des données fictives
   - **Action**: Créer queries Supabase réelles
   - **Priorité**: HAUTE

2. **Pas de vraies photos** - Les propriétés n'ont pas d'images réelles
   - **Action**: Seed database avec vraies photos ou placeholders
   - **Priorité**: MOYENNE

3. **Matching algorithm manquant** - Scores de compatibilité sont fakés
   - **Action**: Implémenter Phase 3.1
   - **Priorité**: HAUTE

### À surveiller
1. **Performance images** - Pas d'optimisation Next.js Image
   - **Action**: Utiliser `<Image>` partout au lieu de `<img>`
   - **Priorité**: MOYENNE

2. **Mobile testing** - Headers testés desktop only
   - **Action**: Test complet sur mobile réel
   - **Priorité**: MOYENNE

3. **SEO** - Pas de metadata dynamique
   - **Action**: Ajouter metadata par page
   - **Priorité**: BASSE

---

## 📝 Notes de Session

### Session du 30 octobre 2025

**Travail accompli**:
- ✅ Design system complet (3 rôles, CSS variables)
- ✅ Composants de recherche publique (SearchBar, PropertyCard, Grid)
- ✅ Landing page refactor avec search prominent
- ✅ Middleware guest mode
- ✅ Browse page avec support guest/authenticated
- ✅ TeaserCard component (3 variants)
- ✅ 3 headers role-aware (Searcher, Owner, Resident)
- ✅ Fix Badge variant error

**Commits**:
- `d27d690` - Implémentation Phase 1 complète
- `a7d474f` - Fix Badge variants destructive → error

**Prochaine session**:
1. Connecter browse page à Supabase (enlever mock data)
2. Créer Owner Dashboard avec KPIs & graphiques
3. Créer Searcher Dashboard avec matchs
4. Créer Resident Dashboard avec hub coloc

**Questions en suspens**:
- Quel service pour upload photos? (Supabase Storage?)
- Intégrer Stripe pour paiements loyers? (Phase future)
- Utiliser quel lib pour graphiques? (Recommandation: Recharts)

---

## 🔗 Liens Utiles

### Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [PostHog](https://posthog.com/docs)

### Design Inspiration
- [Airbnb Design](https://airbnb.design/)
- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Linear App](https://linear.app/) - Pour task management UX

### Tools
- [Recharts](https://recharts.org/) - Pour graphiques
- [Framer Motion](https://www.framer.com/motion/) - Pour animations swipe
- [React Hook Form](https://react-hook-form.com/) - Pour formulaires
- [Zod](https://zod.dev/) - Pour validation

---

## 🎯 Métriques de Succès (Future)

### Conversion Metrics
- **Guest → Signup**: Objectif 15%
- **Signup → Profile Complete**: Objectif 80%
- **Profile → First Application**: Objectif 40%

### Engagement Metrics
- **DAU/MAU Ratio**: Objectif 30%
- **Avg Session Duration**: Objectif 5min+
- **Messages per User**: Objectif 10/semaine

### Business Metrics
- **Properties Listed**: Objectif 100 (3 mois)
- **Active Searchers**: Objectif 500 (3 mois)
- **Successful Matches**: Objectif 50 (3 mois)

---

**Document maintenu par**: Claude Code
**Dernière mise à jour**: 30 octobre 2025
**Version**: 1.0
