'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  CreditCard,
  ArrowLeft,
  Check,
  AlertCircle,
  Building2,
  Smartphone,
  Shield,
  Save,
  Info,
  Lock,
  Eye,
  EyeOff,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

interface BankInfo {
  iban: string;
  bank_name: string;
  account_holder_name: string;
  revtag: string;
  payconiq_enabled: boolean;
  bic: string;
}

// IBAN formatting helper (adds spaces every 4 chars)
function formatIBAN(value: string): string {
  const cleaned = value.replace(/\s/g, '').toUpperCase();
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
}

// IBAN validation (basic check)
function isValidIBAN(iban: string): boolean {
  const cleaned = iban.replace(/\s/g, '');
  // Basic length check (Belgian IBAN = 16 chars)
  if (cleaned.length < 15 || cleaned.length > 34) return false;
  // Must start with 2 letters
  if (!/^[A-Z]{2}/.test(cleaned)) return false;
  return true;
}

export default function BankInfoPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('settings')?.bankInfo;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // 2FA State
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldownMessage, setCooldownMessage] = useState<string | null>(null);
  const [lastModifiedAt, setLastModifiedAt] = useState<string | null>(null);

  const [bankInfo, setBankInfo] = useState<BankInfo>({
    iban: '',
    bank_name: '',
    account_holder_name: '',
    revtag: '',
    payconiq_enabled: true,
    bic: '',
  });

  const [hasExistingInfo, setHasExistingInfo] = useState(false);

  useEffect(() => {
    loadBankInfo();
  }, []);

  const loadBankInfo = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('user_bank_info')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setBankInfo({
          iban: data.iban || '',
          bank_name: data.bank_name || '',
          account_holder_name: data.account_holder_name || '',
          revtag: data.revtag || '',
          payconiq_enabled: data.payconiq_enabled ?? true,
          bic: data.bic || '',
        });
        setHasExistingInfo(true);
        setLastModifiedAt(data.last_modified_at || null);
      }
    } catch (error) {
      console.error('Error loading bank info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user can modify (cooldown period check)
  const checkModificationAllowed = async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase.rpc('check_bank_info_modification_allowed', {
        p_user_id: user.id
      });

      if (error) {
        console.error('Error checking modification:', error);
        return true; // Allow if check fails
      }

      if (data) {
        setCooldownMessage(data);
        return false;
      }

      return true;
    } catch {
      return true;
    }
  };

  // Handle password verification
  const handleVerifyPassword = async () => {
    if (!password.trim()) {
      toast.error(t?.errors?.passwordRequired?.[language] || 'Veuillez entrer votre mot de passe');
      return;
    }

    setIsVerifying(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) throw new Error('User not found');

      // Re-authenticate with Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      });

      if (error) {
        toast.error(t?.errors?.wrongPassword?.[language] || 'Mot de passe incorrect');
        return;
      }

      // Mark as verified in database
      await supabase.rpc('mark_bank_info_verified');

      // Close dialog and proceed with save
      setShowPasswordDialog(false);
      setPassword('');
      await saveWithVerification();

    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(t?.errors?.verificationFailed?.[language] || 'Erreur de vérification');
    } finally {
      setIsVerifying(false);
    }
  };

  // Save with verification timestamp
  const saveWithVerification = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const cleanedIBAN = bankInfo.iban.replace(/\s/g, '').toUpperCase();

      const dataToSave = {
        user_id: user.id,
        iban: cleanedIBAN || null,
        bank_name: bankInfo.bank_name || null,
        account_holder_name: bankInfo.account_holder_name || null,
        revtag: bankInfo.revtag || null,
        payconiq_enabled: bankInfo.payconiq_enabled,
        bic: bankInfo.bic || null,
        last_verified_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('user_bank_info')
        .upsert(dataToSave, { onConflict: 'user_id' });

      if (error) throw error;

      setHasExistingInfo(true);
      setLastModifiedAt(new Date().toISOString());
      setMessage({ type: 'success', text: t?.messages?.saved?.[language] || 'Informations enregistrées !' });
      toast.success(t?.messages?.saved?.[language] || 'Informations enregistrées !');
    } catch (error: any) {
      console.error('Error saving bank info:', error);
      setMessage({ type: 'error', text: error.message || (t?.messages?.error?.[language] || 'Erreur lors de l\'enregistrement') });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setMessage(null);
    setCooldownMessage(null);

    // Validate IBAN if provided
    if (bankInfo.iban && !isValidIBAN(bankInfo.iban)) {
      setMessage({ type: 'error', text: t?.errors?.invalidIban?.[language] || 'IBAN invalide' });
      return;
    }

    // Check cooldown period
    const canModify = await checkModificationAllowed();
    if (!canModify) {
      return;
    }

    // If user has existing info, require password verification
    if (hasExistingInfo) {
      setShowPasswordDialog(true);
      return;
    }

    // First time setup - no verification needed
    await saveWithVerification();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-white to-purple-50/30">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.push('/settings')}
            variant="ghost"
            className="mb-4 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t?.back?.[language] || 'Retour aux paramètres'}
          </Button>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 superellipse-2xl bg-gradient-to-br from-indigo-200/70 to-purple-200/70 flex items-center justify-center shadow-sm">
              <CreditCard className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t?.title?.[language] || 'Coordonnées bancaires'}
              </h1>
              <p className="text-gray-600">
                {t?.subtitle?.[language] || 'Pour recevoir les paiements de vos colocataires'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-4 bg-blue-50 superellipse-xl border border-blue-200"
        >
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">{t?.info?.title?.[language] || 'Pourquoi ces informations ?'}</p>
              <p className="text-blue-700">
                {t?.info?.description?.[language] || 'Vos colocataires pourront vous payer facilement lorsqu\'ils vous doivent de l\'argent (courses, factures partagées, etc.). Vos données bancaires sont chiffrées et sécurisées.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cooldown Warning */}
        {cooldownMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-amber-50 superellipse-xl border border-amber-200"
          >
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-900 mb-1">
                  {t?.cooldown?.title?.[language] || 'Modification temporairement bloquée'}
                </p>
                <p className="text-amber-700">{cooldownMessage}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mb-6 p-4 superellipse-xl flex items-center gap-3",
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            )}
          >
            {message.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <p className="font-medium">{message.text}</p>
          </motion.div>
        )}

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* IBAN Section */}
          <div className="bg-white superellipse-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 superellipse-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {t?.sections?.bankAccount?.[language] || 'Compte bancaire'}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="account_holder_name">
                  {t?.fields?.accountHolder?.[language] || 'Titulaire du compte'}
                </Label>
                <Input
                  id="account_holder_name"
                  value={bankInfo.account_holder_name}
                  onChange={(e) => setBankInfo({ ...bankInfo, account_holder_name: e.target.value })}
                  placeholder={t?.placeholders?.accountHolder?.[language] || 'Jean Dupont'}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="iban">IBAN</Label>
                <Input
                  id="iban"
                  value={formatIBAN(bankInfo.iban)}
                  onChange={(e) => setBankInfo({ ...bankInfo, iban: e.target.value.replace(/\s/g, '') })}
                  placeholder={t?.placeholders?.iban?.[language] || 'BE68 5390 0754 7034'}
                  className="mt-2 font-mono"
                  maxLength={42} // 34 chars + spaces
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t?.fields?.ibanHint?.[language] || 'Votre numéro de compte international (IBAN)'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bank_name">
                    {t?.fields?.bankName?.[language] || 'Nom de la banque'}
                  </Label>
                  <Input
                    id="bank_name"
                    value={bankInfo.bank_name}
                    onChange={(e) => setBankInfo({ ...bankInfo, bank_name: e.target.value })}
                    placeholder={t?.placeholders?.bankName?.[language] || 'KBC, ING, Belfius...'}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="bic">BIC/SWIFT ({t?.fields?.optional?.[language] || 'optionnel'})</Label>
                  <Input
                    id="bic"
                    value={bankInfo.bic}
                    onChange={(e) => setBankInfo({ ...bankInfo, bic: e.target.value.toUpperCase() })}
                    placeholder={t?.placeholders?.bic?.[language] || 'KREDBEBB'}
                    className="mt-2 font-mono"
                    maxLength={11}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Alternative Methods Section */}
          <div className="bg-white superellipse-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 superellipse-xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {t?.sections?.mobileMethods?.[language] || 'Paiements mobiles'}
              </h2>
            </div>

            <div className="space-y-4">
              {/* Payconiq Toggle */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FF4785]/10 to-[#FF4785]/5 superellipse-xl border border-[#FF4785]/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 superellipse-lg bg-[#FF4785] flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Payconiq</p>
                    <p className="text-xs text-gray-600">
                      {t?.fields?.payconiqHint?.[language] || 'Permettre les paiements via Payconiq'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={bankInfo.payconiq_enabled}
                  onCheckedChange={(checked) => setBankInfo({ ...bankInfo, payconiq_enabled: checked })}
                />
              </div>

              {/* Revolut Revtag */}
              <div>
                <Label htmlFor="revtag">
                  Revolut Revtag ({t?.fields?.optional?.[language] || 'optionnel'})
                </Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                  <Input
                    id="revtag"
                    value={bankInfo.revtag.replace('@', '')}
                    onChange={(e) => setBankInfo({ ...bankInfo, revtag: e.target.value.replace('@', '') })}
                    placeholder={t?.placeholders?.revtag?.[language] || 'votre_revtag'}
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t?.fields?.revtagHint?.[language] || 'Votre identifiant Revolut pour recevoir des paiements'}
                </p>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 superellipse-xl p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-green-900 mb-1">
                  {t?.security?.title?.[language] || 'Données sécurisées'}
                </p>
                <p className="text-green-700">
                  {t?.security?.description?.[language] || 'Vos informations bancaires sont chiffrées et ne sont visibles que par vos colocataires pour effectuer des paiements.'}
                </p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full superellipse-xl h-12 text-white"
            style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t?.buttons?.saving?.[language] || 'Enregistrement...'}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                {hasExistingInfo
                  ? (t?.buttons?.update?.[language] || 'Mettre à jour')
                  : (t?.buttons?.save?.[language] || 'Enregistrer')
                }
              </div>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Password Verification Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-2">
              <Lock className="w-6 h-6 text-indigo-600" />
            </div>
            <DialogTitle className="text-center">
              {t?.verification?.title?.[language] || 'Confirmer votre identité'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {t?.verification?.description?.[language] || 'Pour modifier vos informations bancaires, veuillez entrer votre mot de passe.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="password-verify">
                {t?.verification?.passwordLabel?.[language] || 'Mot de passe'}
              </Label>
              <div className="relative">
                <Input
                  id="password-verify"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleVerifyPassword();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="p-3 bg-blue-50 superellipse-lg">
              <div className="flex items-start gap-2 text-xs text-blue-700">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>
                  {t?.verification?.securityNote?.[language] || 'Cette vérification protège vos données bancaires contre les modifications non autorisées.'}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false);
                setPassword('');
              }}
              disabled={isVerifying}
              className="w-full sm:w-auto"
            >
              {t?.verification?.cancel?.[language] || 'Annuler'}
            </Button>
            <Button
              onClick={handleVerifyPassword}
              disabled={isVerifying || !password.trim()}
              className="w-full sm:w-auto"
              style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t?.verification?.verifying?.[language] || 'Vérification...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {t?.verification?.confirm?.[language] || 'Confirmer'}
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
