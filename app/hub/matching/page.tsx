'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Users,
  Heart,
  ArrowLeft,
  Bell,
  Check,
  Zap,
  MessageCircle,
  Shield,
  Calendar,
  UserPlus,
  Home,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// V3 Option C - Official Resident Palette
const RESIDENT_GRADIENT = 'linear-gradient(135deg, #e05747 0%, #ff651e 50%, #ff9014 100%)';
const RESIDENT_PRIMARY = '#ff651e';
const CARD_BG_GRADIENT = 'linear-gradient(135deg, #FFF5F0 0%, #FFEDE5 100%)';
const ACCENT_SHADOW = 'rgba(255, 101, 30, 0.2)';

export default function MatchingComingSoonPage() {
  const router = useRouter();

  const features = [
    {
      icon: Zap,
      title: 'Matching intelligent',
      description: 'Notre algorithme analyse 50+ critères pour te proposer les candidats les plus compatibles avec ta coloc',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    },
    {
      icon: Users,
      title: 'Swipe & Match',
      description: 'Parcours les profils des chercheurs et like ceux qui te plaisent. Si c\'est réciproque, c\'est un match !',
      gradient: 'linear-gradient(135deg, #e05747 0%, #ff651e 100%)',
    },
    {
      icon: MessageCircle,
      title: 'Chat intégré',
      description: 'Discute directement avec tes matchs avant de les inviter à visiter ta coloc',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    },
    {
      icon: Shield,
      title: 'Profils vérifiés',
      description: 'Tous les candidats sont vérifiés (identité, revenus) pour ta tranquillité',
      gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    },
    {
      icon: Calendar,
      title: 'Planification de visites',
      description: 'Organise facilement des visites avec les candidats qui t\'intéressent',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
    },
    {
      icon: Home,
      title: 'Vote collectif',
      description: 'Tous les colocataires peuvent voter pour choisir le nouveau membre ensemble',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push('/hub')}
              className="text-gray-600 hover:text-gray-900 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au Hub
            </Button>
            <Badge
              className="px-4 py-1.5 rounded-full font-semibold border-0 text-white"
              style={{ background: RESIDENT_GRADIENT }}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Bientot disponible
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Animated Icon */}
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 superellipse-3xl flex items-center justify-center mx-auto mb-8"
            style={{
              background: RESIDENT_GRADIENT,
              boxShadow: `0 20px 60px ${ACCENT_SHADOW}`,
            }}
          >
            <Heart className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Le matching{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: RESIDENT_GRADIENT }}
            >
              arrive bientot
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Une nouvelle facon de trouver le colocataire ideal pour ta residence.
            Nous preparons quelque chose d'exceptionnel pour toi !
          </p>

          {/* Coming Soon Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative max-w-lg mx-auto superellipse-3xl p-8 overflow-hidden"
            style={{
              background: CARD_BG_GRADIENT,
              boxShadow: `0 20px 60px ${ACCENT_SHADOW}`,
            }}
          >
            {/* Decorative circles */}
            <div
              className="absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-30"
              style={{ background: RESIDENT_GRADIENT }}
            />
            <div
              className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full opacity-20"
              style={{ background: 'linear-gradient(135deg, #ff9014 0%, #ff651e 100%)' }}
            />

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <UserPlus className="w-6 h-6" style={{ color: RESIDENT_PRIMARY }} />
                <span className="text-lg font-bold text-gray-900">
                  Chercheurs en cours d'inscription
                </span>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Nous sommes en train de constituer une base de candidats verifies et motives
                pour rejoindre des colocations comme la tienne. Des que les premiers profils
                seront disponibles, tu pourras commencer a matcher !
              </p>

              {/* What's coming */}
              <div className="space-y-3 text-left">
                {[
                  'Profils de chercheurs verifies',
                  'Algorithme de compatibilite avance',
                  'Systeme de match reciproque',
                  'Chat integre apres match',
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-6 h-6 superellipse-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${RESIDENT_PRIMARY}20` }}
                    >
                      <Check className="w-3.5 h-3.5" style={{ color: RESIDENT_PRIMARY }} />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Ce qui t'attend avec le{' '}
            <span style={{ color: RESIDENT_PRIMARY }}>matching Izzico</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className="relative overflow-hidden superellipse-2xl bg-white p-6 cursor-default"
                  style={{
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  {/* Decorative circle */}
                  <div
                    className="absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-20"
                    style={{ background: feature.gradient }}
                  />

                  <div className="relative z-10">
                    <div
                      className="w-12 h-12 superellipse-xl flex items-center justify-center mb-4"
                      style={{ background: feature.gradient }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Notification CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-flex flex-col items-center gap-4 p-8 superellipse-3xl bg-white"
            style={{
              boxShadow: `0 20px 60px ${ACCENT_SHADOW}`,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 superellipse-2xl flex items-center justify-center"
              style={{ background: CARD_BG_GRADIENT }}
            >
              <Bell className="w-8 h-8" style={{ color: RESIDENT_PRIMARY }} />
            </motion.div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Tu seras notifie(e) au lancement !
              </h3>
              <p className="text-gray-600 mb-4">
                Des que le matching sera disponible, tu recevras une notification.
              </p>
            </div>

            <Button
              onClick={() => router.push('/hub')}
              className="superellipse-2xl px-8 py-6 font-bold text-white border-none"
              style={{
                background: RESIDENT_GRADIENT,
                boxShadow: `0 12px 32px ${ACCENT_SHADOW}`,
              }}
            >
              <Home className="w-5 h-5 mr-2" />
              Retourner au Hub
            </Button>

            {/* Additional link */}
            <p className="text-sm text-gray-500">
              En attendant, prepare ton profil pour avoir les meilleurs matchs !
            </p>
          </motion.div>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center gap-2 mt-12"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 rounded-full"
              style={{ background: RESIDENT_PRIMARY }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
