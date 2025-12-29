'use client';

import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function PrivacyPolicyPage() {
  const { getSection } = useLanguage();
  const legal = getSection('legal');
  const privacy = legal.privacy;
  const common = legal.common;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[var(--easy-purple)] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            {common.backToHome}
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
            <Shield className="w-8 h-8 text-[var(--easy-purple)]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {privacy.title}
          </h1>
          <p className="text-xl text-gray-600">
            {privacy.subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-8">
            <p className="text-gray-700 leading-relaxed">
              {privacy.intro}
            </p>
          </div>

          {/* 1. Data Collection */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {privacy.dataCollection.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {privacy.dataCollection.content}
            </p>
            <ul className="space-y-3 ml-6">
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.dataCollection.personal}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.dataCollection.contact}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.dataCollection.account}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.dataCollection.preferences}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.dataCollection.usage}
              </li>
            </ul>
          </section>

          {/* 2. Legal Basis */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {privacy.legalBasis.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {privacy.legalBasis.content}
            </p>
            <ul className="space-y-3 ml-6">
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.legalBasis.consent}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.legalBasis.contract}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.legalBasis.legal}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.legalBasis.legitimate}
              </li>
            </ul>
          </section>

          {/* 3. Data Usage */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {privacy.dataUsage.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {privacy.dataUsage.content}
            </p>
            <ul className="space-y-3 ml-6">
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.dataUsage.matching}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.dataUsage.verification}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.dataUsage.communication}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.dataUsage.improvement}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.dataUsage.legal}
              </li>
            </ul>
          </section>

          {/* 4. Data Storage */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {privacy.dataStorage.title}
            </h2>
            <p className="text-gray-700">
              {privacy.dataStorage.content}
            </p>
          </section>

          {/* 5. User Rights */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {privacy.userRights.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {privacy.userRights.content}
            </p>
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-purple)] rounded-full mt-2"></div>
                <p className="text-gray-700">{privacy.userRights.access}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-purple)] rounded-full mt-2"></div>
                <p className="text-gray-700">{privacy.userRights.rectification}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-purple)] rounded-full mt-2"></div>
                <p className="text-gray-700">{privacy.userRights.erasure}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-purple)] rounded-full mt-2"></div>
                <p className="text-gray-700">{privacy.userRights.portability}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-purple)] rounded-full mt-2"></div>
                <p className="text-gray-700">{privacy.userRights.objection}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-purple)] rounded-full mt-2"></div>
                <p className="text-gray-700">{privacy.userRights.withdraw}</p>
              </div>
            </div>
          </section>

          {/* 6. Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {privacy.cookies.title}
            </h2>
            <p className="text-gray-700">
              {privacy.cookies.content}{' '}
              <Link href="/legal/cookies" className="text-[var(--easy-purple)] hover:underline font-medium">
                {legal.cookies.title}
              </Link>
            </p>
          </section>

          {/* 7. Data Security */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {privacy.security.title}
            </h2>
            <p className="text-gray-700">
              {privacy.security.content}
            </p>
          </section>

          {/* 8. Data Sharing */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {privacy.sharing.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {privacy.sharing.content}
            </p>
            <ul className="space-y-3 ml-6">
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.sharing.users}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.sharing.providers}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {privacy.sharing.legal}
              </li>
            </ul>
          </section>

          {/* 9. DPO */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {privacy.dpo.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {privacy.dpo.content}
            </p>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
              <p className="text-gray-700 mb-2">
                <strong>{common.email}:</strong>{' '}
                <a href="mailto:contact@izzico.be" className="text-[var(--easy-purple)] hover:underline">
                  contact@izzico.be
                </a>
              </p>
              <p className="text-gray-700">
                <strong>{common.address}:</strong> Rue Example 123, 1000 Bruxelles, Belgique
              </p>
            </div>
          </section>

          {/* 10. Changes */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {privacy.changes.title}
            </h2>
            <p className="text-gray-700">
              {privacy.changes.content}
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t-2 border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            {common.lastUpdated}: <strong>Octobre 2025</strong>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Izzico SPRL/BVBA
          </p>
        </div>
      </main>
    </div>
  );
}
