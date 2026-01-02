'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  Receipt,
  Home,
  ClipboardList,
  Download,
  Calendar,
  User,
  Building2,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/auth/supabase-client';
import { toast } from 'sonner';
import {
  documentGenerationService,
  type RentReceiptData,
  type HousingAttestationData,
  type RentAttestationData,
} from '@/lib/services/document-generation-service';
import { ownerGradient } from '@/lib/constants/owner-theme';
import { cn } from '@/lib/utils';

// Types
type DocumentType = 'receipt' | 'housing' | 'rent';

interface TenantOption {
  id: string;
  name: string;
  email: string;
  phone?: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  propertyCity: string;
  propertyPostalCode: string;
  moveInDate: Date;
  monthlyRent: number;
  chargesAmount?: number;
}

interface DocumentsModalProps {
  open: boolean;
  onClose: () => void;
  ownerId: string;
  ownerName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  ownerAddress?: string;
  preselectedTenantId?: string;
  preselectedPropertyId?: string;
}

const documentTypes = [
  {
    id: 'receipt' as const,
    label: 'Quittance de loyer',
    description: 'Attestation de paiement du loyer mensuel',
    icon: Receipt,
  },
  {
    id: 'housing' as const,
    label: 'Attestation d\'hébergement',
    description: 'Certificat de résidence pour démarches administratives',
    icon: Home,
  },
  {
    id: 'rent' as const,
    label: 'Attestation de loyer',
    description: 'Document récapitulatif des conditions locatives',
    icon: ClipboardList,
  },
];

const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

