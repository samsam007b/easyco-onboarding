'use client';

import Link from 'next/link';
import Image from 'next/image';
import ModernPublicHeader from '@/components/layout/ModernPublicHeader';
import Footer from '@/components/layout/Footer';
import {
  DollarSign,
  Shield,
  Clock,
  Users,
  TrendingUp,
  CheckCircle2,
  Zap,
  Award,
  BarChart3,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/use-language';

export default function OwnersPage() {
  const { language, getSection } = useLanguage();
  const t = getSection('owners');

  const benefits = [
    { icon: DollarSign, key: 'maximizeRevenue' },
    { icon: Shield, key: 'verifiedTenants' },
    { icon: Clock, key: 'saveTime' },
    { icon: Users, key: 'smartMatching' },
    { icon: TrendingUp, key: 'realTimeAnalytics' },
    { icon: MessageCircle, key: 'dedicatedSupport' },
  ];

  const features = [
    { icon: Award, key: 'optimizedListings' },
    { icon: BarChart3, key: 'simplifiedManagement' },
    { icon: Shield, key: 'securePayments' },
    { icon: TrendingUp, key: 'roiTracking' },
  ];

  const pricingFreeFeatures = [
    'unlimitedListings',
    'dashboardAnalytics',
    'candidateMessaging',
    'emailSupport',
  ];

  const pricingPremiumFeatures = [
    'everythingInFree',
    'priorityMatching',
    'aiPricing',
    'phoneSupport',
    'multiProperty',
    'dataExport',
  ];

  const testimonials = [
    {
      name: 'Jean Dupont',
      memberKey: 'jean',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean',
      rating: 5,
    },
    {
      name: 'Sophie Martin',
      memberKey: 'sophie',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
      rating: 5,
    },
    {
      name: 'Pierre Laurent',
      memberKey: 'pierre',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre',
      rating: 5,
    },
  ];

  const stats = [
    { value: '2,500+', key: 'propertiesListed' },
    { value: '96%', key: 'avgOccupancy' },
    { value: '8.2%', key: 'avgRoi' },
    { value: '< 15j', key: 'avgRentalTime' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <ModernPublicHeader />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold mb-6">
                  <DollarSign className="w-4 h-4" />
                  {t?.hero?.badge?.[language] || 'For Owners'}
                </div>
                <h1 className="text-5xl font-bold mb-6">
                  {t?.hero?.title?.[language] || 'Rent faster, earn more, stress less'}
                </h1>
                <p className="text-xl text-purple-100 leading-relaxed mb-8">
                  {t?.hero?.subtitle?.[language] || 'The modern platform to manage your shared housing. Smart matching, simplified management, optimized income.'}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/onboarding/owner/basic-info">
                    <Button
                      size="lg"
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 text-lg px-8"
                    >
                      {t?.hero?.listProperty?.[language] || 'List my property for free'}
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white text-white hover:bg-white/10 text-lg px-8"
                    >
                      {t?.hero?.seeFeatures?.[language] || 'See features'}
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-purple-200 mt-4">
                  {t?.hero?.freeSignup?.[language] || '✓ Free signup • ✓ No commitment • ✓ 24/7 support'}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">€3,450</div>
                  <p className="text-xl text-purple-100 mb-6">
                    {t?.hero?.avgIncome?.[language] || 'Average monthly income per owner'}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.slice(1).map((stat, index) => (
                      <div key={index} className="bg-white/10 rounded-lg p-4">
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-purple-100">
                          {t?.stats?.[stat.key]?.[language] || stat.key}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-6 bg-white" id="features">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t?.benefits?.title?.[language] || 'Why choose Izzico?'}
              </h2>
              <p className="text-xl text-gray-600">
                {t?.benefits?.subtitle?.[language] || 'Everything you need to manage your shared housing like a pro'}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-lg transition"
                >
                  <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t?.benefits?.[benefit.key]?.title?.[language] || benefit.key}
                  </h3>
                  <p className="text-gray-600">
                    {t?.benefits?.[benefit.key]?.description?.[language] || ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t?.features?.title?.[language] || 'Key features'}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition flex gap-6"
                >
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {t?.features?.[feature.key]?.title?.[language] || feature.key}
                    </h3>
                    <p className="text-gray-600">
                      {t?.features?.[feature.key]?.description?.[language] || ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t?.testimonials?.title?.[language] || 'What our owners say'}
              </h2>
              <p className="text-xl text-gray-600">
                {t?.testimonials?.subtitle?.[language] || 'Join hundreds of satisfied owners'}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6">
                    "{t?.testimonials?.[testimonial.memberKey]?.quote?.[language] || ''}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">
                        {t?.testimonials?.[testimonial.memberKey]?.role?.[language] || ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t?.pricing?.title?.[language] || 'Transparent Pricing'}
              </h2>
              <p className="text-xl text-gray-600">
                {t?.pricing?.subtitle?.[language] || 'Start for free, upgrade when you want'}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {t?.pricing?.free?.name?.[language] || 'Free'}
                </h3>
                <p className="text-4xl font-bold text-gray-900 mb-6">
                  €0<span className="text-lg text-gray-600">/mois</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {pricingFreeFeatures.map((featureKey, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">
                        {t?.pricing?.free?.features?.[featureKey]?.[language] || featureKey}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/onboarding/owner/basic-info">
                  <Button variant="outline" className="w-full" size="lg">
                    {t?.pricing?.free?.cta?.[language] || 'Start for free'}
                  </Button>
                </Link>
              </div>

              {/* Premium Plan */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  {t?.pricing?.premium?.popular?.[language] || 'Popular'}
                </div>
                <h3 className="text-2xl font-bold mb-2">
                  {t?.pricing?.premium?.name?.[language] || 'Premium'}
                </h3>
                <p className="text-4xl font-bold mb-6">
                  €29<span className="text-lg text-purple-200">/mois</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {pricingPremiumFeatures.map((featureKey, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                      <span className="text-white">
                        {t?.pricing?.premium?.features?.[featureKey]?.[language] || featureKey}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/onboarding/owner/basic-info">
                  <Button
                    className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                    size="lg"
                  >
                    {t?.pricing?.premium?.cta?.[language] || 'Try 14 days free'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-yellow-400 to-yellow-500">
          <div className="max-w-4xl mx-auto text-center">
            <Zap className="w-16 h-16 text-gray-900 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t?.cta?.title?.[language] || 'Ready to optimize your rental income?'}
            </h2>
            <p className="text-xl text-gray-800 mb-8">
              {t?.cta?.subtitle?.[language] || 'Join hundreds of owners who trust Izzico'}
            </p>
            <Link href="/onboarding/owner/basic-info">
              <Button
                size="lg"
                className="bg-gray-900 text-white hover:bg-gray-800 text-lg px-12"
              >
                {t?.cta?.button?.[language] || 'List my first property'}
              </Button>
            </Link>
            <p className="text-sm text-gray-700 mt-4">
              {t?.cta?.noCreditCard?.[language] || 'No credit card required • Setup in 5 minutes'}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
