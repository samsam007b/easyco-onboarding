/**
 * Unit tests for language matching utilities
 */

import {
  normalize,
  levenshteinDistance,
  buildAcceptIndex,
  validateLanguage,
  getSuggestions,
  resetAcceptIndex,
} from '../language-utils';
import { CANONICAL_LANGUAGES } from '../canonical-languages';

describe('normalize', () => {
  it('should convert to lowercase', () => {
    expect(normalize('FRENCH')).toBe('french');
    expect(normalize('English')).toBe('english');
  });

  it('should remove diacritics', () => {
    expect(normalize('français')).toBe('francais');
    expect(normalize('español')).toBe('espanol');
    expect(normalize('Português')).toBe('portugues');
  });

  it('should apply NFKC normalization', () => {
    expect(normalize('ﬁ')).toBe('fi'); // ligature fi
    expect(normalize('①')).toBe('1'); // circled digit
  });

  it('should remove punctuation except apostrophes and hyphens', () => {
    expect(normalize("l'anglais")).toBe("l'anglais");
    expect(normalize('Serbo-Croatian')).toBe('serbo-croatian');
    expect(normalize('French (Canada)')).toBe('french canada');
    expect(normalize('Arabic!!!')).toBe('arabic');
  });

  it('should collapse multiple spaces', () => {
    expect(normalize('French   Canadian')).toBe('french canadian');
    expect(normalize('  English  ')).toBe('english');
  });

  it('should trim leading/trailing whitespace', () => {
    expect(normalize('  French  ')).toBe('french');
  });

  it('should handle non-Latin scripts', () => {
    expect(normalize('العربية')).toBe('العربية');
    expect(normalize('中文')).toBe('中文');
    expect(normalize('日本語')).toBe('日本語');
  });

  it('should handle mixed scripts', () => {
    expect(normalize('French (français)')).toBe('french francais');
  });
});

describe('levenshteinDistance', () => {
  it('should return 0 for identical strings', () => {
    expect(levenshteinDistance('french', 'french')).toBe(0);
  });

  it('should return string length for empty vs non-empty', () => {
    expect(levenshteinDistance('', 'french')).toBe(6);
    expect(levenshteinDistance('french', '')).toBe(6);
  });

  it('should calculate single character differences', () => {
    expect(levenshteinDistance('french', 'french')).toBe(0);
    expect(levenshteinDistance('french', 'frencg')).toBe(1); // substitution
    expect(levenshteinDistance('french', 'frnch')).toBe(1); // deletion
    expect(levenshteinDistance('french', 'frenchs')).toBe(1); // insertion
  });

  it('should calculate multi-character differences', () => {
    expect(levenshteinDistance('francais', 'frans')).toBe(3);
    expect(levenshteinDistance('english', 'anglais')).toBe(4);
  });
});

describe('buildAcceptIndex', () => {
  beforeEach(() => {
    resetAcceptIndex();
  });

  it('should index canonical English names', () => {
    const index = buildAcceptIndex(CANONICAL_LANGUAGES);

    expect(index.byNormalized.get('french')).toMatchObject({ code: 'fr', canonicalEn: 'French' });
    expect(index.byNormalized.get('english')).toMatchObject({ code: 'en', canonicalEn: 'English' });
    expect(index.byNormalized.get('dutch')).toMatchObject({ code: 'nl', canonicalEn: 'Dutch' });
  });

  it('should index CLDR variants', () => {
    const index = buildAcceptIndex(CANONICAL_LANGUAGES);

    // French variants from CLDR
    expect(normalize('français')).toBe('francais');
    expect(index.byNormalized.get('francais')).toMatchObject({ code: 'fr' });

    // Dutch variants
    expect(normalize('Nederlands')).toBe('nederlands');
    expect(index.byNormalized.get('nederlands')).toMatchObject({ code: 'nl' });
  });

  it('should index manual synonyms', () => {
    const index = buildAcceptIndex(CANONICAL_LANGUAGES);

    // Persian/Farsi
    expect(index.byNormalized.get(normalize('Farsi'))).toMatchObject({ code: 'fa' });
    expect(index.byNormalized.get(normalize('Persian'))).toMatchObject({ code: 'fa' });

    // Mandarin
    expect(index.byNormalized.get(normalize('Mandarin'))).toMatchObject({ code: 'zh' });
    expect(index.byNormalized.get(normalize('Putonghua'))).toMatchObject({ code: 'zh' });
  });

  it('should build suggestion list', () => {
    const index = buildAcceptIndex(CANONICAL_LANGUAGES);

    expect(index.suggestList.length).toBeGreaterThan(0);
    expect(index.suggestList.every(s => s.canonical && s.display && s.normalized)).toBe(true);
  });

  it('should build prefix index', () => {
    const index = buildAcceptIndex(CANONICAL_LANGUAGES);

    const prefixF = index.byPrefix.get('f');
    expect(prefixF).toBeDefined();
    expect(prefixF!.length).toBeGreaterThan(0);
  });
});

