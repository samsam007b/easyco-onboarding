'use client';

import { motion } from 'framer-motion';
import { Building2, Shield, TrendingUp, Clock, FileCheck, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OwnersPage() {
  const benefits = [
    {
      icon: Shield,
      title: 'Locataires vérifiés',
      description: 'Tous nos résidents passent par une vérification d\'identité et de solvabilité'
    },
    {
      icon: TrendingUp,
      title: 'Revenus optimisés',
      description: 'Augmente tes revenus locatifs de 20-30% avec le coliving'
    },
    {
      icon: Clock,
      title: 'Gestion simplifiée',
      description: 'Dashboard complet pour gérer paiements, maintenance et communication'
    },
    {
      icon: Headphones,
      title: 'Support dédié',
      description: 'Une équipe à ton écoute 7j/7 pour t\'accompagner'
    },
  ];

  const features = [
    'Matching intelligent des colocataires',
    'Contrats de location automatisés',
    'Paiements sécurisés et automatiques',
    'Gestion des maintenances',
    'Assurance incluse',
    'Facturation simplifiée',
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
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 mb-6 shadow-2xl"
          >
            <Building2 className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Loue ton bien en toute sérénité
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Gestion simplifiée, locataires vérifiés, revenus optimisés. Tout ce qu'il te faut pour louer sans stress.
          </p>

          <Link href="/onboarding/owner">
            <Button className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold px-10 py-4 rounded-full text-lg shadow-2xl hover:shadow-purple-500/50 hover:scale-105 transition-all">
              <Building2 className="w-6 h-6 mr-2" />
              Lister mon bien
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
              Pourquoi choisir EasyCo ?
            </h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              La plateforme de coliving préférée des propriétaires
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
                    className="flex gap-4 p-6 rounded-2xl hover:bg-purple-50 transition-all group"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center group-hover:scale-110 transition-transform">
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

      {/* Features List */}
      <div className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Fonctionnalités incluses
          </h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-all"
                >
                  <FileCheck className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-2xl"
          >
            <h3 className="text-2xl font-bold mb-3">
              Prêt à maximiser tes revenus locatifs ?
            </h3>
            <p className="text-purple-100 mb-6">
              Rejoins des centaines de propriétaires qui font confiance à EasyCo
            </p>
            <Link href="/onboarding/owner">
              <Button className="bg-white text-purple-700 hover:bg-gray-100 font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-all">
                Commencer maintenant
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
