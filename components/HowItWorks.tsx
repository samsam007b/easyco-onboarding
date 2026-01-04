'use client';

import { useLanguage } from '@/lib/i18n/use-language';
import { useTheme } from '@/contexts/ThemeContext';
import { User, Target, Users } from 'lucide-react';

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

export default function HowItWorks() {
  const { getSection } = useLanguage();
  const { resolvedTheme } = useTheme();
  const landing = getSection('landing');
  const howItWorks = landing.howItWorks;

  const steps = [
    {
      number: '1',
      icon: User,
      title: howItWorks.step1.title,
      description: howItWorks.step1.description,
      colors: ROLE_COLORS.owner,
    },
    {
      number: '2',
      icon: Target,
      title: howItWorks.step2.title,
      description: howItWorks.step2.description,
      colors: ROLE_COLORS.searcher,
    },
    {
      number: '3',
      icon: Users,
      title: howItWorks.step3.title,
      description: howItWorks.step3.description,
      colors: ROLE_COLORS.owner,
    },
  ];

  const getGradient = (colors: typeof ROLE_COLORS.owner) => {
    return resolvedTheme === 'dark' ? colors.gradientDark : colors.gradient;
  };

  return (
    <section
      className="py-24 transition-colors duration-300"
      style={{
        background: resolvedTheme === 'dark'
          ? 'linear-gradient(to bottom, #141418, #0F0F12)'
          : 'linear-gradient(to bottom, #F9FAFB, #FFFFFF)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent mb-4"
            style={{ backgroundImage: `linear-gradient(to right, ${getGradient(ROLE_COLORS.owner).start}, ${getGradient(ROLE_COLORS.owner).end})` }}
          >
            {howItWorks.title}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {howItWorks.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Decorative connecting lines */}
          <div
            className="hidden md:block absolute top-1/4 left-1/6 right-1/6 h-1 -z-10"
            style={{ background: `linear-gradient(to right, transparent, ${getGradient(ROLE_COLORS.owner).start}30, transparent)` }}
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const { colors } = step;
            const gradient = getGradient(colors);

            return (
              <div key={index} className="relative group">
                {/* Background glow on hover */}
                <div
                  className="absolute inset-0 superellipse-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
                  style={{ background: `linear-gradient(to bottom right, ${gradient.start}15, ${gradient.end}15)` }}
                />

                {/* Step Card */}
                <div
                  className="relative superellipse-3xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 border h-full flex flex-col"
                  style={{
                    background: resolvedTheme === 'dark' ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                    borderColor: `${gradient.start}${resolvedTheme === 'dark' ? '40' : '20'}`,
                    backdropFilter: resolvedTheme === 'dark' ? 'blur(10px)' : 'none',
                  }}
                >
                  {/* Step Number Badge */}
                  <div className="relative inline-block mx-auto mb-6">
                    {/* Number Badge */}
                    <div
                      className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl z-10"
                      style={{ background: `linear-gradient(to bottom right, ${gradient.start}, ${gradient.end})` }}
                    >
                      {step.number}
                    </div>

                    {/* Icon Circle */}
                    <div
                      className="w-24 h-24 superellipse-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300"
                      style={{ background: `linear-gradient(to bottom right, ${gradient.start}, ${gradient.end})` }}
                    >
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3
                    className="text-2xl font-bold bg-clip-text text-transparent mb-4"
                    style={{ backgroundImage: `linear-gradient(to right, ${gradient.start}, ${gradient.end})` }}
                  >
                    {step.title}
                  </h3>
                  <p className={`leading-relaxed text-lg flex-grow ${resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/signup"
            className="inline-block px-10 py-5 text-white font-bold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg hover:brightness-110"
            style={{ background: `linear-gradient(to right, ${getGradient(ROLE_COLORS.searcher).start}, ${getGradient(ROLE_COLORS.searcher).end})` }}
          >
            {howItWorks.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
