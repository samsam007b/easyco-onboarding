'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Euro, Calendar, SlidersHorizontal, Heart, Users, ArrowRight, Sparkles, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ExplorerPage() {
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    budget: '',
    date: '',
  });

  const benefits = [
    {
      icon: Search,
      title: 'Recherche intelligente',
      description: 'Parcours des centaines de colocations à Bruxelles grâce à notre moteur de recherche avancé. Filtre par quartier, budget, date d\'emménagement et trouve exactement ce que tu cherches.',
      size: 'large' as const
    },
    {
      icon: MapPin,
      title: 'Tous les quartiers',
      description: 'Disponible partout à Bruxelles',
      size: 'small' as const
    },
    {
      icon: Users,
      title: 'Matching intelligent',
      description: 'Trouve des colocataires compatibles',
      size: 'small' as const
    },
    {
      icon: Home,
      title: 'Plus de 100+ colocations disponibles',
      description: 'Inscris-toi gratuitement pour accéder à toutes les propriétés',
      size: 'medium' as const
    },
  ];

  const steps = [
    { number: '01', title: 'Recherche ta coloc' },
    { number: '02', title: 'Crée ton profil' },
    { number: '03', title: 'Contacte les propriétaires' },
  ];

  // Mock data pour les propriétés (preview mode sans compte)
  const mockProperties = [
    {
      id: 1,
      title: 'Appartement cosy - Ixelles',
      location: 'Ixelles, Bruxelles',
      price: 650,
      image: '/images/properties/property-01.png',
      roommates: 3,
      available: '1 Nov 2024',
    },
    {
      id: 2,
      title: 'Maison partagée - Etterbeek',
      location: 'Etterbeek, Bruxelles',
      price: 580,
      image: '/images/properties/property-02.png',
      roommates: 4,
      available: '15 Nov 2024',
    },
    {
      id: 3,
      title: 'Studio moderne - Centre',
      location: 'Centre, Bruxelles',
      price: 750,
      image: '/images/properties/property-03.png',
      roommates: 2,
      available: 'Immédiat',
    },
    {
      id: 4,
      title: 'Loft spacieux - ULB',
      location: 'Près ULB, Bruxelles',
      price: 620,
      image: '/images/properties/property-04.png',
      roommates: 3,
      available: '1 Dec 2024',
    },
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Search className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Trouve ta colocation idéale
            </h1>
          </motion.div>

          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Parcours les colocations disponibles et crée ton profil gratuitement
          </p>

          <Link href="/signup">
            <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all">
              Créer un compte
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
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-md">
                    <Search className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Recherche intelligente
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Parcours des centaines de colocations à Bruxelles grâce à notre moteur de recherche avancé. Filtre par quartier, budget, date d'emménagement et trouve exactement ce que tu cherches.
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Tous les quartiers
                </h3>
                <p className="text-sm text-gray-600">
                  Disponible partout à Bruxelles
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Matching intelligent
                </h3>
                <p className="text-sm text-gray-600">
                  Trouve des colocataires compatibles
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
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      Plus de 100+ colocations disponibles
                    </h3>
                    <p className="text-orange-50">
                      Inscris-toi gratuitement pour accéder à toutes les propriétés
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Steps - Macaron Style */}
      <div className="pb-12 px-6">
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
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
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

      {/* Properties Preview Grid */}
      <div className="pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Aperçu des colocations
            </h2>
            <p className="text-gray-600">
              Quelques exemples de propriétés disponibles sur la plateforme
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-white/60 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg border border-white/20 hover:shadow-2xl transition-all group cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-all">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                  </button>
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-sm font-semibold text-white shadow-md">
                    €{property.price}/mois
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {property.roommates} colocataires
                    </div>
                    <div className="text-sm text-gray-600">
                      Dispo: {property.available}
                    </div>
                  </div>

                  {/* CTA - Requires account */}
                  <Link href="/signup">
                    <Button
                      variant="outline"
                      className="w-full rounded-xl border-2 border-amber-500 text-amber-700 hover:bg-amber-50 font-semibold"
                    >
                      Créer un compte pour contacter
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final Full-Width */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="pb-16 px-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-12 shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

            <div className="relative text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Prêt à trouver ta colocation idéale ?
              </h3>
              <p className="text-orange-50 mb-8 max-w-2xl mx-auto">
                Plus de 100+ colocations disponibles. Inscris-toi gratuitement pour tout voir et contacter les propriétaires
              </p>
              <Link href="/signup">
                <Button className="bg-white text-amber-700 hover:bg-gray-50 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                  Commencer gratuitement
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
