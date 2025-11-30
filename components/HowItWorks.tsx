'use client';

import { useLanguage } from '@/lib/i18n/use-language';
import { User, Target, Users } from 'lucide-react';

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

export default function HowItWorks() {
  const { getSection } = useLanguage();
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

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent mb-4"
            style={{ backgroundImage: `linear-gradient(to right, ${ROLE_COLORS.owner.gradient.start}, ${ROLE_COLORS.owner.gradient.end})` }}
          >
            {howItWorks.title}
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            {howItWorks.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Decorative connecting lines */}
          <div
            className="hidden md:block absolute top-1/4 left-1/6 right-1/6 h-1 -z-10"
            style={{ background: `linear-gradient(to right, transparent, ${ROLE_COLORS.owner.gradient.start}30, transparent)` }}
          />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const { colors } = step;

            return (
              <div key={index} className="relative group">
                {/* Background glow on hover */}
                <div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
                  style={{ background: `linear-gradient(to bottom right, ${colors.gradient.start}15, ${colors.gradient.end}15)` }}
                />

                {/* Step Card */}
                <div
                  className="relative bg-white rounded-3xl p-8 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 border h-full flex flex-col"
                  style={{ borderColor: `${colors.gradient.start}20` }}
                >
                  {/* Step Number Badge */}
                  <div className="relative inline-block mx-auto mb-6">
                    {/* Number Badge */}
                    <div
                      className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl z-10"
                      style={{ background: `linear-gradient(to bottom right, ${colors.gradient.start}, ${colors.gradient.end})` }}
                    >
                      {step.number}
                    </div>

                    {/* Icon Circle */}
                    <div
                      className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300"
                      style={{ background: `linear-gradient(to bottom right, ${colors.gradient.start}, ${colors.gradient.end})` }}
                    >
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3
                    className="text-2xl font-bold bg-clip-text text-transparent mb-4"
                    style={{ backgroundImage: `linear-gradient(to right, ${colors.gradient.start}, ${colors.gradient.end})` }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg flex-grow">
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
            style={{ background: `linear-gradient(to right, ${ROLE_COLORS.searcher.gradient.start}, ${ROLE_COLORS.searcher.gradient.end})` }}
          >
            {howItWorks.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
