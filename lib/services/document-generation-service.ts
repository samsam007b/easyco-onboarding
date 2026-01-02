/**
 * Document Generation Service
 * Handles generation of legal documents for property management:
 * - Rent receipts (quittances de loyer)
 * - Housing attestations (attestations d'hébergement)
 * - Rent attestations (attestations de loyer)
 * - Lease summary documents
 */

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import jsPDF from 'jspdf';

// Types
export interface TenantInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface PropertyInfo {
  title: string;
  address: string;
  city: string;
  postalCode: string;
  type?: string;
}

export interface OwnerInfo {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface RentReceiptData {
  tenant: TenantInfo;
  property: PropertyInfo;
  owner: OwnerInfo;
  period: {
    month: number; // 1-12
    year: number;
  };
  amounts: {
    rent: number;
    charges: number;
    total: number;
  };
  paymentDate: Date;
  paymentMethod?: string;
  receiptNumber?: string;
}

export interface HousingAttestationData {
  host: OwnerInfo;
  guest: TenantInfo;
  property: PropertyInfo;
  startDate: Date;
  reason?: string;
}

export interface RentAttestationData {
  tenant: TenantInfo;
  property: PropertyInfo;
  owner: OwnerInfo;
  monthlyRent: number;
  chargesAmount: number;
  leaseStartDate: Date;
  purpose?: string;
}

export interface LeaseDocumentData {
  tenant: TenantInfo;
  property: PropertyInfo;
  owner: OwnerInfo;
  lease: {
    startDate: Date;
    durationMonths: number;
    monthlyRent: number;
    depositAmount: number;
    chargesAmount?: number;
  };
}

// Helper functions
const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

const formatDate = (date: Date): string =>
  format(date, "d MMMM yyyy", { locale: fr });

const formatMonth = (month: number, year: number): string => {
  const date = new Date(year, month - 1, 1);
  return format(date, "MMMM yyyy", { locale: fr });
};

const numberToWords = (n: number): string => {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt'];

  if (n === 0) return 'zéro';
  if (n < 0) return `moins ${numberToWords(-n)}`;

  if (n < 20) return units[n];
  if (n < 100) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    if (t === 7 || t === 9) {
      return `${tens[t]}-${units[10 + u]}`;
    }
    return u === 0 ? tens[t] : `${tens[t]}-${units[u]}`;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const remainder = n % 100;
    const prefix = h === 1 ? 'cent' : `${units[h]} cent`;
    return remainder === 0 ? prefix : `${prefix} ${numberToWords(remainder)}`;
  }
  if (n < 1000000) {
    const thousands = Math.floor(n / 1000);
    const remainder = n % 1000;
    const prefix = thousands === 1 ? 'mille' : `${numberToWords(thousands)} mille`;
    return remainder === 0 ? prefix : `${prefix} ${numberToWords(remainder)}`;
  }
  return n.toString();
};

