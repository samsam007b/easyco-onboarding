'use client';

import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/use-language';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function CookiePolicyPage() {
  const { getSection } = useLanguage();
  const legal = getSection('legal');
  const cookies = legal.cookies;
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
            <Cookie className="w-8 h-8 text-[var(--easy-purple)]" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {cookies.title}
          </h1>
          <p className="text-xl text-gray-600">
            {cookies.subtitle}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {/* Introduction */}
          <div className="bg-white superellipse-2xl border-2 border-gray-200 p-8 mb-8">
            <p className="text-gray-700 leading-relaxed">
              {cookies.intro}
            </p>
          </div>

          {/* 1. What is a Cookie? */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {cookies.whatAre.title}
            </h2>
            <p className="text-gray-700">
              {cookies.whatAre.content}
            </p>
          </section>

          {/* 2. Types of Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {cookies.types.title}
            </h2>

            {/* Essential Cookies */}
            <div className="bg-green-50 border-2 border-green-200 superellipse-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-green-600">✓</span> {cookies.types.essential.title}
              </h3>
              <p className="text-gray-700 mb-3">
                {cookies.types.essential.content}
              </p>
              <p className="text-sm text-gray-600 italic">
                {cookies.types.essential.examples}
              </p>
            </div>

            {/* Functional Cookies */}
            <div className="bg-blue-50 border-2 border-blue-200 superellipse-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {cookies.types.functional.title}
              </h3>
              <p className="text-gray-700 mb-3">
                {cookies.types.functional.content}
              </p>
              <p className="text-sm text-gray-600 italic">
                {cookies.types.functional.examples}
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="bg-purple-50 border-2 border-purple-200 superellipse-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {cookies.types.analytics.title}
              </h3>
              <p className="text-gray-700 mb-3">
                {cookies.types.analytics.content}
              </p>
              <p className="text-sm text-gray-600 italic">
                {cookies.types.analytics.examples}
              </p>
            </div>

            {/* Marketing Cookies */}
            <div className="bg-yellow-50 border-2 border-yellow-200 superellipse-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {cookies.types.marketing.title}
              </h3>
              <p className="text-gray-700 mb-3">
                {cookies.types.marketing.content}
              </p>
              <p className="text-sm text-gray-600 italic">
                {cookies.types.marketing.examples}
              </p>
            </div>
          </section>

          {/* 3. Cookies We Use */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {cookies.ourCookies.title}
            </h2>
            <p className="text-gray-700 mb-6">
              {cookies.ourCookies.content}
            </p>
            <div className="bg-white superellipse-2xl border-2 border-gray-200 p-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-purple)] rounded-full mt-2"></div>
                <p className="text-gray-700 font-mono text-sm">{cookies.ourCookies.session}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-purple)] rounded-full mt-2"></div>
                <p className="text-gray-700 font-mono text-sm">{cookies.ourCookies.language}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-purple)] rounded-full mt-2"></div>
                <p className="text-gray-700 font-mono text-sm">{cookies.ourCookies.consent}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-purple)] rounded-full mt-2"></div>
                <p className="text-gray-700 font-mono text-sm">{cookies.ourCookies.analytics}</p>
              </div>
            </div>
          </section>

          {/* 4. Third-Party Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {cookies.thirdParty.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {cookies.thirdParty.content}
            </p>
            <ul className="space-y-3 ml-6">
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {cookies.thirdParty.google}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {cookies.thirdParty.auth}
              </li>
              <li className="text-gray-700">
                <span className="text-[var(--easy-purple)] font-semibold">•</span> {cookies.thirdParty.payment}
              </li>
            </ul>
          </section>

          {/* 5. Managing Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {cookies.management.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {cookies.management.content}
            </p>
            <div className="bg-purple-50 border-2 border-purple-200 superellipse-xl p-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-purple)] rounded-full mt-2"></div>
                <p className="text-gray-700">{cookies.management.banner}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-purple)] rounded-full mt-2"></div>
                <p className="text-gray-700">{cookies.management.settings}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[var(--easy-purple)] rounded-full mt-2"></div>
                <p className="text-gray-700">{cookies.management.browser}</p>
              </div>
            </div>
          </section>

          {/* 6. Browser Settings */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {cookies.browserSettings.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {cookies.browserSettings.content}
            </p>
            <div className="bg-white superellipse-2xl border-2 border-gray-200 p-8 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <p className="text-gray-700">{cookies.browserSettings.chrome}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <p className="text-gray-700">{cookies.browserSettings.firefox}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <p className="text-gray-700">{cookies.browserSettings.safari}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                <p className="text-gray-700">{cookies.browserSettings.edge}</p>
              </div>
            </div>
          </section>

          {/* 7. Impact of Refusing Cookies */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {cookies.impact.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {cookies.impact.content}
            </p>
            <div className="space-y-4">
              <div className="bg-red-50 border-2 border-red-200 superellipse-xl p-4">
                <p className="text-gray-700">
                  <strong className="text-red-700">⚠️ {cookies.types.essential.title}:</strong>{' '}
                  {cookies.impact.essential}
                </p>
              </div>
              <div className="bg-yellow-50 border-2 border-yellow-200 superellipse-xl p-4">
                <p className="text-gray-700">
                  <strong className="text-yellow-700">⚡ {cookies.types.functional.title}:</strong>{' '}
                  {cookies.impact.functional}
                </p>
              </div>
              <div className="bg-blue-50 border-2 border-blue-200 superellipse-xl p-4">
                <p className="text-gray-700">
                  <strong className="text-blue-700">📊 {cookies.types.analytics.title}:</strong>{' '}
                  {cookies.impact.analytics}
                </p>
              </div>
              <div className="bg-purple-50 border-2 border-purple-200 superellipse-xl p-4">
                <p className="text-gray-700">
                  <strong className="text-purple-700">📢 {cookies.types.marketing.title}:</strong>{' '}
                  {cookies.impact.marketing}
                </p>
              </div>
            </div>
          </section>

          {/* 8. Updates */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {cookies.updates.title}
            </h2>
            <p className="text-gray-700">
              {cookies.updates.content}
            </p>
          </section>

          {/* 9. Contact */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {cookies.contact.title}
            </h2>
            <p className="text-gray-700 mb-4">
              {cookies.contact.content}
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
