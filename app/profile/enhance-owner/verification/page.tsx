'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Upload, CheckCircle } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import {
  EnhanceProfileLayout,
  EnhanceProfileHeading,
  EnhanceProfileButton,
  EnhanceProfileSection,
  EnhanceProfileInfoBox,
} from '@/components/enhance-profile';

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

  const handleSkip = () => {
    router.push('/dashboard/my-profile-owner');
  };

  return (
    <EnhanceProfileLayout
      role="owner"
      backUrl="/dashboard/my-profile-owner"
      backLabel="Back to Profile"
      isLoading={isLoading}
      loadingText="Loading your information..."
    >
      <EnhanceProfileHeading
        role="owner"
        title="Profile Verification"
        description="Verify your identity to build trust with potential tenants"
        icon={<Shield className="w-8 h-8 text-purple-600" />}
      />

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

      <div className="space-y-6">
        {/* ID Document */}
        <EnhanceProfileSection>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-purple-600" />
            Government-issued ID
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload a photo of your passport, driver's license, or national ID card
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
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
        </EnhanceProfileSection>

        {/* Proof of Ownership */}
        <EnhanceProfileSection>
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-purple-600" />
            Proof of Property Ownership
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload property deed, title, or management contract
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors cursor-pointer">
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
        </EnhanceProfileSection>

        {/* Info Box */}
        <EnhanceProfileInfoBox role="owner" title="Why verification matters">
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Builds trust with potential tenants</li>
            <li>Increases visibility of your listings</li>
            <li>Protects you and your renters</li>
            <li>All documents are securely encrypted</li>
          </ul>
        </EnhanceProfileInfoBox>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mt-8">
        <EnhanceProfileButton
          role="owner"
          variant="outline"
          onClick={handleSkip}
        >
          Skip for Now
        </EnhanceProfileButton>
        <EnhanceProfileButton
          role="owner"
          onClick={handleSave}
          className="flex-1"
        >
          Submit for Verification
        </EnhanceProfileButton>
      </div>
    </EnhanceProfileLayout>
  );
}
