-- ============================================================================
-- FINAL MIGRATION TRACKING REPAIR - Complete Sync
-- ============================================================================
-- This script ensures remote tracking matches EXACTLY the 81 local files

-- Step 1: Delete ALL existing migration tracking
DELETE FROM supabase_migrations.schema_migrations;

-- Step 2: Re-insert all 81 migrations that exist locally
INSERT INTO supabase_migrations.schema_migrations (version, name, statements)
VALUES
  ('000', 'fix_function_conflicts', ARRAY['-- Already applied']),
  ('001', 'enhanced_user_profiles', ARRAY['-- Already applied']),
  ('002', 'complete_schema_phase1', ARRAY['-- Already applied']),
  ('003', 'add_enhance_profile_columns', ARRAY['-- Already applied']),
  ('004', 'add_additional_profile_columns', ARRAY['-- Already applied']),
  ('005', 'add_owner_enhanced_profile_columns', ARRAY['-- Already applied']),
  ('006', 'add_property_info_columns', ARRAY['-- Already applied']),
  ('007', 'add_missing_owner_columns', ARRAY['-- Already applied']),
  ('008', 'add_all_missing_owner_columns', ARRAY['-- Already applied']),
  ('009', 'add_resident_columns', ARRAY['-- Already applied']),
  ('010', 'add_dependent_profiles', ARRAY['-- Already applied']),
  ('011', 'create_hub_tables', ARRAY['-- Already applied']),
  ('012', 'create_resident_matching', ARRAY['-- Already applied']),
  ('013', 'create_messaging_system_fixed', ARRAY['-- Already applied']),
  ('014', 'create_notifications_table', ARRAY['-- Already applied']),
  ('015', 'add_image_columns', ARRAY['-- Already applied']),
  ('016', 'create_applications_table', ARRAY['-- Already applied']),
  ('017', 'create_groups_tables', ARRAY['-- Already applied']),
  ('018', 'create_audit_logs_clean', ARRAY['-- Already applied']),
  ('019', 'add_rls_policies_clean', ARRAY['-- Already applied']),
  ('020', 'create_admins_table', ARRAY['-- Already applied']),
  ('021', 'create_login_attempts', ARRAY['-- Already applied']),
  ('024', 'add_full_name_to_users', ARRAY['-- Already applied']),
  ('025', 'fix_notifications_rls_policy', ARRAY['-- Already applied']),
  ('026', 'add_composite_indexes', ARRAY['-- Already applied']),
  ('027', 'enhance_messaging_system', ARRAY['-- Already applied']),
  ('028', 'create_matching_system', ARRAY['-- Already applied']),
  ('029', 'fix_cors_and_rls_notifications', ARRAY['-- Already applied']),
  ('030', 'create_properties_table', ARRAY['-- Already applied']),
  ('031', 'create_property_images_storage', ARRAY['-- Already applied']),
  ('032', 'create_property_members_table', ARRAY['-- Already applied']),
  ('033', 'create_user_matching_tables', ARRAY['-- Already applied']),
  ('034', 'fix_platform_metrics_security', ARRAY['-- Already applied']),
  ('035', 'fix_complete_user_profiles_security', ARRAY['-- Already applied']),
  ('036', 'add_performance_indexes_safe', ARRAY['-- Already applied']),
  ('040', 'create_reviews_system', ARRAY['-- Already applied']),
  ('041', 'setup_storage_buckets', ARRAY['-- Already applied']),
  ('042', 'update_notifications_system', ARRAY['-- Already applied']),
  ('066', 'fix_expenses_schema', ARRAY['-- Already applied']),
  ('067', 'create_calculate_profile_completion', ARRAY['-- Already applied']),
  ('068', 'add_paid_by_to_expenses', ARRAY['-- Already applied']),
  ('069', 'fix_calendar_events_schema', ARRAY['-- Already applied']),
  ('070', 'add_conversation_types', ARRAY['-- Already applied']),
  ('071', 'add_admin_baudonsamuel', ARRAY['-- Already applied']),
  ('072', 'create_design_choices_table', ARRAY['-- Already applied']),
  ('073', 'add_admin_2fa', ARRAY['-- Already applied']),
  ('080', 'enhanced_finances_system', ARRAY['-- Already applied']),
  ('081', 'enhanced_tasks_system', ARRAY['-- Already applied']),
  ('082', 'document_vault_system', ARRAY['-- Already applied']),
  ('083', 'house_rules_voting_system', ARRAY['-- Already applied']),
  ('089', 'add_subscriptions', ARRAY['-- Already applied']),
  ('090', 'add_super_admins', ARRAY['-- Already applied']),
  ('091', 'add_stripe_fields', ARRAY['-- Already applied']),
  ('100', 'create_app_settings', ARRAY['-- Already applied']),
  ('101', 'create_notification_logs', ARRAY['-- Already applied']),
  ('102', 'fix_security_rls_policies', ARRAY['-- Already applied']),
  ('103', 'fix_get_subscription_status', ARRAY['-- Already applied']),
  ('110', 'add_referral_system', ARRAY['-- Already applied']),
  ('111', 'create_assistant_conversations', ARRAY['-- Already applied']),
  ('112', 'admin_invitations', ARRAY['-- Already applied']),
  ('113', 'user_bank_info', ARRAY['-- Already applied']),
  ('114', 'bank_info_security', ARRAY['-- Already applied']),
  ('115', 'create_vendor_rating_system', ARRAY['-- Already applied']),
  ('116', 'security_alerts', ARRAY['-- Already applied']),
  ('117', 'bank_info_2fa', ARRAY['-- Already applied']),
  ('120', 'create_events_system', ARRAY['-- Already applied']),
  ('121', 'security_fix_bcrypt_admin_pins', ARRAY['-- Already applied']),
  ('122', 'security_fix_password_verification', ARRAY['-- Already applied']),
  ('123', 'security_fix_clear_plaintext_iban', ARRAY['-- Already applied']),
  ('20241102', 'create_payment_system', ARRAY['-- Already applied']),
  ('20250102', 'security_notifications_trigger', ARRAY['-- Already applied']),
  ('20250103', 'enhanced_saved_searches', ARRAY['-- Already applied']),
  ('20250104', 'property_rooms_system', ARRAY['-- Already applied']),
  ('20250107', 'enhanced_room_aesthetics', ARRAY['-- Already applied']),
  ('20250114', 'create_resident_property_function', ARRAY['-- Already applied']),
  ('20251117', 'create_clean_profile_structure', ARRAY['-- Already applied']),
  ('20251229', 'security_monitoring_complete', ARRAY['-- Already applied']),
  ('20251230', 'performance_monitoring', ARRAY['-- Already applied']),
  ('20260118', 'notifications_system', ARRAY['-- Already applied']),
  ('20260118132945', 'test_auto_push', ARRAY['-- Test migration']),
  ('999', 'fix_user_profiles_rls', ARRAY['-- Already applied']);

-- Step 3: Verify count (should be exactly 81)
SELECT COUNT(*) as total_tracked_migrations
FROM supabase_migrations.schema_migrations;

-- Step 4: Show all tracked versions
SELECT version, name
FROM supabase_migrations.schema_migrations
ORDER BY version;
