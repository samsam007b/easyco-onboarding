'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Search, Home as HomeIcon, Key, ArrowRight, Settings, LogOut } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useRole } from '@/lib/role/role-context';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function WelcomePage() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const welcome = getSection('welcome');
  const { setActiveRole } = useRole();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser();

      if (error || !authUser) {
        router.push('/auth');
        return;
      }

      // Get user profile data including user_type and onboarding status
      const { data: userData } = await supabase
        .from('users')
        .select('full_name, email, user_type, onboarding_completed')
        .eq('id', authUser.id)
        .single();

      // If user already has a role configured and completed onboarding, redirect to their dashboard
      if (userData?.user_type && userData?.onboarding_completed) {
        setActiveRole(userData.user_type as 'searcher' | 'owner' | 'resident');
        router.push(`/dashboard/${userData.user_type}`);
        return;
      }

      // If user has a role but hasn't completed onboarding, redirect to onboarding
      if (userData?.user_type && !userData?.onboarding_completed) {
        setActiveRole(userData.user_type as 'searcher' | 'owner' | 'resident');
        router.push(`/onboarding/${userData.user_type}/basic-info`);
        return;
      }

      // Otherwise, show welcome page for role selection (new users)
      setUser({
        ...authUser,
        full_name: userData?.full_name || authUser.email?.split('@')[0] || 'User',
      });
    } catch (error) {
      // FIXME: Use logger.error('Error loading user:', error);
      router.push('/auth');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = async (role: 'searcher' | 'owner' | 'resident') => {
    setActiveRole(role);

    // Check if onboarding is completed for this role
    const { data: userData } = await supabase
      .from('users')
      .select('onboarding_completed, user_type')
      .eq('id', user.id)
      .single();

    // If user hasn't completed onboarding for this role, redirect to onboarding
    if (!userData?.onboarding_completed || userData.user_type !== role) {
      router.push(`/onboarding/${role}/basic-info`);
    } else {
      // Otherwise go to dashboard
      router.push(`/dashboard/${role}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600">{welcome.loading || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  const roleCards = [
    {
      id: 'searcher',
      icon: Search,
      emoji: '🔍',
      title: welcome.searcher?.title || 'Je cherche un logement',
      description: welcome.searcher?.description || 'Trouvez votre colocation idéale',
      color: 'var(--easy-yellow)',
      gradient: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-300 hover:border-yellow-400',
      bgHover: 'hover:bg-yellow-50',
    },
    {
      id: 'owner',
      icon: HomeIcon,
      emoji: '🏠',
      title: welcome.owner?.title || 'Je loue mon bien',
      description: welcome.owner?.description || 'Gérez vos propriétés et trouvez des locataires',
      color: 'var(--easy-purple)',
      gradient: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-300 hover:border-purple-400',
      bgHover: 'hover:bg-purple-50',
    },
    {
      id: 'resident',
      icon: Key,
      emoji: '🔑',
      title: welcome.resident?.title || 'Je suis déjà résident',
      description: welcome.resident?.description || 'Accédez à votre communauté de coliving',
      color: 'var(--easy-orange)',
      gradient: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-300 hover:border-orange-400',
      bgHover: 'hover:bg-orange-50',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50">
      {/* Header */}
      <header className="absolute top-0 right-0 p-6 z-50 flex items-center gap-4">
        <button
          onClick={() => router.push('/settings')}
          className="p-2 text-gray-600 hover:text-[var(--easy-purple)] transition rounded-lg hover:bg-white/50"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        <LanguageSwitcher />
        <button
          onClick={handleLogout}
          className="p-2 text-gray-600 hover:text-red-600 transition rounded-lg hover:bg-white/50"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="max-w-5xl w-full">
          {/* Welcome Message */}
          <div className="text-center mb-8 sm:mb-12 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-lg mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl">👋</span>
            </div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-[var(--easy-purple)] mb-2 sm:mb-3">
              {welcome.greeting || 'Bonjour'}, {user?.full_name}!
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              {welcome.subtitle || 'Que souhaitez-vous faire aujourd\'hui ?'}
            </p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {roleCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => handleRoleSelect(card.id as any)}
                  className={`
                    group relative bg-white rounded-3xl p-4 sm:p-8
                    border-2 ${card.borderColor}
                    shadow-lg hover:shadow-2xl
                    transition-all duration-300
                    hover:scale-105 hover:-translate-y-2
                    ${card.bgHover}
                    animate-slideUp
                  `}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Icon Circle */}
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: card.color }}
                  >
                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {card.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 min-h-[40px] sm:min-h-[48px]">
                    {card.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center justify-center text-gray-400 group-hover:text-gray-900 transition-colors">
                    <span className="mr-2 text-sm font-medium">
                      {welcome.continue || 'Continuer'}
                    </span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>

                  {/* Hover Effect Overlay */}
                  <div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                    style={{ backgroundColor: card.color }}
                  />
                </button>
              );
            })}
          </div>

          {/* Help Text */}
          <div className="text-center animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <p className="text-sm text-gray-500">
              {welcome.helpText || 'Vous pouvez changer de rôle à tout moment depuis votre profil'}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
