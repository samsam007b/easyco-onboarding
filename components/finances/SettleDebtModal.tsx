/**
 * Settle Debt Modal
 * Modal to help users settle debts with roommates
 * Provides Payconiq deep link, IBAN copy, and Revolut options
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Smartphone,
  Building2,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  Info,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getHookTranslation } from '@/lib/i18n/get-language';
import { createClient } from '@/lib/auth/supabase-client';

interface PayeeInfo {
  iban: string | null;
  iban_masked: string | null;
  bank_name: string | null;
  account_holder_name: string | null;
  revtag: string | null;
  payconiq_enabled: boolean;
}

interface SettleDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  payeeId: string;
  payeeName: string;
  amount: number;
  propertyId: string;
  onPaymentInitiated?: () => void;
}

// Payconiq deep link generator
function generatePayconiqLink(iban: string, amountCents: number, reference: string): string {
  // Remove spaces from IBAN
  const cleanIBAN = iban.replace(/\s/g, '');
  // Encode reference for URL
  const encodedRef = encodeURIComponent(reference);
  return `payconiq://payconiq.com/pay/2/${cleanIBAN}?amount=${amountCents}&reference=${encodedRef}`;
}

// Revolut deep link generator
function generateRevolutLink(revtag: string, amount: number): string {
  // Revolut uses me.revolut.com/request/{revtag}
  // Note: Direct payment links aren't publicly available, so we link to the profile
  const cleanTag = revtag.replace('@', '');
  return `https://revolut.me/${cleanTag}`;
}

// Format IBAN for display
function formatIBAN(iban: string): string {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
}

export default function SettleDebtModal({
  isOpen,
  onClose,
  payeeId,
  payeeName,
  amount,
  propertyId,
  onPaymentInitiated,
}: SettleDebtModalProps) {
  const supabase = createClient();
  const [payeeInfo, setPayeeInfo] = useState<PayeeInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedIBAN, setCopiedIBAN] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'payconiq' | 'bank' | 'revolut' | null>(null);
  const [showFullIBAN, setShowFullIBAN] = useState(false);
  const [isLoadingFullIBAN, setIsLoadingFullIBAN] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);

  // Load payee's bank info
  useEffect(() => {
    if (isOpen && payeeId) {
      loadPayeeInfo();
    }
  }, [isOpen, payeeId]);

  const loadPayeeInfo = async (showFull: boolean = false) => {
    if (!showFull) setIsLoading(true);
    else setIsLoadingFullIBAN(true);

    setRateLimitError(false);

    try {
      // Use the secure RPC function with rate limiting and audit logging
      const { data, error } = await supabase.rpc('get_roommate_payment_info_secure', {
        p_user_id: payeeId,
        p_show_full_iban: showFull,
      });

      if (error) {
        // Check for rate limit error
        if (error.message?.includes('Rate limit')) {
          setRateLimitError(true);
          toast.error(getHookTranslation('settle', 'tooManyRequests'), {
            description: getHookTranslation('settle', 'waitBeforeTrying'),
          });
          return;
        }
        throw error;
      }

      if (data && data.length > 0) {
        setPayeeInfo({
          iban: data[0].iban_display || null,
          iban_masked: data[0].iban_masked || null,
          bank_name: data[0].bank_name,
          account_holder_name: data[0].account_holder_name,
          revtag: data[0].revtag,
          payconiq_enabled: data[0].payconiq_enabled ?? true,
        });
        if (showFull) setShowFullIBAN(true);
      } else {
        setPayeeInfo(null);
      }
    } catch (error) {
      console.error('Error loading payee info:', error);
      setPayeeInfo(null);
    } finally {
      setIsLoading(false);
      setIsLoadingFullIBAN(false);
    }
  };

  const handleRevealFullIBAN = () => {
    loadPayeeInfo(true);
  };

  const handlePayconiqClick = async () => {
    // Need full IBAN for Payconiq deep link
    if (!payeeInfo?.iban && !showFullIBAN) {
      // First load the full IBAN
      setIsLoadingFullIBAN(true);
      try {
        const { data, error } = await supabase.rpc('get_roommate_payment_info_secure', {
          p_user_id: payeeId,
          p_show_full_iban: true,
        });

        if (error) throw error;

        if (data && data.length > 0 && data[0].iban_display) {
          const fullIBAN = data[0].iban_display;
          const amountCents = Math.round(Math.abs(amount) * 100);
          const reference = `Izzico - ${payeeName}`;
          const link = generatePayconiqLink(fullIBAN, amountCents, reference);

          window.location.href = link;
          setSelectedMethod('payconiq');
          setShowConfirmation(true);
          onPaymentInitiated?.();
        }
      } catch (error) {
        console.error('Error loading full IBAN:', error);
        toast.error(getHookTranslation('settle', 'loadError'));
      } finally {
        setIsLoadingFullIBAN(false);
      }
      return;
    }

    if (!payeeInfo?.iban) return;

    const amountCents = Math.round(Math.abs(amount) * 100);
    const reference = `Izzico - ${payeeName}`;
    const link = generatePayconiqLink(payeeInfo.iban, amountCents, reference);

    // Open Payconiq app
    window.location.href = link;

    setSelectedMethod('payconiq');
    setShowConfirmation(true);
    onPaymentInitiated?.();
  };

  const handleCopyIBAN = async () => {
    if (!payeeInfo?.iban) return;

    try {
      await navigator.clipboard.writeText(payeeInfo.iban);
      setCopiedIBAN(true);
      toast.success(getHookTranslation('settle', 'ibanCopied'));
      setTimeout(() => setCopiedIBAN(false), 3000);
    } catch {
      toast.error(getHookTranslation('settle', 'copyError'));
    }
  };

  const handleCopyAmount = async () => {
    try {
      await navigator.clipboard.writeText(Math.abs(amount).toFixed(2));
      setCopiedAmount(true);
      toast.success(getHookTranslation('settle', 'amountCopied'));
      setTimeout(() => setCopiedAmount(false), 3000);
    } catch {
      toast.error(getHookTranslation('settle', 'copyError'));
    }
  };

  const handleRevolutClick = () => {
    if (!payeeInfo?.revtag) return;

    const link = generateRevolutLink(payeeInfo.revtag, Math.abs(amount));
    window.open(link, '_blank');

    setSelectedMethod('revolut');
    setShowConfirmation(true);
    onPaymentInitiated?.();
  };

  const handleBankTransferClick = () => {
    setSelectedMethod('bank');
    setShowConfirmation(true);
    onPaymentInitiated?.();
  };

  const handleMarkAsPaid = async () => {
    try {
      // Create a payment settlement record
      const { data, error } = await supabase.rpc('create_payment_settlement', {
        p_payee_id: payeeId,
        p_property_id: propertyId,
        p_amount: Math.abs(amount),
        p_description: `Payment via ${selectedMethod === 'payconiq' ? 'Payconiq' : selectedMethod === 'revolut' ? 'Revolut' : 'bank transfer'}`,
        p_payment_method: selectedMethod === 'payconiq' ? 'payconiq' : selectedMethod === 'revolut' ? 'revolut' : 'bank_transfer',
      });

      if (error) throw error;

      toast.success(getHookTranslation('settle', 'paymentReported'), {
        description: `${payeeName} ${getHookTranslation('settle', 'willNotify')}`,
      });
      onClose();
    } catch (error: any) {
      console.error('Error marking as paid:', error);
      toast.error(getHookTranslation('settle', 'error'), { description: error.message });
    }
  };

  const hasNoPaymentMethods = !payeeInfo?.iban && !payeeInfo?.iban_masked && !payeeInfo?.revtag;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className="w-10 h-10 superellipse-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7CB89B, #9ECDB5)' }}
            >
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg">Settle my debt</span>
              <Badge className="ml-2 bg-red-100 text-red-700 border-none">
                €{Math.abs(amount).toFixed(2)}
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            Send €{Math.abs(amount).toFixed(2)} to {payeeName}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center"
            >
              <div className="w-8 h-8 border-2 border-gray-300 border-t-[#7CB89B] rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-500 mt-3">Loading information...</p>
            </motion.div>
          ) : hasNoPaymentMethods ? (
            <motion.div
              key="no-methods"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="py-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No payment details available
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {payeeName} hasn't added their bank details yet.
                Ask them to add their IBAN in their settings!
              </p>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </motion.div>
          ) : showConfirmation ? (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-6"
            >
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4"
                >
                  <Sparkles className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Payment completed?
                </h3>
                <p className="text-sm text-gray-500">
                  If you've sent €{Math.abs(amount).toFixed(2)} to {payeeName},
                  report it so they can confirm receipt.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleMarkAsPaid}
                  className="w-full h-12 superellipse-xl text-white font-semibold"
                  style={{ background: 'linear-gradient(135deg, #7CB89B, #6BA888)' }}
                >
                  <Check className="w-5 h-5 mr-2" />
                  I've paid - Notify {payeeName}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  className="w-full"
                >
                  Back to options
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="options"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Payconiq Option */}
              {(payeeInfo?.iban || payeeInfo?.iban_masked) && payeeInfo?.payconiq_enabled && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayconiqClick}
                  disabled={isLoadingFullIBAN}
                  className="w-full p-4 superellipse-xl border-2 border-[#FF4785]/30 bg-gradient-to-r from-[#FF4785]/10 to-[#FF4785]/5 hover:border-[#FF4785]/50 transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 superellipse-xl bg-[#FF4785] flex items-center justify-center shadow-lg">
                      {isLoadingFullIBAN ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span className="text-white font-bold text-xl">P</span>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">Payconiq</span>
                        <Badge className="bg-[#FF4785]/20 text-[#FF4785] border-none text-xs">
                          Recommended
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {isLoadingFullIBAN ? 'Loading...' : "Open the app and pay in 2 clicks"}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#FF4785] transition-colors" />
                  </div>
                </motion.button>
              )}

              {/* Bank Transfer Option */}
              {(payeeInfo?.iban || payeeInfo?.iban_masked) && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 superellipse-xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className="w-12 h-12 superellipse-xl flex items-center justify-center shadow-lg"
                      style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
                    >
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-gray-900">Bank transfer</span>
                      <p className="text-sm text-gray-500">
                        {showFullIBAN ? "Copy the IBAN and make a transfer" : "Reveal the full IBAN to copy"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* IBAN - Masked or Full */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2 bg-white superellipse-lg border border-gray-200 font-mono text-sm">
                        {showFullIBAN && payeeInfo.iban
                          ? formatIBAN(payeeInfo.iban)
                          : payeeInfo.iban_masked || '•••• •••• •••• ••••'}
                      </div>
                      {showFullIBAN && payeeInfo.iban ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyIBAN}
                          className={cn(
                            'h-9 px-3 transition-all',
                            copiedIBAN && 'bg-green-50 border-green-200 text-green-700'
                          )}
                        >
                          {copiedIBAN ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRevealFullIBAN}
                          disabled={isLoadingFullIBAN}
                          className="h-9 px-3 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                        >
                          {isLoadingFullIBAN ? (
                            <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                          ) : (
                            'Reveal'
                          )}
                        </Button>
                      )}
                    </div>

                    {/* Amount */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2 bg-white superellipse-lg border border-gray-200 text-sm">
                        <span className="text-gray-500">Amount:</span>{' '}
                        <span className="font-semibold">€{Math.abs(amount).toFixed(2)}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyAmount}
                        className={cn(
                          'h-9 px-3 transition-all',
                          copiedAmount && 'bg-green-50 border-green-200 text-green-700'
                        )}
                      >
                        {copiedAmount ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>

                    {/* Bank name & holder */}
                    {(payeeInfo.bank_name || payeeInfo.account_holder_name) && (
                      <div className="px-3 py-2 bg-white/50 superellipse-lg text-xs text-gray-500">
                        {payeeInfo.account_holder_name && (
                          <span>{payeeInfo.account_holder_name}</span>
                        )}
                        {payeeInfo.bank_name && (
                          <span className="ml-2">• {payeeInfo.bank_name}</span>
                        )}
                      </div>
                    )}

                    <Button
                      onClick={handleBankTransferClick}
                      variant="outline"
                      className="w-full mt-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    >
                      I've made the transfer
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Revolut Option */}
              {payeeInfo?.revtag && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRevolutClick}
                  className="w-full p-4 superellipse-xl border-2 border-gray-200 hover:border-gray-300 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 superellipse-xl bg-black flex items-center justify-center">
                      <span className="text-white font-bold text-xl">R</span>
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-bold text-gray-900">Revolut</span>
                      <p className="text-sm text-gray-500">
                        @{payeeInfo.revtag.replace('@', '')}
                      </p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </motion.button>
              )}

              {/* Info box */}
              <div className="flex items-start gap-3 p-3 bg-blue-50 superellipse-xl border border-blue-100">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800">
                  These payments are made directly between you, outside of the app.
                  Izzico simply facilitates the exchange of information.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
