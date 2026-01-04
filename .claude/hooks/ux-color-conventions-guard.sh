#!/bin/bash
# ============================================
# UX Color Conventions Guard
# Vérifie que les associations couleur-usage
# respectent les conventions UX internationales
# ============================================
#
# Conventions UX pour Izzico:
# - Sky (blue) → Sécurité, confiance, stabilité (banque, mot de passe)
# - Sage (green) → Succès, validation, vérification
# - Lavender (violet) → Premium, exclusivité, luxe
# - Amber (orange) → Alertes, attention, notifications
# - Dusty Rose/Blush (pink) → Social, communauté, relationnel
# - Teal (cyan) → Technique, connectivité, appareils
# - Terracotta → Personnel, profil, identité
#
# Problèmes courants détectés:
# - Rose pour sécurité (devrait être bleu)
# - Vert pour alertes (devrait être orange/ambre)
# - Orange pour succès (devrait être vert)

TOOL_INPUT="${TOOL_INPUT:-}"

# Only check CSS, TSX, JSX, and config files
if ! echo "$TOOL_INPUT" | jq -r '.file_path // .filePath // ""' 2>/dev/null | grep -qiE '\.(css|tsx|jsx|ts|js|json|html)$'; then
  echo '{"status": "continue"}'
  exit 0
fi

# Get the content being written/edited
CONTENT=$(echo "$TOOL_INPUT" | jq -r '.content // .new_string // ""' 2>/dev/null)

# If no content, continue
if [ -z "$CONTENT" ]; then
  echo '{"status": "continue"}'
  exit 0
fi

WARNINGS=""

# ============================================
# Check for problematic color-usage associations
# ============================================

# Check 1: Pink/Rose used for security contexts (should be blue)
if echo "$CONTENT" | grep -qiE '(dusty-rose|blush|pink|rose)' && echo "$CONTENT" | grep -qiE '(security|password|secure|bank|bancaire|mot.?de.?passe|sécurité|protection)'; then
  WARNINGS="$WARNINGS\n⚠️ ROSE pour SÉCURITÉ détecté - Utilisez SKY (bleu) pour les contextes de sécurité (convention UX: bleu = confiance)"
fi

# Check 2: Green used for alerts/warnings (should be amber/orange)
if echo "$CONTENT" | grep -qiE '(sage|green|vert)' && echo "$CONTENT" | grep -qiE '(alert|warning|notification|attention|danger|urgent)'; then
  WARNINGS="$WARNINGS\n⚠️ VERT pour ALERTE détecté - Utilisez AMBER (orange) pour les alertes (convention UX: orange = attention)"
fi

# Check 3: Orange/Amber used for success (should be green)
if echo "$CONTENT" | grep -qiE '(amber|orange|mustard)' && echo "$CONTENT" | grep -qiE '(success|succès|validation|verify|vérifié|approved|confirmé)'; then
  WARNINGS="$WARNINGS\n⚠️ ORANGE pour SUCCÈS détecté - Utilisez SAGE (vert) pour les confirmations (convention UX: vert = validation)"
fi

# Check 4: Blue used for social/community (should be pink/rose)
if echo "$CONTENT" | grep -qiE '(sky|blue|bleu)' && echo "$CONTENT" | grep -qiE '(social|community|communauté|invitation|friend|ami|partag)'; then
  WARNINGS="$WARNINGS\n⚠️ BLEU pour SOCIAL détecté - Utilisez DUSTY ROSE (rose) pour les contextes sociaux (convention UX: rose = relationnel)"
fi

# Check 5: Mustard color usage (deprecated - too similar to Amber)
if echo "$CONTENT" | grep -qiE 'mustard|--mustard'; then
  WARNINGS="$WARNINGS\n⚠️ MUSTARD détecté - Cette couleur a été retirée car trop proche de AMBER. Utilisez AMBER à la place."
fi

# ============================================
# Output result
# ============================================

if [ -n "$WARNINGS" ]; then
  # Format warnings for JSON
  ESCAPED_WARNINGS=$(echo -e "$WARNINGS" | sed 's/"/\\"/g' | tr '\n' ' ' | sed 's/\\n/\\n/g')

  echo "{\"status\": \"continue\", \"message\": \"📐 Conventions UX Couleurs:$ESCAPED_WARNINGS\\n\\n📖 Référence: brand-identity/izzico-color-system.html#ui\"}"
else
  echo '{"status": "continue"}'
fi
