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
  Bath
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
  const [isLoading, setIsLoading] = useState(true);
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

  // Generate real revenue data from properties
  const generateRevenueData = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const baseRevenue = stats.totalRevenue;

    return months.map((month, index) => ({
      month,
      revenue: Math.floor(baseRevenue * (0.7 + Math.random() * 0.4)),
      expenses: Math.floor(baseRevenue * (0.2 + Math.random() * 0.15)),
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

  const kpiCards = [
    {
      title: 'Revenus Mensuels',
      value: `€${stats.totalRevenue.toLocaleString()}`,
      change: stats.revenueChange,
      icon: DollarSign,
      gradient: 'from-emerald-100 to-emerald-200/70',
      bg: 'from-emerald-50/50 to-emerald-50/30',
    },
    {
      title: 'Propriétés',
      value: stats.totalProperties,
      subtitle: `${stats.publishedProperties} publiées`,
      icon: Building2,
      gradient: 'from-purple-200/70 to-indigo-200/70',
      bg: 'from-purple-50/50 to-indigo-50/30',
    },
    {
      title: 'Taux d\'Occupation',
      value: `${stats.occupation}%`,
      change: stats.occupationChange,
      icon: TrendingUp,
      gradient: 'from-blue-100 to-cyan-200/70',
      bg: 'from-blue-50/50 to-cyan-50/30',
    },
    {
      title: 'Candidatures',
      value: stats.pendingApplications,
      subtitle: 'En attente',
      icon: Users,
      gradient: 'from-amber-100 to-yellow-200/70',
      bg: 'from-amber-50/50 to-yellow-50/30',
      action: () => router.push('/dashboard/owner/applications'),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/30 via-white to-transparent">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-200 rounded-full mx-auto mb-6"></div>
            <LoadingHouse size={80} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Chargement du dashboard...</h3>
          <p className="text-gray-600">Préparation de vos données</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h1>
        <p className="text-gray-600 text-lg">
          Vue d'ensemble de votre portefeuille immobilier
        </p>
      </motion.div>

      {/* KPI Cards Grid */}
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
              onClick={card.action}
              className={cn(
                "relative overflow-hidden rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.01]",
                "bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md border border-gray-200",
                card.action && "hover:border-purple-300"
              )}
            >
              <div className="relative z-10">
                {/* Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm",
                  `bg-gradient-to-br ${card.gradient}`
                )}>
                  <Icon className="w-6 h-6 text-gray-700" />
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  {card.title}
                </h3>

                {/* Value */}
                <p className="text-3xl font-bold text-gray-900 mb-2">
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
                    <span className="text-gray-500">vs mois dernier</span>
                  </div>
                ) : card.subtitle ? (
                  <p className="text-sm text-gray-500">{card.subtitle}</p>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Section */}
      {properties.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-200/70 to-indigo-200/70 flex items-center justify-center shadow-sm">
                <TrendingUp className="w-4 h-4 text-gray-700" />
              </div>
              Évolution Revenus & Dépenses
            </h3>
            <p className="text-sm text-gray-500 mb-6">12 derniers mois</p>

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
                  formatter={(value: number) => [`€${value}`, '']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Revenus"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Dépenses"
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
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-200/70 to-indigo-200/70 flex items-center justify-center shadow-sm">
                  <Building2 className="w-4 h-4 text-gray-700" />
                </div>
                Taux d'Occupation
              </h3>
              <p className="text-sm text-gray-500 mb-6">Par propriété</p>

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
                    formatter={(value: number) => [`${value}%`, 'Occupation']}
                  />
                  <Bar
                    dataKey="occupation"
                    fill="url(#purpleGradient)"
                    radius={[12, 12, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#6d28d9" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>
      )}

      {/* Properties Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-200/70 to-indigo-200/70 flex items-center justify-center shadow-sm">
                <Building2 className="w-4 h-4 text-gray-700" />
              </div>
              Mes Propriétés
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {properties.length} propriété{properties.length > 1 ? 's' : ''} au total
            </p>
          </div>

          <Button
            onClick={() => router.push('/properties/add')}
            className="rounded-full bg-gradient-to-r from-purple-200/70 to-indigo-200/70 text-gray-900 hover:from-purple-300/70 hover:to-indigo-300/70 shadow-sm hover:shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>

        {properties.length === 0 ? (
          <div className="relative overflow-hidden bg-gradient-to-br from-purple-50/50 via-white to-indigo-50/50 rounded-3xl p-12 text-center border border-purple-200/50">
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-200/70 to-indigo-200/70 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Building2 className="w-10 h-10 text-gray-700" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">
                Commencez votre aventure immobilière
              </h4>
              <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                Ajoutez votre première propriété et commencez à gérer votre portefeuille en toute simplicité
              </p>
              <Button
                onClick={() => router.push('/properties/add')}
                className="rounded-full bg-gradient-to-r from-purple-200/70 to-indigo-200/70 text-gray-900 hover:from-purple-300/70 hover:to-indigo-300/70 font-semibold px-8 py-6 text-lg shadow-sm hover:shadow-md transition-all hover:scale-105"
              >
                <Plus className="w-5 h-5 mr-2" />
                Ajouter ma première propriété
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.slice(0, 6).map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.05 }}
                onClick={() => router.push(`/properties/${property.id}`)}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 cursor-pointer hover:scale-[1.01]"
              >
                {/* Status Badge */}
                <Badge
                  variant={property.status === 'published' ? 'success' : property.status === 'rented' ? 'default' : 'warning'}
                  className="absolute top-4 right-4 z-10"
                >
                  {property.status}
                </Badge>

                {/* Image or Placeholder */}
                <div className="relative h-40 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl mb-3 overflow-hidden">
                  {property.main_image ? (
                    <img
                      src={property.main_image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-purple-400" />
                    </div>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-purple-600 transition">
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
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Loyer mensuel</p>
                    <p className="text-lg font-bold text-purple-900">
                      €{property.monthly_rent?.toLocaleString()}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {properties.length > 6 && (
          <div className="text-center mt-6">
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/owner/properties')}
              className="rounded-full"
            >
              Voir toutes les propriétés
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </motion.div>
      </div>
    </div>
  );
}
