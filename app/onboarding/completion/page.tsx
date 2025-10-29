'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Home, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function OnboardingCompletionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getSection } = useLanguage();
  const common = getSection('common');
  const [userType, setUserType] = useState<'searcher' | 'owner' | 'resident' | null>(null);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyCompletion = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      // Force refresh to get latest data
      await supabase.auth.refreshSession();

      const { data: userData } = await supabase
        .from('users')
        .select('user_type, full_name, onboarding_completed')
        .eq('id', user.id)
        .single();

      if (!userData?.onboarding_completed) {
        // If not completed, redirect back to onboarding
        router.push(`/onboarding/${userData?.user_type}/basic-info`);
        return;
      }

      setUserType(userData.user_type as 'searcher' | 'owner' | 'resident');
      setUserName(userData.full_name || 'User');
      setIsLoading(false);
    };

    verifyCompletion();
  }, [router]);

  const handleGoHome = () => {
    if (!userType) return;
    router.push(`/home/${userType}`);
  };

  const handleEnhanceProfile = () => {
    if (!userType) return;

    // Redirect to appropriate enhance profile page
    if (userType === 'searcher') {
      router.push('/profile/enhance');
    } else if (userType === 'owner') {
      router.push('/profile/enhance-owner');
    } else if (userType === 'resident') {
      router.push('/profile/enhance-resident/personality');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A148C]"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center p-6">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-[#4A148C] to-purple-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFD600] rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#4A148C]" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl sm:text-4xl font-bold text-[#4A148C] mb-3">
            🎉 Félicitations, {userName}!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Ton profil de base est complet. Que veux-tu faire maintenant ?
          </p>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>

          {/* Choice Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Go to Home */}
            <button
              onClick={handleGoHome}
              className="group relative bg-gradient-to-br from-[#4A148C] to-purple-600 rounded-2xl p-8 text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-4 right-4">
                <Home className="w-6 h-6 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="text-left">
                <h3 className="text-xl font-bold mb-2">
                  Aller à l'Accueil
                </h3>
                <p className="text-sm text-purple-100 mb-4">
                  Commencer à explorer {userType === 'searcher' ? 'les propriétés et les colocataires' : userType === 'owner' ? 'tes propriétés et candidats' : 'ta communauté'}
                </p>

                <div className="flex items-center text-[#FFD600] font-semibold">
                  <span>Continuer</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>

            {/* Enhance Profile */}
            <button
              onClick={handleEnhanceProfile}
              className="group relative bg-gradient-to-br from-[#FFD600] to-yellow-400 rounded-2xl p-8 text-[#4A148C] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute top-4 right-4">
                <Sparkles className="w-6 h-6 opacity-50 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
              </div>

              <div className="text-left">
                <h3 className="text-xl font-bold mb-2">
                  Enrichir Mon Profil
                </h3>
                <p className="text-sm text-purple-900 mb-4">
                  Ajouter plus d'informations pour améliorer ton matching et ta visibilité
                </p>

                <div className="flex items-center font-semibold">
                  <span>Enrichir maintenant</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>

          {/* Info Message */}
          <div className="bg-purple-50 rounded-xl p-4 text-sm text-gray-600">
            <p>
              💡 <strong>Conseil :</strong> Tu peux toujours enrichir ton profil plus tard depuis ton dashboard.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
