'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Calendar, MapPin, User, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import DashboardHeader from '@/components/DashboardHeader';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function CommunityPage() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [roommates, setRoommates] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Get user profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setProfile({
        full_name: userData?.full_name || 'User',
        email: userData?.email || '',
        profile_data: profileData
      });

      // TODO: Load roommates and events from database
      // For now, showing empty state
      setRoommates([]);
      setEvents([]);
    } catch (error) {
      // FIXME: Use logger.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      {profile && (
        <DashboardHeader
          profile={profile}
          avatarColor="#FF5722"
          role="resident"
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#4A148C] mb-2 flex items-center gap-2">
                <Users className="w-8 h-8 text-[#4A148C]" />
                {t('community.title')}
              </h1>
              <p className="text-gray-600">{t('community.subtitle')}</p>
            </div>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('community.backToDashboard')}
            </Button>
          </div>
        </div>

        {/* Roommates Section */}
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4A148C] mb-4 flex items-center gap-2">
            <Users className="w-6 h-6" />
            {t('community.roommates.title')}
          </h2>

          {roommates.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">{t('community.roommates.empty')}</p>
              <p className="text-sm text-gray-500">
                {t('community.roommates.emptyHint')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {roommates.map((roommate) => (
                <div
                  key={roommate.id}
                  className="border-2 border-gray-200 rounded-2xl p-4 hover:border-[#4A148C] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] rounded-full flex items-center justify-center text-white font-bold">
                      {roommate.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{roommate.name}</h3>
                      <p className="text-sm text-gray-600">{roommate.role}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {t('community.roommates.message')}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Community Events */}
        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-[#4A148C] mb-4 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            {t('community.events.title')}
          </h2>

          {events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">{t('community.events.empty')}</p>
              <p className="text-sm text-gray-500 mb-6">
                {t('community.events.emptyHint')}
              </p>
              <Button>
                <Calendar className="w-4 h-4 mr-2" />
                {t('community.events.createEvent')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border-2 border-gray-200 rounded-2xl p-4 hover:border-[#4A148C] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                    <Button size="sm">{t('community.events.join')}</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
