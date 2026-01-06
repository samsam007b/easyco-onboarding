'use client';

import { useState, useEffect, memo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  ArrowLeft,
  Users,
  MapPin,
  Euro,
  Calendar,
  MessageCircle,
  Settings,
  Home,
  Search,
  Bookmark,
  Crown,
  UserPlus,
  Share2,
  MoreVertical,
  Building2,
  Clock,
  Target,
  Sparkles
} from 'lucide-react';

// V3-FUN Searcher Theme
// V3 Color System - Using CSS Variables from globals.css

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } }
};

interface GroupMember {
  id: string;
  user_id: string;
  role: 'admin' | 'member';
  user_profile: {
    full_name: string;
    avatar_url?: string;
  };
}

interface Group {
  id: string;
  name: string;
  description?: string;
  target_city?: string;
  budget_min?: number;
  budget_max?: number;
  move_in_date?: string;
  property_types?: string[];
  created_at: string;
  members: GroupMember[];
}

// Mobile bottom nav
const MobileBottomNav = memo(function MobileBottomNav() {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-2 md:hidden z-50"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        <Link href="/searcher" className="flex flex-col items-center gap-1 px-4 py-2">
          <Home className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-500">Hub</span>
        </Link>
        <Link href="/searcher/explore" className="flex flex-col items-center gap-1 px-4 py-2">
          <Search className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-500">Explorer</span>
        </Link>
        <Link href="/searcher/groups" className="flex flex-col items-center gap-1 px-4 py-2">
          <div className="w-10 h-10 superellipse-2xl flex items-center justify-center shadow-lg" style={{ background: 'var(--gradient-searcher)' }}>
            <Users className="w-5 h-5 text-white" />
          </div>
        </Link>
        <Link href="/searcher/favorites" className="flex flex-col items-center gap-1 px-4 py-2">
          <Bookmark className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-500">Favoris</span>
        </Link>
        <Link href="/messages" className="flex flex-col items-center gap-1 px-4 py-2">
          <MessageCircle className="w-5 h-5 text-gray-400" />
          <span className="text-xs text-gray-500">Messages</span>
        </Link>
      </div>
    </motion.div>
  );
});

