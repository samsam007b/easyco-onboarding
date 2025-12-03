'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, Euro, Heart, Sparkles, ShieldCheck, Home, Users, Calendar, Briefcase } from 'lucide-react'
import { toast } from 'sonner'
import LoadingHouse from '@/components/ui/LoadingHouse'
import { motion } from 'framer-motion'

interface UserData {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  user_type: 'searcher' | 'owner' | 'resident'
  email_verified: boolean
}

interface UserProfile {
  first_name?: string | null
  last_name?: string | null
  date_of_birth?: string | null
  current_city?: string | null
  preferred_cities?: string[] | null
  budget_min?: number | null
  budget_max?: number | null
  min_budget?: number | null
  max_budget?: number | null
  hobbies?: string[] | null
  core_values?: string[] | null
  about_me?: string | null
  looking_for?: string | null
  occupation?: string | null
  occupation_status?: string | null
  move_in_date?: string | null
  preferred_move_in_date?: string | null
}

export default function PublicViewPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
          router.push('/login')
          return
        }

        // Fetch user data
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          toast.error('Failed to load profile')
          return
        }

        setUserData(data)

        // Fetch user profile data
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (profileData) {
          setUserProfile(profileData)
        }
      } catch (error) {
        toast.error('An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [supabase, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-orange-50 to-amber-50">
        <LoadingHouse />
      </div>
    )
  }

  if (!userData) {
    return null
  }

  const getRoleColors = () => {
    switch (userData.user_type) {
      case 'searcher':
        return {
          gradient: 'from-[#FFA040] to-[#FFD080]',
          bg: 'bg-[#FFF9E6]',
          text: 'text-[#F9A825]',
          border: 'border-[#FFC107]',
        }
      case 'owner':
        return {
          gradient: 'from-blue-500 to-blue-400',
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          border: 'border-blue-300',
        }
      case 'resident':
        return {
          gradient: 'from-green-500 to-green-400',
          bg: 'bg-green-50',
          text: 'text-green-600',
          border: 'border-green-300',
        }
      default:
        return {
          gradient: 'from-gray-500 to-gray-400',
          bg: 'bg-gray-50',
          text: 'text-gray-600',
          border: 'border-gray-300',
        }
    }
  }

  const colors = getRoleColors()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour</span>
          </button>
          <div className={`px-3 py-1 ${colors.bg} ${colors.text} text-sm font-semibold rounded-full`}>
            Vue publique
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border-2 border-gray-100 overflow-hidden"
        >
          {/* Banner */}
          <div className={`h-32 bg-gradient-to-r ${colors.gradient}`} />

          {/* Profile Content */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-16 mb-4">
              {userData.avatar_url ? (
                <img
                  src={userData.avatar_url}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className={`w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white text-4xl font-bold`}>
                  {userData.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              {userData.email_verified && (
                <div className="absolute bottom-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-4 border-white">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Name & Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {userData.full_name || 'Nom non renseigné'}
              </h1>
              <div className="flex items-center gap-3 text-gray-600 flex-wrap">
                {(userProfile?.current_city || (userProfile?.preferred_cities && userProfile.preferred_cities.length > 0)) && (
                  <span className="flex items-center gap-1.5 text-sm">
                    <MapPin className="w-4 h-4" />
                    {userProfile?.current_city || userProfile?.preferred_cities?.[0]}
                  </span>
                )}
                {userProfile?.occupation || userProfile?.occupation_status && (
                  <span className="flex items-center gap-1.5 text-sm">
                    <Briefcase className="w-4 h-4" />
                    {userProfile?.occupation || userProfile?.occupation_status}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            {userData.user_type === 'searcher' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {((userProfile?.budget_min || userProfile?.min_budget) && (userProfile?.budget_max || userProfile?.max_budget)) && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Euro className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-semibold text-gray-600">Budget</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {userProfile?.budget_min || userProfile?.min_budget}-{userProfile?.budget_max || userProfile?.max_budget}€
                    </p>
                  </div>
                )}
                {(userProfile?.move_in_date || userProfile?.preferred_move_in_date) && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-semibold text-gray-600">Emménagement</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(userProfile?.move_in_date || userProfile?.preferred_move_in_date!).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* About Me */}
            {userProfile?.about_me && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FFA040]" />
                  À propos
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {userProfile.about_me}
                </p>
              </div>
            )}

            {/* Looking For */}
            {userProfile?.looking_for && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Home className="w-5 h-5 text-[#FFA040]" />
                  Ce que je recherche
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {userProfile.looking_for}
                </p>
              </div>
            )}

            {/* Hobbies */}
            {userProfile?.hobbies && userProfile.hobbies.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  🎨 Loisirs
                </h2>
                <div className="flex flex-wrap gap-2">
                  {userProfile.hobbies.map((hobby, idx) => (
                    <span key={idx} className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Values */}
            {userProfile?.core_values && userProfile.core_values.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Valeurs
                </h2>
                <div className="flex flex-wrap gap-2">
                  {userProfile.core_values.map((value, idx) => (
                    <span key={idx} className="px-4 py-2 bg-pink-50 text-pink-700 text-sm font-medium rounded-full">
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <Button
                onClick={() => router.push('/profile')}
                className={`w-full bg-gradient-to-r ${colors.gradient} text-white hover:shadow-lg transition-all`}
              >
                Modifier mon profil
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Info Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <p className="flex items-start gap-2">
            <Users className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Vue publique :</strong> C'est ce que les autres utilisateurs voient sur votre profil.
              Complétez votre profil pour augmenter vos chances de trouver le coloc idéal !
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
