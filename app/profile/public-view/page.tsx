'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/auth/supabase-client'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  MapPin,
  Euro,
  Heart,
  Sparkles,
  ShieldCheck,
  Home,
  Users,
  Calendar,
  Briefcase,
  Award,
  Building,
  Wifi,
  Car,
  Dumbbell,
  Tv,
  Shirt,
  Coffee,
  PawPrint,
  Cigarette,
  Clock,
  Shield,
  Star,
  MessageCircle
} from 'lucide-react'
import { toast } from 'sonner'
import LoadingHouse from '@/components/ui/LoadingHouse'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/i18n/use-language'

// V3 Owner 5-color mauve palette
const ownerGradient = 'linear-gradient(135deg, #9c5698 0%, #a5568d 25%, #af5682 50%, #b85676 75%, #c2566b 100%)'
const ownerGradientLight = 'linear-gradient(135deg, #F8F0F7 0%, #FDF5F9 100%)'
const ownerPrimary = '#9c5698'
const ownerAccent = '#c2566b'

interface UserData {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  user_type: 'searcher' | 'owner' | 'resident'
  email_verified: boolean
}

interface UserProfile {
  // Common fields
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

  // Owner-specific fields
  experience_years?: string | null
  management_style?: string | null
  primary_motivation?: string | null
  owner_bio?: string | null
  amenities?: string[] | null
  included_services?: string[] | null
  pets_allowed?: boolean | null
  smoking_allowed?: boolean | null
  minimum_lease_duration?: string | null
  deposit_amount?: string | null
  notice_period?: string | null
  response_time?: string | null
}

// Icon mapping for amenities
const amenityIcons: Record<string, typeof Wifi> = {
  wifi: Wifi,
  parking: Car,
  gym: Dumbbell,
  tv: Tv,
  laundry: Shirt,
  kitchen: Coffee,
}

// Amenity labels in French
const amenityLabels: Record<string, string> = {
  wifi: 'WiFi',
  parking: 'Parking',
  gym: 'Salle de sport',
  tv: 'TV',
  laundry: 'Buanderie',
  kitchen: 'Cuisine équipée',
}

// Service labels in French
const serviceLabels: Record<string, { label: string; emoji: string }> = {
  utilities: { label: 'Charges incluses', emoji: '💡' },
  cleaning: { label: 'Ménage', emoji: '🧹' },
  maintenance: { label: 'Maintenance', emoji: '🔧' },
  insurance: { label: 'Assurance', emoji: '🛡️' },
}

// Experience years labels
const experienceLabels: Record<string, string> = {
  '0': 'Moins d\'1 an',
  '1-2': '1-2 ans',
  '3-5': '3-5 ans',
  '5-10': '5-10 ans',
  '10+': '10+ ans',
}

// Management style labels
const managementLabels: Record<string, { label: string; desc: string }> = {
  'self-managed': { label: 'Gestion directe', desc: 'Je gère moi-même' },
  'agency': { label: 'Via agence', desc: 'Géré par une agence' },
  'hybrid': { label: 'Mixte', desc: 'Gestion partagée' },
}

// Motivation labels
const motivationLabels: Record<string, { label: string; emoji: string }> = {
  income: { label: 'Revenu', emoji: '💰' },
  community: { label: 'Communauté', emoji: '🤝' },
  investment: { label: 'Investissement', emoji: '📈' },
  other: { label: 'Autre', emoji: '✨' },
}

// Lease duration labels
const leaseDurationLabels: Record<string, string> = {
  '1': '1 mois min.',
  '3': '3 mois min.',
  '6': '6 mois min.',
  '12': '12 mois min.',
}

// Deposit labels
const depositLabels: Record<string, string> = {
  'half-month': '½ mois',
  '1-month': '1 mois',
  '2-months': '2 mois',
  'negotiable': 'Négociable',
}

