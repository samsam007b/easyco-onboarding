/**
 * Language matching utilities for EasyCo onboarding
 * Implements intelligent multilingual matching using CLDR data
 */

import { CANONICAL_LANGUAGES, LANGUAGE_SYNONYMS, type CanonicalLanguage } from './canonical-languages';

// Re-export CanonicalLanguage for use in components
export type { CanonicalLanguage } from './canonical-languages';

/**
 * CLDR locales to harvest language display names from
 * Prioritizes Brussels' multilingual base (FR, NL, EN) + major global languages
 */
const CLDR_LOCALES = [
  // Brussels priority
  'fr', 'nl', 'en',
  // Major European
  'de', 'es', 'it', 'pt', 'ro', 'pl', 'sv', 'cs', 'da', 'fi', 'hu', 'no', 'sk', 'sl',
  'bg', 'sr', 'hr', 'bs', 'et', 'lt', 'lv', 'is', 'ga', 'el', 'uk', 'ru',
  // Major Asian
  'ar', 'bn', 'hi', 'id', 'ja', 'ko', 'vi', 'zh', 'zh-Hant', 'th', 'he', 'fa', 'ur', 'tr',
  // South Asian
  'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'pa', 'my', 'ne', 'si',
  // Others
  'am', 'az', 'kk', 'uz', 'ky', 'mn', 'km', 'lo', 'fil', 'ms', 'sw',
];

/**
 * Normalize a language string for matching
 * Applies NFKC normalization, case-folding, diacritic removal, and punctuation cleaning
 */
