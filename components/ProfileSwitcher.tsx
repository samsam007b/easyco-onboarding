'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { User, Users, ChevronDown, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Profile {
  profile_id: string;
  profile_type: 'own' | 'dependent';
  profile_name: string;
  relationship: string | null;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
}

interface ProfileSwitcherProps {
  currentProfileId?: string;
  onProfileChange?: (profileId: string, profileType: 'own' | 'dependent') => void;
}

export default function ProfileSwitcher({ currentProfileId, onProfileChange }: ProfileSwitcherProps) {
  const router = useRouter();
  const supabase = createClient();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Call the helper function to get all profiles
      const { data, error } = await supabase
        .rpc('get_all_user_profiles', { user_id_param: user.id });

      if (error) {
        console.error('Error loading profiles:', error);
        toast.error('Failed to load profiles');
        return;
      }

      setProfiles(data || []);

      // Set the first profile as selected by default (own profile)
      if (data && data.length > 0) {
        if (currentProfileId) {
          const current = data.find((p: Profile) => p.profile_id === currentProfileId);
          setSelectedProfile(current || data[0]);
        } else {
          setSelectedProfile(data[0]);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileChange = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsOpen(false);

    if (onProfileChange) {
      onProfileChange(profile.profile_id, profile.profile_type);
    }

    toast.success(`Switched to ${profile.profile_name}`);
  };

  const handleCreateNewProfile = () => {
    setIsOpen(false);
    router.push('/onboarding/searcher/profile-type');
  };

  if (isLoading) {
    return (
      <div className="animate-pulse flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
        <div className="w-5 h-5 bg-gray-300 rounded-full" />
        <div className="h-4 w-32 bg-gray-300 rounded" />
      </div>
    );
  }

  if (profiles.length === 0) {
    return null; // No profiles available
  }

  const getRelationshipEmoji = (relationship: string | null) => {
    switch (relationship) {
      case 'child': return '👶';
      case 'family_member': return '👨‍👩‍👧';
      case 'friend': return '👥';
      case 'other': return '🤝';
      default: return '👤';
    }
  };

  return (
    <div className="relative">
      {/* Selected Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-[color:var(--easy-purple)] transition"
      >
        <div className="flex items-center gap-2 flex-1">
          {selectedProfile?.profile_type === 'own' ? (
            <User className="w-5 h-5 text-[color:var(--easy-purple)]" />
          ) : (
            <Users className="w-5 h-5 text-[color:var(--easy-purple)]" />
          )}
          <div className="text-left">
            <div className="font-medium text-gray-900">
              {selectedProfile?.profile_name}
            </div>
            {selectedProfile?.profile_type === 'dependent' && (
              <div className="text-xs text-gray-500">
                {getRelationshipEmoji(selectedProfile.relationship)}{' '}
                {selectedProfile.first_name} {selectedProfile.last_name}
              </div>
            )}
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
            {/* Profiles List */}
            {profiles.map((profile) => (
              <button
                key={profile.profile_id}
                onClick={() => handleProfileChange(profile)}
                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition text-left ${
                  profile.profile_id === selectedProfile?.profile_id ? 'bg-purple-50' : ''
                }`}
              >
                {profile.profile_type === 'own' ? (
                  <User className="w-5 h-5 text-[color:var(--easy-purple)]" />
                ) : (
                  <div className="text-xl">{getRelationshipEmoji(profile.relationship)}</div>
                )}
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {profile.profile_name}
                  </div>
                  {profile.profile_type === 'dependent' && (
                    <div className="text-xs text-gray-500">
                      {profile.first_name} {profile.last_name}
                    </div>
                  )}
                </div>
                {profile.profile_id === selectedProfile?.profile_id && (
                  <div className="w-2 h-2 bg-[color:var(--easy-purple)] rounded-full" />
                )}
              </button>
            ))}

            {/* Create New Profile Button */}
            <button
              onClick={handleCreateNewProfile}
              className="w-full px-4 py-3 flex items-center gap-3 border-t-2 border-gray-100 hover:bg-gray-50 transition text-[color:var(--easy-purple)] font-medium"
            >
              <Plus className="w-5 h-5" />
              Create New Profile
            </button>
          </div>
        </>
      )}
    </div>
  );
}
