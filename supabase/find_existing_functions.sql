-- Run this first to see all existing send_message functions
SELECT
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN ('send_message', 'get_or_create_conversation', 'get_user_conversations', 'mark_conversation_read');
