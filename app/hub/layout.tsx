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

export default function HubLayout({ children }: { children: React.ReactNode }) {
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
      // Get user's property from user_profiles
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('property_id')
        .eq('user_id', userId)
        .single();

      if (!userProfile?.property_id) return;

      // Get property info
      const { data: property } = await supabase
        .from('properties')
        .select('title')
        .eq('id', userProfile.property_id)
        .single();

      const groupName = property?.title || 'Ma Coloc';

      // Get members count
      const { count: membersCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', userProfile.property_id);

      // Get pending tasks count
      const { count: tasksCount } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('property_id', userProfile.property_id)
        .in('status', ['todo', 'in_progress']);

      // Get unread messages count
      const { data: unreadData } = await supabase
        .rpc('get_unread_count', { target_user_id: userId });

      const totalUnread = unreadData?.reduce((sum: number, item: any) => sum + (item.unread_count || 0), 0) || 0;

      setStats({
        groupName,
        pendingTasks: tasksCount || 0,
        yourBalance: 0, // Would come from expenses calculation
        unreadMessages: totalUnread,
        activeMembersCount: membersCount || 0,
      });
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
      {children}
    </>
  );
}
