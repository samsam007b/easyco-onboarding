'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Sparkles, User, Briefcase, Heart, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { getOnboardingData, saveOnboardingData } from '@/lib/onboarding-helpers';
import { toast } from 'sonner';

export default function EnhanceProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [userType, setUserType] = useState<string>('');

  // Enhanced profile data
  const [bio, setBio] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [newHobby, setNewHobby] = useState('');
  const [coreValues, setCoreValues] = useState<string[]>([]);
  const [importantQualities, setImportantQualities] = useState<string[]>([]);
  const [dealBreakers, setDealBreakers] = useState<string[]>([]);

  // Predefined options
  const commonHobbies = [
    'Reading', 'Sports', 'Cooking', 'Music', 'Movies', 'Gaming',
    'Hiking', 'Photography', 'Travel', 'Art', 'Yoga', 'Dancing'
  ];

  const valueOptions = [
    'Honesty', 'Respect', 'Communication', 'Sustainability', 'Diversity',
    'Collaboration', 'Independence', 'Growth', 'Community', 'Creativity'
  ];

  const qualityOptions = [
    'Cleanliness', 'Punctuality', 'Friendliness', 'Quietness', 'Flexibility',
    'Organization', 'Openness', 'Reliability', 'Humor', 'Empathy'
  ];

  const dealBreakerOptions = [
    'Smoking indoors', 'Loud noise late night', 'Messiness', 'No cleaning',
    'Bringing strangers often', 'Not respecting boundaries', 'Pets (if allergic)',
    'No communication', 'Invasion of privacy'
  ];

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        // Get user type
        const { data: userData } = await supabase
          .from('users')
          .select('user_type')
          .eq('id', user.id)
          .single();

        if (userData) {
          setUserType(userData.user_type);
        }

        // Load existing profile data
        const { data: profileData } = await getOnboardingData(user.id);

        if (profileData) {
          setBio(profileData.bio || '');
          setAboutMe(profileData.aboutMe || '');
          setLookingFor(profileData.lookingFor || '');
          setHobbies(profileData.hobbies || []);
          setCoreValues(profileData.coreValues || []);
          setImportantQualities(profileData.importantQualities || []);
          setDealBreakers(profileData.dealBreakers || []);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleAddHobby = () => {
    if (newHobby && !hobbies.includes(newHobby)) {
      setHobbies([...hobbies, newHobby]);
      setNewHobby('');
    }
  };

  const handleRemoveHobby = (hobby: string) => {
    setHobbies(hobbies.filter(h => h !== hobby));
  };

  const handleToggleValue = (value: string) => {
    if (coreValues.includes(value)) {
      setCoreValues(coreValues.filter(v => v !== value));
    } else {
      setCoreValues([...coreValues, value]);
    }
  };

  const handleToggleQuality = (quality: string) => {
    if (importantQualities.includes(quality)) {
      setImportantQualities(importantQualities.filter(q => q !== quality));
    } else {
      setImportantQualities([...importantQualities, quality]);
    }
  };

  const handleToggleDealBreaker = (dealBreaker: string) => {
    if (dealBreakers.includes(dealBreaker)) {
      setDealBreakers(dealBreakers.filter(d => d !== dealBreaker));
    } else {
      setDealBreakers([...dealBreakers, dealBreaker]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Please log in to continue');
        return;
      }

      const enhancedData = {
        bio,
        aboutMe,
        lookingFor,
        hobbies,
        coreValues,
        importantQualities,
        dealBreakers
      };

      const result = await saveOnboardingData(user.id, enhancedData, userType);

      if (result.success) {
        toast.success('Profile enhanced successfully!');
        setTimeout(() => {
          router.push(`/dashboard/${userType}`);
        }, 1000);
      } else {
        throw new Error('Failed to save profile');
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error('Error: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSkip = () => {
    router.push(`/dashboard/${userType}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[color:var(--easy-purple)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => router.back()} className="mb-6 text-[color:var(--easy-purple)]">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-8 h-8 text-[color:var(--easy-yellow)]" />
            <h1 className="text-3xl font-bold text-[color:var(--easy-purple)]">Enhance Your Profile</h1>
          </div>
          <p className="text-gray-600">Add more details to help us find better matches</p>
          <p className="text-sm text-gray-500 mt-2">All fields are optional</p>
        </div>

        <div className="space-y-6">
          {/* Bio Section */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-[color:var(--easy-purple)]" />
              <h2 className="text-lg font-semibold text-[color:var(--easy-purple)]">About You</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Bio (1-2 sentences)
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--easy-purple)]"
                  placeholder="Tell us a bit about yourself..."
                  maxLength={200}
                />
                <p className="text-xs text-gray-500 mt-1">{bio.length}/200 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  More About Me (optional)
                </label>
                <textarea
                  value={aboutMe}
                  onChange={(e) => setAboutMe(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--easy-purple)]"
                  placeholder="Share more about your lifestyle, interests, or what makes you unique..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{aboutMe.length}/500 characters</p>
              </div>
            </div>
          </div>

          {/* What You're Looking For */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="w-5 h-5 text-[color:var(--easy-purple)]" />
              <h2 className="text-lg font-semibold text-[color:var(--easy-purple)]">What You're Looking For</h2>
            </div>

            <textarea
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--easy-purple)]"
              placeholder="Describe your ideal living situation and the kind of people you'd like to live with..."
              maxLength={300}
            />
            <p className="text-xs text-gray-500 mt-1">{lookingFor.length}/300 characters</p>
          </div>

          {/* Hobbies & Interests */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-[color:var(--easy-purple)]" />
              <h2 className="text-lg font-semibold text-[color:var(--easy-purple)]">Hobbies & Interests</h2>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">Select from common hobbies:</p>
              <div className="flex flex-wrap gap-2">
                {commonHobbies.map((hobby) => (
                  <button
                    key={hobby}
                    onClick={() => {
                      if (hobbies.includes(hobby)) {
                        handleRemoveHobby(hobby);
                      } else {
                        setHobbies([...hobbies, hobby]);
                      }
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      hobbies.includes(hobby)
                        ? 'bg-[color:var(--easy-purple)] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Or add your own:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHobby()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--easy-purple)]"
                  placeholder="Add a hobby..."
                />
                <button
                  onClick={handleAddHobby}
                  className="px-6 py-2 bg-[color:var(--easy-yellow)] text-black font-medium rounded-xl hover:opacity-90"
                >
                  Add
                </button>
              </div>
            </div>

            {hobbies.filter(h => !commonHobbies.includes(h)).length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Your custom hobbies:</p>
                <div className="flex flex-wrap gap-2">
                  {hobbies.filter(h => !commonHobbies.includes(h)).map((hobby) => (
                    <button
                      key={hobby}
                      onClick={() => handleRemoveHobby(hobby)}
                      className="px-4 py-2 bg-[color:var(--easy-purple)] text-white rounded-full text-sm font-medium hover:opacity-90"
                    >
                      {hobby} ×
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Core Values */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold text-[color:var(--easy-purple)] mb-3">Core Values</h2>
            <p className="text-sm text-gray-600 mb-3">Select what matters most to you (choose up to 5):</p>
            <div className="flex flex-wrap gap-2">
              {valueOptions.map((value) => (
                <button
                  key={value}
                  onClick={() => handleToggleValue(value)}
                  disabled={!coreValues.includes(value) && coreValues.length >= 5}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    coreValues.includes(value)
                      ? 'bg-[color:var(--easy-purple)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">{coreValues.length}/5 selected</p>
          </div>

          {/* Important Qualities */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-lg font-semibold text-[color:var(--easy-purple)] mb-3">Important Qualities in a Roommate</h2>
            <p className="text-sm text-gray-600 mb-3">What qualities do you value in a roommate?</p>
            <div className="flex flex-wrap gap-2">
              {qualityOptions.map((quality) => (
                <button
                  key={quality}
                  onClick={() => handleToggleQuality(quality)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    importantQualities.includes(quality)
                      ? 'bg-[color:var(--easy-purple)] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {quality}
                </button>
              ))}
            </div>
          </div>

          {/* Deal Breakers */}
          <div className="bg-white p-6 rounded-2xl shadow border-2 border-orange-200">
            <h2 className="text-lg font-semibold text-orange-600 mb-3">Deal Breakers</h2>
            <p className="text-sm text-gray-600 mb-3">Select behaviors or situations you absolutely cannot tolerate:</p>
            <div className="flex flex-wrap gap-2">
              {dealBreakerOptions.map((dealBreaker) => (
                <button
                  key={dealBreaker}
                  onClick={() => handleToggleDealBreaker(dealBreaker)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    dealBreakers.includes(dealBreaker)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dealBreaker}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-4 rounded-full bg-[color:var(--easy-yellow)] text-black font-semibold text-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save & Continue'}
          </button>
          <button
            onClick={handleSkip}
            className="px-8 py-4 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
          >
            Skip for Now
          </button>
        </div>
      </div>
    </main>
  );
}
