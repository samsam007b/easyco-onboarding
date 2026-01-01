'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { useRole } from '@/lib/role/role-context';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Plus,
  Search,
  Home,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Filter,
  User,
  MessageCircle,
  CreditCard,
  ChevronRight,
  MoreVertical,
  RefreshCw,
  UserPlus,
  Languages,
  Heart,
  Volume2,
  Sparkle,
  PawPrint,
  Cigarette
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';

// V3 Owner gradient constants
const ownerGradient = 'linear-gradient(135deg, #9c5698 0%, #a5568d 25%, #af5682 50%, #b85676 75%, #c2566b 100%)';
const ownerGradientLight = 'linear-gradient(135deg, #F8F0F7 0%, #FDF5F9 100%)';

interface PropertyResident {
  id: string;
  property_id: string;
  first_name: string;
  last_name: string;
  age: number | null;
  gender: string | null;
  occupation: string | null;
  bio: string | null;
  photo_url: string | null;
  interests: string[] | null;
  languages: string[] | null;
  is_smoker: boolean;
  has_pets: boolean;
  cleanliness_level: number | null;
  noise_tolerance: number | null;
  social_preference: number | null;
  move_in_date: string | null;
  lease_duration_months: number | null;
  created_at: string;
  // Enriched fields
  property_name?: string;
  payment_status?: 'paid' | 'pending' | 'overdue';
  rent_amount?: number;
}

interface PropertyInfo {
  id: string;
  name: string;
  address: string;
  city: string;
  resident_count: number;
}

interface TenantStats {
  total: number;
  active: number;
  newThisMonth: number;
  leavingSoon: number;
}

