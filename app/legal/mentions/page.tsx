'use client';

import Link from 'next/link';
import { ArrowLeft, Building2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function LegalMentionsPage() {
  const { getSection } = useLanguage();
  const legal = getSection('legal');
  const mentions = legal.mentions;
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
            <Building2 className="w-8 h-8 text-[var(--easy-purple)]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {mentions.title}
          </h1>
          <p className="text-xl text-gray-600">
            {mentions.subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none space-y-10">
          {/* 1. Company Identification */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {mentions.company.title}
            </h2>
            <div className="bg-white superellipse-2xl border-2 border-gray-200 p-8 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {mentions.company.name}
                </h3>
                <p className="text-gray-700">Izzico SPRL/BVBA</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {mentions.company.form}
                </h3>
                <p className="text-gray-700">
                  {mentions.company.formValue}
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {mentions.company.vat}
                  </h3>
                  <p className="text-gray-700">{mentions.company.vatValue}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {mentions.company.registration}
                  </h3>
                  <p className="text-gray-700">{mentions.company.registrationValue}</p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Registered Office */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {mentions.headquarters.title}
            </h2>
            <div className="bg-purple-50 superellipse-2xl border-2 border-purple-200 p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {mentions.headquarters.address}
              </h3>
              <p className="text-gray-700 text-lg">
                {mentions.headquarters.addressValue}
              </p>
            </div>
          </section>

          {/* 3. Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {mentions.contact.title}
            </h2>
            <div className="bg-yellow-50 superellipse-2xl border-2 border-yellow-200 p-8 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {mentions.contact.emailLabel}
                </h3>
                <a
                  href="mailto:contact@izzico.be"
                  className="text-[var(--easy-purple)] hover:underline text-lg font-medium"
                >
                  {mentions.contact.emailValue}
                </a>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {mentions.contact.website}
                </h3>
                <a
                  href="https://www.izzico.be"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--easy-purple)] hover:underline text-lg font-medium"
                >
                  {mentions.contact.websiteValue}
                </a>
              </div>
            </div>
          </section>

          {/* 4. Publication Director */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {mentions.director.title}
            </h2>
            <div className="bg-white superellipse-2xl border-2 border-gray-200 p-8">
              <p className="text-gray-700">
                {mentions.director.content}
              </p>
            </div>
          </section>

          {/* 5. Hosting */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {mentions.hosting.title}
            </h2>
            <div className="bg-white superellipse-2xl border-2 border-gray-200 p-8">
              <p className="text-gray-700 mb-4">
                {mentions.hosting.content}
              </p>
              <div className="mt-4 pt-4 border-t-2 border-gray-200">
                <p className="text-gray-900 font-semibold mb-2">
                  {mentions.hosting.provider}
                </p>
                <p className="text-gray-700">
                  {mentions.hosting.providerAddress}
                </p>
              </div>
            </div>
          </section>

          {/* 6. Activity */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {mentions.activity.title}
            </h2>
            <div className="bg-purple-50 superellipse-2xl border-2 border-purple-200 p-8">
              <p className="text-gray-700 text-lg leading-relaxed">
                {mentions.activity.content}
              </p>
            </div>
          </section>

          {/* 7. Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {mentions.intellectualProperty.title}
            </h2>
            <div className="bg-white superellipse-2xl border-2 border-gray-200 p-8">
              <p className="text-gray-700 leading-relaxed">
                {mentions.intellectualProperty.content}
              </p>
            </div>
          </section>

          {/* 8. Dispute Resolution */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {mentions.disputes.title}
            </h2>
            <div className="bg-blue-50 superellipse-2xl border-2 border-blue-200 p-8">
              <p className="text-gray-700 leading-relaxed">
                {mentions.disputes.content}
              </p>
              <div className="mt-4 pt-4 border-t-2 border-blue-200">
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--easy-purple)] hover:underline font-medium"
                >
                  https://ec.europa.eu/consumers/odr/
                </a>
              </div>
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
