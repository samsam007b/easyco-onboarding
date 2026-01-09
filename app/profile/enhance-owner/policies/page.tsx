'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, PawPrint, Cigarette, Calendar, Euro, Check, Ban } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileSelectionCard,
  EnhanceProfileSection,
  EnhanceProfileInfoBox,
} from '@/components/enhance-profile';

export default function OwnerPoliciesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [petsAllowed, setPetsAllowed] = useState<boolean | null>(null);
  const [smokingAllowed, setSmokingAllowed] = useState<boolean | null>(null);
  const [minimumLeaseDuration, setMinimumLeaseDuration] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('ownerPolicies', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setPetsAllowed(saved.petsAllowed !== undefined ? saved.petsAllowed : profileData.pets_allowed);
          setSmokingAllowed(saved.smokingAllowed !== undefined ? saved.smokingAllowed : profileData.smoking_allowed);
          setMinimumLeaseDuration(saved.minimumLeaseDuration || profileData.minimum_lease_duration || '');
          setDepositAmount(saved.depositAmount || profileData.deposit_amount || '');
          setNoticePeriod(saved.noticePeriod || profileData.notice_period || '');
        } else if (saved.petsAllowed !== undefined) {
          setPetsAllowed(saved.petsAllowed);
          setSmokingAllowed(saved.smokingAllowed);
          setMinimumLeaseDuration(saved.minimumLeaseDuration || '');
          setDepositAmount(saved.depositAmount || '');
          setNoticePeriod(saved.noticePeriod || '');
        }
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading policies data:', error);
      toast.error(t('enhanceOwner.errors.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    safeLocalStorage.set('ownerPolicies', {
      petsAllowed,
      smokingAllowed,
      minimumLeaseDuration,
      depositAmount,
      noticePeriod,
    });
    toast.success(t('enhanceOwner.policies.saved'));
    router.push('/dashboard/my-profile-owner');
  };

  const handleCancel = () => {
    router.push('/dashboard/my-profile-owner');
  };

  const canContinue = petsAllowed !== null && smokingAllowed !== null;

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
        title={t('enhanceOwner.policies.title')}
        description={t('enhanceOwner.policies.description')}
        icon={<Shield className="w-8 h-8 text-purple-600" />}
      />

      <div className="space-y-6">
        {/* Pets Policy */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-orange-600" />
            </div>
            {t('enhanceOwner.policies.pets.label')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <EnhanceProfileSelectionCard
              role="owner"
              selected={petsAllowed === true}
              onClick={() => setPetsAllowed(true)}
            >
              <PawPrint className={`w-6 h-6 mx-auto mb-1 ${petsAllowed === true ? 'text-purple-600' : 'text-gray-400'}`} />
              <div className="text-sm font-semibold">{t('enhanceOwner.policies.pets.yes')}</div>
            </EnhanceProfileSelectionCard>
            <EnhanceProfileSelectionCard
              role="owner"
              selected={petsAllowed === false}
              onClick={() => setPetsAllowed(false)}
            >
              <Ban className={`w-6 h-6 mx-auto mb-1 ${petsAllowed === false ? 'text-purple-600' : 'text-gray-400'}`} />
              <div className="text-sm font-semibold">{t('enhanceOwner.policies.pets.no')}</div>
            </EnhanceProfileSelectionCard>
          </div>
        </EnhanceProfileSection>

        {/* Smoking Policy */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <Cigarette className="w-4 h-4 text-red-600" />
            </div>
            {t('enhanceOwner.policies.smoking.label')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <EnhanceProfileSelectionCard
              role="owner"
              selected={smokingAllowed === true}
              onClick={() => setSmokingAllowed(true)}
            >
              <Check className={`w-6 h-6 mx-auto mb-1 ${smokingAllowed === true ? 'text-purple-600' : 'text-gray-400'}`} />
              <div className="text-sm font-semibold">{t('enhanceOwner.policies.smoking.yes')}</div>
            </EnhanceProfileSelectionCard>
            <EnhanceProfileSelectionCard
              role="owner"
              selected={smokingAllowed === false}
              onClick={() => setSmokingAllowed(false)}
            >
              <Ban className={`w-6 h-6 mx-auto mb-1 ${smokingAllowed === false ? 'text-purple-600' : 'text-gray-400'}`} />
              <div className="text-sm font-semibold">{t('enhanceOwner.policies.smoking.no')}</div>
            </EnhanceProfileSelectionCard>
          </div>
        </EnhanceProfileSection>

        {/* Minimum Lease Duration */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            {t('enhanceOwner.policies.leaseDuration.label')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: '', key: 'noPreference' },
              { value: '1', key: 'month1' },
              { value: '3', key: 'months3' },
              { value: '6', key: 'months6' },
              { value: '12', key: 'months12' },
            ].map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value || 'none'}
                role="owner"
                selected={minimumLeaseDuration === option.value}
                onClick={() => setMinimumLeaseDuration(option.value)}
              >
                {t(`enhanceOwner.policies.leaseDuration.${option.key}`)}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Deposit Amount */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Euro className="w-4 h-4 text-green-600" />
            </div>
            {t('enhanceOwner.policies.deposit.label')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: '', key: 'notSpecified' },
              { value: 'half-month', key: 'halfMonth' },
              { value: '1-month', key: 'oneMonth' },
              { value: '2-months', key: 'twoMonths' },
              { value: 'negotiable', key: 'negotiable' },
            ].map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value || 'none'}
                role="owner"
                selected={depositAmount === option.value}
                onClick={() => setDepositAmount(option.value)}
              >
                {t(`enhanceOwner.policies.deposit.${option.key}`)}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Notice Period */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Shield className="w-4 h-4 text-yellow-600" />
            </div>
            {t('enhanceOwner.policies.noticePeriod.label')}
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: '', key: 'notSpecified' },
              { value: '1-month', key: 'month1' },
              { value: '2-months', key: 'months2' },
              { value: '3-months', key: 'months3' },
            ].map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value || 'none'}
                role="owner"
                selected={noticePeriod === option.value}
                onClick={() => setNoticePeriod(option.value)}
              >
                {t(`enhanceOwner.policies.noticePeriod.${option.key}`)}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Info box */}
        <EnhanceProfileInfoBox role="owner" title={t('enhanceOwner.policies.tip')}>
          <p className="text-sm text-gray-700">
            {t('enhanceOwner.policies.tipContent')}
          </p>
        </EnhanceProfileInfoBox>
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
