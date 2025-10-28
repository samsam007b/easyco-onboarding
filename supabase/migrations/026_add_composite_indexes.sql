-- Migration: Add composite indexes for performance optimization
-- This fixes bug #7: Missing indexes on frequently queried columns
-- Created: 2025-10-27

-- ============================================================================
-- MESSAGES TABLE - Composite index for pagination
-- ============================================================================
-- Query pattern: Get messages for conversation, ordered by date
-- Used in: lib/hooks/use-messages.ts loadMessages()
CREATE INDEX IF NOT EXISTS idx_messages_conversation_time
  ON public.messages(conversation_id, created_at DESC);

COMMENT ON INDEX idx_messages_conversation_time IS
  'Optimizes message pagination queries by conversation';

-- ============================================================================
-- NOTIFICATIONS TABLE - Composite index for unread notifications
-- ============================================================================
-- Query pattern: Get unread notifications for user, ordered by date
-- Used in: lib/hooks/use-notifications.ts, components/NotificationsDropdown.tsx
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
  ON public.notifications(user_id, read, created_at DESC)
  WHERE read = FALSE;

COMMENT ON INDEX idx_notifications_user_unread IS
  'Optimizes unread notifications queries with partial index';

-- Alternative full index (if above doesn't cover all use cases)
CREATE INDEX IF NOT EXISTS idx_notifications_user_read_time
  ON public.notifications(user_id, read, created_at DESC);

COMMENT ON INDEX idx_notifications_user_read_time IS
  'Full index for all notification queries by user';

-- ============================================================================
-- APPLICATIONS TABLE - Composite index for property applications
-- ============================================================================
-- Query pattern: Get applications for property by status, ordered by date
-- Used in: app/dashboard/owner/applications/page.tsx
CREATE INDEX IF NOT EXISTS idx_applications_property_status_time
  ON public.applications(property_id, status, created_at DESC);

COMMENT ON INDEX idx_applications_property_status_time IS
  'Optimizes property application filtering and sorting';

-- Additional index for applicant view
CREATE INDEX IF NOT EXISTS idx_applications_applicant_status_time
  ON public.applications(applicant_id, status, created_at DESC);

COMMENT ON INDEX idx_applications_applicant_status_time IS
  'Optimizes applicant application history queries';

-- ============================================================================
-- PROPERTIES TABLE - Composite index for property search
-- ============================================================================
-- Query pattern: Search available properties by city and price
-- Used in: app/properties/browse/page.tsx
CREATE INDEX IF NOT EXISTS idx_properties_search
  ON public.properties(city, monthly_rent, is_available)
  WHERE status = 'published';

COMMENT ON INDEX idx_properties_search IS
  'Optimizes property search with partial index on published properties';

-- Additional index for owner properties
CREATE INDEX IF NOT EXISTS idx_properties_owner_status
  ON public.properties(owner_id, status, created_at DESC);

COMMENT ON INDEX idx_properties_owner_status IS
  'Optimizes owner property management queries';

-- ============================================================================
-- USER_PROFILES TABLE - Composite index for matching algorithm
-- ============================================================================
-- Query pattern: Find users for matching by type, city, and budget
-- Used in: Future matching algorithm
CREATE INDEX IF NOT EXISTS idx_user_profiles_matching
  ON public.user_profiles(user_type, current_city, budget_min, budget_max)
  WHERE profile_completion_score > 50;

COMMENT ON INDEX idx_user_profiles_matching IS
  'Optimizes user matching queries with partial index on complete profiles';

-- ============================================================================
-- CONVERSATIONS TABLE - Index for user conversations
-- ============================================================================
-- Query pattern: Get all conversations for a user, ordered by last activity
-- Used in: lib/hooks/use-messages.ts loadConversations()
CREATE INDEX IF NOT EXISTS idx_conversations_participant1_updated
  ON public.conversations(participant1_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_conversations_participant2_updated
  ON public.conversations(participant2_id, updated_at DESC);

COMMENT ON INDEX idx_conversations_participant1_updated IS
  'Optimizes conversation list queries for participant1';

COMMENT ON INDEX idx_conversations_participant2_updated IS
  'Optimizes conversation list queries for participant2';

-- ============================================================================
-- GROUPS TABLE - Index for active groups
-- ============================================================================
-- Query pattern: Find active groups by city
CREATE INDEX IF NOT EXISTS idx_groups_city_active
  ON public.groups(preferred_city, is_active, created_at DESC)
  WHERE is_active = true;

COMMENT ON INDEX idx_groups_city_active IS
  'Optimizes active group search by city';

-- ============================================================================
-- GROUP_MEMBERS TABLE - Index for group membership
-- ============================================================================
-- Query pattern: Get all members of a group
CREATE INDEX IF NOT EXISTS idx_group_members_group_status
  ON public.group_members(group_id, status, joined_at DESC);

COMMENT ON INDEX idx_group_members_group_status IS
  'Optimizes group member list queries';

-- Index for user's groups
CREATE INDEX IF NOT EXISTS idx_group_members_user_status
  ON public.group_members(user_id, status, joined_at DESC);

COMMENT ON INDEX idx_group_members_user_status IS
  'Optimizes user group membership queries';

-- ============================================================================
-- ANALYSIS AND RECOMMENDATIONS
-- ============================================================================

-- After creating these indexes, run ANALYZE to update statistics
ANALYZE public.messages;
ANALYZE public.notifications;
ANALYZE public.applications;
ANALYZE public.properties;
ANALYZE public.user_profiles;
ANALYZE public.conversations;
ANALYZE public.groups;
ANALYZE public.group_members;

-- Check index usage with this query:
-- SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
-- FROM pg_stat_user_indexes
-- WHERE schemaname = 'public'
-- ORDER BY idx_scan DESC;
