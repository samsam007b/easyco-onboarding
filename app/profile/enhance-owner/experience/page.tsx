'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Building, Heart } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
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
      toast.error('Failed to load existing data');
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
    toast.success('Experience saved!');
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
      backLabel="Back to Profile"
      isLoading={isLoading}
      loadingText="Loading your information..."
    >
      <EnhanceProfileHeading
        role="owner"
        title="Your Hosting Journey"
        description="Share your experience and what drives you as a landlord"
        icon={<Award className="w-8 h-8 text-purple-600" />}
      />

      <div className="space-y-6">
        {/* Experience Years */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            Years of landlord experience
          </label>
          <select
            value={experienceYears}
            onChange={(e) => setExperienceYears(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
          >
            <option value="">Select...</option>
            <option value="0">Less than 1 year</option>
            <option value="1-2">1-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </EnhanceProfileSection>

        {/* Management Style */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Building className="w-4 h-4 text-blue-600" />
            </div>
            Property management style
          </label>
          <div className="space-y-2">
            {[
              { value: 'self-managed', label: 'Self-managed', desc: 'I handle everything personally' },
              { value: 'agency', label: 'Via Agency', desc: 'Professional property management' },
              { value: 'hybrid', label: 'Hybrid', desc: 'Mix of personal and agency management' },
            ].map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="owner"
                selected={managementStyle === option.value}
                onClick={() => setManagementStyle(option.value)}
                className="text-left"
              >
                <div className="font-semibold text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-500">{option.desc}</div>
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
            What drives you as a landlord?
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'income', label: 'Rental Income', emoji: '💰' },
              { value: 'community', label: 'Building Community', emoji: '🤝' },
              { value: 'investment', label: 'Investment Growth', emoji: '📈' },
              { value: 'other', label: 'Other', emoji: '✨' },
            ].map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="owner"
                selected={primaryMotivation === option.value}
                onClick={() => setPrimaryMotivation(option.value)}
              >
                <div className="text-2xl mb-1">{option.emoji}</div>
                <div className="text-sm font-semibold">{option.label}</div>
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Bio */}
        <EnhanceProfileSection>
          <EnhanceProfileTextarea
            role="owner"
            label="Tell tenants about yourself (optional)"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            maxLength={500}
            placeholder="e.g., I'm a passionate landlord who values creating comfortable, welcoming spaces for tenants..."
          />
        </EnhanceProfileSection>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-8">
        <EnhanceProfileButton
          role="owner"
          variant="outline"
          onClick={handleCancel}
          className="flex-1"
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
