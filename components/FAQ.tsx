'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/use-language';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronDown, HelpCircle, Mail } from 'lucide-react';

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

export default function FAQ() {
  const { getSection } = useLanguage();
  const { resolvedTheme } = useTheme();
  const landing = getSection('landing');
  const faq = landing.faq;
  const isDark = resolvedTheme === 'dark';

  const getGradient = (colors: typeof ROLE_COLORS.owner) => {
    return isDark ? colors.gradientDark : colors.gradient;
  };

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = [
    {
      question: faq.question1.q,
      answer: faq.question1.a,
    },
    {
      question: faq.question2.q,
      answer: faq.question2.a,
    },
    {
      question: faq.question3.q,
      answer: faq.question3.a,
    },
    {
      question: faq.question4.q,
      answer: faq.question4.a,
    },
    {
      question: faq.question5.q,
      answer: faq.question5.a,
    },
    {
      question: faq.question6.q,
      answer: faq.question6.a,
    },
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      className="py-24 transition-colors duration-300"
      style={{
        background: isDark
          ? 'linear-gradient(to bottom, #141418, #0F0F12)'
          : 'linear-gradient(to bottom, #F9FAFB, #FFFFFF)',
      }}
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: `linear-gradient(to bottom right, ${getGradient(ROLE_COLORS.owner).start}, ${getGradient(ROLE_COLORS.owner).end})` }}
            >
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent mb-4"
            style={{ backgroundImage: `linear-gradient(to right, ${getGradient(ROLE_COLORS.owner).start}, ${getGradient(ROLE_COLORS.owner).end})` }}
          >
            {faq.title}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {faq.subtitle}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-16">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;
            const ownerGradient = getGradient(ROLE_COLORS.owner);

            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Background glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"
                  style={{ background: `linear-gradient(to bottom right, ${ownerGradient.start}15, ${ownerGradient.end}15)` }}
                />

                <div
                  className="relative rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border"
                  style={{
                    background: isDark ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
                    borderColor: `${ownerGradient.start}${isDark ? '40' : '20'}`,
                    backdropFilter: isDark ? 'blur(10px)' : 'none',
                  }}
                >
                  {/* Question */}
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full flex items-center justify-between p-6 sm:p-8 text-left transition-all duration-200"
                  >
                    <span className={`font-bold pr-8 text-lg ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                      {item.question}
                    </span>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        background: isOpen
                          ? `linear-gradient(to bottom right, ${ownerGradient.start}, ${ownerGradient.end})`
                          : `${ownerGradient.start}15`,
                        boxShadow: isOpen ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
                      }}
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-all duration-300 ${
                          isOpen ? 'transform rotate-180 text-white' : ''
                        }`}
                        style={{ color: isOpen ? 'white' : ownerGradient.start }}
                      />
                    </div>
                  </button>

                  {/* Answer */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                      <div
                        className="pt-4"
                        style={{ borderTop: `1px solid ${isDark ? '#2A2A30' : '#F3F4F6'}` }}
                      />
                      <p className={`leading-relaxed text-lg mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="relative group">
          {/* Background glow */}
          <div
            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
            style={{ background: `linear-gradient(to bottom right, ${getGradient(ROLE_COLORS.owner).start}20, ${getGradient(ROLE_COLORS.searcher).start}20)` }}
          />

          <div
            className="relative text-center p-10 sm:p-12 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border"
            style={{
              background: isDark
                ? 'linear-gradient(to bottom right, rgba(139, 111, 207, 0.1), rgba(26, 26, 31, 0.8), rgba(255, 176, 80, 0.05))'
                : `linear-gradient(to bottom right, ${ROLE_COLORS.owner.light}50, white, ${ROLE_COLORS.searcher.light}30)`,
              borderColor: `${getGradient(ROLE_COLORS.owner).start}${isDark ? '40' : '20'}`,
              backdropFilter: isDark ? 'blur(10px)' : 'none',
            }}
          >
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300"
              style={{ background: `linear-gradient(to bottom right, ${getGradient(ROLE_COLORS.owner).start}, ${getGradient(ROLE_COLORS.owner).end})` }}
            >
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3
              className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent mb-4"
              style={{ backgroundImage: `linear-gradient(to right, ${getGradient(ROLE_COLORS.owner).start}, ${getGradient(ROLE_COLORS.owner).end})` }}
            >
              {faq.contactTitle}
            </h3>
            <p className={`mb-8 text-lg max-w-md mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {faq.contactSubtitle}
            </p>
            <a
              href="mailto:hello@izzico.be"
              className="inline-block px-10 py-5 text-white font-bold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg hover:brightness-110"
              style={{ background: `linear-gradient(to right, ${getGradient(ROLE_COLORS.searcher).start}, ${getGradient(ROLE_COLORS.searcher).end})` }}
            >
              {faq.contactButton}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
