'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';
import { toast } from 'sonner';

export default function OwnerBasicInfo() {
  const router = useRouter();
  const [landlordType, setLandlordType] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nationality, setNationality] = useState('');

  useEffect(() => {
    const saved = safeLocalStorage.get('ownerBasicInfo', {}) as any;
    if (saved.landlordType) setLandlordType(saved.landlordType);
    if (saved.firstName) setFirstName(saved.firstName);
    if (saved.lastName) setLastName(saved.lastName);
    if (saved.companyName) setCompanyName(saved.companyName);
    if (saved.email) setEmail(saved.email);
    if (saved.phoneNumber) setPhoneNumber(saved.phoneNumber);
    if (saved.nationality) setNationality(saved.nationality);
  }, []);

  const handleContinue = () => {
    if (!landlordType) {
      toast.error('Please select your landlord type');
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Please enter your first and last name');
      return;
    }
    if ((landlordType === 'agency' || landlordType === 'company') && !companyName.trim()) {
      toast.error('Please enter your company name');
      return;
    }
    if (!phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    safeLocalStorage.set('ownerBasicInfo', {
      landlordType,
      firstName,
      lastName,
      companyName: (landlordType === 'agency' || landlordType === 'company') ? companyName : '',
      email,
      phoneNumber,
      nationality,
    });
    router.push('/onboarding/owner/about');
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-[color:var(--easy-purple)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[color:var(--easy-purple)] flex items-center justify-center">
            <User className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[color:var(--easy-purple)]">EasyCo</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step 1 of 3</span>
            <span className="text-sm font-semibold text-[color:var(--easy-purple)]">33%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[color:var(--easy-purple)] rounded-full" style={{ width: '33%' }} />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to EasyCo for Homeowners</h2>
            <p className="text-gray-600">List your property, meet the right tenants, and manage everything from one place.</p>
          </div>

          <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-[color:var(--easy-purple)] mb-2">Let's set up your host profile</h3>
            <p className="text-sm text-gray-600">Your verified profile helps us build trust with potential tenants.</p>
          </div>

          <div className="space-y-6">
            {/* Landlord Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am a <span className="text-red-500">*</span>
              </label>
              <select
                value={landlordType}
                onChange={(e) => setLandlordType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
              >
                <option value="">Select...</option>
                <option value="individual">Individual Landlord</option>
                <option value="agency">Property Agency</option>
                <option value="company">Property Management Company</option>
              </select>
            </div>

            {/* Company Name (conditional) */}
            {(landlordType === 'agency' || landlordType === 'company') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
                />
              </div>
            )}

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
              />
              <p className="mt-2 text-xs text-gray-500">Verified email helps protect your account</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
              />
              <p className="mt-2 text-xs text-gray-500">Required for tenant communication</p>
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nationality
              </label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="e.g., French, Belgian"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full mt-8 bg-[color:var(--easy-purple)] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </div>
      </div>
    </main>
  );
}
