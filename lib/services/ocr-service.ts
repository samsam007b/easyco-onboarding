/**
 * OCR Service for Receipt Scanning
 * Uses Tesseract.js to extract text from receipt images
 *
 * PERF: Tesseract.js (~6.8MB) is loaded dynamically only when needed
 * to reduce initial bundle size and improve FCP
 */

// Dynamic import types - actual import happens in initialize()
type Worker = import('tesseract.js').Worker;
import type { OCRData, OCRResult, OCRLineItem } from '@/types/finances.types';

// ============================================================================
// i18n TRANSLATIONS
// ============================================================================
type Language = 'fr' | 'en' | 'nl' | 'de';

let currentLang: Language = 'fr';

export function setOCRServiceLanguage(lang: Language) {
  currentLang = lang;
}

const translations = {
  errors: {
    initScanner: {
      fr: "Impossible d'initialiser le scanner. Veuillez réessayer.",
      en: 'Unable to initialize the scanner. Please try again.',
      nl: 'Kan de scanner niet initialiseren. Probeer opnieuw.',
      de: 'Scanner konnte nicht initialisiert werden. Bitte erneut versuchen.',
    },
    fileMustBeImage: {
      fr: 'Le fichier doit être une image (JPEG, PNG, etc.)',
      en: 'The file must be an image (JPEG, PNG, etc.)',
      nl: 'Het bestand moet een afbeelding zijn (JPEG, PNG, etc.)',
      de: 'Die Datei muss ein Bild sein (JPEG, PNG, etc.)',
    },
    cannotReadFile: {
      fr: 'Impossible de lire le fichier',
      en: 'Unable to read the file',
      nl: 'Kan het bestand niet lezen',
      de: 'Datei kann nicht gelesen werden',
    },
    cannotCreateCanvas: {
      fr: 'Impossible de créer le canvas',
      en: 'Unable to create canvas',
      nl: 'Kan canvas niet maken',
      de: 'Canvas konnte nicht erstellt werden',
    },
    cannotLoadImage: {
      fr: "Impossible de charger l'image",
      en: 'Unable to load the image',
      nl: 'Kan de afbeelding niet laden',
      de: 'Bild konnte nicht geladen werden',
    },
    cannotCompressImage: {
      fr: "Impossible de compresser l'image",
      en: 'Unable to compress the image',
      nl: 'Kan de afbeelding niet comprimeren',
      de: 'Bild konnte nicht komprimiert werden',
    },
    networkError: {
      fr: 'Impossible de charger les ressources OCR. Vérifiez votre connexion internet.',
      en: 'Unable to load OCR resources. Check your internet connection.',
      nl: 'Kan OCR-bronnen niet laden. Controleer uw internetverbinding.',
      de: 'OCR-Ressourcen konnten nicht geladen werden. Überprüfen Sie Ihre Internetverbindung.',
    },
    imageNotReadable: {
      fr: "L'image n'est pas lisible. Essayez avec une photo plus nette.",
      en: 'The image is not readable. Try with a clearer photo.',
      nl: 'De afbeelding is niet leesbaar. Probeer met een scherpere foto.',
      de: 'Das Bild ist nicht lesbar. Versuchen Sie es mit einem klareren Foto.',
    },
    initError: {
      fr: "Erreur d'initialisation du scanner. Veuillez rafraîchir la page.",
      en: 'Scanner initialization error. Please refresh the page.',
      nl: 'Initialisatiefout van de scanner. Ververs de pagina.',
      de: 'Scanner-Initialisierungsfehler. Bitte aktualisieren Sie die Seite.',
    },
    scanFailed: {
      fr: 'Échec du scan. Vous pouvez saisir les informations manuellement.',
      en: 'Scan failed. You can enter the information manually.',
      nl: 'Scan mislukt. U kunt de informatie handmatig invoeren.',
      de: 'Scan fehlgeschlagen. Sie können die Informationen manuell eingeben.',
    },
  },
};

class OCRService {
  private worker: Worker | null = null;
  private isInitialized = false;

  /**
   * Initialize Tesseract worker
   * Only call this once and reuse the worker
   * PERF: Uses dynamic import to load tesseract.js only when needed
   */
  async initialize(): Promise<void> {
    if (this.isInitialized && this.worker) {
      return;
    }

    try {
      console.log('[OCR] Initializing Tesseract worker...');
      console.log('[OCR] PERF: Loading tesseract.js dynamically...');

      // PERF: Dynamic import - tesseract.js (~6.8MB) only loaded when OCR is used
      const { createWorker } = await import('tesseract.js');

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
      console.log('[OCR] OK: Worker initialized successfully');
    } catch (error) {
      console.error('[OCR] ERROR: Failed to initialize worker:', error);
      throw new Error(translations.errors.initScanner[currentLang]);
    }
  }

