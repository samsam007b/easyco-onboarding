'use client';

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/use-language";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function SearcherIndex() {
  const { t } = useLanguage();

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-50">
        <LanguageSwitcher />
      </div>

      <h1 className="text-2xl font-bold">{t('onboarding.searcherIndex.title')}</h1>
      <div className="card space-y-3">
        <p>{t('onboarding.searcherIndex.description')}</p>
        <Link href="/onboarding/searcher/basic-info" className="btn btn-primary inline-block">
          {t('onboarding.searcherIndex.start')}
        </Link>
      </div>
    </main>
  );
}