class DocumentGenerationService {
  /**
   * Generate a rent receipt (quittance de loyer) PDF
   */
  generateRentReceipt(data: RentReceiptData): Blob {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // Header with owner info
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(data.owner.name, margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    if (data.owner.address) {
      doc.text(data.owner.address, margin, y);
      y += 5;
    }
    if (data.owner.phone) {
      doc.text(`Tél: ${data.owner.phone}`, margin, y);
      y += 5;
    }
    if (data.owner.email) {
      doc.text(`Email: ${data.owner.email}`, margin, y);
      y += 5;
    }

    // Receipt number and date (right aligned)
    const receiptDate = formatDate(new Date());
    const receiptNumber = data.receiptNumber || `QT-${data.period.year}${String(data.period.month).padStart(2, '0')}-${Date.now().toString().slice(-6)}`;
    doc.text(`N° ${receiptNumber}`, pageWidth - margin, 20, { align: 'right' });
    doc.text(`Le ${receiptDate}`, pageWidth - margin, 26, { align: 'right' });

    // Title
    y = 55;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('QUITTANCE DE LOYER', pageWidth / 2, y, { align: 'center' });

    y += 8;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(formatMonth(data.period.month, data.period.year).toUpperCase(), pageWidth / 2, y, { align: 'center' });

    // Tenant info
    y += 20;
    doc.setFontSize(11);
    doc.text('Reçu de:', margin, y);
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.tenant.firstName} ${data.tenant.lastName}`, margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.text(`Demeurant: ${data.property.address}`, margin, y);
    y += 5;
    doc.text(`${data.property.postalCode} ${data.property.city}`, margin, y);

    // Property description
    y += 15;
    doc.setFont('helvetica', 'bold');
    doc.text('Désignation des locaux:', margin, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.text(`${data.property.title}`, margin, y);
    y += 5;
    doc.text(`${data.property.address}, ${data.property.postalCode} ${data.property.city}`, margin, y);

    // Payment details
    y += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('Détail du règlement:', margin, y);
    y += 10;

    // Table header
    const col1 = margin;
    const col2 = 140;

    doc.setFont('helvetica', 'normal');
    doc.text('Loyer', col1, y);
    doc.text(formatCurrency(data.amounts.rent), col2, y);
    y += 7;

    doc.text('Provision pour charges', col1, y);
    doc.text(formatCurrency(data.amounts.charges), col2, y);
    y += 7;

    // Separator line
    doc.setLineWidth(0.5);
    doc.line(col1, y, col2 + 30, y);
    y += 7;

    // Total
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL', col1, y);
    doc.text(formatCurrency(data.amounts.total), col2, y);
    y += 5;

    // Amount in words
    y += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    const cents = Math.round((data.amounts.total % 1) * 100);
    const euros = Math.floor(data.amounts.total);
    let amountWords = `Soit ${numberToWords(euros)} euros`;
    if (cents > 0) {
      amountWords += ` et ${numberToWords(cents)} centimes`;
    }
    doc.text(amountWords, margin, y);

    // Payment info
    y += 15;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date de paiement: ${formatDate(data.paymentDate)}`, margin, y);
    if (data.paymentMethod) {
      y += 6;
      doc.text(`Mode de paiement: ${data.paymentMethod}`, margin, y);
    }

    // Legal mention
    y += 20;
    doc.setFontSize(10);
    doc.setTextColor(100);
    const legalText = `Cette quittance annule tous les reçus qui auraient pu être délivrés précédemment pour le même loyer. Elle ne libère pas le locataire des loyers antérieurs ou des charges impayées.`;
    const splitLegal = doc.splitTextToSize(legalText, pageWidth - (2 * margin));
    doc.text(splitLegal, margin, y);

    // Signature
    y += 30;
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text('Fait à ___________________', margin, y);
    doc.text(`Le ${receiptDate}`, margin + 80, y);
    y += 15;
    doc.text('Signature du bailleur:', margin, y);

    // Footer
    y = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text('Document généré par EasyCo - www.easyco.app', pageWidth / 2, y, { align: 'center' });

