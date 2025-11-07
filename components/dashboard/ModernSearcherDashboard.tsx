'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import { Heart, Search, FileText, TrendingUp, Bookmark, Users, ArrowRight, Home, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import GooglePlacesAutocomplete from '@/components/ui/google-places-autocomplete';
import DatePicker from '@/components/ui/date-picker';
import BudgetRangePicker from '@/components/ui/budget-range-picker';

interface DashboardStats {
  favoritesCount: number;
  topMatchesCount: number;
  applicationsCount: number;
  profileCompletion: number;
  unreadMessages: number;
}

export default function ModernSearcherDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    favoritesCount: 0,
    topMatchesCount: 0,
    applicationsCount: 0,
    profileCompletion: 0,
    unreadMessages: 0,
  });
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [budgetRange, setBudgetRange] = useState({ min: 0, max: 2000 });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    if (place.formatted_address) {
      setSelectedLocation(place.formatted_address);
    }
  };

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleBudgetChange = (min: number, max: number) => {
    setBudgetRange({ min, max });
  };

  const handleSearch = () => {
    // Build search query
    const params = new URLSearchParams();
    if (selectedLocation) params.set('location', selectedLocation);
    if (budgetRange.max > 0) params.set('max_price', budgetRange.max.toString());
    if (budgetRange.min > 0) params.set('min_price', budgetRange.min.toString());
    if (selectedDate) params.set('move_in_date', selectedDate.toISOString());

    router.push(`/properties/browse?${params.toString()}`);
  };

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Load favorites count
      const { count: favCount } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Load applications count
      const { count: appCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('applicant_id', user.id);

      // Load unread messages count
      const { count: unreadCount } = await supabase
        .from('conversation_participants')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      setStats({
        favoritesCount: favCount || 0,
        topMatchesCount: 5, // Mock - would calculate from matching
        applicationsCount: appCount || 0,
        profileCompletion: 85, // Mock - would calculate from profile
        unreadMessages: unreadCount || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const kpiCards = [
    { title: 'Messages', value: stats.unreadMessages, icon: MessageCircle, gradient: 'from-[#FFA040] to-[#FFB85C]', bg: 'from-orange-50 to-orange-100/50', action: () => router.push('/dashboard/searcher/messages') },
    { title: 'Favoris', value: stats.favoritesCount, icon: Bookmark, gradient: 'from-orange-400 to-orange-600', bg: 'from-orange-50 to-orange-100/50', action: () => router.push('/dashboard/searcher/favorites') },
    { title: 'Top Matchs', value: stats.topMatchesCount, icon: Heart, gradient: 'from-orange-500 to-orange-700', bg: 'from-orange-50 to-orange-100/50', action: () => router.push('/dashboard/searcher/top-matches') },
    { title: 'Candidatures', value: stats.applicationsCount, icon: FileText, gradient: 'from-[#FFB85C] to-[#FFD080]', bg: 'from-yellow-50 to-yellow-100/50', action: () => router.push('/dashboard/searcher/my-applications') },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Trouvez votre colocation idéale</p>
      </motion.div>

      {/* Search Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="rounded-[32px] shadow-xl overflow-visible">
          {/* Glassmorphism container with gradient */}
          <div className="relative overflow-hidden rounded-[32px]"
               style={{
                 background: 'linear-gradient(135deg, rgba(255, 160, 64, 0.25) 0%, rgba(255, 184, 92, 0.22) 50%, rgba(255, 208, 128, 0.25) 100%)',
                 backdropFilter: 'blur(50px) saturate(250%) brightness(1.15)',
                 WebkitBackdropFilter: 'blur(50px) saturate(250%) brightness(1.15)',
                 boxShadow: 'inset 0 0 60px rgba(255, 255, 255, 0.4), inset 0 -2px 30px rgba(255, 160, 64, 0.3)',
               }}
          >
            {/* Light refraction effect */}
            <div className="absolute inset-0 rounded-[32px]"
                 style={{
                   background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 20%, transparent 80%, rgba(255, 160, 64, 0.3) 100%)',
                   mixBlendMode: 'overlay'
                 }}
            />

            {/* Top left light reflection */}
            <div className="absolute top-0 left-0 w-1/2 h-1/2 rounded-[32px]"
                 style={{
                   background: 'radial-gradient(circle at top left, rgba(255, 255, 255, 0.5) 0%, transparent 60%)',
                   mixBlendMode: 'soft-light'
                 }}
            />

            {/* Content */}
            <div className="p-6 md:p-8 relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
                Rechercher une colocation
              </h2>
              <p className="text-white/90 text-center mb-6">
                Affinez votre recherche
              </p>
            </div>

            {/* White section with search inputs */}
            <div className="bg-white p-4 relative z-10 rounded-b-[32px]">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2" style={{ overflow: 'visible' }}>

                {/* Location Input */}
                <div className="p-4 rounded-2xl hover:bg-orange-50/50 transition-all group">
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Où ?
                  </label>
                  <GooglePlacesAutocomplete
                    onPlaceSelect={handlePlaceSelect}
                    placeholder="Ville, quartier..."
                    iconClassName="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors"
                    inputClassName="w-full text-sm text-gray-600 placeholder:text-gray-400 bg-transparent outline-none"
                  />
                </div>

                {/* Budget Input */}
                <div className="p-4 rounded-2xl hover:bg-orange-50/50 transition-all group border-l-0 md:border-l border-gray-200">
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Budget
                  </label>
                  <BudgetRangePicker
                    onBudgetChange={handleBudgetChange}
                    placeholder="€800/mois"
                    iconClassName="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors"
                    inputClassName="w-full text-sm text-gray-600 placeholder:text-gray-400 bg-transparent outline-none"
                    minBudget={0}
                    maxBudget={2000}
                  />
                </div>

                {/* Date Input */}
                <div className="p-4 rounded-2xl hover:bg-orange-50/50 transition-all group border-l-0 md:border-l border-gray-200">
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Quand ?
                  </label>
                  <DatePicker
                    onDateSelect={handleDateSelect}
                    placeholder="Flexible"
                    iconClassName="w-4 h-4 text-gray-400 group-hover:text-orange-600 transition-colors"
                    inputClassName="w-full text-sm text-gray-600 placeholder:text-gray-400 bg-transparent outline-none"
                  />
                </div>

                {/* Search Button */}
                <div className="p-2 flex items-center justify-center">
                  <Button
                    onClick={handleSearch}
                    className="w-full h-full text-gray-900 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #FFA040 0%, #FFB85C 50%, #FFD080 100%)'
                    }}
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Rechercher
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={card.action}
              className="relative overflow-hidden rounded-3xl p-6 cursor-pointer transition-all hover:scale-105 bg-white shadow-lg hover:shadow-xl hover:ring-2 hover:ring-orange-400">
              <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20", `bg-gradient-to-br ${card.bg}`)} />
              <div className="relative z-10">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", `bg-gradient-to-br ${card.gradient} shadow-lg`)}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-r from-[#FFA040] via-[#FFB85C] to-[#FFD080] rounded-3xl shadow-lg p-8 text-white mb-8">
        <h2 className="text-2xl font-bold mb-2">Prêt à trouver votre coloc ?</h2>
        <p className="mb-6 text-orange-50">Explorez nos propriétés et trouvez celle qui vous correspond</p>
        <div className="flex gap-4">
          <Button onClick={() => router.push('/properties/browse')} className="bg-white text-orange-600 hover:bg-orange-50 rounded-full">
            <Search className="w-4 h-4 mr-2" />Explorer les propriétés
          </Button>
          <Button onClick={() => router.push('/dashboard/searcher/top-matches')} variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-full">
            <Heart className="w-4 h-4 mr-2" />Voir mes matchs
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
