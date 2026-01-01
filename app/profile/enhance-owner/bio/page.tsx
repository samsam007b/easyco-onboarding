'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileTextarea,
  EnhanceProfileButton,
  EnhanceProfileSelectionCard,
  EnhanceProfileSection,
  EnhanceProfileInfoBox,
} from '@/components/enhance-profile';

export default function OwnerBioPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [ownerBio, setOwnerBio] = useState('');
  const [primaryMotivation, setPrimaryMotivation] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('ownerBio', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setOwnerBio(saved.ownerBio || profileData.owner_bio || '');
          setPrimaryMotivation(saved.primaryMotivation || profileData.primary_motivation || '');
        } else if (saved.ownerBio) {
          setOwnerBio(saved.ownerBio);
          setPrimaryMotivation(saved.primaryMotivation || '');
        }
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading bio data:', error);
      toast.error(t('enhanceOwner.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    safeLocalStorage.set('ownerBio', {
      ownerBio,
      primaryMotivation,
    });
    toast.success(t('enhanceOwner.bio.saved'));
    router.push('/dashboard/my-profile-owner');
  };

  const handleCancel = () => {
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
        title={t('enhanceOwner.bio.title')}
        description={t('enhanceOwner.bio.description')}
        icon={<FileText className="w-8 h-8 text-purple-600" />}
      />

      <div className="space-y-6">
        {/* Primary Motivation */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('enhanceOwner.bio.motivationLabel')}
          </label>
          <div className="space-y-2">
            {[
              { value: 'investment', key: 'investment' },
              { value: 'community', key: 'community' },
              { value: 'help_others', key: 'helpOthers' },
              { value: 'business', key: 'business' },
              { value: 'other', key: 'other' },
            ].map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="owner"
                selected={primaryMotivation === option.value}
                onClick={() => setPrimaryMotivation(option.value)}
                className="text-left"
              >
                {t(`enhanceOwner.bio.motivations.${option.key}`)}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Owner Bio */}
        <EnhanceProfileSection>
          <EnhanceProfileTextarea
            role="owner"
            label={t('enhanceOwner.bio.storyLabel')}
            value={ownerBio}
            onChange={(e) => setOwnerBio(e.target.value)}
            rows={6}
            maxLength={500}
            placeholder={t('enhanceOwner.bio.storyPlaceholder')}
          />
        </EnhanceProfileSection>

        {/* Tips */}
        <EnhanceProfileInfoBox role="owner" title={t('enhanceOwner.bio.tipsTitle')}>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>{t('enhanceOwner.bio.tips.managementStyle')}</li>
            <li>{t('enhanceOwner.bio.tips.unique')}</li>
            <li>{t('enhanceOwner.bio.tips.values')}</li>
            <li>{t('enhanceOwner.bio.tips.authentic')}</li>
          </ul>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          {t('enhanceOwner.common.saveChanges')}
        </button>
        <button
          onClick={handleCancel}
          className="w-full text-center text-sm text-transparent hover:text-gray-600 transition-colors duration-200 py-2"
        >
          {t('common.cancel')}
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
