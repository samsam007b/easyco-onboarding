'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import { Heart, Search, FileText, TrendingUp, Bookmark, Users, ArrowRight, Home, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DashboardStats {
  favoritesCount: number;
  topMatchesCount: number;
  applicationsCount: number;
  profileCompletion: number;
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

      setStats({
        favoritesCount: favCount || 0,
        topMatchesCount: 5, // Mock - would calculate from matching
        applicationsCount: appCount || 0,
        profileCompletion: 85, // Mock - would calculate from profile
      });
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const kpiCards = [
    { title: 'Favoris', value: stats.favoritesCount, icon: Bookmark, gradient: 'from-orange-400 to-orange-600', bg: 'from-orange-50 to-orange-100/50', action: () => router.push('/dashboard/searcher/favorites') },
    { title: 'Top Matchs', value: stats.topMatchesCount, icon: Heart, gradient: 'from-[#FFA040] to-[#FFB85C]', bg: 'from-orange-50 to-orange-100/50', action: () => router.push('/dashboard/searcher/top-matches') },
    { title: 'Candidatures', value: stats.applicationsCount, icon: FileText, gradient: 'from-orange-500 to-orange-700', bg: 'from-orange-50 to-orange-100/50', action: () => router.push('/dashboard/searcher/my-applications') },
    { title: 'Profil Complété', value: `${stats.profileCompletion}%`, icon: TrendingUp, gradient: 'from-green-500 to-green-700', bg: 'from-green-50 to-green-100/50', action: () => router.push('/profile') },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p className="text-gray-600">Trouvez votre colocation idéale</p>
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
