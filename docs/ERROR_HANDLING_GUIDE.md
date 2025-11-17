# 🚨 Unified Error Handling Guide

## Overview

EasyCo now has a centralized error handling system that provides:

- ✅ **Type-safe error codes** - Enum-based codes prevent typos
- 🌍 **Multi-language support** - Automatic FR/EN/NL/DE translations
- 📊 **Consistent logging** - All errors logged with context
- 🎯 **User-friendly messages** - Clear, actionable error notifications
- 🔍 **Error categorization** - Auth, Network, Validation, etc.

---

## Quick Start

### Import the Error Handler

```typescript
import {
  handleError,
  handleSupabaseError,
  handleValidationError,
  handleNetworkError,
  ErrorCode,
} from '@/lib/utils/error-handler';
```

### Basic Usage

**Before (Old Way):**
```typescript
try {
  await saveProfile();
} catch (error) {
  console.error('Error saving:', error);
  toast.error('Erreur lors de la sauvegarde'); // Hardcoded French
}
```

**After (New Way):**
```typescript
try {
  await saveProfile();
} catch (error) {
  handleSupabaseError(error, ErrorCode.SAVE_PROFILE_FAILED, {
    userId: user.id,
  });
}
```

---

## Error Handling Functions

### 1. `handleError(error, errorCode, context?, silent?)`

General-purpose error handler for any type of error.

```typescript
try {
  const result = await fetchData();
} catch (error) {
  handleError(error, ErrorCode.LOAD_FAILED, {
    endpoint: '/api/data',
    userId: user.id,
  });
}
```

**Parameters:**
- `error` - The error object (any type)
- `errorCode` - Specific ErrorCode enum value
- `context` (optional) - Additional metadata for logging
- `silent` (optional) - If true, don't show toast (default: false)

---

### 2. `handleSupabaseError(error, fallbackCode, context?)`

Specialized handler for Supabase errors. Automatically detects common Supabase error codes.

```typescript
const { error } = await supabase
  .from('profiles')
  .insert(data);

if (error) {
  handleSupabaseError(error, ErrorCode.SAVE_PROFILE_FAILED, {
    table: 'profiles',
    userId: user.id,
  });
  return;
}
```

**Auto-detected Supabase errors:**
- `23505` → `RESOURCE_ALREADY_EXISTS` (unique violation)
- `23503` → `RESOURCE_NOT_FOUND` (foreign key violation)
- `PGRST116` → `RESOURCE_NOT_FOUND` (row not found)
- JWT errors → `AUTH_SESSION_EXPIRED`
- Permission errors → `PERMISSION_DENIED`

---

### 3. `handleValidationError(fieldName, errorCode, context?)`

Specialized handler for form validation errors.

```typescript
if (!email) {
  handleValidationError('email', ErrorCode.VALIDATION_REQUIRED_FIELD);
  return;
}

if (!isValidEmail(email)) {
  handleValidationError('email', ErrorCode.VALIDATION_INVALID_EMAIL, {
    providedEmail: email,
  });
  return;
}
```

---

### 4. `handleNetworkError(error, context?)`

Specialized handler for network/fetch errors.

```typescript
try {
  const response = await fetch('/api/endpoint');
} catch (error) {
  handleNetworkError(error, {
    endpoint: '/api/endpoint',
    method: 'POST',
  });
}
```

---

## Available Error Codes

### Authentication Errors
```typescript
ErrorCode.AUTH_FAILED
ErrorCode.AUTH_INVALID_CREDENTIALS
ErrorCode.AUTH_USER_NOT_FOUND
ErrorCode.AUTH_SESSION_EXPIRED
ErrorCode.AUTH_NO_USER
```

### Data Loading Errors
```typescript
ErrorCode.LOAD_FAILED
ErrorCode.LOAD_PROFILE_FAILED
ErrorCode.LOAD_PROPERTIES_FAILED
ErrorCode.LOAD_MESSAGES_FAILED
```

### Data Saving Errors
```typescript
ErrorCode.SAVE_FAILED
ErrorCode.SAVE_PROFILE_FAILED
ErrorCode.SAVE_PROPERTY_FAILED
ErrorCode.UPDATE_FAILED
ErrorCode.DELETE_FAILED
```

