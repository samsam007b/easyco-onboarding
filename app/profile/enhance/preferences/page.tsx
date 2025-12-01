'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Home, Calendar } from 'lucide-react';
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

export default function AdvancedPreferencesPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [roomType, setRoomType] = useState('');
  const [bathroomType, setBathroomType] = useState('');
  const [leaseDuration, setLeaseDuration] = useState('');
  const [moveInFlexibility, setMoveInFlexibility] = useState('');
  const [petsPreference, setPetsPreference] = useState('');
  const [smokingPreference, setSmokingPreference] = useState('');
  const [quietHours, setQuietHours] = useState(false);
  const [guestsAllowed, setGuestsAllowed] = useState(false);

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('advancedPreferences', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData?.advanced_preferences) {
          const prefs = profileData.advanced_preferences;
          setRoomType(saved.roomType || prefs.room_type || '');
          setBathroomType(saved.bathroomType || prefs.bathroom_type || '');
          setLeaseDuration(saved.leaseDuration || prefs.lease_duration || '');
          setMoveInFlexibility(saved.moveInFlexibility || prefs.move_in_flexibility || '');
          setPetsPreference(saved.petsPreference || prefs.pets_preference || '');
          setSmokingPreference(saved.smokingPreference || prefs.smoking_preference || '');
          setQuietHours(saved.quietHours || prefs.quiet_hours || false);
          setGuestsAllowed(saved.guestsAllowed || prefs.guests_allowed || false);
        } else if (saved.roomType) {
          setRoomType(saved.roomType);
          setBathroomType(saved.bathroomType);
          setLeaseDuration(saved.leaseDuration);
          setMoveInFlexibility(saved.moveInFlexibility);
          setPetsPreference(saved.petsPreference);
          setSmokingPreference(saved.smokingPreference);
          setQuietHours(saved.quietHours || false);
          setGuestsAllowed(saved.guestsAllowed || false);
        }
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading preferences data:', error);
      toast.error('Failed to load existing data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    safeLocalStorage.set('advancedPreferences', {
      roomType,
      bathroomType,
      leaseDuration,
      moveInFlexibility,
      petsPreference,
      smokingPreference,
      quietHours,
      guestsAllowed,
    });
    toast.success('Preferences saved!');
    router.push('/dashboard/my-profile');
  };

  const handleCancel = () => {
    router.push('/dashboard/my-profile');
  };

  return (
    <EnhanceProfileLayout
      role="searcher"
      backUrl="/dashboard/my-profile"
      backLabel="Back to Profile"
      progress={undefined}
      isLoading={isLoading}
      loadingText="Loading your information..."
    >
      <EnhanceProfileHeading
        role="searcher"
        title="Advanced Preferences"
        description="Fine-tune your living preferences for better matches"
        icon={<Settings className="w-8 h-8 text-orange-600" />}
      />

      <div className="space-y-6">
        {/* Room Type */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Home className="w-5 h-5 text-orange-600" />
            Preferred Room Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['Private', 'Shared', 'Studio', 'Flexible'].map((type) => (
              <EnhanceProfileSelectionCard
                key={type}
                role="searcher"
                selected={roomType === type.toLowerCase()}
                onClick={() => setRoomType(type.toLowerCase())}
              >
                {type}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Bathroom Type */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Bathroom Preference
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['Private', 'Shared'].map((type) => (
              <EnhanceProfileSelectionCard
                key={type}
                role="searcher"
                selected={bathroomType === type.toLowerCase()}
                onClick={() => setBathroomType(type.toLowerCase())}
              >
                {type}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Lease Duration */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            Preferred Lease Duration
          </label>
          <select
            value={leaseDuration}
            onChange={(e) => setLeaseDuration(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition"
          >
            <option value="">Select...</option>
            <option value="1-3-months">1-3 months</option>
            <option value="3-6-months">3-6 months</option>
            <option value="6-12-months">6-12 months</option>
            <option value="12-months-plus">12+ months</option>
            <option value="flexible">Flexible</option>
          </select>
        </EnhanceProfileSection>

        {/* Move-in Flexibility */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Move-in Date Flexibility
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['Exact', 'Within 1 week', 'Flexible'].map((flex) => (
              <EnhanceProfileSelectionCard
                key={flex}
                role="searcher"
                selected={moveInFlexibility === flex.toLowerCase()}
                onClick={() => setMoveInFlexibility(flex.toLowerCase())}
              >
                {flex}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Pets Preference */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Pets Preference
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['I have pets', 'No pets', 'Open to pets'].map((pref) => (
              <EnhanceProfileSelectionCard
                key={pref}
                role="searcher"
                selected={petsPreference === pref.toLowerCase()}
                onClick={() => setPetsPreference(pref.toLowerCase())}
              >
                {pref}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Smoking Preference */}
        <EnhanceProfileSection>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Smoking Preference
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['Non-smoking only', 'Smoking outside OK'].map((pref) => (
              <EnhanceProfileSelectionCard
                key={pref}
                role="searcher"
                selected={smokingPreference === pref.toLowerCase()}
                onClick={() => setSmokingPreference(pref.toLowerCase())}
              >
                {pref}
              </EnhanceProfileSelectionCard>
            ))}
          </div>
        </EnhanceProfileSection>

        {/* Toggles */}
        <EnhanceProfileSection>
          {/* Quiet Hours */}
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl mb-4">
            <div>
              <span className="font-medium text-gray-700 block">Quiet hours important</span>
              <span className="text-sm text-gray-500">Prefer designated quiet times</span>
            </div>
            <button
              onClick={() => setQuietHours(!quietHours)}
              className={`relative w-14 h-8 rounded-full transition flex-shrink-0 ${
                quietHours ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                  quietHours ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Guests Allowed */}
          <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
            <div>
              <span className="font-medium text-gray-700 block">Guests allowed</span>
              <span className="text-sm text-gray-500">OK with occasional visitors</span>
            </div>
            <button
              onClick={() => setGuestsAllowed(!guestsAllowed)}
              className={`relative w-14 h-8 rounded-full transition flex-shrink-0 ${
                guestsAllowed ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                  guestsAllowed ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </EnhanceProfileSection>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-8">
        <EnhanceProfileButton
          role="searcher"
          variant="outline"
          onClick={handleCancel}
          className="flex-1"
        >
          Cancel
        </EnhanceProfileButton>
        <EnhanceProfileButton
          role="searcher"
          onClick={handleSave}
          className="flex-1"
        >
          Save Changes
        </EnhanceProfileButton>
      </div>
    </EnhanceProfileLayout>
  );
}
