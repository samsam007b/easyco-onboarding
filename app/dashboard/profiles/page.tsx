'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { User, Users, Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import ProfileSwitcher from '@/components/ProfileSwitcher';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface DependentProfile {
  id: string;
  parent_user_id: string;
  profile_name: string;
  relationship: string;
  is_active: boolean;
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  current_city: string | null;
  budget_min: number | null;
  budget_max: number | null;
  created_at: string;
}

export default function ProfilesManagementPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t, getSection } = useLanguage();
  const dashboard = getSection('dashboard');
  const common = getSection('common');
  const [dependentProfiles, setDependentProfiles] = useState<DependentProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadDependentProfiles();
  }, []);

  const loadDependentProfiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('dependent_profiles')
        .select('*')
        .eq('parent_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading dependent profiles:', error);
        toast.error(common.errors.loadFailed);
        return;
      }

      setDependentProfiles(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error(common.errors.unexpected);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (profileId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('dependent_profiles')
        .update({ is_active: !currentState })
        .eq('id', profileId);

      if (error) throw error;

      toast.success(currentState ? dashboard.profiles.profileDeactivated : dashboard.profiles.profileActivated);
      loadDependentProfiles();
    } catch (error) {
      console.error('Error toggling profile:', error);
      toast.error(dashboard.profiles.updateFailed);
    }
  };

  const handleDelete = async (profileId: string, profileName: string) => {
    if (!confirm(dashboard.profiles.deleteConfirm.replace('{name}', profileName))) {
      return;
    }

    setDeletingId(profileId);

    try {
      const { error } = await supabase
        .from('dependent_profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;

      toast.success(dashboard.profiles.deleteSuccess);
      loadDependentProfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error(dashboard.profiles.deleteFailed);
    } finally {
      setDeletingId(null);
    }
  };

  const getRelationshipLabel = (relationship: string) => {
    const labels: Record<string, string> = {
      child: dashboard.profiles.relationships.child,
      family_member: dashboard.profiles.relationships.familyMember,
      friend: dashboard.profiles.relationships.friend,
      other: dashboard.profiles.relationships.other,
    };
    return labels[relationship] || relationship;
  };

  const getRelationshipEmoji = (relationship: string) => {
    const emojis: Record<string, string> = {
      child: '👶',
      family_member: '👨‍👩‍👧',
      friend: '👥',
      other: '🤝',
    };
    return emojis[relationship] || '👤';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[color:var(--easy-purple)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{common.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-[color:var(--easy-purple)] hover:opacity-70 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          {common.actions.back}
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[color:var(--easy-purple)] mb-2">
            {dashboard.profiles.title}
          </h1>
          <p className="text-gray-600">
            {dashboard.profiles.description}
          </p>
        </div>

        {/* My Profile Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-[color:var(--easy-purple)] mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[color:var(--easy-purple)] rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{dashboard.profiles.myProfile}</h3>
              <p className="text-sm text-gray-600">{dashboard.profiles.myProfileDesc}</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/searcher')}
              className="px-4 py-2 rounded-full bg-[color:var(--easy-purple)] text-white font-medium hover:opacity-90 transition"
            >
              {dashboard.profiles.viewDashboard}
            </button>
          </div>
        </div>

        {/* Dependent Profiles Section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-[color:var(--easy-purple)]" />
              {dashboard.profiles.dependentProfiles}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {dashboard.profiles.dependentDesc}
            </p>
          </div>
          <button
            onClick={() => router.push('/onboarding/searcher/profile-type')}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--easy-yellow)] text-black font-medium hover:opacity-90 transition"
          >
            <Plus className="w-5 h-5" />
            {dashboard.profiles.addProfile}
          </button>
        </div>

        {/* Dependent Profiles List */}
        {dependentProfiles.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {dashboard.profiles.noProfiles}
            </h3>
            <p className="text-gray-600 mb-6">
              {dashboard.profiles.noProfilesDesc}
            </p>
            <button
              onClick={() => router.push('/onboarding/searcher/profile-type')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[color:var(--easy-purple)] text-white font-medium hover:opacity-90 transition"
            >
              <Plus className="w-5 h-5" />
              {dashboard.profiles.createFirst}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {dependentProfiles.map((profile) => (
              <div
                key={profile.id}
                className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition ${
                  profile.is_active ? 'border-gray-200' : 'border-gray-100 opacity-60'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-4xl">
                    {getRelationshipEmoji(profile.relationship)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {profile.profile_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getRelationshipLabel(profile.relationship)} •{' '}
                          {profile.first_name} {profile.last_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Active/Inactive Badge */}
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            profile.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {profile.is_active ? common.status.active : common.status.inactive}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      {profile.current_city && (
                        <span>📍 {profile.current_city}</span>
                      )}
                      {(profile.budget_min || profile.budget_max) && (
                        <span>
                          💰 €{profile.budget_min || '?'}-€{profile.budget_max || '?'}/month
                        </span>
                      )}
                      {profile.date_of_birth && (
                        <span>
                          🎂 {new Date(profile.date_of_birth).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(profile.id, profile.is_active)}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gray-200 hover:border-gray-300 transition text-sm font-medium"
                      >
                        {profile.is_active ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            {dashboard.profiles.deactivate}
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            {dashboard.profiles.activate}
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(profile.id, profile.profile_name)}
                        disabled={deletingId === profile.id}
                        className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-red-200 hover:border-red-300 text-red-600 transition text-sm font-medium disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        {deletingId === profile.id ? common.actions.deleting : common.actions.delete}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
