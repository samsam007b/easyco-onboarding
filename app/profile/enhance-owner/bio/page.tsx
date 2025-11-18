'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600">Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.push('/dashboard/my-profile-owner')}
          className="mb-6 text-[color:var(--easy-purple)] hover:opacity-70 transition flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </button>

        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-[color:var(--easy-purple)]">
              Owner Bio & Story
            </h1>
          </div>
          <p className="text-gray-600">
            Share your hosting philosophy and what makes you a great landlord
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-6">
          {/* Primary Motivation */}
          <div>
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
                <button
                  key={option.value}
                  onClick={() => setPrimaryMotivation(option.value)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    primaryMotivation === option.value
                      ? 'border-[color:var(--easy-purple)] bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{option.label}</span>
                    {primaryMotivation === option.value && (
                      <div className="w-5 h-5 rounded-full bg-[color:var(--easy-purple)] flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Owner Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tell your story
            </label>
            <textarea
              value={ownerBio}
              onChange={(e) => setOwnerBio(e.target.value)}
              rows={6}
              placeholder="Share your hosting philosophy, what makes your property special, and what you're looking for in ideal tenants..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all resize-none"
            />
            <p className="text-xs text-gray-500 mt-2">
              {ownerBio.length} / 500 characters
            </p>
          </div>

          {/* Tips */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-medium text-gray-900 mb-2">💡 Tips for a great bio:</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Describe your property management style</li>
              <li>Mention what makes your property unique</li>
              <li>Share what you value in tenants</li>
              <li>Be authentic and personable</li>
            </ul>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.push('/dashboard/my-profile-owner')}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[color:var(--easy-yellow)] text-black py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
        </div>
      </div>
    </main>
  );
}
