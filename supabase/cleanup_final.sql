-- Cleanup final : supprimer la migration de test du tracking
DELETE FROM supabase_migrations.schema_migrations
WHERE version = '20260118135414';

-- Vérifier le count final (devrait être 80)
SELECT COUNT(*) as total_migrations FROM supabase_migrations.schema_migrations;

-- Vérifier les dernières migrations
SELECT version, name
FROM supabase_migrations.schema_migrations
ORDER BY version DESC
LIMIT 5;
