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

### Typography System
Fonts are configured in `app/fonts.ts` using `next/font`:

| Font | Usage | Tailwind Class |
|------|-------|----------------|
| **Inter** | Body text, UI elements | `font-sans` (default) |
| **Nunito** | Headings, section titles | `font-heading` |
| **Fredoka** | Brand wordmark "Izzico" | `font-brand` |

```tsx
// Usage examples
<p className="font-sans">Regular body text (Inter)</p>
<h1 className="font-heading">Section Title (Nunito)</h1>
<span className="font-brand">Izzico</span>

// CSS variables also available
font-family: var(--font-body);    // Inter
font-family: var(--font-heading); // Nunito
font-family: var(--font-brand);   // Fredoka
```

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

## Brand Identity (PRIORITY)

### Color System - ABSOLUTE SOURCE OF TRUTH
**Location**: `brand-identity/izzico-color-system.html`

**CRITICAL**: This document is the **absolute priority** for all color decisions. It defines:
- Role colors (Owner, Resident, Searcher) with 50-900 scales
- Signature gradient with the 3 primary colors
- UI accent colors (Sky, Sage, Amber, Lavender, Dusty Rose, Teal, Terracotta)
- Dark mode palette
- UX color conventions (which colors for which contexts)
- WCAG accessibility requirements

**Rules established**:
1. **L* progression**: 50 (light) → 900 (dark), monotonically decreasing
2. **ΔE > 7** between distinct colors (human perception threshold)
3. **WCAG AA minimum** (4.5:1 contrast ratio)
4. **Gradient = brand identity**: 3 role primaries at key positions (0%, 50%, 100%)

### Final Logo Assets - SOURCE OF TRUTH
**Location**: `brand-identity/logo final izzico/dérnière versions lock- LOGO FINAL/`

**CRITICAL**: These are the FINAL locked logos. NEVER modify or use older versions.

#### Primary Logo Variant: Squircle Épais
| Type | Gradient | Noir | Blanc |
|------|----------|------|-------|
| **Icon** (2048px) | `gradient signature/izzico-icon-squircle-epais-gradient.svg` | `noir/izzico-icon-squircle-epais-noir-2048px.svg` | `blanc/izzico-icon-squircle-epais-blanc-2048px.svg` |
| **Trademark** (4096px) | `gradient signature/izzico-trademark-squircle-epais-gradient.svg` | `noir/izzico-trademark-squircle-epais-noir-4096px.svg` | `blanc/izzico-trademark-squircle-epais-blanc-4096px.svg` |
| **Lockup Option D** (4096px) | `gradient signature/izzico-lockup-optionD-squircle-epais-gradient.svg` | `noir/izzico-lockup-optionD-squircle-epais-noir-4096px.svg` | `blanc/izzico-lockup-optionD-squircle-epais-blanc-4096px.svg` |

#### Lockup Proportions (Option D)
- Icon height: 130px | Trademark height: 60px | Gap: 3px
- Ratio icon/trademark: ~2.17:1

### Icon Orientation
- **Key with teeth**: LEFT side
- **Magnifying glass handle**: RIGHT side
- Never flip or mirror the icon

### Signature Gradient
```css
/* Gradient v3 - Les 3 primaires des roles */
linear-gradient(135deg,
  #9c5698 0%,    /* Owner Primary */
  #c85570 20%,   /* Bridge (evite zone boue) */
  #d15659 35%,   /* Transition */
  #e05747 50%,   /* Resident Primary */
  #ff7c10 75%,   /* Transition */
  #ffa000 100%   /* Searcher Primary */
)
```

### Color Variations
- **Noir**: `#1A1A2E` (for light backgrounds)
- **Blanc**: `#FFFFFF` (for dark backgrounds)
- **Gradient**: Use signature gradient for branded contexts

### Old Versions (Archive Only)
Located in `brand-identity/logo final izzico/ancienne versions/` - DO NOT USE for production.

## Known Bugs & Solutions

### 🐛 Fonts Not Displaying (Next.js + Tailwind)

**Symptom**: Fonts appear as system default (Arial/Helvetica) instead of Inter/Nunito/Fredoka.

**Root Cause**: CSS variable inheritance conflict between Next.js and Tailwind preflight.

**Technical Details**:
1. Tailwind preflight applies `font-family: var(--font-inter)...` on `html` element
2. Next.js `next/font` classes (e.g., `__variable_abc123`) define `--font-inter` on the element they're applied to
3. CSS variables inherit **DOWNWARD only**, not upward
4. If font classes are on `<body>`, `html` cannot resolve `var(--font-inter)` → fallback to system fonts

**Solution**: Always apply Next.js font variable classes to `<html>`, not `<body>`:

```tsx
// ✅ CORRECT - Font classes on <html>
<html lang="fr" className={`${inter.variable} ${nunito.variable} ${fredoka.variable}`}>
  <body className="min-h-screen">

// ❌ WRONG - Font classes on <body>
<html lang="fr">
  <body className={`${inter.variable} ${nunito.variable} ${fredoka.variable} min-h-screen`}>
```

**Files involved**:
- `app/layout.tsx` - Root layout with html/body elements
- `app/globals.css` - `@layer base` block with font variable definitions
- `app/fonts.ts` - Next.js font configuration
- `tailwind.config.ts` - fontFamily configuration

**Diagnostic command**: Run `/diagnose-fonts` to check font configuration.

---

## Tips for Claude

1. **Color System is LAW**: `brand-identity/izzico-color-system.html` is the absolute source of truth for all colors - consult it before any color decision
2. **Always check the user's role** when working on UI - colors and features differ
3. **Migrations are numbered** - use next available number
4. **RLS policies matter** - test database changes carefully
5. **French is primary** - UI text should be in French unless i18n
6. **V3-fun design** - use gradients, rounded corners, animations
7. **Brand logos**: ALWAYS use files from `brand-identity/logo final izzico/dérnière versions lock- LOGO FINAL/` - these are the ONLY official versions
8. **Font classes on html**: Always put `next/font` variable classes on `<html>`, not `<body>` (see Known Bugs above)
