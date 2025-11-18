'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import ModernResidentHeader from '@/components/layout/ModernResidentHeader';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/utils/logger';
import LoadingHouse from '@/components/ui/LoadingHouse';

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

      const { data: userData, error: profileError } = await supabase
        .from('users')
        .select('full_name, email, avatar_url')
        .eq('id', user.id)
        .single();

      if (profileError) {
        logger.supabaseError('load resident profile', profileError, { userId: user.id });
        // Continue with default profile instead of blocking
      } else if (userData) {
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

        // Get pending maintenance requests count
        const { count: pendingTasksCount } = await supabase
          .from('maintenance_requests')
          .select('*', { count: 'exact', head: true })
          .eq('property_id', propertyMember.properties.id)
          .eq('status', 'open');

        // Calculate user's balance from expenses
        const { data: expensesData } = await supabase
          .from('expenses')
          .select('amount, split_type, created_by')
          .eq('property_id', propertyMember.properties.id)
          .eq('status', 'approved');

        let yourBalance = 0;
        if (expensesData && membersCount) {
          expensesData.forEach(expense => {
            if (expense.split_type === 'equal') {
              const shareAmount = expense.amount / membersCount;
              if (expense.created_by === userId) {
                // User paid, others owe them
                yourBalance += expense.amount - shareAmount;
              } else {
                // User owes their share
                yourBalance -= shareAmount;
              }
            }
          });
        }

        // Get unread messages count using database function
        const { data: unreadData } = await supabase
          .rpc('get_unread_count', { user_uuid: userId });

        const unreadCount = unreadData || 0;

        setStats({
          groupName,
          pendingTasks: pendingTasksCount || 0,
          yourBalance: Math.round(yourBalance),
          unreadMessages: unreadCount || 0,
          activeMembersCount: membersCount || 0,
        });
      }
    } catch (error) {
      logger.error('Failed to load resident stats', error, { userId });
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
        <div className="text-center">
          <LoadingHouse size={64} />
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
      <main id="main-content" className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-orange-50/30 pt-24">
        {children}
      </main>
    </>
  );
}
