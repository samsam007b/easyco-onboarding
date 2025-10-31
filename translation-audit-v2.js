#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Parse the translations.ts file to extract all valid translation keys
function parseTranslations() {
  const translationsPath = path.join(__dirname, 'lib/i18n/translations.ts');
  const content = fs.readFileSync(translationsPath, 'utf-8');

  // Find the translations object
  const translationsMatch = content.match(/export const translations = \{([\s\S]+)\n\};/);
  if (!translationsMatch) {
    console.error('Could not find translations object');
    return { keys: [], sections: [] };
  }

  const translationsContent = translationsMatch[1];
  const lines = translationsContent.split('\n');

  const allKeys = new Set();
  const sections = new Set();
  const keyStack = [];
  let currentIndent = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments, empty lines, and language codes
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed === '' || trimmed === '*/') {
      continue;
    }

    // Calculate indent level (2 spaces per level)
    const indent = line.search(/\S/);
    const indentLevel = indent >= 0 ? Math.floor(indent / 2) : 0;

    // Pop stack if we're going back in indentation
    while (keyStack.length > indentLevel - 1) {
      keyStack.pop();
    }

    // Match object key definitions
    const keyMatch = trimmed.match(/^(\w+):\s*\{/);
    if (keyMatch) {
      const key = keyMatch[1];

      // Skip language code keys (fr, en, nl, de)
      if (!['fr', 'en', 'nl', 'de'].includes(key)) {
        keyStack.push(key);

        // Top-level keys are sections
        if (indentLevel === 1) {
          sections.add(key);
        }

        // Build full key path
        const fullKey = keyStack.join('.');
        if (fullKey) {
          allKeys.add(fullKey);
        }
      }
      continue;
    }

    // Match language-specific translations (leaf nodes)
    const langMatch = trimmed.match(/^(fr|en|nl|de):\s*['"]/);
    if (langMatch) {
      // This is a translation leaf node, so current keyStack represents a valid translation key
      const fullKey = keyStack.join('.');
      if (fullKey) {
        allKeys.add(fullKey);
      }
    }
  }

  return {
    keys: Array.from(allKeys).sort(),
    sections: Array.from(sections).sort()
  };
}

// Load used keys from file
function loadUsedKeys() {
  try {
    const content = fs.readFileSync('/tmp/t-keys-clean.txt', 'utf-8');
    return content.trim().split('\n').filter(k => k).sort();
  } catch (error) {
    return [];
  }
}

// Load used sections from file
function loadUsedSections() {
  try {
    const content = fs.readFileSync('/tmp/sections-used.txt', 'utf-8');
    return content.trim().split('\n').filter(s => s).sort();
  } catch (error) {
    return [];
  }
}

// Find locations where a key is used
function findKeyLocations(key) {
  const { execSync } = require('child_process');
  const locations = [];

  try {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const result = execSync(
      `rg -n "t\\(['\"]${escapedKey}['\"]" --glob '**/*.{ts,tsx,js,jsx}' --glob '!node_modules' --glob '!.next'`,
      { encoding: 'utf-8', cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }
    );

    const lines = result.trim().split('\n');
    lines.forEach(line => {
      const match = line.match(/^([^:]+):(\d+):/);
      if (match) {
        locations.push({ file: match[1], line: parseInt(match[2]) });
      }
    });
  } catch (error) {
    // No matches or error
  }

  return locations;
}

// Check language-specific coverage
function checkLanguageCoverage() {
  const translationsPath = path.join(__dirname, 'lib/i18n/translations.ts');
  const content = fs.readFileSync(translationsPath, 'utf-8');

  const missingByLanguage = { fr: [], en: [], nl: [], de: [] };
  const languages = ['fr', 'en', 'nl', 'de'];

  // Find all translation objects (those with language keys)
  const lines = content.split('\n');
  const keyStack = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const indent = line.search(/\S/);
    const indentLevel = indent >= 0 ? Math.floor(indent / 2) : 0;

    // Pop stack based on indent
    while (keyStack.length > indentLevel - 1) {
      keyStack.pop();
    }

    // Track keys
    const keyMatch = trimmed.match(/^(\w+):\s*\{/);
    if (keyMatch && !languages.includes(keyMatch[1])) {
      keyStack.push(keyMatch[1]);
    }

    // Check for language keys
    const langMatch = trimmed.match(/^(fr|en|nl|de):\s*['"]/);
    if (langMatch) {
      const currentKey = keyStack.join('.');

      // Look ahead and back to see which languages are present
      const blockStart = Math.max(0, i - 5);
      const blockEnd = Math.min(lines.length, i + 5);
      const block = lines.slice(blockStart, blockEnd).join('\n');

      languages.forEach(lang => {
        const hasLang = new RegExp(`^\\s*${lang}:\\s*['"]`, 'm').test(block);
        if (!hasLang && currentKey && !missingByLanguage[lang].includes(currentKey)) {
          missingByLanguage[lang].push(currentKey);
        }
      });
    }
  }

  return missingByLanguage;
}

// Main audit
function runAudit() {
  console.log('=' .repeat(80));
  console.log('COMPREHENSIVE TRANSLATION AUDIT REPORT');
  console.log('=' .repeat(80));
  console.log('');

  // Parse translations
  console.log('Parsing translations file...');
  const { keys: definedKeys, sections: definedSections } = parseTranslations();

  console.log('Loading used keys...');
  const usedKeys = loadUsedKeys();

  console.log('Loading used sections...');
  const usedSections = loadUsedSections();

  console.log('Checking language coverage...');
  const languageCoverage = checkLanguageCoverage();

  console.log('');
  console.log('=' .repeat(80));
  console.log('SUMMARY STATISTICS');
  console.log('=' .repeat(80));
  console.log(`Total defined translation keys: ${definedKeys.length}`);
  console.log(`Total defined sections: ${definedSections.length}`);
  console.log(`Total unique t() calls: ${usedKeys.length}`);
  console.log(`Total sections used via getSection(): ${usedSections.length}`);
  console.log('');

  // Find missing translations
  const missingKeys = usedKeys.filter(key => !definedKeys.includes(key));

  console.log('=' .repeat(80));
  console.log('MISSING TRANSLATIONS (keys used in code but NOT defined)');
  console.log('=' .repeat(80));
  console.log('');

  if (missingKeys.length === 0) {
    console.log('✓ No missing translations found! All t() calls reference defined keys.');
  } else {
    console.log(`✗ Found ${missingKeys.length} missing translation keys:\n`);

    missingKeys.forEach((key, index) => {
      console.log(`${index + 1}. ${key}`);
      const locations = findKeyLocations(key);
      locations.slice(0, 3).forEach(loc => {
        console.log(`   └─ ${loc.file}:${loc.line}`);
      });
      if (locations.length > 3) {
        console.log(`   └─ ... and ${locations.length - 3} more locations`);
      }
      console.log('');
    });
  }

  // Find unused translations
  const unusedKeys = definedKeys.filter(key => !usedKeys.includes(key));

  // Filter out parent keys that might be accessed via getSection
  const likelyUnused = unusedKeys.filter(key => {
    const parts = key.split('.');
    // If it's a top-level section that's used via getSection, it's not unused
    if (parts.length === 1 && usedSections.includes(key)) {
      return false;
    }
    // If its parent section is used via getSection, it might be accessed dynamically
    if (usedSections.includes(parts[0])) {
      // These might be used via getSection, so they're less likely to be truly unused
      return true; // Still include them but we'll note this
    }
    return true;
  });

  console.log('=' .repeat(80));
  console.log('UNUSED TRANSLATIONS (keys defined but never used)');
  console.log('=' .repeat(80));
  console.log('');
  console.log(`Found ${unusedKeys.length} potentially unused translation keys.`);
  console.log(`Note: ${unusedKeys.length - likelyUnused.length} of these are in sections accessed via getSection() and may be used dynamically.\n`);

  if (unusedKeys.length > 0) {
    console.log('Sample of potentially unused keys (first 30):');
    unusedKeys.slice(0, 30).forEach((key, index) => {
      const section = key.split('.')[0];
      const inUsedSection = usedSections.includes(section);
      const marker = inUsedSection ? '⚠' : '✗';
      console.log(`${marker} ${key}${inUsedSection ? ' (section accessed via getSection)' : ''}`);
    });

    if (unusedKeys.length > 30) {
      console.log(`... and ${unusedKeys.length - 30} more`);
    }
  }
  console.log('');

  // Section analysis
  console.log('=' .repeat(80));
  console.log('SECTION USAGE ANALYSIS');
  console.log('=' .repeat(80));
  console.log('');

  console.log('Defined sections:');
  definedSections.forEach(s => console.log(`  - ${s}`));
  console.log('');

  console.log('Sections used via getSection():');
  usedSections.forEach(s => console.log(`  - ${s}`));
  console.log('');

  const missingSections = usedSections.filter(s => !definedSections.includes(s));
  if (missingSections.length > 0) {
    console.log('✗ MISSING SECTIONS (referenced but not defined):');
    missingSections.forEach(s => console.log(`  - ${s}`));
  } else {
    console.log('✓ All referenced sections are properly defined.');
  }
  console.log('');

  const unusedSections = definedSections.filter(s => !usedSections.includes(s));
  if (unusedSections.length > 0) {
    console.log('UNUSED SECTIONS (defined but never accessed via getSection):');
    console.log('Note: Keys in these sections may still be used via direct t() calls.');
    unusedSections.forEach(s => console.log(`  - ${s}`));
  }
  console.log('');

  // Language coverage
  console.log('=' .repeat(80));
  console.log('LANGUAGE COVERAGE ANALYSIS');
  console.log('=' .repeat(80));
  console.log('');

  let totalMissing = 0;
  Object.entries(languageCoverage).forEach(([lang, missing]) => {
    const filtered = missing.filter(k => usedKeys.includes(k));
    totalMissing += filtered.length;
    console.log(`${lang.toUpperCase()}: ${filtered.length} keys missing translations (of ${usedKeys.length} used keys)`);

    if (filtered.length > 0 && filtered.length <= 10) {
      filtered.forEach(k => console.log(`  - ${k}`));
    } else if (filtered.length > 10) {
      filtered.slice(0, 10).forEach(k => console.log(`  - ${k}`));
      console.log(`  ... and ${filtered.length - 10} more`);
    }
    console.log('');
  });

  // Coverage statistics
  console.log('=' .repeat(80));
  console.log('COVERAGE STATISTICS');
  console.log('=' .repeat(80));
  console.log('');

  const totalUsed = usedKeys.length;
  const totalDefined = usedKeys.filter(k => definedKeys.includes(k)).length;
  const coverage = totalUsed > 0 ? ((totalDefined / totalUsed) * 100).toFixed(2) : 100;

  console.log(`Translation Key Coverage: ${coverage}% (${totalDefined}/${totalUsed} used keys are defined)`);
  console.log(`Missing Keys: ${missingKeys.length}`);
  console.log(`Potentially Unused Keys: ${unusedKeys.length}`);
  console.log(`Language Coverage Issues: ${totalMissing} missing translations across all languages`);
  console.log('');

  // Generate JSON report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalDefinedKeys: definedKeys.length,
      totalUsedKeys: usedKeys.length,
      coverage: parseFloat(coverage),
      missingKeys: missingKeys.length,
      unusedKeys: unusedKeys.length,
      languageCoverageIssues: totalMissing,
    },
    missingKeys: missingKeys.map(key => ({
      key,
      locations: findKeyLocations(key),
    })),
    unusedKeys: unusedKeys.map(key => ({
      key,
      inUsedSection: usedSections.includes(key.split('.')[0]),
    })),
    sections: {
      defined: definedSections,
      used: usedSections,
      missing: missingSections,
      unused: unusedSections,
    },
    languageCoverage: Object.fromEntries(
      Object.entries(languageCoverage).map(([lang, keys]) => [
        lang,
        keys.filter(k => usedKeys.includes(k))
      ])
    ),
    allDefinedKeys: definedKeys,
    allUsedKeys: usedKeys,
  };

  const reportPath = path.join(__dirname, 'translation-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('=' .repeat(80));
  console.log(`Full detailed report saved to: ${reportPath}`);
  console.log('=' .repeat(80));
}

// Run the audit
runAudit();
