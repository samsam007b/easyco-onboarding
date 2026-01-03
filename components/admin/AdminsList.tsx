'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import {
  Shield,
  Crown,
  Calendar,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

interface Admin {
  id: string;
  email: string;
  role: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

interface AdminsListProps {
  admins: Admin[];
}

export default function AdminsList({ admins }: AdminsListProps) {
  const router = useRouter();
  const supabase = createClient();

  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    adminId: string | null;
    adminEmail: string | null;
  }>({ isOpen: false, adminId: null, adminEmail: null });
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleDeleteAdmin = async () => {
    if (!confirmDelete.adminId) return;
    setIsLoading(true);

    try {
      // Log the action
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        action: 'admin_deleted',
        resource_type: 'admin',
        resource_id: confirmDelete.adminId,
        metadata: {
          deleted_admin_email: confirmDelete.adminEmail,
          deleted_by: user?.email,
          timestamp: new Date().toISOString(),
        },
      });

      // Delete the admin
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', confirmDelete.adminId);

      if (error) throw error;

      toast.success(getHookTranslation('admin', 'adminDeleted'));

      setConfirmDelete({ isOpen: false, adminId: null, adminEmail: null });
      router.refresh();
    } catch (error) {
      logger.error('Delete admin error', error);
      toast.error(getHookTranslation('admin', 'deleteError'));
    } finally {
      setIsLoading(false);
    }
  };

  if (admins.length === 0) {
    return (
      <div className="text-center py-12">
        <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p className="text-slate-400">Aucun administrateur trouvé</p>
      </div>
    );
  }

  return (
    <>
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
                  onClick={() => setConfirmDelete({
                    isOpen: true,
                    adminId: admin.id,
                    adminEmail: admin.email,
                  })}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete.isOpen}
        onOpenChange={(open) => !open && setConfirmDelete({ isOpen: false, adminId: null, adminEmail: null })}
      >
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-red-500/10">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <DialogTitle className="text-white">Supprimer l'administrateur</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Cette action révoquera l'accès au panneau d'administration.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 rounded-lg bg-slate-700/50">
              <p className="text-sm text-slate-300">
                <strong>Email :</strong> {confirmDelete.adminEmail}
              </p>
            </div>
            <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-400">
                Cet utilisateur ne pourra plus accéder au panneau d'administration.
                Vous pourrez l'ajouter à nouveau ultérieurement.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setConfirmDelete({ isOpen: false, adminId: null, adminEmail: null })}
              disabled={isLoading}
              className="text-slate-400"
            >
              Annuler
            </Button>
            <Button
              onClick={handleDeleteAdmin}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? 'Suppression...' : 'Supprimer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
