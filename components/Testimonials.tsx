'use client';

import { memo, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n/use-language';
import { useTheme } from '@/contexts/ThemeContext';
import { Star, Quote } from 'lucide-react';

// Couleurs extraites du logo gradient pour chaque rôle
const ROLE_COLORS = {
  owner: {
    gradient: { start: '#7B5FB8', end: '#C98B9E' },
    gradientDark: { start: '#8B6FCF', end: '#D9A0B3' },
    light: '#F3F1FF',
  },
  searcher: {
    gradient: { start: '#FFA040', end: '#FFD080' },
    gradientDark: { start: '#FFB050', end: '#FFD890' },
    light: '#FFF9E6',
  },
};

// ============================================================================
// PERFORMANCE OPTIMIZATION: Memoized Testimonial Card Component
// ============================================================================

interface TestimonialData {
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
  colors: typeof ROLE_COLORS.owner;
}

interface TestimonialCardProps {
  testimonial: TestimonialData;
  isDark: boolean;
}

const TestimonialCard = memo(({ testimonial, isDark }: TestimonialCardProps) => {
  const gradient = isDark ? testimonial.colors.gradientDark : testimonial.colors.gradient;

  return (
    <div className="relative group">
      {/* Background glow on hover */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
        style={{ background: `linear-gradient(to bottom right, ${gradient.start}15, ${gradient.end}15)` }}
      />

      <div
        className="relative rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border h-full flex flex-col"
        style={{
          background: isDark ? 'rgba(26, 26, 31, 0.8)' : '#FFFFFF',
          borderColor: `${gradient.start}${isDark ? '40' : '20'}`,
          backdropFilter: isDark ? 'blur(10px)' : 'none',
        }}
      >
        {/* Quote Icon */}
        <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Quote
            className="w-16 h-16"
            style={{ color: gradient.start }}
            fill="currentColor"
          />
        </div>

        {/* Stars */}
        <div className="flex gap-1 mb-6 relative z-10">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star
              key={`star-${i}`}
              className="w-6 h-6 drop-shadow-sm"
              style={{ fill: gradient.start, color: gradient.start }}
            />
          ))}
        </div>

        {/* Text */}
        <p className={`leading-relaxed mb-8 relative z-10 flex-grow text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          "{testimonial.text}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-4 relative z-10">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform group-hover:rotate-6 transition-transform duration-300"
            style={{ background: `linear-gradient(to bottom right, ${gradient.start}, ${gradient.end})` }}
          >
            {testimonial.avatar}
          </div>
          <div>
            <div
              className="font-bold text-lg bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(to right, ${gradient.start}, ${gradient.end})` }}
            >
              {testimonial.name}
            </div>
            <div className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {testimonial.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

TestimonialCard.displayName = 'TestimonialCard';

function Testimonials() {
  const { getSection } = useLanguage();
  const { resolvedTheme } = useTheme();
  const landing = getSection('landing');
  const testimonials = landing.testimonials;
  const isDark = resolvedTheme === 'dark';

  const getGradient = (colors: typeof ROLE_COLORS.owner) => {
    return isDark ? colors.gradientDark : colors.gradient;
  };

  // Memoize testimonials data to prevent recreation on every render
  const testimonialsData = useMemo(() => [
    {
      name: testimonials.testimonial1.name,
      role: testimonials.testimonial1.role,
      text: testimonials.testimonial1.text,
      rating: 5,
      avatar: '👨‍💼',
      colors: ROLE_COLORS.owner,
    },
    {
      name: testimonials.testimonial2.name,
      role: testimonials.testimonial2.role,
      text: testimonials.testimonial2.text,
      rating: 5,
      avatar: '👩‍🎓',
      colors: ROLE_COLORS.searcher,
    },
    {
      name: testimonials.testimonial3.name,
      role: testimonials.testimonial3.role,
      text: testimonials.testimonial3.text,
      rating: 5,
      avatar: '👨‍💻',
      colors: ROLE_COLORS.owner,
    },
  ], [testimonials]);

  return (
    <section
      className="py-24 transition-colors duration-300"
      style={{
        background: isDark
          ? 'linear-gradient(to bottom, #0F0F12, #141418)'
          : 'linear-gradient(to bottom, #FFFFFF, #F9FAFB)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent mb-4"
            style={{ backgroundImage: `linear-gradient(to right, ${getGradient(ROLE_COLORS.owner).start}, ${getGradient(ROLE_COLORS.owner).end})` }}
          >
            {testimonials.title}
          </h2>
          <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard
              key={`testimonial-${index}`}
              testimonial={testimonial}
              isDark={isDark}
            />
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center">
          <div
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full shadow-md border"
            style={{
              background: isDark
                ? `linear-gradient(to right, rgba(255, 176, 80, 0.1), rgba(255, 216, 144, 0.1))`
                : `linear-gradient(to right, ${ROLE_COLORS.searcher.light}, ${ROLE_COLORS.searcher.gradient.end}20)`,
              borderColor: `${getGradient(ROLE_COLORS.searcher).start}30`,
            }}
          >
            <Star
              className="w-6 h-6"
              style={{ fill: getGradient(ROLE_COLORS.searcher).start, color: getGradient(ROLE_COLORS.searcher).start }}
            />
            <span className={`font-bold text-lg ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{testimonials.rating}</span>
            <span className="text-gray-400">·</span>
            <span className={`font-medium text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{testimonials.reviews}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Memoize the entire component to prevent re-renders when parent changes
export default memo(Testimonials);
