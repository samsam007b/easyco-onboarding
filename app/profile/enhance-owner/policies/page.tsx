'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, PawPrint, Cigarette, Calendar, Euro } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
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
      toast.error('Failed to load existing data');
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
    toast.success('Policies saved!');
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
      backLabel="Back to Profile"
      isLoading={isLoading}
      loadingText="Loading your information..."
    >
      <EnhanceProfileHeading
        role="owner"
        title="Your Rental Policies"
        description="Set clear expectations for potential tenants"
        icon={<Shield className="w-8 h-8 text-purple-600" />}
      />

      <div className="space-y-6">
        {/* Pets Policy */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <PawPrint className="w-4 h-4 text-orange-600" />
            </div>
            Do you allow pets?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <EnhanceProfileSelectionCard
              role="owner"
              selected={petsAllowed === true}
              onClick={() => setPetsAllowed(true)}
            >
              <div className="text-2xl mb-1">🐕</div>
              <div className="text-sm font-semibold">Yes, pets allowed</div>
            </EnhanceProfileSelectionCard>
            <EnhanceProfileSelectionCard
              role="owner"
              selected={petsAllowed === false}
              onClick={() => setPetsAllowed(false)}
            >
              <div className="text-2xl mb-1">🚫</div>
              <div className="text-sm font-semibold">No pets</div>
            </EnhanceProfileSelectionCard>
          </div>
        </EnhanceProfileSection>

        {/* Smoking Policy */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <Cigarette className="w-4 h-4 text-red-600" />
            </div>
            Do you allow smoking?
          </label>
          <div className="grid grid-cols-2 gap-3">
            <EnhanceProfileSelectionCard
              role="owner"
              selected={smokingAllowed === true}
              onClick={() => setSmokingAllowed(true)}
            >
              <div className="text-2xl mb-1">✅</div>
              <div className="text-sm font-semibold">Smoking allowed</div>
            </EnhanceProfileSelectionCard>
            <EnhanceProfileSelectionCard
              role="owner"
              selected={smokingAllowed === false}
              onClick={() => setSmokingAllowed(false)}
            >
              <div className="text-2xl mb-1">🚭</div>
              <div className="text-sm font-semibold">Non-smoking</div>
            </EnhanceProfileSelectionCard>
          </div>
        </EnhanceProfileSection>

        {/* Minimum Lease Duration */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            Minimum lease duration (optional)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: '', label: 'No preference' },
              { value: '1', label: '1 month' },
              { value: '3', label: '3 months' },
              { value: '6', label: '6 months' },
              { value: '12', label: '12 months' },
            ].map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value || 'none'}
                role="owner"
                selected={minimumLeaseDuration === option.value}
                onClick={() => setMinimumLeaseDuration(option.value)}
              >
                {option.label}
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
            Typical deposit (optional)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: '', label: 'Not specified' },
              { value: 'half-month', label: 'Half month\'s rent' },
              { value: '1-month', label: '1 month\'s rent' },
              { value: '2-months', label: '2 months\' rent' },
              { value: 'negotiable', label: 'Negotiable' },
            ].map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value || 'none'}
                role="owner"
                selected={depositAmount === option.value}
                onClick={() => setDepositAmount(option.value)}
              >
                {option.label}
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
            Notice period for move-out (optional)
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: '', label: 'Not specified' },
              { value: '1-month', label: '1 month' },
              { value: '2-months', label: '2 months' },
              { value: '3-months', label: '3 months' },
            ].map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value || 'none'}
                role="owner"
                selected={noticePeriod === option.value}
                onClick={() => setNoticePeriod(option.value)}
              >
                {option.label}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Info box */}
        <EnhanceProfileInfoBox role="owner" title="Tip:">
          <p className="text-sm text-gray-700">
            Clear policies help attract the right tenants and avoid misunderstandings later.
          </p>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-8">
        <button
          onClick={handleContinue}
          disabled={!canContinue}
          className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
            canContinue
              ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
              : 'bg-transparent border-2 border-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Save Changes
        </button>
        <button
          onClick={handleCancel}
          className="w-full text-center text-sm text-transparent hover:text-gray-600 transition-colors duration-200 py-2"
        >
          Cancel
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
