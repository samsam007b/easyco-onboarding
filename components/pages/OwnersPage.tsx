'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Building2, Shield, TrendingUp, Clock, Headphones, Check, ArrowRight, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Couleurs Owner extraites du logo gradient
const OWNER_COLORS = {
  primary: '#9c5698',
  gradient: {
    start: '#7B5FB8',
    middle: '#A67BB8',
    end: '#C98B9E',
  },
  light: '#F3F1FF',
  text: '#4A148C',
};

export default function OwnersPage() {
  const { scrollYProgress } = useScroll();
  const [percentage, setPercentage] = useState(0);
  const [properties, setProperties] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // Animated counters
  useEffect(() => {
    if (!hasAnimated) {
      const timer1 = setInterval(() => {
        setPercentage((prev) => {
          if (prev >= 30) {
            clearInterval(timer1);
            return 30;
          }
          return prev + 1;
        });
      }, 50);

      const timer2 = setInterval(() => {
        setProperties((prev) => {
          if (prev >= 250) {
            clearInterval(timer2);
            return 250;
          }
          return prev + 10;
        });
      }, 40);

      setHasAnimated(true);
    }
  }, [hasAnimated]);

  const features = [
    {
      icon: TrendingUp,
      title: 'Revenus optimisés',
      description: 'Augmente tes revenus locatifs jusqu\'à 30% avec notre modèle de coliving intelligent',
    },
    {
      icon: Shield,
      title: 'Locataires vérifiés',
      description: 'Vérification d\'identité et de solvabilité pour tous les résidents',
    },
    {
      icon: Headphones,
      title: 'Support dédié',
      description: 'Une équipe à ton écoute 7j/7 pour t\'accompagner',
    },
  ];

  const timeline = [
    { step: '01', title: 'Liste ton bien', description: 'Crée une annonce en quelques minutes' },
    { step: '02', title: 'On trouve tes locataires', description: 'Notre algorithme match les meilleurs profils' },
    { step: '03', title: 'Gère en toute sérénité', description: 'Dashboard complet pour tout gérer facilement' },
  ];

  return (
    <div className="min-h-screen relative bg-white">
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6"
                style={{
                  background: `linear-gradient(to right, ${OWNER_COLORS.gradient.start}15, ${OWNER_COLORS.gradient.end}15)`,
                  borderColor: `${OWNER_COLORS.primary}30`,
                }}
              >
                <Building2 className="w-4 h-4" style={{ color: OWNER_COLORS.primary }} />
                <span className="text-sm font-semibold" style={{ color: OWNER_COLORS.primary }}>Pour les propriétaires</span>
              </motion.div>

              {/* Hero title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Loue ton bien{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(to right, ${OWNER_COLORS.gradient.start}, ${OWNER_COLORS.gradient.end})` }}
                >
                  en toute sérénité
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Gestion simplifiée, locataires vérifiés et revenus optimisés. Tout ce qu'il te faut pour louer sans
                stress.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button
                    className="text-white font-semibold px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-base"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${OWNER_COLORS.gradient.start}, ${OWNER_COLORS.gradient.end})`,
                    }}
                  >
                    Lister mon bien
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
                  className="superellipse-2xl p-6 shadow-xl"
                  style={{ backgroundImage: `linear-gradient(to bottom right, ${OWNER_COLORS.gradient.start}, ${OWNER_COLORS.gradient.end})` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-4xl font-bold text-white">+{percentage}%</div>
                      <div className="mt-1" style={{ color: OWNER_COLORS.light }}>Revenus optimisés</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Stat card 2 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-xl superellipse-2xl p-6 shadow-xl"
                  style={{ borderColor: `${OWNER_COLORS.primary}20`, borderWidth: '1px' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        className="text-4xl font-bold bg-clip-text text-transparent"
                        style={{ backgroundImage: `linear-gradient(to right, ${OWNER_COLORS.gradient.start}, ${OWNER_COLORS.gradient.end})` }}
                      >
                        {properties}+
                      </div>
                      <div className="text-gray-600 mt-1">Propriétaires satisfaits</div>
                    </div>
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundImage: `linear-gradient(to bottom right, ${OWNER_COLORS.gradient.start}, ${OWNER_COLORS.gradient.end})` }}
                    >
                      <Building2 className="w-6 h-6 text-white" />
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
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(to right, ${OWNER_COLORS.gradient.start}, ${OWNER_COLORS.gradient.end})` }}
            >
              Izzico
            </span>
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
                  <div
                    className="absolute inset-0 superellipse-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                    style={{ background: `linear-gradient(to bottom right, ${OWNER_COLORS.gradient.start}08, ${OWNER_COLORS.gradient.end}08)` }}
                  />

                  <div
                    className="relative bg-white/60 backdrop-blur-sm superellipse-2xl p-8 border border-gray-100 transition-all duration-300"
                    style={{ '--hover-border': `${OWNER_COLORS.primary}40` } as React.CSSProperties}
                  >
                    <div
                      className="w-14 h-14 superellipse-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg"
                      style={{ backgroundImage: `linear-gradient(to bottom right, ${OWNER_COLORS.gradient.start}, ${OWNER_COLORS.gradient.end})` }}
                    >
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
      <div
        className="py-20 px-6"
        style={{ background: `linear-gradient(to bottom, transparent, ${OWNER_COLORS.light}50)` }}
      >
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
            <div
              className="absolute left-8 top-0 bottom-0 w-0.5"
              style={{ backgroundImage: `linear-gradient(to bottom, ${OWNER_COLORS.gradient.start}, ${OWNER_COLORS.gradient.end})` }}
            />

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
                <div
                  className="absolute left-0 w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundImage: `linear-gradient(to bottom right, ${OWNER_COLORS.gradient.start}, ${OWNER_COLORS.gradient.end})` }}
                >
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>

                {/* Content */}
                <div
                  className="bg-white/80 backdrop-blur-sm superellipse-2xl p-6 border transition-all hover:shadow-lg"
                  style={{ borderColor: `${OWNER_COLORS.primary}20` }}
                >
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
          <div
            className="relative overflow-hidden superellipse-3xl p-12 md:p-16 shadow-2xl"
            style={{ backgroundImage: `linear-gradient(to right, ${OWNER_COLORS.gradient.start}, ${OWNER_COLORS.gradient.end})` }}
          >
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
                  Prêt à maximiser tes revenus locatifs ?
                </h3>
                <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: OWNER_COLORS.light }}>
                  Rejoins des centaines de propriétaires qui font confiance à Izzico
                </p>
                <Link href="/signup">
                  <Button
                    className="bg-white hover:bg-gray-50 font-semibold px-10 py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-base"
                    style={{ color: OWNER_COLORS.text }}
                  >
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
