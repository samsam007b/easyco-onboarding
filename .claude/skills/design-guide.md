---
name: design-guide
description: Unified design system with ready-to-use React/Tailwind components and prevents common design errors
---

# Design Guide

You are the design enforcer for EasyCo. Your mission: maintain visual consistency and prevent design chaos.

## Core Design Philosophy

**Simple, Clean, Professional**
- Not flashy, not boring - just right
- Brussels co-living is premium but accessible
- Trust is built through consistency, not creativity

## Color System

### Role-Based Colors (PRIMARY SYSTEM)

EasyCo uses **3 role-based color palettes** - never mix them on the same page:

#### 🟡 SEARCHER (Yellow/Amber)
```css
Primary:    #FFD249 (--searcher-500)
Hover:      #FFC107 (--searcher-600)
Light BG:   #FFF9E6 (--searcher-100)
Dark:       #F9A825 (--searcher-700)
```

**When to use:**
- Searcher-facing pages (`/searcher/*`)
- Property browsing interface
- Search features
- User dashboards

**Gradient (from logo):**
```css
linear-gradient(135deg, #FFA040 0%, #FFB85C 50%, #FFD080 100%)
```

#### 🟠 RESIDENT (Orange/Coral)
```css
Primary:    #FF6F3C (--resident-500)
Hover:      #FF5722 (--resident-600)
Light BG:   #FFF3EF (--resident-100)
Dark:       #E64A19 (--resident-700)
```

**When to use:**
- Resident-facing pages (`/resident/*`)
- Community features
- Messaging
- Resident dashboards

**Gradient (from logo):**
```css
linear-gradient(135deg, #D97B6F 0%, #E8865D 50%, #FF8C4B 100%)
```

#### 🟣 OWNER (Mauve/Purple)
```css
Primary:    #6E56CF (--owner-500)
Hover:      #5B45B8 (--owner-600)
Light BG:   #F3F1FF (--owner-100)
Dark:       #4A148C (--owner-700)
```

**When to use:**
- Owner-facing pages (`/owner/*`)
- Property management
- Analytics
- Owner dashboards

**Gradient (from logo):**
```css
linear-gradient(135deg, #7B5FB8 0%, #A67BB8 50%, #C98B9E 100%)
```

### Neutral Colors (ALWAYS SAFE)

```css
Gray-900: #1A1A1A  (primary text)
Gray-800: #2D2D2D  (secondary text)
Gray-600: #666666  (muted text)
Gray-400: #BFBFBF  (disabled)
Gray-300: #D9D9D9  (borders)
Gray-100: #F2F2F2  (subtle backgrounds)
Gray-50:  #F9F9F9  (page backgrounds)
```

**Use gray for:**
- All text (except highlights)
- Borders and dividers
- Backgrounds
- Disabled states

### Semantic Colors

```css
Success: #10B981 (green)
Error:   #EF4444 (red)
Warning: #F59E0B (amber)
Info:    #3B82F6 (blue)
```

**Only use for:**
- Status messages
- Alerts
- Form validation
- Notifications

## Spacing (8px Grid)

**ALWAYS use multiples of 8px** (or 4px for fine-tuning):

```
4px   = spacing-1  = 0.25rem
8px   = spacing-2  = 0.5rem
12px  = spacing-3  = 0.75rem
16px  = spacing-4  = 1rem      ← Most common
24px  = spacing-6  = 1.5rem    ← Section padding
32px  = spacing-8  = 2rem      ← Large gaps
48px  = spacing-12 = 3rem      ← Hero sections
64px  = spacing-16 = 4rem      ← Page sections
```

**Common patterns:**
```tsx
// Card padding
className="p-6"  // 24px all sides

// Section spacing
className="py-12"  // 48px top/bottom

// Button padding
className="px-6 py-3"  // 24px horizontal, 12px vertical

// Gap between elements
className="gap-4"  // 16px gap
```

## Typography

**Font Stack:**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
```

**Scale:**
```
12px = text-xs     (captions, metadata)
14px = text-sm     (secondary text)
16px = text-base   (body text) ← Default
18px = text-lg     (emphasized)
20px = text-xl     (small headings)
24px = text-2xl    (section headings)
30px = text-3xl    (page titles)
36px = text-4xl    (hero headings)
48px = text-5xl    (landing page)
```

**Common patterns:**
```tsx
// Page title
<h1 className="text-3xl font-bold text-gray-900">

// Section heading
<h2 className="text-2xl font-semibold text-gray-800">

// Card title
<h3 className="text-xl font-medium text-gray-900">

// Body text
<p className="text-base text-gray-700">

// Metadata
<span className="text-sm text-gray-600">
```

## Shadows (Subtle Only)

```css
shadow-sm   → Subtle elevation (cards at rest)
shadow-md   → Medium elevation (dropdowns, modals)
shadow-lg   → Prominent (hover states)
shadow-xl   → Maximum (floating elements)
```

**Usage:**
```tsx
// Card default
className="shadow-sm"

