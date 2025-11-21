'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Home, Users, Calendar } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import LoadingHouse from '@/components/ui/LoadingHouse';

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600">Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard/my-profile')}
          className="mb-6 text-[color:var(--easy-purple)] hover:opacity-70 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-[color:var(--easy-purple)]">
              Advanced Preferences
            </h1>
          </div>
          <p className="text-gray-600">
            Fine-tune your living preferences for better matches
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Room Type */}
          <div className="bg-white rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Home className="w-5 h-5" />
              Preferred Room Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Private', 'Shared', 'Studio', 'Flexible'].map((type) => (
                <button
                  key={type}
                  onClick={() => setRoomType(type.toLowerCase())}
                  className={`px-4 py-3 rounded-xl font-medium transition border-2 ${
                    roomType === type.toLowerCase()
                      ? 'bg-[color:var(--easy-purple)] text-white border-[color:var(--easy-purple)]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[color:var(--easy-purple)]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Bathroom Type */}
          <div className="bg-white rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Bathroom Preference
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Private', 'Shared'].map((type) => (
                <button
                  key={type}
                  onClick={() => setBathroomType(type.toLowerCase())}
                  className={`px-4 py-3 rounded-xl font-medium transition border-2 ${
                    bathroomType === type.toLowerCase()
                      ? 'bg-[color:var(--easy-purple)] text-white border-[color:var(--easy-purple)]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[color:var(--easy-purple)]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Lease Duration */}
          <div className="bg-white rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Preferred Lease Duration
            </label>
            <select
              value={leaseDuration}
              onChange={(e) => setLeaseDuration(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:border-[color:var(--easy-purple)] focus:ring-2 focus:ring-purple-100 outline-none transition"
            >
              <option value="">Select...</option>
              <option value="1-3-months">1-3 months</option>
              <option value="3-6-months">3-6 months</option>
              <option value="6-12-months">6-12 months</option>
              <option value="12-months-plus">12+ months</option>
              <option value="flexible">Flexible</option>
            </select>
          </div>

          {/* Move-in Flexibility */}
          <div className="bg-white rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Move-in Date Flexibility
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Exact', 'Within 1 week', 'Flexible'].map((flex) => (
                <button
                  key={flex}
                  onClick={() => setMoveInFlexibility(flex.toLowerCase())}
                  className={`px-4 py-3 rounded-xl font-medium transition border-2 ${
                    moveInFlexibility === flex.toLowerCase()
                      ? 'bg-[color:var(--easy-purple)] text-white border-[color:var(--easy-purple)]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[color:var(--easy-purple)]'
                  }`}
                >
                  {flex}
                </button>
              ))}
            </div>
          </div>

          {/* Pets Preference */}
          <div className="bg-white rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Pets Preference
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['I have pets', 'No pets', 'Open to pets'].map((pref) => (
                <button
                  key={pref}
                  onClick={() => setPetsPreference(pref.toLowerCase())}
                  className={`px-4 py-3 rounded-xl font-medium transition border-2 ${
                    petsPreference === pref.toLowerCase()
                      ? 'bg-[color:var(--easy-purple)] text-white border-[color:var(--easy-purple)]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[color:var(--easy-purple)]'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          {/* Smoking Preference */}
          <div className="bg-white rounded-2xl p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Smoking Preference
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Non-smoking only', 'Smoking outside OK'].map((pref) => (
                <button
                  key={pref}
                  onClick={() => setSmokingPreference(pref.toLowerCase())}
                  className={`px-4 py-3 rounded-xl font-medium transition border-2 ${
                    smokingPreference === pref.toLowerCase()
                      ? 'bg-[color:var(--easy-purple)] text-white border-[color:var(--easy-purple)]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[color:var(--easy-purple)]'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="bg-white rounded-2xl p-6 space-y-4">
            {/* Quiet Hours */}
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
              <div>
                <span className="font-medium text-gray-700 block">Quiet hours important</span>
                <span className="text-sm text-gray-500">Prefer designated quiet times</span>
              </div>
              <button
                onClick={() => setQuietHours(!quietHours)}
                className={`relative w-14 h-8 rounded-full transition flex-shrink-0 ${
                  quietHours ? 'bg-[color:var(--easy-purple)]' : 'bg-gray-300'
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
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
              <div>
                <span className="font-medium text-gray-700 block">Guests allowed</span>
                <span className="text-sm text-gray-500">OK with occasional visitors</span>
              </div>
              <button
                onClick={() => setGuestsAllowed(!guestsAllowed)}
                className={`relative w-14 h-8 rounded-full transition flex-shrink-0 ${
                  guestsAllowed ? 'bg-[color:var(--easy-purple)]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition ${
                    guestsAllowed ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => router.push('/dashboard/my-profile')}
            className="flex-1 py-4 rounded-full font-semibold text-lg transition border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-4 rounded-full font-semibold text-lg transition shadow-md bg-[color:var(--easy-yellow)] text-black hover:opacity-90 hover:shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </main>
  );
}
