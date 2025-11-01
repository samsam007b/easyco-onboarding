'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import ModernSearcherHeader from '@/components/layout/ModernSearcherHeader';
import { useRouter } from 'next/navigation';

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

      const { data: userData } = await supabase.from('users').select('full_name, email, avatar_url').eq('id', user.id).single();
      if (userData) setProfile(userData);

      const { count: favCount } = await supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      setStats({ favoritesCount: favCount || 0, matchesCount: 5, unreadMessages: 0 });
    };
    loadProfile();
  }, [router, supabase]);

  if (!profile) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white"><div className="text-center"><div className="w-16 h-16 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" /><p className="text-gray-600 font-medium">Chargement...</p></div></div>;

  return (<><ModernSearcherHeader profile={profile} stats={stats} /><div className="min-h-screen bg-gradient-to-br from-yellow-50/30 via-white to-yellow-50/30">{children}</div></>);
}
