'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, MapPin, Users, ArrowRight, Check, Heart, Home, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Couleurs Searcher du Design System (gradient logo)
const SEARCHER_COLORS = {
  primary: '#FFA040',      // Couleur dominante (centre du gradient)
  gradient: {
    start: '#FFA040',      // Orange doré
    middle: '#FFB85C',     // Orange jaune
    end: '#FFD080',        // Jaune doré
  },
  light: '#FFF9E6',        // Fond très clair
  text: '#B87A00',         // Texte sur fond clair
};

export default function ExplorerPage() {
  const { scrollYProgress } = useScroll();
  const [properties, setProperties] = useState(0);
  const [users, setUsers] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // Animated counters
  useEffect(() => {
    if (!hasAnimated) {
      const timer1 = setInterval(() => {
        setProperties((prev) => {
          if (prev >= 120) {
            clearInterval(timer1);
            return 120;
          }
          return prev + 5;
        });
      }, 30);

      const timer2 = setInterval(() => {
        setUsers((prev) => {
          if (prev >= 850) {
            clearInterval(timer2);
            return 850;
          }
          return prev + 30;
        });
      }, 30);

      setHasAnimated(true);
    }
  }, [hasAnimated]);

  const mockProperties = [
    {
      id: 1,
      title: 'Appartement cosy - Ixelles',
      location: 'Ixelles, Bruxelles',
      price: 650,
      image: '/images/hero/pexels-charlotte-may-5824520.jpg',
      roommates: 3,
      available: '1 Nov 2024',
    },
    {
      id: 2,
      title: 'Maison partagée - Etterbeek',
      location: 'Etterbeek, Bruxelles',
      price: 580,
      image: '/images/hero/pexels-jonathanborba-5570226.jpg',
      roommates: 4,
      available: '15 Nov 2024',
    },
    {
      id: 3,
      title: 'Studio moderne - Centre',
      location: 'Centre, Bruxelles',
      price: 750,
      image: '/images/hero/pexels-kseniachernaya-4740485.jpg',
      roommates: 2,
      available: 'Immédiat',
    },
    {
      id: 4,
      title: 'Loft spacieux - ULB',
      location: 'Près ULB, Bruxelles',
      price: 620,
      image: '/images/hero/pexels-polina-zimmerman-3747425.jpg',
      roommates: 3,
      available: '1 Dec 2024',
    },
  ];

  const features = [
    {
      icon: Search,
      title: 'Recherche avancée',
      description: 'Filtre par quartier, budget, date et trouve exactement ce que tu cherches',
    },
    {
      icon: MapPin,
      title: 'Tous les quartiers',
      description: 'Colocations disponibles partout à Bruxelles',
    },
    {
      icon: Users,
      title: 'Matching intelligent',
      description: 'Trouve des colocataires qui te ressemblent',
    },
  ];

  const timeline = [
    { step: '01', title: 'Explore les colocations', description: 'Parcours les annonces sans compte' },
    { step: '02', title: 'Crée ton profil', description: 'Inscris-toi gratuitement en 2 minutes' },
    { step: '03', title: 'Contacte les propriétaires', description: 'Discute directement avec eux' },
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
                  background: `linear-gradient(to right, ${SEARCHER_COLORS.gradient.start}15, ${SEARCHER_COLORS.gradient.end}15)`,
                  borderColor: `${SEARCHER_COLORS.primary}30`,
                }}
              >
                <Search className="w-4 h-4" style={{ color: SEARCHER_COLORS.primary }} />
                <span className="text-sm font-semibold" style={{ color: SEARCHER_COLORS.primary }}>Explorer les colocations</span>
              </motion.div>

              {/* Hero title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Trouve ta{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(to right, ${SEARCHER_COLORS.gradient.start}, ${SEARCHER_COLORS.gradient.end})` }}
                >
                  colocation idéale
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Parcours des centaines de colocations à Bruxelles. Filtre par quartier, budget et trouve le logement
                parfait.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button
                    className="text-white font-semibold px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-base hover:brightness-110"
                    style={{ background: `linear-gradient(135deg, ${SEARCHER_COLORS.gradient.start}, ${SEARCHER_COLORS.gradient.end})` }}
                  >
                    Créer un compte gratuit
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
                  className="bg-white/80 backdrop-blur-xl superellipse-2xl p-6 shadow-xl"
                  style={{ borderColor: `${SEARCHER_COLORS.gradient.end}40`, borderWidth: '1px' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        className="text-4xl font-bold bg-clip-text text-transparent"
                        style={{ backgroundImage: `linear-gradient(to right, ${SEARCHER_COLORS.gradient.start}, ${SEARCHER_COLORS.gradient.end})` }}
                      >
                        {properties}+
                      </div>
                      <div className="text-gray-600 mt-1">Colocations disponibles</div>
                    </div>
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${SEARCHER_COLORS.gradient.start}, ${SEARCHER_COLORS.gradient.end})` }}
                    >
                      <Home className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Stat card 2 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="superellipse-2xl p-6 shadow-xl"
                  style={{ background: `linear-gradient(135deg, ${SEARCHER_COLORS.gradient.start}, ${SEARCHER_COLORS.gradient.end})` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-4xl font-bold text-white">{users}+</div>
                      <div className="text-white/80 mt-1">Utilisateurs actifs</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
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
              style={{ backgroundImage: `linear-gradient(to right, ${SEARCHER_COLORS.gradient.start}, ${SEARCHER_COLORS.gradient.end})` }}
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
                    style={{ background: `linear-gradient(135deg, ${SEARCHER_COLORS.gradient.start}08, ${SEARCHER_COLORS.gradient.end}08)` }}
                  />

                  <div
                    className="relative bg-white/60 backdrop-blur-sm superellipse-2xl p-8 border border-gray-100 transition-all duration-300"
                    style={{ ['--hover-border' as string]: `${SEARCHER_COLORS.gradient.end}60` }}
                  >
                    <div
                      className="w-14 h-14 superellipse-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${SEARCHER_COLORS.gradient.start}, ${SEARCHER_COLORS.gradient.end})` }}
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

      {/* Properties Preview */}
      <div className="py-20 px-6" style={{ background: `linear-gradient(to bottom, transparent, ${SEARCHER_COLORS.light}30)` }}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Aperçu des{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(to right, ${SEARCHER_COLORS.gradient.start}, ${SEARCHER_COLORS.gradient.end})` }}
              >
                colocations
              </span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Quelques exemples de propriétés disponibles. Inscris-toi pour tout voir et contacter les propriétaires.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
            {mockProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative bg-white/80 backdrop-blur-sm superellipse-2xl overflow-hidden border border-gray-100 transition-all shadow-lg hover:shadow-2xl"
                style={{ ['--hover-border' as string]: `${SEARCHER_COLORS.gradient.end}60` }}
              >
                {/* Image */}
                <div className="relative h-56 bg-gray-200 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-all">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                  </button>
                  <div
                    className="absolute bottom-4 left-4 px-4 py-2 rounded-full text-base font-bold text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${SEARCHER_COLORS.gradient.start}, ${SEARCHER_COLORS.gradient.end})` }}
                  >
                    €{property.price}/mois
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{property.title}</h3>

                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{property.roommates} colocataires</span>
                    </div>
                    <span className="text-sm text-gray-600">Dispo: {property.available}</span>
                  </div>

                  <Link href="/signup">
                    <Button
                      variant="outline"
                      className="w-full superellipse-xl border-2 font-semibold transition-colors"
                      style={{
                        borderColor: SEARCHER_COLORS.primary,
                        color: SEARCHER_COLORS.text,
                      }}
                    >
                      Créer un compte pour contacter
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* See more CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-gray-600 mb-6">
              <span className="font-bold text-gray-900">100+ colocations supplémentaires</span> disponibles pour les
              membres
            </p>
            <Link href="/signup">
              <Button
                className="text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all hover:brightness-110"
                style={{ background: `linear-gradient(135deg, ${SEARCHER_COLORS.gradient.start}, ${SEARCHER_COLORS.gradient.end})` }}
              >
                Voir toutes les colocations
                <Filter className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Timeline section */}
      <div className="py-20 px-6">
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
              style={{ background: `linear-gradient(to bottom, ${SEARCHER_COLORS.gradient.start}, ${SEARCHER_COLORS.gradient.end})` }}
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
                  style={{ background: `linear-gradient(135deg, ${SEARCHER_COLORS.gradient.start}, ${SEARCHER_COLORS.gradient.end})` }}
                >
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>

                {/* Content */}
                <div
                  className="bg-white/80 backdrop-blur-sm superellipse-2xl p-6 border transition-all hover:shadow-lg"
                  style={{ borderColor: `${SEARCHER_COLORS.gradient.end}40` }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-6"
      >
        <div className="max-w-4xl mx-auto">
          <div
            className="relative overflow-hidden superellipse-3xl p-12 md:p-16 shadow-2xl"
            style={{ background: `linear-gradient(135deg, ${SEARCHER_COLORS.gradient.start}, ${SEARCHER_COLORS.gradient.end})` }}
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
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Prêt à trouver ta coloc idéale ?</h3>
                <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                  Inscris-toi gratuitement et accède à toutes les colocations disponibles
                </p>
                <Link href="/signup">
                  <Button
                    className="bg-white font-semibold px-10 py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-base hover:bg-gray-50"
                    style={{ color: SEARCHER_COLORS.text }}
                  >
                    Commencer gratuitement
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
