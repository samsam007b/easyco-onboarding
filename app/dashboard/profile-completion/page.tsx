'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { calculateProfileCompletion, type UserProfile, type ProfileCompletionResult } from '@/lib/profile/profile-completion';
import { CheckCircle2, Circle, ChevronRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/use-language';

export default function ProfileCompletionPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);
  const [completion, setCompletion] = useState<ProfileCompletionResult | null>(null);

  useEffect(() => {
    loadProfileCompletion();
  }, []);

  const loadProfileCompletion = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const result = calculateProfileCompletion(profile as UserProfile);
      setCompletion(result);
    } catch (error) {
      console.error('Error loading profile completion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !completion) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#FFB10B] border-t-transparent rounded-full" />
      </div>
    );
  }

  const sections = [
    { key: 'basic', title: t('profileCompletion.sections.basic'), icon: '👤', route: '/dashboard/my-profile' },
    { key: 'preferences', title: t('profileCompletion.sections.preferences'), icon: '🔍', route: '/dashboard/my-profile' },
    { key: 'lifestyle', title: t('profileCompletion.sections.lifestyle'), icon: '🏠', route: '/dashboard/my-profile' },
    { key: 'personality', title: t('profileCompletion.sections.personality'), icon: '✨', route: '/dashboard/my-profile' },
    { key: 'verification', title: t('profileCompletion.sections.verification'), icon: '✓', route: '/dashboard/my-profile' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FFF9E6] to-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            ← {t('common.back')}
          </button>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {t('profileCompletion.title')}
          </h1>
          <p className="text-gray-600 text-sm">
            {t('profileCompletion.description')}
          </p>

          {/* Overall Progress */}
          <div className="mt-6 bg-white superellipse-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">{t('profileCompletion.overallProgress')}</span>
              <span className="text-2xl font-bold text-[#FFB10B]">{completion.percentage}%</span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completion.percentage}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-[#FFB10B] to-[#F9A825] rounded-full"
              />
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>
                {completion.completedFields} {t('profileCompletion.fieldsOf')} {completion.totalFields} {t('profileCompletion.fieldsCompleted')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
        {sections.map((section) => {
          const sectionData = completion.sections[section.key as keyof typeof completion.sections];
          const isComplete = sectionData.percentage === 100;

          return (
            <motion.button
              key={section.key}
              onClick={() => router.push(section.route)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-white superellipse-2xl p-4 border border-gray-100 hover:border-[#FFB10B]/50 transition-all hover:shadow-md text-left"
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className={`w-12 h-12 superellipse-xl flex items-center justify-center text-xl ${
                  isComplete ? 'bg-green-50' : 'bg-[#FFF9E6]'
                }`}>
                  {section.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{section.title}</h3>
                    {isComplete && (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                  </div>

                  {/* Progress */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isComplete ? 'bg-green-500' : 'bg-[#FFB10B]'
                        }`}
                        style={{ width: `${sectionData.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 min-w-[3rem] text-right">
                      {sectionData.completed}/{sectionData.total}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Missing Fields Alert */}
      {completion.missingFields.length > 0 && (
        <div className="max-w-2xl mx-auto px-4 pb-6">
          <div className="bg-orange-50 border border-orange-200 superellipse-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-orange-900 mb-2">{t('profileCompletion.missingFields')}</h4>
                <div className="space-y-1">
                  {completion.missingFields.slice(0, 5).map((field, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-orange-700">
                      <Circle className="w-2 h-2 fill-current" />
                      <span>{field}</span>
                    </div>
                  ))}
                  {completion.missingFields.length > 5 && (
                    <p className="text-sm text-orange-600 italic mt-2">
                      ... +{completion.missingFields.length - 5} {t('profileCompletion.andMoreFields')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        <button
          onClick={() => router.push('/dashboard/my-profile')}
          className="w-full bg-[#FFB10B] hover:bg-[#F9A825] text-white font-semibold py-4 superellipse-2xl transition-colors"
        >
          {t('profileCompletion.completeProfile')}
        </button>
      </div>
    </div>
  );
}