    return doc.output('blob');
  }

  /**
   * Generate a housing attestation (attestation d'hébergement) PDF
   */
  generateHousingAttestation(data: HousingAttestationData): Blob {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // Header
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(data.host.name, margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    if (data.host.address) {
      doc.text(data.host.address, margin, y);
      y += 5;
    }

    // Date (right aligned)
    const currentDate = formatDate(new Date());
    doc.text(`Fait le ${currentDate}`, pageWidth - margin, 20, { align: 'right' });

    // Title
    y = 55;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('ATTESTATION D\'HÉBERGEMENT', pageWidth / 2, y, { align: 'center' });

    // Body
    y += 25;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const bodyText = `Je soussigné(e), ${data.host.name}, atteste sur l'honneur héberger à mon domicile :`;
    doc.text(bodyText, margin, y);

    y += 15;
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.guest.firstName} ${data.guest.lastName}`, margin + 20, y);

    y += 15;
    doc.setFont('helvetica', 'normal');
    doc.text('À l\'adresse suivante :', margin, y);

    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.property.address}`, margin + 20, y);
    y += 6;
    doc.text(`${data.property.postalCode} ${data.property.city}`, margin + 20, y);

    y += 15;
    doc.setFont('helvetica', 'normal');
    doc.text(`Depuis le ${formatDate(data.startDate)}.`, margin, y);

    if (data.reason) {
      y += 10;
      const reasonText = `Cette attestation est établie pour servir et valoir ce que de droit, notamment pour : ${data.reason}.`;
      const splitReason = doc.splitTextToSize(reasonText, pageWidth - (2 * margin));
      doc.text(splitReason, margin, y);
      y += splitReason.length * 6;
    } else {
      y += 10;
      doc.text('Cette attestation est établie pour servir et valoir ce que de droit.', margin, y);
    }

    // Legal warning
    y += 25;
    doc.setFontSize(9);
    doc.setTextColor(100);
    const warningText = 'Attention : toute fausse attestation est passible de sanctions pénales (article 441-7 du Code pénal : un an d\'emprisonnement et 15 000 € d\'amende).';
    const splitWarning = doc.splitTextToSize(warningText, pageWidth - (2 * margin));
    doc.text(splitWarning, margin, y);

    // Signature
    y += 25;
    doc.setTextColor(0);
    doc.setFontSize(11);
    doc.text('Fait pour servir et valoir ce que de droit,', margin, y);
    y += 20;
    doc.text('Signature de l\'hébergeant :', margin, y);
    y += 5;
    doc.text('(précédée de la mention "Lu et approuvé")', margin, y);

    // Footer
    y = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text('Document généré par EasyCo - www.easyco.app', pageWidth / 2, y, { align: 'center' });

    return doc.output('blob');
  }

  /**
   * Generate a rent attestation (attestation de loyer) PDF
   */
  generateRentAttestation(data: RentAttestationData): Blob {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let y = 20;

    // Owner header
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(data.owner.name, margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    if (data.owner.address) {
      doc.text(data.owner.address, margin, y);
      y += 5;
    }
    if (data.owner.phone) {
      doc.text(`Tél: ${data.owner.phone}`, margin, y);
      y += 5;
    }

    // Date (right aligned)
    const currentDate = formatDate(new Date());
    doc.text(`Fait le ${currentDate}`, pageWidth - margin, 20, { align: 'right' });

    // Title
    y = 55;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('ATTESTATION DE LOYER', pageWidth / 2, y, { align: 'center' });

    // Body
    y += 25;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    doc.text('Je soussigné(e),', margin, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text(data.owner.name, margin + 20, y);
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.text('Propriétaire du logement situé :', margin, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.property.address}`, margin + 20, y);
    y += 6;
    doc.text(`${data.property.postalCode} ${data.property.city}`, margin + 20, y);

    y += 15;
    doc.setFont('helvetica', 'normal');
    doc.text('Atteste que :', margin, y);

    y += 12;
    doc.setFont('helvetica', 'bold');
    doc.text(`${data.tenant.firstName} ${data.tenant.lastName}`, margin + 20, y);

    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`Est locataire de ce logement depuis le ${formatDate(data.leaseStartDate)}.`, margin, y);

    // Rent details
    y += 15;
    doc.text('Le montant du loyer mensuel s\'élève à :', margin, y);
    y += 10;

    const col1 = margin + 20;
    const col2 = 140;

    doc.text('Loyer hors charges :', col1, y);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(data.monthlyRent), col2, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.text('Provision pour charges :', col1, y);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(data.chargesAmount), col2, y);
    y += 7;

    doc.setLineWidth(0.3);
    doc.line(col1, y, col2 + 30, y);
    y += 7;

    doc.setFont('helvetica', 'normal');
    doc.text('Total mensuel :', col1, y);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(data.monthlyRent + data.chargesAmount), col2, y);

    // Purpose
    y += 20;
    doc.setFont('helvetica', 'normal');
    if (data.purpose) {
      doc.text(`Cette attestation est établie pour : ${data.purpose}.`, margin, y);
    } else {
      doc.text('Cette attestation est établie pour servir et valoir ce que de droit.', margin, y);
    }

    // Signature
    y += 30;
    doc.text('Fait pour servir et valoir ce que de droit,', margin, y);
    y += 20;
    doc.text('Signature du propriétaire :', margin, y);

    // Footer
    y = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(128);
    doc.text('Document généré par EasyCo - www.easyco.app', pageWidth / 2, y, { align: 'center' });

    return doc.output('blob');
  }

  /**
   * Download a document as a file
   */
  downloadDocument(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Generate rent receipt filename
   */
  generateReceiptFilename(tenantName: string, month: number, year: number): string {
    const monthStr = String(month).padStart(2, '0');
    const sanitizedName = tenantName.replace(/[^a-zA-Z0-9]/g, '_');
    return `quittance_${sanitizedName}_${year}_${monthStr}.pdf`;
  }

  /**
   * Generate attestation filename
   */
  generateAttestationFilename(type: 'housing' | 'rent', tenantName: string): string {
    const sanitizedName = tenantName.replace(/[^a-zA-Z0-9]/g, '_');
    const date = format(new Date(), 'yyyy-MM-dd');
    return `attestation_${type === 'housing' ? 'hebergement' : 'loyer'}_${sanitizedName}_${date}.pdf`;
  }
}

export const documentGenerationService = new DocumentGenerationService();
