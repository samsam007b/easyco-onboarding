'use client';

import { memo, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n/use-language';
import { Star, Quote } from 'lucide-react';

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

const TestimonialCard = memo(({ testimonial }: { testimonial: TestimonialData }) => (
  <div className="relative group">
    {/* Background glow on hover */}
    <div
      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10"
      style={{ background: `linear-gradient(to bottom right, ${testimonial.colors.gradient.start}15, ${testimonial.colors.gradient.end}15)` }}
    />

    <div
      className="relative bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border h-full flex flex-col"
      style={{ borderColor: `${testimonial.colors.gradient.start}20` }}
    >
      {/* Quote Icon */}
      <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote
          className="w-16 h-16"
          style={{ color: testimonial.colors.gradient.start }}
          fill="currentColor"
        />
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-6 relative z-10">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star
            key={`star-${i}`}
            className="w-6 h-6 drop-shadow-sm"
            style={{ fill: testimonial.colors.gradient.start, color: testimonial.colors.gradient.start }}
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-gray-700 leading-relaxed mb-8 relative z-10 flex-grow text-lg">
        "{testimonial.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4 relative z-10">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform group-hover:rotate-6 transition-transform duration-300"
          style={{ background: `linear-gradient(to bottom right, ${testimonial.colors.gradient.start}, ${testimonial.colors.gradient.end})` }}
        >
          {testimonial.avatar}
        </div>
        <div>
          <div
            className="font-bold text-lg bg-clip-text text-transparent"
            style={{ backgroundImage: `linear-gradient(to right, ${testimonial.colors.gradient.start}, ${testimonial.colors.gradient.end})` }}
          >
            {testimonial.name}
          </div>
          <div className="text-sm text-gray-600 font-medium">
            {testimonial.role}
          </div>
        </div>
      </div>
    </div>
  </div>
));

TestimonialCard.displayName = 'TestimonialCard';

function Testimonials() {
  const { getSection } = useLanguage();
  const landing = getSection('landing');
  const testimonials = landing.testimonials;

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
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2
            className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent mb-4"
            style={{ backgroundImage: `linear-gradient(to right, ${ROLE_COLORS.owner.gradient.start}, ${ROLE_COLORS.owner.gradient.end})` }}
          >
            {testimonials.title}
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            {testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard
              key={`testimonial-${index}`}
              testimonial={testimonial}
            />
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center">
          <div
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full shadow-md border"
            style={{
              background: `linear-gradient(to right, ${ROLE_COLORS.searcher.light}, ${ROLE_COLORS.searcher.gradient.end}20)`,
              borderColor: `${ROLE_COLORS.searcher.gradient.start}30`,
            }}
          >
            <Star
              className="w-6 h-6"
              style={{ fill: ROLE_COLORS.searcher.gradient.start, color: ROLE_COLORS.searcher.gradient.start }}
            />
            <span className="font-bold text-gray-900 text-lg">{testimonials.rating}</span>
            <span className="text-gray-400">·</span>
            <span className="text-gray-700 font-medium text-lg">{testimonials.reviews}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Memoize the entire component to prevent re-renders when parent changes
export default memo(Testimonials);
