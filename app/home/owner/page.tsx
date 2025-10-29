'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { createBrowserClient } from '@supabase/ssr';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  Home,
  PieChart,
  ClipboardList,
  Wrench,
  Bell,
  MessageCircle,
  Plus,
  LayoutDashboard,
} from 'lucide-react';
import { QuickStatsCard } from '@/components/home/QuickStatsCard';
import { ActionCard } from '@/components/home/ActionCard';
import { ActivityFeed, ActivityItem } from '@/components/home/ActivityFeed';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function OwnerHomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    occupancyRate: 0,
    propertiesCount: 0,
    pendingApplications: 0,
    activeMaintenanceTickets: 0,
  });
  const [applicationsPipeline, setApplicationsPipeline] = useState({
    new: 0,
    interview: 0,
    visit: 0,
    approved: 0,
    rejected: 0,
  });
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    loadOwnerData();
  }, [user]);

  const loadOwnerData = async () => {
    if (!user) return;

    // Load properties count
    const { count: propertiesCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)
      .eq('status', 'published');

    // Mock financial data (TODO: Implement real financial tracking)
    setStats({
      totalRevenue: 12450,
      totalExpenses: 3200,
      netProfit: 9250,
      occupancyRate: 85,
      propertiesCount: propertiesCount || 0,
      pendingApplications: 8,
      activeMaintenanceTickets: 3,
    });

    setApplicationsPipeline({
      new: 5,
      interview: 2,
      visit: 1,
      approved: 3,
      rejected: 1,
    });

    // Mock recent activities
    setRecentActivities([
      {
        id: '1',
        icon: ClipboardList,
        iconBgColor: 'bg-blue-500',
        title: 'New application',
        subtitle: 'Sophie M. applied for Brussels Centre apartment',
        time: '1h ago',
        onClick: () => router.push('/dashboard/owner/applications'),
      },
      {
        id: '2',
        icon: Wrench,
        iconBgColor: 'bg-orange-500',
        title: 'Maintenance completed',
        subtitle: 'Heating repair in Ixelles property',
        time: '3h ago',
        onClick: () => router.push('/dashboard/owner/maintenance'),
      },
      {
        id: '3',
        icon: MessageCircle,
        iconBgColor: 'bg-green-500',
        title: 'New message',
        subtitle: 'Thomas L. asked about availability',
        time: '5h ago',
        onClick: () => router.push('/messages'),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Investment Dashboard</h1>
              <p className="text-gray-600 mt-1">Professional property portfolio management</p>
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
                className="bg-yellow-500 hover:bg-yellow-600 rounded-2xl gap-2"
                onClick={() => router.push('/dashboard/owner/expenses/add')}
              >
                <Plus className="h-5 w-5" />
                Add Expense
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl gap-2"
                onClick={() => router.push('/dashboard/owner')}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickStatsCard
            icon={DollarSign}
            label="Total Revenue"
            value={`€${stats.totalRevenue.toLocaleString()}`}
            trend={{ value: 12, isPositive: true }}
            gradient="bg-gradient-to-br from-yellow-400 to-yellow-600"
            iconBgColor="bg-yellow-500"
          />
          <QuickStatsCard
            icon={TrendingDown}
            label="Total Expenses"
            value={`€${stats.totalExpenses.toLocaleString()}`}
            trend={{ value: 5, isPositive: false }}
            gradient="bg-gradient-to-br from-red-400 to-red-600"
            iconBgColor="bg-red-500"
          />
          <QuickStatsCard
            icon={TrendingUp}
            label="Net Profit"
            value={`€${stats.netProfit.toLocaleString()}`}
            trend={{ value: 15, isPositive: true }}
            gradient="bg-gradient-to-br from-green-400 to-green-600"
            iconBgColor="bg-green-500"
          />
          <QuickStatsCard
            icon={Building2}
            label="Occupancy Rate"
            value={`${stats.occupancyRate}%`}
            trend={{ value: 3, isPositive: true }}
            gradient="bg-gradient-to-br from-blue-400 to-blue-600"
            iconBgColor="bg-blue-500"
          />
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionCard
            title="My Properties"
            description={`Manage ${stats.propertiesCount} properties`}
            icon={Home}
            gradient="bg-gradient-to-br from-blue-500 to-blue-700"
            buttonText="View All"
            onClick={() => router.push('/dashboard/owner/properties')}
            className="h-64"
          />
          <ActionCard
            title="Finance Report"
            description="View detailed analytics"
            icon={PieChart}
            gradient="bg-gradient-to-br from-green-500 to-green-700"
            buttonText="View Report"
            onClick={() => router.push('/dashboard/owner/finance')}
            className="h-64"
          />
          <ActionCard
            title="Applications"
            description={`${stats.pendingApplications} pending`}
            icon={ClipboardList}
            badge={stats.pendingApplications > 0 ? `${stats.pendingApplications} New` : undefined}
            gradient="bg-gradient-to-br from-orange-500 to-orange-700"
            buttonText="Review"
            onClick={() => router.push('/dashboard/owner/applications')}
            className="h-64"
          />
          <ActionCard
            title="Maintenance"
            description={`${stats.activeMaintenanceTickets} active tickets`}
            icon={Wrench}
            badge={
              stats.activeMaintenanceTickets > 0
                ? `${stats.activeMaintenanceTickets} Active`
                : undefined
            }
            gradient="bg-gradient-to-br from-purple-500 to-purple-700"
            buttonText="Manage"
            onClick={() => router.push('/dashboard/owner/maintenance')}
            className="h-64"
          />
        </div>

        {/* Applications Pipeline */}
        <Card className="rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Applications Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="text-center p-4 rounded-xl bg-blue-50">
                <div className="text-3xl font-bold text-blue-600">{applicationsPipeline.new}</div>
                <p className="text-sm font-medium text-gray-600 mt-1">New</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-yellow-50">
                <div className="text-3xl font-bold text-yellow-600">
                  {applicationsPipeline.interview}
                </div>
                <p className="text-sm font-medium text-gray-600 mt-1">Interview</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-purple-50">
                <div className="text-3xl font-bold text-purple-600">
                  {applicationsPipeline.visit}
                </div>
                <p className="text-sm font-medium text-gray-600 mt-1">Visit</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-green-50">
                <div className="text-3xl font-bold text-green-600">
                  {applicationsPipeline.approved}
                </div>
                <p className="text-sm font-medium text-gray-600 mt-1">Approved</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-red-50">
                <div className="text-3xl font-bold text-red-600">
                  {applicationsPipeline.rejected}
                </div>
                <p className="text-sm font-medium text-gray-600 mt-1">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <ActivityFeed activities={recentActivities} title="Recent Activity" maxItems={5} />
      </div>
    </div>
  );
}
