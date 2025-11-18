import { redirect } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-server';
import { getDashboardRoute } from '@/lib/config/routes';

/**
 * Root dashboard page that redirects to role-specific dashboard
 * This prevents 404 errors when users access /dashboard directly
 */
export default async function DashboardPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    // Redirect to login if not authenticated
    redirect('/login?redirect=/dashboard');
  }

  // Get user's role from the database
  const { data: userData, error: dbError } = await supabase
    .from('users')
    .select('user_type, onboarding_completed')
    .eq('id', user.id)
    .single();

  if (dbError || !userData) {
    // If we can't get user data, redirect to welcome page
    redirect('/welcome');
  }

  // If user hasn't selected a role yet, redirect to welcome
  if (!userData.user_type) {
    redirect('/welcome');
  }

  // If user hasn't completed onboarding, redirect to onboarding
  if (!userData.onboarding_completed) {
    redirect(`/onboarding/${userData.user_type}/basic-info`);
  }

  // Redirect to the appropriate role-specific dashboard
  const dashboardRoute = getDashboardRoute(userData.user_type as 'searcher' | 'owner' | 'resident');
  redirect(dashboardRoute);
}