export function normalize(input: string): string {
  return (
    input
      .normalize('NFKC') // Unicode normalization
      .toLocaleLowerCase() // Case-fold
      .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritics
      // Keep letters, numbers, spaces, apostrophes, hyphens
      .replace(/[^\p{L}\p{N}\s'-]/gu, '')
      .replace(/\s+/g, ' ') // Collapse multiple spaces
      .trim()
  );
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching suggestions
 */
export function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Get language display name from CLDR data
 * @param locale - CLDR locale (e.g., 'fr', 'nl', 'en')
 * @param languageCode - ISO 639 language code (e.g., 'fr', 'nl', 'zh')
 * @returns Display name in the specified locale, or null if not found
 */
export function getCldrLanguageDisplayName(locale: string, languageCode: string): string | null {
  try {
    // Import CLDR data dynamically
    // CLDR path: cldr-localenames-full/main/{locale}/languages.json
    const cldrData = require(`cldr-localenames-full/main/${locale}/languages.json`);

    const displayNames = cldrData?.main?.[locale]?.localeDisplayNames?.languages;
    if (!displayNames) return null;

    // Try exact code match first
    if (displayNames[languageCode]) {
      return displayNames[languageCode];
    }

    // Try without region/script (e.g., 'zh-Hans' -> 'zh')
    const baseCode = languageCode.split('-')[0];
    if (displayNames[baseCode]) {
      return displayNames[baseCode];
    }

    return null;
  } catch (error) {
    // CLDR data not available for this locale/language combo
    return null;
  }
}

/**
 * Suggestion item for autocomplete
 */
export type LanguageSuggestion = {
  display: string; // Display label (e.g., "français", "French", "Frans")
  normalized: string; // Normalized key for matching
  canonical: CanonicalLanguage; // Canonical language info
  locale?: string; // Source locale (for prioritization)
};

/**
 * Accept index for language validation
 */
export type AcceptIndex = {
  byNormalized: Map<string, CanonicalLanguage>; // normalized variant -> canonical
  suggestList: LanguageSuggestion[]; // All variants for autocomplete
  byPrefix: Map<string, LanguageSuggestion[]>; // prefix -> suggestions (for fast lookup)
};

/**
 * Build accept index from canonical languages + CLDR variants
 * This is the core matching engine
 */
export function buildAcceptIndex(
  canonicalLanguages: CanonicalLanguage[] = CANONICAL_LANGUAGES
): AcceptIndex {
  const byNormalized = new Map<string, CanonicalLanguage>();
  const suggestList: LanguageSuggestion[] = [];
  const byPrefix = new Map<string, LanguageSuggestion[]>();

  for (const canonical of canonicalLanguages) {
    const names = new Set<string>();

    // Add canonical English name
    names.add(canonical.canonicalEn);

    // Harvest CLDR display names across all locales
    for (const locale of CLDR_LOCALES) {
      const displayName = getCldrLanguageDisplayName(locale, canonical.code);
      if (displayName && displayName.trim()) {
        names.add(displayName);
      }
    }

    // Add manual synonyms
    const synonyms = LANGUAGE_SYNONYMS[canonical.code] || [];
    for (const syn of synonyms) {
      names.add(syn);
    }

    // Index all variants
    for (const name of names) {
      const normalized = normalize(name);
      if (normalized.length === 0) continue; // Skip empty

      // Add to normalized map
      if (!byNormalized.has(normalized)) {
        byNormalized.set(normalized, canonical);
      }

      // Add to suggestion list
      const suggestion: LanguageSuggestion = {
        display: name,
        normalized,
        canonical,
      };
      suggestList.push(suggestion);

      // Build prefix index (for autocomplete)
      for (let i = 1; i <= Math.min(normalized.length, 10); i++) {
        const prefix = normalized.slice(0, i);
        if (!byPrefix.has(prefix)) {
          byPrefix.set(prefix, []);
        }
        const list = byPrefix.get(prefix)!;
        if (!list.some(s => s.display === name && s.canonical.code === canonical.code)) {
          list.push(suggestion);
        }
      }
    }
  }

  return { byNormalized, suggestList, byPrefix };
}

/**
 * Validate a language input against the accept index
 * @param input - User input string
 * @param index - Accept index
 * @returns Canonical language if valid, null otherwise
 */
export function validateLanguage(input: string, index: AcceptIndex): CanonicalLanguage | null {
  const normalized = normalize(input);
  return index.byNormalized.get(normalized) || null;
}

/**
 * Get autocomplete suggestions for user input
 * @param input - User input string
 * @param index - Accept index
 * @param maxSuggestions - Maximum number of suggestions to return
 * @param priorityLocales - Locales to prioritize in suggestions (e.g., ['fr', 'nl', 'en'])
 * @returns Array of suggestions, sorted by relevance
 */
export function getSuggestions(
  input: string,
  index: AcceptIndex,
  maxSuggestions: number = 10,
  priorityLocales: string[] = ['fr', 'nl', 'en']
): LanguageSuggestion[] {
  const normalized = normalize(input);
  if (normalized.length === 0) return [];

  // 1. Exact prefix matches
  const prefixMatches = index.byPrefix.get(normalized) || [];

  // 2. Fuzzy matches (Levenshtein distance ≤ 2)
  const fuzzyMatches: Array<LanguageSuggestion & { distance: number }> = [];
  for (const suggestion of index.suggestList) {
    if (prefixMatches.includes(suggestion)) continue; // Already in prefix matches

    const distance = levenshteinDistance(normalized, suggestion.normalized);
    if (distance <= 2) {
      fuzzyMatches.push({ ...suggestion, distance });
    }
  }

  // Sort fuzzy matches by distance
  fuzzyMatches.sort((a, b) => a.distance - b.distance);

  // Combine: prefix matches first, then fuzzy
  const allMatches = [
    ...prefixMatches,
    ...fuzzyMatches.map(({ distance, ...s }) => s),
  ];

  // Deduplicate by canonical code + display name
  const seen = new Set<string>();
  const unique = allMatches.filter(s => {
    const key = `${s.canonical.code}:${s.display}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Limit to maxSuggestions
  return unique.slice(0, maxSuggestions);
}

/**
 * Singleton instance of the accept index
 * Built once on first access for performance
 */
let _cachedIndex: AcceptIndex | null = null;

export function getAcceptIndex(): AcceptIndex {
  if (!_cachedIndex) {
    _cachedIndex = buildAcceptIndex();
  }
  return _cachedIndex;
}

/**
 * Reset the cached index (useful for testing)
 */
export function resetAcceptIndex(): void {
  _cachedIndex = null;
}
