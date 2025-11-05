'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PartyPopper, Users, UtensilsCrossed, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

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
      router.push('/dashboard/my-profile-resident');
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
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-6">
      <div className="max-w-md mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard/my-profile-resident')}
          className="mb-6 text-[#4A148C] hover:opacity-70 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#4A148C] mb-2">
            Community & Events
          </h1>
          <p className="text-gray-600">
            How interested are you in community events, parties, and social gatherings?
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Event participation interest */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <PartyPopper className="w-4 h-4 text-orange-600" />
              </div>
              Event participation interest
            </label>
            <div className="grid grid-cols-3 gap-3">
              {interestLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setEventInterest(level.value)}
                  className={`p-4 rounded-xl transition border-2 flex flex-col items-center gap-2 ${
                    eventInterest === level.value
                      ? 'bg-[#4A148C] text-white border-[#4A148C]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#4A148C]'
                  }`}
                >
                  <span className="text-3xl">{level.emoji}</span>
                  <span className="font-semibold text-sm">{level.label}</span>
                  <span className={`text-xs text-center ${
                    eventInterest === level.value ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    {level.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Shared meals toggle */}
          <div className="p-4 rounded-xl bg-yellow-50 border-2 border-yellow-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-700 block">I'd enjoy shared meals</span>
                  <span className="text-sm text-gray-500">Cook and eat together with flatmates</span>
                </div>
              </div>
              <button
                onClick={() => setEnjoySharedMeals(!enjoySharedMeals)}
                className={`relative w-14 h-8 rounded-full transition flex-shrink-0 ${
                  enjoySharedMeals ? 'bg-[#FFD600]' : 'bg-gray-300'
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
          <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <span className="font-medium text-gray-700 block">Open to flatmate meetups</span>
                  <span className="text-sm text-gray-500">Hang out, watch movies, game nights</span>
                </div>
              </div>
              <button
                onClick={() => setOpenToMeetups(!openToMeetups)}
                className={`relative w-14 h-8 rounded-full transition flex-shrink-0 ${
                  openToMeetups ? 'bg-blue-500' : 'bg-gray-300'
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
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 border border-orange-200">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <Sparkles className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Community Perks</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Connect with neighbors who share your interests
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Get invited to building events that match your style
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Build lasting friendships in your community
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-12">
          <Button
            onClick={() => router.push('/dashboard/my-profile-resident')}
            variant="outline"
            className="flex-1"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canContinue || isSaving}
            className="flex-1 bg-[#FFD600] text-black hover:bg-[#FFD600]/90"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    </main>
  );
}
