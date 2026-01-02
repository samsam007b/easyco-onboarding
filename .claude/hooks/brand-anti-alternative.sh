#!/bin/bash
# Brand Anti-Alternative Hook
# Prevents proposing alternatives when locked specs exist
# Enforces: Single validated direction, no reopening closed decisions

set -e

GIT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo ".")
LOCKED_SPECS_FILE="$GIT_ROOT/.claude/brand/locked-specs.md"
TOOL_INPUT="${TOOL_INPUT:-}"

# Helper function to output JSON response
respond() {
    local status="$1"
    local message="$2"
    if [ -n "$message" ]; then
        echo "{\"status\": \"$status\", \"message\": \"$message\"}"
    else
        echo "{\"status\": \"$status\"}"
    fi
}

# Extract file path from Write/Edit tool input
FILE_PATH=$(echo "$TOOL_INPUT" | grep -oE '"file_path"\s*:\s*"[^"]*"' | sed 's/"file_path"\s*:\s*"//' | sed 's/"$//')

# Only check for brand-related files
if ! echo "$FILE_PATH" | grep -qiE '(brand|logo|icon|wordmark)'; then
    respond "continue"
    exit 0
fi

# Allow workbench files (exploration is always OK)
if echo "$FILE_PATH" | grep -qiE 'workbench\.html?$'; then
    respond "continue"
    exit 0
fi

# If no locked specs exist, alternatives are allowed
if [ ! -f "$LOCKED_SPECS_FILE" ]; then
    respond "continue"
    exit 0
fi

# Check if locked specs are actually locked (contain VERROUILLÉ or LOCKED marker)
if ! grep -qE 'VERROUILLÉ|LOCKED|Date de verrouillage' "$LOCKED_SPECS_FILE" 2>/dev/null; then
    respond "continue"
    exit 0
fi

# Extract content being written (for Write tool)
CONTENT=$(echo "$TOOL_INPUT" | sed -n 's/.*"content"\s*:\s*"\([^"]*\)".*/\1/p')

# Check for alternative-proposing patterns in the content
# These patterns indicate reopening a closed decision
ALTERNATIVE_PATTERNS=(
    "alternative"
    "autre option"
    "variante"
    "option [0-9]"
    "version [0-9]"
    "proposition [0-9]"
    "choix [0-9]"
    "possibilité"
    "on pourrait aussi"
    "une autre approche"
    "différente direction"
)

for pattern in "${ALTERNATIVE_PATTERNS[@]}"; do
    if echo "$CONTENT" | grep -qiE "$pattern"; then
        # Check if this is explicitly unlocking (user asked to reconsider)
        if echo "$CONTENT" | grep -qiE "(déverrouiller|unlock|reconsidérer|réviser les specs)"; then
            respond "continue"
            exit 0
        fi

        respond "block" "🚫 ANTI-ALTERNATIVE GUARD: Les specs sont verrouillées!

Des spécifications verrouillées existent dans:
$LOCKED_SPECS_FILE

RÈGLE: Une fois les specs verrouillées, on ne propose PAS d'alternatives.
On IMPLÉMENTE la direction validée.

ACTIONS AUTORISÉES:
✓ Créer des variations de taille/couleur/format
✓ Implémenter dans différents contextes
✓ Documenter les guidelines
✓ Exporter les assets

POUR MODIFIER LES SPECS:
L'utilisateur doit explicitement demander de 'déverrouiller' ou 'réviser les specs'

Mot-clé détecté: '$pattern'"
        exit 0
    fi
done

# Default: continue
respond "continue"
