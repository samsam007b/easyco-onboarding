'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, FileText } from 'lucide-react';
import { safeLocalStorage } from '@/lib/browser';

export default function PropertyDescription() {
  const router = useRouter();
  const [description, setDescription] = useState('');

  useEffect(() => {
    const saved = safeLocalStorage.get('propertyDescription', {});
    if (saved.description) setDescription(saved.description);
  }, []);

  const handleContinue = () => {
    safeLocalStorage.set('propertyDescription', {
      description,
    });
    router.push('/onboarding/property/review');
  };

  const handleBack = () => {
    router.push('/onboarding/property/pricing');
  };

  const maxChars = 500;
  const remainingChars = maxChars - description.length;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[color:var(--easy-purple)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
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
            <span className="text-sm text-gray-600">Step 3 of 4</span>
            <span className="text-sm font-semibold text-[color:var(--easy-purple)]">75%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[color:var(--easy-purple)] rounded-full" style={{ width: '75%' }} />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Description</h2>
            <p className="text-gray-600">Great descriptions help your listing stand out.</p>
          </div>

          {/* Tips */}
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-2">
              <FileText className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900 mb-1">Pro tip</h4>
                <p className="text-sm text-yellow-700">
                  Mention nearby amenities, transit, and what makes it special!
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, maxChars))}
                placeholder="Describe your property's best features, nearby amenities, and what makes it special..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--easy-purple)] focus:border-transparent outline-none transition-all resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  {description.length > 0 && `${description.length} / ${maxChars} characters`}
                </p>
                <p
                  className={`text-xs ${
                    remainingChars < 50 ? 'text-orange-600' : 'text-gray-500'
                  }`}
                >
                  {remainingChars} characters remaining
                </p>
              </div>
            </div>

            {/* TODO: Add photo upload section later */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                📸 <strong>Photos coming soon:</strong> You'll be able to add photos in the next version!
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleBack}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 bg-[color:var(--easy-purple)] text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Continue
            </button>
          </div>

          {/* Skip Option */}
          <button
            onClick={handleContinue}
            className="w-full mt-4 text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Skip for now
          </button>
        </div>
      </div>
    </main>
  );
}