// Card on hover
className="shadow-sm hover:shadow-md"

// Modal/Dropdown
className="shadow-lg"
```

**NEVER use:**
- `shadow-2xl` (too dramatic)
- Colored shadows
- Multiple shadows on same element

## Border Radius

```css
rounded-lg   = 12px  (cards, inputs)
rounded-xl   = 16px  (large cards)
rounded-2xl  = 24px  (hero sections)
rounded-full = 9999px (pills, avatars)
```

**Common patterns:**
```tsx
// Standard card
className="rounded-2xl"

// Input field
className="rounded-xl"

// Button
className="rounded-full"

// Badge/Tag
className="rounded-full"
```

## Component Library

### Buttons

Use **existing components** from `components/ui/button.tsx`:

```tsx
import { Button } from '@/components/ui/button'

// Primary CTA (role-based)
<Button variant="default">Save Property</Button>

// Secondary action
<Button variant="outline">Cancel</Button>

// Destructive action
<Button variant="destructive">Delete</Button>

// Ghost (minimal)
<Button variant="ghost">Learn More</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

**Custom role-based buttons:**
```tsx
// Searcher CTA (with gradient from logo)
<button className="cta-searcher px-6 py-3 rounded-full text-white font-semibold">
  Find Your Place
</button>

// Owner CTA (with gradient from logo)
<button className="cta-owner px-6 py-3 rounded-full text-white font-semibold">
  List Property
</button>
```

### Cards

Use **existing components** from `components/ui/card.tsx`:

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Property Details</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

**Custom interactive card:**
```tsx
<div className="card-interactive">
  {/* Clickable card with hover effect */}
</div>
```

### Inputs

Use **existing components** from `components/ui/input.tsx`:

```tsx
import { Input } from '@/components/ui/input'

<Input
  type="text"
  placeholder="Search properties..."
  className="w-full"
/>
```

**With label:**
```tsx
import { Label } from '@/components/ui/label'

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

### Badges

Use **existing components** from `components/ui/badge.tsx`:

```tsx
import { Badge } from '@/components/ui/badge'

<Badge>New</Badge>
<Badge variant="secondary">Available</Badge>
<Badge variant="destructive">Sold Out</Badge>
<Badge variant="outline">Pending</Badge>
```

### Other Available Components

```tsx
// From components/ui/
Avatar, Checkbox, Dialog, Dropdown, Modal, Progress,
Radio, Select, Skeleton, Slider, Spinner, Switch,
Tabs, Textarea, AlertDialog, PromptDialog
```

**ALWAYS check `components/ui/` before creating new components.**

## Layout Patterns

### Page Container
```tsx
<div className="min-h-screen bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {/* Page content */}
  </div>
</div>
```

### Grid Layouts
```tsx
// Property grid (responsive)
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {properties.map(...)}
</div>

// Two-column form
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

### Card Grid
```tsx
<div className="space-y-6">
  {items.map(item => (
    <Card key={item.id}>
      {/* Card content */}
    </Card>
  ))}
</div>
```

## Responsive Design

**Mobile-First Approach:**
```tsx
// Default (mobile)
<div className="text-base">

// Tablet (md: 768px+)
<div className="text-base md:text-lg">

// Desktop (lg: 1024px+)
<div className="text-base md:text-lg lg:text-xl">

// Large (xl: 1280px+)
<div className="text-base md:text-lg lg:text-xl xl:text-2xl">
```

**Common breakpoints:**
```
sm: 640px   (large phones)
md: 768px   (tablets)
lg: 1024px  (laptops)
xl: 1280px  (desktops)
2xl: 1536px (large screens)
```

## Role-Based Pages

### Identifying the Role

**URL-based detection:**
```tsx
'use client'

import { usePathname } from 'next/navigation'

export function RoleBasedLayout({ children }) {
  const pathname = usePathname()

  const role = pathname.startsWith('/searcher') ? 'searcher'
    : pathname.startsWith('/resident') ? 'resident'
    : pathname.startsWith('/owner') ? 'owner'
    : 'searcher' // default

  return (
    <div className={`role-${role}`}>
      {children}
    </div>
  )
}
```

### Using Role Variables

Once you set the role context, use CSS variables:
```tsx
<div className="role-searcher">
  <button className="bg-role-500 hover:bg-role-600 text-white px-6 py-3 rounded-full">
    {/* Automatically uses searcher colors */}
  </button>
  <div className="bg-role-100 border border-role-300 p-6 rounded-xl">
    {/* Searcher light background with border */}
  </div>
</div>
```

## Design Mistakes to Avoid

### ❌ Don't Do This:

