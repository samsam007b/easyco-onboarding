#!/bin/bash
# Brand Guidelines Guard - Prevents premature guidelines creation
# Enforces: Interactive workbench BEFORE guidelines, specs must be locked

set -e

GIT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo ".")
BRAND_DIR="$GIT_ROOT/.claude/brand"
LOCKED_SPECS_FILE="$BRAND_DIR/locked-specs.md"
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

# Extract file path from Write tool input (JSON format)
FILE_PATH=$(echo "$TOOL_INPUT" | grep -oE '"file_path"\s*:\s*"[^"]*"' | sed 's/"file_path"\s*:\s*"//' | sed 's/"$//')

# If we can't extract file path, continue
if [ -z "$FILE_PATH" ]; then
    respond "continue"
    exit 0
fi

# Check if this is a brand guidelines file
if echo "$FILE_PATH" | grep -qiE '(brand.*guidelines|guidelines.*brand|logo.*guidelines|wordmark.*guidelines)\.html?$'; then

    # Check if locked specs exist
    if [ ! -f "$LOCKED_SPECS_FILE" ]; then
        respond "block" "🚫 BRAND GUARD: Cannot create guidelines without locked specs!

WORKFLOW OBLIGATOIRE:
1. Phase REFERENCES → Collecter exemples visuels
2. Phase DECOUVERTE → Proposer max 3 directions
3. Phase OUTIL INTERACTIF → Créer workbench HTML d'abord
4. Phase VALIDATION → Obtenir 'je valide' explicite
5. Phase VERROUILLAGE → Créer $LOCKED_SPECS_FILE
6. Phase GUIDELINES → Seulement après verrouillage!

ACTION: Créez d'abord un workbench interactif, puis verrouillez les specs."
        exit 0
    fi

    # Locked specs exist, check if they're complete
    if ! grep -qE 'VERROUILLÉ|LOCKED|Date de verrouillage' "$LOCKED_SPECS_FILE" 2>/dev/null; then
        respond "block" "🚫 BRAND GUARD: Specs file exists but not marked as locked!

Le fichier $LOCKED_SPECS_FILE doit contenir:
- Une section 'VERROUILLÉ' ou 'LOCKED'
- Une date de verrouillage

Complétez d'abord le verrouillage des specs."
        exit 0
    fi

    # All checks passed, continue but inform
    respond "continue"
    exit 0
fi

# Check if this is a workbench file (always allowed)
if echo "$FILE_PATH" | grep -qiE '(workbench|tuning|analysis|weight|spacing)\.html?$'; then
    respond "continue"
    exit 0
fi

# Default: continue
respond "continue"
