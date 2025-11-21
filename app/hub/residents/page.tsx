'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import ResidentDiscovery from '@/components/residents/ResidentDiscovery';
import {
  Users,
  Heart,
  Coffee,
  Music,
  Sparkles,
  Star,
  TrendingUp,
  Calendar,
  MapPin,
  Mail,
  PartyPopper,
  Home,
  Utensils,
  Volume2,
  BedDouble,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Resident {
  id: string;
  full_name: string;
  avatar_url?: string;
  onboarding_data?: {
    personality?: {
      lifestyle?: string;
      cleanliness?: number;
      noise_tolerance?: number;
      social_level?: number;
      sleep_schedule?: string;
    };
    interests?: string[];
    bio?: string;
  };
  age?: number;
  occupation?: string;
  move_in_date?: string;
}

interface ResidenceVibe {
  overall_vibe: string;
  cleanliness_avg: number;
  social_level_avg: number;
  noise_level_avg: number;
  dominant_interests: string[];
  atmosphere: string[];
}

export default function ResidentsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [currentPropertyId, setCurrentPropertyId] = useState<string | null>(null);
  const [residenceVibe, setResidenceVibe] = useState<ResidenceVibe | null>(null);

  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get user's property directly from property_members
      const { data: memberData, error: memberError } = await supabase
        .from('property_members')
        .select('property_id')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .limit(1)
        .single();

      if (memberError || !memberData) {
        console.log('No property found for user');
        setIsLoading(false);
        return;
      }

      const propertyId = memberData.property_id;
      setCurrentPropertyId(propertyId);

      // Get all residents of the property
      const { data: membersData } = await supabase
        .from('property_members')
        .select('user_id')
        .eq('property_id', propertyId)
        .eq('status', 'active');

      if (!membersData) {
        setIsLoading(false);
        return;
      }

      const userIds = membersData.map(m => m.user_id);

      // Get profiles with onboarding data
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, onboarding_completed, age, occupation')
        .in('id', userIds);

      const { data: usersData } = await supabase
        .from('users')
        .select('id, onboarding_data')
        .in('id', userIds);

      // Merge data
      const residentsData: Resident[] = profilesData?.map(profile => {
        const userData = usersData?.find(u => u.id === profile.id);
        return {
          id: profile.id,
          full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Résident',
          avatar_url: profile.avatar_url,
          onboarding_data: userData?.onboarding_data || {},
          age: profile.age,
          occupation: profile.occupation
        };
      }) || [];

      setResidents(residentsData);
      calculateResidenceVibe(residentsData);
    } catch (error) {
      console.error('Error loading residents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateResidenceVibe = (residents: Resident[]) => {
    if (residents.length === 0) return;

    let totalCleanliness = 0;
    let totalSocial = 0;
    let totalNoise = 0;
    let allInterests: string[] = [];
    let count = 0;

    residents.forEach(resident => {
      const personality = resident.onboarding_data?.personality;
      if (personality) {
        if (personality.cleanliness) {
          totalCleanliness += personality.cleanliness;
          count++;
        }
        if (personality.social_level) {
          totalSocial += personality.social_level;
        }
        if (personality.noise_tolerance) {
          totalNoise += personality.noise_tolerance;
        }
      }
      if (resident.onboarding_data?.interests) {
        allInterests = [...allInterests, ...resident.onboarding_data.interests];
      }
    });

    const cleanlinessAvg = count > 0 ? totalCleanliness / count : 5;
    const socialAvg = count > 0 ? totalSocial / count : 5;
    const noiseAvg = count > 0 ? totalNoise / count : 5;

    // Determine overall vibe
    let vibe = 'Équilibrée';
    let atmosphere: string[] = [];

    if (socialAvg >= 7) {
      vibe = 'Festive et sociale';
      atmosphere.push('Festive', 'Conviviale', 'Animée');
    } else if (socialAvg <= 3) {
      vibe = 'Calme et tranquille';
      atmosphere.push('Calme', 'Studieuse', 'Paisible');
    } else {
      atmosphere.push('Équilibrée', 'Harmonieuse', 'Respectueuse');
    }

    if (cleanlinessAvg >= 7) {
      atmosphere.push('Rangée', 'Organisée');
    } else if (cleanlinessAvg <= 4) {
      atmosphere.push('Décontractée', 'Relaxed');
    }

    // Count interests
    const interestCounts: { [key: string]: number } = {};
    allInterests.forEach(interest => {
      interestCounts[interest] = (interestCounts[interest] || 0) + 1;
    });

    const dominantInterests = Object.entries(interestCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([interest]) => interest);

    setResidenceVibe({
      overall_vibe: vibe,
      cleanliness_avg: cleanlinessAvg,
      social_level_avg: socialAvg,
      noise_level_avg: noiseAvg,
      dominant_interests: dominantInterests,
      atmosphere
    });
  };

  const getPersonalityIcon = (key: string) => {
    const icons: { [key: string]: any } = {
      lifestyle: Coffee,
      cleanliness: Sparkles,
      noise_tolerance: Volume2,
      social_level: Users,
      sleep_schedule: Moon
    };
    return icons[key] || Star;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600 font-medium mt-4">Chargement des résidents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-resident-50 via-white to-resident-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg bg-gradient-to-br from-[#D97B6F] to-[#E8865D] grain-subtle">
              <Users className="w-8 h-8 text-white relative z-10" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Résidents</h1>
              <p className="text-resident-600">Découvrez votre communauté</p>
            </div>
          </div>
        </motion.div>

        {/* Residence Vibe Section */}
        {residenceVibe && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 bg-gradient-to-br from-resident-50 to-resident-100 rounded-3xl p-8 border border-resident-200 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shadow-md bg-gradient-to-br from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] grain-medium">
                <Home className="w-6 h-6 text-white relative z-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Ambiance de la résidence</h2>
                <p className="text-resident-600">Atmosphère générale de votre colocation</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Cleanliness */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Sparkles className="w-5 h-5 text-resident-600" />
                  <span className="font-semibold text-gray-900">Propreté</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D97B6F] to-[#E8865D] rounded-full"
                      style={{ width: `${(residenceVibe.cleanliness_avg / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {residenceVibe.cleanliness_avg.toFixed(1)}/10
                  </span>
                </div>
              </div>

              {/* Social Level */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <PartyPopper className="w-5 h-5 text-resident-600" />
                  <span className="font-semibold text-gray-900">Niveau social</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#E8865D] to-[#FF8C4B] rounded-full"
                      style={{ width: `${(residenceVibe.social_level_avg / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {residenceVibe.social_level_avg.toFixed(1)}/10
                  </span>
                </div>
              </div>

              {/* Noise Level */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Volume2 className="w-5 h-5 text-resident-600" />
                  <span className="font-semibold text-gray-900">Tolérance au bruit</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#D97B6F] via-[#E8865D] to-[#FF8C4B] rounded-full"
                      style={{ width: `${(residenceVibe.noise_level_avg / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {residenceVibe.noise_level_avg.toFixed(1)}/10
                  </span>
                </div>
              </div>
            </div>

            {/* Atmosphere Tags */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">Caractéristiques :</p>
              <div className="flex flex-wrap gap-2">
                {residenceVibe.atmosphere.map((trait, idx) => (
                  <Badge
                    key={idx}
                    className="bg-white/80 text-resident-800 border border-resident-200"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Dominant Interests */}
            {residenceVibe.dominant_interests.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Centres d'intérêt communs :</p>
                <div className="flex flex-wrap gap-2">
                  {residenceVibe.dominant_interests.map((interest, idx) => (
                    <Badge
                      key={idx}
                      className="bg-gradient-to-r from-resident-100 to-resident-200 text-resident-800 border border-resident-300"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Current Residents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Vos colocataires ({residents.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {residents.map((resident, idx) => (
              <motion.div
                key={resident.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-resident-200 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Avatar & Name */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-resident-200 to-resident-300 flex items-center justify-center overflow-hidden">
                    {resident.avatar_url ? (
                      <img
                        src={resident.avatar_url}
                        alt={resident.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-resident-700">
                        {resident.full_name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{resident.full_name}</h3>
                    {resident.occupation && (
                      <p className="text-sm text-gray-600">{resident.occupation}</p>
                    )}
                    {resident.age && (
                      <p className="text-xs text-gray-500">{resident.age} ans</p>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {resident.onboarding_data?.bio && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                    {resident.onboarding_data.bio}
                  </p>
                )}

                {/* Personality Traits */}
                {resident.onboarding_data?.personality && (
                  <div className="space-y-2 mb-4">
                    {Object.entries(resident.onboarding_data.personality).slice(0, 3).map(([key, value]) => {
                      const Icon = getPersonalityIcon(key);
                      return (
                        <div key={key} className="flex items-center gap-2 text-xs">
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600 capitalize">
                            {key.replace('_', ' ')}:
                          </span>
                          <span className="font-semibold text-gray-900">
                            {typeof value === 'number' ? `${value}/10` : value}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Interests */}
                {resident.onboarding_data?.interests && resident.onboarding_data.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {resident.onboarding_data.interests.slice(0, 4).map((interest, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-xs bg-resident-50 text-resident-800 border-resident-200"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Resident Discovery Section */}
        {currentPropertyId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ResidentDiscovery propertyId={currentPropertyId} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
