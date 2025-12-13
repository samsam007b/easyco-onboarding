# Analyse & Roadmap: Enrichissement Interface Resident

## 🎯 Objectif
Transformer l'interface Resident en un outil quotidien indispensable centré sur:
- **Argent** (loyer, charges, dépenses partagées)
- **Ménage** (tâches, rotations, responsabilités)
- **Incidents** (maintenance, problèmes)
- **Administratif** (documents, règles, contrats)

**Philosophie**: Pragmatisme > Réseau social. On règle les problèmes réels de colocation.

---

## 📊 État des lieux: Ce qui existe déjà

### ✅ Infrastructure DB en place (migration `011_create_hub_tables.sql`)
```
expenses + expense_splits ✅
tasks ✅
calendar_events + event_attendees ✅
maintenance_requests ✅
```

### ✅ Interface actuelle (`ModernResidentDashboard.tsx`)
- KPI Cards: Loyer, Dépenses partagées, Solde personnel, Colocataires
- Tâches à venir (mockées)
- Activité récente (mockée)
- Bonheur de la coloc (94%)
- Invitation de colocataires

### 🔴 Limites actuelles
1. **Données mockées**: Les tâches et activités ne sont pas connectées à Supabase
2. **Fonctionnalités limitées**: Pas de scan de tickets, pas de split intelligent, pas de règles de maison
3. **Pas de documents**: Aucun stockage de bail, assurances, etc.
4. **Pas d'agent proactif**: Aucune suggestion automatique
5. **Calendrier basique**: Pas de réservation d'espaces (salle de bain, machine à laver)

---

## 🎨 Analyse des 10 features proposées

### 🟢 PRIORITÉ 1 - Quick Wins avec Infrastructure Existante

#### 1. **Journal des dépenses & split intelligent** ⭐⭐⭐⭐⭐
**Status**: 60% fait
- ✅ Table `expenses` avec catégories (rent, utilities, groceries, cleaning, maintenance, internet, other)
- ✅ Table `expense_splits` avec montants individuels
- ✅ Split types: equal, custom, percentage
- 🔴 Manque: Scan de tickets (OCR), historique UI, rappels automatiques, export PDF/CSV

**Action**:
- Ajouter colonne `receipt_image_url` (déjà `receipt_url` existe!)
- Créer UI pour upload + OCR (Google Cloud Vision ou Tesseract)
- Ajouter notifications/rappels via table `notifications`
- Export PDF: générer avec PDFKit ou jsPDF

