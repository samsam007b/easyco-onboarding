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
      console.log('[OCR] 📸 Starting receipt scan...');
      console.log('[OCR] 📄 File details:', {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type,
      });

      // Validate file type
      if (!imageFile.type.startsWith('image/')) {
        throw new Error('Le fichier doit être une image (JPEG, PNG, etc.)');
      }

      // Check file size (max 10MB)
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (imageFile.size > MAX_SIZE) {
        console.log('[OCR] ⚠️ File too large, compressing...');
        imageFile = await this.compressImage(imageFile);
      }

      // Convert File to base64 for better compatibility
      const imageDataUrl = await this.fileToDataURL(imageFile);
      console.log('[OCR] ✅ Image converted to base64');

      // Initialize worker if needed
      await this.initialize();

      if (!this.worker) {
        throw new Error('Worker not initialized');
      }

      const startTime = Date.now();

      // Perform OCR with the base64 data URL
      console.log('[OCR] 🔍 Starting Tesseract recognition...');
      const { data } = await this.worker.recognize(imageDataUrl);

      const duration = Date.now() - startTime;
      console.log(`[OCR] ✅ Scan completed in ${duration}ms`);
      console.log(`[OCR] 📊 Confidence: ${data.confidence.toFixed(1)}%`);
      console.log(`[OCR] 📝 Text length: ${data.text.length} characters`);

      // Extract structured data from raw text
      const ocrData = this.parseReceiptText(data.text, data.confidence / 100);

      return {
        success: true,
        data: ocrData,
      };
    } catch (error: any) {
      console.error('[OCR] ❌ Scan failed:', error);
      console.error('[OCR] Error details:', {
        message: error.message,
        stack: error.stack?.substring(0, 200),
      });

      return {
        success: false,
        error: this.getFriendlyErrorMessage(error),
      };
    }
  }

  /**
   * Convert File to base64 Data URL
   */
  private fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Impossible de lire le fichier'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Compress image if too large
   */
  private async compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          // Calculate new dimensions (max 1920px width)
          const MAX_WIDTH = 1920;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }

          // Create canvas and draw resized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Impossible de créer le canvas'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Impossible de compresser l\'image'));
                return;
              }

              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });

              console.log('[OCR] ✅ Image compressed:', {
                original: file.size,
                compressed: compressedFile.size,
                ratio: `${((compressedFile.size / file.size) * 100).toFixed(1)}%`,
              });

              resolve(compressedFile);
            },
            'image/jpeg',
            0.8 // 80% quality
          );
        };

        img.onerror = () => reject(new Error('Impossible de charger l\'image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Impossible de lire le fichier'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get user-friendly error message
   */
  private getFriendlyErrorMessage(error: any): string {
    const message = error.message || String(error);

    if (message.includes('network') || message.includes('Failed to fetch')) {
      return 'Impossible de charger les ressources OCR. Vérifiez votre connexion internet.';
    }

    if (message.includes('attempting to read image')) {
      return 'L\'image n\'est pas lisible. Essayez avec une photo plus nette.';
    }

    if (message.includes('Worker') || message.includes('initialize')) {
      return 'Erreur d\'initialisation du scanner. Veuillez rafraîchir la page.';
    }

    return 'Échec du scan. Vous pouvez saisir les informations manuellement.';
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
   * Looks for common French supermarkets/stores and receipt headers
   */
  private extractMerchant(text: string): string | undefined {
    console.log('[OCR] Extracting merchant from text...');

    const merchants = [
      'CARREFOUR',
      'LECLERC',
      'AUCHAN',
      'INTERMARCHE',
      'INTERMARCH',
      'SUPER U',
      'HYPER U',
      'MONOPRIX',
      'FRANPRIX',
      'CASINO',
      'LIDL',
      'ALDI',
      'PICARD',
      'AUCHAN DRIVE',
      'DELHAIZE',
      'COLRUYT',
      'CARREFOUR EXPRESS',
      'PROXY DELHAIZE',
      'MATCH',
      'CORA',
      'SPAR',
    ];

    const upperText = text.toUpperCase();

    // First, try to find known merchants
    for (const merchant of merchants) {
      if (upperText.includes(merchant)) {
        console.log(`[OCR] ✅ Known merchant found: ${merchant}`);
        return merchant;
      }
    }

    // Try to extract from common receipt headers
    // Pattern: "TICKET DE CAISSE" or similar headers
    const headerPatterns = [
      /([A-Z\s]{3,30})(?:\s+SPRL|\s+S\.?A\.?|\s+BVBA)/i,
      /^([A-Z][A-Za-z\s]{2,30})$/m,
    ];

    for (const pattern of headerPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const extracted = match[1].trim();
        // Ignore generic words like "TICKET", "DE", "CAISSE", "TVA"
        const genericWords = ['TICKET', 'DE', 'CAISSE', 'TVA', 'FACTURE', 'RECU'];
        if (!genericWords.includes(extracted.toUpperCase())) {
          console.log(`[OCR] ✅ Merchant from header: ${extracted}`);
          return extracted;
        }
      }
    }

    // If no known merchant, try to get first meaningful line
    const lines = text.split('\n').filter((l) => {
      const trimmed = l.trim();
      // Exclude very short lines, numbers, or generic words
      return (
        trimmed.length > 3 &&
        !/^\d+$/.test(trimmed) &&
        !/^[\d\/\-\.\s]+$/.test(trimmed) &&
        !/^TICKET|CAISSE|FACTURE|RE[ÇC]U/i.test(trimmed)
      );
    });

    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      console.log(`[OCR] ⚠️ Using first line as merchant: ${firstLine}`);
      return firstLine.length > 50 ? firstLine.substring(0, 50) : firstLine;
    }

    console.log('[OCR] ❌ No merchant found');
    return undefined;
  }

  /**
   * Extract total amount from receipt
   * Looks for patterns like "TOTAL 45.50", "Total: 45,50€", "Grand Total: 47.90", "Cash 47,90" etc.
   */
  private extractTotal(text: string): number | undefined {
    console.log('[OCR] Extracting total from text...');

    // Common French patterns for total (ordered by priority)
    const patterns = [
      // "Grand Total: 47.90"
      /Grand\s+Total\s*:?\s*(\d+[.,]\d{2})/i,
      // "Total: 47.90"
      /Total\s*:?\s*(\d+[.,]\d{2})/i,
      // "Cash 47,90"
      /Cash\s+(\d+[.,]\d{2})/i,
      // "SOMME: 45,50"
      /SOMME\s*:?\s*(\d+[.,]\d{2})/i,
      // "MONTANT: 45,50"
      /MONTANT\s*:?\s*(\d+[.,]\d{2})/i,
      // "NET A PAYER: 45,50"
      /NET\s+A\s+PAYER\s*:?\s*(\d+[.,]\d{2})/i,
      // "CARTE: 45,50" (card payment)
      /CARTE\s*:?\s*(\d+[.,]\d{2})/i,
      // "45,50 EUR" or "45.50€"
      /(\d+[.,]\d{2})\s*(?:EUR|€)/,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const amountStr = match[1].replace(',', '.');
        const amount = parseFloat(amountStr);
        if (!isNaN(amount) && amount > 0 && amount < 100000) {
          console.log(`[OCR] ✅ Total found: ${amount} (pattern: ${pattern})`);
          return amount;
        }
      }
    }

    // Fallback: Look for largest number on the receipt (likely the total)
    const allNumbers = text.match(/\d+[.,]\d{2}/g);
    if (allNumbers && allNumbers.length > 0) {
      const amounts = allNumbers
        .map((n) => parseFloat(n.replace(',', '.')))
        .filter((n) => !isNaN(n) && n > 0 && n < 100000)
        .sort((a, b) => b - a);

      if (amounts.length > 0) {
        console.log(`[OCR] ⚠️ Using fallback - largest number: ${amounts[0]}`);
        return amounts[0];
      }
    }

    console.log('[OCR] ❌ No total found');
    return undefined;
  }

  /**
   * Extract date from receipt
   * Looks for DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY patterns
   */
  private extractDate(text: string): string | undefined {
    console.log('[OCR] Extracting date from text...');

    // French date patterns
    const patterns = [
      // DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
      /(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{4})/,
      // DD/MM/YY or DD-MM-YY or DD.MM.YY
      /(\d{2})[\/\-\.](\d{2})[\/\-\.](\d{2})(?!\d)/,
    ];

    for (const pattern of patterns) {
      // Use exec instead of matchAll for better TypeScript compatibility
      const regex = new RegExp(pattern, 'g');
      let match;

      while ((match = regex.exec(text)) !== null) {
        const day = match[1];
        const month = match[2];
        let year = match[3];

        // Handle 2-digit years
        if (year.length === 2) {
          const yearNum = parseInt(year);
          // Assume 20XX for years 00-50, 19XX for 51-99
          year = yearNum <= 50 ? '20' + year : '19' + year;
        }

        // Validate date
        const dayNum = parseInt(day);
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);

        if (
          dayNum >= 1 &&
          dayNum <= 31 &&
          monthNum >= 1 &&
          monthNum <= 12 &&
          yearNum >= 1900 &&
          yearNum <= 2100
        ) {
          const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          console.log(`[OCR] ✅ Date found: ${isoDate}`);
          return isoDate;
        }
      }
    }

    console.log('[OCR] ❌ No valid date found, using today');
    // Fallback to today's date
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Extract individual line items from receipt
   * Handles various receipt formats including:
   * - "1 PZ 4 Saisons 14,50 14,50 B"
   * - "Pain complet 1.20"
   * - "2x Coca Cola 2.50 5.00"
   */
  private extractLineItems(text: string): OCRLineItem[] {
    console.log('[OCR] Extracting line items...');
    const items: OCRLineItem[] = [];

    // Split text into lines
    const lines = text.split('\n');

    // Patterns for different receipt formats
    const patterns = [
      // Format 1: "1  PZ 4 Saisons      14,50   14,50 B"
      // Quantity, Name, Unit Price, Total Price, Tax Code
      /^(\d+)\s+([A-Za-z0-9À-ÿ\/\s\-'\.]+?)\s+(\d+[.,]\d{2})\s+(\d+[.,]\d{2})\s*[A-Z]?\s*$/,

      // Format 2: "PZ Campericoise      14,50   14,50 B"
      // Name, Unit Price, Total Price, Tax Code (no quantity)
      /^([A-Za-z0-9À-ÿ\/\s\-'\.]+?)\s+(\d+[.,]\d{2})\s+(\d+[.,]\d{2})\s*[A-Z]?\s*$/,

      // Format 3: "2x Pain complet 2.40"
      // Quantity x Name Total
      /^(\d+)x\s+([A-Za-zÀ-ÿ\s\-'\.]+)\s+(\d+[.,]\d{2})$/,

      // Format 4: "Pain complet 1.20" (simple format)
      // Name Price
      /^([A-Za-zÀ-ÿ\s\-'\.]{3,})\s+(\d+[.,]\d{2})$/,
    ];

    // Words to exclude (headers, footers, etc.)
    const excludeWords = [
      'TOTAL',
      'SOUS-TOTAL',
      'SUBTOTAL',
      'TVA',
      'TAX',
      'SOMME',
      'MONTANT',
      'CASH',
      'CARTE',
      'ESPECE',
      'CHANGE',
      'RENDU',
      'QTE',
      'PRIX',
      'P.U.',
      'ARTICLE',
      'DESIGNATION',
      'GRAND TOTAL',
    ];

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip empty lines or lines with exclude words
      if (!trimmedLine || excludeWords.some((word) => trimmedLine.toUpperCase().includes(word))) {
        continue;
      }

      // Try each pattern
      for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        const match = trimmedLine.match(pattern);

        if (match) {
          let name: string;
          let quantity = 1;
          let unitPrice: number | undefined;
          let totalPrice: number;

          if (i === 0) {
            // Format 1: quantity, name, unit price, total price
            quantity = parseInt(match[1]);
            name = match[2].trim();
            unitPrice = parseFloat(match[3].replace(',', '.'));
            totalPrice = parseFloat(match[4].replace(',', '.'));
          } else if (i === 1) {
            // Format 2: name, unit price, total price (quantity = 1)
            name = match[1].trim();
            unitPrice = parseFloat(match[2].replace(',', '.'));
            totalPrice = parseFloat(match[3].replace(',', '.'));
          } else if (i === 2) {
            // Format 3: quantity x name total
            quantity = parseInt(match[1]);
            name = match[2].trim();
            totalPrice = parseFloat(match[3].replace(',', '.'));
            unitPrice = totalPrice / quantity;
          } else {
            // Format 4: name price (simple)
            name = match[1].trim();
            totalPrice = parseFloat(match[2].replace(',', '.'));
            unitPrice = totalPrice;
          }

          // Validate the extracted item
          if (
            name.length >= 3 &&
            name.length <= 100 &&
            !isNaN(totalPrice) &&
            totalPrice > 0 &&
            totalPrice < 10000 &&
            !/^\d+$/.test(name) && // Not just numbers
            !/^[\s\-\.\/]+$/.test(name) // Not just punctuation
          ) {
            const item: OCRLineItem = {
              name,
              total_price: totalPrice,
            };

            if (quantity > 1) {
              item.quantity = quantity;
            }

            if (unitPrice !== undefined && unitPrice !== totalPrice) {
              item.unit_price = unitPrice;
            }

            items.push(item);
            console.log(`[OCR] ✅ Item found: ${name} - ${totalPrice}€ (qty: ${quantity})`);
            break; // Found a match, no need to try other patterns
          }
        }
      }
    }

    console.log(`[OCR] ✅ Extracted ${items.length} line items`);
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
