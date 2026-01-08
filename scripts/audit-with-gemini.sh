#!/bin/bash
# audit-with-gemini.sh - Audit complet Izzico avec Gemini 2.0 Flash
# Usage: ./scripts/audit-with-gemini.sh

set -e

# Vérification de la clé API
if [ -z "$GEMINI_API_KEY" ]; then
  echo "❌ ERREUR: GEMINI_API_KEY non définie"
  echo ""
  echo "Solutions:"
  echo "  1. Ajoute dans .env.local: GEMINI_API_KEY=ta-cle"
  echo "  2. Exporte temporairement: export GEMINI_API_KEY='ta-cle'"
  echo "  3. Ajoute dans ~/.zshrc: export GEMINI_API_KEY='ta-cle'"
  exit 1
fi

# Couleurs pour le terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction helper pour appeler Gemini
ask_gemini() {
  local prompt="$1"
  curl -s -X POST \
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=$GEMINI_API_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"contents\":[{\"parts\":[{\"text\":\"$(echo "$prompt" | sed 's/"/\\"/g' | tr '\n' ' ')\"}]}]}" \
    | jq -r '.candidates[0].content.parts[0].text // "Erreur: pas de réponse"'
}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔍 AUDIT IZZICO - Gemini 2.0 Flash${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 1. Audit du système de couleurs
echo -e "${YELLOW}📊 1. Vérification du système de couleurs...${NC}"
COLORS=$(grep -rh "className=" app/ components/ --include="*.tsx" 2>/dev/null | \
  grep -Eo "(bg|text|border|from|to|via)-(amber|yellow|orange|searcher|owner|resident)-[0-9]{2,3}" | \
  sort | uniq -c | sort -rn | head -30)

if [ -n "$COLORS" ]; then
  AUDIT_COLORS=$(ask_gemini "Analyse ces classes Tailwind CSS d'un projet Next.js nommé Izzico (plateforme de co-living).

CLASSES DÉTECTÉES:
$COLORS

RÈGLES DU SYSTÈME DE COULEURS IZZICO:
- Searcher (chercheurs de logement): classes 'searcher-*' basées sur #ffa000 (gold/yellow)
- Owner (propriétaires): classes 'owner-*' basées sur #9c5698 (mauve/purple)
- Resident (résidents): classes 'resident-*' basées sur #e05747 (orange/coral)

CLASSES INTERDITES (legacy, supprimées):
- ❌ amber-* (sauf cas UI génériques)
- ❌ yellow-* (remplacé par searcher-*)
- ❌ orange-* (remplacé par resident-*)

TÂCHE:
1. Identifie les violations (usage de amber/yellow/orange dans un contexte rôle)
2. Propose les corrections (ex: 'bg-yellow-500' → 'bg-searcher-500')
3. Note les usages légitimes (ex: 'bg-amber-100' pour un badge UI neutre)

Sois concis et liste uniquement les problèmes.")

  echo "$AUDIT_COLORS"
else
  echo "  ✓ Aucune classe de couleur détectée"
fi
echo ""

# 2. Audit Voice Guidelines
echo -e "${YELLOW}✍️  2. Vérification des Voice Guidelines...${NC}"
COPY=$(grep -rh "placeholder=\|aria-label=\|title=\|<h[1-6]" app/ components/ --include="*.tsx" 2>/dev/null | \
  head -20)

if [ -n "$COPY" ]; then
  AUDIT_VOICE=$(ask_gemini "Analyse ces textes UI d'Izzico (plateforme de co-living en français).

EXTRAITS:
$COPY

RÈGLES VOICE GUIDELINES:
1. ❌ INTERDIT: Emojis (🏠, 👍, etc.) → utiliser icônes Lucide React
2. ❌ INTERDIT: 'coloc', 'colocation' → utiliser 'co-living'
3. ✅ OBLIGATOIRE: Tutoiement (Tu/ton/ta) sauf pages légales
4. ✅ TERMINOLOGIE: 'Living Persona' (pas 'profil'), 'Living Match' (pas 'match')
5. ❌ INTERDIT: Corporate speak (synergy, leverage, seamless, etc.)

TÂCHE:
Liste uniquement les violations avec corrections suggérées.
Format: '❌ [texte actuel] → ✅ [correction]'")

  echo "$AUDIT_VOICE"
else
  echo "  ✓ Aucun texte UI détecté"
fi
echo ""

# 3. Audit Fonts
echo -e "${YELLOW}🔤 3. Vérification de la configuration des fonts...${NC}"
if [ -f "app/layout.tsx" ]; then
  LAYOUT_CONTENT=$(cat app/layout.tsx)

  AUDIT_FONTS=$(ask_gemini "Analyse cette configuration de fonts Next.js:

$LAYOUT_CONTENT

RÈGLES IZZICO:
1. Fonts utilisées: Inter (body), Nunito (headings), Fredoka (brand 'Izzico')
2. CRITIQUE: Les classes 'next/font' (.variable) doivent être sur <html>, PAS sur <body>
   Raison: Tailwind preflight applique font-family sur html → variables doivent être définies là
3. Configuration attendue:
   - <html className={\`\${inter.variable} \${nunito.variable} \${fredoka.variable}\`}>
   - tailwind.config.ts: fontFamily avec var(--font-inter), etc.

TÂCHE:
1. Vérifie si les classes .variable sont sur <html> ou <body>
2. Détecte tout problème de configuration
3. Confirme si c'est correct ou liste les fixes nécessaires")

  echo "$AUDIT_FONTS"
else
  echo "  ⚠️  app/layout.tsx non trouvé"
fi
echo ""

# 4. Review derniers commits
echo -e "${YELLOW}📝 4. Review des 5 derniers commits...${NC}"
if git rev-parse --git-dir > /dev/null 2>&1; then
  COMMITS=$(git log --oneline -5 --pretty=format:"%h | %s | %an" 2>/dev/null)

  AUDIT_COMMITS=$(ask_gemini "Review ces 5 derniers commits d'un projet Next.js 14 + Supabase + TypeScript:

$COMMITS

FOCUS:
1. Sécurité: XSS, injection SQL, secrets exposés, RLS bypass
2. Performance: N+1 queries, bundle size, re-renders inutiles
3. Best practices Next.js 14: Server Components, cache, metadata
4. TypeScript: any abusifs, types manquants
5. Supabase: policies RLS, edge functions

TÂCHE:
Note chaque commit de 1-10 et liste les red flags potentiels.
Format concis: '[hash] Note/10 - [commentaire]'")

  echo "$AUDIT_COMMITS"
else
  echo "  ⚠️  Pas un dépôt Git"
fi
echo ""

# 5. Détection de secrets exposés
echo -e "${YELLOW}🔐 5. Scan de secrets exposés...${NC}"
SECRETS=$(grep -rh "API_KEY\|SECRET\|PASSWORD\|TOKEN" --include="*.ts" --include="*.tsx" --include="*.js" \
  --exclude-dir=node_modules --exclude-dir=.next 2>/dev/null | \
  grep -v "process.env" | grep -v "// " | head -10)

if [ -n "$SECRETS" ]; then
  echo -e "${RED}  ⚠️  Détection de potentiels secrets en dur:${NC}"
  echo "$SECRETS"
  echo ""
  echo "  ${RED}→ Vérifie que ce ne sont pas de vraies clés API !${NC}"
else
  echo "  ✓ Aucun secret détecté en dur (bon signe)"
fi
echo ""

# Résumé final
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Audit terminé !${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "💡 Pour sauvegarder ce rapport:"
echo "   ./scripts/audit-with-gemini.sh > audit-report-$(date +%Y%m%d).txt"
