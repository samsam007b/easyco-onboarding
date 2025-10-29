'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

type AuthMode = 'login' | 'signup';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  // Determine mode from URL param or default to login
  const [mode, setMode] = useState<AuthMode>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    // Get mode from URL if present
    const modeParam = searchParams?.get('mode');
    if (modeParam === 'signup') {
      setMode('signup');
    }

    // Get redirect parameter
    const redirect = searchParams?.get('redirect');
    if (redirect) {
      const allowedPaths = [
        '/dashboard/searcher',
        '/dashboard/owner',
        '/dashboard/resident',
        '/profile',
        '/properties',
        '/messages',
      ];
      const isAllowed = allowedPaths.some(path =>
        redirect === path || redirect.startsWith(path + '/')
      );
      const isSafe = redirect.startsWith('/') && !redirect.startsWith('//');
      if (isAllowed && isSafe) {
        setRedirectTo(redirect);
      }
    }
  }, [searchParams]);

  // Password strength
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    if (strength <= 2) return { strength, label: t('auth.signup.weak'), color: 'bg-red-500' };
    if (strength <= 3) return { strength, label: t('auth.signup.medium'), color: 'bg-yellow-500' };
    return { strength, label: t('auth.signup.strong'), color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const requirements = [
    { met: password.length >= 8, text: t('auth.signup.requirements.length') },
    { met: /[A-Z]/.test(password), text: t('auth.signup.requirements.uppercase') },
    { met: /[a-z]/.test(password), text: t('auth.signup.requirements.lowercase') },
    { met: /[0-9]/.test(password), text: t('auth.signup.requirements.number') },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error(t('auth.login.errors.invalidEmail'));
      return;
    }

    if (!password) {
      toast.error(t('auth.login.errors.enterPassword'));
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error(t('auth.login.errors.invalidCredentials'));
        } else if (error.message.includes('Email not confirmed')) {
          toast.error(t('auth.login.errors.emailNotConfirmed'));
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        toast.success(t('auth.login.success.welcomeBack'));

        // Check if user has a role
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('user_type')
          .eq('user_id', data.user.id)
          .single();

        // If redirect specified, use it
        if (redirectTo) {
          router.push(redirectTo);
          return;
        }

        const userType = profile?.user_type;

        // Redirect based on user type
        if (userType === 'searcher') {
          router.push('/dashboard/searcher');
        } else if (userType === 'owner') {
          router.push('/dashboard/owner');
        } else if (userType === 'resident') {
          router.push('/dashboard/resident');
        } else {
          // No role assigned yet - go to welcome page
          router.push('/welcome');
        }
      }
    } catch (error: any) {
      toast.error('An error occurred', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!fullName.trim()) {
      toast.error(t('auth.signup.errors.enterName'));
      return;
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error(t('auth.signup.errors.invalidEmail'));
      return;
    }

    if (password.length < 8) {
      toast.error(t('auth.signup.errors.passwordLength'));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t('auth.signup.errors.passwordsDontMatch'));
      return;
    }

    if (!agreedToTerms) {
      toast.error(t('auth.signup.errors.agreeToTerms'));
      return;
    }

    setIsLoading(true);

    try {
      // Sign up WITHOUT user_type - we'll select it on welcome page
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error(t('auth.signup.errors.emailExists'));
        } else {
          toast.error(error.message);
        }
        return;
      }

      if (data.user) {
        toast.success(t('auth.signup.success.accountCreated'), {
          description: t('auth.signup.success.checkEmail'),
        });

        // Redirect to welcome page to select role
        router.push('/welcome');
      }
    } catch (error: any) {
      toast.error('An error occurred', { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast.error('Google sign-in failed', { description: error.message });
        setIsGoogleLoading(false);
      }
    } catch (error: any) {
      toast.error('An error occurred', { description: error.message });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center">
        <Link href="/" className="inline-flex items-center gap-2 text-[#4A148C] hover:text-[#311B92] transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">{t('auth.login.backToHome')}</span>
        </Link>
        <LanguageSwitcher />
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#4A148C] mb-2">
              {mode === 'login' ? t('auth.login.title') : t('auth.signup.title')}
            </h1>
            <p className="text-gray-600">
              {mode === 'login' ? t('auth.login.subtitle') : t('auth.signup.subtitle')}
            </p>
          </div>

          {/* Auth Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-full">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                  mode === 'login'
                    ? 'bg-[#4A148C] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('auth.login.title')}
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 px-4 rounded-full font-medium transition-all ${
                  mode === 'signup'
                    ? 'bg-[#4A148C] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('auth.signup.title')}
              </button>
            </div>

            {/* Google OAuth Button */}
            <Button
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
              variant="outline"
              className="w-full mb-6"
            >
              {isGoogleLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#4A148C] border-t-transparent rounded-full animate-spin mr-2" />
                  {mode === 'login' ? t('auth.login.signingInGoogle') : 'Signing up with Google...'}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {mode === 'login' ? t('auth.login.googleButton') : 'Sign up with Google'}
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">{t('auth.login.divider')}</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
              {/* Full Name (Signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('auth.signup.fullName')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t('auth.signup.fullNamePlaceholder')}
                      className="pl-12"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.login.email')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.login.emailPlaceholder')}
                    className="pl-12"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.login.password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.login.passwordPlaceholder')}
                    className="pl-12 pr-12"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength (Signup only) */}
                {mode === 'signup' && password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password (Signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('auth.signup.confirmPassword')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={t('auth.signup.confirmPasswordPlaceholder')}
                      className="pl-12 pr-12"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Requirements (Signup only) */}
                  <div className="mt-2 space-y-1">
                    {requirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        {req.met ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-gray-400" />
                        )}
                        <span className={req.met ? 'text-green-600' : 'text-gray-600'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Remember Me / Forgot Password (Login only) */}
              {mode === 'login' && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-[#4A148C] border-gray-300 rounded focus:ring-[#4A148C]"
                    />
                    <span className="text-sm text-gray-600">{t('auth.login.remember')}</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-[#4A148C] hover:text-[#311B92] font-semibold"
                  >
                    {t('auth.login.forgotPassword')}
                  </Link>
                </div>
              )}

              {/* Terms Checkbox (Signup only) */}
              {mode === 'signup' && (
                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#4A148C] border-gray-300 rounded focus:ring-[#4A148C]"
                    />
                    <span className="text-sm text-gray-600">
                      {t('auth.signup.agreeToTerms')}{' '}
                      <Link href="/legal/terms" className="text-[#4A148C] hover:underline">
                        {t('auth.signup.termsLink')}
                      </Link>{' '}
                      {t('auth.signup.and')}{' '}
                      <Link href="/legal/privacy" className="text-[#4A148C] hover:underline">
                        {t('auth.signup.privacyLink')}
                      </Link>
                    </span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {mode === 'login' ? t('auth.login.signingIn') : t('auth.signup.creatingAccount')}
                  </>
                ) : (
                  mode === 'login' ? t('auth.login.loginButton') : t('auth.signup.signupButton')
                )}
              </Button>
            </form>

            {/* Switch Mode Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {mode === 'login' ? t('auth.login.noAccount') : t('auth.signup.hasAccount')}{' '}
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-[#4A148C] hover:text-[#311B92] font-semibold"
                >
                  {mode === 'login' ? t('auth.login.signupLink') : t('auth.signup.loginLink')}
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
