# Environment Variables Setup

## Required Variables

Your `.env.local` file needs the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# ⚠️ IMPORTANT: Required for Delete Account functionality
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## How to Get the Service Role Key

1. Go to your Supabase Dashboard
2. Navigate to **Project Settings** (gear icon in left sidebar)
3. Click on **API** in the settings menu
4. Scroll down to **Service Role Key** section
5. Click **Reveal** to see the key
6. Copy the key
7. Add it to your `.env.local` file:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ⚠️ Security Warning

**The Service Role Key bypasses Row Level Security!**

- **NEVER** expose this key in client-side code
- **NEVER** commit this key to Git
- **ONLY** use it in API routes (server-side)
- Keep it in `.env.local` which is ignored by Git

## What the Service Role Key is Used For

- **Delete Account**: The `/api/user/delete` route uses it to delete users from `auth.users` table
- This is the only way to programmatically delete user accounts in Supabase

## After Adding the Key

1. Save your `.env.local` file
2. Restart your dev server: `npm run dev`
3. The "Delete Account" button will now work properly

## Vercel Deployment

For production deployment on Vercel:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add `SUPABASE_SERVICE_ROLE_KEY` with the value from Supabase
4. Redeploy your application
