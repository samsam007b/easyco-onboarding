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
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            Minimum lease duration (optional)
          </label>
          <select
            value={minimumLeaseDuration}
            onChange={(e) => setMinimumLeaseDuration(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
          >
            <option value="">No preference</option>
            <option value="1">1 month</option>
            <option value="3">3 months</option>
            <option value="6">6 months</option>
            <option value="12">12 months</option>
          </select>
        </EnhanceProfileSection>

        {/* Deposit Amount */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Euro className="w-4 h-4 text-green-600" />
            </div>
            Typical deposit (optional)
          </label>
          <select
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
          >
            <option value="">Not specified</option>
            <option value="half-month">Half month's rent</option>
            <option value="1-month">1 month's rent</option>
            <option value="2-months">2 months' rent</option>
            <option value="negotiable">Negotiable</option>
          </select>
        </EnhanceProfileSection>

        {/* Notice Period */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <Shield className="w-4 h-4 text-yellow-600" />
            </div>
            Notice period for move-out (optional)
          </label>
          <select
            value={noticePeriod}
            onChange={(e) => setNoticePeriod(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
          >
            <option value="">Not specified</option>
            <option value="1-month">1 month</option>
            <option value="2-months">2 months</option>
            <option value="3-months">3 months</option>
          </select>
        </EnhanceProfileSection>

        {/* Info box */}
        <EnhanceProfileInfoBox role="owner" title="Tip:">
          <p className="text-sm text-gray-700">
            Clear policies help attract the right tenants and avoid misunderstandings later.
          </p>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mt-8">
        <EnhanceProfileButton
          role="owner"
          variant="outline"
          onClick={handleCancel}
        >
          Cancel
        </EnhanceProfileButton>
        <EnhanceProfileButton
          role="owner"
          onClick={handleContinue}
          disabled={!canContinue}
          className="flex-1"
        >
          Save Changes
        </EnhanceProfileButton>
      </div>
    </EnhanceProfileLayout>
  );
}
