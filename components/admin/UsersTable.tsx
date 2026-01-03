'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import {
  MoreVertical,
  Ban,
  CheckCircle,
  Shield,
  Mail,
  Eye,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  user_type: string | null;
  onboarding_completed: boolean;
  created_at: string;
  user_profiles: {
    profile_photo: string | null;
    phone: string | null;
  }[] | null;
}

interface UsersTableProps {
  users: User[];
}

export default function UsersTable({ users }: UsersTableProps) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    type: 'ban' | 'delete' | null;
    userId: string | null;
    userName: string | null;
    userEmail: string | null;
  }>({ type: null, userId: null, userName: null, userEmail: null });
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getUserTypeColor = (type: string | null) => {
    switch (type) {
      case 'owner':
        return 'bg-purple-500/20 text-purple-400';
      case 'searcher':
        return 'bg-orange-500/20 text-orange-400';
      case 'resident':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getUserTypeLabel = (type: string | null) => {
    switch (type) {
      case 'owner':
        return 'Propriétaire';
      case 'searcher':
        return 'Chercheur';
      case 'resident':
        return 'Résident';
      default:
        return 'N/A';
    }
  };

  const handleBanUser = async () => {
    if (!confirmDialog.userId) return;
    setIsLoading(true);

    try {
      // Update user status
      await supabase
        .from('users')
        .update({ is_banned: true, banned_at: new Date().toISOString() })
        .eq('id', confirmDialog.userId);

      // Log the action
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'user_banned',
        resource_type: 'user',
        resource_id: confirmDialog.userId,
        metadata: {
          banned_user_email: confirmDialog.userEmail,
          banned_by: user?.email,
        },
      });

      toast.success(getHookTranslation('admin', 'userBannedSuccess'));
      setConfirmDialog({ type: null, userId: null, userName: null, userEmail: null });
      router.refresh();
    } catch (error) {
      logger.error('Ban user error', error);
      toast.error(getHookTranslation('admin', 'banError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!confirmDialog.userId) return;
    setIsLoading(true);

    try {
      // Log before deletion
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'user_deleted',
        resource_type: 'user',
        resource_id: confirmDialog.userId,
        metadata: {
          deleted_user_email: confirmDialog.userEmail,
          deleted_by: user?.email,
        },
      });

      // Delete user profile first
      await supabase.from('user_profiles').delete().eq('user_id', confirmDialog.userId);
      await supabase.from('notifications').delete().eq('user_id', confirmDialog.userId);

      // Delete user
      const { error } = await supabase.from('users').delete().eq('id', confirmDialog.userId);
      if (error) throw error;

      toast.success(getHookTranslation('admin', 'userDeleted'));
      setConfirmDialog({ type: null, userId: null, userName: null, userEmail: null });
      router.refresh();
    } catch (error) {
      logger.error('Delete user error', error);
      toast.error(getHookTranslation('admin', 'deleteError'));
    } finally {
      setIsLoading(false);
    }
  };

  const openConfirmDialog = (type: 'ban' | 'delete', user: User) => {
    setOpenMenu(null);
    setConfirmDialog({
      type,
      userId: user.id,
      userName: user.full_name,
      userEmail: user.email,
    });
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Aucun utilisateur trouvé</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700 text-left">
            <th className="pb-3 text-sm font-medium text-slate-400">Utilisateur</th>
            <th className="pb-3 text-sm font-medium text-slate-400">Type</th>
            <th className="pb-3 text-sm font-medium text-slate-400">Statut</th>
            <th className="pb-3 text-sm font-medium text-slate-400">Inscrit le</th>
            <th className="pb-3 text-sm font-medium text-slate-400 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const profile = user.user_profiles?.[0];
            return (
              <tr
                key={user.id}
                className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {profile?.profile_photo ? (
                        <img
                          src={profile.profile_photo}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-medium">
                          {user.full_name?.[0]?.toUpperCase() || user.email[0]?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {user.full_name || 'Sans nom'}
                      </p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span
                    className={`text-xs px-2 py-1 rounded ${getUserTypeColor(user.user_type)}`}
                  >
                    {getUserTypeLabel(user.user_type)}
                  </span>
                </td>
                <td className="py-4">
                  {user.onboarding_completed ? (
                    <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Actif
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
                      En cours
                    </Badge>
                  )}
                </td>
                <td className="py-4">
                  <span className="text-sm text-slate-300">{formatDate(user.created_at)}</span>
                </td>
                <td className="py-4 text-right relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpenMenu(openMenu === user.id ? null : user.id)}
                    className="text-slate-400 hover:text-white"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>

                  {openMenu === user.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenMenu(null)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-slate-700 border border-slate-600 rounded-lg shadow-lg z-20">
                        <Link
                          href={`/admin/dashboard/users/${user.id}`}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600 transition-colors"
                          onClick={() => setOpenMenu(null)}
                        >
                          <Eye className="w-4 h-4" />
                          Voir le profil
                        </Link>
                        <a
                          href={`mailto:${user.email}`}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600 transition-colors"
                          onClick={() => setOpenMenu(null)}
                        >
                          <Mail className="w-4 h-4" />
                          Envoyer un email
                        </a>
                        <hr className="border-slate-600 my-1" />
                        <button
                          onClick={() => openConfirmDialog('ban', user)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-orange-400 hover:bg-slate-600 transition-colors"
                        >
                          <Ban className="w-4 h-4" />
                          Bannir
                        </button>
                        <button
                          onClick={() => openConfirmDialog('delete', user)}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-slate-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Ban Confirmation Dialog */}
      <Dialog
        open={confirmDialog.type === 'ban'}
        onOpenChange={(open) => !open && setConfirmDialog({ type: null, userId: null, userName: null, userEmail: null })}
      >
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-orange-500/10">
                <Ban className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <DialogTitle className="text-white">Bannir l'utilisateur</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Cette action empêchera l'utilisateur d'accéder à la plateforme.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-slate-700/50">
              <p className="text-sm text-slate-300">
                <strong>Utilisateur :</strong> {confirmDialog.userName || 'Sans nom'}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                <strong>Email :</strong> {confirmDialog.userEmail}
              </p>
            </div>
            <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-orange-400">
                L'utilisateur ne pourra plus se connecter.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setConfirmDialog({ type: null, userId: null, userName: null, userEmail: null })}
              disabled={isLoading}
              className="text-slate-400"
            >
              Annuler
            </Button>
            <Button
              onClick={handleBanUser}
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isLoading ? 'Bannissement...' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDialog.type === 'delete'}
        onOpenChange={(open) => !open && setConfirmDialog({ type: null, userId: null, userName: null, userEmail: null })}
      >
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-red-500/10">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-white">Supprimer l'utilisateur</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Cette action est irréversible.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-slate-700/50">
              <p className="text-sm text-slate-300">
                <strong>Utilisateur :</strong> {confirmDialog.userName || 'Sans nom'}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                <strong>Email :</strong> {confirmDialog.userEmail}
              </p>
            </div>
            <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-400">
                Toutes les données de l'utilisateur seront supprimées définitivement.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setConfirmDialog({ type: null, userId: null, userName: null, userEmail: null })}
              disabled={isLoading}
              className="text-slate-400"
            >
              Annuler
            </Button>
            <Button
              onClick={handleDeleteUser}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
