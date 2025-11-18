'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, User } from 'lucide-react';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import { safeLocalStorage } from '@/lib/browser';
import ProgressBar, { generateStepsArray } from '@/components/onboarding/ProgressBar';
import { useOnboardingFunnel } from '@/lib/analytics/use-analytics';
import { trackQuickStartFunnel } from '@/lib/analytics/funnels';

export default function QuickBasicInfoPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');

  // Analytics tracking
  const { trackStepCompleted, trackOnboardingStarted } = useOnboardingFunnel('quick');

  const loadExistingData = useCallback(async () => {
    try {
      // Load from localStorage first
      const saved = safeLocalStorage.get('quickBasicInfo', {}) as any;
      if (saved.firstName) setFirstName(saved.firstName);
      if (saved.lastName) setLastName(saved.lastName);
      if (saved.dateOfBirth) setDateOfBirth(saved.dateOfBirth);
      if (saved.nationality) setNationality(saved.nationality);

      // Load from database if exists
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          if (profileData.first_name) setFirstName(profileData.first_name);
          if (profileData.last_name) setLastName(profileData.last_name);
          if (profileData.date_of_birth) setDateOfBirth(profileData.date_of_birth);
          if (profileData.nationality) setNationality(profileData.nationality);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, [supabase]);

  useEffect(() => {
    loadExistingData();

    // Track that user started the Quick Start onboarding
    trackOnboardingStarted();
    trackQuickStartFunnel.modeSelected({ mode: 'quick' });
  }, [loadExistingData, trackOnboardingStarted]);

  // Auto-save to localStorage
  useEffect(() => {
    const saveData = {
      firstName,
      lastName,
      dateOfBirth,
      nationality,
    };
    safeLocalStorage.set('quickBasicInfo', saveData);
  }, [firstName, lastName, dateOfBirth, nationality]);

  const handleNext = async () => {
    // Validation
    if (!firstName.trim()) {
      toast.error('Le prénom est requis');
      return;
    }

    if (!lastName.trim()) {
      toast.error('Le nom de famille est requis');
      return;
    }

    if (!dateOfBirth) {
      toast.error('La date de naissance est requise');
      return;
    }

    // Check age (must be 18+)
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      toast.error('Vous devez avoir au moins 18 ans');
      return;
    }

    if (!nationality.trim()) {
      toast.error('La nationalité est requise');
      return;
    }

    setIsLoading(true);

    try {
      // Save to database
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { error } = await supabase
          .from('user_profiles')
          .upsert(
            {
              user_id: user.id,
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              date_of_birth: dateOfBirth,
              nationality: nationality.trim(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id' }
          );

        if (error) throw error;
      }

      // Track step completion
      trackStepCompleted('basic_info', 1);
      trackQuickStartFunnel.basicInfoCompleted({
        has_nationality: !!nationality,
        age_range: age < 25 ? '18-24' : age < 35 ? '25-34' : age < 45 ? '35-44' : '45+',
      });

      // Navigate to next step
      router.push('/onboarding/searcher/quick/budget-location');
    } catch (error: any) {
      console.error('Error saving:', error);
      toast.error(error.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  const steps = generateStepsArray('quick', 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <ProgressBar steps={steps} currentStep={0} mode="quick" />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Commençons par les bases
          </h1>
          <p className="text-gray-600">
            Dis-nous qui tu es pour personnaliser ton expérience
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jean"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
              Nom de famille <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Dupont"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700 mb-2">
              Date de naissance <span className="text-red-500">*</span>
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Tu dois avoir au moins 18 ans</p>
          </div>

          {/* Nationality */}
          <div>
            <label htmlFor="nationality" className="block text-sm font-semibold text-gray-700 mb-2">
              Nationalité <span className="text-red-500">*</span>
            </label>
            <input
              id="nationality"
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="Belge"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Continue Button */}
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <LoadingHouse size={20} />
            ) : (
              <>
                <span>Continuer</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ✅ Tes informations sont sauvegardées automatiquement
        </p>
      </div>
    </div>
  );
}
