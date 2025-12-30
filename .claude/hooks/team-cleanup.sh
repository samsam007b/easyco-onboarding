#!/bin/bash
# Team Cleanup - Removes stale claims from registry
# Run this manually or via cron to clean up abandoned claims

set -e

GIT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
REGISTRY_FILE="$GIT_ROOT/.claude/team-registry.md"
STALE_HOURS=2  # Claims inactive for this many hours are considered stale
EXPIRED_HOURS=4  # Claims older than this are auto-removed

if [ ! -f "$REGISTRY_FILE" ]; then
    echo "Registry not found at $REGISTRY_FILE"
    exit 0
fi

echo "Team Registry Cleanup"
echo "====================="
echo "Stale threshold: ${STALE_HOURS}h | Expired threshold: ${EXPIRED_HOURS}h"
echo ""

# Get current timestamp
NOW=$(date +%s)

# Function to parse ISO date to epoch
iso_to_epoch() {
    date -j -f "%Y-%m-%dT%H:%M:%S" "$1" +%s 2>/dev/null || echo "0"
}

# Read and analyze active agents
echo "Active Agents:"
echo "--------------"

STALE_AGENTS=""
EXPIRED_AGENTS=""

while IFS='|' read -r _ agent_id task started last_active claimed _; do
    # Skip header and empty lines
    if [ -z "$agent_id" ] || [[ "$agent_id" == *"Agent ID"* ]] || [[ "$agent_id" == *"none"* ]]; then
        continue
    fi

    # Clean up whitespace
    agent_id=$(echo "$agent_id" | xargs)
    last_active=$(echo "$last_active" | xargs)

    if [[ "$agent_id" =~ ^agent-[a-z0-9]+-[0-9]+$ ]]; then
        # Try to parse last_active timestamp
        if [ -n "$last_active" ] && [ "$last_active" != "-" ]; then
            LAST_EPOCH=$(iso_to_epoch "$last_active")
            if [ "$LAST_EPOCH" -gt "0" ]; then
                HOURS_AGO=$(( (NOW - LAST_EPOCH) / 3600 ))

                if [ "$HOURS_AGO" -ge "$EXPIRED_HOURS" ]; then
                    echo "  [EXPIRED] $agent_id - inactive for ${HOURS_AGO}h"
                    EXPIRED_AGENTS="$EXPIRED_AGENTS $agent_id"
                elif [ "$HOURS_AGO" -ge "$STALE_HOURS" ]; then
                    echo "  [STALE]   $agent_id - inactive for ${HOURS_AGO}h"
                    STALE_AGENTS="$STALE_AGENTS $agent_id"
                else
                    echo "  [ACTIVE]  $agent_id - active ${HOURS_AGO}h ago"
                fi
            else
                echo "  [UNKNOWN] $agent_id - could not parse timestamp"
            fi
        else
            echo "  [NO TIME] $agent_id - no last_active timestamp"
        fi
    fi
done < "$REGISTRY_FILE"

echo ""

# Report
if [ -n "$EXPIRED_AGENTS" ]; then
    echo "EXPIRED agents (should be removed):$EXPIRED_AGENTS"
    echo ""
    echo "To remove expired agents, edit $REGISTRY_FILE manually"
    echo "and move their entries to 'Completed' section or delete them."
fi

if [ -n "$STALE_AGENTS" ]; then
    echo "STALE agents (claims can be overridden):$STALE_AGENTS"
fi

if [ -z "$EXPIRED_AGENTS" ] && [ -z "$STALE_AGENTS" ]; then
    echo "All agents are active. No cleanup needed."
fi

echo ""
echo "Cleanup complete."
