'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gift, Users, Award, TrendingUp, Share2, UserPlus, Sparkles, Home, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReferralCodeCard, ReferralStatsCard } from '@/components/referral';
import { getReferralStats } from '@/lib/services/referral-service';
import type { ReferralStats } from '@/types/referral.types';
import { toast } from 'sonner';

export default function ReferralsSettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState<string>('');
  const [stats, setStats] = useState<ReferralStats | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get user type
      const { data: userData } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (userData) {
        setUserType(userData.user_type);
      }

      // Get referral stats
      const result = await getReferralStats();
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error loading referral data:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  // Role-specific colors
  const getRoleColors = () => {
    if (userType === 'owner') return {
      gradient: 'from-purple-100 to-pink-100/70',
      light: 'from-purple-50/30 via-white to-pink-50/20',
      accent: 'purple',
    };
    if (userType === 'resident') return {
      gradient: 'from-[#F5D5CF] to-[#FFDAC9]/70',
      light: 'from-[#FFF3EF]/30 via-white to-[#FFEBE5]/20',
      accent: 'orange',
    };
    return {
      gradient: 'from-[#FFA040] to-[#FFB85C]',
      light: 'from-orange-50 via-white to-yellow-50/30',
      accent: 'orange',
    };
  };

  const colors = getRoleColors();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-gradient-to-br", colors.light)}>
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            {/* Back Button */}
            <Button
              onClick={() => router.push('/settings')}
              variant="ghost"
              className="mb-6 rounded-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux paramètres
            </Button>

            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
                   style={{
                     background: 'linear-gradient(135deg, #22C55E 0%, #10B981 50%, #059669 100%)'
                   }}>
                  <Gift className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Parrainage</h1>
              <p className="text-gray-600 text-lg">
                Invitez vos amis et gagnez des mois d'abonnement gratuits
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Stats Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Invitations</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.total_referrals || 0}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Réussies</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.successful_referrals || 0}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-600">Mois gagnés</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {stats?.credits_earned || 0}
            </p>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Referral Code Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {stats && (
              <ReferralCodeCard
                code={stats.code}
                shareUrl={stats.share_url}
              />
            )}
          </motion.div>

          {/* Stats Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {stats && (
              <ReferralStatsCard stats={stats} />
            )}
          </motion.div>
        </div>

        {/* How it works section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                   style={{
                     background: 'linear-gradient(135deg, #22C55E 0%, #10B981 50%, #059669 100%)'
                   }}>
                <Gift className="w-5 h-5 text-white" />
              </div>
              Comment ça marche ?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 shadow-sm flex items-center justify-center mx-auto mb-4 border border-green-200">
                  <Share2 className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Partagez votre code</h3>
                <p className="text-sm text-gray-600">
                  Envoyez votre code unique à vos amis par WhatsApp, email ou autre
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-sm flex items-center justify-center mx-auto mb-4 border border-blue-200">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Ils s'inscrivent</h3>
                <p className="text-sm text-gray-600">
                  Vos amis créent leur compte en utilisant votre code de parrainage
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 shadow-sm flex items-center justify-center mx-auto mb-4 border border-purple-200">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Vous êtes récompensés</h3>
                <p className="text-sm text-gray-600">
                  Une fois leur inscription finalisée, vous recevez tous les deux des mois gratuits
                </p>
              </div>
            </div>

            {/* Rewards table */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">Récompenses</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-orange-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Home className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="font-medium text-gray-900">Inviter un résident</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">Vous: </span>
                    <span className="font-bold text-orange-600">+2 mois</span>
                    <span className="text-gray-300 mx-2">|</span>
                    <span className="text-sm text-gray-600">Lui: </span>
                    <span className="font-bold text-orange-600">+1 mois</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-900">Inviter un propriétaire</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">Vous: </span>
                    <span className="font-bold text-purple-600">+3 mois</span>
                    <span className="text-gray-300 mx-2">|</span>
                    <span className="text-sm text-gray-600">Lui: </span>
                    <span className="font-bold text-purple-600">+1 mois</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Maximum 24 mois de crédits accumulables
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
