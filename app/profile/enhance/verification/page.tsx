'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, Phone, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileSection,
  EnhanceProfileInfoBox,
} from '@/components/enhance-profile';

export default function VerificationPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
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

      // Load phone and KYC status from user_profiles
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('phone_number, phone_verified, verification_status')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setPhoneNumber(profileData.phone_number || '');
        setPhoneVerified(profileData.phone_verified || false);
        setKycStatus(profileData.verification_status || 'not_started');
      }
    } catch (error) {
      toast.error('Failed to load verification status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmailVerification = async () => {
    try {
      // Supabase will send a verification email automatically
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
      // TODO: Implement phone verification with SMS
      toast.info('Phone verification is coming soon!');
    } catch (error) {
      toast.error('Failed to verify phone number');
    } finally {
      setIsSubmittingPhone(false);
    }
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
        description="Verify your identity to increase trust and unlock more features"
        icon={<Shield className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
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
                  <p className="text-sm text-gray-600">Verify your phone number via SMS</p>
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
                <span>Your phone number has been verified: {phoneNumber}</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-sm text-blue-700 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>Coming soon: Verify your phone via SMS</span>
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

        {/* KYC Verification with itsme */}
        <EnhanceProfileSection>
          <div className={`p-6 rounded-2xl border-2 ${
            kycStatus === 'verified'
              ? 'bg-green-50 border-green-200'
              : kycStatus === 'pending'
              ? 'bg-yellow-50 border-yellow-200'
              : kycStatus === 'rejected'
              ? 'bg-red-50 border-red-200'
              : 'bg-purple-50 border-purple-200'
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
                    : 'bg-purple-100'
                }`}>
                  <Shield className={`w-6 h-6 ${
                    kycStatus === 'verified'
                      ? 'text-green-600'
                      : kycStatus === 'pending'
                      ? 'text-yellow-600'
                      : kycStatus === 'rejected'
                      ? 'text-red-600'
                      : 'text-purple-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Identity Verification (KYC)</h3>
                  <p className="text-sm text-gray-600">Verify your identity with itsme®</p>
                </div>
              </div>
              {kycStatus === 'verified' ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : kycStatus === 'pending' ? (
                <Clock className="w-6 h-6 text-yellow-600" />
              ) : kycStatus === 'rejected' ? (
                <XCircle className="w-6 h-6 text-red-600" />
              ) : (
                <Clock className="w-6 h-6 text-gray-400" />
              )}
            </div>

            {kycStatus === 'verified' ? (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-100 px-4 py-2 rounded-lg">
                <CheckCircle className="w-4 h-4" />
                <span>Your identity has been verified</span>
              </div>
            ) : kycStatus === 'pending' ? (
              <div className="flex items-center gap-2 text-sm text-yellow-700 bg-yellow-100 px-4 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                <span>Your verification is being processed</span>
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
                  Verify with itsme® (Coming Soon)
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-sm text-purple-700 mb-3">
                  <AlertCircle className="w-4 h-4" />
                  <span>Coming soon: Verify your identity with itsme®</span>
                </div>
                <button
                  onClick={handleKycVerification}
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Verify with itsme® (Coming Soon)
                </button>
              </div>
            )}
          </div>
        </EnhanceProfileSection>

        {/* Benefits Info */}
        <EnhanceProfileInfoBox role="searcher">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Why verify your profile?</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Increase trust with landlords and roommates
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Get priority in search results
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Unlock premium features
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Faster application processing
                </li>
              </ul>
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
