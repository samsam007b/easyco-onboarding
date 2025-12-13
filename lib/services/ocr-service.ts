/**
 * OCR Service for Receipt Scanning
 * Uses Tesseract.js to extract text from receipt images
 */

import { createWorker, type Worker } from 'tesseract.js';
import type { OCRData, OCRResult, OCRLineItem } from '@/types/finances.types';

class OCRService {
  private worker: Worker | null = null;
  private isInitialized = false;

  /**
   * Initialize Tesseract worker
   * Only call this once and reuse the worker
   */
  async initialize(): Promise<void> {
    if (this.isInitialized && this.worker) {
      return;
    }

    try {
      console.log('[OCR] Initializing Tesseract worker...');

      // Create worker with explicit configuration
      this.worker = await createWorker('fra', 1, {
        workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js',
        langPath: 'https://tessdata.projectnaptha.com/4.0.0',
        corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.0/tesseract-core-simd.wasm.js',
        logger: (m) => {
          console.log('[OCR] Status:', m.status, m.progress ? `${Math.round(m.progress * 100)}%` : '');
        },
      });

      this.isInitialized = true;
      console.log('[OCR] ✅ Worker initialized successfully');
    } catch (error) {
      console.error('[OCR] ❌ Failed to initialize worker:', error);
      throw new Error('Impossible d\'initialiser le scanner. Veuillez réessayer.');
    }
  }

  /**
   * Scan a receipt image and extract structured data
   * @param imageFile - The receipt image file
   * @returns OCRResult with extracted data
   */
  async scanReceipt(imageFile: File): Promise<OCRResult> {
    try {
      // Initialize worker if needed
      await this.initialize();

      if (!this.worker) {
        throw new Error('Worker not initialized');
      }

      console.log('[OCR] 📸 Starting receipt scan...');
      const startTime = Date.now();

      // Tesseract.js can work directly with File objects
      console.log('[OCR] 📄 Processing file:', imageFile.name, `(${imageFile.size} bytes)`);

      // Perform OCR directly with the File object
      const { data } = await this.worker.recognize(imageFile);

      const duration = Date.now() - startTime;
      console.log(`[OCR] ✅ Scan completed in ${duration}ms`);

      // Extract structured data from raw text
      const ocrData = this.parseReceiptText(data.text, data.confidence / 100);

      return {
        success: true,
        data: ocrData,
      };
    } catch (error: any) {
      console.error('[OCR] ❌ Scan failed:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors du scan du ticket',
      };
    }
  }

  /**
   * Parse raw OCR text and extract structured data
   * This is where we apply heuristics to find merchant, total, date, items
   */
  private parseReceiptText(rawText: string, confidence: number): OCRData {
    console.log('[OCR] 🔍 Parsing receipt text...');
    console.log('[OCR] Raw text:', rawText);

    const ocrData: OCRData = {
      raw_text: rawText,
      confidence,
      processed_at: new Date().toISOString(),
      language: 'fra',
    };

    // Extract merchant (usually in first few lines)
    const merchantMatch = this.extractMerchant(rawText);
    if (merchantMatch) {
      ocrData.merchant = merchantMatch;
    }

    // Extract total amount
    const totalMatch = this.extractTotal(rawText);
    if (totalMatch) {
      ocrData.total = totalMatch;
    }

    // Extract date
    const dateMatch = this.extractDate(rawText);
    if (dateMatch) {
      ocrData.date = dateMatch;
    }

    // Extract line items (more complex, optional)
    const items = this.extractLineItems(rawText);
    if (items.length > 0) {
      ocrData.items = items;
    }

    console.log('[OCR] ✅ Parsed data:', ocrData);
    return ocrData;
  }

  /**
   * Extract merchant name from receipt text
   * Looks for common French supermarkets/stores
   */
  private extractMerchant(text: string): string | undefined {
    const merchants = [
      'CARREFOUR',
      'LECLERC',
      'AUCHAN',
      'INTERMARCHE',
      'SUPER U',
      'MONOPRIX',
      'FRANPRIX',
      'CASINO',
      'LIDL',
      'ALDI',
      'PICARD',
      'AUCHAN DRIVE',
    ];

    const upperText = text.toUpperCase();

    for (const merchant of merchants) {
      if (upperText.includes(merchant)) {
        return merchant;
      }
    }

    // If no known merchant, try to get first non-empty line
    const lines = text.split('\n').filter((l) => l.trim().length > 0);
    if (lines.length > 0) {
      return lines[0].trim();
    }

    return undefined;
  }

  /**
   * Extract total amount from receipt
   * Looks for patterns like "TOTAL 45.50", "Total: 45,50€", etc.
   */
  private extractTotal(text: string): number | undefined {
    // Common French patterns for total
    const patterns = [
      /TOTAL\s*:?\s*(\d+[.,]\d{2})/i,
      /SOMME\s*:?\s*(\d+[.,]\d{2})/i,
      /MONTANT\s*:?\s*(\d+[.,]\d{2})/i,
      /NET A PAYER\s*:?\s*(\d+[.,]\d{2})/i,
      /CARTE\s*:?\s*(\d+[.,]\d{2})/i, // Card payment
      /(\d+[.,]\d{2})\s*€/,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const amountStr = match[1].replace(',', '.');
        const amount = parseFloat(amountStr);
        if (!isNaN(amount) && amount > 0) {
          return amount;
        }
      }
    }

    return undefined;
  }

  /**
   * Extract date from receipt
   * Looks for DD/MM/YYYY or DD-MM-YYYY patterns
   */
  private extractDate(text: string): string | undefined {
    // French date patterns
    const patterns = [
      /(\d{2})[\/\-](\d{2})[\/\-](\d{4})/,
      /(\d{2})[\/\-](\d{2})[\/\-](\d{2})/,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const day = match[1];
        const month = match[2];
        let year = match[3];

        // Handle 2-digit years
        if (year.length === 2) {
          year = '20' + year;
        }

        // Validate date
        const dayNum = parseInt(day);
        const monthNum = parseInt(month);

        if (dayNum >= 1 && dayNum <= 31 && monthNum >= 1 && monthNum <= 12) {
          // Return ISO format
          return `${year}-${month}-${day}`;
        }
      }
    }

    return undefined;
  }

  /**
   * Extract individual line items from receipt
   * This is complex and may not work perfectly with all receipts
   */
  private extractLineItems(text: string): OCRLineItem[] {
    const items: OCRLineItem[] = [];

    // Pattern to match line items like:
    // "Pain complet 1.20"
    // "Lait demi-écrémé 0.95"
    const linePattern = /^([A-Za-zÀ-ÿ\s]+)\s+(\d+[.,]\d{2})$/gm;

    let match;
    while ((match = linePattern.exec(text)) !== null) {
      const name = match[1].trim();
      const priceStr = match[2].replace(',', '.');
      const price = parseFloat(priceStr);

      if (name.length > 2 && !isNaN(price) && price > 0) {
        items.push({
          name,
          total_price: price,
        });
      }
    }

    return items;
  }

  /**
   * Clean up and terminate the worker
   */
  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
      console.log('[OCR] Worker terminated');
    }
  }
}

// Export singleton instance
export const ocrService = new OCRService();
