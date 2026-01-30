'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/use-language';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronDown, HelpCircle, Mail } from 'lucide-react';
import { type Role } from './landing/RoleSwitcher';

interface FAQProps {
  activeRole: Role;
}

// Couleurs sémantiques UI
const SEMANTIC_COLORS = {
  // Help/Questions - Lavender (aide, premium)
  help: { bg: '#9B7BD9', light: '#F5F3FF' },
  // Contact/Mail - Dusty Rose (relationnel)
  contact: { bg: '#D08090', light: '#FDF2F4' },
};

// Couleurs de fond par rôle (tons très légers)
const ROLE_BG_COLORS = {
  searcher: {
    card: '#FFFBEB', // searcher-50
    cardDark: 'rgba(255, 160, 0, 0.08)',
    blob: '#FEF3C7', // searcher-100
    blobDark: 'rgba(255, 160, 0, 0.15)',
    text: '#A16300', // searcher-700 (accessible)
    border: 'rgba(255, 160, 0, 0.15)',
    gradient: 'linear-gradient(135deg, #ffa000 0%, #e05747 100%)',
    primary: '#ffa000',
  },
  resident: {
    card: '#FEF2EE', // resident-50
    cardDark: 'rgba(224, 87, 71, 0.08)',
    blob: '#FDE0D6', // resident-100
    blobDark: 'rgba(224, 87, 71, 0.15)',
    text: '#9A362C', // resident-700 (accessible)
    border: 'rgba(224, 87, 71, 0.15)',
    gradient: 'linear-gradient(135deg, #e05747 0%, #ff7c10 100%)',
    primary: '#e05747',
  },
  owner: {
    card: '#F8F0F7', // owner-50
    cardDark: 'rgba(156, 86, 152, 0.08)',
    blob: '#F0E0EE', // owner-100
    blobDark: 'rgba(156, 86, 152, 0.15)',
    text: '#633668', // owner-700 (accessible)
    border: 'rgba(156, 86, 152, 0.15)',
    gradient: 'linear-gradient(135deg, #9c5698 0%, #c85570 100%)',
    primary: '#9c5698',
  },
};

const contentVariants = {
  enter: { opacity: 0, y: 20 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function FAQ({ activeRole }: FAQProps) {
  const { getSection } = useLanguage();
  const { resolvedTheme } = useTheme();
  const landing = getSection('landing');
  const faq = landing.faq;
  const isDark = resolvedTheme === 'dark';
  const roleColors = ROLE_BG_COLORS[activeRole];

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
      className="py-24 transition-colors duration-500"
      style={{
        background: isDark
          ? 'linear-gradient(to bottom, #141418, #0F0F12)'
          : 'linear-gradient(to bottom, #F9FAFB, #FFFFFF)',
      }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            variants={contentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
                  style={{ background: SEMANTIC_COLORS.help.bg }}
                >
                  <HelpCircle className="w-7 h-7 text-white" />
                </div>
              </div>
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: isDark ? '#F5F5F7' : roleColors.text }}
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

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    className="group relative"
                  >
                    {/* FAQ Item Card with V3-fun design */}
                    <div
                      className="relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg"
                      style={{
                        background: isDark ? roleColors.cardDark : roleColors.card,
                        border: `1px solid ${isDark ? roleColors.border : 'transparent'}`,
                      }}
                    >
                      {/* Decorative blob - top right (only when open) */}
                      {isOpen && (
                        <div
                          className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-50"
                          style={{
                            background: isDark ? roleColors.blobDark : roleColors.blob,
                          }}
                        />
                      )}

                      {/* Question */}
                      <button
                        onClick={() => toggleQuestion(index)}
                        className="relative z-10 w-full flex items-center justify-between p-6 text-left transition-all duration-200"
                      >
                        <span
                          className="font-bold pr-6 text-lg"
                          style={{ color: isDark ? '#F5F5F7' : roleColors.text }}
                        >
                          {item.question}
                        </span>
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                          style={{
                            background: isOpen
                              ? roleColors.gradient
                              : isDark ? roleColors.blobDark : roleColors.blob,
                            boxShadow: isOpen ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none',
                          }}
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-all duration-300 ${
                              isOpen ? 'transform rotate-180' : ''
                            }`}
                            style={{ color: isOpen ? 'white' : roleColors.text }}
                          />
                        </div>
                      </button>

                      {/* Answer */}
                      <div
                        className={`relative z-10 overflow-hidden transition-all duration-300 ${
                          isOpen ? 'max-h-96' : 'max-h-0'
                        }`}
                      >
                        <div className="px-6 pb-6">
                          <div
                            className="pt-4"
                            style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}` }}
                          />
                          <p className={`leading-relaxed text-base mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Contact CTA with V3-fun design */}
            <div className="relative group">
              <div
                className="relative overflow-hidden text-center p-10 sm:p-12 rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{
                  background: isDark ? roleColors.cardDark : roleColors.card,
                  border: `1px solid ${isDark ? roleColors.border : 'transparent'}`,
                }}
              >
                {/* Decorative blob - top right */}
                <div
                  className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-60 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: isDark ? roleColors.blobDark : roleColors.blob,
                  }}
                />

                {/* Decorative blob - bottom left */}
                <div
                  className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-40"
                  style={{
                    background: isDark ? roleColors.blobDark : roleColors.blob,
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  <div
                    className="w-14 h-14 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-md transform group-hover:rotate-3 transition-transform duration-300"
                    style={{ background: SEMANTIC_COLORS.contact.bg }}
                  >
                    <Mail className="w-7 h-7 text-white" />
                  </div>
                  <h3
                    className="text-2xl sm:text-3xl font-bold mb-4"
                    style={{ color: isDark ? '#F5F5F7' : roleColors.text }}
                  >
                    {faq.contactTitle}
                  </h3>
                  <p className={`mb-8 text-lg max-w-md mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {faq.contactSubtitle}
                  </p>
                  {/* CTA - gradient réservé au CTA principal */}
                  <a
                    href="mailto:hello@izzico.be"
                    className="inline-block px-10 py-5 text-white font-bold rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg hover:brightness-110"
                    style={{ background: roleColors.gradient }}
                  >
                    {faq.contactButton}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
