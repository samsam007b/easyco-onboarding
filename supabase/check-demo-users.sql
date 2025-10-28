-- Check if demo users exist in auth.users
SELECT id, email, created_at
FROM auth.users
WHERE email LIKE '%@demo.easyco.com'
ORDER BY email;

-- Count them
SELECT COUNT(*) as total_demo_users
FROM auth.users
WHERE email LIKE '%@demo.easyco.com';