describe('validateLanguage', () => {
  const index = buildAcceptIndex(CANONICAL_LANGUAGES);

  it('should validate exact canonical English names', () => {
    expect(validateLanguage('French', index)).toMatchObject({ code: 'fr', canonicalEn: 'French' });
    expect(validateLanguage('English', index)).toMatchObject({ code: 'en', canonicalEn: 'English' });
    expect(validateLanguage('Dutch', index)).toMatchObject({ code: 'nl', canonicalEn: 'Dutch' });
  });

  it('should validate case-insensitive', () => {
    expect(validateLanguage('french', index)).toMatchObject({ code: 'fr' });
    expect(validateLanguage('FRENCH', index)).toMatchObject({ code: 'fr' });
    expect(validateLanguage('FrEnCh', index)).toMatchObject({ code: 'fr' });
  });

  it('should validate variants with diacritics', () => {
    expect(validateLanguage('français', index)).toMatchObject({ code: 'fr' });
    expect(validateLanguage('español', index)).toMatchObject({ code: 'es' });
    expect(validateLanguage('Português', index)).toMatchObject({ code: 'pt' });
  });

  it('should validate synonyms', () => {
    expect(validateLanguage('Farsi', index)).toMatchObject({ code: 'fa' });
    expect(validateLanguage('Persian', index)).toMatchObject({ code: 'fa' });
    expect(validateLanguage('Mandarin', index)).toMatchObject({ code: 'zh' });
  });

  it('should reject invalid languages', () => {
    expect(validateLanguage('Klingon', index)).toBeNull();
    expect(validateLanguage('Elvish', index)).toBeNull();
    expect(validateLanguage('Gibberish', index)).toBeNull();
  });

  it('should reject near-misses', () => {
    expect(validateLanguage('Frensh', index)).toBeNull(); // typo
    expect(validateLanguage('Englsh', index)).toBeNull(); // typo
  });

  it('should handle extra whitespace', () => {
    expect(validateLanguage('  French  ', index)).toMatchObject({ code: 'fr' });
    expect(validateLanguage('French   Canadian', index)).toBeNull(); // not in canonical list
  });
});

describe('getSuggestions', () => {
  const index = buildAcceptIndex(CANONICAL_LANGUAGES);

  it('should return prefix matches', () => {
    const suggestions = getSuggestions('fre', index, 10);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some(s => s.canonical.code === 'fr')).toBe(true);
  });

  it('should return fuzzy matches for typos', () => {
    const suggestions = getSuggestions('frensh', index, 10); // typo
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some(s => s.canonical.code === 'fr')).toBe(true);
  });

  it('should limit results to maxSuggestions', () => {
    const suggestions = getSuggestions('a', index, 5);
    expect(suggestions.length).toBeLessThanOrEqual(5);
  });

  it('should return empty for empty input', () => {
    const suggestions = getSuggestions('', index);
    expect(suggestions.length).toBe(0);
  });

  it('should return empty for whitespace-only input', () => {
    const suggestions = getSuggestions('   ', index);
    expect(suggestions.length).toBe(0);
  });

  it('should suggest for non-Latin scripts', () => {
    const suggestions = getSuggestions('中', index, 10);
    expect(suggestions.length).toBeGreaterThan(0);
  });
});

describe('Integration: French variants', () => {
  const index = buildAcceptIndex(CANONICAL_LANGUAGES);

  const frenchVariants = [
    'French',
    'french',
    'FRENCH',
    'français',
    'Français',
    'francais',
    'Frans', // Dutch
    'francés', // Spanish
    'Französisch', // German
    'francese', // Italian
  ];

  frenchVariants.forEach(variant => {
    it(`should accept "${variant}" as French`, () => {
      const result = validateLanguage(variant, index);
      expect(result).not.toBeNull();
      expect(result?.code).toBe('fr');
    });
  });
});

describe('Integration: Arabic variants', () => {
  const index = buildAcceptIndex(CANONICAL_LANGUAGES);

  const arabicVariants = [
    'Arabic',
    'arabic',
    'ARABIC',
    'Arabe', // French
    'Arabisch', // German
    'árabe', // Spanish
  ];

  arabicVariants.forEach(variant => {
    it(`should accept "${variant}" as Arabic`, () => {
      const result = validateLanguage(variant, index);
      expect(result).not.toBeNull();
      expect(result?.code).toBe('ar');
    });
  });
});

describe('Integration: Chinese variants', () => {
  const index = buildAcceptIndex(CANONICAL_LANGUAGES);

  const chineseVariants = [
    'Chinese',
    'Mandarin',
    'Chinois', // French
    'Chinees', // Dutch
    'chino', // Spanish
  ];

  chineseVariants.forEach(variant => {
    it(`should accept "${variant}" as Chinese`, () => {
      const result = validateLanguage(variant, index);
      expect(result).not.toBeNull();
      expect(result?.code).toBe('zh');
    });
  });
});

describe('Integration: Dutch variants', () => {
  const index = buildAcceptIndex(CANONICAL_LANGUAGES);

  const dutchVariants = [
    'Dutch',
    'dutch',
    'Nederlands',
    'néerlandais', // French
    'holandés', // Spanish
    'Flemish', // Belgian context synonym
  ];

  dutchVariants.forEach(variant => {
    it(`should accept "${variant}" as Dutch`, () => {
      const result = validateLanguage(variant, index);
      expect(result).not.toBeNull();
      expect(result?.code).toBe('nl');
    });
  });
});

describe('Integration: Persian/Farsi variants', () => {
  const index = buildAcceptIndex(CANONICAL_LANGUAGES);

  const persianVariants = ['Persian', 'Farsi', 'persian', 'farsi', 'persan'];

  persianVariants.forEach(variant => {
    it(`should accept "${variant}" as Persian`, () => {
      const result = validateLanguage(variant, index);
      expect(result).not.toBeNull();
      expect(result?.code).toBe('fa');
    });
  });
});
