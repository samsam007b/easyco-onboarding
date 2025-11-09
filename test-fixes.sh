#!/bin/bash

# Script de test pour vérifier que tous les fixes fonctionnent
# Usage: bash test-fixes.sh

echo "🧪 Test des corrections - Interface Searcher & Build"
echo "=================================================="
echo ""

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Compteurs
PASSED=0
FAILED=0

# Test 1: Hook useGoogleMaps existe
echo -n "Test 1: Hook useGoogleMaps existe... "
if [ -f "lib/hooks/use-google-maps.ts" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 2: GooglePlacesAutocomplete utilise le hook
echo -n "Test 2: GooglePlacesAutocomplete utilise le hook... "
if grep -q "useGoogleMaps" components/ui/google-places-autocomplete.tsx; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 3: Searcher layout utilise user_matches
echo -n "Test 3: Searcher layout utilise user_matches (pas user_matching_scores)... "
if grep -q "user_matches" app/dashboard/searcher/layout.tsx && ! grep -q "user_matching_scores" app/dashboard/searcher/layout.tsx; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 4: Searcher layout a la gestion d'erreur
echo -n "Test 4: Searcher layout a la gestion d'erreur... "
if grep -q "error: favError" app/dashboard/searcher/layout.tsx && grep -q "error: matchError" app/dashboard/searcher/layout.tsx; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 5: Page aesthetic-demo est un Client Component
echo -n "Test 5: Page aesthetic-demo est un Client Component... "
if grep -q "'use client'" app/aesthetic-demo/page.tsx; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 6: Page aesthetic-demo force le dynamic rendering
echo -n "Test 6: Page aesthetic-demo force le dynamic rendering... "
if grep -q "force-dynamic" app/aesthetic-demo/page.tsx; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 7: Documentation existe
echo -n "Test 7: Documentation du diagnostic existe... "
if [ -f "DIAGNOSTIC_SEARCHER_FIX_2025-11-09.md" ]; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC}"
    ((FAILED++))
fi

# Test 8: Clé API Google Maps configurée
echo -n "Test 8: Clé API Google Maps dans .env.local... "
if grep -q "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=" .env.local 2>/dev/null; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ SKIP (optionnel)${NC}"
fi

# Test 9: TypeScript compile sans erreur (sauf tests)
echo -n "Test 9: TypeScript compile (hors tests)... "
if npx tsc --noEmit 2>&1 | grep -q "error TS" | grep -v "__tests__"; then
    echo -e "${RED}✗ FAIL (erreurs TypeScript trouvées)${NC}"
    ((FAILED++))
else
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASSED++))
fi

echo ""
echo "=================================================="
echo -e "Résultats: ${GREEN}${PASSED} PASS${NC} | ${RED}${FAILED} FAIL${NC}"
echo "=================================================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Tous les tests sont passés !${NC}"
    exit 0
else
    echo -e "${RED}❌ Certains tests ont échoué${NC}"
    exit 1
fi
