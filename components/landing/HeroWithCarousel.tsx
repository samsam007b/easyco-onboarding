'use client';

import { PropertyCarousel } from './PropertyCarousel';
import { FadeIn, ScaleIn } from '@/components/animations';
import { Button } from '@/components/ui/button';
import { Search, Home, Users, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function HeroWithCarousel() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-purple-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8 z-10">
            <FadeIn direction="up" delay={0.2}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>La plateforme de coliving #1 en France</span>
              </div>
            </FadeIn>

            <FadeIn direction="up" delay={0.3}>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Trouve ton{' '}
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  coloc idéal
                </span>
              </h1>
            </FadeIn>

            <FadeIn direction="up" delay={0.4}>
              <p className="text-xl text-gray-600 max-w-xl">
                Découvre des milliers de logements et connecte-toi avec des colocataires qui te
                ressemblent. Simple, rapide et sécurisé.
              </p>
            </FadeIn>

            <FadeIn direction="up" delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="cta-searcher text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all text-white font-semibold"
                  onClick={() => router.push('/properties/browse')}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Trouver un logement
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                  onClick={() => router.push('/signup')}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Créer mon compte
                </Button>
              </div>
            </FadeIn>

            {/* Stats */}
            <FadeIn direction="up" delay={0.6}>
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                <div>
                  <div className="text-3xl font-bold text-purple-600">15K+</div>
                  <div className="text-sm text-gray-600">Logements</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">50K+</div>
                  <div className="text-sm text-gray-600">Utilisateurs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right Side - Carousel */}
          <ScaleIn delay={0.4} className="w-full">
            <div className="relative aspect-[4/5] max-w-2xl mx-auto">
              <PropertyCarousel
                autoPlayInterval={5000}
                showControls={true}
                showIndicators={true}
                className="shadow-2xl"
              />

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 z-20">
                <div className="bg-white superellipse-2xl shadow-xl p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">+200</div>
                    <div className="text-sm text-gray-600">Nouveaux cette semaine</div>
                  </div>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute -top-6 -right-6 z-20">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 superellipse-2xl shadow-xl p-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Match instantané</span>
                  </div>
                  <div className="text-2xl font-bold">94%</div>
                </div>
              </div>
            </div>
          </ScaleIn>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
