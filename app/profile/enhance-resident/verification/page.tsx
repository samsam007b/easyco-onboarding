'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, CheckCircle, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/lib/i18n/use-language';

export default function VerificationResidentPage() {
  const router = useRouter();
  const supabase = createClient();
  const { getSection } = useLanguage();
  const common = getSection('common');
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<string>('');

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('verification_status')
        .eq('user_id', user.id)
        .single();

      if (profileData?.verification_status) {
        setVerificationStatus(profileData.verification_status);
      }
    } catch (error) {
      console.error('Error loading verification status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestVerification = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({ verification_status: 'pending' })
        .eq('user_id', user.id);

      if (error) throw error;

      setVerificationStatus('pending');
      toast.success('Verification request submitted! We\'ll review it soon.');
    } catch (error) {
      console.error('Error requesting verification:', error);
      toast.error(common.errors.unexpected);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#4A148C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-yellow-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push('/dashboard/my-profile-resident')}
          className="mb-6 text-[#4A148C] hover:opacity-70 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-[#4A148C]">
              Profile Verification
            </h1>
          </div>
          <p className="text-gray-600">
            Get verified to build trust with your community
          </p>
        </div>

        {verificationStatus === 'verified' ? (
          /* Already Verified */
          <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're Verified!</h2>
            <p className="text-gray-600 mb-6">
              Your profile has been verified. This helps build trust in the community.
            </p>
            <Button
              onClick={() => router.push('/dashboard/my-profile-resident')}
              className="bg-[#4A148C] hover:bg-[#4A148C]/90"
            >
              Back to Profile
            </Button>
          </div>
        ) : verificationStatus === 'pending' ? (
          /* Pending Verification */
          <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Pending</h2>
            <p className="text-gray-600 mb-6">
              Your verification request is being reviewed. We'll notify you once it's complete.
            </p>
            <Button
              onClick={() => router.push('/dashboard/my-profile-resident')}
              variant="outline"
            >
              Back to Profile
            </Button>
          </div>
        ) : (
          /* Not Verified - Show Benefits */
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Why Get Verified?</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: Shield,
                    title: 'Build Trust',
                    description: 'Show your neighbors you\'re a real, verified community member'
                  },
                  {
                    icon: CheckCircle,
                    title: 'Stand Out',
                    description: 'Get a verified badge on your profile'
                  },
                  {
                    icon: Upload,
                    title: 'Easy Process',
                    description: 'Simple verification process that takes just a few minutes'
                  }
                ].map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-2">What We'll Need</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Valid ID (passport, driver's license, or national ID)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  A selfie for identity confirmation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Proof of residence (optional, but recommended)
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Your Privacy is Protected</h3>
              </div>
              <p className="text-sm text-gray-600">
                Your verification documents are encrypted and stored securely. They're only used for verification purposes and are never shared with other users.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => router.push('/dashboard/my-profile-resident')}
                variant="outline"
                className="flex-1"
              >
                Later
              </Button>
              <Button
                onClick={handleRequestVerification}
                className="flex-1 bg-[#FFD600] text-black hover:bg-[#FFD600]/90"
              >
                Start Verification
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500">
              Verification typically takes 1-2 business days
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
