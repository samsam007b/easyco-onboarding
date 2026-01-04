'use client';

import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function TermsPage() {
  const { getSection } = useLanguage();
  const legal = getSection('legal');
  const terms = legal.terms;
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
            <FileText className="w-8 h-8 text-[var(--easy-purple)]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {terms.title}
          </h1>
          <p className="text-xl text-gray-600">
            {terms.subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <div className="bg-white superellipse-2xl border-2 border-gray-200 p-8 mb-8">
            <p className="text-gray-700 leading-relaxed">
              {terms.intro}
            </p>
          </div>

          {/* 1. Service Description */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {terms.service.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {terms.service.content}
            </p>
            <ul className="space-y-3 ml-6">
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {terms.service.matching}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {terms.service.verification}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {terms.service.groups}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {terms.service.communication}
              </li>
            </ul>
          </section>

          {/* 2. Eligibility */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {terms.eligibility.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {terms.eligibility.content}
            </p>
            <ul className="space-y-3 ml-6">
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {terms.eligibility.age}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {terms.eligibility.identity}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {terms.eligibility.accurate}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {terms.eligibility.comply}
              </li>
            </ul>
          </section>

          {/* 3. User Obligations */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {terms.userObligations.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {terms.userObligations.content}
            </p>
            <div className="bg-yellow-50 border-2 border-yellow-200 superellipse-xl p-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-yellow)] rounded-full mt-2"></div>
                <p className="text-gray-700">{terms.userObligations.truthful}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-yellow)] rounded-full mt-2"></div>
                <p className="text-gray-700">{terms.userObligations.respectful}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-yellow)] rounded-full mt-2"></div>
                <p className="text-gray-700">{terms.userObligations.noScam}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-yellow)] rounded-full mt-2"></div>
                <p className="text-gray-700">{terms.userObligations.security}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-yellow)] rounded-full mt-2"></div>
                <p className="text-gray-700">{terms.userObligations.prohibited}</p>
              </div>
            </div>
          </section>

          {/* 4. Intellectual Property */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {terms.intellectualProperty.title}
            </h2>
            <p className="text-gray-700">
              {terms.intellectualProperty.content}
            </p>
          </section>

          {/* 5. Limitation of Liability */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {terms.liability.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {terms.liability.content}
            </p>
            <ul className="space-y-3 ml-6">
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {terms.liability.listings}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {terms.liability.disputes}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {terms.liability.quality}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {terms.liability.transactions}
              </li>
            </ul>
            <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 superellipse-xl">
              <p className="text-gray-700 font-medium">
                {terms.liability.disclaimer}
              </p>
            </div>
          </section>

          {/* 6. Termination */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {terms.termination.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {terms.termination.content}
            </p>
            <ul className="space-y-3 ml-6">
              <li className="text-gray-700">
                <span className="text-red-500 font-semibold">•</span> {terms.termination.violation}
              </li>
              <li className="text-gray-700">
                <span className="text-red-500 font-semibold">•</span> {terms.termination.fraud}
              </li>
              <li className="text-gray-700">
                <span className="text-red-500 font-semibold">•</span> {terms.termination.abuse}
              </li>
              <li className="text-gray-700">
                <span className="text-red-500 font-semibold">•</span> {terms.termination.inactivity}
              </li>
            </ul>
          </section>

          {/* 7. Applicable Law */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {terms.applicableLaw.title}
            </h2>
            <div className="bg-purple-50 border-2 border-purple-200 superellipse-xl p-6">
              <p className="text-gray-700">
                {terms.applicableLaw.content}
              </p>
            </div>
          </section>

          {/* 8. Modifications */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {terms.modifications.title}
            </h2>
            <p className="text-gray-700">
              {terms.modifications.content}
            </p>
          </section>

          {/* 9. Contact */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              {terms.contact.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {terms.contact.content}
            </p>
            <div className="bg-yellow-50 border-2 border-yellow-200 superellipse-xl p-6">
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