### Validation Errors
```typescript
ErrorCode.VALIDATION_REQUIRED_FIELD
ErrorCode.VALIDATION_INVALID_EMAIL
ErrorCode.VALIDATION_INVALID_PHONE
ErrorCode.VALIDATION_INVALID_DATE
ErrorCode.VALIDATION_MIN_LENGTH
ErrorCode.VALIDATION_MAX_LENGTH
ErrorCode.VALIDATION_INVALID_FORMAT
```

### Network Errors
```typescript
ErrorCode.NETWORK_ERROR
ErrorCode.NETWORK_TIMEOUT
ErrorCode.NETWORK_OFFLINE
```

### Permission Errors
```typescript
ErrorCode.PERMISSION_DENIED
ErrorCode.PERMISSION_NOT_OWNER
ErrorCode.PERMISSION_INSUFFICIENT
```

### Resource Errors
```typescript
ErrorCode.RESOURCE_NOT_FOUND
ErrorCode.RESOURCE_ALREADY_EXISTS
ErrorCode.RESOURCE_UNAVAILABLE
```

### Upload Errors
```typescript
ErrorCode.UPLOAD_FAILED
ErrorCode.UPLOAD_SIZE_EXCEEDED
ErrorCode.UPLOAD_INVALID_TYPE
```

### Payment Errors
```typescript
ErrorCode.PAYMENT_FAILED
ErrorCode.PAYMENT_DECLINED
ErrorCode.PAYMENT_INSUFFICIENT_FUNDS
```

### Matching Errors
```typescript
ErrorCode.MATCHING_FAILED
ErrorCode.MATCHING_NO_RESULTS
```

### Generic Errors
```typescript
ErrorCode.UNEXPECTED_ERROR
ErrorCode.UNKNOWN_ERROR
```

---

## Advanced Usage

### Function Wrapper for Automatic Error Handling

Use `withErrorHandler` to wrap async functions:

```typescript
import { withErrorHandler, ErrorCode } from '@/lib/utils/error-handler';

// Define your async function
const saveUserProfile = withErrorHandler(
  async (userId: string, data: any) => {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId);

    if (error) throw error;
  },
  ErrorCode.SAVE_PROFILE_FAILED,
  { operation: 'saveUserProfile' }
);

// Use it - errors are automatically handled
await saveUserProfile(user.id, profileData);
```

### Get Error Message Without Handling

If you need just the translated message without showing a toast:

```typescript
import { getErrorMessage, ErrorCode } from '@/lib/utils/error-handler';

const message = getErrorMessage(ErrorCode.SAVE_FAILED);
console.log(message); // "Échec de la sauvegarde" (in user's language)

// With specific language override
const messageEN = getErrorMessage(ErrorCode.SAVE_FAILED, 'en');
console.log(messageEN); // "Save failed"
```

---

## Migration Examples

### Example 1: Simple Toast Error

**Before:**
```typescript
toast.error('Erreur lors de la sauvegarde');
```

**After:**
```typescript
handleError(new Error('Save failed'), ErrorCode.SAVE_FAILED);
```

---

### Example 2: Supabase Error

**Before:**
```typescript
const { error } = await supabase.from('profiles').insert(data);
if (error) {
  console.error('Error:', error);
  toast.error(error.message || 'Une erreur est survenue');
}
```

**After:**
```typescript
const { error } = await supabase.from('profiles').insert(data);
if (error) {
  handleSupabaseError(error, ErrorCode.SAVE_PROFILE_FAILED, {
    table: 'profiles',
  });
}
```

---

### Example 3: Form Validation

**Before:**
```typescript
if (!email) {
  toast.error('L\'email est requis');
  return;
}

if (!isValidEmail(email)) {
  toast.error('Format email invalide');
  return;
}
```

**After:**
```typescript
if (!email) {
  handleValidationError('email', ErrorCode.VALIDATION_REQUIRED_FIELD);
  return;
}

if (!isValidEmail(email)) {
  handleValidationError('email', ErrorCode.VALIDATION_INVALID_EMAIL);
  return;
}
```

---

### Example 4: Try-Catch with Generic Error

**Before:**
```typescript
try {
  await loadData();
} catch (error: any) {
  console.error('Failed to load:', error);
  toast.error('Échec du chargement');
}
```

**After:**
```typescript
try {
  await loadData();
} catch (error) {
  handleError(error, ErrorCode.LOAD_FAILED, {
    component: 'ProfilePage',
    action: 'loadInitialData',
  });
}
```

