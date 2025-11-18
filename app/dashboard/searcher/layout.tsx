'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import ModernSearcherHeader from '@/components/layout/ModernSearcherHeader';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/utils/logger';

interface SearcherStats {
  favoritesCount: number;
  matchesCount: number;
  unreadMessages: number;
}

export default function SearcherLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<{ full_name: string; email: string; avatar_url?: string; } | null>(null);
  const [stats, setStats] = useState<SearcherStats>({ favoritesCount: 0, matchesCount: 0, unreadMessages: 0 });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: userData, error: profileError } = await supabase.from('users').select('full_name, email, avatar_url').eq('id', user.id).single();
      if (profileError) {
        logger.supabaseError('load searcher profile', profileError, { userId: user.id });
      } else if (userData) {
        setProfile(userData);
      }

      // Get favorites count - SAFE: Never crash even if table doesn't exist
      let favCount = 0;
      try {
        const result = await supabase
          .from('favorites')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (result.error) {
          logger.supabaseError('load favorites count', result.error, { userId: user.id });
        } else {
          favCount = result.count || 0;
        }
      } catch (err) {
        console.error('Favorites count failed:', err);
      }

      // Get matches count - SAFE: Never crash even if table doesn't exist
      let matchCount = 0;
      try {
        const result = await supabase
          .from('user_matches')
          .select('*', { count: 'exact', head: true })
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .gte('compatibility_score', 70)
          .eq('is_active', true);

        if (result.error) {
          logger.supabaseError('load matches count', result.error, { userId: user.id });
        } else {
          matchCount = result.count || 0;
        }
      } catch (err) {
        console.error('Matches count failed:', err);
      }

      // Get unread messages count using database function
      // FIXED: Now uses SECURITY DEFINER to bypass RLS infinite recursion
      let unreadCount = 0;
      try {
        const { data: unreadData, error: unreadError } = await supabase
          .rpc('get_unread_count', { target_user_id: user.id });

        if (unreadError) {
          logger.supabaseError('get unread count', unreadError, { userId: user.id });
        } else {
          unreadCount = unreadData || 0;
        }
      } catch (err) {
        console.error('Unread count failed:', err);
      }

      setStats({
        favoritesCount: favCount || 0,
        matchesCount: matchCount || 0,
        unreadMessages: unreadCount || 0
      });
    };
    loadProfile();
  }, [router, supabase]);

  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white"><div className="text-center"><LoadingHouse size={64} /><p className="text-gray-600 font-medium">Chargement...</p></div></div>;

  return (<><ModernSearcherHeader profile={profile} stats={stats} /><main id="main-content" className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 pt-24">{children}</main></>);
}
