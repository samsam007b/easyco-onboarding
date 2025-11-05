'use client';

import { motion } from 'framer-motion';
import { Building2, Shield, TrendingUp, Clock, Headphones, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OwnersPage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: 'Revenus optimisés',
      description: 'Augmente tes revenus locatifs jusqu\'à 30% grâce au coliving. Notre modèle économique intelligent te permet de maximiser la rentabilité de ton bien tout en offrant des loyers abordables aux résidents.',
      size: 'large' as const
    },
    {
      icon: Shield,
      title: 'Locataires vérifiés',
      description: 'Tous nos résidents sont vérifiés',
      size: 'small' as const
    },
    {
      icon: Clock,
      title: 'Gestion simplifiée',
      description: 'Dashboard complet et intuitif',
      size: 'small' as const
    },
    {
      icon: Headphones,
      title: 'Support dédié 7j/7',
      description: 'Une équipe à ton écoute pour t\'accompagner à chaque étape',
      size: 'medium' as const
    },
  ];

  const steps = [
    { number: '01', title: 'Liste ton bien' },
    { number: '02', title: 'On trouve tes locataires' },
    { number: '03', title: 'Gère en toute sérénité' },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Compact Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-16 pb-8 px-6"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Loue ton bien en toute sérénité
            </h1>
          </motion.div>

          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Gestion simplifiée, locataires vérifiés et revenus optimisés
          </p>

          <Link href="/signup">
            <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all">
              Lister mon bien
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Bento Grid Benefits - Asymétrique */}
      <div className="pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large Card - Spans 2 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2 md:row-span-2"
            >
              <div className="h-full bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Revenus optimisés
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Augmente tes revenus locatifs jusqu'à 30% grâce au coliving. Notre modèle économique intelligent te permet de maximiser la rentabilité de ton bien tout en offrant des loyers abordables aux résidents.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Small Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Locataires vérifiés
                </h3>
                <p className="text-sm text-gray-600">
                  Tous nos résidents sont vérifiés
                </p>
              </div>
            </motion.div>

            {/* Small Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Gestion simplifiée
                </h3>
                <p className="text-sm text-gray-600">
                  Dashboard complet et intuitif
                </p>
              </div>
            </motion.div>

            {/* Medium Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="md:col-span-3"
            >
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Headphones className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Support dédié 7j/7
                    </h3>
                    <p className="text-purple-50">
                      Une équipe à ton écoute pour t'accompagner à chaque étape
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Steps - Macaron Style */}
      <div className="pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8"
          >
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block w-6 h-6 text-gray-400" />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Final Full-Width */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="pb-16 px-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-12 shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

            <div className="relative text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Prêt à maximiser tes revenus locatifs ?
              </h3>
              <p className="text-purple-50 mb-8 max-w-2xl mx-auto">
                Rejoins des centaines de propriétaires qui font confiance à EasyCo
              </p>
              <Link href="/signup">
                <Button className="bg-white text-purple-700 hover:bg-gray-50 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  Commencer maintenant
                  <Sparkles className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
