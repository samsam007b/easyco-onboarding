# EasyCo Platform Roadmap

## Project Overview

EasyCo is a co-living platform connecting three segments:
- **Searchers**: People looking for shared living spaces
- **Owners**: Property owners listing their spaces
- **Properties**: The actual listings/spaces available

## Development Phases

### ✅ Phase 1: Onboarding & Validation (COMPLETED)

**Goal**: Test segmentation and collect early user feedback

**What's Built**:
- Searcher onboarding flow (8 steps)
- Owner onboarding flow (3 steps + success)
- Property listing flow (4 steps + success)
- Supabase database with 3 tables: `test_onboardings`, `test_owners`, `test_properties`
- Deployed on Vercel with working data collection

**Success Metrics**:
- Can collect complete profiles for all 3 segments
- Data properly stored in Supabase
- User feedback on onboarding experience

**Status**: ✅ Live and functional

---

### 🔜 Phase 2: Core MVP Features (PENDING VALIDATION)

**Goal**: Build minimum viable product if Phase 1 validation is successful

**Planned Features**:
- User dashboards for each segment
- Basic property search/browse for Searchers
- Property management for Owners
- Basic matching algorithm
- Messaging system (basic)

**Prerequisites**:
- Positive validation from Phase 1 onboarding tests
- User feedback incorporated
- Decision on which features to prioritize

**Tech Stack** (same as Phase 1):
- Next.js 14 with App Router
- TypeScript
- Supabase (PostgreSQL)
- Tailwind CSS
- Vercel deployment

---

### 🔮 Phase 3: Advanced Features (FUTURE)

**Potential Features** (based on user needs):
- Advanced filters and search
- Roommate matching algorithm
- Reviews and ratings system
- Payment integration
- Calendar/booking system
- Mobile app considerations
- Admin panel

---

## Current Focus

**Right Now**: Analyzing complete Figma design documentation to understand full platform vision

**Next Steps**:
1. Review complete app design
2. Identify priority features for Phase 2 MVP
3. Plan architecture for core features
4. Begin implementation based on validation results

---

## Technical Architecture

### Database Schema (Current)
```sql
test_onboardings (Searchers)
├── Basic info, lifestyle, preferences
└── Created via /onboarding/... flow

test_owners (Owners)
├── Profile, experience, location
└── Created via /onboarding/owner/... flow

test_properties (Properties)
├── Property details, pricing
├── owner_id (FK → test_owners)
└── Created via /onboarding/property/... flow
```

### Future Schema Additions (Phase 2+)
- User authentication tables
- Matching/favorites tables
- Messaging tables
- Reviews/ratings tables

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2024 | Single Supabase project for all segments | Easier future matching, single source of truth |
| 2024 | MVP-first approach with TODOs | Fast validation, iterate based on feedback |
| 2024 | Keep all work in single GitHub repo | Natural progression, avoid duplication |

---

*Last updated: 2025-10-22*
