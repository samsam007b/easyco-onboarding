-- ============================================================================
-- CODE SQL POUR CRÉER UN COMPTE ADMIN - À COPIER DANS SUPABASE
-- ============================================================================

-- Étape 1: Créer la table admins
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now()
);

-- Étape 2: Créer les index
CREATE INDEX IF NOT EXISTS idx_admins_user_id ON public.admins(user_id);
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON public.admins(role);

-- Étape 3: Activer RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Étape 4: Créer les politiques RLS
DROP POLICY IF EXISTS "Admins can read all admins" ON public.admins;
CREATE POLICY "Admins can read all admins"
  ON public.admins FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Super admins can insert admins" ON public.admins;
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

DROP POLICY IF EXISTS "Super admins can update admins" ON public.admins;
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

DROP POLICY IF EXISTS "Super admins can delete admins" ON public.admins;
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

-- Étape 5: Créer les fonctions utiles
CREATE OR REPLACE FUNCTION public.is_admin(user_email text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE email = user_email
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- Étape 6: Créer le trigger pour updated_at
CREATE OR REPLACE FUNCTION public.update_admins_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS admins_updated_at ON public.admins;
CREATE TRIGGER admins_updated_at
  BEFORE UPDATE ON public.admins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_admins_updated_at();

-- ============================================================================
-- ÉTAPE FINALE: AJOUTER VOTRE COMPTE ADMIN
-- ============================================================================
-- IMPORTANT: Remplacez 'VOTRE_EMAIL@exemple.com' par votre vraie adresse email
-- L'utilisateur avec cet email DOIT DÉJÀ EXISTER dans auth.users
-- (vous devez d'abord vous inscrire sur le site avec cet email)

INSERT INTO public.admins (user_id, email, role)
SELECT
  id,
  email,
  'super_admin'
FROM auth.users
WHERE email = 'VOTRE_EMAIL@exemple.com'  -- ⚠️ CHANGEZ CETTE LIGNE
ON CONFLICT (email) DO UPDATE
SET role = 'super_admin', updated_at = now();

-- ============================================================================
-- VÉRIFICATION
-- ============================================================================
-- Exécutez cette requête pour vérifier que votre compte admin est créé:
SELECT * FROM public.admins;

-- ============================================================================
-- ALTERNATIVE: Si vous connaissez déjà votre UUID utilisateur
-- ============================================================================
-- Si vous connaissez votre user_id (UUID), vous pouvez aussi l'insérer directement:
-- INSERT INTO public.admins (user_id, email, role)
-- VALUES (
--   'VOTRE-UUID-ICI',
--   'votre-email@exemple.com',
--   'super_admin'
-- )
-- ON CONFLICT (email) DO UPDATE
-- SET role = 'super_admin', updated_at = now();
