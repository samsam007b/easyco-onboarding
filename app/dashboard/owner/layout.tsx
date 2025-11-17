'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import ModernOwnerHeader from '@/components/layout/ModernOwnerHeader';
import { useRouter } from 'next/navigation';
import { logger } from '@/lib/utils/logger';

interface OwnerStats {
  monthlyRevenue: number;
  roi: number;
  occupation: number;
  pendingApplications: number;
  unreadMessages: number;
}

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<{
    full_name: string;
    email: string;
    avatar_url?: string;
  } | null>(null);
  const [stats, setStats] = useState<OwnerStats>({
    monthlyRevenue: 0,
    roi: 0,
    occupation: 0,
    pendingApplications: 0,
    unreadMessages: 0,
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
        logger.supabaseError('load owner profile', profileError, { userId: user.id });
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
      // Get properties with all needed fields in one query
      const { data: properties } = await supabase
        .from('properties')
        .select('id, monthly_rent, status, available_rooms')
        .eq('owner_id', userId);

      if (properties) {
        // Calculate monthly revenue from published properties
        const monthlyRevenue = properties
          .filter(p => p.status === 'published')
          .reduce((sum, p) => sum + (p.monthly_rent || 0), 0);

        // Get property IDs
        const propertyIds = properties.map(p => p.id);

        // Get pending applications count
        let pendingApplications = 0;
        if (propertyIds.length > 0) {
          const { count } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .in('property_id', propertyIds)
            .eq('status', 'pending');

          pendingApplications = count || 0;
        }

        // Calculate real occupation from property_members (optimized - no N+1 queries)
        const publishedProperties = properties.filter(p => p.status === 'published');
        const totalRooms = publishedProperties.reduce((sum, p) => sum + (p.available_rooms || 0), 0);

        // Get all occupied rooms count in one query
        let occupiedRooms = 0;
        if (publishedProperties.length > 0) {
          const publishedIds = publishedProperties.map(p => p.id);
          const { count: occupiedCount } = await supabase
            .from('property_members')
            .select('*', { count: 'exact', head: true })
            .in('property_id', publishedIds)
            .eq('status', 'active');

          occupiedRooms = occupiedCount || 0;
        }

        const occupation = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

        // Get actual expenses to calculate realistic ROI
        const { data: expensesData } = await supabase
          .from('expenses')
          .select('amount')
          .in('property_id', propertyIds)
          .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

        const monthlyExpenses = expensesData?.reduce((sum, e) => sum + e.amount, 0) || 0;
        const netRevenue = monthlyRevenue - monthlyExpenses;

        // Calculate ROI (annual net revenue / estimated property value * 100)
        const estimatedPropertyValue = properties.length * 150000;
        const roi = estimatedPropertyValue > 0
          ? Number((netRevenue * 12 / estimatedPropertyValue * 100).toFixed(1))
          : 0;

        // Get unread messages count using database function
        const { data: unreadData } = await supabase
          .rpc('get_unread_count', { user_uuid: userId });

        const unreadCount = unreadData || 0;

        setStats({
          monthlyRevenue,
          roi,
          occupation,
          pendingApplications,
          unreadMessages: unreadCount || 0,
        });
      }
    } catch (error) {
      logger.error('Failed to load owner stats', error, { userId });
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ModernOwnerHeader
        profile={profile}
        stats={stats}
      />
      <main id="main-content" className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-purple-50/30 pt-24">
        {children}
      </main>
    </>
  );
}
