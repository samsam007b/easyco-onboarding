'use client';

import Link from 'next/link';
import PublicHeader from '@/components/layout/PublicHeader';
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

export default function OwnersPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: 'Maximise tes revenus',
      description:
        'Algorithme de pricing intelligent qui optimise ton loyer selon le marché et l\'occupation.',
    },
    {
      icon: Shield,
      title: 'Locataires vérifiés',
      description:
        'Tous les profils sont vérifiés (identité, revenus, références) pour ta tranquillité d\'esprit.',
    },
    {
      icon: Clock,
      title: 'Gagne du temps',
      description:
        'Automatise les visites, la sélection et la gestion administrative. Focus sur l\'essentiel.',
    },
    {
      icon: Users,
      title: 'Matching intelligent',
      description:
        'Notre IA trouve les meilleurs candidats selon tes critères et le profil de ta coloc.',
    },
    {
      icon: TrendingUp,
      title: 'Analytics en temps réel',
      description:
        'Dashboard complet avec KPIs, revenus, occupation et insights pour optimiser ta rentabilité.',
    },
    {
      icon: MessageCircle,
      title: 'Support dédié',
      description:
        'Une équipe à ton écoute 24/7 pour répondre à toutes tes questions et t\'accompagner.',
    },
  ];

  const features = [
    {
      title: 'Annonces optimisées',
      description: 'Templates professionnels et suggestions IA pour maximiser l\'attractivité',
      icon: Award,
    },
    {
      title: 'Gestion simplifiée',
      description: 'Dashboard centralisé pour gérer toutes tes propriétés en un coup d\'œil',
      icon: BarChart3,
    },
    {
      title: 'Paiements sécurisés',
      description: 'Collecte automatique des loyers et gestion financière intégrée',
      icon: Shield,
    },
    {
      title: 'ROI tracking',
      description: 'Suis ton retour sur investissement avec des analytics détaillés',
      icon: TrendingUp,
    },
  ];

  const pricing = {
    free: [
      'Annonces illimitées',
      'Dashboard analytics',
      'Messagerie candidats',
      'Support email',
    ],
    premium: [
      'Tout dans Free',
      'Matching prioritaire',
      'Pricing intelligent IA',
      'Support téléphone prioritaire',
      'Gestion multi-propriétés',
      'Export des données',
    ],
  };

  const testimonials = [
    {
      name: 'Jean Dupont',
      role: 'Propriétaire de 3 colocations',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jean',
      quote:
        'EasyCo a transformé ma façon de gérer mes biens. Je gagne 10h par semaine et mes revenus ont augmenté de 15%!',
      rating: 5,
    },
    {
      name: 'Sophie Martin',
      role: 'Investisseuse immobilier',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
      quote:
        'Le matching intelligent est incroyable. Fini les mauvaises surprises, tous mes locataires sont compatibles!',
      rating: 5,
    },
    {
      name: 'Pierre Laurent',
      role: 'Propriétaire depuis 2 ans',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre',
      quote:
        'Interface ultra intuitive et support réactif. Je recommande à tous les propriétaires!',
      rating: 5,
    },
  ];

  const stats = [
    { value: '2,500+', label: 'Propriétés listées' },
    { value: '96%', label: 'Taux d\'occupation moyen' },
    { value: '8.2%', label: 'ROI moyen annuel' },
    { value: '< 15j', label: 'Temps de location moyen' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full font-semibold mb-6">
                  <DollarSign className="w-4 h-4" />
                  Pour les Propriétaires
                </div>
                <h1 className="text-5xl font-bold mb-6">
                  Loue plus vite, gagne plus, stresse moins
                </h1>
                <p className="text-xl text-purple-100 leading-relaxed mb-8">
                  La plateforme moderne pour gérer tes colocations. Matching intelligent, gestion
                  simplifiée, revenus optimisés.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/onboarding/owner/basic-info">
                    <Button
                      size="lg"
                      className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 text-lg px-8"
                    >
                      Lister mon bien gratuitement
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-white text-white hover:bg-white/10 text-lg px-8"
                    >
                      Voir les fonctionnalités
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-purple-200 mt-4">
                  ✓ Gratuit à l'inscription • ✓ Sans engagement • ✓ Support 24/7
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">€3,450</div>
                  <p className="text-xl text-purple-100 mb-6">Revenu moyen mensuel par propriétaire</p>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.slice(1).map((stat, index) => (
                      <div key={index} className="bg-white/10 rounded-lg p-4">
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-sm text-purple-100">{stat.label}</p>
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
                Pourquoi choisir EasyCo?
              </h2>
              <p className="text-xl text-gray-600">
                Tout ce dont tu as besoin pour gérer tes colocations comme un pro
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
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
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
                Fonctionnalités clés
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
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
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
                Ce que disent nos propriétaires
              </h2>
              <p className="text-xl text-gray-600">
                Rejoins des centaines de propriétaires satisfaits
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
                  <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Tarifs Transparents</h2>
              <p className="text-xl text-gray-600">
                Commence gratuitement, upgrade quand tu veux
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gratuit</h3>
                <p className="text-4xl font-bold text-gray-900 mb-6">
                  €0<span className="text-lg text-gray-600">/mois</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {pricing.free.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/onboarding/owner/basic-info">
                  <Button variant="outline" className="w-full" size="lg">
                    Commencer gratuitement
                  </Button>
                </Link>
              </div>

              {/* Premium Plan */}
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  Populaire
                </div>
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <p className="text-4xl font-bold mb-6">
                  €29<span className="text-lg text-purple-200">/mois</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {pricing.premium.map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                      <span className="text-white">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/onboarding/owner/basic-info">
                  <Button
                    className="w-full bg-yellow-400 text-gray-900 hover:bg-yellow-300"
                    size="lg"
                  >
                    Essayer 14 jours gratuits
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
              Prêt à optimiser tes revenus locatifs?
            </h2>
            <p className="text-xl text-gray-800 mb-8">
              Rejoins des centaines de propriétaires qui font confiance à EasyCo
            </p>
            <Link href="/onboarding/owner/basic-info">
              <Button
                size="lg"
                className="bg-gray-900 text-white hover:bg-gray-800 text-lg px-12"
              >
                Lister ma première propriété
              </Button>
            </Link>
            <p className="text-sm text-gray-700 mt-4">
              Aucune carte bancaire requise • Configuration en 5 minutes
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