export default function TenantsPage() {
  const router = useRouter();
  const { setActiveRole } = useRole();

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProperty, setFilterProperty] = useState<string>('all');
  const [residents, setResidents] = useState<PropertyResident[]>([]);
  const [properties, setProperties] = useState<PropertyInfo[]>([]);
  const [stats, setStats] = useState<TenantStats>({
    total: 0,
    active: 0,
    newThisMonth: 0,
    leavingSoon: 0,
  });

  // Fetch all tenants across user's properties
  const fetchTenantsData = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
        return;
      }

      setActiveRole('owner');

      // 1. Get user's properties
      const { data: userProperties, error: propError } = await supabase
        .from('properties')
        .select('id, name, address, city')
        .eq('owner_id', user.id);

      if (propError) {
        console.error('[Tenants] Failed to fetch properties:', propError);
        setIsLoading(false);
        return;
      }

      if (!userProperties || userProperties.length === 0) {
        setProperties([]);
        setResidents([]);
        setIsLoading(false);
        return;
      }

      const propertyIds = userProperties.map(p => p.id);

      // 2. Fetch residents for all properties
      const { data: allResidents, error: resError } = await supabase
        .from('property_residents')
        .select('*')
        .in('property_id', propertyIds)
        .order('created_at', { ascending: false });

      if (resError) {
        console.error('[Tenants] Failed to fetch residents:', resError);
      }

      // 3. Fetch rent payments to determine payment status
      const { data: rentPayments } = await supabase
        .from('rent_payments')
        .select('user_id, status, amount, due_date')
        .in('property_id', propertyIds)
        .gte('due_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

      // Create property map with resident counts
      const propertyResidentCounts = new Map<string, number>();
      allResidents?.forEach(r => {
        const count = propertyResidentCounts.get(r.property_id) || 0;
        propertyResidentCounts.set(r.property_id, count + 1);
      });

      const enrichedProperties: PropertyInfo[] = userProperties.map(p => ({
        ...p,
        resident_count: propertyResidentCounts.get(p.id) || 0,
      }));

      setProperties(enrichedProperties);

      // Enrich residents with property names and payment info
      const propertyMap = new Map(userProperties.map(p => [p.id, p.name]));
      const enrichedResidents: PropertyResident[] = (allResidents || []).map(r => ({
        ...r,
        property_name: propertyMap.get(r.property_id) || 'Propriété',
        // For now, payment status is random demo - would need user_id linkage in real app
        payment_status: ['paid', 'paid', 'paid', 'pending', 'overdue'][Math.floor(Math.random() * 5)] as any,
      }));

      setResidents(enrichedResidents);

      // Calculate stats
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());

      const newThisMonth = enrichedResidents.filter(r =>
        r.created_at && new Date(r.created_at) >= startOfMonth
      ).length;

      const leavingSoon = enrichedResidents.filter(r => {
        if (!r.move_in_date || !r.lease_duration_months) return false;
        const leaseEnd = new Date(r.move_in_date);
        leaseEnd.setMonth(leaseEnd.getMonth() + r.lease_duration_months);
        return leaseEnd <= threeMonthsFromNow;
      }).length;

      setStats({
        total: enrichedResidents.length,
        active: enrichedResidents.length, // All are active for now
        newThisMonth,
        leavingSoon,
      });

    } catch (error) {
      console.error('[Tenants] Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [router, setActiveRole]);

  useEffect(() => {
    fetchTenantsData();
  }, [fetchTenantsData]);

  // Filter residents
  const filteredResidents = residents.filter(resident => {
    // Property filter
    if (filterProperty !== 'all' && resident.property_id !== filterProperty) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = `${resident.first_name} ${resident.last_name}`.toLowerCase();
      const occupation = resident.occupation?.toLowerCase() || '';
      const propertyName = resident.property_name?.toLowerCase() || '';

      return fullName.includes(query) ||
             occupation.includes(query) ||
             propertyName.includes(query);
    }

    return true;
  });

  // Get payment status config
  const getPaymentStatusConfig = (status?: 'paid' | 'pending' | 'overdue') => {
    const config = {
      paid: {
        className: 'bg-green-100 text-green-700 border-green-200',
        label: 'Payé',
        icon: CheckCircle,
      },
      pending: {
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        label: 'En attente',
        icon: Clock,
      },
      overdue: {
        className: 'bg-red-100 text-red-700 border-red-200',
        label: 'Impayé',
        icon: AlertCircle,
      },
    };
    return config[status || 'pending'];
  };

  // Format lease end date
  const getLeaseEndDate = (moveInDate: string | null, durationMonths: number | null) => {
    if (!moveInDate || !durationMonths) return null;
    const endDate = new Date(moveInDate);
    endDate.setMonth(endDate.getMonth() + durationMonths);
    return endDate;
  };

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: ownerGradientLight }}
      >
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <LoadingHouse size={80} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chargement des locataires...
          </h3>
          <p className="text-gray-600">
            Récupération des données depuis Supabase
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: ownerGradientLight }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6"
        >
          {/* V3 Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10" style={{ background: ownerGradient }} />
          <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full opacity-10" style={{ background: ownerGradient }} />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                {/* V3 Animated Icon with glow */}
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-2xl blur-lg"
                    style={{ background: ownerGradient }}
                  />
                  <div
                    className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: ownerGradient }}
                  >
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <motion.div
                    animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </motion.div>
                </div>
                Locataires
              </h1>
              <p className="text-gray-600">
                {stats.total} locataire{stats.total !== 1 ? 's' : ''} sur {properties.length} propriété{properties.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsLoading(true);
                    fetchTenantsData();
                  }}
                  className="rounded-full border-gray-300 hover:border-purple-400"
                >
                  <RefreshCw className="w-5 h-5" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {/* TODO: Open add tenant modal */}}
                  className="rounded-full text-white border-0 shadow-md hover:shadow-lg transition-all"
                  style={{
                    background: ownerGradient,
                    boxShadow: '0 4px 12px rgba(156, 86, 152, 0.3)'
                  }}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Ajouter Locataire
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Stats */}
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden p-4 rounded-xl border border-purple-200/50 shadow-sm"
              style={{ background: ownerGradientLight }}
            >
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full opacity-15" style={{ background: ownerGradient }} />
              <div className="relative flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                  style={{ background: ownerGradient }}
                >
                  <Users className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Total</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#9c5698' }}>{stats.total}</p>
            </motion.div>

            {/* Active */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.15 }}
              className="relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200/50 shadow-sm"
            >
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-green-400 opacity-15" />
              <div className="relative flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-sm">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Actifs</p>
              </div>
              <p className="text-2xl font-bold text-green-700">{stats.active}</p>
            </motion.div>

            {/* New this month */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.2 }}
              className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200/50 shadow-sm"
            >
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-blue-400 opacity-15" />
              <div className="relative flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Nouveaux</p>
              </div>
              <p className="text-2xl font-bold text-blue-700">{stats.newThisMonth}</p>
              <p className="text-xs text-gray-500">ce mois</p>
            </motion.div>

            {/* Leaving soon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              transition={{ delay: 0.25 }}
              className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-xl border border-amber-200/50 shadow-sm"
            >
              <div className="absolute -top-3 -right-3 w-12 h-12 rounded-full bg-amber-400 opacity-15" />
              <div className="relative flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-sm">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Fin de bail</p>
              </div>
              <p className="text-2xl font-bold text-amber-700">{stats.leavingSoon}</p>
              <p className="text-xs text-gray-500">dans 3 mois</p>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un locataire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all"
              />
            </div>

            {/* Property filter */}
            <div className="relative">
              <select
                value={filterProperty}
                onChange={(e) => setFilterProperty(e.target.value)}
                className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all cursor-pointer min-w-[200px]"
              >
                <option value="all">Toutes les propriétés</option>
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.resident_count})
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Tenants List */}
        <AnimatePresence mode="wait">
          {filteredResidents.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-gray-200"
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10" style={{ background: ownerGradient }} />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-10" style={{ background: ownerGradient }} />

              <div className="relative w-20 h-20 mx-auto mb-6">
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.4, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-2xl blur-lg"
                  style={{ background: ownerGradient }}
                />
                <div
                  className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: ownerGradient }}
                >
                  <Users className="w-10 h-10 text-white" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {properties.length === 0
                  ? 'Aucune propriété'
                  : searchQuery || filterProperty !== 'all'
                    ? 'Aucun locataire trouvé'
                    : 'Aucun locataire'}
              </h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto">
                {properties.length === 0
                  ? 'Ajoutez une propriété pour gérer vos locataires'
                  : searchQuery || filterProperty !== 'all'
                    ? 'Essayez une autre recherche ou filtre'
                    : 'Ajoutez des locataires à vos propriétés'}
              </p>
              {properties.length > 0 && !searchQuery && filterProperty === 'all' && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => {/* TODO: Open add tenant modal */}}
                    className="rounded-full text-white border-0 px-8 shadow-md hover:shadow-lg transition-all"
                    style={{
                      background: ownerGradient,
                      boxShadow: '0 4px 12px rgba(156, 86, 152, 0.3)'
                    }}
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Ajouter un locataire
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
            >
              {filteredResidents.map((resident, index) => {
                const paymentConfig = getPaymentStatusConfig(resident.payment_status);
                const PaymentIcon = paymentConfig.icon;
                const leaseEndDate = getLeaseEndDate(resident.move_in_date, resident.lease_duration_months);
                const isLeavingSoon = leaseEndDate && leaseEndDate <= new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

                return (
                  <motion.div
                    key={resident.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01, y: -2 }}
                    transition={{ delay: 0.05 + index * 0.02 }}
                    className="relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 p-5 cursor-pointer"
                    onClick={() => {/* TODO: Open resident details */}}
                  >
                    <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10" style={{ background: ownerGradient }} />

                    <div className="relative flex gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {resident.photo_url ? (
                          <img
                            src={resident.photo_url}
                            alt={`${resident.first_name} ${resident.last_name}`}
                            className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                          />
                        ) : (
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-sm"
                            style={{ background: ownerGradient }}
                          >
                            {getInitials(resident.first_name, resident.last_name)}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              {resident.first_name} {resident.last_name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Home className="w-4 h-4 text-gray-400" />
                              <span className="truncate">{resident.property_name}</span>
                            </div>
                          </div>
                          <Badge className={cn(paymentConfig.className, "border flex-shrink-0")}>
                            <PaymentIcon className="w-3 h-3 mr-1" />
                            {paymentConfig.label}
                          </Badge>
                        </div>

                        {/* Details */}
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-3">
                          {resident.occupation && (
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                              <span>{resident.occupation}</span>
                            </div>
                          )}
                          {resident.age && (
                            <div className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              <span>{resident.age} ans</span>
                            </div>
                          )}
                        </div>

                        {/* Lifestyle badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {resident.languages && resident.languages.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs">
                              <Languages className="w-3 h-3" />
                              {resident.languages.slice(0, 2).join(', ')}
                            </span>
                          )}
                          {resident.has_pets && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs">
                              <PawPrint className="w-3 h-3" />
                              Animaux
                            </span>
                          )}
                          {resident.is_smoker && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs">
                              <Cigarette className="w-3 h-3" />
                              Fumeur
                            </span>
                          )}
                        </div>

                        {/* Lease info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm">
                            {resident.move_in_date && (
                              <div className="flex items-center gap-1 text-gray-500">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>
                                  Depuis {format(new Date(resident.move_in_date), 'MMM yyyy', { locale: fr })}
                                </span>
                              </div>
                            )}
                            {leaseEndDate && (
                              <div className={cn(
                                "flex items-center gap-1",
                                isLeavingSoon ? "text-amber-600 font-medium" : "text-gray-500"
                              )}>
                                <Clock className="w-3.5 h-3.5" />
                                <span>
                                  Fin: {format(leaseEndDate, 'MMM yyyy', { locale: fr })}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Quick actions */}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg h-8 w-8 p-0 hover:bg-purple-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                /* TODO: Open messages */
                              }}
                            >
                              <MessageCircle className="w-4 h-4 text-gray-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="rounded-lg h-8 w-8 p-0 hover:bg-purple-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                /* TODO: Open payment */
                              }}
                            >
                              <CreditCard className="w-4 h-4 text-gray-500" />
                            </Button>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
