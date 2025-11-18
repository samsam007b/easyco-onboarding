import { redirect } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-server';
import { ROUTES } from '@/lib/config/routes';
import DashboardClient from './_components/DashboardClient';

async function checkAdminAccess() {
  const supabase = await createClient();

  // Vérifier l'authentification
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login?redirect=/admin/dashboard');
  }

  // Vérifier si l'utilisateur est admin via la fonction RPC
  const { data: isAdmin, error: adminError } = await supabase
    .rpc('is_admin', { user_email: user.email });

  if (adminError || !isAdmin) {
    redirect(ROUTES.HOME);
  }

  return user;
}

export default async function AdminDashboardPage() {
  // Vérifier l'accès admin AVANT de charger le composant client
  await checkAdminAccess();

  return <DashboardClient />;
}
