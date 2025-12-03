'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Phone, CheckCircle, XCircle, Clock, AlertCircle, Award, Camera, Linkedin } from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileSection,
  EnhanceProfileInfoBox,
} from '@/components/enhance-profile';
import VerificationBadge, { getVerificationLevel, type VerificationLevel } from '@/components/profile/VerificationBadge';

export default function VerificationPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [idVerified, setIdVerified] = useState(false);
  const [backgroundCheck, setBackgroundCheck] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmittingPhone, setIsSubmittingPhone] = useState(false);

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Check email verification
      setEmailVerified(user.email_confirmed_at !== null);
      setUserEmail(user.email || '');

      // Load verification data from user_profiles
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('phone_number, phone_verified, id_verified, background_check, email_verified')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setPhoneNumber(profileData.phone_number || '');
        setPhoneVerified(profileData.phone_verified || false);
        setIdVerified(profileData.id_verified || false);
        setBackgroundCheck(profileData.background_check || false);
        setEmailVerified(profileData.email_verified || false);
      }
    } catch (error) {
      toast.error('Failed to load verification status');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateBadgeLevel = (): VerificationLevel => {
    return getVerificationLevel({
      email_verified: emailVerified,
      phone_verified: phoneVerified,
      id_verified: idVerified,
      background_check: backgroundCheck,
    });
  };

  const calculateProgress = (): number => {
    const checks = [emailVerified, phoneVerified, idVerified, backgroundCheck];
    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  };

  const getBadgeInfo = (level: VerificationLevel) => {
    const badges = {
      starter: {
        name: 'Starter',
        color: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        description: 'Aucune vérification'
      },
      basic: {
        name: 'Basic',
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        description: 'Email ou téléphone vérifié'
      },
      verified: {
        name: 'Verified',
        color: 'text-blue-700',
        bg: 'bg-blue-100',
        border: 'border-blue-300',
        description: 'Email + Téléphone vérifiés'
      },
      premium: {
        name: 'Premium',
        color: 'text-blue-900',
        bg: 'bg-blue-900/10',
        border: 'border-blue-900',
        description: 'Tout vérifié (4/4)'
      }
    };
    return badges[level];
  };

  const handleResendEmailVerification = async () => {
    try {
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      toast.error('Failed to send verification email');
    }
  };

  const handlePhoneVerification = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsSubmittingPhone(true);
    try {
      toast.info('Phone verification is coming soon!');
    } catch (error) {
      toast.error('Failed to verify phone number');
    } finally {
      setIsSubmittingPhone(false);
    }
  };


  const handleSkip = () => {
    router.push('/profile');
  };

  const handleSave = () => {
    router.push('/profile');
  };

  const badgeLevel = calculateBadgeLevel();
  const progress = calculateProgress();
  const badgeInfo = getBadgeInfo(badgeLevel);

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/profile"
      backLabel="Back to Profile"
      progress={undefined}
      isLoading={isLoading}
      loadingText="Loading verification status..."
    >
      <EnhanceProfileHeading
        role="searcher"
        title="Profile Verification"
        description="Build trust and unlock benefits with each verification"
        icon={<Shield className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Badge Status Card */}
        <div className={`p-6 rounded-2xl border ${badgeInfo.bg} ${badgeInfo.border}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-2 shadow-md">
                <VerificationBadge level={badgeLevel} size="lg" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${badgeInfo.color}`}>{badgeInfo.name}</h2>
                <p className="text-sm text-gray-600">{badgeInfo.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${badgeInfo.color}`}>{progress}%</div>
              <p className="text-xs text-gray-500">Complete</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Next Badge Info */}
          {badgeLevel !== 'premium' && (
            <div className="mt-4 p-3 bg-white/50 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-700">
                {badgeLevel === 'starter' && '✨ Complète 1 vérification pour débloquer le badge Basic (bleu clair)'}
                {badgeLevel === 'basic' && '✨ Complète 2 vérifications pour débloquer le badge Verified (bleu)'}
                {badgeLevel === 'verified' && '✨ Complète les 4 vérifications pour débloquer le badge Premium (bleu foncé)'}
              </p>
            </div>
          )}
        </div>

        {/* Email Verification */}
        <EnhanceProfileSection>
          <div className={`p-6 rounded-2xl border-2 ${
            emailVerified ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  emailVerified ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  <Mail className={`w-6 h-6 ${emailVerified ? 'text-green-600' : 'text-orange-600'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Email Verification</h3>
                  <p className="text-sm text-gray-600">{userEmail}</p>
                </div>
              </div>
              {emailVerified ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-orange-600" />
              )}
            </div>

            {emailVerified ? (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 px-4 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span>Your email has been verified</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-sm text-orange-700 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>Please verify your email address</span>
                </div>
                <button
                  onClick={handleResendEmailVerification}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                >
                  Resend Verification Email
                </button>
              </div>
            )}
          </div>
        </EnhanceProfileSection>

        {/* Phone Verification */}
        <EnhanceProfileSection>
          <div className={`p-6 rounded-2xl border-2 ${
            phoneVerified ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  phoneVerified ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <Phone className={`w-6 h-6 ${phoneVerified ? 'text-green-600' : 'text-blue-600'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Phone Verification</h3>
                  <p className="text-sm text-gray-600">Quick SMS verification</p>
                </div>
              </div>
              {phoneVerified ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Clock className="w-6 h-6 text-gray-400" />
              )}
            </div>

            {phoneVerified ? (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 px-4 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span>Phone verified: {phoneNumber}</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-sm text-blue-700 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>Coming soon: Verify via SMS</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+32 123 456 789"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled
                  />
                  <button
                    onClick={handlePhoneVerification}
                    disabled
                    className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium"
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}
          </div>
        </EnhanceProfileSection>

        {/* ID Verification */}
        <EnhanceProfileSection>
          <div className={`p-6 rounded-2xl border-2 ${
            idVerified ? 'bg-green-50 border-green-200' : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  idVerified ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  <Shield className={`w-6 h-6 ${idVerified ? 'text-green-600' : 'text-purple-600'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">ID Verification</h3>
                  <p className="text-sm text-gray-600">Vérifie ton identité avec itsme®</p>
                </div>
              </div>
              {idVerified ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Clock className="w-6 h-6 text-gray-400" />
              )}
            </div>

            {idVerified ? (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 px-4 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span>Identité vérifiée</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-sm text-purple-700 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>Bientôt disponible : Vérification d'identité avec itsme®</span>
                </div>
                <button
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Vérifier avec itsme®
                </button>
              </div>
            )}
          </div>
        </EnhanceProfileSection>

        {/* Background Check */}
        <EnhanceProfileSection>
          <div className={`p-6 rounded-2xl border-2 ${
            backgroundCheck ? 'bg-green-50 border-green-200' : 'bg-indigo-50 border-indigo-200'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  backgroundCheck ? 'bg-green-100' : 'bg-indigo-100'
                }`}>
                  <Award className={`w-6 h-6 ${backgroundCheck ? 'text-green-600' : 'text-indigo-600'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    Background Check
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Premium</span>
                  </h3>
                  <p className="text-sm text-gray-600">Vérification des antécédents</p>
                </div>
              </div>
              {backgroundCheck ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Clock className="w-6 h-6 text-gray-400" />
              )}
            </div>

            {backgroundCheck ? (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 px-4 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span>Vérification des antécédents complétée - Badge Premium débloqué !</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-sm text-indigo-700 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>Bientôt disponible : Vérification approfondie des antécédents</span>
                </div>
                <button
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  Demander une vérification
                </button>
              </div>
            )}
          </div>
        </EnhanceProfileSection>

        {/* Benefits Info */}
        <EnhanceProfileInfoBox role="searcher">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Débloque des avantages avec chaque badge</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <VerificationBadge level="starter" size="sm" />
                  </div>
                  <div>
                    <span className="font-medium">Starter (V gris):</span> Créer un profil & parcourir
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <VerificationBadge level="basic" size="sm" />
                  </div>
                  <div>
                    <span className="font-medium">Basic (V bleu clair):</span> Apparaître dans les recherches + badge vérifié
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <VerificationBadge level="verified" size="sm" />
                  </div>
                  <div>
                    <span className="font-medium">Verified (V bleu):</span> Priorité dans les résultats + réponses plus rapides
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <VerificationBadge level="premium" size="sm" />
                  </div>
                  <div>
                    <span className="font-medium">Premium (V bleu foncé):</span> Meilleures offres + candidatures instantanées
                  </div>
                </div>
              </div>
            </div>
          </div>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center gap-4">
        <button
          onClick={handleSkip}
          className="px-6 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          Skip
          <span className="text-lg">→</span>
        </button>
        <button
          onClick={handleSave}
          className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          Done
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
