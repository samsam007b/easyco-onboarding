# Supabase Configuration Guide

This document provides step-by-step instructions for configuring Supabase features needed for the EasyCo authentication system.

## Table of Contents
1. [Database Schema Setup](#database-schema-setup)
2. [Google OAuth Configuration](#google-oauth-configuration)
3. [Supabase Storage for Avatars](#supabase-storage-for-avatars)
4. [Email Templates](#email-templates)
5. [Testing the Setup](#testing-the-setup)

---

## 1. Database Schema Setup

### Step 1: Apply the Database Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire content from `supabase/schema.sql`
5. Paste it into the SQL editor
6. Click **Run** to execute the schema

This will create:
- `users` table (extends auth.users)
- `user_profiles` table
- `user_sessions` table
- Row Level Security (RLS) policies
- Triggers for automatic user creation
- Necessary indexes

### Step 2: Verify the Schema

Run this query to verify tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('users', 'user_profiles', 'user_sessions');
```

You should see all three tables listed.

---

## 2. Google OAuth Configuration

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application** as the application type
6. Configure the OAuth consent screen if prompted:
   - App name: **EasyCo**
   - User support email: Your email
   - Developer contact: Your email
   - Add scopes: `email`, `profile`, `openid`
7. Add **Authorized redirect URIs**:
   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```
   Replace `[YOUR-PROJECT-REF]` with your actual Supabase project reference ID (found in your Supabase project URL)

8. Click **Create**
9. Copy the **Client ID** and **Client Secret**

### Step 2: Configure Google OAuth in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers** in the left sidebar
3. Find **Google** in the list of providers
4. Click to expand Google settings
5. Toggle **Enable Sign in with Google** to ON
6. Paste your **Client ID** from Google
7. Paste your **Client Secret** from Google
8. Click **Save**

### Step 3: Test Google OAuth (Optional)

You can test the OAuth flow by:
1. Going to `/signup` on your deployed app
2. Clicking "Continue with Google"
3. You should be redirected to Google's consent screen
4. After approval, you should be redirected back and logged in

---

## 3. Supabase Storage for Avatars

### Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Configure the bucket:
   - **Name**: `avatars`
   - **Public bucket**: Toggle ON (so avatars can be viewed without authentication)
   - **File size limit**: 2MB (optional, for optimization)
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
5. Click **Create bucket**

### Step 2: Set Storage Policies

After creating the bucket, set up Row Level Security policies:

1. In the Storage section, click on the `avatars` bucket
2. Go to the **Policies** tab
3. Click **New Policy** for each policy below:

**Policy 1: Public Read Access**
```sql
CREATE POLICY "Public Avatar Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

**Policy 2: Authenticated Upload**
```sql
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
```

**Policy 3: User Can Update Own Avatar**
```sql
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING ((storage.foldername(name))[1] = auth.uid()::text AND bucket_id = 'avatars');
```

**Policy 4: User Can Delete Own Avatar**
```sql
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING ((storage.foldername(name))[1] = auth.uid()::text AND bucket_id = 'avatars');
```

### Step 3: Verify Storage Setup

Test that you can access the storage bucket URL:
```
https://[YOUR-PROJECT-REF].supabase.co/storage/v1/object/public/avatars/
```

---

## 4. Email Templates

Supabase sends emails for email verification and password reset. You can customize these templates.

### Step 1: Access Email Templates

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Email Templates**

### Step 2: Customize Confirmation Email

Select **Confirm signup** template and replace with:

**Subject**: `Confirm your EasyCo account`

**Body (HTML)**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #4A148C;
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: white;
    }
    .logo-easy {
      color: white;
    }
    .logo-co {
      color: #FFD600;
    }
    .content {
      padding: 40px 30px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 16px;
    }
    .text {
      color: #6b7280;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .button {
      display: inline-block;
      background-color: #FFD600;
      color: black;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #F57F17;
    }
    .footer {
      padding: 30px;
      text-align: center;
      color: #9ca3af;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span class="logo-easy">EASY</span><span class="logo-co">Co</span>
      </div>
    </div>
    <div class="content">
      <h1 class="title">Confirm Your Email</h1>
      <p class="text">
        Welcome to EasyCo! We're excited to have you join our coliving community.
      </p>
      <p class="text">
        Please confirm your email address by clicking the button below:
      </p>
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Confirm Email</a>
      </div>
      <p class="text">
        If you didn't create an account with EasyCo, you can safely ignore this email.
      </p>
    </div>
    <div class="footer">
      <p>© 2024 EasyCo. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

### Step 3: Customize Password Reset Email

Select **Reset password** template and replace with:

**Subject**: `Reset your EasyCo password`

**Body (HTML)**:
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #4A148C;
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: white;
    }
    .logo-easy {
      color: white;
    }
    .logo-co {
      color: #FFD600;
    }
    .content {
      padding: 40px 30px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 16px;
    }
    .text {
      color: #6b7280;
      font-size: 16px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .button {
      display: inline-block;
      background-color: #FFD600;
      color: black;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #F57F17;
    }
    .alert {
      background-color: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 16px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .footer {
      padding: 30px;
      text-align: center;
      color: #9ca3af;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <span class="logo-easy">EASY</span><span class="logo-co">Co</span>
      </div>
    </div>
    <div class="content">
      <h1 class="title">Reset Your Password</h1>
      <p class="text">
        We received a request to reset the password for your EasyCo account.
      </p>
      <p class="text">
        Click the button below to create a new password:
      </p>
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
      </div>
      <div class="alert">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
        </p>
      </div>
    </div>
    <div class="footer">
      <p>© 2024 EasyCo. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

### Step 4: Configure Email Settings

1. Navigate to **Authentication** > **URL Configuration**
2. Set the **Site URL** to your production domain: `https://easyco-mvp.vercel.app`
3. Add **Redirect URLs**:
   ```
   https://easyco-mvp.vercel.app/auth/callback
   https://easyco-mvp.vercel.app/reset-password
   http://localhost:3000/auth/callback
   http://localhost:3000/reset-password
   ```

---

## 5. Testing the Setup

### Test Checklist

- [ ] **Database Schema**
  - [ ] Run a test signup via email/password
  - [ ] Verify user appears in `users` table
  - [ ] Verify trigger creates user automatically

- [ ] **Google OAuth**
  - [ ] Click "Continue with Google" on signup
  - [ ] Complete Google consent flow
  - [ ] Verify redirect back to app
  - [ ] Verify user created in `users` table

- [ ] **Email Verification**
  - [ ] Sign up with email/password
  - [ ] Check email inbox
  - [ ] Verify email template looks correct
  - [ ] Click confirmation link
  - [ ] Verify redirect to app

- [ ] **Password Reset**
  - [ ] Go to "Forgot Password"
  - [ ] Enter email and submit
  - [ ] Check email inbox
  - [ ] Verify email template looks correct
  - [ ] Click reset link
  - [ ] Create new password
  - [ ] Login with new password

- [ ] **Storage (Future)**
  - [ ] Upload avatar on profile page
  - [ ] Verify image appears
  - [ ] Verify image URL is public

---

## Troubleshooting

### Google OAuth Not Working

**Issue**: OAuth redirect fails or shows error

**Solutions**:
1. Verify redirect URL in Google Cloud Console matches exactly: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
2. Check that Client ID and Secret are correctly pasted in Supabase
3. Ensure OAuth consent screen is published (not in testing mode)
4. Clear browser cookies and try again

### Email Not Sending

**Issue**: Confirmation/reset emails not received

**Solutions**:
1. Check spam/junk folder
2. Verify email templates are saved in Supabase
3. Check Supabase **Settings** > **Auth** > **SMTP Settings** (use default if unsure)
4. Try with different email provider (Gmail, Outlook, etc.)

### Storage Upload Fails

**Issue**: Avatar upload returns error

**Solutions**:
1. Verify bucket named `avatars` exists
2. Check that bucket is set to **Public**
3. Verify RLS policies are created and enabled
4. Check file size is under 2MB
5. Verify file type is image (JPEG, PNG, GIF, WebP)

### Database Errors

**Issue**: Signup fails with database error

**Solutions**:
1. Check that schema was applied successfully
2. Verify RLS policies are enabled on `users` table
3. Check that trigger `on_auth_user_created` exists
4. Review Supabase logs in Dashboard > **Logs** > **Database**

---

## Next Steps

After completing this configuration:

1. ✅ Test all authentication flows locally
2. ✅ Test on deployed Vercel app
3. ✅ Update environment variables if needed
4. ✅ Monitor Supabase logs for any errors
5. ✅ Implement avatar upload functionality (currently placeholder)

---

## Support

If you encounter issues:
- Check Supabase documentation: https://supabase.com/docs
- Review Google OAuth docs: https://developers.google.com/identity/protocols/oauth2
- Ask in project Slack/Discord
