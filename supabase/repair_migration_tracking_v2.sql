-- ============================================================================
-- MIGRATION TRACKING REPAIR SCRIPT V2
-- ============================================================================
-- This script marks all local migrations as "applied" in the remote database
-- WITHOUT actually running them (since tables already exist).
--
-- Uses ON CONFLICT (version) since that's the PRIMARY KEY
-- ============================================================================

-- Insert all missing migration versions into schema_migrations table
-- Using DO blocks to handle duplicates gracefully
DO $$
BEGIN
  -- Insert each migration only if version doesn't exist
  INSERT INTO supabase_migrations.schema_migrations (version, name, statements)
  SELECT '001', 'enhanced_user_profiles', ARRAY['-- Already applied in production']
  WHERE NOT EXISTS (SELECT 1 FROM supabase_migrations.schema_migrations WHERE version = '001');

  INSERT INTO supabase_migrations.schema_migrations (version, name, statements)
  SELECT '002', 'complete_schema_phase1', ARRAY['-- Already applied in production']
  WHERE NOT EXISTS (SELECT 1 FROM supabase_migrations.schema_migrations WHERE version = '002');

  INSERT INTO supabase_migrations.schema_migrations (version, name, statements)
  SELECT '003', 'add_enhance_profile_columns', ARRAY['-- Already applied in production']
  WHERE NOT EXISTS (SELECT 1 FROM supabase_migrations.schema_migrations WHERE version = '003');

  -- Continue for all versions...
  -- (This is a safer approach but verbose)

  RAISE NOTICE 'Migration tracking repair in progress...';
END $$;

