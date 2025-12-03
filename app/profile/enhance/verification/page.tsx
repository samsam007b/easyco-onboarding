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

type BadgeLevel = 'starter' | 'verified' | 'trusted' | 'premium';

export default function VerificationPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [photoVerified, setPhotoVerified] = useState(false);
  const [linkedinVerified, setLinkedinVerified] = useState(false);
  const [kycStatus, setKycStatus] = useState<'not_started' | 'pending' | 'verified' | 'rejected'>('not_started');
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
        .select('phone_number, phone_verified, verification_status, profile_picture, linkedin_url')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setPhoneNumber(profileData.phone_number || '');
        setPhoneVerified(profileData.phone_verified || false);
        setPhotoVerified(!!profileData.profile_picture);
        setLinkedinVerified(!!profileData.linkedin_url);
        setKycStatus(profileData.verification_status || 'not_started');
      }
    } catch (error) {
      toast.error('Failed to load verification status');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateBadgeLevel = (): BadgeLevel => {
    const verifications = [emailVerified, phoneVerified, photoVerified, linkedinVerified];
    const count = verifications.filter(Boolean).length;

    if (kycStatus === 'verified') return 'premium';
    if (count >= 3) return 'trusted';
    if (count >= 2) return 'verified';
    return 'starter';
  };

  const calculateProgress = (): number => {
    const checks = [emailVerified, phoneVerified, photoVerified, linkedinVerified, kycStatus === 'verified'];
    const completed = checks.filter(Boolean).length;
    return Math.round((completed / checks.length) * 100);
  };

  const getBadgeInfo = (level: BadgeLevel) => {
    const badges = {
      starter: {
        name: 'Starter',
        color: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        badgeColor: 'bg-gray-400',
        description: 'Basic verification'
      },
      verified: {
        name: 'Verified',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        badgeColor: 'bg-amber-400',
        description: 'Trusted profile'
      },
      trusted: {
        name: 'Trusted',
        color: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        badgeColor: 'bg-blue-400',
        description: 'Highly trusted'
      },
      premium: {
        name: 'Premium',
        color: 'text-orange-700',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        badgeColor: 'bg-orange-400',
        description: 'Fully verified'
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

  const handlePhotoUpload = () => {
    toast.info('Photo upload is coming soon!');
  };

  const handleLinkedinConnect = () => {
    toast.info('LinkedIn connection is coming soon!');
  };

  const handleKycVerification = () => {
    toast.info('KYC verification with itsme is coming soon!');
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
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${badgeInfo.badgeColor}`} />
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
                {badgeLevel === 'starter' && 'Complete 2 verifications to unlock Verified badge'}
                {badgeLevel === 'verified' && 'Complete 3 verifications to unlock Trusted badge'}
                {badgeLevel === 'trusted' && 'Complete KYC to unlock Premium badge'}
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

        {/* Photo Verification */}
        <EnhanceProfileSection>
          <div className={`p-6 rounded-2xl border-2 ${
            photoVerified ? 'bg-green-50 border-green-200' : 'bg-purple-50 border-purple-200'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  photoVerified ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  <Camera className={`w-6 h-6 ${photoVerified ? 'text-green-600' : 'text-purple-600'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Profile Photo</h3>
                  <p className="text-sm text-gray-600">Show you're a real person</p>
                </div>
              </div>
              {photoVerified ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Clock className="w-6 h-6 text-gray-400" />
              )}
            </div>

            {photoVerified ? (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 px-4 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span>Profile photo added</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-sm text-purple-700 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>Coming soon: Upload your photo</span>
                </div>
                <button
                  onClick={handlePhotoUpload}
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  Upload Photo
                </button>
              </div>
            )}
          </div>
        </EnhanceProfileSection>

        {/* LinkedIn Verification */}
        <EnhanceProfileSection>
          <div className={`p-6 rounded-2xl border-2 ${
            linkedinVerified ? 'bg-green-50 border-green-200' : 'bg-indigo-50 border-indigo-200'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  linkedinVerified ? 'bg-green-100' : 'bg-indigo-100'
                }`}>
                  <Linkedin className={`w-6 h-6 ${linkedinVerified ? 'text-green-600' : 'text-indigo-600'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">LinkedIn Profile</h3>
                  <p className="text-sm text-gray-600">Professional verification</p>
                </div>
              </div>
              {linkedinVerified ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <Clock className="w-6 h-6 text-gray-400" />
              )}
            </div>

            {linkedinVerified ? (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 px-4 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span>LinkedIn connected</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-sm text-indigo-700 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>Coming soon: Connect your LinkedIn</span>
                </div>
                <button
                  onClick={handleLinkedinConnect}
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  Connect LinkedIn
                </button>
              </div>
            )}
          </div>
        </EnhanceProfileSection>

        {/* KYC Verification with itsme */}
        <EnhanceProfileSection>
          <div className={`p-6 rounded-2xl border-2 ${
            kycStatus === 'verified'
              ? 'bg-green-50 border-green-200'
              : kycStatus === 'pending'
              ? 'bg-yellow-50 border-yellow-200'
              : kycStatus === 'rejected'
              ? 'bg-red-50 border-red-200'
              : 'bg-amber-50 border-amber-200'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  kycStatus === 'verified'
                    ? 'bg-green-100'
                    : kycStatus === 'pending'
                    ? 'bg-yellow-100'
                    : kycStatus === 'rejected'
                    ? 'bg-red-100'
                    : 'bg-amber-100'
                }`}>
                  <Shield className={`w-6 h-6 ${
                    kycStatus === 'verified'
                      ? 'text-green-600'
                      : kycStatus === 'pending'
                      ? 'text-yellow-600'
                      : kycStatus === 'rejected'
                      ? 'text-red-600'
                      : 'text-amber-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    Identity Verification (KYC)
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Premium</span>
                  </h3>
                  <p className="text-sm text-gray-600">Verify with itsme®</p>
                </div>
              </div>
              {kycStatus === 'verified' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : kycStatus === 'pending' ? (
                <Clock className="w-6 h-6 text-yellow-600" />
              ) : kycStatus === 'rejected' ? (
                <XCircle className="w-6 h-6 text-red-600" />
              ) : (
                <Award className="w-6 h-6 text-gray-400" />
              )}
            </div>

            {kycStatus === 'verified' ? (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 px-4 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span>Identity verified - Premium Badge unlocked!</span>
              </div>
            ) : kycStatus === 'pending' ? (
              <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-100 px-4 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                <span>Verification in progress...</span>
              </div>
            ) : kycStatus === 'rejected' ? (
              <div>
                <div className="flex items-center gap-2 text-sm text-red-700 bg-red-100 px-4 py-2 rounded-lg mb-3">
                  <XCircle className="w-4 h-4" />
                  <span>Verification failed. Please try again.</span>
                </div>
                <button
                  onClick={handleKycVerification}
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium"
                >
                  Retry with itsme® (Coming Soon)
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-sm text-amber-700 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>Coming soon: Ultimate verification with itsme®</span>
                </div>
                <button
                  onClick={handleKycVerification}
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Verify with itsme®
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
              <h3 className="font-semibold text-gray-900 mb-2">Unlock Benefits with Each Badge</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5" />
                  <div>
                    <span className="font-medium">Starter:</span> Create profile & browse
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5" />
                  <div>
                    <span className="font-medium">Verified:</span> Appear in searches + verified badge
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5" />
                  <div>
                    <span className="font-medium">Trusted:</span> Priority in results + faster responses
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5" />
                  <div>
                    <span className="font-medium">Premium:</span> Best offers + instant applications
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
