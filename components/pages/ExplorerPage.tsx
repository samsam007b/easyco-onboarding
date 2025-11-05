'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Euro, Calendar, SlidersHorizontal, Heart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ExplorerPage() {
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    budget: '',
    date: '',
  });

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
      {/* Hero Section with Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-20 pb-12 px-6"
      >
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mb-4 shadow-lg"
            >
              <Search className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore les colocations disponibles
            </h1>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Parcours les propriétés sans compte. Inscris-toi pour contacter les propriétaires.
            </p>
          </div>

          {/* Search Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Location */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Où ?
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ville, quartier..."
                    value={searchFilters.location}
                    onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Budget */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="€800/mois"
                    value={searchFilters.budget}
                    onChange={(e) => setSearchFilters({ ...searchFilters, budget: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quand ?
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Flexible"
                    value={searchFilters.date}
                    onChange={(e) => setSearchFilters({ ...searchFilters, date: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <Button className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 font-medium">
                <SlidersHorizontal className="w-4 h-4" />
                Filtres avancés
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Properties Grid */}
      <div className="pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {mockProperties.length} colocations disponibles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {mockProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-all">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                  </button>
                  <div className="absolute bottom-4 left-4 px-3 py-1 bg-amber-500 rounded-full text-sm font-semibold text-white">
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {property.roommates} colocataires
                    </div>
                    <div className="text-sm text-gray-600">
                      Dispo: {property.available}
                    </div>
                  </div>

                  {/* CTA - Requires account */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link href="/signup">
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-2 border-orange-500 text-orange-700 hover:bg-orange-50 font-semibold"
                      >
                        Créer un compte pour contacter
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Plus de 100+ colocations disponibles
              </h3>
              <p className="text-gray-600 mb-6">
                Inscris-toi gratuitement pour accéder à toutes les propriétés et contacter les propriétaires
              </p>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all">
                  Commencer gratuitement
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
