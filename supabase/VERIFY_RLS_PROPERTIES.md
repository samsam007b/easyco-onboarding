# RLS Policy Verification - Properties Table

## Overview
This document outlines the Row Level Security (RLS) policies for the `properties` table and provides verification steps.

## RLS Policies Implemented

### 1. Public Read Access (Published Properties)
**Policy Name:** `Public properties are viewable by everyone`
```sql
CREATE POLICY "Public properties are viewable by everyone"
  ON public.properties FOR SELECT
  USING (status = 'published');
```

**Expected Behavior:**
- ✅ Anyone (authenticated or anonymous) can view properties with `status = 'published'`
- ❌ Properties with `status = 'draft'`, `'archived'`, `'rented'`, or `'under_review'` are NOT visible

**Test Cases:**
```sql
-- As anonymous user
SELECT * FROM properties WHERE status = 'published'; -- Should return rows
SELECT * FROM properties WHERE status = 'draft';     -- Should return 0 rows

-- As authenticated user (non-owner)
SELECT * FROM properties WHERE status = 'published'; -- Should return rows
SELECT * FROM properties WHERE status = 'draft';     -- Should return 0 rows (unless they own it)
```

---

### 2. Owner Read Access (All Own Properties)
**Policy Name:** `Users can view their own properties`
```sql
CREATE POLICY "Users can view their own properties"
  ON public.properties FOR SELECT
  USING (auth.uid() = owner_id);
```

**Expected Behavior:**
- ✅ Property owners can view ALL their own properties regardless of status
- ❌ Cannot view other users' draft/archived properties

**Test Cases:**
```sql
-- As property owner
SELECT * FROM properties WHERE owner_id = auth.uid(); -- Should return all owned properties

-- As different user
SELECT * FROM properties WHERE owner_id = '<other-user-id>'; -- Should only return published
```

---

### 3. Owner Insert (Create Properties)
**Policy Name:** `Users can create their own properties`
```sql
CREATE POLICY "Users can create their own properties"
  ON public.properties FOR INSERT
  WITH CHECK (auth.uid() = owner_id);
```

**Expected Behavior:**
- ✅ Authenticated users can create properties if they set `owner_id = auth.uid()`
- ❌ Cannot create properties for other users
- ❌ Anonymous users cannot create properties

**Test Cases:**
```sql
-- As authenticated user
INSERT INTO properties (owner_id, title, ...)
VALUES (auth.uid(), 'My Property', ...); -- Should succeed

INSERT INTO properties (owner_id, title, ...)
VALUES ('<other-user-id>', 'Property', ...); -- Should FAIL
```

---

### 4. Owner Update (Edit Own Properties)
**Policy Name:** `Users can update their own properties`
```sql
CREATE POLICY "Users can update their own properties"
  ON public.properties FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);
```

**Expected Behavior:**
- ✅ Property owners can update their own properties
- ❌ Cannot update other users' properties
- ✅ Can change status from draft → published (via helper function)
- ✅ Can update price, description, images, etc.

**Test Cases:**
```sql
-- As property owner
UPDATE properties
SET monthly_rent = 1200
WHERE id = '<property-id>' AND owner_id = auth.uid(); -- Should succeed

-- As different user
UPDATE properties
SET monthly_rent = 1200
WHERE id = '<property-id>' AND owner_id = '<other-user-id>'; -- Should FAIL
```

---

### 5. Owner Delete (Remove Own Properties)
**Policy Name:** `Users can delete their own properties`
```sql
CREATE POLICY "Users can delete their own properties"
  ON public.properties FOR DELETE
  USING (auth.uid() = owner_id);
```

**Expected Behavior:**
- ✅ Property owners can delete their own properties
- ❌ Cannot delete other users' properties
- ⚠️ Should typically use `archive_property()` instead of hard delete

**Test Cases:**
```sql
-- As property owner
DELETE FROM properties
WHERE id = '<property-id>' AND owner_id = auth.uid(); -- Should succeed

-- As different user
DELETE FROM properties
WHERE id = '<property-id>' AND owner_id = '<other-user-id>'; -- Should FAIL
```

---

## Helper Functions

### publish_property(property_id UUID)
```sql
CREATE OR REPLACE FUNCTION publish_property(property_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.properties
  SET status = 'published', published_at = NOW()
  WHERE id = property_id AND owner_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Expected Behavior:**
- ✅ Only property owner can publish their property
- ✅ Sets `status = 'published'` and `published_at = NOW()`
- ❌ Fails silently if not owner

**Test:**
```sql
SELECT publish_property('<property-id>'); -- As owner: succeeds
SELECT publish_property('<property-id>'); -- As non-owner: no change
```

### archive_property(property_id UUID)
**Expected Behavior:**
- ✅ Sets `status = 'archived'` and `archived_at = NOW()`
- ✅ Only owner can archive

### mark_property_as_rented(property_id UUID)
**Expected Behavior:**
- ✅ Sets `status = 'rented'` and `is_available = false`
- ✅ Only owner can mark as rented

---

## Verification Steps

### Step 1: Apply Migrations
```bash
# Connect to Supabase dashboard or use CLI
supabase db push

# Or apply manually via Supabase SQL Editor
```

### Step 2: Create Test Data
```sql
-- As User A (authenticated)
INSERT INTO properties (owner_id, title, property_type, address, city, postal_code, bedrooms, bathrooms, monthly_rent)
VALUES (auth.uid(), 'Test Property Draft', 'apartment', '123 Test St', 'Paris', '75001', 2, 1, 1200)
RETURNING id;

-- Publish the property
SELECT publish_property('<property-id-from-above>');
```

### Step 3: Test Public Access
```sql
-- As anonymous user or different user
SELECT id, title, status FROM properties;
-- Should ONLY show published properties
```

### Step 4: Test Owner Access
```sql
-- As User A
SELECT id, title, status FROM properties WHERE owner_id = auth.uid();
-- Should show ALL properties (draft, published, etc.)
```

### Step 5: Test Unauthorized Actions
```sql
-- As User B (different user)
UPDATE properties SET title = 'Hacked' WHERE owner_id = '<user-a-id>';
-- Should affect 0 rows

DELETE FROM properties WHERE owner_id = '<user-a-id>';
-- Should affect 0 rows
```

---

## Security Considerations

### ✅ Strengths
1. **Owner Isolation**: Users can only modify their own properties
2. **Public Visibility Control**: Only published properties are public
3. **Type Safety**: CHECK constraints prevent invalid data
4. **Audit Trail**: `created_at`, `updated_at`, `published_at`, `archived_at` timestamps
5. **Soft Deletes**: Archive function instead of hard deletes

### ⚠️ Considerations
1. **Service Role Bypass**: Service role key bypasses RLS (by design)
2. **No Admin Override**: Admins cannot moderate properties (add if needed)
3. **No Approval Workflow**: Properties publish immediately (consider review status)

### 🔒 Recommendations
1. ✅ Never expose service role key to client
2. ✅ Use helper functions for status changes (audit logging)
3. ✅ Consider adding `under_review` status for moderation
4. ✅ Add admin RLS policy if moderation is needed

---

## Phase 1 Status

**RLS Policies:** ✅ Implemented
**Helper Functions:** ✅ Implemented
**Migration Files:** ✅ Created (030, 031)
**Type Definitions:** ✅ Created
**Validation Schemas:** ✅ Created

**Next Steps (Phase 2):**
- Apply migrations to production Supabase instance
- Connect owner onboarding flow to property creation
- Implement image upload functionality
- Create property management UI

---

**Created:** 2025-10-28
**Migration Version:** 030, 031
**Status:** Ready for Production Deployment
