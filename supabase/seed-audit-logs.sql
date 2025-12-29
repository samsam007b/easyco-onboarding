-- Seed Security Audit Logs for Dashboard Demo
-- Run this in Supabase SQL Editor to populate audit_logs table

-- Insert sample security audit logs
INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, metadata, created_at)
VALUES
  -- Recent login events
  (NULL, 'login_success', 'session', gen_random_uuid(),
   '{"ip": "192.168.1.100", "browser": "Chrome 120", "location": "Brussels, BE"}'::jsonb,
   NOW() - INTERVAL '5 minutes'),

  (NULL, 'login_success', 'session', gen_random_uuid(),
   '{"ip": "10.0.0.50", "browser": "Safari 17", "location": "Liege, BE"}'::jsonb,
   NOW() - INTERVAL '15 minutes'),

  (NULL, 'login_failed', 'session', NULL,
   '{"ip": "203.0.113.50", "reason": "invalid_password", "attempts": 3}'::jsonb,
   NOW() - INTERVAL '30 minutes'),

  -- Admin access events
  (NULL, 'admin_access', 'dashboard', 'security',
   '{"page": "/admin/dashboard/security", "role": "super_admin"}'::jsonb,
   NOW() - INTERVAL '1 hour'),

  (NULL, 'admin_permission_granted', 'user', gen_random_uuid(),
   '{"permission": "manage_properties", "granted_by": "super_admin"}'::jsonb,
   NOW() - INTERVAL '2 hours'),

  -- User management events
  (NULL, 'user_signup', 'user', gen_random_uuid(),
   '{"email": "nouveau@example.com", "user_type": "resident", "source": "organic"}'::jsonb,
   NOW() - INTERVAL '3 hours'),

  (NULL, 'user_verified', 'user', gen_random_uuid(),
   '{"verification_type": "email", "method": "link"}'::jsonb,
   NOW() - INTERVAL '4 hours'),

  -- Security events
  (NULL, 'security_alert_triggered', 'system', 'rate_limiter',
   '{"type": "rate_limit_exceeded", "endpoint": "/api/auth/login", "ip": "203.0.113.100"}'::jsonb,
   NOW() - INTERVAL '5 hours'),

  (NULL, 'password_reset_requested', 'user', gen_random_uuid(),
   '{"ip": "192.168.1.50", "email_sent": true}'::jsonb,
   NOW() - INTERVAL '6 hours'),

  (NULL, 'session_invalidated', 'session', gen_random_uuid(),
   '{"reason": "user_logout", "devices_affected": 1}'::jsonb,
   NOW() - INTERVAL '7 hours'),

  -- More login events
  (NULL, 'login_success', 'session', gen_random_uuid(),
   '{"ip": "172.16.0.10", "browser": "Firefox 121", "location": "Gand, BE"}'::jsonb,
   NOW() - INTERVAL '8 hours'),

  (NULL, 'login_success', 'session', gen_random_uuid(),
   '{"ip": "192.168.2.200", "browser": "Edge 120", "location": "Anvers, BE"}'::jsonb,
   NOW() - INTERVAL '10 hours'),

  -- Role changes
  (NULL, 'role_changed', 'user', gen_random_uuid(),
   '{"old_role": "resident", "new_role": "owner", "changed_by": "admin"}'::jsonb,
   NOW() - INTERVAL '12 hours'),

  -- Ban/Unban events
  (NULL, 'user_banned', 'user', gen_random_uuid(),
   '{"reason": "violation_terms", "duration": "permanent", "banned_by": "admin"}'::jsonb,
   NOW() - INTERVAL '1 day'),

  (NULL, 'user_unbanned', 'user', gen_random_uuid(),
   '{"reason": "appeal_approved", "unbanned_by": "super_admin"}'::jsonb,
   NOW() - INTERVAL '2 days'),

  -- Data access events
  (NULL, 'admin_data_export', 'report', 'users_export',
   '{"format": "csv", "records_count": 150, "exported_by": "admin"}'::jsonb,
   NOW() - INTERVAL '3 days'),

  -- Token events
  (NULL, 'token_refreshed', 'session', gen_random_uuid(),
   '{"token_type": "access", "ip": "192.168.1.100"}'::jsonb,
   NOW() - INTERVAL '4 days'),

  (NULL, 'token_revoked', 'session', gen_random_uuid(),
   '{"reason": "security_concern", "revoked_by": "system"}'::jsonb,
   NOW() - INTERVAL '5 days'),

  -- Delete events
  (NULL, 'user_delete_requested', 'user', gen_random_uuid(),
   '{"requested_by": "user", "scheduled_deletion": "2025-01-15"}'::jsonb,
   NOW() - INTERVAL '6 days'),

  (NULL, 'property_deleted', 'property', gen_random_uuid(),
   '{"deleted_by": "owner", "reason": "no_longer_available"}'::jsonb,
   NOW() - INTERVAL '7 days');

-- Verify insertion
SELECT
  action,
  resource_type,
  created_at,
  metadata
FROM public.audit_logs
ORDER BY created_at DESC
LIMIT 10;
