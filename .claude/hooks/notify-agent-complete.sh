#!/bin/bash
# ============================================================================
# Hook de notification "Leo" - Alertes sonores et visuelles
# ============================================================================
# Déclenché après la fin d'un agent/task Claude Code
# Joue un son et affiche une notification macOS

LOG_FILE="/tmp/claude-leo-notifications.log"

# Log l'événement avec timestamp
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Leo notification triggered" >> "$LOG_FILE"
echo "  Event: ${HOOK_EVENT_NAME:-unknown}" >> "$LOG_FILE"
echo "  Tool: ${TOOL_NAME:-unknown}" >> "$LOG_FILE"
echo "---" >> "$LOG_FILE"

# Jouer le son en arrière-plan
afplay /System/Library/Sounds/Purr.aiff &

# Afficher la notification macOS
osascript -e 'display notification "Un agent vient de terminer son travail !" with title "🤖 Leo - Claude Code" sound name "Purr"'

# Retourner succès pour continuer le workflow
echo '{"ok": true}'
