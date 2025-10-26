'use client';

import { useLanguage } from '@/lib/i18n/use-language';
import { User, Target, Users } from 'lucide-react';

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
      color: 'purple',
    },
    {
      number: '2',
      icon: Target,
      title: howItWorks.step2.title,
      description: howItWorks.step2.description,
      color: 'yellow',
    },
    {
      number: '3',
      icon: Users,
      title: howItWorks.step3.title,
      description: howItWorks.step3.description,
      color: 'purple',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--easy-purple)] mb-4">
            {howItWorks.title}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {howItWorks.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-200 via-yellow-200 to-purple-200" />

          {steps.map((step, index) => {
            const Icon = step.icon;
            const isYellow = step.color === 'yellow';

            return (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300 h-full">
                  {/* Step Number & Icon */}
                  <div className="relative inline-block mb-6">
                    {/* Number Badge */}
                    <div
                      className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md z-10 ${
                        isYellow
                          ? 'bg-[color:var(--easy-yellow)] text-black'
                          : 'bg-[color:var(--easy-purple)]'
                      }`}
                    >
                      {step.number}
                    </div>

                    {/* Icon Circle */}
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center ${
                        isYellow
                          ? 'bg-yellow-100'
                          : 'bg-purple-100'
                      }`}
                    >
                      <Icon
                        className={`w-10 h-10 ${
                          isYellow
                            ? 'text-yellow-600'
                            : 'text-[color:var(--easy-purple)]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/select-user-type"
            className="inline-block px-8 py-4 bg-[color:var(--easy-yellow)] text-black font-semibold rounded-full hover:opacity-90 transition shadow-md hover:shadow-lg"
          >
            {howItWorks.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
