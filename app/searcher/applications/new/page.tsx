'use client';

import { motion } from 'framer-motion';
import {
  Send,
  ArrowLeft,
  Sparkles,
  FileText,
  CheckCircle2,
  Clock,
  Bell,
  Search,
  Home,
  Building2,
  User,
  Shield,
  Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// V3-FUN Searcher Theme
const SEARCHER_GRADIENT = 'linear-gradient(135deg, #F59E0B 0%, #FFB10B 50%, #FCD34D 100%)';
const SEARCHER_PRIMARY = '#FFB10B';
const APPLICATION_GRADIENT = 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)';
const ACCENT_SHADOW = 'rgba(59, 130, 246, 0.25)';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } }
};

export default function NewApplicationComingSoon() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3000);
  };

  const features = [
    {
      icon: FileText,
      title: 'Dossier en 1 clic',
      description: 'Votre dossier complet genere automatiquement a partir de votre profil'
    },
    {
      icon: Shield,
      title: 'Documents verifies',
      description: 'Pieces justificatives securisees et verifiees une seule fois'
    },
    {
      icon: Clock,
      title: 'Suivi en temps reel',
      description: 'Suivez l\'etat de toutes vos candidatures en un coup d\'oeil'
    },
    {
      icon: Bell,
      title: 'Notifications instantanees',
      description: 'Soyez alerte immediatement des reponses des proprietaires'
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden pb-24 md:pb-8">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-amber-50/60" />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 -left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
          style={{ background: APPLICATION_GRADIENT }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute top-40 -right-20 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          style={{ background: SEARCHER_GRADIENT }}
        />
        <div className="absolute inset-0 backdrop-blur-3xl bg-white/40" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12"
      >
        {/* Back button */}
        <motion.div variants={itemVariants} className="mb-8">
          <Link href="/searcher/applications">
            <Button variant="ghost" className="gap-2 text-gray-600 hover:text-gray-900 hover:bg-blue-50 superellipse-xl">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Retour aux candidatures</span>
            </Button>
          </Link>
        </motion.div>

        <div className="text-center">
          {/* Icon */}
          <motion.div variants={itemVariants} className="relative inline-block mb-8">
            <motion.div
              animate={{ scale: [1, 1.05, 1], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              className="w-28 h-28 md:w-32 md:h-32 superellipse-3xl flex items-center justify-center"
              style={{ background: APPLICATION_GRADIENT, boxShadow: `0 20px 50px ${ACCENT_SHADOW}` }}
            >
              <Send className="w-14 h-14 md:w-16 md:h-16 text-white" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-2 -right-2 w-10 h-10 superellipse-xl flex items-center justify-center bg-white shadow-lg"
            >
              <Sparkles className="w-5 h-5 text-blue-500" />
            </motion.div>
          </motion.div>

          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-2">
            <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold text-white mb-4" style={{ background: APPLICATION_GRADIENT }}>
              Bientot disponible
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Candidature Express
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl text-gray-600 mb-10 max-w-xl mx-auto">
            Deposez votre candidature en{' '}
            <span className="font-bold bg-clip-text text-transparent" style={{ backgroundImage: APPLICATION_GRADIENT }}>
              quelques secondes
            </span>{' '}
            grace a votre dossier pre-rempli
          </motion.p>

          {/* Features */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-2 gap-4 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-white superellipse-2xl p-5 text-left flex items-start gap-4"
                  style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}
                >
                  <div className="w-12 h-12 superellipse-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                    <Icon className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Waitlist */}
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden superellipse-3xl p-8 text-white mb-8"
            style={{ background: APPLICATION_GRADIENT, boxShadow: `0 20px 60px ${ACCENT_SHADOW}` }}
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10" />
            <div className="relative z-10">
              <Bell className="w-10 h-10 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">Soyez notifie au lancement</h3>
              {!subscribed ? (
                <form onSubmit={handleWaitlist} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre@email.com"
                      required
                      className="flex-1 px-6 py-4 superellipse-xl text-gray-900 placeholder-gray-400 focus:outline-none"
                    />
                    <button type="submit" className="bg-white px-8 py-4 superellipse-xl font-bold text-blue-500">
                      M'inscrire
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-white/20 superellipse-2xl p-6 max-w-md mx-auto">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                  <p className="font-bold">Parfait ! Vous serez notifie.</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Alternative */}
          <motion.div variants={itemVariants} className="bg-white superellipse-2xl p-6" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
            <h4 className="font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Search className="w-5 h-5" />
              En attendant
            </h4>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => router.push('/searcher/explore')} className="superellipse-xl px-6 py-5 text-white" style={{ background: SEARCHER_GRADIENT }}>
                <Building2 className="w-4 h-4 mr-2" />
                Trouver un bien
              </Button>
              <Button onClick={() => router.push('/profile/enhance')} variant="outline" className="superellipse-xl px-6 py-5 border-gray-200">
                <User className="w-4 h-4 mr-2" />
                Completer mon profil
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
