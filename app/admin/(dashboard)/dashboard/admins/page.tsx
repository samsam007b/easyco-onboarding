import { createClient } from '@/lib/auth/supabase-server';
import { redirect } from 'next/navigation';
import {
  Shield,
  UserPlus,
  Crown,
  User,
  Calendar,
  Mail,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AddAdminForm from '@/components/admin/AddAdminForm';

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
  const supabase = await createClient();

  const { data: admins, error } = await supabase
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

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

      {/* Admins List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Liste des administrateurs</CardTitle>
          <CardDescription className="text-slate-400">
            Tous les utilisateurs ayant accès au panneau d'administration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Aucun administrateur trouvé</p>
            </div>
          ) : (
            <div className="space-y-3">
              {admins.map((admin) => (
                <div
                  key={admin.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      admin.role === 'super_admin'
                        ? 'bg-gradient-to-br from-orange-500 to-red-600'
                        : 'bg-purple-600'
                    }`}>
                      {admin.role === 'super_admin' ? (
                        <Crown className="w-5 h-5 text-white" />
                      ) : (
                        <Shield className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{admin.email}</p>
                        <Badge className={
                          admin.role === 'super_admin'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-purple-500/20 text-purple-400'
                        }>
                          {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </Badge>
                        {admin.user_id ? (
                          <Badge className="bg-green-500/20 text-green-400 text-xs">
                            Lié
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-500/20 text-slate-400 text-xs">
                            Non lié
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Ajouté le {formatDate(admin.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {admin.role !== 'super_admin' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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
