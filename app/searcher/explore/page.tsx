'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import LoadingHouse from '@/components/ui/LoadingHouse';
import SearcherDashboardCompact from '@/components/dashboard/SearcherDashboardCompact';

// Dynamically import browse content for better performance
const BrowseContent = dynamic(
  () => import('@/components/browse/BrowseContent'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full" />
      </div>
    )
  }
);

export default function SearcherExplorePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{
    id: string;
    full_name: string;
    email: string;
    avatar_url?: string;
  } | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: profile } = await supabase
        .from('users')
        .select('full_name, email, avatar_url')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserData({ id: user.id, ...profile });
      }
      setLoading(false);
    };
    init();
  }, [supabase, router]);

  if (loading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingHouse size={80} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Compact Dashboard */}
      <SearcherDashboardCompact userId={userData.id} userData={userData} />

      {/* Browse Content */}
      <div className="bg-white">
        <BrowseContent userId={userData.id} />
      </div>
    </div>
  );
}
