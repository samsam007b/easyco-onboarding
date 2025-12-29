import { createClient } from '@/lib/auth/supabase-server';
import { getAdminClient } from '@/lib/auth/supabase-admin';
import { redirect } from 'next/navigation';
import {
  Shield,
  Crown,
  User,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AddAdminForm from '@/components/admin/AddAdminForm';
import AdminsList from '@/components/admin/AdminsList';
import PendingInvitations from '@/components/admin/PendingInvitations';

async function checkSuperAdmin() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data: isSuperAdmin } = await supabase
    .rpc('is_super_admin', { user_email: user.email });

  if (!isSuperAdmin) {
    redirect('/admin/dashboard');
  }

  return user;
}

async function getAdmins() {
  // Use admin client to bypass RLS - user is already verified as super_admin
  const adminClient = getAdminClient();

  const { data: admins, error } = await adminClient
    .from('admins')
    .select(`
      id,
      email,
      role,
      user_id,
      created_at,
      updated_at
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching admins:', error);
    return [];
  }

  return admins || [];
}

export default async function AdminsManagementPage() {
  await checkSuperAdmin();
  const admins = await getAdmins();

  const superAdmins = admins.filter(a => a.role === 'super_admin');
  const regularAdmins = admins.filter(a => a.role === 'admin');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestion des administrateurs</h2>
          <p className="text-slate-400 mt-1">Gérez les accès au panneau d'administration</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total admins</p>
                <p className="text-2xl font-bold text-white mt-1">{admins.length}</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Shield className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Super admins</p>
                <p className="text-2xl font-bold text-white mt-1">{superAdmins.length}</p>
              </div>
              <div className="p-2 rounded-lg bg-orange-500/10">
                <Crown className="w-5 h-5 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Admins standards</p>
                <p className="text-2xl font-bold text-white mt-1">{regularAdmins.length}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <User className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Admin Form */}
      <AddAdminForm />

      {/* Pending Invitations */}
      <PendingInvitations />

      {/* Admins List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Liste des administrateurs</CardTitle>
          <CardDescription className="text-slate-400">
            Tous les utilisateurs ayant accès au panneau d'administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminsList admins={admins} />
        </CardContent>
      </Card>

      {/* Warning Card */}
      <Card className="bg-slate-800/50 border-orange-500/30 border">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-orange-500/10">
              <AlertCircle className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                Sécurité des accès admin
              </h3>
              <ul className="text-sm text-slate-400 space-y-2">
                <li>• Les super admins ont un accès complet à toutes les fonctionnalités</li>
                <li>• Les admins standards ont un accès en lecture seule sur certaines sections</li>
                <li>• Toutes les actions sont enregistrées dans les logs d'audit</li>
                <li>• Il est recommandé de limiter le nombre de super admins</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
