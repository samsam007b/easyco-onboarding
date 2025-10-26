'use client';

import { useLanguage } from '@/lib/i18n/use-language';
import { Home, Users, Star, CheckCircle } from 'lucide-react';

export default function StatsSection() {
  const { getSection } = useLanguage();
  const landing = getSection('landing');
  const stats = landing.stats;

  const statsData = [
    {
      icon: Home,
      value: '247',
      label: stats.properties,
      color: 'purple',
    },
    {
      icon: Users,
      value: '1,842',
      label: stats.users,
      color: 'yellow',
    },
    {
      icon: Star,
      value: '98%',
      label: stats.satisfaction,
      color: 'purple',
    },
    {
      icon: CheckCircle,
      value: '100%',
      label: stats.verified,
      color: 'yellow',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-yellow-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[color:var(--easy-purple)] mb-3">
            {stats.title}
          </h2>
          <p className="text-gray-600">
            {stats.subtitle}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            const isYellow = stat.color === 'yellow';

            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    isYellow
                      ? 'bg-yellow-100'
                      : 'bg-purple-100'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isYellow
                        ? 'text-yellow-600'
                        : 'text-[color:var(--easy-purple)]'
                    }`}
                  />
                </div>

                {/* Value */}
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${
                  isYellow
                    ? 'text-yellow-600'
                    : 'text-[color:var(--easy-purple)]'
                }`}>
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-sm md:text-base text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-700 font-medium">
              {stats.trustBadge}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
