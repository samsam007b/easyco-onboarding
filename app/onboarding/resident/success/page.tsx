'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, Home, TrendingUp, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Link from 'next/link';

export default function ResidentSuccessPage() {
  const router = useRouter();
  const { t, getSection } = useLanguage();
  const resident = getSection('resident');
  const common = getSection('common');

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center p-6">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-[color:var(--easy-purple)] mb-4">
            {resident.success?.title || 'Profile Complete! 🎉'}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {resident.success?.subtitle || 'Your resident profile has been successfully created. You can now manage your coliving experience.'}
          </p>

          {/* Next Steps */}
          <div className="bg-purple-50 rounded-2xl p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-[color:var(--easy-purple)] mb-4">
              {resident.success?.nextStepsTitle || 'What\'s Next?'}
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[color:var(--easy-purple)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <p className="text-gray-700">
                  {resident.success?.step1 || 'Access your dashboard to view community updates and announcements'}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[color:var(--easy-purple)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <p className="text-gray-700">
                  {resident.success?.step2 || 'Connect with your housemates and build your community'}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[color:var(--easy-purple)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <p className="text-gray-700">
                  {resident.success?.step3 || 'Manage your profile and preferences at any time'}
                </p>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/dashboard/resident"
              className="w-full py-4 rounded-full bg-[color:var(--easy-yellow)] text-black font-semibold text-lg hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              {resident.success?.goToDashboard || 'Go to Dashboard'}
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/dashboard/my-profile"
              className="w-full py-4 rounded-full border-2 border-[color:var(--easy-purple)] text-[color:var(--easy-purple)] font-semibold text-lg hover:bg-purple-50 transition flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              {resident.success?.enhanceProfile || 'Enhance Profile'}
            </Link>

            <Link
              href="/"
              className="text-gray-600 hover:text-[color:var(--easy-purple)] transition inline-block mt-4"
            >
              {common.backToHome || 'Back to Home'}
            </Link>
          </div>
        </div>

        {/* Additional Tips */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            {resident.success?.tip || 'Tip: Keep your profile up to date to make the most of your coliving experience!'}
          </p>
        </div>
      </div>
    </main>
  );
}
