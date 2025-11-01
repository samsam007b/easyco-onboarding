'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import {
  Users,
  MessageCircle,
  DollarSign,
  Calendar,
  Wrench,
  Home,
  TrendingUp,
  TrendingDown,
  Plus,
  Check,
  Clock,
  ArrowRight,
  Sparkles,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DashboardStats {
  rentStatus: {
    paid: number;
    total: number;
    dueDate: string;
  };
  sharedExpenses: number;
  yourBalance: number; // Positive = owed to you, Negative = you owe
  roommatesCount: number;
  pendingTasks: number;
  unreadMessages: number;
  communityHappiness: number;
}

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

interface Activity {
  id: string;
  icon: any;
  iconBgColor: string;
  title: string;
  subtitle: string;
  time: string;
}

export default function ModernResidentDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const [roommates, setRoommates] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    rentStatus: {
      paid: 850,
      total: 1000,
      dueDate: '2024-11-05'
    },
    sharedExpenses: 125,
    yourBalance: -45, // You owe 45€
    roommatesCount: 4,
    pendingTasks: 3,
    unreadMessages: 2,
    communityHappiness: 94
  });
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Payer le loyer',
      dueDate: '2024-11-05',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Réunion de maison',
      dueDate: '2024-11-08',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Nettoyage cuisine',
      dueDate: '2024-11-09',
      priority: 'low'
    }
  ]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([
    {
      id: '1',
      icon: DollarSign,
      iconBgColor: 'bg-green-100',
      title: 'Sarah a payé les courses',
      subtitle: '€45.50',
      time: 'Il y a 2h'
    },
    {
      id: '2',
      icon: MessageCircle,
      iconBgColor: 'bg-blue-100',
      title: 'Nouveau message de Marc',
      subtitle: 'Groupe "Ma Coloc"',
      time: 'Il y a 4h'
    },
    {
      id: '3',
      icon: Check,
      iconBgColor: 'bg-purple-100',
      title: 'Tâche complétée',
      subtitle: 'Nettoyage salle de bain',
      time: 'Hier'
    }
  ]);

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

      // Load property membership
      const { data: propertyMember } = await supabase
        .from('property_members')
        .select(`
          *,
          properties (
            id,
            title,
            address,
            city,
            main_image,
            monthly_rent
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (propertyMember && propertyMember.properties) {
        setCurrentProperty(propertyMember.properties);

        // Update rent stats with real data
        const rentTotal = propertyMember.properties.monthly_rent || 1000;
        setStats(prev => ({
          ...prev,
          rentStatus: {
            ...prev.rentStatus,
            total: rentTotal,
            paid: Math.floor(rentTotal * 0.85) // Mock 85% paid
          }
        }));

        // Load roommates (other members of same property)
        const { data: members } = await supabase
          .from('property_members')
          .select(`
            user_id,
            role,
            users (
              full_name,
              avatar_url
            )
          `)
          .eq('property_id', propertyMember.properties.id)
          .eq('status', 'active')
          .neq('user_id', user.id);

        if (members) {
          setRoommates(members);
          setStats(prev => ({
            ...prev,
            roommatesCount: members.length
          }));
        }
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const rentPercentage = (stats.rentStatus.paid / stats.rentStatus.total) * 100;

  const kpiCards = [
    {
      title: 'Loyer du Mois',
      value: `€${stats.rentStatus.paid}/${stats.rentStatus.total}`,
      subtitle: `Échéance: ${new Date(stats.rentStatus.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`,
      icon: Home,
      gradient: 'from-purple-500 to-purple-700',
      bg: 'from-purple-50 to-purple-100/50',
      progress: rentPercentage,
    },
    {
      title: 'Dépenses Partagées',
      value: `€${stats.sharedExpenses}`,
      subtitle: 'À répartir',
      icon: DollarSign,
      gradient: 'from-yellow-500 to-yellow-700',
      bg: 'from-yellow-50 to-yellow-100/50',
      action: () => router.push('/hub/finances'),
    },
    {
      title: 'Ton Solde',
      value: stats.yourBalance > 0 ? `+€${stats.yourBalance}` : `-€${Math.abs(stats.yourBalance)}`,
      subtitle: stats.yourBalance > 0 ? 'On te doit' : 'Tu dois',
      icon: TrendingUp,
      gradient: stats.yourBalance > 0 ? 'from-emerald-500 to-emerald-700' : 'from-red-500 to-red-700',
      bg: stats.yourBalance > 0 ? 'from-emerald-50 to-emerald-100/50' : 'from-red-50 to-red-100/50',
      action: () => router.push('/hub/finances'),
    },
    {
      title: 'Colocataires',
      value: stats.roommatesCount,
      subtitle: 'Membres actifs',
      icon: Users,
      gradient: 'from-blue-500 to-blue-700',
      bg: 'from-blue-50 to-blue-100/50',
      action: () => router.push('/hub/members'),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Chargement du hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Hub Coliving
        </h1>
        <p className="text-gray-600">
          Bienvenue dans ton espace de vie partagé
        </p>
      </motion.div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={card.action}
              className={cn(
                "relative overflow-hidden rounded-3xl p-6 cursor-pointer transition-all hover:scale-105",
                "bg-white shadow-lg hover:shadow-xl",
                card.action && "hover:ring-2 hover:ring-purple-500"
              )}
            >
              {/* Gradient Background */}
              <div className={cn(
                "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20",
                `bg-gradient-to-br ${card.bg}`
              )} />

              <div className="relative z-10">
                {/* Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                  `bg-gradient-to-br ${card.gradient} shadow-lg`
                )}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-sm font-medium text-gray-600 mb-2">
                  {card.title}
                </h3>

                {/* Value */}
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  {card.value}
                </p>

                {/* Subtitle or Progress */}
                {card.progress !== undefined ? (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          `bg-gradient-to-r ${card.gradient}`
                        )}
                        style={{ width: `${card.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{card.subtitle}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">{card.subtitle}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Current Property Section */}
      {currentProperty && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-purple-600" />
            Ta Résidence
          </h3>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Property Image */}
            <div className="relative h-48 md:h-auto md:w-64 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl overflow-hidden flex-shrink-0">
              {currentProperty.main_image ? (
                <img
                  src={currentProperty.main_image}
                  alt={currentProperty.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Home className="w-16 h-16 text-purple-400" />
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="flex-1">
              <h4 className="text-xl font-bold text-gray-900 mb-2">
                {currentProperty.title}
              </h4>
              <p className="text-gray-600 mb-4">
                {currentProperty.address}, {currentProperty.city}
              </p>

              {/* Roommates */}
              {roommates.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Tes colocataires :</p>
                  <div className="flex flex-wrap gap-3">
                    {roommates.map((member: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-full">
                        {member.users?.avatar_url ? (
                          <img
                            src={member.users.avatar_url}
                            alt={member.users?.full_name || 'User'}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs text-white font-bold">
                            {member.users?.full_name?.charAt(0) || '?'}
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-900">
                          {member.users?.full_name || 'Utilisateur'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => router.push('/hub/members')}
                  className="rounded-full bg-gradient-to-r from-purple-600 to-purple-700"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Voir les membres
                </Button>
                <Button
                  onClick={() => router.push('/messages')}
                  variant="outline"
                  className="rounded-full"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat de groupe
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              Tâches à Venir
            </h3>
            <Button
              onClick={() => router.push('/hub/tasks')}
              variant="ghost"
              size="sm"
              className="rounded-full"
            >
              Tout voir
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-3">
            {upcomingTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    task.priority === 'high' && "bg-red-100",
                    task.priority === 'medium' && "bg-yellow-100",
                    task.priority === 'low' && "bg-green-100"
                  )}>
                    <Clock className={cn(
                      "w-5 h-5",
                      task.priority === 'high' && "text-red-600",
                      task.priority === 'medium' && "text-yellow-600",
                      task.priority === 'low' && "text-green-600"
                    )} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{task.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(task.dueDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                  </div>
                </div>
                <Badge variant={task.priority === 'high' ? 'error' : 'default'}>
                  {task.priority === 'high' ? 'Urgent' : task.priority === 'medium' ? 'Moyen' : 'Bas'}
                </Badge>
              </motion.div>
            ))}
          </div>

          <Button
            onClick={() => router.push('/hub/tasks')}
            variant="outline"
            className="w-full mt-4 rounded-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une tâche
          </Button>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-3xl shadow-lg p-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Activité Récente
          </h3>

          <div className="space-y-3">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", activity.iconBgColor)}>
                    <Icon className="w-5 h-5 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.subtitle}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Community Happiness */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-3xl shadow-lg p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Bonheur de la Coloc
            </h3>
            <p className="text-purple-200 text-sm">Basé sur l'activité et les interactions</p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold">{stats.communityHappiness}%</p>
            <p className="text-purple-200 text-sm mt-1">Excellent!</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
