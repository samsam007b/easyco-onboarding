-- Add baudonsamuel@gmail.com as the only super_admin
-- First, clean any existing admins to ensure only this email has access
DELETE FROM public.admins WHERE email != 'baudonsamuel@gmail.com';

-- Insert the admin (or update if exists)
INSERT INTO public.admins (email, role)
VALUES ('baudonsamuel@gmail.com', 'super_admin')
ON CONFLICT (email) DO UPDATE SET role = 'super_admin';

-- Link to user if they exist in auth.users
UPDATE public.admins
SET user_id = (SELECT id FROM auth.users WHERE email = 'baudonsamuel@gmail.com')
WHERE email = 'baudonsamuel@gmail.com'
AND EXISTS (SELECT 1 FROM auth.users WHERE email = 'baudonsamuel@gmail.com');