export default function PublicViewPage() {
  const router = useRouter()
  const { t, language } = useLanguage()
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
          toast.error(t('publicView.errors.loadFailed'))
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
        toast.error(t('publicView.errors.unexpected'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [supabase, router])

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: ownerGradientLight }}
      >
        <LoadingHouse />
      </div>
    )
  }

  if (!userData) {
    return null
  }

  // V3 Owner-specific colors (5-color mauve palette)
  const getRoleColors = () => {
    switch (userData.user_type) {
      case 'searcher':
        return {
          gradient: 'from-[#FFA040] to-[#FFD080]',
          gradientStyle: 'linear-gradient(135deg, #FFA040 0%, #FFD080 100%)',
          bg: 'bg-[#FFF9E6]',
          bgStyle: '#FFF9E6',
          text: 'text-[#F9A825]',
          textColor: '#F9A825',
          border: 'border-[#FFB10B]',
          lightBg: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
        }
      case 'owner':
        return {
          gradient: 'from-[#9c5698] to-[#c2566b]',
          gradientStyle: ownerGradient,
          bg: 'bg-[#F8F0F7]',
          bgStyle: '#F8F0F7',
          text: 'text-[#9c5698]',
          textColor: ownerPrimary,
          border: 'border-[#d4a5d1]',
          lightBg: ownerGradientLight,
        }
      case 'resident':
        return {
          gradient: 'from-[#e05747] to-[#e05747]',
          gradientStyle: 'linear-gradient(135deg, #e05747 0%, #e05747 50%, #e05747 100%)',
          bg: 'bg-[#FFF4EC]',
          bgStyle: '#FFF4EC',
          text: 'text-[#e05747]',
          textColor: '#e05747',
          border: 'border-[#ffb89a]',
          lightBg: 'linear-gradient(135deg, #FFF4EC 0%, #FEE7DC 100%)',
        }
      default:
        return {
          gradient: 'from-gray-500 to-gray-400',
          gradientStyle: 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)',
          bg: 'bg-gray-50',
          bgStyle: '#f9fafb',
          text: 'text-gray-600',
          textColor: '#6b7280',
          border: 'border-gray-300',
          lightBg: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        }
    }
  }

  const colors = getRoleColors()
  const isOwner = userData.user_type === 'owner'

  // Render Owner-specific content
  const renderOwnerContent = () => (
    <>
      {/* Experience & Style Section */}
      {(userProfile?.experience_years || userProfile?.management_style) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <div
              className="w-8 h-8 superellipse-lg flex items-center justify-center"
              style={{ background: 'rgba(156, 86, 152, 0.1)' }}
            >
              <Award className="w-5 h-5" style={{ color: ownerPrimary }} />
            </div>
            Expérience
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {userProfile?.experience_years && (
              <div
                className="superellipse-xl p-3"
                style={{ background: 'rgba(156, 86, 152, 0.08)' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4" style={{ color: ownerPrimary }} />
                  <span className="text-xs font-semibold text-gray-600">Années d'expérience</span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {experienceLabels[userProfile.experience_years] || userProfile.experience_years}
                </p>
              </div>
            )}
            {userProfile?.management_style && (
              <div
                className="superellipse-xl p-3"
                style={{ background: 'rgba(156, 86, 152, 0.08)' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Building className="w-4 h-4" style={{ color: ownerPrimary }} />
                  <span className="text-xs font-semibold text-gray-600">Style de gestion</span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {managementLabels[userProfile.management_style]?.label || userProfile.management_style}
                </p>
              </div>
            )}
            {userProfile?.primary_motivation && (
              <div
                className="superellipse-xl p-3 col-span-2"
                style={{ background: 'rgba(156, 86, 152, 0.08)' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="w-4 h-4" style={{ color: ownerAccent }} />
                  <span className="text-xs font-semibold text-gray-600">Motivation principale</span>
                </div>
                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <span>{motivationLabels[userProfile.primary_motivation]?.emoji}</span>
                  {motivationLabels[userProfile.primary_motivation]?.label || userProfile.primary_motivation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Amenities Section */}
      {userProfile?.amenities && userProfile.amenities.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <div
              className="w-8 h-8 superellipse-lg flex items-center justify-center"
              style={{ background: 'rgba(156, 86, 152, 0.1)' }}
            >
              <Sparkles className="w-5 h-5" style={{ color: ownerPrimary }} />
            </div>
            Équipements proposés
          </h2>
          <div className="flex flex-wrap gap-2">
            {userProfile.amenities.map((amenity, idx) => {
              const Icon = amenityIcons[amenity] || Sparkles
              return (
                <span
                  key={idx}
                  className="px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2"
                  style={{
                    background: 'rgba(156, 86, 152, 0.1)',
                    color: ownerPrimary
                  }}
                >
                  <Icon className="w-4 h-4" />
                  {amenityLabels[amenity] || amenity}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Included Services Section */}
      {userProfile?.included_services && userProfile.included_services.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <div
              className="w-8 h-8 superellipse-lg flex items-center justify-center"
              style={{ background: 'rgba(175, 86, 130, 0.1)' }}
            >
              <Shield className="w-5 h-5" style={{ color: '#af5682' }} />
            </div>
            Services inclus
          </h2>
          <div className="flex flex-wrap gap-2">
            {userProfile.included_services.map((service, idx) => (
              <span
                key={idx}
                className="px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2"
                style={{
                  background: 'rgba(175, 86, 130, 0.1)',
                  color: '#af5682'
                }}
              >
                <span>{serviceLabels[service]?.emoji || '✨'}</span>
                {serviceLabels[service]?.label || service}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Policies Section */}
      {(userProfile?.pets_allowed !== undefined ||
        userProfile?.smoking_allowed !== undefined ||
        userProfile?.minimum_lease_duration ||
        userProfile?.deposit_amount) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <div
              className="w-8 h-8 superellipse-lg flex items-center justify-center"
              style={{ background: 'rgba(184, 86, 118, 0.1)' }}
            >
              <Shield className="w-5 h-5" style={{ color: '#b85676' }} />
            </div>
            Conditions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {userProfile?.pets_allowed !== undefined && (
              <div
                className="superellipse-xl p-3"
                style={{ background: 'rgba(184, 86, 118, 0.08)' }}
              >
                <div className="flex items-center gap-2">
                  <PawPrint className="w-4 h-4" style={{ color: '#b85676' }} />
                  <span className="text-sm font-medium text-gray-900">
                    Animaux {userProfile.pets_allowed ? '✅ Acceptés' : '🚫 Non acceptés'}
                  </span>
                </div>
              </div>
            )}
            {userProfile?.smoking_allowed !== undefined && (
              <div
                className="superellipse-xl p-3"
                style={{ background: 'rgba(184, 86, 118, 0.08)' }}
              >
                <div className="flex items-center gap-2">
                  <Cigarette className="w-4 h-4" style={{ color: '#b85676' }} />
                  <span className="text-sm font-medium text-gray-900">
                    Fumeur {userProfile.smoking_allowed ? '✅ Autorisé' : '🚭 Non autorisé'}
                  </span>
                </div>
              </div>
            )}
            {userProfile?.minimum_lease_duration && (
              <div
                className="superellipse-xl p-3"
                style={{ background: 'rgba(184, 86, 118, 0.08)' }}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: '#b85676' }} />
                  <span className="text-sm font-medium text-gray-900">
                    {leaseDurationLabels[userProfile.minimum_lease_duration] || userProfile.minimum_lease_duration}
                  </span>
                </div>
              </div>
            )}
            {userProfile?.deposit_amount && (
              <div
                className="superellipse-xl p-3"
                style={{ background: 'rgba(184, 86, 118, 0.08)' }}
              >
                <div className="flex items-center gap-2">
                  <Euro className="w-4 h-4" style={{ color: '#b85676' }} />
                  <span className="text-sm font-medium text-gray-900">
                    Garantie: {depositLabels[userProfile.deposit_amount] || userProfile.deposit_amount}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Owner Bio */}
      {(userProfile?.owner_bio || userProfile?.about_me) && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <div
              className="w-8 h-8 superellipse-lg flex items-center justify-center"
              style={{ background: 'rgba(194, 86, 107, 0.1)' }}
            >
              <MessageCircle className="w-5 h-5" style={{ color: ownerAccent }} />
            </div>
            À propos
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {userProfile.owner_bio || userProfile.about_me}
          </p>
        </div>
      )}

      {/* Response Time Badge */}
      {userProfile?.response_time && (
        <div className="mb-6">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
            style={{
              background: 'rgba(156, 86, 152, 0.1)',
              color: ownerPrimary
            }}
          >
            <Clock className="w-4 h-4" />
            Temps de réponse: {userProfile.response_time}
          </div>
        </div>
      )}
    </>
  )

  // Render Searcher-specific content (original)
  const renderSearcherContent = () => (
    <>
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {((userProfile?.budget_min || userProfile?.min_budget) && (userProfile?.budget_max || userProfile?.max_budget)) && (
          <div className="bg-gray-50 superellipse-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Euro className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-semibold text-gray-600">{t('publicView.stats.budget')}</span>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {userProfile?.budget_min || userProfile?.min_budget}-{userProfile?.budget_max || userProfile?.max_budget}€
            </p>
          </div>
        )}
        {(userProfile?.move_in_date || userProfile?.preferred_move_in_date) && (
          <div className="bg-gray-50 superellipse-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-semibold text-gray-600">{t('publicView.stats.moveIn')}</span>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {new Date(userProfile?.move_in_date || userProfile?.preferred_move_in_date!).toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'nl' ? 'nl-NL' : language === 'de' ? 'de-DE' : 'en-US', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        )}
      </div>

      {/* About Me */}
      {userProfile?.about_me && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FFA040]" />
            {t('publicView.sections.about')}
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
            {t('publicView.sections.lookingFor')}
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
            🎨 {t('publicView.sections.hobbies')}
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
            {t('publicView.sections.values')}
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
    </>
  )

  return (
    <div
      className="min-h-screen"
      style={{ background: colors.lightBg }}
    >
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">{t('common.back')}</span>
          </button>
          <div
            className="px-3 py-1 text-sm font-semibold rounded-full"
            style={{
              background: colors.bgStyle,
              color: colors.textColor
            }}
          >
            {t('publicView.badge')}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white superellipse-3xl shadow-xl border-2 border-gray-100 overflow-hidden"
        >
          {/* Banner with V3 Owner gradient */}
          <div
            className="h-32"
            style={{ background: colors.gradientStyle }}
          />

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
                <div
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-bold"
                  style={{ background: colors.gradientStyle }}
                >
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
                {userData.full_name || t('publicView.namePlaceholder')}
              </h1>
              <div className="flex items-center gap-3 text-gray-600 flex-wrap">
                {/* Role Badge */}
                <span
                  className="px-3 py-1 text-sm font-semibold rounded-full capitalize"
                  style={{
                    background: colors.bgStyle,
                    color: colors.textColor
                  }}
                >
                  {userData.user_type === 'owner' ? 'Propriétaire' :
                   userData.user_type === 'searcher' ? 'Chercheur' :
                   userData.user_type === 'resident' ? 'Résident' : userData.user_type}
                </span>

                {/* Location */}
                {(userProfile?.current_city || (userProfile?.preferred_cities && userProfile.preferred_cities.length > 0)) && (
                  <span className="flex items-center gap-1.5 text-sm">
                    <MapPin className="w-4 h-4" />
                    {userProfile?.current_city || userProfile?.preferred_cities?.[0]}
                  </span>
                )}

                {/* Occupation (for non-owners) */}
                {!isOwner && (userProfile?.occupation || userProfile?.occupation_status) && (
                  <span className="flex items-center gap-1.5 text-sm">
                    <Briefcase className="w-4 h-4" />
                    {userProfile?.occupation || userProfile?.occupation_status}
                  </span>
                )}
              </div>
            </div>

            {/* Role-specific Content */}
            {isOwner ? renderOwnerContent() : renderSearcherContent()}

            {/* CTA */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <Button
                onClick={() => router.push('/profile')}
                className="w-full text-white hover:shadow-lg transition-all"
                style={{ background: colors.gradientStyle }}
              >
                {t('publicView.editProfile')}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Info Note with V3 Owner styling */}
        <div
          className="mt-6 superellipse-xl p-4 text-sm border"
          style={{
            background: isOwner ? 'rgba(156, 86, 152, 0.05)' : '#eff6ff',
            borderColor: isOwner ? 'rgba(156, 86, 152, 0.2)' : '#bfdbfe',
            color: isOwner ? ownerPrimary : '#1e40af'
          }}
        >
          <p className="flex items-start gap-2">
            <Users className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>
              <strong>{t('publicView.infoNote.title')}</strong> {t('publicView.infoNote.description')}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
