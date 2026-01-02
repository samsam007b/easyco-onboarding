# CLAUDE.md - Izzico Project Context

## Project Overview
**Izzico** (formerly EasyCo) is a coliving/roommate matching platform built with Next.js 14.
- **Version**: 0.3.1
- **Production URL**: Deployed on Vercel
- **Database**: Supabase (PostgreSQL + Auth + Storage)

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.4
- **Styling**: TailwindCSS 3.4 + CSS Variables
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **State**: React Query (TanStack)

### Backend
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (email, OAuth)
- **Storage**: Supabase Storage (avatars, documents)
- **Payments**: Stripe
- **Monitoring**: Sentry
- **Rate Limiting**: Upstash Redis

### Mobile
- **Framework**: Capacitor (iOS)
- **Project**: `EasyCoiOS-Clean/`

## Project Structure

```
app/                    # Next.js App Router pages
├── admin/              # Admin dashboard
├── auth/               # Login, signup, password reset
├── dashboard/          # User dashboards (role-based)
├── hub/                # Main hub (searcher, owner, resident views)
├── messages/           # Messaging system
├── matching/           # Roommate matching
├── api/                # API routes
└── [role]/             # Role-specific pages

components/             # Reusable React components
lib/                    # Utilities and services
├── supabase/           # Supabase client & helpers
├── stripe/             # Stripe integration
├── i18n/               # Internationalization
├── security/           # Security utilities
└── types/              # TypeScript types

supabase/
├── migrations/         # SQL migrations (numbered)
└── *.sql               # Fix scripts
```

## User Roles (Critical)

The app has 3 main user roles with distinct color schemes:

| Role | Color | Description |
|------|-------|-------------|
| **Searcher** | Yellow/Gold | Users looking for housing |
| **Owner** | Mauve/Purple | Property owners |
| **Resident** | Orange/Coral | Current residents |

### Color Usage Pattern
```tsx
// Use role-based colors
className="bg-searcher-500"    // For searchers
className="bg-owner-500"       // For owners
className="bg-resident-500"    // For residents

// Gradients
className="bg-gradient-searcher"
className="bg-gradient-owner"
className="bg-gradient-resident"
```

## Design System (V3-fun)

### Key Principles
- Rounded corners (`rounded-2xl`, `rounded-3xl`)
- Gradient backgrounds per role
- Soft shadows with role colors
- Animations via Framer Motion

### CSS Variables
All colors are defined as CSS variables in `app/globals.css`:
- `--searcher-*` (yellow scale)
- `--owner-*` (purple scale)
- `--resident-*` (orange scale)
- `--gradient-*` (gradient definitions)

## Database Patterns

### Supabase Client Usage
```tsx
// Browser client
import { supabase } from '@/lib/supabaseClient';

// Server-side (with cookies)
import { createClient } from '@/lib/supabase/server';
```

### RLS (Row Level Security)
- All tables have RLS enabled
- Policies based on `auth.uid()`
- Check migrations in `supabase/migrations/`

### Key Tables
- `user_profiles` - User data and preferences
- `properties` - Housing listings
- `user_bank_info` - Bank details (encrypted, 2FA protected)
- `conversations` / `messages` - Messaging system
- `matching_*` - Roommate matching data

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build

# Testing
npm run test:e2e         # Run Playwright tests
npm run test:e2e:ui      # Playwright with UI

# Database
npm run seed:demo        # Seed demo data
npm run property:add     # Add property to user
npm run property:list    # List all properties

# iOS
npm run build:ios        # Build for iOS
npm run cap:sync         # Sync Capacitor
```

## Security Considerations

### Bank Info (2FA)
- 24-hour cooldown between modifications
- Password re-verification required
- All changes logged in `bank_info_change_notifications`
- See `supabase/migrations/117_bank_info_2fa.sql`

### API Routes
- Rate limiting via Upstash
- Input validation with Zod
- CORS configured in `next.config.mjs`

## i18n (Internationalization)

- Default locale: French (`fr`)
- Supported: `fr`, `en`, `nl`, `de`
- Translation files in `lib/i18n/`
- Use `useTranslation()` hook

## Current Focus Areas

### Recently Worked On
- P2P payment system
- Bank info security (2FA)
- V3-fun design implementation
- Owner dashboard pages
- Resident matching navigation

### Known Patterns
- Modal components use Radix AlertDialog
- Forms use React Hook Form + Zod
- API calls use React Query for caching
- Toast notifications via Sonner

## File Naming Conventions

- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Pages: `page.tsx` (Next.js convention)
- Migrations: `XXX_description.sql`

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
SENTRY_DSN=
```

## Tips for Claude

1. **Always check the user's role** when working on UI - colors and features differ
2. **Migrations are numbered** - use next available number
3. **RLS policies matter** - test database changes carefully
4. **French is primary** - UI text should be in French unless i18n
5. **V3-fun design** - use gradients, rounded corners, animations
