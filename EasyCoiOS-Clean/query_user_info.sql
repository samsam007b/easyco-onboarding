-- Query to get all user information for testiOS5@easyco.be

-- 1. Auth user (managed by Supabase)
SELECT
    id,
    email,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
FROM auth.users
WHERE email = 'testiOS5@easyco.be';

-- 2. Public users table (custom app data)
SELECT *
FROM public.users
WHERE email = 'testiOS5@easyco.be';

-- 3. User profiles table (custom profile data)
SELECT *
FROM public.user_profiles
WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'testiOS5@easyco.be'
);

-- 4. Combined view - all user data in one query
SELECT
    au.id as auth_user_id,
    au.email,
    au.created_at as auth_created_at,
    au.email_confirmed_at,
    pu.id as public_user_id,
    pu.user_type,
    pu.onboarding_completed,
    pu.full_name,
    pu.avatar_url,
    pu.created_at as user_created_at,
    up.id as profile_id,
    up.first_name,
    up.last_name,
    up.phone_number,
    up.profile_photo_url,
    up.date_of_birth
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
LEFT JOIN public.user_profiles up ON au.id = up.user_id
WHERE au.email = 'testiOS5@easyco.be';
