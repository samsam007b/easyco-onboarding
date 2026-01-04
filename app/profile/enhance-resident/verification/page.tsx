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
  const { t, getSection } = useLanguage();
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
      toast.success(t('enhanceResident.verification.requestSubmitted'));
    } catch (error) {
      // FIXME: Use logger.error('Error requesting verification:', error);
      toast.error(common.errors.unexpected);
    }
  };

  return (
    <EnhanceProfileLayout
      role="resident"
      backUrl="/dashboard/resident"
      backLabel={t('enhanceResident.common.backToDashboard')}
      isLoading={isLoading}
      loadingText={t('enhanceResident.verification.loadingText')}
    >
      {verificationStatus === 'verified' ? (
        /* Already Verified */
        <>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('enhanceResident.verification.verified.title')}</h2>
            <p className="text-gray-600">
              {t('enhanceResident.verification.verified.description')}
            </p>
          </div>
          <EnhanceProfileButton
            role="resident"
            onClick={() => router.push('/dashboard/resident')}
          >
            {t('enhanceResident.common.backToDashboard')}
          </EnhanceProfileButton>
        </>
      ) : verificationStatus === 'pending' ? (
        /* Pending Verification */
        <>
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('enhanceResident.verification.pending.title')}</h2>
            <p className="text-gray-600">
              {t('enhanceResident.verification.pending.description')}
            </p>
          </div>
          <EnhanceProfileButton
            role="resident"
            variant="outline"
            onClick={() => router.push('/dashboard/resident')}
          >
            {t('enhanceResident.common.backToDashboard')}
          </EnhanceProfileButton>
        </>
      ) : (
        /* Not Verified - Show Benefits */
        <>
          <EnhanceProfileHeading
            role="resident"
            title={t('enhanceResident.verification.title')}
            description={t('enhanceResident.verification.description')}
            icon={<Shield className="w-8 h-8 text-orange-600" />}
          />

          <div className="space-y-6">
            <EnhanceProfileSection title={t('enhanceResident.verification.whyVerify')}>
              <div className="space-y-4">
                {[
                  {
                    icon: Shield,
                    titleKey: 'buildTrust',
                    descKey: 'buildTrustDesc'
                  },
                  {
                    icon: CheckCircle,
                    titleKey: 'standOut',
                    descKey: 'standOutDesc'
                  },
                  {
                    icon: Upload,
                    titleKey: 'easyProcess',
                    descKey: 'easyProcessDesc'
                  }
                ].map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 superellipse-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{t(`enhanceResident.verification.benefits.${benefit.titleKey}`)}</h3>
                        <p className="text-sm text-gray-600">{t(`enhanceResident.verification.benefits.${benefit.descKey}`)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </EnhanceProfileSection>

            <EnhanceProfileInfoBox role="resident" title={t('enhanceResident.verification.whatWeNeed')} icon="📋">
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  {t('enhanceResident.verification.requirements.validId')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  {t('enhanceResident.verification.requirements.selfie')}
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  {t('enhanceResident.verification.requirements.proofOfResidence')}
                </li>
              </ul>
            </EnhanceProfileInfoBox>

            <EnhanceProfileInfoBox role="resident" title={t('enhanceResident.verification.privacyProtected')} icon="🔒">
              {t('enhanceResident.verification.privacyContent')}
            </EnhanceProfileInfoBox>

            <div className="flex gap-4 mt-8">
              <EnhanceProfileButton
                role="resident"
                variant="outline"
                onClick={() => router.push('/dashboard/resident')}
              >
                {t('enhanceResident.verification.later')}
              </EnhanceProfileButton>
              <EnhanceProfileButton
                role="resident"
                onClick={handleRequestVerification}
                className="flex-1"
              >
                {t('enhanceResident.verification.startVerification')}
              </EnhanceProfileButton>
            </div>

            <p className="text-xs text-center text-gray-500">
              {t('enhanceResident.verification.processingTime')}
            </p>
          </div>
        </>
      )}
    </EnhanceProfileLayout>
  );
}
