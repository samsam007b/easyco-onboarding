'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Home, ArrowRight, Plus } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { createClient } from '@/lib/auth/supabase-client';

export default function OwnerSuccess() {
  const { t, getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');
  const [hasProperty, setHasProperty] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPropertyStatus = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('has_property')
            .eq('user_id', user.id)
            .single();

          setHasProperty(profile?.has_property || false);
        }
      } catch (error) {
        console.error('Error checking property status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPropertyStatus();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[color:var(--easy-purple)] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[color:var(--easy-purple)] flex items-center justify-center">
            <Home className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[color:var(--easy-purple)]">EasyCo</h1>
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{onboarding.owner.success.title}</h2>
        <p className="text-gray-600 mb-8">
          {onboarding.owner.success.welcome}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="text-2xl font-bold text-[color:var(--easy-purple)]">{onboarding.owner.success.stat3xLabel}</div>
            <div className="text-sm text-gray-600">{onboarding.owner.success.stat3xDesc}</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="text-2xl font-bold text-yellow-600">{onboarding.owner.success.statFastLabel}</div>
            <div className="text-sm text-gray-600">{onboarding.owner.success.statFastDesc}</div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="space-y-3">
          {/* Show "List Your Property" as primary action if owner has a property */}
          {hasProperty && (
            <Link
              href="/properties/add"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              List Your Property Now
            </Link>
          )}

          <Link
            href="/home/owner"
            className="flex items-center justify-center gap-2 w-full bg-[color:var(--easy-yellow)] text-black py-4 rounded-lg font-semibold hover:opacity-90 transition shadow-md hover:shadow-lg"
          >
            {onboarding.owner.success.goToDashboard}
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/profile/enhance-owner"
            className="block w-full bg-[color:var(--easy-purple)] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition shadow-md hover:shadow-lg"
          >
            {onboarding.owner.success.enhanceProfile}
          </Link>

          <Link
            href="/"
            className="block w-full text-gray-600 py-3 rounded-lg font-medium hover:text-[color:var(--easy-purple)] transition"
          >
            {onboarding.owner.success.backToHome}
          </Link>
        </div>

        {/* Help Link */}
        <p className="mt-6 text-sm text-gray-500">
          {onboarding.owner.success.needHelp}{' '}
          <a href="mailto:support@easyco.com" className="text-[color:var(--easy-purple)] hover:underline">
            {onboarding.owner.success.contactSupport}
          </a>
        </p>
      </div>
    </main>
  );
}
