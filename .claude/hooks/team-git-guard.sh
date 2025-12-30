#!/bin/bash
# Team Git Guard v2 - Enhanced protection with dynamic claim verification
# Prevents unsafe git operations in multi-agent environment

set -e

# Use relative path from git root
GIT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo ".")
REGISTRY_FILE="$GIT_ROOT/.claude/team-registry.md"
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

# Check if this is a git command
if ! echo "$TOOL_INPUT" | grep -qE '^\s*git\s+'; then
    respond "continue"
    exit 0
fi

# ============================================================================
# HARD BLOCKS - These are always dangerous
# ============================================================================

# 1. git add . or git add -A (staging all files)
if echo "$TOOL_INPUT" | grep -qE 'git\s+add\s+(\.|--all|-A)\s*$'; then
    respond "block" "TEAM GUARD: 'git add .' forbidden. Stage specific files: git add path/to/your/file.ts. Check .claude/team-registry.md for your claimed files."
    exit 0
fi

# 2. git push --force
if echo "$TOOL_INPUT" | grep -qE 'git\s+push\s+.*--force'; then
    respond "block" "TEAM GUARD: Force push forbidden. Could destroy other agents' work."
    exit 0
fi

# 3. git reset --hard
if echo "$TOOL_INPUT" | grep -qE 'git\s+reset\s+--hard'; then
    respond "block" "TEAM GUARD: Hard reset forbidden. Would destroy uncommitted work from all agents."
    exit 0
fi

# 4. git clean -fd
if echo "$TOOL_INPUT" | grep -qE 'git\s+clean\s+-[fd]'; then
    respond "block" "TEAM GUARD: git clean forbidden. Would delete other agents' untracked files."
    exit 0
fi

# ============================================================================
# SMART CHECKS - Verify against registry
# ============================================================================

# Function to extract claimed files from registry for a pattern
get_all_claimed_files() {
    if [ ! -f "$REGISTRY_FILE" ]; then
        echo ""
        return
    fi
    # Extract all claimed files from Active Agents section
    # Look for lines starting with | agent- and extract the last column
    grep -E '^\| agent-[a-z0-9]+-[0-9]+' "$REGISTRY_FILE" 2>/dev/null | \
        awk -F'|' '{print $NF}' | \
        tr ',' '\n' | \
        sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | \
        grep -v '^$' | \
        grep -v '^\*' || echo ""
}

# Function to check if a file is claimed by another agent
is_file_claimed() {
    local file="$1"
    local claimed_files=$(get_all_claimed_files)

    if [ -z "$claimed_files" ]; then
        return 1  # No claimed files
    fi

    # Check if file matches any claimed pattern
    echo "$claimed_files" | while read -r pattern; do
        if [ -n "$pattern" ] && [[ "$file" == *"$pattern"* ]]; then
            return 0  # File is claimed
        fi
    done
    return 1
}

# Check for git add with specific files
if echo "$TOOL_INPUT" | grep -qE 'git\s+add\s+[^-]'; then
    # Extract the file paths from the command
    FILES=$(echo "$TOOL_INPUT" | sed 's/git\s*add\s*//' | tr ' ' '\n' | grep -v '^-')

    CLAIMED_FILES=$(get_all_claimed_files)
    if [ -n "$CLAIMED_FILES" ]; then
        WARNINGS=""
        for file in $FILES; do
            # Check if this file appears in claimed files (partial match for directories)
            if echo "$CLAIMED_FILES" | grep -qF "$file" 2>/dev/null; then
                WARNINGS="$WARNINGS $file"
            fi
        done

        if [ -n "$WARNINGS" ]; then
            respond "requiresApproval" "TEAM GUARD: These files may be claimed by other agents:$WARNINGS. Check .claude/team-registry.md before staging."
            exit 0
        fi
    fi
fi

# Check for git commit
if echo "$TOOL_INPUT" | grep -qE 'git\s+commit'; then
    if [ ! -f "$REGISTRY_FILE" ]; then
        respond "requiresApproval" "TEAM GUARD: No registry found. Create .claude/team-registry.md and register before committing."
        exit 0
    fi

    # Count active agents (excluding header and empty rows)
    ACTIVE_AGENTS=$(grep -cE '^\| agent-[a-z0-9]+-[0-9]+' "$REGISTRY_FILE" 2>/dev/null || echo "0")

    # Check for stale claims (last active > 2 hours ago)
    STALE_WARNING=""
    if [ "$ACTIVE_AGENTS" -gt "0" ]; then
        # This is a simplified check - in production you'd parse timestamps
        STALE_WARNING=" Some claims may be stale - check Last Active timestamps."
    fi

    if [ "$ACTIVE_AGENTS" -gt "0" ]; then
        respond "requiresApproval" "TEAM GUARD: $ACTIVE_AGENTS active agent(s) in registry.$STALE_WARNING Verify: 1) Only YOUR claimed files are staged 2) Your Agent ID is in commit message 3) Check 'git diff --cached' first."
        exit 0
    fi
fi

# Check for git merge or rebase
if echo "$TOOL_INPUT" | grep -qE 'git\s+(merge|rebase)'; then
    if [ -f "$REGISTRY_FILE" ]; then
        ACTIVE_AGENTS=$(grep -cE '^\| agent-[a-z0-9]+-[0-9]+' "$REGISTRY_FILE" 2>/dev/null || echo "0")
        if [ "$ACTIVE_AGENTS" -gt "0" ]; then
            respond "requiresApproval" "TEAM GUARD: $ACTIVE_AGENTS active agent(s). Merge/rebase may conflict with their uncommitted work. Coordinate first."
            exit 0
        fi
    fi
fi

# Check for git stash
if echo "$TOOL_INPUT" | grep -qE 'git\s+stash'; then
    respond "requiresApproval" "TEAM GUARD: Stash affects entire working directory. May include other agents' changes."
    exit 0
fi

# Check for git checkout/restore of files (could overwrite others' work)
if echo "$TOOL_INPUT" | grep -qE 'git\s+(checkout|restore)\s+--\s+'; then
    respond "requiresApproval" "TEAM GUARD: File restore will discard changes. Ensure these are YOUR files only."
    exit 0
fi

# If none of the above, continue
respond "continue"
