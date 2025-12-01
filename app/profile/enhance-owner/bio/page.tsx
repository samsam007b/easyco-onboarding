'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
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
  EnhanceProfileInfoBox,
} from '@/components/enhance-profile';

export default function OwnerBioPage() {
  const router = useRouter();
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
      toast.error('Failed to load existing data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    safeLocalStorage.set('ownerBio', {
      ownerBio,
      primaryMotivation,
    });
    toast.success('Bio saved!');
    router.push('/dashboard/my-profile-owner');
  };

  const handleCancel = () => {
    router.push('/dashboard/my-profile-owner');
  };

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
        title="Owner Bio & Story"
        description="Share your hosting philosophy and what makes you a great landlord"
        icon={<FileText className="w-8 h-8 text-purple-600" />}
      />

      <div className="space-y-6">
        {/* Primary Motivation */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What motivated you to become a property owner?
          </label>
          <div className="space-y-2">
            {[
              { value: 'investment', label: 'Investment & passive income' },
              { value: 'community', label: 'Building community' },
              { value: 'help_others', label: 'Helping people find homes' },
              { value: 'business', label: 'Property management business' },
              { value: 'other', label: 'Other' },
            ].map((option) => (
              <EnhanceProfileSelectionCard
                key={option.value}
                role="owner"
                selected={primaryMotivation === option.value}
                onClick={() => setPrimaryMotivation(option.value)}
                className="text-left"
              >
                {option.label}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Owner Bio */}
        <EnhanceProfileSection>
          <EnhanceProfileTextarea
            role="owner"
            label="Tell your story"
            value={ownerBio}
            onChange={(e) => setOwnerBio(e.target.value)}
            rows={6}
            maxLength={500}
            placeholder="Share your hosting philosophy, what makes your property special, and what you're looking for in ideal tenants..."
          />
        </EnhanceProfileSection>

        {/* Tips */}
        <EnhanceProfileInfoBox role="owner" title="Tips for a great bio:">
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Describe your property management style</li>
            <li>Mention what makes your property unique</li>
            <li>Share what you value in tenants</li>
            <li>Be authentic and personable</li>
          </ul>
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
          onClick={handleSave}
          className="flex-1"
        >
          Save Changes
        </EnhanceProfileButton>
      </div>
    </EnhanceProfileLayout>
  );
}
