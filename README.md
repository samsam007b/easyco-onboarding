# EasyCo — Onboarding V3.1 (tester_id, post-test, CSV export)

Additions to V3:
- `tester_id` capture via URL (`/consent?tester=alpha01`), stored in localStorage and inserted into DB rows.
- Post-test survey (`/post-test`) with rating 1–5 and comment, saved to Supabase.
- Admin CSV export buttons for onboardings, briefs, feedback.

## 1) Env
Create `.env.local` with your keys:
```
NEXT_PUBLIC_SUPABASE_URL=YOUR_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## 2) Supabase SQL
```sql
-- Onboarding answers
create table if not exists public.test_onboardings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  tester_id text,
  budget_min int,
  budget_max int,
  areas text,
  move_in_date date,
  lifestyle text[]
);
alter table public.test_onboardings enable row level security;

-- Group Briefs
create table if not exists public.test_group_briefs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  tester_id text,
  group_name text,
  budget_min int,
  budget_max int,
  preferred_areas text,
  min_bedrooms int,
  lease_length text
);
alter table public.test_group_briefs enable row level security;

-- Post-test feedback
create table if not exists public.test_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  tester_id text,
  rating int,
  comment text
);
alter table public.test_feedback enable row level security;

-- Permissive policies for testing
create policy "anon insert onboardings" on public.test_onboardings for insert to anon with check (true);
create policy "anon select onboardings" on public.test_onboardings for select to anon using (true);

create policy "anon insert briefs" on public.test_group_briefs for insert to anon with check (true);
create policy "anon select briefs" on public.test_group_briefs for select to anon using (true);

create policy "anon insert feedback" on public.test_feedback for insert to anon with check (true);
create policy "anon select feedback" on public.test_feedback for select to anon using (true);
```

> Security: permissive policies for **testing only**. Tighten later with auth + user-scoped RLS.

## 3) Run
```
npm install
npm run dev
# http://localhost:3000
```

## 4) How to attribute testers
- Add `?tester=NAME` to your consent link, e.g. `https://yourapp.vercel.app/consent?tester=alpha01`.
- The Admin page shows the `tester_id` on each row and allows CSV export.
```
