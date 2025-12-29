'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AddAdminForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
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
          throw new Error('Cet email est déjà administrateur');
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

      setSuccess(true);
      setEmail('');
      setRole('admin');
      router.refresh();

    } catch (err: any) {
      logger.error('Add admin error', err);
      setError(err.message || 'Erreur lors de l\'ajout');
    } finally {
      setIsLoading(false);
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
              L'utilisateur doit avoir un compte Izzico existant
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
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
              <span>Administrateur ajouté avec succès</span>
            </div>
          )}

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
              <Label className="text-slate-300">Rôle</Label>
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
      </CardContent>
    </Card>
  );
}
