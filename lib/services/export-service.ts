/**
 * Export Service
 * Handles CSV and PDF export functionality for finance and other data
 */

// CSV Export with BOM for Excel compatibility
export function exportToCSV(data: Record<string, unknown>[], filename: string, headers?: string[]): void {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const keys = headers || Object.keys(data[0]);

  // Create CSV content with BOM for Excel
  const BOM = '\uFEFF';
  const csvContent = [
    keys.join(';'), // Header row (semicolon for French Excel)
    ...data.map(row =>
      keys.map(key => {
        const value = row[key];
        // Handle different types and escape quotes
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
        if (typeof value === 'number') return value.toString().replace('.', ','); // French decimal
        return String(value);
      }).join(';')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

// Finance-specific CSV export
export interface FinanceExportData {
  payments: PaymentExportRecord[];
  summary: {
    totalCollected: number;
    totalExpected: number;
    totalOverdue: number;
    collectionRate: number;
  };
  period: string;
}

export interface PaymentExportRecord {
  date: string;
  tenant: string;
  property: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod?: string;
}

export function exportFinanceToCSV(data: FinanceExportData): void {
  const statusLabels: Record<string, string> = {
    paid: 'Payé',
    pending: 'En attente',
    overdue: 'En retard'
  };

  const csvData = data.payments.map(p => ({
    'Date': p.date,
    'Locataire': p.tenant,
    'Propriété': p.property,
    'Montant': p.amount,
    'Statut': statusLabels[p.status] || p.status,
    'Méthode': p.paymentMethod || '-'
  }));

  // Add summary row
  csvData.push({
    'Date': '',
    'Locataire': '',
    'Propriété': 'TOTAL',
    'Montant': data.summary.totalCollected,
    'Statut': `Taux: ${data.summary.collectionRate}%`,
    'Méthode': ''
  });

  exportToCSV(csvData, `finances-${data.period}`);
}

// PDF Export using iframe (safer than document.write)
export function exportFinanceToPDF(data: FinanceExportData): void {
  const html = generateFinancePDFHTML(data);

  // Create hidden iframe for printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';

  document.body.appendChild(iframe);

  // Use srcdoc attribute (safer than document.write)
  iframe.srcdoc = html;

  // Wait for content to load then print
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

function generateFinancePDFHTML(data: FinanceExportData): string {
  const statusLabels: Record<string, string> = {
    paid: 'Payé',
    pending: 'En attente',
    overdue: 'En retard'
  };

  const statusColors: Record<string, string> = {
    paid: '#10b981',
    pending: '#f59e0b',
    overdue: '#ef4444'
  };

  const paymentsRows = data.payments.map(p => `
    <tr>
      <td>${escapeHtml(p.date)}</td>
      <td>${escapeHtml(p.tenant)}</td>
      <td>${escapeHtml(p.property)}</td>
      <td class="amount">${formatCurrency(p.amount)}</td>
      <td><span class="status" style="background: ${statusColors[p.status]}20; color: ${statusColors[p.status]}">${statusLabels[p.status]}</span></td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Rapport Financier - ${escapeHtml(data.period)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1f2937;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 2px solid #9c5698;
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #9c5698, #c2566b);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .period {
      font-size: 14px;
      color: #6b7280;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 30px;
    }
    .summary-card {
      background: #f9fafb;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
    }
    .summary-card .label {
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .summary-card .value {
      font-size: 20px;
      font-weight: 700;
      color: #1f2937;
    }
    .summary-card.highlight {
      background: linear-gradient(135deg, #9c5698, #c2566b);
    }
    .summary-card.highlight .label,
    .summary-card.highlight .value {
      color: white;
    }
    h2 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #374151;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th {
      background: #f3f4f6;
      padding: 12px 8px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 1px solid #e5e7eb;
    }
    td {
      padding: 12px 8px;
      border-bottom: 1px solid #f3f4f6;
    }
    .amount {
      font-weight: 600;
      text-align: right;
    }
    .status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 500;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #9ca3af;
      text-align: center;
    }
    @media print {
      body { padding: 20px; }
      .summary-card.highlight {
        background: #9c5698 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">EasyCo</div>
      <div class="period">Rapport Financier - ${escapeHtml(data.period)}</div>
    </div>
    <div style="text-align: right; font-size: 12px; color: #6b7280;">
      Généré le ${new Date().toLocaleDateString('fr-FR')}<br>
      à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
    </div>
  </div>

  <div class="summary">
    <div class="summary-card highlight">
      <div class="label">Encaissé</div>
      <div class="value">${formatCurrency(data.summary.totalCollected)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Attendu</div>
      <div class="value">${formatCurrency(data.summary.totalExpected)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Impayés</div>
      <div class="value" style="color: #ef4444">${formatCurrency(data.summary.totalOverdue)}</div>
    </div>
    <div class="summary-card">
      <div class="label">Taux</div>
      <div class="value">${data.summary.collectionRate}%</div>
    </div>
  </div>

  <h2>Détail des paiements</h2>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Locataire</th>
        <th>Propriété</th>
        <th style="text-align: right">Montant</th>
        <th>Statut</th>
      </tr>
    </thead>
    <tbody>
      ${paymentsRows}
    </tbody>
  </table>

  <div class="footer">
    Document généré automatiquement par EasyCo - Ce document n'a pas de valeur légale
  </div>
</body>
</html>
  `;
}

// Utility functions
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function escapeHtml(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
