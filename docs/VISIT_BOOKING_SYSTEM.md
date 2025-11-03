# 📅 Visit Booking System - EasyCo

## Vue d'ensemble

Système complet de réservation de visites pour les propriétés, permettant aux chercheurs de colocation (searchers) de réserver des visites en personne ou virtuelles avec les propriétaires.

**Date de création:** 2025-01-03
**Statut:** ✅ Implémenté et prêt à tester
**Priorité:** 🔴 CRITIQUE (Feature #1 des features manquantes)

---

## 🎯 Fonctionnalités

### Pour les Searchers:
- ✅ Parcourir les créneaux disponibles sur un calendrier
- ✅ Choisir entre visite en personne ou virtuelle
- ✅ Réserver un créneau de 30 minutes
- ✅ Ajouter des notes pour le propriétaire
- ✅ Fournir coordonnées (téléphone, email)
- ✅ Voir toutes leurs visites (à venir et passées)
- ✅ Annuler une visite
- ✅ Laisser un feedback après la visite

### Pour les Owners:
- ✅ Définir leurs disponibilités par jour de la semaine
- ✅ Voir toutes les demandes de visite
- ✅ Confirmer ou refuser une visite
- ✅ Ajouter un message de réponse
- ✅ Fournir un lien de réunion virtuelle (Zoom, Google Meet)
- ✅ Marquer une visite comme complétée

---

## 📊 Base de Données

### Tables Créées

#### 1. `visit_time_slots`
Créneaux horaires prédéfinis pour les visites.

```sql
- id: UUID (PK)
- slot_name: TEXT (ex: "Morning - 9:00 AM")
- start_time: TIME
- end_time: TIME
- duration_minutes: INTEGER (default: 30)
- is_active: BOOLEAN
```

**Données initiales:** 20 créneaux de 9h00 à 19h00 (intervalles de 30 min)

---

#### 2. `visit_availability`
Disponibilités des propriétaires pour leurs propriétés.

```sql
- id: UUID (PK)
- property_id: UUID (FK → properties)
- owner_id: UUID (FK → users)
- day_of_week: INTEGER (0 = Dimanche, 6 = Samedi)
- start_time: TIME
- end_time: TIME
- is_available: BOOLEAN
- notes: TEXT (instructions spéciales)
- max_visits_per_day: INTEGER (default: 5)
- buffer_minutes: INTEGER (default: 15)
```

**Index:**
- `idx_visit_availability_property` sur `property_id`
- `idx_visit_availability_owner` sur `owner_id`
- `idx_visit_availability_day` sur `day_of_week`

---

#### 3. `property_visits`
Visites réservées.

```sql
- id: UUID (PK)
- property_id: UUID (FK → properties)
- visitor_id: UUID (FK → users) -- Le searcher
- owner_id: UUID (FK → users)
- scheduled_at: TIMESTAMPTZ
- duration_minutes: INTEGER (default: 30)
- visit_type: TEXT ('in_person' | 'virtual')
- status: TEXT (voir workflow ci-dessous)
- visitor_notes: TEXT
- owner_response: TEXT
- visitor_phone: TEXT
- visitor_email: TEXT
- meeting_url: TEXT (pour visites virtuelles)
- meeting_password: TEXT
- visitor_rating: INTEGER (1-5)
- visitor_feedback: TEXT
- was_helpful: BOOLEAN
- created_at, updated_at, confirmed_at, completed_at, cancelled_at
```

**Statuts possibles:**
- `pending` - En attente de confirmation du propriétaire
- `confirmed` - Confirmée par le propriétaire
- `completed` - Visite terminée
- `cancelled_by_visitor` - Annulée par le chercheur
- `cancelled_by_owner` - Annulée par le propriétaire
- `no_show` - Absence non excusée

**Index:**
- `idx_property_visits_property` sur `property_id`
- `idx_property_visits_visitor` sur `visitor_id`
- `idx_property_visits_owner` sur `owner_id`
- `idx_property_visits_status` sur `status`
- `idx_property_visits_scheduled` sur `scheduled_at`
- Indexes composites pour requêtes courantes

---

## 🔐 Row Level Security (RLS)

### Policies Implémentées

**visit_time_slots:**
- ✅ Lecture publique (tout le monde peut voir les créneaux)

**visit_availability:**
- ✅ Lecture publique
- ✅ CRUD complet pour les propriétaires (leurs propres disponibilités)

**property_visits:**
- ✅ Searchers voient leurs propres visites
- ✅ Owners voient les visites de leurs propriétés
- ✅ Searchers peuvent créer et modifier leurs visites
- ✅ Owners peuvent modifier les visites de leurs propriétés

---

## ⚙️ Fonctions SQL

### 1. `get_available_slots(property_id, date)`
Retourne tous les créneaux disponibles pour une propriété à une date donnée.

**Logique:**
- Croise les `visit_time_slots` avec les `visit_availability`
- Vérifie qu'il n'y a pas déjà de visite réservée
- Retourne `slot_start`, `slot_end`, `is_available`

**Usage:**
```sql
SELECT * FROM get_available_slots('uuid-property', '2025-01-15');
```

---

### 2. `is_slot_available(property_id, scheduled_at, duration)`
Vérifie si un créneau spécifique est disponible.

**Logique:**
- Vérifie la disponibilité du propriétaire pour ce jour/heure
- Vérifie qu'il n'y a pas de conflit avec une visite existante
- Retourne `BOOLEAN`

**Usage:**
```sql
SELECT is_slot_available('uuid-property', '2025-01-15 10:00:00+00', 30);
```

---

## 🔔 Notifications Automatiques

### Triggers Implémentés

#### 1. `notify_new_visit_booking`
**Déclencheur:** Nouvelle visite créée
**Action:** Crée une notification pour le propriétaire

```json
{
  "type": "visit_requested",
  "title": "New Visit Request",
  "message": "Someone wants to visit your property",
  "link": "/dashboard/owner/visits"
}
```

---

#### 2. `notify_visit_confirmed`
**Déclencheur:** Statut passe de `pending` → `confirmed`
**Action:** Crée une notification pour le visiteur

```json
{
  "type": "visit_confirmed",
  "title": "Visit Confirmed",
  "message": "Your property visit has been confirmed",
  "link": "/dashboard/searcher/my-visits"
}
```

---

## 📱 Frontend - Pages & Composants

### Pages Créées

#### 1. `/properties/[id]/book-visit`
**Description:** Page de réservation de visite pour une propriété

**Fonctionnalités:**
- Sélection du type de visite (en personne / virtuelle)
- Calendrier des 14 prochains jours
- Affichage des créneaux disponibles en temps réel
- Formulaire de contact (téléphone, email, notes)
- Résumé de la réservation
- Confirmation

**État:** ✅ Complet

---

#### 2. `/dashboard/searcher/my-visits`
**Description:** Gestion des visites pour les searchers

**Fonctionnalités:**
- Onglets: Visites à venir / Visites passées
- Statistiques (total, à venir, complétées)
- Détails complets de chaque visite
- Actions: Voir propriété, Annuler, Laisser feedback
- Modal de feedback (rating, commentaire, was_helpful)
- Affichage du lien de réunion virtuelle

**État:** ✅ Complet

---

### Composants

#### ModernSearcherHeader
**Modification:** Ajout de l'item "Visites" dans la navigation

```tsx
{
  id: 'visits',
  href: '/dashboard/searcher/my-visits',
  label: 'Visites',
  icon: Calendar,
}
```

---

#### PropertyCard
**Modification:** Ajout du bouton "Book Visit"

```tsx
<button
  onClick={handleBookVisit}
  className="bg-gradient-to-r from-yellow-400 to-orange-400"
>
  <Calendar /> Visite
</button>
```

---

## 🪝 Hooks React

### `use-visits.ts`

#### Fonctions Principales

**Fetching:**
- `fetchMyVisits()` - Récupère les visites du searcher
- `fetchPropertyVisits(propertyId?)` - Récupère les visites d'un propriétaire
- `getUpcomingVisits()` - Filtre les visites à venir
- `getPastVisits()` - Filtre les visites passées

**Actions:**
- `bookVisit(params)` - Réserver une visite
- `cancelVisit(visitId, reason?)` - Annuler une visite
- `confirmVisit(visitId, response?, meetingUrl?)` - Confirmer (owner)
- `completeVisit(visitId)` - Marquer comme complétée
- `addVisitFeedback(visitId, rating, feedback, wasHelpful)` - Ajouter feedback

**État:**
- `visits`: PropertyVisit[]
- `loading`: boolean
- `error`: string | null

---

### `useVisitAvailability(propertyId?)`

#### Fonctions Principales

**Fetching:**
- `fetchTimeSlots()` - Récupère les créneaux prédéfinis
- `fetchAvailability(propertyId)` - Récupère disponibilités owner
- `getAvailableSlots(propertyId, date)` - Créneaux dispos pour une date

**Actions:**
- `setPropertyAvailability(params)` - Définir disponibilités (owner)

**État:**
- `timeSlots`: TimeSlot[]
- `availability`: VisitAvailability[]
- `loading`: boolean

---

## 🔄 Workflow Utilisateur

### Workflow Searcher

```
1. Browse Properties → Voir une propriété intéressante
2. Clic sur "Book Visit" (PropertyCard ou page détail)
3. Choix type de visite (in-person / virtual)
4. Sélection date (calendrier 14 jours)
5. Sélection créneau horaire disponible
6. Saisie coordonnées (téléphone, email, notes)
7. Confirmation → Status: PENDING
8. Attente confirmation du propriétaire
9. Réception notification → Status: CONFIRMED
10. Participation à la visite
11. Status: COMPLETED
12. Feedback optionnel (rating, commentaire)
```

---

### Workflow Owner

```
1. Réception notification "New Visit Request"
2. Accès à /dashboard/owner/visits
3. Voir détails de la demande
4. Options:
   a) Confirmer → Ajouter message + lien réunion si virtuel
   b) Refuser → Raison optionnelle
5. Si confirmé → Notification au searcher
6. Jour de la visite → Conduire la visite
7. Marquer comme "Completed"
8. (Optionnel) Voir le feedback du visiteur
```

---

## 🧪 Tests Nécessaires

### Tests à effectuer:

1. **Réservation de visite**
   - [ ] Créer une visite en personne
   - [ ] Créer une visite virtuelle
   - [ ] Vérifier que les créneaux occupés n'apparaissent plus
   - [ ] Vérifier validation formulaire

2. **Gestion des visites (Searcher)**
   - [ ] Voir visites à venir
   - [ ] Voir visites passées
   - [ ] Annuler une visite
   - [ ] Laisser un feedback

3. **Notifications**
   - [ ] Notification propriétaire (nouvelle demande)
   - [ ] Notification searcher (confirmation)

4. **Edge cases**
   - [ ] Tentative de réserver un créneau déjà pris (race condition)
   - [ ] Annulation d'une visite déjà commencée
   - [ ] Feedback sur visite non complétée

---

## 🚀 Prochaines Améliorations

### Phase 2 (Nice-to-have)

1. **Rappels automatiques**
   - Email/SMS 24h avant la visite
   - Email/SMS 1h avant la visite

2. **Calendrier du propriétaire**
   - Interface UI pour définir disponibilités
   - Blocked dates (vacances, jours fériés)
   - Disponibilités récurrentes

3. **Intégration calendrier externe**
   - Export iCal
   - Sync Google Calendar
   - Sync Outlook

4. **Visites de groupe**
   - Permettre réservation par plusieurs searchers
   - Visit slots avec capacité (ex: Open House)

5. **Statistiques propriétaire**
   - Nombre de visites par propriété
   - Taux de conversion (visites → applications)
   - Feedback moyen

6. **Amélioration expérience virtuelle**
   - Génération automatique lien Zoom/Google Meet
   - Enregistrement de la visite virtuelle
   - Chat en direct pendant la visite

---

## 📋 Checklist d'Implémentation

- [x] Migration SQL créée (`035_create_visit_system.sql`)
- [x] Tables créées avec RLS
- [x] Fonctions SQL implémentées
- [x] Triggers de notification
- [x] Hook `use-visits.ts`
- [x] Hook `useVisitAvailability.ts`
- [x] Page `/properties/[id]/book-visit`
- [x] Page `/dashboard/searcher/my-visits`
- [x] Intégration PropertyCard
- [x] Intégration ModernSearcherHeader
- [ ] Tests end-to-end
- [ ] Page owner pour gérer les visites (TODO)
- [ ] Page owner pour définir disponibilités (TODO)

---

## 🐛 Bugs Connus

Aucun bug connu pour le moment.

---

## 📞 Support

Pour toute question sur ce système, référez-vous à:
- Migration: `supabase/migrations/035_create_visit_system.sql`
- Hooks: `lib/hooks/use-visits.ts`
- Documentation technique: Ce fichier

---

**Dernière mise à jour:** 2025-01-03
**Auteur:** Claude Code + Samuel Baudon
