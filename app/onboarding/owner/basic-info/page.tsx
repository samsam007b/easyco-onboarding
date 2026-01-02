'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Phone, Globe } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingInput,
  OnboardingButton,
} from '@/components/onboarding';
import { InvitationModal } from '@/components/invitation';
import { getPendingInvitation, type PendingInvitationContext } from '@/types/invitation.types';

export default function OwnerBasicInfo() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationality, setNationality] = useState('');
  const [pendingInvitation, setPendingInvitation] = useState<PendingInvitationContext | null>(null);
  const [showInvitationModal, setShowInvitationModal] = useState(false);

  useEffect(() => {
    loadExistingData();
  }, []);

  // Check for pending invitation from sessionStorage
  useEffect(() => {
    const invitation = getPendingInvitation();
    if (invitation) {
      setPendingInvitation(invitation);
    }
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('ownerBasicInfo', {}) as any;
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setFirstName(saved.firstName || profileData.first_name || '');
          setLastName(saved.lastName || profileData.last_name || '');
          setPhoneNumber(saved.phoneNumber || profileData.phone_number || '');
          setNationality(saved.nationality || profileData.nationality || '');
        } else if (saved.firstName) {
          setFirstName(saved.firstName);
          setLastName(saved.lastName);
          setPhoneNumber(saved.phoneNumber);
          setNationality(saved.nationality);
        }
      }
    } catch (error) {
      toast.error(onboarding.errors.loadFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error(onboarding.errors.enterName);
      return;
    }
    if (!phoneNumber.trim()) {
      toast.error(onboarding.errors.enterPhone);
      return;
    }

    safeLocalStorage.set('ownerBasicInfo', {
      firstName,
      lastName,
      phoneNumber,
      nationality,
    });

    // If there's a pending invitation, show confirmation modal
    if (pendingInvitation) {
      setShowInvitationModal(true);
      return;
    }

    router.push('/onboarding/owner/about');
  };

  const handleInvitationAccepted = () => {
    setShowInvitationModal(false);
    setPendingInvitation(null);
    toast.success(onboarding.owner.invitation?.accepted || 'Invitation accepted! Welcome to the coliving.');
    router.push('/onboarding/owner/about');
  };

  const handleInvitationRefused = () => {
    setShowInvitationModal(false);
    setPendingInvitation(null);
    toast.info(onboarding.owner.invitation?.refused || 'Invitation refused. You can find it in your settings.');
    router.push('/onboarding/owner/about');
  };

  const canContinue = firstName && lastName && phoneNumber;

  return (
    <OnboardingLayout
      role="owner"
      backUrl="/"
      backLabel={common.back}
      progress={{
        current: 1,
        total: 3,
        label: `${onboarding.progress.step} 1 ${onboarding.progress.of} 3`,
        stepName: onboarding.owner.welcomeTitle,
      }}
      isLoading={isLoading}
      loadingText={common.loadingInfo}
    >
      <OnboardingHeading
        role="owner"
        title={onboarding.owner.welcomeTitle}
        description={onboarding.owner.welcomeSubtitle}
      />

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100">
        <h3 className="font-semibold text-purple-700 mb-2">{onboarding.owner.profileSetup}</h3>
        <p className="text-sm text-gray-600">{onboarding.owner.profileSetupHelp}</p>
      </div>

      <div className="space-y-6">
        {/* First Name */}
        <OnboardingInput
          role="owner"
          label={onboarding.basicInfo.firstName}
          required
          icon={User}
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder={onboarding.basicInfo.firstNamePlaceholder}
        />

        {/* Last Name */}
        <OnboardingInput
          role="owner"
          label={onboarding.basicInfo.lastName}
          required
          icon={User}
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder={onboarding.basicInfo.lastNamePlaceholder}
        />

        {/* Phone Number */}
        <div>
          <OnboardingInput
            role="owner"
            label={onboarding.owner.phoneNumber}
            required
            icon={Phone}
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder={onboarding.owner.phoneNumberPlaceholder}
          />
          <p className="mt-2 text-xs text-gray-500">{onboarding.owner.phoneNumberHelp}</p>
        </div>

        {/* Nationality */}
        <OnboardingInput
          role="owner"
          label={onboarding.basicInfo.nationality}
          icon={Globe}
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          placeholder={onboarding.basicInfo.nationalityPlaceholder}
        />
      </div>

      <div className="mt-8">
        <OnboardingButton
          role="owner"
          onClick={handleContinue}
          disabled={!canContinue}
        >
          {common.continue}
        </OnboardingButton>
      </div>

      {/* Invitation Confirmation Modal */}
      {pendingInvitation && (
        <InvitationModal
          isOpen={showInvitationModal}
          onClose={() => setShowInvitationModal(false)}
          invitationId={pendingInvitation.invitationId}
          inviterName={pendingInvitation.inviter.name}
          inviterAvatar={pendingInvitation.inviter.avatar_url}
          invitedRole={pendingInvitation.invitedRole}
          propertyTitle={pendingInvitation.property.title}
          propertyAddress={pendingInvitation.property.address}
          propertyCity={pendingInvitation.property.city}
          onAccepted={handleInvitationAccepted}
          onRefused={handleInvitationRefused}
        />
      )}
    </OnboardingLayout>
  );
}
