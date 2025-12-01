'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { PartyPopper, Users, UtensilsCrossed, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileSelectionCard,
  EnhanceProfileInfoBox,
  EnhanceProfileSection,
} from '@/components/enhance-profile';

export default function CommunityEventsResidentPage() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const common = getSection('common');
  const [eventInterest, setEventInterest] = useState<'low' | 'medium' | 'high' | ''>('');
  const [enjoySharedMeals, setEnjoySharedMeals] = useState(false);
  const [openToMeetups, setOpenToMeetups] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('community_preferences')
        .eq('user_id', user.id)
        .single();

      if (profileData?.community_preferences) {
        const prefs = profileData.community_preferences;
        setEventInterest(prefs.eventInterest || '');
        setEnjoySharedMeals(prefs.enjoySharedMeals || false);
        setOpenToMeetups(prefs.openToMeetups || false);
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading community preferences:', error);
    }
  };

  const handleSave = async () => {
    if (!eventInterest) {
      toast.error('Please select your event interest level');
      return;
    }

    setIsSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const communityPreferences = {
        eventInterest,
        enjoySharedMeals,
        openToMeetups,
      };

      const { error } = await supabase
        .from('user_profiles')
        .update({ community_preferences: communityPreferences })
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Community preferences saved!');
      router.push('/dashboard/resident');
    } catch (error) {
      // FIXME: Use logger.error('Error saving community preferences:', error);
      toast.error(common.errors.unexpected);
    } finally {
      setIsSaving(false);
    }
  };

  const canContinue = eventInterest !== '';

  const interestLevels = [
    { value: 'low' as const, emoji: '😐', label: 'Low', description: 'Prefer quiet independence' },
    { value: 'medium' as const, emoji: '😊', label: 'Medium', description: 'Occasional socializing' },
    { value: 'high' as const, emoji: '🎉', label: 'High', description: 'Love community events!' },
  ];

  return (
    <EnhanceProfileLayout
      role="resident"
      backUrl="/dashboard/resident"
      backLabel="Back to Dashboard"
    >
      {/* Header */}
      <EnhanceProfileHeading
        role="resident"
        title="Community & Events"
        description="How interested are you in community events, parties, and social gatherings?"
        icon={<PartyPopper className="w-8 h-8 text-orange-600" />}
      />

      {/* Form */}
      <div className="space-y-6">
        {/* Event participation interest */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <PartyPopper className="w-4 h-4 text-orange-600" />
            </div>
            Event participation interest
          </label>
          <div className="grid grid-cols-3 gap-3">
            {interestLevels.map((level) => (
              <EnhanceProfileSelectionCard
                key={level.value}
                role="resident"
                selected={eventInterest === level.value}
                onClick={() => setEventInterest(level.value)}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">{level.emoji}</span>
                  <span className="font-semibold text-sm">{level.label}</span>
                  <span className="text-xs text-center text-gray-500">
                    {level.description}
                  </span>
                </div>
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Shared meals toggle */}
        <div className="p-4 rounded-xl bg-orange-50 border-2 border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <span className="font-medium text-gray-700 block">I'd enjoy shared meals</span>
                <span className="text-sm text-gray-500">Cook and eat together with flatmates</span>
              </div>
            </div>
            <button
              onClick={() => setEnjoySharedMeals(!enjoySharedMeals)}
              className={`relative w-14 h-8 rounded-full transition flex-shrink-0 ${
                enjoySharedMeals ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                  enjoySharedMeals ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Flatmate meetups toggle */}
        <div className="p-4 rounded-xl bg-orange-50 border-2 border-orange-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <span className="font-medium text-gray-700 block">Open to flatmate meetups</span>
                <span className="text-sm text-gray-500">Hang out, watch movies, game nights</span>
              </div>
            </div>
            <button
              onClick={() => setOpenToMeetups(!openToMeetups)}
              className={`relative w-14 h-8 rounded-full transition flex-shrink-0 ${
                openToMeetups ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                  openToMeetups ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Community perks callout */}
        <EnhanceProfileInfoBox role="resident" title="Community Perks" icon="✨">
          <ul className="space-y-1">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Connect with neighbors who share your interests
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Get invited to building events that match your style
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              Build lasting friendships in your community
            </li>
          </ul>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mt-8">
        <EnhanceProfileButton
          role="resident"
          variant="outline"
          onClick={() => router.push('/dashboard/resident')}
          disabled={isSaving}
        >
          Cancel
        </EnhanceProfileButton>
        <EnhanceProfileButton
          role="resident"
          onClick={handleSave}
          disabled={!canContinue || isSaving}
          className="flex-1"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </EnhanceProfileButton>
      </div>
    </EnhanceProfileLayout>
  );
}
