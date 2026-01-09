# 🎉 Feature Proposal: Events System for Izzico

**Version:** 1.0
**Date:** 2026-01-08
**Status:** Proposal / Validation Phase
**Target Users:** Residents (primary), Searchers (secondary)

---

## 📋 Table of Contents

1. [Vision & Objectives](#vision--objectives)
2. [Architecture Overview](#architecture-overview)
3. [Database Schema](#database-schema)
4. [UX/UI Design](#uxui-design)
5. [Monetization Strategy](#monetization-strategy)
6. [Roadmap](#roadmap)
7. [Success Metrics](#success-metrics)
8. [Risks & Mitigation](#risks--mitigation)
9. [Next Steps](#next-steps)

---

## 🎯 Vision & Objectives

### Why Events?

Izzico positioning as a **lifestyle platform** for co-living communities, beyond simple roommate matching.

### Target Pain Points

1. **Expatriates**: Newcomers struggling to discover local activities and integrate
2. **Young professionals**: Always looking for new social experiences
3. **Co-living residents**: Need team building and community bonding
4. **Izzico**: Need differentiation + new revenue streams

### Strategic Goals

- **Engagement**: +35% user retention through regular activity discovery
- **Differentiation**: Become the "fun & friendly" app that creates memorable experiences
- **Monetization**: New revenue stream (€15k Year 1 → €60k+ Year 2)
- **Viral Growth**: Users invite roommates to events → organic acquisition
- **Social Impact**: Help expatriates integrate into their new city

---

## 🏗️ Architecture Overview

### Event Types

| Type | Description | Visibility | Creators |
|------|-------------|------------|----------|
| **Public Events** | Festivals, museums, concerts, escape rooms... | All users (Residents + Searchers) | Admins + External APIs |
| **Property Events** | Team building within a co-living | Property members only | Residents or Owners |
| **Community Events** | Izzico-organized events (networking, parties) | All Izzico users in city | Izzico Admins |

### Technical Stack

- **Backend**: Supabase PostgreSQL + RLS policies
- **Frontend**: Next.js 14 + React Query + Framer Motion
- **External APIs**: Eventbrite, OpenAgenda, Meetup (for public events)
- **Search**: PostgreSQL full-text search (tsvector)
- **Recommendations**: SQL-based scoring algorithm

### Key Features

✅ **Discovery Feed** with filters (category, date, price, distance)
✅ **RSVP System** (interested, going, maybe, not_going, attended)
✅ **Invitations** (invite specific roommates to events)
✅ **Reviews** (post-event feedback, 1-5 stars)
✅ **Partnership Integration** (promo codes, affiliate tracking)
✅ **Analytics** (views, clicks, conversions, commission tracking)
✅ **Personalization** (user preferences, recommendation algorithm)

---

## 💾 Database Schema

**Migration File**: [`supabase/migrations/120_create_events_system.sql`](../supabase/migrations/120_create_events_system.sql)

### Core Tables

```sql
-- 1. event_categories (10 predefined categories)
-- 2. events (all event types with RLS)
-- 3. event_attendees (RSVP tracking)
-- 4. event_invitations (invite friends)
-- 5. event_reviews (post-event feedback)
-- 6. user_event_preferences (personalization)
-- 7. event_analytics (tracking & monetization)
```

### RLS Security Model

- **Public events**: Published events visible to everyone
- **Property events**: Only property members can see/join
- **Community events**: All Izzico users in city can see
- **Attendees**: Users manage their own attendance
- **Reviews**: Only users who attended can review

### Key Functions

```sql
-- Increment view count (analytics)
increment_event_views(event_id)

-- Get personalized recommendations
get_recommended_events(user_id, limit)
-- Scoring based on:
--   - Category match (40%)
--   - City match (30%)
--   - Price range (20%)
--   - Featured bonus (10%)
```

---

## 🎨 UX/UI Design

### Design Principles (V3-fun System)

Following [`brand-identity/izzico-color-system.html`](../brand-identity/izzico-color-system.html):

- **Role-based colors**:
  - Residents: Orange gradient (`#e05747 → #ff7c10 → #ffa000`)
  - Searchers: Yellow gradient (`#ffa000 → #ffb933 → #ffd966`)
- **Rounded corners**: `rounded-2xl`, `rounded-3xl`
- **Soft shadows**: Role-colored with 15% opacity
- **Typography**: Nunito (headings), Inter (body text)
- **Animations**: Framer Motion (y: -4px hover, smooth transitions)

### Navigation Structure

```
/hub/events
  ├── /discover       → Public events feed (main page)
  ├── /my-events      → User's events (going, interested)
  ├── /property-events → Co-living events (Residents only)
  └── /create         → Create property event

/dashboard          → Widget "Events à venir" (next 2 events)
```

### Key Components

**Created Files**:
- [`lib/types/events.ts`](../lib/types/events.ts) - TypeScript types
- [`components/events/EventCard.tsx`](../components/events/EventCard.tsx) - Event card component

**Component Variants**:
- `default`: Full card with image, details, actions
- `compact`: Horizontal layout for lists/widgets
- `featured`: With featured badge and ring

### Voice & Copy

According to [`brand-identity/izzico-voice-guidelines.md`](../brand-identity/izzico-voice-guidelines.md):

- ✅ "Découvre ta ville avec Izzico" (not "Explorez")
- ✅ "J'y vais" / "M'intéresse" (casual, tutoiement)
- ✅ "Co-living" (not "coloc")
- ❌ No emojis in UI (use custom Izzico icons)
- ✅ Use "Living Persona" branding where relevant

---

## 💰 Monetization Strategy

### 1. Direct Revenue

#### A. Ticket Commission (Affiliations)

| Partner Type | Commission Rate | Example Revenue |
|--------------|-----------------|-----------------|
| Eventbrite, Ticketmaster | 5-10% | €50 ticket → €2.50-5 |
| Activities (Escape Room, Bowling) | 10-15% | €25/person × 4 = €100 → €10-15 |
| Restaurant reservations | Flat fee | €5/validated reservation |

**Implementation**:
```sql
events.affiliate_url       -- Unique tracking URL
events.commission_rate     -- Percentage (10.00 = 10%)
event_analytics.conversions_count
event_analytics.commission_earned
```

#### B. Featured Event Placements

- **Featured in Feed**: €50-200/month (top of discovery page)
- **Push Notification**: €100 (send to matched users)
- **Email Digest**: €150 (weekly newsletter feature)

### 2. Strategic Partnerships

#### Museums & Attractions
- **Deal**: X free tickets/year for Izzico in exchange for promotion
- **Value**: User acquisition (expatriates seek cultural activities)
- **Type**: Barter (no cash exchange)

#### Escape Rooms, Bowling, Activities
- **Deal**: Exclusive promo code "-20% with IZZICO"
- **Value for partner**: Group bookings (co-livings = 5-15 people)
- **Value for Izzico**: Brand as lifestyle app

#### Restaurants & Bars
- **Commission**: 10% of total bill OR €5/person flat fee
- **Volume projection**: 50 co-livings × 2 outings/month × 8 people × €5 = €4,000/month

### 3. Gamification: "Izzico Miles"

| Action | Points |
|--------|--------|
| Create co-living event | +50 |
| Attend public event | +10 |
| Invite roommate (who attends) | +20 |
| Leave review after event | +15 |
| Attend 5 events/month | +100 (badge) |

**Redemption**:
- 500 points = 1 month Premium free
- 200 points = €10 event ticket discount
- 1000 points = VIP Izzico Community Event invite

### 4. Revenue Projections

**Base: 1000 Residents + 500 Searchers**

| Revenue Source | Calculation | Monthly |
|----------------|-------------|---------|
| Ticket commissions | 30% × 1 event × €3 | €450 |
| Activity commissions | 15% × 1 activity × €10 | €225 |
| Restaurant groups | 20 outings × 8 people × €5 | €800 |
| Featured events | 5 partners × €100 | €500 |
| Data insights | €500/quarter ÷ 3 | €167 |
| **TOTAL** | | **€2,142/month** |

**Year 1 Progressive Ramp**:
- Months 1-3: €500/month (testing phase)
- Months 4-6: €1,200/month (partnerships active)
- Months 7-12: €2,500/month (scale)
- **Total Year 1: ~€15,000**

**Year 2 (5000 active users): €60,000-80,000**

---

## 🚀 Roadmap

### Phase 1 - MVP (Weeks 1-6)

**Weeks 1-2: Backend**
- ✅ SQL migration created
- [ ] API routes:
  - `GET /api/events` (filters, pagination, search)
  - `POST /api/events` (create property event)
  - `POST /api/events/:id/attend` (RSVP)
  - `GET /api/events/recommended` (personalized)
- [ ] External API integration (Eventbrite)

**Weeks 3-4: Frontend**
- ✅ TypeScript types created
- ✅ EventCard component created
- [ ] Pages:
  - `/hub/events/discover` (main feed)
  - `/hub/events/my-events` (user's events)
  - `/hub/events/:id` (event detail)
  - `/hub/events/create` (property events)
- [ ] Dashboard widget

**Week 5: Integrations**
- [ ] Notification system (new event nearby)
- [ ] Email system (weekly digest)
- [ ] Image upload (Supabase Storage)

**Week 6: Testing & Launch**
- [ ] User testing (5-10 beta Residents)
- [ ] UX adjustments
- [ ] Soft launch (Brussels only)

### Phase 2 - Partnerships (Weeks 7-12)

- [ ] Negotiate with 5 pilot partners (1 museum, 2 escape rooms, 2 restaurants)
- [ ] Implement affiliate tracking
- [ ] Partner analytics dashboard
- [ ] Promo code system

### Phase 3 - Social & Gamification (Weeks 13-16)

- [ ] Izzico Miles system
- [ ] Social sharing (Instagram Stories integration)
- [ ] Weekly digest email
- [ ] Community challenges

---

## 📊 Success Metrics

### Primary KPIs

| Metric | Month 3 | Month 6 | Year 1 |
|--------|---------|---------|--------|
| **Public events in DB** | 100+ | 500+ | 2000+ |
| **Property events created** | 20/month | 50/month | 150/month |
| **Participation rate** | 15% | 25% | 35% |
| **Revenue/user/month** | €0.50 | €1.50 | €3 |
| **NPS (satisfaction)** | 40+ | 50+ | 60+ |

### Secondary KPIs

- **Retention +7 days**: 60% return within a week
- **Viral coefficient**: 1 user invites 0.5 roommate/month
- **Average review**: 4.2/5 minimum
- **Searcher → Resident conversion via Events**: 5%

---

## ⚠️ Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low initial adoption | Medium | Medium | Beta with incentives (50 bonus points) |
| Difficult partnerships | Low | Low | Start with public API content |
| Event moderation overhead | Medium | Medium | Manual approval Phase 1, auto Phase 2 |
| Technical complexity | Low | High | Architecture validated (similar to calendar_events) |
| Legal liability (events) | Low | High | Clear ToS: Izzico is discovery platform, not organizer |

---

## ✅ Next Steps

### Immediate Actions (Week 1)

1. **Validation**:
   - [ ] User interviews with 10 Residents (15min each)
   - [ ] Questions: "How do you currently discover activities?" / "Would you use this?"
   - [ ] Goal: 70%+ positive feedback to proceed

2. **Prioritization**:
   - [ ] Review roadmap with product team
   - [ ] Align with Q1 2026 objectives

3. **Resources**:
   - [ ] Allocate 1 full-time developer × 6 weeks for MVP
   - [ ] Design support for UX/UI refinement

4. **Go/No-Go Decision**:
   - [ ] Based on interview feedback + resource availability
   - [ ] Decision by: [DATE]

### Long-term Vision (Year 2+)

- **Expand to more cities** (Antwerp, Ghent, Paris...)
- **White-label partnership** (sell Events System to other co-living platforms)
- **AI-powered recommendations** (ML model based on behavior)
- **IRL Izzico Events** (monthly community gatherings, 100+ attendees)

---

## 📚 Reference Documents

- **Database Migration**: [`supabase/migrations/120_create_events_system.sql`](../supabase/migrations/120_create_events_system.sql)
- **TypeScript Types**: [`lib/types/events.ts`](../lib/types/events.ts)
- **EventCard Component**: [`components/events/EventCard.tsx`](../components/events/EventCard.tsx)
- **Color System**: [`brand-identity/izzico-color-system.html`](../brand-identity/izzico-color-system.html)
- **Voice Guidelines**: [`brand-identity/izzico-voice-guidelines.md`](../brand-identity/izzico-voice-guidelines.md)
- **Project Context**: [`CLAUDE.md`](../CLAUDE.md)

---

## 🤝 Contributors

- **Proposal Author**: Claude (AI Assistant)
- **Stakeholder**: Samuel Baudon (Izzico Founder)
- **Date**: 2026-01-08

---

**Questions or feedback?** Contact the product team or open a discussion in the project repository.
