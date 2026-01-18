-- Create admins table
-- This table stores authorized admin users

CREATE TABLE IF NOT EXISTS public.admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON public.admins(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON public.admins(role);

-- Enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read the admins table
CREATE POLICY "Admins can read all admins"
  ON public.admins FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
    )
  );

-- Policy: Only super_admins can insert new admins
CREATE POLICY "Super admins can insert admins"
  ON public.admins FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Policy: Only super_admins can update admins
CREATE POLICY "Super admins can update admins"
  ON public.admins FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Policy: Only super_admins can delete admins
CREATE POLICY "Super admins can delete admins"
  ON public.admins FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
    )
  );

-- Function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE email = user_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if a user is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE email = user_email
    AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get admin role for a user
CREATE OR REPLACE FUNCTION public.get_admin_role(user_email text)
RETURNS text AS $$
DECLARE
  admin_role text;
BEGIN
  SELECT role INTO admin_role
  FROM public.admins
  WHERE email = user_email;

  RETURN admin_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_admins_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER admins_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_admins_updated_at();

-- Insert initial super admin (replace with your email)
-- NOTE: This will only work if a user with this email exists in auth.users
INSERT INTO public.admins (email, role, created_by)
SELECT
  'samuel@izzico.be',
  'super_admin',
  id
FROM auth.users
WHERE email = 'samuel@izzico.be'
ON CONFLICT (email) DO NOTHING;

-- Add comment
COMMENT ON TABLE public.admins IS 'Stores authorized admin users with their roles';
COMMENT ON COLUMN public.admins.role IS 'Admin role: admin (read-only) or super_admin (full access)';
