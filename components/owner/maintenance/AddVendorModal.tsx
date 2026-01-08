'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UserPlus,
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Loader2,
  CheckCircle,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  vendorService,
  vendorCategoryLabels,
  type CreateVendorData,
  type VendorCategory,
} from '@/lib/services/vendor-service';
import { ownerGradient } from '@/lib/constants/owner-theme';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/use-language';

interface AddVendorModalProps {
  open: boolean;
  onClose: () => void;
  onVendorAdded?: () => void;
  preselectedCategory?: VendorCategory;
}

const categoryOptions: VendorCategory[] = [
  'plumbing',
  'electrical',
  'heating',
  'appliances',
  'structural',
  'cleaning',
  'pest_control',
  'locksmith',
  'painting',
  'gardening',
  'general',
  'other',
];

export function AddVendorModal({
  open,
  onClose,
  onVendorAdded,
  preselectedCategory,
}: AddVendorModalProps) {
  const { language, getSection } = useLanguage();
  const t = getSection('ownerMaintenance');

  const [formData, setFormData] = useState<CreateVendorData>({
    name: '',
    companyName: '',
    category: preselectedCategory || 'general',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    siret: '',
    notes: '',
    isFavorite: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t?.nameRequired?.[language] || 'Name is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t?.invalidEmail?.[language] || 'Invalid email';
    }

    if (formData.phone && !/^[\d\s+()-]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t?.invalidPhone?.[language] || 'Invalid phone number';
    }

    if (formData.siret && !/^\d{14}$/.test(formData.siret.replace(/\s/g, ''))) {
      newErrors.siret = t?.invalidSiret?.[language] || 'SIRET must contain 14 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await (await import('@/lib/auth/supabase-client')).createClient().auth.getUser();

      if (!user) {
        toast.error(t?.mustBeLoggedIn?.[language] || 'You must be logged in');
        return;
      }

      const result = await vendorService.createVendor(user.id, formData);

      if (result) {
        setIsSubmitted(true);
        toast.success(t?.vendorAdded?.[language] || 'Vendor added');
        setTimeout(() => {
          onVendorAdded?.();
          onClose();
          // Reset form
          setFormData({
            name: '',
            companyName: '',
            category: preselectedCategory || 'general',
            phone: '',
            email: '',
            address: '',
            city: '',
            postalCode: '',
            siret: '',
            notes: '',
            isFavorite: false,
          });
          setIsSubmitted(false);
        }, 1500);
      } else {
        toast.error(t?.errorAddingVendor?.[language] || 'Error adding vendor');
      }
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast.error(t?.errorAddingVendor?.[language] || 'Error adding vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const updateField = <K extends keyof CreateVendorData>(field: K, value: CreateVendorData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-lg mx-4 bg-white superellipse-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div
            className="px-6 py-4 text-white"
            style={{ background: ownerGradient }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 superellipse-xl bg-white/20 flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg">{t?.addVendor?.[language] || 'Add a vendor'}</h2>
                  <p className="text-white/80 text-sm">{t?.registerNewVendor?.[language] || 'Register a new vendor'}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ background: ownerGradient }}
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t?.vendorAddedTitle?.[language] || 'Vendor added!'}
                </h3>
                <p className="text-gray-600">
                  {formData.name} {t?.addedToDirectory?.[language] || 'has been added to your directory.'}
                </p>
              </motion.div>
            ) : (
              <>
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t?.vendorName?.[language] || 'Vendor name'} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder={t?.vendorNamePlaceholder?.[language] || 'Ex: John Smith'}
                        className={cn(
                          'w-full pl-10 pr-4 py-2 border superellipse-xl focus:outline-none focus:ring-2 focus:ring-owner-200 focus:border-owner-400',
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        )}
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t?.companyName?.[language] || 'Company name'}
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.companyName || ''}
                        onChange={(e) => updateField('companyName', e.target.value)}
                        placeholder={t?.companyNamePlaceholder?.[language] || 'Ex: Plumbing Express LLC'}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 superellipse-xl focus:outline-none focus:ring-2 focus:ring-owner-200 focus:border-owner-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t?.specialty?.[language] || 'Specialty'} <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => updateField('category', cat)}
                        className={cn(
                          'px-3 py-2 text-xs font-medium superellipse-lg border transition-all',
                          formData.category === cat
                            ? 'border-owner-500 bg-owner-50 text-owner-700'
                            : 'border-gray-200 hover:border-owner-300 text-gray-600'
                        )}
                      >
                        {vendorCategoryLabels[cat]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t?.phone?.[language] || 'Phone'}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="06 12 34 56 78"
                        className={cn(
                          'w-full pl-10 pr-4 py-2 border superellipse-xl focus:outline-none focus:ring-2 focus:ring-owner-200 focus:border-owner-400',
                          errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        )}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t?.email?.[language] || 'Email'}
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => updateField('email', e.target.value)}
                        placeholder="contact@example.com"
                        className={cn(
                          'w-full pl-10 pr-4 py-2 border superellipse-xl focus:outline-none focus:ring-2 focus:ring-owner-200 focus:border-owner-400',
                          errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        )}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t?.address?.[language] || 'Address'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.address || ''}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder={t?.addressPlaceholder?.[language] || '123 Example Street'}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 superellipse-xl focus:outline-none focus:ring-2 focus:ring-owner-200 focus:border-owner-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t?.city?.[language] || 'City'}
                    </label>
                    <input
                      type="text"
                      value={formData.city || ''}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder={t?.cityPlaceholder?.[language] || 'Paris'}
                      className="w-full px-4 py-2 border border-gray-200 superellipse-xl focus:outline-none focus:ring-2 focus:ring-owner-200 focus:border-owner-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t?.postalCode?.[language] || 'Postal code'}
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode || ''}
                      onChange={(e) => updateField('postalCode', e.target.value)}
                      placeholder="75001"
                      className="w-full px-4 py-2 border border-gray-200 superellipse-xl focus:outline-none focus:ring-2 focus:ring-owner-200 focus:border-owner-400"
                    />
                  </div>
                </div>

                {/* Business Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t?.siretNumber?.[language] || 'SIRET Number'}
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.siret || ''}
                      onChange={(e) => updateField('siret', e.target.value)}
                      placeholder="12345678901234"
                      className={cn(
                        'w-full pl-10 pr-4 py-2 border superellipse-xl focus:outline-none focus:ring-2 focus:ring-owner-200 focus:border-owner-400',
                        errors.siret ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      )}
                    />
                  </div>
                  {errors.siret && <p className="text-red-500 text-xs mt-1">{errors.siret}</p>}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t?.notes?.[language] || 'Notes'}
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder={t?.notesPlaceholder?.[language] || 'Personal notes about this vendor...'}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 superellipse-xl focus:outline-none focus:ring-2 focus:ring-owner-200 focus:border-owner-400 resize-none"
                  />
                </div>

                {/* Favorite */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFavorite"
                    checked={formData.isFavorite}
                    onChange={(e) => updateField('isFavorite', e.target.checked)}
                    className="w-4 h-4 text-owner-600 border-gray-300 rounded focus:ring-owner-500"
                  />
                  <label htmlFor="isFavorite" className="text-sm text-gray-700">
                    {t?.addToFavorites?.[language] || 'Add to favorites'}
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {!isSubmitted && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-full"
              >
                {t?.cancel?.[language] || 'Cancel'}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.name.trim()}
                className="rounded-full text-white"
                style={{ background: ownerGradient }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t?.adding?.[language] || 'Adding...'}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t?.add?.[language] || 'Add'}
                  </>
                )}
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
