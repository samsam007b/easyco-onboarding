/**
 * Lease Document Service
 * Handles generating and downloading lease contract PDFs
 *
 * Uses iframe + srcdoc for secure PDF generation (avoids document.write)
 */

export interface LeaseDocumentData {
  leaseId: string;
  propertyTitle: string;
  propertyAddress: string;
  ownerName?: string;
  tenantName: string;
  monthlyRent: number;
  deposit?: number;
  startDate: Date;
  endDate: Date;
  durationMonths: number;
  signedAt?: Date;
  terms?: string;
}

/**
 * Generate PDF directly from lease data (client-side only)
 * Uses the print dialog to create a PDF
 */
export function generateLeasePDF(data: LeaseDocumentData): void {
  if (typeof window === 'undefined') {
    console.error('[LeaseDocument] generateLeasePDF must be called client-side');
    return;
  }

  const html = generateLeaseHTML(data);

  // Create hidden iframe for printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';

  // Use srcdoc for security (avoids document.write)
  iframe.srcdoc = html;

  document.body.appendChild(iframe);

  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow?.print();
      // Clean up after print dialog closes
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }, 250);
  };
}

/**
 * Main entry point - generate PDF from lease data
 */
export function downloadLeaseDocument(data: LeaseDocumentData): { success: boolean; error?: string } {
  try {
    generateLeasePDF(data);
    return { success: true };
  } catch (error) {
    console.error('[LeaseDocument] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

/**
 * Generate lease contract HTML for PDF
 */
function generateLeaseHTML(data: LeaseDocumentData): string {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Contrat de Location - ${escapeHtml(data.propertyTitle)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #9c5698;
    }
    .header h1 {
      color: #9c5698;
      font-size: 28px;
      margin-bottom: 8px;
    }
    .header p {
      color: #6b7280;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section-title {
      color: #9c5698;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #e5e7eb;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .info-item {
      background: #f9fafb;
      padding: 15px;
      border-radius: 8px;
    }
    .info-label {
      color: #6b7280;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .info-value {
      color: #1f2937;
      font-size: 16px;
      font-weight: 500;
    }
    .financial-box {
      background: linear-gradient(135deg, rgba(156,86,152,0.1), rgba(194,86,107,0.1));
      padding: 25px;
      border-radius: 12px;
      margin: 20px 0;
    }
    .financial-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid rgba(156,86,152,0.2);
    }
    .financial-row:last-child {
      border-bottom: none;
    }
    .financial-label {
      color: #4b5563;
    }
    .financial-value {
      color: #9c5698;
      font-weight: 600;
      font-size: 18px;
    }
    .terms {
      background: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      font-size: 14px;
      white-space: pre-wrap;
    }
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 60px;
    }
    .signature-box {
      border-top: 2px solid #1f2937;
      padding-top: 15px;
    }
    .signature-label {
      color: #6b7280;
      font-size: 12px;
      margin-bottom: 5px;
    }
    .signature-name {
      font-weight: 600;
    }
    .footer {
      margin-top: 60px;
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    @media print {
      body { padding: 20px; }
      .header { page-break-after: avoid; }
      .section { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>CONTRAT DE LOCATION</h1>
    <p>Établi via EasyCo</p>
  </div>

  <div class="section">
    <h2 class="section-title">Bien Loué</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Désignation</div>
        <div class="info-value">${escapeHtml(data.propertyTitle)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Adresse</div>
        <div class="info-value">${escapeHtml(data.propertyAddress) || 'Non renseignée'}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Parties au Contrat</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Propriétaire (Bailleur)</div>
        <div class="info-value">${escapeHtml(data.ownerName || 'Propriétaire')}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Locataire (Preneur)</div>
        <div class="info-value">${escapeHtml(data.tenantName)}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Durée du Bail</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Date de début</div>
        <div class="info-value">${formatDate(data.startDate)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Date de fin</div>
        <div class="info-value">${formatDate(data.endDate)}</div>
      </div>
    </div>
    <div class="info-item" style="margin-top: 15px;">
      <div class="info-label">Durée totale</div>
      <div class="info-value">${data.durationMonths} mois</div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Conditions Financières</h2>
    <div class="financial-box">
      <div class="financial-row">
        <span class="financial-label">Loyer mensuel (hors charges)</span>
        <span class="financial-value">${formatCurrency(data.monthlyRent)}</span>
      </div>
      ${data.deposit ? `
      <div class="financial-row">
        <span class="financial-label">Dépôt de garantie</span>
        <span class="financial-value">${formatCurrency(data.deposit)}</span>
      </div>
      ` : ''}
      <div class="financial-row">
        <span class="financial-label">Loyer annuel</span>
        <span class="financial-value">${formatCurrency(data.monthlyRent * 12)}</span>
      </div>
    </div>
  </div>

  ${data.terms ? `
  <div class="section">
    <h2 class="section-title">Conditions Particulières</h2>
    <div class="terms">${escapeHtml(data.terms)}</div>
  </div>
  ` : ''}

  <div class="signatures">
    <div class="signature-box">
      <div class="signature-label">Le Bailleur</div>
      <div class="signature-name">${escapeHtml(data.ownerName || 'Propriétaire')}</div>
      ${data.signedAt ? `<div style="color: #10b981; font-size: 12px; margin-top: 8px;">✓ Signé le ${formatDate(data.signedAt)}</div>` : '<div style="color: #6b7280; font-size: 12px; margin-top: 40px;">Signature:</div>'}
    </div>
    <div class="signature-box">
      <div class="signature-label">Le Locataire</div>
      <div class="signature-name">${escapeHtml(data.tenantName)}</div>
      ${data.signedAt ? `<div style="color: #10b981; font-size: 12px; margin-top: 8px;">✓ Signé le ${formatDate(data.signedAt)}</div>` : '<div style="color: #6b7280; font-size: 12px; margin-top: 40px;">Signature:</div>'}
    </div>
  </div>

  <div class="footer">
    <p>Document généré le ${formatDate(new Date())} via EasyCo</p>
    <p>Référence: ${data.leaseId}</p>
  </div>
</body>
</html>
  `;
}

/**
 * Escape HTML special characters (string-based for safety)
 */
function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
