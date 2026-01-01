'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { BadgeCheck, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VerificationSettings from '@/components/settings/VerificationSettings';
import { useLanguage } from '@/lib/i18n/use-language';

export default function VerificationPage() {
  const router = useRouter();
  const { language, getSection } = useLanguage();
  const t = getSection('settings')?.verification;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={() => router.push('/settings')}
            variant="ghost"
            className="mb-4 rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t?.back?.[language] || 'Retour aux paramètres'}
          </Button>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-200/70 to-teal-200/70 flex items-center justify-center shadow-sm">
              <BadgeCheck className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {t?.title?.[language] || 'Vérifications'}
              </h1>
              <p className="text-gray-600">
                {t?.subtitle?.[language] || 'Renforcez la confiance de votre profil'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Verification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <VerificationSettings />
        </motion.div>
      </div>
    </div>
  );
}
