import { redirect } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-server';
import { ROUTES } from '@/lib/config/routes';
import DashboardClient from './_components/DashboardClient';
import Link from 'next/link';

// Email autorisé pour l'accès admin
const ADMIN_EMAIL = 'baudonsamuel@gmail.com';

async function checkAdminAccess() {
  const supabase = await createClient();

  // Vérifier l'authentification
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login?redirect=/admin/dashboard');
  }

  // Vérifier si l'email correspond à l'admin autorisé
  if (user.email !== ADMIN_EMAIL) {
    return { error: 'not_authorized', user };
  }

  return { user };
}

export default async function AdminDashboardPage() {
  // Vérifier l'accès admin AVANT de charger le composant client
  const result = await checkAdminAccess();

  if ('error' in result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Accès Refusé</h1>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas les droits pour accéder au tableau de bord admin.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-700">
                Connecté en tant que: <br/>
                <code className="bg-gray-100 px-2 py-1 rounded mt-2 inline-block">{result.user.email}</code>
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Link
                href={ROUTES.HOME}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <DashboardClient />;
}
