'use client';

import { useLanguage } from '@/lib/i18n/use-language';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const { getSection } = useLanguage();
  const landing = getSection('landing');
  const testimonials = landing.testimonials;

  const testimonialsData = [
    {
      name: testimonials.testimonial1.name,
      role: testimonials.testimonial1.role,
      text: testimonials.testimonial1.text,
      rating: 5,
      avatar: '👨‍💼',
    },
    {
      name: testimonials.testimonial2.name,
      role: testimonials.testimonial2.role,
      text: testimonials.testimonial2.text,
      rating: 5,
      avatar: '👩‍🎓',
    },
    {
      name: testimonials.testimonial3.name,
      role: testimonials.testimonial3.role,
      text: testimonials.testimonial3.text,
      rating: 5,
      avatar: '👨‍💻',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--easy-purple)] mb-4">
            {testimonials.title}
          </h2>
          <p className="text-gray-600 text-lg">
            {testimonials.subtitle}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-purple-50 to-yellow-50 rounded-2xl p-8 relative hover:shadow-xl transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-20">
                <Quote className="w-12 h-12 text-[color:var(--easy-purple)]" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 leading-relaxed mb-6 relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-md">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{testimonials.rating}</span>
            <span>·</span>
            <span>{testimonials.reviews}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
