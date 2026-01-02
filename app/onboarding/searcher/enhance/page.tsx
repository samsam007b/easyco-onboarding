'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { safeLocalStorage } from '@/lib/browser';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { User, Heart, Palette, Users, DollarSign, ShieldCheck, X, Music, Home, Dumbbell } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

interface EnhanceSection {
  id: string;
  title: string;
  description: string;
  icon: any;
  path: string;
  color: string;
  completed: boolean;
}

export default function OnboardingEnhanceMenu() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [sections, setSections] = useState<EnhanceSection[]>([
    {
      id: 'about',
      title: '',
      description: '',
      icon: User,
      path: '/onboarding/searcher/enhance/about',
      color: 'bg-blue-100 text-blue-600',
      completed: false,
    },
    {
      id: 'personality',
      title: '',
      description: '',
      icon: Heart,
      path: '/onboarding/searcher/enhance/personality',
      color: 'bg-pink-100 text-pink-600',
      completed: false,
    },
    {
      id: 'values',
      title: '',
      description: '',
      icon: ShieldCheck,
      path: '/onboarding/searcher/enhance/values',
      color: 'bg-purple-100 text-purple-600',
      completed: false,
    },
    {
      id: 'hobbies',
      title: '',
      description: '',
      icon: Palette,
      path: '/onboarding/searcher/enhance/hobbies',
      color: 'bg-green-100 text-green-600',
      completed: false,
    },
    {
      id: 'lifestyle-details',
      title: '',
      description: '',
      icon: Music,
      path: '/onboarding/searcher/enhance/lifestyle-details',
      color: 'bg-teal-100 text-teal-600',
      completed: false,
    },
    {
      id: 'ideal-living',
      title: '',
      description: '',
      icon: Home,
      path: '/onboarding/searcher/enhance/ideal-living',
      color: 'bg-cyan-100 text-cyan-600',
      completed: false,
    },
    {
      id: 'community-activities',
      title: '',
      description: '',
      icon: Dumbbell,
      path: '/onboarding/searcher/enhance/community-activities',
      color: 'bg-lime-100 text-lime-600',
      completed: false,
    },
    {
      id: 'community',
      title: '',
      description: '',
      icon: Users,
      path: '/onboarding/searcher/enhance/community',
      color: 'bg-orange-100 text-orange-600',
      completed: false,
    },
    {
      id: 'financial',
      title: '',
      description: '',
      icon: DollarSign,
      path: '/onboarding/searcher/enhance/financial',
      color: 'bg-yellow-100 text-yellow-600',
      completed: false,
    },
    {
      id: 'verification',
      title: '',
      description: '',
      icon: ShieldCheck,
      path: '/onboarding/searcher/enhance/verification',
      color: 'bg-indigo-100 text-indigo-600',
      completed: false,
    },
  ]);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        loadCompletionStatus();
      }
    };
    loadUser();
  }, []);

  const loadCompletionStatus = () => {
    // Check localStorage for completed sections
    const updatedSections = sections.map(section => {
      const savedData = safeLocalStorage.get(getLocalStorageKey(section.id), null);
      return {
        ...section,
        completed: savedData !== null && Object.keys(savedData).length > 0
      };
    });
    setSections(updatedSections);
  };

  const getLocalStorageKey = (sectionId: string): string => {
    const keyMap: Record<string, string> = {
      'about': 'enhanceAbout',
      'personality': 'extendedPersonality',
      'values': 'enhanceValues',
      'hobbies': 'enhanceHobbies',
      'lifestyle-details': 'lifestyleDetails',
      'ideal-living': 'idealLiving',
      'community-activities': 'communityActivities',
      'community': 'communityEvents',
      'financial': 'financialInfo',
      'verification': 'verification',
    };
    return keyMap[sectionId] || sectionId;
  };

  const completedCount = sections.filter(s => s.completed).length;
  const totalCount = sections.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  const handleSkip = () => {
    toast.info(t('enhanceSearcher.menu.skipMessage'));
    router.push('/dashboard/searcher');
  };

  // Get translated section data
  const getTranslatedSections = () => sections.map(section => ({
    ...section,
    title: t(`enhanceSearcher.menu.sections.${section.id}.title`),
    description: t(`enhanceSearcher.menu.sections.${section.id}.description`),
  }));

  const translatedSections = getTranslatedSections();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-gray-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('enhanceSearcher.menu.title')}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {t('enhanceSearcher.menu.subtitle')}
              </p>
            </div>
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <X className="w-4 h-4" />
              {t('enhanceSearcher.menu.skip')}
            </Button>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                {completedCount}/{totalCount} {t('enhanceSearcher.menu.stepsCompleted') || 'steps completed'}
              </span>
              <span className="text-sm font-bold text-orange-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

        </div>
      </header>

      {/* Sections Grid */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {translatedSections.map((section) => {
            const IconComponent = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => router.push(section.path)}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left p-6 relative overflow-hidden group"
              >
                {/* Completion badge */}
                {section.completed && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${section.color} group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{section.title}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        {/* Skip button at bottom */}
        <div className="mt-8 text-center">
          <Button
            onClick={handleSkip}
            variant="outline"
            className="text-gray-600"
          >
            {t('enhanceSearcher.menu.continueLater')}
          </Button>
        </div>
      </main>
    </div>
  );
}
