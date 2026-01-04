'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Upload, Mail, Phone, Check, FileText } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { useLanguage } from '@/lib/i18n/use-language';
import {
  OnboardingLayout,
  OnboardingHeading,
  OnboardingButton,
  OnboardingInput,
} from '@/components/onboarding';

export default function OwnerVerificationPage() {
  const router = useRouter();
  const { getSection } = useLanguage();
  const onboarding = getSection('onboarding');
  const common = getSection('common');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [proofOfOwnership, setProofOfOwnership] = useState<File | null>(null);

  const handleSaveProgress = () => {
    safeLocalStorage.set('ownerVerification', {
      phoneNumber,
      idDocument: idDocument?.name || null,
      proofOfOwnership: proofOfOwnership?.name || null,
      verificationCompleted: false,
    });
    router.push('/onboarding/owner/review');
  };

  const handleVerifyLater = () => {
    safeLocalStorage.set('ownerVerification', {
      phoneNumber: '',
      idDocument: null,
      proofOfOwnership: null,
      verificationCompleted: false,
    });
    router.push('/onboarding/owner/review');
  };

  const handleIdFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdDocument(e.target.files[0]);
    }
  };

  const handleOwnershipFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofOfOwnership(e.target.files[0]);
    }
  };

  return (
    <OnboardingLayout
      role="owner"
      backUrl="/onboarding/owner/property-basics"
      backLabel={common.back}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-purple-100 superellipse-2xl flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-purple-600" />
        </div>
        <OnboardingHeading
          role="owner"
          title={onboarding.owner.verification.title}
          description={onboarding.owner.verification.subtitle}
        />
      </div>

      <div className="space-y-6">
        {/* Identity verification (KYC) */}
        <div className="p-5 superellipse-xl bg-white border border-gray-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Upload className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {onboarding.owner.verification.idVerificationTitle}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {onboarding.owner.verification.idVerificationDesc}
              </p>
            </div>
          </div>

          <label className="block">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleIdFileChange}
              className="hidden"
              id="id-upload"
            />
            <label
              htmlFor="id-upload"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-purple-600 text-white font-medium cursor-pointer hover:bg-purple-700 transition"
            >
              <Upload className="w-4 h-4" />
              {idDocument ? onboarding.owner.verification.changeId : onboarding.owner.verification.uploadId}
            </label>
          </label>

          {idDocument && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
              <Check className="w-4 h-4" />
              {idDocument.name}
            </div>
          )}
        </div>

        {/* Proof of Ownership */}
        <div className="p-5 superellipse-xl bg-white border border-gray-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {onboarding.owner.verification.proofOfOwnershipTitle}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {onboarding.owner.verification.proofOfOwnershipDesc}
              </p>
            </div>
          </div>

          <label className="block">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleOwnershipFileChange}
              className="hidden"
              id="ownership-upload"
            />
            <label
              htmlFor="ownership-upload"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-green-600 text-white font-medium cursor-pointer hover:bg-green-700 transition"
            >
              <FileText className="w-4 h-4" />
              {proofOfOwnership ? onboarding.owner.verification.changeDocument : onboarding.owner.verification.uploadDocument}
            </label>
          </label>

          {proofOfOwnership && (
            <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
              <Check className="w-4 h-4" />
              {proofOfOwnership.name}
            </div>
          )}
        </div>

        {/* Email verification */}
        <div className="p-5 superellipse-xl bg-white border border-gray-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {onboarding.owner.verification.emailVerificationTitle}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {onboarding.owner.verification.emailVerificationDesc}
              </p>
            </div>
          </div>

          <button className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
            {onboarding.owner.verification.verifyEmail}
          </button>
        </div>

        {/* Phone verification */}
        <div className="p-5 superellipse-xl bg-white border border-gray-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                {onboarding.owner.verification.phoneVerificationTitle}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {onboarding.owner.verification.phoneVerificationDesc}
              </p>
            </div>
          </div>

          <OnboardingInput
            role="owner"
            label=""
            type="tel"
            icon={Phone}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder={onboarding.owner.verification.phoneNumberPlaceholder}
          />

          <button
            disabled={!phoneNumber}
            className={`w-full mt-3 px-4 py-3 rounded-lg font-medium transition ${
              phoneNumber
                ? 'bg-orange-600 text-white hover:bg-orange-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {onboarding.owner.verification.sendOtp}
          </button>
        </div>

        {/* Why verify? */}
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
          <h4 className="font-semibold text-gray-900 mb-2">{onboarding.owner.verification.whyVerifyTitle}</h4>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>{onboarding.owner.verification.whyVerify1}</li>
            <li>{onboarding.owner.verification.whyVerify2}</li>
            <li>{onboarding.owner.verification.whyVerify3}</li>
            <li>{onboarding.owner.verification.whyVerify4}</li>
          </ul>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3 mt-8">
        <OnboardingButton role="owner" onClick={handleSaveProgress}>
          {onboarding.owner.verification.saveProgress}
        </OnboardingButton>

        <button
          onClick={handleVerifyLater}
          className="w-full py-3 rounded-full font-medium text-gray-600 hover:text-gray-800 transition"
        >
          {onboarding.owner.verification.verifyLater}
        </button>
      </div>
    </OnboardingLayout>
  );
}
