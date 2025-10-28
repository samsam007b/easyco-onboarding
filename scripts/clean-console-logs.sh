#!/bin/bash

# Script pour nettoyer les console.log du code
# Usage: ./scripts/clean-console-logs.sh

echo "🧹 Nettoyage des console.log..."

# Compter les occurrences avant
BEFORE=$(grep -r "console\." --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" app lib components | wc -l)
echo "📊 Console statements trouvés: $BEFORE"

# Remplacer console.log par des commentaires (pour review)
find app lib components -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i '' 's/console\.log(/\/\/ console.log(/g' {} \;

# Remplacer console.error par logger (garder les erreurs importantes)
find app lib components -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i '' 's/console\.error(/\/\/ FIXME: Use logger.error(/g' {} \;

# Remplacer console.warn par logger
find app lib components -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -exec sed -i '' 's/console\.warn(/\/\/ FIXME: Use logger.warn(/g' {} \;

# Compter les occurrences après
AFTER=$(grep -r "console\." --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" app lib components | wc -l)
echo "✅ Console statements restants: $AFTER"
echo "🎉 $((BEFORE - AFTER)) console statements nettoyés!"

echo ""
echo "⚠️  IMPORTANT: Review les changements avant de commit!"
echo "💡 Utilisez 'git diff' pour voir les modifications"
