'use client';

import { useState } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import {
  MoreVertical,
  Ban,
  CheckCircle,
  Shield,
  Mail,
  Eye,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

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
  const [openMenu, setOpenMenu] = useState<string | null>(null);
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

  const handleAction = async (userId: string, action: string) => {
    setOpenMenu(null);

    try {
      switch (action) {
        case 'view':
          window.open(`/admin/dashboard/users/${userId}`, '_blank');
          break;
        case 'email':
          const user = users.find(u => u.id === userId);
          if (user?.email) {
            window.location.href = `mailto:${user.email}`;
          }
          break;
        case 'ban':
          // Log the ban action
          await supabase.from('audit_logs').insert({
            action: 'user_banned',
            resource_type: 'user',
            resource_id: userId,
            metadata: { reason: 'Admin action' },
          });
          toast.success('Utilisateur banni');
          break;
        case 'delete':
          if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            await supabase.from('audit_logs').insert({
              action: 'user_deleted',
              resource_type: 'user',
              resource_id: userId,
            });
            toast.success('Utilisateur supprimé');
          }
          break;
      }
    } catch (error) {
      toast.error('Erreur lors de l\'action');
    }
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
                        <button
                          onClick={() => handleAction(user.id, 'view')}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Voir le profil
                        </button>
                        <button
                          onClick={() => handleAction(user.id, 'email')}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-600 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          Envoyer un email
                        </button>
                        <hr className="border-slate-600 my-1" />
                        <button
                          onClick={() => handleAction(user.id, 'ban')}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-orange-400 hover:bg-slate-600 transition-colors"
                        >
                          <Ban className="w-4 h-4" />
                          Bannir
                        </button>
                        <button
                          onClick={() => handleAction(user.id, 'delete')}
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
    </div>
  );
}
