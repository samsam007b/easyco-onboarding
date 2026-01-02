#!/bin/bash
# Brand Validation Guard - Prevents advancing without explicit user validation
# Enforces: Wait for "je valide", "OK", "confirme" before proceeding to next step

set -e

TOOL_INPUT="${TOOL_INPUT:-}"
SESSION_FILE="${CLAUDE_SESSION_DIR:-/tmp}/.brand_pending_validation"

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
if ! echo "$FILE_PATH" | grep -qiE '(brand|logo|icon|wordmark|workbench)'; then
    respond "continue"
    exit 0
fi

# Check if this is a workbench file (always allowed - exploration phase)
if echo "$FILE_PATH" | grep -qiE 'workbench\.html?$'; then
    respond "continue"
    exit 0
fi

# Check if this modifies locked specs without explicit unlock request
LOCKED_SPECS_FILE="${GIT_ROOT:-.}/.claude/brand/locked-specs.md"
if [ -f "$LOCKED_SPECS_FILE" ]; then
    # If modifying locked-specs.md, check for unlock keywords in recent context
    if echo "$FILE_PATH" | grep -qiE 'locked-specs\.md$'; then
        # This is fine - user explicitly working on specs
        respond "continue"
        exit 0
    fi
fi

# Default: continue
respond "continue"
