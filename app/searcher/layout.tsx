'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import SearcherMegaMenuHeader from '@/components/layout/SearcherMegaMenuHeader';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/utils/logger';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { useLanguage } from '@/lib/i18n/use-language';
import { useRole } from '@/lib/role/role-context';

interface SearcherStats {
  favoritesCount: number;
  matchesCount: number;
  unreadMessages: number;
  applicationsCount: number;
  visitsCount: number;
  groupsCount: number;
}

export default function SearcherHubLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<{
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  } | null>(null);
  const [stats, setStats] = useState<SearcherStats>({
    favoritesCount: 0,
    matchesCount: 0,
    unreadMessages: 0,
    applicationsCount: 0,
    visitsCount: 0,
    groupsCount: 0
  });
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const { setActiveRole } = useRole();
  const t = getSection('common');

  // Set active role
  useEffect(() => {
    setActiveRole('searcher');
  }, [setActiveRole]);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: userData, error: profileError } = await supabase
        .from('users')
        .select('full_name, email, avatar_url')
        .eq('id', user.id)
        .single();

      if (profileError) {
        logger.supabaseError('load searcher profile', profileError, { userId: user.id });
      } else if (userData) {
        setProfile({ id: user.id, ...userData });
      }

      // Load all stats in parallel for performance
      const loadStats = async () => {
        const userId = user.id;

        // Create async functions to wrap Supabase queries
        const getFavCount = async () => {
          try {
            const { count } = await supabase
              .from('favorites')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', userId);
            return count || 0;
          } catch { return 0; }
        };

        const getMatchCount = async () => {
          try {
            const { count } = await supabase
              .from('user_matches')
              .select('*', { count: 'exact', head: true })
              .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
              .gte('compatibility_score', 70)
              .eq('is_active', true);
            return count || 0;
          } catch { return 0; }
        };

        const getUnreadCount = async () => {
          try {
            const { data } = await supabase.rpc('get_unread_count', { target_user_id: userId });
            return data || 0;
          } catch { return 0; }
        };

        const getAppsCount = async () => {
          try {
            const { count } = await supabase
              .from('applications')
              .select('*', { count: 'exact', head: true })
              .eq('applicant_id', userId)
              .in('status', ['pending', 'reviewing']);
            return count || 0;
          } catch { return 0; }
        };

        const getVisitsCount = async () => {
          try {
            const { count } = await supabase
              .from('property_visits')
              .select('*', { count: 'exact', head: true })
              .eq('visitor_id', userId)
              .eq('status', 'confirmed')
              .gte('visit_date', new Date().toISOString());
            return count || 0;
          } catch { return 0; }
        };

        const getGroupsCount = async () => {
          try {
            const { count } = await supabase
              .from('search_groups')
              .select('*', { count: 'exact', head: true })
              .contains('member_ids', [userId]);
            return count || 0;
          } catch { return 0; }
        };

        const [favCount, matchCount, unreadCount, appsCount, visitsCount, groupsCount] =
          await Promise.all([
            getFavCount(),
            getMatchCount(),
            getUnreadCount(),
            getAppsCount(),
            getVisitsCount(),
            getGroupsCount()
          ]);

        setStats({
          favoritesCount: favCount,
          matchesCount: matchCount,
          unreadMessages: unreadCount,
          applicationsCount: appsCount,
          visitsCount: visitsCount,
          groupsCount: groupsCount
        });
      };

      loadStats();
    };

    loadProfile();
  }, [router, supabase]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-searcher-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">
            {t?.loading?.[language] || 'Chargement...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SearcherMegaMenuHeader profile={profile} stats={stats} />
      <main
        id="main-content"
        className="min-h-screen bg-searcher-50/30 pt-16"
      >
        {children}
      </main>
    </>
  );
}
