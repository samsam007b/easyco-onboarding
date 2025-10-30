/**
 * EXAMPLE: Property Detail Page with Guest Mode
 * This shows how to use TeaserCard to gate premium features
 *
 * Usage in actual page.tsx:
 * - Wrap compatibility score with TeaserCard
 * - Blur owner contact details
 * - Hide exact address for guests
 */

'use client';

import { TeaserCard, TeaserCardCompact } from '@/components/ui/TeaserCard';
import { Star, MapPin, User } from 'lucide-react';

export default function PropertyDetailGuestExample({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">

      {/* 1. Compatibility Score (Premium Feature) */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Score de Compatibilité</h2>

        <TeaserCard
          isLocked={!isAuthenticated}
          blurLevel={2}
          ctaText="Créer un compte pour voir ton score de compatibilité avec ce bien"
          ctaHref="/auth/signup"
          badge="Premium"
          className="min-h-[200px]"
        >
          {/* This content is shown blurred for guests */}
          <div className="text-center p-8">
            <div className="text-6xl font-bold text-green-500 mb-2">92%</div>
            <p className="text-gray-600 mb-4">Excellent match!</p>
            <ul className="text-left space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Budget compatible (€650 vs ton budget €700)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Quartier idéal (Ixelles, près de l'ULB)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Horaires similaires (lève-tôt)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                Style de vie compatible (non-fumeur)
              </li>
            </ul>
          </div>
        </TeaserCard>
      </div>

      {/* 2. Owner Profile (Blurred for Guests) */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Propriétaire</h2>

        <TeaserCard
          isLocked={!isAuthenticated}
          blurLevel={3}
          ctaText="Créer un compte pour voir le profil du propriétaire et le contacter"
          ctaHref="/auth/signup"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Marie Dupont</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>4.9 (12 avis)</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Propriétaire vérifié ✓</p>
              <p className="text-sm text-gray-600 mt-2">
                📧 marie.dupont@example.com
              </p>
              <p className="text-sm text-gray-600">
                📞 +32 470 12 34 56
              </p>
            </div>
          </div>
        </TeaserCard>
      </div>

      {/* 3. Exact Address (Hidden for Guests) */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Localisation</h2>

        <div className="space-y-4">
          {/* Approximate location (visible to everyone) */}
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-5 h-5" />
            <span>Ixelles, Bruxelles</span>
          </div>

          {/* Exact address (locked for guests) */}
          <TeaserCardCompact
            isLocked={!isAuthenticated}
            ctaText="Voir l'adresse exacte"
            ctaHref="/auth/signup"
          >
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Avenue de la Couronne 125</p>
              <p className="text-sm text-gray-600">1050 Ixelles, Bruxelles</p>
              <div className="mt-3 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <MapPin className="w-12 h-12 text-gray-400" />
              </div>
            </div>
          </TeaserCardCompact>
        </div>
      </div>

      {/* 4. Current Residents (Blurred for Guests) */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Colocataires Actuels (3/4)</h2>

        <TeaserCard
          isLocked={!isAuthenticated}
          blurLevel={2}
          ctaText="Créer un compte pour voir les profils des colocataires"
          ctaHref="/auth/signup"
          badge="Membres"
        >
          <div className="grid grid-cols-3 gap-4">
            {[
              { name: 'Thomas', age: 24, job: 'Étudiant ULB' },
              { name: 'Sophie', age: 26, job: 'Designer' },
              { name: 'Lucas', age: 23, job: 'Développeur' },
            ].map((resident, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2"></div>
                <h4 className="font-semibold">{resident.name}</h4>
                <p className="text-sm text-gray-600">{resident.age} ans</p>
                <p className="text-xs text-gray-500">{resident.job}</p>
              </div>
            ))}
          </div>
        </TeaserCard>
      </div>

      {/* 5. Application CTA (Always visible, but different for guests) */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl shadow-xl p-8 text-center">
        {isAuthenticated ? (
          <>
            <h3 className="text-2xl font-bold mb-2">Intéressé par ce bien ?</h3>
            <p className="mb-6">Candidate maintenant et augmente tes chances d'être accepté</p>
            <button className="px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition">
              Je candidate
            </button>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-2">Crée ton compte pour candidater</h3>
            <p className="mb-6">
              Complète ton profil en 2 minutes et découvre si ce bien est fait pour toi
            </p>
            <a
              href="/auth/signup"
              className="inline-block px-8 py-4 bg-white text-purple-600 font-bold rounded-full hover:bg-gray-100 transition"
            >
              Créer mon compte gratuit
            </a>
          </>
        )}
      </div>
    </div>
  );
}
