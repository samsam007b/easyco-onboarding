# Guide de Configuration de l'Accès Admin

## Le Problème

Les pages admin ne fonctionnaient pas car la page `/admin/dashboard` cherchait les colonnes `is_admin` et `role` dans la table `user_profiles`, alors que le système admin utilise une table `admins` séparée avec des fonctions RPC.

## La Solution

J'ai corrigé la page dashboard pour utiliser la fonction RPC `is_admin()` comme la page admin principale.

## Étapes de Configuration

### 1. Vérifier que vous avez un compte utilisateur

Avant de pouvoir devenir admin, vous devez d'abord avoir un compte utilisateur dans l'application.

1. Allez sur votre site EasyCo
2. Inscrivez-vous avec votre email (par exemple `samuel@easyco.be`)
3. Vérifiez votre email si nécessaire
4. Connectez-vous au moins une fois

### 2. Exécuter le script SQL dans Supabase

1. Ouvrez votre projet Supabase: https://supabase.com/dashboard
2. Allez dans **SQL Editor** (dans le menu de gauche)
3. Cliquez sur **New Query**
4. Copiez le contenu du fichier `supabase/SETUP_ADMIN_COMPLETE.sql`
5. **IMPORTANT**: Modifiez l'email dans le script:
   ```sql
   WHERE email = 'samuel@easyco.be'  -- Remplacez par votre vrai email
   ```
6. Cliquez sur **Run** pour exécuter le script

### 3. Vérifier que tout fonctionne

Toujours dans le SQL Editor de Supabase, exécutez ces requêtes de vérification:

```sql
-- 1. Vérifier que la table admins existe et contient vos données
SELECT * FROM public.admins;

-- 2. Tester la fonction is_admin avec votre email
SELECT public.is_admin('samuel@easyco.be');  -- Doit retourner true

-- 3. Tester la fonction is_super_admin
SELECT public.is_super_admin('samuel@easyco.be');  -- Doit retourner true
```

### 4. Tester l'accès aux pages admin

1. Connectez-vous à votre application avec l'email que vous avez configuré comme admin
2. Allez sur `/admin` - vous devriez voir la page de données admin
3. Allez sur `/admin/dashboard` - vous devriez voir le tableau de bord admin

## Pages Admin Disponibles

- **`/admin`**: Page de visualisation des données (utilisateurs, propriétés, groupes, etc.)
  - Affiche les données des tables principales
  - Permet d'exporter les données en CSV
  - Server-side (plus sécurisé)

- **`/admin/dashboard`**: Tableau de bord avec métriques et analytics
  - Métriques en temps réel
  - Statistiques de la base de données
  - Santé du système
  - Core Web Vitals
  - Client-side avec auto-refresh toutes les 30 secondes

## Ajouter d'Autres Administrateurs

Pour ajouter d'autres administrateurs, exécutez dans Supabase:

```sql
-- Admin avec accès lecture seule
INSERT INTO public.admins (user_id, email, role)
SELECT id, email, 'admin'
FROM auth.users
WHERE email = 'nouvel-admin@exemple.com'
ON CONFLICT (email) DO UPDATE
SET role = 'admin', updated_at = now();

-- Super admin avec tous les droits
INSERT INTO public.admins (user_id, email, role)
SELECT id, email, 'super_admin'
FROM auth.users
WHERE email = 'super-admin@exemple.com'
ON CONFLICT (email) DO UPDATE
SET role = 'super_admin', updated_at = now();
```

## Différences entre Admin et Super Admin

- **admin**: Peut lire les données admin, mais ne peut pas modifier la liste des admins
- **super_admin**: Peut tout faire, y compris ajouter/supprimer d'autres admins

## Sécurité

Le système admin est sécurisé par:

1. **RLS (Row Level Security)**: Activé sur la table `admins`
2. **Fonctions SECURITY DEFINER**: Les fonctions `is_admin()` et `is_super_admin()` s'exécutent avec des privilèges élevés mais de manière sécurisée
3. **Vérification côté serveur**: La page `/admin/page.tsx` vérifie l'accès côté serveur avant de charger les données
4. **Vérification côté client**: La page dashboard vérifie aussi l'accès et redirige les non-admins

## Dépannage

### Erreur: "function is_admin does not exist"

La fonction RPC n'a pas été créée. Exécutez le script `SETUP_ADMIN_COMPLETE.sql`.

### Je suis redirigé vers la page d'accueil

1. Vérifiez que votre email est bien dans la table `admins`:
   ```sql
   SELECT * FROM public.admins WHERE email = 'votre-email@exemple.com';
   ```

2. Vérifiez que vous êtes connecté avec le bon compte

3. Vérifiez la console du navigateur pour voir les erreurs

### La page /admin affiche "No data"

C'est normal si vous n'avez pas encore de données dans les tables. Les tableaux afficheront "No data" jusqu'à ce que vous ayez des utilisateurs, propriétés, etc.

### Erreur de permissions dans Supabase

Si vous avez une erreur lors de l'exécution du script SQL, assurez-vous que:
1. Vous êtes bien connecté à votre projet Supabase
2. Vous utilisez le bon projet (vérifiez l'URL)
3. Vous avez les droits d'administrateur du projet Supabase

## Prochaines Étapes

Une fois l'accès admin configuré, vous pouvez:

1. Personnaliser les métriques du dashboard
2. Ajouter des graphiques et visualisations
3. Intégrer Google Analytics pour les métriques temps réel
4. Ajouter des fonctionnalités d'administration supplémentaires
