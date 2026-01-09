# 🛠️ Events Feature - Implementation Guide

**For Developers**

This guide provides step-by-step instructions for implementing the Events feature in Izzico.

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ Read [`EVENTS_FEATURE_PROPOSAL.md`](./EVENTS_FEATURE_PROPOSAL.md)
- ✅ Access to Supabase project
- ✅ Local development environment setup
- ✅ Familiarity with Next.js 14 App Router
- ✅ Understanding of Izzico's role-based color system

---

## 🗄️ Step 1: Database Setup

### Run Migration

```bash
# Apply the events system migration
npm run supabase migration up 120_create_events_system.sql

# Or via Supabase CLI
supabase migration up
```

### Verify Tables Created

```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'event%';

-- Should return:
-- event_categories
-- events
-- event_attendees
-- event_invitations
-- event_reviews
-- user_event_preferences
-- event_analytics
```

### Seed Demo Data (Optional)

```sql
-- Insert a test property event
INSERT INTO events (
  event_type,
  title,
  description,
  short_description,
  city,
  venue_name,
  start_date,
  property_id,
  is_free,
  status,
  created_by
) VALUES (
  'property',
  'Pizza Party - Maison Izzico',
  'Soirée pizza entre colocataires pour mieux se connaître !',
  'Soirée conviviale 🍕',
  'Bruxelles',
  'Maison Izzico - Salon',
  '2026-01-20 19:00:00+00',
  '[YOUR_PROPERTY_ID]', -- Replace with real property_id
  true,
  'published',
  auth.uid() -- Current user
);
```

---

## 🔧 Step 2: API Routes

### Create API Structure

```
app/api/events/
  ├── route.ts              # GET /api/events (list with filters)
  ├── [id]/
  │   ├── route.ts          # GET /api/events/:id (detail)
  │   └── attend/
  │       └── route.ts      # POST /api/events/:id/attend (RSVP)
  ├── recommended/
  │   └── route.ts          # GET /api/events/recommended
  └── create/
      └── route.ts          # POST /api/events (create)
```

### Example: `GET /api/events` (List Events)

```typescript
// app/api/events/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { EventFilters, EventSort } from '@/lib/types/events';

export async function GET(request: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(request.url);

  // Parse filters
  const filters: EventFilters = {
    event_type: searchParams.get('event_type')?.split(',') as any,
    category_ids: searchParams.get('category_ids')?.split(','),
    city: searchParams.get('city') || undefined,
    is_free: searchParams.get('is_free') === 'true' || undefined,
    search_query: searchParams.get('q') || undefined,
  };

  // Build query
  let query = supabase
    .from('events')
    .select(`
      *,
      category:event_categories(*),
      attendees_count:event_attendees(count),
      going_count:event_attendees(count).eq(status, 'going'),
      interested_count:event_attendees(count).eq(status, 'interested')
    `)
    .eq('status', 'published')
    .gte('start_date', new Date().toISOString());

  // Apply filters
  if (filters.event_type?.length) {
    query = query.in('event_type', filters.event_type);
  }
  if (filters.city) {
    query = query.eq('city', filters.city);
  }
  if (filters.is_free !== undefined) {
    query = query.eq('is_free', filters.is_free);
  }
  if (filters.search_query) {
    query = query.textSearch('search_vector', filters.search_query);
  }

  // Execute
  const { data: events, error } = await query.order('start_date', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ events, total: events.length });
}
```

### Example: `POST /api/events/:id/attend` (RSVP)

```typescript
// app/api/events/[id]/attend/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { AttendeeStatus } from '@/lib/types/events';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const status: AttendeeStatus = body.status;

  // Validate status
  if (!['interested', 'going', 'maybe', 'not_going'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  // If not_going, delete existing attendance
  if (status === 'not_going') {
    const { error: deleteError } = await supabase
      .from('event_attendees')
      .delete()
      .eq('event_id', params.id)
      .eq('user_id', user.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, status: 'removed' });
  }

  // Upsert attendance
  const { data, error } = await supabase
    .from('event_attendees')
    .upsert({
      event_id: params.id,
      user_id: user.id,
      status,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, attendance: data });
}
```

---

## 🎨 Step 3: Frontend Pages

### Create Page Structure

```
app/hub/events/
  ├── page.tsx              # Main events page (redirect to /discover)
  ├── discover/
  │   └── page.tsx          # Public events feed
  ├── my-events/
  │   └── page.tsx          # User's events
  ├── property-events/
  │   └── page.tsx          # Co-living events (Residents only)
  ├── create/
  │   └── page.tsx          # Create property event
  └── [id]/
      └── page.tsx          # Event detail
```

