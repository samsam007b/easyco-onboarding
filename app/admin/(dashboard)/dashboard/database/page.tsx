import { createClient } from '@/lib/auth/supabase-server';
import {
  Database,
  HardDrive,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  User,
  Home,
  FileText,
  MessageCircle,
  MessageSquare,
  Bell,
  Heart,
  Clipboard,
  Shield,
  Grid,
} from 'react-feather';
import type { Icon } from 'react-feather';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

async function getDatabaseStats() {
  const supabase = await createClient();

  // Get counts from main tables
  const [
    { count: usersCount },
    { count: propertiesCount },
    { count: applicationsCount },
    { count: messagesCount },
    { count: conversationsCount },
    { count: notificationsCount },
    { count: matchesCount },
    { count: auditLogsCount },
    { count: adminsCount },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('conversations').select('*', { count: 'exact', head: true }),
    supabase.from('notifications').select('*', { count: 'exact', head: true }),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
    supabase.from('audit_logs').select('*', { count: 'exact', head: true }),
    supabase.from('admins').select('*', { count: 'exact', head: true }),
  ]);

  return {
    users: usersCount || 0,
    properties: propertiesCount || 0,
    applications: applicationsCount || 0,
    messages: messagesCount || 0,
    conversations: conversationsCount || 0,
    notifications: notificationsCount || 0,
    matches: matchesCount || 0,
    auditLogs: auditLogsCount || 0,
    admins: adminsCount || 0,
  };
}

export default async function AdminDatabasePage() {
  const stats = await getDatabaseStats();

  const tables: Array<{ name: string; label: string; count: number; icon: Icon }> = [
    { name: 'users', label: 'Utilisateurs', count: stats.users, icon: User },
    { name: 'properties', label: 'Propriétés', count: stats.properties, icon: Home },
    { name: 'applications', label: 'Candidatures', count: stats.applications, icon: FileText },
    { name: 'messages', label: 'Messages', count: stats.messages, icon: MessageCircle },
    { name: 'conversations', label: 'Conversations', count: stats.conversations, icon: MessageSquare },
    { name: 'notifications', label: 'Notifications', count: stats.notifications, icon: Bell },
    { name: 'matches', label: 'Matchs', count: stats.matches, icon: Heart },
    { name: 'audit_logs', label: 'Logs d\'audit', count: stats.auditLogs, icon: Clipboard },
    { name: 'admins', label: 'Administrateurs', count: stats.admins, icon: Shield },
  ];

  const totalRecords = Object.values(stats).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total enregistrements</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {totalRecords.toLocaleString()}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Database className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Tables actives</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {tables.length}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Grid className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Statut</p>
                <div className="flex items-center gap-2 mt-1">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-lg font-bold text-green-400">Opérationnel</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Grid */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Tables de la base de données</CardTitle>
          <CardDescription className="text-slate-400">
            Vue d'ensemble des tables principales et leur nombre d'enregistrements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table) => (
              <div
                key={table.name}
                className="flex items-center justify-between p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <table.icon className="w-6 h-6 text-slate-300" />
                  <div>
                    <p className="text-sm font-medium text-white">{table.label}</p>
                    <p className="text-xs text-slate-500 font-mono">{table.name}</p>
                  </div>
                </div>
                <Badge className="bg-slate-600/50 text-slate-300">
                  {table.count.toLocaleString()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Database Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-purple-400" />
              Informations Supabase
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <span className="text-sm text-slate-400">Provider</span>
              <span className="text-sm text-white font-medium">Supabase (PostgreSQL)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <span className="text-sm text-slate-400">RLS</span>
              <Badge className="bg-green-500/20 text-green-400">Activé</Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-700/50">
              <span className="text-sm text-slate-400">Realtime</span>
              <Badge className="bg-green-500/20 text-green-400">Activé</Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-400">Storage</span>
              <Badge className="bg-green-500/20 text-green-400">Configuré</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-700/30">
              <RefreshCw className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Backups automatiques</p>
                <p className="text-xs text-slate-400 mt-1">
                  Supabase effectue des backups automatiques quotidiens de votre base de données.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-700/30">
              <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Attention</p>
                <p className="text-xs text-slate-400 mt-1">
                  Pour des opérations avancées sur la base de données, utilisez le dashboard Supabase.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
