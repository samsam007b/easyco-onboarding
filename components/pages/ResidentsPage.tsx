'use client';

import { motion } from 'framer-motion';
import { Users, Heart, Sparkles, Shield, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ResidentsPage() {
  const benefits = [
    {
      icon: Heart,
      title: 'Communauté authentique',
      description: 'Rencontre des colocataires compatibles grâce à notre algorithme de matching'
    },
    {
      icon: Shield,
      title: 'Profils vérifiés',
      description: 'Tous les résidents sont vérifiés pour ta sécurité et ta tranquillité'
    },
    {
      icon: Calendar,
      title: 'Flexibilité totale',
      description: 'Loyers mensuels, pas d\'engagements long-termes ou de frais cachés'
    },
    {
      icon: TrendingUp,
      title: 'Économies garanties',
      description: 'Jusqu\'à 40% d\'économies comparé à un studio individuel'
    },
  ];

  const steps = [
    { number: 1, title: 'Crée ton profil', description: 'Remplis ton profil en 5 minutes' },
    { number: 2, title: 'Trouve ton match', description: 'Notre algorithme te propose des colocataires compatibles' },
    { number: 3, title: 'Visite et emménage', description: 'Rencontre tes futurs colocs et démarre l\'aventure' },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-24 pb-16 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#FFA040] to-[#FFB85C] mb-6 shadow-2xl"
          >
            <Users className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Vis l'expérience coliving ultime
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Trouve des colocataires compatibles, partage des moments uniques, et économise tout en vivant mieux.
          </p>

          <Link href="/onboarding/resident">
            <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold px-10 py-4 rounded-full text-lg shadow-2xl hover:shadow-orange-500/50 hover:scale-105 transition-all">
              <Sparkles className="w-6 h-6 mr-2" />
              Devenir résident
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <div className="pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Pourquoi rejoindre EasyCo ?
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Bien plus qu'une simple colocation, c'est une communauté qui te ressemble
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex gap-4 p-6 rounded-2xl hover:bg-orange-50 transition-all group"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFA040] to-[#FFB85C] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* How it works */}
      <div className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Comment ça marche ?
          </h2>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg flex items-center gap-6 hover:shadow-xl transition-all"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-[#FFA040] to-[#FFB85C] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <Link href="/onboarding/resident">
              <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold px-10 py-4 rounded-full text-lg shadow-2xl hover:scale-105 transition-all">
                Commencer l'aventure
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
