'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/utils/logger';
import {
  Mail,
  Clock,
  Trash2,
  RefreshCw,
  Send,
  Shield,
  AlertCircle,
  User,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface Invitation {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  status: string;
  created_at: string;
  expires_at: string;
  invited_by: string;
  inviter_email?: string;
}

export default function PendingInvitations() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [resendingId, setResendingId] = useState<string | null>(null);

  const loadInvitations = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/invite');
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.invitations || []);
      }
    } catch (error) {
      logger.error('Error loading invitations', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvitations();
  }, [loadInvitations]);

  const handleCancel = async (invitationId: string, email: string) => {
    setCancellingId(invitationId);
    try {
      const response = await fetch(`/api/admin/invite?id=${invitationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de l\'annulation');
      }

      toast.success(`Invitation annulee pour ${email}`);
      setInvitations(prev => prev.filter(i => i.id !== invitationId));
      router.refresh();

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur';
      toast.error(errorMessage);
      logger.error('Cancel invitation error', error);
    } finally {
      setCancellingId(null);
    }
  };

  const handleResend = async (invitation: Invitation) => {
    setResendingId(invitation.id);
    try {
      // Cancel the old invitation first
      await fetch(`/api/admin/invite?id=${invitation.id}`, {
        method: 'DELETE',
      });

      // Create a new invitation
      const response = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: invitation.email,
          role: invitation.role,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors du renvoi');
      }

      toast.success(`Nouvelle invitation envoyee a ${invitation.email}`);
      loadInvitations();
      router.refresh();

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur';
      toast.error(errorMessage);
      logger.error('Resend invitation error', error);
    } finally {
      setResendingId(null);
    }
  };

  const getRoleBadge = (role: string) => {
    if (role === 'super_admin') {
      return (
        <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30">
          Super Admin
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
        Admin
      </Badge>
    );
  };

  const getTimeRemaining = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 'Expiree';
    if (diffDays === 1) return '1 jour restant';
    return `${diffDays} jours restants`;
  };

  if (invitations.length === 0 && !isLoading) {
    return null;
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Mail className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-white">Invitations en attente</CardTitle>
              <CardDescription className="text-slate-400">
                {invitations.length} invitation{invitations.length > 1 ? 's' : ''} en cours
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadInvitations}
            disabled={isLoading}
            className="text-slate-400 hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-slate-700/30 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-600" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-slate-600 rounded" />
                  <div className="h-3 w-1/4 bg-slate-700 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 border border-slate-600/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{invitation.email}</span>
                      {getRoleBadge(invitation.role)}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getTimeRemaining(invitation.expires_at)}
                      </span>
                      <span>
                        Invite par {invitation.inviter_email || 'Administrateur'}
                      </span>
                      <span>
                        {format(new Date(invitation.created_at), 'dd MMM yyyy', { locale: fr })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleResend(invitation)}
                    disabled={resendingId === invitation.id}
                    className="text-slate-400 hover:text-purple-400"
                    title="Renvoyer l'invitation"
                  >
                    <Send className={`w-4 h-4 ${resendingId === invitation.id ? 'animate-pulse' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCancel(invitation.id, invitation.email)}
                    disabled={cancellingId === invitation.id}
                    className="text-slate-400 hover:text-red-400"
                    title="Annuler l'invitation"
                  >
                    <Trash2 className={`w-4 h-4 ${cancellingId === invitation.id ? 'animate-pulse' : ''}`} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {invitations.length > 0 && (
          <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400 mt-0.5" />
              <p className="text-xs text-slate-400">
                Les invitations expirent automatiquement apres 7 jours. Vous pouvez renvoyer une invitation
                pour prolonger la periode de validite.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
