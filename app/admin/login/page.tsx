'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { logger } from '@/lib/utils/logger';
import { Shield, Eye, EyeOff, AlertCircle, Lock, KeyRound, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LoadingHouse from '@/components/ui/LoadingHouse';

type Step = 'credentials' | '2fa' | 'setup-2fa';

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  // Step management
  const [step, setStep] = useState<Step>('credentials');

  // Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 2FA
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [newPin, setNewPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const newPinRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmPinRefs = useRef<(HTMLInputElement | null)[]>([]);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Handle PIN input
  const handlePinChange = (
    index: number,
    value: string,
    pinArray: string[],
    setPinArray: (pins: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (!/^\d*$/.test(value)) return;

    const newPins = [...pinArray];
    newPins[index] = value.slice(-1);
    setPinArray(newPins);

    // Move to next input
    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (
    index: number,
    e: React.KeyboardEvent,
    pinArray: string[],
    setPinArray: (pins: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    if (e.key === 'Backspace' && !pinArray[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const handlePinPaste = (
    e: React.ClipboardEvent,
    setPinArray: (pins: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newPins = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setPinArray(newPins);
    refs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  // Step 1: Login with credentials
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        logger.error('Auth error', authError);
        if (authError.message?.includes('Invalid login credentials')) {
          throw new Error('Email ou mot de passe incorrect');
        } else if (authError.message?.includes('Email not confirmed')) {
          throw new Error('Veuillez confirmer votre email avant de vous connecter');
        } else if (authError.message?.includes('Too many requests')) {
          throw new Error('Trop de tentatives. Réessayez dans quelques minutes.');
        } else {
          throw new Error(`Erreur: ${authError.message}`);
        }
      }

      if (!authData.user) {
        throw new Error('Erreur d\'authentification');
      }

      // 2. Check if user is admin
      const { data: isAdmin, error: adminError } = await supabase
        .rpc('is_admin', { user_email: authData.user.email });

      if (adminError) {
        logger.error('Admin check error', adminError);
        throw new Error('Erreur de vérification des droits');
      }

      if (!isAdmin) {
        await supabase.auth.signOut();
        throw new Error('Accès non autorisé. Vous n\'êtes pas administrateur.');
      }

      // 3. Check if account is locked
      const { data: isLocked } = await supabase
        .rpc('is_admin_locked', { admin_email: authData.user.email });

      if (isLocked) {
        await supabase.auth.signOut();
        throw new Error('Compte temporairement verrouillé. Réessayez dans 15 minutes.');
      }

      // 4. Check if 2FA is enabled
      const { data: has2FA } = await supabase
        .rpc('admin_has_2fa', { admin_email: authData.user.email });

      setUserEmail(authData.user.email || null);

      if (has2FA) {
        // Go to 2FA verification step
        setStep('2fa');
      } else {
        // Go to 2FA setup step (mandatory for first login)
        setStep('setup-2fa');
      }

    } catch (err: any) {
      logger.error('Admin login failed', err);
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify 2FA PIN
  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const pinCode = pin.join('');
    if (pinCode.length !== 6) {
      setError('Veuillez entrer un code PIN à 6 chiffres');
      setIsLoading(false);
      return;
    }

    try {
      const { data: isValid, error: verifyError } = await supabase
        .rpc('verify_admin_pin', { admin_email: userEmail, pin_code: pinCode });

      if (verifyError) {
        throw new Error('Erreur de vérification');
      }

      if (!isValid) {
        setPin(['', '', '', '', '', '']);
        pinRefs.current[0]?.focus();
        throw new Error('Code PIN incorrect. Après 5 tentatives, votre compte sera bloqué.');
      }

      // Log successful 2FA
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'admin_2fa_verified',
          resource_type: 'admin_panel',
          metadata: {
            email: userEmail,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
          }
        });
      }

      // Redirect to admin dashboard
      router.push('/admin/dashboard');

    } catch (err: any) {
      logger.error('2FA verification failed', err);
      setError(err.message || 'Erreur de vérification');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Setup 2FA for first time
  const handleSetup2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const newPinCode = newPin.join('');
    const confirmPinCode = confirmPin.join('');

    if (newPinCode.length !== 6) {
      setError('Veuillez entrer un code PIN à 6 chiffres');
      setIsLoading(false);
      return;
    }

    if (newPinCode !== confirmPinCode) {
      setError('Les codes PIN ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      const { data: success, error: setupError } = await supabase
        .rpc('set_admin_pin', { admin_email: userEmail, new_pin: newPinCode });

      if (setupError || !success) {
        throw new Error('Erreur lors de la configuration du PIN');
      }

      // Log 2FA setup
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: 'admin_2fa_setup',
          resource_type: 'admin_panel',
          metadata: {
            email: userEmail,
            timestamp: new Date().toISOString(),
          }
        });
      }

      // Redirect to admin dashboard
      router.push('/admin/dashboard');

    } catch (err: any) {
      logger.error('2FA setup failed', err);
      setError(err.message || 'Erreur de configuration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = async () => {
    await supabase.auth.signOut();
    setStep('credentials');
    setPin(['', '', '', '', '', '']);
    setNewPin(['', '', '', '', '', '']);
    setConfirmPin(['', '', '', '', '', '']);
    setError(null);
    setUserEmail(null);
  };

  // Render PIN input group
  const renderPinInputs = (
    pinArray: string[],
    setPinArray: (pins: string[]) => void,
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>
  ) => (
    <div className="flex justify-center gap-2">
      {pinArray.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { refs.current[index] = el; }}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handlePinChange(index, e.target.value, pinArray, setPinArray, refs)}
          onKeyDown={(e) => handlePinKeyDown(index, e, pinArray, setPinArray, refs)}
          onPaste={(e) => handlePinPaste(e, setPinArray, refs)}
          className="w-12 h-14 text-center text-2xl font-bold bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
          disabled={isLoading}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800/50 backdrop-blur">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 superellipse-2xl flex items-center justify-center mb-4">
            {step === 'credentials' && <Shield className="w-8 h-8 text-white" />}
            {step === '2fa' && <Lock className="w-8 h-8 text-white" />}
            {step === 'setup-2fa' && <KeyRound className="w-8 h-8 text-white" />}
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {step === 'credentials' && 'Administration Izzico'}
            {step === '2fa' && 'Vérification 2FA'}
            {step === 'setup-2fa' && 'Configuration 2FA'}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {step === 'credentials' && 'Connectez-vous pour accéder au panneau d\'administration'}
            {step === '2fa' && 'Entrez votre code PIN de sécurité'}
            {step === 'setup-2fa' && 'Créez un code PIN à 6 chiffres pour sécuriser votre accès'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Credentials */}
          {step === 'credentials' && (
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@izzico.be"
                  required
                  disabled={isLoading}
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
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-purple-500 focus:ring-purple-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingHouse size={20} />
                    <span>Connexion...</span>
                  </div>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>
          )}

          {/* Step 2: 2FA Verification */}
          {step === '2fa' && (
            <form onSubmit={handleVerify2FA} className="space-y-6">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <Label className="text-slate-300 text-center block">Code PIN</Label>
                {renderPinInputs(pin, setPin, pinRefs)}
              </div>

              <Button
                type="submit"
                disabled={isLoading || pin.some(d => !d)}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingHouse size={20} />
                    <span>Vérification...</span>
                  </div>
                ) : (
                  'Vérifier'
                )}
              </Button>
            </form>
          )}

          {/* Step 3: 2FA Setup */}
          {step === 'setup-2fa' && (
            <form onSubmit={handleSetup2FA} className="space-y-6">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>

              <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <p className="text-sm text-orange-400">
                  <strong>Important :</strong> Ce code PIN sera demandé à chaque connexion.
                  Choisissez un code que vous pouvez mémoriser facilement.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <Label className="text-slate-300 text-center block">Nouveau code PIN</Label>
                {renderPinInputs(newPin, setNewPin, newPinRefs)}
              </div>

              <div className="space-y-4">
                <Label className="text-slate-300 text-center block">Confirmer le code PIN</Label>
                {renderPinInputs(confirmPin, setConfirmPin, confirmPinRefs)}
              </div>

              <Button
                type="submit"
                disabled={isLoading || newPin.some(d => !d) || confirmPin.some(d => !d)}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingHouse size={20} />
                    <span>Configuration...</span>
                  </div>
                ) : (
                  'Activer la double authentification'
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              {step === 'credentials' && (
                <>
                  Accès réservé aux administrateurs autorisés.
                  <br />
                  Toutes les connexions sont enregistrées.
                </>
              )}
              {step === '2fa' && (
                <>
                  5 tentatives maximum avant blocage temporaire.
                  <br />
                  Compte : {userEmail}
                </>
              )}
              {step === 'setup-2fa' && (
                <>
                  La double authentification est obligatoire pour les administrateurs.
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
