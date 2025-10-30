'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/auth/supabase-client';
import { useQuery } from '@tanstack/react-query';
import ResidentHeader from '@/components/layout/ResidentHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Users,
  CheckSquare,
  DollarSign,
  Calendar,
  MessageCircle,
  Ticket,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  assigned_to: string;
  due_date: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

interface FinanceEntry {
  id: string;
  description: string;
  amount: number;
  paid_by: string;
  date: string;
  type: 'expense' | 'payment';
}

export default function ResidentDashboardV2() {
  const router = useRouter();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
      } else {
        setUserId(user.id);
      }
    };
    checkAuth();
  }, [router, supabase]);

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['resident-profile', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      return {
        id: userId,
        first_name: userData?.first_name || 'Resident',
        last_name: userData?.last_name || '',
        full_name: userData?.full_name || 'Resident',
        email: userData?.email || '',
        avatar_url: profileData?.avatar_url,
      };
    },
    enabled: !!userId,
  });

  // Fetch user's group/coloc
  const { data: groupData } = useQuery({
    queryKey: ['resident-group', userId],
    queryFn: async () => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('groups')
        .select('*, property:properties(*)')
        .contains('members', [userId])
        .single();

      if (error) return null;
      return data;
    },
    enabled: !!userId,
  });

  // Mock data for tasks (will be replaced with real Supabase queries)
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Sortir les poubelles',
      assigned_to: userId || '',
      due_date: new Date().toISOString(),
      status: 'pending',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Nettoyer cuisine commune',
      assigned_to: 'other-user',
      due_date: new Date(Date.now() + 86400000).toISOString(),
      status: 'pending',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Acheter produits ménage',
      assigned_to: userId || '',
      due_date: new Date(Date.now() + 172800000).toISOString(),
      status: 'pending',
      priority: 'low',
    },
  ];

  // Mock finance data
  const mockFinances: FinanceEntry[] = [
    {
      id: '1',
      description: 'Loyer Novembre 2025',
      amount: 650,
      paid_by: userId || '',
      date: new Date().toISOString(),
      type: 'payment',
    },
    {
      id: '2',
      description: 'Courses partagées',
      amount: 45,
      paid_by: 'other-user',
      date: new Date(Date.now() - 86400000).toISOString(),
      type: 'expense',
    },
  ];

  // Calculate stats
  const myTasks = mockTasks.filter((t) => t.assigned_to === userId && t.status === 'pending');
  const pendingTasks = myTasks.length;

  // Mock balance calculation (to be replaced with real data)
  const yourBalance: number = -15; // You owe 15€

  const groupName = groupData?.name || 'Ma Coloc';
  const groupMembers = groupData?.members?.length || 4;

  if (!userId || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Resident theme (orange) */}
      <ResidentHeader
        profile={profile}
        groupName={groupName}
        yourBalance={yourBalance}
        pendingTasks={pendingTasks}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Bienvenue au Hub, {profile.first_name}! 👋
              </h1>
              <p className="text-lg text-orange-100">
                <span className="font-semibold">{groupName}</span> • {groupMembers} colocataires
              </p>
            </div>
            <div className="flex items-center gap-3">
              {yourBalance !== 0 && (
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <p className="text-sm text-orange-100">Ton solde</p>
                  <p className="text-xl font-bold">
                    {yourBalance > 0
                      ? `On te doit €${Math.abs(yourBalance)}`
                      : `Tu dois €${Math.abs(yourBalance)}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link href="/hub/tasks">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <CheckSquare className="w-8 h-8 text-orange-600" />
                {pendingTasks > 0 && (
                  <Badge variant="error">{pendingTasks}</Badge>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">{pendingTasks}</p>
              <p className="text-sm text-gray-600">Tâches à faire</p>
            </div>
          </Link>

          <Link href="/hub/finances">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                {yourBalance < 0 && (
                  <Badge variant="warning">À payer</Badge>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">
                €{Math.abs(yourBalance)}
              </p>
              <p className="text-sm text-gray-600">
                {yourBalance >= 0 ? 'On te doit' : 'Tu dois'}
              </p>
            </div>
          </Link>

          <Link href="/hub/calendar">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-600">Événements</p>
            </div>
          </Link>

          <Link href="/hub/tickets">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <Ticket className="w-8 h-8 text-purple-600" />
                <Badge variant="success">1 nouveau</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900">2</p>
              <p className="text-sm text-gray-600">Tickets ouverts</p>
            </div>
          </Link>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Tâches de la Semaine</h2>
                <p className="text-sm text-gray-600">Rotation automatique</p>
              </div>
            </div>
            <Link href="/hub/tasks/new">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nouvelle tâche
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {mockTasks.map((task) => {
              const isMyTask = task.assigned_to === userId;
              const priorityColors = {
                high: 'bg-red-100 text-red-800 border-red-200',
                medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                low: 'bg-green-100 text-green-800 border-green-200',
              };

              return (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 border-2 rounded-lg transition ${
                    isMyTask
                      ? 'border-orange-300 bg-orange-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      className="w-5 h-5 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <div>
                      <p className={`font-semibold ${isMyTask ? 'text-gray-900' : 'text-gray-700'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-600">
                          {isMyTask ? 'À toi' : 'Assigné à un colocataire'}
                        </p>
                        <span className="text-gray-400">•</span>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.due_date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Badge
                    className={`${priorityColors[task.priority]} border`}
                  >
                    {task.priority === 'high' && 'Urgent'}
                    {task.priority === 'medium' && 'Normal'}
                    {task.priority === 'low' && 'Faible'}
                  </Badge>
                </div>
              );
            })}
          </div>

          {mockTasks.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600">Toutes les tâches sont terminées! 🎉</p>
            </div>
          )}
        </div>

        {/* Finances Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Finances Partagées</h2>
                <p className="text-sm text-gray-600">Transactions récentes</p>
              </div>
            </div>
            <Link href="/hub/finances">
              <Button variant="outline">Voir tout</Button>
            </Link>
          </div>

          {/* Balance Summary */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 mb-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Ton solde actuel</p>
                <p className="text-3xl font-bold text-green-900">
                  {yourBalance >= 0 ? '+' : ''}€{yourBalance}
                </p>
              </div>
              <div className="text-right">
                {yourBalance < 0 && (
                  <Link href="/hub/finances/pay">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      Régler maintenant
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="space-y-3">
            {mockFinances.map((finance) => (
              <div
                key={finance.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      finance.type === 'payment'
                        ? 'bg-blue-100'
                        : 'bg-orange-100'
                    }`}
                  >
                    <DollarSign
                      className={`w-5 h-5 ${
                        finance.type === 'payment' ? 'text-blue-600' : 'text-orange-600'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{finance.description}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(finance.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-lg font-bold ${
                    finance.type === 'payment' ? 'text-green-600' : 'text-orange-600'
                  }`}
                >
                  {finance.type === 'payment' ? '-' : '+'}€{finance.amount}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Prochains Événements</h2>
                <p className="text-sm text-gray-600">Calendrier partagé</p>
              </div>
            </div>
            <Link href="/hub/calendar">
              <Button variant="outline">Voir calendrier</Button>
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 border border-blue-200 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex flex-col items-center justify-center">
                <p className="text-xs font-semibold">NOV</p>
                <p className="text-lg font-bold">05</p>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Paiement du loyer</p>
                <p className="text-sm text-gray-600">Échéance mensuelle</p>
              </div>
              <Badge variant="warning">Dans 5 jours</Badge>
            </div>

            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-lg flex flex-col items-center justify-center">
                <p className="text-xs font-semibold">NOV</p>
                <p className="text-lg font-bold">08</p>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Soirée coloc 🎉</p>
                <p className="text-sm text-gray-600">Organisée par Marie</p>
              </div>
              <Badge variant="info">Dans 8 jours</Badge>
            </div>
          </div>
        </div>

        {/* Chat Preview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Chat de Groupe</h2>
                <p className="text-sm text-gray-600">Messages récents</p>
              </div>
            </div>
            <Link href="/hub/chat">
              <Button variant="outline">Ouvrir le chat</Button>
            </Link>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  M
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Marie</p>
                  <p className="text-sm text-gray-600">
                    Qui veut faire les courses ce soir?
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Il y a 2h</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  J
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Jean</p>
                  <p className="text-sm text-gray-600">
                    Je peux y aller vers 18h!
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Il y a 1h</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link href="/hub/chat">
                <Button variant="outline" className="w-full">
                  Répondre au groupe
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
