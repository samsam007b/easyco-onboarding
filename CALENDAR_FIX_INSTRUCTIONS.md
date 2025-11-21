# Instructions pour corriger le calendrier

## Problème identifié

Le calendrier ne fonctionne pas en production à cause de :
1. **Schéma incorrect** : La base de données utilise `start_date`/`end_date` mais le code utilise `start_time`/`end_time`
2. **Politiques RLS manquantes** : Pas de permissions UPDATE/DELETE pour les événements

## Solution

Une migration SQL a été créée pour corriger ces problèmes : `supabase/migrations/069_fix_calendar_events_schema.sql`

## Étapes pour appliquer la correction

### Option 1 : Via le Dashboard Supabase (Recommandé)

1. Connectez-vous à https://supabase.com/dashboard
2. Sélectionnez votre projet `easyco-onboarding`
3. Allez dans **SQL Editor**
4. Cliquez sur **New Query**
5. Copiez-collez le contenu du fichier `supabase/migrations/069_fix_calendar_events_schema.sql`
6. Cliquez sur **Run** pour exécuter la migration

### Option 2 : Via Supabase CLI (si installé)

```bash
cd ~/easyco-onboarding
supabase db push
```

## Vérification après migration

Une fois la migration appliquée, testez sur https://easyco-onboarding.vercel.app/hub/calendar :

✅ La page se charge sans erreurs
✅ Vous pouvez créer un événement
✅ Vous pouvez modifier un événement
✅ Vous pouvez supprimer un événement
✅ Les noms des participants s'affichent correctement

## En cas de problème

Si des erreurs persistent :
1. Vérifiez les logs de la console navigateur
2. Vérifiez les logs Supabase dans le Dashboard
3. Assurez-vous que votre utilisateur est bien membre d'une propriété via `property_members`
