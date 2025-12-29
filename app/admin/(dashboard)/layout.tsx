import { redirect } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-server';
import { logger } from '@/lib/utils/logger';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

async function checkAdminAccess() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/admin/login');
  }

  const { data: isAdmin, error: adminError } = await supabase
    .rpc('is_admin', { user_email: user.email });

  if (adminError) {
    logger.error('Admin check failed', adminError);
    redirect('/admin/login');
  }

  if (!isAdmin) {
    redirect('/admin/login');
  }

  // Get admin role
  const { data: adminRole } = await supabase
    .rpc('get_admin_role', { user_email: user.email });

  return {
    user,
    role: adminRole || 'admin',
  };
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role } = await checkAdminAccess();

  return (
    <>
      {/* Prevent white flash on scroll bounce (macOS/iOS) */}
      <style>{`html, body { background-color: #0f172a !important; }`}</style>
      <div className="min-h-screen bg-slate-900">
        <AdminSidebar userEmail={user.email || ''} userRole={role} />
        <div className="lg:pl-72">
          <AdminHeader userEmail={user.email || ''} userRole={role} />
          <main className="p-6 pb-24">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
