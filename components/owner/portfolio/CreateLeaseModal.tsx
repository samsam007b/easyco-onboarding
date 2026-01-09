'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileSignature,
  Calendar,
  Euro,
  Clock,
  User,
  Home,
  X,
  Sparkles,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { format, addMonths } from 'date-fns';
import { fr, enUS, nl, de, type Locale } from 'date-fns/locale';
import { ownerGradient } from '@/lib/constants/owner-theme';
import { useLanguage } from '@/lib/i18n/use-language';
import { leaseManagementService, type CreateLeaseFromApplicationData } from '@/lib/services/lease-management-service';
import { toast } from 'sonner';

export interface CreateLeaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (leaseId: string) => void;
  applicationData: {
    id: string;
    applicantId?: string;
    applicantName: string;
    applicantEmail?: string;
    applicantPhone?: string;
    propertyId: string;
    propertyTitle: string;
    moveInDate?: Date;
    monthlyRent?: number;
    leaseDurationMonths?: number;
  };
}

export function CreateLeaseModal({
  isOpen,
  onClose,
  onSuccess,
  applicationData,
}: CreateLeaseModalProps) {
  const { language, getSection } = useLanguage();
  const t = getSection('ownerLeases');

  // Date-fns locale mapping
  const dateLocaleMap: Record<string, Locale> = {
    fr, en: enUS, nl, de,
  };
  const dateLocale = dateLocaleMap[language] || fr;

  // Locale mapping for number formatting
  const localeMap: Record<string, string> = {
    fr: 'fr-FR', en: 'en-US', nl: 'nl-NL', de: 'de-DE',
  };

  // Dynamic lease durations with translations
  const getLeaseDurations = () => [
    { value: 6, label: t?.sixMonths?.[language] || '6 months' },
    { value: 12, label: t?.oneYear?.[language] || '1 year' },
    { value: 24, label: t?.twoYears?.[language] || '2 years' },
    { value: 36, label: t?.threeYears?.[language] || '3 years' },
  ];

  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [moveInDate, setMoveInDate] = useState<string>(
    applicationData.moveInDate
      ? format(applicationData.moveInDate, 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd')
  );
  const [leaseDuration, setLeaseDuration] = useState<number>(
    applicationData.leaseDurationMonths || 12
  );
  const [monthlyRent, setMonthlyRent] = useState<string>(
    applicationData.monthlyRent?.toString() || ''
  );
  const [depositAmount, setDepositAmount] = useState<string>('');

  // Calculate end date
  const endDate = addMonths(new Date(moveInDate), leaseDuration);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setMoveInDate(
        applicationData.moveInDate
          ? format(applicationData.moveInDate, 'yyyy-MM-dd')
          : format(new Date(), 'yyyy-MM-dd')
      );
      setLeaseDuration(applicationData.leaseDurationMonths || 12);
      setMonthlyRent(applicationData.monthlyRent?.toString() || '');
      setDepositAmount('');
    }
  }, [isOpen, applicationData]);

  const handleSubmit = async () => {
    if (!monthlyRent || Number(monthlyRent) <= 0) {
      toast.error(t?.pleaseEnterValidRent?.[language] || 'Please enter a valid monthly rent');
      return;
    }

    if (!applicationData.applicantId) {
      toast.error(t?.applicantIdMissing?.[language] || 'Applicant ID missing');
      return;
    }

    setIsCreating(true);

    const leaseData: CreateLeaseFromApplicationData = {
      applicationId: applicationData.id,
      propertyId: applicationData.propertyId,
      applicantId: applicationData.applicantId,
      applicantName: applicationData.applicantName,
      applicantEmail: applicationData.applicantEmail || '',
      applicantPhone: applicationData.applicantPhone,
      moveInDate: new Date(moveInDate),
      leaseDurationMonths: leaseDuration,
      monthlyRent: Number(monthlyRent),
      depositAmount: depositAmount ? Number(depositAmount) : undefined,
    };

    const result = await leaseManagementService.createLeaseFromApplication(leaseData);

    if (result.success) {
      toast.success(t?.leaseCreatedSuccess?.[language] || 'Lease created successfully!', {
        description: `${applicationData.applicantName} ${t?.isNowTenant?.[language] || 'is now a tenant'}`
      });
      onSuccess?.(result.leaseId || '');
      onClose();
    } else {
      toast.error(t?.errorCreatingLease?.[language] || 'Error creating lease', {
        description: result.error
      });
    }

    setIsCreating(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative overflow-hidden bg-white superellipse-3xl shadow-2xl max-w-lg w-full border border-gray-200"
        >
          {/* Header with gradient */}
          <div
            className="relative px-6 pt-6 pb-4"
            style={{ background: `linear-gradient(135deg, rgba(156,86,152,0.1), rgba(194,86,107,0.1))` }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="relative w-14 h-14 mb-4"
            >
              <motion.div
                className="absolute inset-0 superellipse-2xl opacity-30 blur-lg"
                style={{ background: ownerGradient }}
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <div
                className="relative w-full h-full superellipse-2xl flex items-center justify-center shadow-lg"
                style={{ background: ownerGradient }}
              >
                <FileSignature className="w-7 h-7 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{ y: [-2, 2, -2], rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <Sparkles className="w-4 h-4" style={{ color: '#9c5698' }} />
              </motion.div>
            </motion.div>

            <h2 className="text-xl font-bold text-gray-900">
              {t?.createLease?.[language] || 'Create lease'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {t?.convertApplicationToLease?.[language] || 'Convert approved application to rental contract'}
            </p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Applicant & Property Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 superellipse-xl p-3">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <User className="w-3.5 h-3.5" />
                  <span>{t?.tenant?.[language] || 'Tenant'}</span>
                </div>
                <p className="font-semibold text-gray-900 truncate">
                  {applicationData.applicantName}
                </p>
              </div>
              <div className="bg-gray-50 superellipse-xl p-3">
                <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                  <Home className="w-3.5 h-3.5" />
                  <span>{t?.property?.[language] || 'Property'}</span>
                </div>
                <p className="font-semibold text-gray-900 truncate">
                  {applicationData.propertyTitle}
                </p>
              </div>
            </div>

            {/* Move-in Date */}
            <div className="space-y-2">
              <Label htmlFor="moveInDate" className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                {t?.moveInDate?.[language] || 'Move-in date'}
              </Label>
              <Input
                id="moveInDate"
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="superellipse-xl"
              />
            </div>

            {/* Lease Duration */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                {t?.leaseDuration?.[language] || 'Lease duration'}
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {getLeaseDurations().map((duration) => (
                  <button
                    key={duration.value}
                    type="button"
                    onClick={() => setLeaseDuration(duration.value)}
                    className={cn(
                      'py-2 px-3 superellipse-xl text-sm font-medium transition-all border',
                      leaseDuration === duration.value
                        ? 'text-white border-transparent shadow-md'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-owner-300'
                    )}
                    style={
                      leaseDuration === duration.value
                        ? { background: ownerGradient }
                        : undefined
                    }
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {t?.expectedEnd?.[language] || 'Expected end'}: {format(endDate, 'd MMMM yyyy', { locale: dateLocale })}
              </p>
            </div>

            {/* Financial Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyRent" className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-gray-400" />
                  {t?.monthlyRent?.[language] || 'Monthly rent'} *
                </Label>
                <div className="relative">
                  <Input
                    id="monthlyRent"
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(e.target.value)}
                    placeholder="0"
                    className="superellipse-xl pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit" className="flex items-center gap-2">
                  <Euro className="w-4 h-4 text-gray-400" />
                  {t?.securityDeposit?.[language] || 'Security deposit'}
                </Label>
                <div className="relative">
                  <Input
                    id="deposit"
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0"
                    className="superellipse-xl pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                </div>
              </div>
            </div>

            {/* Summary Box */}
            <div
              className="superellipse-xl p-4"
              style={{ background: `linear-gradient(135deg, rgba(156,86,152,0.08), rgba(194,86,107,0.08))` }}
            >
              <h4 className="text-sm font-medium text-gray-700 mb-3">{t?.summary?.[language] || 'Summary'}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t?.annualRent?.[language] || 'Annual rent'}</span>
                  <span className="font-semibold" style={{ color: '#9c5698' }}>
                    {monthlyRent ? `${(Number(monthlyRent) * 12).toLocaleString(localeMap[language] || 'en-US')}€` : '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t?.totalDuration?.[language] || 'Total duration'}</span>
                  <span className="font-medium text-gray-900">{leaseDuration} {t?.months?.[language] || 'months'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isCreating}
              className="flex-1 superellipse-xl"
            >
              {t?.cancel?.[language] || 'Cancel'}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isCreating || !monthlyRent}
              className="flex-1 superellipse-xl text-white shadow-md"
              style={{ background: ownerGradient }}
            >
              {isCreating ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  {t?.creating?.[language] || 'Creating...'}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {t?.createLease?.[language] || 'Create lease'}
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
