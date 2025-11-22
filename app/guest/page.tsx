'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Home, Users, MapPin, Calendar, ArrowRight, LogIn, UserPlus, X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import ModernPublicHeader from '@/components/layout/ModernPublicHeader';
import Footer from '@/components/layout/Footer';
import PropertyPreviewGrid from '@/components/PropertyPreviewGrid';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function GuestPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [showLimitedModal, setShowLimitedModal] = useState(false);

  const handleRestrictedAction = (action: string) => {
    setShowLimitedModal(true);
    toast.info(t('guest.limitedAccess.title'), {
      description: t('guest.limitedAccess.description'),
    });
  };

  const guestFeatures = [
    {
      icon: Search,
      title: t('guest.features.browse.title'),
      description: t('guest.features.browse.description'),
      available: true,
    },
    {
      icon: MapPin,
      title: t('guest.features.locations.title'),
      description: t('guest.features.locations.description'),
      available: true,
    },
    {
      icon: Users,
      title: t('guest.features.matching.title'),
      description: t('guest.features.matching.description'),
      available: false,
      requiresAccount: true,
    },
    {
      icon: Calendar,
      title: t('guest.features.bookVisits.title'),
      description: t('guest.features.bookVisits.description'),
      available: false,
      requiresAccount: true,
    },
    {
      icon: Home,
      title: t('guest.features.favorites.title'),
      description: t('guest.features.favorites.description'),
      available: false,
      requiresAccount: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <ModernPublicHeader activePage={null} onNavigate={() => {}} />

      {/* Guest Mode Banner */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">{t('guest.title')}</h2>
                <p className="text-sm text-gray-600">
                  {t('guest.subtitle')}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push('/auth?mode=signup')}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {t('auth.signup.signupButton')}
              </Button>
              <Button
                onClick={() => router.push('/auth?mode=login')}
                variant="outline"
              >
                <LogIn className="w-4 h-4 mr-2" />
                {t('auth.login.loginButton')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Features Overview */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('guest.whatCanYouDo')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('guest.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guestFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className={`
                    relative p-6 rounded-3xl border-2 transition-all
                    ${feature.available
                      ? 'bg-white border-yellow-200 hover:border-yellow-400 hover:shadow-lg'
                      : 'bg-gray-50 border-gray-200 opacity-75'
                    }
                  `}
                >
                  {!feature.available && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full font-medium">
                        {t('guest.accountRequired')}
                      </div>
                    </div>
                  )}

                  <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center mb-4
                    ${feature.available
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                      : 'bg-gray-300'
                    }
                  `}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>

                  {feature.requiresAccount && (
                    <button
                      onClick={() => handleRestrictedAction(feature.title)}
                      className="mt-4 text-sm text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-1"
                    >
                      {t('guest.unlockFeature')}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Property Preview - Limited View */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t('guest.availableProperties')}
              </h2>
              <p className="text-gray-600">
                {t('guest.previewDescription')}
              </p>
            </div>
          </div>

          <PropertyPreviewGrid limit={6} />

          <div className="mt-8 text-center">
            <div className="inline-block bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 max-w-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t('guest.seeMore')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('guest.createAccountCTA')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => router.push('/auth?mode=signup')}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  {t('auth.signup.signupButton')}
                </Button>
                <Button
                  onClick={() => router.push('/auth?mode=login')}
                  size="lg"
                  variant="outline"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  {t('auth.login.loginButton')}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits of Creating Account */}
        <section className="mb-16">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {t('guest.whyCreateAccount')}
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="font-bold mb-2">{t('guest.benefits.smartMatching.title')}</h3>
                  <p className="text-sm text-white/90">
                    {t('guest.benefits.smartMatching.description')}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl mb-3">🔔</div>
                  <h3 className="font-bold mb-2">{t('guest.benefits.alerts.title')}</h3>
                  <p className="text-sm text-white/90">
                    {t('guest.benefits.alerts.description')}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl mb-3">💬</div>
                  <h3 className="font-bold mb-2">{t('guest.benefits.messaging.title')}</h3>
                  <p className="text-sm text-white/90">
                    {t('guest.benefits.messaging.description')}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push('/auth?mode=signup')}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                {t('guest.startFree')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Limited Access Modal */}
      {showLimitedModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative animate-slideUp">
            <button
              onClick={() => setShowLimitedModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {t('guest.limitedAccess.title')}
              </h3>
              <p className="text-gray-600 mb-6">
                {t('guest.limitedAccess.description')}
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => router.push('/auth?mode=signup')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 w-full"
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  {t('auth.signup.signupButton')}
                </Button>
                <Button
                  onClick={() => router.push('/auth?mode=login')}
                  variant="outline"
                  className="w-full"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  {t('auth.login.loginButton')}
                </Button>
                <button
                  onClick={() => setShowLimitedModal(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {t('guest.continueAsGuest')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
