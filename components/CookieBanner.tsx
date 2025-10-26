'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/use-language';
import { Cookie, X } from 'lucide-react';

export default function CookieBanner() {
  const { getSection } = useLanguage();
  const cookies = getSection('cookies');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted/declined cookies
    const cookieConsent = localStorage.getItem('cookie-consent');
    if (!cookieConsent) {
      // Show banner after 2 seconds delay (better UX)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-fadeIn" />

      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-slideUp">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-[color:var(--easy-purple)]" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                <h3 className="font-bold text-gray-900 text-lg">
                  {cookies.banner.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {cookies.banner.description}{' '}
                  <Link
                    href="/legal/cookies"
                    className="text-[color:var(--easy-purple)] hover:underline font-medium"
                  >
                    {cookies.banner.learnMore}
                  </Link>
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                <button
                  onClick={acceptCookies}
                  className="px-6 py-3 bg-[color:var(--easy-purple)] text-white font-semibold rounded-full hover:opacity-90 transition shadow-md whitespace-nowrap"
                >
                  {cookies.banner.accept}
                </button>
                <button
                  onClick={declineCookies}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition whitespace-nowrap"
                >
                  {cookies.banner.decline}
                </button>
              </div>

              {/* Close button (mobile) */}
              <button
                onClick={declineCookies}
                className="absolute top-4 right-4 md:hidden text-gray-400 hover:text-gray-600 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
}
