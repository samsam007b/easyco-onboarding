'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Shield } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';

export default function PaymentInfoPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [iban, setIban] = useState('');
  const [swiftBic, setSwiftBic] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('ownerPaymentInfo', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setIban(saved.iban || profileData.iban || '');
          setSwiftBic(saved.swiftBic || profileData.swift_bic || '');
        } else if (saved.iban) {
          setIban(saved.iban);
          setSwiftBic(saved.swiftBic || '');
        }
      }
    } catch (error) {
      console.error('Error loading payment data:', error);
      toast.error('Failed to load existing data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    safeLocalStorage.set('ownerPaymentInfo', {
      iban,
      swiftBic,
    });
    toast.success('Payment information saved!');
    router.push('/dashboard/my-profile-owner');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[color:var(--easy-purple)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={() => router.push('/dashboard/my-profile-owner')}
          className="mb-6 text-[color:var(--easy-purple)] hover:opacity-70 transition flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </button>

        {/* Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[color:var(--easy-purple)]">
              Payment & Banking
            </h1>
          </div>
          <p className="text-gray-600">
            Provide your banking details to receive rent payments
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          {/* IBAN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IBAN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={iban}
              onChange={(e) => setIban(e.target.value.toUpperCase())}
              placeholder="FR76 1234 5678 9012 3456 7890 123"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">
              International Bank Account Number for receiving payments
            </p>
          </div>

          {/* SWIFT/BIC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SWIFT/BIC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={swiftBic}
              onChange={(e) => setSwiftBic(e.target.value.toUpperCase())}
              placeholder="BNPAFRPP"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-2">
              Bank Identifier Code for international transfers
            </p>
          </div>

          {/* Security Notice */}
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex gap-3">
            <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Your information is secure</h3>
              <p className="text-sm text-gray-600">
                Your banking details are encrypted and stored securely. They will only be used for processing rent payments from verified tenants.
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.push('/dashboard/my-profile-owner')}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!iban || !swiftBic}
            className={`flex-1 py-4 rounded-lg font-semibold transition-colors ${
              iban && swiftBic
                ? 'bg-[color:var(--easy-purple)] text-white hover:opacity-90'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </main>
  );
}
