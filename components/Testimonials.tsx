'use client';

import { memo, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n/use-language';
import { Star, Quote } from 'lucide-react';

// ============================================================================
// PERFORMANCE OPTIMIZATION: Memoized Testimonial Card Component
// ============================================================================
// Prevents unnecessary re-renders when parent re-renders
// ============================================================================

interface TestimonialData {
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
  gradient: string;
  bgGradient: string;
}

const TestimonialCard = memo(({ testimonial, index }: { testimonial: TestimonialData; index: number }) => (
  <div className="relative group">
    {/* Background glow on hover */}
    <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.bgGradient} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10`}></div>

    <div className="relative bg-white rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 group-hover:border-purple-200 h-full flex flex-col">
      {/* Quote Icon */}
      <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote className={`w-16 h-16 bg-gradient-to-br ${testimonial.gradient} bg-clip-text text-transparent`} fill="currentColor" />
      </div>

      {/* Stars */}
      <div className="flex gap-1 mb-6 relative z-10">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star
            key={`star-${i}`}
            className="w-6 h-6 fill-yellow-400 text-yellow-400 drop-shadow-sm"
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-gray-700 leading-relaxed mb-8 relative z-10 flex-grow text-lg">
        "{testimonial.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-3xl shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
          {testimonial.avatar}
        </div>
        <div>
          <div className={`font-bold text-lg bg-gradient-to-r ${testimonial.gradient} bg-clip-text text-transparent`}>
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
      gradient: 'from-purple-400 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
    },
    {
      name: testimonials.testimonial2.name,
      role: testimonials.testimonial2.role,
      text: testimonials.testimonial2.text,
      rating: 5,
      avatar: '👩‍🎓',
      gradient: 'from-yellow-400 to-yellow-600',
      bgGradient: 'from-yellow-50 to-yellow-100',
    },
    {
      name: testimonials.testimonial3.name,
      role: testimonials.testimonial3.role,
      text: testimonials.testimonial3.text,
      rating: 5,
      avatar: '👨‍💻',
      gradient: 'from-purple-400 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
    },
  ], [testimonials]);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-4">
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
              index={index}
            />
          ))}
        </div>

        {/* Trust Badge */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-50 to-amber-50 px-8 py-4 rounded-full shadow-md border border-yellow-200">
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
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
