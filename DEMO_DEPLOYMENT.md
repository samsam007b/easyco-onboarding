# EasyCo Demo Deployment Guide 🚀

Complete guide to deploy the demo version of EasyCo for user testing.

## 🎯 Deployment Options

### Option 1: Vercel (Recommended) ⚡

**Pros:** Automatic, fast, easy preview URLs
**Best for:** Quick testing, sharing with users

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy demo branch
git checkout demo-version
vercel --prod

# 3. Set environment variables in Vercel dashboard
# Go to: Project Settings > Environment Variables
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SUPABASE_URL=your_demo_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_demo_supabase_key
NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS=true
```

### Option 2: Netlify 🌐

**Pros:** Simple, good for static sites
**Best for:** Long-term demo hosting

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build and deploy
npm run build
netlify deploy --prod

# 3. Configure environment variables via Netlify UI
```

### Option 3: Docker 🐳

**Pros:** Complete control, can run anywhere
**Best for:** Internal testing, custom infrastructure

```dockerfile
# Dockerfile already exists in project
docker build -t easyco-demo .
docker run -p 3000:3000 easyco-demo
```

## 🗄️ Database Setup (Supabase)

### Step 1: Create Demo Supabase Project

1. Go to https://supabase.com
2. Create new project named "EasyCo Demo"
3. Choose **free tier** for testing
4. Note down:
   - Project URL
   - Anon/Public Key

### Step 2: Set Up Tables

Run the migration files in order:

```bash
# In Supabase SQL Editor:
1. Run: migrations/001_initial_schema.sql
2. Run: scripts/seed-demo-data.sql
```

### Step 3: Create Demo Users

Via Supabase Auth Dashboard:

```
User 1:
Email: demo.searcher@easyco.demo
Password: Demo2024!
Metadata: { "full_name": "Emma Searcher", "user_type": "searcher" }

User 2:
Email: demo.owner@easyco.demo
Password: Demo2024!
Metadata: { "full_name": "Lucas Owner", "user_type": "owner" }

User 3:
Email: demo.resident@easyco.demo
Password: Demo2024!
Metadata: { "full_name": "Sophie Resident", "user_type": "resident" }
```

### Step 4: Configure RLS Policies

```sql
-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read for demo
CREATE POLICY "Allow public read properties" ON properties
  FOR SELECT USING (status = 'published');

-- Allow authenticated users to read profiles
CREATE POLICY "Allow authenticated read profiles" ON user_profiles
  FOR SELECT USING (auth.role() = 'authenticated');
```

## 🔐 Security Configuration

### Environment Variables

Create `.env.local` from `.env.demo`:

```bash
cp .env.demo .env.local
```

Update with your demo Supabase credentials:

```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SUPABASE_URL=https://your-demo-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS=true

# Disable sensitive features
NEXT_PUBLIC_ENABLE_REAL_PAYMENTS=false
NEXT_PUBLIC_ENABLE_EMAIL_NOTIFICATIONS=false
```

### Supabase Policies

Ensure demo database is **separate** from production:
- ✅ Use different Supabase project
- ✅ Use demo email domain (@easyco.demo)
- ✅ Enable RLS on all tables
- ✅ Limit API rate limits

## 🎨 Branding (Optional)

### Add Demo Watermark

The `DemoBanner` component automatically appears when `NEXT_PUBLIC_DEMO_MODE=true`.

To customize:
```tsx
// components/DemoBanner.tsx
<div className="bg-gradient-to-r from-yellow-400 to-orange-500">
  🎭 DEMO VERSION - Your Custom Message
</div>
```

### Disable Features

In demo mode, certain features are automatically disabled:
- ❌ Real payments (Stripe)
- ❌ Email notifications
- ❌ SMS notifications
- ❌ File uploads to production storage

## 📊 Analytics (Optional)

### Add Google Analytics

```bash
# Install
npm install @next/third-parties

# In layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId="G-DEMO123456" />
      </body>
    </html>
  )
}
```

### Add Hotjar for Heatmaps

