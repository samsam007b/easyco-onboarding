/**
 * Canonical language set for EasyCo onboarding
 * Based on top ~80 languages by total speakers (2024-2025 data)
 * Sources:
 * - Unicode CLDR (language display names)
 * - Wikipedia: List of languages by total number of speakers
 * - ISO 639-1 (primary), ISO 639-3 (fallback)
 */

export type CanonicalLanguage = {
  code: string;
  iso: 'ISO639-1' | 'ISO639-2' | 'ISO639-3';
  canonicalEn: string;
};

/**
 * Top 80 languages by total speakers worldwide
 * Optimized for Brussels' cosmopolitan base
 */
export const CANONICAL_LANGUAGES: CanonicalLanguage[] = [
  // Top 20 by total speakers
  { code: 'en', iso: 'ISO639-1', canonicalEn: 'English' },
  { code: 'zh', iso: 'ISO639-1', canonicalEn: 'Chinese (Standard/Mandarin)' },
  { code: 'hi', iso: 'ISO639-1', canonicalEn: 'Hindi' },
  { code: 'es', iso: 'ISO639-1', canonicalEn: 'Spanish' },
  { code: 'fr', iso: 'ISO639-1', canonicalEn: 'French' },
  { code: 'ar', iso: 'ISO639-1', canonicalEn: 'Arabic' },
  { code: 'bn', iso: 'ISO639-1', canonicalEn: 'Bengali' },
  { code: 'pt', iso: 'ISO639-1', canonicalEn: 'Portuguese' },
  { code: 'ru', iso: 'ISO639-1', canonicalEn: 'Russian' },
  { code: 'ur', iso: 'ISO639-1', canonicalEn: 'Urdu' },
  { code: 'id', iso: 'ISO639-1', canonicalEn: 'Indonesian' },
  { code: 'de', iso: 'ISO639-1', canonicalEn: 'German' },
  { code: 'ja', iso: 'ISO639-1', canonicalEn: 'Japanese' },
  { code: 'sw', iso: 'ISO639-1', canonicalEn: 'Swahili' },
  { code: 'mr', iso: 'ISO639-1', canonicalEn: 'Marathi' },
  { code: 'te', iso: 'ISO639-1', canonicalEn: 'Telugu' },
  { code: 'tr', iso: 'ISO639-1', canonicalEn: 'Turkish' },
  { code: 'ta', iso: 'ISO639-1', canonicalEn: 'Tamil' },
  { code: 'ko', iso: 'ISO639-1', canonicalEn: 'Korean' },
  { code: 'vi', iso: 'ISO639-1', canonicalEn: 'Vietnamese' },

  // Major European & Asian languages
  { code: 'it', iso: 'ISO639-1', canonicalEn: 'Italian' },
  { code: 'fa', iso: 'ISO639-1', canonicalEn: 'Persian (Farsi)' },
  { code: 'jv', iso: 'ISO639-1', canonicalEn: 'Javanese' },
  { code: 'th', iso: 'ISO639-1', canonicalEn: 'Thai' },
  { code: 'gu', iso: 'ISO639-1', canonicalEn: 'Gujarati' },
  { code: 'pl', iso: 'ISO639-1', canonicalEn: 'Polish' },
  { code: 'uk', iso: 'ISO639-1', canonicalEn: 'Ukrainian' },
  { code: 'ml', iso: 'ISO639-1', canonicalEn: 'Malayalam' },
  { code: 'kn', iso: 'ISO639-1', canonicalEn: 'Kannada' },
  { code: 'or', iso: 'ISO639-1', canonicalEn: 'Odia' },
  { code: 'my', iso: 'ISO639-1', canonicalEn: 'Burmese' },
  { code: 'pa', iso: 'ISO639-1', canonicalEn: 'Punjabi' },
  { code: 'ro', iso: 'ISO639-1', canonicalEn: 'Romanian' },
  { code: 'nl', iso: 'ISO639-1', canonicalEn: 'Dutch' },

  // European languages (Brussels relevance)
  { code: 'el', iso: 'ISO639-1', canonicalEn: 'Greek' },
  { code: 'hu', iso: 'ISO639-1', canonicalEn: 'Hungarian' },
  { code: 'sv', iso: 'ISO639-1', canonicalEn: 'Swedish' },
  { code: 'cs', iso: 'ISO639-1', canonicalEn: 'Czech' },
  { code: 'fi', iso: 'ISO639-1', canonicalEn: 'Finnish' },
  { code: 'he', iso: 'ISO639-1', canonicalEn: 'Hebrew' },
  { code: 'sr', iso: 'ISO639-1', canonicalEn: 'Serbian' },
  { code: 'hr', iso: 'ISO639-1', canonicalEn: 'Croatian' },
  { code: 'bs', iso: 'ISO639-1', canonicalEn: 'Bosnian' },
  { code: 'bg', iso: 'ISO639-1', canonicalEn: 'Bulgarian' },
  { code: 'da', iso: 'ISO639-1', canonicalEn: 'Danish' },
  { code: 'no', iso: 'ISO639-1', canonicalEn: 'Norwegian' },
  { code: 'sk', iso: 'ISO639-1', canonicalEn: 'Slovak' },
  { code: 'sl', iso: 'ISO639-1', canonicalEn: 'Slovenian' },
  { code: 'et', iso: 'ISO639-1', canonicalEn: 'Estonian' },
  { code: 'lv', iso: 'ISO639-1', canonicalEn: 'Latvian' },
  { code: 'lt', iso: 'ISO639-1', canonicalEn: 'Lithuanian' },
  { code: 'is', iso: 'ISO639-1', canonicalEn: 'Icelandic' },
  { code: 'ga', iso: 'ISO639-1', canonicalEn: 'Irish' },
  { code: 'sq', iso: 'ISO639-1', canonicalEn: 'Albanian' },
  { code: 'mk', iso: 'ISO639-1', canonicalEn: 'Macedonian' },
  { code: 'ca', iso: 'ISO639-1', canonicalEn: 'Catalan' },
  { code: 'eu', iso: 'ISO639-1', canonicalEn: 'Basque' },
  { code: 'gl', iso: 'ISO639-1', canonicalEn: 'Galician' },

  // Southeast Asian & Pacific
  { code: 'ms', iso: 'ISO639-1', canonicalEn: 'Malay' },
  { code: 'af', iso: 'ISO639-1', canonicalEn: 'Afrikaans' },
  { code: 'km', iso: 'ISO639-1', canonicalEn: 'Khmer' },
  { code: 'lo', iso: 'ISO639-1', canonicalEn: 'Lao' },
  { code: 'fil', iso: 'ISO639-2', canonicalEn: 'Filipino' },

  // African languages
  { code: 'am', iso: 'ISO639-1', canonicalEn: 'Amharic' },
  { code: 'ha', iso: 'ISO639-1', canonicalEn: 'Hausa' },
  { code: 'yo', iso: 'ISO639-1', canonicalEn: 'Yoruba' },
  { code: 'ig', iso: 'ISO639-1', canonicalEn: 'Igbo' },
  { code: 'zu', iso: 'ISO639-1', canonicalEn: 'Zulu' },
  { code: 'xh', iso: 'ISO639-1', canonicalEn: 'Xhosa' },
  { code: 'so', iso: 'ISO639-1', canonicalEn: 'Somali' },
  { code: 'rw', iso: 'ISO639-1', canonicalEn: 'Kinyarwanda' },
  { code: 'rn', iso: 'ISO639-1', canonicalEn: 'Kirundi' },
  { code: 'ln', iso: 'ISO639-1', canonicalEn: 'Lingala' },
  { code: 'ti', iso: 'ISO639-1', canonicalEn: 'Tigrinya' },

  // Central & South Asian
  { code: 'az', iso: 'ISO639-1', canonicalEn: 'Azerbaijani' },
  { code: 'hy', iso: 'ISO639-1', canonicalEn: 'Armenian' },
  { code: 'ka', iso: 'ISO639-1', canonicalEn: 'Georgian' },
  { code: 'kk', iso: 'ISO639-1', canonicalEn: 'Kazakh' },
  { code: 'ky', iso: 'ISO639-1', canonicalEn: 'Kyrgyz' },
  { code: 'uz', iso: 'ISO639-1', canonicalEn: 'Uzbek' },
  { code: 'mn', iso: 'ISO639-1', canonicalEn: 'Mongolian' },
  { code: 'ne', iso: 'ISO639-1', canonicalEn: 'Nepali' },
  { code: 'si', iso: 'ISO639-1', canonicalEn: 'Sinhala' },
  { code: 'ps', iso: 'ISO639-1', canonicalEn: 'Pashto' },
  { code: 'ku', iso: 'ISO639-1', canonicalEn: 'Kurdish' },
  { code: 'tk', iso: 'ISO639-1', canonicalEn: 'Turkmen' },

  // Optional: Cantonese (if you want to support it separately from Mandarin)
  // { code: 'yue', iso: 'ISO639-3', canonicalEn: 'Cantonese' },
];

