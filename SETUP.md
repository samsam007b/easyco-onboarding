# EasyCo Setup Instructions

This document contains setup instructions for the EasyCo application.

## Database Setup

### 1. User Tables & Profiles

Apply the main database schema:

1. Go to Supabase Dashboard → SQL Editor
2. Open `supabase/schema.sql`
3. Copy and run the entire SQL script

This creates:
- `users` table (extends auth.users)
- `user_profiles` table (stores onboarding data)
- `user_sessions` table (session tracking)
- RLS policies for security
- Triggers for auto-creation

### 2. Properties Table

Apply the properties schema:

1. Go to Supabase Dashboard → SQL Editor
2. Open `supabase/properties-schema.sql`
3. Copy and run the entire SQL script

This creates:
- `properties` table with all fields
- Indexes for performance
- RLS policies (owners can CRUD their properties, anyone can view published)
- Triggers for `updated_at`
- Functions: `publish_property()`, `archive_property()`
- Full-text search support

## Storage Setup

### 1. Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Name: `property-images`
4. **Important**: Set to **PUBLIC**
5. Click "Create bucket"

### 2. Apply Storage Policies

1. Go to Supabase Dashboard → SQL Editor
2. Open `supabase/storage-setup.sql`
3. Copy and run the entire SQL script

This creates RLS policies for:
- Public read access to all images
- Authenticated users can upload/update/delete their own property images

## Environment Variables

Ensure your `.env.local` file contains:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Deployment Checklist

Before deploying to production:

- [ ] Apply `supabase/schema.sql` to Supabase
- [ ] Apply `supabase/properties-schema.sql` to Supabase
- [ ] Create `property-images` storage bucket (PUBLIC)
- [ ] Apply `supabase/storage-setup.sql` to Supabase
- [ ] Set environment variables on Vercel
- [ ] Test authentication flow
- [ ] Test onboarding (Searcher & Owner)
- [ ] Test property creation
- [ ] Test image upload
- [ ] Test property edit/delete
- [ ] Test property publishing/archiving

## Features Available

### Authentication
- ✅ Email/Password signup & login
- ✅ Google OAuth
- ✅ Email verification
- ✅ Password reset
- ✅ Session management

### Onboarding
- ✅ Searcher onboarding (10 steps)
- ✅ Owner onboarding (3 steps)
- ✅ Data saved to `user_profiles`
- ✅ Redirect to appropriate dashboard

### Property Management (Owners)
- ✅ Create property (draft)
- ✅ Edit property
- ✅ View property details
- ✅ Delete property
- ✅ Publish property (make visible to searchers)
- ✅ Archive property (hide from searchers)
- ✅ Image upload ready (requires storage bucket)

### Dashboards
- ✅ Owner dashboard (view properties, stats)
- ✅ Searcher dashboard
- ✅ Resident dashboard

## Next Steps (Optional)

### Immediate
1. Implement image upload in add/edit property forms
2. Add image gallery to property details page
3. Test complete property management flow

### Short-term
1. Property search for Searchers
2. Matching algorithm (Searchers ↔ Properties)
3. Favorites system
4. Contact Owner functionality

### Medium-term
1. Messaging system (Owner ↔ Searcher chat)
2. Application management
3. Booking system
4. Payment integration

### Long-term
1. Reviews & ratings
2. Verified properties
3. Admin panel
4. Analytics dashboard

## Troubleshooting

### Images not uploading
- Verify `property-images` bucket exists and is PUBLIC
- Check storage policies are applied
- Check browser console for errors

### Properties not saving
- Verify `properties` table exists
- Check RLS policies allow insert/update
- Check user is authenticated

### Build errors
- Run `npm run build` locally to test
- Check TypeScript errors
- Verify all imports are correct

## Support

For issues or questions, check:
- Supabase Dashboard → Logs
- Browser Console → Network tab
- Next.js build output
