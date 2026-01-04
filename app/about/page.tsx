'use client';

import Link from 'next/link';
import Image from 'next/image';
import ModernPublicHeader from '@/components/layout/ModernPublicHeader';
import Footer from '@/components/layout/Footer';
import { Target, Users, Shield, Zap, Heart, TrendingUp, Award, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/use-language';

export default function AboutPage() {
  const { language, getSection } = useLanguage();
  const t = getSection('about');

  const values = [
    {
      icon: Shield,
      titleKey: 'security',
    },
    {
      icon: Heart,
      titleKey: 'community',
    },
    {
      icon: Zap,
      titleKey: 'simplicity',
    },
    {
      icon: TrendingUp,
      titleKey: 'innovation',
    },
  ];

  const team = [
    {
      name: 'Marie Dubois',
      memberKey: 'marie',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
    },
    {
      name: 'Thomas Laurent',
      memberKey: 'thomas',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
    },
    {
      name: 'Sophie Chen',
      memberKey: 'sophie',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    },
    {
      name: 'Lucas Martin',
      memberKey: 'lucas',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
    },
  ];

  const stats = [
    { value: '10,000+', labelKey: 'activeUsers' },
    { value: '2,500+', labelKey: 'colivingsCreated' },
    { value: '95%', labelKey: 'satisfactionRate' },
    { value: '24/7', labelKey: 'supportAvailable' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <ModernPublicHeader />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-purple-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {t?.hero?.title?.[language] || 'About '}<span className="text-purple-600">Izzico</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              {t?.hero?.subtitle?.[language] || 'We are revolutionizing roommate search in Brussels with a modern, secure, and intelligent platform that connects the right people at the right time.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  {t?.hero?.joinFree?.[language] || 'Join us for free'}
                </Button>
              </Link>
              <Link href="/properties/browse">
                <Button size="lg" variant="outline">
                  {t?.hero?.browseListings?.[language] || 'Browse listings'}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold mb-4">
                  <Target className="w-4 h-4" />
                  {t?.mission?.badge?.[language] || 'Our Mission'}
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  {t?.mission?.title?.[language] || 'Simplifying shared living'}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  {t?.mission?.description1?.[language] || 'Searching for a shared home can be stressful, time-consuming, and frustrating. We created Izzico to transform this experience into something simple, fast, and even enjoyable.'}
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t?.mission?.description2?.[language] || 'Our intelligent matching algorithm analyzes your preferences, lifestyle, and personality to connect you with truly compatible roommates.'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-yellow-100 superellipse-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Users className="w-16 h-16 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    {t?.mission?.successTitle?.[language] || 'Thousands of successful matches'}
                  </p>
                  <p className="text-gray-600">
                    {t?.mission?.successDescription?.[language] || 'Every day, we help people find their ideal roommate'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t?.values?.title?.[language] || 'Our Values'}
              </h2>
              <p className="text-xl text-gray-600">
                {t?.values?.subtitle?.[language] || 'What guides every decision we make'}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white superellipse-xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="w-14 h-14 bg-purple-100 superellipse-lg flex items-center justify-center mb-4">
                    <value.icon className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t?.values?.[value.titleKey]?.title?.[language] || value.titleKey}
                  </h3>
                  <p className="text-gray-600">
                    {t?.values?.[value.titleKey]?.description?.[language] || ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                {t?.stats?.title?.[language] || 'Izzico in Numbers'}
              </h2>
              <p className="text-xl text-purple-100">
                {t?.stats?.subtitle?.[language] || 'Our impact on the community'}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-5xl font-bold mb-2">{stat.value}</p>
                  <p className="text-purple-100">
                    {t?.stats?.[stat.labelKey]?.[language] || stat.labelKey}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full font-semibold mb-4">
                <Award className="w-4 h-4" />
                {t?.team?.badge?.[language] || 'Our Team'}
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t?.team?.title?.[language] || 'Meet the team behind Izzico'}
              </h2>
              <p className="text-xl text-gray-600">
                {t?.team?.subtitle?.[language] || 'Passionate people working every day to improve your experience'}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white superellipse-xl border-2 border-gray-200 p-6 hover:border-purple-300 transition text-center"
                >
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-sm text-purple-600 font-semibold mb-3">
                    {t?.team?.members?.[member.memberKey]?.role?.[language] || member.memberKey}
                  </p>
                  <p className="text-sm text-gray-600">
                    {t?.team?.members?.[member.memberKey]?.bio?.[language] || ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {t?.story?.title?.[language] || 'Our Story'}
              </h2>
              <p className="text-xl text-gray-600">
                {t?.story?.subtitle?.[language] || 'How Izzico was born'}
              </p>
            </div>
            <div className="prose prose-lg max-w-none">
              <div className="bg-white superellipse-2xl shadow-lg p-8 md:p-12">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {t?.story?.paragraph1?.[language] || 'It all started in 2023 when Marie and Thomas, long-time friends, shared their frustrations about searching for roommates in Brussels. Between dubious listings, personality incompatibilities, and archaic processes, they realized a modern solution was needed.'}
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {t?.story?.paragraph2?.[language] || 'With their combined experience in tech and design, they decided to create the platform they had dreamed of: a solution that uses artificial intelligence to match the right people, verifies identities for more security, and makes the process as simple as possible.'}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {t?.story?.paragraph3?.[language] || 'Today, Izzico helps thousands of people find their ideal coliving every month. Our team grows, our technology improves, but our mission remains the same: simplifying shared living for everyone.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-yellow-400 to-yellow-500">
          <div className="max-w-4xl mx-auto text-center">
            <Globe className="w-16 h-16 text-gray-900 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t?.cta?.title?.[language] || 'Ready to join the adventure?'}
            </h2>
            <p className="text-xl text-gray-800 mb-8">
              {t?.cta?.subtitle?.[language] || 'Sign up for free and find your ideal roommate today'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-gray-900 text-white hover:bg-gray-800 text-lg px-8"
                >
                  {t?.cta?.createAccount?.[language] || 'Create my free account'}
                </Button>
              </Link>
              <Link href="/properties/browse">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-lg px-8"
                >
                  {t?.cta?.browseListings?.[language] || 'Browse listings'}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
