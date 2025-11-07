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

      // Get favorites count
      const { count: favCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get matches count from user_matching_scores (70%+ compatibility)
      const { count: matchCount } = await supabase
        .from('user_matching_scores')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('compatibility_score', 70);

      // Get unread messages count using database function
      const { data: unreadData } = await supabase
        .rpc('get_unread_count', { user_uuid: user.id });

      const unreadCount = unreadData || 0;

      setStats({
        favoritesCount: favCount || 0,
        matchesCount: matchCount || 0,
        unreadMessages: unreadCount || 0
      });
    };
    loadProfile();
  }, [router, supabase]);

  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white"><div className="text-center"><div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" /><p className="text-gray-600 font-medium">Chargement...</p></div></div>;

  return (<><ModernSearcherHeader profile={profile} stats={stats} /><div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 pt-24">{children}</div></>);
}
