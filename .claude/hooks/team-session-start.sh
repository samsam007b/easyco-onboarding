#!/bin/bash
# Team Session Start - Reminds agents to register and follow coordination protocol

REGISTRY_FILE=".claude/team-registry.md"
SKILL_FILE=".claude/skills/team-coordination.md"

# Check if registry exists
if [ ! -f "$REGISTRY_FILE" ]; then
    echo "TeamCoordination: Registry file missing. Creating default template..."
fi

# Check for active agents
ACTIVE_COUNT=0
if [ -f "$REGISTRY_FILE" ]; then
    ACTIVE_COUNT=$(grep -cE '^\| agent-[a-z0-9]+-[0-9]+' "$REGISTRY_FILE" 2>/dev/null || echo "0")
fi

# Build context message
CONTEXT_MSG="TEAM COORDINATION ACTIVE: "

if [ "$ACTIVE_COUNT" -gt "0" ]; then
    CONTEXT_MSG+="$ACTIVE_COUNT other agent(s) may be working on this project. "
    CONTEXT_MSG+="BEFORE starting work: 1) Read .claude/team-registry.md 2) Generate your Agent ID 3) Register your task and claimed files 4) Check for file conflicts. "
    CONTEXT_MSG+="NEVER use 'git add .' - only commit YOUR claimed files."
else
    CONTEXT_MSG+="No other agents currently registered. "
    CONTEXT_MSG+="Still register yourself in .claude/team-registry.md to enable safe multi-agent collaboration."
fi

# Output as JSON for hook system
cat << EOF
{
  "status": "continue",
  "context": "$CONTEXT_MSG"
}
EOF
