'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Users, Heart, Shield, TrendingUp, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ResidentsPage() {
  const { scrollYProgress } = useScroll();
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // Animated counters
  useEffect(() => {
    if (!hasAnimated) {
      const timer1 = setInterval(() => {
        setCount1((prev) => {
          if (prev >= 120) {
            clearInterval(timer1);
            return 120;
          }
          return prev + 5;
        });
      }, 30);

      const timer2 = setInterval(() => {
        setCount2((prev) => {
          if (prev >= 450) {
            clearInterval(timer2);
            return 450;
          }
          return prev + 15;
        });
      }, 30);

      setHasAnimated(true);
    }
  }, [hasAnimated]);

  const features = [
    {
      icon: Heart,
      title: 'Matching personnalisé',
      description: 'Algorithme intelligent qui analyse ta personnalité et trouve des colocataires compatibles',
    },
    {
      icon: Shield,
      title: 'Profils vérifiés',
      description: 'Tous les résidents passent par une vérification complète',
    },
    {
      icon: TrendingUp,
      title: 'Économies réelles',
      description: "Jusqu'à 40% d'économies par rapport à un studio",
    },
  ];

  const timeline = [
    { step: '01', title: 'Crée ton profil', description: 'Dis-nous qui tu es et ce que tu recherches' },
    { step: '02', title: 'Découvre tes matchs', description: 'Notre algo trouve les colocataires parfaits pour toi' },
    { step: '03', title: 'Emménage sereinement', description: 'Signature en ligne et emménagement express' },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(251, 146, 60, 0.08) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.08) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />
      </div>

      {/* Split Hero Section */}
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 mb-6"
              >
                <Users className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-600">Pour les résidents</span>
              </motion.div>

              {/* Hero title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Vis l'expérience{' '}
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  coliving ultime
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Trouve des colocataires qui te ressemblent vraiment. Économise tout en vivant mieux grâce à notre
                matching intelligent.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-base">
                    Devenir résident
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right: Animated stats cards */}
            <motion.div
              style={{ y: y1 }}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <div className="space-y-4">
                {/* Stat card 1 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-orange-100"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        {count1}+
                      </div>
                      <div className="text-gray-600 mt-1">Colocations disponibles</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Stat card 2 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-4xl font-bold text-white">€{count2}</div>
                      <div className="text-orange-50 mt-1">Économies moyennes/mois</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features section with parallax */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16"
          >
            Pourquoi choisir{' '}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">EasyCo</span>
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  style={{ y: index === 1 ? y2 : y1 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative"
                >
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/0 group-hover:from-orange-500/5 group-hover:to-red-500/5 rounded-2xl transition-all duration-300" />

                  <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-100 group-hover:border-orange-200 transition-all duration-300">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline section */}
      <div className="py-20 px-6 bg-gradient-to-b from-transparent to-orange-50/30">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16"
          >
            Comment ça marche ?
          </motion.h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-red-500" />

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative pl-24 pb-12 last:pb-0"
              >
                {/* Step circle */}
                <div className="absolute left-0 w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>

                {/* Content */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-100 hover:border-orange-300 transition-all hover:shadow-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA with glassmorphism */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 md:p-16 shadow-2xl">
            {/* Animated blobs */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.2, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"
            />

            <div className="relative text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Prêt pour l'aventure coliving ?
                </h3>
                <p className="text-orange-50 text-lg mb-8 max-w-2xl mx-auto">
                  Rejoins des centaines de résidents qui ont trouvé leur coloc idéale
                </p>
                <Link href="/signup">
                  <Button className="bg-white text-orange-600 hover:bg-gray-50 font-semibold px-10 py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-base">
                    Commencer maintenant
                    <Check className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
