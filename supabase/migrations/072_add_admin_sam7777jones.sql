-- Add sam7777jones@gmail.com as super_admin
INSERT INTO public.admins (email, role)
VALUES ('sam7777jones@gmail.com', 'super_admin')
ON CONFLICT (email) DO UPDATE SET role = 'super_admin';

-- Link to user if they exist in auth.users
UPDATE public.admins
SET user_id = (SELECT id FROM auth.users WHERE email = 'sam7777jones@gmail.com')
WHERE email = 'sam7777jones@gmail.com'
AND EXISTS (SELECT 1 FROM auth.users WHERE email = 'sam7777jones@gmail.com');
