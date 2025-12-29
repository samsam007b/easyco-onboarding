'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/utils/logger';
import { Mail, AlertCircle, CheckCircle, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function InviteAdminForm() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'super_admin'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi de l\'invitation');
      }

      setSuccess(`Invitation envoyee a ${email}`);
      setEmail('');
      setRole('admin');
      router.refresh();

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'envoi';
      logger.error('Invite admin error', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Mail className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-white">Inviter un administrateur externe</CardTitle>
            <CardDescription className="text-slate-400">
              Envoyez une invitation par email a un nouveau collaborateur
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
              <span>{success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label className="text-slate-300">Email du nouveau collaborateur</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nouveau.collaborateur@email.com"
                required
                disabled={isLoading}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
              />
              <p className="text-xs text-slate-500">
                Un email sera envoye avec un lien pour creer son compte admin
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Role</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'super_admin')}
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
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
          >
            <Send className="w-4 h-4" />
            {isLoading ? 'Envoi en cours...' : 'Envoyer l\'invitation'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
