'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { logger } from '@/lib/utils/logger';
import { Mail, Eye, EyeOff, AlertCircle, CheckCircle, Shield, User, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InvitationDetails {
  valid: boolean;
  invitation_id: string;
  email: string;
  role: 'admin' | 'super_admin';
  expires_at: string;
  inviter_email: string;
  error?: string;
  message?: string;
}

type PageStep = 'loading' | 'invalid' | 'form' | 'success';

export default function AcceptInvitePage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [step, setStep] = useState<PageStep>('loading');
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Form state
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Validate token on mount
  useEffect(() => {
    async function validateToken() {
      try {
        const response = await fetch(`/api/admin/invite/validate?token=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (data.valid) {
          setInvitation(data);
          setStep('form');
        } else {
          setErrorMessage(data.message || 'Invitation invalide');
          setStep('invalid');
        }
      } catch (error) {
        logger.error('Token validation error', error);
        setErrorMessage('Erreur lors de la validation de l\'invitation');
        setStep('invalid');
      }
    }

    if (token) {
      validateToken();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (password.length < 8) {
      setFormError('Le mot de passe doit contenir au moins 8 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/invite/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password,
          fullName: fullName.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la creation du compte');
      }

      setStep('success');

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/admin/login');
      }, 3000);

    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Erreur lors de la creation du compte';
      logger.error('Account creation error', error);
      setFormError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getRoleName = (role: string) => {
    return role === 'super_admin' ? 'Super Administrateur' : 'Administrateur';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800/50 backdrop-blur">
        {/* Loading State */}
        {step === 'loading' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 superellipse-2xl flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Verification en cours
              </CardTitle>
              <CardDescription className="text-slate-400">
                Validation de votre invitation...
              </CardDescription>
            </CardHeader>
          </>
        )}

        {/* Invalid Token State */}
        {step === 'invalid' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-600 to-red-800 superellipse-2xl flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Invitation invalide
              </CardTitle>
              <CardDescription className="text-slate-400">
                {errorMessage}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-sm text-slate-500">
                  Cette invitation peut avoir expire, deja ete utilisee, ou avoir ete annulee.
                </p>
                <Button
                  onClick={() => router.push('/admin/login')}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Aller a la page de connexion
                </Button>
              </div>
            </CardContent>
          </>
        )}

        {/* Form State */}
        {step === 'form' && invitation && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 superellipse-2xl flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Bienvenue chez Izzico
              </CardTitle>
              <CardDescription className="text-slate-400">
                Creez votre compte administrateur
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Invitation Details */}
              <div className="mb-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300">{invitation.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                    {getRoleName(invitation.role)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    Invite par {invitation.inviter_email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-500">
                    Expire le {formatDate(invitation.expires_at)}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {formError && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-300">
                    Nom complet <span className="text-slate-500">(optionnel)</span>
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jean Dupont"
                    disabled={isSubmitting}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 8 caracteres"
                      required
                      disabled={isSubmitting}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                      aria-label={showPassword ? 'Masquer' : 'Afficher'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-300">Confirmer le mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Retapez votre mot de passe"
                    required
                    disabled={isSubmitting}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !password || !confirmPassword}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creation du compte...</span>
                    </div>
                  ) : (
                    'Creer mon compte'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-slate-500">
                  Apres la creation, vous devrez configurer
                  <br />
                  la double authentification pour securiser votre acces.
                </p>
              </div>
            </CardContent>
          </>
        )}

        {/* Success State */}
        {step === 'success' && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 superellipse-2xl flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Compte cree avec succes
              </CardTitle>
              <CardDescription className="text-slate-400">
                Vous allez etre redirige vers la page de connexion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-sm text-slate-300">
                  Bienvenue dans l'equipe d'administration Izzico!
                </p>
                <p className="text-xs text-slate-500">
                  Redirection automatique dans quelques secondes...
                </p>
                <Button
                  onClick={() => router.push('/admin/login')}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                >
                  Se connecter maintenant
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
}
