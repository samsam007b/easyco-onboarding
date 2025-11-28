'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { useRole } from '@/lib/role/role-context';
import SearcherDashboardCompact from '@/components/dashboard/SearcherDashboardCompact';
import ModernSearcherHeader from '@/components/layout/ModernSearcherHeader';
import dynamic from 'next/dynamic';

// Dynamically import the browse content to avoid issues
const BrowseContent = dynamic(
  () => import('@/components/browse/BrowseContent'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    )
  }
);

export default function SearcherDashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const { setActiveRole } = useRole();

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<{
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  } | null>(null);
  const [searcherStats, setSearcherStats] = useState({
    favoritesCount: 0,
    matchesCount: 0,
    unreadMessages: 0
  });

  useEffect(() => {
    setActiveRole('searcher');
  }, [setActiveRole]);

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Load user profile
      const { data: usersData } = await supabase
        .from('users')
        .select('full_name, email, avatar_url')
        .eq('id', user.id)
        .single();

      if (usersData) {
        setUserData({
          id: user.id,
          full_name: usersData.full_name || 'User',
          email: usersData.email || '',
          avatar_url: usersData.avatar_url,
        });
      }

      // Load stats
      const { count: favCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setSearcherStats({
        favoritesCount: favCount || 0,
        matchesCount: 5,
        unreadMessages: 0,
      });

      setIsLoading(false);
    };

    loadUserData();
  }, [supabase, router]);

  if (isLoading || !userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ModernSearcherHeader
        profile={userData}
        stats={searcherStats}
      />

      {/* Compact Dashboard Section - collé en haut */}
      <div className="pt-[60px]">
        <SearcherDashboardCompact
          userId={userData.id}
          userData={userData}
        />
      </div>

      {/* Browse Content */}
      <div className="bg-white">
        <BrowseContent userId={userData.id} />
      </div>
    </div>
  );
}
