'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, DollarSign, Calendar } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function PropertyPricing() {
  const router = useRouter();
  const { t, getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [minLeaseLength, setMinLeaseLength] = useState('6');

  useEffect(() => {
    const saved = safeLocalStorage.get('propertyPricing', {}) as any;
    if (saved.monthlyRent) setMonthlyRent(saved.monthlyRent);
    if (saved.securityDeposit) setSecurityDeposit(saved.securityDeposit);
    if (saved.availableFrom) setAvailableFrom(saved.availableFrom);
    if (saved.minLeaseLength) setMinLeaseLength(saved.minLeaseLength);
  }, []);

  const handleContinue = () => {
    if (!monthlyRent || !securityDeposit) {
      toast.error(onboarding.property.pricing.errorRequired);
      return;
    }

    safeLocalStorage.set('propertyPricing', {
      monthlyRent: parseFloat(monthlyRent),
      securityDeposit: parseFloat(securityDeposit),
      availableFrom,
      minLeaseLength: parseInt(minLeaseLength),
    });
    router.push('/onboarding/property/description');
  };

  const handleBack = () => {
    router.push('/onboarding/property/basics');
  };

  // Calculate estimated earnings
  const calculateEarnings = () => {
    const rent = parseFloat(monthlyRent) || 0;
    const platformFee = rent * 0.08; // 8% platform fee
    return (rent - platformFee).toFixed(0);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Language Switcher */}
        <div className="absolute top-6 right-6 z-50">
          <LanguageSwitcher />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[color:var(--easy-purple)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{common.back}</span>
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[color:var(--easy-purple)] flex items-center justify-center">
            <Home className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[color:var(--easy-purple)]">EasyCo</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step 2 of 4</span>
            <span className="text-sm font-semibold text-[color:var(--easy-purple)]">50%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[color:var(--easy-purple)] rounded-full" style={{ width: '50%' }} />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{onboarding.property.pricing.title}</h2>
            <p className="text-gray-600">{onboarding.property.pricing.subtitle}</p>
          </div>

          <div className="space-y-6">
            {/* Monthly Rent */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {onboarding.property.pricing.monthlyRent} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  placeholder={onboarding.property.pricing.monthlyRentPlaceholder}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
                />
              </div>
              {monthlyRent && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-sm text-green-700">
                    <span>{onboarding.property.pricing.earningsEstimate}</span>
                    <span className="font-bold">€{calculateEarnings()}{onboarding.property.pricing.perMonth}</span>
                    <span>{onboarding.property.pricing.afterFees}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Security Deposit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {onboarding.property.pricing.securityDeposit} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(e.target.value)}
                  placeholder={onboarding.property.pricing.securityDepositPlaceholder}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">{onboarding.property.pricing.securityDepositHelp}</p>
            </div>

            {/* Available From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{onboarding.property.pricing.availableFrom}</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {/* Minimum Lease Length */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Lease Length
              </label>
              <select
                value={minLeaseLength}
                onChange={(e) => setMinLeaseLength(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="1">1 month</option>
                <option value="3">3 months</option>
                <option value="6">6 months</option>
                <option value="9">9 months</option>
                <option value="12">12 months (1 year)</option>
                <option value="24">24 months (2 years)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Tenants must commit to at least this duration
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleBack}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              {common.back}
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 bg-[color:var(--easy-purple)] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              {common.continue}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