  /**
   * Scan a receipt image and extract structured data
   * @param imageFile - The receipt image file
   * @returns OCRResult with extracted data
   */
  async scanReceipt(imageFile: File): Promise<OCRResult> {
    try {
      console.log('[OCR] [START] Starting receipt scan...');
      console.log('[OCR] [INFO] File details:', {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type,
      });

      // Validate file type
      if (!imageFile.type.startsWith('image/')) {
        throw new Error(translations.errors.fileMustBeImage[currentLang]);
      }

      // Check file size (max 10MB)
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (imageFile.size > MAX_SIZE) {
        console.log('[OCR] WARN: File too large, compressing...');
        imageFile = await this.compressImage(imageFile);
      }

      // Convert File to base64 for better compatibility
      const imageDataUrl = await this.fileToDataURL(imageFile);
      console.log('[OCR] OK: Image converted to base64');

      // Preprocess image for better OCR results
      console.log('[OCR] PROCESS: Preprocessing image for better OCR...');
      const preprocessedDataUrl = await this.preprocessImage(imageDataUrl);
      console.log('[OCR] OK: Image preprocessed');

      // Initialize worker if needed
      await this.initialize();

      if (!this.worker) {
        throw new Error('Worker not initialized');
      }

      const startTime = Date.now();

      // Perform OCR with the preprocessed image
      console.log('[OCR] SCAN: Starting Tesseract recognition...');
      const { data } = await this.worker.recognize(preprocessedDataUrl);

      const duration = Date.now() - startTime;
      console.log(`[OCR] OK: Scan completed in ${duration}ms`);
      console.log(`[OCR] [STATS] Confidence: ${data.confidence.toFixed(1)}%`);
      console.log(`[OCR] TEXT: Text length: ${data.text.length} characters`);

      // Extract structured data from raw text
      const ocrData = this.parseReceiptText(data.text, data.confidence / 100);

      return {
        success: true,
        data: ocrData,
      };
    } catch (error: any) {
      console.error('[OCR] ERROR: Scan failed:', error);
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
      reader.onerror = () => reject(new Error(translations.errors.cannotReadFile[currentLang]));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Preprocess image to improve OCR quality
   * Applies: upscaling, grayscale, gentle contrast enhancement, and denoising
   * SOFTER approach - no aggressive binarization
   */
  private async preprocessImage(dataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Upscale image 2x for better OCR (more pixels = better recognition)
          const scaleFactor = 2;
          const canvas = document.createElement('canvas');
          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error(translations.errors.cannotCreateCanvas[currentLang]));
            return;
          }

          // Use high-quality image smoothing for upscaling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Draw upscaled image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Get image data for manipulation
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Step 1: Convert to grayscale with gentle contrast boost
          for (let i = 0; i < data.length; i += 4) {
            // Grayscale using luminosity method
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

            // Apply GENTLE contrast (1.2x instead of 1.5x)
            const contrast = 1.2;
            const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
            const enhanced = factor * (gray - 128) + 128;

            // Clamp to 0-255
            const value = Math.max(0, Math.min(255, enhanced));

            data[i] = value;     // R
            data[i + 1] = value; // G
            data[i + 2] = value; // B
            // Alpha stays same
          }

          // Step 2: Apply gentle denoising (median filter)
          const denoised = this.denoise(imageData);

          // Put processed image data back (NO binarization)
          ctx.putImageData(denoised, 0, 0);

          // Convert canvas to data URL
          const processedDataUrl = canvas.toDataURL('image/png');

          console.log('[OCR] PROCESS: Applied preprocessing: 2x upscale → grayscale → gentle contrast (1.2x) → denoise');
          resolve(processedDataUrl);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error(translations.errors.cannotLoadImage[currentLang]));
      img.src = dataUrl;
    });
  }

  /**
   * Apply gentle denoising using simple averaging filter
   * Reduces noise while preserving text edges
   */
  private denoise(imageData: ImageData): ImageData {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const output = new ImageData(width, height);

    // Copy original data first
    for (let i = 0; i < data.length; i++) {
      output.data[i] = data[i];
    }

    // Apply 3x3 averaging filter (gentle blur to reduce noise)
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let sum = 0;
        let count = 0;

        // Average with 8 neighbors
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            sum += data[idx];
            count++;
          }
        }

        const idx = (y * width + x) * 4;
        const avg = sum / count;

        output.data[idx] = avg;     // R
        output.data[idx + 1] = avg; // G
        output.data[idx + 2] = avg; // B
        output.data[idx + 3] = 255; // A
      }
    }

    return output;
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
            reject(new Error(translations.errors.cannotCreateCanvas[currentLang]));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with compression
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error(translations.errors.cannotCompressImage[currentLang]));
                return;
              }

              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });

              console.log('[OCR] OK: Image compressed:', {
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

        img.onerror = () => reject(new Error(translations.errors.cannotLoadImage[currentLang]));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error(translations.errors.cannotReadFile[currentLang]));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get user-friendly error message
   */
  private getFriendlyErrorMessage(error: any): string {
    const message = error.message || String(error);

    if (message.includes('network') || message.includes('Failed to fetch')) {
      return translations.errors.networkError[currentLang];
    }

    if (message.includes('attempting to read image')) {
      return translations.errors.imageNotReadable[currentLang];
    }

    if (message.includes('Worker') || message.includes('initialize')) {
      return translations.errors.initError[currentLang];
    }

    return translations.errors.scanFailed[currentLang];
  }

  /**
   * Parse raw OCR text and extract structured data
   * This is where we apply heuristics to find merchant, total, date, items
   */
  private parseReceiptText(rawText: string, confidence: number): OCRData {
    console.log('[OCR] SCAN: Parsing receipt text...');
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

    console.log('[OCR] OK: Parsed data:', ocrData);
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
        console.log(`[OCR] OK: Known merchant found: ${merchant}`);
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
          console.log(`[OCR] OK: Merchant from header: ${extracted}`);
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
      console.log(`[OCR] WARN: Using first line as merchant: ${firstLine}`);
      return firstLine.length > 50 ? firstLine.substring(0, 50) : firstLine;
    }

    console.log('[OCR] ERROR: No merchant found');
    return undefined;
  }

  /**
   * Extract total amount from receipt
   * Looks for patterns like "TOTAL 45.50", "Total: 45,50€", "Grand Total: 47.90", "Cash 47,90" etc.
   */
  private extractTotal(text: string): number | undefined {
    console.log('[OCR] AMOUNT: Extracting total from text (v3 - prioritize Total: over Grand Votal)...');

    const lines = text.split('\n');

    // Strategy: Prioritize "Total:" lines over "Grand Votal:" lines
    // First pass: Look for "Total:" (not "Grand")
    for (const line of lines) {
      const trimmedLine = line.trim();

      // Match "Total:" but NOT "Grand Total" or "Grand Votal"
      if (/(?<!Grand\s+)(?<!Grand\s+[VT])Total\s*:/i.test(trimmedLine)) {
        // Extract all numbers from this line
        const numbers = trimmedLine.match(/\d+[.,]\d{2,}/g);
        if (numbers && numbers.length > 0) {
          // Take the LAST number (usually the actual total)
          const lastNumber = numbers[numbers.length - 1];
          const amountStr = lastNumber.replace(',', '.');
          const amount = parseFloat(amountStr);
          if (!isNaN(amount) && amount > 0 && amount < 100000) {
            console.log(`[OCR] OK: Total found on "Total:" line: ${amount} (from: "${trimmedLine.substring(0, 60)}...")`);
            return amount;
          }
        }
      }
    }

    // Second pass: Look for other total-like keywords
    const totalKeywords = [
      { pattern: /Cash\s*:?\s*/i, name: 'Cash' },
      { pattern: /SOMME\s*:?\s*/i, name: 'SOMME' },
      { pattern: /MONTANT\s*:?\s*/i, name: 'MONTANT' },
      { pattern: /NET\s+A\s+PAYER\s*:?\s*/i, name: 'NET A PAYER' },
      { pattern: /CARTE\s*:?\s*/i, name: 'CARTE' },
    ];

    for (const keyword of totalKeywords) {
      for (const line of lines) {
        if (keyword.pattern.test(line)) {
          const numbers = line.match(/\d+[.,]\d{2,}/g);
          if (numbers && numbers.length > 0) {
            const lastNumber = numbers[numbers.length - 1];
            const amountStr = lastNumber.replace(',', '.');
            const amount = parseFloat(amountStr);
            if (!isNaN(amount) && amount > 0 && amount < 100000) {
              console.log(`[OCR] OK: Total found on "${keyword.name}" line: ${amount}`);
              return amount;
            }
          }
        }
      }
    }

    // Third pass: Only check "Grand Total" / "Grand Votal" if nothing else found
    for (const line of lines) {
      if (/Grand\s+[VT]otal\s*:/i.test(line)) {
        const numbers = line.match(/\d+[.,]\d{2,}/g);
        if (numbers && numbers.length > 0) {
          const lastNumber = numbers[numbers.length - 1];
          const amountStr = lastNumber.replace(',', '.');
          const amount = parseFloat(amountStr);
          if (!isNaN(amount) && amount > 0 && amount < 100000) {
            console.log(`[OCR] WARN: Total found on "Grand Votal" line: ${amount} (last resort)`);
            return amount;
          }
        }
      }
    }

    // Fallback: Look for largest number on the receipt (likely the total)
    const allNumbers = text.match(/\d+[.,]\d{2,}/g);
    if (allNumbers && allNumbers.length > 0) {
      const amounts = allNumbers
        .map((n) => parseFloat(n.replace(',', '.')))
        .filter((n) => !isNaN(n) && n > 0 && n < 100000)
        .sort((a, b) => b - a);

      if (amounts.length > 0) {
        console.log(`[OCR] WARN: Using fallback - largest number: ${amounts[0]}`);
        return amounts[0];
      }
    }

    console.log('[OCR] ERROR: No total found');
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
          console.log(`[OCR] OK: Date found: ${isoDate}`);
          return isoDate;
        }
      }
    }

    console.log('[OCR] ERROR: No valid date found, using today');
    // Fallback to today's date
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Extract individual line items from receipt
   * Handles various receipt formats including:
   * - "1 PZ 4 Saisons 14,50 14,50 B"
   * - "Pain complet 1.20"
   * - "2x Coca Cola 2.50 5.00"
   * - OCR errors like "! V7 4 Snsuons 14,50 14,906"
   */
  private extractLineItems(text: string): OCRLineItem[] {
    console.log('[OCR] Extracting line items...');
    const items: OCRLineItem[] = [];

    // Split text into lines
    const lines = text.split('\n');

    // Words to exclude (headers, footers, tax lines, etc.)
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
      'GRAND',
      'VOTAL',
      'IVA',  // TVA in other languages
      'IVAX', // OCR error for IVA
      'EXCEL', // Headers
      'INCL', // Tax included
      '21X',  // Tax rate 21%
      '12%',  // Tax rate 12%
      '%',    // Any line with percentage (tax lines)
    ];

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip empty lines or lines with exclude words
      if (!trimmedLine || excludeWords.some((word) => trimmedLine.toUpperCase().includes(word))) {
        continue;
      }

      // More permissive approach: look for any line with at least 2 price-like numbers
      // Format: [optional symbols/numbers] TEXT PRICE1 PRICE2 [optional letter]
      // Example: "! V7 4 Snsuons 14,50 14,906" or "PZ Campericoise 14,50 14,50 B"
      const numbers = trimmedLine.match(/\d+[.,]\d{1,3}/g);

      if (numbers && numbers.length >= 2) {
        // Extract the last 2 numbers (unit price and total price)
        const lastTwo = numbers.slice(-2);
        const unitPriceStr = lastTwo[0].replace(',', '.');
        const totalPriceStr = lastTwo[1].replace(',', '.');

        const unitPrice = parseFloat(unitPriceStr);
        const totalPrice = parseFloat(totalPriceStr);

        // Extract item name: everything before the first price number
        const firstPriceIdx = trimmedLine.indexOf(lastTwo[0]);
        if (firstPriceIdx > 0) {
          let name = trimmedLine.substring(0, firstPriceIdx).trim();

          // Clean up name: remove leading symbols and numbers
          name = name.replace(/^[!•\-\*\s\d]+/, '').trim();

          // Try to extract quantity from the beginning
          let quantity = 1;
          const qtyMatch = name.match(/^(\d+)\s+/);
          if (qtyMatch) {
            quantity = parseInt(qtyMatch[1]);
            name = name.replace(/^\d+\s+/, '').trim();
          }

          // Validate the extracted item
          if (
            name.length >= 2 &&
            name.length <= 100 &&
            !isNaN(unitPrice) &&
            !isNaN(totalPrice) &&
            unitPrice > 0 &&
            unitPrice < 1000 &&
            totalPrice > 0 &&
            totalPrice < 10000 &&
            !/^\d+$/.test(name) && // Not just numbers
            !/^[IVA\s\d]+$/.test(name) && // Not just "IVA" or roman numerals
            !/^[\s\-\.\/]+$/.test(name) // Not just punctuation
          ) {
            const item: OCRLineItem = {
              name,
              total_price: totalPrice,
            };

            if (quantity > 1) {
              item.quantity = quantity;
            }

            // Only include unit price if different from total
            if (Math.abs(unitPrice - totalPrice) > 0.01) {
              item.unit_price = unitPrice;
            }

            items.push(item);
            console.log(`[OCR] OK: Item found: "${name}" - ${totalPrice}€ (qty: ${quantity}, unit: ${unitPrice}€)`);
          }
        }
      }
    }

    console.log(`[OCR] OK: Extracted ${items.length} line items`);
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
