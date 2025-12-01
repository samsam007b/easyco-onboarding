import { createClient } from '@/lib/auth/supabase-server';
import { notFound } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Shield,
  Ban,
  Trash2,
  Eye,
  Home,
  MessageSquare,
  FileText,
  Heart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import UserActions from '@/components/admin/UserActions';

async function getUser(userId: string) {
  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from('users')
    .select(`
      id,
      email,
      full_name,
      user_type,
      onboarding_completed,
      created_at,
      user_profiles (
        id,
        profile_photo,
        phone,
        bio,
        occupation,
        birth_date,
        languages,
        interests,
        lifestyle
      )
    `)
    .eq('id', userId)
    .single();

  if (error || !user) {
    return null;
  }

  return user;
}

async function getUserStats(userId: string) {
  const supabase = await createClient();

  const [
    { count: propertiesCount },
    { count: applicationsCount },
    { count: messagesCount },
    { count: matchesCount },
  ] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }).eq('owner_id', userId),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('sender_id', userId),
    supabase.from('matches').select('*', { count: 'exact', head: true }).or(`user_id.eq.${userId},property_owner_id.eq.${userId}`),
  ]);

  return {
    properties: propertiesCount || 0,
    applications: applicationsCount || 0,
    messages: messagesCount || 0,
    matches: matchesCount || 0,
  };
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [user, stats] = await Promise.all([
    getUser(id),
    getUserStats(id),
  ]);

  if (!user) {
    notFound();
  }

  const profile = user.user_profiles?.[0];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getUserTypeColor = (type: string | null) => {
    switch (type) {
      case 'owner':
        return 'bg-purple-500/20 text-purple-400';
      case 'searcher':
        return 'bg-orange-500/20 text-orange-400';
      case 'resident':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getUserTypeLabel = (type: string | null) => {
    switch (type) {
      case 'owner':
        return 'Propriétaire';
      case 'searcher':
        return 'Chercheur';
      case 'resident':
        return 'Résident';
      default:
        return 'Non défini';
    }
  };

  const statCards = [
    { label: 'Propriétés', value: stats.properties, icon: Home, color: 'purple' },
    { label: 'Candidatures', value: stats.applications, icon: FileText, color: 'orange' },
    { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'blue' },
    { label: 'Matchs', value: stats.matches, icon: Heart, color: 'pink' },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
      pink: { bg: 'bg-pink-500/10', text: 'text-pink-400' },
    };
    return colors[color] || colors.purple;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard/users">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Détail utilisateur</h1>
            <p className="text-slate-400">Informations complètes sur l'utilisateur</p>
          </div>
        </div>
        <UserActions userId={user.id} userEmail={user.email} userName={user.full_name} />
      </div>

      {/* User Profile Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-purple-600 rounded-2xl flex items-center justify-center overflow-hidden">
                {profile?.profile_photo ? (
                  <img
                    src={profile.profile_photo}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {user.full_name?.[0]?.toUpperCase() || user.email[0]?.toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {user.full_name || 'Sans nom'}
                  </h2>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge className={getUserTypeColor(user.user_type)}>
                      {getUserTypeLabel(user.user_type)}
                    </Badge>
                    {user.onboarding_completed ? (
                      <Badge className="bg-green-500/20 text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Profil complet
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        <Clock className="w-3 h-3 mr-1" />
                        Onboarding en cours
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span>{user.email}</span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center gap-3 text-slate-300">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-slate-300">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span>Inscrit le {formatDate(user.created_at)}</span>
                </div>
                {profile?.occupation && (
                  <div className="flex items-center gap-3 text-slate-300">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    <span>{profile.occupation}</span>
                  </div>
                )}
              </div>

              {profile?.bio && (
                <div className="mt-6 p-4 rounded-lg bg-slate-700/30">
                  <p className="text-sm text-slate-300">{profile.bio}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const colors = getColorClasses(stat.color);
          return (
            <Card key={stat.label} className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {stat.value}
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

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Languages */}
        {profile?.languages && profile.languages.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Langues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang: string) => (
                  <Badge key={lang} className="bg-slate-600/50 text-slate-300">
                    {lang}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interests */}
        {profile?.interests && profile.interests.length > 0 && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Intérêts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest: string) => (
                  <Badge key={interest} className="bg-purple-500/20 text-purple-400">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lifestyle */}
        {profile?.lifestyle && (
          <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white text-lg">Style de vie</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(profile.lifestyle).map(([key, value]) => (
                  <div key={key} className="p-3 rounded-lg bg-slate-700/30">
                    <p className="text-xs text-slate-500 capitalize">{key.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-slate-300 mt-1">{String(value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* User ID */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">ID utilisateur</p>
              <p className="text-sm font-mono text-slate-300 mt-1">{user.id}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copier
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
