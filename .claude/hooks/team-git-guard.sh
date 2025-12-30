#!/bin/bash
# Team Git Guard - Prevents unsafe git operations in multi-agent environment
# This hook enforces the team-coordination protocol

set -e

REGISTRY_FILE=".claude/team-registry.md"
TOOL_INPUT="${TOOL_INPUT:-}"

# Helper function to output JSON response
respond() {
    local status="$1"
    local message="$2"
    echo "{\"status\": \"$status\", \"message\": \"$message\"}"
}

# Check if this is a git command
if ! echo "$TOOL_INPUT" | grep -qE '^\s*git\s+'; then
    respond "continue" ""
    exit 0
fi

# Block dangerous patterns
# 1. git add . or git add -A (staging all files)
if echo "$TOOL_INPUT" | grep -qE 'git\s+add\s+(\.|--all|-A)\s*$'; then
    respond "block" "BLOCKED: 'git add .' and 'git add -A' are forbidden in team environment. Stage specific files only. Check .claude/team-registry.md for your claimed files."
    exit 0
fi

# 2. git push --force
if echo "$TOOL_INPUT" | grep -qE 'git\s+push\s+.*--force'; then
    respond "block" "BLOCKED: Force push is forbidden in team environment. Coordinate with other agents first."
    exit 0
fi

# 3. git commit without checking registry first
# This is a soft warning - we can't fully enforce but we remind
if echo "$TOOL_INPUT" | grep -qE 'git\s+commit'; then
    # Check if registry exists
    if [ ! -f "$REGISTRY_FILE" ]; then
        respond "block" "BLOCKED: Team registry not found. Create .claude/team-registry.md and register before committing."
        exit 0
    fi

    # Check if there are active agents
    ACTIVE_AGENTS=$(grep -E '^\| agent-' "$REGISTRY_FILE" 2>/dev/null | grep -v 'Completed' | wc -l || echo "0")

    if [ "$ACTIVE_AGENTS" -gt "1" ]; then
        # Multiple agents active - require confirmation
        respond "requiresApproval" "WARNING: Multiple agents detected in registry. Before committing, verify: 1) You only staged YOUR claimed files 2) No other agent's files are included 3) Your Agent ID is in the commit message. Check .claude/team-registry.md"
        exit 0
    fi
fi

# 4. git merge or rebase without warning
if echo "$TOOL_INPUT" | grep -qE 'git\s+(merge|rebase)'; then
    if [ -f "$REGISTRY_FILE" ]; then
        ACTIVE_AGENTS=$(grep -E '^\| agent-' "$REGISTRY_FILE" 2>/dev/null | grep -v 'Completed' | wc -l || echo "0")
        if [ "$ACTIVE_AGENTS" -gt "0" ]; then
            respond "requiresApproval" "WARNING: Other agents may be active. Merge/rebase could cause conflicts with their work. Check .claude/team-registry.md first."
            exit 0
        fi
    fi
fi

# 5. git stash (might lose other agents' staged changes)
if echo "$TOOL_INPUT" | grep -qE 'git\s+stash'; then
    respond "requiresApproval" "WARNING: git stash affects the entire working directory. This might include changes from other agents. Proceed with caution."
    exit 0
fi

# 6. git reset --hard
if echo "$TOOL_INPUT" | grep -qE 'git\s+reset\s+--hard'; then
    respond "block" "BLOCKED: Hard reset is forbidden in team environment. It would destroy other agents' uncommitted work."
    exit 0
fi

# 7. git clean -fd
if echo "$TOOL_INPUT" | grep -qE 'git\s+clean\s+-[fd]'; then
    respond "block" "BLOCKED: git clean is forbidden in team environment. It would delete other agents' untracked files."
    exit 0
fi

# If none of the above, continue
respond "continue" ""
