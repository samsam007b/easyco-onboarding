'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/auth/supabase-client';
import { motion } from 'framer-motion';
import LoadingHouse from '@/components/ui/LoadingHouse';
import {
  Receipt,
  Download,
  ArrowLeft,
  Calendar,
  Check,
  AlertCircle,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  created_at: string;
  pdf_url?: string;
  period_start?: string;
  period_end?: string;
}

export default function InvoicesPage() {
  const router = useRouter();
  const supabase = createClient();
  const { language, getSection } = useLanguage();
  const t = getSection('settings')?.invoices;
  const [isLoading, setIsLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [userType, setUserType] = useState<string>('');

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // Get user type
      const { data: userData } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (userData) {
        setUserType(userData.user_type);
      }

      // In production, this would fetch from Stripe via API
      // For now, we'll show a placeholder state
      // const { data: invoicesData } = await supabase
      //   .from('invoices')
      //   .select('*')
      //   .eq('user_id', user.id)
      //   .order('created_at', { ascending: false });

      // Simulated invoice data for trial users
      setInvoices([]);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    if (invoice.pdf_url) {
      window.open(invoice.pdf_url, '_blank');
    }
  };

  const handleOpenStripePortal = async () => {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening Stripe portal:', error);
      alert(t?.messages?.portalError?.[language] || 'Erreur lors de l\'ouverture du portail. Veuillez réessayer.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-100 text-green-800 text-xs font-semibold">
            <Check className="w-3 h-3" />
            {t?.status?.paid?.[language] || 'Payée'}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-100 text-yellow-800 text-xs font-semibold">
            <Calendar className="w-3 h-3" />
            {t?.status?.pending?.[language] || 'En attente'}
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-800 text-xs font-semibold">
            <AlertCircle className="w-3 h-3" />
            {t?.status?.failed?.[language] || 'Échec'}
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30">
        <div className="text-center">
          <LoadingHouse size={80} />
          <p className="text-gray-600 font-medium mt-4">{t?.loading?.[language] || 'Chargement...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30">
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-200/70 to-green-200/70 flex items-center justify-center shadow-sm">
              <Receipt className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{t?.title?.[language] || 'Factures'}</h1>
              <p className="text-gray-600">{t?.subtitle?.[language] || 'Historique et téléchargement de vos factures'}</p>
            </div>
          </div>
        </motion.div>

        {/* Stripe Portal Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Button
            onClick={handleOpenStripePortal}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            {t?.stripePortal?.button?.[language] || 'Accéder au portail de facturation Stripe'}
          </Button>
          <p className="text-sm text-gray-500 text-center mt-2">
            {t?.stripePortal?.description?.[language] || 'Gérez vos factures, moyens de paiement et abonnement directement sur Stripe'}
          </p>
        </motion.div>

        {/* Invoices List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {invoices.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t?.empty?.title?.[language] || 'Aucune facture'}</h3>
              <p className="text-gray-600 mb-4">
                {t?.empty?.description?.[language] || 'Vous êtes actuellement en période d\'essai gratuit. Vos factures apparaîtront ici une fois votre abonnement actif.'}
              </p>
              <Button
                onClick={() => router.push('/dashboard/subscription')}
                variant="outline"
                className="rounded-xl"
              >
                {t?.empty?.button?.[language] || 'Voir mon abonnement'}
              </Button>
            </div>
          ) : (
            invoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
                      <Receipt className="w-7 h-7 text-gray-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900">
                          Facture #{invoice.invoice_number}
                        </p>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(invoice.created_at)}
                        {invoice.period_start && invoice.period_end && (
                          <span className="ml-2">
                            · {t?.period?.[language] || 'Période'}: {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-xl font-bold text-gray-900">
                      {formatAmount(invoice.amount, invoice.currency)}
                    </p>
                    {invoice.pdf_url && (
                      <Button
                        onClick={() => handleDownloadInvoice(invoice)}
                        variant="outline"
                        size="sm"
                        className="rounded-xl"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-emerald-50 rounded-xl p-4 border border-emerald-200"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-emerald-900">
              <p className="font-semibold mb-1">{t?.info?.title?.[language] || 'Facturation automatique'}</p>
              <p className="text-emerald-700">
                {t?.info?.description?.[language] || 'Vos factures sont générées automatiquement à chaque renouvellement d\'abonnement. Elles sont disponibles au format PDF pour votre comptabilité.'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Subscription Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200"
        >
          <h3 className="font-bold text-gray-900 mb-3">{t?.billing?.title?.[language] || 'Informations de facturation'}</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-700">{t?.billing?.type?.[language] || 'Type d\'abonnement'}:</span>{' '}
              {userType === 'owner' ? 'Owner' : 'Resident'}
            </p>
            <p>
              <span className="font-medium text-gray-700">{t?.billing?.cycle?.[language] || 'Cycle de facturation'}:</span>{' '}
              {t?.billing?.monthly?.[language] || 'Mensuel'}
            </p>
            <p>
              <span className="font-medium text-gray-700">{t?.billing?.currency?.[language] || 'Devise'}:</span>{' '}
              EUR (€)
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Button
              onClick={() => router.push('/dashboard/subscription')}
              variant="outline"
              size="sm"
              className="rounded-xl"
            >
              {t?.billing?.manage?.[language] || 'Gérer mon abonnement'}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
