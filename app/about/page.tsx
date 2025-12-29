'use client';

import Link from 'next/link';
import Image from 'next/image';
import ModernPublicHeader from '@/components/layout/ModernPublicHeader';
import Footer from '@/components/layout/Footer';
import { Target, Users, Shield, Zap, Heart, TrendingUp, Award, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Sécurité & Confiance',
      description: 'Vérification d\'identité et annonces contrôlées pour une expérience sûre et fiable.',
    },
    {
      icon: Heart,
      title: 'Communauté',
      description: 'Créer des connexions authentiques entre colocataires compatibles.',
    },
    {
      icon: Zap,
      title: 'Simplicité',
      description: 'Une plateforme intuitive qui simplifie chaque étape de ta recherche.',
    },
    {
      icon: TrendingUp,
      title: 'Innovation',
      description: 'Algorithme de matching intelligent pour trouver ta coloc idéale.',
    },
  ];

  const team = [
    {
      name: 'Marie Dubois',
      role: 'CEO & Co-fondatrice',
      bio: 'Passionnée par le logement partagé et l\'innovation sociale.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marie',
    },
    {
      name: 'Thomas Laurent',
      role: 'CTO & Co-fondateur',
      bio: 'Expert en IA et développement web, ancien de Facebook.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas',
    },
    {
      name: 'Sophie Chen',
      role: 'Head of Product',
      bio: 'Designer UX avec 8 ans d\'expérience chez Airbnb.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    },
    {
      name: 'Lucas Martin',
      role: 'Head of Growth',
      bio: 'Spécialiste marketing digital et growth hacking.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Utilisateurs actifs' },
    { value: '2,500+', label: 'Colocations créées' },
    { value: '95%', label: 'Taux de satisfaction' },
    { value: '24/7', label: 'Support disponible' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <ModernPublicHeader />

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-purple-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              À Propos d'<span className="text-purple-600">Izzico</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Nous révolutionnons la recherche de colocation à Bruxelles avec une plateforme moderne,
              sécurisée et intelligente qui connecte les bonnes personnes au bon moment.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Rejoins-nous gratuitement
                </Button>
              </Link>
              <Link href="/properties/browse">
                <Button size="lg" variant="outline">
                  Explorer les annonces
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
                  Notre Mission
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">
                  Simplifier la vie en colocation
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Chercher une colocation peut être stressant, chronophage et frustrant. Nous avons créé
                  Izzico pour transformer cette expérience en quelque chose de simple, rapide et même
                  agréable.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Notre algorithme de matching intelligent analyse tes préférences, ton style de vie et
                  ta personnalité pour te connecter avec des colocataires vraiment compatibles.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-100 to-yellow-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Users className="w-16 h-16 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">
                    Des milliers de matchs réussis
                  </p>
                  <p className="text-gray-600">
                    Chaque jour, nous aidons des personnes à trouver leur coloc idéale
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
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
              <p className="text-xl text-gray-600">
                Ce qui guide chacune de nos décisions
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Izzico en Chiffres</h2>
              <p className="text-xl text-purple-100">
                Notre impact sur la communauté
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-5xl font-bold mb-2">{stat.value}</p>
                  <p className="text-purple-100">{stat.label}</p>
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
                Notre Équipe
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Rencontre l'équipe derrière Izzico
              </h2>
              <p className="text-xl text-gray-600">
                Des passionnés qui travaillent chaque jour pour améliorer ton expérience
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-purple-300 transition text-center"
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
                  <p className="text-sm text-purple-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Notre Histoire</h2>
              <p className="text-xl text-gray-600">
                Comment Izzico est né
              </p>
            </div>
            <div className="prose prose-lg max-w-none">
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Tout a commencé en 2023 quand Marie et Thomas, deux amis de longue date, ont partagé
                  leurs frustrations respectives concernant la recherche de colocation à Bruxelles. Entre
                  les annonces douteuses, les incompatibilités de personnalité et les processus archaïques,
                  ils ont réalisé qu'il fallait une solution moderne.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Forts de leur expérience respective dans la tech et le design, ils ont décidé de créer
                  la plateforme qu'ils auraient rêvé d'avoir : une solution qui utilise l'intelligence
                  artificielle pour matcher les bonnes personnes, qui vérifie les identités pour plus de
                  sécurité, et qui rend le processus aussi simple que possible.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Aujourd'hui, Izzico aide des milliers de personnes à trouver leur colocation idéale
                  chaque mois. Notre équipe grandit, notre technologie s'améliore, mais notre mission
                  reste la même : simplifier la vie en colocation pour tous.
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
              Prêt à rejoindre l'aventure?
            </h2>
            <p className="text-xl text-gray-800 mb-8">
              Inscris-toi gratuitement et trouve ta colocation idéale dès aujourd'hui
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-gray-900 text-white hover:bg-gray-800 text-lg px-8"
                >
                  Créer mon compte gratuit
                </Button>
              </Link>
              <Link href="/properties/browse">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white text-lg px-8"
                >
                  Explorer les annonces
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
