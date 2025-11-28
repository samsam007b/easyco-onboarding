import { createClient } from '@/lib/auth/supabase-server';
import {
  MessageSquare,
  Search,
  Users,
  Clock,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

async function getConversations() {
  const supabase = await createClient();

  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      id,
      created_at,
      updated_at,
      property_id,
      properties (
        id,
        title,
        city
      )
    `)
    .order('updated_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }

  return conversations || [];
}

async function getMessageStats() {
  const supabase = await createClient();

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    { count: totalMessages },
    { count: totalConversations },
    { count: todayMessages },
    { count: weekMessages },
  ] = await Promise.all([
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('conversations').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }).gte('created_at', today.toISOString()),
    supabase.from('messages').select('*', { count: 'exact', head: true }).gte('created_at', lastWeek.toISOString()),
  ]);

  return {
    totalMessages: totalMessages || 0,
    totalConversations: totalConversations || 0,
    todayMessages: todayMessages || 0,
    weekMessages: weekMessages || 0,
  };
}

export default async function AdminMessagesPage() {
  const [conversations, stats] = await Promise.all([
    getConversations(),
    getMessageStats(),
  ]);

  const statCards = [
    {
      title: 'Total messages',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'purple',
    },
    {
      title: 'Conversations',
      value: stats.totalConversations,
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Aujourd\'hui',
      value: stats.todayMessages,
      icon: Clock,
      color: 'green',
    },
    {
      title: 'Cette semaine',
      value: stats.weekMessages,
      icon: CheckCircle,
      color: 'orange',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
      green: { bg: 'bg-green-500/10', text: 'text-green-400' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
    };
    return colors[color] || colors.purple;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const colors = getColorClasses(stat.color);
          return (
            <Card key={stat.title} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <stat.icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Conversations List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Conversations récentes</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Aucune conversation trouvée</p>
            </div>
          ) : (
            <div className="space-y-3">
              {conversations.map((conversation: any) => (
                <div
                  key={conversation.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {conversation.properties?.title || 'Conversation'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {conversation.properties?.city || 'N/A'} • Mise à jour {formatDate(conversation.updated_at)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      ID: {conversation.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-2">
                Gestion des messages
              </h3>
              <p className="text-sm text-slate-400">
                Cette page affiche les statistiques globales des messages échangés sur la plateforme.
                Les messages sont privés et ne peuvent être lus que par les participants de chaque conversation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
