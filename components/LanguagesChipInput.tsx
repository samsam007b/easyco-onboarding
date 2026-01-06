/**
 * LanguagesChipInput - Intelligent multilingual language selector
 *
 * Features:
 * - Free-text input with autocomplete
 * - Validates against CLDR whitelist (80 languages)
 * - Accepts variants in any language (e.g., "français", "Frans", "French")
 * - Shows inline validation errors with suggestions
 * - Limit: max 10 languages
 */

'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { X, Globe, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  getAcceptIndex,
  validateLanguage,
  getSuggestions,
  normalize,
  type LanguageSuggestion,
  type CanonicalLanguage,
} from '@/lib/languages/language-utils';
import { useLanguage } from '@/lib/i18n/use-language';

export type LanguageChip = {
  code: string; // ISO 639 code
  display: string; // User's typed label
  canonicalEn: string; // English canonical name
};

export type LanguagesChipInputProps = {
  value: LanguageChip[]; // Selected languages
  onChange: (languages: LanguageChip[]) => void;
  maxLanguages?: number;
  placeholder?: string;
  className?: string;
};

export function LanguagesChipInput({
  value = [],
  onChange,
  maxLanguages = 10,
  placeholder = 'Type a language (e.g., français, English, Nederlands)...',
  className = '',
}: LanguagesChipInputProps) {
  const { language, getSection } = useLanguage();
  const ariaLabels = getSection('ariaLabels');
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<LanguageSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [recentAttempt, setRecentAttempt] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const index = getAcceptIndex();

  // Update suggestions as user types
  useEffect(() => {
    if (inputValue.trim().length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      setError(null);
      return;
    }

    const newSuggestions = getSuggestions(inputValue, index, 10, ['fr', 'nl', 'en']);
    setSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);
    setSelectedSuggestionIndex(0);

    // Clear error when user starts typing again
    if (error) setError(null);
  }, [inputValue, index, error]);

  // Handle adding a language
  const handleAdd = (display: string, canonical: CanonicalLanguage) => {
    // Check if already added
    if (value.some(lang => lang.code === canonical.code)) {
      setError(`${canonical.canonicalEn} is already added`);
      return;
    }

    // Check max limit
    if (value.length >= maxLanguages) {
      setError(`Maximum ${maxLanguages} languages allowed`);
      return;
    }

    // Add chip
    const newChip: LanguageChip = {
      code: canonical.code,
      display: display.trim(),
      canonicalEn: canonical.canonicalEn,
    };

    onChange([...value, newChip]);
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    setError(null);
    setRecentAttempt(null);
  };

  // Handle Enter/Comma/Tab to add
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
      e.preventDefault();

      // If suggestions visible and one is selected, use it
      if (showSuggestions && suggestions.length > 0) {
        const selected = suggestions[selectedSuggestionIndex];
        if (selected) {
          handleAdd(selected.display, selected.canonical);
          return;
        }
      }

      // Otherwise validate input
      const trimmed = inputValue.trim();
      if (trimmed.length === 0) return;

      const canonical = validateLanguage(trimmed, index);
      if (canonical) {
        handleAdd(trimmed, canonical);
      } else {
        // Invalid - show error with suggestions
        setError(`"${trimmed}" is not in our supported list`);
        setRecentAttempt(trimmed);
        const errorSuggestions = getSuggestions(trimmed, index, 5, ['fr', 'nl', 'en']);
        setSuggestions(errorSuggestions);
        setShowSuggestions(errorSuggestions.length > 0);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedSuggestionIndex(prev => (prev + 1) % suggestions.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedSuggestionIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setError(null);
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      // Remove last chip on backspace when input is empty
      onChange(value.slice(0, -1));
    }
  };

  // Handle remove chip
  const handleRemove = (code: string) => {
    onChange(value.filter(lang => lang.code !== code));
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: LanguageSuggestion) => {
    handleAdd(suggestion.display, suggestion.canonical);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Chips display */}
      <div className="flex flex-wrap gap-2 min-h-[2rem]">
        {value.map(lang => (
          <div
            key={lang.code}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#9c5698] text-white rounded-full text-sm font-medium"
            title={`${lang.canonicalEn} (${lang.code})`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang.display}</span>
            <button
              type="button"
              onClick={() => handleRemove(lang.code)}
              className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition"
              aria-label={`Remove ${lang.display}`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder={value.length >= maxLanguages ? `Maximum ${maxLanguages} languages` : placeholder}
          disabled={value.length >= maxLanguages}
          className={error ? 'border-red-500' : ''}
          aria-label={ariaLabels?.typeLanguage?.[language] || 'Type a language'}
          aria-autocomplete="list"
          aria-controls="language-suggestions"
          aria-expanded={showSuggestions}
          aria-activedescendant={
            showSuggestions && suggestions[selectedSuggestionIndex]
              ? `suggestion-${selectedSuggestionIndex}`
              : undefined
          }
        />

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            id="language-suggestions"
            role="listbox"
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, idx) => {
              // Deduplicate by canonical code
              const isDuplicate = suggestions
                .slice(0, idx)
                .some(s => s.canonical.code === suggestion.canonical.code);
              if (isDuplicate) return null;

              return (
                <button
                  key={`${suggestion.canonical.code}-${idx}`}
                  id={`suggestion-${idx}`}
                  type="button"
                  role="option"
                  aria-selected={idx === selectedSuggestionIndex}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedSuggestionIndex(idx)}
                  className={`w-full text-left px-4 py-2.5 hover:bg-purple-50 transition flex items-center gap-3 ${
                    idx === selectedSuggestionIndex ? 'bg-purple-50' : ''
                  }`}
                >
                  <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{suggestion.display}</div>
                    <div className="text-xs text-gray-500">
                      {suggestion.canonical.canonicalEn} ({suggestion.canonical.code})
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Error message with suggestions */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert" aria-live="polite">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">{error}</p>
            {suggestions.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-red-700 mb-1.5">Did you mean:</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.slice(0, 5).map((suggestion, idx) => {
                    // Deduplicate
                    const isDuplicate = suggestions
                      .slice(0, idx)
                      .some(s => s.canonical.code === suggestion.canonical.code);
                    if (isDuplicate) return null;

                    return (
                      <button
                        key={`${suggestion.canonical.code}-${idx}`}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-red-300 rounded-full text-xs text-red-800 hover:bg-red-100 transition"
                      >
                        {suggestion.display}
                        <span className="text-red-600 font-mono">({suggestion.canonical.code})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-gray-500">
        {value.length}/{maxLanguages} languages selected. Press Enter, comma, or Tab to add.
      </p>
    </div>
  );
}
