'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Upload, CheckCircle } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import LoadingHouse from '@/components/ui/LoadingHouse';

export default function OwnerVerificationPage() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [idDocument, setIdDocument] = useState('');
  const [proofOfOwnership, setProofOfOwnership] = useState('');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      const saved = safeLocalStorage.get('ownerVerification', {}) as any;

      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileData) {
          setVerificationStatus(profileData.verification_status || 'pending');
          setIdDocument(saved.idDocument || profileData.id_document || '');
          setProofOfOwnership(saved.proofOfOwnership || profileData.proof_of_ownership || '');
        } else if (saved.idDocument) {
          setIdDocument(saved.idDocument);
          setProofOfOwnership(saved.proofOfOwnership || '');
        }
      }
    } catch (error) {
      // FIXME: Use logger.error('Error loading verification data:', error);
      toast.error('Failed to load existing data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    safeLocalStorage.set('ownerVerification', {
      idDocument,
      proofOfOwnership,
    });
    toast.success('Verification documents saved!');
    router.push('/dashboard/my-profile-owner');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingHouse size={64} />
          <p className="text-gray-600">Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
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
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-[color:var(--easy-purple)]">
              Profile Verification
            </h1>
          </div>
          <p className="text-gray-600">
            Verify your identity to build trust with potential tenants
          </p>
        </div>

        {/* Verification Status */}
        {verificationStatus === 'verified' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="font-medium text-green-900">Verification Complete</h3>
              <p className="text-sm text-green-700">Your profile has been verified</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* ID Document */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Government-issued ID
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload a photo of your passport, driver's license, or national ID card
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[color:var(--easy-purple)] transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG or PDF (max 10MB)</p>
            </div>
            {idDocument && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Document uploaded</span>
              </div>
            )}
          </div>

          {/* Proof of Ownership */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Proof of Property Ownership
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload property deed, title, or management contract
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[color:var(--easy-purple)] transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG or PDF (max 10MB)</p>
            </div>
            {proofOfOwnership && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Document uploaded</span>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-gray-900 mb-2">🔒 Why verification matters</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Builds trust with potential tenants</li>
              <li>Increases visibility of your listings</li>
              <li>Protects you and your renters</li>
              <li>All documents are securely encrypted</li>
            </ul>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.push('/dashboard/my-profile-owner')}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Skip for Now
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[color:var(--easy-purple)] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Submit for Verification
          </button>
        </div>
      </div>
    </main>
  );
}
