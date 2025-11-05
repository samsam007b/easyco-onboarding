'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/supabase-client';
import ModernOwnerHeader from '@/components/layout/ModernOwnerHeader';
import { useRouter } from 'next/navigation';

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
        console.error('Error loading owner profile:', profileError);
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
      // Get properties
      const { data: properties } = await supabase
        .from('properties')
        .select('id, monthly_rent, status')
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

        // Calculate average occupation (mock for now - would need tenants table)
        const occupation = properties.filter(p => p.status === 'published').length > 0
          ? Math.round((properties.filter(p => p.status === 'rented').length / properties.filter(p => p.status === 'published').length) * 100)
          : 0;

        // Calculate ROI (simplified - revenue / assumed property value * 100)
        const roi = properties.length > 0 ? Number((monthlyRevenue * 12 / (properties.length * 150000) * 100).toFixed(1)) : 0;

        setStats({
          monthlyRevenue,
          roi,
          occupation,
          pendingApplications,
          unreadMessages: 0, // Would come from messages table
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-purple-50/30">
        {children}
      </div>
    </>
  );
}
