'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import ModernResidentHeader from '@/components/layout/ModernResidentHeader';
import { useRouter } from 'next/navigation';

interface ResidentStats {
  groupName: string;
  pendingTasks: number;
  yourBalance: number;
  unreadMessages: number;
  activeMembersCount: number;
}

export default function ResidentLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<{
    full_name: string;
    email: string;
    avatar_url?: string;
  } | null>(null);
  const [stats, setStats] = useState<ResidentStats>({
    groupName: 'Ma Coloc',
    pendingTasks: 0,
    yourBalance: 0,
    unreadMessages: 0,
    activeMembersCount: 0,
  });
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

      // Load real stats
      await loadStats(user.id);
    };

    loadProfile();
  }, [router, supabase]);

  const loadStats = async (userId: string) => {
    try {
      // Get current property membership
      const { data: propertyMember } = await supabase
        .from('property_members')
        .select(`
          *,
          properties (
            id,
            title
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (propertyMember && propertyMember.properties) {
        const groupName = propertyMember.properties.title || 'Ma Coloc';

        // Get members count (roommates)
        const { count: membersCount } = await supabase
          .from('property_members')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', propertyMember.properties.id)
          .eq('status', 'active');

        setStats({
          groupName,
          pendingTasks: 3, // Mock for now - would come from tasks table
          yourBalance: -45, // Mock for now - would come from expenses/payments
          unreadMessages: 0, // Would come from messages table
          activeMembersCount: membersCount || 0,
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ModernResidentHeader
        profile={profile}
        stats={stats}
      />
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30">
        {children}
      </div>
    </>
  );
}