export function DocumentsModal({
  open,
  onClose,
  ownerId,
  ownerName,
  ownerEmail,
  ownerPhone,
  ownerAddress,
  preselectedTenantId,
  preselectedPropertyId,
}: DocumentsModalProps) {
  const supabase = createClient();

  // State
  const [step, setStep] = useState<'type' | 'tenant' | 'details' | 'generating' | 'complete'>('type');
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [tenants, setTenants] = useState<TenantOption[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<TenantOption | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Receipt specific state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [rentAmount, setRentAmount] = useState<number>(0);
  const [chargesAmount, setChargesAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('Virement bancaire');

  // Attestation specific state
  const [purpose, setPurpose] = useState<string>('');

  // Load tenants when modal opens
  useEffect(() => {
    if (open) {
      loadTenants();
      resetForm();
    }
  }, [open]);

  // Pre-select tenant if provided
  useEffect(() => {
    if (preselectedTenantId && tenants.length > 0) {
      const tenant = tenants.find((t) => t.id === preselectedTenantId);
      if (tenant) {
        setSelectedTenant(tenant);
        setRentAmount(tenant.monthlyRent || 0);
        setChargesAmount(tenant.chargesAmount || 0);
      }
    } else if (preselectedPropertyId && tenants.length > 0) {
      const tenant = tenants.find((t) => t.propertyId === preselectedPropertyId);
      if (tenant) {
        setSelectedTenant(tenant);
        setRentAmount(tenant.monthlyRent || 0);
        setChargesAmount(tenant.chargesAmount || 0);
      }
    }
  }, [preselectedTenantId, preselectedPropertyId, tenants]);

  const loadTenants = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get owner's properties with active residents
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          address,
          city,
          postal_code,
          monthly_rent,
          property_residents!property_id (
            id,
            first_name,
            last_name,
            email,
            phone,
            move_in_date,
            monthly_rent,
            is_active
          )
        `)
        .eq('owner_id', ownerId);

      if (propError) throw propError;

      const tenantOptions: TenantOption[] = [];

      for (const prop of properties || []) {
        const residents = (prop.property_residents as any[]) || [];
        for (const resident of residents) {
          if (resident.is_active) {
            tenantOptions.push({
              id: resident.id,
              name: `${resident.first_name} ${resident.last_name}`,
              email: resident.email || '',
              phone: resident.phone,
              propertyId: prop.id,
              propertyTitle: prop.title,
              propertyAddress: prop.address || '',
              propertyCity: prop.city || '',
              propertyPostalCode: prop.postal_code || '',
              moveInDate: new Date(resident.move_in_date),
              monthlyRent: resident.monthly_rent || prop.monthly_rent || 0,
              chargesAmount: 0, // Would need to be fetched from lease or property data
            });
          }
        }
      }

      setTenants(tenantOptions);
    } catch (err) {
      console.error('[DocumentsModal] Error loading tenants:', err);
      setError('Impossible de charger les locataires');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep('type');
    setSelectedType(null);
    setSelectedTenant(null);
    setSelectedMonth(new Date().getMonth() + 1);
    setSelectedYear(new Date().getFullYear());
    setPaymentDate(new Date().toISOString().split('T')[0]);
    setRentAmount(0);
    setChargesAmount(0);
    setPaymentMethod('Virement bancaire');
    setPurpose('');
    setError(null);
  };

  const handleSelectType = (type: DocumentType) => {
    setSelectedType(type);
    if (tenants.length === 1) {
      // Auto-select if only one tenant
      setSelectedTenant(tenants[0]);
      setRentAmount(tenants[0].monthlyRent || 0);
      setChargesAmount(tenants[0].chargesAmount || 0);
      setStep('details');
    } else {
      setStep('tenant');
    }
  };

  const handleSelectTenant = (tenant: TenantOption) => {
    setSelectedTenant(tenant);
    setRentAmount(tenant.monthlyRent || 0);
    setChargesAmount(tenant.chargesAmount || 0);
    setStep('details');
  };

  const handleGenerate = async () => {
    if (!selectedType || !selectedTenant) return;

    setStep('generating');

    try {
      let blob: Blob;
      let filename: string;

      const owner = {
        name: ownerName,
        address: ownerAddress,
        phone: ownerPhone,
        email: ownerEmail,
      };

      const tenant = {
        firstName: selectedTenant.name.split(' ')[0] || '',
        lastName: selectedTenant.name.split(' ').slice(1).join(' ') || '',
        email: selectedTenant.email,
        phone: selectedTenant.phone,
      };

      const property = {
        title: selectedTenant.propertyTitle,
        address: selectedTenant.propertyAddress,
        city: selectedTenant.propertyCity,
        postalCode: selectedTenant.propertyPostalCode,
      };

      switch (selectedType) {
        case 'receipt': {
          const data: RentReceiptData = {
            tenant,
            property,
            owner,
            period: { month: selectedMonth, year: selectedYear },
            amounts: {
              rent: rentAmount,
              charges: chargesAmount,
              total: rentAmount + chargesAmount,
            },
            paymentDate: new Date(paymentDate),
            paymentMethod,
          };
          blob = documentGenerationService.generateRentReceipt(data);
          filename = documentGenerationService.generateReceiptFilename(
            selectedTenant.name,
            selectedMonth,
            selectedYear
          );
          break;
        }
        case 'housing': {
          const data: HousingAttestationData = {
            host: owner,
            guest: tenant,
            property,
            startDate: selectedTenant.moveInDate,
            reason: purpose || undefined,
          };
          blob = documentGenerationService.generateHousingAttestation(data);
          filename = documentGenerationService.generateAttestationFilename('housing', selectedTenant.name);
          break;
        }
        case 'rent': {
          const data: RentAttestationData = {
            tenant,
            property,
            owner,
            monthlyRent: rentAmount,
            chargesAmount,
            leaseStartDate: selectedTenant.moveInDate,
            purpose: purpose || undefined,
          };
          blob = documentGenerationService.generateRentAttestation(data);
          filename = documentGenerationService.generateAttestationFilename('rent', selectedTenant.name);
          break;
        }
        default:
          throw new Error('Type de document inconnu');
      }

      // Simulate slight delay for UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Download
      documentGenerationService.downloadDocument(blob, filename);
      setStep('complete');
      toast.success('Document généré avec succès');
    } catch (err) {
      console.error('[DocumentsModal] Error generating document:', err);
      toast.error('Erreur lors de la génération du document');
      setStep('details');
    }
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return [currentYear - 1, currentYear, currentYear + 1];
  };

  if (!open) return null;

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

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative overflow-hidden bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col"
        >
          {/* Decorative top accent */}
          <div className="absolute top-0 left-0 right-0 h-1" style={{ background: ownerGradient }} />

          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="relative w-12 h-12"
                >
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-30"
                    style={{ background: ownerGradient, filter: 'blur(10px)' }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <div
                    className="relative w-full h-full rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: ownerGradient }}
                  >
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </motion.div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900">Générer un document</h2>
                  <p className="text-sm text-gray-500">
                    {step === 'type' && 'Choisissez le type de document'}
                    {step === 'tenant' && 'Sélectionnez le locataire'}
                    {step === 'details' && 'Complétez les informations'}
                    {step === 'generating' && 'Génération en cours...'}
                    {step === 'complete' && 'Document prêt'}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step: Type Selection */}
            {step === 'type' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {documentTypes.map((docType) => (
                  <button
                    key={docType.id}
                    onClick={() => handleSelectType(docType.id)}
                    className="w-full p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all flex items-center gap-4 text-left group"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                      style={{ background: 'linear-gradient(135deg, rgba(156,86,152,0.1), rgba(194,86,107,0.1))' }}
                    >
                      <docType.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{docType.label}</p>
                      <p className="text-sm text-gray-500">{docType.description}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {/* Step: Tenant Selection */}
            {step === 'tenant' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  </div>
                ) : tenants.length === 0 ? (
                  <div className="text-center py-12">
                    <User className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Aucun locataire actif</p>
                  </div>
                ) : (
                  tenants.map((tenant) => (
                    <button
                      key={tenant.id}
                      onClick={() => handleSelectTenant(tenant)}
                      className="w-full p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all flex items-center gap-4 text-left group"
                    >
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                        {tenant.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{tenant.name}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {tenant.propertyTitle}
                        </p>
                      </div>
                    </button>
                  ))
                )}

                <Button
                  variant="ghost"
                  onClick={() => setStep('type')}
                  className="w-full mt-4"
                >
                  Retour
                </Button>
              </motion.div>
            )}

            {/* Step: Details */}
            {step === 'details' && selectedTenant && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Tenant Summary */}
                <div className="p-4 rounded-xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                      {selectedTenant.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedTenant.name}</p>
                      <p className="text-sm text-gray-500">{selectedTenant.propertyTitle}</p>
                    </div>
                  </div>
                </div>

                {/* Receipt-specific fields */}
                {selectedType === 'receipt' && (
                  <>
                    {/* Period */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Période
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <select
                          value={selectedMonth}
                          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                          className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {months.map((month, idx) => (
                            <option key={idx} value={idx + 1}>
                              {month}
                            </option>
                          ))}
                        </select>
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                          className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {getYearOptions().map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Payment Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de paiement
                      </label>
                      <input
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Amounts */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Loyer (€)
                        </label>
                        <input
                          type="number"
                          value={rentAmount}
                          onChange={(e) => setRentAmount(parseFloat(e.target.value) || 0)}
                          min={0}
                          step={0.01}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Charges (€)
                        </label>
                        <input
                          type="number"
                          value={chargesAmount}
                          onChange={(e) => setChargesAmount(parseFloat(e.target.value) || 0)}
                          min={0}
                          step={0.01}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mode de paiement
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option>Virement bancaire</option>
                        <option>Chèque</option>
                        <option>Espèces</option>
                        <option>Prélèvement automatique</option>
                      </select>
                    </div>

                    {/* Total */}
                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Total</span>
                        <span className="text-xl font-bold text-purple-600">
                          {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
                            rentAmount + chargesAmount
                          )}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Attestation-specific fields */}
                {(selectedType === 'housing' || selectedType === 'rent') && (
                  <>
                    {selectedType === 'rent' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Loyer (€)
                          </label>
                          <input
                            type="number"
                            value={rentAmount}
                            onChange={(e) => setRentAmount(parseFloat(e.target.value) || 0)}
                            min={0}
                            step={0.01}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Charges (€)
                          </label>
                          <input
                            type="number"
                            value={chargesAmount}
                            onChange={(e) => setChargesAmount(parseFloat(e.target.value) || 0)}
                            min={0}
                            step={0.01}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Motif / Destination (optionnel)
                      </label>
                      <input
                        type="text"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        placeholder="Ex: Constitution d'un dossier CAF"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Step: Generating */}
            {step === 'generating' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-12 text-center"
              >
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-purple-600 mb-4" />
                <p className="text-gray-600">Génération du document...</p>
              </motion.div>
            )}

            {/* Step: Complete */}
            {step === 'complete' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Document téléchargé
                </h3>
                <p className="text-gray-500 mb-6">
                  Votre document a été généré et téléchargé avec succès.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={resetForm} className="rounded-xl">
                    Générer un autre
                  </Button>
                  <Button
                    onClick={onClose}
                    className="rounded-xl text-white"
                    style={{ background: ownerGradient }}
                  >
                    Fermer
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          {(step === 'details') && (
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(tenants.length === 1 ? 'type' : 'tenant')}
                className="flex-1 rounded-xl"
              >
                Retour
              </Button>
              <Button
                onClick={handleGenerate}
                className="flex-1 rounded-xl text-white shadow-md"
                style={{ background: ownerGradient }}
              >
                <Download className="w-4 h-4 mr-2" />
                Générer le PDF
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default DocumentsModal;
