'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Euro, Shield, Briefcase } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { getOnboardingData } from '@/lib/onboarding-helpers';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileSelectionCard,
  EnhanceProfileSection,
  EnhanceProfileInfoBox,
} from '@/components/enhance-profile';

export default function FinancialInfoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [incomeRange, setIncomeRange] = useState('');
  const [hasGuarantor, setHasGuarantor] = useState(false);
  const [employmentType, setEmploymentType] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        // Load from localStorage first
        const savedData = safeLocalStorage.get('financialInfo', {}) as any;
        if (savedData.incomeRange) setIncomeRange(savedData.incomeRange);
        if (savedData.hasGuarantor !== undefined) setHasGuarantor(savedData.hasGuarantor);
        if (savedData.employmentType) setEmploymentType(savedData.employmentType);

        // If nothing in localStorage, load from database
        if (!savedData.incomeRange && !savedData.employmentType) {
          const { data: profileData } = await getOnboardingData(user.id);
          if (profileData) {
            setIncomeRange(profileData.incomeRange || '');
            setHasGuarantor(profileData.hasGuarantor || false);
            setEmploymentType(profileData.employmentType || '');
          }
        }
      } catch (error) {
        // FIXME: Use logger.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleContinue = () => {
    safeLocalStorage.set('financialInfo', {
      incomeRange,
      hasGuarantor,
      employmentType,
    });
    router.push('/profile/enhance/community');
  };

  const handleSkip = () => {
    router.push('/profile/enhance/community');
  };

  const canContinue = incomeRange && employmentType;

  const incomeRanges = [
    { value: 'under-1000', label: '< €1,000' },
    { value: '1000-1500', label: '€1,000 - €1,500' },
    { value: '1500-2000', label: '€1,500 - €2,000' },
    { value: '2000-3000', label: '€2,000 - €3,000' },
    { value: '3000-5000', label: '€3,000 - €5,000' },
    { value: 'over-5000', label: '> €5,000' },
  ];

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/profile/enhance/values"
      backLabel="Back"
      progress={{
        current: 4,
        total: 6,
        label: 'Step 4 of 6',
        stepName: 'Financial Information',
      }}
      isLoading={isLoading}
      loadingText="Loading your information..."
    >
      <EnhanceProfileHeading
        role="searcher"
        title="Financial Information"
        description="Optional information to help landlords understand your financial situation"
        icon={<Euro className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Income range selector */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Euro className="w-4 h-4 text-green-600" />
            </div>
            Monthly income range
          </label>
          <div className="grid grid-cols-2 gap-3">
            {incomeRanges.map((range) => (
              <EnhanceProfileSelectionCard
                key={range.value}
                role="searcher"
                selected={incomeRange === range.value}
                onClick={() => setIncomeRange(range.value)}
              >
                {range.label}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Guarantor toggle */}
        <EnhanceProfileSection>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-700 block">I have a guarantor available</span>
                  <span className="text-sm text-gray-500">Someone who can vouch for rent payments</span>
                </div>
              </div>
              <button
                onClick={() => setHasGuarantor(!hasGuarantor)}
                className={`relative w-14 h-8 rounded-full transition flex-shrink-0 ${
                  hasGuarantor ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                    hasGuarantor ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </EnhanceProfileSection>

        {/* Employment type */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-orange-600" />
            </div>
            Employment type
          </label>
          <select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
          >
            <option value="">Select...</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="freelance">Freelance</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
            <option value="student">Student</option>
            <option value="unemployed">Unemployed</option>
          </select>
        </EnhanceProfileSection>

        {/* Privacy notice */}
        <EnhanceProfileInfoBox role="searcher">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Shield className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Your privacy matters</h3>
              <p className="text-sm text-gray-600">
                This information is only shared with verified landlords when you express interest in their properties.
                You can update or remove it anytime from your profile settings.
              </p>
            </div>
          </div>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action buttons */}
      <div className="space-y-3 mt-8">
        <EnhanceProfileButton
          role="searcher"
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full"
        >
          Continue
        </EnhanceProfileButton>
        <button
          onClick={handleSkip}
          className="w-full text-center text-sm text-gray-500 hover:text-gray-700 transition py-2"
        >
          Skip for now
        </button>
      </div>
    </EnhanceProfileLayout>
  );
}
