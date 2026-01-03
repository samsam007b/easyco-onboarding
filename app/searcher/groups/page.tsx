'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/auth/supabase-client';
import { useLanguage } from '@/lib/i18n/use-language';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Users,
  UserPlus,
  ArrowLeft,
  Plus,
  Settings,
  MessageCircle,
  Crown,
  Sparkles,
  ChevronRight,
  MapPin,
  Euro,
  Calendar,
} from 'lucide-react';

// V3-FUN Palette
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #F59E0B 0%, #FFB10B 50%, #FCD34D 100%)';
const GROUP_GRADIENT = 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 50%, #C4B5FD 100%)';

interface SearchGroup {
  id: string;
  name: string;
  description?: string;
  budget_min?: number;
  budget_max?: number;
  target_city?: string;
  target_move_date?: string;
  member_count: number;
  is_owner: boolean;
  created_at: string;
  members: {
    id: string;
    full_name: string;
    avatar_url?: string;
    is_admin: boolean;
  }[];
}

export default function SearcherGroupsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<SearchGroup[]>([]);

  useEffect(() => {
    const loadGroups = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      // Mock groups data
      const mockGroups: SearchGroup[] = [
        {
          id: '1',
          name: 'Coloc Bruxelles Centre',
          description: 'On cherche un appart sympa à 3 pour septembre',
          budget_min: 300,
          budget_max: 500,
          target_city: 'Bruxelles',
          target_move_date: '2024-09-01',
          member_count: 3,
          is_owner: true,
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          members: [
            { id: '1', full_name: 'Vous', avatar_url: undefined, is_admin: true },
            { id: '2', full_name: 'Marie D.', avatar_url: 'https://randomuser.me/api/portraits/women/32.jpg', is_admin: false },
            { id: '3', full_name: 'Thomas L.', avatar_url: 'https://randomuser.me/api/portraits/men/45.jpg', is_admin: false }
          ]
        },
        {
          id: '2',
          name: 'Recherche Ixelles',
          description: 'Duo à la recherche d\'un 2 chambres à Ixelles',
          budget_max: 1200,
          target_city: 'Ixelles',
          member_count: 2,
          is_owner: false,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          members: [
            { id: '4', full_name: 'Sophie M.', avatar_url: 'https://randomuser.me/api/portraits/women/68.jpg', is_admin: true },
            { id: '1', full_name: 'Vous', avatar_url: undefined, is_admin: false }
          ]
        }
      ];

      setGroups(mockGroups);
      setLoading(false);
    };
    loadGroups();
  }, [supabase, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingHouse size={80} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-amber-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/searcher">
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ background: GROUP_GRADIENT }}
                  >
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  Mes Groupes
                </h1>
                <p className="text-gray-600 mt-1">
                  {groups.length} groupe{groups.length !== 1 ? 's' : ''} de recherche
                </p>
              </div>
            </div>

            <Button
              className="rounded-xl text-white shadow-lg"
              style={{ background: GROUP_GRADIENT }}
              onClick={() => router.push('/searcher/groups/create')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer un groupe
            </Button>
          </div>
        </motion.div>

        {/* Content */}
        {groups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-3xl border-2 border-violet-100 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-20" style={{ background: GROUP_GRADIENT }} />
            <div className="relative flex flex-col items-center justify-center py-20 px-8">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                style={{ background: GROUP_GRADIENT }}
              >
                <UserPlus className="w-12 h-12 text-white" />
              </motion.div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Cherchez en groupe !
              </h3>
              <p className="text-lg text-gray-600 text-center max-w-md mb-8">
                Créez un groupe avec vos futurs colocataires pour rechercher ensemble
              </p>
              <Button
                onClick={() => router.push('/searcher/groups/create')}
                className="text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
                style={{ background: GROUP_GRADIENT }}
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Créer mon premier groupe
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="space-y-4"
          >
            {groups.map((group) => (
              <motion.div
                key={group.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Card
                  className="overflow-hidden rounded-2xl border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => router.push(`/searcher/groups/${group.id}`)}
                >
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      {/* Left: Group Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                            style={{ background: GROUP_GRADIENT }}
                          >
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg text-gray-900">{group.name}</h3>
                              {group.is_owner && (
                                <Badge className="bg-amber-100 text-amber-700 border-0">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Admin
                                </Badge>
                              )}
                            </div>
                            {group.description && (
                              <p className="text-gray-600 text-sm">{group.description}</p>
                            )}
                          </div>
                        </div>

                        {/* Criteria */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {group.target_city && (
                            <Badge variant="secondary" className="rounded-lg">
                              <MapPin className="w-3 h-3 mr-1" />
                              {group.target_city}
                            </Badge>
                          )}
                          {(group.budget_min || group.budget_max) && (
                            <Badge variant="secondary" className="rounded-lg">
                              <Euro className="w-3 h-3 mr-1" />
                              {group.budget_min && `${group.budget_min}€`}
                              {group.budget_min && group.budget_max && ' - '}
                              {group.budget_max && `${group.budget_max}€`}
                              /pers
                            </Badge>
                          )}
                          {group.target_move_date && (
                            <Badge variant="secondary" className="rounded-lg">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(group.target_move_date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                            </Badge>
                          )}
                        </div>

                        {/* Members */}
                        <div className="flex items-center gap-3 mt-4">
                          <div className="flex -space-x-2">
                            {group.members.slice(0, 4).map((member, i) => (
                              <div
                                key={member.id}
                                className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden"
                                style={{ zIndex: 4 - i }}
                              >
                                {member.avatar_url ? (
                                  <Image
                                    src={member.avatar_url}
                                    alt={member.full_name}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs font-medium text-gray-600">
                                    {member.full_name.charAt(0)}
                                  </span>
                                )}
                              </div>
                            ))}
                            {group.member_count > 4 && (
                              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                                +{group.member_count - 4}
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">
                            {group.member_count} membre{group.member_count > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/messages?group=${group.id}`);
                          }}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Chat
                        </Button>
                        {group.is_owner && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-xl"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/searcher/groups/${group.id}/settings`);
                            }}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
