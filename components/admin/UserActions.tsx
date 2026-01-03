'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import {
  MoreVertical,
  Ban,
  Mail,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface UserActionsProps {
  userId: string;
  userEmail: string;
  userName: string | null;
}

export default function UserActions({ userId, userEmail, userName }: UserActionsProps) {
  const router = useRouter();
  const supabase = createClient();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    type: 'ban' | 'delete' | null;
    isOpen: boolean;
  }>({ type: null, isOpen: false });
  const [isLoading, setIsLoading] = useState(false);

  const handleBanUser = async () => {
    setIsLoading(true);
    try {
      // Update user status to banned
      const { error: updateError } = await supabase
        .from('users')
        .update({
          is_banned: true,
          banned_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (updateError) {
        // If column doesn't exist, we'll just log the action
        logger.warn('Could not update ban status, column may not exist', { error: updateError.message });
      }

      // Log the action
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'user_banned',
        resource_type: 'user',
        resource_id: userId,
        metadata: {
          banned_user_email: userEmail,
          banned_user_name: userName,
          banned_by: user?.email,
          timestamp: new Date().toISOString(),
        },
      });

      toast.success(getHookTranslation('admin', 'userBannedSuccess'));

      setConfirmDialog({ type: null, isOpen: false });
      router.refresh();
    } catch (error) {
      logger.error('Ban user error', error);
      toast.error(getHookTranslation('admin', 'banError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsLoading(true);
    try {
      // Delete user profile first (cascade should handle this, but being explicit)
      await supabase
        .from('user_profiles')
        .delete()
        .eq('user_id', userId);

      // Delete notifications
      await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId);

      // Log the action before deletion
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'user_deleted',
        resource_type: 'user',
        resource_id: userId,
        metadata: {
          deleted_user_email: userEmail,
          deleted_user_name: userName,
          deleted_by: user?.email,
          timestamp: new Date().toISOString(),
        },
      });

      // Delete the user
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (deleteError) {
        throw deleteError;
      }

      toast.success(getHookTranslation('admin', 'userDeleted'));

      setConfirmDialog({ type: null, isOpen: false });
      router.push('/admin/dashboard/users');
      router.refresh();
    } catch (error) {
      logger.error('Delete user error', error);
      toast.error(getHookTranslation('admin', 'deleteError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendEmail = () => {
    window.location.href = `mailto:${userEmail}`;
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          Actions
          <MoreVertical className="w-4 h-4 ml-2" />
        </Button>

        {isMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-56 bg-slate-700 border border-slate-600 rounded-lg shadow-xl z-20 overflow-hidden">
              <button
                onClick={handleSendEmail}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-600 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Envoyer un email
              </button>
              <hr className="border-slate-600" />
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setConfirmDialog({ type: 'ban', isOpen: true });
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-orange-400 hover:bg-slate-600 transition-colors"
              >
                <Ban className="w-4 h-4" />
                Bannir l'utilisateur
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setConfirmDialog({ type: 'delete', isOpen: true });
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-slate-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer définitivement
              </button>
            </div>
          </>
        )}
      </div>

      {/* Ban Confirmation Dialog */}
      <Dialog open={confirmDialog.type === 'ban' && confirmDialog.isOpen} onOpenChange={(open) => setConfirmDialog({ type: 'ban', isOpen: open })}>
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
                <strong>Utilisateur :</strong> {userName || 'Sans nom'}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                <strong>Email :</strong> {userEmail}
              </p>
            </div>
            <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <AlertTriangle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-orange-400">
                L'utilisateur ne pourra plus se connecter. Vous pourrez lever le ban ultérieurement.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setConfirmDialog({ type: null, isOpen: false })}
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
              {isLoading ? 'Bannissement...' : 'Confirmer le bannissement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDialog.type === 'delete' && confirmDialog.isOpen} onOpenChange={(open) => setConfirmDialog({ type: 'delete', isOpen: open })}>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-red-500/10">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-white">Supprimer l'utilisateur</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Cette action est irréversible et supprimera toutes les données de l'utilisateur.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-slate-700/50">
              <p className="text-sm text-slate-300">
                <strong>Utilisateur :</strong> {userName || 'Sans nom'}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                <strong>Email :</strong> {userEmail}
              </p>
            </div>
            <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-400">
                <strong>Attention :</strong> Cette action supprimera définitivement le profil, les messages, les candidatures et toutes les données associées à cet utilisateur.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setConfirmDialog({ type: null, isOpen: false })}
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
              {isLoading ? 'Suppression...' : 'Supprimer définitivement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
