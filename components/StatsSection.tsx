'use client';

import { useLanguage } from '@/lib/i18n/use-language';
import { useTheme } from '@/contexts/ThemeContext';
import { Home, Users, Star, CheckCircle } from 'lucide-react';

// Couleurs du design system - couleurs dominantes exactes par rôle
const ROLE_COLORS = {
  owner: {
    gradient: { start: '#ad5684', end: '#ad5684' },
    gradientDark: { start: '#ad5684', end: '#ad5684' },
    light: '#F3F1FF',
  },
  searcher: {
    gradient: { start: '#ff9811', end: '#ff9811' },
    gradientDark: { start: '#ff9811', end: '#ff9811' },
    light: '#FFF9E6',
  },
};

export default function StatsSection() {
  const { getSection } = useLanguage();
  const { resolvedTheme } = useTheme();
  const landing = getSection('landing');
  const stats = landing.stats;

  const getGradient = (colors: typeof ROLE_COLORS.owner) => {
    return resolvedTheme === 'dark' ? colors.gradientDark : colors.gradient;
  };

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
    <section
      className="py-20 transition-colors duration-300"
      style={{
        background: resolvedTheme === 'dark'
          ? 'linear-gradient(to bottom, #0F0F12 0%, #141418 50%, #0F0F12 100%)'
          : 'linear-gradient(to bottom, #FFFFFF 0%, rgba(249, 250, 251, 0.3) 50%, #FFFFFF 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent mb-4"
            style={{ backgroundImage: `linear-gradient(to right, ${getGradient(ROLE_COLORS.owner).start}, ${getGradient(ROLE_COLORS.owner).end})` }}
          >
            {stats.title}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {stats.subtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            const { colors } = stat;
            const gradient = getGradient(colors);

            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                  style={{ background: `linear-gradient(to bottom right, ${gradient.start}15, ${gradient.end}15)` }}
                />

                {/* Stat Card */}
                <div
                  className="relative rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border"
                  style={{
                    background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                    borderColor: `${gradient.start}${resolvedTheme === 'dark' ? '40' : '20'}`,
                    backdropFilter: resolvedTheme === 'dark' ? 'blur(10px)' : 'none',
                  }}
                >
                  {/* Icon */}
                  <div
                    className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300"
                    style={{ background: `linear-gradient(to bottom right, ${gradient.start}, ${gradient.end})` }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Value */}
                  <div
                    className="text-4xl md:text-5xl font-bold mb-3 bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(to bottom right, ${gradient.start}, ${gradient.end})` }}
                  >
                    {stat.value}
                  </div>

                  {/* Label */}
                  <div className={`text-sm md:text-base font-medium leading-snug ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full shadow-md border"
            style={{
              background: resolvedTheme === 'dark'
                ? 'linear-gradient(to right, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))'
                : 'linear-gradient(to right, #F0FDF4, #ECFDF5)',
              borderColor: resolvedTheme === 'dark' ? 'rgba(34, 197, 94, 0.3)' : '#BBF7D0',
            }}
          >
            <CheckCircle className={resolvedTheme === 'dark' ? 'w-6 h-6 text-green-400' : 'w-6 h-6 text-green-500'} />
            <span className={`font-semibold text-lg ${resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
              {stats.trustBadge}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
