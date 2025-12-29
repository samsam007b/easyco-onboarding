#!/bin/bash

# Script d'analyse de performance pour Izzico Onboarding
# Usage: ./scripts/analyze-performance.sh

set -e

echo "🔍 Analyse de Performance Izzico Onboarding"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Vérifier la taille du projet
echo "📦 Taille du projet:"
echo "--------------------"
echo -n "Projet total: "
du -sh . | awk '{print $1}'
echo -n "node_modules: "
du -sh node_modules 2>/dev/null | awk '{print $1}' || echo "Non trouvé"
echo -n "Build (.next): "
du -sh .next 2>/dev/null | awk '{print $1}' || echo "Pas encore buildé"
echo ""

# 2. Compter les fichiers
echo "📄 Statistiques de fichiers:"
echo "-----------------------------"
echo -n "Fichiers TypeScript/JavaScript: "
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) ! -path "*/node_modules/*" ! -path "*/.next/*" | wc -l | xargs
echo -n "Composants React: "
find components -type f \( -name "*.tsx" -o -name "*.jsx" \) 2>/dev/null | wc -l | xargs || echo "0"
echo -n "Pages/Routes: "
find app -type f -name "page.tsx" 2>/dev/null | wc -l | xargs || echo "0"
echo ""

# 3. Analyse des imports Lucide
echo "🎨 Analyse des icônes Lucide:"
echo "------------------------------"
echo -n "Imports optimisés (direct): "
grep -r "from 'lucide-react/dist/esm/icons" --include="*.tsx" --include="*.ts" . 2>/dev/null | wc -l | xargs
echo -n "Imports non-optimisés (barrel): "
grep -r "from 'lucide-react'" --include="*.tsx" --include="*.ts" . 2>/dev/null | grep -v "/dist/esm/icons" | wc -l | xargs
echo ""

# 4. Analyse Framer Motion
echo "🎬 Analyse Framer Motion:"
echo "--------------------------"
echo -n "Imports dynamiques (optimisés): "
grep -r "import('framer-motion')" --include="*.tsx" --include="*.ts" . 2>/dev/null | wc -l | xargs
echo -n "Imports statiques: "
grep -r "from 'framer-motion'" --include="*.tsx" --include="*.ts" . 2>/dev/null | grep -v "import(" | wc -l | xargs
echo ""

# 5. Analyse React.memo
echo "⚛️  Analyse React.memo:"
echo "-----------------------"
echo -n "Composants mémoïsés: "
grep -r "= memo(" --include="*.tsx" . 2>/dev/null | wc -l | xargs
echo -n "useCallback utilisés: "
grep -r "useCallback(" --include="*.tsx" --include="*.ts" . 2>/dev/null | wc -l | xargs
echo -n "useMemo utilisés: "
grep -r "useMemo(" --include="*.tsx" --include="*.ts" . 2>/dev/null | wc -l | xargs
echo ""

# 6. Analyse des requêtes Supabase
echo "🗄️  Analyse Supabase:"
echo "--------------------"
echo -n "SELECT * (non-optimisé): "
grep -r "\.select('\*')" --include="*.tsx" --include="*.ts" . 2>/dev/null | wc -l | xargs
echo -n "SELECT sélectif (optimisé): "
grep -r "\.select('[^*]" --include="*.tsx" --include="*.ts" . 2>/dev/null | wc -l | xargs
echo ""

# 7. Analyse Dynamic Imports
echo "🔀 Analyse Dynamic Imports:"
echo "----------------------------"
echo -n "Composants chargés dynamiquement: "
grep -r "dynamic(() => import" --include="*.tsx" --include="*.ts" . 2>/dev/null | wc -l | xargs
echo ""

# 8. Vérifier la configuration
echo "⚙️  Configuration Next.js:"
echo "--------------------------"
if grep -q "compress: true" next.config.mjs 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Compression activée"
else
    echo -e "${RED}✗${NC} Compression désactivée"
fi

if grep -q "swcMinify: true" next.config.mjs 2>/dev/null; then
    echo -e "${GREEN}✓${NC} SWC minification activée"
else
    echo -e "${RED}✗${NC} SWC minification désactivée"
fi

if grep -q "optimizePackageImports" next.config.mjs 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Package optimization activée"
else
    echo -e "${YELLOW}⚠${NC} Package optimization non configurée"
fi

if grep -q "withBundleAnalyzer" next.config.mjs 2>/dev/null; then
    echo -e "${GREEN}✓${NC} Bundle analyzer configuré"
else
    echo -e "${YELLOW}⚠${NC} Bundle analyzer non configuré"
fi
echo ""

# 9. Recommandations
echo "💡 Recommandations:"
echo "-------------------"

# Compter les imports non-optimisés
non_optimized_lucide=$(grep -r "from 'lucide-react'" --include="*.tsx" --include="*.ts" . 2>/dev/null | grep -v "/dist/esm/icons" | wc -l | xargs)
if [ "$non_optimized_lucide" -gt 0 ]; then
    echo -e "${YELLOW}⚠${NC} $non_optimized_lucide imports Lucide non-optimisés détectés"
    echo "   → Utiliser: import Icon from 'lucide-react/dist/esm/icons/icon-name'"
fi

# Compter les SELECT *
select_all=$(grep -r "\.select('\*')" --include="*.tsx" --include="*.ts" . 2>/dev/null | wc -l | xargs)
if [ "$select_all" -gt 0 ]; then
    echo -e "${YELLOW}⚠${NC} $select_all requêtes Supabase avec SELECT * détectées"
    echo "   → Sélectionner uniquement les colonnes nécessaires"
fi

# Compter les imports statiques Framer Motion
static_framer=$(grep -r "from 'framer-motion'" --include="*.tsx" --include="*.ts" . 2>/dev/null | grep -v "import(" | wc -l | xargs)
if [ "$static_framer" -gt 5 ]; then
    echo -e "${YELLOW}⚠${NC} $static_framer imports statiques de Framer Motion"
    echo "   → Envisager le lazy loading pour certains composants"
fi

echo ""
echo "✅ Analyse terminée!"
echo ""
echo "Pour analyser le bundle en détail:"
echo "  → npm run analyze"
echo ""
echo "Pour mesurer les performances:"
echo "  → npm run build && npm start"
echo "  → Puis utiliser Lighthouse dans Chrome DevTools"
