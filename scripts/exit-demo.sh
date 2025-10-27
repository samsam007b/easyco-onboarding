#!/bin/bash

# EasyCo Exit Demo Mode Script
# Returns to main branch and restores production environment

set -e

echo "🔄 Exiting DEMO mode..."
echo ""

# Restore backed up .env.local if it exists
if [ -f .env.local.backup ]; then
  echo "📝 Restoring original .env.local..."
  mv .env.local.backup .env.local
  echo "✅ Original environment restored"
else
  echo "⚠️  No backup found. Removing demo .env.local..."
  rm -f .env.local
  echo "ℹ️  You may need to recreate your .env.local for production"
fi

# Switch back to main branch
echo ""
echo "🔀 Switching back to main branch..."
git checkout main

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   ✅ DEMO MODE EXITED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   You're now on the main branch"
echo "   Ready for production development"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
