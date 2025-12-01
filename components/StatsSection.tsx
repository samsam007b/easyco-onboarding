'use client';

import { useLanguage } from '@/lib/i18n/use-language';
import { Home, Users, Star, CheckCircle } from 'lucide-react';

// Couleurs extraites du logo gradient pour chaque rôle
const ROLE_COLORS = {
  owner: {
    gradient: { start: '#7B5FB8', end: '#C98B9E' },
    light: '#F3F1FF',
  },
  searcher: {
    gradient: { start: '#FFA040', end: '#FFD080' },
    light: '#FFF9E6',
  },
};

export default function StatsSection() {
  const { getSection } = useLanguage();
  const landing = getSection('landing');
  const stats = landing.stats;

  const statsData = [
    {
      icon: Home,
      value: '247',
      label: stats.properties,
      colors: ROLE_COLORS.owner,
    },
    {
      icon: Users,
      value: '1,842',
      label: stats.users,
      colors: ROLE_COLORS.searcher,
    },
    {
      icon: Star,
      value: '98%',
      label: stats.satisfaction,
      colors: ROLE_COLORS.owner,
    },
    {
      icon: CheckCircle,
      value: '100%',
      label: stats.verified,
      colors: ROLE_COLORS.searcher,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50/30 to-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent mb-4"
            style={{ backgroundImage: `linear-gradient(to right, ${ROLE_COLORS.owner.gradient.start}, ${ROLE_COLORS.owner.gradient.end})` }}
          >
            {stats.title}
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            {stats.subtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            const { colors } = stat;

            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                  style={{ background: `linear-gradient(to bottom right, ${colors.gradient.start}15, ${colors.gradient.end}15)` }}
                />

                {/* Stat Card */}
                <div
                  className="relative bg-white rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border"
                  style={{ borderColor: `${colors.gradient.start}20` }}
                >
                  {/* Icon */}
                  <div
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300"
                    style={{ background: `linear-gradient(to bottom right, ${colors.gradient.start}, ${colors.gradient.end})` }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Value */}
                  <div
                    className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(to bottom right, ${colors.gradient.start}, ${colors.gradient.end})` }}
                  >
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className="text-sm md:text-base text-gray-600 font-medium leading-snug">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-4 rounded-full shadow-md border border-green-200">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="text-gray-800 font-semibold text-lg">
              {stats.trustBadge}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
