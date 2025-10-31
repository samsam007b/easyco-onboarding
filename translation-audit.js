#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse translations file to extract all keys
function extractTranslationKeys() {
  const translationsPath = path.join(__dirname, 'lib/i18n/translations.ts');
  const content = fs.readFileSync(translationsPath, 'utf-8');

  // Extract the translations object structure
  const keys = new Set();
  const lines = content.split('\n');
  const stack = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Skip comments and empty lines
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed === '') continue;

    // Track object nesting
    const keyMatch = trimmed.match(/^(\w+):\s*{/);
    if (keyMatch) {
      stack.push(keyMatch[1]);
    }

    // Track closing braces
    if (trimmed === '},') {
      if (stack.length > 0) {
        // Build the full key path
        const fullKey = stack.join('.');
        if (fullKey && !fullKey.startsWith('translations.') && stack.length > 1) {
          keys.add(fullKey);
        }
        stack.pop();
      }
    } else if (trimmed === '},' || trimmed === '}') {
      if (stack.length > 0) {
        const fullKey = stack.join('.');
        if (fullKey && !fullKey.startsWith('translations.') && stack.length > 1) {
          keys.add(fullKey);
        }
        stack.pop();
      }
    }

    // Look for translation leaf nodes (fr:, en:, nl:, de:)
    if (trimmed.match(/^(fr|en|nl|de):\s*['"]/)) {
      const fullKey = stack.join('.');
      if (fullKey && !fullKey.startsWith('translations.')) {
        keys.add(fullKey);
      }
    }
  }

  return Array.from(keys).sort();
}

// Extract translation sections (top-level keys)
function extractTranslationSections() {
  const translationsPath = path.join(__dirname, 'lib/i18n/translations.ts');
  const content = fs.readFileSync(translationsPath, 'utf-8');

  const sections = new Set();
  const sectionRegex = /^\s{2}(\w+):\s*{/gm;
  let match;

  while ((match = sectionRegex.exec(content)) !== null) {
    sections.add(match[1]);
  }

  return Array.from(sections).sort();
}

// Find all t() calls in the codebase
function findTranslationUsage() {
  const usedKeys = new Set();

  try {
    // Use ripgrep to find all t() calls
    const result = execSync(
      `rg "\\bt\\(['\"\`]([^'\"\`]+)['\"\`]\\)" --no-filename --only-matching --replace '$1' --glob '**/*.{ts,tsx,js,jsx}' --glob '!node_modules' --glob '!.next'`,
      { encoding: 'utf-8', cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }
    );

    const lines = result.trim().split('\n');
    lines.forEach(line => {
      const key = line.trim();
      if (key) usedKeys.add(key);
    });
  } catch (error) {
    // Ignore errors (might be no matches)
  }

  return Array.from(usedKeys).sort();
}

// Find all getSection() calls
function findSectionUsage() {
  const usedSections = new Set();

  try {
    const result = execSync(
      `rg "getSection\\(['\"\`]([^'\"\`]+)['\"\`]\\)" --no-filename --only-matching --replace '$1' --glob '**/*.{ts,tsx,js,jsx}' --glob '!node_modules' --glob '!.next'`,
      { encoding: 'utf-8', cwd: __dirname, maxBuffer: 10 * 1024 * 1024 }
    );

    const lines = result.trim().split('\n');
    lines.forEach(line => {
      const section = line.trim();
      if (section) usedSections.add(section);
    });
  } catch (error) {
    // Ignore errors
  }

  return Array.from(usedSections).sort();
}

// Find file locations for specific translation key usage
function findKeyLocations(key) {
  const locations = [];

  try {
    const result = execSync(
      `rg "t\\(['\"\`]${key}['\"\`]\\)" --line-number --glob '**/*.{ts,tsx,js,jsx}' --glob '!node_modules' --glob '!.next'`,
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
    // No matches
  }

  return locations;
}

// Check for missing translations in specific languages
function checkLanguageCoverage() {
  const translationsPath = path.join(__dirname, 'lib/i18n/translations.ts');
  const content = fs.readFileSync(translationsPath, 'utf-8');

  const languages = ['fr', 'en', 'nl', 'de'];
  const missingByLanguage = { fr: [], en: [], nl: [], de: [] };

  const lines = content.split('\n');
  const keyStack = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track nesting
    const keyMatch = trimmed.match(/^(\w+):\s*{/);
    if (keyMatch && !['fr', 'en', 'nl', 'de'].includes(keyMatch[1])) {
      keyStack.push(keyMatch[1]);
    }

    // Check for language keys
    if (trimmed === '},') {
      // Check if all languages are present in this object
      const startIdx = Math.max(0, i - 10);
      const block = lines.slice(startIdx, i + 1).join('\n');

      languages.forEach(lang => {
        const hasLang = new RegExp(`${lang}:\\s*['"']`).test(block);
        if (!hasLang && keyStack.length > 0) {
          const fullKey = keyStack.join('.');
          if (fullKey && !missingByLanguage[lang].includes(fullKey)) {
            // Check if this is actually a translation object
            const hasAnyLang = languages.some(l => new RegExp(`${l}:\\s*['"']`).test(block));
            if (hasAnyLang) {
              missingByLanguage[lang].push(fullKey);
            }
          }
        }
      });

      if (keyStack.length > 0) keyStack.pop();
    }
  }

  return missingByLanguage;
}

// Main audit function
function runAudit() {
  console.log('='.repeat(80));
  console.log('TRANSLATION AUDIT REPORT');
  console.log('='.repeat(80));
  console.log('');

  // Extract data
  console.log('Extracting translation keys...');
  const definedKeys = extractTranslationKeys();

  console.log('Extracting translation sections...');
  const definedSections = extractTranslationSections();

  console.log('Finding t() usage...');
  const usedKeys = findTranslationUsage();

  console.log('Finding getSection() usage...');
  const usedSections = findSectionUsage();

  console.log('Checking language coverage...');
  const languageCoverage = checkLanguageCoverage();

  console.log('');
  console.log('='.repeat(80));
  console.log('SUMMARY STATISTICS');
  console.log('='.repeat(80));
  console.log(`Total defined translation keys: ${definedKeys.length}`);
  console.log(`Total defined sections: ${definedSections.length}`);
  console.log(`Total t() calls: ${usedKeys.length}`);
  console.log(`Unique t() keys: ${new Set(usedKeys).size}`);
  console.log(`Total getSection() calls: ${usedSections.length}`);
  console.log('');

  // Find missing translations
  const missingKeys = usedKeys.filter(key => !definedKeys.includes(key));

  console.log('='.repeat(80));
  console.log('MISSING TRANSLATIONS (keys used but not defined)');
  console.log('='.repeat(80));

  if (missingKeys.length === 0) {
    console.log('No missing translations found!');
  } else {
    console.log(`Found ${missingKeys.length} missing translation keys:\n`);

    missingKeys.forEach(key => {
      console.log(`  - ${key}`);
      const locations = findKeyLocations(key);
      locations.slice(0, 3).forEach(loc => {
        console.log(`    Used in: ${loc.file}:${loc.line}`);
      });
      if (locations.length > 3) {
        console.log(`    ... and ${locations.length - 3} more locations`);
      }
      console.log('');
    });
  }

  // Find unused translations
  const unusedKeys = definedKeys.filter(key => !usedKeys.includes(key));

  console.log('='.repeat(80));
  console.log('UNUSED TRANSLATIONS (keys defined but never used)');
  console.log('='.repeat(80));
  console.log(`Found ${unusedKeys.length} potentially unused translation keys.\n`);
  console.log('Note: Some keys may be used dynamically or in getSection() calls.\n');

  // Show sample of unused keys
  console.log('Sample of unused keys (first 50):');
  unusedKeys.slice(0, 50).forEach(key => {
    console.log(`  - ${key}`);
  });

  if (unusedKeys.length > 50) {
    console.log(`  ... and ${unusedKeys.length - 50} more`);
  }
  console.log('');

  // Check sections
  console.log('='.repeat(80));
  console.log('SECTION USAGE ANALYSIS');
  console.log('='.repeat(80));
  console.log('');
  console.log('Defined sections:', definedSections.join(', '));
  console.log('');
  console.log('Used sections:', usedSections.join(', '));
  console.log('');

  const missingSections = usedSections.filter(s => !definedSections.includes(s));
  if (missingSections.length > 0) {
    console.log('MISSING SECTIONS (used but not defined):');
    missingSections.forEach(s => console.log(`  - ${s}`));
  } else {
    console.log('All used sections are defined.');
  }
  console.log('');

  const unusedSections = definedSections.filter(s => !usedSections.includes(s));
  if (unusedSections.length > 0) {
    console.log('UNUSED SECTIONS (defined but never accessed via getSection):');
    console.log('Note: These may still be used via direct t() calls.');
    unusedSections.forEach(s => console.log(`  - ${s}`));
  }
  console.log('');

  // Language coverage
  console.log('='.repeat(80));
  console.log('LANGUAGE COVERAGE ANALYSIS');
  console.log('='.repeat(80));
  console.log('');

  Object.entries(languageCoverage).forEach(([lang, missing]) => {
    console.log(`${lang.toUpperCase()}: ${missing.length} keys may be missing translations`);
  });
  console.log('');
  console.log('Note: The language coverage check has limitations and may produce false positives.');
  console.log('Manual verification is recommended for critical translations.');
  console.log('');

  // Translation coverage percentage
  const totalUsedKeys = usedKeys.length;
  const definedUsedKeys = usedKeys.filter(key => definedKeys.includes(key)).length;
  const coverage = totalUsedKeys > 0 ? ((definedUsedKeys / totalUsedKeys) * 100).toFixed(2) : 100;

  console.log('='.repeat(80));
  console.log('COVERAGE STATISTICS');
  console.log('='.repeat(80));
  console.log(`Translation Coverage: ${coverage}% (${definedUsedKeys}/${totalUsedKeys} keys defined)`);
  console.log(`Missing Keys: ${missingKeys.length}`);
  console.log(`Unused Keys: ${unusedKeys.length} (potentially)`);
  console.log('');

  // Generate JSON report
  const report = {
    summary: {
      totalDefinedKeys: definedKeys.length,
      totalUsedKeys: usedKeys.length,
      uniqueUsedKeys: new Set(usedKeys).size,
      coverage: parseFloat(coverage),
      missingCount: missingKeys.length,
      unusedCount: unusedKeys.length,
    },
    missingKeys: missingKeys.map(key => ({
      key,
      locations: findKeyLocations(key),
    })),
    unusedKeys,
    sections: {
      defined: definedSections,
      used: usedSections,
      missing: missingSections,
      unused: unusedSections,
    },
    languageCoverage,
  };

  fs.writeFileSync(
    path.join(__dirname, 'translation-audit-report.json'),
    JSON.stringify(report, null, 2)
  );

  console.log('Full report saved to: translation-audit-report.json');
  console.log('='.repeat(80));
}

// Run the audit
runAudit();