### Example: `/hub/events/discover/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Event, EventCategory, EventFilters } from '@/lib/types/events';
import EventCard from '@/components/events/EventCard';
import { useRole } from '@/lib/role/role-context';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function EventsDiscoverPage() {
  const { activeRole } = useRole();
  const supabase = createClient();
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [filters, setFilters] = useState<EventFilters>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
    loadEvents();
  }, [filters]);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('event_categories')
      .select('*')
      .order('display_order');

    if (data) setCategories(data);
  };

  const loadEvents = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (filters.category_ids?.length) {
      params.set('category_ids', filters.category_ids.join(','));
    }
    if (filters.is_free !== undefined) {
      params.set('is_free', String(filters.is_free));
    }

    const response = await fetch(`/api/events?${params}`);
    const { events } = await response.json();

    setEvents(events || []);
    setLoading(false);
  };

  const toggleCategory = (categoryId: string) => {
    const current = filters.category_ids || [];
    const updated = current.includes(categoryId)
      ? current.filter((id) => id !== categoryId)
      : [...current, categoryId];

    setFilters({ ...filters, category_ids: updated });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingHouse size={80} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="font-heading text-4xl font-bold mb-2">
          Découvre ta ville avec Izzico
        </h1>
        <p className="text-gray-600 font-sans">
          {events.length} événements à venir près de chez toi
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filters.is_free === true ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilters({ ...filters, is_free: !filters.is_free })}
            className="font-heading"
          >
            Gratuit uniquement
          </Button>

          {categories.map((cat) => (
            <Badge
              key={cat.id}
              variant={filters.category_ids?.includes(cat.id) ? 'default' : 'outline'}
              className="cursor-pointer font-heading"
              onClick={() => toggleCategory(cat.id)}
            >
              {cat.name_fr}
            </Badge>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            showCategory
            showAttendees
            onClick={(e) => (window.location.href = `/hub/events/${e.id}`)}
          />
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 font-sans">
            Aucun événement trouvé. Essaie de changer les filtres !
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## 🔗 Step 4: React Query Hooks

Create reusable hooks for data fetching:

```typescript
// lib/hooks/use-events.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Event, EventFilters, AttendeeStatus } from '@/lib/types/events';

export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters as any);
      const response = await fetch(`/api/events?${params}`);
      const { events } = await response.json();
      return events as Event[];
    },
  });
}

export function useEvent(eventId: string) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const response = await fetch(`/api/events/${eventId}`);
      return response.json();
    },
  });
}

export function useAttendEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      status,
    }: {
      eventId: string;
      status: AttendeeStatus;
    }) => {
      const response = await fetch(`/api/events/${eventId}/attend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return response.json();
    },
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
```

---

## 🧪 Step 5: Testing

### Manual Testing Checklist

- [ ] Create a property event as a Resident
- [ ] RSVP to an event (interested → going)
- [ ] View event details page
- [ ] Filter events by category
- [ ] Filter events by price (free only)
- [ ] Invite a roommate to an event
- [ ] Leave a review after attending
- [ ] Check RLS policies (can't see other properties' events)

### Automated Tests (Playwright)

```typescript
// tests/e2e/events.spec.ts
import { test, expect } from '@playwright/test';

test('resident can view and RSVP to events', async ({ page }) => {
  // Login as resident
  await page.goto('/login');
  await page.fill('[name="email"]', 'resident@test.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Navigate to events
  await page.goto('/hub/events/discover');
  await expect(page.locator('h1')).toContainText('Découvre ta ville');

  // Click on first event
  await page.locator('[data-testid="event-card"]').first().click();

  // RSVP "J'y vais"
  await page.click('text="Je participe"');
  await expect(page.locator('text="J\'y vais"')).toBeVisible();
});
```

---

## 📊 Step 6: Analytics Integration

### Track Event Views

```typescript
// app/hub/events/[id]/page.tsx
useEffect(() => {
  // Increment view count
  fetch(`/api/events/${params.id}/track-view`, { method: 'POST' });
}, [params.id]);
```

### API Route for Tracking

```typescript
// app/api/events/[id]/track-view/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient();

  const { error } = await supabase.rpc('increment_event_views', {
    target_event_id: params.id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

---

## 🔔 Step 7: Notifications

### Create Notification on New Event

```sql
-- Add trigger to send notification when event is published
CREATE OR REPLACE FUNCTION notify_new_event()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND OLD.status = 'draft' THEN
    -- Insert notifications for users in the same city
    INSERT INTO notifications (user_id, type, title, message, data)
    SELECT
      up.user_id,
      'new_event',
      'Nouvel événement près de chez toi !',
      NEW.title,
      jsonb_build_object('event_id', NEW.id)
    FROM user_profiles up
    WHERE up.city = NEW.city
      AND up.user_id != NEW.created_by;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_notify_new_event
AFTER UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION notify_new_event();
```

---

## 🚀 Deployment Checklist

### Pre-deployment

- [ ] Run all migrations
- [ ] Test RLS policies thoroughly
- [ ] Test on staging environment
- [ ] Review analytics tracking
- [ ] Set up error monitoring (Sentry)

### Production Deployment

```bash
# 1. Apply migrations to production
npm run supabase migration up --environment production

# 2. Deploy Next.js app
vercel deploy --prod

# 3. Verify deployment
curl https://izzico.com/api/events
```

### Post-deployment

- [ ] Monitor error rates
- [ ] Check database performance (query times)
- [ ] Verify RLS policies work correctly
- [ ] Test with real users (beta group)

---

## 🐛 Troubleshooting

### Issue: Events not visible

**Solution**: Check RLS policies
```sql
-- Verify user can see events
SELECT * FROM events WHERE id = '[EVENT_ID]';

-- Check property membership
SELECT * FROM property_members WHERE user_id = auth.uid();
```

### Issue: Slow event queries

**Solution**: Ensure indexes exist
```sql
-- Verify indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'events';
```

### Issue: Full-text search not working

**Solution**: Rebuild search vector
```sql
-- Force regenerate search_vector
UPDATE events SET updated_at = NOW();
```

---

## 📚 Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js App Router](https://nextjs.org/docs/app)
- [React Query](https://tanstack.com/query/latest)
- [Izzico Design System](../brand-identity/izzico-color-system.html)

---

**Questions?** Open an issue or contact the dev team.