```tsx
// Mixing role colors on same page
<button className="bg-purple-500">Owner</button>
<button className="bg-yellow-500">Searcher</button>

// Random spacing (not 8px grid)
<div className="p-5 mb-7">  // 20px, 28px - wrong!

// Too many font sizes
<h1 className="text-7xl">  // Too big!

// Colored text everywhere
<p className="text-purple-600">  // Use gray!

// Custom shadows
<div className="shadow-purple-lg">  // No custom shadows!

// Inconsistent radius
<div className="rounded-md">  // Use rounded-xl or rounded-2xl
```

### ✅ Do This Instead:

```tsx
// Single role color per page
<div className="role-searcher">
  <button className="bg-role-500">Action</button>
  <span className="text-role-600">Highlight</span>
</div>

// 8px grid spacing
<div className="p-6 mb-8">  // 24px, 32px - perfect!

// Appropriate heading size
<h1 className="text-3xl">  // Clear hierarchy

// Gray text, role highlights only
<p className="text-gray-700">
  Find your <span className="text-role-600 font-semibold">perfect place</span>
</p>

// Standard shadows
<div className="shadow-sm hover:shadow-md">

// Consistent radius
<div className="rounded-2xl">
```

## Loading & Error States

### Loading Skeleton
```tsx
import { Skeleton } from '@/components/ui/skeleton'

<Card>
  <Skeleton className="h-48 w-full" />
  <div className="p-6 space-y-3">
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
</Card>
```

### Spinner
```tsx
import { Spinner } from '@/components/ui/spinner'

<div className="flex items-center justify-center py-12">
  <Spinner size="lg" />
</div>
```

### Error State
```tsx
<div className="text-center py-12">
  <p className="text-gray-600 mb-4">Something went wrong</p>
  <Button onClick={retry}>Try Again</Button>
</div>
```

### Empty State
```tsx
<div className="text-center py-12">
  <p className="text-gray-600 mb-4">No properties found</p>
  <Button variant="outline">Clear Filters</Button>
</div>
```

## Animation Guidelines

**Use sparingly** - only where it improves UX:

```tsx
// Hover transitions (always)
className="transition-all duration-200 hover:scale-[1.01]"

// Fade in on load
className="animate-fadeIn"

// Slide up on load
className="animate-slideUp"

// Scale in (modals)
className="animate-scaleIn"
```

**NEVER:**
- Autoplay carousels
- Endless spinning
- Distracting animations
- Animations >300ms

## Quick Reference

### Decision Tree

**Choosing colors:**
1. Is this text? → Use gray (`text-gray-700`)
2. Is this a border/divider? → Use gray (`border-gray-300`)
3. Is this a status? → Use semantic (`text-success-500`)
4. Is this a role-specific action? → Use role color (`bg-role-500`)
5. Is this neutral? → Use gray background (`bg-gray-100`)

**Choosing spacing:**
1. Tight spacing? → `gap-2` or `gap-4` (8-16px)
2. Card padding? → `p-6` (24px)
3. Section padding? → `py-12` (48px)
4. Page margins? → `max-w-7xl mx-auto px-4 py-12`

**Choosing components:**
1. Check if it exists in `components/ui/` first
2. If it exists, use it (don't rebuild)
3. If it doesn't exist, build minimal version
4. Keep it simple

## Pre-Flight Checklist

Before pushing any UI changes:
- [ ] Single role color per page (or all gray)
- [ ] All spacing is 4px or 8px multiples
- [ ] Text is gray unless highlighting
- [ ] Shadows are subtle (`shadow-sm` or `shadow-md`)
- [ ] Border radius is consistent (`rounded-xl` or `rounded-2xl`)
- [ ] Mobile responsive (test at 375px width)
- [ ] Loading states exist
- [ ] Error states exist
- [ ] Uses existing components from `components/ui/`
- [ ] No random font sizes (stick to scale)
- [ ] Buttons have hover states

## Real Examples from EasyCo

### Searcher Header Navigation
```tsx
<nav className="flex gap-6">
  <a href="/searcher" className="nav-item-searcher">
    <span className="nav-text text-white font-medium">Search</span>
  </a>
  <a href="/searcher/favorites" className="nav-item-searcher">
    <span className="nav-text text-white font-medium">Favorites</span>
  </a>
</nav>
```
**Effect:** Text gets gradient on hover (from logo colors)

### Property Card
```tsx
<Card className="card-interactive">
  <div className="aspect-video relative overflow-hidden rounded-t-2xl">
    <Image src={property.image} fill className="object-cover" />
  </div>
  <CardContent className="p-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      {property.title}
    </h3>
    <p className="text-gray-600 text-sm mb-4">{property.location}</p>
    <div className="flex items-center justify-between">
      <span className="text-2xl font-bold text-gray-900">
        €{property.price}
      </span>
      <Badge>{property.type}</Badge>
    </div>
  </CardContent>
</Card>
```

### CTA Button (Role-Based)
```tsx
<button className="cta-searcher px-8 py-4 rounded-full text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200">
  Find Your Perfect Place
</button>
```
**Effect:** Gradient from logo + grain texture + smooth hover

Remember: **Consistency beats creativity**. When in doubt, use gray and simple shapes.
