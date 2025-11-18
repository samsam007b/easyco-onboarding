# OAuth Integration Guide - Google & Apple Sign-In

This guide walks through implementing Google and Apple OAuth authentication in the EasyCo iOS app using Supabase.

## Prerequisites

Before starting, you need to configure OAuth providers in Supabase:

### 1. Supabase Dashboard Configuration

#### Google OAuth Setup
1. Go to https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/providers
2. Enable Google provider
3. Configure the OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
   - **Redirect URL**: Copy the Supabase redirect URL (will be like `https://YOUR_PROJECT.supabase.co/auth/v1/callback`)

#### Apple OAuth Setup
1. In Supabase Dashboard, enable Apple provider
2. Configure the OAuth credentials:
   - **Services ID**: From Apple Developer
   - **Key ID**: From Apple Developer
   - **Team ID**: Your Apple Developer Team ID
   - **Private Key**: .p8 file contents from Apple Developer

### 2. Google Cloud Console Setup

1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials:
   - Application type: iOS
   - Bundle ID: `com.easyco.app` (or your bundle ID)
   - iOS URL scheme: `com.googleusercontent.apps.YOUR_CLIENT_ID`
5. Also create OAuth credentials for:
   - Application type: Web application
   - Authorized redirect URIs: Add your Supabase callback URL
6. Download the OAuth client configuration

### 3. Apple Developer Portal Setup

1. Go to https://developer.apple.com/account
2. Go to Certificates, Identifiers & Profiles
3. Create an App ID with Sign in with Apple capability enabled
4. Create a Services ID:
   - Register a new Services ID
   - Enable Sign in with Apple
   - Configure Return URLs: Add your Supabase callback URL
5. Create a Sign in with Apple Key:
   - Register a new key
   - Enable Sign in with Apple
   - Download the .p8 private key file (keep it secure!)

### 4. Xcode Project Configuration

1. Open EasyCo.xcodeproj in Xcode
2. Select the EasyCo target
3. Go to "Signing & Capabilities"
4. Add "Sign in with Apple" capability
5. Add URL Schemes for Google Sign-In:
   - Go to Info tab
   - Add URL Types
   - URL Schemes: `com.googleusercontent.apps.YOUR_REVERSED_CLIENT_ID`

## iOS Implementation

### Step 1: Add Dependencies

We'll use native AuthenticationServices for Apple and implement Google Sign-In manually or use the Google SDK.

For Google Sign-In SDK (recommended):
1. Add to your project via Swift Package Manager:
   - File → Add Packages
   - URL: `https://github.com/google/GoogleSignIn-iOS`
   - Version: Latest (6.0.0+)

### Step 2: Update Info.plist

Add the following to your Info.plist:

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>com.googleusercontent.apps.YOUR_REVERSED_CLIENT_ID</string>
        </array>
    </dict>
</array>

<key>GIDClientID</key>
<string>YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com</string>
```

### Step 3: Implement OAuth Methods in SupabaseAuth.swift

See the updated SupabaseAuth.swift file for implementation.

### Step 4: Update LoginView.swift

Replace the TODO comments with actual OAuth calls.

## Testing

### Google Sign-In Testing
1. Build and run on a real device (simulator may have issues)
2. Tap "Continue with Google"
3. Select a Google account
4. Verify user is created in Supabase Auth dashboard
5. Check that profile is created in `profiles` table

### Apple Sign-In Testing
1. Build and run on a real device with iOS 13+
2. Tap "Continue with Apple"
3. Choose to share or hide email
4. Verify user is created in Supabase Auth dashboard
5. Check that profile is created in `profiles` table

## Troubleshooting

### Google Sign-In Issues
- **Error: Invalid client**: Check that bundle ID matches in Google Console
- **Error: Redirect URI mismatch**: Ensure Supabase callback URL is added to authorized redirect URIs
- **No response**: Check that URL schemes are correctly configured in Info.plist

### Apple Sign-In Issues
- **Capability not found**: Ensure "Sign in with Apple" capability is added in Xcode
- **Invalid client**: Verify Services ID and bundle ID match
- **Email not provided**: User chose to hide email, handle this gracefully

### Supabase Issues
- **User created but no profile**: Check that RLS policies allow insert for authenticated users
- **Token not saved**: Verify EasyCoKeychainManager is working correctly

## Security Considerations

1. **Never commit secrets**: Keep Google Client Secret and Apple Private Key secure
2. **Use environment variables**: Store sensitive config in .env files (not in repo)
3. **Validate tokens server-side**: Always verify OAuth tokens on the backend
4. **Handle token refresh**: Implement proper token refresh logic
5. **Secure storage**: Use Keychain for storing tokens, not UserDefaults

## Next Steps

After OAuth is working:
1. Add profile completion flow for new OAuth users
2. Implement account linking (connect multiple providers to one account)
3. Add provider information to user profile
4. Handle edge cases (account already exists with email, etc.)
5. Add analytics to track OAuth conversion rates

## Resources

- [Supabase OAuth Docs](https://supabase.com/docs/guides/auth/social-login)
- [Google Sign-In iOS Docs](https://developers.google.com/identity/sign-in/ios/start-integrating)
- [Apple Sign-In Docs](https://developer.apple.com/documentation/authenticationservices/implementing_user_authentication_with_sign_in_with_apple)
- [AuthenticationServices Framework](https://developer.apple.com/documentation/authenticationservices)