export default function GroupDetailPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState<Group | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadGroup = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setCurrentUserId(user.id);

      // For demo, use mock data
      // In production, fetch from Supabase
      const mockGroup: Group = {
        id: groupId,
        name: 'Les Colocs de Bruxelles',
        description: 'Groupe de recherche pour une colocation dans le centre de Bruxelles. On cherche un appartement lumineux avec 3-4 chambres.',
        target_city: 'Bruxelles',
        budget_min: 400,
        budget_max: 600,
        move_in_date: '2024-03-01',
        property_types: ['Appartement', 'Maison'],
        created_at: '2024-01-15',
        members: [
          {
            id: 'm1',
            user_id: user.id,
            role: 'admin',
            user_profile: { full_name: 'Vous', avatar_url: undefined }
          },
          {
            id: 'm2',
            user_id: 'u2',
            role: 'member',
            user_profile: { full_name: 'Marie Dubois', avatar_url: 'https://randomuser.me/api/portraits/women/32.jpg' }
          },
          {
            id: 'm3',
            user_id: 'u3',
            role: 'member',
            user_profile: { full_name: 'Thomas Laurent', avatar_url: 'https://randomuser.me/api/portraits/men/45.jpg' }
          }
        ]
      };

      setGroup(mockGroup);
      setIsAdmin(mockGroup.members.some(m => m.user_id === user.id && m.role === 'admin'));
      setLoading(false);
    };

    loadGroup();
  }, [groupId, supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-searcher-50">
        <LoadingHouse size={80} />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-searcher-50">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Groupe introuvable</h2>
          <p className="text-gray-600 mb-4">Ce groupe n'existe pas ou a ete supprime.</p>
          <Button onClick={() => router.push('/searcher/groups')} style={{ background: 'var(--gradient-searcher)' }} className="text-white superellipse-xl">
            Retour aux groupes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pb-24 md:pb-8">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 via-white to-searcher-50/60" />
        <div className="absolute top-20 -left-32 w-96 h-96 rounded-full opacity-30 blur-3xl" style={{ background: 'var(--gradient-searcher)' }} />
        <div className="absolute top-40 -right-32 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: 'var(--gradient-searcher)' }} />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/searcher/groups">
                <Button variant="ghost" size="icon" className="superellipse-xl hover:bg-violet-50">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {group.name}
                </h1>
                <p className="text-xs text-gray-500">{group.members.length} membres</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link href={`/searcher/groups/${groupId}/settings`}>
                  <Button variant="ghost" size="icon" className="superellipse-xl hover:bg-violet-50">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="icon" className="superellipse-xl hover:bg-violet-50">
                <Share2 className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 sm:px-6 py-6"
      >
        {/* Group Info Card */}
        <motion.div variants={itemVariants}>
          <Card className="superellipse-3xl border-0 shadow-lg overflow-hidden mb-6">
            <div className="h-32 relative" style={{ background: 'var(--gradient-searcher)' }}>
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute bottom-4 left-4 right-4">
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                  <Target className="w-3 h-3 mr-1" />
                  Recherche active
                </Badge>
              </div>
            </div>
            <CardContent className="p-6">
              {group.description && (
                <p className="text-gray-600 mb-6">{group.description}</p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {group.target_city && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 superellipse-xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                      <MapPin className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Ville</p>
                      <p className="font-semibold text-gray-900">{group.target_city}</p>
                    </div>
                  </div>
                )}
                {(group.budget_min || group.budget_max) && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 superellipse-xl flex items-center justify-center" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                      <Euro className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Budget/pers.</p>
                      <p className="font-semibold text-gray-900">{group.budget_min}-{group.budget_max}E</p>
                    </div>
                  </div>
                )}
                {group.move_in_date && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 superellipse-xl flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                      <Calendar className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Emmenagement</p>
                      <p className="font-semibold text-gray-900">{new Date(group.move_in_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                )}
                {group.property_types && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 superellipse-xl flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                      <Building2 className="w-5 h-5 text-searcher-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="font-semibold text-gray-900">{group.property_types.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Members Section */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Membres ({group.members.length})</h2>
            {isAdmin && (
              <Button size="sm" className="superellipse-xl text-white" style={{ background: 'var(--gradient-searcher)' }}>
                <UserPlus className="w-4 h-4 mr-2" />
                Inviter
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {group.members.map((member) => (
              <motion.div
                key={member.id}
                whileHover={{ scale: 1.01 }}
                className="bg-white/80 backdrop-blur-sm superellipse-2xl p-4 flex items-center gap-4"
                style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)' }}
              >
                <div className="relative">
                  <div className="w-12 h-12 superellipse-xl overflow-hidden bg-violet-100">
                    {member.user_profile.avatar_url ? (
                      <Image
                        src={member.user_profile.avatar_url}
                        alt={member.user_profile.full_name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-violet-500 font-bold">
                        {member.user_profile.full_name.charAt(0)}
                      </div>
                    )}
                  </div>
                  {member.role === 'admin' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-searcher-400 flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {member.user_id === currentUserId ? 'Vous' : member.user_profile.full_name}
                  </p>
                  <p className="text-sm text-gray-500">{member.role === 'admin' ? 'Admin' : 'Membre'}</p>
                </div>
                {member.user_id !== currentUserId && (
                  <Button variant="ghost" size="icon" className="superellipse-xl hover:bg-violet-50">
                    <MessageCircle className="w-5 h-5 text-gray-400" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div variants={itemVariants} className="mt-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <Button
              onClick={() => router.push('/searcher/explore')}
              className="superellipse-2xl h-auto py-4 text-white"
              style={{ background: 'var(--gradient-searcher)' }}
            >
              <Search className="w-5 h-5 mr-2" />
              Chercher des biens ensemble
            </Button>
            <Button
              onClick={() => {}}
              variant="outline"
              className="superellipse-2xl h-auto py-4 border-violet-200 text-violet-600 hover:bg-violet-50"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Discussion du groupe
            </Button>
          </div>
        </motion.div>
      </motion.div>

      <MobileBottomNav />
    </div>
  );
}