**Effort**: 2-3 jours
**ROI**: ⭐⭐⭐⭐⭐ (C'est le cœur du problème colocation)

---

#### 2. **Loyer & charges** ⭐⭐⭐⭐⭐
**Status**: 40% fait
- ✅ Dashboard montre loyer du mois (`rentStatus`)
- ✅ Table `expenses` peut gérer les charges via catégorie `utilities`
- 🔴 Manque: Échéancier mensuel, justificatifs, projection des charges, alertes budget

**Action**:
- Ajouter table `rent_payments` (historique mensuel)
```sql
CREATE TABLE rent_payments (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  user_id UUID REFERENCES users(id),
  month DATE NOT NULL, -- premier jour du mois
  amount DECIMAL(10,2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'overdue')),
  proof_url TEXT, -- justificatif de paiement
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
- Ajouter `utility_budget` dans table `properties` (estimation mensuelle)
- Créer notifications automatiques: J-7, J-3, J-0 avant échéance
- Dashboard: graphique d'évolution des charges (Chart.js)

**Effort**: 2 jours
**ROI**: ⭐⭐⭐⭐⭐

---

#### 3. **Planning des tâches domestiques** ⭐⭐⭐⭐
**Status**: 70% fait
- ✅ Table `tasks` avec recurrence (daily, weekly, biweekly, monthly)
- ✅ Catégories (cleaning, groceries, maintenance, admin, other)
- ✅ Assignation (assigned_to)
- 🔴 Manque: Rotations automatiques, échanges de tours, preuve photo, mode vacances

**Action**:
- Ajouter colonne `rotation_group_id` dans `tasks` (pour tours de rôle)
- Créer table `task_rotations`:
```sql
CREATE TABLE task_rotations (
  id UUID PRIMARY KEY,
  task_id UUID REFERENCES tasks(id),
  rotation_order JSONB NOT NULL, -- ["user1_id", "user2_id", "user3_id"]
  current_position INTEGER DEFAULT 0,
  last_rotated_at TIMESTAMPTZ
);
```
- Ajouter `proof_image_url` dans `tasks`
- Créer table `user_availability` pour mode vacances/pause
- Function PostgreSQL: `rotate_task_assignment()` (trigger hebdomadaire)

**Effort**: 2 jours
**ROI**: ⭐⭐⭐⭐

---

#### 4. **Gestion d'incidents / maintenance** ⭐⭐⭐⭐
**Status**: 90% fait !
- ✅ Table `maintenance_requests` avec catégories, priorités, statuts
- ✅ Images (JSONB)
- ✅ Coûts (estimated_cost, actual_cost)
- ✅ Timeline (created_at, resolved_at)
- 🔴 Manque: Assignation au propriétaire, UI pour suivi

**Action**:
- Ajouter colonne `assigned_to_owner` BOOLEAN
- Créer page `/hub/maintenance` avec liste des tickets
- Notification automatique au proprio si priority = 'emergency'
- UI pour drag & drop photos

**Effort**: 1 jour
**ROI**: ⭐⭐⭐⭐

---

### 🟡 PRIORITÉ 2 - Features Moyennement Complexes

#### 5. **Calendrier de réservation des espaces** ⭐⭐⭐
**Status**: 30% fait
- ✅ Table `calendar_events` existe
- 🔴 Manque: Notion de "ressource" (salle de bain, machine à laver), règles de réservation

**Action**:
- Créer table `shared_resources`:
```sql
CREATE TABLE shared_resources (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  name TEXT NOT NULL, -- "Salle de bain", "Machine à laver"
  type TEXT CHECK (type IN ('bathroom', 'washing_machine', 'kitchen', 'common_room')),
  booking_duration_minutes INTEGER DEFAULT 30, -- durée typique
  max_advance_days INTEGER DEFAULT 7, -- max jours à l'avance
  rules TEXT -- règles spécifiques
);
```
- Modifier `calendar_events` pour ajouter `resource_id`
- UI: vue calendrier avec créneaux disponibles (react-big-calendar)
- Validation: empêcher double booking

**Effort**: 2-3 jours
**ROI**: ⭐⭐⭐ (Nice to have, mais pas critique)

---

#### 6. **Liste de courses partagée** ⭐⭐⭐
**Status**: 0% fait
**Action**:
- Créer table `shopping_lists`:
```sql
CREATE TABLE shopping_lists (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  created_by UUID REFERENCES users(id),
  name TEXT DEFAULT 'Liste de courses',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE shopping_items (
  id UUID PRIMARY KEY,
  list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity TEXT, -- "2kg", "1 bouteille"
  category TEXT CHECK (category IN ('fruits_legumes', 'viande', 'produits_laitiers', 'epicerie', 'hygiene', 'autre')),
  brand_preference TEXT,
  is_bio BOOLEAN DEFAULT FALSE,
  assigned_to UUID REFERENCES users(id), -- qui achète
  is_purchased BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMPTZ,
  estimated_price DECIMAL(10,2)
);
```
- UI collaborative temps réel (Supabase Realtime subscriptions)
- Push notification quand quelqu'un ajoute un item

**Effort**: 2 jours
**ROI**: ⭐⭐⭐

---

#### 7. **Règles de maison + votes** ⭐⭐⭐⭐
**Status**: 0% fait
**Action**:
- Créer tables `house_rules` et `rule_votes`:
```sql
CREATE TABLE house_rules (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  category TEXT CHECK (category IN ('noise', 'guests', 'cleaning', 'smoking', 'pets', 'other')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('draft', 'voting', 'active', 'archived')) DEFAULT 'draft',
  created_by UUID REFERENCES users(id),
  votes_for INTEGER DEFAULT 0,
  votes_against INTEGER DEFAULT 0,
  adopted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rule_votes (
  id UUID PRIMARY KEY,
  rule_id UUID REFERENCES house_rules(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  vote TEXT CHECK (vote IN ('for', 'against', 'abstain')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(rule_id, user_id)
);
```
- UI: proposition de règle -> vote (48h) -> adoption si majorité
- Historique des changements (audit log)

**Effort**: 2 jours
**ROI**: ⭐⭐⭐⭐ (Prévient conflits)

---

### 🔴 PRIORITÉ 3 - Features Complexes / Long Terme

#### 8. **Coffre-fort documents** ⭐⭐⭐⭐⭐
**Status**: 0% fait
**Action**:
- Créer table `property_documents`:
```sql
CREATE TABLE property_documents (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  uploaded_by UUID REFERENCES users(id),
  category TEXT CHECK (category IN ('lease', 'inventory', 'insurance', 'payment_proof', 'other')) NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL, -- Supabase Storage
  file_type TEXT, -- "application/pdf", "image/jpeg"
  file_size_kb INTEGER,
  access_level TEXT CHECK (access_level IN ('all_members', 'owner_only', 'creator_only')) DEFAULT 'all_members',
  expires_at DATE, -- pour assurances, bail
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
- Utiliser Supabase Storage avec bucket `property-documents`
- RLS: accès selon `access_level`
- Notifications: J-30, J-7 avant expiration (assurance, bail)
- UI: upload drag & drop, prévisualisation PDF

**Effort**: 3 jours
**ROI**: ⭐⭐⭐⭐⭐ (Crucial pour administratif)

---

#### 9. **Mode invité / gestion des invités** ⭐⭐
**Status**: 0% fait
**Complexité**: Moyenne-élevée
**Action**:
- Créer table `guest_invitations`:
```sql
CREATE TABLE guest_invitations (
  id UUID PRIMARY KEY,
  property_id UUID REFERENCES properties(id),
  invited_by UUID REFERENCES users(id),
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  access_code TEXT, -- Code QR ou PIN (futur smart-lock)
  house_rules_sent BOOLEAN DEFAULT FALSE,
  status TEXT CHECK (status IN ('pending', 'active', 'expired', 'cancelled')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
- Génération de QR code (bibliothèque `qrcode`)
- Email automatique avec règles de maison
- (Phase 2) Intégration smart-lock API (August, Nuki, etc.)

**Effort**: 2-3 jours (sans smart-lock), 5+ jours (avec)
**ROI**: ⭐⭐ (Nice to have, pas urgent)

---

#### 10. **Assistant résident proactif (agent)** ⭐⭐⭐⭐⭐
**Status**: 0% fait
**Complexité**: Élevée
**Action**:
- Système de recommandations basé sur événements:
  - Fin de bail proche (J-90, J-60, J-30) → Checklist renouvellement ou déménagement
  - Paiements en retard (J+3, J+7) → Relances douces
  - Tâches non faites (overdue > 7j) → Rappels
  - Charges anormales (+20% vs moyenne) → Alerte consommation
  - Bonheur coloc < 70% → Suggestions (réunion maison, activités)

- Créer table `smart_recommendations`:
```sql
CREATE TABLE smart_recommendations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  property_id UUID REFERENCES properties(id),
  type TEXT CHECK (type IN ('lease_renewal', 'payment_reminder', 'task_reminder', 'budget_alert', 'happiness_boost')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  action_url TEXT, -- lien vers page pertinente
  priority INTEGER DEFAULT 1, -- 1 = low, 5 = critical
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ -- expiration de la recommandation
);
```

- Trigger PostgreSQL ou Edge Function (Supabase) qui s'exécute:
  - Quotidiennement (cron) pour vérifier dates échéances
  - Hebdomadairement pour analyser dépenses
  - En temps réel sur certains événements (nouveau paiement, tâche complétée)

- UI: Badge dans dashboard avec icône "✨ Assistant"
- Notifications push personnalisées

**Effort**: 5-7 jours
**ROI**: ⭐⭐⭐⭐⭐ (Différenciateur énorme, valeur ajoutée AI)

---

## 🎯 Recommandations Stratégiques

### Phase 1 (1-2 semaines) - Quick Wins
**Objectif**: Rendre fonctionnelles les features déjà à 60%+
1. ✅ **Dépenses partagées complètes** (scan tickets, rappels, export)
2. ✅ **Loyer & charges** (échéancier, justificatifs, projections)
3. ✅ **Tâches avec rotations** (automatiques, preuve photo)
4. ✅ **Maintenance UI** (connecter la table existante)

**Résultat**: L'app devient immédiatement utile pour argent + ménage + incidents.

---

### Phase 2 (2-3 semaines) - Consolidation
**Objectif**: Ajouter les features moyennement complexes
5. ✅ **Règles de maison + votes** (prévention conflits)
6. ✅ **Coffre-fort documents** (administratif béton)
7. ✅ **Calendrier de réservation** (espaces partagés)
8. ✅ **Liste de courses** (collaboration quotidienne)

**Résultat**: Couverture complète des 4 piliers (argent, ménage, incidents, admin).

---

### Phase 3 (1 mois) - Différenciation
**Objectif**: Features avancées qui démarquent EasyCo
9. ✅ **Assistant proactif** (AI-powered recommendations)
10. 🟡 **Mode invité** (si demande forte, sinon en backlog)

**Résultat**: EasyCo devient l'app de référence pour colocation en France.

---

## 🏗️ Architecture Technique Recommandée

### Base de données
```
Tables principales:
✅ expenses, expense_splits (existant)
✅ tasks (existant)
✅ calendar_events (existant)
✅ maintenance_requests (existant)
🆕 rent_payments
🆕 task_rotations
🆕 shared_resources
🆕 shopping_lists, shopping_items
🆕 house_rules, rule_votes
🆕 property_documents
🆕 guest_invitations
🆕 smart_recommendations
```

### Services
```
/lib/services/
  - expense-service.ts (OCR, splits, export)
  - rent-service.ts (échéancier, projections)
  - task-rotation-service.ts (rotations auto)
  - maintenance-service.ts (tickets, assignations)
  - document-service.ts (upload, RLS, expiration)
  - recommendation-engine.ts (agent proactif)
  - notification-service.ts (rappels, alertes)
```

### Supabase Edge Functions
```
/supabase/functions/
  - daily-rent-reminders/
  - weekly-task-rotation/
  - budget-analysis/
  - smart-recommendations/
  - ocr-receipt-parser/
```

### UI Components
```
/components/hub/
  - ExpenseTracker.tsx (scan, split, historique)
  - RentDashboard.tsx (échéancier, graphiques)
  - TaskRotationManager.tsx (calendrier, rotations)
  - MaintenanceBoard.tsx (tickets Kanban)
  - DocumentVault.tsx (coffre-fort)
  - HouseRulesVoting.tsx (propositions, votes)
  - ResourceBooking.tsx (calendrier réservations)
  - ShoppingList.tsx (collaborative, temps réel)
  - SmartAssistant.tsx (recommandations)
```

---

## 💡 Insights Clés

### 1. **Données > Features**
Ne pas créer de features "vides". Prioriser celles où on a déjà 60%+ de l'infra.

### 2. **Real-time Matters**
Utiliser Supabase Realtime pour:
- Liste de courses (collaboration instantanée)
- Paiements de dépenses (mise à jour soldes)
- Assignation de tâches (notifications immédiates)

### 3. **Notifications Stratégiques**
Ne pas spammer. Seulement:
- Échéances importantes (loyer J-3)
- Conflits potentiels (tâche non faite J+7)
- Opportunités (budget optimisable)

### 4. **Mobile-First**
80%+ des utilisations seront sur mobile. Penser:
- Scan de tickets (camera native)
- Notifications push
- UI tactile (swipe actions)

### 5. **Gamification Subtile**
Pas de points/badges ridicules, mais:
- "Bonheur de la coloc" (indicateur visuel)
- Streaks pour tâches (motivation douce)
- Historique de contributions (transparence)

---

## ❓ Questions Ouvertes

1. **OCR**: Google Cloud Vision (payant, précis) ou Tesseract (gratuit, moins bon)?
2. **Export PDF**: Générer côté client (jsPDF) ou serveur (Edge Function)?
3. **Smart-lock**: Intégrer dès Phase 1 ou attendre retours utilisateurs?
4. **AI Recommendations**: Simple règles (if/then) ou vrai ML (coût)?
5. **Monétisation**: Certaines features premium (documents illimités, assistant avancé)?

---

## 🚀 Prochaines Étapes Concrètes

Si tu valides cette analyse, on peut:

1. **Commencer Phase 1** en créant:
   - Migration SQL pour `rent_payments`
   - Service OCR pour scan de tickets
   - UI pour échéancier loyer
   - Système de rotations automatiques

2. **Ou raffiner l'analyse** si tu as des ajustements/priorités différentes.

Qu'en penses-tu? On attaque Phase 1 ou tu veux discuter certains points d'abord?
