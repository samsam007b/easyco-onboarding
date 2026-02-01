'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  TrendingUp,
  TrendingDown,
  Building2,
  Users,
  DollarSign,
  Calendar,
  ArrowRight,
  Plus,
  Eye,
  Heart,
  MapPin,
  Bed,
  Bath,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { Property } from '@/types/property.types';
import SubscriptionBanner from '@/components/subscriptions/SubscriptionBanner';
import UpgradeNotification from '@/components/subscriptions/UpgradeNotification';
import { useLanguage } from '@/lib/i18n/use-language';

interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalProperties: number;
  publishedProperties: number;
  occupation: number;
  occupationChange: number;
  pendingApplications: number;
  totalViews: number;
}

export default function ModernOwnerDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const owner = getSection('dashboard')?.owner;
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueChange: 0,
    totalProperties: 0,
    publishedProperties: 0,
    occupation: 0,
    occupationChange: 0,
    pendingApplications: 0,
    totalViews: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUserId(user.id);

      // Load properties
      const { data: propertiesData } = await supabase
        .from('properties')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (propertiesData) {
        setProperties(propertiesData);

        // Calculate stats
        const totalRevenue = propertiesData
          .filter(p => p.status === 'published' || p.status === 'rented')
          .reduce((sum, p) => sum + (p.monthly_rent || 0), 0);

        const published = propertiesData.filter(p => p.status === 'published').length;
        const rented = propertiesData.filter(p => p.status === 'rented').length;
        const occupation = published > 0 ? Math.round((rented / published) * 100) : 0;

        const totalViews = propertiesData.reduce((sum, p) => sum + (p.views_count || 0), 0);

        // Get applications count
        const propertyIds = propertiesData.map(p => p.id);
        let pendingApplications = 0;

        if (propertyIds.length > 0) {
          const { count } = await supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .in('property_id', propertyIds)
            .eq('status', 'pending');

          pendingApplications = count || 0;
        }

        setStats({
          totalRevenue,
          revenueChange: 12, // Mock - would calculate from historical data
          totalProperties: propertiesData.length,
          publishedProperties: published,
          occupation,
          occupationChange: 5, // Mock - would calculate from historical data
          pendingApplications,
          totalViews,
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate revenue data from properties with stable variation
  // TODO: Replace with real historical data from rent_payments/expenses tables
  const generateRevenueData = () => {
    const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;
    const baseRevenue = stats.totalRevenue;
    // Stable variation patterns
    const revenueFactors = [0.85, 0.92, 0.88, 0.95, 0.90, 0.97, 0.93, 0.89, 0.94, 0.91, 0.96, 0.98];
    const expenseFactors = [0.22, 0.25, 0.20, 0.28, 0.23, 0.21, 0.26, 0.24, 0.22, 0.27, 0.23, 0.25];

    return monthKeys.map((key, i) => ({
      month: owner?.months?.[key] || key.charAt(0).toUpperCase() + key.slice(1),
      revenue: Math.floor(baseRevenue * revenueFactors[i]),
      expenses: Math.floor(baseRevenue * expenseFactors[i]),
    }));
  };

  const generateOccupationData = () => {
    return properties.slice(0, 5).map(property => ({
      name: property.title.length > 15 ? property.title.substring(0, 15) + '...' : property.title,
      occupation: property.status === 'rented' ? 100 : property.status === 'published' ? 50 : 0,
    }));
  };

  const revenueData = generateRevenueData();
  const occupationData = generateOccupationData();

  // V3 Color System - Official Owner Palette (Solid Color)
  // Source: brand-identity/izzico-color-system.html
  const ownerGradient = 'linear-gradient(135deg, #9c5698 0%, #9c5698 50%, #9c5698 100%)';
  const ownerGradientLight = 'linear-gradient(135deg, #F8F0F7 0%, #FDF5F9 100%)';

  const kpiCards = [
    {
      title: owner?.monthlyRevenue || 'Revenus Mensuels',
      value: `€${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: DollarSign,
      gradient: 'linear-gradient(135deg, #7CB89B 0%, #9FCFB5 100%)', // Green semantic for revenue
      bgGradient: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
      textColor: '#166534',
    },
    {
      title: owner?.properties || 'Propriétés',
      value: stats.totalProperties,
      subtitle: `${stats.publishedProperties} ${owner?.published || 'publiées'}`,
      icon: Building2,
      gradient: ownerGradient, // Owner primary
      bgGradient: ownerGradientLight,
      textColor: '#9c5698',
    },
    {
      title: owner?.occupationRate || 'Taux d\'Occupation',
      value: `${stats.occupation}%`,
      change: stats.occupationChange,
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #9c5698 0%, #9c5698 100%)', // Owner variant
      bgGradient: 'linear-gradient(135deg, #FDF5F9 0%, #FAE8F0 100%)',
      textColor: '#9c5698',
    },
    {
      title: owner?.applications || 'Candidatures',
      value: stats.pendingApplications,
      subtitle: owner?.pending || 'En attente',
      icon: Users,
      gradient: 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)', // Amber semantic for pending
      bgGradient: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
      textColor: '#D97706',
      action: () => router.push('/dashboard/owner/applications'),
    },
  ];

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #F8F0F7 0%, #FFFFFF 50%, #FDF5F9 100%)' }}
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <LoadingHouse size={80} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{owner?.loadingDashboard || 'Loading dashboard...'}</h3>
          <p className="text-gray-600">{owner?.preparingData || 'Preparing your data'}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #F8F0F7 0%, #FFFFFF 50%, #FDF5F9 100%)' }}
    >
      {/* Stripe Upgrade Notification */}
      <UpgradeNotification />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* V3 Fun Welcome Section with Owner Gradient */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-4 mb-4">
          {/* V3 Fun Icon with Glow */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            className="relative w-16 h-16"
          >
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 superellipse-2xl opacity-30"
              style={{
                background: ownerGradient,
                filter: 'blur(12px)',
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            />
            {/* Main icon container */}
            <div
              className="relative w-16 h-16 superellipse-2xl flex items-center justify-center shadow-lg"
              style={{
                background: ownerGradient,
                boxShadow: '0 8px 24px rgba(156, 86, 152, 0.3)',
              }}
            >
              <Building2 className="w-8 h-8 text-white" />
            </div>
            {/* Floating sparkle */}
            <motion.div
              className="absolute -top-1 -right-1"
              animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <Sparkles className="w-5 h-5" style={{ color: '#9c5698' }} />
            </motion.div>
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {owner?.dashboardTitle || 'Tableau de bord'}
            </h1>
            <p className="text-gray-600 text-lg">
              {owner?.portfolioOverview || 'Vue d\'ensemble de votre portefeuille immobilier'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Subscription Banner */}
      {userId && <SubscriptionBanner userId={userId} />}

      {/* KPI Cards Grid - V3 Fun Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.change && card.change > 0;

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={card.action}
              className="relative overflow-hidden superellipse-2xl p-5 cursor-pointer shadow-lg"
              style={{
                background: card.bgGradient,
                boxShadow: `0 8px 24px rgba(156, 86, 152, 0.12)`,
              }}
            >
              {/* Decorative circle */}
              <div
                className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20"
                style={{ background: card.gradient }}
              />

              <div className="relative z-10">
                {/* Header with icon */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium" style={{ color: card.textColor }}>
                    {card.title}
                  </span>
                  <div
                    className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md"
                    style={{ background: card.gradient }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Value */}
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {card.value}
                </p>

                {/* Change or Subtitle */}
                {card.change !== undefined ? (
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    isPositive ? "text-emerald-600" : "text-red-600"
                  )}>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{isPositive ? '+' : ''}{card.change}%</span>
                    <span className="text-gray-500 text-xs">{owner?.vsLastMonth || 'vs mois dernier'}</span>
                  </div>
                ) : card.subtitle ? (
                  <p className="text-sm font-medium" style={{ color: card.textColor }}>{card.subtitle}</p>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section - V3 Fun Style */}
      {properties.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.01 }}
            className="relative overflow-hidden bg-white superellipse-3xl shadow-lg p-6"
            style={{ boxShadow: '0 8px 32px rgba(156, 86, 152, 0.1)' }}
          >
            {/* Decorative circle */}
            <div
              className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10"
              style={{ background: ownerGradient }}
            />

            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <div
                className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md"
                style={{ background: ownerGradient }}
              >
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              {owner?.revenueExpensesChart || 'Évolution Revenus & Dépenses'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">{owner?.last12Months || '12 derniers mois'}</p>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#999" style={{ fontSize: '12px' }} />
                <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                  formatter={(value) => [`€${value ?? 0}`, '']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#7CB89B"
                  strokeWidth={3}
                  dot={{ fill: '#7CB89B', r: 4 }}
                  activeDot={{ r: 6 }}
                  name={owner?.revenue || 'Revenus'}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#D08080"
                  strokeWidth={3}
                  dot={{ fill: '#D08080', r: 4 }}
                  activeDot={{ r: 6 }}
                  name={owner?.expenses || 'Dépenses'}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Occupation by Property */}
          {occupationData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.01 }}
              className="relative overflow-hidden bg-white superellipse-3xl shadow-lg p-6"
              style={{ boxShadow: '0 8px 32px rgba(156, 86, 152, 0.1)' }}
            >
              {/* Decorative circle */}
              <div
                className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-10"
                style={{ background: ownerGradient }}
              />

              <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                <div
                  className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md"
                  style={{ background: ownerGradient }}
                >
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                {owner?.occupationRate || 'Taux d\'Occupation'}
              </h3>
              <p className="text-sm text-gray-500 mb-6">{owner?.byProperty || 'Par propriété'}</p>

              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={occupationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#999" style={{ fontSize: '11px' }} />
                  <YAxis stroke="#999" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '12px',
                    }}
                    formatter={(value) => [`${value ?? 0}%`, owner?.occupation || 'Occupation']}
                  />
                  <Bar
                    dataKey="occupation"
                    fill="url(#ownerGradient)"
                    radius={[12, 12, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="ownerGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#9c5698" />
                      <stop offset="50%" stopColor="#9c5698" />
                      <stop offset="100%" stopColor="#9c5698" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      )}

      {/* Properties Grid - V3 Fun Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative overflow-hidden bg-white superellipse-3xl shadow-lg p-6"
        style={{ boxShadow: '0 8px 32px rgba(156, 86, 152, 0.1)' }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -right-12 -top-12 w-48 h-48 rounded-full opacity-5"
          style={{ background: ownerGradient }}
        />
        <div
          className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full opacity-5"
          style={{ background: ownerGradient }}
        />

        <div className="relative flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div
                className="w-10 h-10 superellipse-xl flex items-center justify-center shadow-md"
                style={{ background: ownerGradient }}
              >
                <Building2 className="w-5 h-5 text-white" />
              </div>
              {owner?.myProperties || 'Mes Propriétés'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {properties.length} {properties.length > 1 ? (owner?.propertiesTotal || 'propriétés au total') : (owner?.propertyTotal || 'propriété au total')}
            </p>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => router.push('/properties/add')}
              className="rounded-full text-white shadow-lg hover:shadow-xl transition-all"
              style={{
                background: ownerGradient,
                boxShadow: '0 4px 14px rgba(156, 86, 152, 0.3)',
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              {owner?.add || 'Ajouter'}
            </Button>
          </motion.div>
        </div>

        {properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden superellipse-3xl p-12 text-center"
            style={{
              background: ownerGradientLight,
              boxShadow: '0 12px 32px rgba(156, 86, 152, 0.08)',
            }}
          >
            {/* V3 Fun Icon with Glow */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              className="relative w-24 h-24 mx-auto mb-6"
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 superellipse-2xl opacity-30"
                style={{
                  background: ownerGradient,
                  filter: 'blur(20px)',
                }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              />
              {/* Main icon container */}
              <div
                className="relative w-24 h-24 superellipse-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: ownerGradient,
                  boxShadow: '0 8px 24px rgba(156, 86, 152, 0.35)',
                }}
              >
                <Building2 className="w-12 h-12 text-white" />
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 superellipse-2xl bg-white/20"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                />
              </div>
              {/* Floating sparkle */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <Sparkles className="w-6 h-6" style={{ color: '#9c5698' }} />
              </motion.div>
            </motion.div>

            <h4 className="text-2xl font-bold text-gray-900 mb-3">
              {owner?.startRealEstateAdventure || 'Commencez votre aventure immobilière'}
            </h4>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              {owner?.addFirstPropertyDescription || 'Ajoutez votre première propriété et commencez à gérer votre portefeuille en toute simplicité'}
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => router.push('/properties/add')}
                className="rounded-full text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                style={{
                  background: ownerGradient,
                  boxShadow: '0 6px 20px rgba(156, 86, 152, 0.4)',
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                {owner?.addMyFirstProperty || 'Ajouter ma première propriété'}
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.slice(0, 6).map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/properties/${property.id}`)}
                className="group relative bg-white superellipse-2xl p-4 shadow-lg cursor-pointer overflow-hidden"
                style={{ boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)' }}
              >
                {/* Decorative circle */}
                <div
                  className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10"
                  style={{ background: ownerGradient }}
                />

                {/* Status Badge */}
                <Badge
                  variant={property.status === 'published' ? 'success' : property.status === 'rented' ? 'default' : 'warning'}
                  className="absolute top-4 right-4 z-10"
                >
                  {property.status}
                </Badge>

                {/* Image or Placeholder */}
                <div
                  className="relative h-40 superellipse-xl mb-3 overflow-hidden"
                  style={{ background: ownerGradientLight }}
                >
                  {property.main_image ? (
                    <img
                      src={property.main_image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-12 h-12" style={{ color: '#9c5698' }} />
                    </div>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-bold text-gray-900 mb-2 line-clamp-1 transition" style={{ '--tw-text-opacity': 1 } as React.CSSProperties}>
                  {property.title}
                </h4>

                {/* Location */}
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="line-clamp-1">{property.city}</span>
                </div>

                {/* Details */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    {property.bedrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-4 h-4" />
                    {property.bathrooms}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {property.views_count || 0}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">{owner?.monthlyRent || 'Loyer mensuel'}</p>
                    <p className="text-lg font-bold" style={{ color: '#9c5698' }}>
                      €{property.monthly_rent?.toLocaleString()}
                    </p>
                  </div>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:translate-x-1"
                    style={{ background: ownerGradientLight }}
                  >
                    <ArrowRight className="w-4 h-4" style={{ color: '#9c5698' }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {properties.length > 6 && (
          <div className="text-center mt-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard/owner/properties')}
                className="rounded-full border-2"
                style={{
                  borderColor: '#9c5698',
                  color: '#9c5698',
                }}
              >
                {owner?.viewAllProperties || 'Voir toutes les propriétés'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        )}
      </motion.div>
      </div>
    </div>
  );
}
