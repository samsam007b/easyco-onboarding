'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/use-language';
import { ChevronDown, HelpCircle, Mail } from 'lucide-react';

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

export default function FAQ() {
  const { getSection } = useLanguage();
  const landing = getSection('landing');
  const faq = landing.faq;

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
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center mb-6">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: `linear-gradient(to bottom right, ${ROLE_COLORS.owner.gradient.start}, ${ROLE_COLORS.owner.gradient.end})` }}
            >
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent mb-4"
            style={{ backgroundImage: `linear-gradient(to right, ${ROLE_COLORS.owner.gradient.start}, ${ROLE_COLORS.owner.gradient.end})` }}
          >
            {faq.title}
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            {faq.subtitle}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-16">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="group relative"
              >
                {/* Background glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10"
                  style={{ background: `linear-gradient(to bottom right, ${ROLE_COLORS.owner.gradient.start}15, ${ROLE_COLORS.owner.gradient.end}15)` }}
                />

                <div
                  className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border"
                  style={{ borderColor: `${ROLE_COLORS.owner.gradient.start}20` }}
                >
                  {/* Question */}
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full flex items-center justify-between p-6 sm:p-8 text-left transition-all duration-200"
                    style={{ ['--hover-bg' as string]: `${ROLE_COLORS.owner.gradient.start}08` }}
                  >
                    <span className="font-bold text-gray-900 pr-8 text-lg">
                      {item.question}
                    </span>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        background: isOpen
                          ? `linear-gradient(to bottom right, ${ROLE_COLORS.owner.gradient.start}, ${ROLE_COLORS.owner.gradient.end})`
                          : `${ROLE_COLORS.owner.gradient.start}15`,
                        boxShadow: isOpen ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
                      }}
                    >
                      <ChevronDown
                        className={`w-5 h-5 transition-all duration-300 ${
                          isOpen ? 'transform rotate-180 text-white' : ''
                        }`}
                        style={{ color: isOpen ? 'white' : ROLE_COLORS.owner.gradient.start }}
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
                      <div className="pt-4 border-t border-gray-100"></div>
                      <p className="text-gray-600 leading-relaxed text-lg mt-4">
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
            style={{ background: `linear-gradient(to bottom right, ${ROLE_COLORS.owner.gradient.start}20, ${ROLE_COLORS.searcher.gradient.start}20)` }}
          />

          <div
            className="relative text-center p-10 sm:p-12 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border"
            style={{
              background: `linear-gradient(to bottom right, ${ROLE_COLORS.owner.light}50, white, ${ROLE_COLORS.searcher.light}30)`,
              borderColor: `${ROLE_COLORS.owner.gradient.start}20`,
            }}
          >
            <div
              className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300"
              style={{ background: `linear-gradient(to bottom right, ${ROLE_COLORS.owner.gradient.start}, ${ROLE_COLORS.owner.gradient.end})` }}
            >
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3
              className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent mb-4"
              style={{ backgroundImage: `linear-gradient(to right, ${ROLE_COLORS.owner.gradient.start}, ${ROLE_COLORS.owner.gradient.end})` }}
            >
              {faq.contactTitle}
            </h3>
            <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">
              {faq.contactSubtitle}
            </p>
            <a
              href="mailto:hello@easyco.be"
              className="inline-block px-10 py-5 text-white font-bold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg hover:brightness-110"
              style={{ background: `linear-gradient(to right, ${ROLE_COLORS.searcher.gradient.start}, ${ROLE_COLORS.searcher.gradient.end})` }}
            >
              {faq.contactButton}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
