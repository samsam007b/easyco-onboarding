# New Features Migration Guide

This guide explains how to run the database migrations for the new features added to the EasyCo platform.

## New Features Requiring Migrations

The following features have been implemented and require database migrations:

1. **Favorites System** (Migration 012)
2. **Real-time Messaging** (Migration 013)
3. **Notifications System** (Migration 014)
4. **Image Upload** (Migration 015)
5. **Application System** (Migration 016)

## Prerequisites

- Access to your Supabase project
- Supabase CLI installed (optional, for CLI method)
- Database connection details

## Migration Files Location

All migration files are located in:
```
supabase/migrations/
```

## Method 1: Using Supabase Dashboard (Recommended for beginners)

### Step 1: Access SQL Editor

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run Migrations in Order

Run the following migrations **in order**, one at a time:

#### Migration 012: Favorites System
```sql
-- Copy and paste the contents of: supabase/migrations/012_create_favorites_table.sql
```

#### Migration 013: Real-time Messaging
```sql
-- Copy and paste the contents of: supabase/migrations/013_create_messaging_tables.sql
```

#### Migration 014: Notifications System
```sql
-- Copy and paste the contents of: supabase/migrations/014_create_notifications_table.sql
```

#### Migration 015: Image Upload
```sql
-- Copy and paste the contents of: supabase/migrations/015_add_image_columns.sql
```

#### Migration 016: Application System
```sql
-- Copy and paste the contents of: supabase/migrations/016_create_applications_table.sql
```

### Step 3: Verify Migrations

After running each migration, verify it was successful by:

1. Check the **Table Editor** for new tables:
   - `favorites`
   - `conversations`
   - `messages`
   - `conversation_read_status`
   - `notifications`
   - `applications`

2. Check existing tables for new columns:
   - `properties` table: Should have `images` and `main_image` columns
   - `user_profiles` table: Should have `avatar_url` column
   - `users` table: Should have `avatar_url` column

3. Check **Database** → **Functions** for new functions:
   - `create_notification()`
   - `notify_new_message()`
   - `notify_property_favorited()`
   - `notify_new_application()`
   - `notify_application_status_change()`
   - `get_property_application_count()`

## Method 2: Using Supabase CLI

### Step 1: Link Your Project

```bash
# Login to Supabase
npx supabase login

# Link to your project
npx supabase link --project-ref YOUR_PROJECT_REF
```

### Step 2: Push Migrations

```bash
# Push all pending migrations
npx supabase db push
```

### Step 3: Verify

```bash
# Check migration history
npx supabase migration list
```

## Method 3: Using SQL Directly (Advanced)

If you have direct database access:

```bash
# Connect to your database
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Run migrations in order
\i supabase/migrations/012_create_favorites_table.sql
\i supabase/migrations/013_create_messaging_tables.sql
\i supabase/migrations/014_create_notifications_table.sql
\i supabase/migrations/015_add_image_columns.sql
\i supabase/migrations/016_create_applications_table.sql
```

## Post-Migration: Storage Setup

After running the migrations, you need to set up Supabase Storage buckets for images.

### Required Buckets

1. **property-images** - For property photos
2. **avatars** - For user profile pictures

### Setup Instructions

Detailed instructions are available in: `STORAGE_SETUP.md`

Quick setup via Dashboard:

1. Go to **Storage** in Supabase Dashboard
2. Click **Create a new bucket**
3. Create bucket named `property-images`
   - Set to **Public** bucket
   - Click **Create bucket**
4. Repeat for `avatars` bucket

### Storage Policies

After creating buckets, set up RLS policies (detailed in `STORAGE_SETUP.md`):

```sql
-- For property-images bucket
CREATE POLICY "Anyone can view property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images'
  AND auth.role() = 'authenticated'
);

-- Similar policies for avatars bucket
```

## Verification Checklist

After running all migrations, verify the following:

### Database Tables
- [ ] `favorites` table exists
- [ ] `conversations` table exists
- [ ] `messages` table exists
- [ ] `conversation_read_status` table exists
- [ ] `notifications` table exists
- [ ] `applications` table exists

### Database Columns
- [ ] `properties.images` column exists (TEXT[])
- [ ] `properties.main_image` column exists (TEXT)
- [ ] `user_profiles.avatar_url` column exists (TEXT)
- [ ] `users.avatar_url` column exists (TEXT)

### Database Functions
- [ ] `create_notification()` function exists
- [ ] `notify_new_message()` function exists
- [ ] `notify_property_favorited()` function exists
- [ ] `notify_new_application()` function exists
- [ ] `notify_application_status_change()` function exists
- [ ] `get_property_application_count()` function exists

### RLS Policies
- [ ] All new tables have appropriate RLS policies
- [ ] Storage buckets have RLS policies set up

### Storage
- [ ] `property-images` bucket created
- [ ] `avatars` bucket created
- [ ] Storage policies configured

## Testing the Features

After migration, test each feature:

### 1. Favorites System
- Browse properties and click the heart icon
- Check the Favorites page
- Verify favorites persist after page refresh

### 2. Messaging System
- Send a message to another user
- Verify real-time message delivery
- Check conversation list updates

### 3. Notifications System
- Trigger a notification (favorite a property, send message)
- Check the bell icon in header
- Verify notification badge shows unread count

### 4. Image Upload
- Try uploading a profile picture
- Add property images
- Verify images display correctly

### 5. Application System
- Apply for a property as a searcher
- View application in "My Applications"
- As owner, review application in "Applications" dashboard
- Approve/reject application and verify notifications

## Troubleshooting

### Migration Failed
- Check for syntax errors in the SQL
- Verify you're running migrations in order
- Check if table/column already exists

### RLS Policies Not Working
- Verify user is authenticated
- Check policy conditions match your use case
- Review Supabase logs in Dashboard → Logs

### Storage Upload Fails
- Verify buckets are created
- Check RLS policies on storage.objects
- Verify file size limits (max 50MB by default)

### Functions Not Found
- Verify migration created the function
- Check function in Dashboard → Database → Functions
- Verify SECURITY DEFINER flag is set

## Rollback

If you need to rollback migrations:

### Via Dashboard
1. Go to SQL Editor
2. Run DROP statements for tables/functions created
3. Remove added columns from existing tables

### Via CLI
```bash
# Rollback last migration
npx supabase db reset

# Note: This will reset the entire database!
# Only use in development
```

## Support

If you encounter issues:
1. Check Supabase Dashboard → Logs
2. Review migration file SQL syntax
3. Verify prerequisites are met
4. Check the STORAGE_SETUP.md for storage-specific issues

## Next Steps

After successful migration:
1. Test all features thoroughly
2. Set up monitoring for new tables
3. Configure backup schedules
4. Update your application environment variables if needed
5. Deploy your application code with the new features

---

**Important**: Always test migrations in a development/staging environment before running in production!
