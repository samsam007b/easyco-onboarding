'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/use-language';
import { ChevronDown } from 'lucide-react';

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
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--easy-purple)] mb-4">
            {faq.title}
          </h2>
          <p className="text-gray-600 text-lg">
            {faq.subtitle}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Question */}
                <button
                  onClick={() => toggleQuestion(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-8">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[color:var(--easy-purple)] flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 bg-gradient-to-br from-purple-50 to-yellow-50 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {faq.contactTitle}
          </h3>
          <p className="text-gray-600 mb-6">
            {faq.contactSubtitle}
          </p>
          <a
            href="mailto:hello@easyco.be"
            className="inline-block px-8 py-3 bg-[color:var(--easy-purple)] text-white font-semibold rounded-full hover:opacity-90 transition shadow-md"
          >
            {faq.contactButton}
          </a>
        </div>
      </div>
    </section>
  );
}
