'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, ShieldAlert, Clock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LoadingHouse from '@/components/ui/LoadingHouse';

/**
 * Re-authentication Page
 * SECURITY: Part of VULN-004 fix - Session timeout enforcement
 *
 * This page is shown when:
 * 1. User tries to access sensitive routes after 30min inactivity
 * 2. Session timeout detected by middleware
 *
 * User must re-enter password to continue (without full logout)
 */

function ReauthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState('/dashboard');
  const [timeoutReason, setTimeoutReason] = useState<string | null>(null);

  useEffect(() => {
    // Get current user email
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      } else {
        // No user session at all - redirect to full login
        router.push('/auth');
      }
    };
    getUser();

    // Get redirect path from URL params
    const redirect = searchParams?.get('redirect');
    if (redirect && redirect.startsWith('/')) {
      setRedirectPath(redirect);
    }

    // Get reason for timeout
    const reason = searchParams?.get('reason');
    setTimeoutReason(reason);
  }, [searchParams, router, supabase]);

  const handleReauth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast.error(t('errors.passwordRequired'));
      return;
    }

    if (!userEmail) {
      toast.error(t('errors.noSession'));
      router.push('/auth');
      return;
    }

    setIsLoading(true);

    try {
      // Re-authenticate with Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password,
      });

      if (error) {
        toast.error(t('errors.invalidPassword'));
        setPassword('');
        setIsLoading(false);
        return;
      }

      // Success - redirect to original destination
      toast.success(t('auth.reauthSuccess'));
      router.push(redirectPath);
    } catch (err) {
      console.error('Reauth error:', err);
      toast.error(t('errors.unexpected'));
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
      <div className="w-full max-w-md">
        {/* Security Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-amber-600" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-heading font-bold text-slate-800 mb-2">
              {t('auth.sessionTimeout')}
            </h1>
            <p className="text-slate-500 text-sm flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              {timeoutReason === 'session_timeout'
                ? t('auth.inactivityMessage')
                : t('auth.reauthRequired')}
            </p>
          </div>

          {/* User Info */}
          {userEmail && (
            <div className="bg-slate-50 rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-slate-500">{t('auth.connectedAs')}</p>
              <p className="font-medium text-slate-800">{userEmail}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleReauth} className="space-y-6">
            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.enterPassword')}
                  className="pl-10 pr-10 h-12 rounded-xl"
                  autoComplete="current-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !password}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-owner-500 to-resident-500 hover:from-owner-600 hover:to-resident-600 text-white font-semibold"
            >
              {isLoading ? (
                <LoadingHouse size="sm" />
              ) : (
                t('auth.verifyIdentity')
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 border-t border-slate-100" />

          {/* Logout Option */}
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-2">
              {t('auth.notYou', 'Ce n\'est pas toi ?')}
            </p>
            <button
              onClick={handleLogout}
              className="text-sm text-owner-600 hover:text-owner-700 font-medium"
            >
              {t('auth.logoutAndSwitch')}
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <p className="text-center text-xs text-slate-400 mt-6 px-4">
          {t(
            'auth.securityNotice',
            'Pour ta sécurité, nous demandons une vérification après 30 minutes d\'inactivité sur les pages sensibles.'
          )}
        </p>
      </div>
    </div>
  );
}

export default function ReauthPage() {
  return (
    <Suspense fallback={<LoadingHouse />}>
      <ReauthContent />
    </Suspense>
  );
}