/**
 * Common synonyms for languages that aren't captured by CLDR
 * Key: canonical code, Value: array of additional synonyms
 */
export const LANGUAGE_SYNONYMS: Record<string, string[]> = {
  fa: ['Farsi', 'Persian'],
  zh: ['Mandarin', 'Putonghua', '普通话', '汉语', '中文', '漢語'],
  nl: ['Flemish'], // In Belgian context
  fil: ['Tagalog'],
  he: ['Ivrit'],
  el: ['Hellenic'],
  sq: ['Shqip'],
  eu: ['Euskara'],
  ka: ['Kartuli'],
  hy: ['Hayeren'],
  ar: ['العربية', 'عربي'],
  ur: ['اردو'],
  fa: ['فارسی', 'Farsi', 'Persian'],
  hi: ['हिन्दी', 'हिंदी'],
  bn: ['বাংলা'],
  pa: ['ਪੰਜਾਬੀ', 'پنجابی'],
  gu: ['ગુજરાતી'],
  ta: ['தமிழ்'],
  te: ['తెలుగు'],
  kn: ['ಕನ್ನಡ'],
  ml: ['മലയാളം'],
  si: ['සිංහල'],
  my: ['မြန်မာဘာသာ'],
  th: ['ไทย'],
  km: ['ភាសាខ្មែរ'],
  lo: ['ລາວ'],
  am: ['አማርኛ'],
  ka: ['ქართული'],
  hy: ['հայերեն'],
  he: ['עברית'],
  uk: ['українська'],
  ru: ['русский'],
  bg: ['български'],
  sr: ['српски', 'srpski'],
  mk: ['македонски'],
  el: ['ελληνικά'],
  ja: ['日本語'],
  ko: ['한국어', '조선말'],
  zh: ['中文', '汉语', '漢語', '普通话', 'Mandarin', 'Putonghua'],
  vi: ['Tiếng Việt'],
};
