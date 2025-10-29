'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { createBrowserClient } from '@supabase/ssr';
import {
  Users,
  Search,
  Heart,
  MessageCircle,
  Calendar,
  User,
  BookmarkIcon,
  Bell,
  LayoutDashboard,
  MapPin,
  Building2,
  UserPlus,
  Home,
} from 'lucide-react';
import { QuickStatsCard } from '@/components/home/QuickStatsCard';
import { ActionCard } from '@/components/home/ActionCard';
import { ActivityFeed, ActivityItem } from '@/components/home/ActivityFeed';
import { ProTipCard } from '@/components/home/ProTipCard';
import { QuickAccessBar, QuickAccessItem } from '@/components/home/QuickAccessBar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SearcherHomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    savedProperties: 0,
    activeChats: 0,
    potentialMatches: 0,
    groupInvites: 0,
  });
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    // Load user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profile) {
      setUserProfile(profile);
    }

    // Load stats
    // Count saved properties (favorites)
    const { count: savedCount } = await supabase
      .from('user_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Count potential matches
    const { data: swipedUsers } = await supabase
      .from('user_swipes')
      .select('swiped_id')
      .eq('swiper_id', user.id)
      .eq('context', 'searcher_matching');

    const swipedIds = swipedUsers?.map((s) => s.swiped_id) || [];

    const { count: matchesCount } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
      .neq('user_id', user.id)
      .not('user_id', 'in', `(${swipedIds.join(',') || 'null'})`);

    setStats({
      savedProperties: savedCount || 0,
      activeChats: 0, // TODO: Implement messaging
      potentialMatches: matchesCount || 0,
      groupInvites: 0, // TODO: Implement groups
    });

    // Load recent activities (mock data for now)
    setRecentActivities([
      {
        id: '1',
        icon: Heart,
        iconBgColor: 'bg-pink-500',
        title: 'New match!',
        subtitle: 'You matched with Sophie M.',
        time: '2h ago',
        onClick: () => router.push('/matching/matches'),
      },
      {
        id: '2',
        icon: Home,
        iconBgColor: 'bg-blue-500',
        title: 'New property',
        subtitle: 'Coliving in Ixelles matches your criteria',
        time: '5h ago',
        onClick: () => router.push('/properties/browse'),
      },
      {
        id: '3',
        icon: UserPlus,
        iconBgColor: 'bg-green-500',
        title: 'Group invitation',
        subtitle: '3 searchers want you to join their group',
        time: '1d ago',
      },
    ]);
  };

  const quickAccessItems: QuickAccessItem[] = [
    {
      icon: BookmarkIcon,
      label: 'Favorites',
      count: stats.savedProperties,
      onClick: () => router.push('/properties/browse?filter=favorites'),
    },
    {
      icon: MessageCircle,
      label: 'Messages',
      count: stats.activeChats,
      hasNotification: stats.activeChats > 0,
      onClick: () => router.push('/messages'),
    },
    {
      icon: Calendar,
      label: 'Calendar',
      onClick: () => router.push('/calendar'),
    },
    {
      icon: User,
      label: 'My Profile',
      onClick: () => router.push('/profile'),
    },
  ];

  const profileCompletion = userProfile
    ? Math.min(
        100,
        Math.round(
          (Object.values(userProfile).filter((v) => v !== null && v !== '').length /
            Object.keys(userProfile).length) *
            100
        )
      )
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back{userProfile?.first_name ? `, ${userProfile.first_name}` : ''}!
              </h1>
              <p className="text-gray-600 mt-1">Let's find your perfect coliving match</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full relative"
                onClick={() => router.push('/notifications')}
              >
                <Bell className="h-5 w-5" />
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full relative"
                onClick={() => router.push('/messages')}
              >
                <MessageCircle className="h-5 w-5" />
                {stats.activeChats > 0 && (
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl gap-2"
                onClick={() => router.push('/dashboard/searcher')}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Where do you want to live?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 py-6 rounded-2xl text-lg"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery) {
                  router.push(`/properties/browse?search=${encodeURIComponent(searchQuery)}`);
                }
              }}
            />
            <Button
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl bg-purple-700 hover:bg-purple-800"
              onClick={() => {
                if (searchQuery) {
                  router.push(`/properties/browse?search=${encodeURIComponent(searchQuery)}`);
                }
              }}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickStatsCard
            icon={BookmarkIcon}
            label="Saved Properties"
            value={stats.savedProperties}
            iconBgColor="bg-blue-100"
            onClick={() => router.push('/properties/browse?filter=favorites')}
          />
          <QuickStatsCard
            icon={MessageCircle}
            label="Active Chats"
            value={stats.activeChats}
            iconBgColor="bg-green-100"
            onClick={() => router.push('/messages')}
          />
          <QuickStatsCard
            icon={Users}
            label="Potential Matches"
            value={stats.potentialMatches}
            iconBgColor="bg-purple-100"
            onClick={() => router.push('/matching/swipe')}
          />
          <QuickStatsCard
            icon={UserPlus}
            label="Group Invites"
            value={stats.groupInvites}
            iconBgColor="bg-yellow-100"
            onClick={() => router.push('/groups')}
          />
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActionCard
            title="Find Your Coliving Squad"
            description="Connect with 47+ like-minded people before finding a place together"
            icon={Users}
            badge="Most Popular"
            features={['Smart Matching', 'Active Now']}
            gradient="bg-gradient-to-br from-purple-600 to-purple-800"
            buttonText="Start Matching"
            onClick={() => router.push('/matching/swipe?context=searcher_matching')}
          />
          <ActionCard
            title="Browse Properties"
            description="Explore curated coliving spaces across Brussels"
            icon={Building2}
            badge={`${287} Available`}
            features={['Verified Listings', 'Smart Filters']}
            gradient="bg-gradient-to-br from-yellow-500 to-yellow-600"
            buttonText="Explore Now"
            onClick={() => router.push('/properties/browse')}
          />
        </div>

        {/* Quick Access Bar */}
        <QuickAccessBar items={quickAccessItems} />

        {/* Recent Activity & Pro Tip */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityFeed activities={recentActivities} maxItems={5} />
          </div>
          <div>
            {profileCompletion < 100 && (
              <ProTipCard
                message="Complete your profile to get better matches!"
                ctaText="Complete Profile"
                progress={profileCompletion}
                onCtaClick={() => router.push('/profile/enhance')}
              />
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Button
        size="lg"
        className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-2xl bg-gradient-to-br from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600"
        onClick={() => router.push('/matching/swipe?context=searcher_matching')}
      >
        <Heart className="h-7 w-7" fill="white" />
      </Button>
    </div>
  );
}
