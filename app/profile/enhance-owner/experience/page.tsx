'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Building, Heart, DollarSign, Handshake, TrendingUp, Sparkles, type LucideIcon } from 'lucide-react';
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
} from '@/components/enhance-profile';

export default function OwnerExperiencePage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [experienceYears, setExperienceYears] = useState('');
  const [managementStyle, setManagementStyle] = useState('');
  const [primaryMotivation, setPrimaryMotivation] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('ownerExperience', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setExperienceYears(saved.experienceYears || profileData.experience_years || '');
          setManagementStyle(saved.managementStyle || profileData.management_style || '');
          setPrimaryMotivation(saved.primaryMotivation || profileData.primary_motivation || '');
          setBio(saved.bio || profileData.owner_bio || '');
        } else if (saved.experienceYears) {
          setExperienceYears(saved.experienceYears);
          setManagementStyle(saved.managementStyle || '');
          setPrimaryMotivation(saved.primaryMotivation || '');
          setBio(saved.bio || '');
        }
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading experience data:', error);
      toast.error(t('enhanceOwner.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    safeLocalStorage.set('ownerExperience', {
      experienceYears,
      managementStyle,
      primaryMotivation,
      bio,
    });
    toast.success(t('enhanceOwner.experience.saved'));
    router.push('/dashboard/my-profile-owner');
  };

  const handleCancel = () => {
    router.push('/dashboard/my-profile-owner');
  };

  const canContinue = experienceYears && managementStyle && primaryMotivation;

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
        title={t('enhanceOwner.experience.title')}
        description={t('enhanceOwner.experience.description')}
        icon={<Award className="w-8 h-8 text-purple-600" />}
      />

      <div className="space-y-6">
        {/* Experience Years */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            {t('enhanceOwner.experience.yearsLabel')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: '0', key: 'lessThan1Year' },
              { value: '1-2', key: 'years1to2' },
              { value: '3-5', key: 'years3to5' },
              { value: '5-10', key: 'years5to10' },
              { value: '10+', key: 'years10Plus' },
            ].map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="owner"
                selected={experienceYears === option.value}
                onClick={() => setExperienceYears(option.value)}
              >
                {t(`enhanceOwner.experience.years.${option.key}`)}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Management Style */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Building className="w-4 h-4 text-blue-600" />
            </div>
            {t('enhanceOwner.experience.managementLabel')}
          </label>
          <div className="space-y-2">
            {[
              { value: 'self-managed', key: 'selfManaged' },
              { value: 'agency', key: 'agency' },
              { value: 'hybrid', key: 'hybrid' },
            ].map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="owner"
                selected={managementStyle === option.value}
                onClick={() => setManagementStyle(option.value)}
                className="text-left"
              >
                <div className="font-semibold text-gray-900">{t(`enhanceOwner.experience.management.${option.key}.label`)}</div>
                <div className="text-sm text-gray-500">{t(`enhanceOwner.experience.management.${option.key}.desc`)}</div>
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Primary Motivation */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Heart className="w-4 h-4 text-green-600" />
            </div>
            {t('enhanceOwner.experience.motivationLabel')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(() => {
              const MOTIVATION_ICONS: Record<string, LucideIcon> = {
                DollarSign,
                Handshake,
                TrendingUp,
                Sparkles,
              };
              const motivationOptions = [
                { value: 'income', key: 'income', iconName: 'DollarSign' },
                { value: 'community', key: 'community', iconName: 'Handshake' },
                { value: 'investment', key: 'investment', iconName: 'TrendingUp' },
                { value: 'other', key: 'other', iconName: 'Sparkles' },
              ];
              return motivationOptions.map((option) => {
                const MotivationIcon = MOTIVATION_ICONS[option.iconName] || Sparkles;
                const isSelected = primaryMotivation === option.value;
                return (
                  <EnhanceProfileSelectionCard
                    key={option.value}
                    role="owner"
                    selected={isSelected}
                    onClick={() => setPrimaryMotivation(option.value)}
                  >
                    <MotivationIcon className={`w-6 h-6 mx-auto mb-1 ${isSelected ? 'text-purple-600' : 'text-gray-400'}`} />
                    <div className="text-sm font-semibold">{t(`enhanceOwner.experience.motivation.${option.key}`)}</div>
                  </EnhanceProfileSelectionCard>
                );
              });
            })()}
          </div>
        </EnhanceProfileSection>

        {/* Bio */}
        <EnhanceProfileSection>
          <EnhanceProfileTextarea
            role="owner"
            label={t('enhanceOwner.experience.bioLabel')}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder={t('enhanceOwner.experience.bioPlaceholder')}
          />
        </EnhanceProfileSection>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full py-4 superellipse-xl font-semibold transition-all duration-300 ${
            canContinue
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              : 'bg-transparent border-2 border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
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