-- Alternative: Use UPSERT with proper conflict handling
INSERT INTO supabase_migrations.schema_migrations (version, name, statements)
VALUES
  ('001', 'enhanced_user_profiles', ARRAY['-- Already applied in production']),
  ('002', 'complete_schema_phase1', ARRAY['-- Already applied in production']),
  ('003', 'add_enhance_profile_columns', ARRAY['-- Already applied in production']),
  ('004', 'add_additional_profile_columns', ARRAY['-- Already applied in production']),
  ('005', 'add_owner_enhanced_profile_columns', ARRAY['-- Already applied in production']),
  ('006', 'add_property_info_columns', ARRAY['-- Already applied in production']),
  ('007', 'add_missing_owner_columns', ARRAY['-- Already applied in production']),
  ('008', 'add_all_missing_owner_columns', ARRAY['-- Already applied in production']),
  ('009', 'add_resident_columns', ARRAY['-- Already applied in production']),
  ('010', 'add_dependent_profiles', ARRAY['-- Already applied in production']),
  ('011', 'create_hub_tables', ARRAY['-- Already applied in production']),
  ('012', 'create_favorites_table', ARRAY['-- Already applied in production']),
  ('013', 'create_messaging_system', ARRAY['-- Already applied in production']),
  ('014', 'create_notifications_table', ARRAY['-- Already applied in production']),
  ('015', 'add_image_columns', ARRAY['-- Already applied in production']),
  ('016', 'create_applications_table', ARRAY['-- Already applied in production']),
  ('017', 'create_groups_tables', ARRAY['-- Already applied in production']),
  ('018', 'create_audit_logs', ARRAY['-- Already applied in production']),
  ('019', 'add_missing_rls_policies', ARRAY['-- Already applied in production']),
  ('020', 'create_admins_table', ARRAY['-- Already applied in production']),
  ('021', 'create_login_attempts', ARRAY['-- Already applied in production']),
  ('024', 'add_full_name_to_users', ARRAY['-- Already applied in production']),
  ('025', 'fix_notifications_rls_policy', ARRAY['-- Already applied in production']),
  ('026', 'add_composite_indexes', ARRAY['-- Already applied in production']),
  ('027', 'enhance_messaging_system', ARRAY['-- Already applied in production']),
  ('028', 'create_matching_system', ARRAY['-- Already applied in production']),
  ('029', 'fix_cors_and_rls_notifications', ARRAY['-- Already applied in production']),
  ('030', 'create_properties_table', ARRAY['-- Already applied in production']),
  ('031', 'create_property_images_storage', ARRAY['-- Already applied in production']),
  ('032', 'create_property_members_table', ARRAY['-- Already applied in production']),
  ('033', 'create_user_matching_tables', ARRAY['-- Already applied in production']),
  ('034', 'fix_platform_metrics_security', ARRAY['-- Already applied in production']),
  ('035', 'create_messaging_system', ARRAY['-- Already applied in production']),
  ('036', 'add_performance_indexes', ARRAY['-- Already applied in production']),
  ('040', 'create_reviews_system', ARRAY['-- Already applied in production']),
  ('041', 'create_saved_searches', ARRAY['-- Already applied in production']),
  ('042', 'update_notifications_system', ARRAY['-- Already applied in production']),
  ('066', 'fix_expenses_schema', ARRAY['-- Already applied in production']),
  ('067', 'create_calculate_profile_completion', ARRAY['-- Already applied in production']),
  ('068', 'add_paid_by_to_expenses', ARRAY['-- Already applied in production']),
  ('069', 'add_amount_owed_to_expense_splits', ARRAY['-- Already applied in production']),
  ('070', 'add_conversation_types', ARRAY['-- Already applied in production']),
  ('071', 'add_admin_baudonsamuel', ARRAY['-- Already applied in production']),
  ('072', 'add_admin_sam7777jones', ARRAY['-- Already applied in production']),
  ('073', 'add_admin_2fa', ARRAY['-- Already applied in production']),
  ('080', 'enhanced_finances_system', ARRAY['-- Already applied in production']),
  ('081', 'enhanced_tasks_system', ARRAY['-- Already applied in production']),
  ('082', 'document_vault_system', ARRAY['-- Already applied in production']),
  ('083', 'house_rules_voting_system', ARRAY['-- Already applied in production']),
  ('089', 'add_subscriptions', ARRAY['-- Already applied in production']),
  ('090', 'add_super_admins', ARRAY['-- Already applied in production']),
  ('091', 'add_stripe_fields', ARRAY['-- Already applied in production']),
  ('100', 'create_app_settings', ARRAY['-- Already applied in production']),
  ('101', 'create_notification_logs', ARRAY['-- Already applied in production']),
  ('102', 'fix_security_rls_policies', ARRAY['-- Already applied in production']),
  ('103', 'fix_get_subscription_status', ARRAY['-- Already applied in production']),
  ('110', 'add_referral_system', ARRAY['-- Already applied in production']),
  ('111', 'create_assistant_conversations', ARRAY['-- Already applied in production']),
  ('112', 'admin_invitations', ARRAY['-- Already applied in production']),
  ('113', 'fix_admin_user_id_linking', ARRAY['-- Already applied in production']),
  ('114', 'bank_info_security', ARRAY['-- Already applied in production']),
  ('115', 'create_vendor_rating_system', ARRAY['-- Already applied in production']),
  ('116', 'security_alerts', ARRAY['-- Already applied in production']),
  ('117', 'bank_info_2fa', ARRAY['-- Already applied in production']),
  ('120', 'add_phone_itsme_verification', ARRAY['-- Already applied in production']),
  ('121', 'security_fix_bcrypt_admin_pins', ARRAY['-- Already applied in production']),
  ('122', 'security_fix_password_verification', ARRAY['-- Already applied in production']),
  ('123', 'security_fix_clear_plaintext_iban', ARRAY['-- Already applied in production']),
  ('20241102', 'create_favorites_system', ARRAY['-- Already applied in production']),
  ('20250102', 'security_notifications_trigger', ARRAY['-- Already applied in production']),
  ('20250103', 'create_user_matching_profiles', ARRAY['-- Already applied in production']),
  ('20250104', 'property_rooms_system', ARRAY['-- Already applied in production']),
  ('20250107', 'enhanced_room_aesthetics', ARRAY['-- Already applied in production']),
  ('20250114', 'add_property_member_roles', ARRAY['-- Already applied in production']),
  ('20251117', 'create_clean_profile_structure', ARRAY['-- Already applied in production']),
  ('20251229', 'agent_analytics', ARRAY['-- Already applied in production']),
  ('20251230', 'create_design_screenshots_storage', ARRAY['-- Already applied in production']),
  ('20260118', 'notifications_system', ARRAY['-- Already applied in production'])
ON CONFLICT (version) DO NOTHING;

-- Verification query
SELECT COUNT(*) as total_tracked_migrations
FROM supabase_migrations.schema_migrations;