---

### Example 5: Silent Error (Background Task)

For errors that shouldn't show a toast (e.g., background syncs):

```typescript
try {
  await backgroundSync();
} catch (error) {
  handleError(
    error,
    ErrorCode.SAVE_FAILED,
    { operation: 'backgroundSync' },
    true // silent = true (no toast)
  );
}
```

---

## Best Practices

### ✅ DO

1. **Always provide context:**
   ```typescript
   handleError(error, ErrorCode.SAVE_FAILED, {
     userId: user.id,
     table: 'profiles',
     timestamp: Date.now(),
   });
   ```

2. **Use specific error codes:**
   ```typescript
   // ✅ Good - specific
   ErrorCode.SAVE_PROFILE_FAILED

   // ❌ Bad - too generic
   ErrorCode.UNEXPECTED_ERROR
   ```

3. **Handle errors at the right level:**
   ```typescript
   // Handle errors where you can provide meaningful context
   const saveProfile = async () => {
     try {
       await api.save(profile);
     } catch (error) {
       handleError(error, ErrorCode.SAVE_PROFILE_FAILED, {
         profileId: profile.id,
       });
     }
   };
   ```

4. **Return early after handling validation errors:**
   ```typescript
   if (!isValid) {
     handleValidationError('field', ErrorCode.VALIDATION_REQUIRED_FIELD);
     return; // ✅ Stop execution
   }
   ```

---

### ❌ DON'T

1. **Don't hardcode error messages:**
   ```typescript
   // ❌ Bad
   toast.error('Erreur lors de la sauvegarde');

   // ✅ Good
   handleError(error, ErrorCode.SAVE_FAILED);
   ```

2. **Don't mix old and new patterns:**
   ```typescript
   // ❌ Bad - mixing patterns
   try {
     await save();
   } catch (error) {
     console.error(error); // Old
     handleError(error, ErrorCode.SAVE_FAILED); // New
   }

   // ✅ Good - use new pattern only
   try {
     await save();
   } catch (error) {
     handleError(error, ErrorCode.SAVE_FAILED);
   }
   ```

3. **Don't ignore errors silently:**
   ```typescript
   // ❌ Bad
   try {
     await save();
   } catch (error) {
     // Silent failure - user doesn't know what happened
   }

   // ✅ Good
   try {
     await save();
   } catch (error) {
     handleError(error, ErrorCode.SAVE_FAILED);
   }
   ```

---

## Testing

### Test Error Messages in Different Languages

```typescript
import { getErrorMessage, ErrorCode } from '@/lib/utils/error-handler';

describe('Error Messages', () => {
  it('should return French message by default', () => {
    const message = getErrorMessage(ErrorCode.SAVE_FAILED);
    expect(message).toBe('Échec de la sauvegarde');
  });

  it('should return English message when specified', () => {
    const message = getErrorMessage(ErrorCode.SAVE_FAILED, 'en');
    expect(message).toBe('Save failed');
  });
});
```

---

## Adding New Error Codes

1. **Add to ErrorCode enum:**
   ```typescript
   // lib/utils/error-handler.ts
   export enum ErrorCode {
     // ... existing codes
     MY_NEW_ERROR = 'myModule.myError',
   }
   ```

2. **Add translations:**
   ```typescript
   export const errorMessages = {
     // ... existing messages
     'myModule.myError': {
       fr: 'Mon erreur en français',
       en: 'My error in English',
       nl: 'Mijn fout in het Nederlands',
       de: 'Mein Fehler auf Deutsch',
     },
   };
   ```

3. **Use it:**
   ```typescript
   handleError(error, ErrorCode.MY_NEW_ERROR);
   ```

---

## Migration Checklist

- [ ] Replace all `toast.error('hardcoded message')` with `handleError()`
- [ ] Replace all `console.error()` + `toast.error()` combos with handlers
- [ ] Update Supabase error handling to use `handleSupabaseError()`
- [ ] Update form validation to use `handleValidationError()`
- [ ] Add proper context to all error handlers
- [ ] Test errors in all 4 languages (FR/EN/NL/DE)
- [ ] Remove old error handling patterns

---

## Support

If you need a new error code or have questions:
1. Check if an existing ErrorCode fits your use case
2. If not, add a new one following the guide above
3. Document your changes in this file

---

**Last Updated:** 2025-11-17
**Version:** 1.0.0
