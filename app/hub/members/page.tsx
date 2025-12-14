'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Heart,
  MessageCircle,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import MatchingPreviewSection from '@/components/hub/matching/MatchingPreviewSection';

interface Member {
  id: string;
  name: string;
  role: 'resident' | 'owner';
  avatar?: string;
  email: string;
  phone?: string;
  occupation?: string;
  moveInDate: string;
  interests: string[];
  bio?: string;
}

export default function HubMembersPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      name: 'Sarah Martin',
      role: 'resident',
      email: 'sarah.martin@email.com',
      phone: '+33 6 12 34 56 78',
      occupation: 'Designer UX/UI',
      moveInDate: '2024-06-15',
      interests: ['Yoga', 'Cuisine', 'Cinéma'],
      bio: 'Passionnée de design et de bien-être, j\'adore partager des moments conviviaux autour d\'un bon repas.'
    },
    {
      id: '2',
      name: 'Marc Dubois',
      role: 'resident',
      email: 'marc.dubois@email.com',
      phone: '+33 6 98 76 54 32',
      occupation: 'Développeur Full-Stack',
      moveInDate: '2024-05-01',
      interests: ['Gaming', 'Musique', 'Sport'],
      bio: 'Développeur le jour, gamer la nuit. Toujours partant pour une session de basket le weekend!'
    },
    {
      id: '3',
      name: 'Julie Leroy',
      role: 'resident',
      email: 'julie.leroy@email.com',
      occupation: 'Étudiante en Médecine',
      moveInDate: '2024-09-01',
      interests: ['Lecture', 'Course à pied', 'Voyages'],
      bio: 'Étudiante en médecine, je cherche un environnement calme pour étudier mais j\'adore les soirées jeux de société!'
    }
  ]);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Load real members from database
      const { data: propertyMember } = await supabase
        .from('property_members')
        .select(`
          property_id,
          properties (
            id,
            title,
            address,
            city
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (propertyMember && propertyMember.properties) {
        setCurrentProperty(propertyMember.properties);

        // Load other members
        const { data: membersData } = await supabase
          .from('property_members')
          .select(`
            user_id,
            role,
            created_at,
            users (
              full_name,
              email,
              avatar_url
            )
          `)
          .eq('property_id', propertyMember.property_id)
          .eq('status', 'active')
          .neq('user_id', user.id);

        if (membersData && membersData.length > 0) {
          // Map real data to members
          const realMembers: Member[] = membersData.map((m: any) => ({
            id: m.user_id,
            name: m.users?.full_name || 'Utilisateur',
            role: m.role as 'resident' | 'owner',
            email: m.users?.email || '',
            avatar: m.users?.avatar_url,
            moveInDate: m.created_at,
            interests: [],
            occupation: undefined,
            bio: undefined
          }));
          setMembers(realMembers);
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading members:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, rgba(217, 87, 79, 0.05) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 128, 23, 0.03) 100%)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4 rounded-full hover:bg-gradient-to-r hover:from-[#d9574f]/10 hover:to-[#ff8017]/10"
          >
            ← Retour au hub
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Membres de la Coloc
              </h1>
              <p style={{ color: '#ee5736' }}>
                {currentProperty?.title || 'Votre résidence'} • {members.length} colocataire{members.length > 1 ? 's' : ''}
              </p>
            </div>

            <Button
              className="rounded-full text-white font-medium hover:shadow-lg transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Inviter
            </Button>
          </div>
        </motion.div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              {/* Member Header */}
              <div className="p-6 text-white" style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
                <div className="flex items-center gap-4 mb-4">
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-16 h-16 rounded-full border-4 border-white/30 object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full border-4 border-white/30 bg-white/20 flex items-center justify-center text-2xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{member.name}</h3>
                    <Badge className="bg-white/20 text-white border-white/30 mt-1">
                      {member.role === 'owner' ? 'Propriétaire' : 'Résident'}
                    </Badge>
                  </div>
                </div>

                {member.bio && (
                  <p className="text-sm line-clamp-2" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                    {member.bio}
                  </p>
                )}
              </div>

              {/* Member Details */}
              <div className="p-6">
                {/* Contact Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4" style={{ color: '#ee5736' }} />
                    <span className="text-gray-700">{member.email}</span>
                  </div>

                  {member.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4" style={{ color: '#ee5736' }} />
                      <span className="text-gray-700">{member.phone}</span>
                    </div>
                  )}

                  {member.occupation && (
                    <div className="flex items-center gap-3 text-sm">
                      <Briefcase className="w-4 h-4" style={{ color: '#ee5736' }} />
                      <span className="text-gray-700">{member.occupation}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4" style={{ color: '#ee5736' }} />
                    <span className="text-gray-700">
                      Depuis {new Date(member.moveInDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Interests */}
                {member.interests && member.interests.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-500 mb-2">Centres d'intérêt</p>
                    <div className="flex flex-wrap gap-2">
                      {member.interests.map((interest, idx) => (
                        <Badge key={idx} className="border border-gray-300 bg-white text-gray-700 text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => router.push('/messages')}
                    className="flex-1 rounded-full text-white font-medium hover:shadow-lg transition-all"
                    size="sm"
                    style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {members.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-lg p-12 text-center"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(217, 87, 79, 0.12)' }}>
              <Users className="w-8 h-8" style={{ color: '#ee5736' }} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Aucun colocataire pour le moment
            </h3>
            <p className="text-gray-600 mb-6">
              Invitez des personnes à rejoindre votre colocation
            </p>
            <Button className="rounded-full text-white font-medium hover:shadow-lg transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #d9574f 0%, #ff5b21 50%, #ff8017 100%)' }}>
              <UserPlus className="w-4 h-4 mr-2" />
              Inviter des membres
            </Button>
          </motion.div>
        )}

        {/* Matching Preview Section - Anticiper les départs */}
        <div className="mt-16">
          <MatchingPreviewSection
            matchCount={23}
            candidateCount={147}
            hasInvitations={true}
            invitationCount={3}
          />
        </div>
      </div>
    </div>
  );
}
