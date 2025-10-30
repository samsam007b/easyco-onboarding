'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import SearcherHeader from '@/components/layout/SearcherHeader';
import { useRouter } from 'next/navigation';

export default function SearcherLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<{
    full_name: string;
    email: string;
    avatar_url?: string;
  } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push('/login');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('full_name, email, avatar_url')
        .eq('id', user.id)
        .single();

      if (userData) {
        setProfile(userData);
      }
    };

    loadProfile();
  }, [router, supabase]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--searcher-primary)]"></div>
      </div>
    );
  }

  return (
    <>
      <SearcherHeader
        profile={profile}
        notifications={0}
        unreadMessages={0}
        newMatches={0}
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
        {children}
      </div>
    </>
  );
}
