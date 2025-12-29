'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import { UserPlus, AlertCircle, CheckCircle, Mail, Send, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function AddAdminForm() {
  const router = useRouter();
  const supabase = createClient();

  // Existing user form state
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'super_admin'>('admin');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      // Insert new admin
      const { error: insertError } = await supabase
        .from('admins')
        .insert({
          email: email.toLowerCase().trim(),
          role,
        });

      if (insertError) {
        if (insertError.code === '23505') {
          throw new Error('Cet email est deja administrateur');
        }
        throw new Error(insertError.message);
      }

      // Try to link to existing user
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase().trim())
        .single();

      if (existingUser) {
        await supabase
          .from('admins')
          .update({ user_id: existingUser.id })
          .eq('email', email.toLowerCase().trim());
      }

      // Log the action
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'admin_created',
          resource_type: 'admin',
          metadata: {
            new_admin_email: email,
            role,
            created_by: user.email,
          },
        });
      }

      setSuccess('Administrateur ajoute avec succes');
      setEmail('');
      setRole('admin');
      router.refresh();

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'ajout';
      logger.error('Add admin error', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    setInviteSuccess(null);
    setIsInviting(true);

    try {
      const response = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail.toLowerCase().trim(),
          role: inviteRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi de l\'invitation');
      }

      setInviteSuccess(`Invitation envoyee a ${inviteEmail}`);
      setInviteEmail('');
      setInviteRole('admin');
      router.refresh();

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'envoi';
      logger.error('Invite admin error', err);
      setInviteError(errorMessage);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <UserPlus className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <CardTitle className="text-white">Ajouter un administrateur</CardTitle>
            <CardDescription className="text-slate-400">
              Ajoutez un utilisateur existant ou invitez un nouveau collaborateur
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="w-full grid grid-cols-2 bg-slate-700/50 mb-4">
            <TabsTrigger
              value="existing"
              className="flex items-center gap-2 data-[state=active]:bg-slate-600"
            >
              <Users className="w-4 h-4" />
              Utilisateur existant
            </TabsTrigger>
            <TabsTrigger
              value="invite"
              className="flex items-center gap-2 data-[state=active]:bg-slate-600"
            >
              <Mail className="w-4 h-4" />
              Inviter un externe
            </TabsTrigger>
          </TabsList>

          {/* Tab: Existing User */}
          <TabsContent value="existing">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 text-sm text-slate-400">
                L'utilisateur doit avoir un compte Izzico existant pour etre ajoute directement.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-slate-300">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@izzico.be"
                    required
                    disabled={isLoading}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Role</Label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isLoading}
                    className="w-full h-10 px-3 rounded-md bg-slate-700/50 border border-slate-600 text-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? 'Ajout...' : 'Ajouter l\'administrateur'}
              </Button>
            </form>
          </TabsContent>

          {/* Tab: Invite External */}
          <TabsContent value="invite">
            <form onSubmit={handleInvite} className="space-y-4">
              {inviteError && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{inviteError}</span>
                </div>
              )}

              {inviteSuccess && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{inviteSuccess}</span>
                </div>
              )}

              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 text-sm text-purple-300">
                Un email sera envoye avec un lien pour creer son compte admin directement.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-slate-300">Email du nouveau collaborateur</Label>
                  <Input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="nouveau.collaborateur@email.com"
                    required
                    disabled={isInviting}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Role</Label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'admin' | 'super_admin')}
                    disabled={isInviting}
                    className="w-full h-10 px-3 rounded-md bg-slate-700/50 border border-slate-600 text-white"
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isInviting || !inviteEmail}
                className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
              >
                <Send className="w-4 h-4" />
                {isInviting ? 'Envoi en cours...' : 'Envoyer l\'invitation'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
