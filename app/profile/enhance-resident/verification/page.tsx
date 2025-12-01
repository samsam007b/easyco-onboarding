'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Shield, CheckCircle, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileInfoBox,
  EnhanceProfileSection,
} from '@/components/enhance-profile';

export default function VerificationResidentPage() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<string>('');

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('verification_status')
        .eq('user_id', user.id)
        .single();

      if (profileData?.verification_status) {
        setVerificationStatus(profileData.verification_status);
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading verification status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestVerification = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({ verification_status: 'pending' })
        .eq('user_id', user.id);

      if (error) throw error;

      setVerificationStatus('pending');
      toast.success('Verification request submitted! We\'ll review it soon.');
    } catch (error) {
      // FIXME: Use logger.error('Error requesting verification:', error);
      toast.error(common.errors.unexpected);
    }
  };

  return (
    <EnhanceProfileLayout
      role="resident"
      backUrl="/dashboard/resident"
      backLabel="Back to Dashboard"
      isLoading={isLoading}
      loadingText="Loading verification status..."
    >
      {verificationStatus === 'verified' ? (
        /* Already Verified */
        <>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're Verified!</h2>
            <p className="text-gray-600">
              Your profile has been verified. This helps build trust in the community.
            </p>
          </div>
          <EnhanceProfileButton
            role="resident"
            onClick={() => router.push('/dashboard/resident')}
          >
            Back to Dashboard
          </EnhanceProfileButton>
        </>
      ) : verificationStatus === 'pending' ? (
        /* Pending Verification */
        <>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Pending</h2>
            <p className="text-gray-600">
              Your verification request is being reviewed. We'll notify you once it's complete.
            </p>
          </div>
          <EnhanceProfileButton
            role="resident"
            variant="outline"
            onClick={() => router.push('/dashboard/resident')}
          >
            Back to Dashboard
          </EnhanceProfileButton>
        </>
      ) : (
        /* Not Verified - Show Benefits */
        <>
          <EnhanceProfileHeading
            role="resident"
            title="Profile Verification"
            description="Get verified to build trust with your community"
            icon={<Shield className="w-8 h-8 text-orange-600" />}
          />

          <div className="space-y-6">
            <EnhanceProfileSection title="Why Get Verified?">
              <div className="space-y-4">
                {[
                  {
                    icon: Shield,
                    title: 'Build Trust',
                    description: 'Show your neighbors you\'re a real, verified community member'
                  },
                  {
                    icon: CheckCircle,
                    title: 'Stand Out',
                    description: 'Get a verified badge on your profile'
                  },
                  {
                    icon: Upload,
                    title: 'Easy Process',
                    description: 'Simple verification process that takes just a few minutes'
                  }
                ].map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </EnhanceProfileSection>

            <EnhanceProfileInfoBox role="resident" title="What We'll Need" icon="📋">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Valid ID (passport, driver's license, or national ID)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  A selfie for identity confirmation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Proof of residence (optional, but recommended)
                </li>
              </ul>
            </EnhanceProfileInfoBox>

            <EnhanceProfileInfoBox role="resident" title="Your Privacy is Protected" icon="🔒">
              Your verification documents are encrypted and stored securely. They're only used for verification purposes and are never shared with other users.
            </EnhanceProfileInfoBox>

            <div className="flex gap-4 mt-8">
              <EnhanceProfileButton
                role="resident"
                variant="outline"
                onClick={() => router.push('/dashboard/resident')}
              >
                Later
              </EnhanceProfileButton>
              <EnhanceProfileButton
                role="resident"
                onClick={handleRequestVerification}
                className="flex-1"
              >
                Start Verification
              </EnhanceProfileButton>
            </div>

            <p className="text-xs text-center text-gray-500">
              Verification typically takes 1-2 business days
            </p>
          </div>
        </>
      )}
    </EnhanceProfileLayout>
  );
}