```html
<!-- In app/layout.tsx -->
<Script id="hotjar">
  {`(function(h,o,t,j,a,r){...})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
</Script>
```

## 🧪 Testing Checklist

Before sharing demo:

### Functionality
- [ ] All 3 demo accounts can login
- [ ] Properties are visible and searchable
- [ ] Filters work correctly
- [ ] Navigation between pages works
- [ ] Mobile responsive on iPhone/Android
- [ ] Dashboard loads for all roles
- [ ] No console errors

### Content
- [ ] Demo banner is visible
- [ ] Demo credentials are displayed on login
- [ ] All text is in correct language
- [ ] No placeholder "Lorem ipsum" text
- [ ] Images load correctly (or placeholders)

### Security
- [ ] Using separate demo database
- [ ] No production credentials exposed
- [ ] Rate limiting enabled
- [ ] Demo emails use @easyco.demo domain
- [ ] HTTPS enabled

## 🔄 Maintenance

### Resetting Demo Data

Create a cron job or manual script:

```bash
# scripts/reset-demo.sh
#!/bin/bash

# Delete all user-generated content
psql $DATABASE_URL << EOF
DELETE FROM favorites WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@easyco.demo');
DELETE FROM messages WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@easyco.demo');
-- Add more cleanup as needed
EOF

# Re-seed demo data
psql $DATABASE_URL < scripts/seed-demo-data.sql

echo "Demo data reset completed!"
```

Run daily via cron:
```cron
0 2 * * * /path/to/reset-demo.sh
```

### Monitoring

Set up uptime monitoring:
- **Uptime Robot**: Free tier, 5-minute checks
- **Vercel Analytics**: Built-in for Vercel deployments
- **Sentry**: Error tracking (optional)

## 📱 Sharing with Users

### Create Short URL

```bash
# Using Bitly, TinyURL, or custom domain
https://demo.easyco.app  →  https://bit.ly/easyco-demo
```

### Generate QR Code

```bash
# Using qrencode or online tool
qrencode -o demo-qr.png "https://demo.easyco.app"
```

### Email Template

```html
Subject: Test the new EasyCo Platform! 🏠

Hi [Name],

We'd love your feedback on our coliving platform!

🔗 Demo Link: https://demo.easyco.app

📝 Test Accounts:
- Searcher: demo.searcher@easyco.demo / Demo2024!
- Owner: demo.owner@easyco.demo / Demo2024!
- Resident: demo.resident@easyco.demo / Demo2024!

⚠️ This is a demo with fictional data.

Please test and share your feedback: feedback@easyco.app

Thank you! 🙏
```

## 🐛 Troubleshooting

### "Cannot connect to database"
- Check Supabase URL and keys
- Verify project is not paused (free tier)
- Check RLS policies are configured

### "Demo accounts don't work"
- Ensure users are created in Supabase Auth
- Run seed script after creating users
- Check email format (must be @easyco.demo)

### "Properties not showing"
- Verify properties have status='published'
- Check user has authentication
- Confirm RLS policies allow read access

### "Slow loading"
- Enable Vercel Edge Network
- Add image optimization
- Check Supabase region (EU vs US)

## 📞 Support

Need help deploying?
- Email: demo-support@easyco.app
- Docs: https://docs.easyco.app/demo
- GitHub Issues: Create an issue with [DEMO] tag

## ✅ Final Checklist

Before going live:
- [ ] Demo database created and seeded
- [ ] Environment variables configured
- [ ] Demo banner visible
- [ ] All 3 accounts tested
- [ ] Mobile tested on real devices
- [ ] HTTPS enabled
- [ ] Custom domain configured (optional)
- [ ] Analytics set up (optional)
- [ ] Feedback form/email ready
- [ ] Monitoring/uptime checks enabled

---

**Demo URL**: https://demo.easyco.app
**Admin Panel**: https://supabase.com/dashboard/project/demo-easyco

**Status**: 🟢 Live | 🔴 Down | 🟡 Maintenance
