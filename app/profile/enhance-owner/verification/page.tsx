'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Upload, CheckCircle } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileSection,
  EnhanceProfileInfoBox,
} from '@/components/enhance-profile';

export default function OwnerVerificationPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [idDocument, setIdDocument] = useState('');
  const [proofOfOwnership, setProofOfOwnership] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('ownerVerification', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setVerificationStatus(profileData.verification_status || 'pending');
          setIdDocument(saved.idDocument || profileData.id_document || '');
          setProofOfOwnership(saved.proofOfOwnership || profileData.proof_of_ownership || '');
        } else if (saved.idDocument) {
          setIdDocument(saved.idDocument);
          setProofOfOwnership(saved.proofOfOwnership || '');
        }
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading verification data:', error);
      toast.error(t('enhanceOwner.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    safeLocalStorage.set('ownerVerification', {
      idDocument,
      proofOfOwnership,
    });
    toast.success(t('enhanceOwner.verification.saved'));
    router.push('/dashboard/my-profile-owner');
  };

  const handleSkip = () => {
    router.push('/dashboard/my-profile-owner');
  };

  return (
    <EnhanceProfileLayout
      role="owner"
      backUrl="/dashboard/my-profile-owner"
      backLabel={t('enhanceOwner.common.backToProfile')}
      isLoading={isLoading}
      loadingText={t('enhanceOwner.common.loading')}
    >
      <EnhanceProfileHeading
        role="owner"
        title={t('enhanceOwner.verification.title')}
        description={t('enhanceOwner.verification.description')}
        icon={<Shield className="w-8 h-8 text-purple-600" />}
      />

      {/* Verification Status */}
      {verificationStatus === 'verified' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <h3 className="font-medium text-green-900">{t('enhanceOwner.verification.status.complete')}</h3>
            <p className="text-sm text-green-700">{t('enhanceOwner.verification.status.verified')}</p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* ID Document */}
        <EnhanceProfileSection>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-purple-600" />
            {t('enhanceOwner.verification.idDocument.title')}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {t('enhanceOwner.verification.idDocument.description')}
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">{t('enhanceOwner.verification.idDocument.uploadPrompt')}</p>
            <p className="text-xs text-gray-400 mt-1">{t('enhanceOwner.verification.idDocument.fileTypes')}</p>
          </div>
          {idDocument && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>{t('enhanceOwner.verification.idDocument.uploaded')}</span>
            </div>
          )}
        </EnhanceProfileSection>

        {/* Proof of Ownership */}
        <EnhanceProfileSection>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-purple-600" />
            {t('enhanceOwner.verification.proofOfOwnership.title')}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {t('enhanceOwner.verification.proofOfOwnership.description')}
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">{t('enhanceOwner.verification.idDocument.uploadPrompt')}</p>
            <p className="text-xs text-gray-400 mt-1">{t('enhanceOwner.verification.idDocument.fileTypes')}</p>
          </div>
          {proofOfOwnership && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span>{t('enhanceOwner.verification.proofOfOwnership.uploaded')}</span>
            </div>
          )}
        </EnhanceProfileSection>

        {/* Info Box */}
        <EnhanceProfileInfoBox role="owner" title={t('enhanceOwner.verification.whyMatters')}>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>{t('enhanceOwner.verification.benefits.trust')}</li>
            <li>{t('enhanceOwner.verification.benefits.visibility')}</li>
            <li>{t('enhanceOwner.verification.benefits.protection')}</li>
            <li>{t('enhanceOwner.verification.benefits.secure')}</li>
          </ul>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mt-8">
        <EnhanceProfileButton
          role="owner"
          variant="outline"
          onClick={handleSkip}
        >
          {t('enhanceOwner.verification.skipForNow')}
        </EnhanceProfileButton>
        <EnhanceProfileButton
          role="owner"
          onClick={handleSave}
          className="flex-1"
        >
          {t('enhanceOwner.verification.submitVerification')}
        </EnhanceProfileButton>
      </div>
    </EnhanceProfileLayout>
  );
}
